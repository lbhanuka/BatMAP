angular.module('starter')

//app controller this is the main controller
.controller('AppCtrl', function($scope, $state, $ionicPopup, AuthService, AUTH_EVENTS) {
  $scope.username = AuthService.username();

  $scope.$on(AUTH_EVENTS.notAuthorized, function(event) {
    var alertPopup = $ionicPopup.alert({
      title: 'Unauthorized!',
      template: 'You are not allowed to access this resource.'
    });
  });

  $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
    AuthService.logout();
    $state.go('login');
    var alertPopup = $ionicPopup.alert({
      title: 'Session Lost!',
      template: 'Sorry, You have to login again.'
    });
  });

  $scope.setCurrentUsername = function(name) {
    $scope.username = name;
  };
})

//login controller (combines with login view).
.controller('LoginCtrl', function($scope, $state, $ionicPopup, AuthService) {
  $scope.data = {};

  $scope.login = function(data) {
    AuthService.login(data.username, data.password).then(function(authenticated) {
      $state.go('main.dash', {}, {reload: true});
      $scope.setCurrentUsername(data.username);
    }, function(err) {
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: 'Please check your credentials!'
      });
    });
  };
})

//Dash controller - combines with dash view.
.controller('DashCtrl', function($scope, $state, $http, $ionicPopup, AuthService) {
  $scope.logout = function() {
    AuthService.logout();
    $state.go('login');
  };

  $scope.performValidRequest = function() {
    $http.get('http://localhost:8100/valid').then(
      function(result) {
        $scope.response = result;
      });
  };

  $scope.performUnauthorizedRequest = function() {
    $http.get('http://localhost:8100/notauthorized').then(
      function(result) {
        // No result here..
      }, function(err) {
        $scope.response = err;
      });
  };

  $scope.performInvalidRequest = function() {
    $http.get('http://localhost:8100/notauthenticated').then(
      function(result) {
        // No result here..
      }, function(err) {
        $scope.response = err;
      });
  };
})

//Sightings controller. combines with Sightings view. this also calls the "report Sighting" model in Sighting view.
.controller('SightCtrl', function($scope, $ionicModal, $state, mapService) {

  $scope.allSightings = mapService.getAllSightings();
  $scope.allAddresses = [];
$scope.getAddress = function(point) {
  var geocoder = new google.maps.Geocoder;
  var latlng = {lat: parseFloat(point.lat), lng: parseFloat(point.lng)};
  geocoder.geocode({'location': latlng}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      if (results[1]) {
        $scope.allAddresses.push(results[1].formatted_address);
      } else {
        window.alert('No results found');
      }
    } else {
      window.alert('Geocoder failed due to: ' + status);
    }
  });
};

  for (var i = 0; i < $scope.allSightings.length; i++){
    $scope.getAddress($scope.allSightings[i]);
    //alert($scope.allAddresses[i]);
  }

   $ionicModal.fromTemplateUrl('templates/ReportSightingModel.html', {
      scope: $scope,
      animation: 'slide-in-right',
   }).then(function(modal) {
      $scope.modal = modal;
   });

   $scope.openModal = function() {
      $scope.modal.show();
   };

   $scope.closeModal = function() {
      $scope.modal.hide();
   };

   //Cleanup the modal when we're done with it!
   $scope.$on('$destroy', function() {
      $scope.modal.remove();
   });

   // Execute action on hide modal
   $scope.$on('modal.hidden', function() {
      // Execute action
   });

   // Execute action on remove modal
   $scope.$on('modal.removed', function() {
      // Execute action
   });

   })

