//-----------------------------------------------------VIEW----------------------------------------------------//

var _firstPage=
{
    gear:$("#gear"),
    languageSelectorClass:$(".dropdown"),
    firstImage:$(".loadingShape"),
    languageSelector:$("#languageSelector"),
    containers:{
      "0":$("#js-container0"),
      "1":$("#js-container1"),
      "2":$("#js-container2"),
    },
    balloonTip:".balloonTip",
    buttonStart:$("#start"),
    tot: $("#tot"),
    backgroundLeft:$("#backgroundContainerLeft"),
    backgroundRight:$("#backgroundContainerRight"),
    body:$("body"),
    init:function()
    {
      var animateScreenImage = function(object)
      {
        object.rotate({
        angle:0,
        animateTo:360,
        duration: 2000,
        callback: function(){animateScreenImage(object);},
        easing: function (x,t,b,c,d){        // t: current time, b: begInnIng value, c: change In value, d: duration
          return c*(t/d)+b;
          }
        });
      };
      animateScreenImage(this.gear);
    },
    tutorialImages: function(data) //gli arrivano i dati dal server e il metodo pensa alla visualizzazione
    {
      //metodi privati
      //-----------------------------------------------------------------------------
      var createImageTutorial = function(obj,data,balloonPosition,callback)
      {
        var element =
        obj
          .setMyBalloon(balloonPosition)
          .createShape(data);
        if ($.isFunction(callback))
          element.jsquares(callback, {fade_speed: 0, shuffle_in_speed: 70, hover_animation:false});
      };

      var createStartButton = function()
      {
        _this.buttonStart.show();
        _this.buttonStart.find("img")
                    .setMyBalloon("top")
                    .mouseover(controller.firstPage.startButton.mouseover)
                    .mouseout(controller.firstPage.startButton.mouseout)
                    .click(controller.firstPage.startButton.click);
      };

      var animateLanguage = function(object)
      {
        object.children("dt").children("a").click(function() {
        object.children("dd").children("ul").toggle();
        });
        $(document).bind('click', function(e)
        {
          var $clicked = $(e.target);
          if (! $clicked.parents().hasClass(object))
          {
            object.children("dd").children("ul").hide();
            $(document).unbind("click");
          }
        });
      };
      //-----------------------------------------------------------------------------
      
      //metodo effettivo
      var _this = view.firstPage;

      _this.firstImage.fadeOut(function ()
      {
        $(this).remove();
        animateLanguage(_this.languageSelectorClass);
        _this.containers["0"].show();
        _this.containers["1"].show();
        _this.containers["2"].show();

        var images = [];
        for (var i = 0; i < data.length; i++)
          for (var j = 0; j < data[i].length; j++)
            images.push(data[i][j]["url"]);
        
        preloadImages(images, function (){
          var imageData=[new imageDisposer(20,20,2,data[0]),new imageDisposer(20,20,2,data[1]),new imageDisposer(20,20,2,data[2])];
          createImageTutorial(_this.containers["0"],imageData[0].dataClient,"right",function(){
            createImageTutorial(_this.containers["1"],imageData[1].dataClient,"left",function(){
              createImageTutorial(_this.containers["2"],imageData[2].dataClient,"right",function(){
                $(_this.balloonTip).fadeTo(0, 0.7);
                _this.containers["0"].fadeTo(0, 0.7);
                _this.containers["1"].fadeTo(0, 0.7);
                _this.containers["2"].fadeTo(0, 0.7);
                createStartButton();
              });
            });
          });
        });
      });
    },
    close:function(callback)
    {
      this.languageSelector.remove();
      this.tot.children().fadeOut(300);
      this.backgroundRight.fadeOut("slow");
      this.backgroundLeft.fadeOut("slow",function()
      {
        view.dialog.closeAll();
        view.firstPage.body.animate({backgroundColor:'#000000'}, "slow",function()
        {
          if ($.isFunction(callback))
            callback();
        });
      });
    },
};

