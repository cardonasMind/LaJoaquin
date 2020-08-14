import React, { Component, Fragment, useEffect, useState } from "react";

import firebase from "../../config/firebase";

import Router from "next/router";

import Hermes from "./Hermes";

import { Button, Uploader, Notification, Input } from "rsuite";


const FirstStage = ({ setSecondStage }) => {
    const [ hermesMessage, setHermesMessage ] = useState("Hermes me llamo yo, y el dios griego de los mensajes soy...")

    useEffect(() => {
        setTimeout(() => {
            setHermesMessage("Te doy la bienvenida y como paso final, necesito que eligas tu nombre y foto de pérfil");
        
            setTimeout(() => {
                setSecondStage();
            }, 6000);
        }, 4000);
    })

    return <Hermes message={hermesMessage} />
}



const SecondStage = ({ setThirdStage }) => {
    const [ showPhotoForm, setShowPhotoForm ] = useState(true);
    const [ photoImage, setPhotoImage ] = useState("");

    const [ memberName, setMemberName ] = useState("");

    /*            FUNCTION THAT RESIZES AN IMAGE :D             */
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

    const handlePhotoUpload = e => {
        const file = e.blobFile
        const reader = new FileReader();
        
        // Set the image once loaded into file reader
        reader.readAsDataURL(file);

        reader.onload = e => {
            const resizedImage = resizeImage(e.target.result);
            changeStateWithTheResizedImage(resizedImage);
        }

        const changeStateWithTheResizedImage = resizedImage => setPhotoImage(resizedImage)
    }

    const handleDefaultPhoto = () => setPhotoImage("/images/member/default.jpg");

    const handlePhotoForm = () => {
        if(photoImage === "") {
            Notification["info"]({
                title: "Espera",
                description: "Por favor selecciona alguna imágen."
            });
        } else {
            Notification["success"]({
                title: "¡Perfecto!",
                description: "Ahora elige tu nombre"
            });

            setShowPhotoForm(false);
        }
    }

    const handleChange = (value) => setMemberName(value);

    const handleUpdateBasicData = () => {
        // Check for a valid name
        if(memberName === "") {
            Notification["info"]({
                title: "Espera",
                description: "Elige un nombre valido."
            });
        } else {
			const currentUser = firebase.auth().currentUser;
			
			if(photoImage === "/images/member/default.jpg") {
				currentUser.updateProfile({
					displayName: memberName,
					photoURL: "/images/member/default.jpg"
				})
				.then(() => {
					Notification["success"]({
						title: "¡Perfecto!",
						description: "Todo correcto"
					});

					setThirdStage();
				})
				.catch(error => {
					Notification["error"]({
						title: "Ocurrió un error :(",
						description: error.message
					});
				});
		
			} else {
				// Member has upload a image 
				Notification["info"]({
					title: "Espera",
					description: "Procesando imágen..."
				});

				// Upload the selected photoImage to firebase storage
				const storageRef = firebase.storage().ref();
				const uploadPhotoImage = storageRef.child(`usersImages/${currentUser.uid}`)
					.putString(photoImage, 'data_url');

				uploadPhotoImage.then(snapshot => {
					snapshot.ref.getDownloadURL().then(downloadURL => {

						currentUser.updateProfile({
							displayName: memberName,
							photoURL: downloadURL
						})
						.then(() => {
							Notification["success"]({
								title: "¡Perfecto!",
								description: "Todo correcto"
							});

							setThirdStage();
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
        }
    }

    return(
        <div id="choose-data-container">
            {
                showPhotoForm
                ?
                    <div id="choose-photo-form">
                        <div id="member-avatar-container">
                            <div id="member-avatar" />
                        </div>
                        <div id="choose-photo-buttons">
                            <div id="choose-photo-input">
                                <Uploader 
                                    listType="picture-text" 
                                    draggable
                                    action=""
                                    onUpload={handlePhotoUpload}  
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

                        <Button appearance="primary" onClick={handlePhotoForm}>Listo</Button>
                    </div> 
                :
                    <div id="choose-name-form">
                        <div id="member-avatar-container">
                            <div id="member-avatar" />
                        </div>

                        <div id="choose-name-input">
                            <p>Tu nombre de usuario</p>
                            <Input 
                                type="text"
                                size="sm"
                                value={memberName}
                                onChange={handleChange}
                            />
                        </div>
                            
                        <Button appearance="primary" onClick={handleUpdateBasicData}>Listo</Button>
                    </div> 
            }
            

            <style jsx global>{`
                #choose-data-container {
                    padding-top: 4rem;
                    display: flex;
                    align-items: center;
                    text-align: center;
                }

                #choose-photo-form, 
                #choose-name-form {
                    width: 100%;
                    padding: 0 2rem;
                    z-index: 1;
                }

                #member-avatar-container {
                    width: 80px;
                    height: 80px;
                    border-radius: 100%;
                    background: white;
                    box-shadow: inset 0px 0px 6px 0px black;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto;
                }

                #member-avatar-container #member-avatar {
                    background-image: url(${photoImage});
                    background-position: center;
                    width: 60px;
                    height: 60px;
                    background-size: cover;
                    background-repeat: no-repeat;
                    border-radius: 50%;
                }

                #choose-photo-buttons {
                    margin: 1rem 0;
                    display: grid;
                    grid-template-rows: auto auto;
                    grid-gap: .4rem;
                }

                #choose-photo-buttons #choose-photo-input {
                    position: relative;
                }

                #choose-photo-buttons #choose-photo-input input {
                    top: 0;
                    right: 0;
                    bottom: 0;
                    left: 0;
                }


                #choose-name-input {
                    padding: 1rem 0;
                }

                #choose-name-input p {
                    text-align: left;
                    color: #f0f0f0;
                }
            `}</style>
        </div>
    )
}




const ThirdStage = ({ setFourthStage }) => {
    const [ hermesMessage, setHermesMessage ] = useState("Perfecto entonces, ¡bienvenido/a seas!")

    useEffect(() => {
        setTimeout(() => {
            setHermesMessage("Ya aprenderás a contactar conmigo...");
        
            setTimeout(() => {
                setFourthStage();
            }, 3000);
        }, 3000);
    })

    return <Hermes message={hermesMessage} />
}




const BackgroundMusicPlayer = () => {
    return(
        <div id="background-music-container">
            <div id="background-music-player">
                <h3>Agregar emoción ;)</h3>
                <audio controls autoPlay loop src="sounds/auth-background.mp3" />
            </div>

            <style jsx>{`
                #background-music-container {
                    display: flex;
                    justify-content: center;
                }

                #background-music-player {
                    display: grid;
                    grid-template-rows: auto auto;
                    grid-gap: .4rem;
                    justify-content: center;
                    text-align: center;
                    border-right: 4px dotted gold;
                    border-bottom: 4px dotted gold;
                    border-left: 4px dotted gold;
                    border-radius: 0 0 2rem 2rem;
                    color: black;
                    background: white;
                    padding: .4rem 1rem;
                }

                audio {
                    width: 150px;
                    height: 3rem;
                }
            
            `}</style>
        </div>
    )
}



export default class extends Component {
    state = {
        stage: 1
    }

    setSecondStage = () => this.setState({ stage: 2 });

    setThirdStage = () => this.setState({ stage: 3 });

    setFourthStage = () => this.setState({ stage: 4 });

    sendUserToIndex = () => {
        Router.reload();
    }

    render() {
        const { stage } = this.state;

        return(
            <Fragment>
                <div id="image-overlay">
                    <div id="page-overlay">
                        <BackgroundMusicPlayer />

                        {
                            stage === 1 
                            ?
                                <FirstStage setSecondStage={this.setSecondStage} />
                            :
                                null
                        }

                        {
                            stage === 2
                            ?
                                <SecondStage setThirdStage={this.setThirdStage}/>
                            :
                                null
                        }

                        {
                            stage === 3
                            ? 
                                <ThirdStage setFourthStage={this.setFourthStage} />
                            :
                                null
                        }

                        { 
                            stage === 4 
                            ?
                                this.sendUserToIndex()
                            :
                                null
                        }
                    </div>
                </div>
                

                <style jsx global>{`
                    #page {
                        padding-bottom: 0;
                    }

                    #image-overlay {
                        background: url("images/member/greek-background.jpg");
                        background-size: cover;
                        position: absolute;
                        top: 0;
                        right: 0;
                        bottom: 0;
                        left: 0;
                        height: 100vh;
                    }
                    
                    #page-overlay {
                        background: linear-gradient(rgba(0, 0, 0, .8), rgba(107, 90, 0, .6));
                        position: absolute;
                        top: 0;
                        right: 0;
                        bottom: 0;
                        left: 0;
                    }
                
                `}</style>
            </Fragment>
        )
    }
}