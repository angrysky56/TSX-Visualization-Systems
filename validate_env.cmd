@echo off
setlocal EnableDelayedExpansion

echo ===============================================
echo Quantum System Environment Validation Protocol
echo ===============================================

:: Environment State Vector
set "NODE_DETECTED="
set "NPM_DETECTED="
set "PATH_COHERENT=false"

:: Node.js Runtime Validation
echo.
echo Phase 1: Runtime Component Analysis
echo ---------------------------------
where node 2>nul >nul
if !ERRORLEVEL! EQU 0 (
    for /f "tokens=*" %%i in ('where node') do (
        echo [√] Node.js detected: %%i
        set "NODE_DETECTED=true"
    )
) else (
    echo [×] Node.js not found in PATH
    set "NODE_DETECTED=false"
)

:: NPM Resolution Protocol
echo.
echo Phase 2: Package Manager Verification
echo -----------------------------------
where npm 2>nul >nul
if !ERRORLEVEL! EQU 0 (
    for /f "tokens=*" %%i in ('where npm') do (
        echo [√] NPM detected: %%i
        set "NPM_DETECTED=true"
    )
) else (
    echo [×] NPM not found in PATH
    set "NPM_DETECTED=false"
)

:: Path Coherence Verification
echo.
echo Phase 3: Path Coherence Analysis
echo ------------------------------
if "!NODE_DETECTED!"=="true" (
    if "!NPM_DETECTED!"=="true" (
        set "PATH_COHERENT=true"
        echo [√] Environment path coherence verified
    )
)

:: Environment Rectification Protocol
if "!PATH_COHERENT!"=="false" (
    echo.
    echo Implementing Environment Rectification Protocol...
    
    :: Add Node.js paths to current session
    set "PATH=%PATH%;C:\Program Files\nodejs"
    set "PATH=%PATH%;%APPDATA%\npm"
    
    echo Environment paths updated:
    echo - C:\Program Files\nodejs
    echo - %APPDATA%\npm
    
    :: Verify rectification
    where npm 2>nul >nul
    if !ERRORLEVEL! EQU 0 (
        echo [√] NPM path rectification successful
        set "PATH_COHERENT=true"
    ) else (
        echo [×] Path rectification failed
        goto :ERROR
    )
)

if "!PATH_COHERENT!"=="true" (
    echo.
    echo ===============================================
    echo Environment Validation Successful
    echo ===============================================
    echo.
    echo Proceeding with quantum visualization initialization...
    call init.cmd
) else (
    goto :ERROR
)

goto :EOF

:ERROR
echo.
echo ===============================================
echo Environment Validation Error
echo ===============================================
echo.
echo System State:
echo - Node.js: !NODE_DETECTED!
echo - NPM: !NPM_DETECTED!
echo - Path Coherence: !PATH_COHERENT!
echo.
echo Manual Intervention Protocol:
echo 1. Verify Node.js installation integrity
echo 2. Add to system PATH:
echo    - C:\Program Files\nodejs
echo    - %APPDATA%\npm
echo 3. Restart command prompt after PATH modification
echo.
pause
exit /b 1
