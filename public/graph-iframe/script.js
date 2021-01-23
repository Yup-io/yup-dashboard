//let data = localData;
let currentData;
let voteData;
let userFilter = '';
let typeFilterList = [];
let timeFrameFilter = '';
// Define the dimensions of the visualization.
// We're using a size that's convenient for displaying the graphic on
var width, height, svg, tooltip, simulation, link, node;
var cacheDuration = 1800000 // 1800000 = 30min cache
var threeDimensional = true;
const myForceGraph = ForceGraph3D()(document.getElementById('3d-graph'))
.backgroundColor('white')
.linkColor(() => '#0f0f0f') //Not working?
.nodeOpacity(1)
.height(document.getElementsByClassName('right')[0].offsetHeight)
.width(document.getElementsByClassName('right')[0].offsetWidth)
    .nodeLabel('id')
    .nodeColor(d => d.color).onNodeClick((node) => {
       getCorrespondingNodes(node)
    })


//	filter button event handlers
$(".filter-btn").on("click", function (e) {
  console.log(e)
  var id = $(this).attr("value");
  console.log(id)
  if (typeFilterList.includes(id)) {
    typeFilterList.splice(typeFilterList.indexOf(id), 1)
  } else {
    typeFilterList.push(id);
  }
  typeFilterList.sort()
  filter()
});
async function getData(){
  let cache = JSON.parse(sessionStorage.getItem('initial-data'))
  if (cache && Date.now() - cache.timestamp < cacheDuration) {
    voteData = cache.data
    filter()
  }
  else {
    axios({
      method: 'get',
      url: 'http://api.yup.io/votes?start=0&limit=1000',
    })
      .then(function (response) {
        console.log(response)
        var data = []
        response.data.forEach(element => {
          if(element.postData[0]?.caption){
            data.push({
              caption: element.postData[0].caption,
              voter:element.voter,
              timestamp: element.timestamp
            })
          }
        })
        voteData = data
        let cacheData = JSON.stringify({
          timestamp: Date.now(),
          data: data
        })
        console.log(data)
        sessionStorage.setItem('initial-data',cacheData)
        filter()
      });

  }
}
function changeUser() {
  let userLabel = document.getElementById('user-show-label')
  userFilter = document.getElementById('user-input').value
  if (userFilter) {
    userLabel.innerText = userFilter
    userLabel.hidden = false
    document.getElementById('user').checked = true
    document.getElementById('user').value = userFilter
  }
  filter()
}

function savedUser() {
  userFilter = document.getElementById('user').value
  filter()
}

function allUsers() {
  userFilter = ''
  document.getElementById('user').checked = false
  filter()
}
function changeTimeframe(value){
timeFrameFilter=value
filter()
}
function change3D(){
threeDimensional=!threeDimensional
filter()
}
function updateDetailsTab() {
  $("#node-name").text(currentData.id)
  $("#node-amount").text(currentData.nodes.length)
  $("#node-connections").text(currentData.links.length)
}

function showNodeList() {
  $("#nodeList").show()
}

function createTable(data) {
  let header = ["name", "group"]
  let table = document.getElementById("table");
  table.deleteTHead()
  data.nodes.forEach(element => {
    let row = table.insertRow();
    for (let key of header) {
      let cell = row.insertCell();
      let text = document.createTextNode(element[key]);
      cell.appendChild(text);
    }
  })
  let thead = table.createTHead();
  let row = thead.insertRow();
  for (let key of header) {
    let th = document.createElement("th");
    let text = document.createTextNode(key.charAt(0).toUpperCase() + key.slice(1));
    th.appendChild(text);
    row.appendChild(th);
  }
}
// We're about to tell the force layout to start its
// calculations. We do, however, want to know when those
// calculations are complete, so before we kick things off
// we'll define a function that we want the layout to call
// once the calculations are done.
function draw(data) {
  width = document.body.clientWidth - 100 - document.getElementsByClassName('left')[0].clientWidth
  height = document.getElementsByClassName('content')[0].clientHeight;
  updateDetailsTab()
  createTable(data)
  svg?.remove()
  svg = d3.select("#container").append("svg")
    .attr("width", width)
    .attr("height", height);
  tooltip = d3.select('body').append('div').attr("class", "tooltip");
  link?.remove()
  link = svg.selectAll('.link')
    .data(data.links)
    .enter().append('line')
    .attr("class", "link");
  node?.remove()
  node = d3.select('#nodes').selectAll('div')
    .data(data.nodes)
    .enter().append("div")
    .style("fill", function (d) {
      return d.id;
    })
    //we return the exact flag of each node from the image
    .attr('class', function (d) {
      return 'node node-' + d.group;
    })
    //we call some classes to handle the mouse
    .on('click', clickHandler)
    .on('mouseover', mouseoverHandler)
    .on("mousemove", mouseMoving)
    .on("mouseout", mouseoutHandler);
  simulation = d3.forceSimulation()
    .force("charge", d3.forceManyBody().strength(-10))
    .force("link", d3.forceLink().id(function (d) {
      return d.id;
    }).distance(10))
    .force("x", d3.forceX(width / 2))
    .force("y", d3.forceY(height / 2))
    .on("tick", tick);
  simulation.nodes(data.nodes);
  simulation.force("link").links(data.links);
}

function tick(e) {
  // First let's reposition the nodes. As the force
  // layout runs it updates the `x` and `y` properties
  // that define where the node should be positioned.
  // To move the node, we set the appropriate SVG
  // attributes to their new values.
  node.style('left', function (d) {
      return d.x + 'px';
    })
    .style('top', function (d) {
      return d.y + 'px';
    })

  // We also need to update positions of the links.
  // For those elements, the force layout sets the
  // `source` and `target` properties, specifying
  // `x` and `y` values in each case.
  link.attr('x1', function (d) {
      return d.source.x
    })
    .attr('y1', function (d) {
      return d.source.y
    })
    .attr('x2', function (d) {
      return d.target.x
    })
    .attr('y2', function (d) {
      return d.target.y
    })
}

