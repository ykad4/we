
/**
* The application file bootstraps the angular app by  initializing the main module and
* creating namespaces and moduled for controllers, filters, services, and directives.
*/

(function() {
  "use strict";

  var dependencies = [
    'jquery',
    'app',
    'angular',
    'angular-route',
    'modules',
    'angular-resource',
    'angular-cookies',
    'ng-table',
    'angular-ui-router',
    'angular-bootstrap',
    'ng-file-upload',
    //'wuMasonry',
    'angular-route',
    'angular-moment',
    'user/user',
    'we-messenger',
    'post/post',
    'news/news',
    './site/index',
    './avatar/index',
    './file/index'
  ];

  define( dependencies, function(
    jQuery,
    App,
    angular,
    angularRoute,
    activity,
    modules,
    ngResource,
    ngCookies,
    ngTable,
    uiRouter,
    uiBootstrap
  ) {

    var app = angular.module('application', [
      'ngResource',
      'ngRoute',
      'ngTable',
      'angularFileUpload',
      'application.filters',
      'application.services',
      'application.directives',
      'application.constants',
      'application.controllers',
      'application.user',
      'we-messenger',
      'post',
      'news',
      'ui.router',
      'ui.bootstrap',
      'angularMoment'
    ]).
    config([ '$locationProvider','$httpProvider','$stateProvider', '$urlRouterProvider',
      function( $locationProvider, $httpProvider, $stateProvider, $urlRouterProvider) {

        $httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');
        $httpProvider.defaults.headers.common['Accept'] = 'application/json';

        $locationProvider.html5Mode(true).hashPrefix('#');

        // 404 handler
        $urlRouterProvider.otherwise("/404");

        $stateProvider
        .state('index', {
          url: "/",
          views: {
            "highlighted": {
              templateUrl:  wejs.getTemplateUrl("site/views/highlighted.html"),
              controller: function($scope, $rootScope, AUTH_EVENTS, SessionService){

                var user = SessionService.getUser();
                if($scope.user.authorized){
                  $scope.aboutShow = false;
                } else {
                  $scope.aboutShow = true;
                }

                // Login Event
                $rootScope.$on(AUTH_EVENTS.loginSuccess, function (event, next) {
                   $scope.aboutShow = false;
                });
                // Login Event
                $rootScope.$on(AUTH_EVENTS.logoutSuccess, function (event, next) {
                   $scope.aboutShow = true;
                });
              }
            },
            "": {
              templateUrl:  wejs.getTemplateUrl("site/views/home.html")
            },
            "signup-form@index": {
              templateUrl:  wejs.getTemplateUrl("user/views/signup-form.html")
            },
            "sidebar": {
              templateUrl:  wejs.getTemplateUrl("site/views/sidebar.html")
            }

          }
        })

        // -- ADMIN
        .state('admin', {
          url: "/admin",
          views: {
            "": {
              templateUrl:  wejs.getTemplateUrl("admin/views/roles.html")
            },
            "sidebar": {
              templateUrl:  wejs.getTemplateUrl("site/views/sidebar.html")
            }
          },

        })
        .state('admin.roles', {
          url: "/roles",
          views: {
            "": {
              templateUrl:  wejs.getTemplateUrl("admin/views/roles.html")
            },
            "sidebar": {
              templateUrl:  wejs.getTemplateUrl("site/views/sidebar.html")
            }
          },
          controller: function(){
            console.log('no admin.roles');
          }
        })
        .state('404', {
          url: "/404",
          templateUrl:  wejs.getTemplateUrl('site/views/error404.html')
        });

      }]).run([
        '$rootScope',
        '$route',
        '$http',
        '$window',
        function($rootScope, $route, $http, $window){

        $window.moment.lang(wejs.config.locale);

        $rootScope.user = {};
        $rootScope.user.authorized = false;
        $rootScope.user.loading = true;
        /*
        $http({method: 'GET', url: '/users/current'}).
          success(function(data, status, headers, config) {
            if(data.user.id){
              $rootScope.user = data.user;
              $rootScope.user.loading = false;
              $rootScope.user.authorized = true;
            }

          }).
          error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
          });
        */
        // Bind the `$routeChangeSuccess` event on the rootScope, so that we dont need to bind in individual controllers.
        $rootScope.$on('$routeChangeSuccess', function(currentRoute, previousRoute) {
          // This will set the custom property that we have defined while configuring the routes.

          if($route.current.action == "logoutHandler"){
            return $window.location.href = "/users/logout";
          }

          if($route.current.action && $route.current.action.length > 0){
            $rootScope.action = $route.current.action;
          }
        });
    }]);

    require(['domReady!'], function (document) {
        angular.bootstrap(document, ['application']);
    });

    return app;
  });
}());