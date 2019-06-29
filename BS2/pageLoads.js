
var nextToken = undefined;
var functionToCall = undefined;
var nextId = undefined;

var maxResults = 20;

function loadChannel(channelID) {
	l("loadChannel");
	//l("Channel Clicked");
	document.getElementById("BigChannelCont").innerHTML = "";

	makeChannelHead(channelID);
}

function loadChannelList(pageToken) {
	l("loadChannelList");
	//l("Channels Clicked");
	if (pageToken == undefined){
		document.getElementById("BigChannelCont").innerHTML = "";
	}

	var request;
	if (pageToken != undefined){
		request = gapi.client.request({
			'method': 'GET',
			'path': '/youtube/v3/subscriptions',
			'params': {'part': 'snippet', 'mine': 'true', 'maxResults': maxResults, 'pageToken':pageToken}
		});
	}
	else{
		request = gapi.client.request({
			'method': 'GET',
			'path': '/youtube/v3/subscriptions',
			'params': {'part': 'snippet', 'mine': 'true', 'maxResults': maxResults}
		});
	}
	request.execute(function(responseSubscription) {
		var IDconcat = "";
		var IDarray = [];
		for (x in responseSubscription.items){
			IDarray.push(responseSubscription.items[x].snippet.resourceId.channelId);
			if (x != responseSubscription.items.length-1){
				IDconcat += (responseSubscription.items[x].snippet.resourceId.channelId+",");
			}
			else{
				IDconcat += (responseSubscription.items[x].snippet.resourceId.channelId);
				var request = gapi.client.request({
					'method': 'GET',
					'path': '/youtube/v3/channels',
					'params': {'part': 'snippet,contentDetails,brandingSettings', 'maxResults':maxResults, 'id': IDconcat},
				});
				request.execute(function(responseChannel) {
					//l(responseChannel);
					var sortedResponse = [];
					var imgURLS = [];
					for (x in IDarray){
						for (y in responseChannel.items){
							if (responseChannel.items[y].id == IDarray[x]){
								sortedResponse.push(responseChannel.items[y]);
							}
						}
					}
					for (x in sortedResponse){
						var a = sortedResponse[x].brandingSettings.image.bannerImageUrl;
						var b = sortedResponse[x].snippet.thumbnails.default.url;
						var c = sortedResponse[x].snippet.title;
						var d = "123 videos";
						// var d;
						// if (sortedResponse[x].snippet.customUrl == undefined){
						// 	d = "";
						// }
						// else{
						// 	d = sortedResponse[x].snippet.customUrl;
						// }
						

						if (sortedResponse[x].brandingSettings.image.bannerMobileLowImageUrl == undefined){
							a = "http://yt3.ggpht.com/xQhp8-B774IYTnvEG4zHESE2CNHF_RokEet5Ne6G1zq1j4Xg-PT0ytalVJxmf206_O96HDtcItiaadGAZA=w1060-fcrop64=1,00005a57ffffa5a8-nd-c0xffffffff-rj-k-no";
							imgURLS.push(a);
						}
						else{
							imgURLS.push(sortedResponse[x].brandingSettings.image.bannerMobileLowImageUrl);
						}

						var Cont = document.createElement("DIV");
						Cont.classList.add("ChannelEntry");
						Cont.style = `background-image: url('${a}');`;
						Cont.innerHTML = `
							<div class="ChannelBack" style="">
								<div class="ChannelImg" style="background-image: url('${b}');">
								</div>
								<div class="ChanTitleCont">
									<div>${c}</div>
									<div>${d}</div>
								</div>
							</div>
						`;
						(function(id){Cont.addEventListener("click", function(){
							//l("elementClicked");
							l("Clicked");
							window.location.hash = ('/ChannelList' + id);
						});})(sortedResponse[x].id);
						document.getElementById("BigChannelCont").appendChild(Cont);
					}

					for (x in sortedResponse){
						(function(globalIndex, index){
							//l(imgURLS[index]);
							var NX = new XMLHttpRequest();
							NX.open("GET", ("uploadPic2.php?url="+imgURLS[index]+"&num="+index), true);
							NX.onreadystatechange = function() {
								if (NX.readyState == 4) {
									//l(NX.responseText);
									var results = JSON.parse(NX.responseText)
									var r = results['red'];
									var g = results['green'];
									var b = results['blue'];

									document.getElementsByClassName("ChannelBack")[globalIndex].style.background = "linear-gradient(to right, rgb("+r+","+g+","+b+") 120px, rgb("+r+","+g+","+b+",0.85) 200px, rgba("+r+","+g+","+b+",0.67) 300px, #ffffff00)";
									if ((r+g+b) > 600/*r > 200 && g > 200 && b > 200*/){
										document.getElementsByClassName("ChanTitleCont")[globalIndex].getElementsByTagName("DIV")[0].style.color = "black";
										document.getElementsByClassName("ChanTitleCont")[globalIndex].getElementsByTagName("DIV")[1].style.color = "rgba(0,0,0,0.5";
									}
								}
							};
							NX.send();
						})((parseInt(x) + (document.getElementsByClassName("ChannelEntry").length - sortedResponse.length)), x);
					}
				});
			}
		}
		if (responseSubscription.nextPageToken != undefined){

			functionToCall = function(id, tok){
				loadChannelList(tok);
			};
			nextToken = responseSubscription.nextPageToken;
			nextId = undefined;
			//loadChannelList(responseSubscription.nextPageToken);
		}
		else{
			functionToCall = undefined;
			nextToken = undefined;
			nextId = undefined;
		}
	});
}

