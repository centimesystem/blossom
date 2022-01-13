/*
 * jQuery Highlight Plugin
 * Examples and documentation at: http://demo.webcodingstudio.com/highlight/
 * Copyright (c) 2010 E. Matsakov
 * Version: 1.06 (01-Jun-2016)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 * Requires: jQuery v1.2.6 or later
 */
(function($){
	$.fn.highlight = function(element_params){

		var defaults = {
			// show source code tab
			source: false,
			// show zebra
			zebra: false,
			//indents: "tabs" or "space"
			indent: 'tabs',
			//ordered or unordered list
			list: 'ol',
			//name of the tag attribute to add a special language highlighting
			attribute: 'lang'
		}

		var params = $.extend({}, defaults, element_params);

		return this.each(function(){
			var code_container = $(this);
			var code_class = $(code_container).attr('class');
			var code_lang = $(code_container).attr(params.attribute);
			var code_lang_class = '';
			if(code_lang!='') {
				code_lang_class = ' '+code_lang;
			}
			$(code_container).wrap('<div class="highlight'+code_lang_class+'"></div>');
			var highlight_container = $(code_container).parent();

			var source = code_container.html();
			source = source.replace(/</gm, '&lt;');

			//replace tabs with spaces
			if(params.indent=='space') {
				source = source.replace(/\t/g,'    ');
			}

			var code = source;
			switch(code_lang) {
				case 'html':
					code = $.highlightCode.hightlight_html(code);
					break;
				case 'css':
					code = $.highlightCode.hightlight_css(code);
					break;
				default:
					code = $.highlightCode.hightlight_JS(code);
					break;
			}

			code = code.replace(/(?:\r\n?|\n)$/, '');
			code = '<'+params.list+'><li>'+code.split(/\r\n|\n/).join('\n</li><li>')+'\n</li></'+params.list+'>';



			//replace instead of html, because of IE bug
			$(code_container).replaceWith('<pre class="'+code_class+'">'+code+'</pre>');

			//zebra
			if(params.zebra==true) {
				$(highlight_container).find('pre[class="'+code_class+'"] '+params.list+' li:even').addClass('even');
			}
		});
	};

	$.highlightCode = {

		//DEFAULT
		hightlight_JS: function(code) {

			var comments		= [];	// store comments
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects
			var gObjects ='ArrayBuffer SharedArrayBuffer Atomics DataView JSON Iterator '+
'ParallelArray StopIteration Promise Generator GeneratorFunction Map Set WeakMap WeakSet Array '+
'RegExp Number Math Date String Object Function Boolean Symbol Error EvalError InternalError '+
'RangeError ReferenceError SyntaxError TypeError URIError';
			gObjects = new RegExp(get_keywords(gObjects), 'gi');
// http://www.w3schools.com/js/js_reserved.asp
			keywords = 'abstract arguments boolean break byte case catch char class const '+
'continue debugger default delete do double else enum eval export extends false final finally '+
'float for function goto if implements import in instanceof int interface let long native new '+
'null package private protected public return short static super switch synchronized this throw '+
'throws transient true try typeof var void volatile while with yield';
			keywords = new RegExp(get_keywords(keywords), 'gi');

 	  		code = code
				//replace keywords
				.replace(keywords,'<span class="kwd">$1</span>$2')
				.replace(gObjects,'<span class="kwd">$1</span>$2')
				//replace keywords
				.replace(/(\{|\}|\]|\[|\|)/gi,'<span class="kwd">$1</span>')
				//replace strings
				.replace(/('.*?')/g,'<span class="str">$1</span>')
				//replace multiline comments
				.replace(/\/\*([\s\S]*?)\*\//g, function(m, t)
					{ return '\0C'+push(comments, multiline_comments(m))+'\0'; })
				.replace(/\0C(\d+)\0/g, function(m, i)
					{ return comments[i]; })
				//replace one line comments
				.replace(/\/\/(.*$)/gm,'<span class="com">//$1</span>')
				//replace functons
				.replace(/([a-z\_\$][a-z0-9_]*)\(/gi,'<span class="fnc">$1</span>(');

			return code;
		},






		//CSS
		hightlight_css: function(code) {

			var comments		= [];	// store comments

			var keywords =	'background-color background-image background-position ' +
				'background-repeat background border-collapse border-color border-spacing border-style border-top ' +
				'border-right border-bottom border-left border-top-color border-right-color border-bottom-color border-left-color ' +
				'border-top-style border-right-style border-bottom-style border-left-style border-top-width border-right-width ' +
				'border-bottom-width border-left-width border-width border color cursor direction display ' +
				'flex-direction flex-flow flex-wrap ' +
				'float font-size-adjust font-family font-size font-stretch font-style font-variant font-weight font ' +
				'height left letter-spacing line-height list-style-image list-style-position list-style-type list-style margin-top ' +
				'margin-right margin-bottom margin-left margin max-height max-width min-height min-width ' +
				'outline-color outline-style outline-width outline overflow padding-top padding-right padding-bottom padding-left padding position' +
				'quotes right size src table-layout text-align top text-decoration text-indent text-shadow text-transform ' +
				'vertical-align visibility white-space width word-spacing x-height z-index';

			var values =	'absolute all attr auto baseline behind below black blink block blue bold bolder '+
				'both bottom capitalize caption center center-left center-right circle close-quote collapse compact '+
				'continuous cursive dashed decimal default digits disc dotted double embed expanded fixed format '+
				'gray green groove help hidden hide high higher icon inline-table inline inset inside invert italic '+
				'justify large larger left-side left leftwards level line-through list-item '+
				'lowercase lower low ltr marker medium middle move none no-repeat normal nowrap oblique olive once outset '+
				'outside overline pointer print purple red relative repeat repeat-x repeat-y rgb right rtl screen scroll show silver slower slow '+
				'small small-caps small-caption smaller soft solid square s-resize static sub super '+
				'table-caption table-cell table-column table-column-group table-footer-group table-header-group table-row table-row-group '+
				'text-bottom text-top thick thin top transparent underline upper-alpha uppercase upper-latin '+
				'upper-roman url visible wait white wider w-resize x-fast x-high x-large x-low x-small x-soft yellow';

			var fonts =		'[mM]onospace [tT]ahoma [vV]erdana [aA]rial [hH]elvetica [sS]ans-serif [sS]erif [cC]ourier New mono sans serif';

			keywords = new RegExp(get_keywords(keywords), 'gi');
			values = new RegExp(get_keywords(values), 'gi');
			fonts = new RegExp(get_keywords(fonts), 'gi');

			code = code
				//replace comments
				.replace(/\/\*([\s\S]*?)\*\//g, function(m, t)
					{ return '\0C'+push(comments, multiline_comments(m))+'\0'; })
				.replace(/\0C(\d+)\0/g, function(m, i)
					{ return comments[i]; })
				//replace keywords
				.replace(keywords,'<span class="kwd">$1</span>$2')
				//replace values
				.replace(values,'<span class="pln">$1</span>$2')
				//replace fonts
				.replace(fonts,'<span class="str">$1</span>$2')
				//replace hex colors
				.replace(/(\#[a-fA-F0-9]{3,6})/gi,'<span class="lit">$1</span>')
				//replace sizes
				.replace(/(-?\d+)(\.\d+)?(px|em|pt|\:|\%|)/gi,'<span class="lit">$1$3</span>');
			return code;
		},

		//HTML
		hightlight_html: function(code) {

			code = code
				//replace attributes
				.replace(/\s+([a-zA-Z\-]{0,15})\=\"([-a-z0-9_ \/\.\#\:\=\;]{0,49})\"/gi,' <span class="atn">$1</span>=<span class="atv">"$2"</span>')
				//replace open tags
				.replace(/(&lt;)(\w{0,15})(\s+|&gt;|>)/gi,'$1<span class="tag">$2</span>$3')
				//replace close tags
				.replace(/(&lt;)\/(\w{0,15})(&gt;|>)/gi,'$1/<span class="tag">$2</span>$3')
				//replace doctype
				.replace(/(&lt;!)([-a-z0-9_ \/\.\#\:\"]{0,150})(&gt;|>)/gi,'<span class="dec">$1$2$3</span>')
				//replace comments
				.replace(/(&lt;|<)!--([\s\S]*?)--(&gt;|>)/gm,'<span class="com">$1!--$2--$3</span>');

			return code;
		},


	};

	/*
	* helpers
	*/

	//prepare regexp template for keywords
	function get_keywords(str)
	{
		return '(\\b' + str.replace(/ /g, '\\b|\\b') + '\\b)([^a-z0-9\$_])';
	}

	//process multiline comments
	function multiline_comments(text)
	{
		text	= text.split('\n');
		for(var i=0; i<text.length; i++) {
			text[i] = '<span class="com">'+text[i]+'</span>';
		}
		return text.join('\n');
	}

	//add element, return index
	function push(array, element)
	{
		array.push(element);
		return array.length-1;
	}

})(jQuery);
