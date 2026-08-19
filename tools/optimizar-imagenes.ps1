# Optimiza las imagenes de assets\ para que el sitio cargue en celulares.
#
# Que hace:
#   1. Reescala cualquier imagen cuyo lado mayor supere -MaxLado (por defecto 1600 px).
#   2. Recomprime a JPEG con calidad -Calidad (por defecto 82).
#   3. Convierte a .jpg los PNG que son fotos opacas (no tienen transparencia).
#      Los PNG con canal alfa real se dejan como estan.
#
# Los originales quedan versionados en git, asi que se recuperan con
#   git checkout -- assets
#
# Uso:
#   & "D:\nucle-ar\tools\optimizar-imagenes.ps1"            # aplica los cambios
#   & "D:\nucle-ar\tools\optimizar-imagenes.ps1" -DryRun    # solo informa

[CmdletBinding()]
param(
  [string]$Raiz = (Split-Path -Parent $PSScriptRoot),
  [int]$MaxLado = 1600,
  [int]$Calidad = 82,
  [switch]$DryRun
)

Add-Type -AssemblyName System.Drawing

# Imagenes que necesitan otro criterio que el general.
# ecuacion.png es un recorte de diario de 1935: es texto chico que el lector
# tiene que poder leer, asi que no se reescala y se comprime con mas calidad.
$Overrides = @{
  'ecuacion.png' = @{ MaxLado = 4000; Calidad = 92 }
}

$codecJpeg = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
  Where-Object { $_.MimeType -eq 'image/jpeg' }

function New-ParamsCalidad {
  param([int]$Q)
  $p = New-Object System.Drawing.Imaging.EncoderParameters 1
  $p.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
    [System.Drawing.Imaging.Encoder]::Quality, [long]$Q)
  return $p
}

function Test-TieneAlfa {
  param([System.Drawing.Bitmap]$Bmp)
  if (-not [System.Drawing.Image]::IsAlphaPixelFormat($Bmp.PixelFormat)) { return $false }
  $sx = [math]::Max(1, [int]($Bmp.Width / 80))
  $sy = [math]::Max(1, [int]($Bmp.Height / 80))
  for ($x = 0; $x -lt $Bmp.Width; $x += $sx) {
    for ($y = 0; $y -lt $Bmp.Height; $y += $sy) {
      if ($Bmp.GetPixel($x, $y).A -lt 250) { return $true }
    }
  }
  return $false
}

$assets = Join-Path $Raiz 'assets'
if (-not (Test-Path $assets)) { throw "No existe $assets" }

$antes = 0; $despues = 0; $renombres = @()

Get-ChildItem -Path $assets -Recurse -Include *.png, *.jpg, *.jpeg -File | ForEach-Object {
  $origen  = $_.FullName
  $pesoOrg = $_.Length
  $antes  += $pesoOrg

  $bmp = [System.Drawing.Bitmap]::FromFile($origen)
  try {
    $esPng   = $_.Extension -ieq '.png'
    $conAlfa = if ($esPng) { Test-TieneAlfa -Bmp $bmp } else { $false }

    if ($conAlfa) {
      Write-Host ("  = {0}  (PNG con transparencia, se conserva)" -f $_.Name)
      $despues += $pesoOrg
      return
    }

    $ov      = $Overrides[$_.Name]
    $maxEste = if ($ov) { $ov.MaxLado } else { $MaxLado }
    $qEste   = if ($ov) { $ov.Calidad } else { $Calidad }
    $params  = New-ParamsCalidad -Q $qEste

    $escala = [math]::Min(1.0, $maxEste / [math]::Max($bmp.Width, $bmp.Height))
    $ancho  = [math]::Max(1, [int][math]::Round($bmp.Width  * $escala))
    $alto   = [math]::Max(1, [int][math]::Round($bmp.Height * $escala))

    $destino = if ($esPng) { [IO.Path]::ChangeExtension($origen, '.jpg') } else { $origen }
    $tmp     = "$destino.tmp"

    # Fondo blanco -> JPEG no soporta alfa; estas imagenes ya son opacas.
    $lienzo = New-Object System.Drawing.Bitmap($ancho, $alto, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
    $g = [System.Drawing.Graphics]::FromImage($lienzo)
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.InterpolationMode  = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode      = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode    = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.Clear([System.Drawing.Color]::Black)
    $g.DrawImage($bmp, (New-Object System.Drawing.Rectangle 0, 0, $ancho, $alto))
    $g.Dispose()
    $lienzo.Save($tmp, $codecJpeg, $params)
    $lienzo.Dispose()

    $pesoNvo = (Get-Item $tmp).Length

    # Si no hay ganancia y no hace falta convertir ni reescalar, se descarta.
    if (-not $esPng -and $escala -eq 1.0 -and $pesoNvo -ge $pesoOrg) {
      Remove-Item $tmp -Force
      Write-Host ("  = {0}  (ya optimizada)" -f $_.Name)
      $despues += $pesoOrg
      return
    }

    $rel = $origen.Substring($Raiz.Length).TrimStart('\')
    Write-Host ("  -> {0}  {1}x{2} {3} KB  =>  {4}x{5} {6} KB  ({7}%)" -f `
      $rel, $bmp.Width, $bmp.Height, [math]::Round($pesoOrg / 1KB), `
      $ancho, $alto, [math]::Round($pesoNvo / 1KB), `
      [math]::Round(100 - ($pesoNvo / $pesoOrg * 100)))

    $despues += $pesoNvo

    if ($esPng) {
      $renombres += [PSCustomObject]@{
        Viejo = [IO.Path]::GetFileName($origen)
        Nuevo = [IO.Path]::GetFileName($destino)
      }
    }

    if ($DryRun) { Remove-Item $tmp -Force }
    else {
      $bmp.Dispose()
      Move-Item -Path $tmp -Destination $destino -Force
      if ($esPng) { Remove-Item $origen -Force }
    }
  }
  finally { $bmp.Dispose() }
}

Write-Host ''
Write-Host ("Total assets: {0} MB  =>  {1} MB  ({2}% menos)" -f `
  [math]::Round($antes / 1MB, 1), [math]::Round($despues / 1MB, 1), `
  [math]::Round(100 - ($despues / $antes * 100)))

if ($renombres.Count) {
  Write-Host ''
  Write-Host 'PNG convertidos a JPG (hay que actualizar las referencias en el HTML):'
  $renombres | ForEach-Object { Write-Host ("  {0}  ->  {1}" -f $_.Viejo, $_.Nuevo) }
}
