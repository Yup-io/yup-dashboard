/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/img-redundant-alt */
import React, { Component }from "react";
import voteData from './votes12_28';
import * as d3 from "d3";

class YupGraph extends Component {
  constructor(props) {
    super(props);    
    this.draw = this.draw.bind(this)
    this.containerRef = React.createRef();
    this.nodeRef = React.createRef();
    this.state = {
      error: null,
      isLoaded: false,
      data: voteData,    
      node:null,
      simulation:null,
      link:null,
      tooltip:null,     
      typeFilterList : [],
      currentData : null, 
    };
    
// Define the dimensions of the visualization.
// We're using a size that's convenient for displaying the graphic on
     
//We start off by creating an SVG
// container to hold the visualization. We only need to specify
// the dimensions for this container.
  }
  componentDidMount() {
    /*fetch("https://www.api.bloks.io/tokens?type=topHolders&chain=eos&contract=token.yup&symbol=YUP&limit=10")
      .then(res => res.json())
      .then(
        (result) => {
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
      )*/
      
      this.draw(this.generateData(voteData, this.typeFilterList))
     console.log() 

  }
   draw(data) {
        
    var margin = { top: 10, right: 5, bottom: 10, left: 100 }
    var width = document.body.clientWidth;
    var height = document.body.clientHeight ;      
    //this.updateDetailsTab()
    //this.createTable(data)
    var svg = d3.select(this.containerRef.current).append("svg")
      .attr("width", width)
      .attr("height", height);
      
    var link = svg.selectAll('.link')
      .data(data.links)
      .enter().append('line')
      .attr("class", "link");
    
      var tooltip = d3.select('body').append('div').attr("class", "tooltip");
    
      var node = d3.select(this.nodeRef.current).selectAll('div')
      .data(data.nodes)
      .enter().append("div")
      .style("fill", function (d) {return d.name;})
      //we return the exact flag of each node from the image
      .attr('class', function (d) { return 'node node-' + d.group; })
      //we call some classes to handle the mouse
      .on('click', (d)=>{        
      this.getCorrespondingNodes(d)
      })
      .on('mouseover',function (d) {
        console.log(d.__data__)
        tooltip.transition().style('opacity', .9)
        tooltip.html('<p>' + d["name"] + '</p>');
      })
      .on("mousemove", (event, d) =>{
        tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px").style("color", "#090909");
      })
      .on("mouseout", ()=>{
        tooltip.transition().style('opacity', 0);
      });
      var simulation = d3.forceSimulation()
      .force("charge", d3.forceManyBody().strength(-10))
      .force("link", d3.forceLink().id(function (d) { return d.name; }).distance(10))
      .force("x", d3.forceX(width / 2))
      .force("y", d3.forceY(height / 2))
      .on("tick", (e) => {
        node.style('left', function (d) {return d.x + 'px'; })
        .style('top', function (d) { return d.y + 'px'; })
    
      // We also need to update positions of the links.
      // For those elements, the force layout sets the
      // `source` and `target` properties, specifying
      // `x` and `y` values in each case.
      link.attr('x1', function (d) { return d.source.x })
        .attr('y1', function (d) { return d.source.y })
        .attr('x2', function (d) { return d.target.x })
        .attr('y2', function (d) { return d.target.y })
      });
      
      simulation.nodes(data.nodes);
      simulation.force("link").links(data.links);
      //.log({node:node, simulation:simulation, link:link, tooltip:tooltip})
     //this.setState({node:node, simulation:simulation, link:link, tooltip:tooltip})
      //console.log(this.state)
  }
   tick(e) {
    // First let's reposition the nodes. As the force
    // layout runs it updates the `x` and `y` properties
    // that define where the node should be positioned.
    // To move the node, we set the appropriate SVG
    // attributes to their new values.
    console.log(e)
    this.state.node.style('left', function (d) { return d.x + 'px'; })
      .style('top', function (d) { return d.y + 'px'; })
  
    // We also need to update positions of the links.
    // For those elements, the force layout sets the
    // `source` and `target` properties, specifying
    // `x` and `y` values in each case.
    this.state.link.attr('x1', function (d) { return d.source.x })
      .attr('y1', function (d) { return d.source.y })
      .attr('x2', function (d) { return d.target.x })
      .attr('y2', function (d) { return d.target.y })
  }
  
