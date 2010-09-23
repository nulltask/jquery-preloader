/**
 * jQuery Preloader v0.2pre - http://rd.uniba.jp/
 * 
 * Copyright 2010, Uniba Inc.
 * Released under the BSD License.
 *
 */

(function($)
{
	$.fn.preloader = function(initObject)
	{
		var that = this,
			loaded = 0,
			total = 0,
			startTime = new Date() - 0;
		
		var onPreloadStart = initObject.onPreloadStart || function(event, data) { },
			atPreloadReady = initObject.atPreloadReady || function(event, data) { },
			atPreloadProgress = initObject.atPreloadProgress || function(event, data) { },
			onPreloadComplete = initObject.onPreloadComplete || function(event, data) { };

		$(that)
			.bind('preloadstart', onPreloadStart)
			.bind('preloadready', atPreloadReady)
			.bind('preloadprogress', atPreloadProgress)
			.bind('preloadcomplete', onPreloadComplete)
		;
		
		$(that).trigger('preloadstart');
		
		var $img = that.find('img');
		total = $img.length;
		$(that).trigger('preloadready', [{ total: total, elements: $img }]);
		$img.each(function()
		{
			$(this)
				.load(loadCallback)
				.attr('src', $(this).attr('src'))
			;
		});

		function loadCallback(event, data)
		{
			loaded++;
			$(that).trigger('preloadprogress', [{ current: loaded, total: total, elapsed: new Date() - startTime, element: $(this), elements: $img }]);

			if (loaded >= total)
			{
				$(that).trigger('preloadcomplete', [{ total: total, elapsed: new Date() - startTime, elements: $img, element: $(this) }]);
			}
		};
	};
})(jQuery);
