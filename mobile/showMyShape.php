<?php
require_once('../AppInfo.php');

require_once(_SHAPE_YOUR_LIFE_DEFAULT_PATH.'/php/language.php');
require_once(_SHAPE_YOUR_LIFE_DEFAULT_PATH.'/php/share.php');
include_once(_SHAPE_YOUR_LIFE_DEFAULT_PATH."/php/savepage.php");
include_once(_SHAPE_YOUR_LIFE_DEFAULT_PATH."/php/libreriaXHTML.php");

shape_lang::init();
header('Content-Type: text/html; charset=utf-8');
$id = $_GET["id"];
if (preg_match("/$[0-9]+r[0-9]+/", $id) === false)
{
	require_once(_SHAPE_YOUR_LIFE_DEFAULT_PATH."/404.html");
	exit();
}
$pageReturn = SavePage::load($id);
if ($pageReturn === false) {
	require_once(_SHAPE_YOUR_LIFE_DEFAULT_PATH."/404.html");
	exit();
}
$data = $pageReturn[0]["data"];
if ($pageReturn[0]["new_method"] != "t")
{
	header("location: https://shapeyourlife.herokuapp.com/photos" . ($_GET["id"]));
	exit();
}
$color = $pageReturn[0]["color"];
$is_text = $pageReturn[0]["is_text"] == "f" ? "true" : "false";
$fb_id = $pageReturn[0]["facebook_id"];
?>
<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-type" content="text/html; charset=utf-8"/>
		<!--<script type="text/javascript">
		    var scale = 1 / window.devicePixelRatio;
		    var viewportTag = "<meta id=\"meta1\" name=\"viewport\" content=\"width=device-width, height=device-height, initial-scale=" + scale + ", maximum-scale=1, user-scalable=no\"/>";        
		    document.write(viewportTag);        
		</script>-->
		<meta name="viewport" content="initial-scale=1, maximum-scale=1">
		<?php
			echo SOCIAL_METAS;
		?>
		<title>Shape Your Life</title>
		<link rel="stylesheet" href="//code.jquery.com/mobile/1.3.2/jquery.mobile-1.3.2.min.css" type="text/css" media="screen" title="jquery" />
		<link href="photoswipe.css" type="text/css" rel="stylesheet" />
		<link href="style.css" type="text/css" rel="stylesheet" />
		<link href="../css/jsquares.css" type="text/css" rel="stylesheet" />
		<link rel="icon" href="https://shapeyourlife.herokuapp.com/favicon.ico" />
		
		<script type="text/javascript" src="js/klass.min.js" charset="utf-8"></script>
		<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js" charset="utf-8"></script>
		<script type="text/javascript" src="../js/shape.lib.js" charset="utf-8"></script>
		<script type="text/javascript" src="../js/FacebookUser.class.js" charset="utf-8"></script>
		<script type="text/javascript" src="js/utils.js" charset="utf-8"></script>
		<script type="text/javascript" src="../js/imageDisposer.class.js" charset="utf-8"></script>
		<script type="text/javascript" src="js/code.photoswipe.jquery-3.0.5.min.js" charset="utf-8"></script>
		<script type="text/javascript">
			var shape_lang = {
				"title_share"			: '<?php shape_lang::expr("title_share", true); ?>',
				"description_share"		: '<?php shape_lang::expr("description_share", true); ?>',
				"share_ok"				: '<?php shape_lang::expr("share_ok", true); ?>',
				"go_app"				: '<?php shape_lang::expr("go_app", true); ?>',
				"share_img_src"			: '<?php shape_lang::expr("share_img_src", true); ?>',
				"link_img_src"			: '<?php shape_lang::expr("link_img_src", true); ?>',
				"share_it"				: '<?php shape_lang::expr("share_it", true); ?>'
			};
			var ID_SHAPE = "<?php echo $id ?>";
			var GLOBAL_DATA = <?php echo $data; ?>;
			var GLOBAL_BACK_COLOR = <?php echo $color ?>;
			var is_text = <?php echo $is_text ?>;
			var fb_id = <?php echo $fb_id ?>;
			var FACEBOOK_USER = null;
			$(document).on("mobileinit", function ()
			{
	            var size = calcOptimalMobileShapeSize();
	            DISPOSER = new imageDisposer(size, size, DEFAULT_MARGIN, GLOBAL_DATA);
			});
			$(document).on("pagebeforeshow", "#delete_confirm", function ()
			{
				$("#confirm")
					.off("click")
					.click(function (e)
					{
						$.server.delete({
					    	success : function (data)
					    	{
					    		window.location = "https://apps.facebook.com/shapeyourlife";
					    	},
					    	error : function (error)
					    	{
					    		$.shapeMobile.showError("Impossibile eliminare la shape");
					    	}
					    });
					    e.preventDefault()
					    return false;
					});
			})
			$(document).on("pagebeforeshow", "#shape", function ()
			{
			    $("#save_shape")
			        .off("click")
			        .on("click", function (e)
			        {
			            var disp_temp = new imageDisposer(40, 40, 2, DISPOSER.dataServer);
			            $.server.save({data : disp_temp.dataClient});
			            e.preventDefault();
			            return false;
			        });

			    if (FACEBOOK_USER === null)
			    {
				    FACEBOOK_USER = new FacebookUser(function ()
				    {
				    	$("#menu ul")
				    		.append(
				    			$("<li>")
				    				.append($("<a id=\"delete\" href=\"#delete_confirm\">Elimina shape</a>"))
				    			).listview("refresh");
				    });
			    }
			    $("#fb_share")
				    .off("click")
				    .click(function ()
				    {
				    	FACEBOOK_USER.streamPublish(ID_SHAPE, function ()
	                    {
	                        $.shapeMobile.showError(shape_lang["share_ok"]);
	                    });

				    });
			    $("#shape_container")
			        .empty()
			        .parent()
			        .css({"background": "none", "background-color": "rgb("+GLOBAL_BACK_COLOR[0]+", "+GLOBAL_BACK_COLOR[1]+", "+GLOBAL_BACK_COLOR[2]+")"});
			    GLOBAL_SHAPE = <? echo ($pageReturn[0]["is_text"] == "f" ? "\"text\"" : 1); ?>;
			    createShapeMobile();
			});
		</script>
		<script type="text/javascript" src="//code.jquery.com/mobile/1.3.2/jquery.mobile-1.3.2.min.js" charset="utf-8"></script>
		<script type="text/javascript" src="js/fastClick.js" charset="utf-8"></script>
	</head>
