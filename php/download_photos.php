<?php
/*if (preg_match("/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/", $url) === false)
	exit();*/
	$urls = explode("\n", file_get_contents("/tmp/".$argv[1]));
	//if (!strstr($url, "fbcdn"))
		//continue;
	foreach ($urls as $url) {
		
		$filename = md5($url).end(explode("/", $url));
		if (!file_exists("/tmp/".$filename))
			file_put_contents("/tmp/".$filename, file_get_contents($url));
	}
?>