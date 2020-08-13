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




const GradesNavigation = ({ active, onSelect, ...props }) => {
    return (
        <Nav {...props} activeKey={active} onSelect={onSelect} >
            <Nav.Item eventKey="general">General</Nav.Item>
            <Nav.Item eventKey="first">11°1</Nav.Item>
            <Nav.Item eventKey="second">11°2</Nav.Item>
            <Nav.Item eventKey="third">11°3</Nav.Item>
            <Nav.Item eventKey="fourth">11°4</Nav.Item>
            <Nav.Item eventKey="fifth">11°5</Nav.Item>
        </Nav>
    );
};

class GradesNavigationComponent extends Component {
    state = {
        active: "general"
    }

    handleSelect = active => this.setState({ active })

    render() {
        const { active } = this.state;

        return (
            <GradesNavigation appearance="tabs" active={active} onSelect={this.handleSelect} />
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
            teacherName: "",
            selectedGrade: "",
            selectedGroup: "",
            teacher: {},
			teacherUID: "",
			
			teacherPosts: [],
			teacherPostsKeys: []
        }
    }
	
	getTeacherPosts = () => {
		const { teacherUID } = this.state;
		const db = firebase.firestore();
		
		db.doc(`users/${teacherUID}`).collection("teacherPosts")
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

        this.setState({ teacherName, selectedGrade, selectedGroup})	
    }

    render() {
        const { logged } = this.context;
        const { teacherName, teacher, selectedGrade, teacherPosts, teacherPostsKeys } = this.state;
		const { displayName, photoURL, teacherData } = teacher;
		
        return(
            <Fragment>
                <Head>
                    <title>Profe: {teacherName} | Institución Educativa Joaquín Cárdenas Gómez</title>
                </Head>

                {logged ? null : <MessageModal notLogged />}

                <Header />

                <div id="header-section">
                    <div id="header-section-overlay">
                        <Avatar 
                            hasContainer
                            displayName={teacherName}
							photoURL={photoURL}
                        />
                    </div>
                </div>

                <div id="principal-section">
                    <div id="principal-section-header">
                        <div id="teacher-subject">{teacherData ? teacherData.subject : "Cargando..."}</div>
                        <div id="teacher-grades-buttons">
                            <GradesNavigationComponent />
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
												author={teacherName}
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


                    #principal-section {
                        background: white;
                        border-radius: 1.4rem 1.4rem 0 0;
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