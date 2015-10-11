var FB_SCOPE = 'user_photos';
/*function FacebookUser(callback)
{
	var _return = {
		access_token : null,
		name : null,
		link : null,
		id : null,
		email : null,
		username : null,
		isFan : null,
		authorized : null,
		connected : false,
		callFB:function(callback)
		{
			var facebookUser = this;
			window.fbAsyncInit = function()
			{
				FB.init({
					appId: '345032408962586', // ID della app
					channelUrl: '//shapeyourlife.herokuapp.com/channel.html', // L'URL del file channel.html
					status: true,
					cookie: true,
					xfbml: true
				});
				FB.Canvas.setAutoGrow();
					
				FB.getLoginStatus(function(response) {
					if (response.status === 'connected') {
						//console.log("utente connnesso");
						facebookUser.connected = true;
						facebookUser.setupBasicInfos();
					} else if (response.status === 'not_authorized') {
						//console.log("utente non autorizzato");
						//this.authorized = false;
					} else {
						//console.log("utente non loggato");
						//$('.fb_login').click(facebookUser.login);
						//this.authorized = false;
					}
					if (callback!==undefined)
						callback(facebookUser.connected);
				});
			};
			// Load the SDK Asynchronously
			(function(d, s, id) {
				var js, fjs = d.getElementsByTagName(s)[0];
				if (d.getElementById(id)) return;
				js = d.createElement(s); js.id = id;
				//js.src = "//connect.facebook.net/en_US/all.js#xfbml=1&appId=345032408962586";
				js.src = "//connect.facebook.net/en_US/all.js";
				fjs.parentNode.insertBefore(js, fjs);
			}(document, 'script', 'facebook-jssdk'));
		},
		setupBasicInfos:function()
		{
			this.access_token = FB.getAuthResponse()['accessToken'];
			this.authorized = true;
			this.setUserInfo();
			this.setFan();
		},
		login: function(callback, method)
		{
			var _this = this;
			if (method == "inside")
			{
				var uri = encodeURI('https://shapeyourlife.herokuapp.com/mobile');
				window.location = encodeURI("https://www.facebook.com/dialog/oauth?client_id=345032408962586&redirect_uri="+uri+"&response_type=token&scope="+FB_SCOPE);
			}
			else
			{
				FB.login(function(response)
				{
					if (response.authResponse)
					{
						_this.setupBasicInfos();
						if (callback !== undefined)
							callback();
					}
					else
					{
						_this.authorized = false;
					}
				},
				{
					scope: FB_SCOPE
				});
			}
		},
		fql:function(query, callback)
		{
			var _this = this;
			FB.api('/fql', {'q':query}, callback);
		},
		setUserInfo:function()
		{
			var _this = this;
			FB.api('/me', function(response)
			{
				_this.name = response.name;
				_this.link = response.link;
				_this.username = response.username;
				_this.id = response.id;
				_this.email = response.email === undefined ? "a@a.it" : response.email;
			});
		},
		setFan:function(callback)
		{
			var _this = this;
			FB.api(
			{
				method:"pages.isFan",
				page_id:145019995707312,
			},function(response)
				{
					if(response)
						_this.isFan = true;
					else
						_this.isFan = false;
					if (callback!==undefined)
						callback();
				}
			);
		},
		streamPublish:function(generatedLink, callback)
		{
			FB.ui(
				{
					method: "feed",
					display: "iframe",
					link: "https://apps.facebook.com/shapeyourlife/photos"+generatedLink,
					caption: shape_lang["title_share"],
					description: shape_lang["description_share"],
					picture: "https://shapeyourlife.herokuapp.com/thumb.jpg?id="+generatedLink,
					actions : { name : shape_lang["go_app"], link : 'https://apps.facebook.com/shapeyourlife/'}
				},
				function(response)
				{
					$(".blackScreen").fadeOut("medium",function(){$(this).remove();});
					if (response && response.post_id)
						callback();
				}
			);
		},
		logout:function()
		{
			FB.logout(function(){document.location.responseeload();});
		}
	};

	this.callFB(callback);
	return _return;
}*/


