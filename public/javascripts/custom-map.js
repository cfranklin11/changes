'use strict';

(function() {
  // Create map
  var mymap = L.map('leaflet-map').setView([-26.5, 134.5], 4);
  var myInterval;
  var intervalCount = 1;
  var heat, mapData;

  // Add tile layer to map
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      maxZoom: 11,
      id: 'cfranklin11.102903n3',
      accessToken: 'pk.eyJ1IjoiY2ZyYW5rbGluMTEiLCJhIjoiY2lyOGt6MGhsMDB5ZGcybmthNjJ6NmpqNyJ9.UNYHuHZxEd6QcIxJfD8ygg'
  }).addTo(mymap);

  // Fetch data on load and add heatmap layer (for first year) with data received
  (function($) {
    $.get('/api/data', function() {
    })
    .done(function(data) {
      mapData = data;

      var categories = mapData.categories;
      var category = categories[0];
      var dataYear = mapData[category].years[0];
      var optionHtml, thisCategory, i;

      for (i = 0; i < categories.length; i++) {
        thisCategory = categories[i];
        optionHtml = '<option value="' + thisCategory + '">' + thisCategory + '</option>';
        $('#category-select').append(optionHtml);
      }

      heat = L.heatLayer(mapData[category][dataYear], {
        gradient: {0.2: 'blue', 0.4: 'green', 0.6: 'yellow', 0.8: 'orange', 1: 'red'},
        radius: 25,
        maxZoom: 22
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
    var categorySelect = document.getElementById('category-select');
    var category = categorySelect.options[categorySelect.selectedIndex].value;
    var thisData = mapData[category];
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

      var yearLabel = document.getElementById('year-label').innerHTML;
      var newYearLabel = yearLabel.replace(/in \d*/, 'in ' + thisYear);
      document.getElementById('year-label').innerHTML = newYearLabel;

      heat.setLatLngs(newData);
      intervalCount++;
    }
  }

  // On stop button click, pause data cycling
  function stopInterval(e) {
    clearInterval(myInterval);
  }

  function setToProper(txt) {
    var proper = txt.replace(/\w\S*/g,
      function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
    return proper;
  }

  // Geocoding city input event handler
  $("#city-btn").click(function(e){
    e.preventDefault();

    var city = document.getElementById('location').value;
    var categorySelect = document.getElementById('category-select');
    var category = categorySelect.options[categorySelect.selectedIndex].value;
    var currentYear = mapData[category].years[0];

    var geocoder =  new google.maps.Geocoder();
    var cityName = setToProper(city);
    var categoryName = setToProper(category);

    document.getElementById('location-span').innerHTML = cityName;
    document.getElementById('year-label').innerHTML = categoryName + ' around ' + cityName + ' in ' + currentYear;

    geocoder.geocode({'address': city + ', au'}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        var lat = results[0].geometry.location.lat();
        var long = results[0].geometry.location.lng();
        mymap.setView([lat, long], 9);

      } else {
        alert("Something went wrong " + status);
      }

      location.href = '/#map';
    });
  });

  // Event listeners
  $('#start').click(animateMap);
  $('#stop').click(stopInterval);
})();