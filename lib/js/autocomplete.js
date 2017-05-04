/* --- Made by justgoscha and licensed under MIT license --- */

var app = angular.module('autocomplete', []);

app.directive('autocomplete', function() {
  var index = 0;

  return {
    restrict: 'E',
    scope: {
      searchParam: '=ngModel',
      suggestions: '=data',
      onType: '=onType',
      onSelect: '=onSelect',
      autocompleteRequired: '='
    },
    controller: ['$scope','$rootScope', function($scope,$rootScope){
      // the index of the suggestions that's currently selected
      $scope.selectedIndex = 0;

      $scope.initLock = true;

      // set new index
      $scope.setIndex = function(i){
        $scope.selectedIndex = parseInt(i);
      };

      this.setIndex = function(i){
        $scope.setIndex(i);
        $scope.$apply();
      };

      $scope.getIndex = function(i){
        $rootScope.Index=$scope.selectedIndex
        return $scope.selectedIndex;
      };

      // watches if the parameter filter should be changed
      var watching = true;

      // autocompleting drop down on/off
      $scope.completing = false;
      // starts autocompleting on typing in something
      $scope.$watch('searchParam', function(newValue, oldValue){

        if (oldValue === newValue || (!oldValue && $scope.initLock)) {
          return;
        }

        if(watching && typeof $scope.searchParam !== 'undefined' && $scope.searchParam !== null) {
          $scope.completing = true;
          $scope.searchFilter = $scope.searchParam;
          $scope.selectedIndex = 0;
        }


        // function thats passed to on-type attribute gets executed
        if($scope.onType)
          $scope.onType($scope.searchParam);
      });

      // for hovering over suggestions
      this.preSelect = function(suggestion){

        watching = false;

        // this line determines if it is shown
        // in the input field before it's selected:
        //$scope.searchParam = suggestion;

        $scope.$apply();
        watching = true;

      };

      $scope.preSelect = this.preSelect;

      this.preSelectOff = function(){
        watching = true;
      };

      $scope.preSelectOff = this.preSelectOff;

      // selecting a suggestion with RIGHT ARROW or ENTER
      $scope.select = function(suggestion){
        // console.log(suggestion);
        if(suggestion){
          $scope.searchParam = suggestion;
          $scope.searchFilter = suggestion;
          if($scope.onSelect)
            $scope.onSelect(suggestion);
        }
        watching = false;
        $scope.completing = false;
        setTimeout(function(){watching = true;},1000);
        $scope.setIndex(-1);
      };
      $scope.clearbtn = function(){
        $scope.searchParam = ""
        $rootScope.clearbtnClicked=1
        // $('.autocomplete').focus()
        // console.log(attrs.placeholder)
      };
      $rootScope.select = function(suggestion){
        // console.log(suggestion);
        if(suggestion){
          $scope.searchParam = suggestion;
          $scope.searchFilter = suggestion;
          if($scope.onSelect)
            $scope.onSelect(suggestion);
        }
        watching = false;
        $scope.completing = false;
        setTimeout(function(){watching = true;},1000);
        $scope.setIndex(-1);
      };

    }],
    link: function(scope, element, attrs,rootScope){
      setTimeout(function() {
        scope.initLock = false;
        scope.$apply();
      }, 250);

      var attr = '';
      // Default atts
      scope.attrs = {
        "placeholder": "start typing...",
        "class": "",
        "id": "",
        "inputclass": "",
        "inputid": ""
      };

      for (var a in attrs) {
        attr = a.replace('attr', '').toLowerCase();
        // add attribute overriding defaults
        // and preventing duplication
        if (a.indexOf('attr') === 0) {
          scope.attrs[attr] = attrs[a];
        }
      }

      if (attrs.clickActivation) {
        // console.log("element",element[0]);
        element[0].onclick = function(e){
          // console.log(5)
          if(!scope.searchParam){
            setTimeout(function() {
              scope.completing = true;
              scope.$apply();
            }, 200);
          }
        };
      }

      var key = {left: 37, up: 38, right: 39, down: 40 , enter: 13, esc: 27, tab: 9};

      element[0].addEventListener("mousedown",function (e){
        var index = scope.getIndex();
        // console.log("-",index);
        // if (index >=0)
        // {
        //   newIndex = index;
        //   // window.keydown(13);
        //   // console.log("scope.searchParam",scope.searchParam);
        //   if(scope.searchParam != "" && scope.searchParam != undefined)
        //   {
        //     var element = angular.element(document.getElementById('au-'+attrs.attrId)).find('li')[newIndex];
        //     scope.select(element.textContent);
        //   }
        //   // scope.select(angular.element(angular.element(this).find('li')[newIndex]).text());

        //   // console.log("newIndex----",element.textContent);
        // }
      })
      document.addEventListener("keydown", function(e){
        var keycode = e.keyCode || e.which;
        // console.log("sfdsfs--",keycode);
        switch (keycode){
          case key.esc:
            // disable suggestions on escape
            scope.select();
            scope.setIndex(-1);
            scope.$apply();
            e.preventDefault();
        }
      }, true);

      document.addEventListener("blur", function(e){
        // disable suggestions on blur
        // we do a timeout to prevent hiding it before a click event is registered
        setTimeout(function() {
          scope.select();
          scope.setIndex(-1);
          scope.$apply();
        }, 150);
      }, true);

      element[0].addEventListener("keydown",function (e){
        var keycode = e.keyCode || e.which;

        var l = angular.element(this).find('li').length;

        // this allows submitting forms by pressing Enter in the autocompleted field
        if(!scope.completing || l == 0) return;

        // implementation of the up and down movement in the list of suggestions
        switch (keycode){
          case key.up:

            index = scope.getIndex()-1;
            if(index<-1){
              index = l-1;
            } else if (index >= l ){
              index = -1;
              scope.setIndex(index);
              scope.preSelectOff();
              break;
            }
            scope.setIndex(index);

            if(index!==-1)
              scope.preSelect(angular.element(angular.element(this).find('li')[index]).text());

            scope.$apply();

            break;
          case key.down:
            index = scope.getIndex()+1;
            // console.log(index,rootScope.noResult);
            if(index<-1){
              index = l-1;
            } else if (index >= l ){
              index = -1;
              scope.setIndex(index);
              scope.preSelectOff();
              scope.$apply();
              break;
            }
            scope.setIndex(index);
            // pos = angular.element(angular.element(this).find('li')[index])
            // console.log($(pos).offset().top,'----------', $(pos).offset().top - 25)
            // if(index > 5)
            //   $(pos).offset().top = $(pos).position().top - 25
              // $(pos).scrollTop($(pos).position().top - 25)
            if(index!==-1)
              scope.preSelect(angular.element(angular.element(this).find('li')[index]).text());

            break;
          case key.left:
            break;
          case key.right:
          case key.enter:
          case key.tab:

            index = scope.getIndex();
            // console.log("shubham",index,scope.searchParam);
            // scope.preSelectOff();
            if (index !== -1 && scope.suggestions.length>0) {
              scope.select(angular.element(angular.element(this).find('li')[index]).text());
              if (keycode === key.enter) {
                e.preventDefault();
              }
            } else {
              if (keycode === key.enter) {
                scope.select();
              }
            }
            scope.setIndex(-1);
            scope.$apply();

            break;
          case key.esc:
            // disable suggestions on escape
            scope.select();
            scope.setIndex(-1);
            scope.$apply();
            e.preventDefault();
            break;
          default:
            return;
        }

      });
    },
    template: '\
          <div class="autocomplete {{ attrs.class }}" id="{{ attrs.id }}">\
          <input\
            type="text"\
            ng-model="searchParam"\
            placeholder="{{ attrs.placeholder }}"\
            class="{{ attrs.inputclass }}"\
            id="{{ attrs.inputid }}"\
            autocomplete="off"\
            onClick="this.select();"\
            ng-required="{{ autocompleteRequired }}" />\
            <button ng-if="searchParam.length>2" class="close-icon fa fa-times-circle" ng-click="clearbtn()"></button>\
          <ul ng-show="completing && (suggestions | filter:searchFilter).length > 0 && $root.userNowTypingLocation!=1 && $root.gotLocResponse==1 ">\
            <li\
              suggestion\
              ng-repeat="suggestion in suggestions | filter:searchFilter track by $index"\
              index="{{ $index }}"\
              val="{{ suggestion }}"\
              ng-class="{ active: ($index === selectedIndex) }"\
              ng-click="select(suggestion)"\
              ng-bind-html="suggestion | highlight:searchParam">\
              </li>\
          </ul>\
          <ul ng-if="$root.gotLocResponse==0 && searchParam.length>0" ng-show="completing">\
          <div class="coverScreen" ><div class="showbox"><div class="loader"><svg class="circular" viewBox="25 25 50 50"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div></div></div>  \
          </ul>\
          <ul ng-if="$root.gotDishResponse==0 && searchParam.length>0" ng-show="completing">\
          <div class="coverScreen" ><div class="showbox"><div class="loader"><svg class="circular" viewBox="25 25 50 50"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div></div></div>  \
          </ul>\
          <ul ng-show="completing && $root.noResult==1 && searchParam.length>2 && suggestions.length==0 && $root.userNowTypingLocation!=1  ">\
            <li\
              val="{{ suggestion }}">No Result Found</li>\
            </ul>\
          <ul ng-show="completing && (suggestions | filter:searchFilter).length > 0 && ($root.dishSuggestionsTypeName.length!=0) && $root.userNowTypingDish!=1 && $root.gotDishResponse==1">\
              <li\
                suggestion\
                ng-repeat="suggestion in suggestions | filter:searchFilter track by $index"\
                index="{{ $index }}"\
                val="{{ suggestion }}"\
                ng-class="{ active: ($index === selectedIndex) }"\
                ng-click="select(suggestion)"\
                >\
                  <span ng-bind-html="suggestion | dishhighlight:searchParam:$root.dishSuggestionsTypeName[$index]"></span>\
              </li>\
          </ul>\
        </div>\
        '
  };
});

