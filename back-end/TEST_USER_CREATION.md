# Test User Creation Endpoint

## Test with curl (PowerShell):

### Step 1: Login as Admin
```powershell
$loginBody = @{
    email = "amjedvnml@gmail.com"
    password = "yourpassword"
} | ConvertTo-Json

$loginResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
$loginData = $loginResponse.Content | ConvertFrom-Json
$token = $loginData.token

Write-Host "Token: $token"
```

### Step 2: Create User
```powershell
$userBody = @{
    name = "Test User from API"
    email = "testuser@example.com"
    password = "Test123456"
    phone = "1234567890"
    role = "user"
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$createResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/users" -Method POST -Body $userBody -Headers $headers
$createData = $createResponse.Content | ConvertFrom-Json

Write-Host "User Created:"
$createData | ConvertTo-Json -Depth 5
```

### Step 3: Verify User Exists
```powershell
$getUsersResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/users" -Headers $headers
$usersData = $getUsersResponse.Content | ConvertFrom-Json

Write-Host "All Users:"
$usersData | ConvertTo-Json -Depth 5
```

## Alternative: Test with curl (if available)
```bash
# Login
TOKEN=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"amjedvnml@gmail.com","password":"yourpassword"}' \
  | jq -r '.token')

echo "Token: $TOKEN"

# Create user
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Test User",
    "email": "testuser@example.com",
    "password": "Test123456",
    "phone": "1234567890",
    "role": "user"
  }'

# Get all users
curl http://localhost:5000/api/users \
  -H "Authorization: Bearer $TOKEN"
```
