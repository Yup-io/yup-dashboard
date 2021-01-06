/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/img-redundant-alt */
import React, { Component }from "react";

class YupGraphIframe extends Component {
    constructor(props) {
        super(props);    
    this.state = {
        error: null,
        isLoaded: false,
        height: 0,    
    }
}
    componentDidMount () {
        this.onResize();  // Invoke the handler manually once initially
        (new ResizeObserver(_ =>
          this.onResize()
        )).observe(document.body);
      }
      onResize () {  
          this.setState({height: document.body.scrollHeight}) 
      
      }
render(){
    return(         
        <div>          
          <iframe src={this.props.src} height={this.state.height} width="100%" frameBorder="0"/>         
        </div>
      )
}
}

export default YupGraphIframe;