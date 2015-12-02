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
      igluUri: 'iglu:com.amido/',
      uuid: window.uuid
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
      hendrixClient.trackEvent('Opt-in_newsletter', 'btn-event1');
    });
    $('.btn-event2').click(function(e) {
      hendrixClient.trackEvent('Acknowledge_T_and_C', 'btn-event2');
    });
    $('.btn-event3').click(function(e) {
      hendrixClient.trackEvent('Update_profile_data', 'btn-event3');
    });
    $('.btn-event4').click(function(e) {
      hendrixClient.trackEvent('Enter_competition', 'btn-event4');
    });

    $('.link-logout').click(function(e) {
      hendrixClient.logout('link-logout');
      window.location.href = "index.html";
    });

  });

})(jQuery, window);