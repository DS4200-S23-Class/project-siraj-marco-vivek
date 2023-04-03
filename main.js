// Define the CSV file location
let csvFilePath = 'cleaned_baseball_data.csv';

// Prints first 10 lines of CSV to console
console.log("First 10 rows of data file:")

d3.csv(csvFilePath).then((data) => {
  
  // ~~~~~~~~~~~~~~~~ BASEBALL DIAMOND ~~~~~~~~~~~~~~~~~~~~~
  svg = d3.select("#diamond")
  .append("svg")
  .attr("id", "diamond_animate")
  .attr("width", "600")
  .attr("height", "350")
  .attr("version", "1.1")
  .attr("x", "0")
  .attr("y", "0")
  .attr("viewBox", "0 0 300 350");

   svg.append("circle")
  .attr("id", "center")
  .attr("cy", "165")
  .attr("cx", "180")
  .attr("r", "30")
  .attr("fill", "orange"); 

  svg.append("text")
  .attr("x", "150")
  .attr("y", "175")
  .attr("font-size", 24)
  .attr("fill", "black")
  .text("100%");
  
  svg.append("path")
  .attr("d", "M 180 300 L 310 120 L 180 50 L 50 120z")
  .attr("fill", "none")
  .attr("stroke", "#ddd")
  .attr("stroke-width", "1");

  svg.append("path")
  .attr("id", "diamond_")
  .attr("d", "M 180 300 L 310 120 L 180 50 L 50 120z")
  .attr("fill", "none")
  .attr("stroke", "red")
  .attr("stoke-width", "5");

  svg.append("circle")
  .attr("id", "base")
  .attr("cy", "300")
  .attr("cx", "180")
  .attr("r", "20")
  .attr("fill", "white");

  svg.append("circle")
  .attr("id", "base")
  .attr("cy", "120")
  .attr("cx", "50")
  .attr("r", "20")
  .attr("fill", "white");

  svg.append("circle")
  .attr("id", "base")
  .attr("cy", "50")
  .attr("cx", "180")
  .attr("r", "20")
  .attr("fill", "white");

  svg.append("circle")
  .attr("id", "base")
  .attr("cy", "120")
  .attr("cx", "310")
  .attr("r", "20")
  .attr("fill", "white");


  let path = new ProgressBar.Path("#diamond_", {
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

  // Create dropdown for attribute
  let att_drop = document.getElementById("attribute-dropdown");
  let cols = data.columns;
  cols.forEach(col => {
          const option = document.createElement("option");
          option.text = col;
          option.value = col;
          att_drop.append(option);
      });
    for (let i = 0; i < 10; i++) {
      console.log(data[i]);
    };

    let attr_drop = document.getElementById("attribute-dropdown");
    let player_drop = document.getElementById("name-dropdown");

    function update_diamond(){

        let attr = attr_drop.value;
        let name = player_drop.value;

        if (attr.length != 0 && name.length != 0){
          // Find the index of the player by name
          let playerName = 'Alice';
          let playerIndex = -1;
          for (let i = 0; i < data.length; i++) {
            if (data[i]['Name'] === name) {
              playerIndex = i;
              break;
            };
          };
          let attr_val = data[playerIndex][attr];
          all_time = -Infinity
          for (let i = 0; i < data.length; i++) {
            let value = parseFloat(data[i][attr]);
            if (value > all_time) {
              all_time = value;
            };
          };
          let percent = Math.round(attr_val / all_time * 100);
          let txt = svg.selectAll("text");
          let number = parseInt(txt.text().replace("%", ""));

          function iterateNumbers(startNum, endNum) {
            // Determine the direction of the iteration
            let increment = (startNum <= endNum) ? 1 : -1;
            let i = startNum;
            // Iterate through the numbers
            d3.interval(function() {
              if (i != endNum) {
              i += increment
              // Modify the text element with the given ID
              txt.text(i.toString() + "%");
            }}, 80
            )};

          iterateNumbers(number, percent);
          path.animate(percent/100);
        };
    };
    attr_drop.addEventListener("change", update_diamond);
    player_drop.addEventListener("change", update_diamond);
  }).catch((error) => {
    console.log(error);
  });

// Use PapaParse library to parse the CSV file
Papa.parse(csvFilePath, {
    download: true,
    header: true,
    complete: function(results) {
      // Get the column headers from the parsed CSV
      const headers = results.meta.fields.slice(6);
    
      // Fetch the dropdown element
      const dropdown = document.getElementById("attribute-dropdown");
    
      // Iteratively add headers to dropdown options
      headers.forEach(header => {
        const option = document.createElement("option");
        option.text = header;
        option.value = header;
        dropdown.appendChild(option);
      });
    
      // Get the 'Name' column data from the parsed CSV for dropdown in HTML
      const names = results.data.map(item => item.Name);
    
      // Fetch the dropdown element for names
      const nameDropdown = document.getElementById("name-dropdown");
    
      // Iteratively add names from Name column to dropdown option
      names.forEach(name => {
        const option = document.createElement("option");
        option.text = name;
        option.value = name;
        nameDropdown.appendChild(option);
      });
    }


    
});

// Get the dropdown element -- is this redundant???
let dropdown = document.getElementById("name-dropdown");

// Add an event listener to the dropdown to get the selected value from the dropdown
dropdown.addEventListener("change", function() {

  let selectedValue = dropdown.value;
  
  // Send a request to the server to return the data row for the selected player
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "cleaned_baseball_data.csv", true);
  
  xhr.onload = function() {
    if (xhr.status === 200) {
      // Parse the CSV data into an array of objects
      let data = xhr.responseText.split('\n').map(function(row) {
        return row.split(',');
      });
      
      // Find the row that matches the selected player
      let playerRow = null;
      let MLB_AVG = data[790];
      for (let i = 0; i < data.length; i++) {
        if (data[i][1] === selectedValue) {
          playerRow = data[i];
          break;
        }
      }
      
      // If we found the player's row, print out their Name in the console to confirm
      if (playerRow) {
        console.log("Player: " + playerRow[1]);
        console.log(playerRow[1] + ' Stats: ' + playerRow[2] + ', ' + playerRow[3] + ', '
            + playerRow[4] + ', ' + playerRow[5] + ', ' + playerRow[6] + ', ' + playerRow[7]);
      } else {
        console.log("Player not found");
      }

    // Player stats-- eventually make recursive and show all stats for full dataset
    player_Name = playerRow[1];
    player_Team = playerRow[3];
    player_GP = playerRow[5];
    player_PA = playerRow[6];
    player_AB = playerRow[7];
    player_Runs = playerRow[8];
    player_Hits = playerRow[9];
    player_Doubles = playerRow[10];
    player_Triples = playerRow[11];
    player_HR = playerRow[12];
    player_RBI = playerRow[13];
    player_SB = playerRow[14];
    player_CS = playerRow[15];
    player_Walks = playerRow[16];
    player_Strikeouts = playerRow[17];
    player_HAB = playerRow[18];

    // MLB_AVG values -- MLB AVG is hard encoded as a "player" in the .csv at index 790
    AVG_GP = MLB_AVG[5];
    AVG_PA = MLB_AVG[6];
    AVG_AB = MLB_AVG[7];
    AVG_Runs = MLB_AVG[8];
    AVG_Hits = MLB_AVG[9];
    AVG_Doubles = MLB_AVG[10];
    AVG_Triples = MLB_AVG[11];
    AVG_HR = MLB_AVG[12];
    AVG_RBI = MLB_AVG[13];
    AVG_SB = MLB_AVG[14];
    AVG_CS = MLB_AVG[15];
    AVG_Walks = MLB_AVG[16];
    AVG_Strikeouts = MLB_AVG[17];
    AVG_HAB = MLB_AVG[18];

    player1Values = [player_GP, player_PA, player_AB, player_Runs, player_Hits, player_Doubles, player_Triples, 
        player_HR, player_RBI, player_SB, player_CS, player_Walks, player_Strikeouts, player_HAB]
    
    player2Values = [AVG_GP, AVG_PA, AVG_AB, AVG_Runs, AVG_Hits, AVG_Doubles, AVG_Triples, 
        AVG_HR, AVG_RBI, AVG_SB, AVG_CS, AVG_Walks, AVG_Strikeouts, AVG_HAB]

    const statsToCompare = ["Games Played", "Plate Appearances", "At Bats",
                            "Runs", "Hits", "Doubles", "Triples", "Home Runs",
                            "Runs Batted In", "Stolen Bases", "Caught Stealing", "Walks",
                            "Strikeouts", "Hits at Bats"];
    
      
                            
    function removePlayerCard() {
      // Select the SVG element containing the bar graph
      const svg = d3.select('#player-stats-list');

      // empty the bar graph SVG
      svg.selectAll('*').remove();
    }

    // Call removeBarGraph to remove any existing bar graph before a new one is generated
    removePlayerCard();

    var this_player_name = document.getElementById('player-name');
    this_player_name.textContent = player_Name

    var this_player_age = document.getElementById('player-age');
    this_player_age.textContent = playerRow[2]

    var this_player_team = document.getElementById('player-team');
    this_player_team.textContent = player_Team

    var myList = document.getElementById("player-stats-list");

    let attr_drop = document.getElementById("attribute-dropdown");
    var attr = attr_drop.value;
    console.log(attr)

    for (var i = 0; i < player1Values.length; i++) {
      if (statsToCompare[i] == attr) {
        var listItem = document.createElement("strong");
        listItem.textContent = statsToCompare[i] + ": " + player1Values[i];
      }
      else {
        var listItem = document.createElement("li");
        listItem.innerText = statsToCompare[i] + ": " + player1Values[i];
      }
      myList.appendChild(listItem);
    }

    console.log(myList);
    
    // read in your CSV file and parse it into an array of objects
// each object should represent a player and their statistics

// sort the data based on the selected category and log the top 5 player names
function sortDataAndLogTopPlayers(category) {
  /// now just have to get index of selected category
  const item = category;
  const index = data[0].indexOf(item);
  console.log(index);
  
  data.sort((a, b) => {
    return b[index] - a[index];
  }); // sort in descending order
  

  const topPlayers = data.slice(1, 6).map(player => player[1]);
  

    for (let i = 0; i < topPlayers.length; i++) {
      const playerDiv = document.getElementById(`player${i+1}`);
      playerDiv.textContent = `${i+1}. ${topPlayers[i]}`;
    }
    spaces = category.replace(/_/g, " ")

    const text = document.getElementById(`dugout_text`);
    text.innerHTML = `Leaders for ${spaces} in the 2022 season`;



    
  
}

// call the function when the user selects a category
const attribute = document.getElementById("attribute-dropdown");
attribute.addEventListener("change", function() {
  const category = this.value;
  sortDataAndLogTopPlayers(category);
});


    // Set up the bar graph
    const margin = { top: 20, right: 20, bottom: 100, left: 100 };
    const width = 1200 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    const x = d3.scaleBand()
        .range([0, width])
        .padding(0.1);

    const y = d3.scaleLinear()
        .range([height, 0]);

    function removeBarGraph() {
      // Select the SVG element containing the bar graph
      const svg = d3.select('#bar-graph');

      // empty the bar graph SVG
      svg.selectAll('*').remove();
    }

    // Call removeBarGraph to remove any existing bar graph before a new one is generated
    removeBarGraph();

    const svg = d3.select("#bar-graph").append("svg")
        .attr("id", 'graph')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Set the domain for the x scale
    x.domain(statsToCompare);

    // Set the domain for the y scale
    const maxValue = 600;
    y.domain([0, maxValue]);

    // Add the x axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add the y axis
    svg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y));

    svg.append('text')
      .attr('class', 'title')
      .attr('x', width / 2)
      .attr('y', margin.top/2)
      .attr('text-anchor', 'middle')
      .text('Comparison of ' + player_Name + ' Performance to MLB Average');
    
    svg.append("text")
      .attr("class", "x label")
      .attr("text-anchor", "end")
      .attr("x", width/2 + 40)
      .attr("y", height + 40)
      .text("Statistical Cateogry");

    svg.append("text")
      .attr("class", "y label")
      .attr("text-anchor", "end")
      .attr("y", 6)
      .attr("dy", ".75em")
      .attr("transform", "rotate(-90)")
      .text("Season Total");
        


            const TOOLTIP = d3.select('body')
                            .append("div")
                                .attr("class", "tooltip")
                                .style("opacity", 0);

         // event handler functions for tooltips
        function handleMouseover(event, d) {
            d3.select(this).style("fill", "blue");
            TOOLTIP.style("opacity", 1); 
        
         }
  

          function handleMousemove(event, d) {
            // position the tooltip and fill in information 
            let player_name = document.getElementById("name-dropdown");
            let selectedText = player_name.options[player_name.selectedIndex].text;
            console.log(d3.select(this).height);
            TOOLTIP.html("Player: " + selectedText)
                    .style("left", (event.pageX + 10) + "px") //add offset from mouse
                    .style("top", (event.pageY - 50) + "px"); 
        }
          
    
        function handleMouseleave(event, d) {
          d3.select(this).style("fill", "steelblue");
          // on mouseleave, make transparant again 
          TOOLTIP.style("opacity", 0); 
      }

      const TOOLTIP2 = d3.select('.bar2')
                            .append("div")
                                .attr("class", "tooltip")
                                .style("opacity", 0);

         // event handler functions for tooltips
        function handleMouseover2(event, d) {
            d3.select(this).style("fill", "darkorange");
            TOOLTIP.style("opacity", 1); 
        
         }
  
        function handleMousemove2(event, d) {
            // position the tooltip and fill in information 
            //leaving empty for now
        }
        function handleMouseleave2(event, d) {
          d3.select(this).style("fill", "lightsalmon");
          // on mouseleave, make transparant again 
          TOOLTIP.style("opacity", 0); 
      }

    // Add the bars for the selected player
    svg.selectAll(".bar1")
        .data(player1Values)
        .enter().append("rect")
        .attr("class", "bar1")
        .attr("x", function(d, i) { return x(statsToCompare[i]); })
        .attr("y", function(d) { return y(d); })
        .attr("width", x.bandwidth() / 2)
        .attr("height", function(d) { return height - y(d); })
        .on("mouseover", handleMouseover) //add event listeners
                .on("mousemove", handleMousemove)
                .on("mouseleave", handleMouseleave);


    // Add the bars for MLB average (player2)
    svg.selectAll(".bar2")
        .data(player2Values)
        .enter().append("rect")
        .attr("class", "bar2")
        .attr("x", function(d, i) { return x(statsToCompare[i]) + x.bandwidth() / 2; })
        .attr("y", function(d) { return y(d); })
        .attr("width", x.bandwidth() / 2)
        .attr("height", function(d) { return height - y(d); })
        .on("mouseover", handleMouseover2) //add event listeners
        .on("mousemove", handleMousemove2)
        .on("mouseleave", handleMouseleave2);

      

    }
  };
  xhr.send();
});