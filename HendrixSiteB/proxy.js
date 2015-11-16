$(function(){
			if (location.hash){
				alert(location.hash);				
			}

			$('#login').click(function(){
			  window.location ='https://amidoltd.auth0.com/authorize?response_type=token&client_id=nXwKxdF38kIXWV8dG11vFxEOOCw6BwjM&connection=facebookTest2&redirect_uri=http://site-b.hendrix.clients.amido.com/proxy.html';
			});
	});