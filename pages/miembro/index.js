import React, { Component, Fragment, useState } from "react";

import Head from "next/head";

import Router from "next/router";

import firebase from "../../src/config/firebase";

import { AuthContext } from "../../src/config/AuthProvider";

import { Button, Loader, Input, Uploader, Notification } from "rsuite";

import MessageModal from "../../src/components/MessageModal";
import TheDivController from "../../src/components/TheDivController";
import Avatar from "../../src/components/craft/Avatar";

import Navigation from "../../src/components/Navigation";

const ModifyProfileForm = ({ displayName, photoURL, updateUserAcoountFromDB }) => {
    const [ memberNewPhoto, setMemberNewPhoto ] = useState(photoURL);
    const [ memberNewName, setMemberNewName ] = useState(displayName);

    const handleDefaultPhoto = () => setMemberNewPhoto("/images/member/default.jpg");

    const handleChange = value => setMemberNewName(value);

    const resizeImage = imageURL => {
        const img = document.createElement("img");
        
        img.src = imageURL;
    
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
    
        const MAX_WIDTH = 140;
        const MAX_HEIGHT = 140;
        var width = img.width;
        var height = img.height;
    
        if (width > height) {
            if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
            }
        } else {
            if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
            }
        }
    
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
    
        return canvas.toDataURL("image/png");
    }

    const handleNewPhotoUpload = e => {
        const file = e.blobFile
        const reader = new FileReader();
        
        // Set the image once loaded into file reader
        reader.readAsDataURL(file);

        reader.onload = e => {
            const resizedImage = resizeImage(e.target.result);
            changeStateWithTheResizedImage(resizedImage);
        }

        const changeStateWithTheResizedImage = resizedImage => setMemberNewPhoto(resizedImage);
     }

    const handleModifyProfile = () => {
	    let newPhoto = false;
        let newName = false;

        // Check if user has change something
        if(memberNewPhoto !== photoURL) newPhoto = true;

        if(memberNewName !== displayName) newName = true;


        // Check for a valid new user name or new user photo
        if(newName || newPhoto) {
            if(memberNewName === "") {
                Notification["info"]({
                    title: "Espera",
                    description: "Por favor elige algún nombre de usuario."
                });
            } else {
                const currentUser = firebase.auth().currentUser;

                // Upload the new user photo
                if(newPhoto) {
                    Notification["info"]({
                        title: "Espera",
                        description: "Procesando imágen..."
                    });

                    if(memberNewPhoto === "/images/member/default.jpg") {
                        currentUser.updateProfile({
                            displayName: memberNewName,
                            photoURL: memberNewPhoto
                        })
                        .then(() => {
                            updateUserAcoountFromDB(memberNewName, memberNewPhoto);

                            Notification["success"]({
                                title: "¡Perfecto!",
                                description: "Todo correcto"
                            });

                            setTimeout(() => {  
                                // Restart page
                                Router.reload();
                            }, 1000);
                        })
                        .catch(error => {
                            Notification["error"]({
                                title: "Ocurrió un error :(",
                                description: error.message
                            });
                        });
                    } else {
                        // Upload the selected memberNewPhoto to firebase storage
                        const storageRef = firebase.storage().ref();
                        const uploadNewPhotoImage = storageRef.child(`usersImages/${currentUser.uid}`)
                            .putString(memberNewPhoto, 'data_url');
                        
                        uploadNewPhotoImage.then(snapshot => {
                            snapshot.ref.getDownloadURL().then(downloadURL => {
                                currentUser.updateProfile({
                                    displayName: memberNewName,
                                    photoURL: downloadURL
                                })
                                .then(() => {
                                    updateUserAcoountFromDB(memberNewName, downloadURL);

                                    Notification["success"]({
                                        title: "¡Perfecto!",
                                        description: "Todo correcto"
                                    });

                                    setTimeout(() => {  
                                        // Restart page
                                        Router.reload();
                                    }, 1000);
                                })
                                .catch(error => {
                                    Notification["error"]({
                                        title: "Ocurrió un error :(",
                                        description: error.message
                                    });
                                });
                            });
                        });
                    }

                    
                } else {
                    // User only changed the name
                    currentUser.updateProfile({
                        displayName: memberNewName
                    })
                    .then(() => {
                        updateUserAcoountFromDB(memberNewName, memberNewPhoto);

                        Notification["success"]({
                            title: "¡Perfecto!",
                            description: "Todo correcto"
                        });

                        setTimeout(() => {  
                            // Restart page
                            Router.reload();
                        }, 1000);
                    })
                    .catch(error => {
                        Notification["error"]({
                            title: "Ocurrió un error :(",
                            description: error.message
                        });
                    });
                }
            }
        } else {
            Notification["info"]({
                title: "Espera",
                description: "No has modificado tu información aún."
            });
        }
    }

    return(
        <div id="modify-profile-container">
            <div id="member-photo-container">
                <h2>Foto de pérfil</h2>
                <Avatar hasContainer photoURL={memberNewPhoto} />

                <div id="member-photo-buttons">
                    <div id="choose-photo-input">
                        <Uploader 
                            listType="picture-text" 
                            draggable
                            action=""
                            onUpload={handleNewPhotoUpload}  
                        >
                            <h2>Selecciona una Imágen</h2>
                        </Uploader>
                    </div>
                    <Button 
                        appearance="subtle" 
                        size="sm" 
                        block
                        onClick={handleDefaultPhoto}
                    >
                        Por defecto
                    </Button>
                </div>
            </div>

            <div id="member-name-container">
                <h2>Nombre de usuario</h2>
                <Input
                    type="text"
                    size="sm"
                    value={memberNewName}
                    onChange={handleChange}
                />
            </div>

            <div id="modify-profile-button">
                <Button
                    appearance="primary"
                    onClick={handleModifyProfile}
                >
                    Actualizar información
                </Button>
            </div>
                
            <style jsx>{`
                #member-photo-container {
                    text-align: center;
                    background: #f0f0f0;
                    margin-bottom: 1rem;
                    padding: 2rem;
                    display: grid;
                    grid-template-rows: auto auto auto;
                    grid-gap: .4rem;
                }


                #member-name-container {
                    padding: 0 1rem;
                }

                #member-name-container h2 {
                    margin-bottom: .4rem;
                }


                #modify-profile-button {
                    text-align: center;
                    padding: 
                    2rem 0;
                }
            `}</style>
        </div>
    )
}

