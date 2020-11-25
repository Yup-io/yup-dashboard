/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/img-redundant-alt */
import React, { Component } from "react";

class YupFeedTableWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: []
    };
    this.updateData = this.updateData.bind(this);
  }

  componentDidMount() {
    this.updateData()
   // setInterval(this.updateData, 60000);

  }
  async updateData() {
    console.log("getting data")
    fetch("https://eos.hyperion.eosrio.io/v2/history/get_actions?account=yupyupyupyup&filter=*%3Acreatevotev3&skip=0&limit=10&sort=desc", {
      method: 'GET'
    })
      .then(res => res.json())
      .then(
        (result) => {
         this.getPostData(result)
        }
      )
  }

  async getPostData(items) {
    let fullData = [];
    var itemsProcessed = 0;
    await items.actions.forEach(vote => {
      fetch("https://api.yup.io/posts/post/"+vote.act.data.postid, {
      method: 'GET'
    })
      .then(res => res.json())
      .then( (result) => {
      fullData.push({vote: vote, post:result})
      itemsProcessed++;
      if(itemsProcessed === items.actions.length) {
        console.log(fullData)
        this.setState({
          isLoaded: true,
          items: fullData
        });
      }
      })
    })

  }
  createRating(n){
    var elements = [];
    var colorMap = {      
      "1": "#BE1E2D",
      "2": "#F08C28",
      "3": "#F0C800",
      "4": "#7FBA1B",
      "5": "#00EAB7",
    };
    for(let i =0; i < n; i++){
        elements.push( <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="20px" height="20px">
        <g fill={colorMap[n]}   > <circle cx="50%" cy="50%" r="25" /></g>
      </svg>);
    }
    return elements;
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
            <h2 className="card-title align-items-start flex-column">
              <span className="card-label font-weight-bolder text-dark">Yup feed</span>
            </h2>
          </div>
          {/* Body */}
          <div className="card-body pt-0 pb-3">
            <div className="tab-content">
              <div className="table-responsive">
                <table className="table table-head-custom  table-borderless table-vertical-center">
                  <thead>
                    <tr className="text-left">
                      <th className="pl-7"> </th>
                      <th >Content</th>
                      <th className="text-left">Platform</th>
                      <th className="text-left pl-5">Rating</th>
                      <th className="text-right">#yups</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(item => (
                      <tr key={item.vote.global_sequence}>
                        <td className="pl-7">
                          <div className="d-flex align-items-center">
                            <div><span>
                            {item.vote.act.data.category == 'intelligence' &&
                              <h3>💡</h3>
                            }
                            {item.vote.act.data.category == 'funny' &&
                              <h3>😂</h3>
                            }
                            {item.vote.act.data.category == 'popularity' &&
                              <h3>❤️</h3>
                            }
                            </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="text-dark-75 font-weight-bolder d-block font-size-lg">
                           {item.post.previewData.title.substring(0, 30)+'...'}
                      </span>
                        </td>
                        <td>
                          <span className="text-dark-75 text-left font-weight-bolder d-block font-size-lg">
                          {item.post.tag.split('.')[0].charAt(0).toUpperCase()+ item.post.tag.split('.')[0].slice(1)}
                      </span>
                        </td>
                        <td>
                        
                        
                          <span className="text-dark-75 text-left font-weight-bolder d-block font-size-lg">
                          {this.createRating(item.vote.act.data.rating)}
                          </span>
                        </td>
                        <td>
                          <span className="text-primary text-right font-weight-bolder d-block font-size-lg">
                          {item.post.catVotes.overall.up}
                      </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
}

export default YupFeedTableWidget;