var _secondPage={
  //caching: in questo modo esegue le query una sola volta, velocizzando il codice
  shapeContainer:$("#js-container"),
  shapeScreen:$("#shapeScreen"),
  shareShape:$("#shareShape"),
  getLink:$("#getLink"),
  viewAlbums:$("#albums"),
  reloadShape:$("#reload"),
  saveShape:$("#save"),
  changeShape:$("#changeShape"),
  changeText:$("#changeText"),
  drawShape:$("#drawShape"),
  changeBackground:$("#changeBackground"),
  show:function()
  {
    this.shapeScreen.show();
    this.viewShape();
    this.shareShape.click(controller.share.shareFacebook);
    this.getLink.click(controller.share.getLink);
    this.viewAlbums.click(controller.toolbar.album.changeAlbum);
    this.reloadShape.click(controller.toolbar.reloadThisShape);
    this.saveShape.click(controller.toolbar.saveShape);
    this.changeShape.click(controller.toolbar.changeShape);
    this.changeText.click(controller.toolbar.text.changeText);
    this.drawShape.click(controller.toolbar.grid.create);
    this.changeBackground.change(controller.toolbar.updateBackground)
                         .css("background-color","black");
  },
  viewShape:function() //visualizza una shape già presente nel model (in model.shape)
  {
    var shapeContainer = view.secondPage.shapeContainer;
    shapeContainer.find("div").fadeOut("fast",function(){
    $(this).remove();
    });
    view.dialog.closeAll();
    
    shapeContainer
      .createShape(model.shape.disposer.dataClient,
        {
          click: controller.shape.clickImage,
          mouseover:controller.shape.mouseover,
          mouseout:controller.shape.mouseout,
          dblclick:controller.shape.dblclick
        });

    //appendo la matita ad ogni immagine. Qeusto metodo non dovrebbe essre incluso in createShape??
    shapeContainer.find("a")
        .append($("<img>")
                .addClass("changeImageButton")
                .attr("src","images/pencil.png")
                .attr("title",shape_lang["change_image_button"])
                .tooltip()
                .click(function(){
                  controller.shape.changeImage($(this).parent().parent());
                })
            );

    shapeContainer.jsquares();
    //Se ho inserito un testo di 3 o più lettere non centro la shape, altrimenti sì
    if (typeof model.shape.shapeNumber == "string" && model.shape.shapeNumber.length>3)
      shapeContainer.css("left",0);
    else
      shapeContainer.centerShape(model.shape.disposer.getMaxWidth());
  },
  updateShape:function(data,objToChange,src) //Aggiorna la shape in caso di cambiamenti di immagine
  {
      this.shapeContainer.updateShape(data);
      objToChange.attr("src",src);
  },
  makeSquareImg:function(obj,width,height,finalDim)
  {
    if (width<height)
    {
      var newHeight = finalDim * height / width;
      obj.css("width", finalDim + "px").css("margin-top", "-" + ((newHeight - finalDim)/2)+"px");
    }
    else
    {
      var newWidth = finalDim * width / height;
      obj.css("height", finalDim + "px").css("margin-left", "-" + ((newWidth - finalDim)/2)+"px");
    }
  }
};

