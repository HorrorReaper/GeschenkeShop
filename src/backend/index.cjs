const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const mysql = require('mysql2');
const cookieParser = require('cookie-parser');
const stripe = require('stripe')('sk_test_51OrGepF0DjJyfXppxn2r6PlzRB5xrHtL75nWIPsPf19uF3If8ZLDPXmMpBvYVtSO6ANIpVXw5ub7sIwVKPngrtM600G0S1gYur');
const app = express();
const port = 3000;

// Path to your JSON file
const ordersFilePath = './order.json';
// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json()); // Middleware to parse JSON request bodies
const connection = mysql.createConnection({
  host: 'localhost', 
  user: 'root', 
  password: '90BNQtOsEsXoH42HIxFX', 
  database: 'buecher'
});
connection.connect((err) => {
  if (err) {
    console.error('Fehler beim Verbinden mit der Datenbank:', err.message);
    return;
  }
  console.log('Erfolgreich mit der Datenbank verbunden!');
});
async function getUser(email){
  //get email from cookie
  console.log('email:', email);
  //get user from database
  const [rows] = await connection.promise().query('SELECT * FROM users WHERE email = ?', [email]);
  console.log('rows:', rows);
  return rows[0];
}
// Test route
app.get('/', (req, res) => res.send('Hello World!'));

// Books route
/*app.get('/books', (req, res) => {
  fs.readFile(booksJsonFilePath, 'utf8', (err, data) => {
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
});*/
app.get('/books', async (req, res) => {
  try {
    // Execute SQL query to get all books from the database
    const [rows] = await connection.promise().query('SELECT * FROM buecher');

    if (!rows || rows.length === 0) {
      // If no books are found, return an empty array
      console.log('No books found in the database.');
      return res.json([]);
    }

    // Send the books data as JSON response
    res.json(rows);
  } catch (err) {
    // Handle errors that occur during database interaction
    console.error('Error fetching books from the database:', err);
    res.status(500).send('Internal Server Error');
  }
});

/*app.post('/create-checkout-session', async (req, res) => {
  try {
    const { items, email } = req.body; // Products and user email from the cart
    console.log('email:', email);

    // Retrieve user data
    const user = await getUser(email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('Order: UserName:', user.Username, ' Email:', user.Email);

    // Insert each item in the order into the database
    const orderPromises = items.map((item) =>
      new Promise((resolve, reject) => {
        const query = 'INSERT INTO orders (ProduktID, UserID, Menge, Status) VALUES (?, ?, ?, ?)';
        connection.query(query, [item.ProduktID, user.UserID, item.quantity, 'Bestellt'], (err, results) => {
          if (err) {
            console.error('Error inserting order into the database:', err);
            reject(err);
          } else {
            console.log('Order inserted successfully:', results);
            resolve(results);
          }
        });
      })
    );

    // Wait for all database insertions to complete
    await Promise.all(orderPromises);

    // Prepare Stripe line items
    const line_items = items.map((item) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.Produkttitel,
          description: 'Test',
        },
        unit_amount: parseInt(item.PreisBrutto * 100), // Price in cents
      },
      quantity: item.quantity,
    }));

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: 'http://localhost:5173/success', // Success URL
      cancel_url: 'http://localhost:5173/cancel', // Cancel URL
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating Stripe session:', error);
    res.status(500).json({ error: 'An error occurred, please try again later.' });
  }
});*/
app.post('/create-checkout-session', async (req, res) => {
  try {
    const { items, email } = req.body; // Products and user email from the cart
    console.log('email:', email);

    // Retrieve user data
    const user = await getUser(email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('Order: UserName:', user.Username, ' Email:', user.Email);

    // Insert each item in the order into the database
    const orderPromises = items.map((item) =>
      new Promise((resolve, reject) => {
        const query = 'INSERT INTO orders (ProduktID, UserID, Menge, Status) VALUES (?, ?, ?, ?)';
        connection.query(query, [item.ProduktID, user.UserID, item.quantity, 'Bestellt'], (err, results) => {
          if (err) {
            console.error('Error inserting order into the database:', err);
            reject(err);
          } else {
            console.log('Order inserted successfully:', results);
            resolve(results);
          }
        });
      })
    );

    // Update stock for each item in the database
    const stockUpdatePromises = items.map((item) =>
      new Promise((resolve, reject) => {
        const stockQuery = 'UPDATE buecher SET Lagerbestand = Lagerbestand - ? WHERE ProduktID = ?';
        connection.query(stockQuery, [item.quantity, item.ProduktID], (err, results) => {
          if (err) {
            console.error('Error updating stock:', err);
            reject(err);
          } else {
            console.log('Stock updated successfully for ProduktID:', item.ProduktID);
            resolve(results);
          }
        });
      })
    );

    // Wait for all database operations to complete
    await Promise.all([...orderPromises, ...stockUpdatePromises]);

    // Prepare Stripe line items
    const line_items = items.map((item) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.Produkttitel,
          description: 'Test',
        },
        unit_amount: parseInt(item.PreisBrutto * 100), // Price in cents
      },
      quantity: item.quantity,
    }));

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: 'http://localhost:5173/success', // Success URL
      cancel_url: 'http://localhost:5173/cancel', // Cancel URL
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating Stripe session:', error);
    res.status(500).json({ error: 'An error occurred, please try again later.' });
  }
});



