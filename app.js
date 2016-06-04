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

  .controller('StocksController', ['$scope', '$http', 'APIService', function($scope, $http, APIService){

    APIService.stocks('fb', 'goog', 'nflx', 'ibm', 'twtr', 'msft', 'aapl', 'intc', 'yhoo', 'nvda', 'qqq', 'aal', 'csco').then(function(res){
      $scope.groupResults = res
    })
    console.log("group: ", $scope.groupResults)

    $scope.$watch('search', function (newValue){
      APIService.stock(newValue)
        .then(function(res) {
          console.log(res)
          if( res.data.query.results == null ){
            $scope.singleResultOutput = null
            $scope.singleTwitterResultOutput = null
          } else if( res.data.query.results.quote.Ask ==  null ){
            $scope.singleResultOutput = null
            $scope.singleTwitterResultOutput = null
          } else {
            $scope.singleResultOutput = res.data.query.results.quote
            APIService.twitterStock(newValue)
              .then(function(res) {
                console.log(res)
                $scope.singleTwitterResultOutput = res.data.statuses
              })
          }
        })

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
    $scope.onClickPopularStock = function(item){
      $scope.search = item
    }

  }])
  .controller('IndicesController', ['$scope', '$http', function($scope, $http){
    var url = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22DJI%22%2C%22GOOG%22%2C%22MSFT%22)%0A%09%09&format=json&diagnostics=true&env=http%3A%2F%2Fdatatables.org%2Falltables.env&callback='
    $scope.singleResult = null

    $http.get(url)
      .then(function(res) {
        console.log(res)
        $scope.groupIndexResults = res.data.query.results.quote
    })
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
  .factory('APIService', ['$http', function($http){
    var o = {}
    var quote = null
    o.stocks = function(stock){

      var args = Array.from(arguments)

      var stockList =''
      args.map(function(item, i){
        if( i==args.length-1 ){
          stockList = stockList + '"'+item+'"'
        }else{
          stockList = stockList + '"'+item+'",'
        }
      })
      var query = 'select * from yahoo.finance.quotes where symbol in (' + stockList

      query = window.encodeURIComponent(query)

      var queryTail = ')&format=json&diagnostics=true&env=store://datatables.org/alltableswithkeys&callback='

      var url = 'https://query.yahooapis.com/v1/public/yql?q=' + query + queryTail

      return $http.get(url)
        .then(function(res) {
          console.log('stocks: ', res)
          return res.data.query.results.quote
      })
    }

    o.stock = function(stock){
        var query = 'select * from yahoo.finance.quotes where symbol in ("' + stock + '")&format=json&diagnostics=true&env=store://datatables.org/alltableswithkeys&callback='

        query = window.encodeURI(query)

        var url = 'https://query.yahooapis.com/v1/public/yql?q=' + query

        return $http.get(url)
          /*.then(function(res) {
            console.log(res)
            return res.data.query.results.quote
        })*/
    }

    o.twitterStock = function(stock){

      var obj = {
        query: stock
      }
      return $http.post('/api/twitter/stock', JSON.stringify(obj))
      }

    return o
  }])
