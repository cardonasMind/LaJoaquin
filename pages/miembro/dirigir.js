import { Component, Fragment } from "react";

import Link from "next/link";
import Head from "next/head";
import Router from "next/router";

import firebase from "firebase/app";
import "firebase/firestore";
import 'firebase/storage';

import { AuthContext } from "../../src/config/AuthProvider";

import { Notification, Button, Uploader, Slider, Nav, Icon, 
    IconButton, Loader, Input, InputGroup, Toggle } from "rsuite";

import Avatar from "../../src/components/craft/Avatar";

import Post from "../../src/components/Post";
import TheDivController from "../../src/components/TheDivController";
import MessageModal from "../../src/components/MessageModal";





/*          THIS CONTROLLS WHEN THE ADMIN WHANTS TO PUBLISH SOMETHING :P            */
class NewPostForm extends Component {
    constructor() {
        super();

        // Choosing the actual date :3
        const fullDate = new Date();

        const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];

        const formatedDate = 
        `${fullDate.getDate()} de ${monthNames[fullDate.getMonth()]} de ${fullDate.getFullYear()}`


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

    /*            FUNCTION THAT RESIZES AN IMAGE :D             */
    resizeImage = imageURL => {
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


    handleChangeNormal = e => this.setState({ [e.target.name]: e.target.value });

    handleChange = (value, e) => this.setState({ [e.target.name]: e.target.value });

    handleCoverUpload = (e, file) => {
       const reader = new FileReader();

        // Set the image once loaded into file reader
        reader.readAsDataURL(file.blobFile);

        reader.onload = e => {
            const resizedImage = this.resizeImage(e.target.result);

            changeStateWithTheResizedImage(resizedImage)
        }

        const changeStateWithTheResizedImage = resizedImage => 
            this.setState({ postImage: resizedImage, postImageFile: resizedImage });
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
                });

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

                                // Restart to initial state
                                this.setState(this.baseState)
                            })
                        })
                    }
                )
                .catch(error => {
                    Notification["error"]({
                        title: "Ocurrió un error :(",
                        description: error.message
                    });
                });
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
                    <select name="cover" value={this.state.cover} onChange={this.handleChangeNormal}>
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
                                <InputGroup>
                                    <InputGroup.Addon>Inclinación</InputGroup.Addon>
                                    <Input
                                        name="postColorDeg"
                                        type="number"
                                        placeholder="45"
                                        size="sm"
                                        value={this.state.postColorDeg}
                                        onChange={this.handleChange}
                                    />
                                </InputGroup>
                            </div>

                            <div id="color-inclination-slider">
                                <Slider
                                    progress
                                    defaultValue={45}
                                    max={360}
                                    value={Number(this.state.postColorDeg)}
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
                                onChange={this.handleChangeNormal}
                            />

                            <h3>Segundo color</h3>
                            <input 
                                name="postColor2" 
                                type="color" 
                                value={this.state.postColor2}
                                onChange={this.handleChangeNormal}
                            />
                        </div>

                        <div id="title-color">
                            <h3>Color de título</h3>
                            <input 
                                name="titleColor" 
                                type="color" 
                                value={this.state.titleColor} 
                                onChange={this.handleChangeNormal} 
                            />
                        </div>
                    </div>}
                </div>

                <div id="post-title-container">
                    <h2>Título</h2>
                    <Input
                        type="text"
                        name="title"
                        placeholder="Título de la publicación"
                        value={this.state.title}
                        onChange={this.handleChange}
                    />
                </div>

                <div id="post-description-container">
                    <h2>Contenido</h2>
                    <Input
                        name="description"
                        componentClass="textarea" 
                        rows={8} 
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
























class ModifyPersonalForm extends Component {
    state = {
        accountType: this.props.accountType
    }

    handleChange = e => this.setState({ [e.target.name]: e.target.value });

