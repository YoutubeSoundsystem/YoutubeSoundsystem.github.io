function startHashHandling(){
		DOM.Sidebar.DropDown0.innerHTML = "PLAYLISTS";
		DOM.Sidebar.DropDown1.innerHTML = "CHANNELS";
		DOM.Sidebar.DropDown2.innerHTML = "STATIONS";
	loadSidebar("Playlist");

	if (location.hash === "#/Stations") {
	    loadStations();
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
	else if (location.hash.slice(0, 11) === "#/Tracklist"){
		loadTracklist(location.hash.slice(11, location.hash.length));
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
		else if (location.hash.slice(0, 11) === "#/Tracklist"){
			loadTracklist(location.hash.slice(11, location.hash.length));
		}
	}, false);

	loadQueue();
	BSplayer.play();


}


document.onkeypress = function(event) {			//Event Listener for when a key is pressed (fires only once when held down)
   l(event.which);
    if(event.which==32 || event.which==107) {
    	event.preventDefault();
    	if (BSplayer.isPlaying){
    		BSplayer.pause();
    	}
    	else if(!BSplayer.isPlaying && BSplayer.currentVideo!=undefined){
			BSplayer.play();
		}
    }
    else if (event.which==108) {
    	BSplayer.nextTrack();
    }
    else if (event.which==106) {
    	BSplayer.lastTrack();
    }
    else if (event.which==115){
    	seedStation(BSplayer.currentVideo.id);
    }
};
document.onkeydown = function(event) {			//Event Listener for when a key is pressed (fires multiple when held down)
    if(event.shiftKey && event.which==39){
    	event.preventDefault();
    	if (BSplayer.currentVideo.album != false){
			l("1");
			for (var i = 0; i < BSplayer.currentVideo.album[1].length-1; i++) {
				if (player.getCurrentTime() >= toSeconds(BSplayer.currentVideo.album[1][i]) && player.getCurrentTime() < toSeconds(BSplayer.currentVideo.album[1][i+1])){
					player.seekTo(toSeconds(BSplayer.currentVideo.album[1][i+1]));
					break;
				}
			}
			if (player.getCurrentTime() >= toSeconds(BSplayer.currentVideo.album[1][BSplayer.currentVideo.album[1].length-1]) && player.getCurrentTime() <= BSplayer.currentVideo.duration){
				BSplayer.nextTrack();
			}
		}
		else{
			BSplayer.seekBy(60);
		}
	}
    else if(event.which==39){
    	event.preventDefault();
		BSplayer.seekBy(10);
	}

	else if(event.shiftKey && event.which==37){
    	event.preventDefault();
		if (BSplayer.currentVideo.album != false){
			l("1");
			for (var i = 0; i < BSplayer.currentVideo.album[1].length-1; i++) {
				if (player.getCurrentTime() >= toSeconds(BSplayer.currentVideo.album[1][i]) && player.getCurrentTime() < toSeconds(BSplayer.currentVideo.album[1][i+1])){
					if (BSplayer.currentVideo.album[1][i-1] != undefined){
						player.seekTo(toSeconds(BSplayer.currentVideo.album[1][i-1]));
						break;
					}
					else{
						player.seekTo(0);
						break;
					}
				}
			}
			if (player.getCurrentTime() > toSeconds(BSplayer.currentVideo.album[1][BSplayer.currentVideo.album[1].length-1])){
				player.seekTo(toSeconds(BSplayer.currentVideo.album[1][BSplayer.currentVideo.album[1].length-2]));
			}
		}
		else{
			BSplayer.seekBy(-60);
		}
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


	var hasBeenSecs = true;
DOM.MainWindow.BigContainer.addEventListener("scroll", function(){
	l("SHEIGHT: "+this.scrollHeight+", STOP: "+this.scrollTop+", CHIEGHT: "+this.clientHeight);
	if ((this.scrollHeight - this.scrollTop) < (this.clientHeight+400)){
		if (functionToCall != undefined && hasBeenSecs){
			functionToCall(nextId, nextToken);
			hasBeenSecs = false;
			var poop = setTimeout(function(){
				hasBeenSecs = true;
			}, 1000);
		}
	}



	// if ((this.scrollHeight - this.scrollTop) < (this.clientHeight*1.5)){
	// 	if (functionToCall != undefined){
	// 		functionToCall(nextId, nextToken);
	// 	}
	// }
});
DOM.Playback.VolumeSliderFront.oninput = function() {
	BSplayer.setVolume(this.value);
};
DOM.Playback.ScrubSliderFront.oninput = function() {
	player.seekTo(Math.trunc((this.value/1000)*BSplayer.currentVideo.duration), true);
	//document.getElementById("playbackBar").style.width = (100*player.getCurrentTime()/(BSplayer.currentVideo.duration))+"%";
	DOM.Playback.ScrubSliderBack.value = this.value;
	DOM.Playback.Duration.innerHTML = convertToDuration(Math.trunc(player.getCurrentTime()))+" / "+convertToDuration(Math.trunc(BSplayer.currentVideo.duration));
};
DOM.Playback.Subtitle.addEventListener("click", function(){
	if (BSplayer.currentVideo != undefined){
		window.location.hash = "/ChannelList"+BSplayer.currentVideo.channelId;
	}
});

DOM.Playback.TracklistToggle.addEventListener("click", function(){
	if (BSplayer.currentVideo != undefined){
		window.location.hash = "/Tracklist"+BSplayer.currentVideo.id;
		//DOM.Playback.Desc.classList.toggle("visible");
	}
});

DOM.Playback.DescToggle.addEventListener("click", function(){
	if (BSplayer.currentVideo != undefined){
		DOM.Playback.Desc.classList.toggle("visible");
	}
});

var mouseOutVar;

DOM.Playback.ThreeDot.addEventListener("click", function(){
	DOM.Playback.ThreeDot.getElementsByTagName("DIV")[0].style.visibility = "visible";
	DOM.Playback.ThreeDot.getElementsByTagName("DIV")[0].addEventListener("mouseleave", function(){
		this.style.visibility = "hidden";
	});
});

DOM.Playback.ThreeDot.addEventListener("click", function(){
	DOM.Playback.ThreeDot.getElementsByTagName("DIV")[0].style.visibility = "visible";
	mouseOutVar = DOM.Playback.ThreeDot.getElementsByTagName("DIV")[0].addEventListener("mouseleave", function(){
		this.style.visibility = "hidden";
	});
	if (event.target.parentElement.parentElement.className == "actions"){
		if (event.target.innerHTML == 'Save to Playlist'){
			if (currentlyEditingPlaylistId.length > 0){
				for (x in currentlyEditingPlaylistId){
					addToPlaylist(currentlyEditingPlaylistId[x], [BSplayer.currentVideo.id], function(){
						pushMessage("Success! Song Added");
					});
				}
			}
			else{
				var thisId = [event.target.parentElement.parentElement.parentElement.getElementsByClassName("playbackTitle")[0].dataset.id];
				createPlaylist(event.target.parentElement.parentElement.parentElement.getElementsByClassName("playbackTitle")[0].innerHTML, "Playlist created by Youtube Soundsystem", true, function(response){
					var newPlaylistId = response.id;

					addToPlaylist(newPlaylistId, thisId, function(){
						if (document.getElementById("sidebar").getElementsByClassName("header")[0].getElementsByTagName("SPAN")[0].innerHTML == "PLAYLISTS"){

							var params = {'part': 'snippet,contentDetails', 'maxResults':maxResults, 'mine':true};

							var request = gapi.client.request({
								'method': 'GET',
								'path': '/youtube/v3/playlists',
								'params': params
							});
							request.execute(function(responsePlaylist) {
								var a = responsePlaylist.items[0].snippet.thumbnails.default.url;
								var b = responsePlaylist.items[0].snippet.title;
								var id = responsePlaylist.items[0].id;
							
								var Cont = document.createElement("DIV");
								Cont.classList.add("sidebarEntryPlaylist");
								Cont.dataset.id = id;
								Cont.title = a;
								Cont.innerHTML = `
									<div class="miniChannelImage" style="background-image: url('${a}');"></div>
									<div class="miniChannelTitle">${b}</div>
									<div class="checkbox" data-checked="false"></div>
								`;
								document.getElementsByClassName("sidebarList")[0].insertBefore(Cont, document.getElementsByClassName("sidebarList")[0].children[0]);
							});
						}
					});
				});
			}
		}

		else if (event.target.innerHTML == 'Seed Station'){
			seedStation(BSplayer.currentVideo.id);
		}
		else if (event.target.innerHTML == 'Open in Youtube'){
			window.open("https://www.youtube.com/watch?v="+BSplayer.currentVideo.id, "_blank");
		}
	}
});

DOM.Queue.Clear.addEventListener("click", function(){
	BSplayer.clearQueue();
});
DOM.Queue.ClearPlaylist.addEventListener("click", function(){
	DOM.Queue.PlayList.innerHTML = "";
	BSplayer.displayedPlaylist = [];
	updatePlaylistQueue();
	BSplayer.currentPlaylistIndex = 0;
	BSplayer.loopingPlaylist = false;
	DOM.Queue.Loop.classList.remove("loopPlaylistActive");

	if (BSplayer.isPlaylistPlaying){
		BSplayer.nextTrack();
		BSplayer.isPlaylistPlaying = false;
	}
});
DOM.Queue.Shuffle.addEventListener("click", function(){
	BSplayer.shuffle();
});
DOM.Queue.Loop.addEventListener("click", function(){
	if (BSplayer.displayedPlaylist.length != 0){
		if (!BSplayer.loopingPlaylist){
			BSplayer.loopingPlaylist = true;
			DOM.Queue.Loop.classList.add("loopPlaylistActive");
		}
		else{
			BSplayer.loopingPlaylist = false;
			DOM.Queue.Loop.classList.remove("loopPlaylistActive");
		}
	}
});

DOM.Topbar.Search.onkeypress = function(e){
	e.stopPropagation();
	if (e.which == '13'){
		window.location.hash = "/Search"+this.value;
	}
};

// document.getElementsByClassName("createPlaylistCont")[0].onkeypress = function(e){
// 	l("key pressed");
// 	e.stopPropagation();
// 	if (e.which == '13'){
// 		createPlaylist(this.value, "Playlist created by Youtube Soundsystem", true, function(response){
// 			this.value = "";
// 		});
// 	}
// };

DOM.Playback.Controls.addEventListener("click", function(event){
	if (event.target == DOM.Playback.PlayButton){
		l(BSplayer.isPlaying);
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
		if (BSplayer.isPlaylistPlaying){
			BSplayer.lastTrack();
		}
		else{
			BSplayer.toStart();
		}
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
	if (event.target == document.getElementsByClassName("menuItemButton")[0]){
		GoogleAuth.signIn();
	}
	else if (event.target == document.getElementsByClassName("accountImage")[0]){
		//popup a litte menu that lets u access yur account info, settings, sign out, etc.

		GoogleAuth.signOut();
	}

});

DOM.Sidebar.Header.addEventListener("click", function(event){
	l(event);
	if (event.target.parentElement.className == "header"){
		event.target.parentElement.getElementsByTagName("DIV")[0].style.display = "flex";
		//threeDotListen = undefined;
		threeDotListen = event.target.parentElement.getElementsByTagName("DIV")[0].addEventListener("mouseleave", function(){
			this.style.display = "none";
		});
	}
	else if (event.target.className == "header"){

	}
	else if (event.target.innerHTML == "CHANNELS"){
		l("loaded Channels on sidebar");
		DOM.Sidebar.DropDown0.innerHTML = "CHANNELS";
		DOM.Sidebar.DropDown1.innerHTML = "PLAYLISTS";
		DOM.Sidebar.DropDown2.innerHTML = "STATIONS";
		loadSidebar("Channel");
	}
	else if (event.target.innerHTML == "PLAYLISTS"){
		l("loaded Playlists on sidebar");
		DOM.Sidebar.DropDown0.innerHTML = "PLAYLISTS";
		DOM.Sidebar.DropDown1.innerHTML = "CHANNELS";
		DOM.Sidebar.DropDown2.innerHTML = "STATIONS";
		loadSidebar("Playlist");
	}
	else if (event.target.innerHTML == "STATIONS"){

		DOM.Sidebar.DropDown0.innerHTML = "STATIONS";
		DOM.Sidebar.DropDown1.innerHTML = "CHANNELS";
		DOM.Sidebar.DropDown2.innerHTML = "PLAYLISTS";
		loadSidebar("Stations");
	}
});
// var Viewer = document.getElementById("viewer");
// DOM.Sidebar.Parent.addEventListener("click", function(){
// 	DOM.Sidebar.Parent.classList.toggle("hidden");
// 	Viewer.classList.toggle("expanded"); 
// });

DOM.Queue.List.addEventListener("click", function(event){
	// if (event.target.parentElement.className == "queueEntryName"){
	// 	DOM.Queue.List.insertBefore(document.getElementById(event.target.parentElement.parentElement.id),DOM.Queue.List.getElementsByClassName("queueEntry")[1]);
	// 	var temp = BSplayer.queue[x-1];
	// 	BSplayer.queue.splice(x-1, 1);
	// 	BSplayer.queue.unshift(temp);
	// }
	// else if (event.target.className == "queueEntryName"){ 
	// 	DOM.Queue.List.insertBefore(document.getElementById(event.target.parentElement.id),DOM.Queue.List.getElementsByClassName("queueEntry")[1]);
	// 	var temp = BSplayer.queue[x-1];
	// 	BSplayer.queue.splice(x-1, 1);
	// 	BSplayer.queue.unshift(temp);
	// }
	// else if (event.target.className == "queueEntry"){
	// 	DOM.Queue.List.insertBefore(document.getElementById(event.target.id),DOM.Queue.List.getElementsByClassName("queueEntry")[1]);
	// 	var temp = BSplayer.queue[x-1];
	// 	BSplayer.queue.splice(x-1, 1);
	// 	BSplayer.queue.unshift(temp);
	// }	
	if (event.target.className == "queueRemove"){
		if (DOM.Queue.List.getElementsByClassName("queueEntry")[0].id == event.target.parentElement.id){
			l("nextTrack");
			l(BSplayer.queue);
			BSplayer.nextTrack();
		}
		else{
			l("else");
			for (x in DOM.Queue.List.getElementsByClassName("queueEntry")){
				if (DOM.Queue.List.getElementsByClassName("queueEntry")[x].id == event.target.parentElement.id){
					l("splice");
					BSplayer.queue.splice(x-1, 1);
					var child = document.getElementById(event.target.parentElement.id);
					DOM.Queue.List.removeChild(child);	
					//window.localStorage.setItem('queue', JSON.stringify(BSplayer.queue));
				}
			}
		}
	}
});

DOM.Queue.PlayList.addEventListener("click", function(event){
	if (event.target.parentElement.className == "queueEntryName"){
		for (x in DOM.Queue.PlayList.getElementsByClassName("queueEntry")){
			if (event.target.parentElement.parentElement.id == DOM.Queue.PlayList.getElementsByClassName("queueEntry")[x].id){
				BSplayer.currentPlaylistIndex = parseInt(x);
				BSplayer.nextTrack();
			}
		}
	}
	else if (event.target.className == "queueEntryName"){
		for (x in DOM.Queue.PlayList.getElementsByClassName("queueEntry")){
			if (event.target.parentElement.id == DOM.Queue.PlayList.getElementsByClassName("queueEntry")[x].id){
				BSplayer.currentPlaylistIndex = parseInt(x);
				BSplayer.nextTrack();
			}
		}
	}
	else if (event.target.className == "queueEntry"){
		for (x in DOM.Queue.PlayList.getElementsByClassName("queueEntry")){
			if (event.target.id == DOM.Queue.PlayList.getElementsByClassName("queueEntry")[x].id){
				BSplayer.currentPlaylistIndex = parseInt(x);
				BSplayer.nextTrack();
			}
		}
	}
});

// var LSQ = JSON.parse(window.localStorage.getItem('queue'));
	
// for (var i = 0; i < LSQ.length; i++) {
// 	BSplayer.addToQueue(LSQ[i]);	
// }

function loadQueue(){
	if (window.localStorage.getItem('queue') != null){
		let LSQ = JSON.parse(window.localStorage.getItem('queue'));
		let LSPQ = JSON.parse(window.localStorage.getItem('pqueue'));
		let PQI = JSON.parse(window.localStorage.getItem('pindex'));
		
		for (var i = 0; i < LSQ.length; i++) {
			BSplayer.addToQueue(LSQ[i]);
		}

		if (LSPQ.length != 0){
			BSplayer.displayedPlaylist = LSPQ;

			DOM.Queue.PlayList.innerHTML = "";
			for (x in BSplayer.displayedPlaylist){
				BSplayer.addToPlaylistQueue(BSplayer.displayedPlaylist[x]);
			}
			BSplayer.currentPlaylistIndex = PQI[0];
			BSplayer.nextTrack();
		}
	}
}
function updateQueue(){
	let tempQueue;
	if (!BSplayer.isPlaylistPlaying){
		tempQueue = [BSplayer.currentVideo].concat(BSplayer.queue);
	}
	else{
		tempQueue = BSplayer.queue;
	}
	window.localStorage.setItem('queue', JSON.stringify(tempQueue));
}

function updatePlaylistQueue(){
	let tempQueue = BSplayer.displayedPlaylist;
	window.localStorage.setItem('pqueue', JSON.stringify(tempQueue));
	window.localStorage.setItem('pindex', JSON.stringify([BSplayer.currentPlaylistIndex]));
}

var sortable = Sortable.create(document.getElementsByClassName("queueList")[0], {
	onEnd: function (evt) {
		BSplayer.moveQueueEntry(evt.oldIndex, evt.newIndex);
	},
	draggable:".queueEntry",
	handle:".queueEntryName"//,
	//filter:".queueList:first-child"
});
