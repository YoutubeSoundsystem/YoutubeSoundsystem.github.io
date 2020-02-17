var SignedIn = false;
var PlayerIn = false;

function onSignIn(googleUser) {
	var profile = googleUser.getBasicProfile();
	console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
	console.log('Name: ' + profile.getName());
	console.log('Image URL: ' + profile.getImageUrl());
	console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
	document.getElementsByClassName("menuItemButton")[0].style.display = "none";
	DOM.Topbar.AccountImage.style.display = "block";
	DOM.Topbar.AccountImage.style.backgroundImage = "url("+profile.getImageUrl()+")";
}

function signOut() {
	var auth2 = gapi.auth2.getAuthInstance();
	auth2.signOut().then(function () {
		console.log('User signed out.');
	});
	document.getElementsByClassName("menuItemButton")[0].style.display = "block";
	DOM.Topbar.AccountImage.style.display = "none";
}

var GoogleAuth;
var user;
var SCOPE = 'https://www.googleapis.com/auth/youtube';
function handleClientLoad() {
	gapi.load('client:auth2', initClient);
}

function initClient() {
var discoveryUrl = 'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest';
gapi.client.init({
	'apiKey': 'AIzaSyAw0S50zdoLiZaPoOoqZ5Yx_1IHUxV6Ris',
	'discoveryDocs': [discoveryUrl],
	'clientId': '413085846802-5md181l63m17r7brm9jc5vcje0vri7uo.apps.googleusercontent.com',
	'scope': SCOPE
}).then(function () {
	GoogleAuth = gapi.auth2.getAuthInstance();
	//GoogleAuth.isSignedIn.listen(updateSigninStatus);
	//l(GoogleAuth);

	user = GoogleAuth.currentUser.get();

	GoogleAuth.isSignedIn.listen(updateSigninStatus(user.isSignedIn()));
	//l(user);
	//setSigninStatus();

  // Call handleAuthClick function when user clicks on
  //      "Sign In/Authorize" button.
  // $('#sign-in-or-out-button').click(function() {
  //   handleAuthClick();
  // }); 
  // $('#revoke-access-button').click(function() {
  //   revokeAccess();
  // }); 
});
}
function handleAuthClick() {
	if (GoogleAuth.isSignedIn.get()) {
  // User is authorized and has clicked 'Sign out' button.
		GoogleAuth.signOut();
	} else {
	 	// User is not signed in. Start Google auth flow.
		GoogleAuth.signIn();
		// GoogleAuth.grantOfflineAccess({
		// 	prompt: "select_account"
		// });
	}
}
function revokeAccess() {
	GoogleAuth.disconnect();
}
function setSigninStatus(isSignedIn) {
	var user = GoogleAuth.currentUser.get();
	var isAuthorized = user.hasGrantedScopes(SCOPE);
	if (isAuthorized) {

	} 
	else {

	}
}
function updateSigninStatus(isSignedIn) {
	l("Signed In");
	var user = GoogleAuth.currentUser.get();
	//l(user.getBasicProfile());
	//setSigninStatus();
	if (isSignedIn){
		SignedIn = true;
		document.getElementsByClassName("menuItemButton")[0].style.display = "none";
		DOM.Topbar.AccountImage.style.display = "block";	
		DOM.Topbar.AccountImage.style.backgroundImage = "url("+user.Qt.UK")";

		if (PlayerIn == true){
			startHashHandling();
		}

		var i = setInterval(function(){
			// GoogleAuth.signIn({
			// 	prompt: 'none'
			// });

			user.reloadAuthResponse();
		}, 60*60000);
	}
}
function createPlaylist(title, desc, private, callback){
	var privacy;

	if (private){
		privacy = "unlisted";
	}
	else {
		privacy = "unlisted";
	}

	var request = gapi.client.request({
		'method': 'POST',
		'path': '/youtube/v3/playlists',
		'params': {'part': 'snippet,status'},
		'body': {
			"snippet": {
				"title": title,
				"description": desc
			},
			"status": {
				"privacyStatus": privacy
			}
		}
	});
	request.execute(function(response) {
		l(response);
		if (response.error == undefined){
			callback(response);
			pushMessage("Sucess! Playlist created");
		}
		else{
			pushMessage("There was a problem...");
		}
		// response.result.id = playListID
	});
}
function addToPlaylist(playlistId, videoId, callback){
	if (videoId.length != 0){
		var request = gapi.client.request({
			'method': 'POST',
			'path': '/youtube/v3/playlistItems',
			'params': {'part': 'snippet'},
			'body': {
				"snippet": {
					"playlistId": playlistId,
					"resourceId": {
						"kind": "youtube#video",
						"videoId": videoId[0]
						// "startAt": ,
						// "endAt": 
					}
				}
			}
		});
		request.execute(function(response) {
			videoId.shift();
			addToPlaylist(playlistId, videoId, callback);
		});
	}
	else if (videoId.length == 0){
		pushMessage("All Items added");
		callback();
	}
}


function deletePlaylist(playlistId){
	var request = gapi.client.request({
		'method': 'DELETE',
		'path': '/youtube/v3/playlists',
		'params': {'id': playlistId}
	});
	request.execute(function(response) {
		
		l(response);
		if (response == undefined){
			pushMessage("Playlist removed");
		}
		else{
			pushMessage("There was a problem...");
		}
	});
}

function deletePlaylistItem(playlistItemId){
	var request = gapi.client.request({
		'method': 'DELETE',
		'path': '/youtube/v3/playlistItems',
		'params': {'id': playlistItemId}
	});
	request.execute(function(response) {
		l(response);
		pushMessage("Song removed from Playlist");
	});
}

function renamePlaylist(playlistId, name){
	var request = gapi.client.request({
		'method': 'PUT',
		'path': '/youtube/v3/playlists',
		'params': {'part': 'snippet'},
		'body': {
			'id': playlistId,
			"snippet": {
				"title": name
			}
		}
	});
	request.execute(function(response) {
		l(response);
		pushMessage("Playlist Re-named");
	});
}

function moveSong(playlistId, playlistItemId, videoId, newPosition, callback){
	var request = gapi.client.request({
		'method': 'PUT',
		'path': '/youtube/v3/playlistItems',
		'params': {'part': 'snippet'},
		'body': {
			"id": playlistItemId,
			"snippet": {
				"playlistId": playlistId,
				"resourceId": {
					"kind": "youtube#video",
					"videoId": videoId
					// "startAt": ,
					// "endAt": 
				},
				"position": newPosition
			}
		}
	});
	request.execute(function(response) {
		pushMessage("Song Moved");
		callback(response);
	});
}
