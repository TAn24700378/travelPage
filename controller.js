var app = angular.module('travelPage', ['ui.bootstrap']);
app.controller('travelCtrl', function ($scope, $http) {
  $http.get("https://api.kcg.gov.tw/api/service/get/9c8e1450-e833-499c-8320-29b36b7ace5c")
    .success(function (response) {
      var wholeData = response.data.XML_Head.Infos.Info;
      $scope.displayPlaceInformation = wholeData;
      $scope.placeInformation = wholeData;
      $scope.zone = "全部資料";
      $scope.zipcode4PlaceObject = {};
      for (var i = 0; i < wholeData.length; i++) {

        if (!(wholeData[i].Zipcode in $scope.zipcode4PlaceObject)) {
          var placeFirst = wholeData[i].Add.indexOf(wholeData[i].Zipcode);
          var placeLast = wholeData[i].Add.indexOf('區');
          var placeCut = wholeData[i].Add.substring(placeFirst + wholeData[i].Zipcode.length, placeLast + 1);
          $scope.zipcode4PlaceObject[wholeData[i].Zipcode] = {
            Zipcode: wholeData[i].Zipcode,
            place: placeCut,
            info: [{ Picture1: wholeData[i].Picture1, Name: wholeData[i].Name, Add: wholeData[i].Add, Opentime: wholeData[i].Opentime, Tel: wholeData[i].Tel }]
          };
        } else {
          $scope.zipcode4PlaceObject[wholeData[i].Zipcode].info.push({ Picture1: wholeData[i].Picture1, Name: wholeData[i].Name, Add: wholeData[i].Add, Opentime: wholeData[i].Opentime, Tel: wholeData[i].Tel });
        }
      }
      $scope.displayData = function (data) {
        $scope.placeInformation = $scope.zipcode4PlaceObject[data].info;
        $scope.zone = $scope.zipcode4PlaceObject[data].place;

        $scope.currentPage = 1;
        $scope.numPerPage = 6;
        $scope.maxSize = 5;

        $scope.$watch('currentPage + numPerPage', function () {
          var begin = (($scope.currentPage - 1) * $scope.numPerPage), end = begin + $scope.numPerPage;

          $scope.displayPlaceInformation = $scope.placeInformation.slice(begin, end);
        });
      };
    });
});
app.directive("zoneInfo", function () {
  return {
    scope: {
      zonePicture1: '@',
      zoneName: '@',
      zoneOpentime: '@',
      zoneAdd: '@',
      zoneTel: '@'
    },
    restrict: 'E',
    templateUrl: 'zoneInfo.html'
  };
});
app.directive("footer", function () {
  return {
    restrict: 'E',
    templateUrl: 'footer.html'
  };
});


$(".jq-goTop").click(function (e) {
  e.preventDefault();
  $("html,body").animate(
    {
      scrollTop: 0,
    },
    600
  );
});

$(window).scroll(function () {
  if ($(window).scrollTop() > 200) {
    if ($(".goTop").hasClass("hide")) {
      $(".goTop").toggleClass("hide");
    }
  } else {
    $(".goTop").addClass("hide");
  }
});