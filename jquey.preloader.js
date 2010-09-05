/**
 * jQuery Preloader v0.1 - http://rd.uniba.jp/
 * 
 * Copyright 2010, Uniba Inc.
 * Released under the BSD License. 
 */

(function($)
{
	if (!window.console) window.console = { log: function() { } };

	$.fn.preloader = function(initObject)
	{
		var imgList = [];
		var loaded = 0;
		
		var onPreloadStart = initObject.onPreloadStart || function(event, data) { console.log('start'); };
		var atPreloadReady = initObject.atPreloadReady || function(event, data) { console.log(['ready', data]); };
		var atPreloadProgress = initObject.atPreloadProgress || function(event, data) { console.log(['progress', data]); };
		var onPreloadComplete = initObject.onPreloadComplete || function(event, data) { console.log('complete'); };
		var $placeholder = $('<div>').css({ position: "absolute", top: -1, left: -1, width: 1, height: 1, overflow: "hidden" });

		var preload = function($target)
		{
			$(window)
				.bind('preloadstart', onPreloadStart)
				.bind('preloadready', atPreloadReady)
				.bind('preloadprogress', atPreloadProgress)
				.bind('preloadcomplete', onPreloadComplete)
			;
			$(window).trigger('preloadstart');
			
			$placeholder.appendTo('body');
			$target.find('img').each(function() { imgList.push($(this).attr('src')); });
			$(window).trigger('preloadready', [{ total: imgList.length }]);
			$.each(imgList, function(index, src)
			{
				$('<img>').load(loadCallback).attr('src', src).appendTo($placeholder);
			});
		};
		var loadCallback = function(event, data)
		{
			loaded++;
			$(window).trigger('preloadprogress', [{current: loaded, total: imgList.length}]);

			if (loaded >= imgList.length)
			{
				$placeholder.remove();
				$(window).trigger('preloadcomplete', []);
			}
		};

		preload(this);
	};
})(jQuery);
