(function($, window) {
  $(document).ready(function() {
    var cookieUuid = $.cookie('uuid');

    var uuid = null;

    if (cookieUuid.value){
      uuid = cookieUuid.value;
    }else{ 
      uuid = window.uuid();
      $.cookie('uuid', uuid, {domain:'.amido.com'});
    }

    var hendrixConfig = {
      auth0Lock: new Auth0Lock(
        // All these properties are set in auth0-variables.js
        AUTH0_CLIENT_ID,
        AUTH0_DOMAIN
      ),
      snowplow: snowplow,
      localStorage: localStorage,
      igluUri: 'iglu:com.amido/',
      uuid: uuid
    };

    var hendrixClient = new window.hendrixPoc.hendrixClient(hendrixConfig);

    function showLoginBox(){
        $('.login-box').show();
        $('.logged-in-box').hide();
    }

    function showLoggedInBox(){
        $('.login-box').hide();
        $('.logged-in-box').show();
    }

    hendrixClient.isLoggedInAsync(
      function() {
        showLoggedInBox();
        $('.home').removeClass('hidden');
      },
      function() {
        showLoginBox();
        $('.home').removeClass('hidden');
      });

    $('.btn-login').click(function(e) {
      e.preventDefault();

      hendrixClient.trackEvent('LoginButton-clicked', 'btn-login');

      hendrixClient.login({},
        function() {
          showLoggedInBox();
          hendrixClient.loadUserProfileAsync(function(profile) {
            $('.nickname').text(profile.nickname);
            $('.nickname').text(profile.name);
            $('.avatar').attr('src', profile.picture);
          });
        },
        function() {
          console.log("There was an error");
          alert("There was an error logging in");
        }
      );

    });


    $.ajaxSetup({
      'beforeSend': function(xhr) {
        var userToken = hendrixClient.getUserToken();
        if (userToken) {
          xhr.setRequestHeader('Authorization',
            'Bearer ' + userToken);
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
      showLoginBox();
    });

  });
})(jQuery, window);