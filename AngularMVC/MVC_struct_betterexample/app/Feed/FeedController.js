
//2. The modules (or lack of them)
//1. 
//Often, in the beginning, full functionality develops in a single module. 
//Up to a certain point, this approach works, but then the project code becomes unmanageable. 
var app = angular.module('app',[]);
app.service('MyService', function(){
    //service code
});

app.controller('MyCtrl', function($scope, MyService){
    //controller code
});



//2. 
//The next most common approach is to group objects by their type: 
var services = angular.module('services',[]);
services.service('MyService', function(){
    //service code
});

var controllers = angular.module('controllers',['services']);
controllers.controller('MyCtrl', function($scope, MyService){
    //controller code
});

var app = angular.module('app',['controllers', 'services']);


//3. 
//This approach isn't scalable the best, too, like the directory structure in 1st case. 
//In order to achieve better scalability, we will follow the same concept of grouping code by features:
var sharedServicesModule = angular.module('sharedServices',[]);
sharedServices.service('NetworkService', function($http){});

var loginModule = angular.module('login',['sharedServices']);
loginModule.service('loginService', function(NetworkService){});
loginModule.controller('loginCtrl', function($scope, loginService){});

var app = angular.module('app', ['sharedServices', 'login']);



//4.
//3. Dependency Injection
var app = angular.module('app',[]);
app.controller('MainCtrl', function($scope, $timeout){
    $timeout(function(){
        console.log($scope);
    }, 1000);
});


//Using UglifyJS will lead to the following code: 
var app=angular.module("app",[]);app.controller("MainCtrl",function(e,t){t(function(){console.log(e)},1e3)})


// to pass dependency as an array of strings with the last element that is a function that takes all of the dependencies as options: 
app.controller('MainCtrl', ['$scope', '$timeout', function($scope, $timeout){
    $timeout(function(){
        console.log($scope);
    }, 1000);
}]);

//The code above will be converted by minifier to code that AngularJS will be able to correctly interpret: 
app.controller("MainCtrl",["$scope","$timeout",function(e,t){t(function(){console.log(e)},1e3)}])



//5.

//3.1. Global dependence

//use Underscore.js 

//Frequently, when developing AngularJS applications, there is a need to use objects that are available at any point of application. 
//It breaks down a coherent model based on dependency injection, and leads to bugs and complexity of the testing process. 
//AngularJS allows to wrap such objects in modules so they can be implemented like a conventional AngularJS modules. 
//For example, the magnificent library Underscore.js can be wrapped in module as follows: 

var underscore = angular.module('underscore', []);
underscore.factory('_', function() {
  return window._; //Underscore must already be loaded on the page
});
var app = angular.module('app', ['underscore']);

app.controller('MainCtrl', ['$scope', '_', function($scope, _) {
    init = function() {
          _.keys($scope);
      }

      init();
}]);



//4. Inflating controllers


//5. Service vs Factory
function factory(name, factoryFn) { 
    return provider(name, { $get: factoryFn }); 
}

function service(name, constructor) {
    return factory(name, ['$injector', function($injector) {
      return $injector.instantiate(constructor);
    }]);
}


//
var app = angular.module('app',[]);

app.service('helloWorldService', function(){
    this.hello = function() {
        return "Hello World";
    };
});

app.factory('helloWorldFactory', function(){
    return {
        hello: function() {
            return "Hello World";
        }
    }
});

//In OOP, the factory is an object that creates other objects: 
app.factory('helloFactory', function() {
    return function(name) {
        this.name = name;

        this.hello = function() {
            return "Hello " + this.name;
        };
    };
});


//Here is an example of the controller using the service and two factories: 
app.controller('helloCtrl', function($scope, helloWorldService, helloWorldFactory, helloFactory) {
    init = function() {
      helloWorldService.hello(); //'Hello World'
      helloWorldFactory.hello(); //'Hello World'
      new helloFactory('Readers').hello() //'Hello Readers'
    }

    init();
});



//Factories may also be useful in the development of classes with private methods:

app.factory('privateFactory', function(){
    var privateFunc = function(name) {
        return name.split("").reverse().join(""); //reverses the name
    };

    return {
        hello: function(name){
          return "Hello " + privateFunc(name);
        }
    };
});



//7. Too many watchers

(function () { 
    var root = $(document.getElementsByTagName('body'));
    var watchers = [];

    var f = function (element) {
        if (element.data().hasOwnProperty('$scope')) {
            angular.forEach(element.data().$scope.$$watchers, function (watcher) {
                watchers.push(watcher);
            });
        }

        angular.forEach(element.children(), function (childElement) {
            f($(childElement));
        });
    };

    f(root);

    console.log(watchers.length);
})();



// (Remember that in JS functions and arrays are objects.) 


/*
9. Using the test-driven development
As long as you do not start using TDD in your work, you have to run project every time and carry out manual testing to make sure that your code works. There is no justification for the use of this approach in the case of AngularJS. AngularJS was originally designed to keep its code testiable. DI, ngMock - your best assistants in this. Also, there are several tools that can help you move to the next level.
9.1 Protractor
Unit tests are base for constructing a fully coated test applications, but with an increase in integration tests using the project may be more efficient to check whether the application code in viable. Fortunately, the AngularJS team has developed a wonderful tool - Protractor, that is able to mimic the interaction with the user. Protractor uses Jasmine framework for writing tests and has a good API for descriptions of the various interaction scenarios. Among the many different tools for testing, Protractor have an advantage in understanding the internal AngularJS structure, which is especially useful when you're dealing with something like $digest cycles.
9.2. Karma
The AngularJS project team not limited to write tools for test development. The team also developed test runner Karma. Karma enables tests every time you change a source file. Karma is able to perform parallel tests in multiple browsers. Different devices may also be aimed on the Karma server for a more complete coverage of real scenarios.

10. Using jQuery
jQuery is a wonderful library. It standardizes the cross-platform development and has become the standard in modern web development. Despite the fact that jQuery has a lot of features, it is far from the philosophy of AngularJS. AngularJS is a framework for building applications, while jQuery is just a library that simplifies the process of interaction between JavaScript and HTML, and provides a convenient API for working with AJAX. This is a fundamental difference between them. Angular is an approach to building applications, and no way to control the markup document. To really understand the principles of AngularJS applications, you should stop using jQuery. JQuery makes you conform to existing HTML standard, while Angular allows you to expand the HTML standard to the needs of your application. DOM manipulations in AngularJS should be made in the guidelines, but it is quite possible to place wrappers of the existing jQuery components in the directives, if you could not find an analogue in Angular. 

*/