    updateMemberAccountType = () => {
        const db = firebase.firestore();

        const { UID, displayName } = this.props;
        const { accountType } = this.state;

        if(UID) {
            const userRef = db.collection("users").doc(UID);

            if(accountType !== this.props.accountType) {
                userRef.update({
                    accountType
                })
                .then(() => {
                    Notification["success"]({
                        title: "¡Perfecto!",
                        description: `El cargo de ${displayName} ha sido actualizado a ${accountType}`
                    });
                })
                .catch(error => {
                    Notification["error"]({
                        title: "Ocurrió un error :(",
                        description: error.message
                    });
                });
            } else {
                Notification["info"]({
                    title: "Espera",
                    description: "No has modificado el cargo"
                });
            }
        } else {
            Notification["error"]({
                title: "Ocurrió un error :(",
                description: "No se encontró ningún UID"
            })
        }
    }

    render() {
        const { UID, displayName, photoURL } = this.props;

        return(
            <Fragment>
                <div id="member-avatar-container">
                    <h1>Información personal</h1>
    
                    <Avatar
                        hasContainer
                        displayName={displayName}
                        photoURL={photoURL}
                    />
                </div>
    
                <div id="member-data-container">
                    <InputGroup>
                        <InputGroup.Addon>UID</InputGroup.Addon>
                            <Input
                                type="text"
                                value={UID}
                                disabled
                            />
                    </InputGroup>
    
                    <div id="member-accountType-input">
                        <h2>Tipo de cargo:</h2>
                        <select 
                            name="accountType" 
                            value={this.state.accountType}
                            onChange={this.handleChange}
                        >
                            <option value="normal">Miembro</option>
                            <option value="profesor">Profesor</option>
                            <option value="directivo">Directivo</option>
                        </select>
                    </div>
                </div>
    
                <div id="update-accountType-button">
                    <Button 
                        appearance="primary" 
                        onClick={this.updateMemberAccountType}
                    >
                        Actualizar cargo
                    </Button>
                </div>
            
                <style jsx>{`
                    #member-avatar-container {
                        padding: 2rem 0;
                        text-align: center;
                        background: beige;
                        display: grid;
                        grid-template-rows: auto auto;
                        grid-gap: 1rem;
                    }
    
    
                    #member-data-container {
                        padding: 1rem 1rem 6rem 1rem;
                    }
    
                    #member-data-container #member-accountType-input {
                        margin: 1rem 0;
                        display: grid;
                        grid-template-columns: auto auto;
                        grid-gap: .4rem;
                        justify-content: left;
                        align-items: inherit;
                    }
    
                    
                    #update-accountType-button {
                        text-align: center;
                    }
                    
                
                `}</style>
            </Fragment>
        )
    }
}

const PersonalAvatar = ({ showTheDiv, UID, displayName, accountType, photoURL }) => {
    const handleShowTheDiv = () => {
        showTheDiv(
            <ModifyPersonalForm UID={UID} displayName={displayName} 
            accountType={accountType} photoURL={photoURL}/>
        );

    }

    return(
        <div className="personalAvatar" onClick={handleShowTheDiv}>
            <Avatar
                displayName={displayName}
                photoURL={photoURL} 
            />

            <style jsx>{`
                .personalAvatar {
                    padding: 1rem;
                }
            
            `}</style>
        </div>
    )
}


class NewPersonalForm extends Component {
    constructor() {
        super();

        this.state = {
            searchByUID: false,
            personalSearchQuery: "",
            personalSearchMessage: "",
            personalSearchResults: [],
            personalSearchResultsKeys: []     
        }
    
        this.baseState = {
            personalSearchResults: [],
            personalSearchResultsKeys: [] 
        }
    }
    

    handleChange = (value, e) => this.setState({ [e.target.name]: e.target.value });

