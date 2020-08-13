import { Component, Fragment } from "react";

import { Button, Notification } from "rsuite";

import firebase from "../../config/firebase";

import AuthScreen from "../auth";

export default class extends Component {
    state = {
        selectAuthMethod: false,
        authScreen: false
    }

    loginAnonymously = () => {
        firebase.auth().signInAnonymously().catch(error => {
            Notification["error"]({
                title: "Ocurrió un error :(",
                description: error.message
            })
        });
    }

    render() {
        if(this.state.selectAuthMethod) {
            if(this.state.authScreen) {
                return <AuthScreen />
            } else {
                return(
                    <Fragment>
                        <div id="page-overlay">
                            <div id="page-content">
                                <h1>Antes de nada...</h1>
    
                                <h4>Para entrar a la página necesitas una cuenta (está no tiene nada que ver 
                                    con tus datos en el colegio, simplemente es necesaria para poder utilizar la página.
                                    Proximamente esperamos poder mejorar y conectarlo todo :D)
                                </h4>
    
                                <div id="auth-methods">
                                    <Button appearance="primary" onClick={() => this.setState({ authScreen: true })}>De acuerdo</Button> <a onClick={this.loginAnonymously}>Solo visitar</a>
                                </div>
                            </div>
                        </div>
    
                        <style jsx global>{`
                            #page {
                                padding: 1rem;
                                background-image: url("/images/member/background.jpg");
                                background-size: cover;
                                background-clip: content-box;
                            }
    
    
                            #page-overlay {
                                background: linear-gradient(transparent, black, black, transparent);
                                color: #f0f0f0;
                                position: absolute;
                                top: 0;
                                right: 0;
                                bottom: 0;
                                left: 0;
                                padding: 2rem;
                                display: grid;
                                align-items: center;
                                text-align: center;
                            }
    
                            #page-overlay h4 {
                                padding: 2rem 0;
                                text-align: left;
                                font-weight: normal;
                            }
                            
                            #auth-methods {
                                display: grid;
                                grid-template-columns: 1fr 1fr;
                                padding: 2rem 0;
                                align-items: center;
                                grid-gap: 1rem;
                            }
                        
                        `}</style>
                    </Fragment>
                )
            }
            
        } else {
            return(
                <Fragment>
                    <div id="principal-section">
                        <img src="/images/logo.png" alt="Logo de la institución" height="60px" />
                                        
                        <p>Bienvenido/a a la página web de la <b>Institución Educativa Joaquín Cárdenas Gómez</b>.
                        ¡Siéntete totalmente libre de opinar y enviarnos comentarios para que podamos crear una increíble página!
                        </p>
                    </div>
                                        
                    <div id="about-us-section">
                        <div id="about-us-image">
                            <img src="/images/fachada-institucion.jpg" />
                            <Button id="go-page-button" appearance="primary" onClick={() => this.setState({ selectAuthMethod: true })}>Ir a la página</Button>
                        </div>
                    </div>                       
                    
                    <div id="developed-by">
                        <p>Para reportar un error envia un WhatsApp a <a href="https://wa.me/573216328834">3216328834</a></p>
                        <small>Desarollado por Diego Cardona, estudiante de 11°1 2020</small>
                    </div>
                    
                    
                    <style jsx global>{`
                        #page {
                            padding: 2rem;
                        }

                        
                        #principal-section {
                            text-align: center;
                        }
                    
                        #principal-section img {
                            margin-bottom: 1rem;
                        }


                        #about-us-section {
                            margin: 2rem -2rem;
                        }

                        #about-us-section #about-us-image {
                            text-align: center;
                        }

                        #about-us-section #about-us-image img{
                            width: 100%;
                        }

                        #about-us-section #about-us-image #go-page-button {
                            transform: translateY(-1.6rem);
                        }


                        #developed-by {
                            text-align: center;
                        }
                    
                        
                    `}</style>
                </Fragment>
            )
        }
    }
}