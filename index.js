const express = require('express');

const app = express(); 
const port = 3000;  

app.get('/', (req, res) => {    // req is the request object, res is the response object
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
}); 