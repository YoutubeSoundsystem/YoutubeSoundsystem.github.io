//     TO-DO
//  X  CLEAR QUEUE
//     SKIP FUNCTION, BUTTON
//	X  KEY PRESSES TO SKIP ETC
//     PAGINATION
//     LOADING CHANNELS, OTHER PAGES
//  X  JUMP 5 SECONDS
//  X  PLAY ALL
//  X  LOOP FUNCTION
//     RANDOM FUNCTION

	var channelID = "UCbq8Mfm4TrH_ux7z6VqQhhw";		//Youtube Channel ID to be loaded

	var playbackBarInt;								//Global Interval variable for Playback TimeBar updating
	var loopInt;	
	var time;

	var player;										//Global Youtube IFrame object

	class videoEntry {								//Class for storing info of videos that are availible for selection
		constructor(Id, Thumb, Title, Chan, ChanId, Dur){
			this.id = Id;							//Youtube video ID
			this.thumbnail = Thumb;					//Youtube Thumbnail URL (Medium 320px*180px version)
			this.title = Title;						//Actual video title
			this.channel = Chan;					//Channel to which the video belongs
			this.channelId = ChanId;					//Channel to which the video belongs
			this.duration = Dur;					//The viewing length of the video (in seconds)
		}
	}

	var DOM = {};
