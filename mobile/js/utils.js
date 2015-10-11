var FACEBOOK_USER, INIT;
var SHAPE_SIZE = 11;

var SHAPE, SYSTEM;


function start()
{
    generateInitialPhoto(function () {
        $.mobile.loading( 'hide' );
        $.mobile.changePage("#shape");
    });
}
function shapePositioning()
{
    if (typeof SHAPE.shapeNumber !== "string")
    {
        $("#mobile_shape")
            .centerShape(SHAPE.disposer.getMaxWidth());
    }
    $("#shape_container").css({height : $(window).height()});
}
var _LAST_SIZE = 0;
var CACHED_DOM = null;
var _change = function ()
{
    var size = calcOptimalMobileShapeSize();
    if (size == _LAST_SIZE)
        return;

    SYSTEM.minImageWidth = SYSTEM.minImageHeight = size;
    SHAPE.reloadDisposer();

    var shape = $("#mobile_shape");

    if (CACHED_DOM !== null && CACHED_DOM.attr("data-size") == size)
    {
        CACHED_DOM.show().attr("id", "mobile_shape").removeAttr("data-size");
        CACHED_DOM = shape.hide().attr("id", "mobile_shape_cache").attr("data-size", _LAST_SIZE);
    }
    else
    {
        if (CACHED_DOM !== null)
            CACHED_DOM.remove();
        CACHED_DOM = shape.clone().attr("id", "mobile_shape_cache").attr("data-size", _LAST_SIZE).appendTo(shape.parent()).hide();
        CACHED_DOM.find("a").photoSwipe();
        shape.updateShape(SHAPE.data);
    }
    _LAST_SIZE = size;
    shapePositioning();
    return false;
};
function createShapeMobile()
{
    CACHED_DOM = null;
    $(window).off('orientationchange resize', _change);
    var shape = $("<div id='mobile_shape'>")
        .appendTo("#shape_container")
        .createShape(SHAPE.data);
    shapePositioning();
    
    $(window).on('orientationchange resize', _change);
    var photos = shape.find("a");
    photos.each(function (i, val) {
        $(val).attr("href", $(val).children("img").attr("src"));
    });
    photos.photoSwipe();
}
function calcOptimalMobileShapeSize()
{
    var minWidth = parseInt(($(window).width() - 20) / SHAPE_SIZE, 10) - SYSTEM.margin;
    var minHeight = parseInt(($(window).height() - 70) / SHAPE_SIZE, 10) - SYSTEM.margin;
    var size = minWidth > minHeight ? minHeight : minWidth;//Math.min(minWidth, minHeight);
    return size;
}
function regenerateShape()
{
    $.mobile.loading( 'show', {
        text: shape_lang["loading_shape"],
        textVisible: true,
    });
    $("#menu").panel('close');
    var size = calcOptimalMobileShapeSize();
    SYSTEM.minImageWidth = SYSTEM.minImageHeight = size;
    SHAPE.generateShape(function ()
    {
        $("#mobile_shape").remove();
        $.mobile.loading("hide");
        createShapeMobile();
    }, function ()
    {
        $.shapeMobile.showError(shape_lang["session_expired"]);
    });
}
function generateInitialPhoto(callback)
{
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

        SYSTEM = new System();
        var size = calcOptimalMobileShapeSize();
        SYSTEM.initialBackground = [255, 255, 255];
        SYSTEM.minImageWidth = SYSTEM.minImageHeight = size;
        SHAPE = new Shape(undefined, albumsId, SYSTEM.initialShape, SYSTEM.initialBackground);
        SHAPE.generateShape(callback, function ()
        {
            $.shapeMobile.showError(shape_lang["session_expired"]);
        }, true);
    });
}

function backHomeAndRefresh()
{
    $.mobile.loading( 'show', {
        text: shape_lang["loading_shape"],
        textVisible: true,
    });

    var size = calcOptimalMobileShapeSize();
    SYSTEM.minImageWidth = SYSTEM.minImageHeight = size;
    SHAPE.generateShape(function ()
    {
        $.mobile.loading("hide");
        $.mobile.changePage("#shape");
    }, function ()
    {
        $.shapeMobile.showError(shape_lang["session_expired"]);
    }, true);
}

