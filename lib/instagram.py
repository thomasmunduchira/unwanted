import sys
import os
import errno
import shutil
from instaLooter import InstaLooter

id = sys.argv[1]
username = sys.argv[2]

try:
    os.makedirs('./data/' + id + '/instagramData')
except OSError as exception:
    if exception.errno != errno.EEXIST:
        raise

try:
    shutil.rmtree('./data/' + id + '/instagramData')
except OSError as e:
    print('Error: %s - %s.' % (e.filename,e.strerror))

looter = InstaLooter(profile=username, dump_only=True, directory='./data/' + id + '/instagramData')
looter.download()
