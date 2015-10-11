<?php
// Define the path to file
    require_once('AppInfo.php');
    include_once(_SHAPE_YOUR_LIFE_DEFAULT_PATH."/php/photos.php");
    require_once(_SHAPE_YOUR_LIFE_DEFAULT_PATH.'/php/Utility/mdetect.php');
    if (!isset($_POST["data"]) || !isset($_POST["backgroundColor"]))
        exit("error");
    $data = json_decode(urldecode($_POST["data"]), true);
    $color = json_decode(urldecode($_POST["backgroundColor"]), true);
    $data = generateCSSShapeFormat($data, 40, 40, 2);
    PhotoShaper::clean_save_parameters($data, $color);
    
    list($name, $tmp_name) = PhotoShaper::saveImage($data, $color);

    $thumbnail = file_get_contents($tmp_name);
    unlink($tmp_name);
    $user_agent = new uagent_info();

    if ($user_agent->DetectSmartphone()) {
        header('Content-Type: image/jpeg');
    } else {
        header('Content-Description: File Transfer');
        header('Content-Type: application/force-download');
        header('Content-Disposition: attachment; filename=composition.jpg');
        header('Content-Transfer-Encoding: binary');
        header('Expires: 0');
        header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
        header('Pragma: public');
        header('Content-Length: ' . strlen($thumbnail)); //Set content length here
        ob_clean();
        flush();
    }
    die($thumbnail);
?>