function setupGrid()
{
    var width = $(document).width()-30;
    $(".grid")
        .width(width)
        .height(width);
}
var tutorial_disposer1, tutorial_disposer2;
var _tutorial_change = function ()
{
    var size = Math.min((parseInt(($(window).width() - 20) / SHAPE_SIZE, 10) - SYSTEM.margin) / 2, ($(window).height()-20) / SHAPE_SIZE) ;
    tutorial_disposer1.update(size, size, SYSTEM.margin);
    tutorial_disposer1._image
        .css({left: "0px"})
        .updateShape(tutorial_disposer1.dataClient);
    tutorial_disposer3.update(size, size, SYSTEM.margin);
    tutorial_disposer3._image
        .css({top : (($(window).height() - 20) - tutorial_disposer3.getMaxHeight() + 10)+"px"})
        .css({left : (($(window).width() - 20) - tutorial_disposer3.getMaxWidth())+"px"})
        .updateShape(tutorial_disposer3.dataClient);
    size = Math.min($(window).width() / 2, $(window).height() / 2);
    $(".loadingShape div")
        .css({width : size+"px", left : ($(window).width()/2+(size / -2))+"px", top: ($(window).height()/2+(size / -2))+"px"});
};
function initTutorial(data)
{
    SYSTEM = new System();
    var size = Math.min((parseInt(($(window).width() - 20) / SHAPE_SIZE, 10) - SYSTEM.margin) / 2, ($(window).height()-20) / SHAPE_SIZE) ;
    tutorial_disposer1 = new imageDisposer(size, size, SYSTEM.margin, data[0]);
        /*disposer2 = new imageDisposer(size, size, SYSTEM.margin, data[1]),*/
    tutorial_disposer3 = new imageDisposer(size, size, SYSTEM.margin, data[2]);
    tutorial_disposer1._image = $("<div class='mobile_shape' id='tut1'>")
        .css({left: "0px"})
        .appendTo("#loadContent")
        .createShape(tutorial_disposer1.dataClient);
    tutorial_disposer3._image = $("<div class='mobile_shape' id='tut2'>")
        .css({top : (($(window).height() - 20) - tutorial_disposer3.getMaxHeight() + 10)+"px"})
        .css({left : (($(window).width() - 20) - tutorial_disposer3.getMaxWidth())+"px"})
        .appendTo("#loadContent")
        .createShape(tutorial_disposer3.dataClient);

    size = Math.min($(window).width() / 2, $(window).height() / 2);
    $(".loadingShape div")
        .css({width : size+"px", left : ($(window).width()/2+(size / -2))+"px", top: ($(window).height()/2+(size / -2))+"px"})
        .fadeOut(0, function(){
            $(this).fadeIn();
        });
    $("#tutorial")
        .fadeIn();
    $(window).on('orientationchange resize', _tutorial_change);

    //$(window).on('orientationchange resize', _change);
    /*$("#mobile_shape a").each(function (i, val) {
        $(val).attr("href", $(val).children("img").attr("src"));
    });*/

}

function generateAlbumElement(src, title, inner_width, inner_height, width)
{
    var calcwidth = parseInt(inner_width * (width - 12) / inner_height, 10),
        calcheight = parseInt(width - 12, 10),
        margin_left = parseInt((calcwidth - width)/-2, 10),
        margin_top = 0;
        //margin = ((width - 12 - ((width - 12) * inner_height / inner_width))/2)+"px";
    if (inner_width < inner_height)
    {
        calcheight = parseInt(inner_height * (width - 12) / inner_width, 10);
        calcwidth = parseInt(width - 12, 10);
        margin_top = parseInt((calcheight - width)/-2, 10);
        margin_left = 0;
        //margin = ((width - 12 - ((width - 12) * inner_width / inner_height))/2)+"px";
    }
   // margin = (calcheight != "auto" ? "margin-left: "+margin : "margin-top: "+margin);
    return $('<li style="width:'+width+'px; height:'+width+'px"><a><img style="margin-top:'+margin_top+'px; margin-left:'+margin_left+'px; width: '+calcwidth+'px; height:'+calcheight+'px" src="'+src+'" alt="'+title+'" /></a></li>');
}

function toggleEditMode()
{
    var shape = $("#mobile_shape");
    var images = shape.find("a");
    if (shape.hasClass("edit"))
    {
        images
            .off("click")
            .photoSwipe({ enableMouseWheel: false , enableKeyboard: false });
        shape.removeClass("edit");
         $('#edit_images').buttonMarkup({ icon: "edit" });
    }
    else
    {
        images
            .off("click")
            .on("click", function(e) {
                SELECTED_PHOTO = $(this).parent();
                $('#edit_images').buttonMarkup({ icon: "edit" });
                shape.removeClass("edit");
                $.mobile.changePage("#photos");
                e.preventDefault();
                return false;
            });
         $('#edit_images').buttonMarkup({ icon: "delete" });
        shape.addClass("edit");
    }
}


function start_share(e)
{
    $.mobile.loading( 'show', {
        text: shape_lang["loading"],
        textVisible: true,
    });
    $.server.share({
        success : function (id)
        {
            $.mobile.loading( 'hide' );
            FACEBOOK_USER.streamPublish(id, function ()
            {
                $.shapeMobile.showError(shape_lang["share_ok"]);
            });
        },
        error : function (err)
        {
            $.mobile.loading( 'hide' );
            $.shapeMobile.showError(shape_lang["error_msg"]);
        }
    });
    e.preventDefault();
    return false;
}

function initFacebook(status)
{
    if (status)
        start();
    else
    {
        $.server.tutorial({
            success : function (data)
            {
                initTutorial(data);
                $.mobile.loading( 'hide' );
                $("#tutorial").click(function () {
                    $("#tutorial").off("click");
                    FACEBOOK_USER.login(undefined, "inside");
                });
            }
        });
    }
}