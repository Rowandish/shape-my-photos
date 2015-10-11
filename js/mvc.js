/*
VIEW:
una View non dovrebbe eseguire i suoi metodi. Per esempio, un box di dialogo non dovrebbe aprire o chiudere se stesso.
Lasciamo questi compiti al Controller.
Se un utente clicca su un pulsante "Salva" all'interno di un box di dialogo, quell'evento viene viene passat
ad un'azione del Controller. L'azione può allora decidere cosa dovrebbe fare la View. Forse chiude il box di dialogo.
Oppure dice alla View di mostrare una barra di avanzamento mentre i dati sono salvati.
Una volta che i dati sono stati salvati, l'evento di completamento Ajax fa scattare un'altra azione del controller
che dice alla View di nascondere l'indicatore e chiudere il box di dialogo.

CONTROLLER:
portare i dati del Model alla View? Ecco a cosa serve il Controller. Un Controller si attiva dopo che si verifica un evento.
Può avvenire quando si carica la pagina o quando l'utente compie un'azione.
Un gestore di eventi viene assegnato ad un metodo del Controller che farà in modo che venga eseguita
l'azione che l'utente vuole compiere.*/

//MODEL
/*Insieme di elementi di cui è composto il sito, con metodi per la gestione degli stessi
(validazione, creazione, rimozione, aggiornamento, cancellamento). Nel caso in esame è la shape.
Metodi aggiunti all'oggetto astraggono il processo di interagire direttamente con i dati.
Questi metodi sono spesso definiti con l'acronimo CRUD, che sta per "create, remove, update, delete" (crea, rimuovi, aggiorna, cancella).*/


