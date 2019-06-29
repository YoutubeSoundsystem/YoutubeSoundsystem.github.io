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
		constructor(Id, Thumb, Title, Chan, Dur){
			this.id = Id;							//Youtube video ID
			this.thumbnail = Thumb;					//Youtube Thumbnail URL (Medium 320px*180px version)
			this.title = Title;						//Actual video title
			this.channel = Chan;					//Channel to which the video belongs
			this.duration = Dur;					//The viewing length of the video (in seconds)
		}
	}

	var DOMInterface = {};							//Stores elements that are used frequently for brevity
	DOMInterface.Playback = {
		Thumbnail 			: document.getElementsByClassName("thumbPic")[0],
		Title 				: document.getElementsByClassName("playbackTitle")[0],
		SubTitle 			: document.getElementsByClassName("playbackSubtext")[0],
		TimeBar 			: document.getElementById("playbackBar"),
		DurationDisplay		: document.getElementsByClassName("durationCounter")[0],
		VolumeDisplay		: document.getElementsByClassName("volumeNum")[0],
		VolumeSliderBack	: document.getElementsByClassName("slider")[0],
		VolumeSliderFront	: document.getElementsByClassName("slider")[1]
	};
	DOMInterface.Queue = {
		List 				: document.getElementsByClassName("queueList")[0],
		ClearButton 		: document.getElementsByClassName("queueButton")[0]
	};

	var BSplayer = {};								//Main object for preforming essential video functions

	BSplayer.queue = [];							//Array of videoEntry objects, with the currently playing video always first
	BSplayer.currentVideo;
	BSplayer.allVideos = [];
	BSplayer.displayedVideos = [];						//List of all videos whose info has been retrived via API in this session
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
		document.getElementsByClassName("slider")[0].value = 0;
		document.getElementsByClassName("slider")[1].value = 0;
		window.clearInterval(loopInt);
		document.getElementsByClassName("smallControl")[3].classList.remove("loopActive");
		this.looping = false;
		if (this.queue[0] != undefined){
			if (this.isPlaying){
				var child = document.getElementsByClassName("queueEntry")[0];
				var parent = document.getElementsByClassName("queueList")[0];
				parent.removeChild(child);
			}
			this.currentVideo = this.queue[0];
			player.loadVideoById({
				'videoId': this.currentVideo.id,
			  	'startSeconds': 0
			});
			this.toStart();
			this.play();
			this.queue.shift();

			document.getElementsByClassName("slider")[0].style.visibility = "visible";
			document.getElementsByClassName("slider")[1].style.visibility = "visible";

			document.getElementsByTagName('title')[0].innerHTML = "\""+this.currentVideo.title + "\" is playing";
			document.getElementsByClassName("thumbPic")[0].style.backgroundImage = "url("+this.currentVideo.thumbnail+")";
			document.getElementsByClassName("playbackTitle")[0].innerHTML = this.currentVideo.title;
			document.getElementsByClassName("playbackSubtext")[0].innerHTML = this.currentVideo.channel;
			document.getElementsByClassName("durationCounter")[0].innerHTML = convertToDuration(Math.trunc(player.getCurrentTime()))+" / "+convertToDuration(Math.trunc(this.currentVideo.duration));

			//document.getElementById("playbackBar").style.width = (100*player.getCurrentTime()/(this.currentVideo.duration))+"%";

			document.getElementsByClassName("slider")[0].value = 0;
			document.getElementsByClassName("slider")[1].value = 0;

			playbackBarInt = window.setInterval(function() {	//This live updates the "TimeBar" every second
				//document.getElementById("playbackBar").style.width = (100*player.getCurrentTime()/(BSplayer.currentVideo.duration))+"%";

				document.getElementsByClassName("slider")[0].value = (100*player.getCurrentTime()/(BSplayer.currentVideo.duration));
				document.getElementsByClassName("slider")[1].value = (100*player.getCurrentTime()/(BSplayer.currentVideo.duration));

				document.getElementsByClassName("durationCounter")[0].innerHTML = convertToDuration(Math.trunc(player.getCurrentTime()))+" / "+convertToDuration(Math.trunc(BSplayer.currentVideo.duration));
			}, 1000);
		}
		else{
			this.isPlaying = false;
			this.currentVideo = undefined;
			window.clearInterval(playbackBarInt);
			this.play();
			player.stopVideo();

			var child = document.getElementsByClassName("queueEntry")[0];
			var parent = document.getElementsByClassName("queueList")[0];
			parent.removeChild(child);

			document.getElementsByTagName('title')[0].innerHTML = "Youtube Soundsystem";
			document.getElementsByClassName("thumbPic")[0].style.backgroundImage = "";
			document.getElementsByClassName("playbackTitle")[0].innerHTML = "";
			document.getElementsByClassName("playbackSubtext")[0].innerHTML = "";
			//document.getElementById("playbackBar").style.width = "0%";
			document.getElementsByClassName("slider")[0].style.visibility = "hidden";
			document.getElementsByClassName("slider")[1].style.visibility = "hidden";

			document.getElementsByClassName("slider")[0].value = 0;
			document.getElementsByClassName("slider")[1].value = 0;

			document.getElementsByClassName("durationCounter")[0].innerHTML = "";
		}
	}
	BSplayer.clearQueue = function(){				//Removes all but the first videoEntry (the one currently playing)
		for (x in this.queue){
			(function(){
				var child = document.getElementsByClassName("queueEntry")[1];
				var parent = document.getElementsByClassName("queueList")[0];
				parent.removeChild(child);
			})();
		}
		this.queue.splice(0, this.queue.length);
	}
	BSplayer.play = function(){
		player.playVideo();
		//l("played");
		if (this.currentVideo != undefined){
			this.isPlaying = true;
		}
		document.getElementsByClassName("largeControl")[0].style.backgroundPosition = "center";
		document.getElementsByClassName("largeControl")[0].style.backgroundImage = "url(Pause.svg)";
	}
	BSplayer.pause = function(){
		player.pauseVideo();
		//l("paused");
		this.isPlaying = false;
		document.getElementsByClassName("largeControl")[0].style.backgroundPosition = "right";
		document.getElementsByClassName("largeControl")[0].style.backgroundImage = "url(Play.svg)";
	}
	BSplayer.loop = function(minutes){				//Takes the time in minutes (integer) the video should loop for
		if (minutes != undefined){
			if (this.looping){
				BSplayer.looping = false;
				window.clearInterval(loopInt);
				document.getElementsByClassName("smallControl")[3].classList.remove("loopActive");
				//document.getElementsByClassName("smallControl")[3].style.backgroundColor = "transparent";
				//document.getElementsByClassName("smallControl")[3].style.backgroundImage = "url('Loop.svg')";
			}
			else if (!this.looping){
				BSplayer.looping = true;
				loopInt = window.setTimeout(function(){
					BSplayer.looping = false
				}, (60000*minutes));
				document.getElementsByClassName("smallControl")[3].classList.add("loopActive");
				//document.getElementsByClassName("smallControl")[3].style.backgroundColor = "rgb(234, 49, 49)";
				//document.getElementsByClassName("smallControl")[3].style.backgroundImage = "url('LoopWhite.svg')";
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
			var randNum = Math.floor((Math.random() * (this.displayedVideos.length)));
			this.addToQueue(this.displayedVideos[randNum]);
		}
	}
	BSplayer.seekBy = function(seconds){			//Takes the time in seconds (integer, pos and neg) that the "scrubber" should be progresses
		if (Math.trunc(player.getCurrentTime()+seconds) < this.currentVideo.duration && Math.trunc(player.getCurrentTime()+seconds) > 0){
			player.seekTo(Math.trunc(player.getCurrentTime()+seconds), true);
			//document.getElementById("playbackBar").style.width = (100*player.getCurrentTime()/(BSplayer.currentVideo.duration))+"%";

			document.getElementsByClassName("slider")[0].value = (100*player.getCurrentTime()/(BSplayer.currentVideo.duration));
			document.getElementsByClassName("slider")[1].value = (100*player.getCurrentTime()/(BSplayer.currentVideo.duration));

			document.getElementsByClassName("durationCounter")[0].innerHTML = convertToDuration(Math.trunc(player.getCurrentTime()))+" / "+convertToDuration(Math.trunc(BSplayer.currentVideo.duration));
		}
		else if (Math.trunc(player.getCurrentTime()+seconds) >= this.currentVideo.duration){
			//this.nextTrack();
			player.seekTo(this.currentVideo.duration-0.1);
		}
		else if (Math.trunc(player.getCurrentTime()+seconds) <= 0){
			player.seekTo(0, true);
			//document.getElementById("playbackBar").style.width = (100*player.getCurrentTime()/(BSplayer.currentVideo.duration))+"%";

			document.getElementsByClassName("slider")[0].value = (100*player.getCurrentTime()/(BSplayer.currentVideo.duration));
			document.getElementsByClassName("slider")[1].value = (100*player.getCurrentTime()/(BSplayer.currentVideo.duration));

			document.getElementsByClassName("durationCounter")[0].innerHTML = convertToDuration(Math.trunc(player.getCurrentTime()))+" / "+convertToDuration(Math.trunc(BSplayer.currentVideo.duration));
		}
		else if(this.currentVideo == undefined){
		}
	}
	BSplayer.toStart = function(){
		player.seekTo(0, true);
	}
	BSplayer.setVolume = function(number){
		var sliderback = document.getElementsByClassName("slider")[2];
		var sliderfront = document.getElementsByClassName("slider")[3];

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
		sliderback.value = actualNum;
		sliderfront.value = actualNum;

		document.getElementsByClassName("volumeNum")[0].style.opacity = "1";
		document.getElementsByClassName("volumeNum")[0].innerHTML = actualNum;
		window.clearTimeout(time);
		time = window.setTimeout(function(){
			document.getElementsByClassName("volumeNum")[0].style.opacity = "0";
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
				//console.log(NX.responseText);
			}
		}
		NX.send();
	}
	function l(message){
		console.log(message);
	}

	// function makeVideoEntry(){						//Function for generating elements of Song Entries in the currently displayed list
	// 	var cont = document.createElement("DIV");
	// 	cont.classList.add("songEntry");

	// 	var num = document.createElement("SPAN");
	// 	num.classList.add("entryNum");
	// 	cont.appendChild(num);

	// 	var namae = document.createElement("SPAN");
	// 	namae.classList.add("entryName");
	// 	cont.appendChild(namae);

	// 	var duration = document.createElement("SPAN");
	// 	duration.classList.add("entryDuration");
	// 	cont.appendChild(duration);

	// 	document.getElementsByClassName("songList")[0].appendChild(cont);
	// }

	var QueueEntryCounter = 0;

	function makeQueueEntry(vidName){				//Function for generating element of Queue Entries in the right side queue, takes the name of the entry (string)
		var cont = document.createElement("DIV");
		cont.classList.add("queueEntry");
		cont.id = QueueEntryCounter;
		QueueEntryCounter += 1;

		cont.addEventListener("click", function(){
			if (document.getElementsByClassName("queueList")[0].getElementsByClassName("queueEntry")[0].id == this.id){
				BSplayer.nextTrack();
			}
			else{
				for (x in document.getElementsByClassName("queueList")[0].getElementsByClassName("queueEntry")){
					if (document.getElementsByClassName("queueList")[0].getElementsByClassName("queueEntry")[x].id == this.id){
						BSplayer.queue.splice(x-1, 1);
						var child = document.getElementsByClassName("queueEntry")[x];
						var parent = document.getElementsByClassName("queueList")[0];
						parent.removeChild(child);
					}
				}
			}

			// if (document.getElementsByClassName("queueList")[0].getElementsByClassName("queueEntry")[0].id == this.id){
			// 	BSplayer.nextTrack();
			// }
			// else{
			// 	for (x in document.getElementsByClassName("queueList")[0].getElementsByClassName("queueEntry")){
			// 		if (document.getElementsByClassName("queueList")[0].getElementsByClassName("queueEntry")[x].id == this.id){
			// 			BSplayer.queue.unshift(BSplayer.queue[x-1]);
			// 			BSplayer.queue.splice(x, 1);
			// 			//BSplayer.queue.unshift(temp);
			// 			BSplayer.nextTrack();

			// 			var child = document.getElementsByClassName("queueEntry")[x];
			//  			var parent = document.getElementsByClassName("queueList")[0];
			//  			parent.removeChild(child);

			//  			parent.getElementsByClassName("queueEntry")[0].getElementsByTagName("SPAN")[0].innerHTML = BSplayer.currentVideo.title;
			// 		}
			// 	}
			// }
		});

		var num = document.createElement("DIV");
		num.classList.add("queueEntryName");
		cont.appendChild(num);

		var namae = document.createElement("SPAN");
		namae.innerHTML = vidName;
		num.appendChild(namae);

		document.getElementsByClassName("queueList")[0].appendChild(cont);
	}

	// function setListeners(vidId){					//WORK IN PROGRESS, given a concatenated string of video IDs, populates the displayed list with them
	// 	NewXML("https://www.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails&id="+vidId+"&key=AIzaSyBlR4XMekTLyLoIedeCuvBQ_EvCccqosgg", function (arg) {

	// 		for (x in arg.items){
	// 			document.getElementsByClassName("entryNum")[x].innerHTML = (parseInt(x)+1)+".";
	// 			document.getElementsByClassName("entryName")[x].innerHTML = ""+arg.items[x].snippet.title;
	// 			document.getElementsByClassName("entryDuration")[x].innerHTML = ""+convertTime(arg.items[x].contentDetails.duration);

	// 			var video = new videoEntry(
	// 				arg.items[x].id,
	// 				arg.items[x].snippet.thumbnails.medium.url,
	// 				arg.items[x].snippet.title,
	// 				arg.items[x].snippet.channelTitle,
	// 				convertToSeconds(arg.items[x].contentDetails.duration)
	// 			);
	// 			BSplayer.allVideos.push(video);
	// 			BSplayer.displayedVideos.push(video);
	// 			var videoINDEX = BSplayer.allVideos.length-1;

	// 			var songEntry = document.getElementsByClassName("songEntry")[x];
	// 			var videoID = arg.items[x].id;
	// 			var videoTHUMB = arg.items[x].snippet.thumbnails.medium.url;
	// 			var videoTITLE = arg.items[x].snippet.title;
	// 			var videoCHANNEL = arg.items[x].snippet.channelTitle;
	// 			var videoDURATION = convertToSeconds(arg.items[x].contentDetails.duration);
	// 			(function(vid, thumb, title, chan, dur ,ind) {	//Adds Event Listners for clicks
	// 				songEntry.id = videoID;
	// 				songEntry.addEventListener("click", function(){
	// 					BSplayer.addToQueue(BSplayer.allVideos[ind]);
	// 				});
	// 			})(videoID, videoTHUMB, videoTITLE, videoCHANNEL, videoDURATION, videoINDEX);
	// 		}
	// 	});
	// }

//////////////////////////////////////
//									//
//		INITIALIZATION BEGIN		//
//									//
//////////////////////////////////////


	function init() {	
		player.unMute();							//Returns Channel Info, and the playlist ID that contains all videos in that channel
		// NewXML("https://www.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2CbrandingSettings&id="+channelID+"&key=AIzaSyBlR4XMekTLyLoIedeCuvBQ_EvCccqosgg", function (arg) {
		// 	document.getElementsByClassName('channelHead')[0].style.backgroundImage = "url("+arg.items[0].brandingSettings.image.bannerImageUrl+")";
		// 	document.getElementsByClassName('channelName')[0].innerHTML = arg.items[0].snippet.title;

		// 	document.getElementsByClassName('channelSubtext')[0].innerHTML = "Channel";
		
		// 	var maxResults = "10"; //The number of results returned upon requesting all channel videos.
		// 	// The absolute max number is 50, if you want more, have to do pagination using a key given in the first request

		// 	NewXML("https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults="+maxResults+"&playlistId="+arg.items[0].contentDetails.relatedPlaylists.uploads+"&key=AIzaSyBlR4XMekTLyLoIedeCuvBQ_EvCccqosgg", function (arg) {
		// 		var idString = "";
		// 		for (vid in arg.items){
		// 			makeVideoEntry();
		// 			if ((parseInt(vid)+1) == arg.items.length){
		// 				console.log("loop finished");
		// 				idString += (arg.items[vid].contentDetails.videoId);
		// 				//When done, send the vid IDs and make the request
		// 				setListeners(idString);
		// 			}
		// 			else {
		// 				idString += (arg.items[vid].contentDetails.videoId + ",");
		// 				//Concatenate all the ids of the videos returned, so that we can get the info for all of them in one request (up to 50)
		// 			}				
		// 		}			
		// 	});	
		// });
				loadSidebar();

		if (location.hash === "#/Playlists"){
		        loadPlaylistList();
		}
		l(window.location.hash);
			window.location.hash = "/Playlists";
		l(window.location.hash);
		document.getElementsByClassName("menuItem")[1].style.backgroundColor = 'rgb(255, 245, 245)';

		window.addEventListener("hashchange", function(){
			l("Hash Changed to: "+window.location.hash);
			if (location.hash === "#/Stations") {
				l("1");
		        loadChannel("UCbq8Mfm4TrH_ux7z6VqQhhw");
		    }
		    else if (location.hash.slice(0, 13) === "#/ChannelList"){
				l("2");
		        loadChannel(location.hash.slice(13, location.hash.length));
		    }
			else if (location.hash === "#/Channels") {
				l("3");
		        loadChannelList();
		    }
		    else if (location.hash === "#/Playlists") {
				l("4");
		        loadPlaylistList();
		    }
		    else if (location.hash.slice(0, 14) === "#/PlaylistList"){
				l("5");
		        loadPlaylist(location.hash.slice(14, location.hash.length));
		    }
		}, false);

			//window.location.hash = "/Playlists";
				// loadSidebar();
				//loadPlaylistList();

		// var BigCont = document.getElementById("BigChannelCont");
		// BigCont.addEventListener("scroll", function(){

		// });

		var BigCont = document.getElementById("BigChannelCont");
		BigCont.addEventListener("scroll", function(){
			if (BigCont.scrollHeight - BigCont.scrollTop === BigCont.clientHeight){
					functionToCall(nextId, nextToken);
			}
		});

		//var sliderback = document.getElementsByClassName("slider")[0];
		var sliderfront = document.getElementsByClassName("slider")[3];

		//There are two sliders: the front one shows the scubber "grab-on", and the one behind it highlights the fill infront of it
		//This is a CSS problem, there wasn't a good cross-browser way to do this

		sliderfront.oninput = function() {
			BSplayer.setVolume(this.value);
		}


		var sliderfrontDur = document.getElementsByClassName("slider")[1];
		var sliderbackDur = document.getElementsByClassName("slider")[0];

		sliderfrontDur.oninput = function() {
			player.seekTo(Math.trunc((this.value/100)*BSplayer.currentVideo.duration), true);
			//document.getElementById("playbackBar").style.width = (100*player.getCurrentTime()/(BSplayer.currentVideo.duration))+"%";
			sliderbackDur.value = this.value;
			document.getElementsByClassName("durationCounter")[0].innerHTML = convertToDuration(Math.trunc(player.getCurrentTime()))+" / "+convertToDuration(Math.trunc(BSplayer.currentVideo.duration));
		}

		var Backward = document.getElementsByClassName("smallControl")[1];
		var Forward = document.getElementsByClassName("smallControl")[2];
		var Play = document.getElementsByClassName("largeControl")[0];

		Play.addEventListener("click", function(){
			if (BSplayer.isPlaying){
				BSplayer.pause();
			}
			else if(!BSplayer.isPlaying && BSplayer.currentVideo!=undefined){
				BSplayer.play();
			}
		});
		Forward.addEventListener("click", function(){
			BSplayer.nextTrack();
		});
		Backward.addEventListener("click", function(){
			BSplayer.toStart();
		});

		var Clear = document.getElementsByClassName("queueButton")[0];
		Clear.addEventListener("click", function(){
			BSplayer.clearQueue();
		});

		var Loop = document.getElementsByClassName("smallControl")[3];
		Loop.addEventListener("click", function(){
			if (BSplayer.currentVideo != undefined){
				BSplayer.loop(60);
			}
		});

		var Random = document.getElementsByClassName("smallControl")[0];
		Random.addEventListener("click", function(){
			BSplayer.addRandom(1);
		});

		// var PlayAll = document.getElementsByClassName("channelActionButton")[0];
		// PlayAll.addEventListener("click", function(){
		// 	BSplayer.playAll();
		// });

		document.getElementsByClassName("menu")[0].addEventListener('click', function(event){
			l(event);
			if (event.target == document.getElementsByClassName("menuItem")[0]){
				window.location.hash = '/Songs';
				document.getElementsByClassName("menuItem")[0].style.backgroundColor = 'rgb(255, 245, 245)';
			}
			else if (event.target == document.getElementsByClassName("menuItem")[1]){
				window.location.hash = '/Playlists';
				document.getElementsByClassName("menuItem")[1].style.backgroundColor = 'rgb(255, 245, 245)';
			}
			else if (event.target == document.getElementsByClassName("menuItem")[2]){
				window.location.hash = '/Channels';
				document.getElementsByClassName("menuItem")[2].style.backgroundColor = 'rgb(255, 245, 245)';
			}
			else if (event.target == document.getElementsByClassName("menuItem")[3]){
				window.location.hash = '/Stations';
				document.getElementsByClassName("menuItem")[3].style.backgroundColor = 'rgb(255, 245, 245)';
			}
			else if (event.target == document.getElementsByClassName("menuItemButton")[0]){
				GoogleAuth.signIn();
			}
			else if (event.target == document.getElementsByClassName("accountImage")[0]){
				//popup a litte menu that lets u access yur account info, settings, sign out, etc.
			}

		});

		// var Songs = document.getElementsByClassName("menuItem")[0];
		// Songs.addEventListener("click", function(){
		// 	window.location.hash = '/Songs';
		// });
		// var Playlists = document.getElementsByClassName("menuItem")[1];
		// Playlists.addEventListener("click", function(){
		// 	window.location.hash = '/Playlists';
		// });
		// var Channels = document.getElementsByClassName("menuItem")[2];
		// Channels.addEventListener("click", function(){
		// 	window.location.hash = '/Channels';
		// });
		// var Stations = document.getElementsByClassName("menuItem")[3];
		// Stations.addEventListener("click", function(){
		// 	window.location.hash = '/Stations';
		// });

		// var Edit = document.getElementsByClassName("channelActionButton")[2];
		// Edit.addEventListener("click", function(){
		// 	signOut();
		// });

		// var SignIn = document.getElementsByClassName("menuItemButton")[0];
		// SignIn.addEventListener("click", function(){
		// 	//l("Log In Clicked");
		// 	//document.getElementsByClassName("g-signin2")[0].getElementsByTagName("DIV")[0].click();
		// 	GoogleAuth.signIn();
		// });

		var Sidebar = document.getElementById("sidebar");
		var Viewer = document.getElementById("viewer");
		Sidebar.addEventListener("click", function(){
			Sidebar.classList.toggle("hidden");
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
			document.getElementsByClassName("accountImage")[0].style.display = "block";
			document.getElementsByClassName("accountImage")[0].style.backgroundImage = "url("+profile.getImageUrl()+")";
	}

	function signOut() {
		var auth2 = gapi.auth2.getAuthInstance();
		auth2.signOut().then(function () {
			console.log('User signed out.');
		});
		document.getElementsByClassName("menuItemButton")[0].style.display = "block";
		document.getElementsByClassName("accountImage")[0].style.display = "none";
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
			document.getElementsByClassName("accountImage")[0].style.display = "block";	
			document.getElementsByClassName("accountImage")[0].style.backgroundImage = "url("+user.getBasicProfile().Paa+")";
		}
	}

	// var request = gapi.client.request({
	// 	'method': 'GET',
	// 	'path': /youtube/v3/channels,
	// 	'params': {'part': 'snippet', 'mine': 'true'}
	// });
	// request.execute(function(response) {
	// 	console.log(response);
	// });

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
		});
	}

