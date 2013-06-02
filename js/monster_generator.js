///#source 1 1 /monsters/js/lib/bootbox.min.js
/**
 * bootbox.js v3.0.0
 *
 * http://bootboxjs.com/license.txt
 */
var bootbox=window.bootbox||function(v,n){function h(b,a){null==a&&(a=r);return"string"===typeof l[a][b]?l[a][b]:a!=s?h(b,s):b}var r="en",s="en",t=!0,q="static",u="",g={},m={setLocale:function(b){for(var a in l)if(a==b){r=b;return}throw Error("Invalid locale: "+b);},addLocale:function(b,a){"undefined"===typeof l[b]&&(l[b]={});for(var c in a)l[b][c]=a[c]},setIcons:function(b){g=b;if("object"!==typeof g||null==g)g={}},alert:function(){var b="",a=h("OK"),c=null;switch(arguments.length){case 1:b=arguments[0];
break;case 2:b=arguments[0];"function"==typeof arguments[1]?c=arguments[1]:a=arguments[1];break;case 3:b=arguments[0];a=arguments[1];c=arguments[2];break;default:throw Error("Incorrect number of arguments: expected 1-3");}return m.dialog(b,{label:a,icon:g.OK,callback:c},{onEscape:c||!0})},confirm:function(){var b="",a=h("CANCEL"),c=h("CONFIRM"),e=null;switch(arguments.length){case 1:b=arguments[0];break;case 2:b=arguments[0];"function"==typeof arguments[1]?e=arguments[1]:a=arguments[1];break;case 3:b=
arguments[0];a=arguments[1];"function"==typeof arguments[2]?e=arguments[2]:c=arguments[2];break;case 4:b=arguments[0];a=arguments[1];c=arguments[2];e=arguments[3];break;default:throw Error("Incorrect number of arguments: expected 1-4");}var j=function(){"function"===typeof e&&e(!1)};return m.dialog(b,[{label:a,icon:g.CANCEL,callback:j},{label:c,icon:g.CONFIRM,callback:function(){"function"===typeof e&&e(!0)}}],{onEscape:j})},prompt:function(){var b="",a=h("CANCEL"),c=h("CONFIRM"),e=null,j="";switch(arguments.length){case 1:b=
arguments[0];break;case 2:b=arguments[0];"function"==typeof arguments[1]?e=arguments[1]:a=arguments[1];break;case 3:b=arguments[0];a=arguments[1];"function"==typeof arguments[2]?e=arguments[2]:c=arguments[2];break;case 4:b=arguments[0];a=arguments[1];c=arguments[2];e=arguments[3];break;case 5:b=arguments[0];a=arguments[1];c=arguments[2];e=arguments[3];j=arguments[4];break;default:throw Error("Incorrect number of arguments: expected 1-5");}var d=n("<form></form>");d.append("<input autocomplete=off type=text value='"+
j+"' />");var j=function(){"function"===typeof e&&e(null)},k=m.dialog(d,[{label:a,icon:g.CANCEL,callback:j},{label:c,icon:g.CONFIRM,callback:function(){"function"===typeof e&&e(d.find("input[type=text]").val())}}],{header:b,show:!1,onEscape:j});k.on("shown",function(){d.find("input[type=text]").focus();d.on("submit",function(a){a.preventDefault();k.find(".btn-primary").click()})});k.modal("show");return k},dialog:function(b,a,c){var e="",j=[];c=c||{};null==a?a=[]:"undefined"==typeof a.length&&(a=
[a]);for(var d=a.length;d--;){var k=null,g=null,h=null,l="",m=null;if("undefined"==typeof a[d].label&&"undefined"==typeof a[d]["class"]&&"undefined"==typeof a[d].callback){var k=0,g=null,p;for(p in a[d])if(g=p,1<++k)break;1==k&&"function"==typeof a[d][p]&&(a[d].label=g,a[d].callback=a[d][p])}"function"==typeof a[d].callback&&(m=a[d].callback);a[d]["class"]?h=a[d]["class"]:d==a.length-1&&2>=a.length&&(h="btn-primary");k=a[d].label?a[d].label:"Option "+(d+1);a[d].icon&&(l="<i class='"+a[d].icon+"'></i> ");
g=a[d].href?a[d].href:"javascript:;";e="<a data-handler='"+d+"' class='btn "+h+"' href='"+g+"'>"+l+""+k+"</a>"+e;j[d]=m}d=["<div class='bootbox modal' tabindex='-1' style='overflow:hidden;'>"];if(c.header){h="";if("undefined"==typeof c.headerCloseButton||c.headerCloseButton)h="<a href='javascript:;' class='close'>&times;</a>";d.push("<div class='modal-header'>"+h+"<h3>"+c.header+"</h3></div>")}d.push("<div class='modal-body'></div>");e&&d.push("<div class='modal-footer'>"+e+"</div>");d.push("</div>");
var f=n(d.join("\n"));("undefined"===typeof c.animate?t:c.animate)&&f.addClass("fade");(e="undefined"===typeof c.classes?u:c.classes)&&f.addClass(e);f.find(".modal-body").html(b);f.on("hidden",function(){f.remove()});f.on("keyup.dismiss.modal",function(a){if(27==a.which&&c.onEscape){if("function"===typeof c.onEscape)c.onEscape();f.modal("hide")}});f.on("shown",function(){f.find("a.btn-primary:first").focus()});f.on("click",".modal-footer a, a.close",function(b){var c=n(this).data("handler"),d=j[c],
e=null;"undefined"!==typeof c&&"undefined"!==typeof a[c].href||(b.preventDefault(),"function"==typeof d&&(e=d()),!1!==e&&f.modal("hide"))});n("body").append(f);f.modal({backdrop:"undefined"===typeof c.backdrop?q:c.backdrop,keyboard:!1,show:!1});f.on("show",function(){n(v).off("focusin.modal")});("undefined"===typeof c.show||!0===c.show)&&f.modal("show");return f},modal:function(){var b,a,c,e={onEscape:null,keyboard:!0,backdrop:q};switch(arguments.length){case 1:b=arguments[0];break;case 2:b=arguments[0];
"object"==typeof arguments[1]?c=arguments[1]:a=arguments[1];break;case 3:b=arguments[0];a=arguments[1];c=arguments[2];break;default:throw Error("Incorrect number of arguments: expected 1-3");}e.header=a;c="object"==typeof c?n.extend(e,c):e;return m.dialog(b,[],c)},hideAll:function(){n(".bootbox").modal("hide")},animate:function(b){t=b},backdrop:function(b){q=b},classes:function(b){u=b}},l={en:{OK:"OK",CANCEL:"Cancel",CONFIRM:"OK"},fr:{OK:"OK",CANCEL:"Annuler",CONFIRM:"D'accord"},de:{OK:"OK",CANCEL:"Abbrechen",
CONFIRM:"Akzeptieren"},es:{OK:"OK",CANCEL:"Cancelar",CONFIRM:"Aceptar"},br:{OK:"OK",CANCEL:"Cancelar",CONFIRM:"Sim"},nl:{OK:"OK",CANCEL:"Annuleren",CONFIRM:"Accepteren"},ru:{OK:"OK",CANCEL:"\u041e\u0442\u043c\u0435\u043d\u0430",CONFIRM:"\u041f\u0440\u0438\u043c\u0435\u043d\u0438\u0442\u044c"},it:{OK:"OK",CANCEL:"Annulla",CONFIRM:"Conferma"}};return m}(document,window.jQuery);window.bootbox=bootbox;
///#source 1 1 /monsters/js/lib/dateformat.js
/*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 */

