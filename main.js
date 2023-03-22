// Define the CSV file location
const csvFilePath = 'cleaned_baseball_data.csv';

// Use PapaParse library to parse the CSV file
Papa.parse(csvFilePath, {
    download: true,
    header: true,
    complete: function(results) {
        // Get the 'Name' column data from the parsed CSV
        const names = results.data.map(item => item.Name);

        // Get the dropdown element
        const dropdown = document.getElementById("name-dropdown");

        // Loop through the names and add options to the dropdown
        names.forEach(name => {
            const option = document.createElement("option");
            option.text = name;
            option.value = name;
            dropdown.appendChild(option);
        });
    }
});

svg = d3.select("#diamond")
        .append("svg")
          .attr("width", "600")
          .attr("height", "350")
          .attr("version", "1.1")
          .attr("x", "0")
          .attr("y", "0")
          .attr("viewBox", "0 0 300 350");

svg.append("path")
      .attr("d", "M 180 300 L 50 120 L 180 50 L 310 120 z")
      .attr("fill", "none")
      .attr("stroke", "#ddd")
      .attr("stroke-width", "1")

svg.append("path")
      .attr("id", "diamond_")
      .attr("d", "M 180 300 L 50 120 L 180 50 L 310 120 z")
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stoke-width", "5")

svg.append("circle")
      .attr("id", "base")
      .attr("cy", "300")
      .attr("cx", "180")
      .attr("r", "20")
      .attr("fill", "brown")

svg.append("circle")
      .attr("id", "base")
      .attr("cy", "120")
      .attr("cx", "50")
      .attr("r", "20")
      .attr("fill", "white")

svg.append("circle")
      .attr("id", "base")
      .attr("cy", "50")
      .attr("cx", "180")
      .attr("r", "20")
      .attr("fill", "white")

svg.append("circle")
      .attr("id", "base")
      .attr("cy", "120")
      .attr("cx", "310")
      .attr("r", "20")
      .attr("fill", "white")


var path = new ProgressBar.Path("#diamond_", {
  duration: 6000,
  from: {
    color: "#ff0000",
    width: 2
  },
  to: {
    color: "#0099ff",
    width: 10
  },
  strokeWidth: 4,
  easing: "easeInOut",
  step: (state, shape) => {
    shape.path.setAttribute("stroke", state.color);
    shape.path.setAttribute("stroke-width", state.width);
  }
});


// update the percent by change the value here
path.animate(1);
