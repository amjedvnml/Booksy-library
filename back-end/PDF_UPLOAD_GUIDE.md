# 📚 Book Upload with PDF Files - Complete Guide

## ✅ What Was Fixed

The backend now supports **both JSON and file uploads** for creating books.

### The Problem
- Frontend was sending PDF files with `multipart/form-data`
- Backend was expecting `application/json`
- This caused **"Request body is missing or invalid"** error

### The Solution
- ✅ Installed `multer` for file handling
- ✅ Created upload middleware for PDFs
- ✅ Updated routes to accept files
- ✅ Updated controller to handle both formats
- ✅ Added PDF fields to Book model

---

## 📤 How to Send Requests

### Option 1: With PDF File (multipart/form-data)

```javascript
const formData = new FormData();
formData.append('title', 'My Book');
formData.append('author', 'John Doe');
formData.append('isbn', '1234567890');
formData.append('category', 'Fiction');
formData.append('totalCopies', '5');
formData.append('pdfFile', pdfFileObject); // The actual PDF file

const response = await fetch('https://booksy-library-backend.vercel.app/api/books', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
    // DON'T set Content-Type - browser sets it automatically with boundary
  },
  body: formData
});
```

### Option 2: Without PDF File (JSON)

```javascript
const response = await fetch('https://booksy-library-backend.vercel.app/api/books', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    title: 'My Book',
    author: 'John Doe',
    isbn: '1234567890',
    category: 'Fiction',
    totalCopies: 5
  })
});
```

---

## 🎯 Frontend Form Example

```html
<form id="bookForm">
  <input type="text" name="title" placeholder="Book Title" required />
  <input type="text" name="author" placeholder="Author" required />
  <input type="text" name="isbn" placeholder="ISBN" required />
  <select name="category" required>
    <option value="Fiction">Fiction</option>
    <option value="Non-Fiction">Non-Fiction</option>
    <option value="Science">Science</option>
  </select>
  <input type="number" name="totalCopies" placeholder="Total Copies" required />
  <input type="file" name="pdfFile" accept=".pdf" /> <!-- Optional -->
  <button type="submit">Add Book</button>
</form>

<script>
document.getElementById('bookForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('https://booksy-library-backend.vercel.app/api/books', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    const data = await response.json();
    
    if (data.success) {
      alert('Book added successfully!');
      e.target.reset();
    } else {
      alert('Error: ' + data.message);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to add book');
  }
});
</script>
```

---

## 📋 Book Model Fields

After upload, books will have these fields:

```javascript
{
  _id: "...",
  title: "My Book",
  author: "John Doe",
  isbn: "1234567890",
  category: "Fiction",
  totalCopies: 5,
  availableCopies: 5,
  
  // PDF info (if file uploaded)
  hasPDF: true,
  pdfFileName: "mybook.pdf",
  pdfSize: 1048576,  // bytes
  
  addedBy: "671...",  // User ID
  createdAt: "2024-...",
  updatedAt: "2024-..."
}
```

---

## 🔧 File Upload Limits

- **Allowed format**: PDF only
- **Max size**: 10MB
- **Storage**: Memory (for now)
- **Field name**: `pdfFile`

---

## 🚀 Deploy to Vercel

The changes are already pushed to GitHub. Vercel will auto-deploy in 2-3 minutes.

**Manual redeploy if needed:**
1. Go to Vercel Dashboard
2. Select your backend project
3. Deployments → Latest → "..." → Redeploy

---

## 🧪 Test with cURL (PowerShell)

```powershell
# Without PDF
$headers = @{
    "Content-Type"="application/json"
    "Authorization"="Bearer YOUR_TOKEN"
}
$body = '{"title":"Test Book","author":"Test Author","isbn":"1234567890","category":"Fiction","totalCopies":5}'
Invoke-RestMethod -Uri "https://booksy-library-backend.vercel.app/api/books" -Method POST -Headers $headers -Body $body

# With PDF (requires file)
# Use Postman or frontend for file uploads
```

---

## ✅ Next Steps

1. **Wait 2-3 minutes** for Vercel deployment
2. **Update your frontend** to use `FormData` (see example above)
3. **Test book creation** with and without PDF
4. *(Optional)* Add cloud storage (S3, Cloudinary) for PDF files

---

## 🆘 Still Having Issues?

Check:
1. **Authorization header** is included
2. **FormData** is being sent (not JSON) when uploading files
3. **File field name** is `pdfFile`
4. **File is PDF** and under 10MB
5. **Token is valid** and not expired

---

**🎉 Your backend now supports PDF uploads!**