document.addEventListener("DOMContentLoaded", function(event) {
	console.log("DOM fully loaded and parsed");

	DOM.Playback = {
		Parent 				: document.getElementById("playback"),
		Thumbnail 			: document.getElementsByClassName("thumbPic")[0],
		Title 				: document.getElementsByClassName("playbackTitle")[0],
		Subtitle 			: document.getElementsByClassName("playbackSubtext")[0],
		TimeBar 			: document.getElementById("playbackBar"),
		Duration			: document.getElementsByClassName("durationCounter")[0],
		VolumeDisplay		: document.getElementsByClassName("volumeNum")[0],
		ScrubSliderBack		: document.getElementsByClassName("slider")[0],
		ScrubSliderFront	: document.getElementsByClassName("slider")[1],
		VolumeSliderBack	: document.getElementsByClassName("slider")[2],
		VolumeSliderFront	: document.getElementsByClassName("slider")[3],
		PlayButton			: document.getElementsByClassName("largeControl")[0],
		ForwardButton		: document.getElementsByClassName("smallControl")[2],
		BackButton			: document.getElementsByClassName("smallControl")[1],
		RandomButton		: document.getElementsByClassName("smallControl")[0],
		LoopButton			: document.getElementsByClassName("smallControl")[3],
		Controls			: document.getElementsByClassName("playbackSubSubCont")[0]
	};
	DOM.Queue = {
		Parent 				: document.getElementById("queue"),
		List 				: document.getElementsByClassName("queueList")[0],
		ClearButton 		: document.getElementsByClassName("queueButton")[0]
	};
	DOM.Sidebar = {
		Parent 				: document.getElementById("sidebar"),
		BigContainer		: document.getElementById("BigSidebarCont")
	};
	DOM.Topbar = {
		Parent 				: document.getElementsByClassName("menuCont")[0],
		Menu 				: document.getElementsByClassName("menu")[0],
		LogIn				: document.getElementsByClassName("menuItemButton")[0],
		AccountImage 		: document.getElementsByClassName("accountImage")[0],
		Search				: document.getElementById("searchText")
	};
	DOM.MainWindow = {
		BigContainer 		: document.getElementById("BigChannelCont")
	};

});

	var BSplayer = {};								//Main object for preforming essential video functions

	BSplayer.queue = [];							//Array of videoEntry objects, with the currently playing video always first
	BSplayer.currentVideo;
	//BSplayer.allVideos = [];
	BSplayer.displayedVideos = {};						//List of all videos whose info has been retrived via API in this session
	BSplayer.displayedIds = [];
	BSplayer.isPlaying = false;
	BSplayer.looping = false;
	BSplayer.addToQueue	= function(vidEntry){		//Takes videoEntry class objects
		this.queue.push(vidEntry);
		makeQueueEntry(vidEntry.title);
		if (this.queue.length == 1 && !this.isPlaying){
			this.nextTrack();
		}
	}
	BSplayer.nextTrack = function(){
		window.clearInterval(playbackBarInt);
		//document.getElementById("playbackBar").style.width = "0%";
		DOM.Playback.ScrubSliderBack.value = 0;
		DOM.Playback.ScrubSliderFront.value = 0;
		window.clearInterval(loopInt);
		DOM.Playback.LoopButton.classList.remove("loopActive");
		this.looping = false;
		if (this.queue[0] != undefined){
			if (this.currentVideo != undefined){
				var child = document.getElementsByClassName("queueEntry")[0];
				DOM.Queue.List.removeChild(child);
			}
			this.currentVideo = this.queue[0];
			player.loadVideoById({
				'videoId': this.currentVideo.id,
			  	'startSeconds': 0
			});
			this.toStart();
			this.play();
			this.queue.shift();

			DOM.Playback.ScrubSliderBack.style.visibility = "visible";
			DOM.Playback.ScrubSliderFront.style.visibility = "visible";

			document.getElementsByTagName('title')[0].innerHTML = "\""+this.currentVideo.title + "\" is playing";
			DOM.Playback.Thumbnail.style.backgroundImage = "url("+this.currentVideo.thumbnail+")";
			DOM.Playback.Title.innerHTML = this.currentVideo.title;
			DOM.Playback.Subtitle.innerHTML = this.currentVideo.channel;
			DOM.Playback.Duration.innerHTML = convertToDuration(Math.trunc(player.getCurrentTime()))+" / "+convertToDuration(Math.trunc(this.currentVideo.duration));
			DOM.Playback.ScrubSliderBack.value = 0;
			DOM.Playback.ScrubSliderFront.value = 0;

			playbackBarInt = window.setInterval(function() {	//This live updates the "TimeBar" every second
				DOM.Playback.ScrubSliderBack.value = (100*player.getCurrentTime()/(BSplayer.currentVideo.duration));
				DOM.Playback.ScrubSliderFront.value = (100*player.getCurrentTime()/(BSplayer.currentVideo.duration));

				DOM.Playback.Duration.innerHTML = convertToDuration(Math.trunc(player.getCurrentTime()))+" / "+convertToDuration(Math.trunc(BSplayer.currentVideo.duration));
			}, 1000);
		}
		else{
			this.isPlaying = false;
			this.currentVideo = undefined;
			window.clearInterval(playbackBarInt);
			this.play();
			player.stopVideo();

			var child = document.getElementsByClassName("queueEntry")[0];
			DOM.Queue.List.removeChild(child);

			document.getElementsByTagName('title')[0].innerHTML = "Youtube Soundsystem";
			DOM.Playback.Thumbnail.style.backgroundImage = "";
			DOM.Playback.Title.innerHTML = "";
			DOM.Playback.Subtitle.innerHTML = "";
			DOM.Playback.ScrubSliderBack.style.visibility = "hidden";
			DOM.Playback.ScrubSliderFront.style.visibility = "hidden";

			DOM.Playback.ScrubSliderBack.value = 0;
			DOM.Playback.ScrubSliderFront.value = 0;

			DOM.Playback.Duration.innerHTML = "";
		}
	}
	BSplayer.clearQueue = function(){				//Removes all but the first videoEntry (the one currently playing)
		for (x in this.queue){
			(function(){
				var child = document.getElementsByClassName("queueEntry")[1];
				DOM.Queue.List.removeChild(child);
			})();
		}
		this.queue.splice(0, this.queue.length);
	}
	BSplayer.play = function(){
		player.playVideo();
		if (this.currentVideo != undefined){
			this.isPlaying = true;
		}
		DOM.Playback.PlayButton.style.backgroundPosition = "center";
		DOM.Playback.PlayButton.style.backgroundImage = "url(Pause.svg)";
	}
	BSplayer.pause = function(){
		player.pauseVideo();
		this.isPlaying = false;
		DOM.Playback.PlayButton.style.backgroundPosition = "right";
		DOM.Playback.PlayButton.style.backgroundImage = "url(Play.svg)";
	}
	BSplayer.loop = function(minutes){				//Takes the time in minutes (integer) the video should loop for
		if (minutes != undefined){
			if (this.looping){
				BSplayer.looping = false;
				window.clearInterval(loopInt);
				DOM.Playback.LoopButton.classList.remove("loopActive");
			}
			else if (!this.looping){
				BSplayer.looping = true;
				loopInt = window.setTimeout(function(){
					BSplayer.looping = false
				}, (60000*minutes));
				DOM.Playback.LoopButton.classList.add("loopActive");
			}
		}
	}
	BSplayer.playAll = function(){		//Takes an array of videoEntry class objects
		for (x in this.displayedVideos){
			this.addToQueue(this.displayedVideos[x]);
		}
	}
	BSplayer.addRandom = function(times){
		for (i = 0; i<times; i++) {
			var randNum = Math.floor((Math.random() * (this.displayedIds.length)));
			this.addToQueue(this.displayedVideos[this.displayedIds[randNum]]);
		}
	}
	BSplayer.seekBy = function(seconds){			//Takes the time in seconds (integer, pos and neg) that the "scrubber" should be progresses
		if (Math.trunc(player.getCurrentTime()+seconds) < this.currentVideo.duration && Math.trunc(player.getCurrentTime()+seconds) > 0){
			player.seekTo(Math.trunc(player.getCurrentTime()+seconds), true);

			DOM.Playback.ScrubSliderBack.value = (100*player.getCurrentTime()/(BSplayer.currentVideo.duration));
			DOM.Playback.ScrubSliderFront.value = (100*player.getCurrentTime()/(BSplayer.currentVideo.duration));

			DOM.Playback.Duration.innerHTML = convertToDuration(Math.trunc(player.getCurrentTime()))+" / "+convertToDuration(Math.trunc(BSplayer.currentVideo.duration));
		}
		else if (Math.trunc(player.getCurrentTime()+seconds) >= this.currentVideo.duration){
			player.seekTo(this.currentVideo.duration-0.1);
		}
		else if (Math.trunc(player.getCurrentTime()+seconds) <= 0){
			player.seekTo(0, true);

			DOM.Playback.ScrubSliderBack.value = (100*player.getCurrentTime()/(BSplayer.currentVideo.duration));
			DOM.Playback.ScrubSliderFront.value = (100*player.getCurrentTime()/(BSplayer.currentVideo.duration));

			DOM.Playback.Duration.innerHTML = convertToDuration(Math.trunc(player.getCurrentTime()))+" / "+convertToDuration(Math.trunc(BSplayer.currentVideo.duration));
		}
		else if(this.currentVideo == undefined){
		}
	}
	BSplayer.toStart = function(){
		player.seekTo(0, true);
	}
	BSplayer.setVolume = function(number){

		var actualNum;
		if (number >= 100){
			actualNum = 100;
		}
		else if (number <= 0){
			actualNum = 0;
		}
		else{
			actualNum = number;
		}

		player.setVolume(actualNum);
		DOM.Playback.VolumeSliderBack.value = actualNum;
		DOM.Playback.VolumeSliderFront.value = actualNum;

		DOM.Playback.VolumeDisplay.style.opacity = "1";
		DOM.Playback.VolumeDisplay.innerHTML = actualNum;
		window.clearTimeout(time);
		time = window.setTimeout(function(){
			DOM.Playback.VolumeDisplay.style.opacity = "0";
		}, 1000);
	}

	function onPlayerStateChange(event){			//Event Listender for when a video is finished playing
		if(event.data==YT.PlayerState.ENDED){ 
			if (BSplayer.looping){
				BSplayer.toStart();
			}
			else{
				this.isPlaying = false;
				BSplayer.nextTrack();
			}
		}
	}
	document.onkeypress = function(event) {			//Event Listener for when a key is pressed (fires only once when held down)
	    if(event.which==32 || event.which==107) {
	    	event.preventDefault();
	    	if (BSplayer.isPlaying){
	    		BSplayer.pause();
	    	}
	    	else if(!BSplayer.isPlaying && BSplayer.currentVideo!=undefined){
				BSplayer.play();
			}
	    }
	};
	document.onkeydown = function(event) {			//Event Listener for when a key is pressed (fires multiple when held down)
	    if(event.shiftKey && event.which==39){
	    	event.preventDefault();
			BSplayer.seekBy(60);
		}
	    else if(event.which==39){
	    	event.preventDefault();
			BSplayer.seekBy(10);
		}

		else if(event.shiftKey && event.which==37){
	    	event.preventDefault();
			BSplayer.seekBy(-60);
		}
		else if(event.which==37){
	    	event.preventDefault();
			BSplayer.seekBy(-10);
		}

		else if(event.shiftKey && event.which==38){
	    	event.preventDefault();
			BSplayer.setVolume(player.getVolume()+10);
		}
		else if(event.which==38){
	    	event.preventDefault();
			BSplayer.setVolume(player.getVolume()+5);
		}

		else if(event.shiftKey && event.which==40){
	    	event.preventDefault();
			BSplayer.setVolume(player.getVolume()-10);
		}
		else if(event.which==40){
	    	event.preventDefault();
			BSplayer.setVolume(player.getVolume()-5);
		}
	};

	function onYouTubeIframeAPIReady() {
		player = new YT.Player('player', {			//Youtube Player Initialization 
			height: '390',
			width: '640',
			videoId: 'M7lc1UVf-VE', //Random video ID
			events: {
				//'onReady': onPlayerReady,
				'onStateChange': onPlayerStateChange	//Enables Event Listner for video state changes (ended, etc.) 
			}
		});
		window.addEventListener("load", function(event) {	//Fires when all elements and scripts in the DOM have finished loading
			console.log("All resources finished loading!");
			init();
		});
	}

	function NewXML(url, func){						//Function for making HTTP Requests

		var NX = new XMLHttpRequest();
		NX.open("GET", url, true);
		NX.onreadystatechange = function() {
			if (NX.readyState == 4) {
				func(JSON.parse(NX.responseText));
			}
		}
		NX.send();
	}
	function l(message){
		console.log(message);
	}

	var QueueEntryCounter = 0;

	function makeQueueEntry(vidName){				//Function for generating element of Queue Entries in the right side queue, takes the name of the entry (string)
		var cont = document.createElement("DIV");
		cont.classList.add("queueEntry");
		cont.id = QueueEntryCounter;
		cont.innerHTML = `
			<div class="queueEntryName">
				<span>${vidName}</span>
			</div>
			<div class="queueRemove"></div>
		`;
		QueueEntryCounter += 1;

		cont.addEventListener("click", function(event){
			for (x in DOM.Queue.List.getElementsByClassName("queueEntry")){
				if (DOM.Queue.List.getElementsByClassName("queueEntry")[x].id == this.id){
					if (event.target.className == "queueRemove"){

						if (DOM.Queue.List.getElementsByClassName("queueEntry")[0].id == this.id){
							BSplayer.nextTrack();
						}
						else{
							BSplayer.queue.splice(x-1, 1);
							var child = document.getElementsByClassName("queueEntry")[x];
							DOM.Queue.List.removeChild(child);	
						}
					}
					else if(x != 0 && event.target.className != "queueRemove"){
						DOM.Queue.List.insertBefore(document.getElementsByClassName("queueEntry")[x],DOM.Queue.List.getElementsByClassName("queueEntry")[1]);
						var temp = BSplayer.queue[x-1];
						BSplayer.queue.splice(x-1, 1);
						BSplayer.queue.unshift(temp);
					}
				}
			}
		});

		// var num = document.createElement("DIV");
		// num.classList.add("queueEntryName");
		// cont.appendChild(num);

		// var namae = document.createElement("SPAN");
		// namae.innerHTML = vidName;
		// num.appendChild(namae);

		DOM.Queue.List.appendChild(cont);
	}

