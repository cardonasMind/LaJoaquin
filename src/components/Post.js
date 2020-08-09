import React, { Component, Fragment } from "react";

export default class extends Component {
    /*constructor() {
        super();

        this.postContainer = React.createRef();
    }*/

    handleTheDiv = () => {
        /*
            THIS GETS THE INFO FROM THE CLICKED POSTCONTAINER
        const currentPostChildren = this.postContainer.current.children;
        const postAuthorInfo = this.postContainer.current.id.split("-");
        const postImage = window.getComputedStyle(currentPostChildren[1]).getPropertyValue("background-image");
        */


        const { author, authorImage, date, postImage, postColor, title, titleColor, description } = this.props;

        const postContent = (
            <Fragment>
                {this.props.postImage 
                ? <div id="post-image">
                    <div id="post-image-overlay">
                        <h3>{title}</h3>
                    </div>
                </div>
                : <div id="post-color">
                    <h2>{title}</h2>
                    <div id="post-overlay"></div>
                </div>}
                

                <div id="post-content">
                    <div id="post-author">
                        <div id="author-left">
                            <img src={authorImage} width="40px" />
                        </div>
                        <div id="author-right">
                            <h3>{author}</h3>
                            <h4>{date}</h4>
                        </div>
                    </div>
                    
                    <div id="post-description">
                        {description}
                    </div>
                </div>            

                <style jsx>{`
                    #post-image {
                        background-color: #eaeaea;
                        background-image: url(${postImage});
                        background-size: cover;
                        background-repeat: no-repeat;
                        width: 100%;
                        height: 200px;
                        position: relative;
                    }

                    #post-color {
                        background: ${postColor};
                        width: 100%;
                        height: 200px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        position: relative;
                        box-shadow: inset 0 0 4px 2px rgba(0,0,0,.6);
                    }

                    #post-color h2 {
                        max-width: 90%;
                        color: ${titleColor};
                    }

                    #post-color #post-overlay {
                        background: linear-gradient(transparent, black);
                        position: absolute;
                        right: 0;
                        bottom: 0;
                        left: 0;
                        padding: .6rem;
                    }

                    #post-image #post-image-overlay {
                        background: linear-gradient(transparent, black);
                        position: absolute;
                        right: 0;
                        bottom: 0;
                        left: 0;
                        padding: 1rem;
                    }
                    
                    #post-image #post-image-overlay h3 {
                        color: white;
                    }

                    #post-content #post-author {
                        display: grid;
                        grid-template-columns: auto 1fr;
                        grid-gap: .6rem;
                        padding: 1rem;
                        background: black;
                        color: gold;
                        border-radius: 0 0 2rem 0;
                    }
                    
                    #post-content #post-author #author-right * {
                        margin: 0;
                    }

                    #post-content #post-author #author-right h4 {
                        font-weight: normal;
                        color: white;
                    }

                    #post-content #post-description {
                        padding: 1rem;
                    }
                `}</style>
            </Fragment>
        );
        
        this.props.showTheDiv(postContent)
    }

    render() {
        const { key, author, authorImage, date, postImage, postColor, title, titleColor, description } = this.props;

        return(
            <div className="postContainer" key={key} /*ref={this.postContainer}*/ id={author+"-"+authorImage} >
                <p className="postDate">{date}</p>
                {this.props.postImage 
                ? <div className="postImage">
                    <div className="postImageOverlay"><h3>{title}</h3></div>
                </div> 
                : <div className="postColor">
                    <h2>{title}</h2>
                </div>}
                
                <div className="postDescription">
                    <p className="postReadMore" onClick={this.handleTheDiv}>- Click aquí para ver el artículo -</p>
                    <p>{description}</p>
                </div>
    
                <style jsx>{`
                    .postContainer {
                        margin-bottom: 2rem;
                        margin: 1rem;
                    }
    
                    .postContainer .postDate {
                        background: var(--green);
                        color: white;
                        padding: .4rem 1rem;
                        width: fit-content;
                        margin: 0;
                    }
    
                    .postContainer .postImage {
                        box-shadow: inset 0 0 4px 2px rgba(0, 0, 0, .6);
                        background-color: #eaeaea;
                        background-image: url(${postImage});
                        background-size: cover;
                        background-repeat: no-repeat;
                        width: 100%;
                        height: 200px;
                        position: relative;
                    }

                    .postContainer .postColor {
                        background: ${postColor};
                        width: 100%;
                        height: 200px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        box-shadow: inset 0 0 4px 2px rgba(0,0,0,.6);
                    }

                    .postContainer .postColor h2 {
                        max-width: 90%;
                        color: ${titleColor};
                    }
    
                    .postContainer .postImage .postImageOverlay {
                        background: linear-gradient(transparent, black);
                        position: absolute;
                        right: 0;
                        bottom: 0;
                        left: 0;
                        padding: 1rem;
                    }
                    
                    .postContainer .postImage .postImageOverlay h3 {
                        color: white;
                    }
    
                    .postContainer .postDescription {
                        box-shadow: 0 0 2px 0px rgba(0, 0, 0, .6);
                        background: #eaeaea;
                        padding: 1rem;
                        max-height: 7rem;
                        overflow: hidden;
                    }
    
                    .postContainer .postDescription .postReadMore {
                        color: var(--blue);
                        cursor: pointer;
                    }
    
                    .postContainer .postDescription p {
                        text-overflow: ellipsis;
                        white-space: wrap;
                        overflow-wrap: break-word;
                        margin: 0;
                    }
    
                `}</style>
            </div>
        )
    }
}