var dateFormat = function () {
	var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g,
		pad = function (val, len) {
			val = String(val);
			len = len || 2;
			while (val.length < len) val = "0" + val;
			return val;
		};

	// Regexes and supporting functions are cached through closure
	return function (date, mask, utc) {
		var dF = dateFormat;

		// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
		if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
			mask = date;
			date = undefined;
		}

		// Passing date through Date applies Date.parse, if necessary
		date = date ? new Date(date) : new Date;
		if (isNaN(date)) throw SyntaxError("invalid date");

		mask = String(dF.masks[mask] || mask || dF.masks["default"]);

		// Allow setting the utc argument via the mask
		if (mask.slice(0, 4) == "UTC:") {
			mask = mask.slice(4);
			utc = true;
		}

		var	_ = utc ? "getUTC" : "get",
			d = date[_ + "Date"](),
			D = date[_ + "Day"](),
			m = date[_ + "Month"](),
			y = date[_ + "FullYear"](),
			H = date[_ + "Hours"](),
			M = date[_ + "Minutes"](),
			s = date[_ + "Seconds"](),
			L = date[_ + "Milliseconds"](),
			o = utc ? 0 : date.getTimezoneOffset(),
			flags = {
				d:    d,
				dd:   pad(d),
				ddd:  dF.i18n.dayNames[D],
				dddd: dF.i18n.dayNames[D + 7],
				m:    m + 1,
				mm:   pad(m + 1),
				mmm:  dF.i18n.monthNames[m],
				mmmm: dF.i18n.monthNames[m + 12],
				yy:   String(y).slice(2),
				yyyy: y,
				h:    H % 12 || 12,
				hh:   pad(H % 12 || 12),
				H:    H,
				HH:   pad(H),
				M:    M,
				MM:   pad(M),
				s:    s,
				ss:   pad(s),
				l:    pad(L, 3),
				L:    pad(L > 99 ? Math.round(L / 10) : L),
				t:    H < 12 ? "a"  : "p",
				tt:   H < 12 ? "am" : "pm",
				T:    H < 12 ? "A"  : "P",
				TT:   H < 12 ? "AM" : "PM",
				Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
				o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
				S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
			};

		return mask.replace(token, function ($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	};
}();

// Some common format strings
dateFormat.masks = {
	"default":      "ddd mmm dd yyyy HH:MM:ss",
	shortDate:      "m/d/yy",
	mediumDate:     "mmm d, yyyy",
	longDate:       "mmmm d, yyyy",
	fullDate:       "dddd, mmmm d, yyyy",
	shortTime:      "h:MM TT",
	mediumTime:     "h:MM:ss TT",
	longTime:       "h:MM:ss TT Z",
	isoDate:        "yyyy-mm-dd",
	isoTime:        "HH:MM:ss",
	isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
	isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
	dayNames: [
		"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
		"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
	],
	monthNames: [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
		"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
	]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
	return dateFormat(this, mask, utc);
};

///#source 1 1 /monsters/js/lib/jquery.async.loops.js
/*
 * jQuery Asynchronous Plugin 1.0 RC1
 *
 * Copyright (c) 2008 Vincent Robert (genezys.net)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 */
(function($){

// opts.delay : (default 10) delay between async call in ms
// opts.bulk : (default 500) delay during which the loop can continue synchronously without yielding the CPU
// opts.test : (default true) function to test in the while test part
// opts.loop : (default empty) function to call in the while loop part
// opts.end : (default empty) function to call at the end of the while loop
$.whileAsync = function(opts)
{
	var delay = Math.abs(opts.delay) || 10,
		bulk = isNaN(opts.bulk) ? 500 : Math.abs(opts.bulk),
		test = opts.test || function(){ return true; },
		loop = opts.loop || function(){},
		end  = opts.end  || function(){};
	
	(function(){

		var t = false, 
			begin = new Date();
			
		while( t = test() )
		{
			loop();
			if( bulk === 0 || (new Date() - begin) > bulk )
			{
				break;
			}
		}
		if( t ) 
		{
			setTimeout(arguments.callee, delay);
		}
		else
		{
			end();
		}
		
	})();
}

// opts.delay : (default 10) delay between async call in ms
// opts.bulk : (default 500) delay during which the loop can continue synchronously without yielding the CPU
// opts.loop : (default empty) function to call in the each loop part, signature: function(index, value) this = value
// opts.end : (default empty) function to call at the end of the each loop
$.eachAsync = function(array, opts)
{
	var i = 0, 
		l = array.length, 
		loop = opts.loop || function(){};
	
	$.whileAsync(
		$.extend(opts, {
			test: function(){ return i < l; },
			loop: function()
			{ 
				var val = array[i];
				return loop.call(val, i++, val);
			}
		})
	);
}

$.fn.eachAsync = function(opts)
{
	$.eachAsync(this, opts);
	return this;
}

})(jQuery)
///#source 1 1 /monsters/js/lib/jquery.boxshadow.min.js
/*
 Shadow animation 20130124
 http://www.bitstorm.org/jquery/shadow-animation/
 Copyright 2011, 2013 Edwin Martin <edwin@bitstorm.org>
 Contributors: Mark Carver, Xavier Lepretre
 Released under the MIT and GPL licenses.
*/
jQuery(function(e,i){function j(){var b=e("script:first"),a=b.css("color"),c=false;if(/^rgba/.test(a))c=true;else try{c=a!=b.css("color","rgba(0, 0, 0, 0.5)").css("color");b.css("color",a)}catch(d){}return c}function k(b,a,c){var d=[];b.b&&d.push("inset");typeof a.left!="undefined"&&d.push(parseInt(b.left+c*(a.left-b.left),10)+"px "+parseInt(b.top+c*(a.top-b.top),10)+"px");typeof a.blur!="undefined"&&d.push(parseInt(b.blur+c*(a.blur-b.blur),10)+"px");typeof a.a!="undefined"&&d.push(parseInt(b.a+c*
(a.a-b.a),10)+"px");if(typeof a.color!="undefined"){var g="rgb"+(e.support.rgba?"a":"")+"("+parseInt(b.color[0]+c*(a.color[0]-b.color[0]),10)+","+parseInt(b.color[1]+c*(a.color[1]-b.color[1]),10)+","+parseInt(b.color[2]+c*(a.color[2]-b.color[2]),10);if(e.support.rgba)g+=","+parseFloat(b.color[3]+c*(a.color[3]-b.color[3]));g+=")";d.push(g)}return d.join(" ")}function h(b){var a,c,d={};if(a=/#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})/.exec(b))c=[parseInt(a[1],16),parseInt(a[2],16),parseInt(a[3],
16),1];else if(a=/#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])/.exec(b))c=[parseInt(a[1],16)*17,parseInt(a[2],16)*17,parseInt(a[3],16)*17,1];else if(a=/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(b))c=[parseInt(a[1],10),parseInt(a[2],10),parseInt(a[3],10),1];else if(a=/rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9\.]*)\s*\)/.exec(b))c=[parseInt(a[1],10),parseInt(a[2],10),parseInt(a[3],10),parseFloat(a[4])];d=(a=/(-?[0-9]+)(?:px)?\s+(-?[0-9]+)(?:px)?(?:\s+(-?[0-9]+)(?:px)?)?(?:\s+(-?[0-9]+)(?:px)?)?/.exec(b))?
{left:parseInt(a[1],10),top:parseInt(a[2],10),blur:a[3]?parseInt(a[3],10):0,a:a[4]?parseInt(a[4],10):0}:{left:0,top:0,blur:0,a:0};d.b=/inset/.test(b);d.color=c;return d}e.extend(true,e,{support:{rgba:j()}});var l=e("html").prop("style"),f;e.each(["boxShadow","MozBoxShadow","WebkitBoxShadow"],function(b,a){if(typeof l[a]!=="undefined"){f=a;return false}});if(f)e.Tween.propHooks.boxShadow={get:function(b){return e(b.elem).css(f)},set:function(b){var a=b.elem.style,c=h(e(b.elem).get(0).style[f]||e(b.elem).css(f)),
d=e.extend({},c,h(b.end));if(c.color==i)c.color=d.color||[0,0,0];b.run=function(g){a[f]=k(c,d,g)}}}});
///#source 1 1 /monsters/js/lib/jquery.cookie.js
/*!
 * jQuery Cookie Plugin v1.3.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
	if (typeof define === 'function' && define.amd && define.amd.jQuery) {
		// AMD. Register as anonymous module.
		define(['jquery'], factory);
	} else {
		// Browser globals.
		factory(jQuery);
	}
}(function ($) {

	var pluses = /\+/g;

	function raw(s) {
		return s;
	}

	function decoded(s) {
		return decodeURIComponent(s.replace(pluses, ' '));
	}

	function converted(s) {
		if (s.indexOf('"') === 0) {
			// This is a quoted cookie as according to RFC2068, unescape
			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}
		try {
			return config.json ? JSON.parse(s) : s;
		} catch(er) {}
	}

	var config = $.cookie = function (key, value, options) {

		// write
		if (value !== undefined) {
			options = $.extend({}, config.defaults, options);

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setDate(t.getDate() + days);
			}

			value = config.json ? JSON.stringify(value) : String(value);

			return (document.cookie = [
				encodeURIComponent(key), '=', config.raw ? value : encodeURIComponent(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join(''));
		}

		// read
		var decode = config.raw ? raw : decoded;
		var cookies = document.cookie.split('; ');
		var result = key ? undefined : {};
		for (var i = 0, l = cookies.length; i < l; i++) {
			var parts = cookies[i].split('=');
			var name = decode(parts.shift());
			var cookie = decode(parts.join('='));

			if (key && key === name) {
				result = converted(cookie);
				break;
			}

			if (!key) {
				result[name] = converted(cookie);
			}
		}

		return result;
	};

	config.defaults = {};

	$.removeCookie = function (key, options) {
		if ($.cookie(key) !== undefined) {
			$.cookie(key, '', $.extend(options, { expires: -1 }));
			return true;
		}
		return false;
	};

}));
///#source 1 1 /monsters/js/lib/jquery.livequery.min.js
/* Copyright (c) 2010 Brandon Aaron (http://brandonaaron.net)
 * Dual licensed under the MIT (MIT_LICENSE.txt)
 * and GPL Version 2 (GPL_LICENSE.txt) licenses.
 *
 * Version: 1.1.1
 * Requires jQuery 1.3+
 * Docs: http://docs.jquery.com/Plugins/livequery
 */
(function(a){a.extend(a.fn,{livequery:function(e,d,c){var b=this,f;if(a.isFunction(e)){c=d,d=e,e=undefined}a.each(a.livequery.queries,function(g,h){if(b.selector==h.selector&&b.context==h.context&&e==h.type&&(!d||d.$lqguid==h.fn.$lqguid)&&(!c||c.$lqguid==h.fn2.$lqguid)){return(f=h)&&false}});f=f||new a.livequery(this.selector,this.context,e,d,c);f.stopped=false;f.run();return this},expire:function(e,d,c){var b=this;if(a.isFunction(e)){c=d,d=e,e=undefined}a.each(a.livequery.queries,function(f,g){if(b.selector==g.selector&&b.context==g.context&&(!e||e==g.type)&&(!d||d.$lqguid==g.fn.$lqguid)&&(!c||c.$lqguid==g.fn2.$lqguid)&&!this.stopped){a.livequery.stop(g.id)}});return this}});a.livequery=function(b,d,f,e,c){this.selector=b;this.context=d;this.type=f;this.fn=e;this.fn2=c;this.elements=[];this.stopped=false;this.id=a.livequery.queries.push(this)-1;e.$lqguid=e.$lqguid||a.livequery.guid++;if(c){c.$lqguid=c.$lqguid||a.livequery.guid++}return this};a.livequery.prototype={stop:function(){var b=this;if(this.type){this.elements.unbind(this.type,this.fn)}else{if(this.fn2){this.elements.each(function(c,d){b.fn2.apply(d)})}}this.elements=[];this.stopped=true},run:function(){if(this.stopped){return}var d=this;var e=this.elements,c=a(this.selector,this.context),b=c.not(e);this.elements=c;if(this.type){b.bind(this.type,this.fn);if(e.length>0){a.each(e,function(f,g){if(a.inArray(g,c)<0){a.event.remove(g,d.type,d.fn)}})}}else{b.each(function(){d.fn.apply(this)});if(this.fn2&&e.length>0){a.each(e,function(f,g){if(a.inArray(g,c)<0){d.fn2.apply(g)}})}}}};a.extend(a.livequery,{guid:0,queries:[],queue:[],running:false,timeout:null,checkQueue:function(){if(a.livequery.running&&a.livequery.queue.length){var b=a.livequery.queue.length;while(b--){a.livequery.queries[a.livequery.queue.shift()].run()}}},pause:function(){a.livequery.running=false},play:function(){a.livequery.running=true;a.livequery.run()},registerPlugin:function(){a.each(arguments,function(c,d){if(!a.fn[d]){return}var b=a.fn[d];a.fn[d]=function(){var e=b.apply(this,arguments);a.livequery.run();return e}})},run:function(b){if(b!=undefined){if(a.inArray(b,a.livequery.queue)<0){a.livequery.queue.push(b)}}else{a.each(a.livequery.queries,function(c){if(a.inArray(c,a.livequery.queue)<0){a.livequery.queue.push(c)}})}if(a.livequery.timeout){clearTimeout(a.livequery.timeout)}a.livequery.timeout=setTimeout(a.livequery.checkQueue,20)},stop:function(b){if(b!=undefined){a.livequery.queries[b].stop()}else{a.each(a.livequery.queries,function(c){a.livequery.queries[c].stop()})}}});a.livequery.registerPlugin("append","prepend","after","before","wrap","attr","removeAttr","addClass","removeClass","toggleClass","empty","remove","html");a(function(){a.livequery.play()})})(jQuery);
///#source 1 1 /monsters/js/lib/jquery.nicescroll.min.js
/* jquery.nicescroll 3.0.0 InuYaksa*2012 MIT http://areaaperta.com/nicescroll */(function(d){var s=false,w=false,B=5E3,C=2E3,D=function(){var d=document.getElementsByTagName("script"),d=d[d.length-1].src.split("?")[0];return d.split("/").length>0?d.split("/").slice(0,-1).join("/")+"/":""}(),q=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||false,r=window.cancelRequestAnimationFrame||window.webkitCancelRequestAnimationFrame||window.mozCancelRequestAnimationFrame||
window.oCancelRequestAnimationFrame||window.msCancelRequestAnimationFrame||false,x=false,E=function(){if(x)return x;var d=document.createElement("DIV"),c={haspointerlock:"pointerLockElement"in document||"mozPointerLockElement"in document||"webkitPointerLockElement"in document};c.isopera="opera"in window;c.isopera12=c.isopera&&"getUserMedia"in navigator;c.isie="all"in document&&"attachEvent"in d&&!c.isopera;c.isieold=c.isie&&!("msInterpolationMode"in d.style);c.isie7=c.isie&&!c.isieold&&(!("documentMode"in
document)||document.documentMode==7);c.isie8=c.isie&&"documentMode"in document&&document.documentMode==8;c.isie9=c.isie&&"performance"in window&&document.documentMode>=9;c.isie10=c.isie&&"performance"in window&&document.documentMode>=10;c.isie9mobile=/iemobile.9/i.test(navigator.userAgent);if(c.isie9mobile)c.isie9=false;c.isie7mobile=!c.isie9mobile&&c.isie7&&/iemobile/i.test(navigator.userAgent);c.ismozilla="MozAppearance"in d.style;c.iswebkit="WebkitAppearance"in d.style;c.ischrome="chrome"in window;
c.ischrome22=c.ischrome&&c.haspointerlock;c.cantouch="ontouchstart"in document.documentElement;c.hasmstouch=window.navigator.msPointerEnabled||false;c.ismac=/^mac$/i.test(navigator.platform);c.isios=c.cantouch&&/iphone|ipad|ipod/i.test(navigator.platform);c.isios4=c.isios&&!("seal"in Object);c.isandroid=/android/i.test(navigator.userAgent);c.trstyle=false;c.hastransform=false;c.hastranslate3d=false;c.transitionstyle=false;c.hastransition=false;c.transitionend=false;for(var h=["transform","msTransform",
"webkitTransform","MozTransform","OTransform"],i=0;i<h.length;i++)if(typeof d.style[h[i]]!="undefined"){c.trstyle=h[i];break}c.hastransform=c.trstyle!=false;if(c.hastransform)d.style[c.trstyle]="translate3d(1px,2px,3px)",c.hastranslate3d=/translate3d/.test(d.style[c.trstyle]);c.transitionstyle=false;c.prefixstyle="";c.transitionend=false;for(var h="transition,webkitTransition,MozTransition,OTransition,OTransition,msTransition,KhtmlTransition".split(","),b=",-webkit-,-moz-,-o-,-o,-ms-,-khtml-".split(","),
o="transitionend,webkitTransitionEnd,transitionend,otransitionend,oTransitionEnd,msTransitionEnd,KhtmlTransitionEnd".split(","),i=0;i<h.length;i++)if(h[i]in d.style){c.transitionstyle=h[i];c.prefixstyle=b[i];c.transitionend=o[i];break}c.hastransition=c.transitionstyle;a:{h=["-moz-grab","-webkit-grab","grab"];if(c.ischrome&&!c.ischrome22||c.isie)h=[];for(i=0;i<h.length;i++)if(b=h[i],d.style.cursor=b,d.style.cursor==b){h=b;break a}h="url(http://www.google.com/intl/en_ALL/mapfiles/openhand.cur),n-resize"}c.cursorgrabvalue=
h;c.hasmousecapture="setCapture"in d;return x=c},F=function(j,c){function h(f,c,g){c=f.css(c);f=parseFloat(c);return isNaN(f)?(f=p[c]||0,g=f==3?g?b.win.outerHeight()-b.win.innerHeight():b.win.outerWidth()-b.win.innerWidth():1,b.isie8&&f&&(f+=1),g?f:0):f}function i(f,c){var g=0,e=0;if("wheelDeltaY"in f)g=Math.floor(f.wheelDeltaX/2),e=Math.floor(f.wheelDeltaY/2);else{var d=f.detail?f.detail*-1:f.wheelDelta/40;d&&(c?g=Math.floor(d*b.opt.mousescrollstep):e=Math.floor(d*b.opt.mousescrollstep))}g&&(b.scrollmom&&
b.scrollmom.stop(),b.lastdeltax+=g,b.synched("mousewheelx",function(){var f=b.lastdeltax;b.lastdeltax=0;b.rail.drag||b.doScrollLeftBy(f)}));e&&(b.scrollmom&&b.scrollmom.stop(),b.lastdeltay+=e,b.synched("mousewheely",function(){var f=b.lastdeltay;b.lastdeltay=0;b.rail.drag||b.doScrollBy(f)}))}var b=this;this.version="3.0.0";this.name="nicescroll";this.me=c;this.opt={doc:d("body"),win:false,zindex:9E3,cursoropacitymin:0,cursoropacitymax:1,cursorcolor:"#424242",cursorwidth:"5px",cursorborder:"1px solid #fff",
cursorborderradius:"5px",scrollspeed:60,mousescrollstep:24,touchbehavior:false,hwacceleration:true,usetransition:true,boxzoom:false,dblclickzoom:true,gesturezoom:true,grabcursorenabled:true,autohidemode:true,background:"",iframeautoresize:true,cursorminheight:32,preservenativescrolling:true,railoffset:false,bouncescroll:true,spacebarenabled:true,railpadding:{top:0,right:0,left:0,bottom:0},disableoutline:true,horizrailenabled:true,railalign:"right",railvalign:"bottom",enabletranslate3d:true,enablemousewheel:true,
enablekeyboard:true,smoothscroll:true,sensitiverail:true};this.opt.snapbackspeed=80;if(j)for(var o in b.opt)typeof j[o]!="undefined"&&(b.opt[o]=j[o]);this.iddoc=(this.doc=b.opt.doc)&&this.doc[0]?this.doc[0].id||"":"";this.ispage=/BODY|HTML/.test(b.opt.win?b.opt.win[0].nodeName:this.doc[0].nodeName);this.haswrapper=b.opt.win!==false;this.win=b.opt.win||(this.ispage?d(window):this.doc);this.docscroll=this.ispage&&!this.haswrapper?d(window):this.win;this.body=d("body");this.iframe=this.isfixed=false;
this.isiframe=this.doc[0].nodeName=="IFRAME"&&this.win[0].nodeName=="IFRAME";this.istextarea=this.win[0].nodeName=="TEXTAREA";this.forcescreen=false;this.canshowonmouseevent=b.opt.autohidemode!="scroll";this.page=this.view=this.onzoomout=this.onzoomin=this.onscrollcancel=this.onscrollend=this.onscrollstart=this.onclick=this.ongesturezoom=this.onkeypress=this.onmousewheel=this.onmousemove=this.onmouseup=this.onmousedown=false;this.scroll={x:0,y:0};this.scrollratio={x:0,y:0};this.cursorheight=20;this.scrollvaluemax=
0;this.observer=this.scrollmom=this.scrollrunning=false;do this.id="ascrail"+C++;while(document.getElementById(this.id));this.hasmousefocus=this.hasfocus=this.zoomactive=this.zoom=this.cursorfreezed=this.cursor=this.rail=false;this.visibility=true;this.hidden=this.locked=false;this.cursoractive=true;this.nativescrollingarea=false;this.events=[];this.saved={};this.delaylist={};this.synclist={};this.lastdeltay=this.lastdeltax=0;var e=this.detected=E();this.ishwscroll=(this.canhwscroll=e.hastransform&&
b.opt.hwacceleration)&&b.haswrapper;this.istouchcapable=false;if(e.cantouch&&e.ischrome&&!e.isios&&!e.isandroid)this.istouchcapable=true,e.cantouch=false;if(e.cantouch&&e.ismozilla&&!e.isios)this.istouchcapable=true,e.cantouch=false;this.delayed=function(f,c,g,e){var d=b.delaylist[f],h=(new Date).getTime();if(!e&&d&&d.tt)return false;d&&d.tt&&clearTimeout(d.tt);if(d&&d.last+g>h&&!d.tt)b.delaylist[f]={last:h+g,tt:setTimeout(function(){b.delaylist[f].tt=0;c.call()},g)};else if(!d||!d.tt)b.delaylist[f]=
{last:h,tt:0},setTimeout(function(){c.call()},0)};this.synched=function(f,c){b.synclist[f]=c;(function(){if(!b.onsync)q(function(){b.onsync=false;for(f in b.synclist){var c=b.synclist[f];c&&c.call(b);b.synclist[f]=false}}),b.onsync=true})();return f};this.unsynched=function(f){b.synclist[f]&&(b.synclist[f]=false)};this.css=function(f,c){for(var g in c)b.saved.css.push([f,g,f.css(g)]),f.css(g,c[g])};this.scrollTop=function(f){return typeof f=="undefined"?b.getScrollTop():b.setScrollTop(f)};this.scrollLeft=
function(f){return typeof f=="undefined"?b.getScrollLeft():b.setScrollLeft(f)};BezierClass=function(b,c,g,e,d,h,i){this.st=b;this.ed=c;this.spd=g;this.p1=e||0;this.p2=d||1;this.p3=h||0;this.p4=i||1;this.ts=(new Date).getTime();this.df=this.ed-this.st};BezierClass.prototype={B2:function(b){return 3*b*b*(1-b)},B3:function(b){return 3*b*(1-b)*(1-b)},B4:function(b){return(1-b)*(1-b)*(1-b)},getNow:function(){var b=1-((new Date).getTime()-this.ts)/this.spd,c=this.B2(b)+this.B3(b)+this.B4(b);return b<0?
this.ed:this.st+Math.round(this.df*c)},update:function(b,c){this.st=this.getNow();this.ed=b;this.spd=c;this.ts=(new Date).getTime();this.df=this.ed-this.st;return this}};if(this.ishwscroll){this.doc.translate={x:0,y:0,tx:"0px",ty:"0px"};e.hastranslate3d&&e.isios&&this.doc.css("-webkit-backface-visibility","hidden");var n=function(){var f=b.doc.css(e.trstyle);return f&&f.substr(0,6)=="matrix"?f.replace(/^.*\((.*)\)$/g,"$1").replace(/px/g,"").split(/, +/):false};this.getScrollTop=function(f){if(!f){if(f=
n())return f.length==16?-f[13]:-f[5];if(b.timerscroll&&b.timerscroll.bz)return b.timerscroll.bz.getNow()}return b.doc.translate.y};this.getScrollLeft=function(f){if(!f){if(f=n())return f.length==16?-f[12]:-f[4];if(b.timerscroll&&b.timerscroll.bh)return b.timerscroll.bh.getNow()}return b.doc.translate.x};this.notifyScrollEvent=document.createEvent?function(b){var c=document.createEvent("UIEvents");c.initUIEvent("scroll",false,true,window,1);b.dispatchEvent(c)}:document.fireEvent?function(b){var c=
document.createEventObject();b.fireEvent("onscroll");c.cancelBubble=true}:function(){};e.hastranslate3d&&b.opt.enabletranslate3d?(this.setScrollTop=function(f,c){b.doc.translate.y=f;b.doc.translate.ty=f*-1+"px";b.doc.css(e.trstyle,"translate3d("+b.doc.translate.tx+","+b.doc.translate.ty+",0px)");c||b.notifyScrollEvent(b.win[0])},this.setScrollLeft=function(f,c){b.doc.translate.x=f;b.doc.translate.tx=f*-1+"px";b.doc.css(e.trstyle,"translate3d("+b.doc.translate.tx+","+b.doc.translate.ty+",0px)");c||
b.notifyScrollEvent(b.win[0])}):(this.setScrollTop=function(f,c){b.doc.translate.y=f;b.doc.translate.ty=f*-1+"px";b.doc.css(e.trstyle,"translate("+b.doc.translate.tx+","+b.doc.translate.ty+")");c||b.notifyScrollEvent(b.win[0])},this.setScrollLeft=function(f,c){b.doc.translate.x=f;b.doc.translate.tx=f*-1+"px";b.doc.css(e.trstyle,"translate("+b.doc.translate.tx+","+b.doc.translate.ty+")");c||b.notifyScrollEvent(b.win[0])})}else this.getScrollTop=function(){return b.docscroll.scrollTop()},this.setScrollTop=
function(f){return b.docscroll.scrollTop(f)},this.getScrollLeft=function(){return b.docscroll.scrollLeft()},this.setScrollLeft=function(f){return b.docscroll.scrollLeft(f)};this.getTarget=function(b){return!b?false:b.target?b.target:b.srcElement?b.srcElement:false};this.hasParent=function(b,c){if(!b)return false;for(var g=b.target||b.srcElement||b||false;g&&g.id!=c;)g=g.parentNode||false;return g!==false};var p={thin:1,medium:3,thick:5};this.updateScrollBar=function(f){if(b.ishwscroll)b.rail.css({height:b.win.innerHeight()}),
b.railh&&b.railh.css({width:b.win.innerWidth()});else{var c=b.isfixed?{top:parseFloat(b.win.css("top")),left:parseFloat(b.win.css("left"))}:b.win.offset(),g=c.top,e=c.left;g+=h(b.win,"border-top-width",true);b.win.outerWidth();b.win.innerWidth();e+=b.rail.align?b.win.outerWidth()-h(b.win,"border-right-width")-b.rail.width:h(b.win,"border-left-width");var d=b.opt.railoffset;d&&(d.top&&(g+=d.top),b.rail.align&&d.left&&(e+=d.left));b.locked||b.rail.css({top:g,left:e,height:f?f.h:b.win.innerHeight()});
b.zoom&&b.zoom.css({top:g+1,left:b.rail.align==1?e-20:e+b.rail.width+4});if(b.railh&&!b.locked)g=c.top,e=c.left,f=b.railh.align?g+h(b.win,"border-top-width",true)+b.win.innerHeight()-b.railh.height:g+h(b.win,"border-top-width",true),e+=h(b.win,"border-left-width"),b.railh.css({top:f,left:e,width:b.railh.width})}};this.doRailClick=function(f,c,g){var e;!(b.rail.drag&&b.rail.drag.pt!=1)&&!b.locked&&!b.rail.drag&&(b.cancelScroll(),b.cancelEvent(f),c?(c=g?b.doScrollLeft:b.doScrollTop,e=g?(f.pageX-b.railh.offset().left-
b.cursorwidth/2)*b.scrollratio.x:(f.pageY-b.rail.offset().top-b.cursorheight/2)*b.scrollratio.y,c(e)):(c=g?b.doScrollLeftBy:b.doScrollBy,e=g?b.scroll.x:b.scroll.y,f=g?f.pageX-b.railh.offset().left:f.pageY-b.rail.offset().top,g=g?b.view.w:b.view.h,e>=f?c(g):c(-g)))};b.hasanimationframe=q;b.hascancelanimationframe=r;b.hasanimationframe?b.hascancelanimationframe||(r=function(){b.cancelAnimationFrame=true}):(q=function(b){return setTimeout(b,16)},r=clearInterval);this.init=function(){b.saved.css=[];if(e.isie7mobile)return true;
e.hasmstouch&&b.css(b.ispage?d("html"):b.win,{"-ms-touch-action":"none"});if(!b.ispage||!e.cantouch&&!e.isieold&&!e.isie9mobile){var f=b.docscroll;b.ispage&&(f=b.haswrapper?b.win:b.doc);e.isie9mobile||b.css(f,{"overflow-y":"hidden"});b.ispage&&e.isie7&&(b.doc[0].nodeName=="BODY"?b.css(d("html"),{"overflow-y":"hidden"}):b.doc[0].nodeName=="HTML"&&b.css(d("body"),{"overflow-y":"hidden"}));e.isios&&!b.ispage&&!b.haswrapper&&b.css(d("body"),{"-webkit-overflow-scrolling":"touch"});var c=d(document.createElement("div"));
c.css({position:"relative",top:0,"float":"right",width:b.opt.cursorwidth,height:"0px","background-color":b.opt.cursorcolor,border:b.opt.cursorborder,"background-clip":"padding-box","-webkit-border-radius":b.opt.cursorborderradius,"-moz-border-radius":b.opt.cursorborderradius,"border-radius":b.opt.cursorborderradius});c.hborder=parseFloat(c.outerHeight()-c.innerHeight());b.cursor=c;var g=d(document.createElement("div"));g.attr("id",b.id);var h,i,j=["left","right"],y;for(y in j)i=j[y],(h=b.opt.railpadding[i])?
g.css("padding-"+i,h+"px"):b.opt.railpadding[i]=0;g.append(c);g.width=Math.max(parseFloat(b.opt.cursorwidth),c.outerWidth())+b.opt.railpadding.left+b.opt.railpadding.right;g.css({width:g.width+"px",zIndex:b.ispage?b.opt.zindex:b.opt.zindex+2,background:b.opt.background});g.visibility=true;g.scrollable=true;g.align=b.opt.railalign=="left"?0:1;b.rail=g;c=b.rail.drag=false;if(b.opt.boxzoom&&!b.ispage&&!e.isieold&&(c=document.createElement("div"),b.bind(c,"click",b.doZoom),b.zoom=d(c),b.zoom.css({cursor:"pointer",
"z-index":b.opt.zindex,backgroundImage:"url("+D+"zoomico.png)",height:18,width:18,backgroundPosition:"0px 0px"}),b.opt.dblclickzoom&&b.bind(b.win,"dblclick",b.doZoom),e.cantouch&&b.opt.gesturezoom))b.ongesturezoom=function(c){c.scale>1.5&&b.doZoomIn(c);c.scale<0.8&&b.doZoomOut(c);return b.cancelEvent(c)},b.bind(b.win,"gestureend",b.ongesturezoom);b.railh=false;if(b.opt.horizrailenabled){b.css(f,{"overflow-x":"hidden"});c=d(document.createElement("div"));c.css({position:"relative",top:0,height:b.opt.cursorwidth,
width:"0px","background-color":b.opt.cursorcolor,border:b.opt.cursorborder,"background-clip":"padding-box","-webkit-border-radius":b.opt.cursorborderradius,"-moz-border-radius":b.opt.cursorborderradius,"border-radius":b.opt.cursorborderradius});c.wborder=parseFloat(c.outerWidth()-c.innerWidth());b.cursorh=c;var k=d(document.createElement("div"));k.attr("id",b.id+"-hr");k.height=1+Math.max(parseFloat(b.opt.cursorwidth),c.outerHeight());k.css({height:k.height+"px",zIndex:b.ispage?b.opt.zindex:b.opt.zindex+
2,background:b.opt.background});k.append(c);k.visibility=true;k.scrollable=true;k.align=b.opt.railvalign=="top"?0:1;b.railh=k;b.railh.drag=false}b.ispage?(g.css({position:"fixed",top:"0px",height:"100%"}),g.align?g.css({right:"0px"}):g.css({left:"0px"}),b.body.append(g),b.railh&&(k.css({position:"fixed",left:"0px",width:"100%"}),k.align?k.css({bottom:"0px"}):k.css({top:"0px"}),b.body.append(k))):(b.ishwscroll?(b.win.css("position")=="static"&&b.css(b.win,{position:"relative"}),f=b.win[0].nodeName==
"HTML"?b.body:b.win,b.zoom&&(b.zoom.css({position:"absolute",top:1,right:0,"margin-right":g.width+4}),f.append(b.zoom)),g.css({position:"absolute",top:0}),g.align?g.css({right:0}):g.css({left:0}),f.append(g),k&&(k.css({position:"absolute",left:0,bottom:0}),k.align?k.css({bottom:0}):k.css({top:0}),f.append(k))):(b.isfixed=b.win.css("position")=="fixed",f=b.isfixed?"fixed":"absolute",g.css({position:f}),b.zoom&&b.zoom.css({position:f}),b.updateScrollBar(),b.body.append(g),b.zoom&&b.body.append(b.zoom),
b.railh&&(k.css({position:f}),b.body.append(k))),e.isios&&b.css(b.win,{"-webkit-tap-highlight-color":"rgba(0,0,0,0)","-webkit-touch-callout":"none"}),e.isie&&b.opt.disableoutline&&b.win.attr("hideFocus","true"),e.iswebkit&&b.opt.disableoutline&&b.win.css({outline:"none"}));if(b.opt.autohidemode===false)b.autohidedom=false;else if(b.opt.autohidemode===true){if(b.autohidedom=d().add(b.rail),b.railh)b.autohidedom=b.autohidedom.add(b.railh)}else if(b.opt.autohidemode=="scroll"){if(b.autohidedom=d().add(b.rail),
b.railh)b.autohidedom=b.autohidedom.add(b.railh)}else if(b.opt.autohidemode=="cursor"){if(b.autohidedom=d().add(b.cursor),b.railh)b.autohidedom=b.autohidedom.add(b.railh.cursor)}else if(b.opt.autohidemode=="hidden")b.autohidedom=false,b.hide(),b.locked=false;if(e.isie9mobile)b.scrollmom=new z(b),b.onmangotouch=function(){var c=b.getScrollTop(),f=b.getScrollLeft();if(c==b.scrollmom.lastscrolly&&f==b.scrollmom.lastscrollx)return true;var g=c-b.mangotouch.sy,e=f-b.mangotouch.sx;if(Math.round(Math.sqrt(Math.pow(e,
2)+Math.pow(g,2)))!=0){var l=g<0?-1:1,d=e<0?-1:1,h=+new Date;b.mangotouch.lazy&&clearTimeout(b.mangotouch.lazy);if(h-b.mangotouch.tm>80||b.mangotouch.dry!=l||b.mangotouch.drx!=d)b.scrollmom.stop(),b.scrollmom.reset(f,c),b.mangotouch.sy=c,b.mangotouch.ly=c,b.mangotouch.sx=f,b.mangotouch.lx=f,b.mangotouch.dry=l,b.mangotouch.drx=d,b.mangotouch.tm=h;else if(b.scrollmom.stop(),b.scrollmom.update(b.mangotouch.sx-e,b.mangotouch.sy-g),b.mangotouch.tm=h,g=Math.max(Math.abs(b.mangotouch.ly-c),Math.abs(b.mangotouch.lx-
f)),b.mangotouch.ly=c,b.mangotouch.lx=f,g>2)b.mangotouch.lazy=setTimeout(function(){b.mangotouch.lazy=false;b.mangotouch.dry=0;b.mangotouch.drx=0;b.mangotouch.tm=0;b.scrollmom.doMomentum(30)},100)}},g=b.getScrollTop(),k=b.getScrollLeft(),b.mangotouch={sy:g,ly:g,dry:0,sx:k,lx:k,drx:0,lazy:false,tm:0},b.bind(b.docscroll,"scroll",b.onmangotouch);else{if(e.cantouch||b.istouchcapable||b.opt.touchbehavior||e.hasmstouch){b.scrollmom=new z(b);b.ontouchstart=function(c){if(c.pointerType&&c.pointerType!=2)return false;
if(!b.locked){if(e.hasmstouch)for(var f=c.target?c.target:false;f;){var g=d(f).getNiceScroll();if(g.length>0&&g[0].me==b.me)break;if(g.length>0)return false;if(f.nodeName=="DIV"&&f.id==b.id)break;f=f.parentNode?f.parentNode:false}b.cancelScroll();if((f=b.getTarget(c))&&/INPUT/i.test(f.nodeName)&&/range/i.test(f.type))return b.stopPropagation(c);if(b.forcescreen)g=c,c={original:c.original?c.original:c},c.clientX=g.screenX,c.clientY=g.screenY;b.rail.drag={x:c.clientX,y:c.clientY,sx:b.scroll.x,sy:b.scroll.y,
st:b.getScrollTop(),sl:b.getScrollLeft(),pt:2};b.opt.touchbehavior&&b.isiframe&&e.isie&&(g=b.win.position(),b.rail.drag.x+=g.left,b.rail.drag.y+=g.top);b.hasmoving=false;b.lastmouseup=false;b.scrollmom.reset(c.clientX,c.clientY);if(!e.cantouch&&!this.istouchcapable&&!e.hasmstouch){if(!f||!/INPUT|SELECT|TEXTAREA/i.test(f.nodeName))return!b.ispage&&e.hasmousecapture&&f.setCapture(),b.cancelEvent(c);if(/SUBMIT|CANCEL|BUTTON/i.test(d(f).attr("type")))pc={tg:f,click:false},b.preventclick=pc}}};b.ontouchend=
function(c){if(c.pointerType&&c.pointerType!=2)return false;if(b.rail.drag&&b.rail.drag.pt==2&&(b.scrollmom.doMomentum(),b.rail.drag=false,b.hasmoving&&(b.hasmoving=false,b.lastmouseup=true,b.hideCursor(),e.hasmousecapture&&document.releaseCapture(),!e.cantouch)))return b.cancelEvent(c)};var o=b.opt.touchbehavior&&b.isiframe&&!e.hasmousecapture;b.ontouchmove=function(c,f){if(c.pointerType&&c.pointerType!=2)return false;if(b.rail.drag&&b.rail.drag.pt==2){if(e.cantouch&&typeof c.original=="undefined")return true;
b.hasmoving=true;if(b.preventclick&&!b.preventclick.click)b.preventclick.click=b.preventclick.tg.onclick||false,b.preventclick.tg.onclick=b.onpreventclick;if(b.forcescreen){var g=c,c={original:c.original?c.original:c};c.clientX=g.screenX;c.clientY=g.screenY}g=ofy=0;if(o&&!f){var l=b.win.position(),g=-l.left;ofy=-l.top}var d=c.clientY+ofy,h=b.rail.drag.st-(d-b.rail.drag.y);if(b.ishwscroll&&b.opt.bouncescroll)h<0?h=Math.round(h/2):h>b.page.maxh&&(h=b.page.maxh+Math.round((h-b.page.maxh)/2));else if(h<
0&&(d=h=0),h>b.page.maxh)h=b.page.maxh,d=0;var i=c.clientX+g;if(b.railh&&b.railh.scrollable){var m=b.rail.drag.sl-(i-b.rail.drag.x);if(b.ishwscroll&&b.opt.bouncescroll)m<0?m=Math.round(m/2):m>b.page.maxw&&(m=b.page.maxw+Math.round((m-b.page.maxw)/2));else if(m<0&&(i=m=0),m>b.page.maxw)m=b.page.maxw,i=0}b.synched("touchmove",function(){b.rail.drag&&b.rail.drag.pt==2&&(b.prepareTransition&&b.prepareTransition(0),b.rail.scrollable&&b.setScrollTop(h),b.scrollmom.update(i,d),b.railh&&b.railh.scrollable?
(b.setScrollLeft(m),b.showCursor(h,m)):b.showCursor(h),e.isie10&&document.selection.clear())});return b.cancelEvent(c)}}}e.cantouch||b.opt.touchbehavior?(b.onpreventclick=function(c){if(b.preventclick)return b.preventclick.tg.onclick=b.preventclick.click,b.preventclick=false,b.cancelEvent(c)},b.onmousedown=b.ontouchstart,b.onmouseup=b.ontouchend,b.onclick=e.isios?false:function(c){return b.lastmouseup?(b.lastmouseup=false,b.cancelEvent(c)):true},b.onmousemove=b.ontouchmove,e.cursorgrabvalue&&(b.css(b.ispage?
b.doc:b.win,{cursor:e.cursorgrabvalue}),b.css(b.rail,{cursor:e.cursorgrabvalue}))):(b.onmousedown=function(c,f){if(!(b.rail.drag&&b.rail.drag.pt!=1)){if(b.locked)return b.cancelEvent(c);b.cancelScroll();b.rail.drag={x:c.clientX,y:c.clientY,sx:b.scroll.x,sy:b.scroll.y,pt:1,hr:!!f};var g=b.getTarget(c);!b.ispage&&e.hasmousecapture&&g.setCapture();if(b.isiframe&&!e.hasmousecapture)b.saved.csspointerevents=b.doc.css("pointer-events"),b.css(b.doc,{"pointer-events":"none"});return b.cancelEvent(c)}},b.onmouseup=
function(c){if(b.rail.drag&&(e.hasmousecapture&&document.releaseCapture(),b.isiframe&&!e.hasmousecapture&&b.doc.css("pointer-events",b.saved.csspointerevents),b.rail.drag.pt==1))return b.rail.drag=false,b.cancelEvent(c)},b.onmousemove=function(c){if(b.rail.drag){if(b.rail.drag.pt==1){if(e.ischrome&&c.which==0)return b.onmouseup(c);b.cursorfreezed=true;if(b.rail.drag.hr){b.scroll.x=b.rail.drag.sx+(c.clientX-b.rail.drag.x);if(b.scroll.x<0)b.scroll.x=0;var f=b.scrollvaluemaxw;if(b.scroll.x>f)b.scroll.x=
f}else{b.scroll.y=b.rail.drag.sy+(c.clientY-b.rail.drag.y);if(b.scroll.y<0)b.scroll.y=0;f=b.scrollvaluemax;if(b.scroll.y>f)b.scroll.y=f}b.synched("mousemove",function(){b.rail.drag&&b.rail.drag.pt==1&&(b.showCursor(),b.rail.drag.hr?b.doScrollLeft(Math.round(b.scroll.x*b.scrollratio.x)):b.doScrollTop(Math.round(b.scroll.y*b.scrollratio.y)))});return b.cancelEvent(c)}}else b.checkarea=true});(e.cantouch||b.opt.touchbehavior)&&b.bind(b.win,"mousedown",b.onmousedown);e.hasmstouch&&(b.css(b.rail,{"-ms-touch-action":"none"}),
b.css(b.cursor,{"-ms-touch-action":"none"}),b.bind(b.win,"MSPointerDown",b.ontouchstart),b.bind(document,"MSPointerUp",b.ontouchend),b.bind(document,"MSPointerMove",b.ontouchmove),b.bind(b.cursor,"MSGestureHold",function(b){b.preventDefault()}),b.bind(b.cursor,"contextmenu",function(b){b.preventDefault()}));this.istouchcapable&&(b.bind(b.win,"touchstart",b.ontouchstart),b.bind(document,"touchend",b.ontouchend),b.bind(document,"touchmove",b.ontouchmove));b.bind(b.cursor,"mousedown",b.onmousedown);
b.bind(b.cursor,"mouseup",b.onmouseup);b.railh&&(b.bind(b.cursorh,"mousedown",function(c){b.onmousedown(c,true)}),b.bind(b.cursorh,"mouseup",function(c){if(!(b.rail.drag&&b.rail.drag.pt==2))return b.rail.drag=false,b.hasmoving=false,b.hideCursor(),e.hasmousecapture&&document.releaseCapture(),b.cancelEvent(c)}));b.bind(document,"mouseup",b.onmouseup);e.hasmousecapture&&b.bind(b.win,"mouseup",b.onmouseup);b.bind(document,"mousemove",b.onmousemove);b.onclick&&b.bind(document,"click",b.onclick);!e.cantouch&&
!b.opt.touchbehavior&&(b.rail.mouseenter(function(){b.canshowonmouseevent&&b.showCursor();b.rail.active=true}),b.rail.mouseleave(function(){b.rail.active=false;b.rail.drag||b.hideCursor()}),b.opt.sensitiverail&&(b.rail.click(function(c){b.doRailClick(c,false,false)}),b.rail.dblclick(function(c){b.doRailClick(c,true,false)}),b.cursor.click(function(c){b.cancelEvent(c)}),b.cursor.dblclick(function(c){b.cancelEvent(c)})),b.railh&&(b.railh.mouseenter(function(){b.canshowonmouseevent&&b.showCursor();b.rail.active=
true}),b.railh.mouseleave(function(){b.rail.active=false;b.rail.drag||b.hideCursor()})),b.zoom&&(b.zoom.mouseenter(function(){b.canshowonmouseevent&&b.showCursor();b.rail.active=true}),b.zoom.mouseleave(function(){b.rail.active=false;b.rail.drag||b.hideCursor()})));b.opt.enablemousewheel&&(b.isiframe||b.bind(e.isie&&b.ispage?document:b.docscroll,"mousewheel",b.onmousewheel),b.bind(b.rail,"mousewheel",b.onmousewheel),b.railh&&b.bind(b.railh,"mousewheel",b.onmousewheelhr));!b.ispage&&!e.cantouch&&!/HTML|BODY/.test(b.win[0].nodeName)&&
(b.win.attr("tabindex")||b.win.attr({tabindex:B++}),b.win.focus(function(c){s=b.getTarget(c).id||true;b.hasfocus=true;b.canshowonmouseevent&&b.noticeCursor()}),b.win.blur(function(){s=false;b.hasfocus=false}),b.win.mouseenter(function(c){w=b.getTarget(c).id||true;b.hasmousefocus=true;b.canshowonmouseevent&&b.noticeCursor()}),b.win.mouseleave(function(){w=false;b.hasmousefocus=false}))}b.onkeypress=function(c){if(b.locked&&b.page.maxh==0)return true;var c=c?c:window.e,f=b.getTarget(c);if(f&&/INPUT|TEXTAREA|SELECT|OPTION/.test(f.nodeName)&&
(!f.getAttribute("type")&&!f.type||!/submit|button|cancel/i.tp))return true;if(b.hasfocus||b.hasmousefocus&&!s||b.ispage&&!s&&!w){var f=c.keyCode,g=c.ctrlKey||false;if(b.locked&&f!=27)return b.cancelEvent(c);var e=false;switch(f){case 38:case 63233:b.doScrollBy(72);e=true;break;case 40:case 63235:b.doScrollBy(-72);e=true;break;case 37:case 63232:b.railh&&(g?b.doScrollLeft(0):b.doScrollLeftBy(72),e=true);break;case 39:case 63234:b.railh&&(g?b.doScrollLeft(b.page.maxw):b.doScrollLeftBy(-72),e=true);
break;case 33:case 63276:b.doScrollBy(b.view.h);e=true;break;case 34:case 63277:b.doScrollBy(-b.view.h);e=true;break;case 36:case 63273:b.railh&&g?b.doScrollPos(0,0):b.doScrollTo(0);e=true;break;case 35:case 63275:b.railh&&g?b.doScrollPos(b.page.maxw,b.page.maxh):b.doScrollTo(b.page.maxh);e=true;break;case 32:b.opt.spacebarenabled&&(b.doScrollBy(-b.view.h),e=true);break;case 27:b.zoomactive&&(b.doZoom(),e=true)}if(e)return b.cancelEvent(c)}};b.opt.enablekeyboard&&b.bind(document,e.isopera&&!e.isopera12?
"keypress":"keydown",b.onkeypress);b.bind(window,"resize",b.resize);b.bind(window,"orientationchange",b.resize);b.bind(window,"load",b.resize);if(e.ischrome&&!b.ispage&&!b.haswrapper){var n=b.win.attr("style"),g=parseFloat(b.win.css("width"))+1;b.win.css("width",g);b.synched("chromefix",function(){b.win.attr("style",n)})}b.onAttributeChange=function(){b.lazyResize()};if(!b.ispage&&!b.haswrapper)"WebKitMutationObserver"in window?(b.observer=new WebKitMutationObserver(function(c){c.forEach(b.onAttributeChange)}),
b.observer.observe(b.win[0],{attributes:true,subtree:false})):(b.bind(b.win,e.isie&&!e.isie9?"propertychange":"DOMAttrModified",b.onAttributeChange),e.isie9&&b.win[0].attachEvent("onpropertychange",b.onAttributeChange));!b.ispage&&b.opt.boxzoom&&b.bind(window,"resize",b.resizeZoom);b.istextarea&&b.bind(b.win,"mouseup",b.resize);b.resize()}if(this.doc[0].nodeName=="IFRAME"){var A=function(){b.iframexd=false;try{var c="contentDocument"in this?this.contentDocument:this.contentWindow.document}catch(f){b.iframexd=
true,c=false}if(b.iframexd)return"console"in window&&console.log("NiceScroll error: policy restriced iframe"),true;b.forcescreen=true;if(b.isiframe)b.iframe={doc:d(c),html:b.doc.contents().find("html")[0],body:b.doc.contents().find("body")[0]},b.getContentSize=function(){return{w:Math.max(b.iframe.html.scrollWidth,b.iframe.body.scrollWidth),h:Math.max(b.iframe.html.scrollHeight,b.iframe.body.scrollHeight)}},b.docscroll=d(b.iframe.body);if(!e.isios&&b.opt.iframeautoresize&&!b.isiframe){b.win.scrollTop(0);
b.doc.height("");var g=Math.max(c.getElementsByTagName("html")[0].scrollHeight,c.body.scrollHeight);b.doc.height(g)}b.resize();e.isie7&&b.css(d(b.iframe.html),{"overflow-y":"hidden"});b.css(d(b.iframe.body),{"overflow-y":"hidden"});"contentWindow"in this?b.bind(this.contentWindow,"scroll",b.onscroll):b.bind(c,"scroll",b.onscroll);b.opt.enablemousewheel&&b.bind(c,"mousewheel",b.onmousewheel);b.opt.enablekeyboard&&b.bind(c,e.isopera?"keypress":"keydown",b.onkeypress);if(e.cantouch||b.opt.touchbehavior)b.bind(c,
"mousedown",b.onmousedown),b.bind(c,"mousemove",function(c){b.onmousemove(c,true)}),e.cursorgrabvalue&&b.css(d(c.body),{cursor:e.cursorgrabvalue});b.bind(c,"mouseup",b.onmouseup);b.zoom&&(b.opt.dblclickzoom&&b.bind(c,"dblclick",b.doZoom),b.ongesturezoom&&b.bind(c,"gestureend",b.ongesturezoom))};this.doc[0].readyState&&this.doc[0].readyState=="complete"&&setTimeout(function(){A.call(b.doc[0],false)},500);b.bind(this.doc,"load",A)}};this.showCursor=function(c,e){if(b.cursortimeout)clearTimeout(b.cursortimeout),
b.cursortimeout=0;if(b.rail){if(b.autohidedom)b.autohidedom.stop().css({opacity:b.opt.cursoropacitymax}),b.cursoractive=true;if(typeof c!="undefined"&&c!==false)b.scroll.y=Math.round(c*1/b.scrollratio.y);if(typeof e!="undefined")b.scroll.x=Math.round(e*1/b.scrollratio.x);b.cursor.css({height:b.cursorheight,top:b.scroll.y});if(b.cursorh)!b.rail.align&&b.rail.visibility?b.cursorh.css({width:b.cursorwidth,left:b.scroll.x+b.rail.width}):b.cursorh.css({width:b.cursorwidth,left:b.scroll.x}),b.cursoractive=
true;b.zoom&&b.zoom.stop().css({opacity:b.opt.cursoropacitymax})}};this.hideCursor=function(c){if(!b.cursortimeout&&b.rail&&b.autohidedom)b.cursortimeout=setTimeout(function(){if(!b.rail.active||!b.showonmouseevent)b.autohidedom.stop().animate({opacity:b.opt.cursoropacitymin}),b.zoom&&b.zoom.stop().animate({opacity:b.opt.cursoropacitymin}),b.cursoractive=false;b.cursortimeout=0},c||400)};this.noticeCursor=function(c,e,g){b.showCursor(e,g);b.rail.active||b.hideCursor(c)};this.getContentSize=b.ispage?
function(){return{w:Math.max(document.body.scrollWidth,document.documentElement.scrollWidth),h:Math.max(document.body.scrollHeight,document.documentElement.scrollHeight)}}:b.haswrapper?function(){return{w:b.doc.outerWidth()+parseInt(b.win.css("paddingLeft"))+parseInt(b.win.css("paddingRight")),h:b.doc.outerHeight()+parseInt(b.win.css("paddingTop"))+parseInt(b.win.css("paddingBottom"))}}:function(){return{w:b.docscroll[0].scrollWidth,h:b.docscroll[0].scrollHeight}};this.onResize=function(c,e){if(!b.win)return false;
if(!b.haswrapper&&!b.ispage)if(b.win.css("display")=="none")return b.visibility&&b.hideRail().hideRailHr(),false;else!b.hidden&&!b.visibility&&b.showRail().showRailHr();var g=b.page.maxh,d=b.page.maxw,h=b.view.w;b.view={w:b.ispage?b.win.width():parseInt(b.win[0].clientWidth),h:b.ispage?b.win.height():parseInt(b.win[0].clientHeight)};b.page=e?e:b.getContentSize();b.page.maxh=Math.max(0,b.page.h-b.view.h);b.page.maxw=Math.max(0,b.page.w-b.view.w);if(b.page.maxh==g&&b.page.maxw==d&&b.view.w==h)if(b.ispage)return b;
else{g=b.win.offset();if(b.lastposition&&(d=b.lastposition,d.top==g.top&&d.left==g.left))return b;b.lastposition=g}b.page.maxh==0?(b.hideRail(),b.scrollvaluemax=0,b.scroll.y=0,b.scrollratio.y=0,b.cursorheight=0,b.setScrollTop(0),b.rail.scrollable=false):b.rail.scrollable=true;b.page.maxw==0?(b.hideRailHr(),b.scrollvaluemaxw=0,b.scroll.x=0,b.scrollratio.x=0,b.cursorwidth=0,b.setScrollLeft(0),b.railh.scrollable=false):b.railh.scrollable=true;b.locked=b.page.maxh==0&&b.page.maxw==0;if(b.locked)return b.ispage||
b.updateScrollBar(b.view),false;!b.hidden&&!b.visibility?b.showRail().showRailHr():!b.hidden&&!b.railh.visibility&&b.showRailHr();b.istextarea&&b.win.css("resize")&&b.win.css("resize")!="none"&&(b.view.h-=20);b.ispage||b.updateScrollBar(b.view);b.cursorheight=Math.min(b.view.h,Math.round(b.view.h*(b.view.h/b.page.h)));b.cursorheight=Math.max(b.opt.cursorminheight,b.cursorheight);b.cursorwidth=Math.min(b.view.w,Math.round(b.view.w*(b.view.w/b.page.w)));b.cursorwidth=Math.max(b.opt.cursorminheight,
b.cursorwidth);b.scrollvaluemax=b.view.h-b.cursorheight-b.cursor.hborder;if(b.railh)b.railh.width=b.page.maxh>0?b.view.w-b.rail.width:b.view.w,b.scrollvaluemaxw=b.railh.width-b.cursorwidth-b.cursorh.wborder;b.scrollratio={x:b.page.maxw/b.scrollvaluemaxw,y:b.page.maxh/b.scrollvaluemax};b.getScrollTop()>b.page.maxh?b.doScroll(b.page.maxh):(b.scroll.y=Math.round(b.getScrollTop()*(1/b.scrollratio.y)),b.scroll.x=Math.round(b.getScrollLeft()*(1/b.scrollratio.x)),b.cursoractive&&b.noticeCursor());b.scroll.y&&
b.getScrollTop()==0&&b.doScrollTo(Math.floor(b.scroll.y*b.scrollratio.y));return b};this.resize=function(){b.delayed("resize",b.onResize,30);return b};this.lazyResize=function(){b.delayed("resize",b.resize,250)};this._bind=function(c,e,g,d){b.events.push({e:c,n:e,f:g,b:d});c.addEventListener?c.addEventListener(e,g,d||false):c.attachEvent?c.attachEvent("on"+e,g):c["on"+e]=g};this.bind=function(c,d,g,h){var i="jquery"in c?c[0]:c;i.addEventListener?(e.cantouch&&/mouseup|mousedown|mousemove/.test(d)&&
b._bind(i,d=="mousedown"?"touchstart":d=="mouseup"?"touchend":"touchmove",function(b){if(b.touches){if(b.touches.length<2){var c=b.touches.length?b.touches[0]:b;c.original=b;g.call(this,c)}}else if(b.changedTouches)c=b.changedTouches[0],c.original=b,g.call(this,c)},h||false),b._bind(i,d,g,h||false),d=="mousewheel"&&b._bind(i,"DOMMouseScroll",g,h||false),e.cantouch&&d=="mouseup"&&b._bind(i,"touchcancel",g,h||false)):b._bind(i,d,function(c){if((c=c||window.event||false)&&c.srcElement)c.target=c.srcElement;
return g.call(i,c)===false||h===false?b.cancelEvent(c):true})};this._unbind=function(b,c,g,e){b.removeEventListener?b.removeEventListener(c,g,e):b.detachEvent?b.detachEvent("on"+c,g):b["on"+c]=false};this.unbindAll=function(){for(var c=0;c<b.events.length;c++){var e=b.events[c];b._unbind(e.e,e.n,e.f,e.b)}};this.cancelEvent=function(b){b=b.original?b.original:b?b:window.event||false;if(!b)return false;b.preventDefault&&b.preventDefault();b.stopPropagation&&b.stopPropagation();b.preventManipulation&&
b.preventManipulation();b.cancelBubble=true;b.cancel=true;return b.returnValue=false};this.stopPropagation=function(b){b=b.original?b.original:b?b:window.event||false;if(!b)return false;if(b.stopPropagation)return b.stopPropagation();if(b.cancelBubble)b.cancelBubble=true;return false};this.showRail=function(){if(b.page.maxh!=0&&(b.ispage||b.win.css("display")!="none"))b.visibility=true,b.rail.visibility=true,b.rail.css("display","block");return b};this.showRailHr=function(){if(!b.railh)return b;if(b.page.maxw!=
0&&(b.ispage||b.win.css("display")!="none"))b.railh.visibility=true,b.railh.css("display","block");return b};this.hideRail=function(){b.visibility=false;b.rail.visibility=false;b.rail.css("display","none");return b};this.hideRailHr=function(){if(!b.railh)return b;b.railh.visibility=false;b.railh.css("display","none");return b};this.show=function(){b.hidden=false;b.locked=false;return b.showRail().showRailHr()};this.hide=function(){b.hidden=true;b.locked=true;return b.hideRail().hideRailHr()};this.remove=
function(){b.doZoomOut();b.unbindAll();b.observer!==false&&b.observer.disconnect();b.events=[];if(b.cursor)b.cursor.remove(),b.cursor=null;if(b.cursorh)b.cursorh.remove(),b.cursorh=null;if(b.rail)b.rail.remove(),b.rail=null;if(b.railh)b.railh.remove(),b.railh=null;if(b.zoom)b.zoom.remove(),b.zoom=null;for(var c=0;c<b.saved.css.length;c++){var e=b.saved.css[c];e[0].css(e[1],typeof e[2]=="undefined"?"":e[2])}b.saved=false;b.me.data("__nicescroll","");b.me=null;b.doc=null;b.docscroll=null;b.win=null;
return b};this.scrollstart=function(c){this.onscrollstart=c;return b};this.scrollend=function(c){this.onscrollend=c;return b};this.scrollcancel=function(c){this.onscrollcancel=c;return b};this.zoomin=function(c){this.onzoomin=c;return b};this.zoomout=function(c){this.onzoomout=c;return b};this.isScrollable=function(b){for(b=b.target?b.target:b;b&&b.nodeType==1&&!/BODY|HTML/.test(b.nodeName);){var c=d(b);if(/scroll|auto/.test(c.css("overflowY")||c.css("overflowX")||c.css("overflow")||""))return b.clientHeight!=
b.scrollHeight;b=b.parentNode?b.parentNode:false}return false};this.onmousewheel=function(c){if(b.locked)return true;if(!b.rail.scrollable)return b.railh&&b.railh.scrollable?b.onmousewheelhr(c):true;if(b.opt.preservenativescrolling&&b.checkarea)b.checkarea=false,b.nativescrollingarea=b.isScrollable(c);if(b.nativescrollingarea)return true;if(b.locked)return b.cancelEvent(c);if(b.rail.drag)return b.cancelEvent(c);i(c,false);return b.cancelEvent(c)};this.onmousewheelhr=function(c){if(b.locked||!b.railh.scrollable)return true;
if(b.opt.preservenativescrolling&&b.checkarea)b.checkarea=false,b.nativescrollingarea=b.isScrollable(c);if(b.nativescrollingarea)return true;if(b.locked)return b.cancelEvent(c);if(b.rail.drag)return b.cancelEvent(c);i(c,true);return b.cancelEvent(c)};this.stop=function(){b.cancelScroll();b.scrollmon&&b.scrollmon.stop();b.cursorfreezed=false;b.scroll.y=Math.round(b.getScrollTop()*(1/b.scrollratio.y));b.noticeCursor();return b};this.getTransitionSpeed=function(c){var e=Math.round(b.opt.scrollspeed*
10),c=Math.min(e,Math.round(c/20*b.opt.scrollspeed));return c>20?c:0};b.opt.smoothscroll?b.ishwscroll&&e.hastransition&&b.opt.usetransition?(this.prepareTransition=function(c,d){var g=d?c>20?c:0:b.getTransitionSpeed(c),h=g?e.prefixstyle+"transform "+g+"ms ease-out":"";if(!b.lasttransitionstyle||b.lasttransitionstyle!=h)b.lasttransitionstyle=h,b.doc.css(e.transitionstyle,h);return g},this.doScrollLeft=function(c,e){var g=b.scrollrunning?b.newscrolly:b.getScrollTop();b.doScrollPos(c,g,e)},this.doScrollTop=
function(c,e){var g=b.scrollrunning?b.newscrollx:b.getScrollLeft();b.doScrollPos(g,c,e)},this.doScrollPos=function(c,d,g){var h=b.getScrollTop(),i=b.getScrollLeft();((b.newscrolly-h)*(d-h)<0||(b.newscrollx-i)*(c-i)<0)&&b.cancelScroll();b.newscrolly=d;b.newscrollx=c;b.newscrollspeed=g||false;if(b.timer)return false;b.timer=setTimeout(function(){var g=b.getScrollTop(),h=b.getScrollLeft(),i,j;i=c-h;j=d-g;i=Math.round(Math.sqrt(Math.pow(i,2)+Math.pow(j,2)));i=b.prepareTransition(b.newscrollspeed?b.newscrollspeed:
i);b.timerscroll&&b.timerscroll.tm&&clearInterval(b.timerscroll.tm);if(i>0){!b.scrollrunning&&b.onscrollstart&&b.onscrollstart.call(b,{type:"scrollstart",current:{x:h,y:g},request:{x:c,y:d},end:{x:b.newscrollx,y:b.newscrolly},speed:i});if(e.transitionend){if(!b.scrollendtrapped)b.scrollendtrapped=true,b.bind(b.doc,e.transitionend,b.onScrollEnd,false)}else b.scrollendtrapped&&clearTimeout(b.scrollendtrapped),b.scrollendtrapped=setTimeout(b.onScrollEnd,i);b.timerscroll={bz:new BezierClass(g,b.newscrolly,
i,0,0,0.58,1),bh:new BezierClass(h,b.newscrollx,i,0,0,0.58,1)};if(!b.cursorfreezed)b.timerscroll.tm=setInterval(function(){b.showCursor(b.getScrollTop(),b.getScrollLeft())},60)}b.synched("doScroll-set",function(){b.timer=0;if(b.scrollendtrapped)b.scrollrunning=true;b.setScrollTop(b.newscrolly);b.setScrollLeft(b.newscrollx);if(!b.scrollendtrapped)b.onScrollEnd()})},50)},this.cancelScroll=function(){if(!b.scrollendtrapped)return true;var c=b.getScrollTop(),d=b.getScrollLeft();b.scrollrunning=false;
e.transitionend||clearTimeout(e.transitionend);b.scrollendtrapped=false;b._unbind(b.doc,e.transitionend,b.onScrollEnd);b.prepareTransition(0);b.setScrollTop(c);b.railh&&b.setScrollLeft(d);b.timerscroll&&b.timerscroll.tm&&clearInterval(b.timerscroll.tm);b.timerscroll=false;b.cursorfreezed=false;b.showCursor(c,d);return b},this.onScrollEnd=function(){b.scrollendtrapped&&b._unbind(b.doc,e.transitionend,b.onScrollEnd);b.scrollendtrapped=false;b.prepareTransition(0);b.timerscroll&&b.timerscroll.tm&&clearInterval(b.timerscroll.tm);
b.timerscroll=false;var c=b.getScrollTop(),d=b.getScrollLeft();b.setScrollTop(c);b.railh&&b.setScrollLeft(d);b.noticeCursor(false,c,d);b.cursorfreezed=false;if(c<0)c=0;else if(c>b.page.maxh)c=b.page.maxh;if(d<0)d=0;else if(d>b.page.maxw)d=b.page.maxw;if(c!=b.newscrolly||d!=b.newscrollx)return b.doScrollPos(d,c,b.opt.snapbackspeed);b.onscrollend&&b.scrollrunning&&b.onscrollend.call(b,{type:"scrollend",current:{x:d,y:c},end:{x:b.newscrollx,y:b.newscrolly}});b.scrollrunning=false}):(this.doScrollLeft=
function(c){var e=b.scrollrunning?b.newscrolly:b.getScrollTop();b.doScrollPos(c,e)},this.doScrollTop=function(c){var e=b.scrollrunning?b.newscrollx:b.getScrollLeft();b.doScrollPos(e,c)},this.doScrollPos=function(c,e){function g(){if(b.cancelAnimationFrame)return true;b.scrollrunning=true;if(o=1-o)return b.timer=q(g)||1;var c=0,f=sy=b.getScrollTop();if(b.dst.ay){var f=b.bzscroll?b.dst.py+b.bzscroll.getNow()*b.dst.ay:b.newscrolly,e=f-sy;if(e<0&&f<b.newscrolly||e>0&&f>b.newscrolly)f=b.newscrolly;b.setScrollTop(f);
f==b.newscrolly&&(c=1)}else c=1;var d=sx=b.getScrollLeft();if(b.dst.ax){d=b.bzscroll?b.dst.px+b.bzscroll.getNow()*b.dst.ax:b.newscrollx;e=d-sx;if(e<0&&d<b.newscrollx||e>0&&d>b.newscrollx)d=b.newscrollx;b.setScrollLeft(d);d==b.newscrollx&&(c+=1)}else c+=1;if(c==2){b.timer=0;b.cursorfreezed=false;b.bzscroll=false;b.scrollrunning=false;if(f<0)f=0;else if(f>b.page.maxh)f=b.page.maxh;if(d<0)d=0;else if(d>b.page.maxw)d=b.page.maxw;d!=b.newscrollx||f!=b.newscrolly?b.doScrollPos(d,f):b.onscrollend&&b.onscrollend.call(b,
{type:"scrollend",current:{x:sx,y:sy},end:{x:b.newscrollx,y:b.newscrolly}})}else b.timer=q(g)||1}e=typeof e=="undefined"||e===false?b.getScrollTop(true):e;if(b.timer&&b.newscrolly==e&&b.newscrollx==c)return true;b.timer&&r(b.timer);b.timer=0;var d=b.getScrollTop(),h=b.getScrollLeft();((b.newscrolly-d)*(e-d)<0||(b.newscrollx-h)*(c-h)<0)&&b.cancelScroll();b.newscrolly=e;b.newscrollx=c;if(!b.bouncescroll||!b.rail.visibility)if(b.newscrolly<0)b.newscrolly=0;else if(b.newscrolly>b.page.maxh)b.newscrolly=
b.page.maxh;if(!b.bouncescroll||!b.railh.visibility)if(b.newscrollx<0)b.newscrollx=0;else if(b.newscrollx>b.page.maxw)b.newscrollx=b.page.maxw;b.dst={};b.dst.x=c-h;b.dst.y=e-d;b.dst.px=h;b.dst.py=d;var i=Math.round(Math.sqrt(Math.pow(b.dst.x,2)+Math.pow(b.dst.y,2)));b.dst.ax=b.dst.x/i;b.dst.ay=b.dst.y/i;var j=0,k=i;if(b.dst.x==0)j=d,k=e,b.dst.ay=1,b.dst.py=0;else if(b.dst.y==0)j=h,k=c,b.dst.ax=1,b.dst.px=0;i=b.getTransitionSpeed(i);b.bzscroll=i>0?b.bzscroll?b.bzscroll.update(k,i):new BezierClass(j,
k,i,0,1,0,1):false;if(!b.timer){(d==b.page.maxh&&e>=b.page.maxh||h==b.page.maxw&&c>=b.page.maxw)&&b.checkContentSize();var o=1;b.cancelAnimationFrame=false;b.timer=1;b.onscrollstart&&!b.scrollrunning&&b.onscrollstart.call(b,{type:"scrollstart",current:{x:h,y:d},request:{x:c,y:e},end:{x:b.newscrollx,y:b.newscrolly},speed:i});g();(d==b.page.maxh&&e>=d||h==b.page.maxw&&c>=h)&&b.checkContentSize();b.noticeCursor()}},this.cancelScroll=function(){b.timer&&r(b.timer);b.timer=0;b.bzscroll=false;b.scrollrunning=
false;return b}):(this.doScrollLeft=function(c,e){var g=b.getScrollTop();b.doScrollPos(c,g,e)},this.doScrollTop=function(c,e){var g=b.getScrollLeft();b.doScrollPos(g,c,e)},this.doScrollPos=function(c,e){var g=c>b.page.maxw?b.page.maxw:c;g<0&&(g=0);var d=e>b.page.maxh?b.page.maxh:e;d<0&&(d=0);b.synched("scroll",function(){b.setScrollTop(d);b.setScrollLeft(g)})},this.cancelScroll=function(){});this.doScrollBy=function(c,e){var d=0,d=e?Math.floor((b.scroll.y-c)*b.scrollratio.y):(b.timer?b.newscrolly:
b.getScrollTop(true))-c;if(b.bouncescroll){var h=Math.round(b.view.h/2);d<-h?d=-h:d>b.page.maxh+h&&(d=b.page.maxh+h)}b.cursorfreezed=false;py=b.getScrollTop(true);if(d<0&&py<=0)return b.noticeCursor();else if(d>b.page.maxh&&py>=b.page.maxh)return b.checkContentSize(),b.noticeCursor();b.doScrollTop(d)};this.doScrollLeftBy=function(c,e){var d=0,d=e?Math.floor((b.scroll.x-c)*b.scrollratio.x):(b.timer?b.newscrollx:b.getScrollLeft(true))-c;if(b.bouncescroll){var h=Math.round(b.view.w/2);d<-h?d=-h:d>b.page.maxw+
h&&(d=b.page.maxw+h)}b.cursorfreezed=false;px=b.getScrollLeft(true);if(d<0&&px<=0)return b.noticeCursor();else if(d>b.page.maxw&&px>=b.page.maxw)return b.noticeCursor();b.doScrollLeft(d)};this.doScrollTo=function(c,e){e&&Math.round(c*b.scrollratio.y);b.cursorfreezed=false;b.doScrollTop(c)};this.checkContentSize=function(){var c=b.getContentSize();(c.h!=b.page.h||c.w!=b.page.w)&&b.resize(false,c)};b.onscroll=function(){b.rail.drag||b.cursorfreezed||b.synched("scroll",function(){b.scroll.y=Math.round(b.getScrollTop()*
(1/b.scrollratio.y));if(b.railh)b.scroll.x=Math.round(b.getScrollLeft()*(1/b.scrollratio.x));b.noticeCursor()})};b.bind(b.docscroll,"scroll",b.onscroll);this.doZoomIn=function(c){if(!b.zoomactive){b.zoomactive=true;b.zoomrestore={style:{}};var h="position,top,left,zIndex,backgroundColor,marginTop,marginBottom,marginLeft,marginRight".split(","),g=b.win[0].style,i;for(i in h){var j=h[i];b.zoomrestore.style[j]=typeof g[j]!="undefined"?g[j]:""}b.zoomrestore.style.width=b.win.css("width");b.zoomrestore.style.height=
b.win.css("height");b.zoomrestore.padding={w:b.win.outerWidth()-b.win.width(),h:b.win.outerHeight()-b.win.height()};if(e.isios4)b.zoomrestore.scrollTop=d(window).scrollTop(),d(window).scrollTop(0);b.win.css({position:e.isios4?"absolute":"fixed",top:0,left:0,"z-index":b.opt.zindex+100,margin:"0px"});h=b.win.css("backgroundColor");(h==""||/transparent|rgba\(0, 0, 0, 0\)|rgba\(0,0,0,0\)/.test(h))&&b.win.css("backgroundColor","#fff");b.rail.css({"z-index":b.opt.zindex+110});b.zoom.css({"z-index":b.opt.zindex+
112});b.zoom.css("backgroundPosition","0px -18px");b.resizeZoom();b.onzoomin&&b.onzoomin.call(b);return b.cancelEvent(c)}};this.doZoomOut=function(c){if(b.zoomactive)return b.zoomactive=false,b.win.css("margin",""),b.win.css(b.zoomrestore.style),e.isios4&&d(window).scrollTop(b.zoomrestore.scrollTop),b.rail.css({"z-index":b.ispage?b.opt.zindex:b.opt.zindex+2}),b.zoom.css({"z-index":b.opt.zindex}),b.zoomrestore=false,b.zoom.css("backgroundPosition","0px 0px"),b.onResize(),b.onzoomout&&b.onzoomout.call(b),
b.cancelEvent(c)};this.doZoom=function(c){return b.zoomactive?b.doZoomOut(c):b.doZoomIn(c)};this.resizeZoom=function(){if(b.zoomactive){var c=b.getScrollTop();b.win.css({width:d(window).width()-b.zoomrestore.padding.w+"px",height:d(window).height()-b.zoomrestore.padding.h+"px"});b.onResize();b.setScrollTop(Math.min(b.page.maxh,c))}};this.init();d.nicescroll.push(this)},z=function(d){var c=this;this.nc=d;this.steptime=this.lasttime=this.speedy=this.speedx=this.lasty=this.lastx=0;this.snapy=this.snapx=
false;this.demuly=this.demulx=0;this.lastscrolly=this.lastscrollx=-1;this.timer=this.chky=this.chkx=0;this.time=function(){return+new Date};this.reset=function(d,i){c.stop();var b=c.time();c.steptime=0;c.lasttime=b;c.speedx=0;c.speedy=0;c.lastx=d;c.lasty=i;c.lastscrollx=-1;c.lastscrolly=-1};this.update=function(d,i){var b=c.time();c.steptime=b-c.lasttime;c.lasttime=b;var b=i-c.lasty,j=d-c.lastx,e=c.nc.getScrollTop(),n=c.nc.getScrollLeft();e+=b;n+=j;c.snapx=n<0||n>c.nc.page.maxw;c.snapy=e<0||e>c.nc.page.maxh;
c.speedx=j;c.speedy=b;c.lastx=d;c.lasty=i};this.stop=function(){c.nc.unsynched("domomentum2d");c.timer&&clearTimeout(c.timer);c.timer=0;c.lastscrollx=-1;c.lastscrolly=-1};this.doSnapy=function(d,i){var b=false;if(i<0)i=0,b=true;else if(i>c.nc.page.maxh)i=c.nc.page.maxh,b=true;if(d<0)d=0,b=true;else if(d>c.nc.page.maxw)d=c.nc.page.maxw,b=true;b&&c.nc.doScrollPos(d,i,c.nc.opt.snapbackspeed)};this.doMomentum=function(d){var i=c.time(),b=d?i+d:c.lasttime,d=c.nc.getScrollLeft(),j=c.nc.getScrollTop(),e=
c.nc.page.maxh,n=c.nc.page.maxw;c.speedx=n>0?Math.min(60,c.speedx):0;c.speedy=e>0?Math.min(60,c.speedy):0;b=b&&i-b<=50;if(j<0||j>e||d<0||d>n)b=false;d=c.speedx&&b?c.speedx:false;if(c.speedy&&b&&c.speedy||d){var p=Math.max(16,c.steptime);p>50&&(d=p/50,c.speedx*=d,c.speedy*=d,p=50);c.demulxy=0;c.lastscrollx=c.nc.getScrollLeft();c.chkx=c.lastscrollx;c.lastscrolly=c.nc.getScrollTop();c.chky=c.lastscrolly;var f=c.lastscrollx,l=c.lastscrolly,g=function(){var b=c.time()-i>600?0.04:0.02;if(c.speedx&&(f=Math.floor(c.lastscrollx-
c.speedx*(1-c.demulxy)),c.lastscrollx=f,f<0||f>n))b=0.1;if(c.speedy&&(l=Math.floor(c.lastscrolly-c.speedy*(1-c.demulxy)),c.lastscrolly=l,l<0||l>e))b=0.1;c.demulxy=Math.min(1,c.demulxy+b);c.nc.synched("domomentum2d",function(){if(c.speedx)c.nc.getScrollLeft()!=c.chkx&&c.stop(),c.chkx=f,c.nc.setScrollLeft(f);if(c.speedy)c.nc.getScrollTop()!=c.chky&&c.stop(),c.chky=l,c.nc.setScrollTop(l);c.timer||(c.nc.hideCursor(),c.doSnapy(f,l))});c.demulxy<1?c.timer=setTimeout(g,p):(c.stop(),c.nc.hideCursor(),c.doSnapy(f,
l))};g()}else c.doSnapy(c.nc.getScrollLeft(),c.nc.getScrollTop())}},t=d.fn.scrollTop;d.cssHooks.pageYOffset={get:function(j){var c=d.data(j,"__nicescroll")||false;return c&&c.ishwscroll?c.getScrollTop():t.call(j)},set:function(j,c){var h=d.data(j,"__nicescroll")||false;h&&h.ishwscroll?h.setScrollTop(parseInt(c)):t.call(j,c);return this}};d.fn.scrollTop=function(j){if(typeof j=="undefined"){var c=this[0]?d.data(this[0],"__nicescroll")||false:false;return c&&c.ishwscroll?c.getScrollTop():t.call(this)}else return this.each(function(){var c=
d.data(this,"__nicescroll")||false;c&&c.ishwscroll?c.setScrollTop(parseInt(j)):t.call(d(this),j)})};var u=d.fn.scrollLeft;d.cssHooks.pageXOffset={get:function(j){var c=d.data(j,"__nicescroll")||false;return c&&c.ishwscroll?c.getScrollLeft():u.call(j)},set:function(j,c){var h=d.data(j,"__nicescroll")||false;h&&h.ishwscroll?h.setScrollLeft(parseInt(c)):u.call(j,c);return this}};d.fn.scrollLeft=function(j){if(typeof j=="undefined"){var c=this[0]?d.data(this[0],"__nicescroll")||false:false;return c&&
c.ishwscroll?c.getScrollLeft():u.call(this)}else return this.each(function(){var c=d.data(this,"__nicescroll")||false;c&&c.ishwscroll?c.setScrollLeft(parseInt(j)):u.call(d(this),j)})};var v=function(j){var c=this;this.length=0;this.name="nicescrollarray";this.each=function(d){for(var b=0;b<c.length;b++)d.call(c[b]);return c};this.push=function(d){c[c.length]=d;c.length++};this.eq=function(d){return c[d]};if(j)for(a=0;a<j.length;a++){var h=d.data(j[a],"__nicescroll")||false;h&&(this[this.length]=h,
this.length++)}return this};(function(d,c,h){for(var i=0;i<c.length;i++)h(d,c[i])})(v.prototype,"show,hide,onResize,resize,remove,stop,doScrollPos".split(","),function(d,c){d[c]=function(){var d=arguments;return this.each(function(){this[c].apply(this,d)})}});d.fn.getNiceScroll=function(j){return typeof j=="undefined"?new v(this):d.data(this[j],"__nicescroll")||false};d.extend(d.expr[":"],{nicescroll:function(j){return d.data(j,"__nicescroll")?true:false}});d.fn.niceScroll=function(j,c){typeof c==
"undefined"&&typeof j=="object"&&!("jquery"in j)&&(c=j,j=false);var h=new v;typeof c=="undefined"&&(c={});if(j)c.doc=d(j),c.win=d(this);var i=!("doc"in c);if(!i&&!("win"in c))c.win=d(this);this.each(function(){var b=d(this).data("__nicescroll")||false;if(!b)c.doc=i?d(this):c.doc,b=new F(c,d(this)),d(this).data("__nicescroll",b);h.push(b)});return h.length==1?h[0]:h};window.NiceScroll={getjQuery:function(){return d}};if(!d.nicescroll)d.nicescroll=new v})(jQuery);

///#source 1 1 /monsters/js/lib/knockout.js
// Knockout JavaScript library v2.2.1
// (c) Steven Sanderson - http://knockoutjs.com/
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

(function() {function j(w){throw w;}var m=!0,p=null,r=!1;function u(w){return function(){return w}};var x=window,y=document,ga=navigator,F=window.jQuery,I=void 0;
function L(w){function ha(a,d,c,e,f){var g=[];a=b.j(function(){var a=d(c,f)||[];0<g.length&&(b.a.Ya(M(g),a),e&&b.r.K(e,p,[c,a,f]));g.splice(0,g.length);b.a.P(g,a)},p,{W:a,Ka:function(){return 0==g.length||!b.a.X(g[0])}});return{M:g,j:a.pa()?a:I}}function M(a){for(;a.length&&!b.a.X(a[0]);)a.splice(0,1);if(1<a.length){for(var d=a[0],c=a[a.length-1],e=[d];d!==c;){d=d.nextSibling;if(!d)return;e.push(d)}Array.prototype.splice.apply(a,[0,a.length].concat(e))}return a}function S(a,b,c,e,f){var g=Math.min,
h=Math.max,k=[],l,n=a.length,q,s=b.length,v=s-n||1,G=n+s+1,J,A,z;for(l=0;l<=n;l++){A=J;k.push(J=[]);z=g(s,l+v);for(q=h(0,l-1);q<=z;q++)J[q]=q?l?a[l-1]===b[q-1]?A[q-1]:g(A[q]||G,J[q-1]||G)+1:q+1:l+1}g=[];h=[];v=[];l=n;for(q=s;l||q;)s=k[l][q]-1,q&&s===k[l][q-1]?h.push(g[g.length]={status:c,value:b[--q],index:q}):l&&s===k[l-1][q]?v.push(g[g.length]={status:e,value:a[--l],index:l}):(g.push({status:"retained",value:b[--q]}),--l);if(h.length&&v.length){a=10*n;var t;for(b=c=0;(f||b<a)&&(t=h[c]);c++){for(e=
0;k=v[e];e++)if(t.value===k.value){t.moved=k.index;k.moved=t.index;v.splice(e,1);b=e=0;break}b+=e}}return g.reverse()}function T(a,d,c,e,f){f=f||{};var g=a&&N(a),g=g&&g.ownerDocument,h=f.templateEngine||O;b.za.vb(c,h,g);c=h.renderTemplate(c,e,f,g);("number"!=typeof c.length||0<c.length&&"number"!=typeof c[0].nodeType)&&j(Error("Template engine must return an array of DOM nodes"));g=r;switch(d){case "replaceChildren":b.e.N(a,c);g=m;break;case "replaceNode":b.a.Ya(a,c);g=m;break;case "ignoreTargetNode":break;
default:j(Error("Unknown renderMode: "+d))}g&&(U(c,e),f.afterRender&&b.r.K(f.afterRender,p,[c,e.$data]));return c}function N(a){return a.nodeType?a:0<a.length?a[0]:p}function U(a,d){if(a.length){var c=a[0],e=a[a.length-1];V(c,e,function(a){b.Da(d,a)});V(c,e,function(a){b.s.ib(a,[d])})}}function V(a,d,c){var e;for(d=b.e.nextSibling(d);a&&(e=a)!==d;)a=b.e.nextSibling(e),(1===e.nodeType||8===e.nodeType)&&c(e)}function W(a,d,c){a=b.g.aa(a);for(var e=b.g.Q,f=0;f<a.length;f++){var g=a[f].key;if(e.hasOwnProperty(g)){var h=
e[g];"function"===typeof h?(g=h(a[f].value))&&j(Error(g)):h||j(Error("This template engine does not support the '"+g+"' binding within its templates"))}}a="ko.__tr_ambtns(function($context,$element){return(function(){return{ "+b.g.ba(a)+" } })()})";return c.createJavaScriptEvaluatorBlock(a)+d}function X(a,d,c,e){function f(a){return function(){return k[a]}}function g(){return k}var h=0,k,l;b.j(function(){var n=c&&c instanceof b.z?c:new b.z(b.a.d(c)),q=n.$data;e&&b.eb(a,n);if(k=("function"==typeof d?
d(n,a):d)||b.J.instance.getBindings(a,n)){if(0===h){h=1;for(var s in k){var v=b.c[s];v&&8===a.nodeType&&!b.e.I[s]&&j(Error("The binding '"+s+"' cannot be used with virtual elements"));if(v&&"function"==typeof v.init&&(v=(0,v.init)(a,f(s),g,q,n))&&v.controlsDescendantBindings)l!==I&&j(Error("Multiple bindings ("+l+" and "+s+") are trying to control descendant bindings of the same element. You cannot use these bindings together on the same element.")),l=s}h=2}if(2===h)for(s in k)(v=b.c[s])&&"function"==
typeof v.update&&(0,v.update)(a,f(s),g,q,n)}},p,{W:a});return{Nb:l===I}}function Y(a,d,c){var e=m,f=1===d.nodeType;f&&b.e.Ta(d);if(f&&c||b.J.instance.nodeHasBindings(d))e=X(d,p,a,c).Nb;e&&Z(a,d,!f)}function Z(a,d,c){for(var e=b.e.firstChild(d);d=e;)e=b.e.nextSibling(d),Y(a,d,c)}function $(a,b){var c=aa(a,b);return c?0<c.length?c[c.length-1].nextSibling:a.nextSibling:p}function aa(a,b){for(var c=a,e=1,f=[];c=c.nextSibling;){if(H(c)&&(e--,0===e))return f;f.push(c);B(c)&&e++}b||j(Error("Cannot find closing comment tag to match: "+
a.nodeValue));return p}function H(a){return 8==a.nodeType&&(K?a.text:a.nodeValue).match(ia)}function B(a){return 8==a.nodeType&&(K?a.text:a.nodeValue).match(ja)}function P(a,b){for(var c=p;a!=c;)c=a,a=a.replace(ka,function(a,c){return b[c]});return a}function la(){var a=[],d=[];this.save=function(c,e){var f=b.a.i(a,c);0<=f?d[f]=e:(a.push(c),d.push(e))};this.get=function(c){c=b.a.i(a,c);return 0<=c?d[c]:I}}function ba(a,b,c){function e(e){var g=b(a[e]);switch(typeof g){case "boolean":case "number":case "string":case "function":f[e]=
g;break;case "object":case "undefined":var h=c.get(g);f[e]=h!==I?h:ba(g,b,c)}}c=c||new la;a=b(a);if(!("object"==typeof a&&a!==p&&a!==I&&!(a instanceof Date)))return a;var f=a instanceof Array?[]:{};c.save(a,f);var g=a;if(g instanceof Array){for(var h=0;h<g.length;h++)e(h);"function"==typeof g.toJSON&&e("toJSON")}else for(h in g)e(h);return f}function ca(a,d){if(a)if(8==a.nodeType){var c=b.s.Ua(a.nodeValue);c!=p&&d.push({sb:a,Fb:c})}else if(1==a.nodeType)for(var c=0,e=a.childNodes,f=e.length;c<f;c++)ca(e[c],
d)}function Q(a,d,c,e){b.c[a]={init:function(a){b.a.f.set(a,da,{});return{controlsDescendantBindings:m}},update:function(a,g,h,k,l){h=b.a.f.get(a,da);g=b.a.d(g());k=!c!==!g;var n=!h.Za;if(n||d||k!==h.qb)n&&(h.Za=b.a.Ia(b.e.childNodes(a),m)),k?(n||b.e.N(a,b.a.Ia(h.Za)),b.Ea(e?e(l,g):l,a)):b.e.Y(a),h.qb=k}};b.g.Q[a]=r;b.e.I[a]=m}function ea(a,d,c){c&&d!==b.k.q(a)&&b.k.T(a,d);d!==b.k.q(a)&&b.r.K(b.a.Ba,p,[a,"change"])}var b="undefined"!==typeof w?w:{};b.b=function(a,d){for(var c=a.split("."),e=b,f=0;f<
c.length-1;f++)e=e[c[f]];e[c[c.length-1]]=d};b.p=function(a,b,c){a[b]=c};b.version="2.2.1";b.b("version",b.version);b.a=new function(){function a(a,d){if("input"!==b.a.u(a)||!a.type||"click"!=d.toLowerCase())return r;var c=a.type;return"checkbox"==c||"radio"==c}var d=/^(\s|\u00A0)+|(\s|\u00A0)+$/g,c={},e={};c[/Firefox\/2/i.test(ga.userAgent)?"KeyboardEvent":"UIEvents"]=["keyup","keydown","keypress"];c.MouseEvents="click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave".split(" ");
for(var f in c){var g=c[f];if(g.length)for(var h=0,k=g.length;h<k;h++)e[g[h]]=f}var l={propertychange:m},n,c=3;f=y.createElement("div");for(g=f.getElementsByTagName("i");f.innerHTML="\x3c!--[if gt IE "+ ++c+"]><i></i><![endif]--\x3e",g[0];);n=4<c?c:I;return{Na:["authenticity_token",/^__RequestVerificationToken(_.*)?$/],o:function(a,b){for(var d=0,c=a.length;d<c;d++)b(a[d])},i:function(a,b){if("function"==typeof Array.prototype.indexOf)return Array.prototype.indexOf.call(a,b);for(var d=0,c=a.length;d<
c;d++)if(a[d]===b)return d;return-1},lb:function(a,b,d){for(var c=0,e=a.length;c<e;c++)if(b.call(d,a[c]))return a[c];return p},ga:function(a,d){var c=b.a.i(a,d);0<=c&&a.splice(c,1)},Ga:function(a){a=a||[];for(var d=[],c=0,e=a.length;c<e;c++)0>b.a.i(d,a[c])&&d.push(a[c]);return d},V:function(a,b){a=a||[];for(var d=[],c=0,e=a.length;c<e;c++)d.push(b(a[c]));return d},fa:function(a,b){a=a||[];for(var d=[],c=0,e=a.length;c<e;c++)b(a[c])&&d.push(a[c]);return d},P:function(a,b){if(b instanceof Array)a.push.apply(a,
b);else for(var d=0,c=b.length;d<c;d++)a.push(b[d]);return a},extend:function(a,b){if(b)for(var d in b)b.hasOwnProperty(d)&&(a[d]=b[d]);return a},ka:function(a){for(;a.firstChild;)b.removeNode(a.firstChild)},Hb:function(a){a=b.a.L(a);for(var d=y.createElement("div"),c=0,e=a.length;c<e;c++)d.appendChild(b.A(a[c]));return d},Ia:function(a,d){for(var c=0,e=a.length,g=[];c<e;c++){var f=a[c].cloneNode(m);g.push(d?b.A(f):f)}return g},N:function(a,d){b.a.ka(a);if(d)for(var c=0,e=d.length;c<e;c++)a.appendChild(d[c])},
Ya:function(a,d){var c=a.nodeType?[a]:a;if(0<c.length){for(var e=c[0],g=e.parentNode,f=0,h=d.length;f<h;f++)g.insertBefore(d[f],e);f=0;for(h=c.length;f<h;f++)b.removeNode(c[f])}},bb:function(a,b){7>n?a.setAttribute("selected",b):a.selected=b},D:function(a){return(a||"").replace(d,"")},Rb:function(a,d){for(var c=[],e=(a||"").split(d),f=0,g=e.length;f<g;f++){var h=b.a.D(e[f]);""!==h&&c.push(h)}return c},Ob:function(a,b){a=a||"";return b.length>a.length?r:a.substring(0,b.length)===b},tb:function(a,b){if(b.compareDocumentPosition)return 16==
(b.compareDocumentPosition(a)&16);for(;a!=p;){if(a==b)return m;a=a.parentNode}return r},X:function(a){return b.a.tb(a,a.ownerDocument)},u:function(a){return a&&a.tagName&&a.tagName.toLowerCase()},n:function(b,d,c){var e=n&&l[d];if(!e&&"undefined"!=typeof F){if(a(b,d)){var f=c;c=function(a,b){var d=this.checked;b&&(this.checked=b.nb!==m);f.call(this,a);this.checked=d}}F(b).bind(d,c)}else!e&&"function"==typeof b.addEventListener?b.addEventListener(d,c,r):"undefined"!=typeof b.attachEvent?b.attachEvent("on"+
d,function(a){c.call(b,a)}):j(Error("Browser doesn't support addEventListener or attachEvent"))},Ba:function(b,d){(!b||!b.nodeType)&&j(Error("element must be a DOM node when calling triggerEvent"));if("undefined"!=typeof F){var c=[];a(b,d)&&c.push({nb:b.checked});F(b).trigger(d,c)}else"function"==typeof y.createEvent?"function"==typeof b.dispatchEvent?(c=y.createEvent(e[d]||"HTMLEvents"),c.initEvent(d,m,m,x,0,0,0,0,0,r,r,r,r,0,b),b.dispatchEvent(c)):j(Error("The supplied element doesn't support dispatchEvent")):
"undefined"!=typeof b.fireEvent?(a(b,d)&&(b.checked=b.checked!==m),b.fireEvent("on"+d)):j(Error("Browser doesn't support triggering events"))},d:function(a){return b.$(a)?a():a},ua:function(a){return b.$(a)?a.t():a},da:function(a,d,c){if(d){var e=/[\w-]+/g,f=a.className.match(e)||[];b.a.o(d.match(e),function(a){var d=b.a.i(f,a);0<=d?c||f.splice(d,1):c&&f.push(a)});a.className=f.join(" ")}},cb:function(a,d){var c=b.a.d(d);if(c===p||c===I)c="";if(3===a.nodeType)a.data=c;else{var e=b.e.firstChild(a);
!e||3!=e.nodeType||b.e.nextSibling(e)?b.e.N(a,[y.createTextNode(c)]):e.data=c;b.a.wb(a)}},ab:function(a,b){a.name=b;if(7>=n)try{a.mergeAttributes(y.createElement("<input name='"+a.name+"'/>"),r)}catch(d){}},wb:function(a){9<=n&&(a=1==a.nodeType?a:a.parentNode,a.style&&(a.style.zoom=a.style.zoom))},ub:function(a){if(9<=n){var b=a.style.width;a.style.width=0;a.style.width=b}},Lb:function(a,d){a=b.a.d(a);d=b.a.d(d);for(var c=[],e=a;e<=d;e++)c.push(e);return c},L:function(a){for(var b=[],d=0,c=a.length;d<
c;d++)b.push(a[d]);return b},Pb:6===n,Qb:7===n,Z:n,Oa:function(a,d){for(var c=b.a.L(a.getElementsByTagName("input")).concat(b.a.L(a.getElementsByTagName("textarea"))),e="string"==typeof d?function(a){return a.name===d}:function(a){return d.test(a.name)},f=[],g=c.length-1;0<=g;g--)e(c[g])&&f.push(c[g]);return f},Ib:function(a){return"string"==typeof a&&(a=b.a.D(a))?x.JSON&&x.JSON.parse?x.JSON.parse(a):(new Function("return "+a))():p},xa:function(a,d,c){("undefined"==typeof JSON||"undefined"==typeof JSON.stringify)&&
j(Error("Cannot find JSON.stringify(). Some browsers (e.g., IE < 8) don't support it natively, but you can overcome this by adding a script reference to json2.js, downloadable from http://www.json.org/json2.js"));return JSON.stringify(b.a.d(a),d,c)},Jb:function(a,d,c){c=c||{};var e=c.params||{},f=c.includeFields||this.Na,g=a;if("object"==typeof a&&"form"===b.a.u(a))for(var g=a.action,h=f.length-1;0<=h;h--)for(var k=b.a.Oa(a,f[h]),l=k.length-1;0<=l;l--)e[k[l].name]=k[l].value;d=b.a.d(d);var n=y.createElement("form");
n.style.display="none";n.action=g;n.method="post";for(var w in d)a=y.createElement("input"),a.name=w,a.value=b.a.xa(b.a.d(d[w])),n.appendChild(a);for(w in e)a=y.createElement("input"),a.name=w,a.value=e[w],n.appendChild(a);y.body.appendChild(n);c.submitter?c.submitter(n):n.submit();setTimeout(function(){n.parentNode.removeChild(n)},0)}}};b.b("utils",b.a);b.b("utils.arrayForEach",b.a.o);b.b("utils.arrayFirst",b.a.lb);b.b("utils.arrayFilter",b.a.fa);b.b("utils.arrayGetDistinctValues",b.a.Ga);b.b("utils.arrayIndexOf",
b.a.i);b.b("utils.arrayMap",b.a.V);b.b("utils.arrayPushAll",b.a.P);b.b("utils.arrayRemoveItem",b.a.ga);b.b("utils.extend",b.a.extend);b.b("utils.fieldsIncludedWithJsonPost",b.a.Na);b.b("utils.getFormFields",b.a.Oa);b.b("utils.peekObservable",b.a.ua);b.b("utils.postJson",b.a.Jb);b.b("utils.parseJson",b.a.Ib);b.b("utils.registerEventHandler",b.a.n);b.b("utils.stringifyJson",b.a.xa);b.b("utils.range",b.a.Lb);b.b("utils.toggleDomNodeCssClass",b.a.da);b.b("utils.triggerEvent",b.a.Ba);b.b("utils.unwrapObservable",
b.a.d);Function.prototype.bind||(Function.prototype.bind=function(a){var b=this,c=Array.prototype.slice.call(arguments);a=c.shift();return function(){return b.apply(a,c.concat(Array.prototype.slice.call(arguments)))}});b.a.f=new function(){var a=0,d="__ko__"+(new Date).getTime(),c={};return{get:function(a,d){var c=b.a.f.la(a,r);return c===I?I:c[d]},set:function(a,d,c){c===I&&b.a.f.la(a,r)===I||(b.a.f.la(a,m)[d]=c)},la:function(b,f){var g=b[d];if(!g||!("null"!==g&&c[g])){if(!f)return I;g=b[d]="ko"+
a++;c[g]={}}return c[g]},clear:function(a){var b=a[d];return b?(delete c[b],a[d]=p,m):r}}};b.b("utils.domData",b.a.f);b.b("utils.domData.clear",b.a.f.clear);b.a.F=new function(){function a(a,d){var e=b.a.f.get(a,c);e===I&&d&&(e=[],b.a.f.set(a,c,e));return e}function d(c){var e=a(c,r);if(e)for(var e=e.slice(0),k=0;k<e.length;k++)e[k](c);b.a.f.clear(c);"function"==typeof F&&"function"==typeof F.cleanData&&F.cleanData([c]);if(f[c.nodeType])for(e=c.firstChild;c=e;)e=c.nextSibling,8===c.nodeType&&d(c)}
var c="__ko_domNodeDisposal__"+(new Date).getTime(),e={1:m,8:m,9:m},f={1:m,9:m};return{Ca:function(b,d){"function"!=typeof d&&j(Error("Callback must be a function"));a(b,m).push(d)},Xa:function(d,e){var f=a(d,r);f&&(b.a.ga(f,e),0==f.length&&b.a.f.set(d,c,I))},A:function(a){if(e[a.nodeType]&&(d(a),f[a.nodeType])){var c=[];b.a.P(c,a.getElementsByTagName("*"));for(var k=0,l=c.length;k<l;k++)d(c[k])}return a},removeNode:function(a){b.A(a);a.parentNode&&a.parentNode.removeChild(a)}}};b.A=b.a.F.A;b.removeNode=
b.a.F.removeNode;b.b("cleanNode",b.A);b.b("removeNode",b.removeNode);b.b("utils.domNodeDisposal",b.a.F);b.b("utils.domNodeDisposal.addDisposeCallback",b.a.F.Ca);b.b("utils.domNodeDisposal.removeDisposeCallback",b.a.F.Xa);b.a.ta=function(a){var d;if("undefined"!=typeof F)if(F.parseHTML)d=F.parseHTML(a);else{if((d=F.clean([a]))&&d[0]){for(a=d[0];a.parentNode&&11!==a.parentNode.nodeType;)a=a.parentNode;a.parentNode&&a.parentNode.removeChild(a)}}else{var c=b.a.D(a).toLowerCase();d=y.createElement("div");
c=c.match(/^<(thead|tbody|tfoot)/)&&[1,"<table>","</table>"]||!c.indexOf("<tr")&&[2,"<table><tbody>","</tbody></table>"]||(!c.indexOf("<td")||!c.indexOf("<th"))&&[3,"<table><tbody><tr>","</tr></tbody></table>"]||[0,"",""];a="ignored<div>"+c[1]+a+c[2]+"</div>";for("function"==typeof x.innerShiv?d.appendChild(x.innerShiv(a)):d.innerHTML=a;c[0]--;)d=d.lastChild;d=b.a.L(d.lastChild.childNodes)}return d};b.a.ca=function(a,d){b.a.ka(a);d=b.a.d(d);if(d!==p&&d!==I)if("string"!=typeof d&&(d=d.toString()),
"undefined"!=typeof F)F(a).html(d);else for(var c=b.a.ta(d),e=0;e<c.length;e++)a.appendChild(c[e])};b.b("utils.parseHtmlFragment",b.a.ta);b.b("utils.setHtml",b.a.ca);var R={};b.s={ra:function(a){"function"!=typeof a&&j(Error("You can only pass a function to ko.memoization.memoize()"));var b=(4294967296*(1+Math.random())|0).toString(16).substring(1)+(4294967296*(1+Math.random())|0).toString(16).substring(1);R[b]=a;return"\x3c!--[ko_memo:"+b+"]--\x3e"},hb:function(a,b){var c=R[a];c===I&&j(Error("Couldn't find any memo with ID "+
a+". Perhaps it's already been unmemoized."));try{return c.apply(p,b||[]),m}finally{delete R[a]}},ib:function(a,d){var c=[];ca(a,c);for(var e=0,f=c.length;e<f;e++){var g=c[e].sb,h=[g];d&&b.a.P(h,d);b.s.hb(c[e].Fb,h);g.nodeValue="";g.parentNode&&g.parentNode.removeChild(g)}},Ua:function(a){return(a=a.match(/^\[ko_memo\:(.*?)\]$/))?a[1]:p}};b.b("memoization",b.s);b.b("memoization.memoize",b.s.ra);b.b("memoization.unmemoize",b.s.hb);b.b("memoization.parseMemoText",b.s.Ua);b.b("memoization.unmemoizeDomNodeAndDescendants",
b.s.ib);b.Ma={throttle:function(a,d){a.throttleEvaluation=d;var c=p;return b.j({read:a,write:function(b){clearTimeout(c);c=setTimeout(function(){a(b)},d)}})},notify:function(a,d){a.equalityComparer="always"==d?u(r):b.m.fn.equalityComparer;return a}};b.b("extenders",b.Ma);b.fb=function(a,d,c){this.target=a;this.ha=d;this.rb=c;b.p(this,"dispose",this.B)};b.fb.prototype.B=function(){this.Cb=m;this.rb()};b.S=function(){this.w={};b.a.extend(this,b.S.fn);b.p(this,"subscribe",this.ya);b.p(this,"extend",
this.extend);b.p(this,"getSubscriptionsCount",this.yb)};b.S.fn={ya:function(a,d,c){c=c||"change";var e=new b.fb(this,d?a.bind(d):a,function(){b.a.ga(this.w[c],e)}.bind(this));this.w[c]||(this.w[c]=[]);this.w[c].push(e);return e},notifySubscribers:function(a,d){d=d||"change";this.w[d]&&b.r.K(function(){b.a.o(this.w[d].slice(0),function(b){b&&b.Cb!==m&&b.ha(a)})},this)},yb:function(){var a=0,b;for(b in this.w)this.w.hasOwnProperty(b)&&(a+=this.w[b].length);return a},extend:function(a){var d=this;if(a)for(var c in a){var e=
b.Ma[c];"function"==typeof e&&(d=e(d,a[c]))}return d}};b.Qa=function(a){return"function"==typeof a.ya&&"function"==typeof a.notifySubscribers};b.b("subscribable",b.S);b.b("isSubscribable",b.Qa);var C=[];b.r={mb:function(a){C.push({ha:a,La:[]})},end:function(){C.pop()},Wa:function(a){b.Qa(a)||j(Error("Only subscribable things can act as dependencies"));if(0<C.length){var d=C[C.length-1];d&&!(0<=b.a.i(d.La,a))&&(d.La.push(a),d.ha(a))}},K:function(a,b,c){try{return C.push(p),a.apply(b,c||[])}finally{C.pop()}}};
var ma={undefined:m,"boolean":m,number:m,string:m};b.m=function(a){function d(){if(0<arguments.length){if(!d.equalityComparer||!d.equalityComparer(c,arguments[0]))d.H(),c=arguments[0],d.G();return this}b.r.Wa(d);return c}var c=a;b.S.call(d);d.t=function(){return c};d.G=function(){d.notifySubscribers(c)};d.H=function(){d.notifySubscribers(c,"beforeChange")};b.a.extend(d,b.m.fn);b.p(d,"peek",d.t);b.p(d,"valueHasMutated",d.G);b.p(d,"valueWillMutate",d.H);return d};b.m.fn={equalityComparer:function(a,
b){return a===p||typeof a in ma?a===b:r}};var E=b.m.Kb="__ko_proto__";b.m.fn[E]=b.m;b.ma=function(a,d){return a===p||a===I||a[E]===I?r:a[E]===d?m:b.ma(a[E],d)};b.$=function(a){return b.ma(a,b.m)};b.Ra=function(a){return"function"==typeof a&&a[E]===b.m||"function"==typeof a&&a[E]===b.j&&a.zb?m:r};b.b("observable",b.m);b.b("isObservable",b.$);b.b("isWriteableObservable",b.Ra);b.R=function(a){0==arguments.length&&(a=[]);a!==p&&(a!==I&&!("length"in a))&&j(Error("The argument passed when initializing an observable array must be an array, or null, or undefined."));
var d=b.m(a);b.a.extend(d,b.R.fn);return d};b.R.fn={remove:function(a){for(var b=this.t(),c=[],e="function"==typeof a?a:function(b){return b===a},f=0;f<b.length;f++){var g=b[f];e(g)&&(0===c.length&&this.H(),c.push(g),b.splice(f,1),f--)}c.length&&this.G();return c},removeAll:function(a){if(a===I){var d=this.t(),c=d.slice(0);this.H();d.splice(0,d.length);this.G();return c}return!a?[]:this.remove(function(d){return 0<=b.a.i(a,d)})},destroy:function(a){var b=this.t(),c="function"==typeof a?a:function(b){return b===
a};this.H();for(var e=b.length-1;0<=e;e--)c(b[e])&&(b[e]._destroy=m);this.G()},destroyAll:function(a){return a===I?this.destroy(u(m)):!a?[]:this.destroy(function(d){return 0<=b.a.i(a,d)})},indexOf:function(a){var d=this();return b.a.i(d,a)},replace:function(a,b){var c=this.indexOf(a);0<=c&&(this.H(),this.t()[c]=b,this.G())}};b.a.o("pop push reverse shift sort splice unshift".split(" "),function(a){b.R.fn[a]=function(){var b=this.t();this.H();b=b[a].apply(b,arguments);this.G();return b}});b.a.o(["slice"],
function(a){b.R.fn[a]=function(){var b=this();return b[a].apply(b,arguments)}});b.b("observableArray",b.R);b.j=function(a,d,c){function e(){b.a.o(z,function(a){a.B()});z=[]}function f(){var a=h.throttleEvaluation;a&&0<=a?(clearTimeout(t),t=setTimeout(g,a)):g()}function g(){if(!q)if(n&&w())A();else{q=m;try{var a=b.a.V(z,function(a){return a.target});b.r.mb(function(c){var d;0<=(d=b.a.i(a,c))?a[d]=I:z.push(c.ya(f))});for(var c=s.call(d),e=a.length-1;0<=e;e--)a[e]&&z.splice(e,1)[0].B();n=m;h.notifySubscribers(l,
"beforeChange");l=c}finally{b.r.end()}h.notifySubscribers(l);q=r;z.length||A()}}function h(){if(0<arguments.length)return"function"===typeof v?v.apply(d,arguments):j(Error("Cannot write a value to a ko.computed unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.")),this;n||g();b.r.Wa(h);return l}function k(){return!n||0<z.length}var l,n=r,q=r,s=a;s&&"object"==typeof s?(c=s,s=c.read):(c=c||{},s||(s=c.read));"function"!=typeof s&&j(Error("Pass a function that returns the value of the ko.computed"));
var v=c.write,G=c.disposeWhenNodeIsRemoved||c.W||p,w=c.disposeWhen||c.Ka||u(r),A=e,z=[],t=p;d||(d=c.owner);h.t=function(){n||g();return l};h.xb=function(){return z.length};h.zb="function"===typeof c.write;h.B=function(){A()};h.pa=k;b.S.call(h);b.a.extend(h,b.j.fn);b.p(h,"peek",h.t);b.p(h,"dispose",h.B);b.p(h,"isActive",h.pa);b.p(h,"getDependenciesCount",h.xb);c.deferEvaluation!==m&&g();if(G&&k()){A=function(){b.a.F.Xa(G,arguments.callee);e()};b.a.F.Ca(G,A);var D=w,w=function(){return!b.a.X(G)||D()}}return h};
b.Bb=function(a){return b.ma(a,b.j)};w=b.m.Kb;b.j[w]=b.m;b.j.fn={};b.j.fn[w]=b.j;b.b("dependentObservable",b.j);b.b("computed",b.j);b.b("isComputed",b.Bb);b.gb=function(a){0==arguments.length&&j(Error("When calling ko.toJS, pass the object you want to convert."));return ba(a,function(a){for(var c=0;b.$(a)&&10>c;c++)a=a();return a})};b.toJSON=function(a,d,c){a=b.gb(a);return b.a.xa(a,d,c)};b.b("toJS",b.gb);b.b("toJSON",b.toJSON);b.k={q:function(a){switch(b.a.u(a)){case "option":return a.__ko__hasDomDataOptionValue__===
m?b.a.f.get(a,b.c.options.sa):7>=b.a.Z?a.getAttributeNode("value").specified?a.value:a.text:a.value;case "select":return 0<=a.selectedIndex?b.k.q(a.options[a.selectedIndex]):I;default:return a.value}},T:function(a,d){switch(b.a.u(a)){case "option":switch(typeof d){case "string":b.a.f.set(a,b.c.options.sa,I);"__ko__hasDomDataOptionValue__"in a&&delete a.__ko__hasDomDataOptionValue__;a.value=d;break;default:b.a.f.set(a,b.c.options.sa,d),a.__ko__hasDomDataOptionValue__=m,a.value="number"===typeof d?
d:""}break;case "select":for(var c=a.options.length-1;0<=c;c--)if(b.k.q(a.options[c])==d){a.selectedIndex=c;break}break;default:if(d===p||d===I)d="";a.value=d}}};b.b("selectExtensions",b.k);b.b("selectExtensions.readValue",b.k.q);b.b("selectExtensions.writeValue",b.k.T);var ka=/\@ko_token_(\d+)\@/g,na=["true","false"],oa=/^(?:[$_a-z][$\w]*|(.+)(\.\s*[$_a-z][$\w]*|\[.+\]))$/i;b.g={Q:[],aa:function(a){var d=b.a.D(a);if(3>d.length)return[];"{"===d.charAt(0)&&(d=d.substring(1,d.length-1));a=[];for(var c=
p,e,f=0;f<d.length;f++){var g=d.charAt(f);if(c===p)switch(g){case '"':case "'":case "/":c=f,e=g}else if(g==e&&"\\"!==d.charAt(f-1)){g=d.substring(c,f+1);a.push(g);var h="@ko_token_"+(a.length-1)+"@",d=d.substring(0,c)+h+d.substring(f+1),f=f-(g.length-h.length),c=p}}e=c=p;for(var k=0,l=p,f=0;f<d.length;f++){g=d.charAt(f);if(c===p)switch(g){case "{":c=f;l=g;e="}";break;case "(":c=f;l=g;e=")";break;case "[":c=f,l=g,e="]"}g===l?k++:g===e&&(k--,0===k&&(g=d.substring(c,f+1),a.push(g),h="@ko_token_"+(a.length-
1)+"@",d=d.substring(0,c)+h+d.substring(f+1),f-=g.length-h.length,c=p))}e=[];d=d.split(",");c=0;for(f=d.length;c<f;c++)k=d[c],l=k.indexOf(":"),0<l&&l<k.length-1?(g=k.substring(l+1),e.push({key:P(k.substring(0,l),a),value:P(g,a)})):e.push({unknown:P(k,a)});return e},ba:function(a){var d="string"===typeof a?b.g.aa(a):a,c=[];a=[];for(var e,f=0;e=d[f];f++)if(0<c.length&&c.push(","),e.key){var g;a:{g=e.key;var h=b.a.D(g);switch(h.length&&h.charAt(0)){case "'":case '"':break a;default:g="'"+h+"'"}}e=e.value;
c.push(g);c.push(":");c.push(e);e=b.a.D(e);0<=b.a.i(na,b.a.D(e).toLowerCase())?e=r:(h=e.match(oa),e=h===p?r:h[1]?"Object("+h[1]+")"+h[2]:e);e&&(0<a.length&&a.push(", "),a.push(g+" : function(__ko_value) { "+e+" = __ko_value; }"))}else e.unknown&&c.push(e.unknown);d=c.join("");0<a.length&&(d=d+", '_ko_property_writers' : { "+a.join("")+" } ");return d},Eb:function(a,d){for(var c=0;c<a.length;c++)if(b.a.D(a[c].key)==d)return m;return r},ea:function(a,d,c,e,f){if(!a||!b.Ra(a)){if((a=d()._ko_property_writers)&&
a[c])a[c](e)}else(!f||a.t()!==e)&&a(e)}};b.b("expressionRewriting",b.g);b.b("expressionRewriting.bindingRewriteValidators",b.g.Q);b.b("expressionRewriting.parseObjectLiteral",b.g.aa);b.b("expressionRewriting.preProcessBindings",b.g.ba);b.b("jsonExpressionRewriting",b.g);b.b("jsonExpressionRewriting.insertPropertyAccessorsIntoJson",b.g.ba);var K="\x3c!--test--\x3e"===y.createComment("test").text,ja=K?/^\x3c!--\s*ko(?:\s+(.+\s*\:[\s\S]*))?\s*--\x3e$/:/^\s*ko(?:\s+(.+\s*\:[\s\S]*))?\s*$/,ia=K?/^\x3c!--\s*\/ko\s*--\x3e$/:
/^\s*\/ko\s*$/,pa={ul:m,ol:m};b.e={I:{},childNodes:function(a){return B(a)?aa(a):a.childNodes},Y:function(a){if(B(a)){a=b.e.childNodes(a);for(var d=0,c=a.length;d<c;d++)b.removeNode(a[d])}else b.a.ka(a)},N:function(a,d){if(B(a)){b.e.Y(a);for(var c=a.nextSibling,e=0,f=d.length;e<f;e++)c.parentNode.insertBefore(d[e],c)}else b.a.N(a,d)},Va:function(a,b){B(a)?a.parentNode.insertBefore(b,a.nextSibling):a.firstChild?a.insertBefore(b,a.firstChild):a.appendChild(b)},Pa:function(a,d,c){c?B(a)?a.parentNode.insertBefore(d,
c.nextSibling):c.nextSibling?a.insertBefore(d,c.nextSibling):a.appendChild(d):b.e.Va(a,d)},firstChild:function(a){return!B(a)?a.firstChild:!a.nextSibling||H(a.nextSibling)?p:a.nextSibling},nextSibling:function(a){B(a)&&(a=$(a));return a.nextSibling&&H(a.nextSibling)?p:a.nextSibling},jb:function(a){return(a=B(a))?a[1]:p},Ta:function(a){if(pa[b.a.u(a)]){var d=a.firstChild;if(d){do if(1===d.nodeType){var c;c=d.firstChild;var e=p;if(c){do if(e)e.push(c);else if(B(c)){var f=$(c,m);f?c=f:e=[c]}else H(c)&&
(e=[c]);while(c=c.nextSibling)}if(c=e){e=d.nextSibling;for(f=0;f<c.length;f++)e?a.insertBefore(c[f],e):a.appendChild(c[f])}}while(d=d.nextSibling)}}}};b.b("virtualElements",b.e);b.b("virtualElements.allowedBindings",b.e.I);b.b("virtualElements.emptyNode",b.e.Y);b.b("virtualElements.insertAfter",b.e.Pa);b.b("virtualElements.prepend",b.e.Va);b.b("virtualElements.setDomNodeChildren",b.e.N);b.J=function(){this.Ha={}};b.a.extend(b.J.prototype,{nodeHasBindings:function(a){switch(a.nodeType){case 1:return a.getAttribute("data-bind")!=
p;case 8:return b.e.jb(a)!=p;default:return r}},getBindings:function(a,b){var c=this.getBindingsString(a,b);return c?this.parseBindingsString(c,b,a):p},getBindingsString:function(a){switch(a.nodeType){case 1:return a.getAttribute("data-bind");case 8:return b.e.jb(a);default:return p}},parseBindingsString:function(a,d,c){try{var e;if(!(e=this.Ha[a])){var f=this.Ha,g,h="with($context){with($data||{}){return{"+b.g.ba(a)+"}}}";g=new Function("$context","$element",h);e=f[a]=g}return e(d,c)}catch(k){j(Error("Unable to parse bindings.\nMessage: "+
k+";\nBindings value: "+a))}}});b.J.instance=new b.J;b.b("bindingProvider",b.J);b.c={};b.z=function(a,d,c){d?(b.a.extend(this,d),this.$parentContext=d,this.$parent=d.$data,this.$parents=(d.$parents||[]).slice(0),this.$parents.unshift(this.$parent)):(this.$parents=[],this.$root=a,this.ko=b);this.$data=a;c&&(this[c]=a)};b.z.prototype.createChildContext=function(a,d){return new b.z(a,this,d)};b.z.prototype.extend=function(a){var d=b.a.extend(new b.z,this);return b.a.extend(d,a)};b.eb=function(a,d){if(2==
arguments.length)b.a.f.set(a,"__ko_bindingContext__",d);else return b.a.f.get(a,"__ko_bindingContext__")};b.Fa=function(a,d,c){1===a.nodeType&&b.e.Ta(a);return X(a,d,c,m)};b.Ea=function(a,b){(1===b.nodeType||8===b.nodeType)&&Z(a,b,m)};b.Da=function(a,b){b&&(1!==b.nodeType&&8!==b.nodeType)&&j(Error("ko.applyBindings: first parameter should be your view model; second parameter should be a DOM node"));b=b||x.document.body;Y(a,b,m)};b.ja=function(a){switch(a.nodeType){case 1:case 8:var d=b.eb(a);if(d)return d;
if(a.parentNode)return b.ja(a.parentNode)}return I};b.pb=function(a){return(a=b.ja(a))?a.$data:I};b.b("bindingHandlers",b.c);b.b("applyBindings",b.Da);b.b("applyBindingsToDescendants",b.Ea);b.b("applyBindingsToNode",b.Fa);b.b("contextFor",b.ja);b.b("dataFor",b.pb);var fa={"class":"className","for":"htmlFor"};b.c.attr={update:function(a,d){var c=b.a.d(d())||{},e;for(e in c)if("string"==typeof e){var f=b.a.d(c[e]),g=f===r||f===p||f===I;g&&a.removeAttribute(e);8>=b.a.Z&&e in fa?(e=fa[e],g?a.removeAttribute(e):
a[e]=f):g||a.setAttribute(e,f.toString());"name"===e&&b.a.ab(a,g?"":f.toString())}}};b.c.checked={init:function(a,d,c){b.a.n(a,"click",function(){var e;if("checkbox"==a.type)e=a.checked;else if("radio"==a.type&&a.checked)e=a.value;else return;var f=d(),g=b.a.d(f);"checkbox"==a.type&&g instanceof Array?(e=b.a.i(g,a.value),a.checked&&0>e?f.push(a.value):!a.checked&&0<=e&&f.splice(e,1)):b.g.ea(f,c,"checked",e,m)});"radio"==a.type&&!a.name&&b.c.uniqueName.init(a,u(m))},update:function(a,d){var c=b.a.d(d());
"checkbox"==a.type?a.checked=c instanceof Array?0<=b.a.i(c,a.value):c:"radio"==a.type&&(a.checked=a.value==c)}};b.c.css={update:function(a,d){var c=b.a.d(d());if("object"==typeof c)for(var e in c){var f=b.a.d(c[e]);b.a.da(a,e,f)}else c=String(c||""),b.a.da(a,a.__ko__cssValue,r),a.__ko__cssValue=c,b.a.da(a,c,m)}};b.c.enable={update:function(a,d){var c=b.a.d(d());c&&a.disabled?a.removeAttribute("disabled"):!c&&!a.disabled&&(a.disabled=m)}};b.c.disable={update:function(a,d){b.c.enable.update(a,function(){return!b.a.d(d())})}};
b.c.event={init:function(a,d,c,e){var f=d()||{},g;for(g in f)(function(){var f=g;"string"==typeof f&&b.a.n(a,f,function(a){var g,n=d()[f];if(n){var q=c();try{var s=b.a.L(arguments);s.unshift(e);g=n.apply(e,s)}finally{g!==m&&(a.preventDefault?a.preventDefault():a.returnValue=r)}q[f+"Bubble"]===r&&(a.cancelBubble=m,a.stopPropagation&&a.stopPropagation())}})})()}};b.c.foreach={Sa:function(a){return function(){var d=a(),c=b.a.ua(d);if(!c||"number"==typeof c.length)return{foreach:d,templateEngine:b.C.oa};
b.a.d(d);return{foreach:c.data,as:c.as,includeDestroyed:c.includeDestroyed,afterAdd:c.afterAdd,beforeRemove:c.beforeRemove,afterRender:c.afterRender,beforeMove:c.beforeMove,afterMove:c.afterMove,templateEngine:b.C.oa}}},init:function(a,d){return b.c.template.init(a,b.c.foreach.Sa(d))},update:function(a,d,c,e,f){return b.c.template.update(a,b.c.foreach.Sa(d),c,e,f)}};b.g.Q.foreach=r;b.e.I.foreach=m;b.c.hasfocus={init:function(a,d,c){function e(e){a.__ko_hasfocusUpdating=m;var f=a.ownerDocument;"activeElement"in
f&&(e=f.activeElement===a);f=d();b.g.ea(f,c,"hasfocus",e,m);a.__ko_hasfocusUpdating=r}var f=e.bind(p,m),g=e.bind(p,r);b.a.n(a,"focus",f);b.a.n(a,"focusin",f);b.a.n(a,"blur",g);b.a.n(a,"focusout",g)},update:function(a,d){var c=b.a.d(d());a.__ko_hasfocusUpdating||(c?a.focus():a.blur(),b.r.K(b.a.Ba,p,[a,c?"focusin":"focusout"]))}};b.c.html={init:function(){return{controlsDescendantBindings:m}},update:function(a,d){b.a.ca(a,d())}};var da="__ko_withIfBindingData";Q("if");Q("ifnot",r,m);Q("with",m,r,function(a,
b){return a.createChildContext(b)});b.c.options={update:function(a,d,c){"select"!==b.a.u(a)&&j(Error("options binding applies only to SELECT elements"));for(var e=0==a.length,f=b.a.V(b.a.fa(a.childNodes,function(a){return a.tagName&&"option"===b.a.u(a)&&a.selected}),function(a){return b.k.q(a)||a.innerText||a.textContent}),g=a.scrollTop,h=b.a.d(d());0<a.length;)b.A(a.options[0]),a.remove(0);if(h){c=c();var k=c.optionsIncludeDestroyed;"number"!=typeof h.length&&(h=[h]);if(c.optionsCaption){var l=y.createElement("option");
b.a.ca(l,c.optionsCaption);b.k.T(l,I);a.appendChild(l)}d=0;for(var n=h.length;d<n;d++){var q=h[d];if(!q||!q._destroy||k){var l=y.createElement("option"),s=function(a,b,c){var d=typeof b;return"function"==d?b(a):"string"==d?a[b]:c},v=s(q,c.optionsValue,q);b.k.T(l,b.a.d(v));q=s(q,c.optionsText,v);b.a.cb(l,q);a.appendChild(l)}}h=a.getElementsByTagName("option");d=k=0;for(n=h.length;d<n;d++)0<=b.a.i(f,b.k.q(h[d]))&&(b.a.bb(h[d],m),k++);a.scrollTop=g;e&&"value"in c&&ea(a,b.a.ua(c.value),m);b.a.ub(a)}}};
b.c.options.sa="__ko.optionValueDomData__";b.c.selectedOptions={init:function(a,d,c){b.a.n(a,"change",function(){var e=d(),f=[];b.a.o(a.getElementsByTagName("option"),function(a){a.selected&&f.push(b.k.q(a))});b.g.ea(e,c,"value",f)})},update:function(a,d){"select"!=b.a.u(a)&&j(Error("values binding applies only to SELECT elements"));var c=b.a.d(d());c&&"number"==typeof c.length&&b.a.o(a.getElementsByTagName("option"),function(a){var d=0<=b.a.i(c,b.k.q(a));b.a.bb(a,d)})}};b.c.style={update:function(a,
d){var c=b.a.d(d()||{}),e;for(e in c)if("string"==typeof e){var f=b.a.d(c[e]);a.style[e]=f||""}}};b.c.submit={init:function(a,d,c,e){"function"!=typeof d()&&j(Error("The value for a submit binding must be a function"));b.a.n(a,"submit",function(b){var c,h=d();try{c=h.call(e,a)}finally{c!==m&&(b.preventDefault?b.preventDefault():b.returnValue=r)}})}};b.c.text={update:function(a,d){b.a.cb(a,d())}};b.e.I.text=m;b.c.uniqueName={init:function(a,d){if(d()){var c="ko_unique_"+ ++b.c.uniqueName.ob;b.a.ab(a,
c)}}};b.c.uniqueName.ob=0;b.c.value={init:function(a,d,c){function e(){h=r;var e=d(),f=b.k.q(a);b.g.ea(e,c,"value",f)}var f=["change"],g=c().valueUpdate,h=r;g&&("string"==typeof g&&(g=[g]),b.a.P(f,g),f=b.a.Ga(f));if(b.a.Z&&("input"==a.tagName.toLowerCase()&&"text"==a.type&&"off"!=a.autocomplete&&(!a.form||"off"!=a.form.autocomplete))&&-1==b.a.i(f,"propertychange"))b.a.n(a,"propertychange",function(){h=m}),b.a.n(a,"blur",function(){h&&e()});b.a.o(f,function(c){var d=e;b.a.Ob(c,"after")&&(d=function(){setTimeout(e,
0)},c=c.substring(5));b.a.n(a,c,d)})},update:function(a,d){var c="select"===b.a.u(a),e=b.a.d(d()),f=b.k.q(a),g=e!=f;0===e&&(0!==f&&"0"!==f)&&(g=m);g&&(f=function(){b.k.T(a,e)},f(),c&&setTimeout(f,0));c&&0<a.length&&ea(a,e,r)}};b.c.visible={update:function(a,d){var c=b.a.d(d()),e="none"!=a.style.display;c&&!e?a.style.display="":!c&&e&&(a.style.display="none")}};b.c.click={init:function(a,d,c,e){return b.c.event.init.call(this,a,function(){var a={};a.click=d();return a},c,e)}};b.v=function(){};b.v.prototype.renderTemplateSource=
function(){j(Error("Override renderTemplateSource"))};b.v.prototype.createJavaScriptEvaluatorBlock=function(){j(Error("Override createJavaScriptEvaluatorBlock"))};b.v.prototype.makeTemplateSource=function(a,d){if("string"==typeof a){d=d||y;var c=d.getElementById(a);c||j(Error("Cannot find template with ID "+a));return new b.l.h(c)}if(1==a.nodeType||8==a.nodeType)return new b.l.O(a);j(Error("Unknown template type: "+a))};b.v.prototype.renderTemplate=function(a,b,c,e){a=this.makeTemplateSource(a,e);
return this.renderTemplateSource(a,b,c)};b.v.prototype.isTemplateRewritten=function(a,b){return this.allowTemplateRewriting===r?m:this.makeTemplateSource(a,b).data("isRewritten")};b.v.prototype.rewriteTemplate=function(a,b,c){a=this.makeTemplateSource(a,c);b=b(a.text());a.text(b);a.data("isRewritten",m)};b.b("templateEngine",b.v);var qa=/(<[a-z]+\d*(\s+(?!data-bind=)[a-z0-9\-]+(=(\"[^\"]*\"|\'[^\']*\'))?)*\s+)data-bind=(["'])([\s\S]*?)\5/gi,ra=/\x3c!--\s*ko\b\s*([\s\S]*?)\s*--\x3e/g;b.za={vb:function(a,
d,c){d.isTemplateRewritten(a,c)||d.rewriteTemplate(a,function(a){return b.za.Gb(a,d)},c)},Gb:function(a,b){return a.replace(qa,function(a,e,f,g,h,k,l){return W(l,e,b)}).replace(ra,function(a,e){return W(e,"\x3c!-- ko --\x3e",b)})},kb:function(a){return b.s.ra(function(d,c){d.nextSibling&&b.Fa(d.nextSibling,a,c)})}};b.b("__tr_ambtns",b.za.kb);b.l={};b.l.h=function(a){this.h=a};b.l.h.prototype.text=function(){var a=b.a.u(this.h),a="script"===a?"text":"textarea"===a?"value":"innerHTML";if(0==arguments.length)return this.h[a];
var d=arguments[0];"innerHTML"===a?b.a.ca(this.h,d):this.h[a]=d};b.l.h.prototype.data=function(a){if(1===arguments.length)return b.a.f.get(this.h,"templateSourceData_"+a);b.a.f.set(this.h,"templateSourceData_"+a,arguments[1])};b.l.O=function(a){this.h=a};b.l.O.prototype=new b.l.h;b.l.O.prototype.text=function(){if(0==arguments.length){var a=b.a.f.get(this.h,"__ko_anon_template__")||{};a.Aa===I&&a.ia&&(a.Aa=a.ia.innerHTML);return a.Aa}b.a.f.set(this.h,"__ko_anon_template__",{Aa:arguments[0]})};b.l.h.prototype.nodes=
function(){if(0==arguments.length)return(b.a.f.get(this.h,"__ko_anon_template__")||{}).ia;b.a.f.set(this.h,"__ko_anon_template__",{ia:arguments[0]})};b.b("templateSources",b.l);b.b("templateSources.domElement",b.l.h);b.b("templateSources.anonymousTemplate",b.l.O);var O;b.wa=function(a){a!=I&&!(a instanceof b.v)&&j(Error("templateEngine must inherit from ko.templateEngine"));O=a};b.va=function(a,d,c,e,f){c=c||{};(c.templateEngine||O)==I&&j(Error("Set a template engine before calling renderTemplate"));
f=f||"replaceChildren";if(e){var g=N(e);return b.j(function(){var h=d&&d instanceof b.z?d:new b.z(b.a.d(d)),k="function"==typeof a?a(h.$data,h):a,h=T(e,f,k,h,c);"replaceNode"==f&&(e=h,g=N(e))},p,{Ka:function(){return!g||!b.a.X(g)},W:g&&"replaceNode"==f?g.parentNode:g})}return b.s.ra(function(e){b.va(a,d,c,e,"replaceNode")})};b.Mb=function(a,d,c,e,f){function g(a,b){U(b,k);c.afterRender&&c.afterRender(b,a)}function h(d,e){k=f.createChildContext(b.a.d(d),c.as);k.$index=e;var g="function"==typeof a?
a(d,k):a;return T(p,"ignoreTargetNode",g,k,c)}var k;return b.j(function(){var a=b.a.d(d)||[];"undefined"==typeof a.length&&(a=[a]);a=b.a.fa(a,function(a){return c.includeDestroyed||a===I||a===p||!b.a.d(a._destroy)});b.r.K(b.a.$a,p,[e,a,h,c,g])},p,{W:e})};b.c.template={init:function(a,d){var c=b.a.d(d());if("string"!=typeof c&&!c.name&&(1==a.nodeType||8==a.nodeType))c=1==a.nodeType?a.childNodes:b.e.childNodes(a),c=b.a.Hb(c),(new b.l.O(a)).nodes(c);return{controlsDescendantBindings:m}},update:function(a,
d,c,e,f){d=b.a.d(d());c={};e=m;var g,h=p;"string"!=typeof d&&(c=d,d=c.name,"if"in c&&(e=b.a.d(c["if"])),e&&"ifnot"in c&&(e=!b.a.d(c.ifnot)),g=b.a.d(c.data));"foreach"in c?h=b.Mb(d||a,e&&c.foreach||[],c,a,f):e?(f="data"in c?f.createChildContext(g,c.as):f,h=b.va(d||a,f,c,a)):b.e.Y(a);f=h;(g=b.a.f.get(a,"__ko__templateComputedDomDataKey__"))&&"function"==typeof g.B&&g.B();b.a.f.set(a,"__ko__templateComputedDomDataKey__",f&&f.pa()?f:I)}};b.g.Q.template=function(a){a=b.g.aa(a);return 1==a.length&&a[0].unknown||
b.g.Eb(a,"name")?p:"This template engine does not support anonymous templates nested within its templates"};b.e.I.template=m;b.b("setTemplateEngine",b.wa);b.b("renderTemplate",b.va);b.a.Ja=function(a,b,c){a=a||[];b=b||[];return a.length<=b.length?S(a,b,"added","deleted",c):S(b,a,"deleted","added",c)};b.b("utils.compareArrays",b.a.Ja);b.a.$a=function(a,d,c,e,f){function g(a,b){t=l[b];w!==b&&(z[a]=t);t.na(w++);M(t.M);s.push(t);A.push(t)}function h(a,c){if(a)for(var d=0,e=c.length;d<e;d++)c[d]&&b.a.o(c[d].M,
function(b){a(b,d,c[d].U)})}d=d||[];e=e||{};var k=b.a.f.get(a,"setDomNodeChildrenFromArrayMapping_lastMappingResult")===I,l=b.a.f.get(a,"setDomNodeChildrenFromArrayMapping_lastMappingResult")||[],n=b.a.V(l,function(a){return a.U}),q=b.a.Ja(n,d),s=[],v=0,w=0,B=[],A=[];d=[];for(var z=[],n=[],t,D=0,C,E;C=q[D];D++)switch(E=C.moved,C.status){case "deleted":E===I&&(t=l[v],t.j&&t.j.B(),B.push.apply(B,M(t.M)),e.beforeRemove&&(d[D]=t,A.push(t)));v++;break;case "retained":g(D,v++);break;case "added":E!==I?
g(D,E):(t={U:C.value,na:b.m(w++)},s.push(t),A.push(t),k||(n[D]=t))}h(e.beforeMove,z);b.a.o(B,e.beforeRemove?b.A:b.removeNode);for(var D=0,k=b.e.firstChild(a),H;t=A[D];D++){t.M||b.a.extend(t,ha(a,c,t.U,f,t.na));for(v=0;q=t.M[v];k=q.nextSibling,H=q,v++)q!==k&&b.e.Pa(a,q,H);!t.Ab&&f&&(f(t.U,t.M,t.na),t.Ab=m)}h(e.beforeRemove,d);h(e.afterMove,z);h(e.afterAdd,n);b.a.f.set(a,"setDomNodeChildrenFromArrayMapping_lastMappingResult",s)};b.b("utils.setDomNodeChildrenFromArrayMapping",b.a.$a);b.C=function(){this.allowTemplateRewriting=
r};b.C.prototype=new b.v;b.C.prototype.renderTemplateSource=function(a){var d=!(9>b.a.Z)&&a.nodes?a.nodes():p;if(d)return b.a.L(d.cloneNode(m).childNodes);a=a.text();return b.a.ta(a)};b.C.oa=new b.C;b.wa(b.C.oa);b.b("nativeTemplateEngine",b.C);b.qa=function(){var a=this.Db=function(){if("undefined"==typeof F||!F.tmpl)return 0;try{if(0<=F.tmpl.tag.tmpl.open.toString().indexOf("__"))return 2}catch(a){}return 1}();this.renderTemplateSource=function(b,c,e){e=e||{};2>a&&j(Error("Your version of jQuery.tmpl is too old. Please upgrade to jQuery.tmpl 1.0.0pre or later."));
var f=b.data("precompiled");f||(f=b.text()||"",f=F.template(p,"{{ko_with $item.koBindingContext}}"+f+"{{/ko_with}}"),b.data("precompiled",f));b=[c.$data];c=F.extend({koBindingContext:c},e.templateOptions);c=F.tmpl(f,b,c);c.appendTo(y.createElement("div"));F.fragments={};return c};this.createJavaScriptEvaluatorBlock=function(a){return"{{ko_code ((function() { return "+a+" })()) }}"};this.addTemplate=function(a,b){y.write("<script type='text/html' id='"+a+"'>"+b+"\x3c/script>")};0<a&&(F.tmpl.tag.ko_code=
{open:"__.push($1 || '');"},F.tmpl.tag.ko_with={open:"with($1) {",close:"} "})};b.qa.prototype=new b.v;w=new b.qa;0<w.Db&&b.wa(w);b.b("jqueryTmplTemplateEngine",b.qa)}"function"===typeof require&&"object"===typeof exports&&"object"===typeof module?L(module.exports||exports):"function"===typeof define&&define.amd?define(["exports"],L):L(x.ko={});m;
})();
///#source 1 1 /monsters/js/lib/roll.js


function getPrecedence(op) {
	if("*/".indexOf(op) != -1) return 2;
	if("-+".indexOf(op) != -1) return 1;
}

//allowed operators
function isOperator(op) {
	return "+-/*".indexOf(op) != -1;
}

//valid operands
function isOperand(op) {
	return !/[^0-9d]/.test(op);
}

function operateOn(op, left, right) {
	return eval(left+op+right);
}

//turn an equation into a postfix expression
//does not support parenthesis
function toPostfix(equation) {

	var stack = new Array()
	var retExpression = '';

	var tokens = getTokens(equation);

	tokens.forEach(function(token) {

		if(isOperand(token)) {

			//operand conversion from die to numeric
			if(token.indexOf('d') != -1) 
				token = roll(token);

			retExpression += token + " ";

		} else if(isOperator(token)){

			while(stack.length > 0) {
				var op = stack.pop();

				if(getPrecedence(op) >= getPrecedence(token))
					retExpression += op + " ";

				else {
					stack.push(op);
					break;
				}
			}

			stack.push(token);
		}
	});

	while(stack.length > 0) {
		var op = stack.pop();
		retExpression += op + " ";
	}

	return retExpression.trim();
}


//split the equation into tokens
function getTokens(equation) {

	//don't want to deal with spaces
	equation = equation.split(" ").join("");

	var buffer = '';
	var tokens = new Array();

	equation.split('').forEach(function(ch) {
		if(isOperand(ch)) {
			buffer += ch;
		} else if(isOperator(ch)) {
			tokens.push(buffer);
			tokens.push(ch);
			buffer = '';
		}
	});

	if(buffer != '') tokens.push(buffer);

	return tokens;
}

function evalPostfix(postfix) {
	var numberStack = new Array();

	var tokens = postfix.split(" ");

	tokens.forEach(function(token) {

		if(isOperand(token)) {
			numberStack.push(token);

		} else if(isOperator(token)){
			var right = numberStack.pop();
			var left = numberStack.pop();
			numberStack.push(operateOn(token, left, right));
		}
	});

	return numberStack.pop();
}

function evalExpression(expression) {
	var postfix = toPostfix(expression);
	return evalPostfix(postfix);
}

function rollExpression(expression) {
	return evalExpression(expression);
}

//roll a die
function roll(string) {
	var xdy = string.split("d");
	var x = parseInt(xdy[0]);
	var y = parseInt(xdy[1]);
	if(x <= 0 || y <= 0) return 0;
	return Math.floor(Math.random()*(((x*y)-x)+1))+x;
}
///#source 1 1 /monsters/js/lib/storage.js


var Data = {

	mode: "html5",
	
	init: function() {
		if(!Data.isHtml5()) mode="cookie"; 
	},

	isHtml5: function() {
		return typeof(Storage)!=='undefined';
	},
	
	hasVar: function(check) {
		return Data.mode == "html5" ? (typeof Data._html5VarGetRaw(check)	!= 'undefined' &&
											  Data._html5VarGetRaw(check) 	!= 'undefined' &&
											  Data._html5VarGetRaw(check) 	!= null) : 
											  Data._cookieVarGet(check)     !== null;
	},

	getVar: function(check) {
		return Data.mode == "html5" ? Data._html5VarGet(check) : Data._cookieVarGet(check);
	},

	_cookieVarGet: function(check) {
		return $.parseJSON($.cookie(check));
	},

	_html5VarGet: function(check) {
		if(!Data.isHtml5()) throw new Error("You don't have an HTML5 compliant browser, don't try to fool me!");
		try { 
			return $.parseJSON(localStorage[check]);
		} catch(e) {
			return null;
		}
	},

	_cookieVarGetRaw: function(check) {
		return $.cookie(check);
	},

	_html5VarGetRaw: function(check) {
		return localStorage[check];
	},

	clearVar: function(check) {
		return Data.mode == "html5" ? localStorage.removeItem(check) : Data._cookieVarSet(check, null);
	},

	setVar: function(check, val) {
		val = JSON.stringify(val);
		return Data.mode == "html5" ? Data._html5VarSet(check, val) : Data._cookieVarSet(check, val);
	},

	_html5VarSet: function(check, val) {
		if(!Data.isHtml5()) throw new Error("You don't have an HTML5 compliant browser, don't try to fool me!");
		localStorage[check] = val;
	},

	_cookieVarSet: function(check, val) {
		$.cookie(check, val);
	}
	
};
///#source 1 1 /monsters/js/functions.ac.js
//tooltip objects
function _getArmorBonus($all_data) {
	var ret = {};
	if(isset($all_data["marmor"][0])) ret[$all_data["marmor"][0]["aname"]] = parseInt($all_data["marmor"][0]["ac_bonus"]);
	if(isset($all_data["marmor"][1])) ret[$all_data["marmor"][1]["aname"]] = parseInt($all_data["marmor"][1]["ac_bonus"]);
	return ret;
}

function getFlatac($all_data) {
	var ret = {"Base": 10};
	var natAc = parseInt($all_data["data"][0]["natural_ac"]);
	var insAc = parseInt($all_data["data"][0]["insight"]);
	var defAc = parseInt($all_data["data"][0]["deflection"]);
	var dexBon = getBonus($all_data["data"][0]["dex"]);
	var sMod = _getSizeModifier($all_data["data"][0]["size"]);

	if(natAc != 0) ret["Natural AC"] = natAc;
	if(insAc != 0) ret["Insight AC"] = insAc;
	if(defAc != 0) ret["Deflection AC"] = defAc;
	if(dexBon > 0) ret["DEX Bonus"] = dexBon;
	if(sMod  != 0) ret["Size Mod"] = sMod;

	ret = collect(ret, _getArmorBonus($all_data));
	return ret;
				
}

function getTouchac($all_data) {
	return _baseAc($all_data);
}

function getAc($all_data) {
	var ret = {};
	var natAc = parseInt($all_data["data"][0]["natural_ac"]);
	var insAc = parseInt($all_data["data"][0]["insight"]);
	var defAc = parseInt($all_data["data"][0]["deflection"]);

	if(natAc != 0) ret["Natural AC"] = natAc;
	if(insAc != 0) ret["Insight AC"] = insAc;
	if(defAc != 0) ret["Deflection AC"] = defAc;
	ret = collect(ret, _baseAc($all_data), _getArmorBonus($all_data));
	return ret;
}

function _baseAc($all_data) {
	var ret = {"Base": 10};
	var dexBon = getBonus($all_data["data"][0]["dex"]);
	var sMod = _getSizeModifier($all_data["data"][0]["size"]);

	if(dexBon != 0) ret["DEX Bonus"] = dexBon;
	if(sMod  != 0) ret["Size Mod"] = sMod;
	return ret;
}

function _getSizeModifier($size) {
	switch($size) {
		case 10: 	case "Fine": 		return 8;
		case 9: 	case "Diminutive": 	return 4;
		case 6: 	case "Tiny": 		return 2;
		case 1: 	case "Small": 		return 1;
		case 2: 	case "Medium": 		return 0;
		case 3: 	case "Large": 		return -1;
		case 5: 	case "Huge": 		return -2;
		case 7: 	case "Gargantuan": 	return -4;
		case 8: 	case "Colossal": 	return -8;
	}
}

function isset($vari) {
	return $vari != undefined && $vari.length != 0;
}


function sizeModifier(size) {
	return _getSizeModifier(size);
}

function maneuverModifier(size) {
	switch (size) {
		case 10: case "Fine": return -4;
		case 9: case "Diminutive": return -3;
		case 6: case "Tiny": return -2;
		case 1: case "Small": return -1;
		case 2: case "Medium": return 0;
		case 3: case "Large": return 1;
		case 5: case "Huge": return 2;
		case 7: case "Gargantuan": return 3;
		case 8: case "Colossal": return 4;
	}
}
///#source 1 1 /monsters/js/functions.attack.js

var Roll = function (data) {
	return {
		rollData: data,
		_lastRoll: rollDice(data),

		roll: function () {
			this._lastRoll = rollDice(this.rollData);
		}
	};
}

var Atk = function() {
	return {
		monUid: '',
		uid: null,

		isAttack: false,
		isRanged: false,

		baseHit: {},
		baseAttack: {},

		threatHit: {},
		threatAttack: {},
		threatRange: 0,

		critStatus: '',
		atkPreText: '',

		isFor: { name: '', spatk: '', id: '', expr: '' },

		rollBaseAtk: function() {
			var rv = [];
			$.each(this.baseAttack, function (i, e) {
				rv.push(e._lastRoll);
			});
			return arrayToObject([].concat.apply([], rv));
		},

		rerollBaseAtk: function () {
			$.each(this.baseAttack, function (i, e) {
				e.roll();
			});
		},

		rerollForCleave: function() {
			this.baseAttack = arrayToObject([].concat.apply([], [].concat(this.baseAttack[0])));
			this.baseAttack[0].roll();
		},

		display: function () {
			var bH = _rollArray(this.baseHit._lastRoll);
			var tA = _rollArray(this.threatAttack._lastRoll);
			var tH = _rollArray(this.threatHit._lastRoll);
			var bA = _rollArray(this.rollBaseAtk());

			if (this.isAttack) {
				if (this.critStatus == 'threat' || this.critStatus == 'success') {
					addToLog(this.atkPreText + logMessages.critAttempt(this.isFor.name, this.isFor.expr,
						bH.text, bH.result), this.critStatus, this.isFor.id);

					addToLog(this.atkPreText + logMessages.critMiss(this.isFor.name, this.isFor.expr,
						tA.text, tA.result) +
							(this.hasSpatk() ? " (" + this.isFor.spatk + " occurs)" : ''), this.critStatus, this.isFor.id, this.uid);

					addToLog(this.atkPreText + logMessages.critSecond(this.isFor.name, this.isFor.expr,
						tH.text, tH.result), this.critStatus, this.isFor.id);

					addToLog(this.atkPreText + logMessages.critSuccess(this.isFor.name, this.isFor.expr,
						bA.text, bA.result) +
							(this.hasSpatk() ? " (" + this.isFor.spatk + " occurs)" : ''), this.critStatus, this.isFor.id);
				} else {
					addToLog(this.atkPreText + logMessages.initiate(this.isFor.name, this.isFor.expr,
						bH.text, bH.result), this.critStatus, this.isFor.id);

					addToLog(this.atkPreText + logMessages.hit(this.isFor.name, this.isFor.expr,
						bA.text, bA.result) +
							(this.hasSpatk() ? " (" + this.isFor.spatk + " occurs)" : ''), this.critStatus, this.isFor.id, this.uid);
				}
			} else {
				addToLog(this.atkPreText + logMessages.skill(this.isFor.name, this.isFor.expr,
						bA.text, bA.result), this.critStatus, this.isFor.id);
			}
		},

		hasSpatk: function () {
			return this.isFor.spatk != null && this.isFor.spatk != 'null';
		}
	};
};

var cleaveAtks = {};

function doAttack(uid, expr, isAttack, spatkFor, exprFor, idFor, howManyAttacks, isRanged, threatRange,
	attackRollString, critMult, isFullAttack, atkCtOverride, atkPosOverride) {

	if(spatkFor) spatkFor = spatkFor.trim();
	if(exprFor) exprFor = exprFor.trim();

	var nameFor = $("a[href='#"+idFor+"']").html();
	var is2h = expr.indexOf("(2H)") != -1;
	var iters = 1;

	var totalAttacks = atkCtOverride != null ? atkCtOverride : howManyAttacks;

	var attacks = [];

	for (var atkCount = 0; atkCount < howManyAttacks; atkCount++) {

		var attackObj = new Atk();

		attackObj.monUid = uid;
		attackObj.isAttack = isAttack;
		attackObj.isRanged = isRanged;
		attackObj.threatRange = threatRange;
		attackObj.isFor.spatk = spatkFor || null;
		attackObj.isFor.expr = exprFor;
		attackObj.isFor.name = nameFor;
		attackObj.isFor.id = idFor;

		var curAtk = atkPosOverride != null ? atkPosOverride : atkCount;

		iters = 1;

		var result = 0;
		var resultText = '';
		var critStatus = '';

		var atkCtText = totalAttacks > 1 ? '(' + (curAtk + 1) + '/' + totalAttacks + ') ' : '';

		attackObj.atkPreText = atkCtText;

		if (isAttack) {

			var attackRoll = _buildRoll(uid, attackRollString, true, isRanged, false);

			attackObj.baseHit = new Roll(attackRoll);

			for (var i in attackObj.baseHit._lastRoll) {
				var val = attackObj.baseHit._lastRoll[i];
				if (val == 0) continue;

				critStatus = _critStatus(val, i, threatRange, true) || critStatus;

				if (critStatus == 'threat' || critStatus == 'success') {

					var threatData = _buildRoll(uid, attackRollString, true, isRanged, false);
						
					var threatBasicAttackResult=0,threatBasicAttackResultText='';

					var threatBasicAttack = _buildRoll(uid, expr, false, isRanged, isAttack);

					if(is2h && threatBasicAttack["Power Attack"] !== undefined)
						threatBasicAttack["Power Attack"] *= 2;

					iters = critMult || 1;

					attackObj.threatAttack = new Roll(threatBasicAttack);
					attackObj.threatHit = new Roll(threatData);
				}
			}
		}

		attackObj.baseAttack = [];

		for(var x=0; x<iters; x++) {
			var roll = _buildRoll(uid, expr, false, isRanged, isAttack);

			if(is2h && roll["Power Attack"] !== undefined) {
				roll["Power Attack"] *= 2;
			}

			var rollObj = new Roll(roll);

			attackObj.baseAttack.push(rollObj);

			for (var i in rollObj._lastRoll) {
				var val = rollObj._lastRoll[i];
				if(val == 0) continue;

				critStatus = _critStatus(val, i, 0, false) || critStatus;
			}
		}

		attackObj.baseAttack = arrayToObject([].concat.apply([], attackObj.baseAttack));

		attackObj.critStatus = critStatus;

		attacks.push(attackObj);
	}
	return attacks;
}

function attack($rollable, $roller, uid) {

	var data = $.parseJSON($rollable.attr('data-roll'));

	var isFullAttack = data.isFatk;

	var expr = JSON.stringify(data.primary);

	var spatkFor = data.spatk;
	var exprFor = data.for;
	var idFor = $roller.closest('div[data-for]').attr('id');

	var isAttack = typeof data.secondary !== 'undefined' && data.secondary !== false;
	var howManyAttacks = data.howMany || 1;
	var isRanged = data.range;
	var threatRange = data.minCrit;
	var attackRollString = JSON.stringify(data.secondary);
	var crits = data.critMult;

	var attacks = [];

	if(isFullAttack) {
		var fatk = data.primary;

		isRanged = fatk.range != 0;

		$.each(fatk.rolls, function(i, ee) {
			var index = ee.refIndex;
			attacks.push(doAttack(uid, JSON.stringify(ee.tohit), true, fatk.spatk[index], fatk.names[index], 
				idFor, 1, parseInt(fatk.range[index])!=0, fatk.minCrit[index], JSON.stringify(ee.damage), 
				fatk.critMult[index], true, fatk.rolls.length, i));
		});

	}  else {
		attacks.push(doAttack(uid, expr, isAttack, spatkFor, exprFor, idFor, howManyAttacks, isRanged, threatRange, attackRollString, crits, false));
	}

	displayAttacks([].concat.apply([], attacks));

}

function displayAttacks(attacks) {
	for (var atk = 0; atk < attacks.length; atk++) {
		var curAtk = attacks[atk];

		if (!curAtk.isRanged && curAtk.isAttack && monsters[curAtk.monUid].feats.hasFeat("Cleave")) {
			var newUid = new Date().getTime();
			curAtk.uid = newUid;
			cleaveAtks[curAtk.uid] = curAtk;
		}

		curAtk.display();
	}
}

function _critStatus(roll, i, threatRange, canThreat) {
	var critStatus;
	if(roll <= 1 && i.indexOf('1d20') != -1 && i.indexOf('Base') != -1) {
		critStatus = 'fail';

	} else if(canThreat && (roll >= threatRange && i.indexOf('1d20') != -1 && i.indexOf('Base') != -1)) {
		critStatus = 'threat';
		if(roll >= 20) critStatus = 'success';

	} else if(roll >= 20 && i.indexOf('1d20') != -1 && i.indexOf('Base') != -1) {
		critStatus = 'success';

	}
	return critStatus;
}

function _buildRoll(uid, roll, isAttack, isRanged, isDamage) {
	var retRoll = $.parseJSON(roll);

	var featModel = monsters[uid].feats;

	if(isAttack) {
		if(featModel.hasFeat('Combat Expertise')) {
			var bonus = parseInt($$(uid+"_calc_ce").val());
			if(!isNaN(bonus))
				retRoll["Combat Expertise"] = -bonus;
		}

		if (featModel.hasFeat('Awesome Blow') && $$(uid + "_calc_ab").is(":checked"))
			retRoll["Awesome Blow"] = -4;

		if (featModel.hasFeat('Point Blank Shot') && $$(uid + "_calc_pbs").is(":checked") && isRanged)
			retRoll["Point Blank Shot"] = 1;

		if (featModel.hasFeat('Power Attack')) {
			var bonus = parseInt($$(uid+"_calc_pa").val());
			if(!isNaN(bonus))
				retRoll["Power Attack"] = -bonus;
		}

		if ($$(uid + "_calc_charge").is(":checked") && !isRanged)
			retRoll["Charge"] = 2;
	}

	if(isDamage) {

		if (featModel.hasFeat('Power Attack')) {
			var bonus = parseInt($$(uid+"_calc_pa").val());
			if(bonus!=0 && !isNaN(bonus))
				retRoll["Power Attack"] = bonus;
		}

		if (featModel.hasFeat('Point Blank Shot') && $$(uid + "_calc_pbs").is(":checked") && isRanged)
			roll["Point Blank Shot"] = 1;
	}

	return retRoll;
}

function _rollArray(arr) {
	var ret = { result: 0, text: '', rolls: {} };
	var idx = 0;
	for(var i in arr) {
		if (arr[i] == 0 || arr[i] == null) continue;
		if (typeof arr[i] === 'object') {
			var newRoll = {};
			for (var j in arr[i]) {
				ret.result += arr[i][j];
				ret.text += j + ": " + arr[i][j] + "<br>";
				newRoll[j] = arr[i][j];
			}
			ret.rolls[idx++] = newRoll;
		} else {
			ret.result += arr[i];
			ret.text += i + ": " + arr[i] + "<br>";
			ret.rolls[i] = arr[i];
		}
	}
	return ret;
}
///#source 1 1 /monsters/js/functions.feats.js

function formatSpecialFeatName(name) {
	switch (name) {
		case 'Awesome Blow': return 'ab';
		case 'Point Blank Shot': return 'pbs';
		case 'Rage': return 'rage';
		case 'Dodge': return 'dodge';
		case 'Frenzy': return 'frenzy';
		case 'Power Attack': return 'pa';
		case 'Cleave': return 'cleave';
		case 'Charge': return 'charge';
		case 'Combat Expertise': return 'ce';
	}
	return searchNameForNamedEntries(name);
}

function searchNameForNamedEntries(name) {
	if (name.indexOf('Frenzy') != -1) return 'frenzy';
	if (name.indexOf('Rage') != -1) return 'rage';
	return false;
}

function addFeatFunctions() {
	$("[data-cleave-uid]").livequery(function () {
		$(this).click(function () {
			var cleaveAtk = cleaveAtks[$(this).attr('data-cleave-uid')];
			if (!monsters[cleaveAtk.monUid].feats.hasFeat("Great Cleave"))
				cleaveAtk.uid = null;
			cleaveAtk.critStatus = 'cleave';
			cleaveAtk.baseHit.roll();
			cleaveAtk.rerollForCleave();
			cleaveAtk.display();
		});
	});

	$("[data-spfunc='Dodge']").livequery(function () {
		var $this = $(this);
		var uid = $this.attr('data-uid');
		$this.click(function () {
			var props = monsters[uid].ac.arrayProps();
			if ($this.is(":checked")) {
				props["Dodge"] = 1;
				monsters[uid].ac.arrayProps(props);
			} else {
				props["Dodge"] = 0;
				monsters[uid].ac.arrayProps(props);
			}
		})
	});
	$("[data-spfunc='Rage']").livequery(function () {
		var $this = $(this);
		var uid = $this.attr('data-uid');
		$this.click(function () {
			var props = monsters[uid].ac.arrayProps();
			var str = monsters[uid].stats.str.base.val();
			var con = monsters[uid].stats.con.base.val();
			if ($this.is(":checked")) {
				props["Rage"] = -2;
				monsters[uid].ac.arrayProps(props);

				monsters[uid].stats.str.base.val(str + 4);
				monsters[uid].stats.con.base.val(con + 4);

			} else {
				props["Rage"] = 0;
				monsters[uid].ac.arrayProps(props);

				monsters[uid].stats.str.base.val(str - 4);
				monsters[uid].stats.con.base.val(con - 4);
			}
		})
	});
	$("[data-spfunc='Frenzy']").livequery(function () {
		var $this = $(this);
		var uid = $this.attr('data-uid');
		$this.click(function () {
			var props = monsters[uid].ac.arrayProps();
			var str = monsters[uid].stats.str.base.val();
			var con = monsters[uid].stats.con.base.val();
			var will = monsters[uid].stats.will.base.val();

			if ($this.is(":checked")) {
				props["Frenzy"] = -2;
				monsters[uid].ac.arrayProps(props);

				monsters[uid].stats.str.base.val(str + 4);
				monsters[uid].stats.con.base.val(con + 4);
				monsters[uid].stats.will.base.val(will + 2);

			} else {
				props["Frenzy"] = 0;
				monsters[uid].ac.arrayProps(props);

				monsters[uid].stats.str.base.val(str - 4);
				monsters[uid].stats.con.base.val(con - 4);
				monsters[uid].stats.will.base.val(will - 2);
			}
		})
	});
	$("[data-spfunc='Charge']").livequery(function () {
		var $this = $(this);
		var uid = $this.attr('data-uid');
		$this.click(function () {
			var props = monsters[uid].ac.arrayProps();
			monsters[uid].roller.invalidate();

			if ($this.is(":checked")) {
				props["Charge"] = -2;
				monsters[uid].ac.arrayProps(props);
			} else {
				props["Charge"] = 0;
				monsters[uid].ac.arrayProps(props);
			}
		})
	});

	var applyNumFunc = function (uid, scope) {
		var bab = monsters[uid].stats.bab.base.val();
		var conv = { "Power Attack": bab, "Combat Expertise": 5, "Cleave": 4 };
		var val = parseInt(scope.val());

		var func = scope.attr('data-spfunc');

		var finMax = conv[func];
		var max = clamp(0, finMax, bab);
		val = clamp(0, max, val);

		scope.val(val);

		if (func == 'Combat Expertise') {
			var props = monsters[uid].ac.arrayProps();
			props["Combat Expertise"] = val;
			monsters[uid].ac.arrayProps(props);
		}

	};

	$(".applyNum[data-spfunc][type='number']").livequery(function () {
		var $this = $(this);
		var uid = $this.attr('data-uid');
		$this.change(function () { applyNumFunc(uid, $this) });
	});
}
///#source 1 1 /monsters/js/functions.global.js

function $$(str) {
	return $("#" + str);
}

function rollDice(rolls) {
	var result;
	try {
		result = {};
		$.each(rolls, function (i, e) {
			if(e == 0) return;
			if (i == 'Base') i = 'Base (' + e + ')';
			if (typeof e == 'string' && e.indexOf('d') != -1)
				result[i] = parseInt(rollExpression(e));
			else
				result[i] = isNaN(parseInt(e)) ? 0 : parseInt(e);
		});

	} catch (e) {
		result = rollExpression(str);
	}
	if (result === undefined) {
		bootbox.alert("The roll '" + str + "'' is invalid.");
		return null;
	}
	return result;
}

function getBonus(num) {
	num = parseInt(num);
	if (num == 0 || isNaN(num)) return 0;
	return Math.floor(num / 2) - 5;
}

function collect() {
	var ret = {};
	var len = arguments.length;
	for (var i = 0; i < len; i++) {
		for (p in arguments[i]) {
			if (arguments[i].hasOwnProperty(p)) {
				ret[p] = arguments[i][p];
			}
		}
	}
	return ret;
}

function clamp(min, max, num) {
	num = Math.max(min, num);
	num = Math.min(max, num);
	return num;
}

function arrayToObject(arr) {
	var rv = {};
	for (var i = 0; i < arr.length; ++i)
		rv[i] = arr[i];
	return rv;
}
///#source 1 1 /monsters/js/init.js
$(function() {

	if($("#ie").length != 0) {
		//hide stuff
		return;
	}

	$.pnotify.defaults.history = false;

	handleResizing();

	initializeArrowToggler();

	initializePopupToggler();

	initializeFilterSelect();

	makeSpansRemovable();

	initializeAutocomplete();

	$("#newFilter").click(addNewFilter);

	setupGenButton();

	$("#filters").find('option[value="Challenge Rating"]').attr('selected','selected');

	$("#hasScript").show();

	setupRoller();

	bodyBinding();

	loadFilters();

	initialiseSessionManager();
	
	changeLogEntrySize();
	
	overlayLoadingGif();
});

function bodyBinding() {

	$("body").on('click', '.reroll-hp', function () {
		var uid = $(this).attr('data-uid');
		monsters[uid].hp.hp().reroll();
	});

	$("body").on('click', '.left', function () {
		var $cur = $("#monsterList").children(".active");
		var $newtab;
		if ($cur.is($("#monsterList").children().first())) {
			$newtab = $("#monsterList").children().last();
		} else {
			$newtab = $("#monsterList").children(".active").prev();
		}
		$newtab.children("a").tab('show');
	});

	$("body").on('click', '.right', function () {
		var $cur = $("#monsterList").children(".active");
		var $newtab;
		if ($cur.is($("#monsterList").children().last())) {
			$newtab = $("#monsterList").children().first();
		} else {
			$newtab = $("#monsterList").children(".active").next();
		}
		$newtab.children("a").tab('show');
	});

	$(".delete").livequery(function () {
		$(this).click(function () {
			var uid = $(this).attr('data-uid');
			var name = $("#" + uid + "_name").text();
			bootbox.confirm("Are you sure you want to remove " + name + " from the encounter?", function (result) {
				if (result)
					remove(uid, false);
			});
		});
	});

	addFeatFunctions();
}
///#source 1 1 /monsters/js/models.js

var MonsterModel = function (uid, data) {
	var self = this;

	//store the monster data here
	//self.monsterData = data;
	self.monsterBaseStats = data.data[0];

	self.uid = uid;

	self.id = self.monsterBaseStats.m_id;

	self.feats = new FeatModel(data.mfeat, uid);

	//statmodel
	self.stats = {
		str: new StatModel(self.monsterBaseStats['str']),
		dex: new StatModel(self.monsterBaseStats['dex']),
		con: new StatModel(self.monsterBaseStats['con']),
		wis: new StatModel(self.monsterBaseStats['wis']),
		int: new StatModel(self.monsterBaseStats['int']),
		cha: new StatModel(self.monsterBaseStats['cha']),
		fort: new StatModel(self.monsterBaseStats['fort']),
		ref: new StatModel(self.monsterBaseStats['ref']),
		will: new StatModel(self.monsterBaseStats['will']),
		grapple: new GrappleModel(self.monsterBaseStats['grapple'], self.feats),
		bab: new StatModel(self.monsterBaseStats['base_atk']),
		cmd: new StatModel(self.monsterBaseStats['cmd']),
		cmb: new StatModel(self.monsterBaseStats['cmb']),

		reach: self.monsterBaseStats['reach'],
		space: self.monsterBaseStats['space_taken'],
		treasure: self.monsterBaseStats['treasure'],

		size: ko.observable(self.monsterBaseStats.size),
		category: ko.observable(self.monsterBaseStats.category),
		name: ko.observable(self.monsterBaseStats.name)
	};

	self.skills = new SkillModel(data.mskill);

	self.reductions = new DRModel(data.mdmgred);

	self.qualities = new QualityModel(data.mqualit, self.monsterBaseStats.name);

	self.armor = new ArmorModel(data.marmor);

	self.spatks = new SpecialAttackModel(data.mspatk, self.monsterBaseStats.name);

	self.weapons = new WeaponAttackModel(data.mweapon, self.monsterBaseStats.name);

	self.attacks = new WeaponAttackModel(data.mattack, self.monsterBaseStats.name);

	self.initiative = new InitiativeModel(self.stats.dex, self.feats, self.uid);

	self.hp = new HPModel(self.monsterBaseStats.hit_dice, self.stats.con, self.feats, self.uid);

	self.speeds = new SpeedModel(data.mmove);

	self.fatks = new FullAttackModel(data.mfatk, self.monsterBaseStats.name);

	self.ac = new ACModel(self, {
		"Natural AC": parseInt(self.monsterBaseStats.natural_ac),
		"Base": 10,
		"DEX Bonus": self.stats.dex.bonus(),
		"Size Mod": _getSizeModifier(self.stats.size())
	});

	self.roller = new RollerHandler(self);

	self.formatCR = function (cr) {
		switch (cr) {
			case '0.25': return $("<div/>").html("&frac14;").text();
			case '0.33': return $("<div/>").html("&frac13;").text();
			case '0.50': return $("<div/>").html("&frac12;").text();
		}
		return parseInt(cr);
	};

	self.formatSpName = function (name) {
		return self.uid + "_calc_" + formatSpecialFeatName(name);
	};

	self.nameTooltip = ko.computed(function () {
		var retStr = self.stats.size() + " " + self.stats.category();

		if (data.msubcat.length != 0) {
			var arr = [];
			$.each(data.msubcat, function (i, e) {
				arr.push(e.subcategory);
			});
			retStr += " (" + arr.join(', ') + ")";
		}

		$$(uid + "_name").attr('data-original-title', retStr);
		return retStr;
	});
}

function RollerHandler(monModel) {
	var self = this;

	self.dummy = ko.observable();

	self.invalidate = function () {
		self.dummy.notifySubscribers();
	};

	self.monster = monModel;

	self.rollStat = function (stat) {
		var roll = self.monster.stats[stat];
		return JSON.stringify({ 'for': stat.toUpperCase(), 'primary': roll.primaryRoll(), 'howMany': 1 });
	};

	self.rollNonBasicStat = function (stat, name) {
		var roll = self.monster.stats[stat];
		return JSON.stringify({ 'for': name, 'primary': roll.nonBasicPrimaryRoll(), 'howMany': 1 });
	};

	self.rollSkill = function (skill) {
		var roll = self.monster.skills.primaryRoll(skill);
		return JSON.stringify({ 'for': skill.name, 'primary': roll, 'howMany': 1 });
	};

	self.rollAttack = function (attack) {
		if (attack.name == "None") return;
		var primary = self.monster.attacks.attackToHitRoll(attack,
						self.monster.stats.bab.base.val(),
						self.monster.stats.size(),
						self.monster.stats.dex.bonus(),
						self.monster.stats.str.bonus(),
						self.monster.feats.hasWeaponFocus(attack.aname),
						self.monster.feats.hasFeat('Weapon Finesse'));
		var secondary = self.monster.attacks.attackDamageRoll(attack, self.monster.stats.str.bonus());
		var critical = self.determineCritical(attack, self.monster.feats.hasFeat('Improved Critical'));
		return JSON.stringify({
			'for': self.formatName(attack.aname), 'primary': secondary, 'secondary': primary, 'howMany': parseInt(attack.how_many),
			'minCrit': critical.min, 'critMult': critical.mult, 'range': parseInt(attack.range), 'spatk': self.monster.spatks.formatName(attack.spatk)
		});
	};

	self.rollWeapon = function (weapon) {
		if (weapon.name == "None") return;
		var primary = self.monster.weapons.weaponToHitRoll(weapon,
			self.monster.feats.hasWeaponFocus(weapon.wname),
			self.monster.stats.bab.base.val(),
			self.monster.stats.size(),
			self.hasFeat('Weapon Finesse'),
			self.monster.stats.dex.bonus(),
			self.monster.stats.str.bonus());

		var secondary = self.monster.weapons.weaponDamageRoll(weapon, self.monster.stats.str.bonus(), weapon.is_ranged, parseInt(weapon.is_ranged) == 0);
		var critical = self.determineCritical(weapon, self.hasFeat('Improved Critical'));
		return JSON.stringify({
			'for': self.formatName(weapon.wname), 'primary': secondary, 'secondary': primary, 'howMany': parseInt(weapon.how_many) || 1,
			'minCrit': critical.min, 'critMult': critical.mult, 'range': parseInt(weapon.is_ranged), 'spatk': self.monster.spatks.formatName(weapon.spatk)
		});
	};

	self.rollSpatk = function (spatk) {
		if (!self.monster.spatks.isRollable(spatk)) return;
		var primary = self.monster.spatks.toHitRoll(spatk, self.monster.stats.dex.bonus(), self.monster.stats.str.bonus());
		var secondary = self.monster.spatks.damageRoll(spatk, self.monster.stats.str.bonus());
		var critical = self.determineCritical(spatk);

		return JSON.stringify({
			'for': self.formatName(spatk.name), 'primary': secondary, 'secondary': primary, 'howMany': 1,
			'minCrit': critical.min, 'critMult': critical.mult, 'range': parseInt(spatk.range)
		});
	};

	self.rollFatk = function (fatk) {
		var toHit = self.monster.fatks.toHitRoll(fatk, self.monster.attacks,
						self.monster.stats.bab.base.val(),
						self.monster.stats.size(),
						self.monster.stats.dex.bonus(),
						self.monster.stats.str.bonus(),
						self.monster.feats.hasWeaponFocus(self.monster.fatks.formatName(fatk)),
						self.hasFeat('Weapon Finesse'),
						self.hasTwoWeapons(),
						self.hasFeat('Multiattack'));
		var damage = self.monster.fatks.damageRoll(fatk, self.monster.attacks, self.monster.stats.str.bonus());
		var primary = self.monster.fatks.primaryRoll(fatk,
			self.monster.stats.name,
			self.hasFeat('Improved Critical'),
			self.monster.stats.bab.base.val(),
			self.hasGreaterMultiFighting(),
			self.hasImprovedMultiFighting(),
			damage,
			toHit);

		return JSON.stringify({
			'for': "a fatk", 'primary': primary, isFatk: true, range: 0
		});

	};

	self.hasFeat = function (feat) {
		return self.monster.feats.hasFeat(feat);
	}

	self.hasTwoWeapons = function () {
		return self.hasFeat("Two-Weapon Fighting") || self.hasFeat("Multiweapon Fighting")
	};

	self.hasGreaterMultiFighting = function () {
		return self.hasFeat("Greater Two-Weapon Fighting") || self.hasFeat("Greater Multiweapon Fighting");
	};

	self.hasImprovedMultiFighting = function () {
		self.hasFeat("Improved Two-Weapon Fighting") || self.hasFeat("Improved Multiweapon Fighting");
	};

	self.determineCritical = function (obj, hasImpCrit) {
		var minCrit = 20;
		var critMult = 2;

		if (obj.hasOwnProperty('critical')) {
			if (obj.critical.indexOf('-') != -1) {
				var critArr = obj.critical.split("-");
				critMult = parseInt(critArr[1].split("x")[1]);
				minCrit = parseInt(critArr[0]);
			} else if (obj.critical == '0') {
				minCrit = 20;
			} else if (obj.critical.indexOf("x") != -1) {
				minCrit = 20;
				critMult = parseInt(obj.critical.substring(1));
			} else {
				console.error("critical wasn't parseable: " + obj.critical + " " + obj.name);
			}
		}

		if (hasImpCrit)
			minCrit = 21 - ((20 - minCrit + 1) * 2);

		return { min: minCrit, mult: critMult };
	}

	self.formatName = function (name) {
		if (name == undefined) return;
		if (name.indexOf(self.monster.stats.name()) != -1) return name.substring(self.monster.stats.name().length + 1).trim();
		return name;
	};

	self.rollBullrush = ko.computed(function () {
		self.dummy();
		var roll = { "Base": "1d20" };
		roll["STR Mod"] = self.monster.stats.str.bonus();
		roll["Size Mod"] = maneuverModifier(self.monster.stats.size()) * 4;
		roll["Charge Mod"] = $$(self.monster.uid + "_calc_charge").is(":checked") ? 2 : 0;
		roll["Improved Bull Rush"] = self.monster.feats.hasFeat("Improved Bull Rush") ? 4 : 0;
		return JSON.stringify({ 'for': 'Bull Rush', 'howMany': 1, 'primary': roll });
	});

	self.rollDisarm = ko.computed(function () {
		self.dummy();
	});

	self.rollFeint = ko.computed(function () {
		var roll = { "Base": "1d20" };
		roll["Bluff"] = self.monster.skills.countSkill('Bluff');
		roll["CHA Mod"] = self.monster.stats.cha.bonus();
		return JSON.stringify({ 'for': 'Feint', 'howMany': 1, 'primary': roll });
	});

	self.rollOverrunAttack = ko.computed(function () {
		var roll = { "Base": "1d20" };
		roll["STR Mod"] = self.monster.stats.str.bonus();
		roll["Size Mod"] = maneuverModifier(self.monster.stats.size()) * 4;
		return JSON.stringify({ 'for': 'Overrun Attack', 'howMany': 1, 'primary': roll });
	});

	self.rollOverrunSave = ko.computed(function () {
		var roll = { "Base": "1d20" };
		roll["Size Mod"] = maneuverModifier(self.monster.stats.size()) * 4;
		var dexMod = self.monster.stats.dex.bonus();
		var strMod = self.monster.stats.str.bonus();
		if (dexMod > strMod) {
			roll["DEX Mod"] = dexMod;
		} else {
			roll["STR Mod"] = strMod;
		}
		return JSON.stringify({ 'for': 'Overrun Save vs. Prone', 'howMany': 1, 'primary': roll });
	});

	self.rollGrappleGrab = ko.computed(function () {
		var roll = { "Base": "1d20" };
		roll["STR Mod"] = self.monster.stats.str.bonus();
		roll["Base Attack Bonus"] = self.monster.stats.bab.base.val();
		return JSON.stringify({ 'for': 'Grapple Grab', 'howMany': 1, 'primary': roll });
	});

	self.rollOpposedGrapple = ko.computed(function () {
		var roll = { "Base": "1d20" };
		roll["STR Mod"] = self.monster.stats.str.bonus();
		roll["Base Attack Bonus"] = self.monster.stats.bab.base.val();
		roll["Size Mod"] = maneuverModifier(self.monster.stats.size()) * 4;
		return JSON.stringify({ 'for': 'Opposed Grapple', 'howMany': 1, 'primary': roll });
	});
}

//#region AC-related Models
function ACModel(monsterModel, props) {
	var self = this;

	self.sizeBonus = ko.observable(_getSizeModifier(monsterModel.stats.size()));
	self.dex = ko.observable(monsterModel.stats.dex.bonus());

	monsterModel.stats.size.subscribe(function (newValue) {
		self.sizeBonus(_getSizeModifier(newValue));
		self.arrayProps()["Size Mod"] = self.sizeBonus();
	});

	monsterModel.stats.dex.bonus.subscribe(function (newValue) {
		self.dex(newValue);
		self.arrayProps()["DEX Bonus"] = self.dex();
	});

	self.arrayProps = ko.observable(props);

	self.flatfoot = new ArrayValueCountModel(monsterModel.uid + "_flatfoot_ac", self, ["Dodge", "Combat Expertise"]);
	self.touch = new ArrayValueCountModel(monsterModel.uid + "_touch_ac", self, ["Natural AC"]);
	self.total = new ArrayValueCountModel(monsterModel.uid + "_ac", self, []);
}

function ArmorModel(armors) {
	var self = this;

	if (armors.length == 0) armors.push({ name: "None", descript: "" });

	this.armors = ko.observableArray(armors);
}

function ArrayValueCountModel(tag, model, filterProps) {
	var self = this;

	self.tag = tag;
	self.ignored = filterProps;
	self.kvs = ko.observable(model.arrayProps);

	self.sum = ko.computed(function () {
		var sum = 0;

		$.each(self.kvs()(), function (k, v) {
			if ($.inArray(k, self.ignored) == -1) {
				if (typeof v !== 'number') sum += v();
				else sum += v;
			}
		});

		return sum;
	});

	self.toolTip = ko.computed(function () {

		var retStr = '';
		$.each(self.kvs()(), function (i, e) {
			if ($.inArray(i, self.ignored) == -1 && e != 0)
				retStr += i + ": " + e + "<br>";
		});

		$$(tag).attr('data-original-title', retStr);
		return retStr;

	});
}
//#endregion

//#region Attack-related Models
function FullAttackModel(fatks, mname) {
	var self = this;

	if (fatks.length == 1 && fatks[0].length == 0) fatks.pop();

	if (fatks.length == 0) fatks.push({ "0": { aname: "None" } });

	self.mname = mname;
	self.fatks = ko.observableArray(fatks);

	self.formatName = function (fatk) {
		var retStr = [];
		$.each(fatk, function (i, e) {
			retStr.push(self.formatNameStr(e.aname || e.wname));
		});
		return retStr.join(", ");
	};

	self.toolTip = function (fatk) {
		var retStr = '';
		$.each(fatk, function (i, e) {
			var atkStr = self.formatNameStr(e.aname || e.wname);
			atkStr += ': ';
			var rollStr = e.hitdc;
			var eleStr = (rollStr == '0' ? '' : '+') + e.dmgred_hd + ' ' + e.dmgname;
			var count = e.whm || e.atkhm;

			if (rollStr != '0') atkStr += rollStr + "x" + count + " ";
			if (e.dmgname != null) atkStr += eleStr;
			atkStr += "<br />";
			retStr += atkStr;
		});
		return retStr;
	};

	self.formatNameStr = function (name) {
		if (name == undefined) return "ERROR";
		if (name.indexOf(mname) != -1) return name.substring(mname.length).trim();
		return name;
	};

	self.primaryRoll = function (obj, monsterName, hasImpCrit, creatureBab, hasGreaterTwoWeapFighting, hasImpTwoWeapFighting, toHitRoll, attackRoll) {
		var spatkA = [], rangeA = [], critMultA = [], minCritA = [], howManyA = [],
			babUseA = [], secA = [], rollsA = [], nameA = [], atkCtA = [];
		$.each(obj, function (ind, e) {

			if (e.spatkname != null && e.spatkname.indexOf(monsterName) != -1) e.spatkname = e.spatkname.substring(monsterName.length + 1);

			babUseA.push(parseInt(e.is_uses_bab));

			spatkA.push(e.spatkname);

			secA.push(e.mfa_class_mult == "0.50" ? 1 : 0);

			if (e.wir)
				rangeA.push(e.wir);
			else
				rangeA.push(e.mfa_range);

			var minCrit = 0;

			e.critical = e.atkct || e.wct;
			if (!e.critical) e.critical = '0';

			e.how_many = e.atkhm || e.whm;
			if (!e.how_many) e.how_many = '1';

			nameA.push(e.wname || e.aname);

			howManyA.push(e.how_many);

			if (e.hasOwnProperty('critical')) {
				if (e.critical.indexOf('-') != -1) {
					var critArr = e.critical.split("-");
					critMultA.push(critArr[1].split("x")[1]);
					minCrit = parseInt(critArr[0]);
				} else if (e.critical == '0') {
					minCrit = 20;
					critMultA.push(2);
				} else if (e.critical.indexOf("x") != -1) {
					minCrit = 20;
					critMultA.push(e.critical.substring(1));
				} else {
					console.error("critical wasn't parseable: " + obj.critical + " " + obj.name);
				}
			}

			if (hasImpCrit) {
				minCrit = 21 - ((20 - minCrit + 1) * 2);
			}
			minCritA.push(minCrit);

			if (e.is_uses_bab == "1") {
				var div = creatureBab / 5;
				var mod = creatureBab % 5;
				var attacks = Math.max(Math.floor(div) + (mod != 0 ? 1 : 0), 1);

				var bonusAttacks = 1;

				for (var i = 0; i < attacks; i++) {

					var roll = { damage: $.extend(true, {}, attackRoll[ind]), tohit: $.extend(true, {}, toHitRoll[ind]), refIndex: ind };

					//I tried renaming these variables and rearranging everything and it refused to work
					//this is actually taking away from the rolls to-hit
					if (bonusAttacks > 1)
						roll["damage"]["Attack " + (bonusAttacks)] = -(bonusAttacks - 1) * 5;

					if (secA[ind]) {
						if (i == 0)
							rollsA.push(roll);

						else if (hasGreaterTwoWeapFighting && bonusAttacks == 2) {

							rollsA.push(roll);
							bonusAttacks++;

						} else if (hasImpTwoWeapFighting && bonusAttacks == 1) {

							rollsA.push(roll);
							bonusAttacks++;
						}
					} else {
						rollsA.push(roll);
						bonusAttacks++;
					}
				}
				atkCtA.push(bonusAttacks);
			} else {
				var roll = { damage: $.extend(true, {}, attackRoll[ind]), tohit: $.extend(true, {}, toHitRoll[ind]), refIndex: ind };
				for (var i = 0; i < howManyA[ind]; i++)
					rollsA.push(roll);
			}
		});

		var fatk = {
			range: rangeA, spatk: spatkA, names: nameA,
			critMult: critMultA, howMany: howManyA, atkCt: atkCtA,
			minCrit: minCritA, secondary: secA, rolls: rollsA
		};

		return fatk;
	};

	self.damageRoll = function (obj, attackModel, strBonus) {
		var ret = [];

		$.each(obj, function (i, e) {
			var retO = {};

			//attack
			if (e.atkhd) {
				var parsed = attackModel.attackDamageRoll(e, strBonus);
				retO = collect(retO, parsed);
			}

			//weapon
			if (e.wname) {
				e.mfa_strict = e.mfa_strict == "0" ? "1" : "0";
				var range = (parseInt(e.wir) || parseInt(e.mfa_range));
				var parsed = attackModel.weaponDamageRoll(e, strBonus, range, parseInt(e.mfa_strict));
				var strMod = parseFloat(e.mfa_str_mod);
				parsed["STR Mod"] *= strMod;
				retO = collect(retO, parsed);
			}

			ret.push(retO);
		});

		return ret;
	};

	self.toHitRoll = function (obj, attackModel, bab, size, dexBonus, strBonus, hasWeaponFocus, hasWeaponFinesse, hasTwoWeapons, hasMultiAttack) {
		var ret = [];

		var weaponCount = [];

		$.each(obj, function (i, e) {

			var retO = {};
			//attack
			if (e.atkhd) {
				var parsed = attackModel.attackToHitRoll(e, bab, size, dexBonus, strBonus, hasWeaponFocus, hasWeaponFinesse);
				retO = collect(retO, parsed);
				if (parseFloat(e.mfa_class_mult) == 0.5 && !hasTwoWeapons) {
					if (hasMultiAttack)
						retO["Secondary Penalty"] = -2;
					else
						retO["Secondary Penalty"] = -5;
				}
				e.wlight = "1";
				e.mfa_class_mult = "0.50";
			}

			//weapon
			if (e.wname) {
				var parsed = attackModel.weaponToHitRoll(e, hasWeaponFocus, bab, size, hasWeaponFinesse, dexBonus, strBonus);
				retO = collect(retO, parsed);
			}
			weaponCount.push(e);

			ret.push(retO);
		});

		if (weaponCount.length > 1) {

			var minusTwo = false;

			$.each(weaponCount, function (i, e) {
				if ((e.aname != null && e.wlight == "1") || e.wlight == "1" && e.mfa_class_mult == "0.50") {
					minusTwo = true;
				}
			});

			var has2W = hasTwoWeapons;
			if (has2W)
				$.each(weaponCount, function (i, e) {
					var minus = 0;
					if (e.mfa_class_mult == "1.00") {
						minus = -6;
						if (has2W)
							minus += 2;
						if (minusTwo)
							minus += 2;
						ret[i]["Multiweapon Penalty (Primary)"] = minus;
					} else {
						minus = -10;
						if (has2W)
							minus += 6;
						if (minusTwo)
							minus += 2;
						ret[i]["Multiweapon Penalty (Secondary)"] = minus;
					}
				});
		}
		return ret;
	};
}

function SpecialAttackModel(spatks, mname) {
	var self = this;

	if (spatks.length == 0) spatks.push({ name: "None", descript: "", hit_dice: '0' });

	self.mname = mname;
	self.spatks = ko.observableArray(spatks);

	self.countColumns = function (spatk) {
		var cols = 3;
		if (spatk.hit_dice != '0') cols--;
		if (spatk.dmgred_nm != null) cols--;
		return cols;
	};

	self.formatElemental = function (spatk) {
		var retStr = '';
		if (spatk.hit_dice != '0') retStr = '+';
		retStr += spatk.dmgred_hd + " ";
		retStr += spatk.dmgred_nm;
		return retStr;
	};

	self.formatName = function (name) {
		if (!name) return;
		if (name.indexOf(mname) != -1) return name.substring(mname.length);
		return name;
	};

	self.isRollable = function (spatk) {
		return spatk.hit_dice != '0' || spatk.dmgred_nm != null;
	};

	self.decideRollable = function (spatk) {
		return self.isRollable(spatk) ? '' : 'unrollable';
	}

	self.toHitRoll = function (spatk, dexBonus, strBonus) {
		var ret = {};
		ret["Base"] = "1d20";
		if (spatk.range == "0")
			ret["STR Mod"] = strBonus;
		else
			ret["DEX Mod"] = dexBonus;

		return ret;
	};

	self.damageRoll = function (obj, strBonus) {
		var ret = {};
		if (obj.hit_dice != '0')
			ret["Base (" + obj.hit_dice + ")"] = obj.hit_dice;

		if (obj.dmgred_hd != '0')
			ret[obj.dmgred_nm] = obj.dmgred_hd;

		ret["STR Mod"] = strBonus;
		return ret;
	};
}

function WeaponAttackModel(damagers, mname) {
	var self = this;

	var _damagers = [];

	$.each(damagers, function (i, e) {
		if (e.hasOwnProperty("is_melee") && e.hasOwnProperty("is_ranged") && e.hasOwnProperty("wname") && e.is_melee == "1" && e.is_ranged != "0") {

			var oldName = e.wname.trim();
			var range = e.is_ranged;

			e.wname = oldName + " (Melee)";
			e.is_ranged = "0";
			_damagers.push(e);

			var newObject = $.extend(true, {}, e);

			newObject.is_ranged = range;
			newObject.is_melee = "0";
			newObject.wname = oldName + " (Ranged)";

			_damagers.push(newObject);

		} else if (e.hasOwnProperty("is_multi_handed") && e.is_multi_handed == "1") {
			var oldName = e.wname.trim();

			e.is_one_handed = "1";
			e.wname = oldName + " (1H)";
			_damagers.push(e);

			var newObject = $.extend(true, {}, e);

			newObject.is_one_handed = "0";
			newObject.wname = oldName + " (2H)";
			_damagers.push(newObject);
		} else {
			_damagers.push(e);
		}
	});

	if (damagers.length == 0) _damagers.push({ name: "None", descript: "", hit_dice: '0' });

	self.mname = mname;
	self.damagers = ko.observableArray(_damagers);

	self.countColumns = function (spatk) {
		var cols = 3;
		if (spatk.hitdc != '0') cols--;
		if (spatk.dmgname != null) cols--;
		return cols;
	};

	self.formatElemental = function (spatk) {
		var retStr = '';
		if (spatk.hitdc != '0') retStr = '+';
		retStr += spatk.dmgred_hd + " ";
		retStr += spatk.dmgname;
		return retStr;
	};

	self.formatName = function (name) {
		if (name == undefined) return;
		if (name.indexOf(mname) != -1) return name.substring(mname.length).trim();
		return name;
	};

	self.attackToHitRoll = function (obj, bab, size, dexBonus, strBonus, hasWeaponFocus, hasWeaponFinesse) {
		var ret = {};
		ret["Base"] = "1d20";

		if (hasWeaponFocus)
			ret["Weapon Focus"] = 1;

		ret["BAB"] = bab;

		ret["Size (" + size + ")"] = sizeModifier(size);

		if (obj.is_strictly_melee == "0")
			if (hasWeaponFinesse)
				ret["DEX Mod"] = dexBonus;
			else
				ret["STR Mod"] = strBonus;
		else
			ret["DEX Mod"] = dexBonus;

		return ret;
	};

	self.attackDamageRoll = function (obj, strBonus) {
		var ret = {};
		ret["Base"] = obj.hitdc;

		if (obj.dmgname != null)
			ret[obj.dmgname + " (" + obj.dmgred_hd + ")"] = obj.dmgred_hd;

		ret["STR Mod"] = Math.floor(strBonus*parseFloat(obj.max_str_mod));

		return ret;
	}

	self.weaponToHitRoll = function (obj, hasWeaponFocus, bab, size, hasWeaponFinesse, dexBonus, strBonus) {
		var ret = {};
		ret["Base"] = "1d20";

		if (hasWeaponFocus)
			ret["Weapon Focus"] = 1;

		ret["BAB"] = bab;

		ret["Size (" + size + ")"] = sizeModifier(size);
		
		if (obj.is_ranged == "0" || (obj.hasOwnProperty("wir") && obj.wir == "0")) {

			if (hasWeaponFinesse)
				ret["DEX Mod"] = dexBonus;
			else
				ret["STR Mod"] = strBonus;

			if (obj.wname.indexOf('Javelin') != -1)
				ret["Javelin"] = -4;

		} else {
			if (obj.wname && obj.wname.toLowerCase().indexOf('composite') != -1) {
				var strMod = parseFloat(obj.max_str_mod) || 0;
				if (strBonus < strMod) {
					ret["Composite Proficiency"] = -2;
				}
			}
			ret["DEX Mod"] = dexBonus;
		}

		ret["Enchantment"] = parseInt(obj.enchantment_bonus);
		return ret;
	};

	self.weaponDamageRoll = function (obj, strBonus, range, melee) {
		var ret = {};
		ret["Base"] = obj.hitdc;
		if (obj.dmgname != null)
			ret[obj.dmgname + " (" + obj.dmgred_hd + ")"] = obj.dmgred_hd;
		
		var strMod = parseFloat(obj.max_str_mod) || 0;

		ret["STR Mod"] = strBonus;

		if (melee && obj.is_uses_str_mod == "1" && obj.is_one_handed == "0") {
			ret["STR Mod"] = (strBonus * 1.5);
		} else {

			if (strBonus < 0 && obj.wname.toLowerCase().indexOf('crossbow') == -1)
				ret["STR Mod"] = strBonus;
		}

		if (obj.is_uses_str_mod == "0") ret["STR Mod"] = 0;

		ret["Enchantment"] = parseInt(obj.enchantment_bonus);

		return ret;
	};
}
//#endregion

//#region Basic Statistic Models
function InitiativeModel(dexModel, featModel, uid) {
	var self = this;
	self.init = new RollableNumberModel('1d20');
	self.dex = ko.observable(dexModel.bonus());
	self.feats = ko.observable(featModel.feats);

	self.countImprovedInitiative = ko.computed(function () {
		var ret = 0;
		$.each(self.feats()(), function (i, e) {
			if (e.name == 'Improved Initiative') ret = parseInt(e.feat_level);
		});
		return ret;
	});

	self.toolTip = ko.computed(function () {
		var retStr = "Base (1d20): " + self.init.num().val();
		if (self.dex != 0) retStr += ("<br>DEX: " + self.dex());
		if (self.countImprovedInitiative() != 0) retStr += ("<br>Improved Initiative: " + (4 * self.countImprovedInitiative()));
		$$(uid + "_init").attr('data-original-title', retStr);
		return retStr;
	});

	featModel.feats.subscribe(function (newValue) {
		self.feats(newValue);
	});

	dexModel.bonus.subscribe(function (newValue) {
		self.dex(newValue);
	});

	self.totalInit = ko.computed(function () {
		return self.init.num().val() + self.dex() + (4 * self.countImprovedInitiative());
	});
}

function GrappleModel(base, featModel) {
	if (typeof base !== "number") base = parseInt(base);
	var self = this;
	self.feats = ko.observable(featModel.feats);
	self.base = new ModifiableNumberModel(base);

	self.grappleBonus = ko.computed(function () {
		var ret = 0;
		$.each(self.feats()(), function (i, e) {
			if (e.name == 'Racial Grapple Bonus') ret += 4;
			if (e.name == 'Improved Grapple') ret += 4;
		});
		return ret;
	});

	self.calc = ko.computed(function () {
		return self.base.val() + self.grappleBonus();
	});

	self.nonBasicPrimaryRoll = function () {
		return { "Base": "1d20", "Bonus": self.calc() };
	};
}

function StatModel(base) {
	if (typeof base !== "number") base = parseInt(base);
	var self = this;
	self.base = new ModifiableNumberModel(base);
	self.bonus = ko.computed(function () {
		return getBonus(self.base.val());
	});
	self.format = ko.computed(function () {
		if (self.base.val() == 0) return "--";
		var bonus = self.bonus();

		if (bonus > 0) bonus = "+" + bonus;
		return self.base.val() + " " + "(" + bonus + ")";
	});

	self.primaryRoll = function () {
		return { "Base": "1d20", "Bonus": self.bonus() };
	};

	self.nonBasicPrimaryRoll = function () {
		return { "Base": "1d20", "Bonus": self.base.val() };
	};
}
//#endregion

//#region HP-related Models
function HPModel(hpRoll, conModel, featModel, uid) {
	var self = this;

	self.hp = ko.observable(new RollableNumberModel(hpRoll));
	self.con = ko.observable(conModel.bonus());
	self.mod = ko.observable(new ModifiableNumberModel(0));
	self.feats = ko.observable(featModel.feats);
	self.uid = uid;

	self.countToughness = ko.computed(function () {
		var ret = 0;
		$.each(self.feats()(), function (i, e) {
			if (e.name == 'Toughness') ret = parseInt(e.feat_level);
		});
		return ret;
	});

	conModel.bonus.subscribe(function (newValue) {
		self.con(newValue);
	});

	self.initTotal = ko.computed(function () {
		return self.hp().num().val();
	});

	self.calcConBonus = ko.computed(function () {
		return self.con() * parseInt(hpRoll.split('d')[0]);
	});

	self.max = ko.computed(function () {
		return self.initTotal() + (3 * self.countToughness()) + self.calcConBonus();
	});

	self.total = ko.computed(function () {
		return self.initTotal() + self.mod().val() + (3 * self.countToughness()) + self.calcConBonus();
	});

	self.toolTip = ko.computed(function () {
		var curHp = self.hp().num().val();
		var modHp = self.mod().val();
		var retStr = "Base (" + hpRoll + "): " + curHp;
		if (modHp != 0) retStr += "<br>Modification: " + modHp;
		if (self.calcConBonus() != 0) retStr += "<br>CON Bonus: " + self.calcConBonus();
		if (self.countToughness() != 0) retStr += "<br>Toughness: " + (3 * self.countToughness());


		//hack for dynamic tooltip text
		$$(uid + "_hp").attr('data-original-title', retStr);
		return retStr;
	});
}

function RollableNumberModel(baseRoll) {
	var self = this;
	self.rollStr = baseRoll;
	self.num = ko.observable(new ModifiableNumberModel(roll(self.rollStr)));

	self.reroll = function () {
		self.num(new ModifiableNumberModel(roll(self.rollStr)));
	};
}

function ModifiableNumberModel(baseVal) {
	var self = this;
	self.init = baseVal;
	self.val = ko.observable(baseVal);

	self.reset = function () {
		self.val(self.init);
	};

	self.resetToVal = function (offset) {
		self.val(self.init);
		self.relative(offset);
	};

	self.increment = function () {
		self.val(self.val() + 1);
	};
	self.decrement = function () {
		self.val(self.val() - 1);
	};
	self.relative = function (num) {
		self.val(self.val() + num);
	}
	self.absolute = function (num) {
		self.val(num);
	}
}
//#endregion

//#region List-backed Stat Models
function DRModel(reductions) {
	var self = this;

	if (reductions.length == 0) reductions.push({ name: "None", reduction_amount: -1 });

	self.dr = ko.observableArray(reductions);
	self.format = function (val) {
		return val == '0' || val == 0 ? "Immune" : (val == -1 ? '' : val);
	};
}

function FeatModel(feats, uid) {
	var self = this;

	if (feats.length == 1) if (feats[0].name == 'No Feats') feats.pop();

	if (feats.length == 0) feats.push({ name: "None", descript: "" });

	self.uid = uid;
	self.feats = ko.observableArray(feats);
	self.checkboxFeats = ["Dodge", "Point Blank Shot", "Awesome Blow", "Frenzy", "Rage", "Rapid Shot", "Multi Shot"];
	self.numberFeats = ["Power Attack", "Combat Expertise"];

	self.countFeat = function (featName) {
		var ret = 0;

		$.each(self.feats(), function (i, e) {
			if (e.name && e.name.indexOf(featName) != -1) ret = parseInt(e.feat_level);
		});

		return ret;
	};

	self.hasWeaponFocus = function (wname) {
		if (!wname) return false;
		if (!self.hasFeat('Weapon Focus')) return false;

		var ret = false;

		$.each(self.feats(), function (i, e) {
			if (e.name.indexOf('Weapon Focus') == -1) return;
			var atk = e.name.substring(e.name.indexOf("(") + 1, e.name.indexOf(")"));
			if (!atk) return;
			if (wname.toLowerCase().indexOf(atk.toLowerCase()) != -1)
				ret = true;
		});

		return ret;
	};

	self.hasFeat = function (nameToFind) {
		return self.countFeat(nameToFind) != 0;
	};

	self.format = function (feat) {
		return feat.name + (feat.feat_level > 1 ? " (x" + feat.feat_level + ")" : "");
	};

	self.canBeShown = function (name) {
		return name != 'Racial Grapple Bonus';
	};

	self.hasCheckbox = function (name) {
		return self.checkboxFeats.indexOf(name) != -1;
	};

	self.hasNumber = function (name) {
		return self.numberFeats.indexOf(name) != -1;
	};

	self.countColumns = function (name) {
		if (self.hasCheckbox(name) || self.hasNumber(name)) return 1;
		return 2;
	};
}

function QualityModel(qualities, mname) {
	var self = this;

	if (qualities.length == 1) if (qualities[0].name == 'No Qualities') qualities.pop();

	if (qualities.length == 0) qualities.push({ name: "None", descript: "" });

	self.mname = mname;
	self.qualities = ko.observableArray(qualities);

	self.isMeasurable = function (name) {
		name = self.formatName(name);
		return name != 'Spell Resistance' && name != "Regeneration" && name != "Turn Resistance";
	};
	self.format = function (qual) {
		return qual.value + (self.isMeasurable(qual.name) ? "ft" : "");
	};
	self.formatName = function (name) {
		if (name.indexOf(mname) != -1) return name.substring(mname.length).trim();
		return name.trim();
	};
}

function SkillModel(skills) {
	var self = this;

	if (skills.length == 1) if (skills[0].name == 'No Skills') skills.pop();

	if (skills.length == 0) skills.push({ name: "None", sub_skill: "", descript: "", skill_level: 0 });

	self.skills = ko.observableArray(skills);

	self.formatName = function (skill) {
		if (skill.sub_skill != "" && skill.sub_skill != null) return skill.name + " (" + skill.sub_skill + ")";
		return skill.name;
	};
	self.formatNum = function (skill) {
		if (skill.skill_level == 0) return "";
		if (skill.skill_level > 0) return "+" + skill.skill_level;
		return skill.skill_level;
	};

	self.primaryRoll = function (skill) {
		return { "Base": "1d20", "Bonus": skill.skill_level };
	};

	self.hasSkill = function (skill) {
		return self.countSkill(skill) != 0;
	};

	self.countSkill = function (skillName) {
		var ret = 0;

		$.each(self.skills(), function (i, e) {
			if (e.name && e.name.indexOf(skillName) != -1) ret = parseInt(e.skill_level);
		});

		return ret;
	};
}

function SpeedModel(speeds) {
	var self = this;
	this.speeds = ko.observableArray(speeds);
}
//#endregion
///#source 1 1 /monsters/js/monster.js

var monsterCount = 0;

var monsters = {};

function addNewMonster(monster) {

	$(".alert").hide();
	$("#monsterList").show();

	var uid = new Date().getTime();

	_addNewMonster(monster, uid);

	modifyHp(uid, 0, true);

	_hidePopup();

	sortMonsters();

	saveMonsters();

	return uid;

}

function _addNewMonster(monster, uid, name) {

	var $li = $("<li/>");

	var realName = monster == null ? name : monster.data[0].name;

	var $a = $("<a/>", {
		href: "#" + uid
	}).html("[<span class='logCount'>" + (++monsterCount) + "</span>] " + realName).attr('data-toggle', 'tab').attr('data-uid', uid);

	$a.appendTo($li);

	var newHtml = $("#dummyData").html();
	$("#monsterData").append(newHtml);

	var $parent = $(".tab-pane[data-for='none']").not("#dummyData > [data-for='none']");

	$parent.attr('id', uid);
	$parent.attr('data-for', uid);

	$parent.find("*[id*='1A']").each(function () {
		$(this).attr('id', $(this).attr('id').replace('1A', uid));
	});

	$parent.find("*[data-uid*='1A']").each(function () {
		$(this).attr('data-uid', $(this).attr('data-uid').replace('1A', uid));
	});

	if (!(uid in monsters)) {
		monsters[uid] = new MonsterModel(uid, monster);
	}

	ko.applyBindings(monsters[uid], $$(uid)[0]);

	var popover = $("#dummyModifiable").html();
	popover = popover.split("1A").join(uid);
	$("#health_" + uid).popover({
		html: true,
		placement: 'bottom',
		content: popover,
		title: "Modify HP"
	}).click(function () {
		$(".modify-hp").click(function () {
			var modHp = parseInt($$(uid + "_hp_mod").val());
			if ($(this).hasClass('subtract')) {
				modifyHp(uid, -modHp);
			} else {
				modifyHp(uid, modHp);
			}
		});
	});

	var nice = $('#monsterList').niceScroll({ horizrailenabled: false, zindex: 9, railoffset: { left: -118 } });
	$('#monsterList').css('overflow', 'hidden');

	setupGrids(uid);

	tabChangeScrollbars($a);

	setupRollables($parent);

	var newLog = $("#dummyLog").html();
	$("#curMon").append(newLog);

	var $pLog = $(".log[data-for='none']").not("#dummyLog > [data-for='none']");
	$pLog.attr('id', uid + "_log").attr('data-for', uid);

	$li.appendTo($("#monsterList"));

	$a.tab('show');
}

function sortMonsters() {
	var mylist = $('#monsterList');
	var listitems = mylist.children('li').get();
	listitems.sort(function (a, b) {
		var leftId = $(a).children("a").attr('data-uid');
		var rightId = $(b).children("a").attr('data-uid');

		var left = parseInt($$(leftId + "_init").text());
		var right = parseInt($$(rightId + "_init").text());
		//var left = monsters[leftId].initiative.init.num().val();
		//var right = monsters[rightId].initiative.init.num().val();

		if ((right-left) == 0) {
			var leftDex = monsters[leftId].stats.dex.bonus();
			var rightDex = monsters[rightId].stats.dex.bonus();

			//TODO if rightDex-leftDex <0 sort by alpha

			return rightDex - leftDex;
		}

		return right - left;
	});
	$.each(listitems, function (idx, itm) { mylist.append(itm); });
}

function modifyHp(uid, mod, notLog) {
	if (isNaN(mod)) return;
	monsters[uid].hp.mod().relative(mod);

	var curHp = monsters[uid].hp.total();
	var maxHp = monsters[uid].hp.max();
	var $monsterNode = $("[href=#" + uid + "]");
	var monsterName = $monsterNode.html();

	var hpPerc = Math.round((curHp/maxHp)*100);
	if(hpPerc <= 15)	  $monsterNode.attr('class','hp-critical');
	else if(hpPerc <= 50) $monsterNode.attr('class','hp-warning');
	else 				  $monsterNode.attr('class','hp-good');

	if(!notLog)
		addToLog(monsterName + (mod < 0 ? " lost " : " gained ") + Math.abs(mod) + " hp. ("+curHp+"/"+maxHp+") ["+hpPerc+"%]");

	saveMonsters();

	if(curHp <= 0) {		
		bootbox.confirm("It looks like "+$monsterNode.text()+" has died. Would you like to mark it as 'killed'?", function(result) {
			if(result)
				remove(uid, true);
		});
	}
}

function remove(uid, killed) {
	var $node = $("#monsterList a[href='#"+uid+"']");
	var pos = parseInt($node.find('.logCount').text());

	var count = 0;

	$("#monsterList li").each(function(i, e) {
		count++;
	});
	
	var $a = $("#monsterList li a").first();

	$a.tab('show');

	if (count > 0) {
		$a = $("#monsterList li:nth-child("+(pos-1)+")").find("a");
		$a.tab('show');
	} else {
		if(killed) {
			$("#winAlert").show();
		} else {
			$("#genAlert").show();
		}
		$("#monsterList").hide();
	}

	$node.parent().remove();
	$(".tab-pane[data-for='" + uid + "']").remove();
	$("div[data-nice-uid='" + uid + "']").hide();
	$("#" + uid + "_log").remove();

	saveMonsters();

	updateLogNumbers(uid, killed);
}

function updateLogNumbers(uid, killed) {
	$("#allInfo div p span.logCount").each(function(i,e){
		var uid = $(this).closest('[data-uid]').attr('data-uid');

		if($(this).text() == 'DEAD' || $(this).text() == 'GONE');

		var $monNode = $("#monsterList a[href='#"+uid+"']");

		if($monNode.length == 0) {
			$(this).text(killed ? 'DEAD' : 'GONE');
		} else {
			//$(this).text($monNode.find('.logCount').text());
		}
	});
}
///#source 1 1 /monsters/js/sync.global.js

var hasReloadedSession = false;

function now() {
	return new Date().getTime();
}

function serverReachable() {
	//thanks https://gist.github.com/louisremi/936493
	var x = new (window.ActiveXObject || XMLHttpRequest)("Microsoft.XMLHTTP"),
		s;
	x.open(
	  "HEAD",
	  "//" + window.location.hostname + "/?rand=" + Math.random(),
	  false
	);
	try {
		x.send();
		s = x.status;
		return (s >= 200 && s < 300 || s === 304);
	} catch (e) {
		return false;
	}
}
///#source 1 1 /monsters/js/sync.monsters.js

var IS_RELOADING_SESSION = false;
function saveMonsters() {
	if (!loggedIn) return;

	var saveTheseMonsters = [];

	$("#monsterList li a").each(function (i, e) {
		var uid = $(this).attr('data-uid');

		var arrMon = monsters[uid];

		var mon = {
			id: arrMon.id,
			modHp: arrMon.hp.mod().val(),
			maxHp: arrMon.hp.initTotal(),
			init: arrMon.initiative.init.num().val()
		};

		if (mon.id == '') return;

		saveTheseMonsters.push(mon);
	});

	if (saveTheseMonsters.length == 0) return;

	sessionManager.saveCurrentMonsters(saveTheseMonsters);
}

function loadMonsters(monsterSet) {
	if (!loggedIn) return;

	$("#overlay").fadeIn();

	var loadTheseMonsters = [];

	$.each(monsterSet, function (i, e) {
		loadTheseMonsters.push(e.id);
	});

	$.post('ajax.php', { action: "gen", ids: JSON.stringify(loadTheseMonsters) }, function (monsterArr) {
		var arr = $.parseJSON(monsterArr);
		IS_RELOADING_SESSION = true;
		$.eachAsync(arr, {
			loop: function (i, e) {
				var mon = e;
				var uid = addNewMonster(mon);
				var oldMonData = monsterSet[i];

				monsters[uid].hp.hp().num().val(oldMonData.maxHp);
				modifyHp(uid, oldMonData.modHp, true);
				monsters[uid].initiative.init.num().val(oldMonData.init);

				setupGrids(uid);
				sortMonsters();

				saveMonsters();
			},
			end: function () {
				$("#overlay").fadeOut();
				IS_RELOADING_SESSION = false;
			}
		});
	});
}

function removeAllMonsters() {
	$("#allInfo").empty();
	$("#monsterList").hide().empty();
	$("#monsterData .tab-pane").remove();
	$("#genAlert").show();
	_hideAllMiniboxScrollbars();
}

///#source 1 1 /monsters/js/sync.sessions.models.js

var SESSIONS_VARIABLE = "sessions";
var LAST_SESSION_VARIABLE = "lastSessionId";

var SessionModel = function() {
	var self = this;

	//#region Dummy/Invalidation
	self.dummy = ko.observable();

	self.invalidate = function () {
		self.dummy.notifySubscribers();
	};
	//#endregion

	//#region Global Session Data
	self._currentSessionId = function () {
		self.invalidate();
		return self.currentSessionId().toString();
	};

	self.currentSessionId = ko.computed({
		read: function () {
			self.dummy();
			if (!Data.hasVar(LAST_SESSION_VARIABLE)) Data.setVar(LAST_SESSION_VARIABLE, now()); 
			return Data.getVar(LAST_SESSION_VARIABLE);
		},
		write: function (value) {
			Data.setVar(LAST_SESSION_VARIABLE, value);
		}
	});

	self.allSessions = ko.computed({
		read: function () {
			self.dummy();
			if (!Data.hasVar(SESSIONS_VARIABLE)) Data.setVar(SESSIONS_VARIABLE, {});
			return Data.getVar(SESSIONS_VARIABLE)
		},
		write: function (value) {
			Data.setVar(SESSIONS_VARIABLE, self.verifySessionData(value));
		}
	});
	//#endregion

	//#region Session Filtering
	self.getSessionById = function (id) {
		var sessionList = self.allSessions();
		if (sessionList[id] === undefined) {
			sessionList[id] = self.newSessionData();
			self.allSessions(sessionList);
		}
		return sessionList[id];
	};

	self.currentSession = ko.observable(function () {
		self.dummy();
		return self.getSessionById(self.currentSessionId());
	});

	self.syncedSessions = ko.observableArray(cloudSessions);

	self.nonSyncedSessions = ko.computed(function () {
		self.dummy();
		var sessions = [];
		var synced = self.syncedSessions();
		var all = self.allSessions();
		$.each(all, function (i, e) {
			var found = false;
			$.each(synced, function (ii, ee) {
				if (e.startTime == ee.startTime) found = true;
			});
			if (!found) sessions.push(e);
		});
		return sessions;
	});

	self.tableDisplaySessions = ko.computed(function () {
		self.dummy();
		return self.syncedSessions().sort(sortByName).concat(self.nonSyncedSessions().sort(sortByName));
	});

	self.verifySessionData = function (data) {
		var arr = {};
		$.each(data, function (i, e) {
			//if (self.hasMonsterDataFor(e.startTime))
			if(e != null)
				arr[e.startTime] = e;
		});
		return arr;
	};

	self.isSynced = function (session) {
		var ret = false;
		$.each(self.syncedSessions(), function (i, e) {
			if (session.startTime == e.startTime) ret = true;
		});
		return ret;
	};
	//#endregion

	//#region Saving Functions
	self.saveSession = function (ask, sessionData) {
		if (!loggedIn) return;

		var sessions = self.allSessions();

		if (ask && !sessions.hasOwnProperty(self._currentSessionId())) {
			bootbox.confirm("Would you like to save this new session?", function (result) {
				if (!result) { return; }
				self.saveNewSession();
			});
		}

		if (sessions.hasOwnProperty(self._currentSessionId())) {
			if (sessionData)
				sessions[self._currentSessionId()] = sessionData;
			sessions[self._currentSessionId()].lastUpdate = now();
		} else {
			if (sessionData)
				sessions[self._currentSessionId()] = sessionData;
			else
				sessions[self._currentSessionId()] = self.newSessionData();
			sessions[self._currentSessionId()].lastUpdate = now();
		}

		if (self.isSynced(sessions[self._currentSessionId()]))
			self.sync(sessions[self._currentSessionId()]);

		self.allSessions(sessions);
	};

	self.saveNewSession = function () {
		var sessions = self.allSessions();

		var ret = sessions[self._currentSessionId()] = self.newSessionData();

		self.allSessions(sessions);
		return ret;
	};

	self.saveMonsters = function (id, data, dontSync) {
		Data.setVar("monsters_" + id, data);
		if(!dontSync)
			self.saveSession(false);
	};

	self.saveCurrentMonsters = function (data) {
		self.invalidate();
		self.saveMonsters(self.currentSessionId(), data);
	};

	self.saveCurrentSessionInfo = function () {
		var newName = $("#sessionName").val();
		if (newName == '') return false;
		var session = sessionManager.currentSession()();
		session.name = newName;
		session.lastUpdate = now();
		self.saveSession(false, session);

		$("#currentSessionDialog").modal('hide');
		self.invalidate();
	};
	//#endregion

	//#region Loading Functions
	self.loadSession = function (id) {
		if (!loggedIn) return;
		removeAllMonsters();
		self.currentSessionId(id);
		loadMonsters(self.getMonsterDataBySession(id));
	};

	self.getPreviousSession = function () {
		if (!loggedIn) return;
		if (!Data.hasVar(LAST_SESSION_VARIABLE)) return null;
		return Data.getVar(LAST_SESSION_VARIABLE);
	};

	self.getMonsterDataBySession = function (id) {
		return Data.getVar("monsters_" + id);
	};
	//#endregion

	//#region Deletion Functions
	self.deleteSession = function (uid) {
		if (!loggedIn) return;

		Data.clearVar("monsters_" + uid);

		var sessionList = self.allSessions();

		if (self.isSynced(sessionList[uid]))
			self.unsync(sessionList[uid]);

		sessionList[uid] = null;

		self.allSessions(sessionList);
		self.invalidate();
	};
	//#endregion

	//#region Creation Functions
	self.startSession = function () {
		if (!loggedIn) return;
		self.saveSession(false);
	};

	self.startNewSession = function () {
		if (!loggedIn) return;

		self.currentSessionId(now());
		self.saveSession(false);
		removeAllMonsters();
	};
	//#endregion

	//#region Merging Functions
	self.mergeCloudSessionsToLocal = function () {
		var localSessions = self.allSessions();
		$.each(self.syncedSessions(), function (i, e) {
			self.saveMonsters(e.startTime, $.parseJSON(e.json), true);
			localSessions[e.startTime] = {
				name: e.name,
				startTime: parseInt(e.startTime),
				lastUpdate: parseInt(e.lastUpdate)
			};
		});
		self.allSessions(localSessions);
	};
	//#endregion

	//#region Check-if Functions
	self.hasMonsterDataFor = function (id) {
		return Data.hasVar("monsters_" + id);
	};

	self.hasPreviousSession = function () {
		if (!loggedIn) return;
		if (!Data.hasVar(LAST_SESSION_VARIABLE)) return false;
		var lastSessId = Data.getVar(LAST_SESSION_VARIABLE);

		if (!self.hasMonsterDataFor(lastSessId)) return false;
		if (self.getMonsterDataBySession(lastSessId).length == 0) return false;
		return true;
	};

	self.sessionManagement = function () {
		if (!loggedIn) return;
		if (self.hasPreviousSession()) {
			bootbox.confirm("It looks like you had an encounter open. Would you like to reload it?", function (result) {
				if (hasReloadedSession) return;
				if (!result) { self.currentSessionId(now()); self.startSession(); return; }
				hasReloadedSession = true;
				self.loadSession(self.getPreviousSession());
			});
		} else {
			self.startSession();
		}
	};
	//#endregion

	//#region Data Creation/Formatting Functions
	self.newSessionData = function () {
		self.invalidate();
		return {
			startTime: self.currentSessionId(),
			name: "Nameless Encounter",
			lastUpdate: now()
		};
	};

	self.formatSessionDialogDate = function (date) {
		return new Date(parseInt(date)).format();
	};
	//#endregion

	//#region Error Message Functions
	self.sessionErrorMessage = function (str, isError) {
		$("#sessionDialogError")
			.show()
			.attr('class', 'pull-left label').addClass(isError ? 'label-important' : 'label-success')
			.text(str);
	};
	//#endregion

	//#region Sync Functions
	self.sync = function (sessionInfo, $button) {
		if (!_canBeginSync()) return
		$.ajax("sessions.php", {
			type: "POST",
			data: {
				action: "new",
				sessname: sessionInfo.name,
				json: JSON.stringify(self.getMonsterDataBySession(sessionInfo.startTime)),
				sttime: sessionInfo.startTime,
				uptime: sessionInfo.lastUpdate
			}
		}).done(function (data) {
			data = $.parseJSON(data);
			self.sessionErrorMessage(data.msg, data.isError);

			if (data.isError && $button !== undefined) {
				$button.button('reset');
				$delButton.button('reset');
			}

			self.updateSyncedSessions();

		}).fail(function () {
			self.sessionErrorMessage("Error: Couldn't connect to cloud");

			if ($button !== undefined) {
				$button.button('reset');
				$delButton.button('reset');
			}

		}).always(function() {
			_endSync();
		});
	};

	self.unsync = function (sessionInfo, $button, $delButton) {
		if (!_canBeginSync()) return
		$.ajax("sessions.php", {
			type: "POST",
			data: {
				action: "del",
				sttime: sessionInfo.startTime
			}
		}).done(function (data) {
			data = $.parseJSON(data);
			self.sessionErrorMessage(data.msg, data.isError);

			if (data.isError && $button !== undefined) {
				$button.button('reset');
				$delButton.button('reset');
			}

			self.updateSyncedSessions();

		}).fail(function () {
			self.sessionErrorMessage("Error: Couldn't connect to cloud");

			if ($button !== undefined) {
				$button.button('reset');
				$delButton.button('reset');
			}

		}).always(function () {
			_endSync();

		});
	};
	//#endregion

	//#region Sessions Menu Button Functions
	self.syncSessionDeleteButton = function (e, button) {
		$("#sessionDialog").modal('hide');
		bootbox.confirm("Are you sure you want to delete this campaign? Not even a wish can bring this back once it's gone.", function (result) {
			if (!result) {
				$("#sessionDialog").modal('show');
				return;
			}
			var $button = $(button);
			$button.button('loading');
			$button.closest('tr').find('.btn-sync').button('loading');

			self.deleteSession(e.startTime);
			$("#sessionDialog").modal('show');
			self.sessionErrorMessage('Successfully deleted campaign', false);
		});
	}

	self.syncSessionSyncButton = function (sessionInfo, button) {
		var $button = $(button);
		$button.button('loading');
		$button.closest('tr').find('.status').addClass('italic').text('Syncing...');
		var $delButton = $button.closest('tr').find('.btn-danger');
		$delButton.button('loading');
		self.sync(sessionInfo, $button, $delButton);
	};

	self.syncSessionUnsyncButton = function (sessionInfo, button) {
		var $button = $(button);
		$button.button('loading');
		$button.closest('tr').find('.status').addClass('italic').text('Unsyncing...');
		var $delButton = $button.closest('tr').find('.btn-danger');
		$delButton.button('loading');
		self.unsync(sessionInfo, $button, $delButton);
	};

	self.updateSyncedSessions = function () {
		if (IS_RELOADING_SESSION) return;
		$.ajax("sessions.php", {
			type: "POST",
			data: {
				action: "get"
			}
		}).done(function (data) {
			self.syncedSessions($.parseJSON(data));
		}).fail(function () {
			self.sessionErrorMessage("Error: Couldn't connect to cloud", true);
		});
	};
	//#endregion
};

var sessionManager;

function initialiseSessionManager() {
	sessionManager = new SessionModel();
	ko.applyBindings(sessionManager, $("#currentSessionDialog")[0]);
	ko.applyBindings(sessionManager, $("#sessionDialog")[0]);
	sessionManager.mergeCloudSessionsToLocal();
	sessionManager.sessionManagement();
}

function sortByName(a, b) {
	var aName = a.name.toLowerCase();
	var bName = b.name.toLowerCase();
	return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
}

///#source 1 1 /monsters/js/sync.status.js

var ICON_READY = "icon-ok";
var ICON_REFRESH = "icon-refresh";
var ICON_DISCONNECTED = "icon-warning-sign";
var ICON_DEFAULT = "icon-cog";

var STATUS_OK = "ok";
var STATUS_SYNCING = "syncing";
var STATUS_DISCONNECTED = "disconnected";

function changeStatus(status) {
	switch (status) {
		case STATUS_OK: {
			updateStatusIcon(ICON_READY, "Ready");
			updateNavbarIcon(ICON_DEFAULT);
			return;
		}
		case STATUS_SYNCING: {
			updateStatusIcon(ICON_REFRESH, "Syncing...");
			updateNavbarIcon(ICON_REFRESH, true);
			return;
		}
		case STATUS_DISCONNECTED: {
			updateStatusIcon(ICON_DISCONNECTED, "No connection");
			updateNavbarIcon(ICON_DISCONNECTED);
			return;
		}
	}
}

function updateStatusIcon(iconClass, text) {
	$("#noChangeColor").attr('class', '').addClass(iconClass);
	$("#statusText").text(text);
}

function updateNavbarIcon(iconClass, shouldRotate) {
	$("#secondaryStatusIcon").attr('class', shouldRotate ? 'rotateMe' : '').addClass(iconClass);
}

function _canBeginSync() {
	if (IS_RELOADING_SESSION) return false;
	if (serverReachable()) {
		changeStatus(STATUS_SYNCING);
		return true;
	} else {
		changeStatus(STATUS_DISCONNECTED);
		return false;
	}
}

function _endSync() {
	changeStatus(STATUS_OK);
}
///#source 1 1 /monsters/js/ui.filters.js

function loadFilters() {
	if(!Data.hasVar("filters")) return;

	var filters = Data.getVar("filters");

	$.each(filters, function(i, e) {
		_addNewFilter(e);
	});
}

function addNewFilter() {
	var filterName = $("#filters").val();

	var newFilter = {name: filterName};

	//is joinable
	if(filterData[filterName] instanceof Array) {
		newFilter.value=$("#joinSelect").val();

	//is numeric
	} else if(filterData[filterName]){
		var num = $("#numberInput").val();
		if(num == 0) return;
		newFilter.value = $("#numberInput").val();
		newFilter.sign = $("#signChooser").val();

	//is name
	} else {
		newFilter.value=$("#autocompleteName").val();

	}

	if(_addNewFilter(newFilter)) 
		_trackFilter(newFilter, true);

}

function _addNewFilter(newFilter) {

	var filterName = newFilter.name;
	
	var cleanName = newFilter.name.split(' ').join('');

	var $filterDivContainer = $$(cleanName+"_filters");

	//we have one
	if($filterDivContainer.length) {

		var hasDuplicate = false;
		$("."+cleanName+"-filter").each(function() {
			if($(this).attr('data-sign') == newFilter.sign &&
			   $(this).attr('data-value') == newFilter.value) {
				$(this).animate({boxShadow: "0 0 15px #f00"}, 1000, function() {
					$(this).animate({boxShadow: "none"});
				});
				hasDuplicate = true;
				return;
			}
		});

		if(hasDuplicate) return false;

		var $filterSpan = $("<span/>", {
			text: getFilterText(newFilter)+" "
		}).attr('data-value',newFilter.value).attr('data-sign',newFilter.sign).addClass('badge').addClass('badge-info').addClass(cleanName+'-filter');
		var $removal = $("<sup/>", {
			text: "[x]"
		}).addClass('filter-remover');

		$filterSpan.appendTo($filterDivContainer);
		$removal.appendTo($filterSpan);

	//there are none in the DOM already
	} else {
		var $newTr = $("<tr/>", {}).attr('data-attr', newFilter.name);
		var $labelTd = $("<td/>", {});
		var $label = $("<span/>", {
			text: newFilter.name
		}).addClass('label filter-label');

		$newTr.appendTo("#filterTable");
		$labelTd.appendTo($newTr);
		$label.appendTo($labelTd);

		var $filterTd = $("<td/>", {});
		var $filterDiv = $("<div/>", {
			id: cleanName+"_filters"
		}).attr('data-attr', newFilter.name).addClass('inner-filter-container');
		var $filterSpan = $("<span/>", {
			text: getFilterText(newFilter)+" "
		}).attr('data-value',newFilter.value).attr('data-sign',newFilter.sign).addClass('badge badge-info '+cleanName+"-filter");
		var $removal = $("<sup/>", {
			text: "[x]"
		}).addClass('filter-remover');

		$filterTd.appendTo($newTr);
		$filterDiv.appendTo($filterTd);
		$filterSpan.appendTo($filterDiv);
		$removal.appendTo($filterSpan);
	}

	makeSpansRemovable();

	return true;
}

function _trackFilter(filter, add) {
	if(!Data.hasVar("filters")) {
		Data.setVar("filters",[]);
	}

	var filters = Data.getVar("filters");
	var filtFound = false;

	$.each(filters, function(i, e) {
		if(!e) return;
		if( filter.name == e.name &&
			filter.sign == e.sign &&
			filter.value == e.value) {
			if(!add) 
				filters.splice(i,1);
			else
				filtFound = true;
		}
	});

	if(!filtFound && add)
		filters.push(filter);

	Data.setVar("filters", filters);
}

function makeSpansRemovable() {
	$(".filter-remover").click(function() {
		$(this).parent().fadeOut(function() {
			var siblingsLeft = $(this).siblings().size();
			if(siblingsLeft == 0) {
				$(this).closest("tr").remove();
			}
			_trackFilter({
				name: $(this).closest("[data-attr]").attr('data-attr'), 
				value: $(this).closest("[data-value]").attr('data-value'),
				sign: $(this).closest("[data-sign]").attr('data-sign')
			}, false);
			$(this).remove();
		});
	});
}

function getFilterText(obj) {
	if(obj.hasOwnProperty('sign')) {
		return obj.sign + obj.value;
	} 
	return obj.value;
}

function initializeAutocomplete() {
	$("#autocompleteName").autocomplete( {
		source: autocompleteList,
		minLength: 2,
		select: function(event, ui) {
			$("#autocompleteName").val(ui.item.label);
			addNewFilter();
			$("#autocompleteName").val('');
			return false;
		}
	});
}

function initializeFilterSelect() {
	for(var o in filterData) {
		$("#filters").append("<option value='"+o+"'>"+o+"</option>");
	}

	$("#filters").change(function() {

		$(".joinOpt, .numericOpt, .nameOpt").hide();
		$("#numberInput, #autocompleteName").val('');
		$("#joinSelect").empty();

		//is joinable
		if(filterData[$(this).val()] instanceof Array) {
			$(".joinOpt").fadeIn();

			var arr = filterData[$(this).val()];
			for(var o in arr) {
				$("#joinSelect").append("<option value='"+arr[o]+"'>"+arr[o]+"</option>");
			}

		//is numeric
		} else if(filterData[$(this).val()]){
			$(".numericOpt").fadeIn();

		//is name
		} else {
			$(".nameOpt").fadeIn();
		}
	});
}
///#source 1 1 /monsters/js/ui.general.js

var defaultPopupSize = 500;
var extendPopupSize = 1200;

var height = 360;
var heightAdjust = 140;
var width;
var pnotification;
var MIN_X_RES = 1356;
var MIN_Y_RES = 662;

var resizeTimer;

function setupRoller() {
	$("#roll").keyup(function (e) {
		if (e.keyCode == 27) {
			$("#roll").val('');
		}
		if (e.which != 13) return;
		e.preventDefault();
		var toRoll = $(this).val();
		var roll = rollExpression(toRoll);
		if (roll === 0) return;
		addToLog("Custom roll: " + toRoll + " rolled " + roll + ".", "customRoll");
	});

	$("#dice button").click(function () {
		var val = $("#roll").val() == '' ? "1" + $(this).text() : "+1" + $(this).text();
		$("#roll").val($("#roll").val() + val);
	});
}

function setupRollables($parent) {
	var uid = $parent.find("[data-uid]").attr('data-uid');

	$parent.find(".rollable").each(function () {

		var $set = $(this).find("tr:not(.unrollable)");
		$set.each(function () {
			if ($(this).find('td.unrollable').size() > 0) return;
			$(this).click(function () {
				$set.removeClass('info');
				if ($(this).hasClass('info'))
					$(this).removeClass('info');
				else
					$(this).addClass('info');
			});
		});

		var $roller = $("<i/>").addClass('icon-share-alt');
		$roller.click(function () {
			var $rollable = $(this).parent().find('.info');
			if ($rollable.length === 0) {
				bootbox.alert("Please select a feature to roll.");
				return;
			}

			attack($rollable, $(this), uid);
		});
		$(this).append($roller);
	});

}

function setupGrids(uid) {
	$("div[data-for='" + uid + "'] .sortable").sortable({
		stop: function (e, u) {
			setupGrids(uid);
		}
	});
	$("div[data-for='" + uid + "'].sortable").disableSelection();

	$("div[data-for='" + uid + "'] .draggable").find(".minibox-content").each(function () {
		$(this).height($(this).parent().height() - 22);
		var nice = $(this).niceScroll({ horizrailenabled: false, zindex: 9 });
		$$(nice.id).attr('data-nice-uid', uid);
		$$(nice.id + "-hr").remove();
	});
}

function _hideAllMiniboxScrollbars() {
	$("div[data-nice-uid]").hide();
}

function tabChangeScrollbars($a) {
	$a.on('show', function (e) {
		_hideAllMiniboxScrollbars();

		var uid = $(this).attr('data-uid');

		$("#curMon > div[data-for='" + uid + "']").show().siblings().hide();

		//hide the popup if it's visible
		_hidePopup();

		$("[data-nice-uid='" + uid + "']").show();

		setupGrids(uid);
	});
}

function timedResizeElements() {
	clearTimeout(resizeTimer);
	resizeTimer = setTimeout(resizeElements, 100);
}

function handleResizing() {
	$(window).resize(timedResizeElements);
	resizeElements();
}

function resizeElements() {
	height = $(window).height();
	width = $(window).width();

	$("#log").css('height', height - 80 - heightAdjust + 'px');
	$("#monsterListCont").css('height', height - 50 - heightAdjust + 'px');
	$("#monsterList").css('height', height - 50 - heightAdjust + 'px');

	$(".tab-content").css('height', $("#log").height() - 38);

	$("#log .tab-pane > div").css('height', $("#log").height() - 38);

	$("#monstersContainer > .row-fluid").first().css('height', $("#monsterListCont").height());

	changeLogEntrySize();

	resolutionNotification();
}

function resolutionNotification() {

	if (width < MIN_X_RES || height < MIN_Y_RES) {
		if (pnotification) {
			pnotification.pnotify({ text: screenResolutionMessage() });
		} else
			pnotification = $.pnotify({
				title: "Screen Resolution Problem Detected",
				text: screenResolutionMessage(),
				type: "info",
				width: "70%",
				addclass: "stack-bar-bottom",
				cornerclass: "",
				sticker: true,
				hide: false,
				stack: { addpos2: 0, animation: true, dir1: "up", dir2: "right", firstpos1: 0, firstpos2: 0, nextpos1: 0, nextpos2: 0, spacing1: 0, spacing2: 0 }
			});
	} else {
		if (pnotification) {
			pnotification.pnotify_remove();
			pnotification = null;
		}
	}
}

function screenResolutionMessage() {
	return "Hey, so it looks like your screen is currently running at "+width+"x"+height+", which is fine, but it might cause a problem while using this application! We recommend at least a resolution of "+MIN_X_RES+"x"+MIN_Y_RES+" (or 1366x768). If this notification is in error, please contact a member of the team and we'll sort out the issue. Thanks!";
}

function overlayLoadingGif() {
	$t = $("#monsterListCont");
	if (!$t.length) return;

	$("#overlay").css({
		opacity: 0.8,
		top: $t.offset().top,
		left: $t.offset().left,
		width: $t.outerWidth(),
		height: $t.outerHeight()
	});

	$("#img-load").css({
		top: ($t.height() / 2),
		left: ($t.width() / 2)
	});
}

ko.bindingHandlers.bootstrapTooltip = {
	init: function (element, valueAccessor, allBindingAccessor, viewModel) {
		var options = ko.utils.unwrapObservable(valueAccessor());
		var defaultOptions = {};
		options = $.extend(true, {}, defaultOptions, options);
		$(element).tooltip(options);

		$(element).click(function () {

			var $me = $(this);
			var doShow = true;

			$(".in").each(function () {
				if ($(this).siblings("a").is($me)) {
					doShow = false;
				}
				$(this).siblings("a").tooltip('hide');

			});
			if (doShow)
				$(this).tooltip('show');
		});
	}
};
///#source 1 1 /monsters/js/ui.generator.js

function initializePopupToggler() {
	//toggle the sizes between the two popup possibilities
	$("#medianArrowContainer").click(_togglePopupInsides);
}

function _togglePopupInsides() {
	if ($("#extra").is(":visible")) {
		$("#popup").animate({ width: defaultPopupSize });
		$("#popupLeft").animate({ width: defaultPopupSize });
		$("#extra").animate({ width: 0 }, function () {
			$("#extra").css('display', 'none');
			$("#extraToggle").attr('class', 'icon-arrow-right');
			$("#medianArrowContainer").attr('title', 'More options');
		});
	} else {
		$("#popup").animate({ width: extendPopupSize }, function () {
			$("#popupLeft").animate({ width: defaultPopupSize });
			$("#extra").css('display', 'block');
			$("#extra").animate({ width: extendPopupSize - defaultPopupSize });
			$("#extraToggle").attr('class', 'icon-arrow-left');
			$("#medianArrowContainer").attr('title', 'Less options');
		});
	}
}

function initializeArrowToggler() {
	//change the arrow from up to down
	$("#showFilters").click(_togglePopup);
}

function _togglePopup() {
	$("#popup").slideToggle(400, function () {
		if ($(this).is(":visible")) {
			$("#filterIcon").attr('class', 'icon-arrow-up');
			$("#popup").attr('display', 'inline-block');
			$("#filterContainer").niceScroll({ zindex: 14 });
			$("#filterContainer").css('overflow', 'hidden');
		} else {
			$("#filterIcon").attr('class', 'icon-arrow-down');
		}
	});
}

function _hidePopup() {
	$("#popup").slideUp(400, function () {
		$("#filterIcon").attr('class', 'icon-arrow-down');
	})
}

function setupGenButton() {
	$("#seeMoreButton").button('loading');
	$("#finalAddButton").button('loading');

	$("#finalAddButton").click(function () {
		_addAllSuggestedMonsters($(this));
	});

	$("#seeMoreButton").click(function () {
		_seeMoreButtonFunctionality($(this))
	});
	$("#genButton").click(function () {
		_genButtonFunctionality($(this))
	});
}

function _addAllSuggestedMonsters($button) {
	$button.button('generating');
	setTimeout(function () { $button.attr('disabled', 'disabled').addClass('disabled') }, 10);

	$("#overlay").fadeIn();
	$("#advGenFinalContainer tr").each(function () {
		var monster = $(this).data('monster');
		var count = parseInt($(this).children(":nth-child(2)").text());
		_hidePopup();

		setTimeout(function () {
			for (var i = 0; i < count; i++) {
				setTimeout(function () { addNewMonster(monster); }, 100);
			}
		}, 500);
	});
	$("#overlay").fadeOut();

	setTimeout(function () { $button.removeAttr('disabled').removeClass('disabled') }, 10);
	$button.button('reset');
}

function _seeMoreButtonFunctionality($button) {

	$button.button('generating');
	setTimeout(function () { $button.attr('disabled', 'disabled').addClass('disabled') }, 10);

	var ct = 0;

	var advObj = { orgs: [], singles: [] };
	var singlesCt = [];

	$("#advGenMonsters input[type='checkbox']").each(function () {
		if ($(this).is(":checked")) {
			var $tr = $(this).closest("tr");
			var baseCt = $tr.find(".only-positive").val() || null;
			var orgGen = $tr.find("select").val();

			if ((baseCt != null && baseCt != '0') || orgGen != "null")
				ct++;

			if (baseCt != null && baseCt != '0') {
				singlesCt[$tr.attr('data-monster-name')] = baseCt;
				advObj.singles.push($tr.attr('data-monster-id'));
			}
			if (orgGen != "null") {
				advObj.orgs.push(orgGen);
			}
		}
	});

	if (ct == 0) {
		setTimeout(function () { $button.removeAttr('disabled').removeClass('disabled') }, 10);
		$button.button('reset');
		bootbox.alert("Please select some monsters to create.");
		return;
	}

	$.post('ajax.php', { action: "gen", orgs: JSON.stringify(advObj) }, function (monsters) {
		try {
			_parseSuggestedMonsters($.parseJSON(monsters), singlesCt);
		} catch (e) {
			console.error("an issue parsing suggested monsters has occurred: monsters<" + monsters + "> orgs<" + advObj + ">");
		}
		$("#finalAddButton").button('reset');

	}).always(function () {
		setTimeout(function () { $button.removeAttr('disabled').removeClass('disabled') }, 10);
		$button.button('reset');
	});
}

function _parseSuggestedMonsters(monsters, singlesCt) {

	var $container = $("#advGenFinalContainer");
	var $monsters = $("#advGenFinal");
	$container.children().not("#advGenFinal").remove();
	$monsters.empty();

	if (Object.keys(singlesCt).length) {
		$monsters.show();
		$monsters.append("<caption>Monsters</caption>");
	} else
		$monsters.hide();

	$.each(monsters, function (i, e) {
		if (e.hasOwnProperty("name")) {
			var $table = $("<table/>").addClass('table table-condensed table-striped').css('position', 'relative').appendTo($container);
			$table.append("<caption>" + e.name + "</caption>");
			$.each(e.monsters, function (i, e) {
				var $tr = $("<tr/>").appendTo($table);
				$tr.attr('data-gen-min', e.minimum).attr('data-gen-max', e.maximum);
				$tr.append("<td>" + e.monster.data[0].name + "</td><td class='rightalign'></td>");
				$tr.data('monster', e.monster);
			});

			var $roller = $("<i/>").addClass('icon-share-alt').appendTo($table);
			$roller.click(function () {
				_rerollTable($table);
			});
			_rerollTable($table);

		} else {
			var $tr = $("<tr/>");
			var monName = e.data[0].name;
			var monCt = singlesCt[monName];
			$tr.append("<td>" + monName + "</td><td class='rightalign'>" + monCt + "</td>").appendTo($monsters);
			$tr.attr('data-gen-min', monCt).attr('data-gen-max', monCt);
			$tr.data('monster', e);
		}
	});
	$("#advGenFinalContainer").niceScroll({ zindex: 14, horizrailenabled: false });
	$('#advGenFinalContainer').css('overflow', 'hidden');
}

function _rerollTable($table) {
	$table.find("tr").each(function () {
		var max = parseInt($(this).attr('data-gen-max'));
		var min = parseInt($(this).attr('data-gen-min'));
		var num = Math.floor(Math.random() * (max - min + 1)) + min;
		$(this).children(":nth-child(2)").text(num);
	});
}

function _genButtonFunctionality($button) {

	$button.button('loading');

	//build filters
	var filterObj = {};
	$(".inner-filter-container").each(function () {
		var attr = $(this).attr('data-attr');
		filterObj[attr] = [];
		_gaq.push(['_trackEvent', 'Filter', attr]);
		$(this).children(".badge").each(function () {
			filterObj[attr].push({ sign: $(this).attr('data-sign'), value: $(this).attr('data-value') });
		});
	});

	var advMode = $("#extra").is(":visible");

	//POST filters
	$.post('ajax.php', { action: "gen", data: JSON.stringify(filterObj), adv: advMode }, function (monster) {
		$button.button('reset');
		if (monster === '') {
			bootbox.alert("No results were found with your filters. Try broadening your search.");
			return;
		}
		if (!advMode) {
			monster = $.parseJSON(monster);
			var uid = addNewMonster(monster);
			setupGrids(uid);
			return;
		}
		$("#advGenMonsters").empty();
		$.each($.parseJSON(monster), function (i, e) {
			addNewSuggestedRow(i, e);
		});
		$(".only-positive").change(function () {
			var val = parseInt($(this).val());
			if (val < 0) val = 0;
			$(this).val(val);
		});
		$("tr[data-monster-name] select, tr[data-monster-name] .only-positive").change(function () {
			$(this).closest("tr").find("input[type='checkbox']").prop('checked', true);
		});
		$("#seeMoreButton").button('reset');
	});
}

function addNewSuggestedRow(monster, data) {
	var template = $("#advGenTemplate").html();
	$("#advGenMonsters").append("<tr data-monster-name='" + monster + "' data-monster-id='" + data.id + "'><td>" + template + "</td></tr>");
	_makeSelect(monster, data.orgs);
	$("[data-monster-name='" + monster + "'] .monsterName").attr('title', monster).text(monster).tooltip({ delay: 500 });
	$("#advGenContainer").niceScroll({ zindex: 14, horizrailenabled: false });
	$('#advGenContainer').css('overflow', 'hidden');
}

function _makeSelect(monster, data) {
	var $select = $("[data-monster-name='" + monster + "'] select");
	$.each(data, function (i, e) {
		if (e.organization.indexOf(monster) != -1) e.organization = e.organization.substring(monster.length + 1);
		$select.append("<option value='" + e.id + "'>" + e.organization + "</option>");
	});
	$select.append("<option value='null' selected>No Org.</option>");
}

///#source 1 1 /monsters/js/ui.log.js

var logTimer;
var newLogEntryWidth;

function addToLog(string, selector, uid, atkUid) {

	//bleh, damned inability to append the same element in two places..
	var divString = "<div class='logInner'><div class='attackSide'><p class='pull-left "+selector+"' data-uid='"+uid+"'>"+
		string+"</p></div><div class='pull-right threat-status "+
		selector+"'></div>"+
		(atkUid ? "<br><button class='btn btn-link pull-right' data-cleave-uid='"+atkUid+"'>Cleave?</button>" :"")+
		"<div class='clearfix'></div></div>";

	$("#allInfo").append(divString);
	$$(uid+"_log").append(divString);

	$("#log").find('a').tooltip({html: true});

	clearTimeout(logTimer);
	logTimer = setTimeout( function() {
		$("#allInfo").animate( {scrollTop: $("#allInfo")[0].scrollHeight }, 50);
		$("#curMon").animate( {scrollTop: $("#curMon")[0].scrollHeight }, 50);
	}, 100);

	$("#log .tab-pane > div").niceScroll({horizrailenabled: false});
	$("#log .tab-pane > div").css('overflow','hidden');

	$(".attackSide").width(newLogEntryWidth);

}

function changeLogEntrySize() {
	newLogEntryWidth = $("#allInfo").width()-70;
}

var logMessages = {
	skill: function(ent, att, text, num) {
		return ent + " rolled <a rel='tooltip' href='#' title='"+text+"'>"+num+"</a> on its \""+att+"\" check."
	},

	hit: function(ent, att, text, num) {
		return ent + " hits with \""+att+"\" for <a rel='tooltip' href='#' title='"+text+"'>"+num+"</a> damage."
	},

	initiate: function(ent, att, text, num) {
		return ent + " attacked with \""+att+"\" rolling <a rel='tooltip' href='#' title='"+text+"'>"+num+"</a>."
	},

	critAttempt: function(ent, att, text, num) {
		return ent + " attempted to crit using \""+att+"\" for <a rel='tooltip' href='#' title='"+text+"'>"+num+"</a>."
	},

	critSecond: function(ent, att, text, num) {
		return ent + " rolls critical confirm using \""+att+"\" for <a rel='tooltip' href='#' title='"+text+"'>"+num+"</a>."
	},

	critMiss: function(ent, att, text, num) {
		return ">> If "+ent+" fails the critical, the damage is <a rel='tooltip' href='#' title='"+text+"'>"+num+"</a>."
	},

	critSuccess: function(ent, att, text, num) {
		return ">> If "+ent+" confirms the critical, the damage is <a rel='tooltip' href='#' title='"+text+"'>"+num+"</a>."
	}
};
