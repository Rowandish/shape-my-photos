<?php

if (!defined("_SHAPE_YOUR_LIFE_DEFAULT_PATH"))
	exit();

include_once(_SHAPE_YOUR_LIFE_DEFAULT_PATH."/AppInfo.php");
include_once(_SHAPE_YOUR_LIFE_DEFAULT_PATH."/php/facebook/facebook.php");

function initMyFB($token) {
	$config = array();
	$config['appId'] = AppInfo::appID();
	$config['secret'] = AppInfo::appSecret();
	$config['cookie'] = true;
	if ($token != "")
		unset($config['cookie']);
	$facebook = new Facebook($config);
	if ($token != "")
		$facebook->setAccessToken($token);
	$user = $facebook->getUser();
	if(!$user){
		json_encode(array("error" => "No facebook authentication active found"));
	}
	return $facebook;

	/*if($user){
		try{
			//$user_profile = $facebook->api('/me');
			//$access_token = $facebook->getAccessToken();
	    }
	    catch(FacebookApiException $e){
	        die(json_encode(array("error" => $e->getMessage().".\n Please try reloading the page or clearing your browser cookies.")));
	        $user = NULL;
	    }
	}*/
}

function fql($query)
{
	$params = array(
	'method' => 'fql.query',
	'query' =>$query,
	);
return $params;
}
?>
