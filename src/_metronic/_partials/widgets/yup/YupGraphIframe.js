/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/img-redundant-alt */
import React, { Component } from 'react';

class YupGraphIframe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      height: 0,
    };
  }
  componentDidMount() {
    this.onResize(); // Invoke the handler manually once initially
    new ResizeObserver(_ => this.onResize()).observe(document.body);
  }
  onResize() {
    this.setState({ height: document.body.offsetHeight });
  }
  render() {
    return (
      <div className="card card-custom card-stretch gutter-b">
        <div className="card-body pt-0 pb-3">
          {/*eslint-disable-next-line jsx-a11y/iframe-has-title*/}
          <iframe src={this.props.src} height="1000px" width="100%" frameBorder="0" />
        </div>
      </div>
    );
  }
}

export default YupGraphIframe;
