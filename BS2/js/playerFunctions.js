var BSplayer = {};								//Main object for preforming essential video functions

BSplayer.queue = [];							//Array of videoEntry objects, with the currently playing video always first
BSplayer.currentVideo;
BSplayer.currentPlaylistIndex = 0;
BSplayer.currentPlaylistId;
BSplayer.displayedVideos = {};						//List of all videos whose info has been retrived via API in this session
BSplayer.displayedPlaylist = [];
BSplayer.displayedIds = [];
//BSplayer.displayedPlaylistIds = [];
BSplayer.isPlaying = false;
BSplayer.isPlaylistPlaying = false;
BSplayer.looping = false;
BSplayer.loopingPlaylist = false;
BSplayer.addToQueue	= function(vidEntry){		//Takes videoEntry class objects
	//l(vidEntry);
	if(vidEntry != undefined){	
		this.queue.push(vidEntry);
		makeQueueEntry(vidEntry.title);
		if (this.queue.length == 1 && this.currentVideo == undefined){
			BSplayer.nextTrack();
		}
		//window.localStorage.setItem('queue', JSON.stringify(BSplayer.queue));
			updateQueue();
	}
}
BSplayer.addToPlaylistQueue	= function(vidEntry){		//Takes videoEntry class objects
	//l(vidEntry);
	if(vidEntry != undefined){	
		//this.queue.push(vidEntry);
		makePlaylistQueueEntry(vidEntry.title);
		if (this.queue.length == 0 && /*this.currentPlaylistIndex == 0 &&*/ !this.isPlaying){
			this.nextTrack();
		}
		else if (this.isPlaylistPlaying &&  this.currentPlaylistIndex == 0){
			this.nextTrack();
		}
	}
}
BSplayer.nextTrack = function(move){
	l("next track");
	window.clearInterval(playbackBarInt);
	DOM.Playback.ScrubSliderBack.value = 0;
	DOM.Playback.ScrubSliderFront.value = 0;
	window.clearInterval(loopInt);
	DOM.Playback.LoopButton.classList.remove("loopActive");
	DOM.Playback.Svg.innerHTML = "";
	this.looping = false;
	if (this.queue[0] != undefined){
		if (this.currentVideo != undefined && !this.isPlaylistPlaying && move == undefined){
			var child = DOM.Queue.List.getElementsByClassName("queueEntry")[0];
			DOM.Queue.List.removeChild(child);
		}
		this.currentVideo = this.queue[0];

		if (player != undefined){
			player.loadVideoById({
				'videoId': this.currentVideo.id,
			  	'startSeconds': 0
			});
			this.toStart();
			this.play();
			this.queue.shift();
			//window.localStorage.setItem('queue', JSON.stringify(BSplayer.queue));
			updateQueue();
			this.isPlaylistPlaying = false;

			updateBar();
		}
		
	}
	else if (this.queue[0] == undefined && this.displayedPlaylist.length != 0){
		if (DOM.Queue.List.getElementsByClassName("queueEntry")[0]){
			var child = DOM.Queue.List.getElementsByClassName("queueEntry")[0];
			DOM.Queue.List.removeChild(child);
		}

		if (this.currentPlaylistIndex != this.displayedPlaylist.length){
			this.isPlaylistPlaying = true;
			this.currentVideo = this.displayedPlaylist[this.currentPlaylistIndex];
			if (DOM.Queue.PlayList.getElementsByClassName("queueEntry").length == this.displayedPlaylist.length){
				for (x in DOM.Queue.PlayList.getElementsByClassName("queueEntry")){
					if (DOM.Queue.PlayList.getElementsByClassName("queueEntry")[x].classList != undefined){
						DOM.Queue.PlayList.getElementsByClassName("queueEntry")[x].classList.remove("playing");
					}
				}
			}
			updatePlaylistQueue();
			
			DOM.Queue.PlayList.getElementsByClassName("queueEntry")[this.currentPlaylistIndex].classList.add("playing");
			DOM.Queue.PlayList.getElementsByClassName("queueEntry")[this.currentPlaylistIndex].scrollIntoView(true);
			this.currentPlaylistIndex++;
				updatePlaylistQueue();
			player.loadVideoById({
				'videoId': this.currentVideo.id,
			  	'startSeconds': 0
			});
			this.toStart();
			this.play();

			updateBar();
		}
		else{
			if (this.loopingPlaylist){
				this.currentPlaylistIndex = 0;
				updatePlaylistQueue();
				this.nextTrack();
			}
			else{
				DOM.Queue.PlayList.innerHTML = "";
				this.displayedPlaylist = [];
				this.currentPlaylistIndex = 0;
				updatePlaylistQueue();
				this.isPlaylistPlaying = false;
				this.nextTrack();
				BSplayer.loopingPlaylist = false;
				DOM.Queue.Loop.classList.remove("loopPlaylistActive");
			}
		}
	}
	else{
		this.isPlaying = false;
		this.currentVideo = undefined;
		window.clearInterval(playbackBarInt);
		this.play();
		player.stopVideo();

		if (DOM.Queue.List.getElementsByClassName("queueEntry")[0]) {
			var child = DOM.Queue.List.getElementsByClassName("queueEntry")[0];
			DOM.Queue.List.removeChild(child);
		}
		clearBar();
		updateQueue();
	}

	function updateBar(){
		DOM.Playback.ScrubSliderBack.style.visibility = "visible";
		DOM.Playback.ScrubSliderFront.style.visibility = "visible";
		DOM.Playback.ThreeDot.style.visibility = "visible";

		document.getElementsByTagName('title')[0].innerHTML = "\""+BSplayer.currentVideo.title + "\" is playing";
		DOM.Playback.Thumbnail.style.backgroundImage = "url("+BSplayer.currentVideo.thumbnail+")";
		DOM.Playback.Title.innerHTML = BSplayer.currentVideo.title;
		DOM.Playback.Title.title = BSplayer.currentVideo.title;
		DOM.Playback.Title.dataset.id = BSplayer.currentVideo.id;
		DOM.Playback.Subtitle.innerHTML = BSplayer.currentVideo.channel;
		DOM.Playback.Duration.innerHTML = convertToDuration(Math.trunc(player.getCurrentTime()))+" / "+convertToDuration(Math.trunc(BSplayer.currentVideo.duration));
		DOM.Playback.ScrubSliderBack.value = 0;
		DOM.Playback.ScrubSliderFront.value = 0;

		if (BSplayer.currentVideo.album != false){
			DOM.Playback.TracklistToggle.style.visibility = "visible";
			var contents = "";
			for (var i = 1; i < BSplayer.currentVideo.album[1].length; i++) {
				DOM.Playback.Svg.setAttribute("viewBox", "0 0 "+BSplayer.currentVideo.duration+" 6");
				contents += `
					<line x1="${toSeconds(BSplayer.currentVideo.album[1][i])}" x2="${toSeconds(BSplayer.currentVideo.album[1][i])}" y1="0" y2="6"></line>
				`;
			}
			DOM.Playback.Svg.innerHTML = contents;
		}
		else{
			DOM.Playback.TracklistToggle.style.visibility = "hidden";
			DOM.Playback.Svg.innerHTML = "";
		}

		DOM.Playback.Desc.classList.remove("visible");
		DOM.Playback.Desc.getElementsByTagName("SPAN")[0].innerHTML = BSplayer.currentVideo.description;
		DOM.Playback.DescToggle.style.visibility = "visible";

		playbackBarInt = window.setInterval(function() {	//This live updates the "TimeBar" every second
			updateScrubber();
			if (BSplayer.currentVideo.album != false){
				for (var i = 0; i < BSplayer.currentVideo.album[1].length-1; i++) {
					if (player.getCurrentTime() >= toSeconds(BSplayer.currentVideo.album[1][i]) && player.getCurrentTime() < toSeconds(BSplayer.currentVideo.album[1][i+1])){
						DOM.Playback.Title.innerHTML = (i+1)+" - "+BSplayer.currentVideo.album[0][i]+" - "+BSplayer.currentVideo.title;
						document.getElementsByTagName('title')[0].innerHTML = (i+1)+" - "+BSplayer.currentVideo.album[0][i]+" - "+BSplayer.currentVideo.title;
						break;
					}
				}
				if (player.getCurrentTime() >= toSeconds(BSplayer.currentVideo.album[1][BSplayer.currentVideo.album[1].length-1]) && player.getCurrentTime() <= BSplayer.currentVideo.duration){
					DOM.Playback.Title.innerHTML = (BSplayer.currentVideo.album[0].length)+" - "+BSplayer.currentVideo.album[0][BSplayer.currentVideo.album[0].length-1]+" - "+BSplayer.currentVideo.title;
					document.getElementsByTagName('title')[0].innerHTML = (BSplayer.currentVideo.album[0].length)+" - "+BSplayer.currentVideo.album[0][BSplayer.currentVideo.album[0].length-1]+" - "+BSplayer.currentVideo.title;
				}
			}

		}, 1000);
	}

	function clearBar(){
		document.getElementsByTagName('title')[0].innerHTML = "Youtube Soundsystem";
		DOM.Playback.Thumbnail.style.backgroundImage = "";
		DOM.Playback.Title.innerHTML = "";
		DOM.Playback.Title.title = "";
		DOM.Playback.Title.dataset.id = "";
		DOM.Playback.Subtitle.innerHTML = "";
		DOM.Playback.ScrubSliderBack.style.visibility = "hidden";
		DOM.Playback.ScrubSliderFront.style.visibility = "hidden";
		DOM.Playback.ThreeDot.style.visibility = "hidden";

		DOM.Playback.ScrubSliderBack.value = 0;
		DOM.Playback.ScrubSliderFront.value = 0;

		DOM.Playback.Desc.classList.remove("visible");
		DOM.Playback.Desc.getElementsByTagName("SPAN")[0].innerHTML = "";
		DOM.Playback.DescToggle.style.visibility = "hidden";

		DOM.Playback.TracklistToggle.style.visibility = "hidden";

		DOM.Playback.Duration.innerHTML = "";
	}
}
BSplayer.lastTrack = function(){
	if(this.currentPlaylistIndex > 1){
		this.currentPlaylistIndex-=2;
	}
	else{
		this.currentPlaylistIndex-=1;
	}
	this.nextTrack();
};
BSplayer.clearQueue = function(){				//Removes all but the first videoEntry (the one currently playing)
	for (x in this.queue){
		(function(){
			var child = DOM.Queue.List.getElementsByClassName("queueEntry")[1];
			DOM.Queue.List.removeChild(child);
		})();
	}
	this.queue.splice(0, this.queue.length);
		//window.localStorage.setItem('queue', JSON.stringify(BSplayer.queue));
	if (this.currentVideo != undefined && !this.isPlaylistPlaying){
		this.nextTrack;
	}
			updateQueue();
}
BSplayer.play = function(){
	player.playVideo();
	 document.getElementById("player").style.display = "none";
	if (this.currentVideo != undefined){
		this.isPlaying = true;
	}
	DOM.Playback.PlayButton.style.backgroundPosition = "center";
	DOM.Playback.PlayButton.style.backgroundImage = "url(Pause.svg)";
}
BSplayer.pause = function(){
	l(player.getPlayerState());
	if(player.getPlayerState() == 1){
		player.pauseVideo();
		this.isPlaying = false;
		DOM.Playback.PlayButton.style.backgroundPosition = "right";
		DOM.Playback.PlayButton.style.backgroundImage = "url(Play.svg)";
	}
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
	//this.displayedPlaylist = {};
	this.currentPlaylistIndex = 0;
				updatePlaylistQueue();
	//this.displayedPlaylist = [];
	// while(DOM.Queue.PlayList.firstChild){
	//     DOM.Queue.PlayList.removeChild(DOM.Queue.PlayList.firstChild);
	// }
	DOM.Queue.PlayList.innerHTML = "";
	for (x in this.displayedPlaylist){
		this.addToPlaylistQueue(this.displayedPlaylist[x]);
	}
	// if (this.isPlaylistPlaying){
	// 	this.nextTrack();
	// }
}
BSplayer.addRandom = function(times){
	for (i = 0; i<times; i++) {
		var randNum = Math.floor((Math.random() * (this.displayedIds.length)));
		this.addToQueue(this.displayedVideos[this.displayedIds[randNum]]);
	}
}
BSplayer.shuffle = function(){
	this.displayedPlaylist = shuffle(this.displayedPlaylist);
			updatePlaylistQueue();
	this.playAll();

	function shuffle(array) {
	  var m = array.length, t, i;

	  // While there remain elements to shuffle…
	  while (m) {

	    // Pick a remaining element…
	    i = Math.floor(Math.random() * m--);

	    // And swap it with the current element.
	    t = array[m];
	    array[m] = array[i];
	    array[i] = t;
	  }

	  return array;
	}
}
BSplayer.seekBy = function(seconds){			//Takes the time in seconds (integer, pos and neg) that the "scrubber" should be progresses
	if (Math.trunc(player.getCurrentTime()+seconds) < this.currentVideo.duration && Math.trunc(player.getCurrentTime()+seconds) > 0){
		player.seekTo(Math.trunc(player.getCurrentTime()+seconds), true);
		updateScrubber();
	}
	else if (Math.trunc(player.getCurrentTime()+seconds) >= this.currentVideo.duration){
		player.seekTo(this.currentVideo.duration-0.1);
	}
	else if (Math.trunc(player.getCurrentTime()+seconds) <= 0){
		player.seekTo(0, true);
		updateScrubber();
	}
	else if(this.currentVideo == undefined){
	}
}

