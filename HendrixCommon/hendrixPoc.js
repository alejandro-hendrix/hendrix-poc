(function(namespace) {

	function hendrixClient(hendrixConfig) {

		if (!hendrixConfig || !hendrixConfig.auth0Lock || !hendrixConfig.snowplow || !hendrixConfig.localStorage || !hendrixConfig.igluUri || !hendrixConfig.uuid) {
			throw "Cannot initialize hendrixClient. Please provide valid constructor parameters."
			return;
		}

		this._auth0Lock = hendrixConfig.auth0Lock;
		this._snowPlow = hendrixConfig.snowplow;
		this._localStorage = hendrixConfig.localStorage;
		this._igluUri = hendrixConfig.igluUri;
		this._uuid = hendrixConfig.uuid;

		this._UserTokenName = 'userToken';	
		this._customContextSchema = 'custom_context/jsonschema/1-0-0';		
		this.eventCategories = {
			anonymous: 'anonymous',
			authenticated: 'authenticated'
		}

		this._contexts = [{
				schema: this._igluUri + this._customContextSchema, 
				data: { "uuid": this._uuid }	
			 }];

		this._initSnowplow();
		
	}

	hendrixClient.prototype._initSnowplow = function() {

		this._snowPlow('newTracker', 'co', 'collector.hendrix.clients.amido.com', { // Initialise a tracker
			appId: 'hendrixPoc',
			cookieDomain: 'web'
		});

		this._snowPlow('enableActivityTracking', 5, 30);
		this._snowPlow('enableLinkClickTracking');
		this._snowPlow('trackPageView', null, this._contexts);
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

		this.trackEvent(this.eventCategories.authenticated, 'logout', elementId);

	}


	//hendrixClient.prototype.track = function(eventType, eventName, elementId) {
	//	this._snowPlow(eventType, eventName, elementId);
	//}

	hendrixClient.prototype.trackEvent = function(category, action, label, property, value) {
		this._snowPlow('trackStructEvent', 
			category, 
			action,
			label,
			property,
			value,
			this._contexts);
	}

	hendrixClient.prototype.trackUnstructured = function(unstructEvent) {
		this._snowPlow('trackUnstructEvent', 
			{
				schema: this._igluUri + unstructEvent.schema, 
				data: unstructEvent.data
			},
			this._contexts);
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
				self.trackEvent(self.eventCategories.anonymous, 'Login-Failed');
				failCb();
			} else {
				// Save the JWT token.
				self._localStorage.setItem(self._UserTokenName, token);

				if (profile.email) {
					self._snowPlow('setUserId', profile.email);
				}

				self.trackEvent(self.eventCategories.authenticated, 'Login-Succeeded');

				if (profile.user_id.indexOf("facebook") > -1) 
				{
					self.trackUnstructured(new facebookProfileRead(profile));
				}
				else
				{
					self.trackUnstructured(new userDataRetrieved(profile));
				}

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

	function facebookProfileRead(profile){
		this.schema = 'facebook_profile_read/jsonschema/1-0-0';
		this.data = {
			"name": profile.name,
			"email": profile.email,
			"given_name": profile.given_name,
			"family_name": profile.family_name,
			"gender": profile.gender,
			"picture": '',
			"age_range_min": profile.age_range.min,
			"birthday": profile.birthday,
			"updated_time": profile.updated_time,
			"installed": profile.installed,
			"is_verified": profile.verified,
			"link": '',
			"locale": profile.locale,
			"name_format": profile.name_format,
			"timezone": profile.timezone,
			"third_party_id": profile.third_party_id,
			"verified": profile.verified,
			"nickname": profile.nickname,
			"email_verified": profile.email_verified,
			"clientID": profile.clientID,
			"updated_at": profile.updated_at,
			"user_id": profile.user_id,
			"created_at": profile.created_at,
			"global_client_id": profile.global_client_id
			}
	}
	facebookProfileRead.prototype = new unstructEvent;
	facebookProfileRead.prototype.constructor = facebookProfileRead;


	// Namespace declaration
	namespace.hendrixClient = hendrixClient;
	namespace.unstructEvent = unstructEvent;
	namespace.userDataRetrieved = userDataRetrieved;
	namespace.facebookProfileRead = facebookProfileRead;

})(window.hendrixPoc = window.hendrixPoc || {});