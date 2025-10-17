# ✅ Profile Update Route - Quick Reference

## 🎯 **New Route:**

```
PUT /api/auth/profile
```

---

## ⚡ **Quick Usage:**

### **Frontend API Call:**

```javascript
// Update profile with avatar
const updateProfile = async (userData) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('https://booksy-library-backend.vercel.app/api/auth/profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(userData)
  });
  
  return await response.json();
};

// Example usage:
await updateProfile({
  name: "John Doe",
  phone: "+1-234-567-8900",
  avatar: "https://i.imgur.com/yourphoto.jpg"
});
```

---

## 📋 **What You Can Update:**

- ✅ `name` - Your full name
- ✅ `phone` - Phone number
- ✅ `avatar` - Profile photo URL
- ✅ `address` - Full address object

---

## 🧪 **Quick Test:**

```bash
# Get your token first (login)
curl -X POST https://booksy-library-backend.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"yourpassword"}'

# Then update profile (use token from above)
curl -X PUT https://booksy-library-backend.vercel.app/api/auth/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"avatar":"https://i.imgur.com/example.jpg"}'
```

---

## 📸 **Avatar Options:**

### **1. Upload to Imgur:**
1. Go to https://imgur.com/
2. Upload your photo
3. Copy the direct link (right-click → Copy image address)
4. Use in your profile: `https://i.imgur.com/abc123.jpg`

### **2. Upload to Cloudinary:**
1. Sign up at https://cloudinary.com/
2. Upload image
3. Get public URL
4. Use in profile

### **3. Use Gravatar:**
- Automatic based on email
- No upload needed!

---

## ✅ **Status:**

- ✅ Route created: `/api/auth/profile`
- ✅ Controller updated
- ✅ Avatar field supported
- ✅ Tested locally
- ✅ Committed to Git
- ✅ Ready to use!

---

## 📚 **Full Documentation:**

See `PROFILE_UPDATE_API.md` for complete details including:
- Full API reference
- Frontend integration examples
- Error handling
- Validation rules
- Complete React component example

---

**Your backend is ready for profile updates with photos!** 🎉
