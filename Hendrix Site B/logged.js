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
      igluUri: 'http://hendrix-site-a.amido.com/schemas/com.amido.hendrix-site-b/'
    };

    var hendrixClient = new window.hendrixPoc.hendrixClient(hendrixConfig);

    hendrixClient.isLoggedInAsync(
      function() {
        hendrixClient.loadUserProfileAsync(function(profile) {
          $('.nickname').text(profile.nickname);
          $('.nickname').text(profile.name);
          $('.avatar').attr('src', profile.picture);
        });
      },
      function() {
        window.location.href = "index.html";
      }
    )


    $.ajaxSetup({
      'beforeSend': function(xhr) {
        var userToken = hendrixClient.getUserToken();
        if (userToken) {
          xhr.setRequestHeader('Authorization', 'Bearer ' + userToken);
        }
      }
    });

    $('.btn-event1').click(function(e) {
      hendrixClient.trackEvent('event1', 'btn-event1');
    });
    $('.btn-event2').click(function(e) {
      hendrixClient.trackEvent('event2', 'btn-event2');
    });
    $('.btn-event3').click(function(e) {
      hendrixClient.trackEvent('event3', 'btn-event3');
    });
    $('.btn-event4').click(function(e) {
      hendrixClient.trackEvent('event4', 'btn-event4');
    });

    $('.link-logout').click(function(e) {
      hendrixClient.logout('link-logout');
      window.location.href = "index.html";
    });

  });

})(jQuery, window);