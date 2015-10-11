//Prima pagina: login a facebook e visualizzazione del tutorial

var FACEBOOK_USER = null;
var SHAPE = null;
var SYSTEM = null;
var INITIAL_SHAPE = 11;
var INITIAL_BKG = [0, 0, 0];

/*
$(document).ready(function()
{
	setAnimationTutorial();
	setAnimationLanguageSelector();
	FACEBOOK_USER = new FacebookUser(showTutorialImages);
	SYSTEM = new System();
	checkThirdPartyCookie();
});*/

//Ingranaggio che gira
function setAnimationTutorial()
{
	$("#gear").rotate({
		angle:0,
		animateTo:360,
		duration: 2000,
		callback: setAnimationTutorial,
		easing: function (x,t,b,c,d){        // t: current time, b: begInnIng value, c: change In value, d: duration
			return c*(t/d)+b;
		}
	});
}


function setAnimationLanguageSelector()
{
	$(".dropdown dt a").click(function() {
		$(".dropdown dd ul").toggle();
	});
	$(document).bind('click', function(e)
	{
		var $clicked = $(e.target);
		if (! $clicked.parents().hasClass("dropdown"))
			$(".dropdown dd ul").hide();
	});
}

//chiamato dal facebook user
function showTutorialImages()
{
	$.server.tutorial(
	{
		success : function (data)
		{
			$(".loadingShape").fadeOut(function (){
				$(this).remove();
				var images = [];
				for (var i = 0; i < data.length; i++)
					for (var j = 0; j < data[i].length; j++)
						images.push(data[i][j]["url"]);
				
				preloadImages(images, function (){
					var imageData1 = new imageDisposer(20,20,2,data[0]);
					var imageData2 = new imageDisposer(20,20,2,data[1]);
					var imageData3 = new imageDisposer(20,20,2,data[2]);
					createImageTutorial(imageData1.dataClient,"js-container0","#imageContainer",{position: "absolute", top: "-50px", left:"304px", width:"260px",height:"230px"},shape_lang["make_shape"], "right",function(){
						createImageTutorial(imageData2.dataClient,"js-container1","#imageContainer",{position: "absolute", top: "14px", left:"-17px", width:"252px",height:"140px"},shape_lang["cover_photo"], "left",function(){
							createImageTutorial(imageData3.dataClient,"js-container2","#imageContainer",{position: "absolute", top: "200px", left:"139px", width:"250px",height:"250px"},shape_lang["share_them"], "right",function(){
								$(".balloonTip").fadeTo(0, 0.7);
								$("#js-container0").fadeTo(0, 0.6);
								$("#js-container1").fadeTo(0, 0.6);
								$("#js-container2").fadeTo(0, 0.6);
								createStartButton();
							});
						});
					});
				});
			});
		}
	});
}


function createImageTutorial(data,id,appendTo,css, title, balloonPosition,callback)
{
	var element =
	$("<div>")
		.attr("id",id)
		.appendTo(appendTo)
		.css(css)
		.attr("title",title)
		.setMyBalloon(balloonPosition)
		.createShape(data);
	if ($.isFunction(callback))
		element.jsquares(callback, {fade_speed: 0, shuffle_in_speed: 70});
}


function createStartButton()
{
	$("<div>").attr("id","start")
			.css({position: "absolute", top: "50px", left: "50px", "z-index": 20})
			.attr("title",shape_lang["try_it_now"])
			.append(
					$("<img src='images/start_button.gif'>")
						.mouseover(function() {
							$(this).attr("src", "images/start_button_hover.gif");
						})
						.mouseout(function () {
							$(this).attr("src", "images/start_button.gif");
						})
						.click(function () {
							FACEBOOK_USER.login(generateInitialPhoto);
						})
					)
			.appendTo("#imageContainer")
			.setMyBalloon("top");
	
}

function generateInitialPhoto()
{
    littleDialog(shape_lang["wait"],shape_lang["processing_request"]);
    $.fb.albums(function (albumsInfo)
    {
        var tmp_count = 0;
        var albumsId = [];
        $(albumsInfo).each(function (i, value)
        {
            if (tmp_count < 35)
            {
                albumsId.push(value.id);
                tmp_count+=parseInt(value.count, 10);
            }
        });

        SHAPE = new Shape(undefined,albumsId,INITIAL_SHAPE,INITIAL_BKG);

        SHAPE.generateShape(function()
        {
			$.desktopDialog.closeAll();
			preloadImages(SHAPE.getArrayAttribute("url"),function()
			{
				removeFirstPage(function()
				{
					createPageShape();
				});
			});
        },function(){
			littleDialog(shape_lang["warning"],shape_lang["session_expired"]);
        },true);
    });
}

function removeFirstPage(callback)
{
	$.desktopDialog.closeAll();
    $("#languageSelector").remove();
	$(".balloonTip").remove();
	$("#tot *").fadeOut(300);
	$("#backgroundContainerRight").fadeOut("slow");
	$("#backgroundContainerLeft").fadeOut("slow",function()
	{
		$("body").animate({backgroundColor:'#000000'}, "slow",function()
		{
			if ($.isFunction(callback))
                    callback();
		});
	});
}

