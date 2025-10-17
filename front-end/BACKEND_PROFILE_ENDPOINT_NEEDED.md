# Profile Update - Backend Endpoint Missing

## 🔴 **Issue Identified**

The frontend profile update feature is trying to call `/api/auth/profile` but the backend doesn't have this endpoint yet, resulting in a **404 error**.

## ✅ **Temporary Solution Implemented**

The frontend now has a **smart fallback system** that:

1. **Tries multiple possible endpoints** in order:
   - `PUT /api/auth/profile` (RESTful endpoint)
   - `PATCH /api/auth/me` (Alternative endpoint)
   - `PUT /api/users/profile` (Another common pattern)

2. **Falls back to local storage** if all endpoints return 404:
   - Saves profile data (name, email) to localStorage
   - Converts profile image to base64 and stores locally
   - Shows yellow warning message: "Profile saved locally! Backend sync pending."
   - User still gets to update their profile in the UI
   - Changes appear in sidebar immediately

3. **Seamless user experience**:
   - No errors or crashes
   - Profile image still displays in sidebar
   - All changes persist across page refreshes
   - Smooth transition when backend is ready

## 🔧 **What Needs to Be Done on Backend**

### Option 1: Create Dedicated Profile Endpoint (Recommended)

```javascript
// Backend route: PUT /api/auth/profile
router.put('/auth/profile', authenticate, upload.single('profileImage'), async (req, res) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body
    const userId = req.user.id // from JWT token
    
    // Find user
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    
    // Update name and email
    if (name) user.name = name
    if (email) {
      // Check if email is already taken by another user
      const existingUser = await User.findOne({ email, _id: { $ne: userId } })
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' })
      }
      user.email = email
    }
    
    // Handle password change
    if (newPassword && currentPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password)
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' })
      }
      user.password = await bcrypt.hash(newPassword, 10)
    }
    
    // Handle profile image upload
    if (req.file) {
      // Delete old image if exists
      if (user.profileImage) {
        // Delete old file from storage
      }
      
      // Save new image URL/path
      user.profileImage = `/uploads/${req.file.filename}` // Adjust based on your setup
    }
    
    await user.save()
    
    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage
      }
    })
  } catch (error) {
    console.error('Profile update error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})
```

### Option 2: Extend Existing /auth/me Endpoint

```javascript
// Backend route: PATCH /api/auth/me
router.patch('/auth/me', authenticate, upload.single('profileImage'), async (req, res) => {
  // Same logic as Option 1
})
```

### Required Backend Dependencies

```bash
npm install multer  # For file uploads
```

### Multer Configuration Example

```javascript
const multer = require('multer')
const path = require('path')

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profiles/') // Create this directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname))
  }
})

// File filter for images only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(new Error('Only image files are allowed'), false)
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
})
```

### Database Schema Update

Add to your User model:

```javascript
// MongoDB/Mongoose example
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'user' },
  profileImage: { type: String, default: null }, // ADD THIS FIELD
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})
```

## 🔄 **Current Behavior**

### When Backend Endpoint is Missing:
- ✅ Frontend tries all possible endpoints
- ✅ Falls back to localStorage after 404 errors
- ⚠️ Shows yellow warning: "Profile saved locally! Backend sync pending."
- ✅ Profile image displays using base64 data URL
- ✅ Changes persist across page refreshes
- ✅ No crashes or errors

### When Backend Endpoint is Available:
- ✅ Profile data saved to database
- ✅ Profile image uploaded to server
- ✅ Shows green success: "Profile updated successfully!"
- ✅ Image URL from server used in sidebar
- ✅ Changes synced across devices/sessions

## 📋 **Testing the Backend Endpoint**

Once implemented, test with:

```bash
# Using curl
curl -X PUT https://booksy-library-backend.vercel.app/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "name=John Doe" \
  -F "email=john@example.com" \
  -F "profileImage=@/path/to/image.jpg"
```

```javascript
// Using Postman
// Method: PUT
// URL: https://booksy-library-backend.vercel.app/api/auth/profile
// Headers:
//   Authorization: Bearer YOUR_JWT_TOKEN
// Body (form-data):
//   name: John Doe
//   email: john@example.com
//   currentPassword: oldpass123
//   newPassword: newpass456
//   profileImage: [file upload]
```

## 🎯 **Expected Response Format**

```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "profileImage": "https://backend.com/uploads/profiles/profile-1234567890.jpg"
  }
}
```

## 🚀 **Frontend is Ready!**

The frontend code is **fully functional** and ready to integrate with the backend as soon as the endpoint is created. No frontend changes will be needed once the backend is deployed.

### Frontend Features:
- ✅ Smart endpoint detection
- ✅ Automatic fallback to localStorage
- ✅ Base64 image encoding for local storage
- ✅ Warning messages for local-only saves
- ✅ Success messages for backend saves
- ✅ Password validation
- ✅ Image size validation
- ✅ Real-time preview
- ✅ Sidebar integration

## 📝 **Priority: Medium-High**

While the feature works locally, it's recommended to implement the backend endpoint soon so:
- Profile data is persistent across devices
- Images are properly stored on the server
- Password changes are actually saved
- Multiple users can share the same backend

## 🔗 **Related Files**

- Frontend API: `src/services/api.js` (lines 137-247)
- Frontend UI: `src/pages/Settings/Settings.jsx`
- Auth Context: `src/contexts/AuthContext.jsx`
- Sidebar: `src/components/SideBar/SideBar.jsx`

---

**Status**: ✅ Frontend working with fallback | ⏳ Backend endpoint pending
