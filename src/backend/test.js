const connection = mysql.createConnection({
    host: '127.0.0.1', 
    user: 'g25', 
    password: 'hum57fix', 
    database: 'g25'
  });
  connection.connect((err) => {
    if (err) {
      console.error('Fehler beim Verbinden mit der Datenbank:', err.message);
      return;
    }
    console.log('Erfolgreich mit der Datenbank verbunden!');
  });
  
  // Beispielabfrage
  connection.query('SELECT * FROM users', (err, results) => {
    if (err) throw err;
    console.log('Ergebnisse:', results);
    res.send(results);
  });
  
  connection.end();