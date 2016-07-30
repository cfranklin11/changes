'use strict';

var mymap = L.map('map').setView([-26.5, 134.5], 4);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    maxZoom: 5,
    id: 'cfranklin11.102903n3',
    accessToken: 'pk.eyJ1IjoiY2ZyYW5rbGluMTEiLCJhIjoiY2lyOGt6MGhsMDB5ZGcybmthNjJ6NmpqNyJ9.UNYHuHZxEd6QcIxJfD8ygg'
}).addTo(mymap);

(function($) {
  $.get('/api/data', function() {
    console.log('calling...');
  })
  .done(function(data) {
    console.log(data);
    var tempData = data.temperature;
    var heat = L.heatLayer(tempData, {
      gradient: {0.2: 'blue', 0.4: 'green', 0.6: 'yellow', 0.8: 'orange', 1: 'red'},
      radius: 25
    }).addTo(mymap);
  })
  .fail(function(err) {
    console.log(err);
  });
})(jQuery);

var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(mymap);
}

mymap.on('click', onMapClick);