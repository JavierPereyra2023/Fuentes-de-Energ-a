const fs = require('fs');
try {
  const data = JSON.parse(fs.readFileSync('D:/nucle-ar/output/manifest.json', 'utf8'));
  console.log('JSON OK. Top-level keys:', Object.keys(data).join(', '));
  // Show structure (without data)
  for (const k of Object.keys(data)) {
    const v = data[k];
    if (typeof v === 'object') {
      console.log('  ' + k + ': { mime: ' + v.mime + ', compressed: ' + v.compressed + ', data length: ' + v.data.length + ' }');
    } else {
      console.log('  ' + k + ': ' + v);
    }
  }
} catch (e) {
  console.log('Error:', e.message);
  console.log('Position:', e.message.match(/position (\d+)/)?.[1]);
}
