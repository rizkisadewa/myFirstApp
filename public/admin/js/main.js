// ** ADDING SPOT

var mapKey = 'AIzaSyCsOJWKWppHMbSLcJjkCd5kgJKg7YVQY2w';
var gogApiUrl = 'https://maps.googleapis.com/maps/api/geocode/json';

// Geocode Odtw
var checkGeo = document.getElementById('checkGeocode');
if(checkGeo){
  checkGeo.addEventListener('click', geocode);
}

function geocode(e) {
  e.preventDefault();

  var location = document.getElementById('location-input').value;
  axios.get(gogApiUrl, {
        params: {
          address: location,
          key: mapKey
        }
  })
  .then(function(response){
    // log full response API
    console.log(response);

    // Geometry
    var lat = response.data.results[0].geometry.location.lat;
    var lng = response.data.results[0].geometry.location.lng;

    // output to app.
    document.getElementById('latitudeForm').setAttribute("value", lat);
    document.getElementById('longitudeForm').setAttribute("value", lng);

  })
  .catch(function(error){
    console.log(error);
  });
}

// Geocode Province
var checkGeoProv = document.getElementById('checkGeoProv');
if (checkGeoProv) {
  checkGeoProv.addEventListener('click', geocodeProv);
}

function geocodeProv(e) {
  e.preventDefault();

  var location_prov = document.getElementById('location-input-province').value;
  axios.get(gogApiUrl, {
        params: {
          address: location_prov,
          key: mapKey
        }
  })
  .then(function(response){
    // log full response API
    console.log(response);

    // Geometry
    var prov_lat = response.data.results[0].geometry.location.lat;
    var prov_lng = response.data.results[0].geometry.location.lng;

    // output to app.
    document.getElementById('ProvLatitudeForm').setAttribute("value", prov_lat);
    document.getElementById('ProvLongitudeForm').setAttribute("value", prov_lng);

  })
  .catch(function(error){
    console.log(error);
  });
}

// Geocode Area
var checkGeoArea = document.getElementById('checkGeoArea');
if (checkGeoArea) {
  checkGeoArea.addEventListener('click', geocodeArea);
}

function geocodeArea(e) {
  e.preventDefault();

  var location_area = document.getElementById('location-input-area').value;
  axios.get(gogApiUrl, {
        params: {
          address: location_area,
          key: mapKey
        }
  })
  .then(function(response){
    // log full response API
    console.log(response);

    // Geometry
    var area_lat = response.data.results[0].geometry.location.lat;
    var area_lng = response.data.results[0].geometry.location.lng;

    // output to app.
    document.getElementById('AreaLatitudeForm').setAttribute("value", area_lat);
    document.getElementById('AreaLongitudeForm').setAttribute("value", area_lng);

  })
  .catch(function(error){
    console.log(error);
  });
}

// ** OPEN MAP SELECTION
var getMapData = document.getElementById('getMapData');
if (getMapData) {
  getMapData.addEventListener('click', getMap);
}

function getMap(e) {
  e.preventDefault();

  var map_center = document.getElementById('map-destination-data').value;
  // alert(map_center)// debug for get data

  axios.get(gogApiUrl, {
        params: {
          address: map_center,
          key: mapKey
        }
  })
  .then(function(response){
    // log full response API
    console.log(response);

    // Geometry
    var map_lat = response.data.results[0].geometry.location.lat;
    var map_lng = response.data.results[0].geometry.location.lng;

    // output to app.
    // console.log('lat'+map_lat);
    // console.log('lng'+map_lng);
    var mapToCenter = {lat: map_lat, lng: map_lng};
    map.setCenter(mapToCenter);


  })
  .catch(function(error){
    console.log(error);
  });


}

// DECLARATION FOR GA Algorithm
var directionsDisplay = null;
var directionsService;
var polylinePath;
var distance_array = [];
var dest_column = [];

var nodes = [];
var prevNodes = [];
var durations = [];
var markers = [];
var newMarkers = [];
var myLocationPosition;
var table_rute_result = [];

// GOOGLE MAP API
var map;

