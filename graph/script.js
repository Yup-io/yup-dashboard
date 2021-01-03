//let data = localData;

let data= generateLinks(voteData);
console.log(data)
// Define the dimensions of the visualization.
// We're using a size that's convenient for displaying the graphic on
var margin  = {top: 10, right: 5, bottom: 10, left: 100},
    width   = document.body.clientWidth-margin.left-margin.right,
    height  = document.body.clientHeight-margin.top-margin.bottom;
//We start off by creating an SVG
// container to hold the visualization. We only need to specify
// the dimensions for this container.
var svg = d3.select("body").append("svg")
.attr("width",width)
.attr("height",height);
//create the tooltip that holds the node name
var tooltip = d3.select('body').append('div').attr("class","tooltip");
  // Extract the nodes and links from the data.
  // Now we create a force layout object and define its properties.
  // Those include the dimensions of the visualization and the arrays
  // of nodes and links.
  function draw(data){
    svg.remove()
    svg = d3.select("body").append("svg")
    .attr("width",width)
    .attr("height",height); 
    link.remove()
    link = svg.selectAll('.link')
    .data(data.links)
    .enter().append('line')
    .attr("class","link");
    node.remove()
    node=  d3.select('#nodes').selectAll('div')
    .data(data.nodes)
    .enter().append("div")    
    .style("fill", function(d) {
      return d.name; })
  //we return the exact flag of each node from the image
    .attr('class', function (d) { return 'node node-' + d.group; })
  //we call some classes to handle the mouse
    .on('mouseover', mouseoverHandler)
    .on("mousemove",mouseMoving)
    .on("mouseout", mouseoutHandler);
    simulation= d3.forceSimulation()
    .force("charge", d3.forceManyBody().strength(-10))
    .force("link", d3.forceLink().id(function(d) { return d.name; }).distance(10))
    .force("x", d3.forceX(width / 2))
    .force("y", d3.forceY(height / 2))
    .on("tick", tick);
  simulation.nodes(data.nodes);
  simulation.force("link").links(data.links);
  }
  var simulation = d3.forceSimulation()
  .force("charge", d3.forceManyBody().strength(-10))
  .force("link", d3.forceLink().id(function(d) { return d.name; }).distance(10))
  .force("x", d3.forceX(width / 2))
  .force("y", d3.forceY(height / 2))
  .on("tick", tick);
  
//    .linkStrength(0.9)
//    .theta(0.2)
//    .alpha(0.9)
// There's one more property of the layout we need to define,
// its `linkDistance`. That's generally a configurable value and,
// for a simple example, we'd normally leave it at its default.
// Unfortunately, the default value results in a visualization
// that's not especially clear. This parameter defines the
// distance (normally in pixels) that we'd like to have between
// nodes that are connected. (It is, thus, the length we'd
// like our links to have.)
//now so it's time to turn
// things over to the force layout. Here we go.

// Next we'll add the nodes and links to the visualization.
// Note that we're just sticking them into the SVG container
// at this point. We start with the links. The order here is
// important because we want the nodes to appear "on top of"
// the links. SVG doesn't really have a convenient equivalent
// to HTML's `z-index`; instead it relies on the order of the
// elements in the markup. By adding the nodes _after_ the
// links we ensure that nodes appear on top of links.

// Links are pretty simple. They're just SVG lines, and
// we're not even going to specify their coordinates. (We'll
// let the force layout take care of that.) Without any
// coordinates, the lines won't even be visible, but the
// markup will be sitting inside the SVG container ready
// and waiting for the force layout.
  
var link = svg.selectAll('.link')
    .data(data.links)
    .enter().append('line')
    .attr("class","link");

  // Now it's the nodes turn. Each node is drawn as a flag.
 var  node = d3.select('#nodes').selectAll('div')
    .data(data.nodes)
    .enter().append("div")    
    .style("fill", function(d) {
      return d.name; })
  //we return the exact flag of each node from the image
    .attr('class', function (d) { return 'node node-' + d.group; })
  //we call some classes to handle the mouse
    .on('mouseover', mouseoverHandler)
    .on("mousemove",mouseMoving)
    .on("mouseout", mouseoutHandler);

  //	filtered types
  typeFilterList = [];

  //	filter button event handlers
  $(".filter-btn").on("click", function() {
  	var id = $(this).attr("value");
    console.log(id)
  	if (typeFilterList.includes(id)) {
  		typeFilterList.splice(typeFilterList.indexOf(id), 1)
  	} else {
  		typeFilterList.push(id);
  	}
  	filter();
  });


  // We're about to tell the force layout to start its
  // calculations. We do, however, want to know when those
  // calculations are complete, so before we kick things off
  // we'll define a function that we want the layout to call
  // once the calculations are done.
  function tick(e){
    // First let's reposition the nodes. As the force
    // layout runs it updates the `x` and `y` properties
    // that define where the node should be positioned.
    // To move the node, we set the appropriate SVG
    // attributes to their new values.
     node.style('left', function (d) { return d.x + 'px'; })
     .style('top', function (d) { return d.y + 'px'; })

    // We also need to update positions of the links.
    // For those elements, the force layout sets the
    // `source` and `target` properties, specifying
    // `x` and `y` values in each case.
    link.attr('x1', function(d){ return  d.source.x})
        .attr('y1',function(d){ return  d.source.y})
        .attr('x2', function(d){ return  d.target.x})
        .attr('y2',function(d){ return   d.target.y})
  }

  //hover over a flag
  //the tooltip with the name of the node is going to show up
  function mouseoverHandler (d) {
     tooltip.transition().style('opacity', .9)
     tooltip.html('<p>' + d["name"] + '</p>' );
  }
  //leaving a flag
  //the tooltip will disappear
  function mouseoutHandler (d) {
      tooltip.transition().style('opacity', 0);
  }

  function mouseMoving (d) {
      tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px").style("color","#090909");
  }

function filter(){
  console.log(typeFilterList)
  let filteredData = generateLinks(voteData, typeFilterList)
  console.log(filteredData)
draw(filteredData)

}
function generateLinks(data, filter){
  let nodes = [];    
  let links = [];
 data.forEach(element => {
  let url;
   try{
    url = new URL(element.Caption);
  }
  catch(e){
   // console.log(e)
  }
  url = url? filterHostname(url.hostname) :"general"
   if(filter &&filter.includes("user")){
      
    if(!filter || !filter.includes(url)){  
      nodes.push({
        name:element.Caption,
        group: url
      })
  
  }
}
  else {
    
  if(!filter || !filter.includes(url)){  
    nodes.push({
      name:element.Caption,
      group: url
    })
    nodes.push({
     name:element.Voter,
     group:"user"
   })
   links.push({
     source:element.Voter,
     target:element.Caption,      
  })
 
 }
  }
  
 
 })
  nodes = [...new Map(nodes.map(item => [item["name"], item])).values()]
 return {nodes, links}
} 
function filterHostname(hostname){
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

draw(data)