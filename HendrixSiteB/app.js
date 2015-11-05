(function($, window) {
  $(document).ready(function() {

    var hendrixConfig = {
      auth0Lock: new Auth0Lock(
        // All these properties are set in auth0-variables.js
        AUTH0_CLIENT_ID,
        AUTH0_DOMAIN
      ),
      snowplow: snowplow,
      localStorage: localStorage,
      igluUri: 'iglu:com.amido/user_data_retrieved/jsonschema/1-0-0'
    };

    var hendrixClient = new window.hendrixPoc.hendrixClient(hendrixConfig);

    hendrixClient.isLoggedInAsync(
      function() { window.location.href = "/logged.html";}, 
      function() { $('.home').removeClass('hidden');  });

    $('.btn-login').click(function(e) {
      e.preventDefault();

      hendrixClient.trackEvent('LoginButton-clicked', 'btn-login');

      hendrixClient.login(
        {
      authParams: {
        connection_scopes:{
          'facebook' : ['user_friends']
        }
      }
    },
        function() {
          window.location.href = "/logged.html";
        },
        function() {
          console.log("There was an error");
          alert("There was an error logging in");
        }
      );

    });


    $('.btn-event1').click(function(e) {
      hendrixClient.trackEvent('event1', 'btn-event1');
    });
    $('.btn-event2').click(function(e) {
      hendrixClient.trackEvent('event2', 'btn-event2');
    });
    
  });

})(jQuery, window);