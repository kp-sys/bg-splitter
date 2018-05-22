angular.module('bgDirectives', [])
  .directive('bgScroll', Scroll)
  .directive('bgSplitter', Splitter)
  .directive('bgPane', Pane);

Splitter.$inject = ['$document'];

function Scroll () {
  return {
    restrict: 'A',
    controller: function () {
      this.handler = null;
    },
    link: function(scope, element, attrs, ctrl) {
      element.on('scroll', onscroll);

      scope.$on('$destroy', function () {
        element.off('scroll', onscroll);
      });

      function onscroll (ev) {
        var scrollTop = element.prop('scrollTop'),
          containerTop = element.prop('offsetTop'),
          height = element.prop('clientHeight'),
          top = scrollTop - containerTop + height / 2;
        ctrl.handler.css('top', top + 'px');
      }
    }
  }
}

function Splitter ($document) {
  return {
    restrict: 'E',
    replace: true,
    require: '^?bgScroll',
    transclude: true,
    scope: {
      orientation: '@',
      handlerStyle: '=?'
    },
    template: '<div class="split-panes {{orientation}}" ng-transclude></div>',
    controller: ['$scope', function ($scope) {
      $scope.panes = [];

      this.addPane = function(pane){
        if ($scope.panes.length > 1)
          throw 'splitters can only have two panes';
        $scope.panes.push(pane);
        return $scope.panes.length;
      };
    }],
    link: function(scope, element, attrs, ctrl) {
      var handler = angular.element('<div class="split-handler"></div>'),
        pane1 = scope.panes[0],
        pane2 = scope.panes[1],
        vertical = scope.orientation === 'vertical',
        pane1Min = pane1.minSize || 0,
        pane2Min = pane2.minSize || 0,
        draged = false,
        handlerStyle = null;

      if (vertical) {
        handlerStyle = angular.extend({
          width: '10px',
          left: '50%'
        }, scope.handlerStyle)
      } else {
        handlerStyle = angular.extend({
          height: '10px',
          top: '50%',
        }, scope.handlerStyle)
      }
      handler.css(handlerStyle);

      if (ctrl) {
        ctrl.handler = handler;
      }

      pane1.elem.after(handler);

      element.bind('mousemove', drag);
      handler.bind('mousedown', dragstart);
      $document.bind('mouseup', dragend);

      scope.$on('$destroy', function () {
        element.unbind('mousemove', drag);
        handler.unbind('mousedown', dragstart);
        $document.unbind('mouseup', dragend);
      });

      function drag (ev) {
        if (!draged) return;

        var bounds = element[0].getBoundingClientRect();
        var pos = 0;

        if (vertical) {

          var height = bounds.bottom - bounds.top;
          pos = ev.clientY - bounds.top;

          if (pos < pane1Min) return;
          if (height - pos < pane2Min) return;

          handler.css('top', pos + 'px');
          pane1.elem.css('height', pos + 'px');
          pane2.elem.css('top', pos + 'px');

        } else {

          var width = bounds.right - bounds.left;
          pos = ev.clientX - bounds.left;

          if (pos < pane1Min) return;
          if (width - pos < pane2Min) return;

          handler.css('left', pos + 'px');
          pane1.elem.css('width', pos + 'px');
          pane2.elem.css('left', pos + 'px');
        }
        scope.$apply();
      }

      function dragstart (ev) {
        ev.preventDefault();
        draged = true;
      }

      function dragend (ev) {
        draged = false;
      }
    }
  };
}

function Pane () {
  return {
    restrict: 'E',
    require: '^bgSplitter',
    replace: true,
    transclude: true,
    scope: {
      minSize: '='
    },
    template: '<div class="split-pane{{index}}" ng-transclude></div>',
    link: function(scope, element, attrs, bgSplitterCtrl) {
      scope.elem = element;
      scope.index = bgSplitterCtrl.addPane(scope);
    }
  };
}
