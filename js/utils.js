function transpose(a)
{
    return Object.keys(a[0]).map(function (c) { return a.map(function (r) { return r[c];});});
}

//checks if you are in the facebook iframe
function isFB() {
    return window.self !== window.top;
}

function editLoader(action,src)
{
    if (action=="show" && src!==undefined)
    {
        viewBlackScreen();
        $("body")
                .append($("<div>")
                                .css({top: "25%"})
                                .addClass("containerNoOpacityLoader")
                                .append($("<img>")
                                                .addClass("loader")
                                                .attr("src",src))
                                .fadeIn("slow"));
    }
    else if (action=="remove")
    {
        $(".blackScreen, .containerNoOpacityLoader").fadeOut("medium",function(){$(this).remove();});
    }
    else
        console.log("error input parameters");
}

//visualizza solo lo schermo nero su schermo
function viewBlackScreen()
{
    $("body").append($("<div>")
                            .addClass("blackScreen")
                            .fadeTo("slow",0.8));
}


//Controlla se il browser ha abilitato i cookie da siti di terze parti, per farlo funzionare anche nell'iframe di facebook
function checkThirdPartyCookie()
{
    document.cookie = "TestForThirdPartyCookie=yes;";
    if ( document.cookie.indexOf( "TestForThirdPartyCookie=" ) == -1 )
        littleDialog(shape_lang["warning"],shape_lang["no_cookie"]);
}

//Dato l'oggetto jQuery che contiene tutte le immagini selezionate lo trasforma in un array di Id da inviare al PHP
function getIdArray(obj,attr)
{
    var Ids = [];
    obj.each(function(index,value)
    {
        Ids.push($(value).attr(attr));
    });
    return Ids;
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}


//Finestra per richiedre il like
function giveMeOneLike(callback)
{
    GLOBAL_FACEBOOK_LIKE = true;
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
        text:shape_lang["give_me_like"]+$('<div>').append(facebookLike.clone()).html()
    },
    {
        width:400,
        height:330,
        buttons:[{
            text: shape_lang["already_like"],
            click: function()
            {
                if ($.isFunction(callback))
                    callback();
                //$(this).closest('.ui-dialog-content').dialog('close'); //chiudo solo questo dialog
                $(this).closeDialog();
            }},{
            text: shape_lang["no_like"],
            click: function()
            {
                if ($.isFunction(callback))
                    callback();
                //$(this).closest('.ui-dialog-content').dialog('close'); //chiudo solo questo dialog
                $(this).closeDialog();
            }}]
    });
    FB.XFBML.parse();
}


//Aggiunge il listener per la pressione del tasto invio quando viene aperto il l'elemento in ingresso e lo toglie quando viene rimosso
var _addKeylistener = function(callback,KeyboardCode)
{
    var element = this;
    element.keyup(function(e)
    {
        if (e.keyCode == KeyboardCode)
            {
                if ($.isFunction(callback))
                {
                    callback();
                    e.preventDefault();
                    element.off('keyup');
                }
            }
    });
    return element;
};

var _setMyBalloon = function(position)
{
    var element = this;
    element.showBalloon(
        {
            tipSize: 12,
            position: position,
            showAnimation: "",
            classname: "balloonTip",
            css:
            {
                border: 'solid 4px #5baec0',
                padding: '10px',
                fontSize: '120%',
                fontWeight: 'bold',
                lineHeight: '1.5',
                backgroundColor: '#fff',
                opacity:'1',
                color: '#000'
            }
        });
    return element;

};
$.fn.extend({
    setMyBalloon:_setMyBalloon,
    addKeylistener : _addKeylistener
});