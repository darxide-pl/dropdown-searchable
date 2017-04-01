;(function ( $ ) {
 
    $.fn.searchable = function( options ) {

    	return this.each(function() {

	        let settings = $.extend({
	        	data : null,
	        	feed : null,
	        	placeholder : 'search', 
	        	delay : 0,
	        }, options , true), 
	        	self = $(this),
	        	dropdown = self.find('.dropdown-menu'),
	        	query,
	        	classname = 'dropdown-searchable',
	        	input = function() {
		 			self
		 				.find('.dropdown-menu')
		 				.prepend(function() {
		 					let html = ''
		 					html += '<li class="'+classname+'__wrapper" style="padding:0 15px">'
		 					html += '<input type="text" class="form-control '+classname+'__finder" placeholder="'+settings.placeholder+'" />'
		 					html += '</li>'
		 					return html
		 				})
		 		}, 
		 		finder = function() {
		 			self
		 				.find('.'+classname+'__finder')
		 				.bind('keyup' , function() {
		 					let el = $(this)
		 					offset(function() {
			 					query = el.val().toLowerCase() || ''
			 					self.trigger('beforeSearch')

			 					if (settings.data == null && settings.feed == null) search.static()
			 					if (settings.data != null && settings.feed == null) search.data()
			 					if (settings.feed != null) search.feed()
		 					}, settings.delay)
		 				})

		 			query = self.find('.'+classname+'__finder').val() || ''
					if (settings.data != null && settings.feed == null) search.data()
					if (settings.feed != null) search.feed()
						
		 		}, 
		 		search = {
		 			static : function() {
		 				let i = 0 

		 				self
		 					.find('li')
		 					.not('.'+classname+'__wrapper')
		 					.each(function() {
		 						if($(this).text().toLowerCase().indexOf(query) > -1) {
		 							$(this).show()
		 							++i
		 						} else {
		 							$(this).hide()
		 						}
		 					})

		 				i == 0 && self.trigger('notFound')
		 				self.trigger('afterSearch')
		 			}, 
		 			data : function() {
		 				let i = 0
		 				clean()

		 				for(var k in settings.data) {
		 					if(settings.data[k].text.toLowerCase().indexOf(query) > -1) {
			 					dropdown.append(render(
			 							settings.data[k].href, 
			 							settings.data[k].text
			 						))
			 					++i
		 					}
		 				}

		 				i == 0 && self.trigger('notFound')
		 				self.trigger('afterSearch')
		 			}, 
		 			feed : function() {
		 				$.post(settings.feed+'?query='+query)
		 				.done(function(data) {
			 				clean()
		 					var response = JSON.parse(data)
		 					!response.length && self.trigger('notFound')

		 					if(response.length) {
		 						for(var k in response) {
		 							dropdown.append(render(
		 									response[k].href, 
		 									response[k].text
		 								))
		 						}
		 					}

		 				}).fail(function() {
		 					clean()
		 					self.trigger('notFound')
		 				})

		 				self.trigger('afterSearch')
		 			}
		 		}, 
		 		render = function(href, text) {
		 			return '<li><a href="'+href+'">'+text+'</a></li>'
		 		}, 
		 		clean = function() {
	 				self
	 					.find('li')
	 					.not('.'+classname+'__wrapper')
	 					.remove()		 			
		 		}, 
		 		offset = (function(){
		 			var timer = 0;
		 			return function(callback, ms){
		 				clearTimeout (timer)
		 				timer = setTimeout(callback, ms)
		 			}
		 		})()


	 		input()
	 		finder()
    	})
 	
    };
 
}( jQuery ));