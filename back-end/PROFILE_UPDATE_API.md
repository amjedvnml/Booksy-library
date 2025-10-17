# 👤 Profile Update API - Including Avatar/Photo

## 🎯 **New Route Added:**

```
PUT /api/auth/profile
```

This route allows users to update their profile information including:
- ✅ Name
- ✅ Phone
- ✅ Address
- ✅ **Avatar/Profile Photo** (NEW!)

---

## 📋 **API Endpoint Details:**

### **Endpoint:** `PUT /api/auth/profile`

**Method:** `PUT`  
**Authentication:** Required (JWT Token)  
**Content-Type:** `application/json`

---

## 🔐 **Request Format:**

### **Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer YOUR_JWT_TOKEN_HERE"
}
```

### **Body (All fields optional):**
```json
{
  "name": "John Doe",
  "phone": "+1-234-567-8900",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "avatar": "https://example.com/photos/profile.jpg"
}
```

---

## 📤 **Response Format:**

### **Success (200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "_id": "652abc123def456789012345",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "phone": "+1-234-567-8900",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    },
    "avatar": "https://example.com/photos/profile.jpg",
    "membershipNumber": "MEM-123456",
    "membershipDate": "2025-10-15T...",
    "isActive": true
  }
}
```

### **Error (400 Bad Request):**
```json
{
  "success": false,
  "message": "Validation Error",
  "errors": [
    "Please add a valid phone number"
  ]
}
```

---

## 🎨 **Frontend Integration:**

### **React/JavaScript Example:**

```javascript
// api/auth.js
export const updateProfile = async (profileData) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('https://booksy-library-backend.vercel.app/api/auth/profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(profileData)
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update profile');
  }
  
  return data;
};
```

### **Usage in Component:**

```javascript
import { updateProfile } from '../api/auth';

function ProfilePage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const data = await updateProfile({
        name,
        phone,
        avatar
      });
      
      console.log('✅ Profile updated:', data);
      alert('Profile updated successfully!');
      
    } catch (error) {
      console.error('❌ Error:', error);
      alert(error.message);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      
      <input
        type="tel"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      
      <input
        type="url"
        placeholder="Avatar URL"
        value={avatar}
        onChange={(e) => setAvatar(e.target.value)}
      />
      
      <button type="submit">Update Profile</button>
    </form>
  );
}
```

---

## 📸 **Avatar/Profile Photo Options:**

### **Option 1: Use External URL**

Upload your photo to an image hosting service and use the URL:

```javascript
{
  "avatar": "https://i.imgur.com/yourphoto.jpg"
}
```

**Popular Image Hosting Services:**
- Imgur: https://imgur.com/
- Cloudinary: https://cloudinary.com/
- ImgBB: https://imgbb.com/
- AWS S3
- Vercel Blob Storage

---

### **Option 2: Use Base64 (Small Images Only)**

```javascript
// Convert image to base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

// In your component:
const handleImageChange = async (e) => {
  const file = e.target.files[0];
  if (file) {
    const base64 = await fileToBase64(file);
    setAvatar(base64);
  }
};
```

Then send:
```javascript
{
  "avatar": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```

⚠️ **Note:** Base64 makes the database larger. Use external URLs for better performance.

---

### **Option 3: Use Gravatar (Email-based)**

```javascript
import md5 from 'crypto-js/md5';

const getGravatarUrl = (email) => {
  const hash = md5(email.toLowerCase().trim());
  return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=200`;
};

// Use:
const avatarUrl = getGravatarUrl('user@example.com');
```

---

## 🧪 **Testing the API:**

### **Test 1: Update Name Only**

```bash
curl -X PUT https://booksy-library-backend.vercel.app/api/auth/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name": "Jane Doe"}'
```

---

### **Test 2: Update Avatar Only**

```bash
curl -X PUT https://booksy-library-backend.vercel.app/api/auth/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"avatar": "https://i.imgur.com/example.jpg"}'
```

---

### **Test 3: Update Multiple Fields**

```bash
curl -X PUT https://booksy-library-backend.vercel.app/api/auth/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "John Smith",
    "phone": "+1-555-1234",
    "avatar": "https://example.com/photo.jpg"
  }'
```

---

### **Test 4: Update with Address**

```bash
curl -X PUT https://booksy-library-backend.vercel.app/api/auth/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Alice Brown",
    "address": {
      "street": "456 Oak Ave",
      "city": "Los Angeles",
      "state": "CA",
      "zipCode": "90001",
      "country": "USA"
    },
    "avatar": "https://example.com/alice.jpg"
  }'
```

---

## 📝 **Field Validation:**

### **Name:**
- ❌ Empty string → Error
- ✅ Max 50 characters
- ✅ Trimmed automatically

### **Phone:**
- ✅ Format: `+1-234-567-8900` or `123-456-7890`
- ✅ Can include spaces, dashes, parentheses
- ❌ Letters → Error

### **Avatar:**
- ✅ Any valid URL string
- ✅ Base64 data URL
- ✅ Can be empty (uses default)
- 💡 **Recommended:** Use HTTPS URLs

### **Address:**
- ✅ All fields optional
- ✅ Country defaults to 'USA' if not provided

---

## 🔄 **Update Workflow:**

```
1. User edits profile in frontend
   ↓
