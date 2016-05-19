// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','ngMockE2E','ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})


//implementing the basic routing.
.config(function ($stateProvider, $urlRouterProvider, USER_ROLES) {
  $stateProvider
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })
  .state('main', {
    url: '/',
    abstract: true,
    templateUrl: 'templates/main.html'

  })
  .state('main.dash', {
    url: 'main/dash',
    views: {
        'dash-tab': {
          templateUrl: 'templates/dashboard.html',
          controller: 'DashCtrl'
        }
    }
  })
  .state('main.sightings', {
    url: 'main/sightings',
    views: {
        'sightings-tab': {
          templateUrl: 'templates/sightings.html',
          controller: 'SightCtrl'
        }
    }
  })
  //main.report added by me. but sadly i also dont know the reason.
  .state('main.report', {
    url: 'main/report',
    views: {
        'report-model': {
          templateUrl: 'templates/ReportSightingModel.html',
          //controller: 'SightCtrl'
        }
    }
  })
  .state('main.map', {
    url: 'main/map',
    views: {
        'map-tab': {
          templateUrl: 'templates/map.html',
          controller: 'MapCtrl'

        }
    },
    data: {
      authorizedRoles: [USER_ROLES.admin]
    }
  });

  // Thanks to Ben Noblet!
  $urlRouterProvider.otherwise(function ($injector, $location) {
    var $state = $injector.get("$state");
    $state.go("main.dash");
  });
})

//including angular-mocks to the app.
.run(function($httpBackend){
  $httpBackend.whenGET('http://localhost:8100/valid')
        .respond({message: 'This is my valid response!'});
  $httpBackend.whenGET('http://localhost:8100/notauthenticated')
        .respond(401, {message: "Not Authenticated"});
  $httpBackend.whenGET('http://localhost:8100/notauthorized')
        .respond(403, {message: "Not Authorized"});

  $httpBackend.whenGET(/templates\/\w+.*/).passThrough();
 })

 //Here we catch the url changing event and see weather the user is Authenticated and Authorized.
 //This is to prevent accessing logged states by entering URLs.
 .run(function ($rootScope, $state, AuthService, AUTH_EVENTS) {
  $rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState) {

    if ('data' in next && 'authorizedRoles' in next.data) {
      var authorizedRoles = next.data.authorizedRoles;
      if (!AuthService.isAuthorized(authorizedRoles)) {
        event.preventDefault();
        $state.go($state.current, {}, {reload: true});
        $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
      }
    }

    if (!AuthService.isAuthenticated()) {
      if (next.name !== 'login') {
        event.preventDefault();
        $state.go('login');
      }
    }
  });
})