var _dialog =
{
  little:function(title,text)
  {
    $.desktopDialog.create(
    {
      title:title,
      text:text,
      noEscape:true
    },
    {
      width:300,
      height:120
    });
  },
  ok:function(title,text)
  {
    $.desktopDialog.create(
    {
        title:title,
        text:text,
    }).addButton("Ok");
  },
  closeAll:function()
  {
    $.desktopDialog.closeAll();
  },
  giveMeOneLike:function(callback)
  {
    model.facebook.hasLiked = true;
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
                $(this).closeDialog();
            }},{
            text: shape_lang["no_like"],
            click: function()
            {
                if ($.isFunction(callback))
                    callback();
                $(this).closeDialog();
            }}]
    });
    FB.XFBML.parse();
  },
  changeImage:function(imageToChange)
  {
    var imageTable = $("<div id='imageDiv'>").css("width","100%");
    $($.server.last_photos_data).each(function(index,value)
    {
      imageTable.append($("<div>") //trasformare questi metodi utilizzando la concatenazione tra stringhe e attributi della classe
                    .addClass("imageContainerPhoto")
                    .attr("id","imageAlbum"+index)
                    .append($("<div>")
                            .addClass("divCropPhoto")
                            .attr("id","divCropImage"+index)
                            .append($("<img>")
                                    .attr("data-id",index)
                                    .attr("srcLazy",value)
                                    .addClass("lazy")
                                    .click(function()
                                      {
                                        controller.toolbar.changeImage(imageToChange,index);
                                      })
                                    )
                            )
                    );
    });
    $.desktopDialog.create({
      title:shape_lang["change_image_dialog"],
      text:imageTable
    },
    {
      width:750,
      height:420
    });
    for (var i = 0; i <= $.server.last_photos_widths.length; i++)
      view.secondPage.makeSquareImg($("#divCropImage"+i).children("img"),$.server.last_photos_widths[i],$.server.last_photos_heights[i],100);
    $(".lazy").lazyLoad();
  },

  changeAlbum:function(data)
  {
    var albums =$("<div>")
                    .append(
                        $("<div>")
                            .attr("id", "gallery")
                            .css({"height":"auto" , "width" : "90%" , "margin": "auto", "overflow": "hidden"}));
    $.desktopDialog.create(
    {
      title:shape_lang["select_your_album"],
      text:albums
    },
    {
      width:900,
      height:420,
      buttons:
      {
        "Shape it":function(){
          var albumIds = getIdArray($(".albumClicked").find("img"),"albumId");
          controller.toolbar.album.changeThisAlbum(albumIds);
        },
        "Cancel":view.dialog.closeAll
      }
    });
    
    var albumsTable = $("<div id='albumDiv'>").css("width","100%");
    $("#gallery").append(albumsTable).css("overflow","hidden");
    $(data).each(function (index, value) //da rifare togliendo jquery e concatenando stringhe!
    {
      var albumId = value.link.replace(/.*fbid=([0-9]+)&id=.*&aid=.*/g,"$1");
      var title = value.title.length<25 ? value.title.substr(0,25) : value.title.substr(0,25)+"...";
      $("#albumDiv")
         .append($("<div>")
                .addClass("imageContainerAlbum")
                .attr("id","imageAlbum"+index)
                .click(function()
                {
                  controller.toolbar.album.clickAlbum($(this).children(".divCrop"));
                })
                .append($("<div>")
                        .addClass("titleAlbum")
                        .html(title))
                        .append($("<div>")
                                .addClass("divCrop")
                                .attr("id","divCrop"+index)
                                .append($("<img>")
                                        .addClass("albumsCover")
                                        .attr("src",value.cover)
                                        .attr("title",value.title)
                                        .attr("photo_count",value.photo_count)
                                        .attr("albumId",albumId)
                                        )
                                )
                );

    //Dato l'indice di un album, ne rende le album cover corrispondente quadrata
    view.secondPage.makeSquareImg($("#divCrop"+index).children("img"),parseInt(value.cover_width,10),parseInt(value.cover_height,10),150);
        });
    $(".albumsCover").lazyLoad();
    $("#gallery").css("overflow","auto");
   },
   tooFewPhotos:function(photosNumber)
   {
      $.desktopDialog.create(
      {
        title: shape_lang["warning"],
        text:shape_lang["too_few_photo1"]+photosNumber+shape_lang["too_few_photo2"]
      },
      {
        width:300,
        height:220,
        buttons:{
          "Ok": function(){
            controller.generateShape(view.secondPage.viewShape);
          },
          Cancel: $(this).closeDialog
        }
      });
    },
    changeShape:function()
    {
      var shapeContainer = $("<div>")
          .attr("id","shapeContainer")
          .css({"text-align": "center" , "width": "100%" , "height": "100%" , "cursor": "pointer"});
      
      $.each(view.shapeImages , function(index, value){
        shapeContainer.append($("<div class='chooseShape'>")
                      .css("background-position",value)
                      .click(function(){controller.toolbar.confirmReloadShape(index);})
                      );
      });

      $.desktopDialog.create({
        title:shape_lang["change_shape"],
        text:shapeContainer,
        backgroundColor:"#4f4f4f"
      },
      {
        width:420,
        height:390,
      }).addButton("cancel");

      $(".ui-widget-content").css("background-color","#4f4f4f");
    },
    confirmReloadShape:function(val)
    {
      $.desktopDialog.create({
        title:shape_lang["warning"],
        text:shape_lang["confirm_reload_shape"]
      },{
        width:300,
        height:180,
        buttons:{
          "Ok":function(){
            controller.toolbar.reloadShape(val);
          },
          "Cancel":view.dialog.closeAll
        }
      });
    },
    insertText:function()
    {
      $.desktopDialog.create(
      {
        title:shape_lang["insert_text"],
        text:$("<input>")
                .attr("type","text")
                .attr("placeholder",shape_lang["placeholder_text"])
                .attr("id","inputTextDialogForm")
      },{
        width:300,
        height:170,
        buttons:{
          "Ok":controller.toolbar.text.confirm,
          "Cancel":view.dialog.closeAll,
        }
      }).addKeylistener(controller.toolbar.text.confirm,13);
    },
    drawShape:function(width,height,dimBlock,gridContainer)
    {
      var createGrid = function()
      {
        var dialogGrid = $("<div>").attr("id","dialogGrid");
        if (gridContainer===null)
        {
          var gridContainerNew = $("<div>")
                        .attr("id","gridContainer")
                        .css("width",489);
          for (var i = 1; i < width*height+1; i++)
          {
            $("<div>")
                .addClass("gridElement")
                .addClass("i-value"+i%width)
                .addClass("j-value"+i%height)
                .css("width",dimBlock)
                .css("height",dimBlock)
                .css("border",1+"px solid black")
                .appendTo(gridContainerNew);
          }
          gridContainer = gridContainerNew;
        }
        controller.toolbar.grid.gridContainer = gridContainer;
        dialogGrid
            .append(gridContainer);

        return dialogGrid;
      };

      var convertGrid = function(width,height)
      {
        var mat = [];
        $(".gridElement").each(function(index,value)
        {
          if ($(value).hasClass("gridElementSelected"))
            mat.push(1);
          else
            mat.push(0);
        });
        var x = new Array(width);
        for (var i = 0; i < height; i++)
        {
          x[i] = mat.slice(0+i*width,width+i*width);
        }
        return transpose(x);
      };
      
      $.desktopDialog.create({
        title:shape_lang["create_shape"],
        text:createGrid()
      },{
        width:560,
        height:400,
        buttons:[{
            text: "Ok",
            click: function(){controller.toolbar.confirmReloadShape(convertGrid(width,height));}
            },{
              text: "Cancel",
              click: view.dialog.closeAll
            },{
              text: shape_lang["empty"],
              click: controller.toolbar.grid.empty
            }]
      });
      //$("#gridContainer").find("div").click(controller.toolbar.grid.click);
      $("#gridContainer").mousedown(controller.toolbar.grid.mousedown);
      $("#gridContainer").find("div").click(controller.toolbar.grid.click);
      $(document).mouseup(controller.toolbar.grid.mouseup);
    }
};

