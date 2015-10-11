var _server = {
    base_path : "//shapeyourlife.herokuapp.com",
    script_file : "/elaboratePhotos.php",
    url_target : "_blank",
    last_photos_data : null,
    last_photos_widths : null,
    last_photos_heights : null,
    last_albums_id : null,
    facebook_token : null,
    generate : function (options)
    {
        var _this = this;
        var img_urls = false;
        if (this.last_photos_data === null || !$.arrayIdentical(model.shape.albumIds, this.last_albums_id))
        {
            img_urls = true;
            this.last_albums_id = [];
            $(model.shape.albumIds).each(function(i, el) {_this.last_albums_id.push(el);});
        }
        var defaults = {albums : model.shape.albumIds, shape : model.shape.shapeNumber, duplicates : false, get_image_urls : img_urls, error : function () {}, success : function () {} };
        $.extend(defaults, options);
        var send_data = {albumIds : defaults.albums, shape: defaults.shape};
        var url = this.base_path + this.script_file+"?action=generate&duplicates="+defaults.duplicates+"&get_image_urls="+defaults.get_image_urls;
        if (this.facebook_token !== null)
            url += "&token="+this.facebook_token;
        $.post(url, send_data, function(data)
        {
            if (data.error !== undefined)
            {
                if ($.isFunction(defaults.error))
                    defaults.error(data.error);
            }
            else
            {
                if ($.isFunction(defaults.success))
                    defaults.success(data);
                if (data.images !== undefined)
                {
                    _this.last_photos_data = data.images;
                    _this.last_photos_widths = data.width;
                    _this.last_photos_heights = data.height;
                }
            }
        }, "json");
    },
    share_last_id : false,
    share : function (options)
    {
        var txt = (typeof model.shape.shapeNumber == "string" ? 0 : 1);
        var defaults = {data : model.shape.disposer.dataServer, albumIds : model.shape.albumIds, name : model.facebook.facebookUser.name, bkg : model.shape.backgroundColor, is_text: txt, user_id : model.facebook.facebookUser.id, user_mail : model.facebook.facebookUser.email, error : function () {}, success : function () {}};
        $.extend(defaults, options);
        var data_to_send = {data : defaults.data, albumIds : defaults.albumIds, name : defaults.name, bkg : defaults.bkg, is_text: defaults.is_text, user_id : defaults.user_id, user_mail : defaults.user_mail};
        var url = this.base_path + this.script_file+"?action=share";
        $.post(url, data_to_send ,function(data)
        {
            _server.share_last_id = data.id;
            if (data.error!==undefined)
            {
                if ($.isFunction(defaults.error))
                    defaults.error(data.error);
            }
            else
                if ($.isFunction(defaults.success))
                    defaults.success(data.id);
        }, "json");
    },
    tutorial : function (options)
    {
        var defaults = {data : {}, error : function () {}, success : function () {}};
        $.extend(defaults, options);
        var url = this.base_path + this.script_file+"?action=sample";
        $.post(url, defaults.data, function(data)
        {
            if ($.isFunction(defaults.success))
                defaults.success(data);
        }, "json");
    },
    save : function(options)
    {
        //var defaults = {data : DISPOSER.dataClient, color : GLOBAL_BACK_COLOR};
        var defaults = {data : model.shape.disposer.dataServer, color : model.shape.backgroundColor, target : this.url_target};
        $.extend(defaults, options);
        /*jshint multistr: true */
        var hiddenForm = $("<form name=\"input\" action=\""+this.base_path+"/composition.jpg\" method=\"post\" style=\"display:none\"> \
                                <input type=\"hidden\" name=\"data\" value=\""+encodeURIComponent(JSON.stringify(defaults.data))+"\"> \
                                <input type=\"hidden\" name=\"backgroundColor\" value=\""+encodeURIComponent(JSON.stringify(defaults.color))+"\"> \
                                <input type=\"submit\" value=\"Submit\"> </form>").attr("target",defaults.target).appendTo("body").submit();
        hiddenForm.remove();
    },
    saveMobile : function(options)
    {
        //var defaults = {data : DISPOSER.dataClient, color : GLOBAL_BACK_COLOR};
        var defaults = {data : model.shape.disposer.dataServer, color : model.shape.backgroundColor, error : null, success : null};
        $.extend(defaults, options);
        var data = {data : defaults.data, color : defaults.color};
        var url = this.base_path + this.script_file+"?action=download";
        $.post(url, data, function(data)
            {
                if (data.error!==undefined)
                {
                    if ($.isFunction(defaults.error))
                        defaults.error(data.error);
                }
                else
                {
                    if ($.isFunction(defaults.success))
                        defaults.success(data);
                }
            }, "json");
    },
    delete : function (options)
    {
        var defaults = {data : {id_shape : ID_model.shape, user_id : model.facebook.facebookUser.id}, success : function () {}, error : function() {}};
        $.extend(defaults, options);
        var url = this.base_path + this.script_file+"?action=delete";
        $.post(url, defaults.data, function(data)
            {
                if (data.error!==undefined)
                {
                    if ($.isFunction(defaults.error))
                        defaults.error(data.error);
                }
                else
                {
                    if ($.isFunction(defaults.success))
                        defaults.success(data);
                }
            }, "json");
    }

};
var _facebook = {
    albums : function (success)
    {
        var query = {"query1":'select link,photo_count from album where owner = me() and photo_count>0',
                     "query2":'select "" from photo_tag where subject = me()',};
        model.facebook.facebookUser.fql(query, function (response)
        {
            var albums = response.data[0].fql_result_set;
            var tagged_count = response.data[1].fql_result_set.length;
            var albumsInfo = [];
            $(albums).each(function(index,value)
            {
                if (value.link === null)
                    return;
                albumsInfo.push({id : value.link.replace(/.*fbid=([0-9]+)&id=.*&aid=.*/g,"$1"), count : value.photo_count});
            });
            albumsInfo.push({id : "tagged", count : tagged_count});
            albumsInfo.sort(function (a, b)
            {
                return (a.count < b.count ? 1 : -1);
            });
            if ($.isFunction(success))
                success(albumsInfo);
        });
    },
    albumsCover : function (success)
    {
        var query =
        {
            "query1":"SELECT src,src_width,src_height FROM photo WHERE pid IN (SELECT pid FROM photo_tag WHERE subject=me())",
            "query2":'SELECT aid, name,link,photo_count,cover_object_id from album where owner = me() and photo_count>0',
            "query3":"SELECT aid, src,src_width,src_height FROM photo WHERE object_id  IN (SELECT cover_object_id FROM #query2 WHERE link)"
        };
        model.facebook.facebookUser.fql(query, function (response)
        {
            var tagged = response.data[0].fql_result_set;
            var albums = response.data[1].fql_result_set;
            var photos = response.data[2].fql_result_set;

            var parsed = [];

            var indexCover = 0;
            
            if (tagged.length > 0)
            {
                parsed.push(
                {
                    title : "Tagged Photos",
                    cover : tagged[0].src,
                    cover_width: tagged[0].src_width,
                    cover_height: tagged[0].src_height,
                    photo_count: tagged.length,
                    link :"tagged"
                });
            }

            $(albums).each(function(index,value)
            {
                if (photos[index - indexCover] ===undefined || value.link === null)
                    return;
                var result =
                {
                    title : value.name,
                    cover : photos[index-indexCover].src,
                    cover_width: photos[index-indexCover].src_width,
                    cover_height: photos[index-indexCover].src_height,
                    photo_count: value.photo_count,
                    link : value.link.replace(/.*fbid=([0-9]+)&id=.*&aid=.*/g,"$1")
                };
                if (albums[index].cover_object_id=="0")
                {
                    result["cover"] = "https://facebook.com/images/photos/empty-album.png";
                    result["cover_width"] = 206;
                    result["cover_height"] = 206;
                    indexCover++;
                }
                parsed.push(result);
            });
            //success deve essere la funzione getData
            if ($.isFunction(success))
                success(parsed);
        });
    }
};
var _createShape = function (data, options) {
        var element = this;
        var defaults = {click : null, mouseover : null, mouseout : null};
        $.extend(defaults, options);
        var string = "";
        for (var i = 0; i < data.length; ++i)
        {
            var image = data[i];
            
            /*jshint multistr: true */
            string +=
            "<div class='js-image' data-id='"+i+"' style='top:"+image["top"]+";left:"+image["left"]+";width:"+image["container-width"]+";height:"+image["container-height"]+";'> \
                <a> \
                    <img class='imageAlbum' src='"+image["url"]+"' style='width: "+image["width"]+"; height: "+image["height"]+"; margin-left: "+image["margin-left"]+"; margin-top: "+image["margin-top"]+"' /> \
                </a> \
            </div>";

        }
        element.html(string);
        var a_element = element.find("a");
        if (defaults.mouseover)
            a_element.mouseover(defaults.mouseover);
        if (defaults.mouseout)
            a_element.mouseout(defaults.mouseout);
        //if ($.isMobile === false)
           // a_element.append($("<div class='blackCover'>"));
        var img_element = element.find("img");
        if (defaults.click !== null)
            img_element.click(defaults.click);

        return element;
    };
