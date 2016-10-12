define(['jquery', 'async', 'angular', 'angular-ui-router'], function($, async, angular){
//'angular-ui-router'  'angular-messages', 'angular-route'

    var app = angular.module('app', ['ui.router']); //, 'ngRoute'

    var URL_ROUTES = "../../init/route.json";
    var LANGUAGE = 'cn';
    console.log(1)

    app.config(config).run(run);
    console.log(2)

    function config ($stateProvider, $urlRouterProvider, $controllerProvider) {
        console.log("app.config");
        $.ajax({
            type: "GET",
            url: URL_ROUTES,
            dataType: 'json',
            async: false
        }).
        success(success).
        fail(fail);

        function success(data) {

            $urlRouterProvider.when("", data.home);
            //$urlRouterProvider.otherwise(data.home);

            angular.forEach(data.routes, function(v, i) {
                var controller = v.module + '/controllers/' + v.view
                var templateUrl = v.module + '/views/' + LANGUAGE + '/' + v.view +'.html';
                var state = ( (v.module == data.main)?"":data.state ) + v.state;
                
                $stateProvider.state(state, {
                    url : v.url,
                    templateUrl : templateUrl,
                    controller : state,
                    resolve : {
                        init: function($q, $rootScope) {
                            var deferred = $q.defer();
                            require([controller], function(controller) {
                                $controllerProvider.register(state, controller);
                                $rootScope.$apply(function() {
                                    deferred.resolve();
                                })
                            });
                            return deferred.promise;
                        }
                    }
                });
            });
        }

        function fail(data) {
            console.log(data);
            console.log("error");
        }
    }

    function run ($rootScope, $state, $http) {
        angular.bootstrap(app);
    }
    return angular;
});
