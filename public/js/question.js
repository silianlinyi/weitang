define(function(require, exports, module) {

	var href = window.location.href,
		_id = href.split("?")[1].split("=")[1];

	$.ajax({
		url: '/api/question/' + _id,
		type: 'GET',
		dataType: 'json',
		timeout: 15000,
		success: function(data, textStatus, jqXHR) {
			console.log(data);
			if (data.r === 0) {
				alert(data.msg);
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {

		}
	});

});