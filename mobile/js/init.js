var SELECTED_PHOTO = null;

$( document ).on( "mobileinit", mobile_init);

$(document).on("pageshow", "#loading", function () {
    if (FACEBOOK_USER === undefined)
    {
        $.mobile.loading( 'show', {
            text: shape_lang["loading_app"],
            textVisible: true,
        });
        mobile_setup();
    }
});
$(document).on("pagebeforeshow", "#shape", function (e, data)
{
    CACHED_DOM = null;

    $("#fb_share")
        .off("click")
        .click(start_share);
    $("#save_shape")
        .off("click")
        .click(function (e)
        {
            mobile_save_image();
            e.preventDefault();
            return false;
        });
    $("#edit_images")
        .off("click")
        .click(function(e)
        {
            toggleEditMode();
            e.preventDefault();
            return false;
        });

    $("#logout")
        .off("click")
        .on("click", function(e)
        {
            FACEBOOK_USER.logout();
            e.preventDefault();
            return false;
        });

    $("#shape_container")
        .empty()
        .parent()
        .css({"background": "none", "background-color": "rgb("+SHAPE.backgroundColor[0]+", "+SHAPE.backgroundColor[1]+", "+SHAPE.backgroundColor[2]+")"});

    createShapeMobile();

	return true;
	
});

$(document).on("pagebeforeshow", "#inputText", function (e, obj)
{
    $("#text_to_show").focus();
    $("#text_change")
        .off("click")
        .click(function(e)
        {
            if ($("#text_to_show").val() === "")
                $.shapeMobile.showError(shape_lang["error_letter"]);
            else
            {
                SHAPE.shapeNumber = $("#text_to_show").val();
                backHomeAndRefresh();
            }
            e.preventDefault();
            return false;
        });
});

$(document).on("pagebeforeshow", "#color", function (e)
{
    $("#color_mix").css("background-color", "rgb("+SHAPE.backgroundColor[0]+", "+SHAPE.backgroundColor[1]+", "+SHAPE.backgroundColor[2]+")");
    $("#red")
        .off("change")
        .val(SHAPE.backgroundColor[0])
        .change(function () {
            SHAPE.backgroundColor[0] = $(this).val();
            $("#color_mix").css("background-color", "rgb("+SHAPE.backgroundColor[0]+", "+SHAPE.backgroundColor[1]+", "+SHAPE.backgroundColor[2]+")");
        });
    $("#green")
        .off("change")
        .val(SHAPE.backgroundColor[1])
        .change(function () {
            SHAPE.backgroundColor[1] = $(this).val();
            $("#color_mix").css("background-color", "rgb("+SHAPE.backgroundColor[0]+", "+SHAPE.backgroundColor[1]+", "+SHAPE.backgroundColor[2]+")");
        });

    $("#blue")
        .off("change")
        .val(SHAPE.backgroundColor[2])
        .change(function () {
            SHAPE.backgroundColor[2] = $(this).val();
            $("#color_mix").css("background-color", "rgb("+SHAPE.backgroundColor[0]+", "+SHAPE.backgroundColor[1]+", "+SHAPE.backgroundColor[2]+")");
    });
});

$(document).on("pagebeforeshow", "#photos", function (e)
{
    $("#photo_list").empty();
    $.mobile.loading( 'show', {
        text: "Loading photos...",
        textVisible: true,
    });
    var width = parseInt(($(document).width() - 30) / 3.2, 10);
    $($.server.last_photos_data).each(function (i, e)
    {
        var item = generateAlbumElement(e, "Choose photo", $.server.last_photos_widths[i], $.server.last_photos_heights[i], width);
        var img = item.children().children();
        img.attr("srcLazy", img.attr("src"));
        img.attr("src", "");
        item.click(function (e)
        {
            var id = parseInt(SELECTED_PHOTO.attr("data-id"), 10);
            SHAPE.disposer.dataServer[id].url = $.server.last_photos_data[i];
            SHAPE.disposer.dataServer[id].width = $.server.last_photos_widths[i];
            SHAPE.disposer.dataServer[id].height = $.server.last_photos_heights[i];
            var size = calcOptimalMobileShapeSize();
            SYSTEM.minImageWidth = SYSTEM.minImageHeight = size;
            SHAPE.reloadDisposer();
            $.mobile.changePage("#shape");
            e.preventDefault();
            return false;
        });
        $("#photo_list").append(item);
    });
    $("#photos").find("img").lazyLoad();
});

$(document).on("pagebeforeshow", "#albums", function (e)
{
    $("#album_list").empty();
    $.mobile.loading( 'show', {
        text: shape_lang["loading_album"],
        textVisible: true,
    });
    $("#select_done")
        .off("click")
        .click(function (e) {
            if (SHAPE.albumIds.length === 0)
                $.shapeMobile.showError(shape_lang["no_album"]);
            else
                backHomeAndRefresh();
            e.preventDefault();
            return false;
        });

    var width = parseInt(($(document).width() - 30) / 3.2, 10);
    $.fb.albumsCover(function (data)
    {
        SHAPE.albumIds = [];
        $(data).each(function (i, element)
        {
            var item = generateAlbumElement(element.cover, "select this album", element.cover_width, element.cover_height, width);
            item.fadeTo(0, 0.6);
            item.click(function () {
                var index = SHAPE.albumIds.indexOf(element.link);
                if (index === -1)
                {
                    item.fadeTo(0, 1);
                    SHAPE.albumIds.push(element.link);
                }
                else
                {
                    item.fadeTo(0, 0.6);
                    SHAPE.albumIds.splice(index, 1);
                }
            });
            $("#album_list").append(item);
            $.mobile.loading('hide');
        });
    });
});

$(document).on("pagebeforeshow", "#shape_list", function (e)
{
    var icons_pos = {rect : "-300px", trirect : "-500px", trirecti : "-550px", tri : "-450px", ell : "-150px", hour : "-250px", cross : "-100px", heart : "-200px", cover : "-50px", star : "-400px", smile : "-350px", butter : "0px" };
    $("#shape_list div[data-type]").each(function (i, element)
    {
        $(element)
            .css("background-position", "0px "+icons_pos[$(element).attr("data-type")])
            .off("click")
            .click(function ()
            {
                SHAPE.shapeNumber = i;
                backHomeAndRefresh();
            });
    });

});
$(document).on("pagebeforeshow", "#draw_shape", function (e)
{
    setupGrid();
    $(window)
        .off("orientationchange resize", setupGrid)
        .on("orientationchange resize", setupGrid);

    $("table.grid")
        .find("td")
        .off("click")
        .click(function ()
        {
            $(this).toggleClass("colored");
        });
        $("#grid_confirm")
            .off("click")
            .on("click", function(e)
            {
                var matrix = [];
                $("table.grid").children("tr")
                    .each(function (i, tr)
                    {
                        $(tr)
                            .children("td")
                            .each(function(j, td)
                            {
                                if (matrix[j] === undefined)
                                    matrix[j] = [];
                                matrix[j][i] = $(td).hasClass("colored") ? 1 : 0;
                            });
                    });
                SHAPE.shapeNumber = matrix;
                backHomeAndRefresh();
                e.preventDefault();
                return false;
            });
});