//unico accesso al js che non è MVC
$(document).ready(function(){
  controller.init();
});

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
    init:function()
    {
      this.animateScreenImage(this.gear);
    },
    animateScreenImage: function(object)
    {
      object.rotate({
        angle:0,
        animateTo:360,
        duration: 2000,
        callback: function(){view.firstPage.animateScreenImage(object);},
        easing: function (x,t,b,c,d){        // t: current time, b: begInnIng value, c: change In value, d: duration
          return c*(t/d)+b;
        }
      });
    },
    animateLanguage:function(object)
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
    },
    tutorialImages: function(data) //gli arrivano i dati dal server e il metodo pensa alla visualizzazione
    {
      //funzioni private del metodo. Non devono essere richiamabili dall'esterno
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
                    .mouseover(controller.startButton.mouseover)
                    .mouseout(controller.startButton.mouseout)
                    .click(controller.startButton.click);
      };

      //metodo effettivo
      var _this = view.firstPage;

      _this.firstImage.fadeOut(function ()
      {
        $(this).remove();
        _this.animateLanguage(_this.languageSelectorClass);
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
      $.desktopDialog.closeAll();
      this.languageSelector.remove();
      $(this.balloonTip).remove();
      this.tot.children().fadeOut(300);
      this.backgroundRight.fadeOut("slow");
      this.backgroundLeft.fadeOut("slow",function()
      {
        $("body").animate({backgroundColor:'#000000'}, "slow",function()
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
    this.drawShape.click(controller.toolbar.drawShape);
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
    if (typeof model.shape.shapeNumber == "string" && model.shape.shapeNumber.length>2)
      shapeContainer.css("left",0);
    else
      shapeContainer.centerShape(model.shape.disposer.getMaxWidth());
  },
  updateShape:function(data,objToChange,src) //Aggiorna la shape in caso di cambiamenti di immagine
  {
      this.shapeContainer.updateShape(data);
      objToChange.attr("src",src);
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
  dialog:
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
    var makeSquareImg = function(obj,width,height,finalDim)
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
    };

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
      makeSquareImg($("#divCropImage"+i).children("img"),$.server.last_photos_widths[i],$.server.last_photos_heights[i],100);
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
            var albumIds = getIdArray($(".albumClicked img"),"albumId");
            controller.toolbar.album.changeThisAlbum(albumIds);
          },
          "Cancel":$.desktopDialog.closeAll
        }
      });
    
    var albumsTable = $("<div id='albumDiv'>").css({"marginLeft":1500,"width":"100%"});
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
                                        //.attr("title",value.title)
                                        .attr("photo_count",value.photo_count)
                                        .attr("albumId",albumId)
                                        )
                                )
                );

    //Dato l'indice di un album, ne rende le album cover corrispondente quadrata
    makeSquareImg($("#divCrop"+index).children("img"),parseInt(value.cover_width,10),parseInt(value.cover_height,10),150);
        });
    //lazyLoad($(".albumsCover"));
    $(".albumsCover").lazyLoad();
    $("#albumDiv").animate({
      marginLeft:"-=1500"
    },1000,function(){
      $("#gallery").css("overflow","auto");
    });
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
          "Cancel":$.desktopDialog.closeAll
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
          "Cancel":$.desktopDialog.closeAll,
        }
      }).addKeylistener(controller.toolbar.text.confirm,13);
    },
    drawShape:function()
    {
      var createGrid = function()
      {
        var dialogGrid = $("<div>").attr("id","dialogGrid");
        if (modelGrid.gridContainer===null)
        {
          var gridContainer = $("<div>")
                        .attr("id","gridContainer")
                        .css("width",488);
          for (var i = 1; i < modelGrid.width*modelGrid.height+1; i++)
          {
            $("<div>")
                .addClass("gridElement")
                .addClass("i-value"+i%modelGrid.width)
                .addClass("j-value"+i%modelGrid.height)
                .css("width",modelGrid.dimBlock)
                .css("height",modelGrid.dimBlock)
                .css("border",1+"px solid black")
                .appendTo(gridContainer);
          }
          modelGrid.gridContainer = gridContainer;
        }

        dialogGrid
            .append(modelGrid.gridContainer);

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
      
      var modelGrid = model.toolbar.grid;

      $.desktopDialog.create({
        title:shape_lang["create_shape"],
        text:createGrid()
      },{
        width:560,
        height:400,
        buttons:{
          "Ok":function(){
            controller.toolbar.confirmReloadShape(convertGrid(modelGrid.width,modelGrid.height));
          },
          "Cancel":view.dialog.closeAll,
          "Empty":controller.toolbar.grid.empty
        }
      });
      $("#gridContainer div").click(controller.toolbar.grid.click($(this)));
      $("#gridContainer").mousedown(controller.toolbar.grid.mousedown($(this)));
      $(document).mouseup(controller.toolbar.grid.mouseup);
    }

  },
  blackScreen:function()
  {
    $("body").append(
      $("<div>")
        .addClass("blackScreen")
        .fadeTo("slow",0.8));
  },
  showImageBig:function(src)
  {
    var removeImageBig = function()
    {
      $(".blackScreen").fadeOut("slow",function(){$(this).remove();});
      $(".containerNoOpacityImage").fadeOut("slow",function(){$(this).remove();});
    };

    viewBlackScreen();
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
  loader:{
    src:"images/loader.gif",
    classLoader:"containerNoOpacityLoader",
    show:function()
    {
      view.blackScreen();
      $("body")
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
      $(".blackScreen, ."+this.classLoader).fadeOut("medium",function(){$(this).remove();});
    },
  },
  firstPage:_firstPage,
  secondPage:_secondPage
};

