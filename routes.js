const express = require('express');
const path = require('path');
const fs = require('mz/fs');
const { exec } = require('mz/child_process');

const analysis = require('./lib/analysis');

const router = express.Router();

router.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

router.post('/data', req => {
  const { username } = req.body;
  const { id } = req.session;

  console.log('twitterChild process initiated');
  exec(`python lib/twitter.py ${id} ${username}`)
    .then((stdout, stderr) => {
      console.log('twitterChild process exited');
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
    })
    .then(() => fs.readFile(`./data/${req.session.id}/twitterData.json`, 'utf-8'))
    .then(content => {
      content = JSON.parse(content);
      return content;
    })
    .then(content => analysis.twitterFlagFinder(content.tweets))
    .then(response => console.log(response))
    .catch(err => {
      console.log(err);
    });

  console.log('instagramChild process initiated');
  exec(`python lib/instagram.py ${id} ${username}`)
    .then((stdout, stderr) => {
      console.log('instagramChild process exited');
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
    })
    .then(() => fs.readdir(`./data/${req.session.id}/instagramData`))
    .then(filenames =>
      Promise.all(
        filenames.map(filename =>
          fs.readFile(`./data/${req.session.id}/instagramData/${filename}`, 'utf-8')
        )
      )
    )
    .then(contents => {
      const urls = [];
      for (let i = 0; i < contents.length; i += 1) {
        let content = contents[i];
        content = JSON.parse(content);
        urls.push(content.display_src);
      }
      console.log(urls);
      return urls;
    })
    .then(urls => analysis.visionRequest(urls))
    .then(response => console.log(response))
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
