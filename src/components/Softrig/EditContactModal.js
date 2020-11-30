import React, { Component } from 'react';
import 'loaders.css/loaders.css';
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';
import FormValidator from '../Forms/FormValidator.js';
import $ from 'jquery';

export default class EditContactModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //assetId: props.assetId,
            userModal: false,
            loadingData: true,
            ajaxObj: {
                token: window.localStorage.myToken,
                contactId: this.props.contactId
            },
            userForm: {
                contactName: ""
            },
        }

    }

    onSubmitEvent = async e => {
        //const form = e.target;
        let hasError = false;

        if (!hasError) {

            let userObj = {
                contactName: this.state.userForm.contactName,
                token: this.state.ajaxObj.token,
                contactId: this.state.ajaxObj.contactId
            }
            console.log(userObj)

            $.ajax({
                url: `http://localhost:5000/editContact`,
                type: "POST",
                data: userObj,
                success: () => {
                    console.log("done")
                },
                error: () => {
                    console.log("noe feilet?");
                }
            });
        }
    }

    // henting av spesifikk kontakt som kan brukes til redigering
    getContact = async () => {
        let tstate = this

        $.ajax({
            url: `http://localhost:5000/getContact`,
            type: "POST",
            data: this.state.ajaxObj,
            success: async (data) => {
                console.log("done")
                let contactObj = JSON.parse(data).then(
                    tstate.setState({
                        contactObj,
                        loadingData: false
                    })
                )

            },
            error: () => {
                console.log("noe feilet?");
            }
        })
    }

    toggleUserModal() {

        let tstate = this

        $.ajax({
            url: `http://localhost:5000/getContact`,
            type: "POST",
            data: this.state.ajaxObj,
            success: async (data) => {
                console.log("done")
                let contactObj = await JSON.parse(data)
                tstate.setState(prevState => ({
                    userForm: {
                        contactName: contactObj.Info.Name,
                    },
                    userModal: !prevState.userModal
                }))
            },
            error: () => {
                console.log("error");
            }
        })

        // this.setState(prevState => ({
        //     userForm: {
        //         contactName: this.state.contactObj.Info.Name,
        //     },
        //     userModal: !prevState.userModal
        // }))
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
                <form onSubmit={tstate.onSubmitEvent.bind(tstate)} name="userForm" id="userForm" autoComplete="off">
                    <Row>
                        { /* kolonne 1*/}
                        <Col lg="8">  {/* Fikser slik at man får fleire kolonner, start fra venstre */}
                            <div className="col1">
                                <div className="form-group row align-items-center">
                                    <label className="col-md-4 col-form-label">Navn</label>
                                    <Col md={6}>
                                        <Input type="text"
                                            name="contactName"
                                            invalid={tstate.hasError('userForm', 'contactName', 'required')}
                                            onChange={tstate.validateOnChange.bind(tstate)}
                                            data-validate='["required"]'
                                            value={tstate.state.userForm.contactName}
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
                    onClick={this.toggleUserModal.bind(this)}>
                    Rediger
                </Button>

                <Modal isOpen={this.state.userModal} className="modal-l" toggle={this.toggleUserModal.bind(this)}>
                    <ModalHeader toggle={this.toggleUserModal.bind(this)}>Rediger Kontakt</ModalHeader>
                    <ModalBody>
                        {modalForm(this.state.userModal, this)}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" type="submit" form="userForm">Lagre</Button>{' '}
                        <Button color="secondary" onClick={this.toggleUserModal.bind(this)}>Avbryt</Button>
                    </ModalFooter>
                </Modal>
            </span>
        );
    }
}