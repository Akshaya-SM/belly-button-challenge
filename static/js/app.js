 // Read sample.json file from the URL
 const url = " https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

 //Fetch the JSON data
 d3.json(url).then(function(data) { 
  console.log(data);
 });
  
 
  // Initialize the dashboard at start up
  function init() {

    // Use D3 to select the dropdown menu
    let dropdownMenu = d3.select("#selDataset");

    // Use D3 to get sample names and populate the drop-down selector
    d3.json(url).then((data) => { 

      // Set a variable for the sample names
      let names= data.names;

      // Adding the samples to the dropdown menu
      names.forEach((id) => {

        // log the values of id for each iteration
        console.log(id);

        dropdownMenu.append("option")
        .text(id)
        .property("value", id);
      });

      // Set the first sample from names list
      let sample_one= names[0];

      // Log the value of first sample
      console.log(sample_one);

      //Build the initial plots
      buildMetadata(sample_one);
      buildBarChart(sample_one);
      buildBubbleChart(sample_one);

    });

  };

  // Function for building metadata 
  function buildMetadata(sample) {

    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {

      // Retrieve all metadata 
      let metadata = data.metadata;

      //Filter based on the value of the sample
      let value= metadata.filter(result => result.id == sample);

      //Log the array of metadata objects after they are been filtered
      console.log(value);

      // Get the first index from the array
      let valueData = value[0];

      // Clear out metadata
      d3.select("#sample-metadata").html("");

      // Use Object.entries to add each key/value pairs to the panel
      Object.entries(valueData).forEach(([key,value]) => { 

        //Log the individual key/value pairs as they are appended to metadata panel
        console.log(key,value);

        d3.select("#sample-metdata").append("h5").text(`${key}: ${value}`);
      });
        
    });

  };

  // Function for bar chart
  function buildBarChart(sample) {

    // Use D3 to retrive all of the data
    d3.json(url).then((data) => {

      // Retrieve all sample data
      let sampleInfo = data.samples;

      // Filter based on the value of sample
      let value= sampleInfo.filter(result => result.id == sample);

      let valueData= value[0];

      // Get the otu_ids, labels, sample values
      let otu_ids= valueData.otu_ids;
      let otu_labels = valueData.otu_labels;
      let sample_values = valueData.sample_values;

      //Log the data to the console
      console.log(otu_ids, otu_labels, sample_values);

      // Set top 10 items to display in desc. order
      let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
      let xticks = sample_values.slice(0,10).reverse();
      let labels= otu_labels.slice(0,10).reverse();
     
      // Set up the trace for the bar chart 
      let trace= {
        x: xticks,
        y: yticks,
        text: labels,
        type: "bar",
        orientation: "h"
      };

      //Setup the layout
      let layout= {
        title:"Top 10 OTUs present"
      };

      // Call Plotly to plot the Bar chart
      Plotly.newPlot("bar", [trace], layout)
    });
    
  };

  // Function for the Bubble chart
  function buildBubbleChart(sample){

    // Use D3 to retrieve the data
    d3.json(url).then((data) => {

      // Retrieve all sample data
      let sampleData = data.samples;

      // Filter based on the value of sample
      let value= sampleData.filter(result => result.id == sample);

      // Get the first index from array
      let valueData= value[0];

      // Get the otu_ids, labels, sample values
      let otu_ids= valueData.otu_ids;
      let otu_labels = valueData.otu_labels;
      let sample_values = valueData.sample_values;

      //Log the data to console
      console.log(otu_ids, otu_labels, sample_values);

      // Set up trace for Bubble chart
      let trace1 = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Earth"
        }
      };

      // Set up the layout
      let layout1 = {
        title: "Bacteria Per Sample",
        hovermode: "closest",
        xaxis: {title: "OTU ID"},
      };

      // Call Plotly to plot the Bubble chart
      Plotly.newPlot("bubble", [trace1], layout1)

    });
  
  };

  // Function that updates dashboard when sample is changed 
  function optionChanged(value) {
    // Log the new value
    console.log(value);

    // Call all functions
    buildMetadata(value);
    buildBarChart(value);
    buildBubbleChart(value);
   
  };

  // Call the initialize function
  init();
  
