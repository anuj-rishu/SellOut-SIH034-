# Indian Museum API

A comprehensive RESTful API providing information about museums across India. Access data on museum locations, opening hours, contact information, and more.

## 🔗 Live API

[Indian Museum API](https://museum-api-indian.vercel.app/)

## 📋 Overview

This API provides access to a database of museums across India, including metropolitan centers and remote cultural heritage sites. The database includes comprehensive information such as:

- Museum names and locations
- Opening and closing hours
- Contact information
- Geographic coordinates
- Full address details

## 🚀 API Endpoints

### **Base URL:**

```
https://museum-api-indian.vercel.app/
```

### **Health Check**

```
GET /api/health
```

Response: Confirms if the API is running.

### **Get All Museums**

```
GET /api/museums
```

Returns a list of all museums in the database.

### **Search Museums by City**

```
GET /api/museums/city/{city_name}
```

Example: `/api/museums/city/Mumbai`
Returns all museums in the specified city.

### **Find Nearby Museums by PIN Code**

```
GET /api/museums/nearby/pincode/{pincode}
```

Example: `/api/museums/nearby/pincode/400001`
Returns museums near the specified PIN code area.

## 📊 Example Response

```json
{
  "name": "Chhatrapati Shivaji Maharaj Vastu Sangrahalaya",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "address": "159-161, Mahatma Gandhi Road, Kala Ghoda, Fort, Mumbai",
  "contact": "+91 22 2284 4484",
  "opening_hours": "10:15 AM - 6:00 PM"
}
```

## 💻 Local Development

### **Prerequisites**

- Node.js (v14 or later)
- MongoDB
- npm or yarn

### **Installation**

1. Clone the repository:
   ```sh
   git clone https://github.com/anuj-rishu/Open-Source-APIs/tree/main/Museum-Api
   cd Museum-Api
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables by creating a `.env` file based on the example provided.
4. Start the development server:
   ```sh
   npm start
   ```

## 🤝 Contributing

We welcome contributions to improve the Museum API!

### **How to Contribute**

1. Fork the repository.
2. Create your feature branch:
   ```sh
   git checkout -b feature-branch
   ```
3. Commit your changes:
   ```sh
   git commit -m "Add new feature"
   ```
4. Push to the branch:
   ```sh
   git push origin feature-branch
   ```
5. Open a Pull Request.

### **Contribution Guidelines**

- Ensure your code adheres to the existing style.
- Keep API responses consistent with the current format.
- Write meaningful commit messages.
- Update documentation as needed.

## 📚 Data Sources

The museum data is compiled from various official sources including:

- Archaeological Survey of India
- Ministry of Culture
- State Tourism Departments
- Individual Museum Websites

---

Developed by [Anuj Rishu](https://github.com/anuj-rishu).