.controller('ReportCtrl', function($scope, $ionicPopover, $cordovaGeolocation, $state, $ionicModal, $ionicPopup, mapService) {
   $scope.sighting = { 'date':'', 'time':'', 'count':'', 'where':'', 'species':'', 'lat':'', 'lng':''};
   //$scope.time='';

   $scope.dateFieldCheck = function() {
     if (angular.isDate(sighting.date)) {
       document.getElementById('report.date').innerHTML = ' <img src="img/ok-512.png" alt="OK" style="width:40px;height:40px;">';
     }
   }

   $ionicPopover.fromTemplateUrl('popover.html', {
      scope: $scope
   }).then(function(popover) {
      $scope.popover = popover;
   });

   $scope.openPopover1 = function($event) {
      $scope.popover.show($event);
   };

   $scope.closePopover1 = function() {
      $scope.popover.hide();
      document.getElementById('report.time').innerHTML = ' <img src="img/ok-512.png" alt="OK" style="width:40px;height:40px;">';
   };

   //Cleanup the popover when we're done with it!
   $scope.$on('$destroy', function() {
      $scope.popover.remove();
   });

   // Execute action on hide popover
   $scope.$on('popover.hidden', function() {
      // Execute action
   });

   // Execute action on remove popover
   $scope.$on('popover.removed', function() {
      // Execute action
   });

   //popover 2
   $ionicPopover.fromTemplateUrl('popover2.html', {
      scope: $scope
   }).then(function(popover2) {
      $scope.popover2 = popover2;
   });

   $scope.openPopover2 = function($event) {
      $scope.popover2.show($event);
   };

   $scope.closePopover2 = function() {
      $scope.popover2.hide();
      document.getElementById('report.count').innerHTML = ' <img src="img/ok-512.png" alt="OK" style="width:40px;height:40px;">';
   };

   //Cleanup the popover when we're done with it!
   $scope.$on('$destroy', function() {
      $scope.popover2.remove();
   });

   // Execute action on hide popover
   $scope.$on('popover2.hidden', function() {
      // Execute action
   });

   // Execute action on remove popover
   $scope.$on('popover2.removed', function() {
      // Execute action
   });

   //popover 3
   $ionicPopover.fromTemplateUrl('popover3.html', {
      scope: $scope
   }).then(function(popover3) {
      $scope.popover3 = popover3;
   });

   $scope.openPopover3 = function($event) {
      $scope.popover3.show($event);
   };

   $scope.closePopover3 = function() {
      $scope.popover3.hide();
      document.getElementById('report.where').innerHTML = ' <img src="img/ok-512.png" alt="OK" style="width:40px;height:40px;">';
   };

   //Cleanup the popover when we're done with it!
   $scope.$on('$destroy', function() {
      $scope.popover3.remove();
   });

   // Execute action on hide popover
   $scope.$on('popover3.hidden', function() {
      // Execute action
   });

   // Execute action on remove popover
   $scope.$on('popover3.removed', function() {
      // Execute action
   });

   //popover 4
   $ionicPopover.fromTemplateUrl('popover4.html', {
      scope: $scope
   }).then(function(popover4) {
      $scope.popover4 = popover4;
   });

   $scope.openPopover4 = function($event) {
      $scope.popover4.show($event);
   };

   $scope.closePopover4 = function() {
      $scope.popover4.hide();
      document.getElementById('report.species').innerHTML = ' <img src="img/ok-512.png" alt="OK" style="width:40px;height:40px;">';
   };

   //Cleanup the popover when we're done with it!
   $scope.$on('$destroy', function() {
      $scope.popover4.remove();
   });

   // Execute action on hide popover
   $scope.$on('popover4.hidden', function() {
      // Execute action
   });

   // Execute action on remove popover
   $scope.$on('popover4.removed', function() {
      // Execute action
   });

   //Google Maps for locate in the map in sighting report form.
   $scope.showMap = function() {
       var mapOptions = {
         center: new google.maps.LatLng(7.642650, 80.674438),
         zoom: 8,
         overviewMapControl:true,
         scaleControl:true,
         mapTypeId: google.maps.MapTypeId.ROADMAP
       };

       $scope.map = new google.maps.Map(document.getElementById("map1"), mapOptions);

       google.maps.event.addListener($scope.map, 'click', function(event) {
         var zoomLevel= $scope.map.getZoom();
         if (zoomLevel >= 13) {
           if (typeof $scope.marker != 'undefined') {
             $scope.marker.setMap(null);
           }
           $scope.marker = new google.maps.Marker({
             position: event.latLng,
             map: $scope.map,
             draggable: true,
             animation: google.maps.Animation.DROP,
           });
           //alert($scope.marker.position.coords.longitude);
         } else {
           var zoomAlertPopup = $ionicPopup.alert({
             title: 'Zoom-in more!',
             template: 'Location is not accurate enough. Please zoom-in and tap again.'
           });
         }
       });
     };
   $scope.setLocation = function() {
     if (typeof $scope.marker != 'undefined') {
       $scope.sighting.lat= $scope.marker.getPosition().lat();
       $scope.sighting.lng= $scope.marker.getPosition().lng();
       $scope.closeModal2();
       document.getElementById('report.location').innerHTML = ' <img src="img/ok-512.png" alt="OK" style="width:40px;height:40px;">';
     }else {
       var zoomAlertPopup = $ionicPopup.alert({
         title: 'Location not set!',
         template: 'Please tap on the map to set the location.'
       });
     }
   };
   $scope.getGPSLocation = function() {
     document.getElementById('report.location').innerHTML = ' <img src="img/loading.gif" alt="OK" style="width:40px;height:40px;">';
     var options = {timeout: 10000, enableHighAccuracy: true};
     $cordovaGeolocation.getCurrentPosition(options).then(function(position){
       //var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
       //alert(position.coords.longitude );
       $scope.sighting.lat= position.coords.latitude;
       $scope.sighting.lng= position.coords.longitude;
       document.getElementById('report.location').innerHTML = ' <img src="img/ok-512.png" alt="OK" style="width:40px;height:40px;">';
     }, function(error){
       alert("Could not get location");
       console.log("Could not get location");
     });
   };

   //model window for locate Sightings in the map.
   $ionicModal.fromTemplateUrl('templates/locateInMap.html', {
      scope: $scope,
      animation: 'slide-in-right',
   }).then(function(modal2) {
      $scope.modal2 = modal2;
   });

   $scope.openModal2 = function() {
      $scope.modal2.show();
      $scope.showMap();
      setTimeout(function() {
        var zoomAlertPopup = $ionicPopup.alert({
          title: 'Tip!',
          template: 'Zoom-in and tap on the map to set the location.'
        });
      }, 1000);
   };

   $scope.closeModal2 = function() {
      $scope.modal2.hide();

   };

   //Cleanup the modal when we're done with it!
   $scope.$on('$destroy', function() {
      $scope.modal2.remove();
   });

   // Execute action on hide modal
   $scope.$on('modal2.hidden', function() {
      // Execute action
   });

   // Execute action on remove modal
   $scope.$on('modal2.removed', function() {
      // Execute action
   });

   $scope.submitPressed = function() {
     mapService.submitSighting($scope.sighting);
     $scope.closeModal();
   };
})

