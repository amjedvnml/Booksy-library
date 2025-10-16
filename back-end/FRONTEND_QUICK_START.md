# 🎯 Quick Frontend Integration - TL;DR

## 📍 **Your API URL:**
```
https://booksy-library-backend.vercel.app
```

---

## 🗂️ **Folder Structure to Create:**

```
your-frontend-project/
├── src/
│   ├── api/                    ← CREATE THIS!
│   │   ├── config.js          ← API base URL
│   │   ├── auth.js            ← Login, Register functions
│   │   └── books.js           ← Get books, Borrow functions
│   │
│   └── components/            ← Your existing components
```

---

## ⚡ **3 Files You Need:**

### **1. src/api/config.js**
```javascript
const API_BASE_URL = 'https://booksy-library-backend.vercel.app';

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    LOGIN: `${API_BASE_URL}/api/auth/login`,
  },
  BOOKS: {
    BASE: `${API_BASE_URL}/api/books`,
    BY_ID: (id) => `${API_BASE_URL}/api/books/${id}`,
    BORROW: (id) => `${API_BASE_URL}/api/books/${id}/borrow`,
  }
};

export default API_BASE_URL;
```

---

### **2. src/api/auth.js**
```javascript
import { API_ENDPOINTS } from './config';

// Login function
export const loginUser = async (credentials) => {
  const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (data.token) {
    localStorage.setItem('token', data.token);
  }

  return data;
};

// Register function
export const registerUser = async (userData) => {
  const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (data.token) {
    localStorage.setItem('token', data.token);
  }

  return data;
};

// Get token
export const getToken = () => localStorage.getItem('token');
```

---

### **3. src/api/books.js**
```javascript
import { API_ENDPOINTS } from './config';
import { getToken } from './auth';

// Get all books
export const getAllBooks = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters);
  const url = `${API_ENDPOINTS.BOOKS.BASE}?${queryParams}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  return await response.json();
};

// Borrow book
export const borrowBook = async (bookId) => {
  const token = getToken();

  const response = await fetch(API_ENDPOINTS.BOOKS.BORROW(bookId), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return await response.json();
};
```

---

## 🎨 **How to Use in Components:**

### **Login Component Example:**
```javascript
import { loginUser } from '../api/auth';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const data = await loginUser({ email, password });
      console.log('Logged in!', data);
      // Redirect to dashboard
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input 
        type="password" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
}
```

---

### **Books List Component Example:**
```javascript
import { getAllBooks, borrowBook } from '../api/books';

function BooksList() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    // Fetch books when component loads
    getAllBooks().then(data => {
      setBooks(data.data);
    });
  }, []);

  const handleBorrow = async (bookId) => {
    try {
      await borrowBook(bookId);
      alert('Book borrowed!');
    } catch (error) {
      alert('Failed to borrow book');
    }
  };

  return (
    <div>
      {books.map(book => (
        <div key={book._id}>
          <h3>{book.title}</h3>
          <p>{book.author}</p>
          <button onClick={() => handleBorrow(book._id)}>
            Borrow
          </button>
        </div>
      ))}
    </div>
  );
}
```

---

## 🔥 **That's It! 3 Simple Steps:**

1. **Create `src/api/` folder**
2. **Copy the 3 files above** (config.js, auth.js, books.js)
3. **Import and use in your components**

```javascript
// In any component:
import { loginUser, registerUser } from '../api/auth';
import { getAllBooks, borrowBook } from '../api/books';

// Then just call them!
await loginUser({ email, password });
await getAllBooks();
await borrowBook(bookId);
```

---

## 📚 **Full Documentation:**

See `FRONTEND_INTEGRATION_GUIDE.md` for:
- ✅ Complete API functions
- ✅ All endpoints
- ✅ Full component examples
- ✅ Protected routes setup
- ✅ Error handling patterns

---

**Your backend is live and ready to connect! 🚀**
