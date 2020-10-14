import React, { Component } from 'react';
import { InputField } from './InputField'
import {
    Button, Row, Col, Label,
    Card, CardBody,
    Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import AzSearchAPI from "../utils/AzSearchAPI";
import OkModal from "./OkModal";


const index_format = {'name': '', 'pretitle': [], 'title': '', 'subtitle': '', 'text': '', 'footer': [], 'date': ''};


class Indexes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            indexes: {},
            selected_index: null,
            non_index: true,
            index_dropdown_open: false,
            index_format: index_format,
            modal: false,
            toggle_disabled: true
        }

        this.az_search = new AzSearchAPI();

        this.onLoadPage = this.onLoadPage.bind(this);

        this.toggle_index_dropdown = this.toggle_index_dropdown.bind(this);
        this.toggle_modal = this.toggle_modal.bind(this);
        this.select_index = this.select_index.bind(this);
        this.get_index_format = this.get_index_format.bind(this);

        this.submitHandler = this.submitHandler.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.validateForm = this.validateForm.bind(this);

        this.onLoadPage()
    }

    onLoadPage() {
        this.az_search.get_indexes()
            .then(res => {
                if (res.value.length > 0) {

                    let __indexes = {};
                    res.value.forEach((index_value) => {
                        __indexes[index_value.name] = [...index_value.fields.map(field => field.name)];
                    });

                    this.setState({
                        indexes: __indexes,
                        non_index: false,
                        toggle_disabled: false,
                    });
                } else
                    this.setState({
                        non_index: true,
                    });
            })
            .catch((error) => {
                    console.log('Error LoadPage', error);
                }
            );
    }

    toggle_index_dropdown(e) {
        this.setState({index_dropdown_open: !this.state.index_dropdown_open});
    };

    toggle_modal(e) {
        this.setState({modal: !this.state.modal});
        if (typeof e !== 'undefined')
            if (e.target.name === 'boton modal')
                window.location.reload();
    };

    select_index(e) {
        this.setState({selected_index: e.target.name})
        this.get_index_format(e.target.name);
    }

    get_index_format(index_name) {
        this.az_search.get_index_format(index_name)
            .then(res => {
                if (typeof res.index_format !== 'undefined') {
                    this.setState({index_format: res.index_format})
                } else {
                    this.setState({index_format: index_format})
                }
            })
            .catch((error) => {
                console.log('Error LoadPage', error);
            })
    }

    submitHandler(e) {
        this.az_search.save_index_format(this.state.selected_index, this.state.index_format)
            .then(res => {
                if (res.result === 'saved')
                    this.setState({modal: !this.state.modal});
                else
                    console.log('Error');
            })
            .catch(error => {
                console.log('Error');
            })

    };

    handleChange(e) {
        let __index_format = this.state.index_format;
        if (['name', 'title', 'subtitle', 'text', 'date'].includes(e.target.name))
            __index_format[e.target.name] = e.target.value;
        else {
            __index_format[e.target.name] =  Array.from(e.target.selectedOptions, item => item.value);
        }
        this.setState({ __index_format: __index_format });
        console.log(__index_format)
    };

    validateForm() {
        return (this.state.index_format['name'].length > 0 &&
                this.state.index_format['title'].length > 0 &&
                this.state.index_format['text'].length > 0)
    }

    render() {
        return(
            <div className="app flex-row align-items-center pt-4 bg-white" >

                <div className="text-center mt-4 justify-content-center">  {/* Title */}
                    <Col md="8" className="mx-auto">
                        <h2><b>Configuracion indices</b></h2>
                        <hr/>
                    </Col>
                </div>
                <OkModal toggle={this.toggle_modal} modal={this.state.modal} body={'Formato Guardado'} />
                <div className="text-center">
                    <div>
                        {/*<h3>Seleccionar indice</h3>*/}
                        <Dropdown isOpen={this.state.index_dropdown_open} toggle={this.toggle_index_dropdown}>
                            <DropdownToggle caret disabled={this.state.toggle_disabled}>
                                Azure Indices
                            </DropdownToggle>
                            <DropdownMenu>
                                {Object.keys(this.state.indexes).map((value, index) =>
                                    <DropdownItem name={value} onClick={this.select_index} key={index}>{value}</DropdownItem>
                                )}
                            </DropdownMenu>
                        </Dropdown>

                        <div className="my-5">
                            {this.state.selected_index !== null ?
                                <Card className="col-6 mx-auto border-0" >
                                    <div className="my-0 text-left">
                                        <h3>{this.state.selected_index}:</h3>
                                    </div>
                                    <CardBody>
                                        <Row className="-">
                                            <Col>
                                                <InputField label={'Nombre del indice'}
                                                            type={"text"}
                                                            name={"name"}
                                                            value={this.state.index_format['name']}
                                                            i={'y'}
                                                            change={this.handleChange}
                                                />
                                            </Col>
                                        </Row>
                                        <Row className="mb-1">
                                            <Col>
                                                <Label size="lg">PreTitulo</Label>
                                                <select className="custom-select "
                                                        value={this.state.index_format['pretitle']}
                                                        onChange={this.handleChange}
                                                        name='pretitle'
                                                        id='materialFormRegisterEmailEx3'
                                                        multiple
                                                >
                                                    <option></option>
                                                    {this.state.indexes[this.state.selected_index].map((value, idx) =>
                                                        <option key={idx}>{value}</option>
                                                    )}
                                                </select>
                                            </Col>
                                        </Row>
                                        <Row className="mb-1">
                                            <Col>
                                                <Label size="lg" className="text-">Titulo</Label>
                                                <select className="custom-select "
                                                        value={this.state.index_format['title']}
                                                        onChange={this.handleChange}
                                                        name='title'
                                                        id='materialFormRegisterEmailEx3'
                                                        required={true}
                                                >
                                                    <option></option>
                                                    {this.state.indexes[this.state.selected_index].map((value, idx) =>
                                                        <option key={idx}>{value}</option>
                                                    )}
                                                </select>
                                            </Col>
                                        </Row>
                                        <Row className="mb-1">
                                            <Col>
                                                <Label size="lg" >SubTitulo</Label>
                                                <select className="custom-select "
                                                        value={this.state.index_format['subtitle']}
                                                        onChange={this.handleChange}
                                                        name='subtitle'
                                                        id='materialFormRegisterEmailEx3'

                                                >
                                                    <option></option>
                                                    {this.state.indexes[this.state.selected_index].map((value, idx) =>
                                                        <option key={idx}>{value}</option>
                                                    )}
                                                </select>
                                            </Col>
                                        </Row>
                                        <Row className="mb-1">
                                            <Col className='-'>
                                                <Label size="lg">Texto</Label>
                                                <select className="custom-select "
                                                        value={this.state.index_format['text']}
                                                        onChange={this.handleChange}
                                                        name='text'
                                                        id='materialFormRegisterEmailEx3'
                                                >
                                                    <option></option>
                                                    {this.state.indexes[this.state.selected_index].map((value, idx) =>
                                                        <option key={idx}>{value}</option>
                                                    )}
                                                </select>
                                                <p className="text-muted text-left">
                                                    *Campo a ser mostrado al presionar el boton Ver mas
                                                </p>
                                            </Col>
                                        </Row>
                                        <Row className="mb-1">
                                            <Col className='-'>
                                                <Label size="lg">Pie</Label>
                                                <select className="custom-select "
                                                        value={this.state.index_format['footer']}
                                                        onChange={this.handleChange}
                                                        name='footer'
                                                        id='materialFormRegisterEmailEx3'
                                                        multiple
                                                >
                                                    <option></option>
                                                    {this.state.indexes[this.state.selected_index].map((value, idx) =>
                                                        <option key={idx}>{value}</option>
                                                    )}
                                                </select>
                                            </Col>
                                        </Row>
                                        <Row className="mb-1">
                                            <Col className='-'>
                                                <Label size="lg">Campo fecha</Label>
                                                <select className="custom-select "
                                                        value={this.state.index_format['date']}
                                                        onChange={this.handleChange}
                                                        name='date'
                                                        id='materialFormRegisterEmailEx3'
                                                >
                                                    <option></option>
                                                    {this.state.indexes[this.state.selected_index].map((value, idx) =>
                                                        <option key={idx}>{value}</option>
                                                    )}
                                                </select>
                                            </Col>
                                        </Row>
                                        <Row className="mb-1">
                                            <Col>
                                                <Button className="my-3"
                                                        type={'submit'}
                                                        style={{background: "#3391FF", border: "0px"}}
                                                        disabled={!this.validateForm()}
                                                        onClick={this.submitHandler}>
                                                    Enviar
                                                </Button>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                                :
                                null
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Indexes;