//hover over a flag
//the tooltip with the name of the node is going to show up
function mouseoverHandler(d) {
  console.log(d)
  tooltip.transition().style('opacity', .9)
  tooltip.html('<p>' + d["id"] + '</p>');
}
//leaving a flag
//the tooltip will disappear
function mouseoutHandler(d) {
  tooltip.transition().style('opacity', 0);
}

function mouseMoving(d) {
  tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px").style("color", "#090909");
}

function clickHandler(d) {
  console.log(d)
  getCorrespondingNodes(d)
}

function filter() {
  document.getElementById('spinner').hidden=true
  let cacheName = typeFilterList?.toString() + userFilter + timeFrameFilter
  console.log(userFilter)
  let cache = JSON.parse(sessionStorage.getItem(cacheName))
  if (cache && Date.now() - cache.timestamp < cacheDuration) {
    console.log("Was cached")
    currentData = {
      id: typeFilterList?.length ? typeFilterList : "All Recent",
      nodes: cache.data.nodes,
      links: cache.data.links
    }
    if(threeDimensional){
      document.getElementById('container').hidden=true
      document.getElementById('3d-graph').hidden=false
      draw3D(cache.data)
    }
    else {
      document.getElementById('3d-graph').hidden=true
      document.getElementById('container').hidden=false
      draw(cache.data)
    }
  } else {
    console.log("Need to cache")
    let filteredData = generateData(voteData, typeFilterList, userFilter, timeFrameFilter)
    let data = JSON.stringify({
      timestamp: Date.now(),
      data: filteredData
    })
    console.log(cacheName)
    sessionStorage.setItem(cacheName, data)
    if(threeDimensional){
      draw3D(filteredData)
    }
    else {
      draw(filteredData)
    }
  }
  console.log(typeFilterList)

}

function generateData(data, filter, userFilter, timeFrameFilter) {
  let nodes = [];
  let links = [];
  data.forEach(element => {
    if(nodes.length<=2000){
    if(!timeFrameFilter || dateFns.differenceInDays( new Date(),new Date(parseInt(element.timestamp))) <=timeFrameFilter){
    let url;
    try {
      url = new URL(element.caption);
    } catch (e) {
      // console.log(e)
    }

    url = url ? filterHostname(url.hostname) : {group:'general',color:"#3a3a3a"}
    if (filter && filter.includes("user")) {
      if (!filter.includes(url.group)) {
        nodes.push({
          id: element.caption,
          group: url.group,
          color: url.color
        })
      }
    } else {
      if (!filter?.includes(url.group)) {
        if (!userFilter || userFilter == element.voter) {
          if(element.caption){
            nodes.push({
              id: element.caption,
              group: url.group,
              color: url.color
            })
            nodes.push({
              id: element.voter,
              group: "user",
              color: "#dadada"
            })
            links.push({
              source: element.voter,
              target: element.caption,
            })

          }
        }

      }
    }
  }
}
  })
  console.log(nodes)
  nodes = [...new Map(nodes.map(item => [item["id"], item])).values()]
  currentData = {
    id: filter?.length ? filter : "All Recent",
    nodes,
    links
  }
  return {
    nodes,
    links
  }
}

function filterHostname(hostname) {
  if (hostname.includes("youtube")) {
      return {group:'youtube',color:"#c4302b"}
  } else if (hostname.includes("twitter")) {
      return {group:'twitter',color:"#1da1f2"}
  } else if (hostname.includes("reddit")) {
      return {group:'reddit',color:"orangered"}
  } else {
      return {group:'general',color:"#3a3a3a"}
  }

}

function getCorrespondingNodes(node) {
  if (node.group != "user") {
    if(threeDimensional){
      draw3D(getDomainVotes(voteData, node))
    }
    else {
      draw(getDomainVotes(voteData, node))
    }
  } else {
    if(threeDimensional){
      draw3D(getUserVotes(voteData, node))}
    else {
      draw(getUserVotes(voteData, node))
    }
  }
}

function getDomainVotes(data, node) {
  let nodes = [];
  let links = [];
  nodes.push(node)
  data.forEach(element => {
    if (element.caption == node.id) {
      nodes.push({
        id: element.voter,
        group: "user",
        color: "#dadada"
      })
      links.push({
        source: element.voter,
        target: element.caption,
      })
    }
  })
  nodes = [...new Map(nodes.map(item => [item["id"], item])).values()]

  currentData = {
    id: node.id,
    nodes,
    links
  }
  return {
    nodes,
    links
  }
}

function getUserVotes(data, node) {
  let nodes = [];
  let links = [];
  nodes.push(node)
  data.forEach(element => {
    if (element.voter == node.id) {
      let url;
      try {
        url = new URL(element.caption);
      } catch (e) {
        // console.log(e)
      }
      url = url ? filterHostname(url.hostname) : {group:'general',color:"#3a3a3a"}
      nodes.push({
        id: element.caption,
        group: url.group,
        color: url.color
      })
      links.push({
        source: element.caption,
        target: element.voter,
      })
    }
  })
  nodes = [...new Map(nodes.map(item => [item["id"], item])).values()]

  currentData = {
    id: node.id,
    nodes,
    links
  }
  return {
    nodes,
    links
  }
}

function draw3D(data) {
  updateDetailsTab()
  myForceGraph.graphData(data);
}
getData()