function FacebookUser(callback)
{
	this.callFB(callback);
	this.access_token = null;
	this.name = null;
	this.link = null;
	this.id = null;
	this.email = null;
	this.username = null;
	this.isFan = null;
	this.authorized = null;
	this.connected = false;
}

FacebookUser.prototype.callFB = function(callback)
{
	var facebookUser = this;
	window.fbAsyncInit = function()
	{
		FB.init({
			appId: '345032408962586', // ID della app
			channelUrl: '//shapeyourlife.herokuapp.com/channel.html', // L'URL del file channel.html
			status: true,
			cookie: true,
			xfbml: true
		});
		FB.Canvas.setAutoGrow();
			
		FB.getLoginStatus(function(response) {
			if (response.status === 'connected') {
				//console.log("utente connnesso");
				facebookUser.connected = true;
				facebookUser.setupBasicInfos();
			} else if (response.status === 'not_authorized') {
				//console.log("utente non autorizzato");
				//this.authorized = false;
			} else {
				//console.log("utente non loggato");
				//$('.fb_login').click(facebookUser.login);
				//this.authorized = false;
			}
			if (callback!==undefined)
				callback(facebookUser.connected);
		});
	};
	// Load the SDK Asynchronously
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      //js.src = "//connect.facebook.net/en_US/all.js#xfbml=1&appId=345032408962586";
      js.src = "//connect.facebook.net/en_US/all.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
};

FacebookUser.prototype.setupBasicInfos = function()
{
	this.access_token = FB.getAuthResponse()['accessToken'];
	this.authorized = true;
	this.setUserInfo();
	this.setFan();
};


FacebookUser.prototype.login = function(callback, method)
{
	var _this = this;
	if (method == "inside")
	{
         var uri = encodeURI('https://shapeyourlife.herokuapp.com/mobile');
         window.location = encodeURI("https://www.facebook.com/dialog/oauth?client_id=345032408962586&redirect_uri="+uri+"&response_type=token&scope="+FB_SCOPE);
	}
	else
	{
		FB.login(function(response)
		{
			if (response.authResponse)
			{
				_this.setupBasicInfos();
				if (callback !== undefined)
					callback();
			}
			else
			{
				_this.authorized = false;
			}
		},
		{
			scope: FB_SCOPE
		});
	}


};

FacebookUser.prototype.fql = function(query, callback)
{
    var _this = this;
    FB.api('/fql', {'q':query}, callback);
};


FacebookUser.prototype.setUserInfo = function()
{
	var _this = this;
	FB.api('/me', function(response)
	{
		_this.name = response.name;
		_this.link = response.link;
		_this.username = response.username;
		_this.id = response.id;
		_this.email = response.email === undefined ? "a@a.it" : response.email;

	});
};

//Non funziona, da modificare una volta creata la pagina di cui diventare fan
FacebookUser.prototype.setFan = function(callback)
{
	var _this = this;
	FB.api(
	{
		method:"pages.isFan",
		page_id:145019995707312,
	},function(response)
		{
			if(response)
				_this.isFan = true;
			else
				_this.isFan = false;
			if (callback!==undefined)
				callback();
		}
	);
};

FacebookUser.prototype.streamPublish = function(generatedLink, callback)
{
	FB.ui(
		{
			method: "feed",
			display: "iframe",
			link: "https://apps.facebook.com/shapeyourlife/photos"+generatedLink,
			caption: shape_lang["title_share"],
			description: shape_lang["description_share"],
			picture: "https://shapeyourlife.herokuapp.com/thumb.jpg?id="+generatedLink,
			actions : { name : shape_lang["go_app"], link : 'https://apps.facebook.com/shapeyourlife/'}
		},
		function(response)
		{
			$(".blackScreen").fadeOut("medium",function(){$(this).remove();});
			if (response && response.post_id)
				callback();
		}
	);
};

FacebookUser.prototype.logout = function()
{
    FB.logout(function(){document.location.reload();});
};