.controller('MapCtrl', function($scope, $state, $cordovaGeolocation, mapService) {
  //var options = {timeout: 10000, enableHighAccuracy: true};

  //$cordovaGeolocation.getCurrentPosition(options).then(function(position){

    //var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    var london = new google.maps.LatLng(51.508742,-0.120850);

// Add a Home control that returns the user to London
function HomeControl(controlDiv, map) {
  controlDiv.style.padding = '5px';
  var controlUI = document.createElement('div');
  controlUI.style.backgroundColor = 'yellow';
  controlUI.style.border='1px solid';
  controlUI.style.cursor = 'pointer';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Set map to London';
  controlDiv.appendChild(controlUI);
  var controlText = document.createElement('div');
  controlText.style.fontFamily='Arial,sans-serif';
  controlText.style.fontSize='12px';
  controlText.style.paddingLeft = '4px';
  controlText.style.paddingRight = '4px';
  controlText.innerHTML = '<b>Home<b>'
  controlUI.appendChild(controlText);

  // Setup click-event listener: simply set the map to London
  google.maps.event.addDomListener(controlUI, 'click', function() {
    $scope.map.setCenter(london)
  });
}

    var markers = [];
    var mapOptions = {
      center: new google.maps.LatLng(7.642650, 80.674438),
      zoom: 8,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    setTimeout(function() {
      $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
      var allSightings = mapService.getAllSightings();
      //var marker;
      for (var i = 0; i < allSightings.length; i++) {
        if (markers.indexOf(allSightings[i].species) == -1){
          markers.push(allSightings[i].species);
          markers[allSightings[i].species] = [];
        }
        var marker = new google.maps.Marker({
          // The below line is equivalent to writing:
          // position: new google.maps.LatLng(-34.397, 150.644)
          position: new google.maps.LatLng (allSightings[i].lat, allSightings[i].lng),
          map: $scope.map,
          icon: 'img/bat marker2.png'
        });
        markers[allSightings[i].species].push(marker);
        //alert(allSightings[i].lat);
      //  alert(allSightings[i].lng);
      }
      for (var i = 0; i < markers['flying fox'].length; i++) {
        markers['flying fox'][i].setMap(null);
    }
    // Create a DIV to hold the control and call HomeControl()
var homeControlDiv = document.createElement('div');
var homeControl = new HomeControl(homeControlDiv, map);
//  homeControlDiv.index = 1;
$scope.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(homeControlDiv);

google.maps.event.addDomListener(window, 'load', initialize);
      //markers[0].setMap($scope.map);
    }, 100);

  //}, function(error){
  //  console.log("Could not get location");
//  });
});
