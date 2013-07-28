angular.module('directives', []).directive('typeahead', function($timeout) {
	return function(scope, element, attrs) {
		console.log("Creating typeahead");

		scope[attrs.queryObject].query(function(data) {
			var list = [];
			var searchAttr = attrs.queryAttr;
			data.forEach(function(o, i) {
				if (searchAttr) {
					list.push(o[searchAttr]);
				} else {
					list.push(o);
				}
			});
			$(element).typeahead({
				name: attrs.typeahead,
				local: list
			});
		});

		
	};
});