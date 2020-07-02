var coords = [48.458408996005204,-123.04121052819823];
var url = "http://hotline.whalemuseum.org/api.json?species=orca&near=48.5159,-123.1524&radius=0.5&limit=1000"

var myMap = L.map("map", {
    center: coords, 
    zoom: 5

});

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

// d3.json(url, function(response){
//     console.log(response);
//     L.geoJson(response, {
//         pointToLayer: function(feature, latlng) {
//             return L.circlemarker(latlng);
//         }

//     })



// });