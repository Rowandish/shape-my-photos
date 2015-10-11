//data:Dati ricevuti dal server
//albumIds: IDs degli album selezionati
//shapeNumber: shape utilizzata in questo momento. Il valore di inizializzazione è la shape utilizzata inizalmente
//datbackgroundColor: Colore di sfondo

function Shape(data,albumIds,shapeNumber,backgroundColor)
{
	this.data = data;
	this.albumIds = albumIds;
	this.shapeNumber = shapeNumber;
	this.backgroundColor = backgroundColor;
	this.disposer = data !== undefined ? new imageDisposer(model.settings.minImageWidth,model.settings.minImageHeight,model.settings.margin,data) : null;
}

//inizializza un nuovo diposer dopo aver ricevuto dati dal server
Shape.prototype.initializeDisposer = function(minImageWidth,minImageHeight,margin,data)
{
	this.disposer = new imageDisposer(minImageWidth,minImageHeight,margin,data);
    this.data = this.disposer.dataClient;
};
//Aggiorna il disposer, da chiamare quando un metodo modifica DISPOSER.dataServer
Shape.prototype.reloadDisposer = function(minImageWidth,minImageHeight,margin)
{
	if (minImageWidth === undefined)
	{
		minImageWidth = model.settings.minImageWidth;
		minImageHeight = model.settings.minImageHeight;
		margin = model.settings.margin;
	}
	this.disposer.update(minImageWidth,minImageHeight,margin);
    this.data = this.disposer.dataClient;
};

Shape.prototype.updateBkg = function(color)
{
	this.backgroundColor[0] = color.r;
    this.backgroundColor[1] = color.g;
    this.backgroundColor[2] = color.b;
};

Shape.prototype.getArrayAttribute = function(attribute)
{
	var srcArray = [];
	for (var i = 0; i < this.data.length; ++i)
		srcArray.push(this.data[i][attribute]);
	return srcArray;
};
//Chiama il server, permettendo o meno duplicati
Shape.prototype.generateShape = function(callback,errorDialog,getImageUrls)
{
	getImageUrls = typeof getImageUrls !== 'undefined' ? getImageUrls : false;
	var _this = this;
	$.server.generate(
        {
            get_image_urls : getImageUrls,
            success : function (data)
            {
                _this.initializeDisposer(model.settings.minImageWidth,model.settings.minImageHeight,model.settings.margin,data.shape);
				if ($.isFunction(callback))
					callback();
            },
            error : function (error)
            {
                if ($.isFunction(errorDialog))
					errorDialog();
            }
        });
};


