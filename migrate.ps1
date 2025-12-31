# PathForge Project Restructuring - Cleanup Script
# This script helps complete the migration to the new structure

Write-Host "PathForge Project Restructuring Cleanup" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

# Backend cleanup
Write-Host "Backend Cleanup Options:" -ForegroundColor Yellow
Write-Host "1. The new backend structure is in: backend/app/" -ForegroundColor Green
Write-Host "2. Old files to remove after verification:" -ForegroundColor Gray
Write-Host "   - backend/database/" -ForegroundColor Gray
Write-Host "   - backend/main.py (old copy)" -ForegroundColor Gray
Write-Host ""

# Frontend migration
Write-Host "Frontend Migration Options:" -ForegroundColor Yellow
Write-Host "1. New frontend structure is in: frontend_new/" -ForegroundColor Green
Write-Host "2. To complete migration:" -ForegroundColor Gray
Write-Host "   Rename-Item frontend frontend_old" -ForegroundColor Gray
Write-Host "   Rename-Item frontend_new frontend" -ForegroundColor Gray
Write-Host ""

# User confirmation
$response = Read-Host "Do you want to proceed with automatic cleanup? (y/N)"

if ($response -eq 'y' -or $response -eq 'Y') {
    Write-Host ""
    Write-Host "Starting cleanup..." -ForegroundColor Yellow
    
    # Backend cleanup
    Write-Host "Cleaning up old backend files..." -ForegroundColor Cyan
    
    # Check if new structure exists
    if (Test-Path "backend\app\main.py") {
        Write-Host "✓ New backend structure found" -ForegroundColor Green
        
        # Remove old database directory
        if (Test-Path "backend\database") {
            Remove-Item -Path "backend\database" -Recurse -Force
            Write-Host "✓ Removed backend/database/" -ForegroundColor Green
        }
        
        # Remove old __pycache__ directories
        Get-ChildItem -Path "backend" -Filter "__pycache__" -Recurse -Directory | Remove-Item -Recurse -Force
        Write-Host "✓ Cleaned up __pycache__ directories" -ForegroundColor Green
    }
    
    # Frontend migration
    Write-Host ""
    Write-Host "Migrating frontend..." -ForegroundColor Cyan
    
    if (Test-Path "frontend_new\src\main.jsx") {
        Write-Host "✓ New frontend structure found" -ForegroundColor Green
        
        # Backup old frontend
        if (Test-Path "frontend") {
            if (Test-Path "frontend_old") {
                Remove-Item -Path "frontend_old" -Recurse -Force
            }
            Rename-Item -Path "frontend" -NewName "frontend_old"
            Write-Host "✓ Backed up old frontend to frontend_old/" -ForegroundColor Green
        }
        
        # Move new frontend
        Rename-Item -Path "frontend_new" -NewName "frontend"
        Write-Host "✓ Activated new frontend structure" -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "Cleanup complete!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Backend: cd backend && uvicorn app.main:app --reload" -ForegroundColor Gray
    Write-Host "2. Frontend: cd frontend && npm install && npm run dev" -ForegroundColor Gray
    Write-Host "3. Review RESTRUCTURING_GUIDE.md for details" -ForegroundColor Gray
    
} else {
    Write-Host ""
    Write-Host "Cleanup cancelled. Manual steps:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Backend (already restructured in backend/app/):" -ForegroundColor Cyan
    Write-Host "  - Test: uvicorn app.main:app --reload" -ForegroundColor Gray
    Write-Host "  - Then remove: backend/database/" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Frontend (new structure in frontend_new/):" -ForegroundColor Cyan
    Write-Host "  - Rename-Item frontend frontend_old" -ForegroundColor Gray
    Write-Host "  - Rename-Item frontend_new frontend" -ForegroundColor Gray
    Write-Host "  - cd frontend && npm install && npm run dev" -ForegroundColor Gray
    Write-Host ""
    Write-Host "See RESTRUCTURING_GUIDE.md for complete instructions" -ForegroundColor Gray
}

Write-Host ""
