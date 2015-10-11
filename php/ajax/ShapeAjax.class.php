<?php
include_once(_SHAPE_YOUR_LIFE_DEFAULT_PATH."/php/ajax/Ajax.class.php");
include_once(_SHAPE_YOUR_LIFE_DEFAULT_PATH."/php/facebook_primitives.php");
include_once(_SHAPE_YOUR_LIFE_DEFAULT_PATH."/php/photos.php");
include_once(_SHAPE_YOUR_LIFE_DEFAULT_PATH."/php/savepage.php");
include_once(_SHAPE_YOUR_LIFE_DEFAULT_PATH."/php/shape/shape_positioning.php");

class ShapeAjax extends Ajax
{
	public static $parameters_array =
		array(
			"generate" =>
				array(
					"duplicates" => array("callback" => "validateBoolean", "position" => "_GET"),
					"get_image_urls" => array("callback" => "validateBoolean", "position" => "_GET"),
					"token" => array("callback" => "validateString", "position" => "_GET", "not_mandatory" => "yes"),
					"albumIds" => array("callback" => "validateArray", "parameters" => array("type" => array("callback" => "validateString", "parameters" => array("type" => "regex", "options" => array("regexp" => "/^[0-9]+|tagged$/")))), "position" => "_POST"),
					"shape" => array("callback" => "validateAll", "position" => "_POST"),
				),
			"sample" =>
				array(
				),
			"share" =>
				array(
					"data" => array("callback" => "validateShape", "position" => "_POST"),
					"bkg" => array("callback" => "validateArray", "parameters" => array("min" => 3, "max" => 3, "type" => array("callback" => "validateNumber")), "position" => "_POST"),
					"is_text" => array("callback" => "validateBoolean", "position" => "_POST"),
					"user_id" => array("callback" => "validateString", "position" => "_POST"),
					"user_mail" => array("callback" => "validateString", "parameters" => array("type" => "email"), "position" => "_POST"),
					"albumIds" => array("callback" => "validateArray", "parameters" => array("type" => array("callback" => "validateString", "parameters" => array("type" => "regex", "options" => array("regexp" => "/^[0-9]+|tagged$/")))), "position" => "_POST"),
					"name" => array("callback" => "validateString", "position" => "_POST")
				),
			"delete" =>
				array(
					"user_id" => array("callback" => "validateString", "position" => "_POST"),
					"id_shape" => array("callback" => "validateString", "parameters" => array("type" => "regex", "options" => array("regexp" => "/^[0-9]+r[0-9]+$/")), "position" => "_POST"),
				),
			"download" =>
				array(
					"data" => array("callback" => "validateShape", "position" => "_POST"),
					"color" => array("callback" => "validateArray", "parameters" => array("min" => 3, "max" => 3, "type" => array("callback" => "validateNumber")), "position" => "_POST"),
				)
		);
	public function __construct()
	{
		parent::__construct($_GET["action"], ShapeAjax::$parameters_array);
	}
	public function generate($P)
	{
		if (isset($P["token"]))
			$facebook = initMyFB($P["token"]);
		else
			$facebook = initMyFB();

		$album_id = $P["albumIds"];
		$shape = (is_numeric($P["shape"])) ? $_POST["shape"]+0 : $_POST["shape"] ;
		$images = array();
		$widths = array();
		$heights = array();
		foreach ($album_id as $value)
		{
			if ($value=="tagged")
			{
				$taggedPhotos = $facebook->api(fql("SELECT src_big,src_big_width,src_big_height FROM photo WHERE pid IN (SELECT pid FROM photo_tag WHERE subject=me())"));
				foreach ($taggedPhotos as $taggedPhoto)
				{
					$images[] = $taggedPhoto["src_big"];
					$widths[] = $taggedPhoto["src_big_width"];
					$heights[] = $taggedPhoto["src_big_height"];
				}
			}
			else
			{
				$photos=$facebook->api("/{$value}/".FB_BIG_IMAGES."?fields=width,height,source&limit=100");
				foreach($photos["data"] as $photo) {
					$images[] = $photo["source"];
					$widths[] = $photo["width"];
					$heights[] = $photo["height"]; 
				}
			}
		}
		if ($P["duplicates"])
			if (count($images)<MIN_NUM_PHOTOS)
				$this->setOutput(array("error" => "Chosen ".count($images)." photos of a minimum of " . MIN_NUM_PHOTOS, "code" => 50));
		
		$imagesArray = PhotoShaper::photoStatsFromFB($images, $widths, $heights);
		$result = PhotoShaper::photoDisposition($imagesArray, $shape);

		if (!isset($result) || count($result) == 0 || $result[0]["url"] === NULL)
			$this->setOutput(array("error" => "Failed to generate the shape", "code" => 40));

		$rand = md5(rand()).time().".txt";
		$queryString = "";
		foreach ($result as $im)
			$queryString .= $im["url"]."\n";

		file_put_contents("/tmp/".$rand, $queryString);
		exec("/app/php/bin/php /app/www/php/download_photos.php $rand > /dev/null 2> /dev/null &");

		if ($P["get_image_urls"])
			$this->setOutput(array("shape" => $result, "images" => $images, "width" => $widths, "height" => $heights));
		else
			$this->setOutput(array("shape" => $result));
	}
	public function sample($P)
	{
		include_once(_SHAPE_YOUR_LIFE_DEFAULT_PATH."/php/sample_photos.php");
		$images_data = Sample::$photos;
		$imagesStats = array();
		foreach ($images_data as $i)
			$imagesStats[] = new image(0, $i["source"], $i["width"], $i["height"]);
		
		$shaper1 = new shaper($imagesStats, array(__STAR), DIFFERENT_IMAGES, WIDTH_MIN_BLOCK, HEIGHT_MIN_BLOCK);
		$shaper2 = new shaper($imagesStats, array(__COVER_PHOTO), DIFFERENT_IMAGES, WIDTH_MIN_BLOCK, HEIGHT_MIN_BLOCK);
		$shaper3 = new shaper($imagesStats, array(__HEART), DIFFERENT_IMAGES, WIDTH_MIN_BLOCK, HEIGHT_MIN_BLOCK);
		$result1 = $shaper1->generate2();
		$result2 = $shaper2->generate2();
		$result3 = $shaper3->generate2();
		$this->setOutput(array($result1,$result2,$result3));
	}
	public function share($P)
	{
		$id = SavePage::save(json_encode($P["albumIds"]),json_encode($P["data"]),json_encode($P["name"]),json_encode($P["bkg"]),$P["is_text"],$P["user_id"]);

		if (is_null($id))
			$this->setOutput(array('error' => "Could not insert infos", "code" => 20));
		else
			$this->setOutput(array('id' => $id));
	}
	public function delete($PAR)
	{
		$return = SavePage::delete($P["id_shape"], $P["user_id"]);
		if ($return)
			$this->setOutput(array('deleteSuccess' => $return));
		else
			$this->setOutput(array('error' => "Could not delete info", "code" => 30));
	}
	public function download($P)
	{
		$data = generateCSSShapeFormat($P["data"], 40, 40, 2);
		list($name, $path) = PhotoShaper::saveImage($data, $P["color"]);
		$this->setOutput(array("name" => $name));
	}
}
