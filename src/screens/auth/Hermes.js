import { Component, createRef } from "react";

export default class extends Component {
    constructor() {
        super();

        this.hermesGodRef = createRef();
    }


    componentDidMount() {
        // I don´t know why I has a problem with do while loop (later fix it please :p)
        this.hermesGodRef.current.style.transform = "translateY(20px)";

        setTimeout(() => {
            this.hermesGodRef.current.style.transform = "translateY(0)";

            setTimeout(() => {
                this.hermesGodRef.current.style.transform = "translateY(20px)";

                setTimeout(() => {
                    this.hermesGodRef.current.style.transform = "translateY(0)";

                    setTimeout(() => {
                        this.hermesGodRef.current.style.transform = "translateY(20px)";
        
                        setTimeout(() => {
                            this.hermesGodRef.current.style.transform = "translateY(0)";
                        }, 2000);
                    }, 2000)
                }, 2000);
            }, 2000)
        }, 2000)
    }

    render() {
        return(
            <div id="hermes-god-container">
                <img id="hermes-god" src="images/member/hermes.png" height="300px" ref={this.hermesGodRef} />
                <div id="hermes-god-message">
                    <h2>{this.props.message}</h2>
                </div>
    
                <style jsx>{`
                    #hermes-god {
                        margin: 2rem;
                        transition: 2s;
                    }
    
                    #hermes-god-message {
                        color: white;
                        margin: 1rem 0;
                        text-align: center;
                        padding: 2rem;
                    }
                
                `}</style>
            </div>
        )
    }
}