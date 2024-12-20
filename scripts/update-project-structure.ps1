# PowerShell script to update project structure and imports

$srcPath = "F:\ai_workspace\Nexus-Prime\nexus-system-development\quantum-framework\TSX-Visualization-Systems\src"

# Create necessary directories if they don't exist
$directories = @(
    "components/common",
    "components/hooks",
    "components/layouts",
    "components/providers",
    "lib/constants",
    "lib/utils",
    "lib/types",
    "lib/hooks",
    "lib/services",
    "lib/contexts"
)

foreach ($dir in $directories) {
    $fullPath = Join-Path $srcPath $dir
    if (!(Test-Path $fullPath)) {
        New-Item -ItemType Directory -Path $fullPath -Force
    }
}

# Create index.ts files for each directory
$indexFiles = @{
    "components/common/index.ts" = "// Export common components"
    "components/hooks/index.ts" = "// Export custom hooks"
    "components/layouts/index.ts" = "// Export layout components"
    "components/providers/index.ts" = "// Export providers"
    "lib/constants/index.ts" = "// Export constants"
    "lib/utils/index.ts" = "// Export utility functions"
    "lib/types/index.ts" = "// Export type definitions"
    "lib/hooks/index.ts" = "// Export shared hooks"
    "lib/services/index.ts" = "// Export services"
    "lib/contexts/index.ts" = "// Export contexts"
}

foreach ($file in $indexFiles.GetEnumerator()) {
    $fullPath = Join-Path $srcPath $file.Key
    if (!(Test-Path $fullPath)) {
        Set-Content -Path $fullPath -Value $file.Value
    }
}

# Create tsconfig.paths.json for path aliases
$tsconfigPaths = @"
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@common/*": ["./src/components/common/*"],
      "@hooks/*": ["./src/components/hooks/*"],
      "@layouts/*": ["./src/components/layouts/*"],
      "@providers/*": ["./src/components/providers/*"],
      "@lib/*": ["./src/lib/*"],
      "@constants/*": ["./src/lib/constants/*"],
      "@utils/*": ["./src/lib/utils/*"],
      "@types/*": ["./src/lib/types/*"],
      "@services/*": ["./src/lib/services/*"],
      "@contexts/*": ["./src/lib/contexts/*"]
    }
  }
}
"@

Set-Content -Path "F:\ai_workspace\Nexus-Prime\nexus-system-development\quantum-framework\TSX-Visualization-Systems\tsconfig.paths.json" -Value $tsconfigPaths

# Update main tsconfig.json to extend paths config
$tsconfigContent = @"
{
  "extends": "./tsconfig.paths.json",
  "compilerOptions": {
    "target": "ESNext",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": false,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "types": ["vite/client"]
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
"@

Set-Content -Path "F:\ai_workspace\Nexus-Prime\nexus-system-development\quantum-framework\TSX-Visualization-Systems\tsconfig.json" -Value $tsconfigContent

# Create core utility files
$coreUtils = @{
    "lib/utils/errorHandler.ts" = @"
export const handleError = (error: unknown) => {
  console.error('An error occurred:', error);
  // Add error handling logic
};
"@
    
    "lib/utils/logger.ts" = @"
export const logger = {
  info: (message: string) => console.log(`[INFO] ${message}`),
  error: (message: string) => console.error(`[ERROR] ${message}`),
  warn: (message: string) => console.warn(`[WARN] ${message}`),
  debug: (message: string) => console.debug(`[DEBUG] ${message}`)
};
"@
    
    "lib/constants/config.ts" = @"
export const CONFIG = {
  API_TIMEOUT: 30000,
  MAX_RETRIES: 3,
  QUANTUM_DIMENSIONS: 512,
  DEFAULT_COHERENCE_THRESHOLD: 0.8
} as const;
"@
}

foreach ($file in $coreUtils.GetEnumerator()) {
    $fullPath = Join-Path $srcPath $file.Key
    if (!(Test-Path $fullPath)) {
        Set-Content -Path $fullPath -Value $file.Value
    }
}

Write-Host "Project structure updated successfully"