2. Frontend sends PUT request to /api/auth/profile
   ↓
3. Backend validates JWT token
   ↓
4. Backend validates field data
   ↓
5. Backend updates only provided fields
   ↓
6. Backend returns updated user data
   ↓
7. Frontend updates local state/storage
   ↓
8. UI reflects new profile data ✅
```

---

## 🎯 **Partial Updates:**

You can update **any combination** of fields:

```javascript
// Update only avatar
await updateProfile({ avatar: "https://..." });

// Update only name and phone
await updateProfile({ 
  name: "New Name",
  phone: "+1-555-5555"
});

// Update everything
await updateProfile({
  name: "Full Name",
  phone: "+1-555-1234",
  avatar: "https://...",
  address: { ... }
});
```

---

## 🛡️ **Security Features:**

### **Authentication Required:**
- ✅ Must include valid JWT token
- ✅ Can only update own profile
- ❌ Cannot update other users' profiles

### **Protected Fields:**
These fields **cannot** be updated via this route:
- ❌ `email` (use separate route)
- ❌ `password` (use `/api/auth/updatepassword`)
- ❌ `role` (admin only)
- ❌ `membershipNumber` (auto-generated)
- ❌ `currentBorrowedBooks` (use borrow/return routes)

---

## 🎨 **Complete Form Example:**

```javascript
import { useState, useEffect } from 'react';
import { updateProfile, getCurrentUser } from '../api/auth';

function EditProfile() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    avatar: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA'
    }
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Load current user data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userData = await getCurrentUser();
        setFormData({
          name: userData.data.name || '',
          phone: userData.data.phone || '',
          avatar: userData.data.avatar || '',
          address: userData.data.address || {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'USA'
          }
        });
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };
    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [addressField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await updateProfile(formData);
      setMessage('✅ Profile updated successfully!');
      
      // Update local storage
      const currentUser = JSON.parse(localStorage.getItem('user'));
      localStorage.setItem('user', JSON.stringify({
        ...currentUser,
        ...response.data
      }));
      
    } catch (error) {
      setMessage('❌ ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-profile">
      <h2>Edit Profile</h2>
      
      {message && <div className="message">{message}</div>}
      
      <form onSubmit={handleSubmit}>
        {/* Basic Info */}
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Phone:</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        {/* Avatar */}
        <div>
          <label>Profile Photo URL:</label>
          <input
            type="url"
            name="avatar"
            value={formData.avatar}
            onChange={handleChange}
            placeholder="https://example.com/photo.jpg"
          />
          {formData.avatar && (
            <img 
              src={formData.avatar} 
              alt="Preview" 
              style={{width: '100px', height: '100px', objectFit: 'cover'}}
            />
          )}
        </div>

        {/* Address */}
        <fieldset>
          <legend>Address</legend>
          
          <div>
            <label>Street:</label>
            <input
              type="text"
              name="address.street"
              value={formData.address.street}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>City:</label>
            <input
              type="text"
              name="address.city"
              value={formData.address.city}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>State:</label>
            <input
              type="text"
              name="address.state"
              value={formData.address.state}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Zip Code:</label>
            <input
              type="text"
              name="address.zipCode"
              value={formData.address.zipCode}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Country:</label>
            <input
              type="text"
              name="address.country"
              value={formData.address.country}
              onChange={handleChange}
            />
          </div>
        </fieldset>

        <button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
}

export default EditProfile;
```

---

## 📚 **API Reference Summary:**

| Field | Type | Required | Updatable | Notes |
|-------|------|----------|-----------|-------|
| `name` | String | No | ✅ | Max 50 characters |
| `phone` | String | No | ✅ | Must match phone format |
| `avatar` | String | No | ✅ | URL to profile photo |
| `address.street` | String | No | ✅ | Street address |
| `address.city` | String | No | ✅ | City name |
| `address.state` | String | No | ✅ | State/Province |
| `address.zipCode` | String | No | ✅ | Postal code |
| `address.country` | String | No | ✅ | Default: 'USA' |
| `email` | String | - | ❌ | Cannot change email |
| `password` | String | - | ❌ | Use separate endpoint |
| `role` | String | - | ❌ | Admin only |

---

## 🎉 **You're All Set!**

Your backend now supports profile updates including avatar/profile photos at:

```
PUT /api/auth/profile
```

**Features:**
- ✅ Update any profile field
- ✅ Partial updates supported
- ✅ Avatar/profile photo support
- ✅ Address management
- ✅ Secure (authentication required)
- ✅ Validation included

**Next steps:**
1. Test the endpoint with curl or Postman
2. Integrate into your frontend profile page
3. Add image upload functionality
4. Style your profile page UI

Happy coding! 🚀