var _createShape2 = function (data, options) {
        var element = this;
        var defaults = {click : null, mouseover : null, mouseout : null};
        $.extend(defaults, options);

        for (var i = 0; i < data.length; ++i)
        {
            var image = data[i];

            var img_element =
            $("<img class='imageAlbum'>")
                .attr("src", image["url"])
                .css({width : image["width"], height : image["height"], marginLeft : image["margin-left"], marginTop : image["margin-top"] });

            if (defaults.click !== null)
                img_element.click(defaults.click);

            var a_element =
            $("<a>")
                .append(img_element);

            if (defaults.mouseover)
                a_element.mouseover(defaults.mouseover);
            if (defaults.mouseout)
                a_element.mouseout(defaults.mouseout);

            if ($.isMobile === false)
                a_element.append($("<div class='blackCover'>"));

            $("<div class='js-image'>")
                .attr("data-id", i)
                .css({"top" : image["top"], "left" : image["left"], "width":image["container-width"], "height":image["container-height"]})
                .appendTo(element)
                .append(a_element);
            
        }
        return element;
    };
var _updateShape = function (data) {
        var element = this;
        var images = element.children();//.children("div.js-image");
        for (var i = 0; i < images.length; i++)
        {
            var val = $(images[i]);
            var image = data[val.attr("data-id")];
            val
                .css({"top" : image["top"], "left" : image["left"], "width":image["container-width"], "height":image["container-height"]})
                .children().children()
                .css({width : image["width"], height : image["height"], marginLeft : image["margin-left"], marginTop : image["margin-top"] });
        }
        return element;
    };