function loadPlaylistList(){
	l("loadPlaylistList");

	document.getElementById("BigChannelCont").innerHTML = `
		<div class='songList'>

		</div>
	`;
	makePlaylistList();
}

function loadPlaylist(playlistID){
	l("loadPlaylist");
	document.getElementById("BigChannelCont").innerHTML = "";

	var request = gapi.client.request({
		'method': 'GET',
		'path': '/youtube/v3/playlists',
		'params': {'part': 'snippet,contentDetails', 'id': playlistID}
	});
	request.execute(function(responsePlaylist) {

		l(responsePlaylist);
		l(responsePlaylist.items[0].snippet.thumbnails.default.url);

		var NX = new XMLHttpRequest();
		NX.open("GET", ("uploadPic2.php?url="+responsePlaylist.items[0].snippet.thumbnails.default.url+"&num=0"), true);
		NX.onreadystatechange = function() {
			if (NX.readyState == 4) {

				var a = responsePlaylist.items[0].snippet.thumbnails.high.url;
				var be = responsePlaylist.items[0].snippet.title;
				var c = "Playlist";

				var results = JSON.parse(NX.responseText)
				// var r = results['red'];
				// var g = results['green'];
				// var b = results['blue'];
				var r = "189";
				var g = "41";
				var b = "41";

				var d;

				//var d = "linear-gradient(to right, rgb("+r+","+g+","+b+") 200px, rgb("+r+","+g+","+b+",0.7) 340px, rgba("+r+","+g+","+b+",0.5) 430px, #ffffff00)";
				var e = ""; 
				var f = "";

				// if ((r+g+b) > 600){
				// 	e = "black";
				// 	f = "rgba(0,0,0,0.5)";
				// }

				var playlistTopCont = document.createElement("DIV");
				playlistTopCont.classList.add("playlistTopCont");
				playlistTopCont.style.backgroundImage = `url('${a}')`;

				var songList = document.createElement("DIV");
				songList.classList.add("songList");

				var channelHead = document.createElement("DIV");
				channelHead.classList.add("channelHead");
				channelHead.style.background = `${d}`;

				var channelDetailsCont = document.createElement("DIV");
				channelDetailsCont.classList.add("channelDetailsCont");
				channelDetailsCont.innerHTML = `
					<div class='channelName' style="color: ${e}">
						${be}
					</div>
					<div class='channelSubtext' style="color: ${f}">
						${c}
					</div>
				`;
				channelHead.appendChild(channelDetailsCont);

				var channelCont = document.createElement("DIV");
				channelCont.classList.add("channelCont");
				
				var PlayAll = document.createElement("DIV");
				PlayAll.classList.add("channelActionButton");
				(function(){
					PlayAll.addEventListener("click", function(){
						l("Clicked");
						BSplayer.playAll();
					});
				})();
				PlayAll.innerHTML = "<span>PLAY ALL</span>";
				channelCont.appendChild(PlayAll);

				var AddTo = document.createElement("DIV");
				AddTo.classList.add("channelActionButton");
				(function(){
					AddTo.addEventListener("click", function(){
						l("Clicked");
						//BSplayer.playAll();
					});
				})();
				AddTo.innerHTML = "<span>ADD TO</span>";
				channelCont.appendChild(AddTo);

				var Edit = document.createElement("DIV");
				Edit.classList.add("channelActionButton");
				(function(){
					Edit.addEventListener("click", function(){
						l("Clicked");
						//BSplayer.playAll();
					});
				})();
				Edit.innerHTML = "<span>EDIT...</span>";
				channelCont.appendChild(Edit);

				channelHead.appendChild(channelCont);
				playlistTopCont.appendChild(channelHead);

				document.getElementById("BigChannelCont").appendChild(playlistTopCont);
				document.getElementById("BigChannelCont").appendChild(songList);

				var songList = document.createElement("DIV");
				songList.classList.add("songList");

				document.getElementById("BigChannelCont").appendChild(songList);

				BSplayer.allVideos = [];
				BSplayer.displayedVideos = [];

				makeSongList(playlistID);
			}
		};
		NX.send();
	});
}

