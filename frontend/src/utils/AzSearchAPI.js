import config from '../config';


export default class AzSearchAPI {
    constructor() {
        this.domain = config.URL_BACKEND;

        this.headers = new Headers();
        this.headers.append("Access-Control-Allow-Origin", "*");
        this.headers.append('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

        this.get_indexes = this.get_indexes.bind(this);
        this.autocomplete = this.autocomplete.bind(this);
        this.search = this.search.bind(this);
        this.search_multindex = this.search_multindex.bind(this);
        this.next = this.next.bind(this);
        this._get_fetch = this._get_fetch.bind(this);
        this._post_fetch = this._post_fetch.bind(this);
    }

    set_indexes_selected(indexes) {
        localStorage.setItem('__indexes', indexes);
    }

    get_indexes_selected() {
        return localStorage.getItem('__indexes');
    }

    get_index_format(index_name) {
        let requestURL = this.domain + 'index_format?index_name=' + index_name;
        return this._get_fetch(requestURL, this.headers, 'get_index_format');
    }

    save_index_format(index_name, index_format) {
        let requestURL = this.domain + 'index_format';
        let init = {
            headers: this.headers,
            method: 'POST',
            body: JSON.stringify({
                index_name: index_name,
                index_format: index_format
            })}
        return this._post_fetch(requestURL, init, 'save_index_format');
    }

    get_indexes() {
        let requestURL = this.domain + 'get_index';
        return this._get_fetch(requestURL, this.headers, 'get_indexes');
    }

    autocomplete(query, index) {
        let requestURL = this.domain + 'autocomplete?index=' + index[0] + '&q=' + query

        return this._get_fetch(requestURL, this.headers, 'autocomplete');
    }

    search(query, index, facets, filter_args) {
        // performs api calls sending the required authentication headers
        query = query || '*';
        let _filter_args = '';
        if (typeof filter_args[index] !== 'undefined') {
            if (Object.keys(filter_args[index]).length !== 0) {
                Object.keys(filter_args[index]).forEach((key_facet) => {
                    _filter_args += filter_args[index][key_facet].join(',') + '|';
                })
                _filter_args = '&filters=' + _filter_args.slice(0, -1);
            }
        }

        let requestURL = this.domain + 'search?q=' +query + '&index=' +  index + '&facets=' + facets.join(',') + _filter_args;
        return this._get_fetch(requestURL, this.headers, 'search');
    }

    search_multindex(query, indexes, filters, filter_args) {
        // performs api calls sending the required authentication headers
        query = query || '*';

        let results = {};
        indexes.forEach(index => {
            results[index] = this.search(query, index, Object.keys(filters[index]), filter_args);
        });

        return results;
    }

    next(next_url, link) {
        // performs api calls sending the required authentication headers
        let init = {
            headers: this.headers,
            method: 'POST',
            body: JSON.stringify({
                url: next_url,
                link: link
            })}

        let requestURL = this.domain + 'next';

        return this._post_fetch(requestURL, init, 'next');
    }

    create_data_source(body) {
        let requestURL = this.domain + 'datasources?api-version=' + this.apiversion;
        let init = {
            headers: this.headers,
            method: 'POST',
            body: JSON.stringify({
                ...body
            })}
        return this._post_fetch(requestURL, init, 'create_data_source');
    }

    create_indexer(body) {
        let requestURL = this.domain + 'indexers?api-version=' + this.apiversion;
        let init = {
            headers: this.headers,
            method: 'POST',
            body: JSON.stringify({
                ...body
            })}
        return this._post_fetch(requestURL, init, 'create_indexer');
    }

    _get_fetch(url, headers, fun_name) {
        return fetch(url, {
            headers: headers,
            method: "GET",
        }).then((response) => {
            return response.json();
        }).catch(res => {
            console.log('AzSearchAPI/' + fun_name + ':\n', res);
            return Promise.resolve(res);
        });
    }

    _post_fetch(url, init, fun_name) {
        return fetch(url, init).then((response) => {
            return response.json();
        }).catch(res => {
            console.log('AzSearchAPI/' + fun_name + ':\n', res);
            return Promise.resolve(res);
        });
    }
}
