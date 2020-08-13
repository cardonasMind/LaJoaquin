import React, { Component, Fragment } from "react";

import firebase from "../../config/firebase";

import { AuthContext } from "../../config/AuthProvider";

import { Button, Icon, Panel, Notification, Input } from "rsuite";

export default class extends Component {
    static contextType = AuthContext;

    state = {
        phoneScreen: true,
        phoneNumber: "",
        phoneCode: "",
        confirmationResult: {}
    }

    handleChange = (value, e) => this.setState({ [e.target.name]: e.target.value });

    handleSendPhoneCode = e => {
        const { phoneNumber } = this.state;
        
        if(phoneNumber.length === 10) {
            window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(e.target, {
                'size': 'invisible',
                'callback': () => {}
            });

            const appVerifier = window.recaptchaVerifier;

            firebase.auth().signInWithPhoneNumber(`+57${phoneNumber}`, appVerifier)
            .then(confirmationResult => {
                this.setState({ phoneScreen: false });

                this.setState({ confirmationResult })

                Notification["success"]({
                    title: "¡Perfecto!",
                    description: "En breves recibirás un código de verificación en tú celular"
                });
            })
            .catch(error => {
                Notification["error"]({
                    title: "Ocurrió un error :(",
                    description: `Código: ${error.code}. Reinicia la página, y si el problema persiste
                    contacta con un administrador`
                });
            })
        } else {
            Notification["info"]({
                title: "Espera",
                description: "Por favor verifica tú número, recuerda que debe tener 10 dígitos"
            });
        }
    }


    handlePhoneCode = () => {
        const { phoneCode, confirmationResult } = this.state;

        if(phoneCode.length === 6) {
            confirmationResult.confirm(this.state.phoneCode)
            .catch(error => {
                Notification["error"]({
                    title: "Ocurrió un error :(",
                    description: `Código: ${error.code}. Reinicia la página, y si el problema persiste
                    contacta con un administrador`
                });
            })
        } else {
            Notification["info"]({
                title: "Espera",
                description: "Comprueba tu código de verificación"
            });
        }
    }
 
    render() {
        const { handleGoogleAuth } = this.context;

        return(
            <Fragment>
                <h1>Selecciona un método</h1>

                <div id="auth-methods-container">
                    <Button color="red" onClick={handleGoogleAuth}>
                        Acceder con Google <Icon icon="google" /> 
                    </Button>

                    <div id="phone-auth-container">
                        <Panel 
                            bordered
                            collapsible
                            header="Utilizando tu número de celular"
                        >
                            <div id="phone-auth-container">
                            {this.state.phoneScreen 
                            ? 
                                <div id="phone-number-container">
                                    <h2>Número de celular</h2>
                                    <Input
                                        type="number"
                                        name="phoneNumber"
                                        size="sm"
                                        value={this.state.phoneNumber}
                                        onChange={this.handleChange}
                                    />
                                    <Button 
                                        appearance="primary" 
                                        size="sm"
                                        block
                                        onClick={e => this.handleSendPhoneCode(e)}
                                    >
                                        Enviar código
                                    </Button>
                                </div>
                            : 
                                <div id="phone-code-container">
                                    <h2>Código de verificación</h2>
                                    <Input
                                        type="number"
                                        name="phoneCode"
                                        size="sm"
                                        value={this.state.phoneCode}
                                        onChange={this.handleChange}
                                    />
                                    
                                    <Button 
                                        appearance="primary" 
                                        size="sm"
                                        block
                                        onClick={this.handlePhoneCode}
                                    >
                                        ¡Listo!
                                    </Button>
                                </div>
                            }
                            </div>
                        </Panel>
                    </div>
                </div>

                <style jsx global>{`
                    #page {
                        padding: 2rem;
                        background-image: url("/images/member/background.jpg");
                        background-size: cover;
                        background-position: right;
                    }


                    #auth-methods-container {
                        padding: 1rem 0;
                        display: grid;
                        grid-template-rows: auto auto;
                        grid-gap: .4rem;
                    }

                    #auth-methods-container #phone-auth-container {
                        background: white;
                    }

                    #auth-methods-container #phone-auth-container #phone-auth-container {
                        text-align: center;
                    }

                    #auth-methods-container #phone-auth-container #phone-auth-container input {
                        margin: .4rem 0;
                        width: 100%;
                    }
                                    
                `}</style>
            </Fragment>
        )
    }
}