angular.module('app', ['ngRoute'])
  .config(function($routeProvider){
    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html',
        controller: 'HomeController'
        })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutController'
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

  .controller('AboutController', ['$scope', '$http', function($scope, $http){
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
