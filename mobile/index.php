<?php
require_once('../AppInfo.php');

if (isset($_GET["photos"])) {
	if (preg_match("/$[0-9]+r[0-9]+/", $_GET["photos"]) === false) {
		require_once("./404.html");
		exit();
	}
	header("location: https://shapeyourlife.herokuapp.com/mobile/photos".$_GET["photos"]);
	exit();
}

require_once(_SHAPE_YOUR_LIFE_DEFAULT_PATH.'/php/language.php');
require_once(_SHAPE_YOUR_LIFE_DEFAULT_PATH.'/php/share.php');
require_once(_SHAPE_YOUR_LIFE_DEFAULT_PATH.'/php/minify.php');
require_once(_SHAPE_YOUR_LIFE_DEFAULT_PATH.'/php/Utility/mdetect.php');

$user_agent = new uagent_info();

shape_lang::init();
header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-type" content="text/html; charset=utf-8"/>
		<title>Shape Your Life</title>
		<script type="text/javascript">
			if (window.location.href.indexOf("#") !== -1)
				window.location.href=window.location.href.split("#")[0];
		</script>
		<?php
			if ($user_agent->DetectIos()) {
			?>
		<meta name="viewport" content="initial-scale=1, maximum-scale=1">
<?php
			} else {
			?>
		<script type="text/javascript">
		    var scale = 1 / window.devicePixelRatio;
		    var viewportTag = "<meta id=\"meta1\" name=\"viewport\" content=\"width=device-width, height=device-height, initial-scale=" + scale + ", maximum-scale=1, user-scalable=no\"/>";        
		    document.write(viewportTag);        
		</script>

		<?php
			}
			echo SOCIAL_METAS;
		?>
		<link rel="stylesheet" href="//code.jquery.com/mobile/1.3.2/jquery.mobile-1.3.2.min.css" type="text/css" media="screen" title="jquery" />
		<link href="photoswipe.css" type="text/css" rel="stylesheet" />
		<link href="style.css" type="text/css" rel="stylesheet" />
		<link href="../css/jsquares.css" type="text/css" rel="stylesheet" />
		<link rel="icon" href="https://shapeyourlife.herokuapp.com/favicon.ico" />
		
		<script type="text/javascript">
			var shape_lang = {
				"title_share"			: '<?php shape_lang::expr("title_share", true); ?>',
				"description_share"		: '<?php shape_lang::expr("description_share", true); ?>',
				"share_ok"				: '<?php shape_lang::expr("share_ok", true); ?>',
				"go_app"				: '<?php shape_lang::expr("go_app", true); ?>',
				"share_img_src"			: '<?php shape_lang::expr("share_img_src", true); ?>',
				"link_img_src"			: '<?php shape_lang::expr("link_img_src", true); ?>',
				"loading_app"			: '<?php shape_lang::expr("loading_app", true); ?>',
				"loading_shape"			: '<?php shape_lang::expr("loading_shape", true); ?>',
				"loading"				: '<?php shape_lang::expr("loading", true); ?>',
				"error_msg"				: '<?php shape_lang::expr("error_msg", true); ?>',
				"change_to_text2"		: '<?php shape_lang::expr("change_to_text2", true); ?>',
				"no_album"				: '<?php shape_lang::expr("no_album", true); ?>',
				"loading_album"			: '<?php shape_lang::expr("loading_album", true); ?>',
				"error_letter"			: '<?php shape_lang::expr("error_letter", true); ?>',
				"session_expired"		: '<?php shape_lang::expr("session_expired", true); ?>',
				"share_it"				: '<?php shape_lang::expr("share_it", true); ?>'
			};
		</script>
		<script type="text/javascript" src="js/klass.min.js" charset="utf-8"></script>
		<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js" charset="utf-8"></script>
		<!--<script type="text/javascript" src="../js/jQueryRotateCompressed.js" charset="utf-8"></script>-->
		<script type="text/javascript" charset="utf-8">
			<?php
				if (file_exists("/tmp/js_min_mobile.js"))
					echo "//cached...\n".file_get_contents("/tmp/js_min_mobile.js");
				else
				{
					$scripts = "";
					$scripts .= file_get_contents(_SHAPE_YOUR_LIFE_DEFAULT_PATH."/js/jquery.animate.js");
					$scripts .= file_get_contents(_SHAPE_YOUR_LIFE_DEFAULT_PATH."/js/FacebookUser.class.js");
					$scripts .= file_get_contents(_SHAPE_YOUR_LIFE_DEFAULT_PATH."/js/imageDisposer.class.js");
					$scripts .= file_get_contents(_SHAPE_YOUR_LIFE_DEFAULT_PATH."/js/System.class.js");
					$scripts .= file_get_contents(_SHAPE_YOUR_LIFE_DEFAULT_PATH."/js/Shape.class.js");
					$scripts .= file_get_contents(_SHAPE_YOUR_LIFE_DEFAULT_PATH."/js/shape.lib.js");
					$scripts .= file_get_contents(_SHAPE_YOUR_LIFE_DEFAULT_PATH."/mobile/js/config.js");
					$scripts .= file_get_contents(_SHAPE_YOUR_LIFE_DEFAULT_PATH."/mobile/js/utils.js");
					$scripts .= file_get_contents(_SHAPE_YOUR_LIFE_DEFAULT_PATH."/mobile/js/init.js");
					$minified = JSMin::minify($scripts);
					file_put_contents("/tmp/js_min_mobile.js", $minified);
					echo $minified;
				}
			?>
		</script>
		<script type="text/javascript" src="js/code.photoswipe.jquery-3.0.5.min.js" charset="utf-8"></script>
		<script type="text/javascript" src="//code.jquery.com/mobile/1.3.2/jquery.mobile-1.3.2.min.js" charset="utf-8"></script>
		<script type="text/javascript" src="js/fastClick.js" charset="utf-8"></script>
	</head>
