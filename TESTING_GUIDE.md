# Testing Guide

## Backend Tests

### Setup
```bash
cd backend
pip install pytest pytest-asyncio httpx
```

### Run Tests
```bash
# Run all tests
pytest

# Run specific test file
pytest tests/test_ai_service.py

# Run with verbose output
pytest -v

# Run with coverage
pytest --cov=. --cov-report=html
```

### Test Structure
- `tests/test_ai_service.py` - Unit tests for AI service
- `tests/test_admin_api.py` - Integration tests for admin endpoints
- `tests/conftest.py` - Test configuration and fixtures
- `tests/test_main.py` - API endpoint tests

### Writing Tests
```python
import pytest

@pytest.mark.asyncio
async def test_example():
    # Your test code here
    assert True
```

## Frontend Tests (To Be Implemented)

### Setup
```bash
cd frontend
npm install --save-dev @testing-library/react @testing-library/jest-dom jest
```

### Run Tests
```bash
npm test
```

## E2E Tests (To Be Implemented)

### Setup
```bash
npm install --save-dev @playwright/test
```

### Run Tests
```bash
npx playwright test
```

## Test Coverage Goals
- **Backend API**: 80% coverage
- **Frontend Components**: 70% coverage
- **Critical Paths**: 100% coverage

## Current Status
✅ Test structure created
✅ Basic unit tests for AI service
✅ Basic integration tests for admin API
⚠️ Need more comprehensive tests
⚠️ Frontend tests not implemented
⚠️ E2E tests not implemented