// Initialize google maps
function initMap() {
  var spots = {lat: -8.5068307, lng: 115.262577};
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 0.7893, lng: 113.9213},
    zoom: 10
  });

  /*
  // Create map click event
  google.maps.event.addListener(map, 'click', function(event) {
      // Add destination (max 9)
      if (nodes.length >= 9) {
          alert('Max destinations added');
          return;
      }

      // If there are directions being shown, clear them
      clearDirections();

      // Add a node to map
      marker = new google.maps.Marker({position: event.latLng, map: map});
      markers.push(marker);

      // Store node's lat and lng
      nodes.push(event.latLng);

      // Update destination count
      $('#destinations-count').html(nodes.length);
  });
  */
}

// ** SHOW MY AREA

// ** Deklarasi
var rute_coor = [];
var rute_obj = [];
var rute_obj_name = [];
var rute_obj_name_result = [];
var pil_obj = document.getElementById('getMapData');
var show_my_location = document.getElementById('show-my-location');


if (show_my_location) {
  show_my_location.addEventListener('click', showMyLocation);
}

function showMyLocation(){

  /**
   * Create google maps Marker instance.
   * @param {Object} map
   * @param {Object} position
   * @return {Object}
   */
  const createMarker = ({ map, position }) => {
    return new google.maps.Marker({ map, position });
  };

  /**
   * Track the user location.
   * @param {Object} onSuccess
   * @param {Object} [onError]
   * @return {number}
   */
  const trackLocation = ({ onSuccess, onError = () => { } }) => {
    if ('geolocation' in navigator === false) {
      return onError(new Error('Geolocation is not supported by your browser.'));
    }

    return navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    });
  };

  /**
   * Get position error message from the given error code.
   * @param {number} code
   * @return {String}
   */
  const getPositionErrorMessage = code => {
    switch (code) {
      case 1:
        return 'Permission denied.';
      case 2:
        return 'Position unavailable.';
      case 3:
        return 'Timeout reached.';
    }
  }


  let initialPosition = { lat: 0.7893, lng: 113.9213 };
  let marker = createMarker({ map, position: initialPosition });
  // const $info = document.getElementById('info');

  let watchId = trackLocation({
    onSuccess: ({ coords: { latitude: lat, longitude: lng } }) => {
      marker.setPosition({ lat, lng });
      map.panTo({ lat, lng });
      myLocationPosition = marker.position; // store in variable for adding spot
    },
    onError: err => {
      console.log(err);
    }
  });

  show_my_location.style.display = "none";
  pil_obj.style.display = "block";
  show_pointer.style.display = "block";

  rute_obj_name.push('Lokasi Saya');
}

// ** SHOW MARKER

var show_pointer = document.getElementById('show-pointer');
if (show_pointer) {
  show_pointer.addEventListener('click', checkPointer);
}

function checkPointer(){

  // get value of table target
  let tbl_target_value = document.getElementById("target-table").rows.length;
  // check Table
  if(tbl_target_value > 1){

    // Multiple Markers from HTML Table id "target-chosen" change into array

    let table = document.getElementById("target-chosen");
    let rows = table.children;
    for (let i = 0; i < rows.length; i++) {
      let fields = rows[i].children;
      let rowArray = [];
      for (let j = 1; j < 4; j++) {
        if (j >= 2 ) {
          rowArray.push(parseFloat(fields[j].innerHTML));
        } else {
          rowArray.push(fields[j].innerHTML)
        }
      }
      markers.push(rowArray);
      console.log(markers);

    }
    // console.log(markers.length);


    // Display multiple markers on a map
    var infoWindow = new google.maps.InfoWindow(), marker, k;
    markerTotal = 0;
    markerTotal = markers.length;

    // Loop through our array of markers & place each one on the map
    for( k = 0; k < markerTotal; k++ ) {
        let position = new google.maps.LatLng(markers[k][1], markers[k][2]);

        marker = new google.maps.Marker({
            position: position,
            map: map,
            title: markers[k][0]
        });


        // Store node's lat and lng
        nodes.push(position);
        rute_obj_name.push(markers[k][0]);

    }
    nodes.push(myLocationPosition);
    // console.log("Objek yg Dipilih : "+rute_obj_name);
    // Update destination count
    $('#destinations-count').html(nodes.length);

    pil_obj.style.display = "none";
    show_pointer.style.display = "none";

    var tombRute = document.getElementById('show-route');
    tombRute.style.display = "block";

  } else {
    alert("Mohon pilih objek wisata terlebih dahulu");
  }

}

// GA Algorithm

