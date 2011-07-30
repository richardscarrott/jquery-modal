
// TODO: finish up IE 6 overlay and select box fixes
// namespace bindings and finish destroy method - DONE
// pass useful data back to callbacks (elements etc. - check simplemodal) DONE
// offer options to manually specify position... DONE
// perhaps offer an appendTo option? - DONE
// automatically bind to .modal-close within the content? - DONE

// resize calls before open and afteropen callback events, need to split this out - DONE


// add content to callbacks?

(function ($, undefined) {

	$.modal = function (content, options) {
		$.modal._open(content, options);
	};
	
	$.extend($.modal, {
		
		isInitialized: false,
		
		isOpen: false,
		
		defaults: {
		
			// settings
			width: 'auto',
			height: 'auto',
			maxWidth: 600,
			maxHeight: 600,
			fitViewport: true,
			keepAspect: false,
			modal: true,
			transitionSpeed: 200,
			closeText: 'close X',
			extraClasses: null,
			appendTo: 'body',
			position: null, // [top, left],
			closeSelector: '.modal-content-close', // when content is added to modal, jQuery.modal will find elements matching this class and bind a close event.
			closeKeyCode: 27, // Esc,
			closeOverlay: true,
			
			// callbacks
			init: $.noop,
			beforeOpen: $.noop,
			afterOpen: $.noop,
			beforeClose: $.noop,
			afterClose: $.noop
			//beforeResize: $.noop
		},
		
		_init: function (options) {
			
			this.options = $.extend({}, this.defaults, options);
			
			if (!this.isInitialized) {
				this._objects();
				this._events();
				this.options.init(this.objects);
				this.isInitialized = true;
			}
			
			return;
		},
		
		// creates and adds modal to DOM
		_objects: function() {
		
			this.objects = {};
		
			this.objects.modal = $('<div />', {
				'class': 'modal'
			});
			
			this.objects.content = $('<div />', {
				'class': 'modal-content'
			})
			.appendTo(this.objects.modal);
			
			this.objects.closeBtn = $('<span />', {
				'class': 'modal-close',
				text: this.options.closeText
			})
			.appendTo(this.objects.modal);
			
			this.objects.overlay = $('<div />', {
				'class': 'modal-overlay'
			})
			.appendTo(this.options.appendTo);
			
			this.objects.modal.appendTo(this.options.appendTo);
			
			return;
		},
		
		_events: function () {
			
			var self = this,
				closeSelector = this.options.closeSelector ?
					this.options.closeSelector + ', .modal-close' : '.modal-close';
			
			this.objects.modal.delegate(closeSelector, 'click', function (e) {
				e.preventDefault();
				
				self.close();
				
			});
			
			this.objects.overlay.bind('click.modal', function (e) {
				if (self.options.closeOverlay) {
					self.close();
				}
			});
			
			$(window).bind('resize.modal', function () {
				self.refresh();
			});
			
			$(document)
				.bind('keyup.modal', function (e) {
				
					if (e.keyCode === self.options.closeKeyCode) {
						self.close();
					}
					
				});
			
			return;
		},
		
		// appends contents and opens modal
		_open: function (content, options) {
			
			var self = this,
				speed;
			
			this._init(options);
			
			speed = this.isOpen ? 0 : this.options.transitionSpeed;
			
			this.objects.content.empty();
			
			if (content) {
				this.objects.content.append(content);
			}
			
			this._resetStyles();
			
			this.objects.modal
				.removeClass()
				// add '.modal' back as it's been removed above (cannot just remove extraClasses, in cases where extraClasses have changed) 
				.addClass(this.options.extraClasses ? 'modal ' + this.options.extraClasses : 'modal')
				.css(this._getPosition());
			
			this.options.beforeOpen(this.objects);
			this.objects.modal.fadeIn(speed, function () {
				
				self.objects.modal.addClass('modal-isopen');
				self.options.afterOpen(self.objects);
				
			});
			
			if (this.options.modal) {
				this.objects.overlay.fadeIn(speed);
			}
			
			this.isOpen = true;
			
			return;
		},
		
		refresh: function () {
			
			if (this.isOpen) {
				this._resetStyles();
				this.objects.modal.removeClass('modal-isopen');
				this.objects.modal.css(this._getPosition()).show();
				this.objects.modal.addClass('modal-isopen');
				
				if (this.options.modal) {
					this.objects.overlay.show();
				}
			}
			
			return;
		},
		
		// updates modal with new content, options will persist
		update: function (newContent, options) {
			
			if (this.isOpen) {
				this._open(newContent, $.extend(this.options, options));
			}
			
		},
		
		// helper method to indicate loading
		loading: function (beforeClose) {
			
			this._open(undefined, {
				extraClasses: 'modal-isloading',
				beforeClose: beforeClose || $.noop
			});
			
			return;
		},
		
		close: function (animate) {
		
			var self = this,
				speed = animate || animate === undefined ? this.options.transitionSpeed : 0;
			
			this.options.beforeClose(this.objects);
			
			this.objects.modal.fadeOut(speed, function () {
			
				self._resetStyles();
				self.objects.modal.removeClass('modal-isopen');
				self.options.afterClose(self.objects);
				
			});

			if (this.options.modal) {
				this.objects.overlay.fadeOut(speed);
			}
			
			this.isOpen = false;
			
			return;
		},
		
		// removes all style attributes, NOTE: CSS should hide .modal by default
		_resetStyles: function () {
		
			this.objects.modal
				.add(this.objects.overlay)
					.attr('style', '');
				
			return;
		},
		
		// return top, left, width and height of modal
		_getPosition: function () {
			
			var options = this.options,
				top,
				left,
				width = options.width,
				height = options.height,
				maxWidth = options.maxWidth,
				maxHeight = options.maxHeight,
				oldWidth,
				oldHeight,
				boxModelWidth = this.objects.modal.outerWidth(true) - this.objects.modal.width(), // padding, border, margin
				boxModelHeight = this.objects.modal.outerHeight(true) - this.objects.modal.height(), // padding, border, margin
				viewport = {
					x: $(window).width() - boxModelWidth,
					y: $(window).height() - boxModelHeight
				},
				scrollPos = {
					x: $(document).scrollLeft(),
					y: $(document).scrollTop()
				},
				centreCoords = {
					x: (viewport.x / 2) + scrollPos.x,
					y: (viewport.y / 2) + scrollPos.y
				};
			
			// get natural height
			if (height === 'auto') {
				// ensure that if we set the width to maxWidth when calculating natural height
				// it's actually the smallest it'll ever be, i.e. the viewport might be smaller causing the content to be smaller
				var w = maxWidth > viewport.x ? viewport.x : maxWidth;
				
				// if container width is auto or exceeds maxwidth set to maxwidth else set to container width
				this.objects.modal.width(maxWidth && width === 'auto' || maxWidth && width > maxWidth ? w : width);
				height = this.objects.modal.height();
				this.objects.modal.width('');
			}
			
			// get natural width
			if (width === 'auto') {
				var h = maxHeight > viewport.y ? viewport.y : maxHeight;
				// we know here that height will bo longer be 'auto'
				this.objects.modal.height(maxHeight && height > maxHeight ? h : height);
				width = this.objects.modal.width();
				this.objects.modal.height('');
			}
			
			// set old width to then calculate aspect (before it possibly gets skewed by maxwidth and maxheight)
			oldWidth = width;
			oldHeight = height;
			
			// check maxWidth and maxHeight
			width = maxWidth && width > maxWidth ? maxWidth : width;
			height = maxHeight && height > maxHeight ? maxHeight : height;
			
			// check modal fits in viewport
			if (options.fitViewport) {
				width = width > viewport.x ? viewport.x : width;
				height = height > viewport.y ? viewport.y : height;
			}
			
			// check aspect ratio
			if (options.keepAspect) {
				var h = height; // current height
				
				height = oldHeight * width / oldWidth;
				
				// if h is greater than height then adjust width instead
				if (height > h) {
					width = oldWidth * h / oldHeight;
					height = h;
				}
			}
			
			if ($.isArray(this.options.position)) {
				top = this.options.position[0];
				left = this.options.position[1];
			}
			else {
				// set coords
				top = centreCoords.y - (height / 2);
				left = centreCoords.x - (width / 2);
				
				// check popup doesn't display outisde of document
				if (!options.fitViewport) {
					top = top < scrollPos.y ? scrollPos.y : top;
					left = left < scrollPos.x ? scrollPos.x : left;
				}
			}

			return {
				width: width,
				height: height,
				top: top,
				left: left
			}
		},
		
		// removes modal from DOM
		destroy: function () {
			
			this.objects.modal.remove();
			this.objects.overlay.remove();
			$(window).unbind('.modal');
			this.isOpen = false;
			this.isInitialized = false;
			
		}
		
	});
	
})(jQuery);

// some IE6 nonsense
(function ($, modal, undefined) {

	var lteIe6 = $.browser.msie && $.browser.version.substr(0, 1) <= 6;
	
	if (true) {
	
		var _events = modal._events,
			open = modal._open,
			close = modal.close,
			selectBoxes;
			
		$.extend(modal, {
			
			_events: function (options) {
			
				var self = this;
				
				_events.apply(this, arguments);
				
				// dom ready
				selectBoxes = $('select');
				
				$(window).bind('resize.modal', function () {
				
					if (self.isOpen) {
						self._sizeOverlay();
					}
					
				});
				
				return;
			},
			
			_open: function (content, options, animate) {
				
				open.apply(this, arguments);
				selectBoxes.css('visibility', 'hidden');
				this._sizeOverlay();
				
				return;
			},
			
			close: function () {
				
				var self = this;
				
				close.apply(this, arguments);
				
				setTimeout(function () {
				
					selectBoxes.css('visibility', '');
				
				}, this.options.transitionSpeed);
				
				return;
			},
			
			_sizeOverlay: function () {
				
				var doc = $(document);
					
				this.objects.overlay
					.width(doc.width())
					.height(doc.height());
				
				return;
			}
			
		});
	
	}
	
})(jQuery, $.modal);