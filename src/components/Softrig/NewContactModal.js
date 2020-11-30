import React, { Component } from 'react';
import 'loaders.css/loaders.css';
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';
import FormValidator from '../Forms/FormValidator.js';
import Datetime from 'react-datetime';
import moment from 'moment';
import $ from 'jquery';

export default class AssetModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contactModal: false,
            contactForm: {
                contactName: "",
                address: "",
                city: "",
                country: "",
                phoneNum: "",
                email: ""
            },
        }
    }


    onSubmitEvent = async e => {
        let hasError = false;

        if (!hasError) {
            
            let contactObj = {
                contactName: this.state.contactForm.contactName,
                address: this.state.contactForm.address,
                city: this.state.contactForm.city,
                country: this.state.contactForm.country,
                phoneNum: this.state.contactForm.phoneNum,
                email: this.state.contactForm.email,
                token: window.localStorage.myToken
            }
            //console.log(contactObj)

            $.ajax({
                url: `http://localhost:5000/newContact`,
                type: "POST",
                data: contactObj,
                success: () => {
                    console.log("done");
                },
                error: () => {
                    console.log("error")
                }
            });
        }
    }

    toggleContactModal() {

        this.setState(prevState => ({
            contactForm: {
                contactName: "",
                address: "",
                city: "",
                country: "",
                phoneNum: "",
                email: ""
            },
            contactModal: !prevState.contactModal
        }));
    }

    validateOnChange = event => {
        const input = event.target;
        const form = input.form;
        const value = input.type === 'checkbox' ? input.checked : input.value;

        const result = FormValidator.validate(input);

        this.setState({
            [form.name]: {
                ...this.state[form.name],
                [input.name]: value,
                errors: {
                    ...this.state[form.name].errors,
                    [input.name]: result
                }
            }
        });
    }

    hasError = (formName, inputName, method) => {
        return this.state[formName] &&
            this.state[formName].errors &&
            this.state[formName].errors[inputName] &&
            this.state[formName].errors[inputName][method]
    }

    render() {

        function modalForm(loading, tstate) {
            return (
                <form onSubmit={tstate.onSubmitEvent.bind(tstate)} name="contactForm" id="contactForm" autoComplete="off">
                    <Row>
                        { /* kolonne 1*/}
                        <Col lg="8">  {/* Fikser slik at man får fleire kolonner, start fra venstre */}
                            <div className="col1">
                                <div className="form-group row align-items-center">
                                    <label className="col-md-4 col-form-label">Navn</label>
                                    <Col md={6}>
                                        <Input type="text"
                                            name="contactName"
                                            invalid={tstate.hasError('contactForm', 'contactName', 'required')}
                                            onChange={tstate.validateOnChange.bind(tstate)}
                                            data-validate='["required"]'
                                            value={tstate.state.contactForm.contactName}
                                        />
                                        <span className="invalid-feedback">Må fylles ut</span>
                                    </Col>
                                </div>
                                <div className="form-group row align-items-center">
                                    <label className="col-md-4 col-form-label">Adresse</label>
                                    <Col md={6}>
                                        <Input type="text"
                                            name="address"
                                            invalid={tstate.hasError('contactForm', 'address', 'required')}
                                            onChange={tstate.validateOnChange.bind(tstate)}
                                            data-validate='["required"]'
                                            value={tstate.state.contactForm.address}
                                        />
                                        <span className="invalid-feedback">Må fylles ut</span>
                                    </Col>
                                </div>
                                <div className="form-group row align-items-center">
                                    <label className="col-md-4 col-form-label">By</label>
                                    <Col md={6}>
                                        <Input type="text"
                                            name="city"
                                            invalid={tstate.hasError('contactForm', 'city', 'required')}
                                            onChange={tstate.validateOnChange.bind(tstate)}
                                            data-validate='["required"]'
                                            value={tstate.state.contactForm.city}
                                        />
                                        <span className="invalid-feedback">Må fylles ut</span>
                                    </Col>
                                </div>
                                <div className="form-group row align-items-center">
                                    <label className="col-md-4 col-form-label">Land</label>
                                    <Col md={6}>
                                        <Input type="text"
                                            name="country"
                                            invalid={tstate.hasError('contactForm', 'country', 'required')}
                                            onChange={tstate.validateOnChange.bind(tstate)}
                                            data-validate='["required"]'
                                            value={tstate.state.contactForm.country}
                                        />
                                        <span className="invalid-feedback">Må fylles ut</span>
                                    </Col>
                                </div>
                                <div className="form-group row align-items-center">
                                    <label className="col-md-4 col-form-label">Telefon</label>
                                    <Col md={6}>
                                        <Input type="text"
                                            name="phoneNum"
                                            invalid={tstate.hasError('contactForm', 'phoneNum', 'required')}
                                            onChange={tstate.validateOnChange.bind(tstate)}
                                            data-validate='["required"]'
                                            value={tstate.state.contactForm.phoneNum}
                                        />
                                        <span className="invalid-feedback">Må fylles ut</span>
                                    </Col>
                                </div>
                                <div className="form-group row align-items-center">
                                    <label className="col-md-4 col-form-label">E-post</label>
                                    <Col md={6}>
                                        <Input type="text"
                                            name="email"
                                            invalid={tstate.hasError('contactForm', 'email', 'required')}
                                            onChange={tstate.validateOnChange.bind(tstate)}
                                            data-validate='["required"]'
                                            value={tstate.state.contactForm.email}
                                        />
                                        <span className="invalid-feedback">Må fylles ut</span>
                                    </Col>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </form>
            )
        }

        return (
            <span className="mr-auto">
                <Button color="primary"
                    style={{ marginBottom: "5px", marginLeft: "6px" }}
                    onClick={this.toggleContactModal.bind(this)}>
                    Ny kontakt
                </Button>

                <Modal isOpen={this.state.contactModal} className="modal-l" toggle={this.toggleContactModal.bind(this)}>
                    <ModalHeader toggle={this.toggleContactModal.bind(this)}>Kontakt</ModalHeader>
                    <ModalBody>
                        {modalForm(this.state.contactModal, this)}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" type="submit" form="contactForm">Lagre</Button>{' '}
                        <Button color="secondary" onClick={this.toggleContactModal.bind(this)}>Avbryt</Button>
                    </ModalFooter>
                </Modal>
            </span>
        );
    }
}