import React, { Fragment, useRef } from "react";

import Link from "next/link";

import { Button } from 'rsuite';

const MessageModal = ({ notLogged, handleLogout }) => {
    const messageModalRef = useRef();

    const handleCloseModal = () => {
       messageModalRef.current.style.top = "200vh";
       messageModalRef.current.style.opacity = "0";
    }

    return(
        <div id="message-modal-container" ref={messageModalRef}>
            <div id="message-modal">
                <div id="message-modal-header">
                    <div id="modal-header-shape">
                        <img src="/icons/pregunta.svg" width="24px" />
                    </div>
                    
                </div>
                <div id="message-modal-content">
                    {
                        notLogged 
                        ?   <Fragment>
                                <p>Para disfrutar de toda la experiencia debes registrar tu cuenta.</p>

                                <div id="message-modal-buttons">
                                    <Link href="/"><Button appearance="primary" onClick={handleCloseModal} block>De acuerdo</Button></Link>
                                </div>
                            </Fragment>
                
                        :   <Fragment>
                                <p>Estás navegando de manera anonima, para disfrutar toda la experiencia debes registrar tu cuenta.</p>

                                <div id="message-modal-buttons">
                                    <Button appearance="primary" onClick={handleLogout}>De acuerdo</Button>
                                    <a onClick={handleCloseModal}>Cerrar</a>
                                </div>
                            </Fragment>
                    }
                    
                </div>
            </div>
            
            <style jsx>{`
                #message-modal-container {
                    position: fixed;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    left: 0;
                    background: rgba(0, 0, 0, .8);
                    z-index: 999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: .8s;
                    color: #121212;
                }


                #message-modal {
                    max-width: 84vw;
                }


                #message-modal-header {
                    display: flex;
                    justify-content: center;
                }

                #message-modal-header #modal-header-shape {
                    background: #FFEB3A;
                    transform: translateY(1rem) rotateZ(45deg);
                }

                #message-modal-header #modal-header-shape img {
                    transform: rotateZ(-45deg);
                }


                #message-modal-content {
                    padding: 1rem;
                    padding-top: 2rem;
                    background: white;
                    min-height: 14rem;
                    border-radius: .6rem;
                    border: 4px dashed #FFEB3A;
                    text-align: center;
                }

                #message-modal-content #message-modal-buttons {
                    display: flex;
                    justify-content: space-evenly;
                    align-items: center;
                    padding-top: 2rem;
                }
            
            
            `}</style>
        </div>
    )
        
}

export default MessageModal;