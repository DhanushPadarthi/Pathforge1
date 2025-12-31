from pymongo import MongoClient
from datetime import datetime
from bson import ObjectId

client = MongoClient('mongodb://localhost:27017/')
db = client['pathforge1']

# Create test admin user with known credentials
test_admin = {
    "_id": ObjectId(),
    "firebase_uid": "test_admin_uid_12345",
    "email": "admin@pathforge.test",
    "name": "Test Admin",
    "role": "admin",
    "profile_completed": False,
    "has_resume": False,
    "resume_file_id": None,
    "resume_filename": None,
    "current_skills": [],
    "target_role_id": None,
    "saved_roadmaps": [],
    "available_hours_per_week": None,
    "notification_preferences": {},
    "created_at": datetime.utcnow(),
    "updated_at": datetime.utcnow()
}

# Check if already exists
existing = db.users.find_one({"email": "admin@pathforge.test"})
if existing:
    print("✓ Admin test account already exists!")
    print(f"  Email: {existing['email']}")
    print(f"  Role: {existing['role']}")
else:
    # Insert new test admin
    result = db.users.insert_one(test_admin)
    print("✓ Created test admin account!")
    print(f"  Email: admin@pathforge.test")
    print(f"  Role: admin")
    print(f"  ID: {result.inserted_id}")

print("\n" + "="*60)
print("INSTRUCTIONS:")
print("="*60)
print("\n1. Go to http://localhost:3000/register")
print("2. Register a NEW account with:")
print("   Email: admin@pathforge.test")
print("   Password: anything you want")
print("   Name: Test Admin")
print("\n3. After Firebase creates the account, the system will")
print("   auto-sync with MongoDB and override with our admin role")
print("\n4. Log out and log back in")
print("5. Go to http://localhost:3000/admin")
print("\n" + "="*60)
