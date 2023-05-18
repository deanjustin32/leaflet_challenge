// store end point
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// create base level map
var myMap = L.map("map").setView([37.09, -95.71], 4);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// log a message to check if Leaflet is loaded
console.log("Leaflet version:", L.version);

// query the URL and add to the map
d3.json(url).then(function (data) {
  // log the data to check if it's loaded successfully
  console.log("Data:", data);

  function mapStyle(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: mapColor(feature.geometry.coordinates[2]),
      color: "black",
      radius: mapRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  function mapColor(depth) {
    switch (true) {
      case depth > 90:
        return "#e71414";
      case depth > 70:
        return "#cd330d";
      case depth > 50:
        return "#d48201";
      case depth > 30:
        return "#e2a825";
      case depth > 10:
        return "#96db3d";
      default:
        return "#49d719";
    }
  }

  function mapRadius(mag) {
    if (mag === 0) {
      return 1;
    }
    return mag * 4;
  }

  L.geoJson(data, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: mapStyle,
    onEachFeature: function (feature, layer) {
      layer.bindPopup(
        "Magnitude: " +
        feature.properties.mag +
        "<br>Location: " +
        feature.properties.place +
        "<br>Depth: " +
        feature.geometry.coordinates[2]
      );
    }
  }).addTo(myMap);
// Add the legend control
var legend = L.control({ position: "bottomright" });

legend.onAdd = function () {
  var div = L.DomUtil.create("div", "info legend");
  var depth = [-10, 10, 30, 50, 70, 90];
  var labels = [];

  for (var i = 0; i < depth.length; i++) {
    div.innerHTML +=
      '<i style="background:' +
      mapColor(depth[i] + 1) +
      '"></i> ' +
      depth[i] +
      (depth[i + 1] ? "&ndash;" + depth[i + 1] + "<br>" : "+");
  }

  div.innerHTML += "<div>" + labels.join("") + "</div>";
  return div;
};

legend.addTo(myMap);




}).catch(function (error) {
  // log any error that occurs during data loading
  console.log("Error:", error);
});


console.log ("Is This Working?")