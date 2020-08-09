import React from "react";

const Avatar = ({ hasContainer, displayName, photoURL }) => {
    const hasContainerStyle = hasContainer ? {
        width: "60px",
        height: "60px",
        borderRadius: "100%",
        background: "white",
        boxShadow: "inset 0px 0px 6px 0px black",
        alignItems: "center",
        margin: "0 auto"
    } : null

    return(
        <div className="avatarContainer">
            <div className="avatarImageContainer" style={hasContainerStyle} >
                <div className="avatar" />
            </div>
            {displayName && <p>{displayName}</p>}
            
            <style jsx>{`
                .avatarContainer {
                    text-align: center;
                }
                
                .avatarImageContainer {
                    display: flex;
                    justify-content: center;
                }

                .avatar {
                    background-image: url(${photoURL ? photoURL : "/images/member/default.jpg"});
                    width: 40px;
                    height: 40px;
                    background-size: cover;
                    background-repeat: no-repeat;
                    background-position: center;
                    border-radius: 50%;
                }

                p {
                    margin-top: .4rem;
                }
            `}</style>
        </div>
    )
}

export default Avatar;