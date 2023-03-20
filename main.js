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