from views import (
    GetIndex,
    AutoComplete,
    Search,
    Next,
    IndexFormat
)


# list with each access point in dict format
urls = [
    {
        'resource': GetIndex,
        'path': '/get_index',
        'endpoint': 'get_index',
    },
    {
        'resource': AutoComplete,
        'path': '/autocomplete',
        'endpoint': 'autocomplete',
    },
    {
        'resource': Search,
        'path': '/search',
        'endpoint': 'search',
    },
    {
        'resource': Next,
        'path': '/next',
        'endpoint': 'next',
    },
    {
        'resource': IndexFormat,
        'path': '/index_format',
        'endpoint': 'index_format',
    }
]
