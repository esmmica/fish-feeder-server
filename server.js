const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.text());

let lastCommand = 'S'; // Default to Stop

app.post('/control', (req, res) => {
  lastCommand = req.body;
  console.log('Received command:', lastCommand);
  res.send('Command received');
});

app.get('/command', (req, res) => {
  res.send(lastCommand);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
