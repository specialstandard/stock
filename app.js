angular.module('app', ['ngRoute'])
  .config(function($routeProvider){
    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html',
        controller: 'HomeController'
        })
      .when('/stocks', {
        templateUrl: 'views/stocks.html',
        controller: 'StocksController'
        })
      .when('/indices', {
        templateUrl: 'views/indices.html',
        controller: 'IndicesController'
        })
      .when('/currencies', {
        templateUrl: 'views/currencies.html',
        controller: 'CurrenciesController'
        })
    })
  .controller('MainController', ['$scope', function($scope){
    $scope.a = 'yes'
  }])

  .controller('HomeController', ['$scope', '$http', function($scope, $http){
    //$scope.page = 0;
    var obj = {page: $scope.page}
      $http.post("api/movies", JSON.stringify(obj))
        .then(function(res) {
          console.log(res.data)
          $scope.movieList = res.data.movieList
          $scope.page = res.data.page
          console.log($scope.movieList[2])
      })
    $scope.onClickNext = function(){
      $('html, body').animate({scrollTop: '0px'}, 0);
      var obj = {page: parseInt($scope.page)}
        $http.post("api/movies", JSON.stringify(obj))
        .then(function(res) {
          console.log(res.data)
          $scope.movieList = res.data.movieList
          $scope.page = res.data.page
      })
    }
  }])

  .controller('StocksController', ['$scope', '$http', function($scope, $http){
    var url = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22YHOO%22%2C%22AAPL%22%2C%22GOOG%22%2C%22MSFT%22)%0A%09%09&format=json&diagnostics=true&env=http%3A%2F%2Fdatatables.org%2Falltables.env&callback='
    $http.get(url)
      .then(function(res) {
        console.log(res)
        $scope.results = res.data.query.results.quote
    })

    $scope.deleteItem = function(item){
      var obj = {
        _id: item._id
      }
      $http.post("api/delete", JSON.stringify(obj))
        .then(function(res) {
          console.log(obj)

          console.log(res.data)
      })
      //Then get updated data
      $http.get("api/posts")
        .then(function(res) {
          console.log(res)
          $scope.results = res.data
      })
    }
  }])
  .controller('IndicesController', ['$scope', '$http', function($scope, $http){
    $http.get("api/posts")
      .then(function(res) {
        console.log(res)
        $scope.results = res.data
    })

    $scope.deleteItem = function(item){
      var obj = {
        _id: item._id
      }
      $http.post("api/delete", JSON.stringify(obj))
        .then(function(res) {
          console.log(obj)

          console.log(res.data)
      })
      //Then get updated data
      $http.get("api/posts")
        .then(function(res) {
          console.log(res)
          $scope.results = res.data
      })
    }
  }])
  .controller('CurrenciesController', ['$scope', '$http', function($scope, $http){
    $http.get("api/posts")
      .then(function(res) {
        console.log(res)
        $scope.results = res.data
    })

    $scope.deleteItem = function(item){
      var obj = {
        _id: item._id
      }
      $http.post("api/delete", JSON.stringify(obj))
        .then(function(res) {
          console.log(obj)

          console.log(res.data)
      })
      //Then get updated data
      $http.get("api/posts")
        .then(function(res) {
          console.log(res)
          $scope.results = res.data
      })
    }
  }])
  .controller('NavController', ['$scope', '$location', function($scope, $location){
    $scope.isActive = function ( path ){
      return $location.path() == path
    }

  }])
