function regenerateShape(shape, album, url) {
	var parameters = {shape : shape, album : album};
	$.getJSON(url, parameters,
		function (data) {
			if (!$("#js-container")) {
				$("<div>").attr("id", "js-container").appendTo("#middle");
			} else
				$("#js-container").empty();
			
			for (var i = 0; i < data.length; ++i) {
				var image = data[i];
				$("<div>").addClass("js-image size-"+image["size"])
						.css({"top" : image["top"], "left" : image["left"]})
						.appendTo("#js-container")
						.append(
							$("<a>").attr("href", "#none")
									.append(
										$("<img>")
												.attr("src", image["url"])
												.css({width : image["width"], height : image["height"], marginLeft : image["margin-left"], marginTop : image["margin-top"] })

									)
						);
			}
			$('#js-container').jsquares();
		}
	);
}
