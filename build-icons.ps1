# PowerShell script to build PNG icons from SVG placeholders
# Usage: .\build-icons.ps1

Set-StrictMode -Version Latest

$iconsDir = Join-Path -Path $PSScriptRoot -ChildPath 'icons'
if (-not (Test-Path $iconsDir)) { New-Item -ItemType Directory -Path $iconsDir | Out-Null }

function _WriteOk($msg){ Write-Host $msg -ForegroundColor Green }
function _WriteWarn($msg){ Write-Host $msg -ForegroundColor Yellow }
function _WriteErr($msg){ Write-Host $msg -ForegroundColor Red }

$svg192 = Join-Path $iconsDir 'icon-192.svg'
$svg512 = Join-Path $iconsDir 'icon-512.svg'
$out192 = Join-Path $iconsDir 'icon-192.png'
$out512 = Join-Path $iconsDir 'icon-512.png'

function _okIfExists($path){ Test-Path $path -PathType Leaf }

# 1) Try ImageMagick (magick)
if (Get-Command magick -ErrorAction SilentlyContinue) {
  _WriteOk "Using ImageMagick (magick) to generate icons..."
  if (_okIfExists $svg192) { & magick convert $svg192 -resize 192x192 $out192 }
  if (_okIfExists $svg512) { & magick convert $svg512 -resize 512x512 $out512 }
  _WriteOk "Done (ImageMagick)."
  exit 0
}

# 2) Try WSL + rsvg-convert
if (Get-Command wsl -ErrorAction SilentlyContinue) {
  _WriteOk "Using WSL (rsvg-convert) to generate icons..."
  $cmd = "mkdir -p icons"
  if (_okIfExists $svg192) { $cmd += " && if [ -f icons/icon-192.svg ]; then rsvg-convert -w 192 -h 192 icons/icon-192.svg -o icons/icon-192.png; fi" }
  if (_okIfExists $svg512) { $cmd += " && if [ -f icons/icon-512.svg ]; then rsvg-convert -w 512 -h 512 icons/icon-512.svg -o icons/icon-512.png; fi" }
  wsl bash -lc $cmd
  _WriteOk "Done (WSL)."
  exit 0
}

# 3) Node (sharp) fallback using package.json script
if (Get-Command node -ErrorAction SilentlyContinue) {
  if (Test-Path (Join-Path $PSScriptRoot 'package.json')) {
    _WriteOk "Node available — attempting Node-based icon build (sharp)..."
    Push-Location $PSScriptRoot
    try {
      if (Test-Path "package-lock.json") { npm ci } else { npm install }
      npm run build-icons
      _WriteOk "Done (Node/sharp)."
      Pop-Location
      exit 0
    } catch {
      _WriteWarn "Node-based build failed: $_"
      Pop-Location
    }
  }
}

# No renderer found
_WriteErr "No suitable renderer found. Install ImageMagick, enable WSL with librsvg (rsvg-convert), or install Node and run 'npm ci' then 'npm run build-icons'."
exit 1
