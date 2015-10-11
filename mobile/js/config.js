//funzioni per gestire la coerenza con cordova
function mobile_init()
{
    $.mobile.defaultHomeScroll = 0;
    $.isMobile = true;
}
function mobile_setup()
{
    FACEBOOK_USER = new FacebookUser(initFacebook);
}
function mobile_save_image()
{
	$.server.save();
}
