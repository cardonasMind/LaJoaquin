import React from "react";

import Head from "next/head";

import { AuthContextProvider } from "../src/config/AuthProvider";

import 'rsuite/lib/styles/index.less';

const App = ({ Component, pageProps }) => {
    return (
        <AuthContextProvider>
            <div id="page">
                <Head>
                    <meta charSet="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
                    <title>Institución Educativa Joaquín Cárdenas Gómez</title>
                    <link rel="shortcut icon" href="/images/favicon.ico" type="image/x-icon" />
                    <link rel="icon" href="/images/favicon.ico" type="image/x-icon" />
                    <meta name="theme-color" content="#ffffff" />
                </Head>

                <Component {...pageProps} />
                    
                <style jsx global>{`
                    * {
                        font-size: 12px;
                        margin: 0;
                        box-sizing: border-box;   
                    }
    
                    body {
                        margin: 0;
                    }
    
                    #page {
                        padding-bottom: 5rem;
                        min-height: 100vh;
                    }
    
                    h1 {
                        font-size: 1.6rem;
                        font-weight: 500;
                        line-height: inherit;
                    }
    
                    h2 {
                        font-size: 1.4rem;
                        font-weight: 500;
                        line-height: inherit;
                    }
    
                    h3 {
                        font-size: 1.2rem;
                        font-weight: 500;
                        line-height: inherit;
                    }
    
                    h4 {
                        font-size: 1.1rem;
                        font-weight: 500;
                        line-height: inherit;
                    }
    
                    :root {
                        --blue: #00A6FF;
                        --green: #13CE66;
                        --yellow: #FFEB3A;
                        --red: #d20000;
                    }
                `}</style>
            </div>
        </AuthContextProvider>
    )
}

export default App;