//////////////////////////////////////
//									//
//		INITIALIZATION BEGIN		//
//									//
//////////////////////////////////////


	function init() {	
		player.unMute();							//Returns Channel Info, and the playlist ID that contains all videos in that channel
		loadSidebar();

		// if (location.hash === "#/Playlists"){
		//         loadPlaylistList();
		// }
		// l(window.location.hash);
		// 	window.location.hash = "/Playlists";

		if (location.hash === "#/Stations") {
	        loadChannel("UCbq8Mfm4TrH_ux7z6VqQhhw");
	    }
	    else if (location.hash.slice(0, 13) === "#/ChannelList"){
	        loadChannel(location.hash.slice(13, location.hash.length), false);
	    }
		else if (location.hash === "#/Channels") {
	        loadChannelList();
	    }
		 else if (location.hash.slice(0, 18) === "#/ChannelPlaylists"){
	        loadChannel(location.hash.slice(18, location.hash.length), true);
	    }
	    else if (location.hash === "#/Playlists") {
	        loadPlaylistList();
	    }
	    else if (location.hash.slice(0, 14) === "#/PlaylistList"){
	        loadPlaylist(location.hash.slice(14, location.hash.length));
	    }
	    else if (location.hash.slice(0, 8) === "#/Search"){
			searchTerm(decodeURI(location.hash.slice(8, location.hash.length)));
	    }

		window.addEventListener("hashchange", function(){
			l("Hash Changed to: "+window.location.hash);
			if (location.hash === "#/Stations") {
		        loadChannel("UCbq8Mfm4TrH_ux7z6VqQhhw");
		    }
		    else if (location.hash.slice(0, 13) === "#/ChannelList"){
		        loadChannel(location.hash.slice(13, location.hash.length), false);
		    }
			else if (location.hash === "#/Channels") {
		        loadChannelList();
		    }
			 else if (location.hash.slice(0, 18) === "#/ChannelPlaylists"){
		        loadChannel(location.hash.slice(18, location.hash.length), true);
		    }
		    else if (location.hash === "#/Playlists") {
		        loadPlaylistList();
		    }
		    else if (location.hash.slice(0, 14) === "#/PlaylistList"){
		        loadPlaylist(location.hash.slice(14, location.hash.length));
		    }
		    else if (location.hash.slice(0, 8) === "#/Search"){
				searchTerm(decodeURI(location.hash.slice(8, location.hash.length)));
		    }
		}, false);

		DOM.MainWindow.BigContainer.addEventListener("scroll", function(){
			if (this.scrollHeight - this.scrollTop === this.clientHeight){
					functionToCall(nextId, nextToken);
			}
		});
		DOM.Playback.VolumeSliderFront.oninput = function() {
			BSplayer.setVolume(this.value);
		};
		DOM.Playback.ScrubSliderFront.oninput = function() {
			player.seekTo(Math.trunc((this.value/100)*BSplayer.currentVideo.duration), true);
			//document.getElementById("playbackBar").style.width = (100*player.getCurrentTime()/(BSplayer.currentVideo.duration))+"%";
			DOM.Playback.ScrubSliderBack.value = this.value;
			DOM.Playback.Duration.innerHTML = convertToDuration(Math.trunc(player.getCurrentTime()))+" / "+convertToDuration(Math.trunc(BSplayer.currentVideo.duration));
		};
		DOM.Playback.Subtitle.addEventListener("click", function(){
			if (BSplayer.currentVideo != undefined){
				window.location.hash = "/ChannelList"+BSplayer.currentVideo.channelId;
			}
		});
		// DOM.Playback.PlayButton.addEventListener("click", function(){
		// 	if (BSplayer.isPlaying){
		// 		BSplayer.pause();
		// 	}
		// 	else if(!BSplayer.isPlaying && BSplayer.currentVideo!=undefined){
		// 		BSplayer.play();
		// 	}
		// });
		// DOM.Playback.ForwardButton.addEventListener("click", function(){
		// 	BSplayer.nextTrack();
		// });
		// DOM.Playback.BackButton.addEventListener("click", function(){
		// 	BSplayer.toStart();
		// });

		DOM.Queue.ClearButton.addEventListener("click", function(){
			BSplayer.clearQueue();
		});
		// DOM.Playback.LoopButton.addEventListener("click", function(){
		// 	if (BSplayer.currentVideo != undefined){
		// 		BSplayer.loop(60);
		// 	}
		// });
		// DOM.Playback.RandomButton.addEventListener("click", function(){
		// 	BSplayer.addRandom(1);
		// });

		// document.addEventListener("onkeypress", function(e){

		// });

		DOM.Topbar.Search.onkeypress = function(e){
			e.stopPropagation();
			if (e.which == '13'){
				window.location.hash = "/Search"+this.value;
			}
		};

		DOM.Playback.Controls.addEventListener("click", function(event){
			if (event.target == DOM.Playback.PlayButton){
				if (BSplayer.isPlaying){
					BSplayer.pause();
				}
				else if(!BSplayer.isPlaying && BSplayer.currentVideo!=undefined){
					BSplayer.play();
				}
			}
			else if (event.target == DOM.Playback.ForwardButton){
				BSplayer.nextTrack();
			}
			else if (event.target == DOM.Playback.BackButton){
				BSplayer.toStart();
			}
			else if (event.target == DOM.Playback.LoopButton){
				if (BSplayer.currentVideo != undefined){
					BSplayer.loop(60);
				}
			}
			else if (event.target == DOM.Playback.RandomButton){
				BSplayer.addRandom(1);
			}
		});

		DOM.Topbar.Menu.addEventListener('click', function(event){
			// if (event.target == document.getElementsByClassName("menuItem")[0]){
			// 	window.location.hash = '/Songs';
			// 	//document.getElementsByClassName("menuItem")[0].style.backgroundColor = 'rgb(255, 245, 245)';
			// }
			// else if (event.target == document.getElementsByClassName("menuItem")[1]){
			// 	window.location.hash = '/Playlists';
			// 	//document.getElementsByClassName("menuItem")[1].style.backgroundColor = 'rgb(255, 245, 245)';
			// }
			// else if (event.target == document.getElementsByClassName("menuItem")[2]){
			// 	window.location.hash = '/Channels';
			// 	//document.getElementsByClassName("menuItem")[2].style.backgroundColor = 'rgb(255, 245, 245)';
			// }
			// else if (event.target == document.getElementsByClassName("menuItem")[3]){
			// 	window.location.hash = '/Stations';
			// 	//document.getElementsByClassName("menuItem")[3].style.backgroundColor = 'rgb(255, 245, 245)';
			// }
			if (event.target == document.getElementsByClassName("menuItemButton")[0]){
				GoogleAuth.signIn();
			}
			else if (event.target == document.getElementsByClassName("accountImage")[0]){
				//popup a litte menu that lets u access yur account info, settings, sign out, etc.
			}

		});
		var Viewer = document.getElementById("viewer");
		DOM.Sidebar.Parent.addEventListener("click", function(){
			DOM.Sidebar.Parent.classList.toggle("hidden");
			Viewer.classList.toggle("expanded");
		});
	}

