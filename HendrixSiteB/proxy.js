$(function(){
			if (location.hash){
				var lochash    = location.hash.substr(1),
    			 accessToken = lochash.substr(lochash.indexOf('access_token='))
                  .split('&')[0]
                  .split('=')[1];		
                  $.ajax(
                  	{
                  		method: 'GET',
	                  	url:'https://amidoltd.auth0.com/userinfo',
						beforeSend: function (xhr) {
						    xhr.setRequestHeader('Authorization', 'bearer ' + accessToken);
						},
						success:function(data){
							alert('hello ' + data.name);
						}
					});		
			}

			$('#login').click(function(){
			  window.location ='https://amidoltd.auth0.com/authorize?response_type=token&client_id=nXwKxdF38kIXWV8dG11vFxEOOCw6BwjM&connection=facebookTest2&redirect_uri=http://site-b.hendrix.clients.amido.com/proxy.html';
			});
	});