  //hover over a flag
  //the tooltip with the name of the node is going to show up
   mouseoverHandler(d) {
    this.state.tooltip.transition().style('opacity', .9)
    this.state.tooltip.html('<p>' + d["name"] + '</p>');
  }
  //leaving a flag
  //the tooltip will disappear
   mouseoutHandler(d) {
    this.state.tooltip.transition().style('opacity', 0);
  }
  
   mouseMoving(event, d) {
    this.state.tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px").style("color", "#090909");
  }
   clickHandler(d) {
    console.log(d)
    this.getCorrespondingNodes(d)
  }
   filter() {
    console.log(this.typeFilterList)
    let filteredData = this.generateData(voteData, this.typeFilterList)
    console.log(filteredData)
    this.draw(filteredData)
  
  }
  generateData(data, filter) {
    let nodes = [];
    let links = [];
    data.forEach(element => {
      let url;
      try {
        url = new URL(element.Caption);
      }
      catch (e) {
        // console.log(e)
      }
      url = url ? this.filterHostname(url.hostname) : "general"
      if (filter && filter.includes("user")) {
  
        if (!filter || !filter.includes(url)) {
          nodes.push({
            name: element.Caption,
            group: url
          })
  
        }
      }
      else {
  
        if (!filter || !filter.includes(url)) {
          nodes.push({
            name: element.Caption,
            group: url
          })
          nodes.push({
            name: element.Voter,
            group: "user"
          })
          links.push({
            source: element.Voter,
            target: element.Caption,
          })
  
        }
      }
  
  
    })
    nodes = [...new Map(nodes.map(item => [item["name"], item])).values()]
    this.currentData = {name:filter?.length?filter:"All Recent", nodes, links}
    return { nodes, links }
  }
   filterHostname(hostname) {
    if (hostname.includes("youtube")) {
      return "youtube"
    } else if (hostname.includes("twitter")) {
      return "twitter"
    } else if (hostname.includes("reddit")) {
      return "reddit"
    } else {
      return "general"
    }
  
  }
   getCorrespondingNodes(node){
    if(node.group!="user"){
        this.draw(this.getDomainVotes(voteData,node))
    }
    else {    
        this.draw(this.getUserVotes(voteData,node))
    }
  }
   getDomainVotes(data, node){
    let nodes = [];
    let links = [];
    nodes.push(node)
    data.forEach(element => {
        if (element.Caption == node.name) {
          nodes.push({
            name: element.Voter,
            group: "user"
          })
          links.push({
            source: element.Voter,
            target: element.Caption,
          })
        }
    })
    nodes = [...new Map(nodes.map(item => [item["name"], item])).values()]
    
    this.state.currentData = {name:node.name, nodes, links}
    return { nodes, links }
  }
  
   getUserVotes(data, node){
    let nodes = [];
    let links = [];
    nodes.push(node)
    data.forEach(element => {
        if (element.Voter == node.name) {
          let url;
          try {
            url = new URL(element.Caption);
          }
          catch (e) {
            // console.log(e)
          }
          url = url ? this.filterHostname(url.hostname) : "general"
          nodes.push({
            name: element.Caption,
            group: url
          })
          links.push({
            source: element.Caption,
            target: element.Voter,
          })
        }
    })
    nodes = [...new Map(nodes.map(item => [item["name"], item])).values()]
    
    this.state.currentData = {name:node.name,nodes, links}
    return { nodes, links }
  }
  render() {
      return (
        <div ref={this.containerRef} id='container'>
          <div id='graph'>
            <div ref={this.nodeRef} id='nodes'></div>
          </div>
        </div>)
    }  
}

export default YupGraph;