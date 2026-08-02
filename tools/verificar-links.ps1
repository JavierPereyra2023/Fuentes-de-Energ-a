<#
.SYNOPSIS
  Verificador de enlaces y anchors para el sitio Nucle-ar.

.DESCRIPTION
  Recorre todos los .html del proyecto y reporta:
  1. href/src locales rotos (no existen).
  2. anchors #ancla sin id destino (en el mismo archivo o en el archivo destino).
  3. patron de secciones: cada <section class="reveal" id="sec0X"> debe abrir con
     el wrapper flex <div class="flex items-center gap-4 mb-6"> (bug conocido de
     footer deformado cuando se omite el wrapper).
  4. contenido vacio de meta description / og en el <head>.

  Ignora enlaces externos (http, https, mailto, tel, data, javascript) y # sueltos.

.EXAMPLE
  .\tools\verificar-links.ps1
#>
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot

$files = Get-ChildItem "$root" -Filter *.html -Recurse
$issues = New-Object System.Collections.Generic.List[object]

$extRe = '^(https?:|mailto:|tel:|data:|javascript:|file:)'
$utf8 = New-Object System.Text.UTF8Encoding($false)

foreach ($f in $files) {
  $rel = $f.FullName.Substring($root.Length + 1)
  $content = [System.IO.File]::ReadAllText($f.FullName, $utf8)
  $dir = $f.DirectoryName

  # --- ids del archivo actual ---
  $idSet = New-Object 'System.Collections.Generic.HashSet[string]'
  foreach ($mm in [regex]::Matches($content, 'id="([^"]+)"')) { [void]$idSet.Add($mm.Groups[1].Value) }

  # --- hrefs ---
  foreach ($mm in [regex]::Matches($content, 'href="([^"]+)"')) {
    $href = $mm.Groups[1].Value
    if ($href -match $extRe) { continue }
    if ($href -eq '#') { continue }
    if ($href.StartsWith('#')) {
      $id = $href.Substring(1)
      if (-not $idSet.Contains($id)) {
        $issues.Add([PSCustomObject]@{ Archivo = $rel; Tipo = 'anchor sin id'; Ref = $href; Linea = LineOf($content, $mm.Index) })
      }
      continue
    }
    $parts = $href.Split('#', 2)
    $path = $parts[0]; $id = if ($parts.Length -gt 1) { $parts[1] } else { '' }
    $target = if ([System.IO.Path]::IsPathRooted($path)) { $path } else { [System.IO.Path]::GetFullPath((Join-Path $dir $path)) }
    if (-not (Test-Path -LiteralPath $target)) {
      $issues.Add([PSCustomObject]@{ Archivo = $rel; Tipo = 'archivo no existe'; Ref = $href; Linea = LineOf($content, $mm.Index) })
    } elseif ($id) {
      $tContent = [System.IO.File]::ReadAllText($target, $utf8)
      if ($tContent -notmatch ('id="' + [regex]::Escape($id) + '"')) {
        $issues.Add([PSCustomObject]@{ Archivo = $rel; Tipo = 'anchor en destino no existe'; Ref = $href; Linea = LineOf($content, $mm.Index) })
      }
    }
  }

  # --- srcs ---
  foreach ($mm in [regex]::Matches($content, 'src="([^"]+)"')) {
    $src = $mm.Groups[1].Value
    if ($src -match $extRe) { continue }
    if ($src.StartsWith('#')) { continue }
    $path = $src.Split('#', 2)[0]
    $target = if ([System.IO.Path]::IsPathRooted($path)) { $path } else { [System.IO.Path]::GetFullPath((Join-Path $dir $path)) }
    if (-not (Test-Path -LiteralPath $target)) {
      $issues.Add([PSCustomObject]@{ Archivo = $rel; Tipo = 'src no existe'; Ref = $src; Linea = LineOf($content, $mm.Index) })
    }
  }

  # --- patron wrapper de secciones ---
  foreach ($sec in [regex]::Matches($content, '<section class="reveal[^"]*" id="sec(\d{2})"')) {
    $idx = $sec.Index + $sec.Length
    $tail = $content.Substring($idx, [Math]::Min(300, $content.Length - $idx))
    if ($tail -notmatch 'class="flex items-center gap-4 mb-6"') {
      $issues.Add([PSCustomObject]@{ Archivo = $rel; Tipo = "sec$($sec.Groups[1].Value) sin wrapper flex"; Ref = $sec.Value; Linea = LineOf($content, $sec.Index) })
    }
  }

  # --- meta en head ---
  $head = if ($content -match '(?s)<head>(.*?)</head>') { $Matches[1] } else { '' }
  if ($head -notmatch '<meta name="description"') {
    $issues.Add([PSCustomObject]@{ Archivo = $rel; Tipo = 'falta meta description'; Ref = ''; Linea = 0 })
  }
  if ($head -notmatch '<link rel="icon"') {
    $issues.Add([PSCustomObject]@{ Archivo = $rel; Tipo = 'falta favicon'; Ref = ''; Linea = 0 })
  }
}

function LineOf($content, $index) {
  return (($content.Substring(0, $index).Split("`n").Count))
}

Write-Host "Analizados: $($files.Count) archivos" -ForegroundColor Cyan
if ($issues.Count -eq 0) {
  Write-Host "OK: sin problemas." -ForegroundColor Green
} else {
  Write-Host "Problemas encontrados: $($issues.Count)" -ForegroundColor Yellow
  $issues | Group-Object Tipo | ForEach-Object {
    Write-Host ("  [{0}] {1}" -f $_.Count, $_.Name) -ForegroundColor Magenta
  }
  Write-Host ""
  $issues | Format-Table Archivo, Tipo, Linea, Ref -AutoSize
  exit 1
}
