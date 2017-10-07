const express = require('express');
const path = require('path');
const { spawn } = require('child_process');

const router = express.Router();

router.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

router.post('/data', (req, res) => {
  const { username } = req.body;
  const { id } = req.session;

  const twitterChild = spawn('python', ['lib/twitter.py', id, username]);
  console.log('twitterChild process initiated');
  twitterChild.on('exit', (code, signal) => {
    console.log(`twitterChild process exited with code ${code} and signal ${signal}`);
  });

  const instagramChild = spawn('python', ['lib/instagram.py', id, username]);
  console.log('instagramChild process initiated');
  instagramChild.on('exit', (code, signal) => {
    console.log(`instagramChild process exited with code ${code} and signal ${signal}`);
  });

  res.json();
});

module.exports = router;
