<?php
/**
 * This sample app is provided to kickstart your experience using Facebook's
 * resources for developers.  This sample app provides examples of several
 * key concepts, including authentication, the Graph API, and FQL (Facebook
 * Query Language). Please visit the docs at 'developers.facebook.com/docs'
 * to learn more about the resources available to you
 */
// Provides access to app specific values such as your app id and app secret.
// Defined in 'AppInfo.php'
require_once('AppInfo.php');

if (isset($_GET["photos"])) {
	if (preg_match("/$[0-9]+r[0-9]+/", $_GET["photos"]) === false) {
		require_once("./404.html");
		exit();
	}
	header("location: https://shapeyourlife.herokuapp.com/photos".$_GET["photos"]);
	exit();
}
if (substr(AppInfo::getUrl(), 0, 8) != 'https://' && $_SERVER['REMOTE_ADDR'] != '127.0.0.1') {
  header('Location: https://'. $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']);
  exit();
}
require_once(_SHAPE_YOUR_LIFE_DEFAULT_PATH.'/php/language.php');
require_once(_SHAPE_YOUR_LIFE_DEFAULT_PATH.'/php/share.php');
require_once(_SHAPE_YOUR_LIFE_DEFAULT_PATH.'/php/Utility/mdetect.php');
require_once(_SHAPE_YOUR_LIFE_DEFAULT_PATH.'/php/minify.php');
$user_agent = new uagent_info();
// Enforce https on production
shape_lang::init();
header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="en">

<head>
	
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="description" content="Free software to create compositions with your Facebook pictures and share them with your friends" />
	<meta name="keywords" content="facebook,photos,shape,share,photo compositions,album" />
	<?php
		echo SOCIAL_METAS;
	?>
	
	<title>Shape Your Life - Shape your facebook photos to create awesome compositions!</title>
	<link rel="icon" href="https://shapeyourlife.herokuapp.com/favicon.ico" />

	<link href="https://reset5.googlecode.com/hg/reset.min.css" rel="stylesheet" />
	<link href="./css/jsquares.css" rel="stylesheet" />
	<link href="./css/Aristo/Aristo.css" rel="stylesheet" />
	<link href="./css/style.css" rel="stylesheet" />

	<script type="text/javascript">
		var shape_lang = {
			"warning"				: '<?php shape_lang::expr("warning", true); ?>',
			"error"					: '<?php shape_lang::expr("error", true); ?>',
			"make_shape"			: '<?php shape_lang::expr("make_shape", true); ?>',
			"cover_photo"			: '<?php shape_lang::expr("cover_photo", true); ?>',
			"share_them"			: '<?php shape_lang::expr("share_them", true); ?>',
			"try_it_now"			: '<?php shape_lang::expr("try_it_now", true); ?>',
			"no_album"				: '<?php shape_lang::expr("no_album", true); ?>',
			"no_cookie"				: '<?php shape_lang::expr("no_cookie", true); ?>',
			"wait"					: '<?php shape_lang::expr("wait", true); ?>',
			"select_your_album"		: '<?php shape_lang::expr("select_your_album", true); ?>',
			"processing_request"	: '<?php shape_lang::expr("processing_request", true); ?>',
			"session_expired"		: '<?php shape_lang::expr("session_expired", true); ?>',
			"session_error"			: '<?php shape_lang::expr("session_error", true); ?>',
			"too_few_photo1"		: '<?php shape_lang::expr("too_few_photo1", true); ?>',
			"too_few_photo2"		: '<?php shape_lang::expr("too_few_photo2", true); ?>',
			"empty"					: '<?php shape_lang::expr("empty", true); ?>',
			"share_tab"				: '<?php shape_lang::expr("share_tab", true); ?>',
			"back_to_album"			: '<?php shape_lang::expr("back_to_album", true); ?>',
			"reload_shape"			: '<?php shape_lang::expr("reload_shape", true); ?>',
			"save_shape"			: '<?php shape_lang::expr("save_shape", true); ?>',
			"change_to_default"		: '<?php shape_lang::expr("change_to_default", true); ?>',
			"change_to_text"		: '<?php shape_lang::expr("change_to_text", true); ?>',
			"draw_shape"			: '<?php shape_lang::expr("draw_shape", true); ?>',
			"change_bkg_color"		: '<?php shape_lang::expr("change_bkg_color", true); ?>',
			"confirm_reload_shape"	: '<?php shape_lang::expr("confirm_reload_shape", true); ?>',
			"create_shape"			: '<?php shape_lang::expr("create_shape", true); ?>',
			"placeholder_text"		: '<?php shape_lang::expr("placeholder_text", true); ?>',
			"insert_text"			: '<?php shape_lang::expr("insert_text", true); ?>',
			"change_shape"			: '<?php shape_lang::expr("change_shape", true); ?>',
			"change_image_button"	: '<?php shape_lang::expr("change_image_button", true); ?>',
			"change_image_dialog"	: '<?php shape_lang::expr("change_image_dialog", true); ?>',
			"cancel"				: '<?php shape_lang::expr("cancel", true); ?>',
			"title_like_fb"			: '<?php shape_lang::expr("title_like_fb", true); ?>',
			"give_me_like"			: '<?php shape_lang::expr("give_me_like", true); ?>',
			"already_like"			: '<?php shape_lang::expr("already_like", true); ?>',
			"no_like"				: '<?php shape_lang::expr("no_like", true); ?>',
			"title_share"			: '<?php shape_lang::expr("title_share", true); ?>',
			"description_share"		: '<?php shape_lang::expr("description_share", true); ?>',
			"share_ok"				: '<?php shape_lang::expr("share_ok", true); ?>',
			"go_app"				: '<?php shape_lang::expr("go_app", true); ?>',
			"share_img_src"			: '<?php shape_lang::expr("share_img_src", true); ?>',
			"link_img_src"			: '<?php shape_lang::expr("link_img_src", true); ?>',
			"share_it"				: '<?php shape_lang::expr("share_it", true); ?>'
		};
	</script>
</head>
<?php flush(); ?>
<body>
<?php
//print social like buttons
echo SHARE_TAB;
echo GOOGLE_ANALYTICS;
?>
<div id="languageSelector">
	<dl id="sample" class="dropdown">
        <dt><a><span><img class="flag" src="./images/flags/<?php echo shape_lang::$actual_lang; ?>.png" alt="<?php echo shape_lang::$actual_lang; ?>" /></span></a></dt>
        <dd>
            <ul>
            	<?php
					$langs = shape_lang::get_supported_languages();
            		foreach ($langs as $l) {
						$url = AppInfo::getUrl("/?lang=$l");
            			if ($l != "_default")
	            			echo "<li><a href=\"$url\"><img class=\"flag\" src=\"./images/flags/$l.png\"  alt=\"$l\" /></a></li>";
            		}
            	?>
            </ul>
        </dd>
    </dl>
</div>
<div class="loadingShape">
	<div>
		<img id="tutorial" alt="try it!" src="data:image/gif;base64,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" />
		<!--<img src="images/tutorial_center.gif" id="tutorial" alt="try it!"/>-->
		<img src="images/tutorial_gear.gif" id="gear" alt="gear"/>
	</div>
</div>
<div id="tot" class="firstPage">
	<!-- Prima pagina -->
	<div id="up" style="display:block;">
		
		<div id="titleHidden">
			<img src="images/titlenobkg.gif" alt="titlebkg"/>
		</div>
		<div id="title">
			<img src="images/title.gif" alt="title"/>
		</div>
	</div>
	
	<!-- Immagini tutorial con bottone centrale -->
	<div id="middle" style="display:block;">
		<div>
			<div id="imageContainer" >
				<div id="js-container0" style="display:none; position: absolute; top: -50px; left: 304px; width: 260px; height: 230px;" title='<?php shape_lang::expr("make_shape");?>' ></div>
				<div id="js-container1" style="display:none; position: absolute; top: 14px; left:-17px; width:252px; height:140px;" title='<?php shape_lang::expr("cover_photo");?>' ></div>
				<div id="js-container2" style="display:none; position: absolute; top: 200px; left: 139px; width: 250px; height: 250px;" title='<?php shape_lang::expr("share_them");?>' ></div>
				<div id="start" style="display:none; position: absolute; top: 50px; left: 50px; z-index: 20;">
					<img title='<?php shape_lang::expr("try_it_now"); ?>' src="images/start_button.gif">
				</div>
			</div>
		</div>
	</div>



	<!-- Seconda pagina -->
	<div id="shapeScreen" style="position: absolute; width: 100%; height: 100%; display:none;">
		<div id="share_tab">
			<p><?php shape_lang::expr("share_tab"); ?></p>
			<img id="shareShape" class="shareButton" src="images/facebook_share_it.png">
			<img id="getLink" class="shareButton" src="images/share_link_it.png">
		</div>
		<div id="containerShape" style="height: 96%; overflow: auto; width: 100%;">
			<div id="js-container" style="margin-left: 0px; top: 75px; left: 410px;"></div>
			<div id="toolsShape">
				<div style="border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: white; height: 53px; margin: auto; width: 700px;">
					<div class="toolbarElement" id="albums" title='<?php shape_lang::expr("back_to_album"); ?>' style="width: 36px; background-position: 0px -150px;"></div>
					<div class="toolbarElement" id="reload" title='<?php shape_lang::expr("reload_shape"); ?>' style="width: 30px; background-position: 0px -90px;"></div>
					<div class="toolbarElement" id="save" title='<?php shape_lang::expr("save_shape"); ?>' style="width: 30px; background-position: 0px -120px;"></div>
					<div class="toolbarElement" id="changeShape" title='<?php shape_lang::expr("change_to_default"); ?>' style="width: 33px; background-position: 0px 0px;"></div>
					<div class="toolbarElement" id="changeText" title='<?php shape_lang::expr("change_to_text"); ?>' style="width: 26px; background-position: 0px -180px;"></div>
					<div class="toolbarElement" id="drawShape" title='<?php shape_lang::expr("draw_shape"); ?>' style="width: 31px; background-position: 0px -60px;"></div>
					<div class="toolbarElement color{onImmediateChange:'controller.toolbar.updateBackground(this);',valueElement:'nullElement'}"
						title='<?php shape_lang::expr("shape_presentation"); ?>' id="changeBackground" style="width: 30px; background-color: rgb(0, 0, 0); color: rgb(0, 0, 0); background-position: 0px -30px;"></div>
				</div>
			</div>
		</div>
	</div>

</div>
	<div id="backgroundContainerLeft" class='fullSize' style="display:block;"></div>
	<div id="backgroundContainerRight" class='fullSize' style="display:block;"></div>

	<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
	<script type="text/javascript" src="./js/jQueryRotateCompressed.js" charset="utf-8"></script>
	<script type="text/javascript">
		<?php
			flush();
			if (file_exists("/tmp/js_min.js"))
				echo "//cached...\n".file_get_contents("/tmp/js_min.js");
			else
			{
				$scripts = "";
				$scripts .= file_get_contents(_SHAPE_YOUR_LIFE_DEFAULT_PATH."/js/shape.lib.js");
				$scripts .= file_get_contents(_SHAPE_YOUR_LIFE_DEFAULT_PATH."/js/utils.js");
				$scripts .= file_get_contents(_SHAPE_YOUR_LIFE_DEFAULT_PATH."/js/jquery.photosquares.js");
				//$scripts .= file_get_contents(_SHAPE_YOUR_LIFE_DEFAULT_PATH."/js/loginPage.js");
				//$scripts .= file_get_contents(_SHAPE_YOUR_LIFE_DEFAULT_PATH."/js/viewShape.js");
				$scripts .= file_get_contents(_SHAPE_YOUR_LIFE_DEFAULT_PATH."/js/Messages.js");
				$scripts .= file_get_contents(_SHAPE_YOUR_LIFE_DEFAULT_PATH."/js/model.js");
				$scripts .= file_get_contents(_SHAPE_YOUR_LIFE_DEFAULT_PATH."/js/view.js");
				$scripts .= file_get_contents(_SHAPE_YOUR_LIFE_DEFAULT_PATH."/js/controller.js");
				$scripts .= file_get_contents(_SHAPE_YOUR_LIFE_DEFAULT_PATH."/js/FacebookUser.class.js");
				$scripts .= file_get_contents(_SHAPE_YOUR_LIFE_DEFAULT_PATH."/js/imageDisposer.class.js");
				$scripts .= file_get_contents(_SHAPE_YOUR_LIFE_DEFAULT_PATH."/js/Shape.class.js");
				$scripts .= file_get_contents(_SHAPE_YOUR_LIFE_DEFAULT_PATH."/js/System.class.js");
				$scripts .= file_get_contents(_SHAPE_YOUR_LIFE_DEFAULT_PATH."/js/plugin/jscolor/jscolor.js");
				$scripts .= file_get_contents(_SHAPE_YOUR_LIFE_DEFAULT_PATH."/js/plugin/jquery.balloon.js");
				$minified = JSMin::minify($scripts);
				file_put_contents("/tmp/js_min.js", $minified);
				echo $minified;
			}
		?>
	</script>
	<script type="text/javascript" src="https://code.jquery.com/ui/1.10.3/jquery-ui.min.js"></script>
</body>
</html>
