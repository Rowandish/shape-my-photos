//---------------------------------------------CONTROLLER--------------------------------------------//


//unico accesso al js che non è MVC
$(document).ready(function(){
  controller.firstPage.init();
});

var _firstPage =
{
  init:function()
  {
    view.firstPage.init();
    view.images.preload();
    checkThirdPartyCookie(); //da spostare e rendere jquery
    model.facebook.create(model.desktopServerCalls.updateDataTutorial);
  },
  startButton:{
    src: "images/start_button.gif",
    srcHover: "images/start_button_hover.gif",
    mouseover: function(){$(this).attr("src", controller.firstPage.startButton.srcHover);},
    mouseout: function(){$(this).attr("src", controller.firstPage.startButton.src);},
    callbackClick:function()
    {
      view.dialog.little(shape_lang["wait"],shape_lang["processing_request"]);
      $(view.firstPage.balloonTip).remove();
      model.desktopServerCalls.createFirstShape(function()
      {
        view.firstPage.close(function()
        {
          view.secondPage.show();
        });
      });
    },
    click: function(){$(this).attr("src", model.facebook.facebookUser.login(controller.firstPage.startButton.callbackClick));}
  }
};

var _shape =
{
  clickImage:function(e)
  {
    view.showImageBig($(this).attr("src"));
    e.preventDefault();
    return false;
  },
  mouseover:function(e)
  {
    $(this).children(".changeImageButton").css("display","block");
  },
  mouseout:function(e)
  {
    $(this).children(".changeImageButton").css("display","none");
  },
  dblclick:function(e)
  {
    e.preventDefault();
    return false;
  },
  changeImage:function(imageToChange)
  {
    view.dialog.changeImage(imageToChange);
  }
};

var _share=
{
  shareFacebook:function()
  {
      controller.validateFunction(function(){
        model.desktopServerCalls.viewUrlToShare(true);
      });
  },
  getLink:function()
  {
    controller.validateFunction(function(){
        model.desktopServerCalls.viewUrlToShare(false);
      });
  }
};

var _toolbar =
{
  confirmReloadShape:function(val)
  {
    view.dialog.confirmReloadShape(val);
  },
  reloadShape:function(val)
  {
    model.shape.shapeNumber = val;
    if (typeof val ==="number" && val<view.shapeImages.length && val>0)
      $("#changeShape").attr("src",view.shapeImages[model.shape.shapeNumber]);
    
    view.loader.show();
    model.shape.generateShape(function(){
      preloadImages(model.shape.getArrayAttribute("url"),function()
      {
        view.loader.remove();
        view.secondPage.viewShape();
      });
    },function(){
      view.dialog.little(shape_lang["warning"],shape_lang["session_expired"]);
    });
    view.dialog.closeAll();
  },
  changeImage:function(imageToChange,index)
  {
    controller.validateFunction(function()
    {
      var id = parseInt(imageToChange.attr("data-id"), 10);
      var disposer = model.shape.disposer;
      model.shape.reloadDisposer(model.settings.minImageWidth,model.settings.minImageHeight,model.settings.margin);
      disposer.dataServer[id].url = $.server.last_photos_data[index];
      disposer.dataServer[id].width = $.server.last_photos_widths[index];
      disposer.dataServer[id].height = $.server.last_photos_heights[index];
      view.secondPage.updateShape(disposer.dataClient,imageToChange.find("img.imageAlbum"),disposer.dataServer[id].url);
      view.dialog.closeAll();
    });
  },
  album:{
    changeAlbum:function()
    {
      controller.validateFunction(function()
      {
        model.desktopServerCalls.getAlbumCover(view.dialog.changeAlbum);
      });
    },
    changeThisAlbum:function(albumIds)
    {
      if (albumIds.length === 0)
      {
        view.dialog.ok(shape_lang["warning"],shape_lang["no_album"]);
        return;
      }

      model.shape.albumIds = albumIds;

      var selectedPhotos = 0;
      $(".albumClicked").find("img").each(function(index,value){
        selectedPhotos+=parseInt($(value).attr("photo_count"),10);
      });

      if (selectedPhotos<model.settings.minNumberPhotos)
        view.dialog.tooFewPhotos(selectedPhotos);
      else
      {
        controller.generateShape(view.secondPage.viewShape);
      }
    },
    clickAlbum:function(obj)
    {
      if (obj.hasClass("albumClicked"))
        obj.removeClass("albumClicked");
      else
        obj.addClass("albumClicked");
    }
  },
  reloadThisShape:function()
  {
    controller.validateFunction(function()
    {
        view.loader.show();
        model.shape.generateShape(function()
        {
          preloadImages(model.shape.getArrayAttribute("url"),function()
          {
            view.loader.remove();
            view.secondPage.viewShape();
          });
        },
        function(){
          view.dialog.little(shape_lang["warning"],shape_lang["session_expired"]);
        });
    });
  },
  saveShape:function()
  {
    controller.validateFunction(function()
    {
        $.server.save();
    });
  },
  changeShape:function()
  {
    controller.validateFunction(function()
    {
        view.dialog.changeShape();
    });
  },
  grid:{
    width:22,
    height:11,
    dimBlock:20,
    gridContainer:null,
    container:"#gridContainer",
    classSelected:"gridElementSelected",
    create:function()
    {
      var _this = controller.toolbar.grid;
      controller.validateFunction(function()
      {
        view.dialog.drawShape(_this.width,_this.height,_this.dimBlock,_this.gridContainer);
      });
    },
    empty:function(){
      var _this = controller.toolbar.grid;
      $(_this.container).find("div").removeClass(_this.classSelected);
    },
    click:function()
    {
      var elem = $(this);
      var _this = controller.toolbar.grid;
      if (!elem.hasClass(_this.classSelected))
        elem.addClass(_this.classSelected);
      else
        elem.removeClass(_this.classSelected);
    },
    mousedown:function()
    {
      var elem = $(this);
      var _this = controller.toolbar.grid;
      elem.find("div").mouseover(function(){
        if (!$(this).hasClass(_this.classSelected))
          $(this).addClass(_this.classSelected);
        });
    },
    mouseup:function()
    {
      var _this = controller.toolbar.grid;
      $(_this.container).find("div").off('mouseover');
    }
  },
  text:
  {
    changeText:function()
    {
      controller.validateFunction(function()
      {
          view.dialog.insertText();
      });
    },
    confirm:function()
    {
      var input = $("#inputTextDialogForm");
      if (input.val()!=="")
        controller.toolbar.confirmReloadShape("#"+input.val());
      else
        view.dialog.closeAll();
    }
  },
  updateBackground:function(color)
  {
    view.updateBackground(color);
    model.shape.updateBkg(hexToRgb(color));
  }
};

var controller=
{
  generateShape:function(callback)
  {
    view.dialog.little(shape_lang["wait"],shape_lang["processing_request"]);
    model.shape.generateShape(callback);
  },
  validateFunction:function(f)
  {
    if ($.isFunction(f))
    {
      if (!model.facebook.hasLiked && model.facebook.facebookUser.isFan===false)
        view.dialog.giveMeOneLike(f);
      else
        f();
    }
  },
  firstPage:_firstPage,
  shape:_shape,
  share:_share,
  toolbar:_toolbar
};