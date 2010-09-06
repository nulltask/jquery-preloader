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
 *		<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script>
 *		<script src="jquery.preloader.js"></script>
 *		<script>
 *			jQuery(function($)
 *			{
 *				// bind() style event dispatching
 *				$('#preloaderTarget')
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
		var that = this;
		var elementList = [];
		var loaded = 0;
		var total = 0;
		var startTime = new Date() - 0;
		
		var onPreloadStart = initObject.onPreloadStart || function(event, data) { console.log('start'); };
		var atPreloadReady = initObject.atPreloadReady || function(event, data) { console.log(['ready', data]); };
		var atPreloadProgress = initObject.atPreloadProgress || function(event, data) { console.log(['progress', data]); };
		var onPreloadComplete = initObject.onPreloadComplete || function(event, data) { console.log('complete'); };
		var onElementInit = initObject.onElementInit || function(elem) { console.log('elementinit'); };
		var onElementLoad = initObject.onElementLoad || function(event, data) { console.log('elementload');  };
		var $placeholder = $('<div>').css({ position: "absolute", top: -1, left: -1, width: 1, height: 1, overflow: "hidden" });

		var preload = function()
		{
			$(that)
				.bind('preloadstart', onPreloadStart)
				.bind('preloadready', atPreloadReady)
				.bind('preloadprogress', atPreloadProgress)
				.bind('preloadcomplete', onPreloadComplete)
			;
			$(that).trigger('preloadstart');
			
			var $img = that.find('img');
			total = $img.length;
			$(that).trigger('preloadready', [{ total: total }]);
			$img.each(function()
			{
				onElementInit($(this));
				$(this)
					.load(loadCallback)
					.load(onElementLoad)
					.attr('src', $(this).attr('src'))
				;

			});
		};
		var loadCallback = function(event, data)
		{
			loaded++;
			$(that).trigger('preloadprogress', [{current: loaded, total: total, elapsed: new Date() - startTime}]);

			if (loaded >= total)
			{
				$(that).trigger('preloadcomplete', [{ total: total, elapsed: new Date() - startTime }]);
			}
		};

		preload();
	};
})(jQuery);
