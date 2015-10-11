//Schermata 2: Visualizzazione e gestione della shape

//shape utilizzata in questo momento. Il valore di inizializzazione è la shape utilizzata inizalmente
//var GLOBAL_SHAPE = 11;
//l'ultima forma che è stata generata
//var LAST_SHAPE_DATA = null;
//impone che venga visualizzata una sola volta per sessione la finestra di richiesta del like
var GLOBAL_FACEBOOK_LIKE = false;
//variabile di supporto per sapere quale metodo dello share devo usare (streampublish o getLink)
var GLOBAL_SHARE = null;
//finestra per il getLink
var POP_UP_WINDOW = null;

//---------------------------------------- CREAZIONE DOM --------------------------------------------- //

function createPageShape()
{
	//GLOBAL_SHAPE = shapeNumber;
	$("<div>")
			.attr("id","shapeScreen")
			.css({"position": "absolute", "width": "100%", "height": "100%"})
			.append(
				$("<div id='share_tab'>")
				.append($("<p>")
								.html(shape_lang["share_tab"]))
				.append($("<img>")
								.attr("id","shareShape")
								.addClass("shareButton")
								.attr("src","images/"+shape_lang["share_img_src"])
								.click(function(){
										getIdPhpPageToShare(true);
								}))
				.append($("<img>")
								.attr("id","getLink")
								.addClass("shareButton")
								.attr("src","images/"+shape_lang["link_img_src"])
								.click(function()
								{
									if (!GLOBAL_FACEBOOK_LIKE && FACEBOOK_USER.isFan===false)
										giveMeOneLike(function(){getIdPhpPageToShare(false);});
									else
										getIdPhpPageToShare(false);
								}))
			)
			.append(
					$("<div>")
							.attr("id","containerShape")
							.css({"height": "96%", "overflow": "auto","width":"100%"})
							.append(
									$("<div>")
									.attr("id", "js-container")
									.css({"margin-left":0,"top":"75px"}))
			.append(
					$("<div>")
							.attr("id","toolsShape")
							.tooltip()
							.append(createToolElements())))
			.appendTo("#tot");

	jscolor.init();

	$("#toolsShape div[title='"+shape_lang["change_bkg_color"]+"']").css("background-color","black");

	viewShape();
}

//Visualizza la nuova shape su schermo
function viewShape(element)
{
	$("#js-container div").fadeOut("fast",function(){
		$(this).remove();
	});

	element = typeof element !== 'undefined' ? element : "#js-container";
	
	$.desktopDialog.closeAll();
	$(element)
        .createShape(SHAPE.disposer.dataClient,
					{
						click: function(e){
							viewImageBig($(this).attr("src"));
							e.preventDefault();
						},
						mouseover:function(){
							$(this).children(".changeImageButton").css("display","block");
						},
						mouseout:function(){
							$(this).children(".changeImageButton").css("display","none");
						}
					});

        $(element+" a")
			.append($("<img>")
							.addClass("changeImageButton")
							.attr("src","images/pencil.png")
							.attr("title",shape_lang["change_image_button"])
							.tooltip()
							.click(function(){
								changeImage($(this).parent().parent());
							})
					);
	$(element).jsquares();
	//Se ho inserito un testo di 3 o più lettere non centro la shape, altrimenti sì
	if (typeof SHAPE.shapeNumber == "string" && SHAPE.shapeNumber.length>2)
		$(element).css("left",0);
	else
		$(element).centerShape(SHAPE.disposer.getMaxWidth());
}

function createToolElements()
{
	var container = $("<div>").css({borderBottom:"1px solid white", height:"53px", margin: "auto", width:"700px"});
	
	$.each(SYSTEM.toolbarElements , function(index, value)
	{
		container.append(
			$("<div>")
					.addClass("toolbarElement "+((value["class"]!==undefined) ? value["class"] : ""))
					.css(value["css"])
					.attr("title",value["title"])
					.click(function(){
						if ($.isFunction(value["clickFunction"]))
						{
							if (!GLOBAL_FACEBOOK_LIKE && FACEBOOK_USER.isFan===false)
								giveMeOneLike(value["clickFunction"]);
							else
								value["clickFunction"]();
						}
					})
					.dblclick(function(){return false;}));
	});

	return container;
}

