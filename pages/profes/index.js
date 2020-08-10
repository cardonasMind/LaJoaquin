import { Component, Fragment } from "react";

import Head from "next/head";

import { AuthContext } from "../../src/config/AuthProvider";

import MessageModal from "../../src/components/MessageModal";
import Teacher from "../../src/components/Teacher";

import Navigation from "../../src/components/Navigation";

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

                    <h2>
                        Profes de 
                        <select>
                            <option>11</option>
                            <option>10</option>
                            <option>9</option>
                            <option>8</option>
                            <option>7</option>
                            <option>6</option>
                        </select>
                    </h2>
                </div>

                <div id="teachers-container">
                    <div id="teachers-slider">
                        <Teacher />
                        <Teacher />
                        <Teacher />
                        <Teacher />
                        <Teacher />
                        <Teacher />
                    </div>
                </div>

                <Navigation />

                <style jsx global>{`
                    #principal-section {
                        background-image: url("/images/teacher/page-background.jpg");
                        background-size: cover;
                        background-position: center;
                        padding: 4rem 0;
                        text-align: center;
                        color: white;
                    }

                    #principal-section h2 {
                        color: wheat;
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
                        border-radius: 1.4rem 1.4rem 0 0;
                        overflow-x: auto;
                        
                    }

                    #teachers-slider {
                        display: inline-flex;
                    }
                
                `}</style>
            </Fragment>
        )
        
    }
}