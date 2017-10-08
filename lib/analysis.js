const axios = require('axios');

const twitterFlagFinder = (tweets, socket) => {
  const curseWords = [
    'anal',
    'arse',
    'ass',
    'ballsack',
    'balls',
    'bastard',
    'bitch',
    'biatch',
    'bloody',
    'blowjob',
    'blow job',
    'bollock',
    'bollok',
    'boner',
    'boob',
    'bugger',
    'bum',
    'butt',
    'buttplug',
    'clitoris',
    'cock',
    'coon',
    'crap',
    'cunt',
    'damn',
    'dick',
    'dildo',
    'dyke',
    'fag',
    'feck',
    'fellate',
    'fellatio',
    'felching',
    'fuck',
    'f u c k',
    'fudgepacker',
    'fudge packer',
    'flange',
    'Goddamn',
    'God damn',
    'hell',
    'homo',
    'jerk',
    'jizz',
    'knobend',
    'knob end',
    'labia',
    'muff',
    'nigger',
    'nigga',
    'penis',
    'piss',
    'poop',
    'prick',
    'pube',
    'pussy',
    'scrotum',
    'sex',
    'shit',
    's hit',
    'sh1t',
    'slut',
    'smegma',
    'spunk',
    'tosser',
    'turd',
    'twat',
    'vagina',
    'wank',
    'whore',
  ];

  const newFlaggedArray = [];

  for (let k = 0; k < curseWords.length; k += 1) {
    Object.keys(tweets).forEach(index => {
      const tweet = tweets[index];
      const text = tweet.text;
      if (text.indexOf(curseWords[k]) !== -1) {
        newFlaggedArray.push(tweet);
      }
    });
  }

  console.log('Twitter:', newFlaggedArray);
  socket.emit('messageChannel', { type: 'twitter', data: newFlaggedArray });

  return newFlaggedArray;
};

const visionRequest = (instagrams, socket) => {
  let time = 0;
  return Promise.all(
    instagrams.map(instagram => {
      time += 1500;
      return setTimeout(() => {
        axios({
          method: 'post',
          url:
            'https://southcentralus.api.cognitive.microsoft.com/customvision/v1.0/Prediction/4318bf71-99ef-4450-80bd-60d6df684647/url?iterationId=478b096d-b43d-4812-bb4a-91d44d71058f',
          headers: {
            'Prediction-Key': 'b873bc7488404c01a3eef00ac055a53c',
          },
          data: {
            url: instagram.display_src,
          },
        })
          .then(response => {
            if (!response || !response.data) {
              return console.error('response not valid');
            }

            const { data } = response;
            data._id = data.id;
            delete data.id;
            if (data.Predictions[0].Probability > 0.6) {
              console.log('Instagram:', instagram, data);
              socket.emit('messageChannel', {
                type: 'instagram',
                instagram,
                analysis: data,
              });
            }
          })
          .catch(err => {
            console.error(err);
          });
      }, time);
    })
  );
};

module.exports = {
  twitterFlagFinder,
  visionRequest,
};
