import re
from bs4 import BeautifulSoup
import zipfile
from tensorflow import keras
from pathlib import Path

emoji_pattern = re.compile("["
        u"\U0001F600-\U0001F64F"  # emoticons
        u"\U0001F300-\U0001F5FF"  # symbols & pictographs
        u"\U0001F680-\U0001F6FF"  # transport & map symbols
        u"\U0001F1E0-\U0001F1FF"  # flags (iOS)
                           "]+", flags=re.UNICODE)
url_pattern = re.compile('''((https?:\/\/)?(?:www\.|(?!www))[a-zA-Z0-9]([a-zA-Z0-9-]+[a-zA-Z0-9])?\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})''',
                         flags=re.UNICODE)
mention_pattern = re.compile('([^a-zA-Z0-9]|^)@\S+', flags=re.UNICODE)
mention_pattern2 = re.compile('([^0-9]|^)MENTION\S+', flags=re.UNICODE)
hashtag_pattern = re.compile('([^a-zA-Z0-9]|^)#\S+', flags=re.UNICODE)
rt_pattern = re.compile('([^a-zA-Z0-9]|^)(rt|ht|cc|RT)([^a-zA-Z0-9]|$)', flags=re.UNICODE)

def detweet(text):
    return re.sub(url_pattern, '',
               re.sub(rt_pattern, '',
                      re.sub(mention_pattern2, '',
                         re.sub(mention_pattern, '',
                             re.sub(hashtag_pattern, '',
                                 re.sub(emoji_pattern, '',
                                    text))))))
def normalize(text):
    return re.sub(r"\s+", " ", #remove extra spaces
                  re.sub(r'[^a-zA-Z0-9]', ' ', #remove non alphanumeric, incl punctuation
                         text)).lower().strip() #lowercase and strip
def fix_encoding_and_unescape(text):
    return BeautifulSoup(text.decode('unicode-escape')).get_text()
def preprocess(text, fix_encoding=False):
    if (type(text)==str) or (type(text)==unicode):
        if fix_encoding:
            return normalize(detweet(fix_encoding_and_unescape(text)))
        else:
            return normalize(detweet(text))
    else:
        return text

def get_model():
    path = Path("./static/assets/vectorizedNNe2e/saved_model.pb")
    if not path.is_file():
        with zipfile.ZipFile("./static/assets/vectorizedNNe2e.zip") as zip_ref:
            zip_ref.extractall("./static/assets")
    return keras.models.load_model("./static/assets/vectorizedNNe2e")