function loadSidebar(pageToken) {
	l("loadSidebar");

	var request;
	if (pageToken != undefined){
		request = gapi.client.request({
			'method': 'GET',
			'path': '/youtube/v3/subscriptions',
			'params': {'part': 'snippet', 'mine': 'true', 'pageToken':pageToken},
		});
	}
	else{
		request = gapi.client.request({
			'method': 'GET',
			'path': '/youtube/v3/subscriptions',
			'params': {'part': 'snippet', 'mine': 'true'},
		});
	}
	request.execute(function(responseSubscription) {
		var IDconcat = "";
		var IDarray = [];
		for (x in responseSubscription.items){
			IDarray.push(responseSubscription.items[x].snippet.resourceId.channelId);
			if (x != responseSubscription.items.length-1){
				IDconcat += (responseSubscription.items[x].snippet.resourceId.channelId+",");
			}
			else{
				IDconcat += (responseSubscription.items[x].snippet.resourceId.channelId);
				var request = gapi.client.request({
					'method': 'GET',
					'path': '/youtube/v3/channels',
					'params': {'part': 'snippet,contentDetails,brandingSettings', 'id': IDconcat},
				});
				request.execute(function(responseChannel) {
					//l(responseChannel);
					var sortedResponse = [];
					for (x in IDarray){
						for (y in responseChannel.items){
							if (responseChannel.items[y].id == IDarray[x]){
								sortedResponse.push(responseChannel.items[y]);
							}
						}
					}
					for (x in sortedResponse){
						var b = sortedResponse[x].snippet.thumbnails.default.url;
						var c = sortedResponse[x].snippet.title;

						var Cont = document.createElement("DIV");
						Cont.classList.add("sidebarEntry");
						Cont.innerHTML = `
							<div class="miniChannelImage" style="background-image: url('${b}');"></div>
							<div class="miniChannelTitle">${c}</div>
						`;
						(function(id){Cont.addEventListener("click", function(){
							//l("elementClicked");

							l("Clicked");
							window.location.hash = ('/ChannelList' + id);
						});})(sortedResponse[x].id);
						document.getElementById("BigSidebarCont").appendChild(Cont);
					}
				});
			}
		}
		if (responseSubscription.nextPageToken != undefined){
			loadSidebar(responseSubscription.nextPageToken);
		}
	});
}

