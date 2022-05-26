//Set the API token to manipulate the map
L.mapbox.accessToken =
  "pk.eyJ1IjoiYWxleGlzMTIwNCIsImEiOiJjbDJ6b2kwbHowb3pjM2Nvd2dhazBjMHMyIn0.q1LjJjZkmQ_qzQqwLP75Vg";

//Create a variable for buses locations of route 1 and it markers
var locations;
var markers = [];
const busStops = [
  [-71.093729, 42.359244],
  [-71.094915, 42.360175],
  [-71.0958, 42.360698],
  [-71.099558, 42.362953],
  [-71.103476, 42.365248],
  [-71.106067, 42.366806],
  [-71.108717, 42.368355],
  [-71.110799, 42.369192],
  [-71.113095, 42.370218],
  [-71.115476, 42.372085],
  [-71.117585, 42.373016],
  [-71.118625, 42.374863],
];

//Create map
var map = new L.mapbox.map("map")
  .setView([42.366554, -71.114081], 14.5)
  .addLayer(L.mapbox.styleLayer("mapbox://styles/mapbox/streets-v11"));

//Funtion to put the Bus Stops Between MIT & Harvard
function putBusStopsBtwnMITHarvard() {
  busStops.forEach((busStop) => {
    //For each Bus stop
    L.marker(new L.LatLng(busStop[1], busStop[0]), {
      //Create a marker at its respective location
      icon: L.mapbox.marker.icon({
        //Style for markers
        "marker-size": "medium",
        "marker-symbol": "bus",
        "marker-color": "#008EF0", //Blue for stops
      }),
    }).addTo(map);
  });
}

//Put the Bus Stops
putBusStopsBtwnMITHarvard();

// Request bus data from MBTA
async function getBusLocations() {
  const url = "https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip";
  const response = await fetch(url);
  const json = await response.json();
  return json.data;
}

async function run() {
  // get bus data
  locations = await getBusLocations();
  console.log(new Date());
  console.log("Data extracted successful");
  console.log(locations); //Uncomment this line if you want view route 1 buses information in console
  if (markers.length !== 0) markers.forEach((marker) => marker.remove()); //If there are markers, remove its to put new updated markers
  await showTotalBuses();
  await updateBusesPositions(); //Update markers positions
  // timer
  setTimeout(run, 15000);
}

async function updateBusesPositions() {
  //put all buses markers on the map
  locations.forEach((location) => {
    markers.push(
      L.marker(
        new L.LatLng(
          location.attributes.latitude,
          location.attributes.longitude
        ),
        {
          icon: L.mapbox.marker.icon({
            "marker-size": "large",
            "marker-symbol": "bus",
            "marker-color": "#E74C3C",
          }),
        }
      ).addTo(map)
    );
  });
}

async function showTotalBuses(){
  var element = document.getElementById('buses-info');
  var noBuses = locations.length;
  var busBtwnLim = 0;
  locations.forEach((location) => {
    if(location.attributes.longitude <= busStops[0][0] && location.attributes.longitude >= busStops[busStops.length-1][0])
      busBtwnLim++;
  });
  element.innerHTML = 'Buses running now: ' + noBuses + '\n<br>Buses between Harvard & MIT: ' + busBtwnLim;
}