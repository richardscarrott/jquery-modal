/*
 * jQuery Modal Plugin v0.1.4
 *
 * Copyright (c) 2011 Richard Scarrott
 * http://www.richardscarrott.co.uk
 *
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */
 
(function ($, undefined) {

	$.modal = function (content, options) {
		$.modal._open(content, options);
	};
	
	$.extend($.modal, {
	
		version: '0.1.4',
		
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
			openSpeed: 'fast',
			closeSpeed: 'fast',
			closeText: 'close X',
			extraClasses: null,
			position: null, // [top, left],
			closeSelector: '.modal-content-close',
			closeKeyCode: 27, // Esc,
			closeOverlay: true,
			overlayOpacity: 0.5,
			
			// callbacks
			init: $.noop,
			beforeOpen: $.noop,
			afterOpen: $.noop,
			beforeClose: $.noop,
			afterClose: $.noop
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
			.appendTo('body');
			
			this.objects.modal.appendTo('body');

			this.objects.win = $(window);
			this.objects.doc = $(document);
			this.objects.html = $('html');
			
			return;
		},
		
		_events: function () {
			
			var self = this,
				closeSelector = this.options.closeSelector ?
					this.options.closeSelector + ', .modal-close' : '.modal-close';
			
			this.objects.modal
				.delegate(closeSelector, 'click.modal', function (e) {
					e.preventDefault();
					
					self.close();
					
				});
			
			this.objects.overlay
				.bind('click.modal', function (e) {
					if (self.options.closeOverlay) {
						self.close();
					}
				});
			
			this.objects.win
				.bind('resize.modal', function () {
					self.refresh();
				});
			
			this.objects.doc
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
			
			speed = this.isOpen ? 0 : this.options.openSpeed;
			
			this.objects.content.empty();
			
			if (content) {
				this.objects.content.append(content);
			}
			
			this._resetStyles();
			this._setIsOpen(false);

			this.objects.modal
				.removeClass()
				// add '.modal' back as it's been removed above (cannot just remove extraClasses, in cases where extraClasses have changed) 
				.addClass(this.options.extraClasses ? 'modal ' + this.options.extraClasses : 'modal')
				.css(this._getPosition());
			
			this.options.beforeOpen(this.objects);
			this._setIsOpen(true);

			this.objects.modal.fadeIn(speed, function () {
				self.options.afterOpen(self.objects);
			});
			
			if (this.options.modal) {
				this._sizeOverlay();
				this.objects.overlay.fadeTo(speed, this.options.overlayOpacity);
			}
			
			return;
		},

		_setIsOpen: function (val) {
			
			if (val) {
				this.isOpen = true;
				this.objects.html.addClass('modal-isopen');
			}
			else {
				this.isOpen = false;
				this.objects.html.removeClass('modal-isopen');
			}

			return;
		},

		// sets height of overlay to that of document, means it's no longer
		// relying on fixed positioning (touch devices + IE6) and body can
		// be height: 100%
		_sizeOverlay: function () {
				
			this.objects.overlay
				.height(this.objects.doc.height());
			
			return;
		},
		
		refresh: function () {
			
			if (this.isOpen) {
				
				this._resetStyles();
				this._setIsOpen(false);

				this.objects.modal
					.css(this._getPosition())
					.show();

				this._setIsOpen(true);
				
				if (this.options.modal) {
					this._sizeOverlay();
					this.objects.overlay
						.css('opacity', this.options.overlayOpacity)
						.show();
				}
			}
			
			return;
		},
		
		// updates modal with new content, options will persist
		update: function (newContent, options) {
			
			if (this.isOpen) {
				this._open(newContent, $.extend(this.options, options));
			}
			
            return;
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
				speed = animate || animate === undefined ? this.options.closeSpeed : 0;
			
			this.options.beforeClose(this.objects);
			
			this.objects.modal.fadeOut(speed, function () {
			
				self._resetStyles();
				self._setIsOpen(false);
				self.options.afterClose(self.objects);
				
			});

			if (this.options.modal) {
				this.objects.overlay.fadeOut(speed);
			}
			
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
					x: this.objects.win.width() - boxModelWidth,
					y: this.objects.win.height() - boxModelHeight
				},
				scrollPos = {
					x: this.objects.doc.scrollLeft(),
					y: this.objects.doc.scrollTop()
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
			
            this.objects.win.unbind('.modal');
			this.objects.doc.unbind('.modal');
			this.objects.modal.remove();
			this.objects.overlay.remove();
			this._setIsOpen(false);
			this.isInitialized = false;
			delete this.objects;
			delete this.options;
			
            return;
		}
		
	});
	
})(jQuery);