function makeChannelHead(channelID){
	l("makeChannelHead");
	var request = gapi.client.request({
		'method': 'GET',
		'path': '/youtube/v3/channels',
		'params': {'part': 'snippet,contentDetails,brandingSettings', 'maxResults':maxResults, 'id': channelID}
	});
	request.execute(function(responseChannel) {

		var NX = new XMLHttpRequest();
		NX.open("GET", ("uploadPic2.php?url="+responseChannel.items[0].brandingSettings.image.bannerMobileLowImageUrl+"&num=0"), true);
		NX.onreadystatechange = function() {
			if (NX.readyState == 4) {

				var a;
				var r;
				var g;
				var b;

				if (NX.responseText.substring(0,1) == "I"){
					a = "http://yt3.ggpht.com/xQhp8-B774IYTnvEG4zHESE2CNHF_RokEet5Ne6G1zq1j4Xg-PT0ytalVJxmf206_O96HDtcItiaadGAZA=w1060-fcrop64=1,00005a57ffffa5a8-nd-c0xffffffff-rj-k-no";
					r = 234;
					g = 49;
					b = 49;
				}
				else{
					a = responseChannel.items[0].brandingSettings.image.bannerImageUrl;
					var results = JSON.parse(NX.responseText)
					r = results['red'];
					g = results['green'];
					b = results['blue'];
				}

				var be = responseChannel.items[0].snippet.title;
				var c = "Channel";

				

				var d = "linear-gradient(to right, rgb("+r+","+g+","+b+") 200px, rgb("+r+","+g+","+b+",0.85) 340px, rgba("+r+","+g+","+b+",0.67) 430px, #ffffff00)";
				var e = ""; 
				var f = "";

				if ((r+g+b) > 600){
					e = "black";
					f = "rgba(0,0,0,0.5)";
				}
				var channelTopCont = document.createElement("DIV");
				channelTopCont.classList.add("channelTopCont");
				channelTopCont.style.backgroundImage = `url('${a}')`;

				var songList = document.createElement("DIV");
				songList.classList.add("songList");

				var channelHead = document.createElement("DIV");
				channelHead.classList.add("channelHead");
				channelHead.style.background = `${d}`;

				var channelDetailsCont = document.createElement("DIV");
				channelDetailsCont.classList.add("channelDetailsCont");
				channelDetailsCont.innerHTML = `
					<div class='channelName' style="color: ${e}">
						${be}
					</div>
					<div class='channelSubtext' style="color: ${f}">
						${c}
					</div>
				`;
				channelHead.appendChild(channelDetailsCont);

				var channelCont = document.createElement("DIV");
				channelCont.classList.add("channelCont");
				
				var PlayAll = document.createElement("DIV");
				PlayAll.classList.add("channelActionButton");
				(function(){
					PlayAll.addEventListener("click", function(){
						l("Clicked");
						BSplayer.playAll();
					});
				})();
				PlayAll.innerHTML = "<span>PLAY ALL</span>";
				channelCont.appendChild(PlayAll);

				var AddTo = document.createElement("DIV");
				AddTo.classList.add("channelActionButton");
				(function(){
					AddTo.addEventListener("click", function(){
						l("Clicked");
						window.location.hash = "/ChannelPlaylists"+channelID;
						document.getElementById("BigChannelCont").innerHTML = `
							<div class="songList"></div>
						`;
						loadChannelPlaylists(channelID);
						//BSplayer.playAll();
					});
				})();
				AddTo.innerHTML = "<span>PLAYLISTS</span>";
				channelCont.appendChild(AddTo);

				var Edit = document.createElement("DIV");
				Edit.classList.add("channelActionButton");
				(function(){
					Edit.addEventListener("click", function(){
						l("Clicked");
						//BSplayer.playAll();
					});
				})();
				Edit.innerHTML = "<span>EDIT...</span>";
				channelCont.appendChild(Edit);

				channelHead.appendChild(channelCont);
				channelTopCont.appendChild(channelHead);

				document.getElementById("BigChannelCont").appendChild(channelTopCont);
				document.getElementById("BigChannelCont").appendChild(songList);

				// document.getElementById("BigChannelCont").innerHTML = `
				// 	<div class="channelTopCont" style="background-image: url('${a}')">
				// 		<div class='channelHead' style="background: ${d}">
				// 			<div class='channelDetailsCont'>
				// 				<div class='channelName' style="color: ${e}">
				// 					${be}
				// 				</div>
				// 				<div class='channelSubtext' style="color: ${f}">
				// 					${c}
				// 				</div>
				// 			</div>
				// 			<div class='channelCont'>
				// 				<div class='channelActionButton'>
				// 					<span>PLAY ALL</span>
				// 				</div>
				// 				<div class='channelActionButton'>
				// 					<span>ADD TO</span>
				// 				</div>
				// 				<div class='channelActionButton'>
				// 					<span>EDIT...</span>
				// 				</div>
				// 			</div>
				// 		</div>
				// 	</div>
				// 	<div class='songList'>
						
				// 	</div>
				// `;

				BSplayer.allVideos = [];
				BSplayer.displayedVideos = [];

				makeSongList(responseChannel.items[0].contentDetails.relatedPlaylists.uploads);
			}
		};
		NX.send();
	});
}

