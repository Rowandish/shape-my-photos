<?php
define('SHARE_TAB',"
<div id='fb-root'></div>
<div id= 'socialTag'>
		<div id='social'>
			<!--button-->
			<div class='fb-like' data-href='https://www.facebook.com/pages/Shape-Your-Life/145019995707312' data-width='450' data-layout='button_count' data-show-faces='false' data-send='true'></div>
			

			<!--Twitter like button-->
			<a href='https://twitter.com/share' class='twitter-share-button' data-related='jasoncosta' data-lang='en' data-size='small' data-count='none'>Tweet</a>
			<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src='https://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document,'script','twitter-wjs');</script>
			
			<!--google+ like button-->
			<g:plusone size='medium' annotation='none'></g:plusone>
			<script type='text/javascript'>
				window.___gcfg = {
				lang: 'en-US'};

			(function() {
			var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
			po.src = 'https://apis.google.com/js/plusone.js';
			var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
			})();
			</script>

			<!--Pinterest like button-->
			<a href=\"//www.pinterest.com/pin/create/button/\" data-pin-do=\"buttonBookmark\" ><img src=\"//assets.pinterest.com/images/pidgets/pin_it_button.png\" /></a>
			<script type=\"text/javascript\">
			(function(d){
			  var f = d.getElementsByTagName('SCRIPT')[0], p = d.createElement('SCRIPT');
			  p.type = 'text/javascript';
			  p.async = true;
			  p.src = '//assets.pinterest.com/js/pinit.js';
			  f.parentNode.insertBefore(p, f);
			}(document));
			</script>

		</div>
		<div class='gradientLine'></div>
</div>");

define('GOOGLE_ANALYTICS', "<script type='text/javascript'>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-43893010-1', 'shapeyourlife.herokuapp.com');
  ga('send', 'pageview');

</script>");
define ("SOCIAL_METAS", "
	<meta property=\"og:site_name\" content=\"Shape Your Life\" />
	<meta property=\"fb:app_id\" content=\"".getenv('FACEBOOK_APP_ID')."\"/>
	<meta itemprop=\"name\" content=\"Shape Your Life\" />
	<meta itemprop=\"description\" content=\"Free software to create compositions with your Facebook pictures and share them with your friends\"/>
	<meta property=\"og:image\" content=\"https://shapeyourlife.herokuapp.com/images/logo.png\" />
	<meta property=\"og:title\" content=\"Shape Your Life - Shape your facebook photos to create awesome compositions!\" />
	<meta property=\"og:description\" content=\"Free software to create compositions with your Facebook pictures and share them with your friends\" />
	<meta property=\"og:type\" content=\"website\" />
	<meta property=\"og:url\" content=\"https://apps.facebook.com/shapeyourlife/\"/>");


?>