<?php
    if (isset($_GET["nameMobile"]))
        if (($name = filter_var($_GET["nameMobile"], FILTER_VALIDATE_REGEXP,array("options"=>array("regexp"=>"/^[1-9][0-9]*$/"))))===false)
            die(json_encode(array("error" => "Invalid nameMobile parameter!")));

    $tmp_name = "/tmp/tmp".$name.".jpg";
    if (!file_exists($tmp_name))
    	die(json_encode(array("error" => "The image doesn't exists anymore")));
    header('Content-Type: image/jpeg');
    die(file_get_contents($tmp_name));
