$(document).ready(function(){
	var url = 'http://www.stevenc4.com/comments';
	$('input[type=submit]#submitPost').click(function(){
		var postBody = {};
		postBody["Name"] = $("input#commentName").val();
		postBody["Comment"] = $("input#commentBody").val();
		jsonBody = JSON.stringify(postBody);
		$.ajax({
			url: url,
			method: 'POST',
			data: jsonBody,
		}).done(function(data){
			$("td#successErr").html("success");
		}).fail(function(){
			$("td#successErr").html("error");
		});
		$("td#postJsonDisplay").html(jsonBody);
	});

	$('input[type=submit]#submitGet').click(function(){
		$.ajax({
			url: url,
			method: 'get'
		}).done(function(data){	
			$('tr.commentsHeader').show();
			$("tr.comment").remove()
			for (var comment in data) {
				$('table.comments').append('<tr class="comment">' + '<td>' + data[comment]["Name"] + '</td>'  + '<td>' + data[comment]["Comment"] + '</td>' + '</tr>')
			}
		}).fail(function(){
		});
	});
});
