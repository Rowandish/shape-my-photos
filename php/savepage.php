<?php
if (!defined("_SHAPE_YOUR_LIFE_DEFAULT_PATH"))
	exit();
require_once(_SHAPE_YOUR_LIFE_DEFAULT_PATH.'/AppInfo.php');
class SavePage
{
	private static $database = null;
	static function init()
	{/*
		if ( $database === NULL)
		{
			list($url, $user, $pass, $host, $port, $db) = AppInfo::sqlInfos();
			$pdo = new PDO("pgsql:host=$host;port=5432;dbname=$db;user=$user;password=$pass");
			SavePage::$database = new FluentPDO($pdo);
		}
		return SavePage::$database;*/
	}
	/*static function generateDB() {
		query("DROP TABLE IF EXISTS galleries");
		pg_query("DROP TABLE IF EXISTS images");
		query("CREATE TABLE galleries(id SERIAL PRIMARY KEY, rand TEXT, facebook_id TEXT, name TEXT,album_id TEXT, color TEXT, time INT, data TEXT, is_text BOOLEAN)");
	 	query("CREATE TABLE images(id SERIAL PRIMARY KEY, url TEXT, avg INT, width INT, height INT)");

	}
	static function regenerateDB() {
		query("ALTER TABLE galleries ADD COLUMN rand TEXT");
		query("ALTER TABLE galleries ADD COLUMN facebook_id TEXT");
	}
	static function regenerateDB() {
		query("ALTER TABLE galleries ADD COLUMN new_method BOOLEAN DEFAULT false");
		query("ALTER TABLE galleries ADD COLUMN email TEXT DEFAULT NULL");
	}
	static function testing() {
		$result = query("SELECT id, rand, email, new_method FROM galleries");
					$assoc = pg_fetch_all($result);
					var_dump($assoc);
	}*/
	static function save($album_ids, $data, $name, $bkg, $is_text, $facebook_id, $mail)
	{


		$key = false;
		$rand = rand();
		$album_ids = pg_escape_string($album_ids);
		$data = pg_escape_string($data);
		$facebook_id = pg_escape_string($facebook_id);
		$name = pg_escape_string($name);
		$bkg = pg_escape_string($bkg);
		$is_text = pg_escape_string($is_text);
		$mail = pg_escape_string($mail);
		if (($result = query("INSERT INTO galleries (id, rand, facebook_id, name, album_id, color, time, data, is_text, new_method, email) VALUES (DEFAULT, '$rand', $facebook_id, '$name', '$album_ids', '$bkg', ".time().", '$data', '$is_text', true, '$mail') RETURNING id, rand"))) {
			$key = pg_fetch_array($result, 0);
			$key = $key["id"]."r".$key["rand"];
		}
		pg_close($GLOBALS["con"]); 
		return $key;
	}
	static function update($id, $data, $bkg, $is_text)
	{
		$key = false;
		$id = explode("r", $id);
		$rand = $id[1];
		$id = $id[0] + 0;
		$id = pg_escape_string($id);
		$rand = pg_escape_string($rand);
		if (($result = query("UPDATE galleries SET data = '$data', color = '$bkg', is_text = '$is_text' WHERE id = $id AND rand = '$rand'"))) {
			$key = true;
		}
		pg_close($GLOBALS["con"]); 
		return $key;
	}
	static function load($id)
	{
		//$db = SavePage::init();

		$assoc = false;
		$id = explode("r", $id);
		$rand = $id[1];
		$id = $id[0] + 0;
		$id = pg_escape_string($id);
		$rand = pg_escape_string($rand);

/*
		$query = $db->from("galleries")->where("id", $id);

		if ($rand == "")
			$query->where("rand", null);
		else
			$query->where("rand", $rand);
		*/
		if ($rand == "")
			$query = "SELECT album_id, facebook_id, data, name, color, is_text, new_method FROM galleries WHERE id = $id AND rand is NULL LIMIT 1";
		else
			$query = "SELECT album_id, facebook_id, data, name, color, is_text, new_method FROM galleries WHERE id = $id AND rand = '$rand' LIMIT 1";

		//$query->limit(1);
		if (($result = query($query)))
		{
			$assoc = pg_fetch_all($result);
		}
		pg_close($GLOBALS["con"]);
		return $assoc;
	}
	static function delete($id, $facebook_id)
	{
		$assoc = false;
		$id = explode("r", $id);
		$rand = $id[1];
		$id = $id[0] + 0;
		$id = pg_escape_string($id);
		$rand = pg_escape_string($rand);
		if ($rand == "")
			$query = "DELETE FROM galleries WHERE id = $id AND rand is NULL AND facebook_id = '$facebook_id'";
		else
			$query = "DELETE FROM galleries WHERE id = $id AND rand = '$rand' AND facebook_id = '$facebook_id'";
		if (($result = query($query)))
		{
			if (pg_affected_rows($result) > 0)
				$assoc = true;
		}
		pg_close($GLOBALS["con"]); 
		return $assoc;
	}

	static function insertImage($url, $avg, $width, $height)
	{
		if (($result = query("INSERT INTO images (url, avg, width, height) VALUES ('$url', '$avg', '$width', '$height')")))
			return pg_last_oid($result);
		else
			return false;
		pg_close($GLOBALS["con"]); 
	}
	static function getAvgFromUrl($url)
	{
		if (($result = query("SELECT avg FROM images WHERE url = $url")))
			return pg_fetch_row($result);
		else
			return false;
		pg_close($GLOBALS["con"]); 
	}
}

$con = null;

function mysql_create()
{
	list($url, $user, $pass, $host, $port, $db) = AppInfo::sqlInfos();
	if ( $GLOBALS["con"] === NULL)
	{
		$GLOBALS["con"] = pg_connect("host=$host dbname=$db user=$user password=$pass")
							or die (json_encode(array("error"=>"Could not connect to server\n")));
	}
    return true;
}
function query($query) {
	if (mysql_create())
	{
		$q = pg_query($GLOBALS['con'], $query) or die(json_encode(array("error"=>"Cannot execute query: ".pg_last_error()."\n\n".$query)));
		return $q;
	}
	return false;
}
?>