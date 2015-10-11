function System()
{
	this.initialShape = 11;
	this.initialBackground = [0, 0, 0];

	this.minNumberPhotos = 30; //minimo numero di foto che devono essere inserite in un album senza che ci sia un warning
	this.minImageWidth = 40; //larghezza immagine minima
	this.minImageHeight = 40; //altezza immagine minima
	this.margin = 2; //margine tra le immagini
	
	//var icons_pos = {rect : "-300px", trirect : "-500px", trirecti : "-550px", tri : "-450px", ell : "-150px", hour : "-250px", cross : "-100px", heart : "-200px", cover : "-50px", star : "-400px", smile : "-350px", butter : "0px" };
	this.shapeImages =
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
	];


	if ($.isMobile)
		return;

	this.imagesPreload=[
					"//shapeyourlife.herokuapp.com/images/start_button.gif",
					"//shapeyourlife.herokuapp.com/images/start_button_hover.gif",
					"//shapeyourlife.herokuapp.com/images/"+shape_lang["share_img_src"],
					"//shapeyourlife.herokuapp.com/images/"+shape_lang["link_img_src"],
					"//shapeyourlife.herokuapp.com/images/bar.gif",
					"//shapeyourlife.herokuapp.com/images/close.png",
					"//shapeyourlife.herokuapp.com/images/pencil.png",
					"//shapeyourlife.herokuapp.com/images/sprite_shapes.png",
					"//shapeyourlife.herokuapp.com/images/sprite_tools.png"];
	preloadImages(this.imagesPreload);

	
	this.toolbarElements =
	{
		"back":
		{
			title			:shape_lang["back_to_album"],
			css				:{"background-position":"0px -150px","width":"36px"},
			clickFunction	:createHTMLAlbumSelection
		},
		"reload":
		{
			title			:shape_lang["reload_shape"],
			css				:{"background-position":"0px -90px","width":"30px"},
			clickFunction	:reloadShape
		},
		"save":
		{
			title			:shape_lang["save_shape"],
			css				:{"background-position":"0px -120px","width":"30px"},
			clickFunction	:function () {$.server.save();}
		},
		"changeShape":
		{
			title			:shape_lang["change_to_default"],
			css				:{"background-position":"0px -0px","width":"33px"},
			clickFunction	:dialogChangeShape
		},
		"text":
		{
			title			:shape_lang["change_to_text"],
			css				:{"background-position":"0px -180px","width":"26px"},
			clickFunction	:insertText
		},
		"drawShape":
		{
			title			:shape_lang["draw_shape"],
			css				:{"background-position":"0px -60px","width":"31px"},
			clickFunction	:setUpGridEditor
		},
		"colorPicker":
		{
			title			:shape_lang["change_bkg_color"],
			css				:{"background-position":"0px -30px","width":"30px","background-color":"black"},
			class			:"color{onImmediateChange:'updateBackground(this);',valueElement:'nullElement'}"
		}
	};
}