function updateScrubber(){
	DOM.Playback.ScrubSliderBack.value = (1000*player.getCurrentTime()/(BSplayer.currentVideo.duration));
	DOM.Playback.ScrubSliderFront.value = (1000*player.getCurrentTime()/(BSplayer.currentVideo.duration));

	DOM.Playback.Duration.innerHTML = convertToDuration(Math.trunc(player.getCurrentTime()))+" / "+convertToDuration(Math.trunc(BSplayer.currentVideo.duration));
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

BSplayer.moveQueueEntry = function(oldIndex, newIndex){
	if (oldIndex == 0){
		let tempEntry = BSplayer.currentVideo;
		BSplayer.queue.splice(newIndex, 0, tempEntry);
		BSplayer.nextTrack("move");
	}
	else if (newIndex == 0){
		BSplayer.queue.unshift(BSplayer.currentVideo);
		let tempEntry = BSplayer.queue[oldIndex];
		BSplayer.queue.splice(oldIndex, 1);
		BSplayer.queue.splice(newIndex, 0, tempEntry);
		BSplayer.nextTrack("move");
	}
	else{
		let tempEntry = BSplayer.queue[oldIndex-1];
		BSplayer.queue.splice(oldIndex-1, 1);
		BSplayer.queue.splice(newIndex-1, 0, tempEntry);
	}
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
