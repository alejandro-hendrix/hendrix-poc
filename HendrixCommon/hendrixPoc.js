(function(namespace) {

	function hendrixClient(hendrixConfig) {

		if (!hendrixConfig || !hendrixConfig.auth0Lock || !hendrixConfig.snowplow || !hendrixConfig.localStorage || !hendrixConfig.igluUri) {
			throw "Cannot initialize hendrixClient. Please provide valid constructor parameters."
			return;
		}

		this._auth0Lock = hendrixConfig.auth0Lock;
		this._snowPlow = hendrixConfig.snowplow;
		this._localStorage = hendrixConfig.localStorage;
		this._igluUri = hendrixConfig.igluUri;
		this._UserTokenName = 'userToken';
		this._initSnowplow();
	}

	hendrixClient.prototype._initSnowplow = function() {
		this._snowPlow('newTracker', 'co', 'collector.hendrix.clients.amido.com', { // Initialise a tracker
			appId: 'hendrixPoc',
			cookieDomain: 'web'
		});

		this._snowPlow('enableActivityTracking', 5, 30);
		this._snowPlow('enableLinkClickTracking');
		this._snowPlow('trackPageView');
	}

	hendrixClient.prototype.getUserToken = function() {
		return this._localStorage.getItem(this._UserTokenName);
	}

	hendrixClient.prototype.isLoggedInAsync = function(successCb, failCb) {
		var self = this;

		if (!self.getUserToken()) {
			failCb();
			return;
		}


		self._auth0Lock.$auth0.getSSOData(function(err, data) {
			// if there is still a session, do nothing		   
			if (data && data.sso){
				successCb();
				return;
			}
			self._localStorage.removeItem(self._UserTokenName);
			failCb();
		});

	}

	hendrixClient.prototype.loadUserProfileAsync = function(cb) {
		var self = this;

		self._auth0Lock.$auth0.getSSOData(function(err, data) {
			// if there is still a session, do nothing
			if (data && data.sso) {
				self._auth0Lock.getProfile(self.getUserToken(), function(err, profile) {
					cb(profile);
				});
			}
		});
	}

	hendrixClient.prototype.logout = function(elementId) {
		this._localStorage.removeItem(this._UserTokenName);
		if (elementId) {
			this.trackEvent('logout', elementId);
		}
	}

	hendrixClient.prototype.track = function(eventType, eventName, elementId) {
		this._snowPlow(eventType, eventName, elementId);
	}

	hendrixClient.prototype.trackEvent = function(eventName, elementId) {
		this.track('trackStructEvent', eventName, elementId);
	}

	hendrixClient.prototype.trackUnstructured = function(unstructEvent) {
		this._snowPlow('trackUnstructEvent', 
			{
				schema: this._igluUri + unstructEvent.schema, 
				data: unstructEvent.data
			}
	}

	hendrixClient.prototype.getUserItem = function() {
		return this._localStorage.getItem(this._UserTokenName);
	}

	hendrixClient.prototype.login = function(options, successCb, failCb) {
		var self = this;
		self._auth0Lock.show(
			options,
			function(err, profile, token) {
			if (err) {
				self.trackEvent('LoginFailed');
				failCb();
			} else {
				// Save the JWT token.
				self._localStorage.setItem(self._UserTokenName, token);

				if (profile.email) {
					self._snowPlow('setUserId', profile.email);
				}

				self.trackEvent('LoginSucceeded');

				self.trackUnstructured(new userDataRetrieved(profile));

				successCb();
			}
		});
	}

	//EVENTS

	function unstructEvent() {
		this.schema = null;
		this.data = null;
	}

	function userDataRetrieved(profile) {
		this.schema = 'user_data_retrieved/jsonschema/1-0-0';
		this.data = {
			"nickname": profile.nickname,
			"name": profile.name,
			"email": profile.email
		};
	}

	userDataRetrieved.prototype = new unstructEvent;
	userDataRetrieved.prototype.constructor = userDataRetrieved;


	// Namespace declaration
	namespace.hendrixClient = hendrixClient;
	namespace.unstructEvent = unstructEvent;
	namespace.userDataRetrieved = userDataRetrieved;

})(window.hendrixPoc = window.hendrixPoc || {});