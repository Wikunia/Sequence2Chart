var canvas = document.getElementById('seqCanvas');
var prime_array = new Array;
var tooltip_array = new Array;
var max_nr;
var square_length = 10; // length of a side of the square 
// ! Width and height of canvas should be divisible by square_length
if (canvas && canvas.getContext) {
   var ctx = canvas.getContext("2d");
   if (ctx) {
		draw_diagram();
	}
}

function draw_diagram() {
  max_nr = (ctx.canvas.width/square_length)*(ctx.canvas.height/square_length); // get maximum number

  /* Black background */
  ctx.fillStyle = "black"; 
  ctx.fillRect(0,0,ctx.canvas.width, ctx.canvas.height);
  
  array_fib = new Array(0,1); // first and second fibonacci number
  point(0,"fib");
  var change_fib = true;
  for (var i=1; i < max_nr; i++) {
	 // Fibonacci
	 if (change_fib) {
		 var next_fib = array_fib[0]+array_fib[1];
		 var current_fib = array_fib[1];
		 array_fib[0] = current_fib;
		 array_fib[1] = next_fib;
	}
	 
	 //Prime
	 var bool_prime = check_prime(i);
	 
	 if (bool_prime && i == next_fib) {
		point(i,"prime_fib");
		change_fib = true;
	 } else if (bool_prime) {
		point(i,"prime");
		change_fib = false;
	 } else if (i == next_fib) {
		point(i,"fib");
		change_fib = true;
	 } else {
		change_fib = false;
	}
  }
}

function point(i,type) {
	tooltip_array.push(new Array(i,type));
	switch(type) {
		case "prime_fib":
			ctx.fillStyle = "green";	
			break;
		case "prime":
			ctx.fillStyle = "blue";
			break;
		case "fib":
			ctx.fillStyle = "red";
			break;
	}
	var coors = get_coordinates(i);
	ctx.fillRect(coors[0],coors[1],square_length,square_length);
}

function get_coordinates(i) {
	return new Array((square_length*i)%ctx.canvas.width,square_length*Math.floor(square_length*i/ctx.canvas.width)); // first is x coordinate second y
}

 
function check_prime(nr) {
	// 0 and 1 aren't prime
	if (nr == 0 || nr == 1) { return false; } 
	for(var i = 0; i <= prime_array.length; i++) {
		if (prime_array[i] > Math.sqrt(nr)) { prime_array.push(nr); return true; } // divisor can't be higher than sqrt(nr)
		if (nr % prime_array[i] == 0) {
			return false;
		}
	}
	if (prime_array.length == 1801) { // length of javascript array has a maximum 
		for(var i = prime_array[1800]; i <= Math.sqrt(nr); i++) {
			if (nr % i == 0) {
				return false;
			}
		}
	} else {
		prime_array.push(nr);
	}
	return true;
}
 
 
 /* Tooltip function */
var width = ctx.canvas.width,
	height = ctx.canvas.height;

savedState = null;