//---------------------------------------- RICARICA SHAPE --------------------------------------------- //
function confirmReloadShape(val)
{
	$.desktopDialog.create({
		title:shape_lang["warning"],
		text:shape_lang["confirm_reload_shape"]
	},{
		width:300,
		height:180,
		buttons:{
			"Ok":function(){
				SHAPE.shapeNumber = val;
				if (typeof val ==="number" && val<SYSTEM.shapeImages.length && val>0)
					$("#toolsShape div[title='"+shape_lang["change_to_default"]+"']").attr("src",SYSTEM.shapeImages[SHAPE.shapeNumber]);
				//GLOBAL_SHAPE = GLOBAL_PROVV_SHAPE;
				reloadShape();
				$.desktopDialog.closeAll();
			},
			"Cancel":$.desktopDialog.closeAll
		}
	});
}

//Ricarica la shape utilizzando le variabili globali per gli album_Ids e per la shape
function reloadShape()
{
	editLoader("show","images/loader.gif");
	SHAPE.generateShape(function(){
		editLoader("remove");
		preloadImages(SHAPE.getArrayAttribute("url"),function()
		{
			viewShape();
		});
	},function(){
		littleDialog(shape_lang["warning"],shape_lang["session_expired"]);
	});
}



//---------------------------------------- VISUALIZZO L'IMMAGINE GRANDE --------------------------------------------- //

//data la src di un'immagine la printa centrale su schermo su fondo nero
function viewImageBig(srcImage)
{
	viewBlackScreen();
	$("<div>")
			.addClass("containerNoOpacityImage")
			.append($("<div>")
					.addClass("imageBig")
					.append($("<img>")
					.attr("src",srcImage))
					.append($("<img>")
								.addClass("imageClosing")
								.attr("src","images/close.png")
								.click(function(){
									removeImageBig();
								})))
			.fadeIn("slow")
			.appendTo("body");

	$(document).addKeylistener(removeImageBig,27);
	/*$(document).keyup(function(e)
	{
		if (e.keyCode == 27)
			{
				removeImageBig();
				$(document).off('keyup');
			}
	});*/
	$(".blackScreen").click(removeImageBig);

}

function removeImageBig()
{
	$(".blackScreen").fadeOut("slow",function(){$(this).remove();});
	$(".containerNoOpacityImage").fadeOut("slow",function(){$(this).remove();});
}

//---------------------------------------- INSERISCO GRIGLIA --------------------------------------------- //
var WIDTH_GRID = 22;
//altezza griglia editabile
var HEIGHT_GRID = 11;
//dimensioni blocco
var DIM_BLOCK = 20;
//griglia creata dall'utente, salvata in caso di chiusura e riapertura della finestra
var GLOBAL_GRID_CONTAINER = null;

//Permetto all'utente di inserire la propria griglia da utilizzare
function setUpGridEditor(width, height)
{
	width = typeof width !== 'undefined' ? width : WIDTH_GRID;
	height = typeof height !== 'undefined' ? height : HEIGHT_GRID;

	var dialogGrid = $("<div>").attr("id","dialogGrid");
	if (GLOBAL_GRID_CONTAINER===null)
	{
		var gridContainer = $("<div>")
									.attr("id","gridContainer")
									.css("width",488);
		for (var i = 1; i < width*height+1; i++)
		{
			$("<div>")
					.addClass("gridElement")
					.addClass("i-value"+i%width)
					.addClass("j-value"+i%height)
					.css("width",DIM_BLOCK)
					.css("height",DIM_BLOCK)
					.css("border",1+"px solid black")
					.appendTo(gridContainer);
		}
		GLOBAL_GRID_CONTAINER = gridContainer;
	}

	dialogGrid
			.append(GLOBAL_GRID_CONTAINER);

	$.desktopDialog.create({
		title:shape_lang["create_shape"],
		text:dialogGrid
	},{
		width:560,
		height:400,
		buttons:{
			"Ok":function(){
				confirmReloadShape(convertGrid(WIDTH_GRID,HEIGHT_GRID));
			},
			"Cancel":$.desktopDialog.closeAll,
			"Empty":function(){
				$("#gridContainer div").removeClass("gridElementSelected");
			}
		}
	});
	
	$("#gridContainer div").click(function(){clickGrid($(this));});
	
	$("#gridContainer").bind('mousedown',function(){
		$("#gridContainer div").bind('mouseover',function(){
			if (!$(this).hasClass("gridElementSelected"))
				$(this).addClass("gridElementSelected");
		});
	});
	$(document).bind('mouseup',function(){
		$("#gridContainer div").unbind('mouseover');
	});
}

