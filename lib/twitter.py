import sys
import os
from twitterscraper import query_tweets

id = sys.argv[1]
username = sys.argv[2]

try:
    os.makedirs('./data/' + id)
except OSError as exception:
    if exception.errno != errno.EEXIST:
        raise

twitterFile = open('./data/' + id + '/twitterData.txt', 'wb')

for tweet in query_tweets('from%3A' + username, 100)[:100]:
    text = (tweet.text + '\n').encode('utf-8')
    twitterFile.write(text)

twitterFile.close()
