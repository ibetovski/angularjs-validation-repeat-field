describe('Validation Repeat field', function() {
    var form;
    var $scope;

    beforeEach(function() {
      module('ValidationRepeatField');
    });

    describe('Form', function() {
      it('should throw error if can not find form', inject(function($compile, $rootScope) {
        var $scope = $rootScope;
        var element = angular.element(
            '<input type="text" ng-model="master" name="master" validate-repeat-field="slave" role="master" />'
        );

        expect(function() {
          $compile(element)($scope);
          $scope.$digest();
        }).to.throw('validateRepeatField: can not find form element');
      }));

      it('should accept form name', inject(function($compile, $rootScope) {
        var $scope = $rootScope;
        var element = angular.element(
          '<form name="myForm" novalidate>' +
            '<input type="text" ng-model="master" name="master" validate-repeat-field="slave" role="master" form="myForm" />' +
          '</form>'
        );
        form = $scope.form;

        expect(function() {
          $compile(element)($scope);
          $scope.$digest();
        }).not.to.throw('validateRepeatField: can not find form element');
        expect(typeof $scope.myForm).to.equal('object');
      }));

    });

    describe('Roles', function() {
      it('should not accept role different than master and slave', inject(function($compile, $rootScope) {
        var $scope = $rootScope;
        var element = angular.element(
          '<form name="form" novalidate>' +
            '<input type="text" ng-model="master" name="master" validate-repeat-field="slave" role="carpenter" />' +
          '</form>'
        );

        expect(function() {
          $compile(element)($scope);
          $scope.$digest();
          form = $scope.form;
        }).to.throw('validateRepeatField: You can not use roles different from master and slave');
      }));

      it('should accept master and slave', inject(function($compile, $rootScope) {
        var $scope = $rootScope;
        var element = angular.element(
          '<form name="form" novalidate>' +
            '<input type="text" ng-model="master" name="master" validate-repeat-field="slave" role="master" />' +
            '<input type="text" ng-model="slave" name="slave" validate-repeat-field="master" role="slave" />' +
          '</form>'
        );

        expect(function() {
          $compile(element)($scope);
          $scope.$digest();
        }).not.to.throw('validateRepeatField: You can not use roles different from master and slave');
      }));
    });

  describe('Attributes', function() {
    it('should throw error if name attribute is missing', inject(function($compile, $rootScope) {
      var $scope = $rootScope;
      var element = angular.element(
        '<form name="form" novalidate>' +
          '<input type="text" ng-model="master" validate-repeat-field="slave" role="master" />' +
        '</form>'
      );

      expect(function() {
        $compile(element)($scope);
        $scope.$digest();
      }).to.throw('validateRepeatField: Name attribute should be specified');
    }));

    it('should throw error if role attribute is missing', inject(function($compile, $rootScope) {
      var $scope = $rootScope;
      var element = angular.element(
        '<form name="form" novalidate>' +  
          '<input type="text" ng-model="master" name="master" validate-repeat-field="slave" />' +
        '</form>'
      );

      expect(function() {
        $compile(element)($scope);
        $scope.$digest();
      }).to.throw('validateRepeatField: role attribute should be specified');
    }));
  });

  describe('Matching', function() {
    var $scope;
    var form;
    beforeEach(inject(function($compile, $rootScope) {
      $scope = $rootScope;
      var element = angular.element(
        '<form name="form" novalidate>' +
          '<input type="text" ng-model="master" name="master" validate-repeat-field="slave" role="master" />' +
          '<input type="text" ng-model="slave" name="slave" validate-repeat-field="master" role="slave" />' +
        '</form>'
      );
      $compile(element)($scope);
      $scope.$digest();
      form = $scope.form;
    }));

    it('should set error if the fields doesn\'t match', inject(function($compile, $rootScope) {
      form.master.$setViewValue("u@u.com");
      form.slave.$setViewValue("else@else.com");

      expect(form.slave.$invalid).to.be.ok;
      expect(form.slave.$valid).not.to.be.ok;
      expect(form.slave.$error.equalFieldValue).to.be.ok;
    }));

    it("should match if master is entered after slave and they are different", function() {
      form.slave.$setViewValue("slave@com.com");
      form.master.$setViewValue("master@master.com");

      expect(form.slave.$invalid).to.be.ok;
      expect(form.slave.$valid).not.to.be.ok;
      expect(form.slave.$error.equalFieldValue).to.be.ok;
    });

    it("should validate if they are the same", function() {
      form.master.$setViewValue("master@master.com");
      form.slave.$setViewValue("master@master.com");

      expect(form.slave.$valid).to.be.ok;
    });

    it("should validate if the same and master if after slave", function() {
      form.slave.$setViewValue("master@master.com");
      form.master.$setViewValue("master@master.com");

      expect(form.slave.$valid).to.be.ok;
    });

    it("should NOT be valid if master field is changed", function() {
      form.master.$setViewValue("match@match.com");
      form.slave.$setViewValue("match@match.com");
      expect(form.slave.$error.equalFieldValue).not.to.be.ok;

      form.master.$setViewValue("blahblah@gmail.bg");
      expect(form.slave.$error.equalFieldValue).to.be.ok;
    });

    it("should NOT be valid if slave field is changed", function() {
      form.master.$setViewValue("match@match.com");
      form.slave.$setViewValue("match@match.com");
      expect(form.slave.$error.equalFieldValue).not.to.be.ok;

      form.slave.$setViewValue("blahblah@gmail.bg");
      expect(form.slave.$error.equalFieldValue).to.be.ok;
    });
  });

});