function clickGrid(elem)
{
	if (!elem.hasClass("gridElementSelected"))
		elem.addClass("gridElementSelected");
	else
		elem.removeClass("gridElementSelected");
}

//Converte la grid in un array da dare in pasto al PHP
function convertGrid(width, height)
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
}

//---------------------------------------- INSERISCO TESTO --------------------------------------------- //
function insertText()
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
			"Ok":confirmInputReload,
			"Cancel":$.desktopDialog.closeAll,
		}
	}).addKeylistener(confirmInputReload,13);
}

function confirmInputReload()
{
	if ($("#inputTextDialogForm").val()!=="")
		confirmReloadShape("#"+$("#inputTextDialogForm").val());
	else
		$.desktopDialog.closeAll();
}


//---------------------------------------- CAMBIO SHAPE --------------------------------------------- //
function dialogChangeShape()
{
	var shapeContainer = $("<div>")
			.attr("id","shapeContainer")
			.css({"text-align": "center" , "width": "100%" , "height": "100%" , "cursor": "pointer"});
	
	$.each(SYSTEM.shapeImages , function(index, value){
		shapeContainer.append($("<div class='chooseShape'>")
									.css("background-position",value)
									.click(function(){confirmReloadShape(index);}));
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
		
}

//---------------------------------------- SOCIAL --------------------------------------------- //

//Viene chiamato il PHP che genera un link ad una pagina che poi verrà o gettata (share=false) o condivisa (share=true)
function getIdPhpPageToShare(share) {
	editLoader("show","images/loader.gif");
	//var popUpWindow;
	var data = null;
	//Se id è settato il php aggiorna il db, altrimenta crea una nuova riga
	GLOBAL_SHARE = share;
	if (share===false)
		POP_UP_WINDOW = window.open("loading.html");
	
	$.server.share(
		{
			success : function (id)
			{
				editLoader("remove");
				if (GLOBAL_SHARE === true)
				{
					viewBlackScreen();
					FACEBOOK_USER.streamPublish(id, function ()
					{
						//defaultInformationForm(shape_lang["error"],shape_lang["share_ok"]);
						$.desktopDialog.create({
							title:"Ok",
							text:shape_lang["share_ok"]
						}).addButton("Ok");
					});
				}
				else
				{
					link = 'http://apps.facebook.com/shapeyourlife/?photos='+id;
					POP_UP_WINDOW.location.href=link;
					POP_UP_WINDOW.focus();
				}
			},
			error : function (err)
			{
				$.desktopDialog.create({
					title:shape_lang["error"],
					text:shape_lang["session_error"]
				}).addButton("Ok");
			}
		});
}



//---------------------------------------- CAMBIO BACKGROUND --------------------------------------------- //

//modifica il background quando viene utilizzato l color picker e modifica conseguentmenre la variabile globale
function updateBackground(color)
{
	$("body").css("background-color","#"+color);
	$("#toolsShape").css("background-color","#f2f2f2");
	color = hexToRgb(color);
	SHAPE.backgroundColor[0] = color.r;
	SHAPE.backgroundColor[1] = color.g;
	SHAPE.backgroundColor[2] = color.b;
}

//---------------------------------------- CAMBIO FOTO --------------------------------------------- //

//Visualizza un dialog con tutte le immagini degli album che hai selezionato, le src delle immagini già le possiede
//in quanto inviate dal server alla prima richiesta
function changeImage(imageToChange)
{
	var albumsTable = $("<div id='imageDiv'>").css("width","100%");
	$($.server.last_photos_data).each(function(index,value)
	{
		albumsTable.append($("<div>")
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
										var id = parseInt(imageToChange.attr("data-id"), 10);
										SHAPE.disposer.dataServer[id].url = $.server.last_photos_data[index];
										SHAPE.disposer.dataServer[id].width = $.server.last_photos_widths[index];
										SHAPE.disposer.dataServer[id].height = $.server.last_photos_heights[index];
										SHAPE.reloadDisposer(SYSTEM.minImageWidth,SYSTEM.minImageHeight,SYSTEM.margin);
										$("#js-container").updateShape(SHAPE.disposer.dataClient);
										imageToChange.children().children("img.imageAlbum").attr("src",SHAPE.disposer.dataServer[id].url);
										//closeDefaultDialogForm();
										$.desktopDialog.closeAll();
									}))));
	});
	$.desktopDialog.create({
		title:shape_lang["change_image_dialog"],
		text:albumsTable
	},
	{
		width:750,
		height:420
	});
	for (var i = 0; i <= $.server.last_photos_widths.length; i++)
		makeSquareImg($("#divCropImage"+i).children("img"),$.server.last_photos_widths[i],$.server.last_photos_heights[i],100);
	$(".lazy").lazyLoad();
}


