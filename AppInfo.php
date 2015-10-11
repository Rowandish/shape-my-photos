<?php
define("_SHAPE_YOUR_LIFE_DEFAULT_PATH", "/app/www");
/**
 * This class provides static methods that return pieces of data specific to
 * your app
 */
class AppInfo {

  /*****************************************************************************
   *
   * These functions provide the unique identifiers that your app users.  These
   * have been pre-populated for you, but you may need to change them at some
   * point.  They are currently being stored in 'Environment Variables'.  To
   * learn more about these, visit
   *   'http://php.net/manual/en/function.getenv.php'
   *
   ****************************************************************************/

  /**
   * @return the appID for this app
   */
  public static function appID() {
    return getenv('FACEBOOK_APP_ID');
  }

  /**
   * @return the access values for postgre db
   */
  public static function sqlInfos() {
	$infos = getenv('HEROKU_POSTGRESQL_ROSE_URL');
        $matches = array();
	preg_match("/postgres:\/\/([a-z]+):([A-Za-z0-9]+)\@([a-z0-9\-\.]+):([0-9]+)\/([a-z0-9]+)/", $infos, $matches);
    return $matches;
  }
  
  /**
   * @return the appSecret for this app
   */
  public static function appSecret() {
    return getenv('FACEBOOK_SECRET');
  }

  /**
   * @return the url
   */
  public static function getUrl($path = '/') {
    if (isset($_SERVER['HTTPS']) && ($_SERVER['HTTPS'] == 'on' || $_SERVER['HTTPS'] == 1)
      || isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] == 'https'
    ) {
      $protocol = 'https://';
    }
    else {
      $protocol = 'http://';
    }

    return $protocol . $_SERVER['HTTP_HOST'] . $path;
  }

}