// Get all durations depending on travel type
function getDurations(callback) {
    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix({
        origins: nodes,
        destinations: nodes,
        travelMode: google.maps.TravelMode[$('#travel-type').val()],
        avoidHighways: parseInt($('#avoid-highways').val()) > 0 ? true : false,
        avoidTolls: false,
    }, function(distanceData) {
        // Create duration data array
        var nodeDistanceData;
        for (originNodeIndex in distanceData.rows) {
            nodeDistanceData = distanceData.rows[originNodeIndex].elements;
            durations[originNodeIndex] = [];
            for (destinationNodeIndex in nodeDistanceData) {
                if (durations[originNodeIndex][destinationNodeIndex] = nodeDistanceData[destinationNodeIndex].duration == undefined) {
                    alert('Error: couldn\'t get a trip duration from API');
                    return;
                }
                durations[originNodeIndex][destinationNodeIndex] = nodeDistanceData[destinationNodeIndex].duration.value;
            }
        }

        if (callback != undefined) {
            callback();
        }
    });
}

// Removes markers and temporary paths
// function clearMapMarkers() {
//     for (index in markers) {
//         markers[index].setMap(null);
//     }
//
//     prevNodes = nodes;
//     nodes = [];
//
//     if (polylinePath != undefined) {
//         polylinePath.setMap(null);
//     }
//
//     markers = [];
//
//     $('#ga-buttons').show();
// }

// Removes markers and temporary paths using the button "Lihat Rute"
function clearMapMarkersFromButton() {

    prevNodes = nodes;
    nodes = [];

    if (polylinePath != undefined) {
        polylinePath.setMap(null);
    }

    markers = [];

    $('#ga-buttons').show();
}

// Removes map directions
function clearDirections() {
    // If there are directions being shown, clear them
    if (directionsDisplay != null) {
        directionsDisplay.setMap(null);
        directionsDisplay = null;
    }
}
// Completely clears map
function clearMap() {
    clearMapMarkers();
    clearDirections();

    $('#destinations-count').html('0');
}


