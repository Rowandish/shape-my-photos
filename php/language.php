<?php
	if (!defined("_SHAPE_YOUR_LIFE_DEFAULT_PATH"))
		exit();
	
	require_once(_SHAPE_YOUR_LIFE_DEFAULT_PATH."/AppInfo.php");
	class shape_lang
	{
		public static $actual_lang;
		public static function init()
		{
			$langs = shape_lang::get_supported_languages();
			if (isset($_GET["lang"]) && in_array($_GET["lang"], $langs))
			{
				require_once(_SHAPE_YOUR_LIFE_DEFAULT_PATH . "/php/lang/lang." . $_GET["lang"] . ".php");
				require_once(_SHAPE_YOUR_LIFE_DEFAULT_PATH . "/php/lang/lang._default.php");
				shape_lang::$actual_lang = $_GET["lang"];
				return;
			}
			$chosen_lang = http_negotiate_language($langs);
			//var_dump(substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2), $langs, $chosen_lang);
			//exit();
			if ($chosen_lang != $langs[0])
			{
				shape_lang::$actual_lang = $chosen_lang;
				require_once(_SHAPE_YOUR_LIFE_DEFAULT_PATH."/php/lang/lang." . $chosen_lang . ".php");
				//header("location: " . AppInfo::getUrl("/?lang=$chosen_lang"));
				//exit();
			}
			else
			{
				shape_lang::$actual_lang = "en";
				require_once(_SHAPE_YOUR_LIFE_DEFAULT_PATH."/php/lang/lang._default.php");
			}
		}
		public static function get_supported_languages()
		{
			$supported_languages = array();
			if ($handle = opendir(_SHAPE_YOUR_LIFE_DEFAULT_PATH."/php/lang/")) {
				while (false !== ($entry = readdir($handle))) {
					if (substr($entry, 0, 5) == "lang.") {
						$name = explode(".", $entry);
						$supported_languages[] = $name[1];
					}
				}
				closedir($handle);
			}
			sort($supported_languages, SORT_STRING);
			return $supported_languages;

		}
		public static function cat_expr($word)
		{
			/*if (array_key_exists($word, shape_lang::$words[shape_lang::$actual_lang])) 
				echo shape_lang::$words[shape_lang::$actual_lang][$word];
			else
				echo shape_lang::$words[shape_lang::$default_lang][$word];*/
			return addslashes(constant("LANG_".$word));
		}
		public static function expr($word, $slashes = false)
		{
			/*if (array_key_exists($word, shape_lang::$words[shape_lang::$actual_lang])) 
				echo shape_lang::$words[shape_lang::$actual_lang][$word];
			else
				echo shape_lang::$words[shape_lang::$default_lang][$word];*/
			if ($slashes)
				echo addslashes(constant("LANG_".$word));
			else
				echo constant("LANG_".$word);

		}
	}
	function http_negotiate_language($available_languages,$http_accept_language="auto") {
		$lang = array_search(substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2), $available_languages);
		if ($lang !== FALSE)
			return $available_languages[$lang];
		else
			return $available_languages[0];
	}
/*		// if $http_accept_language was left out, read it from the HTTP-Header 
		if ($http_accept_language == "auto") $http_accept_language = isset($_SERVER['HTTP_ACCEPT_LANGUAGE']) ? $_SERVER['HTTP_ACCEPT_LANGUAGE'] : ''; 

		// standard  for HTTP_ACCEPT_LANGUAGE is defined under 
		// http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.4 
		// pattern to find is therefore something like this: 
		//	1#( language-range [ ";" "q" "=" qvalue ] ) 
		// where: 
		//	language-range  = ( ( 1*8ALPHA *( "-" 1*8ALPHA ) ) | "*" ) 
		//	qvalue		 = ( "0" [ "." 0*3DIGIT ] ) 
		//			| ( "1" [ "." 0*3("0") ] ) 
		preg_match_all("/([[:alpha:]]{1,8})(-([[:alpha:]|-]{1,8}))?" . 
					   "(\s*;\s*q\s*=\s*(1\.0{0,3}|0\.\d{0,3}))?\s*(,|$)/i", 
					   $http_accept_language, $hits, PREG_SET_ORDER); 

		// default language (in case of no hits) is the first in the array 
		$bestlang = $available_languages[0]; 
		$bestqval = 0; 
var_dump($hits);
exit();
		foreach ($hits as $arr) { 
			// read data from the array of this hit 
			$langprefix = strtolower ($arr[1]); 
			if (!empty($arr[3])) { 
				$langrange = strtolower ($arr[3]); 
				$language = $langprefix . "-" . $langrange; 
			} 
			else $language = $langprefix; 
			$qvalue = 1.0; 
			if (!empty($arr[5])) $qvalue = floatval($arr[5]); 
		  
			// find q-maximal language  
			if (in_array($language,$available_languages) && ($qvalue > $bestqval)) { 
				$bestlang = $language; 
				$bestqval = $qvalue; 
			} 
			// if no direct hit, try the prefix only but decrease q-value by 10% (as http_negotiate_language does) 
			else if (in_array($langprefix,$available_languages) && (($qvalue*0.9) > $bestqval)) { 
				$bestlang = $langprefix; 
				$bestqval = $qvalue*0.9; 
			} 
		} 
		return $bestlang; 
	} */
?>