//////////////////////////////////
//								//
//		INITIALIZATION END		//
//								//
////////////////////////////////// 

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
	var SCOPE = 'https://www.googleapis.com/auth/youtube';
	function handleClientLoad() {
		gapi.load('client:auth2', initClient);
	}

	function initClient() {
    var discoveryUrl = 'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest';
	gapi.client.init({
		'apiKey': 'AIzaSyDx3Y44Fu4LeTS3dBHIFr4ybKao_Q-0MXw',
		'discoveryDocs': [discoveryUrl],
		'clientId': '134898753356-07emi6gffbf4iq0hkv59rdeuorvnmrff.apps.googleusercontent.com',
		'scope': SCOPE
	}).then(function () {
		GoogleAuth = gapi.auth2.getAuthInstance();
		//GoogleAuth.isSignedIn.listen(updateSigninStatus);
		//l(GoogleAuth);

		var user = GoogleAuth.currentUser.get();

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
			document.getElementsByClassName("menuItemButton")[0].style.display = "none";
			DOM.Topbar.AccountImage.style.display = "block";	
			DOM.Topbar.AccountImage.style.backgroundImage = "url("+user.getBasicProfile().Paa+")";
		}
	}
	function createPlaylist(title, desc, private, callback){
		var privacy;

		if (private){
			privacy = "private";
		}
		else {
			privacy = "public";
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
			callback(response);
			// response.result.id = playListID
		});
	}

