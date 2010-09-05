/**
 * jQuery Preloader v0.1 - http://rd.uniba.jp/
 * 
 * Copyright 2010, Uniba Inc.
 * Released under the BSD License.
 * 
 * ==== sample ====
 *
 *	<!doctype html>
 *	<html>
 *	<head>
 *		<title>jQuery Preloader sample</title>
 *		<script src="jquery.preloader.js"></script>
 *		<script>
 *			jQuery(function($)
 *			{
 *				// $(window).bind() style event dispatching
 *				$(window)
 *					.bind('preloadstart', function() { console.log('preloadstart'); })
 *					.bind('preloadready', function() { console.log('preloadready'); })
 *					.bind('preloadprogress', function() { console.log('preloadprogress'); })
 *					.bind('preloadcomplete', function() { console.log('preloadcomplete'); })
 *				;
 *
 *				// initObject style event dispatching
 *				$('#preloaderTarget').preloader({
 *					onPreloadStart: function(event, data)
 *					{
 *						alert('start');
 *					},
 *					atPreloadReady: function(event, data)
 *					{
 *						console.log('number of preload target is ' + data.total);
 *					},
 *					atPreloadProgress: function(event, data)
 *					{
 *						console.log('loading... ' + data.current + ' of ' + data.total);
 *					},
 *					onPreloadComplete: function(event, data)
 *					{
 *						alert('complete');
 *					},
 *				});
 *			});
 *		</script>
 *	</head>
 *	<body>
 *		<div id="preloaderTarget">
 *			<!-- sample image taken from IE9 test drive page - http://ie.microsoft.com/testdrive/HTML5/87DOMContent-Loaded/Default.html -->
 *			<img src="http://ie.microsoft.com/testdrive/HTML5/87DOMContent-Loaded/whidbey.jpg" />
 *			<img src="http://ie.microsoft.com/testdrive/HTML5/87DOMContent-Loaded/window.jpg" />
 *			<img src="http://ie.microsoft.com/testdrive/HTML5/87DOMContent-Loaded/whidbey2.jpg" />
 *		</div>
 *	</body>
 *	</html>
 *
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