// Create listeners
$(document).ready(function() {
    $('#clear-map').click(clearMap);

    // Start GA
    $('#show-route').click(function() {

        if (nodes.length < 2) {
            if (prevNodes.length >= 2) {
                nodes = prevNodes;
            } else {
                alert('Mohon pilih objek wisata dahulu minimal 2');
                return;
            }
        }

        if (directionsDisplay != null) {
            directionsDisplay.setMap(null);
            directionsDisplay = null;
        }



        // Get route durations
        getDurations(function(){
            $('.ga-info').show();

            // Get config and create initial GA population
            ga.getConfig(); // get all paramater from HTML
            var pop = new ga.population();
            pop.initialize(nodes.length);

            var route = pop.getFittest().chromosome;

            ga.evolvePopulation(pop, function(update) {
                $('#generations-passed').html(update.generation);
                $('#best-time').html((update.population.getFittest().getDistance() / 60).toFixed(2) + ' Minutes');

                // Get route coordinates
                var route = update.population.getFittest().chromosome;
                var routeCoordinates = [];
                for (index in route) {
                    routeCoordinates[index] = nodes[route[index]];

                }
                routeCoordinates[route.length] = nodes[route[0]];

                // Display temp. route
                if (polylinePath != undefined) {
                    polylinePath.setMap(null);
                }
                polylinePath = new google.maps.Polyline({
                    path: routeCoordinates,
                    strokeColor: "#0066ff",
                    strokeOpacity: 0.75,
                    strokeWeight: 2,
                });
                polylinePath.setMap(map);


            }, function(result) {
                // Get route
                route = result.population.getFittest().chromosome;

                // console.log(route); // result of the route
                //
                // looping for objek name array as per route array
                let counter = 0;
                for (let i = 0; i < route.length; i++) {
                  // console.log("Objek ke-"+i+" : "+rute_obj_name[route[i]]);
                  rute_obj_name_result.push([rute_obj_name[route[i]]]);
                }
                rute_obj_name_result.push(rute_obj_name_result[0]);
                rute_obj_name_result.shift();
                console.log(rute_obj_name_result);

                // Add route to map
                directionsService = new google.maps.DirectionsService();
                directionsDisplay = new google.maps.DirectionsRenderer();
                directionsDisplay.setMap(map);
                var waypts = [];


                for (let b = 0; b < route.length; b++) {
                    waypts.push({
                        location: nodes[route[b]],
                        stopover: true
                    });

                    // console.log("Nodes ke-"+b+" : "+nodes[route[b]]);

                    newMarkers = new google.maps.Marker({
                        position: nodes[route[b]],
                        map: map,
                    });

                    rute_coor.push([newMarkers.getPosition().lat(), newMarkers.getPosition().lng()]);

                }


                // found the location based on longitude
                for(let j=0; j < rute_coor.length; j++){
                  for(let k=0; k < markers.length; k++){
                    if (rute_coor[j][0] == markers[k][1]) {
                      // console.log('Found the same value');
                      rute_coor[j].unshift(markers[k][0]);
                    }
                  }
                }

                // found my location in array then unshift into an array
                for(let l=0; l < rute_coor.length; l++){
                  if (rute_coor[l].length == 2) {
                    // console.log('Found the start value at : '+l);
                    rute_coor[l].unshift("Lokasi Saya");
                  }
                }

                console.log(rute_coor);

                // find an index of "Lokasi Saya"
                var myLocCounter;
                for(let i=0; i < rute_coor.length; i++){
                  if (rute_coor[i].indexOf("Lokasi Saya") == 0) {
                    // console.log("Found Lokasi Saya in : "+i);
                    myLocCounter = i;
                  }
                }

                var rute_part_a = rute_coor.slice(myLocCounter, rute_coor.length);
                var rute_part_b = rute_coor.slice(0, myLocCounter);

                // concat of two arrays rute_part_a & rute_part_b, so that lokasi saya is the first object
                table_rute_result = rute_part_a.concat(rute_part_b);
                console.log(table_rute_result);

                // create the table content from arrays
                var html_table_result = document.getElementById('target-result');
                for(let row=0 ; row < table_rute_result.length; row++){
                  // create a rows
                  let tr = document.createElement('tr');

                  let tbl_counter = 0;

                  // create a columns
                  // Nomor
                  let td = document.createElement('td');
                  td.appendChild(document.createTextNode(row+1));
                  tr.appendChild(td);

                  // Content
                  let td_2 = document.createElement('td');
                  td_2.appendChild(document.createTextNode(table_rute_result[row][0]));
                  tr.appendChild(td_2);

                  html_table_result.appendChild(tr);
                }

                // Destination Column

                var dest_part_a = table_rute_result.slice(1, rute_coor.length);
                var dest_part_b = table_rute_result.slice(0, 1);

                dest_column = dest_part_a.concat(dest_part_b);

                for(let row=0 ; row < table_rute_result.length; row++){
                  let dest_row = document.getElementById("target-result").rows[row+1];
                  let x = dest_row.insertCell(dest_row.length);
                  x.innerHTML = dest_column[row][0];
                }


                // Get the distance each markers

                for(let i=0 ; i < table_rute_result.length; i++){

                  if ( i < table_rute_result.length - 1) {
                    let origin = new google.maps.LatLng(table_rute_result[i][1], table_rute_result[i][2]);
                    let destination = new google.maps.LatLng(table_rute_result[i+1][1], table_rute_result[i+1][2]);

                    calculateDistance(origin, destination);

                  } else {
                    let first_node = new google.maps.LatLng(table_rute_result[0][1], table_rute_result[0][2]);
                    let last_node = new google.maps.LatLng(table_rute_result[table_rute_result.length-1][1], table_rute_result[table_rute_result.length-1][2]);

                    calculateDistance(last_node, first_node);


                  }


                }



                // Add final route to map
                var request = {
                    origin: nodes[route[0]],
                    destination: nodes[route[0]],
                    waypoints: waypts,
                    travelMode: google.maps.TravelMode[$('#travel-type').val()],
                    avoidHighways: parseInt($('#avoid-highways').val()) > 0 ? true : false,
                    avoidTolls: false
                };
                directionsService.route(request, function(response, status) {
                    if (status == google.maps.DirectionsStatus.OK) {
                        directionsDisplay.setDirections(response);
                    }
                    clearMapMarkersFromButton();
                });


            });
        });
    });

});