function makeSquareImg(obj,width,height,finalDim)
{
	
	if (width<height) {
		var newHeight = finalDim * height / width;
		obj.css("width", finalDim + "px").css("margin-top", "-" + ((newHeight - finalDim)/2)+"px");
	}
	else {
		var newWidth = finalDim * width / height;
		obj.css("height", finalDim + "px").css("margin-left", "-" + ((newWidth - finalDim)/2)+"px");
	}
}

//---------------------------------------- CAMBIO ALBUM --------------------------------------------- //

function createHTMLAlbumSelection()
{
	var albums =$("<div>")
						.append(
								$("<div>")
										.attr("id", "gallery")
										.css({"height":"auto" , "width" : "90%" , "margin": "auto", "overflow": "hidden"})
										.append($("<div>")
														.attr("id","clickYourAlbum")
														.html(shape_lang["select_your_album"])));
	$.desktopDialog.create(
	{
		title:shape_lang["select_your_album"],
		text:albums
	},
	{
		width:900,
		height:420,
		buttons:{
			"Shape it":elaboratePhotosAlbum,
			"Cancel":$.desktopDialog.closeAll
		}
	});
	
	$.fb.albumsCover(function (data)
    {
        var albumsTable = $("<div id='albumDiv'>").css({"marginLeft":1500,"width":"100%"});
		$("#gallery").append(albumsTable).css("overflow","hidden");
        $(data).each(function (index, value)
        {
            var albumId = value.link.replace(/.*fbid=([0-9]+)&id=.*&aid=.*/g,"$1");
			var title = value.title.length<25 ? value.title.substr(0,25) : value.title.substr(0,25)+"...";
			$("#albumDiv")
					.append($("<div>")
									.addClass("imageContainerAlbum")
									.attr("id","imageAlbum"+index)
									.click(function()
									{
										var obj = $(this).children(".divCrop");
										if (obj.hasClass("albumClicked"))
											obj.removeClass("albumClicked");
										else
											obj.addClass("albumClicked");
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
																					.attr("albumId",albumId))));
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
    });
}

//una volta selezionati gli album IDs viene eseguita la chiamata JSON al PHP di generazione della shape
function elaboratePhotosAlbum()
{
	var albumIds = getIdArray($(".albumClicked img"),"albumId");
	if (albumIds.length === 0)
	{
		$.desktopDialog.create({
			title:shape_lang["warning"],
			text:shape_lang["no_album"]
		}).addButton("Ok");
		return;
	}

	SHAPE.albumIds = albumIds;

	var selectedPhotos = 0;
	$(".albumClicked img").each(function(index,value){
		selectedPhotos+=parseInt($(value).attr("photo_count"),10);
	});

	if (selectedPhotos<SYSTEM.minNumberPhotos)
		dialogFormTooFewPhotos(selectedPhotos);
	else
	{
		littleDialog(shape_lang["wait"],shape_lang["processing_request"]);
		SHAPE.generateShape(viewShape);
	}
}

//Nel caso in cui il numero di foto di un album sia inferiore al numero minimo consentito viene avvisato l'utente che potrebbero essere usati duplicati
function dialogFormTooFewPhotos(photosNumber)
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
				littleDialog(shape_lang["wait"],shape_lang["processing_request"]);
				SHAPE.generateShape(viewShape);
			},
			Cancel: $(this).closeDialog
		}
	});
}