var _centerShape = function (width) {
        return this.css("left", $(window).width() / 2 - width / 2);
    };

function _lazyLoad()
{
    var obj = this;
    var updateShowing = function ()
    {
        obj.each(function()
        {
            if ($(this).inView())
                $(this).attr("src", $(this).attr("srcLazy"));
        });
    };
    updateShowing();
    $(document).scroll(updateShowing);
    if($.isMobile === false)
        $(".ui-dialog-content").scroll(updateShowing);
}

function _inView()
{
    var elem = this;
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elemTop = elem.offset().top;
    var elemBottom = elemTop + elem.height();
    return ((elemBottom <= docViewBottom && elemBottom >= docViewTop) || (elemTop >= docViewTop && elemTop <= docViewBottom));
}

var _shapemobile = {
    showError : function (label)
    {
        $.mobile.loading( 'show', {
                text: label,
                textonly: true,
                textVisible: true,
            });
        setTimeout(function () {$.mobile.loading("hide");}, 3000);
    }
};

var preloadedImages = [];
function preloadImages(images, callback)
{
    var preloadCounter = 0;
    for (var i = 0; i < images.length; i++)
    {
        var preloaded = new Image();
        if ($.isFunction(callback)) {
            preloaded.onload = function () {
                preloadCounter++;
                if (preloadCounter >= images.length) {
                    preloadCounter = 0;
                    if ($.isFunction(callback))
                        callback();
                }
            };
        }
        preloaded.src = images[i];
        preloadedImages.push(preloaded);
    }
}



//Metodi dinamici associati ad un selettore
$.fn.extend({
    createShape : _createShape,
    createShape2 : _createShape2,
    updateShape : _updateShape,
    centerShape : _centerShape,
    lazyLoad : _lazyLoad,
    inView : _inView
});

//Metodi statici che possono essere eseguiti sempre
$.extend({
    server : _server,
    fb : _facebook,
    shapeMobile : _shapemobile,
    isMobile : false,
    isFunction : function (functionToCheck)
    {
        var getType = {};
        return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
    },
    arrayIdentical : function (a, b)
    {
        if (a === null || b === null || a === undefined || b === undefined)
            return false;
        else if (a.length != b.length)
            return false;
        else
            return ($(a).not(b).length === 0 && $(b).not(a).length === 0);
    },
    countElements : function (obj)
    {
        var i = 0;
        for (var k in obj)
            ++i;
        return i;
    }
});
