import { Component, Fragment } from "react";

import Head from "next/head";

import { AuthContext } from "../src/config/AuthProvider";

import MessageModal from "../src/components/MessageModal";
import Teacher from "../src/components/Teacher";

import Navigation from "../src/components/Navigation";

export default class extends Component {
    static contextType = AuthContext;

    render() {
        const { logged } = this.context;
 
        return(
            <Fragment>
                <Head>
                    <title>Profes | Institución Educativa Joaquín Cárdenas Gómez</title>
                </Head>

                {logged ? null : <MessageModal notLogged />}

                <div id="principal-section">
                    <h1>Selecciona un grado</h1>

                    <h2>Profes de: <select><option>11</option></select></h2>
                </div>

                <div id="teachers-container">
                    <div id="teachers-slider-container">
                        <div id="teachers-slider">
                            <Teacher />
                            <Teacher />
                            <Teacher />
                            <Teacher />
                            <Teacher />
                            <Teacher />
                        </div>
                    </div>
                </div>

                <Navigation />

                <style jsx global>{`
                    #principal-section {
                        background-image: url("/images/working/space.png");
                        background-size: cover;
                        color: white;
                        background-position: center;
                        padding: 4rem 0;
                        text-align: center;
                    }


                    #teachers-container {
                        transform: translateY(-2rem);
                        background: white;
                        border-radius: 1.4rem 1.4rem 0 0;
                    }

                    #teachers-container #teachers-slider-container {
                        margin: 1rem;
                        overflow-x: auto;
                        border-radius: 1.4rem 1.4rem 0 0;
                    }

                    #teachers-container #teachers-slider-container #teachers-slider {
                        display: inline-flex;
                    }
                
                `}</style>
            </Fragment>
        )
        
    }
}