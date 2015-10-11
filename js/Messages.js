var _desktopDialog = {
    create : function (otherOptions,dialogOptions)
    {
        var defaultsOptions = {resizable: false,height:180,width: 300,modal: true,closeOnEscape: true,
			show:{effect: "fade",duration: 500},
			hide:{effect: "fade",duration: 200},
			close: function(event, ui) {$(this).closeDialog();},
			open: function(event, ui) {$(":button:contains('Ok')").focus();},
			buttons:null
		};

		var defaultsOtherOptions = {title:"default title",text:"default text",noEscape:false,backgroundColor:null};
        
        $.extend(defaultsOptions, dialogOptions);
        $.extend(defaultsOtherOptions, otherOptions);

        var div = $("<div class='dialog'>")
										.attr("title",defaultsOtherOptions.title)
										.append(defaultsOtherOptions.text)
										.dialog(defaultsOptions);
		
		if (defaultsOtherOptions.noEscape===true)
			$(".ui-dialog-titlebar-close").hide();
		if (defaultsOtherOptions.backgroundColor!==null)
			$(".ui-widget-content").css("background-color",defaultsOtherOptions.backgroundColor);
		return div;
    },
    closeAll: function()
    {
		$(".dialog").dialog("close");
		window.setTimeout(function(){$(".dialog").remove();},200);
    }
};

var _addButton = function(options)
{
	var element = this;
	if (typeof options==='string')
	{
		switch (options.toUpperCase())
		{
			case "OK":
				element.dialog( "option", "buttons", {"Ok" : $.desktopDialog.closeAll});
				break;
			case "CANCEL":
				element.dialog( "option", "buttons", {"Cancel" : $.desktopDialog.closeAll});
				break;
		}
	}
    else
		element.dialog( "option", "buttons", options);
    return element;
};



var _closeDialog = function()
{
	element = this;
	element.closest('.ui-dialog-content').dialog('close');
	return element;
};


$.extend({
    desktopDialog : _desktopDialog
});
$.fn.extend({
    addButton : _addButton,
    closeDialog : _closeDialog
});

function littleDialog(title, text) //da eliminare
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
}
