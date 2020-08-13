import { Component, Fragment } from "react";

import Head from "next/head";
import Link from "next/link";

import firebase from "../../../src/config/firebase";

import { AuthContext } from "../../../src/config/AuthProvider";

import Header from "../../../src/components/Header";
import MessageModal from "../../../src/components/MessageModal";
import { Loader, Nav, Icon } from "rsuite";
import Avatar from "../../../src/components/craft/Avatar";
import TheDivController from "../../../src/components/TheDivController";
import Post from "../../../src/components/Post";




const GradesNavigation = ({ teacherName, selectedGrade, selectedGroup, ...props }) => {
    return (
        <Nav {...props} activeKey={selectedGroup} >
            <Nav.Item eventKey="0">
                <Link href={`/profes/${teacherName}/${selectedGrade}/0`}>
                    <p>General</p>
                </Link>
            </Nav.Item>
            <Nav.Item eventKey="1">
                <Link href={`/profes/${teacherName}/${selectedGrade}/1`}>
                    <p>{selectedGrade}°1</p>
                </Link>
            </Nav.Item>
            <Nav.Item eventKey="2">
                <Link href={`/profes/${teacherName}/${selectedGrade}/2`}>
                    <p>{selectedGrade}°2</p>
                </Link>
            </Nav.Item>
            <Nav.Item eventKey="3">
                <Link href={`/profes/${teacherName}/${selectedGrade}/3`}>
                    <p>{selectedGrade}°3</p>
                </Link>
            </Nav.Item>
            <Nav.Item eventKey="4">
                <Link href={`/profes/${teacherName}/${selectedGrade}/4`}>
                    <p>{selectedGrade}°4</p>
                </Link>
            </Nav.Item>
            <Nav.Item eventKey="5">
                <Link href={`/profes/${teacherName}/${selectedGrade}/5`}>
                    <p>{selectedGrade}°5</p>
                </Link>
            </Nav.Item>
        </Nav>
    );
};

class GradesNavigationComponent extends Component {
    render() {
        return (
            <GradesNavigation appearance="tabs" {...this.props} />
        );
    }
}





export default class extends Component {
    static contextType = AuthContext;

    static async getInitialProps(ctx) {
        return { actualURL: ctx.query }
    }

    constructor() {
        super();

        this.state = {
            selectedGrade: "",
            selectedGroup: "",
            teacher: {},
			teacherUID: "",
			
			teacherPosts: [],
			teacherPostsKeys: []
        }
    }
	
	getTeacherPosts = () => {
		const { selectedGrade, selectedGroup, teacherUID } = this.state;
		const db = firebase.firestore();
		
        db.doc(`users/${teacherUID}`).collection("teacherPosts")
        .where("grade", "==", selectedGrade)
        .where("group", "==", selectedGroup)
		.get().then(querySnapshot => {
            querySnapshot.forEach(teacherPost => {
                this.setState(prevState => ({ 
                    teacherPosts: [...prevState.teacherPosts, teacherPost.data()],
                    teacherPostsKeys: [...prevState.teacherPostsKeys, teacherPost.id]
                }))
            })
        })
	}

    componentDidMount() {
        const { teacher } = this.props.actualURL;
        const teacherName = teacher[0];
        const selectedGrade = teacher[1];
        const selectedGroup = teacher[2];

        const db = firebase.firestore();

		// Getting the info of the teacher
        db.collection('users').where('accountType', '==', 'profesor')
        .where("displayName", '==', teacherName)
        .get().then(querySnapshot => {
            querySnapshot.forEach(teacher => {
                this.setState({ teacher: teacher.data(), teacherUID: teacher.id })
				
				
				// Getting the posts of the teacher to actually actualGrade and actualGroup
				this.getTeacherPosts()
            })
        })

        this.setState({ selectedGrade, selectedGroup})	
    }

    render() {
        const { logged } = this.context;
        const { selectedGrade, selectedGroup, teacher, teacherPosts, teacherPostsKeys } = this.state;
		const { displayName, photoURL, teacherData } = teacher;
		
        return(
            <Fragment>
                <Head>
                    <title>Profe: {displayName} | Institución Educativa Joaquín Cárdenas Gómez</title>
                </Head>

                {logged ? null : <MessageModal notLogged />}

                <Header />

                <div id="header-section">
                    <div id="header-section-overlay">
                        <Avatar 
                            hasContainer
                            displayName={displayName ? displayName : "Cargando..."}
							photoURL={photoURL}
                        />
                    </div>
                </div>

                <div id="principal-section">
                    <div id="principal-section-header">
                        <div id="teacher-subject">{teacherData ? teacherData.subject : "Cargando..."}</div>
                        <div id="teacher-grades-buttons">
                            <GradesNavigationComponent 
                                teacherName={displayName} 
                                selectedGrade={selectedGrade} 
                                selectedGroup={selectedGroup}
                            />
                        </div>
                    </div>

                    <div id="teacher-posts-container">
						{
							teacherPosts.length === 0 
							? 
								<Loader center content="Cargando" />
							:
								<TheDivController>
									{
										teacherPosts.map((post, index) => 
											<Post
												key={teacherPostsKeys[index]}
												author={displayName}
												authorImage={photoURL}
												date={post.date}
												postImage={post.postImage}
												postColor={post.postColor}
												title={post.title}
												titleColor={post.titleColor}
												description={post.description}
											/>)
									}
								</TheDivController>
						}
                    </div>
                </div>

                <div id="exit-teacher-navigation">
                    <Link href="/profes">
                        <a><Icon icon="flag-checkered" /> Volver al área de profes</a>
                    </Link>
                </div>



                <style jsx global>{`
                    #header-section {
                        background: url(${teacherData ? teacherData.background : "/images/member/background.jpg"});
                        background-size: cover;
                        background-repeat: no-repeat;
                    }

                    #header-section-overlay {
                        background: linear-gradient(rgba(0, 0, 0, .4), rgba(0, 0, 0, .8));
                        padding: 2rem 0;                    
                        color: white;
                    }


                    #principal-section-header {
                        border-radius: 1.4rem 1.4rem 0 0;
                        background: white;
                        transform: translateY(-1rem);
                    }

                    #principal-section-header #teacher-subject {
                        background: #f0f0f0;
                        padding: .2rem 1rem;
                        margin: 0 auto;
                        margin-bottom: .4rem;
                        width: fit-content;
                        border-radius: 0 0 .4rem .4rem;
                    }

                    #principal-section-header #teacher-grades-buttons {
                       overflow-x: auto;
                    }

                    #teacher-posts-container {
                        position: relative;
                        min-height: 40vh;
                    }

                
                    #exit-teacher-navigation {
                        position: fixed;
                        right: 0;
                        bottom: 0;
                        left: 0;
                        background: white;
                        padding: .4rem 1rem;
                    }
                `}</style>
            </Fragment>
        )
    }
}