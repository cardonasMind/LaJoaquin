import React, { useEffect, useRef } from "react";

import Avatar from "../../components/craft/Avatar";

const FirstLogin = ({ disableFirstLogin, photoURL, displayName }) => {
    const firstLoginContainerRef = useRef();

    useEffect(() => {
        const firstLoginCycle = () => {
            const firstLoginContainer = firstLoginContainerRef.current;
    
            firstLoginContainer.style.top = "0";
    
            setTimeout(() => {
                firstLoginContainer.style.top = "-100vh";

                setTimeout(() => {
                    disableFirstLogin();
                }, 2000);
            }, 4000);
        }
        
        setTimeout(() => { 
            firstLoginCycle()
        }, 1000);
    })

    

    return(
        <div id="first-login-container" ref={firstLoginContainerRef}>
            <div id="member-avatar">
                <Avatar photoURL={photoURL} />
            </div>
            
            {displayName === "Miembro anónimo" 
            ? <p>Te has conectado de manera anónima por lo que tienes acceso limitado.</p> 
            : <p>¡Bienvenido/a <b>{displayName}!</b></p>}

            <style jsx>{`
                #first-login-container {
                    position: fixed;
                    right: 0;
                    left: 0;
                    background: white;
                    padding: .4rem;
                    padding-right: 1.4rem;
                    border-radius: 3rem;
                    display: grid;
                    grid-template-columns: auto 1fr;
                    grid-gap: 1rem;
                    box-shadow: 0 0 12px 0px;
                    margin: 1rem;
                    z-index: 999;
                    top: -100vh;
                    transition: 2s;
                }
                
                #member-avatar {
                    border: 2px dotted;
                    display: flex;
                    align-items: center;
                    border-radius: 50%;
                }
            `}</style>
        </div>
    )
}


export default FirstLogin;