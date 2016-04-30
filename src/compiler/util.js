'use strict';"use strict";
var lang_1 = require('angular2/src/facade/lang');
exports.MODULE_SUFFIX = lang_1.IS_DART ? '.dart' : '';
var CAMEL_CASE_REGEXP = /([A-Z])/g;
var DASH_CASE_REGEXP = /-([a-z])/g;
function camelCaseToDashCase(input) {
    return lang_1.StringWrapper.replaceAllMapped(input, CAMEL_CASE_REGEXP, function (m) { return '-' + m[1].toLowerCase(); });
}
exports.camelCaseToDashCase = camelCaseToDashCase;
function dashCaseToCamelCase(input) {
    return lang_1.StringWrapper.replaceAllMapped(input, DASH_CASE_REGEXP, function (m) { return m[1].toUpperCase(); });
}
exports.dashCaseToCamelCase = dashCaseToCamelCase;
function splitAtColon(input, defaultValues) {
    var parts = lang_1.StringWrapper.split(input.trim(), /\s*:\s*/g);
    if (parts.length > 1) {
        return parts;
    }
    else {
        return defaultValues;
    }
}
exports.splitAtColon = splitAtColon;
function sanitizeIdentifier(name) {
    return lang_1.StringWrapper.replaceAll(name, /\W/g, '_');
}
exports.sanitizeIdentifier = sanitizeIdentifier;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtcmFTb0o1WHgudG1wL2FuZ3VsYXIyL3NyYy9jb21waWxlci91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxxQkFBb0QsMEJBQTBCLENBQUMsQ0FBQTtBQUVwRSxxQkFBYSxHQUFHLGNBQU8sR0FBRyxPQUFPLEdBQUcsRUFBRSxDQUFDO0FBRWxELElBQUksaUJBQWlCLEdBQUcsVUFBVSxDQUFDO0FBQ25DLElBQUksZ0JBQWdCLEdBQUcsV0FBVyxDQUFDO0FBRW5DLDZCQUFvQyxLQUFhO0lBQy9DLE1BQU0sQ0FBQyxvQkFBYSxDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRSxpQkFBaUIsRUFDeEIsVUFBQyxDQUFDLElBQU8sTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNyRixDQUFDO0FBSGUsMkJBQW1CLHNCQUdsQyxDQUFBO0FBRUQsNkJBQW9DLEtBQWE7SUFDL0MsTUFBTSxDQUFDLG9CQUFhLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLGdCQUFnQixFQUN2QixVQUFDLENBQUMsSUFBTyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0UsQ0FBQztBQUhlLDJCQUFtQixzQkFHbEMsQ0FBQTtBQUVELHNCQUE2QixLQUFhLEVBQUUsYUFBdUI7SUFDakUsSUFBSSxLQUFLLEdBQUcsb0JBQWEsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQzFELEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyQixNQUFNLENBQUMsS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUFDLElBQUksQ0FBQyxDQUFDO1FBQ04sTUFBTSxDQUFDLGFBQWEsQ0FBQztJQUN2QixDQUFDO0FBQ0gsQ0FBQztBQVBlLG9CQUFZLGVBTzNCLENBQUE7QUFFRCw0QkFBbUMsSUFBWTtJQUM3QyxNQUFNLENBQUMsb0JBQWEsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNwRCxDQUFDO0FBRmUsMEJBQWtCLHFCQUVqQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJU19EQVJULCBTdHJpbmdXcmFwcGVyLCBNYXRoLCBpc0JsYW5rfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuXG5leHBvcnQgdmFyIE1PRFVMRV9TVUZGSVggPSBJU19EQVJUID8gJy5kYXJ0JyA6ICcnO1xuXG52YXIgQ0FNRUxfQ0FTRV9SRUdFWFAgPSAvKFtBLVpdKS9nO1xudmFyIERBU0hfQ0FTRV9SRUdFWFAgPSAvLShbYS16XSkvZztcblxuZXhwb3J0IGZ1bmN0aW9uIGNhbWVsQ2FzZVRvRGFzaENhc2UoaW5wdXQ6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBTdHJpbmdXcmFwcGVyLnJlcGxhY2VBbGxNYXBwZWQoaW5wdXQsIENBTUVMX0NBU0VfUkVHRVhQLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChtKSA9PiB7IHJldHVybiAnLScgKyBtWzFdLnRvTG93ZXJDYXNlKCk7IH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGFzaENhc2VUb0NhbWVsQ2FzZShpbnB1dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIFN0cmluZ1dyYXBwZXIucmVwbGFjZUFsbE1hcHBlZChpbnB1dCwgREFTSF9DQVNFX1JFR0VYUCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAobSkgPT4geyByZXR1cm4gbVsxXS50b1VwcGVyQ2FzZSgpOyB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNwbGl0QXRDb2xvbihpbnB1dDogc3RyaW5nLCBkZWZhdWx0VmFsdWVzOiBzdHJpbmdbXSk6IHN0cmluZ1tdIHtcbiAgdmFyIHBhcnRzID0gU3RyaW5nV3JhcHBlci5zcGxpdChpbnB1dC50cmltKCksIC9cXHMqOlxccyovZyk7XG4gIGlmIChwYXJ0cy5sZW5ndGggPiAxKSB7XG4gICAgcmV0dXJuIHBhcnRzO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBkZWZhdWx0VmFsdWVzO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzYW5pdGl6ZUlkZW50aWZpZXIobmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIFN0cmluZ1dyYXBwZXIucmVwbGFjZUFsbChuYW1lLCAvXFxXL2csICdfJyk7XG59XG4iXX0=