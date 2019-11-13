function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  d3.json("/metadata/" + sample).then(function(response){

    console.log(response);
    var metadata = response;
  
    // Use d3 to select the panel with id of `#sample-metadata`

    var data = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata

    data.html("");

    // Use `Object.entries` to add each key and value pair to the panel

    Object.entries(metadata).forEach( ([key, value]) => data.append('p').append('small').text(key + ": " + value));
      
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

  })};

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots

  d3.json("/samples/" + sample).then(function(response) {

    // @TODO: Build a Bubble Chart using the sample data

    var trace = {
      type: "scatter",
      mode: "markers",
      marker: {
            "size": response.sample_values,
            "color": response.otu_ids,
            "line": {
                "color": response.otu_ids,
                "width": 1
            }},
      text: response.otu_labels,
      x: response.otu_ids,
      y: response.sample_values,
    };

    var bubbleData = [trace];

    var bubbleLayout = {
      title: "Bacteria Population",
      xaxis: {
        type: "linear"
      },
      yaxis: {
        autorange: true,
        type: "linear"
      }
    };

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

var list = [];
for (var i = 0; i < response.otu_ids; i++) {
    // Push each object into the list
    list.push({'otu_ids': response.otu_ids[i], 'otu_labels': sampleD.otu_labels[i], 'sample_values': sampleData.sample_values[i]});
}
console.log(list)
// Sort function by object key in array
console.log(list.sort((a, b) => parseInt(b.sample_values) - parseInt(a.sample_values)));

var trace2 = {
  values: response.sample_values.slice(0,10),
  labels: response.otu_ids.slice(0,10),
  hovertext: list.slice(0,10).map(record => "(" + record.otu_ids + ", " + record.otu_labels + ")"),
  type: "pie"
};

var data = [trace2];

var layout = {
  title: "<b>Pie Chart Belly Button Bacteria</b><br>(Top 10)",
  height: 500,
  width: 500
};

Plotly.newPlot("pie", data, layout);
});
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}


// Initialize the dashboard

init(); 