// Login route
/*app.post('/login', (req, res) => {
  const { email, password } = req.body; // Destructure email and password from request body
  
  if (email === 'admin@admin.com' && password === 'admin24') {
    res.status(200).json({ success: true, message: 'Login successful' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});*/
app.post('/login', async (req, res) => {
  const { email, password } = req.body; // Destructure email and password from request body
  
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  try {
    // Query the database to find the user with the given email
    const query = 'SELECT * FROM users WHERE email = ?';
    connection.query(query, [email], (err, results) => {
      if (err) {
        console.error('Error querying the database:', err);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
      }

      // Check if user exists
      if (results.length === 0) {
        return res.status(401).json({ success: false, message: 'Invalid credentials 1' });
      }

      const user = results[0]; // Get the first user from the results

      // Compare the provided password with the stored password
      if (user.Password === password.trim()) { // In production, use hashed passwords and compare with bcrypt
        res.status(200).json({ success: true, message: 'Login successful' });
      } else {
        res.status(401).json({ success: false, message: 'Invalid credentials 2' });
      }
    });
  } catch (error) {
    console.error('Error handling login:', error);
    res.status(500).json({ success: false, message: 'An error occurred, please try again later.' });
  }
});
app.get('/books/:ProduktID', async (req, res) => {
  const bookId = parseInt(req.params.ProduktID, 10); // Konvertiere die ID aus der Route in eine Zahl

  if (isNaN(bookId)) {
    return res.status(400).json({ error: 'Invalid ProduktID' }); // Gültigkeitsprüfung für die ID
  }

  try {
    // SQL-Abfrage, um das Buch mit der gegebenen ID abzurufen
    const [rows] = await connection.promise().query('SELECT * FROM buecher WHERE ProduktID = ?', [bookId]);

    console.log('rows:', rows);
    if (rows.length === 0) {
      // Wenn kein Buch gefunden wurde, gib einen 404-Fehler zurück
      console.log('Buch wurde nicht gefunden');
      return res.status(404).json({ error: 'Book not found' });
    }

    // Buch gefunden, Rückgabe der Buchdaten
    console.log('Buch wurde gefunden');
    res.json(rows[0]); // Nur die tatsächlichen Daten zurückgeben
  } catch (err) {
    console.error('Error fetching book from the database:', err);
    res.status(500).send('Internal Server Error');
  }
});
// Stripe Webhook um Bestellungen zu erfassen
app.post('/webhook', async (req, res) => {
  const endpointSecret = 'whsec_your_webhook_secret'; // Webhook Secret von Stripe Dashboard

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Nur auf relevante Events reagieren
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Die Bestellung speichern
    const order = {
      id: session.id,
      amount: session.amount_total / 100, // Betrag in Euro
      currency: session.currency,
      email: session.customer_details.email,
      items: session.metadata.items, // Artikel aus Metadaten
      date: new Date().toISOString(),
    };

    try {
      const orders = JSON.parse(fs.readFileSync(ordersFilePath, 'utf8'));
      orders.push(order);
      fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2));
      console.log('Order saved successfully:', order);
    } catch (error) {
      console.error('Error saving order:', error);
    }
  }

  res.json({ received: true });
});
//für das Admin-Panel die verfügbaren Bücher abrufen
app.get('/available-books', async (req, res) => {
  try {
    const [rows] = await connection.promise().query('SELECT * FROM buecher WHERE Lagerbestand > 0');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching available books from the database:', err);
    res.status(500).send('Internal Server Error');
  }
});
/*app.get('/orders', (req, res) => {
  try {
    const orders = JSON.parse(fs.readFileSync(ordersFilePath, 'utf8'));
    console.log('Orders:', orders);
    res.json(orders);
  } catch (error) {
    console.error('Error reading orders:', error);
    res.status(500).json({ error: 'An error occurred, please try again later.' });
  }
});*/
app.get('/orders', (req, res) => {
  const query = 'SELECT o.BestellNr, u.Username, u.Email, b.Produktcode, b.Produkttitel, b.Preisbrutto, o.Menge, o.Status, o.Menge*b.Preisbrutto AS Gesamtpreis FROM orders o, users u, buecher b WHERE o.ProduktID = b.ProduktID AND o.UserID = u.UserID;'; // SQL query to fetch all orders
  
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching orders from the database:', err);
      return res.status(500).json({ error: 'An error occurred, please try again later.' });
    }

    console.log('Orders:', results);
    res.json(results); // Send the fetched orders as JSON
  });
});
// Start the server
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