var _loader =
{
  src:"images/loader.gif",
  classLoader:"containerNoOpacityLoader",
  blackScreenClass:"blackScreen",
  show:function()
  {
    this.blackScreen();
    view.firstPage.body
                      .append($("<div>")
                                      .css({top: "25%"})
                                      .addClass(this.classLoader)
                                      .append($("<img>")
                                                .addClass("loader")
                                                .attr("src",this.src))
                                      .fadeIn("slow"));
  },
  remove:function()
  {
    $("."+this.blackScreenClass+", ."+this.classLoader).fadeOut("medium",function(){$(this).remove();});
  },
  blackScreen:function()
  {
    view.firstPage.body.append(
                            $("<div>")
                              .addClass(this.blackScreenClass)
                              .fadeTo("slow",0.8));
  },
};

var _images=
{
    src: ["//shapeyourlife.herokuapp.com/images/start_button.gif",
          "//shapeyourlife.herokuapp.com/images/start_button_hover.gif",
          "//shapeyourlife.herokuapp.com/images/"+shape_lang["share_img_src"],
          "//shapeyourlife.herokuapp.com/images/"+shape_lang["link_img_src"],
          "//shapeyourlife.herokuapp.com/images/bar.gif",
          "//shapeyourlife.herokuapp.com/images/close.png",
          "//shapeyourlife.herokuapp.com/images/pencil.png",
          "//shapeyourlife.herokuapp.com/images/sprite_shapes.png",
          "//shapeyourlife.herokuapp.com/images/sprite_tools.png"],
    preload:function()
    {
      preloadImages(this.src);
    }
};

var view ={
  shapeImages:
  [
    "0px -300px", //rect
    "0px -500px", //triRect
    "0px -550px", //triRectReverse
    "0px -450px", //tri
    "0px -150px", //ellipse
    "0px -250px", //hourglass
    "0px -100px", //cross
    "0px -200px", //heart
    "0px -50px" , //coverPhoto
    "0px -400px", //star
    "0px -350px", //smile
    "0px -0px"    //"butterfly"
  ],
  updateBackground:function(color)
  {
      $("body").css("background-color","#"+color);
  },
  showImageBig:function(src)
  {
    var removeImageBig = function()
    {
      $(".blackScreen").fadeOut("slow",function(){$(this).remove();});
      $(".containerNoOpacityImage").fadeOut("slow",function(){$(this).remove();});
    };

    view.loader.blackScreen();
    $("<div>")
        .addClass("containerNoOpacityImage")
        .append($("<div>")
            .addClass("imageBig")
            .append($("<img>")
            .attr("src",src))
            .append($("<img>")
                  .addClass("imageClosing")
                  .attr("src","images/close.png")
                  .click(function(){
                    removeImageBig();
                  })))
        .fadeIn("slow")
        .appendTo("body");

    $(document).addKeylistener(removeImageBig,27);
    $(".blackScreen").click(removeImageBig);

  },
  dialog:_dialog,
  loader:_loader,
  firstPage:_firstPage,
  secondPage:_secondPage,
  images:_images
};