<?php
	flush();
?>
	<body>
		<div data-role="page" id="shape" style="background: none;">
			<div data-role="header">
	     		<a href="#menu" data-role="button" data-icon="grid" data-iconpos="notext" data-mini="true" data-inline="true">Navigazione</a>
				<h1>Shape Your Life</h1>
			</div>
			<div data-role="content" id="shape_container">
			</div>
			<div data-role="panel" id="menu">
				<ul data-role="listview" data-inset="true">
				    <li><a href="https://apps.facebook.com/shapeyourlife" target="_blank">Crea una shape</a></li>
				    <li><a id="save_shape" href="#share">Salva shape</a></li>
					<li><a href="#share" id="fb_share" data-rel="dialog" data-transition="slidedown">Condividi composizione</a></li>
				</ul>
			</div><!-- /panel -->
		</div>
		<div data-role="dialog" id="delete_confirm">
			<div data-role="header" data-theme="d">
				<h1>Sei sicuro di voler eliminare la shape?</h1>
			</div>
			<div data-role="content" data-theme="c">
				<a href="#" id="confirm" data-role="button" data-rel="back" data-theme="b">Ok</a>
				<a href="#shape" id="back" data-role="button" data-rel="back" data-theme="b">Annulla</a>
			</div>
		</div>
	</body>
</html>