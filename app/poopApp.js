angular.module('poopApp', [])
  .controller('TweetController', ['$scope', '$http', 'requestService', function($scope, $http, requestService) {
    let _self = this
        tweetUrl = 'http://localhost:3000/tweet'

    $scope.alertStatus = {
      show: false,
      text: 'KAKAROTTO',
      type: 'success'
    }

    $scope.tweetsBox = {
      show: false,
      tweets: [],
      about: null,
      lastUpdate: null
    }

    _self.addTweet = function() {
      requestService.post(tweetUrl, {
        tweet: _self.tweetText
      }).then(function(response) {
        _self.tweetText = ''
        $scope.alertStatus.show = true
        $scope.alertStatus.text = 'Everything was successful, we can dance now.'
        $scope.alertStatus.type = 'success'
        console.log(response.data)
      }).catch(function(response) {
        let errorMsg = (response.data.error.msg) ? response.data.error.msg : 'Cannot get information of the tweet.'
        $scope.alertStatus.show = true
        $scope.alertStatus.text = `ERROR: ${errorMsg}`
        $scope.alertStatus.type = 'danger'
        console.log(response.data)
      })
    }

    _self.showTweets = function(q, v, about) {
      requestService.get(tweetUrl, `q=${q}&v=${v}`)
      .then(function (response) {
        $scope.tweetsBox.show = true
        $scope.tweetsBox.tweets = response.data.hits.hits
        $scope.tweetsBox.about = about
        $scope.tweetsBox.lastUpdate = new Date().toLocaleDateString()
        console.log(response.data)
      })
      .catch(function (err) {
        let errorMsg = (response.data.error.msg) ? response.data.error.msg : 'Cannot get information of the tweet.'
        $scope.alertStatus.show = true
        $scope.alertStatus.text = `ERROR: ${errorMsg}`
        $scope.alertStatus.type = 'danger'
        console.log(err.data)
      })
    }
  }])
  .directive('showPoop', function() {
    return {
      scope: {
        poop: "=show"
      },
      template: '<h1>{{$scope.poop}}&#128169;</h1>'
    }
  })
  .directive('showBox', function() {
    return {
      scope: {
        showBox: "="
      },
      templateUrl: 'templates/show-tweets-box.html'
    }
  })
  .directive('showAlert', function() {
    return {
      scope: {
        showAlert: "="
      },
      controller: ['$scope', function ($scope) {
        let _self = this

        _self.hideAlert = function() {
          $scope.showAlert = false
        }
      }],
      templateUrl: 'templates/show-alert.html'
    }
  })
  .factory('requestService', function($http) {
    return {
      post: function (url, obj) {
        return $http.post(url, obj)
      },
      get: function (url, query) {
        return $http.get(`${url}?${query}`)
      }
    }
  })

// Arrow functions doesn't work on chrome!