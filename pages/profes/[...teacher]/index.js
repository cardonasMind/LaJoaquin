import { Component, Fragment } from "react";

import Head from "next/head";
import Link from "next/link";

import firebase from "../../../src/config/firebase";

import { AuthContext } from "../../../src/config/AuthProvider";

import Header from "../../../src/components/Header";
import MessageModal from "../../../src/components/MessageModal";
import { Loader, Nav } from "rsuite";
import Avatar from "../../../src/components/craft/Avatar";
import Post from "../../../src/components/Post";




const GradesNavigation = ({ active, onSelect, ...props }) => {
    return (
        <Nav {...props} activeKey={active} onSelect={onSelect} >
            <Nav.Item eventKey="general">General</Nav.Item>
            <Nav.Item eventKey="uno">1</Nav.Item>
            <Nav.Item eventKey="dos">2</Nav.Item>
            <Nav.Item eventKey="tres">11°3</Nav.Item>
            <Nav.Item eventKey="cuatro">11°4</Nav.Item>
        </Nav>
    );
};

class GradesNavigationComponent extends Component {
    state = {
        active: ""
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
            teacher: {}
        }
    }

    componentDidMount() {
        const { teacher } = this.props.actualURL;
        const teacherName = teacher[0];
        const selectedGrade = teacher[1];
        const selectedGroup = teacher[2];

        const db = firebase.firestore();

        db.collection('users').where('accountType', '==', 'profesor')
        .where("displayName", '==', teacherName)
        .get().then(querySnapshot => {
            querySnapshot.forEach(teacher => {
                this.setState({ teacher: teacher.data() })
            })
        })

        this.setState({ teacherName, selectedGrade, selectedGroup})
    }

    render() {
        const { logged } = this.context;
        const { teacherName, teacher } = this.state;
        
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
                        />
                    </div>
                </div>

                <div id="principal-section">
                    <div id="principal-section-header">
                        <div id="teacher-subject">{teacher.teacherData ? teacher.teacherData.subject : "Cargando..."}</div>
                        <div id="teacher-grades-buttons">
                            <GradesNavigationComponent />
                        </div>
                    </div>

                    <div id="teacher-posts-container">
                        <Post />
                        <Post />
                        <Post />
                    </div>
                </div>



                <style jsx global>{`
                    #header-section {
                        background: url(${teacher.teacherData ? teacher.teacherData.background : "/images/member/background.jpg"});
                        background-size: cover;
                        background-repeat: no-repeat;
                        padding: 2rem 0;
                    }

                    #header-section-overlay {
                        color: white;
                    }


                    #principal-section {
                        background: white;
                        border-radius: 1.4rem 1.4rem 0 0;
                        transform: translateY(-1rem);
                    }

                    #principal-section-header {
                        padding: 1rem;

                        position: sticky;
                        top: 0;
                        background: white;
                        right: 0;
                        left: 0;
                    }

                    #principal-section-header #teacher-subject {
                        background: #f0f0f0;
                        padding: .2rem 1rem;
                        margin: 0 auto;
                        margin-bottom: .4rem;
                        width: fit-content;
                        border-radius: 0 0 .4rem .4rem;
                    }

                
                
                `}</style>
            </Fragment>
        )
    }
}