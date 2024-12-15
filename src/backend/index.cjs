const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

// Path to your JSON file
const jsonFilePath = path.join(__dirname, 'books.json');

// Middleware
app.use(cors());
app.use(express.json()); // Middleware to parse JSON request bodies

// Test route
app.get('/', (req, res) => res.send('Hello World!'));

// Books route
app.get('/books', (req, res) => {
  fs.readFile(jsonFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the JSON file:', err);
      return res.status(500).send('Internal Server Error');
    }
    try {
      const jsonData = JSON.parse(data); // Parse the file to ensure valid JSON
      res.json(jsonData); // Send the JSON data
    } catch (parseErr) {
      console.error('Error parsing JSON:', parseErr);
      res.status(500).send('Invalid JSON format');
    }
  });
});

// Login route
app.post('/login', (req, res) => {
  const { email, password } = req.body; // Destructure email and password from request body

  if (email === 'admin@admin.com' && password === 'admin24') {
    res.status(200).json({ success: true, message: 'Login successful' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});
app.get('/books/:ProduktID', (req, res) => {
  const bookIdd = parseInt(req.params.ProduktID, 10); // Convert the id from the route to an integer
  console.log(bookIdd);
  fs.readFile(jsonFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the JSON file:', err);
      return res.status(500).send('Internal Server Error');
    }

    try {
      const books = JSON.parse(data); // Parse the JSON file
      console.log(books);
      const book = books.find((b) => String(b.ProduktID) === String(bookIdd)); // Find the book with the given ID

      if (!book) {
        // If no book is found, return a 404
        console.log("Buch wurde nicht gefunden");
        return res.status(404).json({ error: 'Book not found' });
      }
      console.log("Buch wurde gefunden");
      res.json(book); // Send the book as a response
    } catch (parseErr) {
      console.error('Error parsing JSON:', parseErr);
      res.status(500).send('Invalid JSON format');
    }
  });
})
// Start the server
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
