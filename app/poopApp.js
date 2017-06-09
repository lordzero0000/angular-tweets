angular.module('poopApp', [])
  .controller('TweetController', ['$scope', '$http', function($scope, $http) {
    let _self = this
        tweetUrl = 'http://localhost:3000/tweet'

    $scope.alertStatus = {
      show: false,
      text: 'KAKAROTTO',
      type: 'success'
    }

    $scope.utilsOnScope = {
      hideAlert: function() {
        $scope.alertStatus.show = false
      }
    }

    $scope.tweetsBox = {
      show: false,
      tweets: [],
      about: null,
      lastUpdate: null
    }

    _self.addTweet = function() {
      $http.post(tweetUrl, {
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
      $http.get(`${tweetUrl}?q=${q}&v=${v}`)
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
  .directive('showTweetsBox', function() {
    return {
      templateUrl: 'templates/show-tweets-box.html'
    }
  })
  .directive('showAlert', function() {
    return {
      templateUrl: 'templates/show-alert.html'
    }
  })

// Arrow functions doesn't work on chrome!