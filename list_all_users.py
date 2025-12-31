from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017/')
db = client['pathforge1']

users = list(db.users.find({}))
print(f'Total users in database: {len(users)}\n')

for user in users:
    print(f'Email: {user.get("email")}')
    print(f'Role: {user.get("role", "NO ROLE SET")}')
    print(f'Firebase UID: {user.get("firebase_uid")}')
    print('---')