app.filter('highlight', ['$sce', function ($sce) {
  return function (input, searchParam) {
    if (typeof input === 'function') return '';
    if (searchParam) {
      var words = '(' +
            searchParam.split(/\ /).join(' |') + '|' +
            searchParam.split(/\ /).join('|') +
          ')',
          exp = new RegExp(words, 'gi');
      if (words.length) {
        input = input.replace(exp, "<span class=\"highlight\">$1</span>");
      }
    }
    // input = input + "<span class=\"shubham\">{{shubham}}</span>"
    return $sce.trustAsHtml(input);
  };
}]);

app.filter('dishhighlight', ['$sce', function ($sce) {
  return function (input, searchParam,tag) {
    if (typeof input === 'function') return '';
    if (searchParam) {
      var words = '(' +
            searchParam.split(/\ /).join(' |') + '|' +
            searchParam.split(/\ /).join('|') +
          ')',
          exp = new RegExp(words, 'gi');
      if (words.length) {
        // if(tag == 'restaurant')
        //   input = input.replace(exp, "<span class=\"text-transform-none\">Recommended Dishes from </span><span class=\"highlight\">$1</span>");
        // else  
        // console.log(input);
        input = input.replace(exp, "<span class=\"dishhighlight\">$1</span>");
        // console.log(input);
      }
    }
    if(tag != undefined){
      input = input + "<span class=\"tags\">"+tag+"</span>"
    }
    return $sce.trustAsHtml(input);
  };
}]);

app.directive('suggestion', function(){
  return {
    restrict: 'A',
    require: '^autocomplete', // ^look for controller on parents element
    link: function(scope, element, attrs, autoCtrl){
      element.bind('mouseenter', function() {
        autoCtrl.preSelect(attrs.val);
        autoCtrl.setIndex(attrs.index);
      });

      element.bind('mouseleave', function() {
        autoCtrl.preSelectOff();
      });
    }
  };
});