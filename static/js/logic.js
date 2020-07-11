var coords = [48.7,-123.04121052819823];
//var url = "http://hotline.whalemuseum.org/api.json?species=orca&near=48.5159,-123.1524&radius=100&limit=1000"
var base_url = "http://hotline.whalemuseum.org/api.json?&limit=1000"
var lst_day = 31
var st_date = "2017-09-01"
var en_date = "2017-09-30"
var species = "orca"
var orca_type = "northern resident"
var orca_pod = "l"
var url_built = base_url + "&since=" + st_date + "&until=" + en_date //+ "&species=" + species + "&orca_pod=" + orca_type + "&orca_pod" + orca_pod

var Sp_List = ["orca", "minke", "gray whale", "humpback", "atlantic white-sided dolphin", "pacific white-sided dolphin", 
  "dalls porpoise", "harbor porpoise", "harbor seal", "northern elephant seal", 
  "southern elephant seal", "california sea Lion", "steller sea lion", "sea otter", "other", "unknown"]

var Or_Type = ["southern resident","northern resident","transient", "offshore"]

var Or_Pod = ["j","k" , "l"]

var Mo = ["Jan","Feb","Jan","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

var Year = ["2004","2005","2006","2007","2008","2009","2010","2011","2012","2013","2014","2015","2016","2017"]

//function to add elements to drop down
function dd(cat,arr) {
  var c = d3.select(cat)
  arr.forEach((x) => {
  c.append("option").text(x)
  });
}

dd("#Type",Or_Type);
dd("#Species", Sp_List);
dd("#Year",Year);
dd("#Month", Mo);
dd("#Pod",Or_Pod);


//function to get month digits from text
function get_Mo(month) {
  switch (true) {
    case month == "Jan":
      lst_day = "31"
      return "01"
    case month == "Feb":
      lst_day = "28"
      return "02"
    case month == "Mar":
      lst_day = "31"
      return "03"
    case month == "Apr":
      lst_day = "30"
      return "04"
    case month == "May":
      lst_day = "31"
      return "05"
    case month == "Jun":
      lst_day = "30" 
      return "06"
    case month == "Jul":
      lst_day = "31"
      return "07"
    case month == "Aug":
      lst_day = "30"
      return "08"
    case month == "Sep":
      lst_day = "30"
      return "09"
    case month == "Oct":
      lst_day = "31"
      return "10"
    case month == "Nov":
      lst_day = "30"
      return "11"
    default:
      lst_day = "31"
      return "12"  
  };
}

function priCol(z) {
  switch (true) {
    case z == "orca":
        return "rgb(84,150,53)" ///green is orca
    case z == "humpback whale":
        return "rgb(255,0,0)" ///red is humpback
    case z == "minke whale":
        return "rgb(204,51,153)"  ///violot or something is minke  
    case z == "gray whale":
        return "rgb(132,151,176)" ///gray whale is blue
    case z == "dall's porpoise":
        return "rgb(255,255,0)" ///dall's is yellow
    default:
        return "rgb(255,153,153)" //pink is all others
  };////end of switch for mag 
}

function buildURL() {
  
  var fm_mon_text = "Aug" //d3.select("#month").property("value");
  var mon = get_Mo(fm_mon_text);
  var fm_year = "2010"   //d3.select("#year").property("value");
  if (fm_year == "All") {fm_year = ""};
  var fm_spec = "All" //d3.select("#species").property("value");
  if (fm_spec == "All") {fm_spec = ""};
  var fm_type = "southern resident"  //d3.select("#type").property("value");
  if (fm_type == "All") {fm_type = ""};
  var fm_pod = "j"   //d3.select("#pod").property("value");
  if (fm_pod == "All") {fm_pod = ""};
  return base_url + "&since=" + fm_year +"-" + mon + "-01" + "&until=" + fm_year + "-" + mon + "-" + lst_day + "&species=" + fm_spec + "&orca_type=" + fm_type + "&orca_pod=" + fm_pod;

};

var myMap = L.map("map", {
    center: coords, 
    zoom: 9.3
});

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

var hd = ["species",	"description",	"latitude",	"longitude",	"location",	"sighted_at",	"orca_type"	,"orca_pod"];
var val = [[],[],[],[],[],[],[],[]]
var table = d3.select("table");
var tbody = d3.select("tbody");
var n = 1

var url_test = "http://127.0.0.1:5000/api/v1.0/json"

d3.json(url_test, function(response){
     console.log(response);
//     L.geoJson(response, {
//         pointToLayer: function(feature, latlng) {
//             return L.circlemarker(latlng);
//         }

//     })
    var markers = []
    response.forEach(x => {
      L.circle([x.latitude,x.longitude], {
            stroke: true,
            fillOpacity: 0.8,
            color:"black",
            weight: .5,
            fillColor: priCol(x.species),
            radius: 1000

          }).bindPopup("Species = " + x.species + "<br>" +
                      "Date = " + x.date + "<br>" +
                      "Time = " + x.time + "<br>" +
                      "Pod = " + x.orca_pod + "</br>").addTo(myMap)///end of L Circle

           //loading values into array                                                                             
           Object.entries(x).forEach(([key, value]) => {
             for (let y = 0; y < hd.length; y++) {
                 if (key === hd[y]) {
                     val[y][n-1] = value;
                    };
             };
         });
         
         n += 1
    })///end of data for Each



    console.log(val);

    var tablelength = val[0].length;
    if (tablelength >1000) {
      tablelength = 1000
      };
    
    console.log(tablelength);
      

    for (let z = 0; z < tablelength; z++) {
      var tr = tbody.append("tr");
      for (let a = 0; a < val.length; a++) {
          tr.append("td").text(val[a][z]);
      };
  };
    ///Legend setup  (legend help from https://www.igismap.com/legend-in-leafletjs-map-with-topojson/)
    var legend = L.control({position: 'topleft'});
    legend.onAdd = function (myMap) { 
    var div = L.DomUtil.create('div', 'info legend'),
    leg = ["orca","humpback whale","minke whale","gray whale","dall's porpoise","other"];

    for (var i = 0; i < leg.length; i++) {
      div.innerHTML += '<i style="background:' + priCol(leg[i]) + '"></i> ' + leg[i] + '<br>';
        }
        return div;
        };
    legend.addTo(myMap);

});/// d3.json closing bracket



///Whale function curtesy of https://codepen.io/diegoleme/pen/rIokB?editors=0010

