(function (root, factory) {
  if (typeof exports === 'object') {
    module.exports = factory(root, require('angular'));
  } else if (typeof define === 'function' && define.amd) {
    define(['angular'], function (angular) {
      return (root.validationRepeatField = factory(root, angular));
    });
  } else {
    root.validationRepeatField = factory(root, root.angular);
  }
}(this, function (window, angular) {

  var module = angular.module('ValidationRepeatField', []);

  module.directive('validateRepeatField', ['validateRepeatFieldConfig', function(config) {

    var errorPrefix = 'validateRepeatField';

    var errorName = config.getErrorName();
    var roles = ['master', 'slave'];

    function isAvailableRole(role) {
      return roles.indexOf(role) > -1;
    }

    function checkForNeededAttribtues($attrs) {
      if (!$attrs.name) {
        throw new Error('validateRepeatField: Name attribute should be specified');
      }

      if (!$attrs.role) {
        throw new Error('validateRepeatField: role attribute should be specified');
      }
    }

    return {
      restrict: 'A',
      require: 'ngModel',
      link: function($scope, $element, $attrs, ctrl) {
        var formName = 'form';

        if (typeof $attrs.form != 'undefined') {
          formName = $attrs.form;
        }

        if (typeof $scope[formName] === 'undefined') {
          throw new Error('validateRepeatField: can not find form element');
        }

        checkForNeededAttribtues($attrs);

        if (!isAvailableRole($attrs.role)) {
          throw new Error('validateRepeatField: You can not use roles different from master and slave');
        }

        ctrl.$parsers.unshift(function(value) {

          isValid = true;

          var relatedFieldValue;
          var isMaster = ($attrs.role === "master");
          var relatedField = $scope.form[$attrs.validateRepeatField];
          if (relatedField.$viewValue) {
            relatedFieldValue = relatedField.$viewValue.trim();
          }

          if (value && value.length > 0 && relatedFieldValue && relatedFieldValue.length > 0) {
            isValid = (value === relatedFieldValue);
          }

          if (isMaster) {
            relatedField.$setValidity(errorName, isValid);
          } else {
            ctrl.$setValidity(errorName, isValid);

            if (typeof relatedFieldValue === 'undefined') {
              relatedField.$setValidity('required', false);
              relatedField.$setViewValue(relatedField.$viewValue);
            }
          }

          return value;
        });
      }
    };

  }]);

  module.provider('validateRepeatFieldConfig', function() {
    var config = {
      errorName: 'equalFieldValue'
    };

    // setters
    function setErrorName(name) {
      config.errorName = name;
    }

    function getErrorName() {
      return config.errorName;
    }

    return {
      setErrorName: setErrorName,
      $get: function() {
        return {
          getErrorName: getErrorName
        }
      }
    }
  });

  return module;

}));