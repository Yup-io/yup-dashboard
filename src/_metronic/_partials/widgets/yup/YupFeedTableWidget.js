/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/img-redundant-alt */
import React, { Component } from "react";
import { Pagination } from "react-bootstrap";
import { Loader } from "./loader";
import "./custom.css";
import Skeleton from "@material-ui/lab/Skeleton";

const styles = (theme) => ({
  Category: {
    marginBottom: "0px",
  },
});
var skeleton=[];
for (var i=0; i<25;i++){
  skeleton.push(<h1 key={i}><Skeleton /></h1>)
}

class YupFeedTableWidget extends Component {
  skip = 0;
  limit = 25;
  fetchLimit = 1000;
  startingId = "";
  startingIndex = 0;
  indexNotFound = true;
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: { 1: null, 2: null, 3: null, 4: null, 5: null },
      loadedItems: [],
      newItems:[],
      page: 1,
    };
    this.tableBody=React.createRef();
    this.updateData = this.updateData.bind(this);
    this.getCreateVoteV3 = this.getCreateVoteV3.bind(this);
    this.getPostVoteV2 = this.getPostVoteV2.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }



  componentDidMount() {
    //Treating mount as a refresh, resetting all values
    this.skip = 0;
    this.loadedItems = [];
    this.newItems = [];
    this.startingId = "";
    this.startingIndex = 0;
    window.scrollTo(0,0);
    this.updateData(this.skip * this.limit, this.limit);
    window.addEventListener("scroll", this.handleScroll);
    // setInterval(this.updateData.bind(null, 1, 50), 60000);
  }
  componentWillUnmount(){
    window.removeEventListener("scroll",this.handleScroll);
  }

  handleScroll(){
    if((window.scrollY>=this.tableBody.current.scrollHeight-500) && this.state.isLoaded===true){
      this.setState({isLoaded:false});
      this.updateData(this.skip, this.limit);
    }
  }

  //Skip is where we're gonna skip to start collecting data
  //Limit, how many data points we want per fetch request
  async updateData(skip, limit) {
    let allVotes;
    let items;
    let createVoteV3;
    let postVoteV2;
    this.setState({isLoaded:false});
    //Fetches more data after the first fetch if the index of the
    //starting point can't be found.
    //With a moving starting point, we need to make sure the starting point is far enough from the
    //last point to have enough data to display.
    while (
      this.skip === 0 ||
      (this.indexNotFound && this.fetchLimit - this.startingIndex > this.limit)
    ) {
      //Getting data from the two sources
      [createVoteV3, postVoteV2] = await Promise.all([
        this.getCreateVoteV3(this.skip, this.fetchLimit),
        this.getPostVoteV2(this.skip, this.fetchLimit),
      ]);
      //Putting the data together and sorting them by time, newest to oldest
      allVotes = createVoteV3.actions.concat(postVoteV2.actions);
      allVotes.sort(function(a, b) {
        return new Date(b.timestamp) - new Date(a.timestamp);
      });
      console.log(allVotes)
      //First time getting data
      if (this.skip === 0) {
        //StartingId to help find the index of the same post in the next batch of data
        this.startingId = allVotes[this.limit - 1].trx_id;
        this.skip += this.limit;
        this.indexNotFound = false;
      } else {
        //Reorienting ourselves so we can find the starting point from our previous batch
        console.log(this.startingId)
        this.startingIndex = allVotes.findIndex(
          (vote) => vote.trx_id === this.startingId
        );
        console.log(this.startingIndex)
        if (this.startingIndex === -1) {
          this.skip += this.fetchLimit;
        } else {
          this.startingId =
            allVotes[this.startingIndex + this.limit - 1].trx_id;
          this.skip += this.limit + this.startingIndex;
          this.indexNotFound = false;
        }
      }
    }
    allVotes.forEach((item) => {
      item.timestamp = this.convertUTCDateToLocalDate(new Date(item.timestamp));
    });
    items = allVotes.slice(this.skip, this.skip + limit);
    //Resetting value for next iteration
    this.indexNotFound = true;
    this.getPostData(this.skip, items);
  }

  convertUTCDateToLocalDate(date) {
    var newDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60 * 1000
    );
    return newDate;
  }
  //Don't know the difference between this and PostVoteV2
  //If successful, returns an object with data from (skip, skip+limit) inclusive
  async getCreateVoteV3(skip, limit) {
    return new Promise((resolve, reject) => {
      fetch(
        "https://eos.hyperion.eosrio.io/v2/history/get_actions?account=yupyupyupyup&filter=*%3Acreatevotev3&skip=" +
          this.skip +
          "&limit=" +
          this.fetchLimit +
          "&sort=desc"
      )
        .then((res) => res.json())
        .then(
          (result) => {
            resolve(result);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  async getPostVoteV2(skip, limit) {
    return new Promise((resolve, reject) => {
      fetch(
        "https://eos.hyperion.eosrio.io/v2/history/get_actions?account=yupyupyupyup&filter=*%3Apostvotev2&skip=" +
          this.skip +
          "&limit=" +
          this.limit +
          "&sort=desc"
      )
        .then((res) => res.json())
        .then(
          (result) => {
            resolve(result);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  //from updateData gets page, and the sorted and sliced data
  async getPostData(page, items) {
    this.setState({
      loadedItems:this.loadedItems.concat(this.newItems)
    });
    let fullData = [];
    let newItems=[];
    var itemsProcessed = 0;
    //Checks if items for this page dont exist or if the first items isnt the same -> makes api calls
    if (this.state.isLoaded===false) {
      //Can only get data from the createVoteV3 method, the only place with a postid
      await items.forEach(async (vote) => {
        if (vote.act.data.postid) {
          await fetch("https://api.yup.io/posts/post/" + vote.act.data.postid, {
            method: "GET",
          })
            .then((res) => {
              try {
                return res.json();
              } catch (e) {
                console.log(e);
                this.setState({
                  isLoaded: false,
                  error: e,
                });
              }
            })
            .then((result) => {
              if (result) {
                fullData.push({
                  post: {
                    caption: result.caption,
                    tag: result.tag,
                  },
                  vote: vote,
                });
              }
            });
        } else {
          fullData.push({
            vote: vote,
            post: {
              caption: vote.act.data.caption,
              tag: vote.act.data.tag,
            },
          });
        }
        itemsProcessed++;
        //Is the sort needed? We put in sorted dated already and should stay sorted
        if (itemsProcessed === items.length) {
          fullData.sort(function(a, b) {
            return (
              new Date(b.vote.timestamp).getTime() -
              new Date(a.vote.timestamp).getTime()
            );
          });
          newItems=newItems.concat(fullData);
          this.setState({
            isLoaded: true,
            newItems: newItems,
          })
        }
      });
    }}
  createRating(n) {
    let rating = n.rating;
    let like = n.like;
    var ratingMap = {
      "1": "3",
      "2": "4",
      "3": "5",
    };
    var ratingMapFalse = {
      "1": "2",
      "2": "1",
    };
    if (like) {
      rating = ratingMap[rating];
    } else {
      rating = ratingMapFalse[rating];
    }
    var elements = [];
    var colorMap = {
      "1": "#BE1E2D",
      "2": "#F08C28",
      "3": "#F0C800",
      "4": "#7FBA1B",
      "5": "#00EAB7",
    };
    for (let i = 0; i < rating; i++) {
      elements.push(
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          width="20px"
          height="20px"
        >
          <g fill={colorMap[rating]}>
            {" "}
            <circle cx="50%" cy="50%" r="25" />
          </g>
        </svg>
      );
    }
    return elements;
  }
  render() {
    const { error, isLoaded, loadedItems } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else {
      return (
        <div className={`card card-custom card-stretch gutter-b`}>
          {/* Head */}
          <div className="card-header border-0 py-5">
            <h2 className="card-title align-items-start flex-column ">
              <span className="card-label font-weight-bolder text-dark space-between">
                History
              </span>
            </h2>
          </div>
          {/* Body */}
          <div className="card-body pt-0 pb-3">
            <div className="tab-content">
              <div className="table-responsive">
                <table className="table table-head-custom  table-borderless table-vertical-center">
                  <thead>
                    <tr className="text-left">
                      <th className="text-left">Time</th>
                      <th className="text-left">User</th>
                      <th>Content</th>
                      <th className="text-left">Rating</th>
                      <th className="text-left">Platform</th>
                    </tr>
                  </thead>
                    <tbody ref={this.tableBody}>
                      {this.state.newItems.map((item) => (         
                        <tr key={item.vote.global_sequence}>
                          <td>
                            <span className="text-dark-75 d-block font-size-lg">
                              {new Date(
                                item.vote.timestamp
                              ).toLocaleDateString()}{" "}
                              {new Date(
                                item.vote.timestamp
                              ).toLocaleTimeString()}
                            </span>
                          </td>
                          <td>
                            <a
                              href={`https://app.yup.io/${item.vote.act.data.voter}`}
                              className="text-dark-75 d-block font-size-lg"
                            >
                              {item.vote.act.data.voter}
                            </a>
                          </td>
                          <td>
                            <a
                              href={item.post.caption}
                              className="text-primary d-block font-size-lg"
                            >
                              {item.post.caption.substring(0, 30)}
                              {item.post.caption.length > 29 && "..."}
                            </a>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div>
                                <span>
                                  {item.vote.act.data.category ==
                                    "intelligence" && (
                                    <h3 className="category-emoji">💡</h3>
                                  )}
                                  {item.vote.act.data.category == "funny" && (
                                    <h3 className="category-emoji">😂</h3>
                                  )}
                                  {item.vote.act.data.category ==
                                    "popularity" && (
                                    <h3 className="category-emoji">❤️</h3>
                                  )}
                                </span>
                              </div>
                              <span
                                className="text-dark-75 text-left font-size-lg"
                                style={{ marginTop: "-1px" }}
                              >
                                {this.createRating(item.vote.act.data)}
                              </span>
                            </div>
                          </td>
                          <td>
                            <span className="text-dark-75 text-left d-block font-size-lg">
                              {item.post.tag
                                .split(".")[0]
                                .charAt(0)
                                .toUpperCase() +
                                item.post.tag.split(".")[0].slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                      
                    </tbody>
                </table>
              </div>
            </div>
            <div className="d-flex justify-content-center">
                {!isLoaded && (
                  <span
                    style={{ width: "100%" }}
                    className="text-dark-75 font-size-lg pr-5"
                  >
                    {skeleton}
                  </span>
                )}
              </div>
          </div>
        </div>
      );
    }
  }
}

export default YupFeedTableWidget;
