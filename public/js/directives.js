angular.module('directives', []).directive('typeahead', function($timeout) {
	return {
		link: function postLink(scope, element, attrs) {
			console.log("Creating typeahead");

			scope[attrs.queryObject].query(function(data) {
				console.dir(data);
				var list = [];
				var searchAttr = attrs.queryAttr;
				data.forEach(function(o, i) {
					var obj = {
						value: o[searchAttr],
						data: o
					}

					list.push(obj);
					
				});
				$(element).typeahead({
					name: attrs.typeahead,
					local: list
				});
			});

			$(element).on('typeahead:selected', function(ev, obj, collection) {
				console.dir(obj);
				console.dir(collection);

				// if (!scope[attrs.typeahead])
				// 	scope[attrs.typeahead] = {};

				// scope[attrs.typeahead].selected = obj;
				// scope.$apply(function() {
				// 	controller.$setViewValue('lol');
				// });
				scope.$apply(function() {
					scope.select(obj.data);
				});
				
				
			});

			
		}
	};
});