const axios = require('axios');
const config = require('../config');

const searchBing = searchQuery =>
  axios({
    method: 'get',
    url: 'https://api.cognitive.microsoft.com/bing/v7.0/search',
    headers: {
      'Ocp-Apim-Subscription-Key': config.bing.key,
    },
    params: {
      count: 50,
      responseFilter: 'Webpages',
      q: encodeURIComponent(searchQuery),
    },
  })
    .then(response => {
      if (!response || !response.data) {
        return console.error('response not valid');
      }

      const relevantResults = {
        facebook: [],
        twitter: [],
        instagram: [],
        github: [],
        devpost: [],
      };

      const { data } = response;
      const { webPages } = data;
      const results = webPages.value;
      for (let i = 0; i < results.length; i += 1) {
        const result = results[i];
        const { url } = result;
        const separators = ['/', '\\?'];
        const splitUrl = url.split(new RegExp(separators.join('|'), 'g'));
        for (let j = 0; j < splitUrl.length; j += 1) {
          const splitUrlElement = splitUrl[j];
          if (splitUrlElement.indexOf('.com') > -1) {
            console.log(splitUrlElement);
            if (splitUrl.length >= j + 1) {
              const nextElement = splitUrl[j + 1];
              if (['facebook.com', 'www.facebook.com'].includes(splitUrlElement)) {
                if (nextElement !== 'public') {
                  relevantResults.facebook.push({
                    display: nextElement,
                    url,
                  });
                } else if (splitUrl.length >= j + 2) {
                  const nextNextElement = splitUrl[j + 2];
                  relevantResults.facebook.push({
                    display: nextNextElement,
                    url,
                  });
                }
              } else if (['twitter.com', 'www.twitter.com'].includes(splitUrlElement)) {
                relevantResults.twitter.push({
                  display: nextElement,
                  url,
                });
              } else if (['instagram.com', 'www.instagram.com'].includes(splitUrlElement)) {
                relevantResults.instagram.push({
                  display: nextElement,
                  url,
                });
              } else if (['github.com', 'www.github.com'].includes(splitUrlElement)) {
                relevantResults.github.push({
                  display: nextElement,
                  url,
                });
              } else if (['devpost.com', 'www.devpost.com'].includes(splitUrlElement)) {
                if (nextElement !== 'software') {
                  relevantResults.devpost.push({
                    display: nextElement,
                    url,
                  });
                } else if (splitUrl.length >= j + 2) {
                  const nextNextElement = splitUrl[j + 2];
                  relevantResults.devpost.push({
                    display: nextNextElement,
                    url,
                  });
                }
              }
            }
          }
        }
      }
      console.log(relevantResults);
      return relevantResults;
    })
    .catch(err => {
      console.error(err);
    });

module.exports = {
  searchBing,
};