<?php
	flush();
?>
	<body>
			<div data-role="page" id="loading">
				<div data-role="content" id="loadContent" style="background: none">
					<div class="loadingShape">
						<div>
							<!--<p>Create great compositions! Click to start!</p>-->
							<img id="tutorial" style="width:100%" alt="try it!" src="data:image/gif;base64,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" />
						</div>
					</div>
				</div>
			</div>
			<div data-role="page" id="albums">
				<div data-role="header" data-position="fixed">
					<h1><?php shape_lang::expr("album_select", true); ?></h1>
					<a href="#shape" data-icon="back" data-role="button"><?php shape_lang::expr("back", true); ?></a>
					<a href="#shape" id="select_done" data-icon="check" data-role="button"><?php shape_lang::expr("confirm", true); ?></a>
				</div>
				<div data-role="content" style="overflow: visible">
					<ul id="album_list" class="gallery"></ul>
				</div>
			</div>
			<div data-role="page" id="photos">
				<div data-role="header" data-position="fixed">
					<h1><?php shape_lang::expr("change_image_dialog", true); ?></h1>
					<a href="#shape" data-icon="back" data-role="button"><?php shape_lang::expr("back", true); ?></a>
				</div>
				<div data-role="content" style="overflow: visible">
					<ul id="photo_list" class="gallery"></ul>
				</div>
			</div>
			<div data-role="page" id="shape" style="background: none;">
				<div data-role="header">
	     			<a href="#menu" data-role="button" data-icon="grid" data-iconpos="notext" data-mini="true" data-inline="true">Nav</a>
					<h1>Shape Your Life</h1>
	     			<a href="#shape" id="edit_images" data-role="button" data-icon="edit" data-iconpos="notext" data-mini="true" data-inline="true">Nav</a>
				</div>
				<div data-role="content" id="shape_container">
				</div>
				<div data-role="panel" id="menu">
					<ul data-role="listview" data-inset="true">
						<li data-role="list-divider">Shape</li>
					    <li><a href="javascript:regenerateShape()"><?php shape_lang::expr("reload_shape", true); ?></a></li>
					    <li><a href="#albums"><?php shape_lang::expr("back_to_album2", true); ?></a></li>
					    <li><a href="#shape_list"><?php shape_lang::expr("change_to_default2", true); ?></a></li>
					    <li><a href="#inputText"><?php shape_lang::expr("change_to_text2", true); ?></a></li>
					    <li><a href="#draw_shape"><?php shape_lang::expr("draw_shape2", true); ?></a></li>
					    <li><a id="save_shape" href="#share"><?php shape_lang::expr("save_shape2", true); ?></a></li>
					    <li><a id="bkg_change" href="#color"><?php shape_lang::expr("change_bkg_color", true); ?></a></li>
			            <li><a id="logout" href="#">Logout</a></li>
						<li data-role="list-divider">Social</li>
						<li><a href="#share" id="fb_share" data-rel="dialog" data-transition="slidedown"><?php shape_lang::expr("share_comp", true); ?></a></li>
					</ul>
				</div><!-- /panel -->
			</div>
			<div data-role="dialog" id="color">	
				<div data-role="header" data-theme="d">
					<h1><?php shape_lang::expr("change_bkg_color", true); ?></h1>
				</div>
				<div data-role="content" data-theme="c">
					<label for="red"><?php shape_lang::expr("red", true); ?>:</label>
					<input type="range" id="red" name="red" value="255" min="0" max="255" />
					<label for="verde"><?php shape_lang::expr("green", true); ?>:</label>
					<input type="range" id="green" name="green" value="255" min="0" max="255" />
					<label for="blue"><?php shape_lang::expr("blue", true); ?>:</label>
					<input type="range" id="blue" name="blue" value="255" min="0" max="255" />
					<br/>
					<div id="color_mix" style="background-color: rgb(255, 255, 255)"></div>
					<br/>
					<a href="#shape" id="color_chosen" data-role="button" data-rel="back" data-theme="b"><?php shape_lang::expr("confirm", true); ?></a>       
				</div>
			</div>
			<div data-role="dialog" id="inputText">
				<div data-role="header" data-theme="d">
					<h1><?php shape_lang::expr("insert_text", true); ?></h1>
				</div>
				<div data-role="content" data-theme="c">
					<input type="text" maxlength="10" id="text_to_show" placeholder="<?php shape_lang::expr("change_to_text2", true); ?>" />
					<a href="#shape" id="text_change" data-role="button" data-rel="back" data-theme="b"><?php shape_lang::expr("confirm", true); ?></a>
				</div>
			</div>
			<div data-role="dialog" id="share">
				<div data-role="content" data-theme="a">
					<h3><?php shape_lang::expr("share_comp", true); ?></h3>
					<a href="dialog-success.html" data-role="button" data-rel="dialog" data-transition="slidedown" data-theme="b">Email</a>     
					<a href="dialog-success.html" data-role="button" data-rel="dialog" data-transition="slidedown" data-theme="b"><?php shape_lang::expr("share_fb", true); ?></a>      
					 		  
					<a href="#shape" data-role="button" data-rel="back" data-theme="a"><?php shape_lang::expr("cancel", true); ?></a>    
				</div>
			</div>
			<div data-role="page" id="shape_list">
				<div data-role="content" data-theme="a">
					<h3><?php shape_lang::expr("choose_shape", true); ?>:</h3>
					<div class="shapeIcon" data-type="rect"></div>
					<div class="shapeIcon" data-type="trirect"></div>
					<div class="shapeIcon" data-type="trirecti"></div>
					<div class="shapeIcon" data-type="tri"></div>
					<div class="shapeIcon" data-type="ell"></div>
					<div class="shapeIcon" data-type="hour"></div>
					<div class="shapeIcon" data-type="cross"></div>
					<div class="shapeIcon" data-type="heart"></div>
					<div class="shapeIcon" data-type="cover"></div>
					<div class="shapeIcon" data-type="star"></div>
					<div class="shapeIcon" data-type="smile"></div>
					<div class="shapeIcon" data-type="butter"></div>
				</div>
			</div>
			<div data-role="page" id="draw_shape">
				<div data-role="header">
					<a href="#shape" id="grid_confirm" data-icon="check" data-role="button"><?php shape_lang::expr("confirm", true); ?></a>
					<a href="#shape" data-icon="delete" data-role="button"><?php shape_lang::expr("cancel", true); ?></a>
					<h1><?php shape_lang::expr("draw_shape2", true); ?></h1>
				</div>
				<div data-role="content">
					<table class="grid">
						<tr>
							<td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
						</tr>
						<tr>
							<td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
						</tr>
						<tr>
							<td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
						</tr>
						<tr>
							<td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
						</tr>
						<tr>
							<td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
						</tr>
						<tr>
							<td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
						</tr>
						<tr>
							<td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
						</tr>
						<tr>
							<td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
						</tr>
						<tr>
							<td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
						</tr>
						<tr>
							<td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
						</tr>
						<tr>
							<td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
						</tr>
					</table>
				</div>
			</div>
	</body>
</html>