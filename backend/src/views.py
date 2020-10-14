import os
import pickle
import json
import requests as r
from flask import request
from flask_restful import Resource
from flask_cors import cross_origin
from config import HEADERS, AZ_SEARCH_ENDPOINT, AZ_SEARCH_APIVERSION, INDEXES_FILE


class GetIndex(Resource):

    def __init__(self):
        super(GetIndex, self).__init__()

    @cross_origin()
    def get(self):
        url = AZ_SEARCH_ENDPOINT + 'indexes?api-version=' + AZ_SEARCH_APIVERSION  # + '&$select=name'
        res = r.get(url, headers=HEADERS)
        if res.ok:
            return res.json(), 200
        return {}, 404


class AutoComplete(Resource):

    def __init__(self):
        super(AutoComplete, self).__init__()

    @cross_origin()
    def get(self):
        """
        Method to validate email
        """
        query = request.args.get('q', '')
        index = request.args.get('index', '')
        url = AZ_SEARCH_ENDPOINT + 'indexes/' + index + '/docs/autocomplete?&api-version=' + AZ_SEARCH_APIVERSION \
            + '&search=' + query + '&$top=5&suggesterName=' + 'sg'  # TODO: ver suggesterName
        res = r.get(url, headers=HEADERS)
        if res.ok:
            return res.json(), 200
        return {}, 404


class Search(Resource):
    """
    Class user which allow register, login and logout an user
    """

    def __init__(self):
        super(Search, self).__init__()
        self.select_list = ["idFallo", "Materia", "TribunalEmisor", "LetraCausa", "NumeroCausa", "ExtensionCausa",
                            "Fecha", "CaratulaPublica", "MagVotantes", "TextoFallo", "JuezVoto", "Observacion",
                            "ResultadoVoto", "IdSumario", "Alcance", "ObservacionSumario", "TextoSumario",
                            "VozPrincipal", "VozSecundaria"]

    @cross_origin()
    def get(self):
        query = request.args.get('q', '')
        index = request.args.get('index', '')
        facets = request.args.get('facets', '')
        top = request.args.get('top', '15')
        filters = request.args.get('filters', '')

        _filter = ''
        if filters:
            _filter = []
            for f in filters.split('|'):
                _filter.append(' or '.join(f.split(',')))
            _filter = ' and '.join(_filter)
            _filter = '&$filter=' + _filter
        facets = '&' + '&'.join(map(lambda x: f'facet={x},count:25', facets.split(',')))
        url = AZ_SEARCH_ENDPOINT + 'indexes/' + index + '/docs?api-version=' + AZ_SEARCH_APIVERSION \
            + '&search=' + query + facets + _filter + '&$top=' + top
            # +'&$select=' + ','.join(self.select_list)
        print(url)
        res = r.get(url, headers=HEADERS)
        if res.ok:
            result = res.json()
            if len(result) > 0:
                result['@odata.nextLink'] = url+ '&$skip=15'
            return result, 200
        return {}, 404


class Next(Resource):
    def __init__(self):
        super(Next, self).__init__()

    @cross_origin()
    def post(self):
        url = json.loads(request.data.decode()).get('url', '')
        link = json.loads(request.data.decode()).get('link', '')

        __url, skip = url.split('&$skip=')
        if link == 'next':
            next_url = __url + '&$skip=' + str(int(skip) + 15)
            previous_url = __url + '&$skip=' + str(int(skip) - 15)
            url = next_url
        else:
            next_url = __url + '&$skip=' + str(int(skip) + 15)
            previous_url = url
            url = previous_url

        print(previous_url)
        print(url)
        print(next_url)

        res = r.get(url, headers=HEADERS)
        if res.ok:
            result = res.json()
            if len(result) > 0:
                result['@odata.nextLink'] = next_url
                if not(link == 'previous' and int(skip) <= 15):
                    result['@odata.previousLink'] = previous_url
            return result, 200
        return {}, 404


class IndexFormat(Resource):
    def __init__(self):
        super(IndexFormat, self).__init__()

    @cross_origin()
    def get(self):
        index_name = request.args.get('index_name', '')
        if os.path.exists(INDEXES_FILE):
            with open(INDEXES_FILE, 'rb') as fp:
                indexes_dict = pickle.load(fp)

            if index_name in indexes_dict.keys():
                return {'index_format': indexes_dict[index_name]}, 200

        return {}, 404

    @cross_origin()
    def post(self):
        index_format = json.loads(request.data.decode()).get('index_format', {})
        index_name = json.loads(request.data.decode()).get('index_name', '')

        if (len(index_format.keys()) > 0) and (index_name != ''):
            if os.path.exists(INDEXES_FILE):
                with open(INDEXES_FILE, 'rb') as fp:
                    indexes_dict = pickle.load(fp)
            else:
                indexes_dict = {}
            indexes_dict[index_name] = index_format

            with open(INDEXES_FILE, 'wb') as fp:
                pickle.dump(indexes_dict, fp)

            return {'result': 'saved'}, 200

        return {'result': 'error'}, 400
