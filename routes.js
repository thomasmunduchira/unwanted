const express = require('express');
// const path = require('path');
const fs = require('mz/fs');
const { exec } = require('mz/child_process');

const bing = require('./lib/bing');
const analysis = require('./lib/analysis');

// const Email = require('./models/email');
const InstagramPost = require('./models/instagramPost');
// const Socket = require('./models/socket');
const Tweet = require('./models/tweet');
// const User = require('./models/user');

const router = express.Router();

const saveInstagramPosts = instagramPosts => {
  InstagramPost.create(instagramPosts).catch(err => {
    console.log(err);
  });
};

const saveTweets = tweets => {
  Tweet.create(tweets).catch(err => {
    console.log(err);
  });
};

const returnData = (username, socket) =>
  bing
    .searchBing(username)
    .then(results => {
      socket.emit('messageChannel', {
        type: 'links',
        links: results,
      });
      console.log('twitterChild process initiated');
      const twitterData = {};
      exec(`python lib/twitter.py ${socket.id} ${results.twitter[0]}`)
        .then((stdout, stderr) => {
          console.log('twitterChild process exited');
          console.log(`stdout: ${stdout}`);
          console.log(`stderr: ${stderr}`);
        })
        .then(() => fs.readFile(`./data/${socket.id}/twitterData.json`, 'utf-8'))
        .then(content => {
          twitterData.content = JSON.parse(content);
          return content;
        })
        .then(content => analysis.twitterFlagFinder(content.tweets, socket))
        .then(() => saveTweets(twitterData.content.tweets))
        .catch(err => {
          console.log(err);
        });

      console.log('instagramChild process initiated');
      const instagramData = {};
      exec(`python lib/instagram.py ${socket.id} ${results.instagram[0]}`)
        .then((stdout, stderr) => {
          console.log('instagramChild process exited');
          console.log(`stdout: ${stdout}`);
          console.log(`stderr: ${stderr}`);
        })
        .then(() => fs.readdir(`./data/${socket.id}/instagramData`))
        .then(filenames =>
          Promise.all(
            filenames.map(filename =>
              fs.readFile(`./data/${socket.id}/instagramData/${filename}`, 'utf-8')
            )
          )
        )
        .then(contents => {
          for (let i = 0; i < contents.length; i += 1) {
            const content = contents[i];
            content._id = content.id;
            delete content.id;
            contents[i] = JSON.parse(content);
          }
          instagramData.contents = contents;
          return contents;
        })
        .then(contents => analysis.visionRequest(contents, socket))
        .then(() => saveInstagramPosts(instagramData.contents))
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
    });

module.exports = () => {
  router.locals = {};
  router.locals.returnData = returnData;
  return router;
};
