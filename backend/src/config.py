import os

### azsearch data ###
AZ_SEARCH_ENDPOINT = os.environ.get('AZ_SEARCH_URL', '')
AZ_SEARCH_APIKEY = os.environ.get('AZ_SEARCH_APIKEY', '')
AZ_SEARCH_APIVERSION = '2020-06-30'

PROD = os.environ.get('PROD', False)

PORT = os.environ.get('PORT', 443)

HEADERS = {
    'Content-Type': 'Content-Type',
    'api-key': AZ_SEARCH_APIKEY,
}

INDEXES_FILE = 'data/indexes_dict.pkl'