    handlePersonalSearch = () => {
        // Restart the data to prevent issues
        this.setState(this.baseState);

        const { searchByUID, personalSearchQuery } = this.state;
        if(personalSearchQuery !== "") {
            const db = firebase.firestore();

            this.setState({ personalSearchMessage: "Buscando" });

            if(searchByUID) {
                const userRef = db.collection("users").doc(personalSearchQuery);

                // Get UID data from database
                userRef.get()
                .then(userData => {
                if (userData.exists) {
                    this.setState(prevState => ({ 
                        personalSearchResults: [...prevState.personalSearchResults, userData.data()],
                        personalSearchResultsKeys: [...prevState.personalSearchResultsKeys, userData.id]
                    }))

                    this.setState({ personalSearchMessage: "" });
                } else {
                    Notification["error"]({
                        title: "Ocurrió un error :(",
                        description: "No se ha encontrado ningún miembro con ese UID"
                    });

                    this.setState({ personalSearchMessage: "" });
                }
                })
                .catch(error =>{
                    Notification["error"]({
                        title: "Ocurrió un error :(",
                        description: error.message
                    });

                    this.setState({ personalSearchMessage: "" });
                });

            } else {
                const userRef = db.collection("users").where("displayName", "==", personalSearchQuery);

                userRef.get()
                .then(querySnapshot => {
                    querySnapshot.forEach(user => {
                        this.setState(prevState => ({ 
                            personalSearchResults: [...prevState.personalSearchResults, user.data()],
                            personalSearchResultsKeys: [...prevState.personalSearchResultsKeys, user.id]
                        }))
                    });

                    this.setState({ personalSearchMessage: "" });
                })
                .catch(error => {
                    Notification["error"]({
                        title: "Ocurrió un error :(",
                        description: error.message
                    });

                    this.setState({ personalSearchMessage: "" });
                });
            }
        } else {
            Notification["info"]({
                title: "Espera",
                description: `Por favor introduce algún ${searchByUID ? "UID" : "nombre de usuario"}`
            });
        }
        
    }

    render() {
        const { searchByUID, personalSearchQuery, personalSearchMessage, personalSearchResults, 
            personalSearchResultsKeys } = this.state;

        return(
            <div id="search-personal-container">
                <div id="search-personal-input">
                    <div id="search-personal-by">
                        <h3>Buscar por UID</h3>
                        <Toggle 
                            name="searchByUID"
                            value={searchByUID}
                            onChange={value => this.setState({ searchByUID: value })}
                        />
                    </div>  

                    <InputGroup>    
                        <Input
                            name="personalSearchQuery"
                            type="text"
                            placeholder={searchByUID ? "Introduce el UID" : "Introduce el nombre de usuario"}
                            value={personalSearchQuery}
                            onChange={this.handleChange}
                        />
                        <InputGroup.Button onClick={this.handlePersonalSearch}>
                            <Icon icon="search" />
                        </InputGroup.Button>
                    </InputGroup>
                </div>
    
                <div id="search-personal-result">
                    <h2>Resultado de búsqueda</h2>
    
                    {personalSearchMessage === "Buscando"
                    ? <Loader center content="Buscando" />   
                    : null}
                    
                    <div id="search-personal-results">
                        <TheDivController>
                            {personalSearchResults.length === 0 ? null 
                            : personalSearchResults.map((user, index) => <PersonalAvatar key={personalSearchResultsKeys[index]} UID={personalSearchResultsKeys[index]} {...user} />)}
                        </TheDivController>
                    </div>
                </div>
    
                <style jsx>{`
                    #search-personal-input {
                        padding: 2rem;
                        background: beige;
                    }

                    #search-personal-by {
                        display: grid;
                        grid-template-columns: auto auto;
                        grid-gap: .4rem;
                        justify-content: left;
                        align-items: center;
                        margin: .4rem 0;
                    }
    
    
                    #search-personal-result {
                        padding: 1rem;
                    }

                    #search-personal-results {
                        display: grid;
                        grid-gap: 1rem;
                        grid-auto-flow: row;
                        grid-template-columns: 1fr 1fr 1fr;
                    }
                `}</style>
            </div>
        )
    }
}

