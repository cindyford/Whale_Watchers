// var url = "http://hotline.whalemuseum.org/api.json?species=orca&near=48.5159,-123.1524&radius=100&limit=1000";
// var data = d3.json(url);
var tableData = data;

console.log(data);

var table = d3.select("table");
var tbody = d3.select("tbody");

//function to append to the table
function sightings(sighting) {
    var row = tbody.append("tr");
    Object.entries(sighting).forEach(([key, value]) => {
    var cell = row.append("td");
    cell.text(value);
    });
};

//Renders full table
tableData.forEach(sightings);