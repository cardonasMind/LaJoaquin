import { Component, Fragment, Children, cloneElement} from "react";

import TheDiv from "./TheDiv";

export default class extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isTheDivShown: false,
            TheDivContent: ""
        };

    }

    handleTheDiv = TheDivContent => this.setState(state => ({ isTheDivShown: !state.isTheDivShown, TheDivContent }));

    render() {
        return(
            <Fragment>
                <TheDiv toggle={this.handleTheDiv} show={this.state.isTheDivShown}>
                    {this.state.TheDivContent}
                </TheDiv>
                
                {Children.map(this.props.children, child => cloneElement(child, { showTheDiv: this.handleTheDiv }))}
            </Fragment>
        )
    }
}