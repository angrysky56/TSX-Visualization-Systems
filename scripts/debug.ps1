#!/usr/bin/env pwsh

# Debug Script for TSX Visualization Systems
# This script performs comprehensive system checks and debugging

function Write-Header {
    param($text)
    Write-Host "`n=== $text ===" -ForegroundColor Cyan
}

function Test-Command {
    param($command)
    try {
        Get-Command $command -ErrorAction Stop | Out-Null
        return $true
    }
    catch {
        return $false
    }
}

# System Requirements Check
Write-Header "Checking System Requirements"

$requirements = @{
    "node" = "Node.js"
    "npm" = "NPM"
    "docker" = "Docker"
    "docker-compose" = "Docker Compose"
}

$allGood = $true
foreach ($req in $requirements.GetEnumerator()) {
    if (Test-Command $req.Key) {
        Write-Host "✓ $($req.Value) is installed" -ForegroundColor Green

        # Version checks
        switch ($req.Key) {
            "node" {
                $version = (node -v)
                Write-Host "  Version: $version" -ForegroundColor Gray
            }
            "npm" {
                $version = (npm -v)
                Write-Host "  Version: $version" -ForegroundColor Gray
            }
            "docker" {
                $version = (docker version --format '{{.Server.Version}}')
                Write-Host "  Version: $version" -ForegroundColor Gray
            }
        }
    }
    else {
        Write-Host "✗ $($req.Value) is not installed" -ForegroundColor Red
        $allGood = $false
    }
}

if (-not $allGood) {
    Write-Host "`nPlease install missing requirements before continuing" -ForegroundColor Red
    exit 1
}

# Docker Service Check
Write-Header "Checking Docker Services"

$services = @(
    "tsx-etcd",
    "tsx-minio",
    "tsx-milvus",
    "tsx-prometheus",
    "tsx-grafana",
    "tsx-dev"
)

foreach ($service in $services) {
    $status = docker ps -f name=$service --format "{{.Status}}"
    if ($status) {
        Write-Host "✓ $service is running" -ForegroundColor Green
        Write-Host "  Status: $status" -ForegroundColor Gray
    }
    else {
        Write-Host "✗ $service is not running" -ForegroundColor Red
    }
}

# Node Modules Check
Write-Header "Checking Node Modules"

if (Test-Path "node_modules") {
    Write-Host "✓ node_modules exists" -ForegroundColor Green
}
else {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# TypeScript Compilation Check
Write-Header "Checking TypeScript Compilation"

$tscOutput = npm run build 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ TypeScript compilation successful" -ForegroundColor Green
}
else {
    Write-Host "✗ TypeScript compilation failed" -ForegroundColor Red
    Write-Host $tscOutput -ForegroundColor Red
}

# Milvus Connection Check
Write-Header "Checking Milvus Connection"

try {
    Invoke-RestMethod -Uri "http://localhost:19530/api/health" -Method Get | Out-Null
    Write-Host "✓ Milvus is responsive" -ForegroundColor Green
}
catch {
    Write-Host "✗ Cannot connect to Milvus" -ForegroundColor Red
    Write-Host "  Error: $_" -ForegroundColor Red
}

Write-Header "Debug Summary"
Write-Host "Check the logs above for any issues that need to be addressed."
