const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const request = require('request');

app.use(express.json());

// Temporary storage
let latestSensorData = {};
let latestCommand = null;

// ESP32 -> Render: send sensor data
app.post('/sensor_data', (req, res) => {
  latestSensorData = req.body;
  console.log('Sensor data received:', latestSensorData);
  res.status(200).json({ message: 'Sensor data stored' });
});

// Flutter -> Render: get sensor data
app.get('/get_sensor_data', (req, res) => {
  res.json(latestSensorData);
});

// Flutter -> Render: send command
app.post('/send_command', (req, res) => {
  latestCommand = req.body;
  console.log('Command received from Flutter:', latestCommand);
  res.status(200).json({ message: 'Command stored' });
});

// ESP32 -> Render: get latest command
app.get('/get_command', (req, res) => {
  res.json(latestCommand || {});
  latestCommand = null; // Clear command after ESP32 receives it
});

// Camera stream proxy endpoint
app.get('/camera_stream', (req, res) => {
  // Assuming the ESP32 is set to stream via a local URL (you can update this URL dynamically based on your setup)
  const streamUrl = 'http://esp32-cam.local:81/stream';  // Adjust the stream URL to match your ESP32-CAM's URL

  // Forward the request to the ESP32-CAM stream
  req.pipe(request(streamUrl)).pipe(res);
});

// Start server
app.listen(port, () => {
  console.log(`Cloud server running on port ${port}`);
});