var controller=
{
  init:function()
  {
    view.firstPage.init();
    checkThirdPartyCookie(); //da spostare e rendere jquery
    model.facebook.create(model.updateDataTutorial);
  },
  startButton:{
    src: "images/start_button.gif",
    srcHover: "images/start_button_hover.gif",
    mouseover: function(){$(this).attr("src", controller.startButton.srcHover);},
    mouseout: function(){$(this).attr("src", controller.startButton.src);},
    click: function(){$(this).attr("src", model.facebook.facebookUser.login(controller.generateInitialShape));}
  },
  generateInitialShape:function()
  {
    view.dialog.little(shape_lang["wait"],shape_lang["processing_request"]);
    model.createFirstShape(function()
    {
      view.firstPage.close(function()
      {
        view.secondPage.show();
      });
    });
  },
  generateShape:function(callback)
  {
    view.dialog.little(shape_lang["wait"],shape_lang["processing_request"]);
    model.shape.generateShape(callback);
  },
  shape:{
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
  },
  share:{
    shareFacebook:function()
    {
        model.validateFunction(function(){
          model.viewUrlToShare(true);
        });
    },
    getLink:function()
    {
      model.validateFunction(function(){
          model.viewUrlToShare(false);
        });
    }
  },
  toolbar:{
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
        view.loader.remove();
        preloadImages(model.shape.getArrayAttribute("url"),function()
        {
          view.secondPage.viewShape();
        });
      },function(){
        view.dialog.little(shape_lang["warning"],shape_lang["session_expired"]);
      });
      view.dialog.closeAll();
    },
    changeImage:function(imageToChange,index)
    {
      model.validateFunction(function()
      {
        var id = parseInt(imageToChange.attr("data-id"), 10);
        model.updateDataServer(id,index);
        view.secondPage.updateShape(model.shape.disposer.dataClient,imageToChange.children().children("img.imageAlbum"),model.shape.disposer.dataServer[id].url);
        view.dialog.closeAll();
      });
    },
    album:{
      changeAlbum:function()
      {
        model.validateFunction(function()
        {
          model.toolbar.getAlbumCover(view.dialog.changeAlbum);
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
        $(".albumClicked img").each(function(index,value){
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
      model.validateFunction(function()
      {
          view.loader.show();
          model.shape.generateShape(function()
          {
            view.loader.remove();
            preloadImages(model.shape.getArrayAttribute("url"),function()
            {
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
      model.validateFunction(function()
      {
          $.server.save();
      });
    },
    changeShape:function()
    {
      model.validateFunction(function()
      {
          view.dialog.changeShape();
      });
    },
    text:{
      changeText:function()
      {
        model.validateFunction(function()
        {
            view.dialog.insertText();
        });
      },
      confirm:function()
      {
        if ($("#inputTextDialogForm").val()!=="")
          controller.toolbar.confirmReloadShape("#"+$("#inputTextDialogForm").val());
        else
          view.dialog.closeAll();
      }
    },
    drawShape:function()
    {
      model.validateFunction(function()
      {
        view.dialog.drawShape();
      });
    },
    grid:{
      empty:function(){$("#gridContainer div").removeClass("gridElementSelected");},
      click:function(elem)
      {
        console.log(elem);
        if (!elem.hasClass("gridElementSelected"))
          elem.addClass("gridElementSelected");
        else
          elem.removeClass("gridElementSelected");
      },
      mousedown:function(elem)
      {
        console.log(elem);
        elem.find("div").mouseover(function(){
          if (!$(this).hasClass("gridElementSelected"))
            $(this).addClass("gridElementSelected");
          });
      },
      mouseup:function()
      {
        $("#gridContainer div").off('mouseover');
      }
    }
    
  }
};

//-----------------------------------------------------MODEL----------------------------------------------------//



var _settings={ //impostazioni generali
    initialShape: 11,
    initialBackground: [0,0,0],
    minNumberPhotos:25,
    photoFirstShape:35,
    minImageWidth:40,
    minImageHeight:40,
    margin:2
  };
var _facebook={
  facebookUser:null, //istanza della classe facebookUser
  hasLiked: false, //l'utente ha già visto il popUp?
  create:function(callback)
  {
    this.facebookUser = new FacebookUser(callback);
  }
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
      preloadImages(this.imagesPreload);
    }
};


var model = {
  shape: null,  //istanza della classe shape
  settings:_settings,
  facebook:_facebook,
  images:_images, //?
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
  //Prende gi album Ids per la generazione della prima shape, in modo che il numero totoale delle loro foto sia almeno 35
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
        $.desktopDialog.closeAll();
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
  validateFunction:function(f)
  {
    if ($.isFunction(f))
    {
      if (!this.facebook.hasLiked && this.facebook.facebookUser.isFan===false)
        view.dialog.giveMeOneLike(f);
      else
        f();
    }
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
          view.blackScreen();
          model.facebook.facebookUser.streamPublish(id, function ()
          {
            view.dialog.ok("ok",shape_lang["share_ok"]);
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
  },
  updateDataServer:function(id,index)
  {
      this.shape.disposer.dataServer[id].url = $.server.last_photos_data[index];
      this.shape.disposer.dataServer[id].width = $.server.last_photos_widths[index];
      this.shape.disposer.dataServer[id].height = $.server.last_photos_heights[index];
      this.shape.reloadDisposer(this.settings.minImageWidth,this.settings.minImageHeight,this.settings.margin);
  },
  toolbar:{
    getAlbumCover:function(callback) //Fornisce al controller le album cover, chiamando come callback la funzione da lui richiesta
    {
      $.fb.albumsCover(function (data)
      {
        if ($.isFunction(callback))
          callback(data);
      });
    },
    grid:{
      width:22,
      height:11,
      dimBlock:20,
      gridContainer:null
    }

  }
};