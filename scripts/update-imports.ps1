# PowerShell script to update imports and filenames

# File renames
$renames = @{
    "quantumPatternService.ts" = "QuantumPatternService.ts"
    "milvusConnection.ts" = "MilvusConnection.ts"
    "createCommand.ts" = "CreateCommand.ts"
    "mergeCommand.ts" = "MergeCommand.ts"
    "evolveCommand.ts" = "EvolveCommand.ts"
    "resonateCommand.ts" = "ResonateCommand.ts"
    "collapseCommand.ts" = "CollapseCommand.ts"
}

# Get src directory path
$srcPath = "F:\ai_workspace\Nexus-Prime\nexus-system-development\quantum-framework\TSX-Visualization-Systems\src"

# Function to update imports in a file
function Update-Imports {
    param (
        [string]$filePath
    )
    
    $content = Get-Content $filePath -Raw
    
    # Update import statements
    $content = $content -replace "from '../quantumPatternService'", "from '../QuantumPatternService'"
    $content = $content -replace "from '../milvusConnection'", "from '../MilvusConnection'"
    $content = $content -replace "from './quantumPatternService'", "from './QuantumPatternService'"
    $content = $content -replace "from './services/quantumPatternService'", "from './services/QuantumPatternService'"
    
    Set-Content $filePath $content
}

# Rename files
foreach ($rename in $renames.GetEnumerator()) {
    $files = Get-ChildItem -Path $srcPath -Recurse -File | Where-Object { $_.Name -eq $rename.Key }
    foreach ($file in $files) {
        Rename-Item -Path $file.FullName -NewName $rename.Value -Force
    }
}

# Update imports in all TypeScript/TSX files
Get-ChildItem -Path $srcPath -Recurse -Include "*.ts","*.tsx" | ForEach-Object {
    Update-Imports $_.FullName
}

Write-Host "File renaming and import updates completed"