var tooltips = [],
		defaults = {
			tooltips: {
				background: 'rgba(0,0,0,0.6)',
				fontFamily : "'Times New Roman'",
				fontStyle : "normal",
				fontColor: 'white',
				fontSize: '12px',
				labelTemplate: '<%=label%>',
				padding: {
					top: 10,
					right: 10,
					bottom: 10,
					left: 10
				},
				offset: {
					left: 0,
					top: 0
				},
				border: {
					width: 0,
					color: '#000'
				},
				showHighlight: true,
				highlight: {
					stroke: {
						width: 1,
						color: 'rgba(230,230,230,0.25)'
					},
					fill: 'rgba(255,255,255,0.25)'
				}
			}
		},
		options = (options) ? mergeChartConfig(defaults, options) : defaults;

	function registerTooltip(ctx,areaObj,data) {
		tooltips.push(new Tooltip(
			ctx,
			areaObj,
			data
		));
	}

	var Tooltip = function(ctx, areaObj, data) {
		this.ctx = ctx;
		this.areaObj = areaObj;
		this.data = data;
		this.savedState = null;
		this.highlightState = null;
		this.x = null;
		this.y = null;

		this.inRange = function(x,y) {
			if(this.areaObj.type) {
				switch(this.areaObj.type) {
					case 'rect':
						return (x >= this.areaObj.x && x <= this.areaObj.x+this.areaObj.width) &&
						   (y >= this.areaObj.y && y <= this.areaObj.y+this.areaObj.height);
						   break;
					case 'circle':
						return ((Math.pow(x-this.areaObj.x, 2)+Math.pow(y-this.areaObj.y, 2)) < Math.pow(this.areaObj.r,2));
						break;
					case 'shape':
						var poly = this.areaObj.points;
						for(var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
							((poly[i].y <= y && y < poly[j].y) || (poly[j].y <= y && y < poly[i].y))
							&& (x < (poly[j].x - poly[i].x) * (y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
							&& (c = !c);
						return c;
						break;
				}
			}
		}

		this.render = function(x,y) {
			if(this.savedState == null) {
				this.ctx.putImageData(savedState,0,0);
				this.savedState = this.ctx.getImageData(0,0,this.ctx.canvas.width,this.ctx.canvas.height);
			}
			this.ctx.putImageData(this.savedState,0,0);
			if(options.tooltips.showHighlight) {
				if(this.highlightState == null) {
					this.ctx.strokeStyle = options.tooltips.highlight.stroke.color;
					this.ctx.lineWidth = options.tooltips.highlight.stroke.width;
					this.ctx.fillStyle = options.tooltips.highlight.fill;
					switch(this.areaObj.type) {
						case 'rect':
							this.ctx.strokeRect(this.areaObj.x, this.areaObj.y, this.areaObj.width, this.areaObj.height);
							this.ctx.fillStyle = options.tooltips.highlight.fill;
							this.ctx.fillRect(this.areaObj.x, this.areaObj.y, this.areaObj.width, this.areaObj.height);
							break;
						case 'circle':
							this.ctx.beginPath();
							this.ctx.arc(this.areaObj.x, this.areaObj.y, this.areaObj.r, 0, 2*Math.PI, false);
							this.ctx.stroke();
							this.ctx.fill();
							break;
						case 'shape':
							this.ctx.beginPath();
							this.ctx.moveTo(this.areaObj.points[0].x, this.areaObj.points[0].y);
							for(var p in this.areaObj.points) {
								this.ctx.lineTo(this.areaObj.points[p].x, this.areaObj.points[p].y);
							}
							this.ctx.stroke();
							this.ctx.fill();
							break;
					}
					this.highlightState = this.ctx.getImageData(0,0,this.ctx.canvas.width,this.ctx.canvas.height);
				} else {
					this.ctx.putImageData(this.highlightState,0,0);
				}
			}
			//if(this.x != x || this.y != y) {
				var posX = x+options.tooltips.offset.left,
					posY = y+options.tooltips.offset.top,
					tpl = tmpl(options.tooltips.labelTemplate, this.data),
					rectWidth = options.tooltips.padding.left+this.ctx.measureText(tpl).width+options.tooltips.padding.right;
				if(posX + rectWidth > ctx.canvas.width) {
					posX -= posX-rectWidth < 0 ? posX : rectWidth;
				}
				if(posY + 24 > ctx.canvas.height) {
					posY -= 24;
				}
				this.ctx.fillStyle = options.tooltips.background;
				this.ctx.fillRect(posX, posY, rectWidth, 24);
				if(options.tooltips.border.width > 0) {
					this.ctx.fillStyle = options.tooltips.order.color;
					this.ctx.lineWidth = options.tooltips.border.width;
					this.ctx.strokeRect(posX, posY, rectWidth, 24);
				}
				this.ctx.font = options.tooltips.fontStyle+ " "+options.tooltips.fontSize+" " + options.tooltips.fontFamily;
				this.ctx.fillStyle = options.tooltips.fontColor;
				this.ctx.textAlign = 'center';
				this.ctx.textBaseline = 'middle';
				this.ctx.fillText(tpl, posX+rectWidth/2, posY+12);
				this.x = x;
				this.y = y;
			//}
		}
	}
	
	function getPosition(e) {
		var xPosition = 0;
		var yPosition = 0;

		while(e) {
			xPosition += (e.offsetLeft + e.clientLeft);
			yPosition += (e.offsetTop + e.clientTop);
			e = e.offsetParent;
		}
		if(window.pageXOffset > 0 || window.pageYOffset > 0) {
			xPosition -= window.pageXOffset;
			yPosition -= window.pageYOffset;
		} else if(document.body.scrollLeft > 0 || document.body.scrollTop > 0) {
			xPosition -= document.body.scrollLeft;
			yPosition -= document.body.scrollTop;
		}
		return { x: xPosition, y: yPosition };
	}
	
	function tooltipEventHandler(e) {
		if(tooltips.length > 0) {
			savedState = savedState == null ? ctx.getImageData(0,0,ctx.canvas.width,ctx.canvas.height) : savedState;
			var rendered = 0;
			for(var i in tooltips) {
				var position = getPosition(ctx.canvas),
					mx = (e.clientX)-position.x,
					my = (e.clientY)-position.y;
				if(tooltips[i].inRange(mx,my)) {
					my = my > 10 ? my-10 : my;
					mx = my > 10 ? mx : mx+5;
					tooltips[i].render(mx,my);
					rendered++;
				}
			}
			if(rendered == 0) {
				ctx.putImageData(savedState,0,0);
			}
		}
	}
	
	 if (is_touch_device()) {
		ctx.canvas.ontouchstart = function(e) {
			e.clientX = e.targetTouches[0].clientX;
			e.clientY = e.targetTouches[0].clientY;
			tooltipEventHandler(e);
		}
		ctx.canvas.ontouchmove = function(e) {
			e.clientX = e.targetTouches[0].clientX;
			e.clientY = e.targetTouches[0].clientY;
			tooltipEventHandler(e);
		}
	} else {
		ctx.canvas.onmousemove = function(e) {
			tooltipEventHandler(e);
		}
	}
	
  function is_touch_device() {
		return !!('ontouchstart' in window) // works on most browsers 
        || !!('onmsgesturechange' in window); // works on ie10
  };   
  
   function tmpl(str, data){
		// Figure out if we're getting a template, or if we need to
		// load the template - and be sure to cache the result.
		var fn = !/\W/.test(str) ?
		  cache[str] = cache[str] ||
			tmpl(document.getElementById(str).innerHTML) :

		  // Generate a reusable function that will serve as a template
		  // generator (and which will be cached).
		  new Function("obj",
			"var p=[],print=function(){p.push.apply(p,arguments);};" +

			// Introduce the data as local variables using with(){}
			"with(obj){p.push('" +

			// Convert the template into pure JavaScript
			str
			  .replace(/[\r\t\n]/g, " ")
			  .split("<%").join("\t")
			  .replace(/((^|%>)[^\t]*)'/g, "$1\r")
			  .replace(/\t=(.*?)%>/g, "',$1,'")
			  .split("\t").join("');")
			  .split("%>").join("p.push('")
			  .split("\r").join("\\'")
		  + "');}return p.join('');");

		// Provide some basic currying to the user
		return data ? fn( data ) : fn;
	  };
  
  
	for(var i = 0; i < tooltip_array.length; i++) {
		// label is sth. like 1 fibonacci so 1 is a fibonacci number
		var label = tooltip_array[i][0]+' ';
		switch (tooltip_array[i][1]) {
			case "prime_fib": label += "prime & fibonacci"; break;
			case "fib": label += "fibonacci"; break;
			default: label += tooltip_array[i][1];
		}
		
		registerTooltip(ctx,{type:'rect',x:get_coordinates(tooltip_array[i][0])[0],y:get_coordinates(tooltip_array[i][0])[1],width:square_length,height:square_length},{label:label});
	}
 
 
 /* Save diagram */
	function save() {
		var canvas = document.getElementById("seqCanvas");
		canvas.toBlob(function(blob) {
			saveAs(blob,"Fibonacci_and_Primes_"+max_nr+".png");
		});
	}; 
  
 
	
	
	