// Get Distance for table_rute_result
function calculateDistance(origin, destination){
  var service = new google.maps.DistanceMatrixService();

  service.getDistanceMatrix(
  {
    origins: [origin],
    destinations: [destination],
    travelMode: google.maps.TravelMode.DRIVING,
    unitSystem: google.maps.UnitSystem.IMPERIAL,
    avoidHighways: false,
    avoidTolls: false
  }, callback);

  function callback(response, status) {
    if (status != google.maps.DistanceMatrixStatus.OK) {
      console.log(err);

    } else {
      let origin = response.originAddresses[0];
      let destination = response.destinationAddresses[0];
      if (response.rows[0].elements[0].status === "ZERO_RESULTS") {
        alert("Better get on a plane. There are no roads between "+origin+" and "+destination);
      } else {
        let distance = response.rows[0].elements[0].distance;
        let distance_value = distance.value * 0.001;

        distance_array.push(1);

        let dist_row = document.getElementById("target-result").rows[distance_array.length];
        let x = dist_row.insertCell(dist_row.length);
        x.innerHTML = distance_value;

      }
    }

  }


}

// GA code
var ga = {
    // Default config
    "crossoverRate": 0.5, //probabilitias crossover
    "mutationRate": 0.1, //probabilitias mutasi
    "populationSize": 50, //jumlah populasi
    "tournamentSize": 5,
    "elitism": true,
    "maxGenerations": 50,

    "tickerSpeed": 60,

    // Loads config from HTML inputs
    "getConfig": function() {
        ga.crossoverRate = parseFloat($('#crossover-rate').val());
        ga.mutationRate = parseFloat($('#mutation-rate').val());
        ga.populationSize = parseInt($('#population-size').val()) || 50;
        ga.elitism = parseInt($('#elitism').val()) || false;
        ga.maxGenerations = parseInt($('#maxGenerations').val()) || 50;
    },

    // Evolves given population
    "evolvePopulation": function(population, generationCallBack, completeCallBack) {
        // Start evolution
        var generation = 1;
        var evolveInterval = setInterval(function() {
            if (generationCallBack != undefined) {
                generationCallBack({
                    population: population,
                    generation: generation,
                });
            }

            // Evolve population
            population = population.crossover();
            population.mutate();
            generation++;

            // If max generations passed
            if (generation > ga.maxGenerations) {
                // Stop looping
                clearInterval(evolveInterval);

                if (completeCallBack != undefined) {
                    completeCallBack({
                        population: population,
                        generation: generation,
                    });
                }
            }
        }, ga.tickerSpeed);
    },

    // Population class
    "population": function() {
        // Holds individuals of population
        this.individuals = [];

        // Initial population of random individuals with given chromosome length
        this.initialize = function(chromosomeLength) {
            this.individuals = [];

            for (var i = 0; i < ga.populationSize; i++) {
                var newIndividual = new ga.individual(chromosomeLength);
                newIndividual.initialize();
                this.individuals.push(newIndividual);
            }
        };

        // Mutates current population
        this.mutate = function() {
            var fittestIndex = this.getFittestIndex();

            for (index in this.individuals) {
                // Don't mutate if this is the elite individual and elitism is enabled
                if (ga.elitism != true || index != fittestIndex) {
                    this.individuals[index].mutate();
                }
            }
        };

        // Applies crossover to current population and returns population of offspring
        this.crossover = function() {
            // Create offspring population
            var newPopulation = new ga.population();

            // Find fittest individual
            var fittestIndex = this.getFittestIndex();

            for (index in this.individuals) {
                // Add unchanged into next generation if this is the elite individual and elitism is enabled
                if (ga.elitism == true && index == fittestIndex) {
                    // Replicate individual
                    var eliteIndividual = new ga.individual(this.individuals[index].chromosomeLength);
                    eliteIndividual.setChromosome(this.individuals[index].chromosome.slice());
                    newPopulation.addIndividual(eliteIndividual);
                } else {
                    // Select mate
                    var parent = this.tournamentSelection();
                    // Apply crossover
                    this.individuals[index].crossover(parent, newPopulation);
                }
            }

            return newPopulation;
        };

        // Adds an individual to current population
        this.addIndividual = function(individual) {
            this.individuals.push(individual);
        };

        // Selects an individual with tournament selection
        this.tournamentSelection = function() {
            // Randomly order population
            for (var i = 0; i < this.individuals.length; i++) {
                var randomIndex = Math.floor(Math.random() * this.individuals.length);
                var tempIndividual = this.individuals[randomIndex];
                this.individuals[randomIndex] = this.individuals[i];
                this.individuals[i] = tempIndividual;
            }

            // Create tournament population and add individuals
            var tournamentPopulation = new ga.population();
            for (var i = 0; i < ga.tournamentSize; i++) {
                tournamentPopulation.addIndividual(this.individuals[i]);
            }

            return tournamentPopulation.getFittest();
        };

        // Return the fittest individual's population index
        this.getFittestIndex = function() {
            var fittestIndex = 0;

            // Loop over population looking for fittest
            for (var i = 1; i < this.individuals.length; i++) {
                if (this.individuals[i].calcFitness() > this.individuals[fittestIndex].calcFitness()) {
                    fittestIndex = i;
                }
            }

            return fittestIndex;
        };

        // Return fittest individual
        this.getFittest = function() {
            return this.individuals[this.getFittestIndex()];
        };
    },

    // Individual class
    "individual": function(chromosomeLength) {
        this.chromosomeLength = chromosomeLength;
        this.fitness = null;
        this.chromosome = [];

        // Initialize random individual
        this.initialize = function() {
            this.chromosome = [];

            // Generate random chromosome
            for (var i = 0; i < this.chromosomeLength; i++) {
                this.chromosome.push(i);
            }
            for (var i = 0; i < this.chromosomeLength; i++) {
                var randomIndex = Math.floor(Math.random() * this.chromosomeLength);
                var tempNode = this.chromosome[randomIndex];
                this.chromosome[randomIndex] = this.chromosome[i];
                this.chromosome[i] = tempNode;
            }
        };

        // Set individual's chromosome
        this.setChromosome = function(chromosome) {
            this.chromosome = chromosome;
        };

        // Mutate individual
        this.mutate = function() {
            this.fitness = null;

            // Loop over chromosome making random changes
            for (index in this.chromosome) {
                if (ga.mutationRate > Math.random()) {
                    var randomIndex = Math.floor(Math.random() * this.chromosomeLength);
                    var tempNode = this.chromosome[randomIndex];
                    this.chromosome[randomIndex] = this.chromosome[index];
                    this.chromosome[index] = tempNode;
                }
            }
        };

        // Returns individuals route distance
        this.getDistance = function() {
            var totalDistance = 0;

            for (index in this.chromosome) {
                var startNode = this.chromosome[index];
                var endNode = this.chromosome[0];
                if ((parseInt(index) + 1) < this.chromosome.length) {
                    endNode = this.chromosome[(parseInt(index) + 1)];
                }

                totalDistance += durations[startNode][endNode];
            }

            totalDistance += durations[startNode][endNode];

            return totalDistance;
        };

        // Calculates individuals fitness value
        this.calcFitness = function() {
            if (this.fitness != null) {
                return this.fitness;
            }

            var totalDistance = this.getDistance();

            this.fitness = 1 / totalDistance;
            return this.fitness;
        };

        // Applies crossover to current individual and mate, then adds it's offspring to given population
        this.crossover = function(individual, offspringPopulation) {
            var offspringChromosome = [];

            // Add a random amount of this individual's genetic information to offspring
            var startPos = Math.floor(this.chromosome.length * Math.random());
            var endPos = Math.floor(this.chromosome.length * Math.random());

            var i = startPos;
            while (i != endPos) {
                offspringChromosome[i] = individual.chromosome[i];
                i++

                if (i >= this.chromosome.length) {
                    i = 0;
                }
            }

            // Add any remaining genetic information from individual's mate
            for (parentIndex in individual.chromosome) {
                var node = individual.chromosome[parentIndex];

                var nodeFound = false;
                for (offspringIndex in offspringChromosome) {
                    if (offspringChromosome[offspringIndex] == node) {
                        nodeFound = true;
                        break;
                    }
                }

                if (nodeFound == false) {
                    for (var offspringIndex = 0; offspringIndex < individual.chromosome.length; offspringIndex++) {
                        if (offspringChromosome[offspringIndex] == undefined) {
                            offspringChromosome[offspringIndex] = node;
                            break;
                        }
                    }
                }
            }

            // Add chromosome to offspring and add offspring to population
            var offspring = new ga.individual(this.chromosomeLength);
            offspring.setChromosome(offspringChromosome);
            offspringPopulation.addIndividual(offspring);
        };
    },
};