function makeSongList(playlistID, pageToken){
	l("makeSongList");
	var request;
	if (pageToken != undefined){
		var request = gapi.client.request({
			'method': 'GET',
			'path': '/youtube/v3/playlistItems',
			'params': {'part': 'contentDetails', 'maxResults':maxResults, "pageToken": pageToken, "playlistId": playlistID}
		});
	}
	else{
		var request = gapi.client.request({
			'method': 'GET',
			'path': '/youtube/v3/playlistItems',
			'params': {'part': 'contentDetails', 'maxResults':maxResults, "playlistId": playlistID}
		});
	}
	
	request.execute(function(responsePlaylist) {
		var idString = "";
		for (vid in responsePlaylist.items){
			if ((parseInt(vid)+1) == responsePlaylist.items.length){
				idString += (responsePlaylist.items[vid].contentDetails.videoId);
				var request = gapi.client.request({
					'method': 'GET',
					'path': '/youtube/v3/videos',
					'params': {'part': 'snippet,contentDetails', 'maxResults':maxResults, "id":idString}
				});
				request.execute(function(responseVideo) {
					var parent = document.getElementsByClassName("songList")[0];
					
					var offset = document.getElementsByClassName('songEntry').length;
					for (x in responseVideo.items){
						var a = (parseInt(x)+1) + offset;
						var b = responseVideo.items[x].snippet.title;
						var c = convertTime(responseVideo.items[x].contentDetails.duration);
						var d = responseVideo.items[x].snippet.thumbnails.medium.url;

						var songEntry = document.createElement("DIV");
						songEntry.classList.add("songEntry");

						songEntry.innerHTML = `
							<div class="songThumb" style="background-image: url('${d}');"></div>
							<span class='entryNum'>${a}.</span>
							<span class='entryName'>${b}</span>
							<span class='entryDuration'>${c}</span>
						`;
						songEntry.id = responseVideo.items[x].id;

						var video = new videoEntry(
							responseVideo.items[x].id,
							responseVideo.items[x].snippet.thumbnails.medium.url,
							responseVideo.items[x].snippet.title,
							responseVideo.items[x].snippet.channelTitle,
							convertToSeconds(responseVideo.items[x].contentDetails.duration)
						);
						BSplayer.allVideos.push(video);
						BSplayer.displayedVideos.push(video);

						var videoINDEX = BSplayer.allVideos.length-1;

						//l(BSplayer.allVideos[videoINDEX]);

						(function(ind) {
							songEntry.addEventListener("click", function(){
								l("Clicked");
								BSplayer.addToQueue(BSplayer.allVideos[ind]);
							});
						})(videoINDEX);

						parent.appendChild(songEntry)
					}
					if (responsePlaylist.nextPageToken != undefined){
						functionToCall = function(id, tok){
							makeSongList(id, tok);
						};
						nextToken = responsePlaylist.nextPageToken;
						nextId = playlistID;
						//makeSongList(playlistID, responsePlaylist.nextPageToken);
					}
					else{
						functionToCall = undefined;
						nextToken = undefined;
						nextId = undefined;
					}
				});
			}
			else {
				idString += (responsePlaylist.items[vid].contentDetails.videoId + ",");
			}	
		}
	});
}

