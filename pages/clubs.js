import { Component, Fragment } from "react";

import Head from "next/head";

import { AuthContext } from "../src/config/AuthProvider";

import { Button } from "rsuite";

import Header from "../src/components/Header";

import MessageModal from "../src/components/MessageModal";

import Navigation from "../src/components/Navigation";

export default class extends Component {
    static contextType = AuthContext;
    
    render() {
        const { logged } = this.context;

        return(
            <Fragment>
                <Head>
                    <title>Clubs | Institución Educativa Joaquín Cárdenas Gómez</title>
                </Head>

                {logged ? null : <MessageModal notLogged />}

                <div id="page-overlay">
                    <Header />

                    <h1>Estamos trabajando en ello :D</h1>
                    <img src="/images/working/alien.png" />
    
                    <a href="https://wa.me/573216328834">
                        <Button appearance="default">Enviar sugerencias</Button>
                    </a>
                </div>
    
                <Navigation />
    
                <style jsx global>{`
                    #page {
                        background-image: url("/images/working/space.png");
                        background-size: cover;
                        background-position: center;
                        color: #f0f0f0;
                    }
    
                    #page-overlay {
                        background: linear-gradient(green, transparent);
                        position: absolute;
                        top: 0;
                        right: 0;
                        bottom: 0;
                        left: 0;
                        text-align: center;
                        padding-top: 4rem;
                    }
                `}</style>
            </Fragment>
        )
    }
}