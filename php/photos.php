<?php
if (!defined("_SHAPE_YOUR_LIFE_DEFAULT_PATH"))
	exit();
include_once(_SHAPE_YOUR_LIFE_DEFAULT_PATH.'/php/shape/shape_positioning.php');

define("DEFAULT_WIDTH", 40);
define("DEFAULT_HEIGHT", 40);
define("DEFAULT_MARGIN", 2);

class PhotoShaper {
	//questa funzione non viene mai chiamata!!
	static function clean_generate_parameters() {
		global $_GET;
		$album_id = intval($_GET["albumId"]);
		$shape = $_GET["shape"];
		if (is_string($shape) && substr($shape, 0, 1) == "#") {
			preg_replace_all("/[^a-zA-Z ]/", "", $shape);
			if (strlen($shape) > 20) {
				substr($shape, 0, 20);
			}
		} if ($shape+0 == $shape)
			$shape = intval($shape);
		else if (is_array($shape) && is_array($shape[0]) && $shape[0][0]+0 == $shape[0][0]) {
		
		} else {
			die(json_encode(array("error" => "Invalid parameters!")));
		}
		return array($album_id, $shape); //list($album_id, $shape)
	}
	static function clean_save_parameters($data, $color) {
            if (!is_array($color) || count($color) != 3)
                    die(json_encode(array("error" => "Invalid parameter color!")));
            if (!is_array($data))
                    die(json_encode(array("error" => "Invalid parameter data!")));
            foreach ($data as $img)
                if (strpos($img["url"], "fbcdn") === FALSE)
			die(json_encode(array("error" => "Invalid parameter url")));
	}
	static function saveAllPhotos($photos, $value, $destination) {
		if (!file_exists($destination)) {
			mkdir($destination);
			foreach($photos as $photo)
			{
				$_photo = explode("/", $photo[$value]);
				file_put_contents($destination."/".end($_photo), file_get_contents($photo[$value]));
			}
		}
	}
	static function directoryToArray($directories, $recursive) {
		$array_items = array();
		foreach ($directories as $directory)
		{
			if (($handle = opendir($directory))) {
				while (false !== ($file = readdir($handle))) {
					if ($file != "." && $file != "..") {
						if (is_dir($directory. "/" . $file)) {
							if($recursive) {
								$array_items = array_merge($array_items, directoryToArray($directory. "/" . $file, $recursive));
							}
							$file = $directory . "/" . $file;
							$array_items[] = preg_replace("/\/\//si", "/", $file);
						} else {
							$file = $directory . "/" . $file;
							$array_items[] = preg_replace("/\/\//si", "/", $file);
						}
					}
				}
				closedir($handle);
			}
		}
		
		return $array_items;
	}
	static public function saveImage($data, $color)
	{
		$image = shaper::imageSave2($data, $color);
	    $name = time().rand();
	    $tmp_name = "/tmp/tmp".$name.".jpg";
	    $image->save($tmp_name);
	    return array($name, $tmp_name);
	}
	static public function photoStatsFromFB($images, $widths, $heights) {
		$imagesStats = array();
		for ($i = 0; $i < count($images); $i++)
		{
			$imagesStats[] = new image(0, $images[$i], $widths[$i], $heights[$i]);
		}
		return $imagesStats;
	}
	
	static function photoDisposition($images, $shape, $wx = 11, $wy = 11) {
		$dx = "auto";
		$dy = 0;
		$offsetX = 1;
		$shapeList = array();

		if (is_string($shape))
			$shape = substr($shape, 1);
		
		if (is_string($shape) || is_array($shape)) {
			$shapeList[] = $shape;
		} else {
			switch ($shape) {
			case 1:
				$shapeList[] = __TRIANGLE_RECT;
				break;
			case 2:
				$shapeList[] = __TRIANGLE_RECT_REVERSE;
				break;
			case 3:
				$shapeList[] = __TRIANGLE_EQ;
				break;
			case 4:
				$shapeList[] = __ELLIPSE;
				break;
			case 5:
				$shapeList[] = __HOURGLASS;
				break;
			case 6:
				$shapeList[] = __CROSS;
				break;
			case 7:
				$shapeList[] = __HEART;
				//$shapeList[] = __HALF_HEART_RIGHT;
				//$dx = 5*(DEFAULT_WIDTH+DEFAULT_MARGIN);
				//$offsetX = 0;
				break;
			case 8:
				$shapeList[] = __COVER_PHOTO;
				break;
			case 9:
				$shapeList[] = __STAR;
				break;
			case 10:
				$shapeList[] = __SMILE;
				break;
			case 11:
				$shapeList[] = __BUTTERFLY;
				break;
			case 0:
			default:
				$shapeList[] = __RECTANGLE;
				break;
                    }
                }
		
		$shaper = new shaper($images, $shapeList, DIFFERENT_IMAGES, DEFAULT_WIDTH, DEFAULT_HEIGHT, DEFAULT_MARGIN, $wx, $wy, true, $dx, $dy, $offsetX);
		return $shaper->generate2();
	}
}
?>
