# 📊 Viewing Resume Files in MongoDB Compass

## Understanding GridFS in MongoDB

GridFS stores files using **two collections**:
- `resumes.files` - File metadata (filename, size, upload date, user_id)
- `resumes.chunks` - File data split into chunks (each chunk is max 255KB)

---

## 🔍 How to View Resumes in MongoDB Compass

### Step 1: Open MongoDB Compass
1. Launch **MongoDB Compass**
2. Connect to `mongodb://localhost:27017`

### Step 2: Select Database
1. Click on **`pathforge`** database
2. You'll see collections listed

### Step 3: View Collections

#### Current Collections (Before Resume Upload):
```
✓ career_roles (6 documents)
✓ skills (10 documents)  
✓ users (1 document - admin)
```

#### After First Resume Upload:
```
✓ career_roles (6 documents)
✓ skills (10 documents)
✓ users (1+ documents)
✓ resumes.files (metadata) ← NEW
✓ resumes.chunks (file data) ← NEW
```

---

## 📁 What Each Collection Shows

### `resumes.files` Collection
Shows file metadata:
```json
{
  "_id": ObjectId("..."),
  "filename": "john_resume.pdf",
  "length": 245678,
  "chunkSize": 261120,
  "uploadDate": ISODate("2025-12-28T..."),
  "metadata": {
    "user_id": "67890...",
    "content_type": "application/pdf",
    "original_filename": "john_resume.pdf"
  }
}
```

**What you can see:**
- File name
- File size
- Upload date
- Which user uploaded it
- File type (PDF/DOCX)

### `resumes.chunks` Collection  
Shows file data chunks:
```json
{
  "_id": ObjectId("..."),
  "files_id": ObjectId("..."),  // Links to resumes.files
  "n": 0,  // Chunk number (0, 1, 2, ...)
  "data": BinData(...)  // Actual file bytes
}
```

**Note:** You won't see readable content here - it's binary data

### `users` Collection
Users who uploaded resumes:
```json
{
  "_id": ObjectId("..."),
  "email": "john@example.com",
  "name": "John Doe",
  "has_resume": true,
  "resume_file_id": "67890abc",  // ← Links to resumes.files
  "resume_filename": "john_resume.pdf",
  "current_skills": ["Python", "JavaScript"]
}
```

---

## 🧪 Testing Resume Upload

### Option 1: Using API Docs (Swagger UI)

1. Make sure backend is running: `http://127.0.0.1:8000`
2. Open Swagger UI: `http://127.0.0.1:8000/docs`
3. Find **`POST /api/users/{user_id}/upload-resume`**
4. Click **"Try it out"**
5. Enter a user_id (use admin user ID from MongoDB)
6. Upload a PDF or DOCX file
7. Click **"Execute"**

### Option 2: Using cURL

```bash
# First, get admin user ID from MongoDB
# Then upload a resume

curl -X POST "http://127.0.0.1:8000/api/users/YOUR_USER_ID/upload-resume" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/path/to/your/resume.pdf"
```

### Option 3: Using Python Script

```python
import httpx

user_id = "YOUR_USER_ID"  # Get from MongoDB
resume_path = "resume.pdf"

with open(resume_path, 'rb') as f:
    files = {'file': (resume_path, f, 'application/pdf')}
    response = httpx.post(
        f"http://127.0.0.1:8000/api/users/{user_id}/upload-resume",
        files=files
    )
    print(response.json())
```

---

## 🔍 After Upload - What to Check

### 1. In MongoDB Compass:

**Check `resumes.files`:**
- Should have 1 document
- Shows file metadata
- Note the `_id` field

**Check `resumes.chunks`:**
- Should have 1+ documents (depends on file size)
- Each chunk links to files via `files_id`

**Check `users`:**
- User should have `has_resume: true`
- `resume_file_id` should match file `_id` from `resumes.files`

### 2. Verify Data Integrity:

Run this command:
```bash
python check_gridfs.py
```

Should show:
```
📁 Checking GridFS for Resumes...

✅ Found 1 resume files in GridFS:
  File: resume.pdf
  ID: 67890abc...
  Size: 245678 bytes
  User ID: 12345...
```

---

## 📥 Download Resume

### Using API:
```bash
curl "http://127.0.0.1:8000/api/files/{user_id}/resume" --output downloaded_resume.pdf
```

### Using Swagger UI:
1. Go to `http://127.0.0.1:8000/docs`
2. Find **`GET /api/files/{user_id}/resume`**
3. Click "Try it out"
4. Enter user_id
5. Click "Execute"
6. Download the file

---

## 🗑️ Delete Resume

### Using API:
```bash
curl -X DELETE "http://127.0.0.1:8000/api/files/{user_id}/resume"
```

This will:
- Delete file from GridFS
- Remove `resume_file_id` from user document
- Set `has_resume: false`

---

## 💡 Why GridFS Collections Appear "Empty" in Compass

**For `resumes.chunks`:**
- Shows binary data (`BinData`)
- Not human-readable
- This is normal - it's the actual file bytes

**To view actual file:**
- Use the Download API endpoint
- Or use the `check_gridfs.py` script

---

## 🛠️ Troubleshooting

### Issue: Can't see `resumes.files` or `resumes.chunks`
**Solution:** Collections are created on first upload. Upload a resume first.

### Issue: Upload fails with error
**Solution:** 
1. Check backend logs
2. Ensure MongoDB is running
3. Check file is PDF or DOCX
4. Ensure user_id exists in database

### Issue: File shows in `resumes.files` but not in user
**Solution:** Check the API response - it should update the user automatically

---

## 📊 Quick Reference

| Collection | Purpose | When Created |
|-----------|---------|--------------|
| `users` | User profiles | On user registration |
| `career_roles` | Available roles | On database seeding |
| `skills` | Skill definitions | On database seeding |
| `resumes.files` | Resume metadata | On first resume upload |
| `resumes.chunks` | Resume file data | On first resume upload |

---

## ✅ Summary

**To see resumes in MongoDB:**
1. ✅ Backend must be running
2. ✅ Upload a resume via API
3. ✅ Check `resumes.files` in Compass
4. ✅ Check `resumes.chunks` for file data
5. ✅ User document will have `resume_file_id`

**Current Status:**
- ✅ MongoDB connected
- ✅ GridFS configured
- ✅ Ready to receive uploads
- ⏳ Waiting for first resume upload to create collections
