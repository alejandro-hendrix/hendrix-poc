(function($, window) {
  $(document).ready(function() {
     setupSnowplow();

    var cookieUuid = $.cookie('uuid');

    var uuid = null;

    if (cookieUuid){
      uuid = cookieUuid;
    }else{ 
      uuid = window.uuid();
      $.cookie('uuid', uuid, {domain:'.amido.com', expires:100000});
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
      hendrixClient.trackEvent(hendrixClient.eventCategories.authenticated,'Opt-in_newsletter', 'btn-event1');
    });
    $('.btn-event2').click(function(e) {
      hendrixClient.trackEvent(hendrixClient.eventCategories.authenticated,'Acknowledge_T_and_C', 'btn-event2');
    });
    $('.btn-event3').click(function(e) {
      hendrixClient.trackEvent(hendrixClient.eventCategories.authenticated,'Update_profile_data', 'btn-event3');
    });
    $('.btn-event4').click(function(e) {
      hendrixClient.trackEvent(hendrixClient.eventCategories.authenticated,'Enter_competition', 'btn-event4');
    });

    $('.link-logout').click(function(e) {
      hendrixClient.logout('link-logout');
      window.location.href = "index.html";
    });

    function setupSnowplow(){
      ;(function(p,l,o,w,i,n,g){if(!p[i]){p.GlobalSnowplowNamespace=p.GlobalSnowplowNamespace||[];
    p.GlobalSnowplowNamespace.push(i);p[i]=function(){(p[i].q=p[i].q||[]).push(arguments)
    };p[i].q=p[i].q||[];n=l.createElement(o);g=l.getElementsByTagName(o)[0];n.async=1;
    n.src=w;g.parentNode.insertBefore(n,g)}}(window,document,"script","//d3ct33uh7gjgnz.cloudfront.net/2.5.2/sp.js","snowplow"));
    }

  });

})(jQuery, window);