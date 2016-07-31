'use strict';

(function() {
  // Create map
  var mymap = L.map('map').setView([-26.5, 134.5], 4);
  var myInterval;
  var intervalCount = 1;
  var heat, mapData;

  // Add tile layer to map
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      maxZoom: 6,
      id: 'cfranklin11.102903n3',
      accessToken: 'pk.eyJ1IjoiY2ZyYW5rbGluMTEiLCJhIjoiY2lyOGt6MGhsMDB5ZGcybmthNjJ6NmpqNyJ9.UNYHuHZxEd6QcIxJfD8ygg'
  }).addTo(mymap);

  // Fetch data on load and add heatmap layer (for first year) with data received
  (function($) {
    $.get('/api/data', function() {
    })
    .done(function(data) {
      console.log(data);
      mapData = data;

      heat = L.heatLayer(mapData.temperature[mapData.temperature.years[0]], {
        gradient: {0.2: 'blue', 0.4: 'green', 0.6: 'yellow', 0.8: 'orange', 1: 'red'},
        radius: 25,
        maxZoom: 9
      }).addTo(mymap);
    })
    .fail(function(err) {
      console.log(err);
    });
  })(jQuery);

  // On start button click, cycle through available data by year
  function animateMap(e) {
    var thisYear, newData;
    var INTERVAL_LENGTH = 1000;
    var thisData = mapData.temperature;
    var years = thisData.years;
    var yearsLength = years.length;

    myInterval = setInterval(
        function() {
          changeHeat();
      }, INTERVAL_LENGTH);

    function changeHeat() {
      intervalCount = intervalCount < yearsLength ? intervalCount : 0;

      thisYear = years[intervalCount];
      newData = thisData[thisYear];
      heat.setLatLngs(newData);
      intervalCount++;
    }
  }

  // On stop button click, pause data cycling
  function stopInterval(e) {
    clearInterval(myInterval);
  }

  // Geocoding city input event handler
  $("#coord").click(function(){
    var city = document.getElementById('city').value;
    var geocoder =  new google.maps.Geocoder();

    geocoder.geocode( { 'address': city + ', au'}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        var lat = results[0].geometry.location.lat();
        var long = results[0].geometry.location.lng();
        mymap.setView([lat, long], 5);

      } else {
        alert("Something got wrong " + status);
      }
    });
  });

  // Event listeners
  $('#start').click(animateMap);
  $('#stop').click(stopInterval);
})();