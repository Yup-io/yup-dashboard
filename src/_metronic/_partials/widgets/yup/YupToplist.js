/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/img-redundant-alt */
import React, { Component }from "react";


class YupToplist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: null
    };
  }

  componentDidMount() {
    fetch("https://www.api.bloks.io/tokens?type=topHolders&chain=eos&contract=token.yup&symbol=YUP&limit=10")
      .then(res => res.json())
      .then(
        (result) => {
          result.length=10
          this.setState({
            isLoaded: true,
            items: result
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }
  render() {
    const { error, isLoaded, items } = this.state;

    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div className={`card card-custom card-stretch gutter-b`}>
          {/* Head */}
          <div className="card-header border-0 py-5">
            <h2 className="card-title pl-7 pt-2 align-items-start flex-column">
              <span className="card-label font-weight-bolder text-dark">Top Yuppers</span>
            </h2>
          </div>
          {/* Body */}
          <div className="card-body pt-0 pb-3">
            <div className="tab-content">
              <div className="table-responsive">
                <table className="table table-head-custom  table-borderless table-vertical-center">
                  <thead>
                    <tr className="text-left">
                      <th className="pl-7"><span className="text-dark-75">#</span></th>
                      <th >Account</th>
                      <th className="text-right">Influence</th>
                    </tr>
                  </thead>
                  <tbody>
                  {items.map((item, index) => (
                      <tr key={item[0]}>
                      <td className="pl-7 ">
                        <div className="d-flex align-items-center">
                          <div>
                            <a href="#" className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg">#{index+1}
                          </a>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="text-dark-75 font-weight-bolder d-block font-size-lg">
                        {item[0]}
                      </span>
                      </td>
                      <td>
                        <span className="text-primary  text-right font-weight-bolder d-block font-size-lg">
                        {item[1]}
                      </span>
                      </td>

                    </tr>)
                    )}

                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>)
    }
  }
}

export default YupToplist;