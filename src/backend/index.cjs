const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const stripe = require('stripe')('sk_test_51OrGepF0DjJyfXppxn2r6PlzRB5xrHtL75nWIPsPf19uF3If8ZLDPXmMpBvYVtSO6ANIpVXw5ub7sIwVKPngrtM600G0S1gYur');
const app = express();
const port = 3000;

// Path to your JSON file
const jsonFilePath = path.join(__dirname, 'books.json');
const ordersFilePath = './orders.json';
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
app.post('/create-checkout-session', async (req, res) => {
  try {
    const { items } = req.body; // Produkte aus dem Warenkorb

    const line_items = items.map((item) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.Produkttitel,
          description: item.Kurzinhalt,
        },
        unit_amount: parseInt(item.PreisBrutto * 100), // Preis in Cent
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: 'http://localhost:5173/success', // Erfolg-URL
      cancel_url: 'http://localhost:5173/cancel', // Abbruch-URL
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating Stripe session:', error);
    res.status(500).json({ error: 'An error occurred, please try again later.' });
  }
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
// Stripe Webhook
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
// Start the server
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
