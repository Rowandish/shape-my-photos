<?php
	require_once('AppInfo.php');
	include_once(_SHAPE_YOUR_LIFE_DEFAULT_PATH."/php/savepage.php");
	include_once(_SHAPE_YOUR_LIFE_DEFAULT_PATH."/php/libreriaXHTML.php");
	include_once(_SHAPE_YOUR_LIFE_DEFAULT_PATH."/php/shape/shape_positioning.php");
	include_once(_SHAPE_YOUR_LIFE_DEFAULT_PATH."/php/share.php");
	require_once(_SHAPE_YOUR_LIFE_DEFAULT_PATH.'/php/language.php');


	if (substr(AppInfo::getUrl(), 0, 8) != 'https://' || strstr(AppInfo::getUrl(), "php") !== false) {
	  header('Location: https://'. $_SERVER['HTTP_HOST'] . "/photos" . ($_GET["id"]));
	  exit();
	}

	
	define("MYDOMAIN", "https://".$_SERVER['HTTP_HOST']);
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
	$data = json_decode($pageReturn[0]["data"], true);
	if ($pageReturn[0]["new_method"] == "t")
		$data = generateCSSShapeFormat($data, 40, 40, 2);
 	die(pageGenerationMyShape($id, $data,json_decode($pageReturn[0]["name"],true),json_decode($pageReturn[0]["color"], true),$pageReturn[0]["is_text"],$pageReturn[0]["facebook_id"]));
	
	function pageGenerationMyShape($id,$data,$name,$color,$is_text,$facebook_id)
	{
		shape_lang::init();
		$page = new XHTML($name.'\'s shape! ~ Facebook photos composition maker');
		$page->addStyle("https://reset5.googlecode.com/hg/reset.min.css");
		$page->addStyle(MYDOMAIN.'/css/jsquares.css');
		$page->addStyle(MYDOMAIN.'/css/style.css');
		$page->addStyle(MYDOMAIN.'/css/Aristo/Aristo.css');
		$page->addScript("https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js");
		$page->addScript('https://code.jquery.com/ui/1.10.3/jquery-ui.min.js');
		$page->addScript(MYDOMAIN.'/js/jquery.photosquares.js');
		$page->addScript(MYDOMAIN.'/js/plugin/jquery.balloon.js');
		$page->addScript(MYDOMAIN.'/js/viewShape.js');
		$page->addScript(MYDOMAIN.'/js/Messages.js');
		$page->addScript(MYDOMAIN.'/js/FacebookUser.class.js');
		$page->addScript(MYDOMAIN.'/js/init.js');
		$page->addScript(MYDOMAIN.'/js/utils.js');
		$page->addScript(MYDOMAIN.'/js/shape.lib.js');
		
		list($r, $g, $b) = $color;
		$page->body->setAttribute("style", "background-color: rgb($r, $g, $b);");
		$infos = new HTMLNode("script", array("type"=>"text/javascript"));
		$is_text = ($is_text=="t") ? "false" : "true";
		$infos->addChild(
			new HTMLText("var GLOBAL_BACK_COLOR = [$r, $g, $b];\n var FACEBOOK_ID = '$facebook_id';\n var ID_SHAPE = '". $_GET['id'] ."';\n var IS_TEXT = $is_text;\n var LAST_SHAPE_DATA = ".json_encode($data).";
				var shape_lang = {
			'warning'				: '".shape_lang::cat_expr('warning')."',
			'error'					: '".shape_lang::cat_expr('error')."',
			'session_error'			: '".shape_lang::cat_expr('session_error')."',
			'title_like_fb'			: '".shape_lang::cat_expr('title_like_fb')."',
			'give_me_like_my_shape'	: '".shape_lang::cat_expr('give_me_like_my_shape')."',
			'already_like'			: '".shape_lang::cat_expr('already_like')."',
			'confirm_delete_shape'	: '".shape_lang::cat_expr('confirm_delete_shape')."',
			'title_share'			: '".shape_lang::cat_expr("title_share")."',
			'description_share'		: '".shape_lang::cat_expr("description_share")."',
			'share_ok'				: '".shape_lang::cat_expr("share_ok")."',
			'go_app'				: '".shape_lang::cat_expr("go_app")."',
			'no_like'				: '".shape_lang::cat_expr('no_like')."'};")
		);
		
		$favicon = new HTMLNode("link");
		$favicon->setAttribute("rel","icon");
		$favicon->setAttribute("href",MYDOMAIN."/favicon.ico");
				
		$description = new HTMLNode("meta");
		$description->setAttribute("name","description");
		$description->setAttribute("content","Share this facebook composition of photos with your friends");
		
		$socialMetas = new HTMLText(/*SOCIAL_METAS*/"<meta property=\"og:site_name\" content=\"Shape Your Life\" />
	<meta property=\"fb:app_id\" content=\"".getenv('FACEBOOK_APP_ID')."\"/>
	<meta itemprop=\"name\" content=\"Shape Your Life\" />
	<meta itemprop=\"description\" content=\"Free software to create compositions with your Facebook pictures and share them with your friends\"/>
	<meta property=\"og:image\" content=\"http://shapeyourlife.herokuapp.com/thumb.jpg?id=".$id."\" />
	<meta property=\"og:title\" content=\"Shape Your Life - ".$name."'s shape!\" />
	<meta property=\"og:description\" content=\"Free software to create compositions with your Facebook pictures and share them with your friends\" />
	<meta property=\"og:type\" content=\"website\" />
	<meta property=\"og:url\" content=\"https://shapeyourlife.herokuapp.com/photos".$id."\"/>");
		$socialButtons = new HTMLText(SHARE_TAB);
		$googleAnalytics=new HTMLText(GOOGLE_ANALYTICS);

		$title = new HTMLNode("div", array("id" => "title_presentation", "style" => "z-index:4;top: 0px; left: 0px; position:absolute;width:100%; height:80px; text-align:center;background-color:white;padding-top:10px; overflow:hidden;"));
		$title->addChild(
			new HTMLNode("a", array("href"=>"https://apps.facebook.com/shapeyourlife/", "target" => "_blank"), array(
				new HTMLNode("img", array("src" => "./images/titlenobkg.gif", "alt" => "title", "style"=>"height: 150px")))
			)
		);
		
		$toolbar = new HTMLNode("div", array("id" => "toolsShape"));
		$toolbar->addChild(new HTMLNode("div", array("style" => "border-bottom: 1px solid white; height: 53px; margin: auto;"), array(
			new HTMLNode("div", array("style" => "background-position: 0px -120px; width:30px; float: none; display: inline-block", "id" => "save", "class" => "toolbarElement", "title" => "save shape as image...")),
		)));
		
		$div = new HTMLNode("div", array("id" => "js-container", "style" => "margin-top: 110px"));
		$imgSocial = new HTMLNode("img", array("class" => "shareButton", "style" => "position: absolute; top:17px; left:17px; z-index:10; height:50px;","src"=>"images/facebook_share.png"));
		$home_link = new HTMLNode("a", array("href" => "https://apps.facebook.com/shapeyourlife", "target" => "_blank", "style" => "position: absolute; top:10px; left:250px; z-index:10;"), array(
			new HTMLNode("img", array("id" => "home_link", "title" => shape_lang::cat_expr('create_shape2'), "style" => "width:70px; height: 70px","src"=>"images/start_button.gif"))
		));

		generateJsContainerMyShape($div, $data);
		
		$page->head->addChild($socialMetas);
		$page->head->addChild($favicon);
		$page->head->addChild($description);
		$page->head->addChild($infos);
		$page->body->addChild($socialButtons);
		$page->body->addChild($imgSocial);
		$page->body->addChild($home_link);
		$page->body->addChild($googleAnalytics);
		//$page->body->addChild($title);
		$page->body->addChild($div);
		$page->body->addChild($toolbar);
		return $page;
	}
	function generateJsContainerMyShape($page, $data) {
		for ($i = 0; $i < count($data); $i++)
		{
			$image = $data[$i];
			$class_text = "js-image size-" . $image["size"];
			$style_text = "top:" . $image["top"] . "; left:" . $image["left"] . ";" ."width: " . $image["container-width"].";"."height: ".$image["container-height"];
			$container = new HTMLNode("div", array("class" => $class_text, "style" => $style_text));
			$style_text = "width: " . $image["width"] . "; height: ".$image["height"] . "; margin-left: " . $image["margin-left"] . "; margin-top: " . $image["margin-top"];
			$cover = new HTMLNode("div", array("class" => "blackCover"));
			$a = new HTMLNode("a", array("href" => "#"));
			if (strpos($image["url"], "\\") !== FALSE)
				  $image["url"] = stripslashes($image["url"]);
			$img = new HTMLNode("img", array("class" => "js-small-image", "src" => $image["url"], "style" => $style_text));
			$a->addChild($img);
			$a->addChild($cover);
			$container->addChild($a);
			$page->addChild($container);
		}
	}
