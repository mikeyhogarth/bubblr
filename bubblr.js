;(function ( $, window, document, undefined ) {

	var pluginName = "bubblr";
	
    var defaults = {
	
			numberOfBubbles: 10,
            backgroundColor: "Blue",
			bubbleColor: "White",
			bubbleOpacity: .7,
			bubbleMinSize: 1,
			bubbleMaxSize: 2,
			bubbleMaxSpeed: 2,
			bubbleMinSpeed: 1,
			
        };

    // The actual plugin constructor
    function Bubblr( element, options ) {
        this.element = element;
        this.options = $.extend( {}, defaults, options) ;
        this._defaults = defaults;
        this.init();
    }

 	Bubblr.prototype.init = function () {

		if(this.element.getContext) {
			this.ctx = this.element.getContext("2d");
		}
		else { 
			return; 
		}
		
		$canvas = $(this.element);

		this.width = $canvas.width();
		this.height = $canvas.height();
		
		$canvas.css("background-color", this.options.backgroundColor)
		
		this.bubbles = new Array();
		
		for(i = 0; i < this.options.numberOfBubbles; i++) {
			this.bubbles[i] = this.generateBubble();
		}
		
		for(i in this.bubbles) {
			this.drawBubble(this.bubbles[i]);	
		}
		
		var self = this;
		
		setInterval(function() {
			self.animationLoop();
			}, 10);

    };

	
	Bubblr.prototype.animationLoop = function() {
		
		this.clear();
					
		for(i in this.bubbles) {
			this.update(i, this.bubbles[i]);
			this.draw(i, this.bubbles[i]);
		}
		
	};
	
	Bubblr.prototype.clear = function () {
		this.ctx.globalAlpha = 1;
		this.ctx.fillStyle = this.options.backgroundColor;
		this.ctx.fillRect(0,0,this.width, this.height);
	};

	Bubblr.prototype.draw = function (index, bubble) {	
			this.ctx.globalAlpha = this.options.bubbleOpacity;
			this.drawBubble(bubble);
	};
	
	Bubblr.prototype.update = function (index, bubble) {
			bubble.y = bubble.y - bubble.speed
						
			if(bubble.y < 0)
				this.bubbles[index] = this.generateBubble(true);
	};

	
	Bubblr.prototype.drawBubble = function(bubble) {
		this.ctx.fillStyle = this.options.bubbleColor;
		this.ctx.beginPath();
		this.ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI*2, true);
		this.ctx.closePath();
		this.ctx.fill();
	};
	
	Bubblr.prototype.generateBubble = function(start_y_at_zero) {
		var bubble = new Object();
		bubble.x = this.randomize(1,this.width);
		
		if(start_y_at_zero) {
			bubble.y = this.height;
		}
		else {
			bubble.y = this.randomize(1,this.height);	
		}
		
		
		bubble.radius = this.randomize(this.options.bubbleMinSize, this.options.bubbleMaxSize);
		bubble.speed = this.randomize(this.options.bubbleMinSpeed, this.options.bubbleMaxSpeed);
		return bubble;
	};
	
	Bubblr.prototype.randomize = function(min,max) {
		return Math.floor((Math.random()*max)+min); 
	};
	
   

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                new Bubblr( this, options ));
            }
        });
    }

})( jQuery, window, document );
