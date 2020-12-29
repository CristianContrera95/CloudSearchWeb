import React, { Component } from 'react';
import { InputField } from './InputField'
import {
    Button, Row, Col, Label,
    Card, CardBody, ListGroup,
    Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap'
import AzSearchAPI from "../utils/AzSearchAPI";
import OkModal from "./OkModal";
import logo from "../images/azure-search-logo.png";


const index_format = {
    'name': '',
    'pretitle_name': [],
    'pretitle': [],
    'title_name': '',
    'title': '',
    'subtitle_name': '',
    'subtitle': '',
    'text_name': '',
    'text': '',
    'footer_name': [],
    'footer': [],
    'date': '',
    'hidden': false
};


class Indexes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            indexes: {},
            selected_index: null,
            non_index: true,
            index_dropdown_open: false,
            index_format: {...index_format},
            modal: false,
            toggle_disabled: true,
            pretitle_name: '',
            pretitle: '',
            footer_name: '',
            footer: '',
            password: '',
            modal_password: true
        }

        this.az_search = new AzSearchAPI();

        this.handlePassword = this.handlePassword.bind(this);
        this.onCheckPassword = this.onCheckPassword.bind(this);

        this.onLoadPage = this.onLoadPage.bind(this);

        this.toggle_index_dropdown = this.toggle_index_dropdown.bind(this);
        this.toggle_modal = this.toggle_modal.bind(this);
        this.select_index = this.select_index.bind(this);
        this.get_index_format = this.get_index_format.bind(this);

        this.handleChangeHidden = this.handleChangeHidden.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeList = this.handleChangeList.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.validateForm = this.validateForm.bind(this);
        this.to_home = this.to_home.bind(this);

        this.onLoadPage()
    }

    handlePassword(e) {
        this.setState({
            password: e.target.value
        })
    }

    onCheckPassword(e) {
        this.az_search.check_password(this.state.password)
            .then(res => {
                if (res.match)
                    this.setState({
                        modal_password: !this.state.modal_password
                    })
                else {
                    alert('Contraseña incorrecta');
                    document.location.href = '/home';
                }
            })
            .catch((error) => {
                console.log('Error check password', error);
            })
    }

    onLoadPage() {
        this.az_search.get_indexes(true)
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
                    let __index_format = {...index_format};
                    Object.keys(res.index_format).map(key =>
                        __index_format[key] = res.index_format[key]
                    )
                    this.setState({index_format: __index_format})
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
        if (['name', 'title', 'subtitle', 'text', 'date', 'title_name', 'subtitle_name', 'text_name'].includes(e.target.name))
            __index_format[e.target.name] = e.target.value;
        else {
            __index_format[e.target.name] =  Array.from(e.target.selectedOptions, item => item.value);
        }
        this.setState({ __index_format: __index_format });
    };

    handleChangeList(e) {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleChangeHidden(e) {
        let __index_format = this.state.index_format;
        __index_format['hidden'] = !__index_format['hidden']
        this.setState({ index_format: __index_format });
    };

    handleAdd(e, field) {
        let __index_format = this.state.index_format;
        if (field === 'pretitle'){
            __index_format['pretitle'] = [...this.state.index_format['pretitle'], this.state.pretitle];
            __index_format['pretitle_name'] = [...this.state.index_format['pretitle_name'], this.state.pretitle_name];
        }
        else {
            __index_format['footer'] = [...this.state.index_format['footer'], this.state.footer];
            __index_format['footer_name'] = [...this.state.index_format['footer_name'], this.state.footer_name];
        }
        this.setState({
            __index_format: __index_format,
            pretitle: '',
            pretitle_name: '',
            footer: '',
            footer_name: '',
        });
    };

    handleDelete(e, field, index) {
        let __index_format = this.state.index_format;
        if (field === 'pretitle'){
            __index_format['pretitle'].splice(index, 1);
            __index_format['pretitle_name'].splice(index, 1);
        }
        else {
            __index_format['footer'].splice(index, 1);
            __index_format['footer_name'].splice(index, 1);
        }
        this.setState({
            __index_format: __index_format,
        });
    };

    validateForm() {
        return (this.state.index_format['hidden'] || (
                this.state.index_format['name'].length > 0 &&
                this.state.index_format['title'].length > 0 &&
                this.state.index_format['text'].length > 0))
    }

    to_home(e) {
        document.location.href = '/home'
    }
    render() {
        return(
            <div className="app flex-row align-items-center pt-4 bg-white" >

                <Modal centered={true} isOpen={this.state.modal_password} toggle={this.to_home} >
                    <ModalHeader  style={{backgroundColor:'#000000', color: 'white'}} toggle={this.to_home}>
                        <img className="mx-2" src={logo} style={{width:"60px",height:"44px"}} alt="azure search logo"/>
                        Azure Search SCBA
                    </ModalHeader>
                    <ModalBody className='text-center'>
                        <h4>Ingrese la contraseña</h4>
                        <InputField ph={'contraseña'}
                                    type={"password"}
                                    name={"password"}
                                    value={this.state.password}
                                    i={'y'}
                                    change={this.handlePassword}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button className="mx-auto"
                                id='button'
                                name='boton modal'
                                style={{background: "#3391FF", border: "0px"}}
                                onClick={this.onCheckPassword}>Ok!</Button>
                    </ModalFooter>
                </Modal>

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
                                        <Row>
                                            <Col>
                                                <h3>{this.state.selected_index}</h3>
                                            </Col>
                                            <Col className="text-right">
                                                <Input type="checkbox"
                                                       id={"hidden_check"}
                                                       onChange={this.handleChangeHidden}
                                                       checked={this.state.index_format['hidden']}
                                                />
                                                <Label for={"hidden_check"} check>
                                                    Ocultar indice
                                                </Label>
                                            </Col>
                                        </Row>
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
                                        <Label size="lg">PreTitulo(s)</Label>
                                        <Row className="mb-1">
                                            <Col>
                                                <InputField ph={'Nombre del campo'}
                                                            type={"text"}
                                                            name={"pretitle_name"}
                                                            value={this.state.pretitle_name}
                                                            i={'y'}
                                                            change={this.handleChangeList}
                                                />
                                            </Col>
                                            <Col className="pr-0">
                                                <select className="custom-select "
                                                        value={this.state.pretitle}
                                                        onChange={this.handleChangeList}
                                                        name='pretitle'
                                                        id='materialFormRegisterEmailEx3'
                                                >
                                                    <option></option>
                                                    {this.state.indexes[this.state.selected_index].map((value, idx) =>
                                                        <option key={idx}>{value}</option>
                                                    )}
                                                </select>
                                            </Col>
                                            <Col className="col-2 px-0">
                                                <Button size="sm"
                                                        color="danger"
                                                        onClick={(e) => this.handleAdd(e, 'pretitle')}
                                                        type="button"
                                                        outline={true}
                                                        disabled={this.state.pretitle === '' || this.state.pretitle_name === ''}
                                                >
                                                    Agregar
                                                </Button>
                                            </Col>
                                        </Row>
                                        <ListGroup className="text-left">
                                            {this.state.index_format['pretitle'].map((value, index) =>
                                                <p key={index}>
                                                    <svg width="1em" height="1em" viewBox="0 0 16 16"
                                                         className="bi bi-dot" fill="currentColor"
                                                         xmlns="http://www.w3.org/2000/svg">
                                                        <path fillRule="evenodd"
                                                              d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>
                                                    </svg>
                                                    {this.state.index_format['pretitle_name'][index] + ': ' + value}
                                                    <svg width="1em" height="1em" viewBox="0 0 16 16"
                                                         className="bi bi-x-square ml-3" fill="currentColor"
                                                         xmlns="http://www.w3.org/2000/svg"
                                                         onClick={(e) => this.handleDelete(e, 'pretitle', index)}
                                                    >
                                                        <path fillRule="evenodd"
                                                              d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                                                        <path fillRule="evenodd"
                                                              d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                                                    </svg>
                                                </p>
                                            )}
                                        </ListGroup>
                                        <Label size="lg">Titulo</Label>
                                        <Row className="mb-1">
                                            <Col>
                                                <InputField ph={'Nombre del campo'}
                                                            type={"text"}
                                                            name={"title_name"}
                                                            value={this.state.index_format['title_name']}
                                                            i={'y'}
                                                            change={this.handleChange}
                                                />
                                            </Col>
                                            <Col>
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
                                        <Label size="lg" >SubTitulo</Label>
                                        <Row className="mb-1">
                                            <Col>
                                                <InputField ph={'Nombre del campo'}
                                                            type={"text"}
                                                            name={"subtitle_name"}
                                                            value={this.state.index_format['subtitle_name']}
                                                            i={'y'}
                                                            change={this.handleChange}
                                                />
                                            </Col>
                                            <Col>
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
                                        <Label size="lg">Texto</Label>
                                        <Row className="mb-1">
                                            <Col>
                                                <InputField ph={'Nombre del campo'}
                                                            type={"text"}
                                                            name={"text_name"}
                                                            value={this.state.index_format['text_name']}
                                                            i={'y'}
                                                            change={this.handleChange}
                                                />
                                            </Col>
                                            <Col className='-'>
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
                                        <Label size="lg">Pie(s)</Label>
                                        <Row className="mb-1">
                                            <Col>
                                                <InputField ph={'Nombre del campo'}
                                                            type={"text"}
                                                            name={"footer_name"}
                                                            value={this.state.footer_name}
                                                            i={'y'}
                                                            change={this.handleChangeList}
                                                />
                                            </Col>
                                            <Col className="pr-0">
                                                <select className="custom-select "
                                                        value={this.state.footer}
                                                        onChange={this.handleChangeList}
                                                        name='footer'
                                                        id='materialFormRegisterEmailEx3'
                                                >
                                                    <option></option>
                                                    {this.state.indexes[this.state.selected_index].map((value, idx) =>
                                                        <option key={idx}>{value}</option>
                                                    )}
                                                </select>
                                            </Col>
                                            <Col className="col-2 px-0">
                                                <Button size="sm"
                                                        color="danger"
                                                        onClick={(e) => this.handleAdd(e, 'footer')}
                                                        type="button"
                                                        outline={true}
                                                        disabled={this.state.footer === '' || this.state.footer_name === ''}
                                                >
                                                    Agregar
                                                </Button>
                                            </Col>
                                        </Row>
                                        <ListGroup className="text-left">
                                            {this.state.index_format['footer'].map((value, index) =>
                                                <p key={index}>
                                                    <svg width="1em" height="1em" viewBox="0 0 16 16"
                                                         className="bi bi-dot" fill="currentColor"
                                                         xmlns="http://www.w3.org/2000/svg">
                                                        <path fillRule="evenodd"
                                                              d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>
                                                    </svg>
                                                    {this.state.index_format['footer_name'][index] + ': ' + value}
                                                    <svg width="1em" height="1em" viewBox="0 0 16 16"
                                                         className="bi bi-x-square ml-3" fill="currentColor"
                                                         xmlns="http://www.w3.org/2000/svg"
                                                         onClick={(e) => this.handleDelete(e, 'footer', index)}
                                                    >
                                                        <path fillRule="evenodd"
                                                              d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                                                        <path fillRule="evenodd"
                                                              d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                                                    </svg>
                                                </p>
                                            )}
                                        </ListGroup>
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
