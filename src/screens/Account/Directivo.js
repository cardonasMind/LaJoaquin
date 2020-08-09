import { Component, Fragment } from "react";

import Link from "next/link";

import firebase from "firebase/app";
import "firebase/firestore";
import 'firebase/storage';

import BaseLayout from "../../layouts/Base";

import { Notification, Button, Uploader, Slider, Nav, Icon, IconButton, Avatar } from "rsuite";

import Post from "../Post";
import TheDivController from "../TheDivController";



/*            FUNCTION THAT RESIZES AN IMAGE :D             */
function ResizeImage(imageURL) {
    const img = document.createElement("img");
    
    img.src = imageURL;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    const MAX_WIDTH = 300;
    const MAX_HEIGHT = 300;
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








/*          THIS CONTROLLS WHEN THE ADMIN WHANTS TO PUBLISH SOMETHING :P            */
class NewPostForm extends Component {
    constructor() {
        super();

        // Choosing the actual date :3
        const fullDate = new Date();

        const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];

        const formatedDate = `${fullDate.getDate()} de ${monthNames[fullDate.getMonth()]} de ${fullDate.getFullYear()}`


        this.state = {
            cover: "color",
            author: "Don Juaco",
            authorImage: "/images/logo.png",
            date: formatedDate,
            timestamp: fullDate,
            postImage: "/images/member/background.jpg",
            postImageFile: "",
            postColor1: "#3fe434",
            postColor2: "#5f70b5",
            postColorDeg: "45",
            postColor: "",
            title: "Título de la publicación",
            titleColor: "#f0f0f0",
            description: "Descripción de la publicación"
        }

        this.baseState = this.state;

        this.postInfo = {}
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleCoverUpload = (e, file) => {
       const reader = new FileReader();

        // Set the image once loaded into file reader
        reader.readAsDataURL(file.blobFile);

        reader.onload = function(e) {
            const resizedImage = ResizeImage(e.target.result);

            changeStateWithTheResizedImage(resizedImage)
        }

        const changeStateWithTheResizedImage = resizedImage => {
            this.setState({ postImage: resizedImage, postImageFile: resizedImage });
        }
    }

    handleNewPost = () => {
        // Check all the info before send it
        const { postImage, postColor1, postColor2, postColorDeg, title, titleColor, description } = this.state;
        
        if(postImage == "" || postColor1 == "" 
        || postColor2 == "" || postColorDeg == "" 
        || title == "" || titleColor == "" || description == "") {
            Notification["warning"]({
                title: "Cuidado",
                description: "Tienes que llenar todos los datos"
            });
        } else {
            Notification["info"]({
                title: "Espera",
                description: "Publicación siendo procesada"
            });

            const db = firebase.firestore();
            const postToDB = db.collection('principalPosts').add(this.postInfo)

            if(this.state.postImageFile == "") {
                Notification["success"]({
                    title: "¡Perfecto!",
                    description: "Publicación realizada con exito"
                })

                // Restar to initial state
                this.setState(this.baseState)
            } else {
                postToDB.then(postRef => {
                    // Upload the selected image for cover wich his name is postRef
                    const storageRef = firebase.storage().ref();
                    
                    const uploadPostImage = storageRef.child(`principalPosts/${postRef.id}`)
                        .putString(this.state.postImageFile, 'data_url');
                            
                        uploadPostImage.then(snapshot => {
                            snapshot.ref.getDownloadURL().then(downloadURL => {
                                db.collection('principalPosts').doc(postRef.id).update({
                                    postImage: downloadURL
                                });

                                Notification["success"]({
                                    title: "¡Perfecto!",
                                    description: "Publicación realizada con exito"
                                })

                                // Restar to initial state
                                this.setState(this.baseState)
                            })
                        })
                    }
                )
                .catch(error => {
                    Notification["error"]({
                        title: "Ocurrió un error :(",
                        description: error.message
                    })
                })
            }
        }
    }


    render() {
        // Setting the right data if the post is with color as background or image
        const { author, authorImage, date, timestamp, postImage, title, titleColor, description } = this.state;
        
        if(this.state.cover === "color") {
            this.postInfo = {
                author,
                authorImage,
                date,
                timestamp,
                postColor: `linear-gradient(${this.state.postColorDeg}deg, ${this.state.postColor1}, ${this.state.postColor2})`,
                title,
                titleColor,
                description
            }
        } else {
            this.postInfo = {
                author,
                authorImage,
                date,
                timestamp,
                postImage,
                title,
                description
            }
        }

        return(
            <form>
                <div id="cover-input-container">
                    <h2>Portada</h2>
                    <select name="cover" value={this.state.cover} onChange={this.handleChange}>
                        <option value="image">Imágen</option> 
                        <option value="color">Color</option>
                    </select>
                </div>

                <div id="cover-type-container">
                    {this.state.cover === "image"
                    ? <div>
                        <Uploader 
                            listType="picture-text" 
                            draggable
                            action=""
                            onSuccess={this.handleCoverUpload}  
                        >
                            <h2>Selecciona una Imágen</h2>
                        </Uploader>
                    </div>
                    : <div id="color-cover">
                        <h2>Configurar color de fondo</h2>

                        <div id="color-inclination">
                            <div id="color-inclination-input">
                                <h3>Inclinación:</h3>
                                <input 
                                    name="postColorDeg" 
                                    type="number" 
                                    placeholder="45"
                                    value={this.state.postColorDeg}
                                    onChange={this.handleChange}
                                />
                            </div>

                            <div id="color-inclination-slider">
                                <Slider
                                    progress
                                    defaultValue={45}
                                    max={360}
                                    value={this.state.postColorDeg}
                                    onChange={value => {
                                        this.setState({ postColorDeg: value })
                                    }}
                                />
                            </div>
                        </div>

                        <div id="choose-background-color">
                            <h3>Primer color</h3>
                            <input
                                name="postColor1" 
                                type="color" 
                                value={this.state.postColor1}
                                onChange={this.handleChange}
                            />

                            <h3>Segundo color</h3>
                            <input 
                                name="postColor2" 
                                type="color" 
                                value={this.state.postColor2}
                                onChange={this.handleChange}
                            />
                        </div>

                        <div id="title-color">
                            <h3>Color de título</h3>
                            <input 
                                name="titleColor" 
                                type="color" 
                                value={this.state.titleColor} 
                                onChange={this.handleChange} 
                            />
                        </div>
                    </div>}
                </div>

                <div id="post-title-container">
                    <h2>Título</h2>
                    <input 
                        type="text" 
                        name="title" 
                        placeholder="Título de la publicación" 
                        value={this.state.title}
                        onChange={this.handleChange}    
                    />
                </div>

                <div id="post-description-container">
                    <h2>Contenido</h2>
                    <textarea
                        name="description"
                        rows="8" 
                        placeholder="Escribe aquí cuanto desees"
                        value={this.state.description}
                        onChange={this.handleChange}
                    />
                </div>

                <div id="post-preview-container">
                    <h2>Previsualizar</h2>
                    <Post 
                        {...this.postInfo}
                    />
                </div>

                <Button appearance="primary" block onClick={this.handleNewPost}>Publicar</Button>


                <style jsx>{`
                    form {
                        padding-bottom: 2rem;
                    }

                    #cover-input-container {
                        text-align: center;
                        padding: 1rem 0;
                    }

                    #cover-type-container {
                        margin: .4rem 0;
                        padding: 1rem .4rem;
                        background: #f0f0f0;
                        text-align: center;
                    }

                    #cover-type-container #color-cover #color-inclination {
                        display: grid;
                        grid-template-rows: auto auto;
                        grid-gap: .4rem;
                        margin-top: 1rem;
                    }

                    #cover-type-container #color-cover #color-inclination #color-inclination-input {
                        display: grid;
                        grid-template-columns: auto 1fr;
                        grid-gap: .4rem;
                    }

                    #cover-type-container #color-cover #choose-background-color {
                        display: grid;
                        grid-template-columns: auto auto auto auto;
                        margin: 1rem 0;
                    }

                    #cover-type-container #color-cover #choose-background-color input {
                        margin: 0 .4rem;
                    }

                    #cover-type-container #color-cover #title-color {
                        display: flex;
                        justify-content: center;
                    }

                    #cover-type-container #color-cover #title-color input {
                        margin: 0 .4rem;
                    }

                    #post-title-container {
                        margin: 1rem 0;
                    }

                    #post-title-container input{
                        margin: .4rem 0;
                        width: 100%;
                    }


                    #post-description-container textarea {
                        margin: .4rem 0;
                        width: 100%;
                    }

                    
                    #post-preview-container {
                        margin: 1rem -1rem;
                    }

                    #post-preview-container h2 {
                        text-align: center;
                    }
                `}</style>
            </form>
        )
    }
}

class NewPost extends Component {
    handleNewPost = () => {
        const newPostContent = (
            <div id="new-post-container">
                <NewPostForm />
                    
                <style jsx>{`
                    #new-post-container {
                        text-align: left;
                        padding: 0 1rem;
                    }

                    
                `}</style>
            </div>
        );

        this.props.showTheDiv(newPostContent)
    }

    render() {
        return(
            <IconButton onClick={this.handleNewPost} icon={<Icon icon="plus" />} placement="left">
                Hacer una publicación
            </IconButton>
        )
    }
}















const HeaderNavigation = ({ active, onSelect, ...props }) => {
    return (
        <Nav {...props} activeKey={active} onSelect={onSelect} >
            <Nav.Item eventKey="post" href="#principal-director-section">Publicar</Nav.Item>
            <Nav.Item eventKey="personal" href="#personal-section">Personal</Nav.Item>
            <Nav.Item eventKey="posts" href="#posts-section">Publicaciones</Nav.Item>
            <Nav.Item eventKey="goHome">
                <Link href="/"><Icon icon="close" /></Link>
            </Nav.Item>
        </Nav>
    );
};

class HeaderNavigationComponent extends Component {
    state = {
        active: ""
    }

    handleSelect = active => this.setState({ active })

    render() {
        const { active } = this.state;

        return (
            <HeaderNavigation appearance="subtle" active={active} onSelect={this.handleSelect} />
        );
    }
}









const NewPersonal = props => {
    const handleNewPersonal = () => {
        const newPersonalContent = (
            <div id="fe">
                <h1>f</h1>

                <style jsx>{`#fe { background: red}`}</style>
            </div>
        );

        props.showTheDiv(newPersonalContent)
    }

    return(
        <div id="add-new-personal" onClick={handleNewPersonal}>
            <Icon id="add-new-personal-icon" icon="plus" />
            <h4>Agregar</h4>

            <style jsx>{`
                #add-new-personal {
                    text-align: center;
                    padding: 1rem;
                    background: #f0f0f0;
                    margin: .4rem 0;
                }
            `}</style>
        </div>
    )
}





const AvatarWithName = ({ avatarURL, name }) => {
    return(
        <div className="avatarWithName">
            <Avatar
                circle
                src={avatarURL}
            />
            <p>{name}</p>

            <style jsx>{`
                .avatarWithName {
                    text-align: center;
                    margin: .4rem 1rem;
                }
            `}</style>
        </div>
        
    )
}





/*          THIS IS BASICALLY THE PAGE          */
export default class extends Component {
    render() {
        return(
            <BaseLayout>
                <div id="principal-director-section">
                    <h1>Panel director</h1>

                    <TheDivController>
                        <NewPost />
                    </TheDivController>
                </div>

                <header>
                    <HeaderNavigationComponent />
                </header>

                <div id="personal-section">
                    <h2>Personal</h2>
                    <TheDivController>
                        <NewPersonal />
                    </TheDivController>
                        
                    <h3>Directivos</h3>
                    <div id="directivos-slider">
                        <AvatarWithName 
                            avatarURL="https://avatars2.githubusercontent.com/u/12592949?s=460&v=4"
                            name="Dorian Alexis"
                        />
                    </div>

                    <h3>Maestros</h3>
                    <div id="maestros-slider">
                        <AvatarWithName 
                            avatarURL="https://avatars2.githubusercontent.com/u/12592949?s=460&v=4"
                            name="Dorian Alexis"
                        />
                    </div>
                </div>

                <div id="posts-section">
                    <h2>Publicaciones</h2>

                    <div id="posts-container">

                    </div>
                </div>

                <style jsx global>{`
                    #principal-director-section {
                        background-image: url("/images/member/background.jpg");
                        background-size: cover;
                        padding: 2rem;
                        display: grid;
                        grid-template-rows: auto auto;
                        text-align: center;
                        justify-content: center;
                        align-items: center;
                    }


                    header {
                        position: sticky;
                        top: 0;
                        right: 0;
                        left: 0;
                        background: white;
                        padding: .4rem 1rem;
                        z-index: 998;
                    }


                    #personal-section {
                        padding: 1rem;
                    }

                    #personal-section #add-new-personal #add-new-personal-icon {
                        padding: 1rem;
                        border-radius: 50%;
                        border: 1px dashed;
                    }
                    
                    #personal-section #directivos-slider, 
                    #personal-section #maestros-slider {
                        display: flex;
                        overflow-x: auto;
                        margin: 1rem -1rem;
                    }

                    #personal-section #directivos-slider .avatarWithName:hover , 
                    #personal-section #maestros-slider .avatarWithName:hover {
                        background: red;
                    }


                    #posts-section {
                        padding: 1rem;
                    }
                `}</style>
            </BaseLayout>
        )
    }
}