import { Component, Fragment } from "react";

import Head from "next/head";
import Link from "next/link";

import firebase from "../../src/config/firebase";

import { AuthContext } from "../../src/config/AuthProvider";

import MessageModal from "../../src/components/MessageModal";
import Teacher from "../../src/components/Teacher";

import Navigation from "../../src/components/Navigation";

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

    componentDidMount() {
        /*const db = firebase.firestore();

        db.collection('users').where('accountType', '==', 'profesor')
        .where('teacherData.grades.10', '==', true)
        
        .get().then(querySnapshot => {
            querySnapshot.forEach(teacher => {
                this.setState(prevState => ({ profes: [...prevState.profes, teacher.data()]}))
            })
        })*/
    }

    handleSelectedGrade = e => {
        this.setState({ selectedGrade: e.target.value });

        const db = firebase.firestore();

        db.collection('users').where('accountType', '==', 'profesor')
        .where(`teacherData.grades.${this.state.selectedGrade}`, '==', true)
        
        .get().then(querySnapshot => {
            querySnapshot.forEach(teacher => {
                console.log(teacher.data())
            })
        })
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

                <div id="principal-section">
                    <h1>Selecciona un grado</h1>

                    <h2>
                        Profes de 
                        <select value={selectedGrade} onChange={this.handleSelectedGrade}>
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
                    {/*
                        this.state.profes.length > 0
                    ? this.state.profes.map(teacher => 
                        <Link href={`/profes/${teacher.displayName}`}>
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
                        : null
                    */}
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

                    #principal-section h2 {
                        color: gold;
                    }

                    #principal-section select {
                        border: 2px solid;
                        background: transparent;
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
                
                `}</style>
            </Fragment>
        )
        
    }
}