import Link from "next/link";

const Header = props => {
    var HeaderContent = "";

    // There are 2 type of Header (the main and the normal wich don´t have phrase)
    if(props.indexHeader) {
        HeaderContent = (
            <header>
                <Link href="/"><a><img src="/images/logo.png" alt="Logo de la institución" /></a></Link>
                <p><b>Institución Educativa Joaquín Cárdenas Gómez</b></p>
                <p id="header-phrase">"Lo unico imposible es aquello que no intentas"</p>

                <style jsx>{`
                    header {
                        background-color: white;
                        text-align: center;
                        padding: 1rem;
                        position: sticky;
                        top: 0;
                        right: 0;
                        left: 0;
                        z-index: 998;
                        border-right: 6px solid var(--green);
                        border-left: 6px solid var(--yellow);
                        border-radius: 0 0 10px 10px;
                    }

                    header p {
                        margin: .4rem 0;
                    }

                    header #header-phrase {
                        padding: 0 4rem;
                    }

                    header img {
                        height: 4rem;
                    }
                `}</style>
            </header>
        )
    } else {
        HeaderContent = (
            <header>
                <Link href="/"><a><img src="/images/logo.png" alt="Logo de la institución" /></a></Link>
                
                <style jsx>{`
                    header {
                        padding: .8rem 0;
                        text-align: center;
                        position: absolute;
                        top: 0;
                        background: white;
                        box-shadow: 0 0 4px black;
                        border-radius: 0 0 40px 40px;
                        left: 4px;
                        padding: .6rem 0;
                    }

                    header img {
                        height: 2rem;
                        margin: .4rem;
                        
                    }
                `}</style>
            </header>
        )
    }

    return(HeaderContent)
}

export default Header;