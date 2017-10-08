import sys
import os
import errno
import json
from twitterscraper import query_tweets

id = sys.argv[1]
username = sys.argv[2]

try:
    os.makedirs('./data/' + id)
except OSError as exception:
    if exception.errno != errno.EEXIST:
        raise

data = {
    'tweets': []
}

for tweet in query_tweets('from%3A' + username, 300)[:300]:
    text = (tweet.text + '\n').encode('utf-8')
    data['tweets'].append({
        '_id': tweet.id,
        'text': tweet.text
    })

with open('./data/' + id + '/twitterData.json', 'w') as outfile:
    json.dump(data, outfile, indent=4)
