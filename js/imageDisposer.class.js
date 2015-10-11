function imageDisposer(minWidth,minHeight,margin,data)
{
	this.minWidth = minWidth;
	this.minHeight = minHeight;
	this.margin = margin;
	this.dataServer = data;
	this.dataClient = [];
	this.maxWidth = null;
	this.maxHeight = null;
	this.disposeImage();
}

imageDisposer.prototype.update = function (minWidth,minHeight,margin)
{
	this.minWidth = minWidth;
	this.minHeight = minHeight;
	this.margin = margin;
	this.disposeImage();
};

imageDisposer.prototype.disposeImage = function()
{
	var _this = this;
	this.dataClient = [];
	$(this.dataServer).each(function(index,value){
		var width = value.width;
		var height = value.height;
		var size = value.size - 1;
		var i = value.i;
		var j = value.j;
		var url = value.url;
		var shapeData = {"serverIndex" : index, "url":url,"size":size+1,"i":i,"j":j,"top":undefined,"left":undefined,"width":"auto","height":"auto",
				"container-width":undefined,"container-height":undefined,"margin-left":"0px","margin-top":"0px"};
		var realWidth = (Math.pow(2,size)*(_this.minWidth+_this.margin))-_this.margin;
		var realHeight = (Math.pow(2,size)*(_this.minHeight+_this.margin))-_this.margin;
		shapeData["container-width"] = realWidth+"px";
		shapeData["container-height"] = realHeight+"px";
		var deltaWidth = width/(Math.pow(2,size)*_this.minWidth);
		var deltaHeight = height/(Math.pow(2,size)*_this.minHeight);
		if (deltaWidth>deltaHeight)
		{
			shapeData["height"] = shapeData["container-height"];
			shapeData["margin-left"] = parseInt(((width*realHeight/height-realWidth)/-2),10)+"px";
		}
		else
		{
			shapeData["width"] = shapeData["container-width"];
			shapeData["margin-top"] = parseInt(((height*realWidth/width-realHeight)/-2),10)+"px";
		}
		shapeData["top"] = (j*(_this.minHeight+_this.margin))+"px";
		shapeData["left"] = (i*(_this.minWidth+_this.margin))+"px";
		_this.dataClient.push(shapeData);
	});
	this.maxWidth = null;
	this.maxHeight = null;
	//return this.dataClient;
};

imageDisposer.prototype.reverseGenerate = function()
{
	var _this = this;
	this.dataServer = [];
	$(this.dataClient).each(function (index, value)
	{
		var width = parseInt(value["container-width"].substring(0, value["container-width"].length - 2), 10);
		var height = parseInt(value["container-height"].substring(0, value["container-height"].length - 2), 10);
		var size = Math.log((width + _this.margin) / (_this.minHeight+_this.margin)) / Math.LN10;

		var i = parseInt(value["left"].substring(0, value["left"].length-2), 10) / (_this.minWidth+_this.margin);
		var j = parseInt(value["top"].substring(0, value["top"].length-2), 10) / (_this.minHeight+_this.margin);
		var data = {};
		data.i = i;
		data.j = j;
		data.size = size;
		data.width = "";
		this.dataServer.push(data);
	});
	this.maxWidth = null;
	this.maxHeight = null;
	//return this.dataClient;
};


imageDisposer.prototype.getInfos = function(i,j)
{
	for (var o = 0; o < this.dataClient.length; o++)
	{
		var value = this.dataClient[o];
		if (value.i==i && value.j==j)
			return [value["margin-left"],value["margin-top"],value["width"],value["height"]];
	}
};

imageDisposer.prototype.getMaxWidth = function()
{
	if (this.maxWidth !== null)
		return this.maxWidth;
	var data = this.dataClient;
    var minLeft = 999;
    var maxLeft = 0;
    for (var i = 0; i < data.length; i++)
    {
        var imageLeft = parseInt(data[i]["left"].replace("px",""),10);
        var imageWidth = parseInt(data[i]["container-width"].replace("px",""),10);
        if (imageLeft < minLeft)
            minLeft = imageLeft;
        if (imageLeft+imageWidth>maxLeft)
            maxLeft = imageLeft+imageWidth;
    }
    var shapeWidth = maxLeft-minLeft;
    this.maxWidth = shapeWidth;
    return shapeWidth;
};

imageDisposer.prototype.getMaxHeight = function()
{
	if (this.maxHeight !== null)
		return this.maxHeight;
	var data = this.dataClient;
    var minLeft = 999;
    var maxLeft = 0;
    for (var i = 0; i < data.length; i++)
    {
        var imageLeft = parseInt(data[i]["top"].replace("px",""),10);
        var imageWidth = parseInt(data[i]["container-height"].replace("px",""),10);
        if (imageLeft < minLeft)
            minLeft = imageLeft;
        if (imageLeft+imageWidth>maxLeft)
            maxLeft = imageLeft+imageWidth;
    }
    var shapeWidth = maxLeft-minLeft;
    this.maxHeight = shapeWidth;
    return shapeWidth;
};
