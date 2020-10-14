import React, {Component} from 'react';
import {
    Input,
    Label,
    FormText,
    FormGroup,
    InputGroup,
    UncontrolledCollapse,
    Button,
    Row, Col,
    UncontrolledTooltip
} from 'reactstrap'


const InputField = ({name, label, type, value, id, ft, i, change, ph, maxlength, disabled}) => {
    let formtext = '';
    if(ft) {
        formtext = (
            <FormText color="muted" style={{align: "left"}}>{ft}</FormText>
        );
    }

    return (
        <FormGroup className="mx-auto">
            <Label size="lg" for={id || name} >{label}</Label>
            <InputGroup>
                <Input maxLength={maxlength} type={type} name={name} id={id || name}
                       value={value}
                       placeholder={ph}
                       onChange={change}
                       disabled={disabled}
                />
            </InputGroup>
            {formtext}
        </FormGroup>
    );
}


// const InputFieldQuery = ({name, type, value, id, change_query, change_index, ph, maxlength, indexes, indexes_selected}) => {
class InputFieldQuery extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dropdownOpen: false,
        }
        this.toggleDropDown = this.toggleDropDown.bind(this);

        this.indexes = Object.keys(this.props.indexes).length > 0 ? this.props.indexes : {};
    }

    toggleDropDown() {
        this.setState({dropdownOpen: !this.state.dropdownOpen})
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return true
    }

    render() {
        return (
            <div>
                <div>
                    <UncontrolledCollapse toggler="#toggler">
                        <Row className="ml-5 pl-5">
                            {Object.keys(this.props.indexes).map((index_value, idx) =>
                                <Col className="col-4" key={idx}>
                                    <Input type="checkbox"
                                           value={index_value}
                                           onChange={this.props.change_index}
                                           id={idx.toString()}
                                           key={idx}
                                           checked={this.props.indexes_selected.indexOf(index_value) >= 0}
                                           disabled={this.props.indexes[index_value]["name"] === ''}
                                    />
                                    <Label for={idx.toString()} check>
                                        {this.props.indexes[index_value]["name"] === '' ? index_value : this.props.indexes[index_value]["name"]}
                                    </Label>
                                </Col>
                            )}
                        </Row>
                    </UncontrolledCollapse>
                </div>
                <br/>
                <FormGroup>
                    <InputGroup>
                        <UncontrolledTooltip placement="bottom" target="toggler">
                            Click para seleccionar los indices
                        </UncontrolledTooltip>
                        <Button color="primary" id="toggler" style={{marginBottom: '1rem'}}>
                            Indices
                        </Button>
                        {/*<InputGroupButtonDropdown addonType="append" isOpen={dropdownOpen} toggle={toggleDropDown}>*/}
                        {/*    <DropdownToggle caret className="border-0 bg-dark rounded-left px-4">*/}
                        {/*        Indices*/}
                        {/*    </DropdownToggle>*/}
                        {/*    <DropdownMenu>*/}
                        {/*        {Object.keys(indexes).map((value, idx) =>*/}
                        {/*            <DropdownItem*/}
                        {/*                key={idx}*/}
                        {/*                onClick={change_index}*/}
                        {/*                className={indexes_selected.indexOf(value) < 0 ? "bg-white text-black" : "bg-dark text-white"}*/}
                        {/*                value={value}*/}
                        {/*                disabled={typeof indexes[value].name === 'undefined'}*/}
                        {/*            >*/}
                        {/*                {indexes[value].name || value}*/}
                        {/*            </DropdownItem>*/}
                        {/*        )}*/}
                        {/*    </DropdownMenu>*/}
                        {/*</InputGroupButtonDropdown>*/}
                        <Input maxLength={this.props.maxlength}
                               type={this.props.type}
                               name={this.props.name}
                               id={this.props.id || this.props.name}
                               value={this.props.value}
                               placeholder={this.props.ph}
                               onChange={this.props.change_query}
                        />
                    </InputGroup>
                </FormGroup>
            </div>
        );
    }
}


export { InputField, InputFieldQuery };
