from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017/')
db = client['pathforge1']

# Check d11@gmail.com
user = db.users.find_one({'email': 'd11@gmail.com'})
if user:
    print(f'User d11@gmail.com found:')
    print(f'  Email: {user.get("email")}')
    print(f'  Role: {user.get("role", "NO ROLE SET")}')
    print(f'  Firebase UID: {user.get("firebase_uid")}')
else:
    print('User d11@gmail.com NOT FOUND in database')

print('\n---\n')

# Also check d1@gmail.com for reference
user2 = db.users.find_one({'email': 'd1@gmail.com'})
if user2:
    print(f'User d1@gmail.com found:')
    print(f'  Email: {user2.get("email")}')
    print(f'  Role: {user2.get("role", "NO ROLE SET")}')
    print(f'  Firebase UID: {user2.get("firebase_uid")}')
else:
    print('User d1@gmail.com NOT FOUND in database')
