import { Component, Fragment } from "react";

import Head from "next/head";
import Link from "next/link";

import firebase from "../../src/config/firebase";

import { AuthContext } from "../../src/config/AuthProvider";

import Header from "../../src/components/Header";
import MessageModal from "../../src/components/MessageModal";
import Teacher from "../../src/components/Teacher";
import Navigation from "../../src/components/Navigation";
import { Loader } from "rsuite";

export default class extends Component {
    static contextType = AuthContext;

    constructor() {
        super();

        this.state = {
            selectedGrade: "11",
            teachers: [],
            teachersKeys: []
        }
    }

    getTeachersFromDB = grade => {
        this.setState({ teachers: [], teachersKeys: []})

        const db = firebase.firestore();

        db.collection('users').where('accountType', '==', 'profesor')
        .where(`teacherData.grades.${grade}`, '==', true)
        .get().then(querySnapshot => {
            querySnapshot.forEach(teacher => {
                this.setState(prevState => ({ 
                    teachers: [...prevState.teachers, teacher.data()],
                    teachersKeys: [...prevState.teachersKeys, teacher.id]
                }))
            })
        })
    }

    componentDidMount() {
        // When the page loads get teachers from 11´s grade
        this.getTeachersFromDB("11");
    }

    handleChange = e => {
        // Change selected grade on state
        this.setState({ [e.target.name]: e.target.value });

        // Request teachers from the selected grade from DB
        this.getTeachersFromDB(e.target.value);
    }



    render() {
        const { logged } = this.context;
        const { selectedGrade, teachers, teachersKeys } = this.state;

        return(
            <Fragment>
                <Head>
                    <title>Profes | Institución Educativa Joaquín Cárdenas Gómez</title>
                </Head>

                {logged ? null : <MessageModal notLogged />}

                <Header />

                <div id="principal-section">
                    <h1>Selecciona un grado</h1>

                    <h2>
                        Profes de 
                        <select name="selectedGrade" value={selectedGrade} onChange={this.handleChange}>
                            <option value="11">11</option>
                            <option value="10">10</option>
                            <option value="9">9</option>
                            <option value="8">8</option>
                            <option value="7">7</option>
                            <option value="6">6</option>
                        </select>
                    </h2>
                </div>

                <div id="teachers-container">
                    <div id="teachers-slider">
                        {
                            teachers.length === 0
                            ? 
                                <Fragment>
                                    <Teacher 
                                        subject="Cargando..." 
                                        displayName="Cargando..." 
                                    />
                                    <Teacher 
                                        subject="Cargando..." 
                                        displayName="Cargando..." 
                                    />
                                </Fragment>
                            : 
                                teachers.map((teacher, index) => 
                                    <Link key={teachersKeys[index]} href={`/profes/${teacher.displayName}/${selectedGrade}/0`}>
                                        <a>
                                            <Teacher
                                                subject={teacher.teacherData.subject} 
                                                displayName={teacher.displayName}
                                                photoURL={teacher.photoURL}
                                                background={teacher.teacherData.background}
                                            />
                                        </a>
                                    </Link>
                                )
                        }
                    </div>
                </div>

                <Navigation />

                <style jsx global>{`
                    #page {
                        background-image: url("/images/teacher/page-background.jpg");
                        background-size: cover;
                        background-position: center;
                    }

                    #principal-section {
                        padding: 4rem 0;
                        text-align: center;
                        color: white;
                    }

                    #principal-section h1 {
                        font-weight: bold;
                    }

                    #principal-section h2 {
                        color: gold;
                    }

                    #principal-section select {
                        border: 2px solid;
                        background: rgba(0, 0, 0, .6);
                        padding: 0 .2rem;
                        margin-left: .4rem;
                    }


                    #teachers-container {
                        transform: translateY(-2rem);
                        background: white;
                        border-radius: 1.4rem 1.4rem 1.4rem 1.4rem;
                        overflow-x: auto;
                        margin: 0 1rem;
                        box-shadow: inset 0 0 20px 0px;
                        border: 2px solid gold;
                    }

                    #teachers-slider {
                        display: inline-flex;
                    }
                    
                    #teachers-slider a {
                        color: inherit;
                    }
                `}</style>
            </Fragment>
        )   
    }
}