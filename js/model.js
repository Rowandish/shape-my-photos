//-----------------------------------------------------MODEL----------------------------------------------------//

//chiamate al server utilizzate solo dalle funzioni della versione desktop
var _desktopServerCalls =
{
  getAlbumCover:function(callback) //Fornisce al controller le album cover, chiamando come callback la funzione da lui richiesta
  {
    $.fb.albumsCover(function (data)
    {
      if ($.isFunction(callback))
        callback(data);
    });
  },
  updateDataTutorial:function()
  {
    $.server.tutorial(
    {
      success : function (data)
      {
        view.firstPage.tutorialImages(data);
      }
    });
  },
  //Prende gi album Ids per la generazione della prima shape, in modo che il numero totale delle loro foto sia almeno 35
  createFirstShape:function(callback)
  {
    $.fb.albums(function (albumsInfo)
    {
      var tmp_count = 0;
      var albumsId = [];
      $(albumsInfo).each(function (i, value)
      {
          if (tmp_count < model.settings.photoFirstShape)
          {
              albumsId.push(value.id);
              tmp_count+=parseInt(value.count, 10);
          }
      });
      //istanzia la prima shape
      model.shape = new Shape(undefined,albumsId,model.settings.initialShape,model.settings.initialBackground);

      model.shape.generateShape(function()
      {
        preloadImages(model.shape.getArrayAttribute("url"),function()
        {
          if ($.isFunction(callback))
            callback();
        });
      },function(){
        view.dialog.little(shape_lang["warning"],shape_lang["session_expired"]);
      },true);
    });
  },
  viewUrlToShare: function(share)
  {
    view.loader.show();
    var data = null;
    var popUpWindow=null;
    if (share===false)
      popUpWindow = window.open("loading.html");
    
    $.server.share(
    {
      success : function (id)
      {
        view.loader.remove();
        if (share === true)
        {
          view.loader.show();
          model.facebook.facebookUser.streamPublish(id, function ()
          {
            view.dialog.ok("ok",shape_lang["share_ok"]);
            view.loader.remove();
          });
        }
        else
        {
          link = 'http://apps.facebook.com/shapeyourlife/?photos='+id;
          popUpWindow.location.href=link;
          popUpWindow.focus();
        }
      },
      error : function (err)
      {
        view.dialog.ok(shape_lang["error"],shape_lang["session_error"]);
      }
    });
  }
};

//chiamate al server utilizzate solo dalle funzioni della versione mobile
var _mobileServerCalls =
{
  updateDataTutorial:function()
  {
    $.server.tutorial(
    {
      success : function (data)
      {
          view.firstPage.tutorialImages(data);
      }
    });
  },
};

var _settings={ //impostazioni generali
    initialShape: 11,
    initialBackground: [0,0,0],
    minNumberPhotos:25,
    photoFirstShape:35,
    minImageWidth:40,
    minImageHeight:40,
    margin:2,
    shapeSize:11
  };
var _facebook={
  facebookUser:null,
  hasLiked: false,
  create:function(callback)
  {
    this.facebookUser = new FacebookUser(callback);
  }
};

var model = {
  shape: null,
  settings:_settings,
  facebook:_facebook,
  desktopServerCalls:_desktopServerCalls,
  mobileServerCalls:_mobileServerCalls
};