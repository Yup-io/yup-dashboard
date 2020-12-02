/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/img-redundant-alt */
import React, { Component } from "react";
import {Pagination} from "react-bootstrap";
import { Loader } from './loader'
import './custom.css'

const styles = theme => ({
  Category: {
    marginBottom: '0px'
  }
})

class YupFeedTableWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: { 1:null,2:null,3:null,4:null,5:null},
      page: 1
    };
    this.updateData = this.updateData.bind(this);
  }

  componentDidMount() {
    this.updateData(1, 10)
   setInterval(this.updateData.bind(null, 1, 10), 60000);

  }
  async updateData(page, limit) {
    console.log(page,limit)
    let skip = (page-1)*limit
    fetch("https://eos.hyperion.eosrio.io/v2/history/get_actions?account=yupyupyupyup&filter=*%3Acreatevotev3&skip="+skip+"&limit="+limit+"&sort=desc", {
      method: 'GET'
    })
      .then(res => res.json())
      .then(
        (result) => {
         this.getPostData(parseInt(page),result)
        }
      )
  }

  async getPostData(page,items) {
    let fullData = [];
    var itemsProcessed = 0;

    console.log(page, items.actions, this.state.items, items.actions[0].global_sequence )
    if(!this.state.items[page] || items.actions[0].global_sequence!=this.state.items[page][0].vote.global_sequence){
      this.setState({
        isLoaded: false
      });

      await items.actions.forEach(vote => {
        fetch("https://api.yup.io/posts/post/"+vote.act.data.postid, {
        method: 'GET'
      })
        .then(res => {try {
          return res.json()
        }
        catch(e){
          console.log(e)
          this.setState({
            isLoaded: false,
            error:e
          });
        }
      })
        .then( (result) => {
          if(result){
          fullData.push({vote: vote, post:result})
          itemsProcessed++;
          if(itemsProcessed === items.actions.length) {
            let newItems = this.state.items
            newItems[page] = fullData
            console.log(newItems)
            this.setState({
              isLoaded: true,
              items: newItems,
              page: page
            });
          }
        }
        })
      })
    }

    else{
      console.log("same items")
      this.setState({
        isLoaded: true,
        page: page
      });

    }

  }

  createRating(n){
    var ratingMap = {
      "-2": "1",
      "-1": "2",
      "1": "3",
      "2": "4",
      "3": "5",
    }
    n= ratingMap[n]
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
  createPagination(){

  }
  render() {
    console.log(Loader)
    const { error, isLoaded, items } = this.state;
    console.log(items)
    if (error) {
      return <div>Error: {error.message}</div>;
    }
     else {
      return (
        <div className={`card card-custom card-stretch gutter-b`}>
          {/* Head */}
          <div className="card-header border-0 py-5">
            <h2 className="card-title align-items-start flex-column">
              <span className="card-label font-weight-bolder text-dark">Actions</span>
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
                      <th className="text-left pl-5">Time</th>
                      <th className="text-left">User</th>
                      <th >Content</th>
                      <th className="text-left pl-5">Rating</th>
                      <th className="text-left">Platform</th>
                    </tr>
                  </thead>
                  {isLoaded &&
                  <tbody>

                    {items[this.state.page].map(item => (
                      <tr key={item.vote.global_sequence}>
                        <td className="pl-7">
                          <div className="d-flex align-items-center">
                            <div><span>
                            {item.vote.act.data.category == 'intelligence' &&
                              <h3 className="category-emoji">💡</h3>
                            }
                            {item.vote.act.data.category == 'funny' &&
                              <h3 className="category-emoji">😂</h3>
                            }
                            {item.vote.act.data.category == 'popularity' &&
                              <h3 className="category-emoji">❤️</h3>
                            }
                            </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="text-dark-75 d-block font-size-lg">
                           {new Date(item.vote.timestamp).toLocaleDateString()} {new Date(item.vote.timestamp).toLocaleTimeString()}
                      </span>
                        </td>
                        <td>
                          <a target="_blank" href={`https://app.yup.io/${item.vote.act.data.voter}`} className="text-dark-75 d-block font-size-lg">{item.vote.act.data.voter}
                           </a>
                        </td>
                        <td>
                          <a href={item.post.previewData.url} className="text-primary d-block font-size-lg">
                           {item.post.previewData.title.substring(0, 30)}
                           {item.post.previewData.title.length>29 && '...'}
                      </a>
                        </td>
                        <td>
                          <span className="text-dark-75 text-left d-block font-size-lg">
                          {this.createRating(item.vote.act.data.rating)}
                          </span>
                        </td>
                        <td>
                          <span className="text-dark-75 text-left d-block font-size-lg">
                          {item.post.tag.split('.')[0].charAt(0).toUpperCase()+ item.post.tag.split('.')[0].slice(1)}
                      </span>
                        </td>
                      </tr>
                    ))}

                  </tbody>  }

                </table>

              </div>
              <div className="d-flex justify-content-center ">
              { !isLoaded &&
                    <Loader src="/yup.svg" />
                  }
                  </div>
            </div>
          <div className="separator separator-dashed my-7"></div>
              <Pagination className="float-right">
                <Pagination.Prev />
                <Pagination.Item active={this.state.page==1}  onClick={() =>this.updateData(1,10)}>{1}</Pagination.Item>
                <Pagination.Item active={this.state.page==2} onClick={() =>this.updateData(2,10)}>{2}</Pagination.Item>
                <Pagination.Item active={this.state.page==3} onClick={() =>this.updateData(3,10)}>{3}</Pagination.Item>
                <Pagination.Item active={this.state.page==4}  onClick={() =>this.updateData(4,10)}>{4}</Pagination.Item>
                <Pagination.Item active={this.state.page==5}  onClick={() =>this.updateData(5,10)}>{5}</Pagination.Item>
                <Pagination.Next />
              </Pagination>
          </div>
        </div>

      )
    }
  }
}

export default YupFeedTableWidget;
