import { Component, createContext } from "react"

import Router from 'next/router'

import firebase from "../config/firebase";

import { Notification } from "rsuite";

export const AuthContext = createContext();

export class AuthContextProvider extends Component {
    constructor() {
        super();

        this.state = {
            logged: null,
    
            isAnonymous: null,
            displayName: "",
            email: "",
            photoURL: "",
            accountType: "",
    
            firstLogin: true,
                
            handleLogout: this.handleLogout,
            handleGoogleAuth: this.handleGoogleAuth,
            disableFirstLogin: this.disableFirstLogin,
			
			updateUserAcoountFromDB: this.updateUserAcoountFromDB
        }

        this.baseState = this.state;
    }
    

    handleLogout = () => {
        firebase.auth().signOut()
        .then(() => {
            Notification["success"]({
                title: "¡Perfecto!",
                description: "Acabas de cerrar sesión"
            });

            this.setState(this.baseState)

            Router.push("/");
        })
        .catch(error => {
            Notification["error"]({
                title: "Ocurrió un error :(",
                description: error.message
            });
        })
    }


    handleGoogleAuth = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithRedirect(provider);

        firebase.auth().getRedirectResult()
        .catch(error => {
            Notification["error"]({
                title: "Ocurrió un error :(",
                description: error.message
            });
        });
    }


    disableFirstLogin = () => this.setState({ firstLogin: false });


    userAccountFromDB = uid => {
        const db = firebase.firestore();
        const userInDbRef = db.collection("users").doc(uid);

        userInDbRef.get()
        .then(doc => {
            if (doc.exists) {
                const userDataFromDb = doc.data();
                const { accountType } = userDataFromDb;

                this.setState({ accountType });
            } else {
                // If user isn´t in the DB, add it XD
                db.collection("users").doc(uid).set({
                    accountType: "normal",
                    displayName: this.state.displayName,
                    photoURL: this.state.photoURL
                })
                .then(() => {
					this.setState({ accountType: "normal" });
                    console.log("User is now in the DB :o");
                })
                .catch(error => {
                    Notification["error"]({
                        title: "Ocurrió un error :(",
                        description: error.message
                    });
                });
            }
        })
        .catch(error => {
            console.log("Error getting document:", error);

            Notification["error"]({
                title: "Ocurrió un error :(",
                description: error.message
            });
        });
    }
	
	updateUserAcoountFromDB = (memberNewName, memberNewPhoto) => {
        const db = firebase.firestore();
        const uid = firebase.auth().currentUser.uid;

		db.collection("users").doc(uid).update({
			displayName: memberNewName,
            photoURL: memberNewPhoto
		})
        .catch(error => {
			Notification["error"]({
				title: "Ocurrió un error :(",
                description: error.message
			});
		});
	}


    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            if(user) {
                // User is logged
                const { isAnonymous, displayName, email, photoURL, uid } = user;

                if(isAnonymous) {
                    this.setState({ 
                        logged: true, 
                        isAnonymous: true, 
                        displayName: "Miembro anónimo",
                        photoURL: "/images/member/anonymous.jpg" 
                    });
                } else {
                    this.setState({ logged: true, displayName, email, photoURL });

                    // Load some data from db like accountType
                    this.userAccountFromDB(uid);
                }

            } else {
                // User isn´t logged
                this.setState(this.baseState);
            }
        });
    }

    render() {
        return(
            <AuthContext.Provider value={{ ...this.state }}>
                {this.props.children}
            </AuthContext.Provider>
        )
    }
}