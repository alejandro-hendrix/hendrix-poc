$(function(){
			if (location.hash){
				var lochash    = location.hash.substr(1),
    			 accessToken = lochash.substr(lochash.indexOf('access_token='))
                  .split('&')[0]
                  .split('=')[1];		
                  $.ajax(
                  	{
                  		method: 'POST',
	                  	url:'https://amidoltd.auth0.com/oauth/access_token',
	                  	contentType:'application/json',
						data: {
						  client_id:    "nXwKxdF38kIXWV8dG11vFxEOOCw6BwjM", 
						  access_token: accessToken,
						  connection:   "facebookTest2",
						  scope: "openid profile"
						}					  
					}).done(function(data){
						alert(data);
					});		
			}

			$('#login').click(function(){
			  window.location ='https://amidoltd.auth0.com/authorize?response_type=token&client_id=nXwKxdF38kIXWV8dG11vFxEOOCw6BwjM&connection=facebookTest2&redirect_uri=http://site-b.hendrix.clients.amido.com/proxy.html';
			});
	});