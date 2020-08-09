import { Component, Fragment } from "react";

import firebase from "../src/config/firebase";

import { AuthContext } from "../src/config/AuthProvider";

import { Loader } from 'rsuite';

import WelcomePage from "../src/screens/welcome";

import BasicData from "../src/screens/auth/BasicData";

import Header from "../src/components/Header";

import FirstLogin from "../src/screens/welcome/FirstLogin";

import TheDivController from "../src/components/TheDivController";
import Post from "../src/components/Post";
import Navigation from "../src/components/Navigation";

export default class extends Component {
    static contextType = AuthContext;

    state = {
        principalPosts: [],
        principalPostsKeys: []
    }

    componentDidMount() {
        const db = firebase.firestore();

        /*                  GETTING THE PRINCIPALPOSTS FROM DB             */
        db.collection('principalPosts').orderBy("timestamp", "desc").get().then(querySnapshot => {
            querySnapshot.forEach(post => {
                this.setState(prevState => ({ 
                    principalPosts: [...prevState.principalPosts, post.data()],
                    principalPostsKeys: [...prevState.principalPostsKeys, post.id]
                }))
            })
        })
    }

    render() {
        const { logged, displayName, photoURL, firstLogin, disableFirstLogin } = this.context;

        if(logged) {
            // Check if displayName or photoURL is null to start the process of select the basic data :D
            if(displayName === null || photoURL === null) {
                return <BasicData />
            } else {
                return(
                    <Fragment>
                        <Header indexHeader />
    
                        {firstLogin 
                        ?   <FirstLogin disableFirstLogin={disableFirstLogin}
                                photoURL={photoURL} displayName={displayName} />
                        : null
                        }
    
                        {this.state.principalPosts.length === 0 ? <Loader center content="Cargando" /> : null}
                            
                        <TheDivController>
                            {
                                this.state.principalPosts.map((post, index) => 
                                    <Post 
                                        key={this.state.principalPostsKeys[index]}
                                        author={post.author}
                                        authorImage={post.authorImage}
                                        date={post.date}
                                        postImage={post.postImage}
                                        postColor={post.postColor}
                                        title={post.title}
                                        titleColor={post.titleColor}
                                        description={post.description}
                                    />)
                            }
                        </TheDivController>
    
                        <Navigation />
                    </Fragment>
                )
            }
        } else {
            return(
                <WelcomePage />
            )
        }
    }
}