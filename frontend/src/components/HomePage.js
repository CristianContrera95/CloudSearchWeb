import React, {Component} from 'react';
import {InputFieldQuery} from "./InputField";
import Container from "reactstrap/es/Container";
import {
    Button, Col, Row, Collapse,
    Nav, NavItem, NavLink,
    ListGroup, ListGroupItem,
    TabContent, TabPane,
} from "reactstrap";
import AzSearchAPI from "../utils/AzSearchAPI";
import SpinnerRainbow from "./Spinner";
import classnames from 'classnames';
import './HomePage.css';
import {render_list} from '../data/IndexFields';


const index_format = {'name': '', 'pretitle': [], 'title': '', 'subtitle': '', 'text': '', 'footer': [], 'date': ''};


class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            query: "*",
            exactly_search: false,
            indexes_selected: [],
            fields_selected: {},
            indexes: [],
            indexes_format: {},
            non_index: false,
            result: {},
            non_results: false,
            next_result: '',
            searching: false,
            search_disabled: true,
            active_tab: 0,
            active_fields: false,
            filter_results: {},
            filter_args: {},
            texto_modal: -1,
            filter_collapse: {}
        }

        this.az_search = new AzSearchAPI();

        this.onLoadPage = this.onLoadPage.bind(this);
        this.getIndexFormat = this.getIndexFormat.bind(this);
        this.onChangeInput = this.onChangeInput.bind(this);
        this.onToggleTabs = this.onToggleTabs.bind(this);
        this.onToggleFilters = this.onToggleFilters.bind(this);
        this.onChangeField = this.onChangeField.bind(this);
        this.onSelectExactlySearch = this.onSelectExactlySearch.bind(this);
        this.onClickSearch = this.onClickSearch.bind(this);
        this.onNextPage = this.onNextPage.bind(this);
        this.onSelectIndex = this.onSelectIndex.bind(this);
        this.onShowModal = this.onShowModal.bind(this);
    }

    componentDidMount() {
        this.onLoadPage();
    }

    getIndexFormat(index_name) {
        let __index_format = this.az_search.get_index_format(index_name)
                                .then(res => {
                                    if (typeof res.index_format !== 'undefined') {
                                        return res.index_format;
                                    }
                                    else
                                        return index_format;
                                })
                                .catch((error) => {
                                    console.log('Error LoadPage', error);
                                    return index_format;
                                })
        return __index_format;
    }

    onLoadPage() {
        this.az_search.get_indexes()
            .then(res => {
                if (res.value.length > 0) {

                    let __indexes = {}, __filter_results = {}, __filter_collapse = {};
                    res.value.forEach((index_value) => {
                        __indexes[index_value.name] = [...index_value.fields.map(field => field.name)];
                        __filter_collapse[index_value.name] = {};
                        __filter_results[index_value.name] = {};
                        this.getIndexFormat(index_value.name).then( res =>
                            this.setState({indexes_format: {...this.state.indexes_format, [index_value.name]: res}})
                        )
                        // __indexes_format[index_value.name] = some_var
                        index_value.fields.filter(field => field.facetable)
                            .forEach((field_value) => {
                                __filter_results[index_value.name][field_value.name] = [];
                                __filter_collapse[index_value.name][field_value.name] = false;
                            });
                            // __fields_selected[value.name] = [];
                    });
                    this.setState({
                        indexes: __indexes,
                        filter_collapse: __filter_collapse,
                        indexes_selected: [res.value[0].name],
                        filter_results: __filter_results,
                        // fields_selected: __fields_selected,
                        non_index: false,
                        search_disabled: false,
                    });
                } else
                    this.setState({
                        result: [{}],
                        non_index: true,
                        search_disabled: false
                    });
            })
            .catch((error) => {
                    console.log('Error LoadPage', error);
                }
            );
    }


    onClickSearch(e, key_index, field, value) {
        // Enable spinner
        this.setState({
            searching: !this.state.searching,
            search_disabled: true
        });

        let __event_name = e.target.name;

        // Format filters and get index to update search
        let filter_args = {}, indexes;
        if (__event_name === 'filters') {
            filter_args = this.state.filter_args;
            if (e.target.className.includes('active')) {
                e.target.className = e.target.className.replace('active', '');
                indexes = [this.state.indexes_selected[this.state.active_tab]];

                filter_args[key_index][field].splice(filter_args[key_index][field].indexOf(field + ' eq \'' + value + '\''), 1);
            } else {
                e.target.className += ' active';
                if (typeof filter_args[key_index] === 'undefined')
                    filter_args[key_index] = {};
                if (Object.keys(this.state.filter_args[key_index]).indexOf(field) < 0)
                    filter_args[key_index] = {...filter_args[key_index], [field]: [field + ' eq \'' + value + '\'']};
                else
                    filter_args[key_index] = {...filter_args[key_index], [field]: [...filter_args[key_index][field], field + ' eq \'' + value + '\'']};
                indexes = [this.state.indexes_selected[this.state.active_tab]];
            }
            this.setState({filter_args: filter_args})
        } else {
            let filter_list = document.getElementsByName('filters');
            for (var i=0; i < filter_list.length; i++) {
                filter_list[i].className = filter_list[i].className.replace('active', '');
            }
            this.setState({result: {}, filter_args: {}});
            indexes = this.state.indexes_selected;
        }

        // Make search and update results
        let results = this.az_search.search_multindex(this.state.query, indexes, this.state.filter_results, filter_args);

        // show results index by index
        Object.keys(results).forEach((index) => {
            results[index].then((response) => {
                if (response["value"].length > 0) {
                    let __next = typeof response["@odata.nextLink"] === 'undefined' ? '' : response["@odata.nextLink"];
                    let __previous = typeof response["@odata.previousLink"] === 'undefined' ? '' : response["@odata.previousLink"];

                    let __filter_results = this.state.filter_results;
                    if (__event_name === 'search') {
                        __filter_results = {...this.state.filter_results, [index]: response["@search.facets"]};
                    }

                    // Set results
                    this.setState({
                        result: {...this.state.result, [index]: {'value': response["value"], 'next': __next, 'previous': __previous}},
                        searching: false,
                        search_disabled: false,
                        filter_results: __filter_results
                    });
                } else {
                    this.setState({
                        result: {},
                        searching: !this.state.searching,
                        search_disabled: false,
                        non_results: true,
                        filter_results: {}
                    });
                    this.onLoadPage();
                }
            }).catch((error) => {
                console.log(error);
                this.setState({
                    result: {...this.state.result, [index]: {'value': [], 'next': ''}},
                    searching: !this.state.searching,
                    search_disabled: false,
                    non_results: true,
                });
            })
        })
    }

    onNextPage(e, index_name, link) {
        // Enable spinner
        this.setState({
            searching: !this.state.searching,
        });

        let url = '';
        if (link === 'next')
            url = this.state.result[index_name].next;
        else
            url = this.state.result[index_name].previous;
        this.az_search.next(url, link)
            .then(res => {
                return res
            })
            .then(res => {
                if (res.value.length > 0) {
                    let __next = typeof res["@odata.nextLink"] === 'undefined' ? '' : res["@odata.nextLink"];
                    let __previous = typeof res["@odata.previousLink"] === 'undefined' ? '' : res["@odata.previousLink"];
                    // Set results
                    this.setState({
                        result: {...this.state.result, [index_name]: {'value': res["value"], 'next': __next, 'previous': __previous}},
                        searching: false,
                        search_disabled: false
                    });
                } else
                    this.setState({
                        result: [{}],
                        non_results: true
                    })
            })
            .catch((error) => console.log('error:', error));
    }

    onChangeInput(e) {
        // update query string and call to autocomplete azure search endpoint
        this.setState({
            non_results: false,
            query: e.target.value
        })
        // this.az_search.autocomplete(this.state.query, this.state.indexes_selected)  // TODO: fix this
    }

    onToggleTabs(tab_id) {
        this.setState({
            active_tab: tab_id,
        })
    }

    onToggleFilters(index, field) {

        let __filter_collapse = this.state.filter_collapse;
        __filter_collapse[index][field] = !__filter_collapse[index][field];
        this.setState({
            filter_collapse: __filter_collapse,
        })
    }

    onShowModal(index, i) {
        this.setState({
            texto_modal: this.state.texto_modal === index+i.toString() ? '' : index+i.toString(),
        })
    }

    onChangeField(index_key, field, e) {
        if (Object.keys(this.state.fields_selected).indexOf(index_key) >= 0)
            this.setState({
                fields_selected: {index_key: [...this.state.fields_selected[index_key], field]},
            })
        else
            this.setState({
                fields_selected: {index_key: [field]},
            })
        this.az_search.set_indexes_selected(this.state.fields_selected)
    }

    onSelectExactlySearch(e) {
        this.setState({
            exactly_search: !this.state.exactly_search
        })
    }

    onSelectIndex(e) {
        let index_name = e.target.value;
        let idx = this.state.indexes_selected.indexOf(index_name);
        if (idx < 0)
            this.setState({
                indexes_selected: [...this.state.indexes_selected, index_name]
            })
        else {
            let indexes = this.state.indexes_selected;
            indexes.splice(idx, 1);
            this.setState({
                indexes_selected: indexes
            })
        }
    }

    isChecked(index_key, field) {
        if (typeof this.state.fields_selected[index_key] !== 'undefined')
            if (this.state.fields_selected[index_key].indexOf(field) >= 0)
                return true

        return false
    }

    render() {
        return (
            <div className="bg-white">
                <div>  {/* Begin input field div */}
                    <Container className="p-5">
                        <h4><b>Search</b></h4>
                        <hr/>
                        <br/>
                        <Row>
                            <Col className="col-10">
                                <InputFieldQuery
                                    ph="Ingrese su búsqueda..."
                                    indexes={this.state.indexes_format}
                                    indexes_selected={this.state.indexes_selected}
                                    change_query={(e) => {this.onChangeInput(e)}}
                                    change_index={(e) => {this.onSelectIndex(e)}}/>
                            </Col>
                        </Row>
                        <div className='text-right custom-control custom-checkbox pl-3'>
                            <input
                                className='custom-control-input'
                                type='checkbox'
                                id='invalidCheck'
                                required
                                onChange={this.onSelectExactlySearch}/>
                            <label className='custom-control-label ml-2' htmlFor='invalidCheck'>Búsqueda Exacta</label>
                        </div>
                        <Col className="col-12 text-center">
                            <Button
                                name='search'
                                style={{background: "#3391FF", border: "0px"}}
                                onClick={(e) => {this.onClickSearch(e)}}
                                disabled={this.state.search_disabled}
                            >
                                Buscar
                            </Button>
                        </Col>
                    </Container>
                </div>  {/* End input field div */}

                <div>  {/* Begin result section div */}
                    <div className="mb-5 mx-auto col-12">

                        <div hidden={!this.state.searching}>
                            <SpinnerRainbow/>
                        </div>

                        <div className="text-center" hidden={!this.state.non_results}>
                            {/*<Alert color="danger">*/}
                                <h3>Sin resultados</h3>
                            {/*</Alert>*/}
                        </div>

                            {/*----Show Table-------*/}

                        <Row >
                            <Col className="col-3">
                                <h4>Filtros</h4>
                                <hr className="ml-0 col-6"/>
                                {/*----Filter Results-------*/}
                                {this.state.indexes_selected.map((key_index, idx) =>
                                    <div hidden={key_index !== this.state.indexes_selected[this.state.active_tab]} key={idx}>
                                        <ListGroup>
                                            {Object.keys(this.state.filter_results[key_index]).map((field, i) =>
                                                <div className="my-2" key={i}>
                                                    <ListGroupItem tag="button" action onClick={() => {this.onToggleFilters(key_index, field)}}>
                                                        <strong>{field}</strong>
                                                    </ListGroupItem>
                                                    <Collapse isOpen={this.state.filter_collapse[key_index][field]}>
                                                        {this.state.filter_results[key_index][field].map((value, j) =>
                                                            <ListGroupItem className=""
                                                                           tag="button"
                                                                           name="filters"
                                                                           action
                                                                           key={j}
                                                                           onClick={(e) => {this.onClickSearch(e, key_index, field, value.value)}}>
                                                                {value.value} ({value.count})
                                                            </ListGroupItem>
                                                        )}
                                                    </Collapse>
                                                </div>
                                            )}
                                        </ListGroup>
                                    </div>
                                )}
                            </Col>

                                {/*----Show Results list-------*/}
                            <Col className="col-9">
                                <div hidden={this.state.non_results || this.state.searching}> {/*--Header results (Index Tabs)-------*/}
                                    <Nav tabs>
                                        {Object.keys(this.state.result).map((key_index, idx) =>
                                            <NavItem key={idx}>
                                                <NavLink
                                                    className={classnames({ active: this.state.active_tab === idx })}
                                                    onClick={() => {this.onToggleTabs(idx)}}>
                                                    {this.state.indexes_format[key_index].name}
                                                </NavLink>
                                            </NavItem>
                                        )}
                                    </Nav>
                                    <TabContent activeTab={this.state.active_tab}>
                                        {Object.keys(this.state.result).map((key_index, idx) =>
                                            <TabPane tabId={idx} key={idx}>
                                                <Row>
                                                    <Col>
                                                        <div className="my-3 text-left" hidden={this.state.result[key_index].previous === ''}>
                                                            <Button onClick={(e) => this.onNextPage(e, key_index, 'previous')}>
                                                                Anterior
                                                            </Button>
                                                        </div>
                                                    </Col>
                                                    <Col>
                                                        <div className="my-3 text-right" hidden={this.state.result[key_index].next === ''}>
                                                            <Button onClick={(e) => this.onNextPage(e, key_index, 'next')}>
                                                                Siguiente
                                                            </Button>
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <ListGroup>
                                                    {this.state.result[key_index].value.map((data, i) =>
                                                        render_list(key_index, data, this.state.indexes_format, i, this.state.texto_modal, this.onShowModal)
                                                    )}
                                                </ListGroup>
                                            </TabPane>
                                        )}
                                    </TabContent>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>  {/* End result section div */}
            </div>

        );
    }
}


export default HomePage;
