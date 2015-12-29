[![Build Status](https://travis-ci.org/ibetovski/angularjs-validation-repeat-field.svg?branch=master)](https://travis-ci.org/ibetovski/angularjs-validation-repeat-field)

# Synopsis:
Two way matching repeat field for HTML forms. You can use that directive for repeat password or repeat email address scenarios for your HTML form.

### Installation:
First you have to install the module as a dependancy to your project:
```bash
$ bower install angularjs-validation-repeat-field --save
```

Then you have to add it to your scripts:
```html
<script type="text/javascript" src="bower_components/angularjs-validation-repeat-field.js"></script>
```

And you have to add the module to your module dependancies:
```js
angular.module('MyApp', ['ValidationRepeatField']);
```

### Usage:
You have to teach two html input fields to know each other by telling them which role they are playing - `master` or `slave`.
Add `master` for password and `slave` for repeat password.

Attributes you have to specify:
* ng-model
* validate-repeat-field
* role
* name

```html
<form name="form">
  <!-- master field -->
  <label for="email">Email:</label>
  <input
    <!-- You have to specify your input name -->
    <!-- Keep the user's input -->
    ng-model="modelData.email"
    <!-- Activate the directive and tell it which field it is related to -->
    validate-repeat-field="email_repeat"
    <!-- Which role this field is playing -->
    matching-role="master"
    <!-- This is how your field will be populated to the form object -->
    name="email"
    type="email"
    id="email"
     /><br />

  <!-- slave field -->
  <label for="email_repeat">Repeat email:</label>
  <input
    no-validate
    type="email"
    name="email_repeat"
    id="email_repeat"
    ng-model="modelData.emailRepeat"
    validate-repeat-field="email"
    matching-role="slave"/><br />
</form>
```

The directive expects to find `form` in the current scope. If you use different form name you can tell the directive which name to look for:
```html
<form name="myForm">
  <input form="myForm"
   ...
  />
</form>

If you like to print an error message in you HTML you can use [`ngMessages`](https://github.com/angular/bower-angular-messages):
```html
<p ng-messages="form.email_repeat.$error" role="alert" style="color:red">
  <!-- Replace equalFieldValue with your custom error message if such is configured -->
  <span ng-message="equalFieldValue">Your email doesn't match</span>
</p>
```

### Configuration:
By default `equalFieldValue` will be set to `form.$error` which will set `ng-invalid-equal-field-value` css class name to your input field when the field values don't match. You can change that by adding the next snippet in your `module.config()` scope:
```js
// require the configuration provider:
module.config(['validateRepeatFieldConfigProvider', function(validateRepeatFieldConfigProvider) {

  // set the error name you like:
  validateRepeatFieldConfigProvider.setErrorName('customErrorName');

}]);
```

### Tests:
```bash
$ npm install
$ bower install
$ npm test
```

### MIT License