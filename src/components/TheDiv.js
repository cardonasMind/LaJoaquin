import React, { useRef } from "react";

const TheDiv = ({ show, children, toggle }) => {
    const theDivContainerRef = useRef();

    const hideTheDiv = () => {
        theDivContainerRef.current.style.left = "100vw";
        toggle();
    }

    return(
        <div className="theDivContainer" ref={theDivContainerRef} style={show ? { left: "0" } : { left: "100vw"}}>
            <div className="theDivHeader">
                <svg 
                    onClick={hideTheDiv}
                    viewBox="64 64 896 896" 
                    focusable="false"
                    data-icon="arrow-left" 
                    width="1.6rem" 
                    height="1.6rem" 
                    fill="currentColor" 
                    aria-hidden="true"
                >
                    <path d="M872 474H286.9l350.2-304c5.6-4.9 2.2-14-5.2-14h-88.5c-3.9 0-7.6 1.4-10.5 3.9L155 487.8a31.96 31.96 0 000 48.3L535.1 866c1.5 1.3 3.3 2 5.2 2h91.5c7.4 0 10.8-9.2 5.2-14L286.9 550H872c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z"></path>
                </svg>
            </div>
                    
            <div className="theDivContent">
                {children}
            </div>

            <style jsx>{`
                .theDivContainer {
                    position: fixed;
                    background: white;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    left: 100vw;
                    z-index: 999;
                    transition: .4s;
                    overflow-y: auto;
                }

                .theDivContainer .theDivHeader {
                    background: white;
                    z-index: 999;
                    padding: 1rem;
                    position: sticky;
                    top: 0;
                    right: 0;
                    left: 0;
                    text-align: left;
                }

            `}</style>
        </div>
    )
}

export default TheDiv;