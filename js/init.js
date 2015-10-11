var FACEBOOK_USER = null;
$(document).ready(function() {

	FACEBOOK_USER = new FacebookUser(myFaceLogin);
	$(".shareButton").click(function(){
		FACEBOOK_USER.streamPublish(ID_SHAPE);
	});


	$("#js-container").jsquares();
	$("#js-container div a img").click(function(e) {
		viewImageBig($(this).attr("src"));
		e.preventDefault();
	});
	$("#home_link")
		.mouseover(function ()
		{
			$(this).attr("src", "images/start_button_hover.gif");
		})
		.mouseout(function ()
		{
			$(this).attr("src", "images/start_button.gif");
		})
		.setMyBalloon("right");
	$(".balloonTip")
				.css("cursor","pointer")
				.click(function(){
					window.open("https://apps.facebook.com/shapeyourlife/","_blank");
				});
	
	$("#save").click(function(){
		$.server.save({
			data: LAST_SHAPE_DATA,
			color: GLOBAL_BACK_COLOR
		});
	});

	
	if (IS_TEXT===true)
		$('#js-container').css("left",0);
	else
		$('#js-container').css("left",$(document).width()/2-getCurrentMaxWidth()/2);
});

function createDeleteButton()
{
	if (FACEBOOK_ID==FACEBOOK_USER.id)
	{
		$("#toolsShape")
			.children()
			.append($("<img>")
							.attr("src","images/delete.png")
							.attr("id","delete")
							.addClass("toolbarElement")
							.css({"background" : "none", "float" : "none"})
							.attr("title","delete your image")
							.click(function()
							{
								$.desktopDialog.create(
								{
									title:shape_lang["warning"],
									text:shape_lang["confirm_delete_shape"]
								},{
									width:300,
									height:210,
									buttons:{
										"OK":deleteShape,
										"Cancel":$.desktopDialog.closeAll
									}
								});
							})
							.dblclick(function(){return false;}));
	}
}

//Ottiene il valore massimo della width del container, utilizzato per centrarlo
function getCurrentMaxWidth()
{
	var minLeft = 999;
	var maxLeft = 0;
	for (var i = 0; i < LAST_SHAPE_DATA.length; i++)
	{
		var imageLeft = parseInt(LAST_SHAPE_DATA[i]["left"].replace("px",""),10);
		var imageWidth = parseInt(LAST_SHAPE_DATA[i]["container-width"].replace("px",""),10);
		if (imageLeft < minLeft)
			minLeft = imageLeft;
		if (imageLeft+imageWidth>maxLeft)
			maxLeft = imageLeft+imageWidth;
	}
	var shapeWidth = maxLeft+minLeft;
	return shapeWidth;
}

function isFB() {
	return window.self !== window.top;
}

function myFaceLogin(ok)
{
	if (!ok)
		return;
	FB.api('/me', function(response)
	{
		FACEBOOK_USER.name = response.name;
		FACEBOOK_USER.link = response.link;
		FACEBOOK_USER.username = response.username;
		FACEBOOK_USER.id = response.id;
		FACEBOOK_USER.email = response.email;
		FACEBOOK_USER.setFan(giveMeOneLike2);
		createDeleteButton();
	});
}

function giveMeOneLike2(callback)
{
	window.setTimeout(function()
	{
		var facebookLike =
			$("<div>")
					.append($("<div>")
									.attr("id","faceLikeDialogForm")
									.addClass("fb-like")
									.css({"margin-top":"43px","text-align":"center"})
									.attr("data-href","https://www.facebook.com/pages/Shape-Your-Life/145019995707312")
									.attr("data-width",650)
									.attr("data-layout","button_count")
									.attr("data-show-faces",true)
									.attr("data-send",true));

			$.desktopDialog.create(
			{
				title:shape_lang["title_like_fb"],
				text:shape_lang["give_me_like_my_shape"]+$('<div>').append(facebookLike.clone()).html()
			},
			{
				width:400,
				height:330,
				buttons:[{
					text: shape_lang["already_like"],
					click: function()
					{
						$(this).closeDialog();
					}},{
					text: shape_lang["no_like"],
					click: function()
					{
						$(this).closeDialog();
					}}]
			});
	},4000);
}

function deleteShape()
{
	$.server.delete({
		error:function(error){
			littleDialog(shape_lang["error"],shape_lang["session_error"]);
		},
		success:function(data){
			window.location="https://apps.facebook.com/shapeyourlife/";
		}
	});
/*
	$.post("elaboratePhotos.php?action=delete", {id_shape:ID_SHAPE, user_id:FACEBOOK_USER.id},
		function(data)
		{
			if (data.error!==undefined)
				littleDialog(shape_lang["error"],shape_lang["session_error"]);
			if (data.deleteError!==undefined)
				littleDialog(shape_lang["error"],shape_lang["session_error"]);
			else if (data.deleteSuccess!==undefined)
				window.location="https://apps.facebook.com/shapeyourlife/";
		}, "json");*/
}
