
// code to animate the title section
anime.timeline({loop: true})
  .add({
    targets: '.ml5 .line',
    opacity: [0.5,1],
    scaleX: [0, 1],
    easing: "easeInOutExpo",
    duration: 900
  }).add({
    targets: '.ml5 .line',
    duration: 800,
    easing: "easeOutExpo",
    translateY: (el, i) => (-0.625 + 0.625*2*i) + "em"
  }).add({
    targets: '.ml5 .ampersand',
    opacity: [0,1],
    scaleY: [0.5, 1],
    easing: "easeOutExpo",
    duration: 800,
    offset: '-=600'
  }).add({
    targets: '.ml5 .letters-left',
    opacity: [0,1],
    translateX: ["0.5em", 0],
    easing: "easeOutExpo",
    duration: 800,
    offset: '-=300'
  }).add({
    targets: '.ml5 .letters-right',
    opacity: [0,1],
    translateX: ["-0.5em", 0],
    easing: "easeOutExpo",
    duration: 800,
    offset: '-=600'
  }).add({
    targets: '.ml5',
    opacity: 0,
    duration: 1200,
    easing: "easeOutExpo",
    delay: 1600
  });


var coords = [48.7,-123.04121052819823];
//var url = "http://hotline.whalemuseum.org/api.json?species=orca&near=48.5159,-123.1524&radius=100&limit=1000"
//var base_url = "http://hotline.whalemuseum.org/api.json?&limit=1000"
var base_url = "http://127.0.0.1:5000/api/v1.0/json"
var lst_day = 31
var st_date = "2017-09-01"
var en_date = "2017-09-30"
var species = "orca"
var orca_type = "northern resident"
var orca_pod = "l"
var url_built = base_url + "&since=" + st_date + "&until=" + en_date //+ "&species=" + species + "&orca_pod=" + orca_type + "&orca_pod" + orca_pod
var mkGrp = []   //marker group
var myMap = null

//variables for avg lat and lon
var lat = []  
var lon = []  
var lat_avg = 0.0
var lat_sum = 0
var lon_avg = 0.0
var lon_sum = 0.0


var Sp_List = ["orca", "minke whale", "gray whale", "humpback", "atlantic white-sided dolphin", "pacific white-sided dolphin", 
  "dall's porpoise", "harbor porpoise", "harbor seal", "northern elephant seal", 
  "steller sea lion", "sea otter"]
////deleted "southern elephant seal", "california sea Lion", "other", , "unknown"
var Or_Type = ["southern resident","northern resident","transient", "offshore"]

var Or_Pod = ["j","k" , "l"]

var Mo = ["All","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

var Year = ["2004","2005","2006","2007","2008","2009","2010","2011","2012","2013","2014","2015","2016","2017"]

//function to add elements to drop down
function dd(cat,arr) {
  var c = d3.select(cat)
  arr.forEach((x) => {
  c.append("option").text(x)
  });
}

dd("#type",Or_Type);
dd("#species", Sp_List);
dd("#year",Year);
dd("#month", Mo);
dd("#pod",Or_Pod);


//function to get month digits from text
function get_Mo(month) {
  switch (true) {
    case month == "All":
      lst_day = "28"
      return "0"
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
    case z == "humpback":
        return "rgb(255,0,0)" ///red is humpback
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
var final_url
function buildURL() {
  
  var fm_mon_text = d3.select("#month").property("value");
  var mon = get_Mo(fm_mon_text);
  var fm_year = d3.select("#year").property("value");
  if (fm_year == "All") {fm_year = "0"};
  var fm_spec = d3.select("#species").property("value");
  if (fm_spec == "All") {fm_spec = "0"};
  var fm_type = d3.select("#type").property("value");
  if (fm_type == "All") {fm_type = "0"};
  var fm_pod = d3.select("#pod").property("value");
  if (fm_pod == "All") {fm_pod = "0"};
  //val = [[],[],[],[],[],[],[],[]]
  //return base_url + "&since=" + fm_year +"-" + mon + "-01" + "&until=" + fm_year + "-" + mon + "-" + lst_day + "&species=" + fm_spec + "&orca_type=" + fm_type + "&orca_pod=" + fm_pod;
  final_url = base_url + "/" + fm_year + "/" + mon + "/" + fm_spec + "/" + fm_type + "/" + fm_pod
  console.log(final_url)
  map()
  return base_url + "/" + fm_year + "/" + mon + "/" + fm_spec + "/" + fm_type + "/" + fm_pod;

};

// var myMap = L.map("map", {
//     center: coords, 
//     zoom: 9.3
// });

// L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//   attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//   maxZoom: 18,
//   id: "mapbox/streets-v11",
//   accessToken: API_KEY
// }).addTo(myMap);

var hd = ["species",	"description",	"latitude",	"longitude",	"location",	"sighted_at",	"orca_type"	,"orca_pod"];
var val = [[],[],[],[],[],[],[],[]]
var table = d3.select("table");
var tbody = d3.select("tbody");
var n = 1

var url_test = "http://127.0.0.1:5000/api/v1.0/json"


function map() {
  //reset values map routine
  val = [[],[],[],[],[],[],[],[]];
  lat_sum = 0
  lon_sum = 0
  lat = []
  lon = []
  var n=1;
  mkGrp = []   ///reset marker group
      d3.json(final_url, function(response){
        console.log(response);
    //     L.geoJson(response, {
    //         pointToLayer: function(feature, latlng) {
    //             return L.circlemarker(latlng);
    //         }

    //     })
      var markers = []
      response.forEach(x => {
        lat.push(parseFloat(x.latitude));
        lat_sum += x.latitude;
        lon_sum += x.longitude;
        lon.push(parseFloat(x.longitude));
        ///start marker group for circles
        mkGrp.push(L.circle([x.latitude,x.longitude], {
              stroke: true,
              fillOpacity: 0.8,
              color:"black",
              weight: .5,
              fillColor: priCol(x.species),
              radius: 1000

            }).bindPopup("Species = " + x.species + "<br>" +
                        "Date = " + x.date + "<br>" +
                        "Time = " + x.time + "<br>" +
                        "Pod = " + x.orca_pod + "</br>")///end of L Circle
        ); ////end of marker group
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
      
      ///calculate average lat and lon for calcuations
      lat_avg = lat_sum/lat.length
      lon_avg = lon_sum/lon.length
      ///set coords to center the map      
      coords = [lat_avg,lon_avg]
      ///considerting using latitude range to scale map, but not proven
      var lat_range = Math.max(...lat) - Math.min(...lat)

      ///create layer group
      var sigMon = L.layerGroup(mkGrp)

      //remove map layer if present
      try {
        myMap.off();
        myMap.remove();


      } catch (error) {console.log("First Map Load")}  ///Printer for first map load

      ///create base layer
      var base = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
      });      


      myMap = L.map("map", {
          center: coords, 
          zoom: 9.3,
          layers: [base, sigMon]
      });
      
      console.log(val);

      var tablelength = val[0].length;
      if (tablelength >1000) {
        tablelength = 1000
        };
      
      console.log(tablelength);
    //select table body and clear the table
    d3.select("tbody").html("");

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
      leg = ["orca","humpback","minke whale","gray whale","dall's porpoise","other"];

      for (var i = 0; i < leg.length; i++) {
        div.innerHTML += '<i style="background:' + priCol(leg[i]) + '"></i> ' + leg[i] + '<br>';
          }
          return div;
          };
      legend.addTo(myMap);

  });/// d3.json closing bracket

};

buildURL()

///Whale function curtesy of https://codepen.io/diegoleme/pen/rIokB?editors=0010

