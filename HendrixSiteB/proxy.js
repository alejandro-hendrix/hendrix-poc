$(function(){
			if (location.hash && location.hash.id_token && location.hash.access_token){
				alert(location.hash);
			}

			$('#login').click(function(){

			  $.get('https://amidoltd.auth0.com/authorize?response_type=code&client_id=nXwKxdF38kIXWV8dG11vFxEOOCw6BwjM&connection=facebookTest2&redirect_uri=http://site-b.hendrix.clients.amido.com/proxy.html')
			  .done(function(data){
			  	debugger;
				var win=window.open("http://www.google.com", 'proxyTab');
				  win.focus();
			  });
			});
	});