const ModifyProfileButton = ({ showTheDiv, displayName, photoURL, updateUserAcoountFromDB }) => {
    const handleModifyProfile = () => {
        showTheDiv(<ModifyProfileForm displayName={displayName} photoURL={photoURL} 
            updateUserAcoountFromDB={updateUserAcoountFromDB} />);
    }

    return(
        <Button appearance='primary' size="xs" block onClick={handleModifyProfile}>Modificar perfil</Button>
    )
}

export default class extends Component {
    static contextType = AuthContext;

    state = {
        anonymousUserIsTryingToModifyProfile: false
    }

    handleModifyProfileAnonymous = () => this.setState({ anonymousUserIsTryingToModifyProfile: true });

    render() {
        const { logged, isAnonymous, displayName, photoURL, accountType, handleLogout } = this.context;

        const MemberPage = (
            <Fragment>
                <Head>
                    <title>Miembro | Institución Educativa Joaquín Cárdenas Gómez</title>
                </Head>
        
                {this.state.anonymousUserIsTryingToModifyProfile
                ? <MessageModal handleLogout={handleLogout} />
                : null}
                <div id="member-principal-section">
                    <div id="member-left-content">
                        <Avatar hasContainer photoURL={photoURL} />
                    </div>
                    <div id="member-right-content">
                        <h4 id="member-name">{displayName ? displayName : "Nombre de miembro"}</h4>
                        {isAnonymous
                        ?
                            <Button appearance='primary' size="xs" block onClick={this.handleModifyProfileAnonymous}>Modificar perfil</Button>
                        :
                            <TheDivController>
                                <ModifyProfileButton {...this.context}/>
                            </TheDivController>
                        }
                        <Button appearance='default' size="xs" block onClick={handleLogout}>Cerrar sesión</Button>
                    </div>
                    <div id="member-principal-section-overlay"></div>
                </div>
        
                <div id="member-posts-container">
                    <h2>Tus Publicaciones</h2>
                </div>
        
                <Navigation />
        
                <style jsx global>{`
                    #member-principal-section {
                        background-image: url("/images/member/background.jpg");
                        background-position: bottom;
                        background-size: cover;
                        background-color: #f0f0f0;
                        padding: 4rem 1rem;
                        position: relative;
                        z-index: 1;
                        display: grid;
                        grid-template-columns: auto 1fr;
                        grid-gap: 1rem;
                        align-items: center;
                    }
        
                    #member-principal-section #member-right-content {
                        display: grid;
                        grid-template-rows: auto auto auto;
                    }
        
                    #member-principal-section #member-right-content #member-name {
                        color: #f0f0f0;
                    }

        
                    #member-principal-section #member-principal-section-overlay {
                        position: absolute;
                        background: linear-gradient(transparent, #544d1e);
                        top: 0;
                        right: 0;
                        bottom: 0;
                        left: 0;
                        z-index: -1;
                    }
        
        
                    #member-posts-container {
                        padding: 1rem;
                    }
                `}</style>
            </Fragment>
        );

        if(isAnonymous) {
            return MemberPage;
        }

        if(accountType === "") {
            return(
                <Fragment>
                    <Head>
                        <title>Miembro | Institución Educativa Joaquín Cárdenas Gómez</title>
                    </Head>
        
                    {logged ? null : <MessageModal notLogged  />}

                    <Loader center content="Cargando" />
        
                    <Navigation />
                </Fragment>
            )
        }

        if(accountType === "directivo") {
            Router.push("/miembro/dirigir");
            return null
        } else if(accountType === "profesor") {
            Router.push("/miembro/educar");
            return null
        } else if(accountType === "normal") {
            return MemberPage;
        }
    }
}