function makePlaylistList(pageToken){
	var request;
	if (pageToken != undefined){
		var request = gapi.client.request({
			'method': 'GET',
			'path': '/youtube/v3/playlists',
			'params': {'part': 'snippet,contentDetails', 'maxResults':maxResults, 'mine':true, 'pageToken':pageToken}
		});
	}
	else{
		var request = gapi.client.request({
			'method': 'GET',
			'path': '/youtube/v3/playlists',
			'params': {'part': 'snippet,contentDetails', 'maxResults':maxResults, 'mine':true}
		});
	}
	request.execute(function(responsePlaylist) {
		//l(responsePlaylist);
		var offset = document.getElementsByClassName("songEntry").length;
		for (x in responsePlaylist.items){
			var index = (parseInt(x)+1)+offset;
			var a = responsePlaylist.items[x].snippet.title;					// Playlist title
			var b = responsePlaylist.items[x].contentDetails.itemCount;		//vid number
			var c = responsePlaylist.items[x].snippet.thumbnails.high.url 	//Thumbnail
			var d = responsePlaylist.items[x].snippet.thumbnails.default.url;
			var id = responsePlaylist.items[x].id;

			var songEntry = document.createElement("DIV");
			songEntry.classList.add("songEntry");

			(function(id) {
				songEntry.addEventListener("click", function(){
					l("Clicked");
					window.location.hash = '/PlaylistList'+ id;
				});
			})(id);

			songEntry.innerHTML += `
				<div class="songThumb" style="background-image: url('${d}');"></div>
				<span class='entryNum' style="min-width: 0px;"></span>
				<span class='entryName'>${a}</span>
				<span class='entryDuration'>${b + " videos"}</span>
			`;

			document.getElementsByClassName("songList")[0].appendChild(songEntry);
		}

		if (responsePlaylist.nextPageToken != undefined){
			functionToCall = function(id, tok){
				makePlaylistList(tok);
			};
			nextToken = responsePlaylist.nextPageToken;
			nextId = undefined;
			//makePlaylistList(responsePlaylist.nextPageToken);
		}
		else{
			functionToCall = undefined;
			nextToken = undefined;
			nextId = undefined;
		}
	});
}

function loadChannelPlaylists(channelID, pageToken){
	var request;
	if (pageToken != undefined){
		var request = gapi.client.request({
			'method': 'GET',
			'path': '/youtube/v3/playlists',
			'params': {'part': 'snippet,contentDetails', 'channelId':channelID, 'maxResults':maxResults, 'pageToken':pageToken}
		});
	}
	else{
		var request = gapi.client.request({
			'method': 'GET',
			'path': '/youtube/v3/playlists',
			'params': {'part': 'snippet,contentDetails', 'channelId':channelID, 'maxResults':maxResults}
		});
	}
	request.execute(function(responsePlaylist) {
		//l(responsePlaylist);
		var offset = document.getElementsByClassName("songEntry").length;
		for (x in responsePlaylist.items){
			var index = (parseInt(x)+1)+offset;
			var a = responsePlaylist.items[x].snippet.title;					// Playlist title
			var b = responsePlaylist.items[x].contentDetails.itemCount;		//vid number
			var c = responsePlaylist.items[x].snippet.thumbnails.high.url 	//Thumbnail
			var d = responsePlaylist.items[x].snippet.thumbnails.default.url;
			var id = responsePlaylist.items[x].id;

			var songEntry = document.createElement("DIV");
			songEntry.classList.add("songEntry");

			(function(id) {
				songEntry.addEventListener("click", function(){
					l("Clicked");
					window.location.hash = '/PlaylistList'+ id;
				});
			})(id);

			songEntry.innerHTML += `
				<div class="songThumb" style="background-image: url('${d}');"></div>
				<span class='entryNum' style="min-width: 0px;"></span>
				<span class='entryName'>${a}</span>
				<span class='entryDuration'>${b + " videos"}</span>
			`;

			document.getElementsByClassName("songList")[0].appendChild(songEntry);
		}

		if (responsePlaylist.nextPageToken != undefined){
			functionToCall = function(id, tok){
				loadChannelPlaylists(id, tok);
			};
			nextToken = responsePlaylist.nextPageToken;
			nextId = channelID;
			//makePlaylistList(responsePlaylist.nextPageToken);
		}
		else{
			functionToCall = undefined;
			nextToken = undefined;
			nextId = undefined;
		}
	});
}