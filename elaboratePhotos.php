<?php

require_once('AppInfo.php');
require_once(_SHAPE_YOUR_LIFE_DEFAULT_PATH . '/php/ajax/ShapeAjax.class.php');

header("Access-Control-Allow-Origin: *");

define("FB_BIG_IMAGES", "photos");
define("FB_SMALL_IMAGES", "photos/picture?width=1&height=1");
define(MIN_NUM_PHOTOS, 20);
define(WIDTH_MIN_BLOCK, 20);
define(HEIGHT_MIN_BLOCK, 20);
define(MAX_LENGTH_INPUT_STRING, 20);
define(MIN_LENGTH_INPUT_STRING, 1);


$ajax = new ShapeAjax();
die(json_encode($ajax->getOutput()));
?>
 