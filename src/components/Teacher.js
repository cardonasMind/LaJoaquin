import React from "react";

import Avatar from "./craft/Avatar";

const Teacher = ({ subject, displayName, photoURL, background }) => {
    return(
        <div className="teacherContainer">
            <div className="teacherDataOverlay">
                <div className="teacherData">
                    <div className="teacherSubject">{subject}</div>
                    <Avatar
                        hasContainer
                        displayName={displayName}
                        photoURL={photoURL}
                    />
                </div>
            </div>

            <style jsx>{`
                .teacherContainer {
                    margin: 1rem;
                    width: 70vw;
                    height: 360px;
                    display: flex;
                    box-shadow: 0 0 6px 0px;
                    border-radius: 1.4rem;
                    position: relative;
                    background-image: url(${background ? background : "images/member/background.jpg"});
                    background-size: cover;
                    background-repeat: no-repeat;
                    overflow: hidden;
                    transition: 1s;
                }

                .teacherContainer:hover {
                    
                }

                .teacherDataOverlay {
                    position: absolute;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    left: 0;
                    background: rgba(0, 0, 0, .4);
                    color: white;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border: 4px solid white;
                    border-radius: 1.4rem;
                }

                .teacherSubject {
                    background: white;
                    padding: .2rem 1rem;
                    position: absolute;
                    top: 0;
                    right: 0;
                    left: 0;
                    color: black;
                    margin: 0 auto;
                    width: fit-content;
                    border-radius: 0 0 .4rem .4rem;
                }
            
            `}</style>
        </div>
    )
}

export default Teacher;