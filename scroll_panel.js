(function( window){
	var scroll_panel = function( $container){
		this.init( $container);
	}
	scroll_panel.prototype = {
		
		constructor: scroll_panel,
		$dom: null,
		$container: null,
		$scrollBar: null,
		$scrollBtn: null,
		$scrollHeader: null,
		$scrollFooter: null,
		_height: 0,
		_scrollHeight: 0,
		_scrollBtnHeight: 10,
		_top: 0,
		_step: 0,

		_tmp: [
			'<div class="scroll_panel">',
				'<div class="scroll_btn">',
				'</div>',
			'</div>',
		].join(''),

		init: function( $container){
			this.initContainer( $container);
			this.addScrollOccupy();
			this.addScrollPanel();
			this.bindEvent();
		},

		initContainer: function( $container){
			if( !$container){
				return false;
			}
			this.$container = $container;
			this.$container.css('position','relative');
			this.$container.css('overflow','hidden');
			//this.$container.css('margin-top',100);
			//console.log( this.$container);
		},

		addScrollOccupy: function(){
			this.$scrollHeader = $('<div class="scroll_header"></div>');
			this.$container.prepend(this.$scrollHeader);

			this.$scrollFooter = $('<div class="scroll_footer"></div>');
			this.$container.append(this.$scrollFooter);
		},

		addScrollPanel: function(){
			this.$scrollBar = $(this._tmp);
			this.$scrollBtn = this.$scrollBar.find('.scroll_btn');
			this.$scrollBar.appendTo( this.$container);

			this._height = this.$container.height();
			this._scrollHeight = this.$container[0].scrollHeight;

			this.resizePanel();
		},

		resizePanel: function(){
			this._height = this.$container.height();
			//this.$scrollBar.css('height',this._height);

			this._scrollBtnHeight = Math.ceil( this._height * this._height / this._scrollHeight);
			this.$scrollBtn.css('height',this._scrollBtnHeight);

			this._step = 80 / this._scrollHeight * this._height;
	        this._step /= ( this._scrollHeight - this._height) / ( this._height - this._scrollBtnHeight);
		},

		scrollTo: function( top){
			if( top){
				this._top = top;
			}
			if( this._top + this._scrollBtnHeight > this._height){
				/* top值太大 */
				this._top = this._height - this._scrollBtnHeight;
			}
			else if( this._top < 0){
				/* top值小 */
				this._top = 0;
			}
			top = this._top;
			/* 滚动因子 */
			var fac = ( this._scrollHeight - this._height) / ( this._height - this._scrollBtnHeight);
			this.$scrollHeader.css('margin-bottom',-this._top*fac);
			this.$scrollFooter.css('margin-top',this._top*fac);
			this.$scrollBtn.css('top',top);
		},

		bindEvent: function(){
			var self = this;
			b = this.$container[0];
			if( typeof this.$container[0].onmousewheel !== 'undefined'){
				this.$container[0].onmousewheel = function( evt, delta){
					evt = evt || window.event;
					self.mousewheel( evt, delta);
				}
	        }
	        else{
	            this.$container[0].addEventListener("DOMMouseScroll", function(event) {
				    self.mousewheel( event);
				});
			}

			this.$container.resize( function(){
				alert('resize');
				self.resizePanel();
			});

			this.$container.on('focus','a',function(){
				var top = $(this).offset().top - $(this).height();
				top += - self.$container.offset().top + parseInt( self.$scrollFooter.css('margin-top'));
				top *= ( self._height - self._scrollBtnHeight) / ( self._scrollHeight - self._height);
				self.scrollTo( top);
			});
		},

		mousewheel: function(evt, delta){
			evt = evt || window.evt;
	        //evt.preventDefault();
	        //evt.stopPropagation();
	        evt.delta = (evt.wheelDelta) ? evt.wheelDelta / 120 : -(evt.detail || 0) / 3;
	        if( evt.delta < 0){
	            this._top += this._step;
	        }
            else{
	            this._top -= this._step;
	        }
	        this.scrollTo();
	    }

	}
	if( !window.scroll_panel){
		window.scroll_panel = scroll_panel;
	}
})( window);

$(function(){
	window.a = new scroll_panel( $('#comic'));
	
	window.b = new scroll_panel( $('#comic2'));

	window.c = new scroll_panel( $('#trant_rank_list'));
});