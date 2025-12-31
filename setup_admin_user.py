import asyncio
from pymongo import MongoClient
from datetime import datetime
from bson import ObjectId

async def setup_admin():
    """Set up an admin user for d11@gmail.com after they register"""
    client = MongoClient('mongodb://localhost:27017/')
    db = client['pathforge1']
    
    # Check current users
    users = list(db.users.find({}))
    print(f"\nCurrent users in database: {len(users)}")
    
    if len(users) > 0:
        print("\nExisting users:")
        for user in users:
            print(f"  - {user.get('email')} (role: {user.get('role', 'student')})")
    else:
        print("  (Database is empty - users need to register first)")
    
    print("\n" + "="*60)
    print("WHAT TO DO NOW:")
    print("="*60)
    print("\n1. Go to http://localhost:3000")
    print("2. Click 'Register'")
    print("3. Create account with email: d11@gmail.com")
    print("4. After registration, come back and run this script again")
    print("5. It will automatically set d11@gmail.com as admin")
    print("\n" + "="*60)
    
    # Check again and update if user exists
    user = db.users.find_one({'email': 'd11@gmail.com'})
    if user:
        print(f"\n✓ Found d11@gmail.com!")
        print(f"  Current role: {user.get('role', 'student')}")
        
        # Set as admin
        db.users.update_one(
            {'email': 'd11@gmail.com'},
            {'$set': {'role': 'admin', 'updated_at': datetime.utcnow()}}
        )
        print("  ✓ Set as ADMIN!")
        
        # Verify
        updated_user = db.users.find_one({'email': 'd11@gmail.com'})
        print(f"  Updated role: {updated_user.get('role')}")
        
        print("\nNow you can:")
        print("1. Log out from frontend")
        print("2. Go to http://localhost:3000/login")
        print("3. Log in with d11@gmail.com")
        print("4. Navigate to /admin")
        print("5. Admin panel should be visible!")
    else:
        print("\n✗ d11@gmail.com not found yet")
        print("  Please register the account first (step 1-3 above)")

if __name__ == '__main__':
    asyncio.run(setup_admin())