const NewPersonal = ({ showTheDiv }) => {
    const handleNewPersonal = () => {
        showTheDiv(<NewPersonalForm />)
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
                    transition: 1s;
                }

                #add-new-personal:hover {
                    background: #dadada;
                }
            `}</style>
        </div>
    )
}













/*          THIS IS BASICALLY THE PAGE          */
export default class extends Component {
    static contextType = AuthContext;

    state = {
        directivos: [],
        directivosKeys: [],

        profesores: [],
        profesoresKeys: []
    }

    componentDidMount() {
        // Getting the directivos and profes
        const db = firebase.firestore();
        const directivos = db.collection("users").where("accountType", "==", "directivo");
        const profesores = db.collection("users").where("accountType", "==", "profesor");

        directivos.onSnapshot(querySnapshot => {
            let directivos = [...this.state.directivos];
            let directivosKeys = [...this.state.directivosKeys];
            
            querySnapshot.docChanges().forEach(change => {
                const { doc, type } = change;

                const index = directivosKeys.indexOf(doc.id);

                if (type === 'added') {
                    directivos.push(doc.data());
                    directivosKeys.push(doc.id);
                }
                if (type === 'modified') {

                }
                if (type === 'removed') {
                    directivos.splice(index, 1);
                    directivosKeys.splice(index, 1);
                }
            });

            this.setState({ directivos, directivosKeys });
        });



        profesores.onSnapshot(querySnapshot => {
            let profesores = [...this.state.profesores];
            let profesoresKeys = [...this.state.profesoresKeys];

            querySnapshot.docChanges().forEach(change => {
                const { doc, type } = change;

                const index = profesoresKeys.indexOf(doc.id);

                if (type === 'added') {
                    profesores.push(doc.data());
                    profesoresKeys.push(doc.id);
                }
                if (type === 'modified') {

                }
                if (type === 'removed') {
                    profesores.splice(index, 1);
                    profesoresKeys.splice(index, 1);
                }
            });

            this.setState({ profesores, profesoresKeys });
        });

    }

    componentWillUnmount() {
        const db = firebase.firestore();
        let unsub = db.collection('users').onSnapshot(() => {});
        
        // Stop listening for changes
        unsub();
    }

    render() {
        const { logged, isAnonymous, displayName, photoURL, accountType, handleLogout } = this.context;

        if(isAnonymous) {
            Router.push("/miembro");
            return null
        }

        if(accountType === "") {
            return(
                <Fragment>
                    <Head>
                        <title>Panel directivo | Institución Educativa Joaquín Cárdenas Gómez</title>
                    </Head>
        
                    {logged ? null : <MessageModal notLogged  />}

                    <Loader center content="Cargando" />
                </Fragment>
            )
        }

        if(accountType === "normal") {
            Router.push("/miembro");
            return null
        } else if(accountType === "profesor") {
            Router.push("/miembro/educar");
            return null
        } else {
            const { directivos, directivosKeys, profesores, profesoresKeys } = this.state;

            return(
                <Fragment>
                    <div id="principal-director-section">
                        <h1>Panel director</h1>
    
                        <TheDivController>
                            <NewPost />
                        </TheDivController>

                        <Button appearance="subtle" size="sm" onClick={handleLogout}>Cerrar sesión</Button>
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
                            {<TheDivController>
                                {directivos.length === 0 ? null
                                : directivos.map((directivo, index) => <PersonalAvatar key={directivosKeys[index]} UID={directivosKeys[index]} {...directivo} /> )}
                            </TheDivController>}
                        </div>
    
                        <h3>Maestros</h3>
                        <div id="maestros-slider">
                            {<TheDivController>
                                {profesores.length === 0 ? null
                                : profesores.map((profesor, index) => <PersonalAvatar key={profesoresKeys[index]} UID={profesoresKeys[index]} {...profesor} /> )}
                            </TheDivController>}
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
                            box-shadow: 0px 0px 6px 0px;
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
                            display: grid;
                            grid-template-columns: repeat(4, 1fr);
                            grid-gap: 1rem;
                            margin: 1rem -1rem;
                        }

                        #personal-section #directivos-slider .personalAvatar:nth-child(odd), 
                        #personal-section #maestros-slider .personalAvatar:nth-child(odd) {
                            background: #f0f0f0;
                        }

                        #personal-section #directivos-slider .personalAvatar:hover, 
                        #personal-section #maestros-slider .personalAvatar:hover {
                            background: beige;
                        }
    
    
                        #posts-section {
                            padding: 1rem;
                        }
                    `}</style>
                </Fragment>
            )
        }
    }
}