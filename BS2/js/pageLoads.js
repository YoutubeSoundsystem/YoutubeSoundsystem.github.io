
var nextToken = undefined;
var functionToCall = undefined;
var nextId = undefined;

var currentlyEditingPlaylistId = [];

var maxResults = 40;

function loadChannel(channelID, asPlaylist) {
	BSplayer.displayedVideos = {};
	BSplayer.displayedIds = [];

	document.getElementById("BigChannelCont").innerHTML = "";
	var channelExclusive = document.createElement("DIV");
	channelExclusive.id = "channelExclusive"+channelID;
	document.getElementById("BigChannelCont").appendChild(channelExclusive);

	if (asPlaylist){
		makeChannelHead(channelID, loadChannelPlaylists);
	}
	else{
		makeChannelHead(channelID, makeSongList);
	}
}

function loadChannelList(pageToken) {
	var params = {'part': 'snippet', 'mine': 'true', 'maxResults': maxResults};

	if (pageToken != undefined){
		params["pageToken"] = pageToken;
	}
	else{
		document.getElementById("BigChannelCont").innerHTML = "";
		var channelListExclusive = document.createElement("DIV");
		channelListExclusive.id = "channelListExclusive";
		document.getElementById("BigChannelCont").appendChild(channelListExclusive);
	}
	var request = gapi.client.request({
		'method': 'GET',
		'path': '/youtube/v3/subscriptions',
		'params': params
	});
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
						var a = sortedResponse[x].brandingSettings.image.bannerExternalUrl;
						var b = sortedResponse[x].snippet.thumbnails.default.url;
						var c = sortedResponse[x].snippet.title;
						var d = "123 videos";
						var e;
						if (sortedResponse[x].brandingSettings.image.bannerExternalUrl == undefined){
							a = "http://yt3.ggpht.com/xQhp8-B774IYTnvEG4zHESE2CNHF_RokEet5Ne6G1zq1j4Xg-PT0ytalVJxmf206_O96HDtcItiaadGAZA=w1060-fcrop64=1,00005a57ffffa5a8-nd-c0xffffffff-rj-k-no";
							e = a;
						}
						else{
							e = sortedResponse[x].brandingSettings.image.bannerMobileLowImageUrl;
						}

						var Cont = document.createElement("DIV");
						Cont.classList.add("ChannelEntry");
						//Cont.style = `background-image: url('${a}');`;
						Cont.dataset.id = sortedResponse[x].id;

						Cont.innerHTML = `
								<div class="ChannelImg" style="background-image: url('${b}');">
								</div>
								<div class="ChanTitleCont">
									<div>${c}</div>
									<div>${d}</div>
								</div>
						`;
						 (function(id){Cont.addEventListener("click", function(){
						 	l("Clicked");
						 	window.location.hash = ('/ChannelList' + id);
						 });})(sortedResponse[x].id);

						document.getElementById("channelListExclusive").appendChild(Cont);

						(function(mobileUrl, parent, banner){
// 							var NX = new XMLHttpRequest();
// 							NX.open("GET", ("uploadPic2.php?url="+mobileUrl+"&num=0"), true);
// 							NX.onreadystatechange = function() {
// 								if (NX.readyState == 4) {
									var realWidth = parent.getElementsByClassName("ChanTitleCont")[0].offsetWidth;
// 									var results = JSON.parse(NX.responseText);
// 									var r = results['red'];
// 									var g = results['green'];
// 									var b = results['blue'];

// 									var grad = `linear-gradient(to right, rgb(${r},${g},${b}) ${realWidth}px, rgb(${r},${g},${b},0.85) ${realWidth+80}px, rgba(${r},${g},${b},0.67) ${realWidth+180}px, #ffffff00)`;

									//parent.style.background = `${grad}, url(${banner}) center`;
									parent.style.background = `url(${banner}) center`;
									parent.style.backgroundSize = 'cover';

									//document.getElementsByClassName("ChannelBack")[globalIndex].style.background = `${grad}, ${a}`;
// 									if ((r+g+b) > 600/*r > 200 && g > 200 && b > 200*/){
// 										parent.children[1].getElementsByTagName("DIV")[0].style.color = "black";
// 										parent.children[1].getElementsByTagName("DIV")[1].style.color = "rgba(0,0,0,0.5";
// 									}
// 								}
// 							};
// 							NX.send();
						})(sortedResponse[x].brandingSettings.image.bannerMobileLowImageUrl, Cont, a);
					}
					document.getElementById("channelListExclusive").addEventListener("click", function(event){
						if (event.target.closest(".ChannelEntry") != null){
							window.location.hash = '/ChannelList'+ event.target.closest(".ChannelEntry").dataset.id;
						}
						// if (event.target.className == "ChannelEntry"){
						// 	window.location.hash = ('/ChannelList' + event.target.dataset.id);
						// }
						// else if (event.target.parentElement.className == "ChannelEntry"){
						// 	window.location.hash = ('/ChannelList' + event.target.parentElement.dataset.id);
						// }
						// else if (event.target.parentElement.parentElement.className == "ChannelEntry"){
						// 	window.location.hash = ('/ChannelList' + event.target.parentElement.parentElement.dataset.id);
						// }
					});
				});
			}
		}
		if (responseSubscription.nextPageToken != undefined){
			functionToCall = function(id, tok){
				loadChannelList(tok);
			};
			nextToken = responseSubscription.nextPageToken;
			nextId = undefined;
		}
		else{
			functionToCall = undefined;
			nextToken = undefined;
			nextId = undefined;
		}
	});
}

function loadPlaylistList(){

	document.getElementById("BigChannelCont").innerHTML = "";
	var playlistListExclusive = document.createElement("DIV");
	playlistListExclusive.id = "playlistListExclusive";
	playlistListExclusive.innerHTML = `
		<div class='songList'>
			<div class="createPlaylistCont">
				<input type="text" placeholder="Create a Playlist"></input>
				<div></div>
			</div>
		</div>
	`;
	document.getElementById("BigChannelCont").appendChild(playlistListExclusive);
	makePlaylistList(undefined, "playlistListExclusive");
}

function loadPlaylist(playlistID){
	BSplayer.displayedVideos = {};
	BSplayer.displayedIds = [];
	document.getElementById("BigChannelCont").innerHTML = "";

	var playlistExclusive = document.createElement("DIV");
	playlistExclusive.id = "playlistExclusive"+playlistID;
	//document.getElementById("BigChannelCont").appendChild(playlistExclusive);

	var request = gapi.client.request({
		'method': 'GET',
		'path': '/youtube/v3/playlists',
		'params': {'part': 'snippet,contentDetails', 'id': playlistID}
	});
	request.execute(function(responsePlaylist) {

// 		var NX = new XMLHttpRequest();
// 		NX.open("GET", ("uploadPic2.php?url="+responsePlaylist.items[0].snippet.thumbnails.default.url+"&num=0"), true);
// 		NX.onreadystatechange = function() {
// 			if (NX.readyState == 4) {
		
		console.log(responsePlaylist);

				var a = responsePlaylist.items[0].snippet.thumbnails.high.url;
				//var ae = responsePlaylist.items[0].snippet.thumbnails.high.url
				var be = responsePlaylist.items[0].snippet.title;
				var c = responsePlaylist.items[0].contentDetails.itemCount+" videos";
				var ce = responsePlaylist.items[0].id;
				var mine = false
				if (user.Lu.tf == responsePlaylist.items[0].snippet.channelTitle) {
					mine = true;
				}

				//var results = JSON.parse(NX.responseText);
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
				playlistExclusive.dataset.id = ce;
				playlistExclusive.dataset.title = be;
				var playlistActions = `
					<div class="channelActionButton">
						<span>SAVE</span>
					</div>
				`;
				if (mine) {
					playlistActions = ``;
				}
				//var playlistExclusive = document.getElementById("playlistExclusive");
				//background: linear-gradient(to right, #ea3232e6, #ea3232ad) 0% 0% / cover, url('${a}') no-repeat center center; background-size: cover;
				playlistExclusive.innerHTML = `
					<div class="playlistTopCont" style="background-image: url('${a}')">
						<div class="channelHead" style="background: ${d}">
							<div class="channelDetailsCont">
								<div class='channelName' style="color: ${e}">
									${be}
								</div>
								<div class='channelSubtext' style="color: ${f}">
									${c}
								</div>
							</div>
							<div class="channelCont">
								<div class="channelActionButton">
									<span>PLAY ALL</span>
								</div>
								${playlistActions}
								<div class="channelActionButton">
									<span>EDIT...</span>
								</div>
							</div>
						</div>
					</div>
					<div class="songList">

					</div>
				`;

				playlistExclusive.addEventListener("click", function(event){
					if (event.target.innerHTML.includes("PLAY ALL")){
						BSplayer.displayedPlaylist = [];

						var thisPlaylistId = this.dataset.id;

						var allVids = [];
						iterateVids();

						function iterateVids(pageToken){
							var params = {'part': 'contentDetails', 'maxResults':maxResults, "playlistId": thisPlaylistId};
							if (pageToken != undefined){
								params["pageToken"] = pageToken;
							}
							var request = gapi.client.request({
								'method': 'GET',
								'path': '/youtube/v3/playlistItems',
								'params': params
							});
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
											
											for (x in responseVideo.items){
												var video = new videoEntry(
													responseVideo.items[x].id,
													responseVideo.items[x].snippet.thumbnails.medium.url,
													responseVideo.items[x].snippet.title,
													responseVideo.items[x].snippet.channelTitle,
													responseVideo.items[x].snippet.channelId,
													convertToSeconds(responseVideo.items[x].contentDetails.duration),
													responseVideo.items[x].snippet.description,
													isVideoAlbum(responseVideo.items[x].snippet.description)
												);
												allVids.push(video);
											}
											if (responsePlaylist.nextPageToken != undefined){
												iterateVids(responsePlaylist.nextPageToken);
											}
											else if (responsePlaylist.nextPageToken == undefined){
												BSplayer.displayedPlaylist = allVids;

												BSplayer.playAll();
											}
										});
									}
									else {
										idString += (responsePlaylist.items[vid].contentDetails.videoId + ",");
									}
								}
							});
						}
					}
					else if (event.target.innerHTML.includes("SAVE")){
						
						var thisPlaylistId = this.dataset.id;

						createPlaylist(this.dataset.title, "Playlist created by Youtube Soundsystem", true, function(response){
							var newPlaylistId = response.id;
							//l(response);
							//var playlistId = "PLCD9mVi9L2hiMVIM3VhdHug9AX8tu8WHZ";//this.dataset.id;

							var allVidIds = [];
							iterateVids();



							function iterateVids(pageToken){
								var params = {'part': 'contentDetails', 'maxResults':maxResults, "playlistId": thisPlaylistId};

								if (pageToken != undefined){
									params["pageToken"] = pageToken;
								}
								
								var request = gapi.client.request({
									'method': 'GET',
									'path': '/youtube/v3/playlistItems',
									'params': params
								});
								request.execute(function(responsePlaylist) {
									for (x in responsePlaylist.items){
										allVidIds.push(responsePlaylist.items[x].contentDetails.videoId);
									}
									
									if (responsePlaylist.nextPageToken != undefined){
										iterateVids(responsePlaylist.nextPageToken);
									}

									if (responsePlaylist.nextPageToken == undefined){
										addToPlaylist(newPlaylistId, allVidIds, function(){
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

													createSidebarEntry(a, b, id, true, true);
												
													// var Cont = document.createElement("DIV");
													// Cont.classList.add("sidebarEntryPlaylist");
													// Cont.dataset.id = id;
													// Cont.title = a;
													// Cont.innerHTML = `
													// 	<div class="miniChannelImage" style="background-image: url('${a}');"></div>
													// 	<div class="miniChannelTitle">${b}</div>
													// 	<div class="checkbox" data-checked="false"></div>
													// `;
													// document.getElementsByClassName("sidebarList")[0].insertBefore(Cont, document.getElementsByClassName("sidebarList")[0].children[0]);
												});
											}
										});
									}
								});
							}
						});
					}
					else if (event.target.innerHTML.includes("EDIT...")){
						//BSplayer.playAll();
					}
				});

				document.getElementById("BigChannelCont").appendChild(playlistExclusive);

				makeSongList(playlistID, undefined, ("playlistExclusive"+playlistID), mine);
// 			}
// 		};
// 		NX.send();
	});
}
var sideBarListen;

function loadSidebar(type, pageToken) {
	var header = document.getElementById("sidebar").getElementsByClassName("header")[0].getElementsByTagName("SPAN")[0];
	//l(type == "Channel");
	if (pageToken == undefined){
		document.getElementsByClassName("sidebarList")[0].innerHTML = "";
	}

	if (type == "Channel"){
		header.innerHTML = "CHANNELS";
		var params = {'part': 'snippet', 'mine': 'true'};

		if (pageToken != undefined){
			params["pageToken"] = pageToken;
		}
		var request = gapi.client.request({
			'method': 'GET',
			'path': '/youtube/v3/subscriptions',
			'params': params
		});
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

							createSidebarEntry(b, c, sortedResponse[x].id, false, false);

							// var Cont = document.createElement("DIV");
							// Cont.classList.add("sidebarEntry");
							// Cont.dataset.id = sortedResponse[x].id;
							// Cont.title = c;
							// Cont.innerHTML = `
							// 	<div class="miniChannelImage" style="background-image: url('${b}');"></div>
							// 	<div class="miniChannelTitle">${c}</div>
							// `;
							// document.getElementsByClassName("sidebarList")[0].appendChild(Cont);
						}
					});
				}
			}
			if (pageToken == undefined){
				sideBarListen = document.getElementsByClassName("sidebarList")[0].addEventListener("click", function(event){

					if (event.target.closest(".sidebarEntry") != null){
						window.location.hash = '/ChannelList'+ event.target.closest(".sidebarEntry").dataset.id;
					}
					// if (event.target.parentElement.className == "sidebarEntry"){
					// 	window.location.hash = ('/ChannelList' + event.target.parentElement.dataset.id);
					// }
					// else if (event.target.className == "sidebarEntry"){
					// 	window.location.hash = ('/ChannelList' + event.target.dataset.id);
					// } 

				});
			}
			

			if (responseSubscription.nextPageToken != undefined){
				//l("loading sidebar");
				loadSidebar("Channel", responseSubscription.nextPageToken);
			}
		});
	}
	else if (type == "Playlist"){
		header.innerHTML = "PLAYLISTS";
		var params = {'part': 'snippet,contentDetails', 'maxResults':maxResults, 'mine':true};

		if (pageToken != undefined){
			params["pageToken"] = pageToken;
		}
		var request = gapi.client.request({
			'method': 'GET',
			'path': '/youtube/v3/playlists',
			'params': params
		});
		request.execute(function(responsePlaylist) {
			for (x in responsePlaylist.items){
				var b = responsePlaylist.items[x].snippet.thumbnails.default.url;
				var c = responsePlaylist.items[x].snippet.title;

				createSidebarEntry(b, c, responsePlaylist.items[x].id, true, false);

				// var Cont = document.createElement("DIV");
				// Cont.classList.add("sidebarEntryPlaylist");
				// Cont.dataset.id = responsePlaylist.items[x].id;
				// Cont.title = c;
				// Cont.innerHTML = `
				// 	<div class="miniChannelImage" style="background-image: url('${b}');"></div>
				// 	<div class="miniChannelTitle">${c}</div>
				// 	<div class="checkbox" data-checked="false"></div>
				// `;
				// document.getElementsByClassName("sidebarList")[0].appendChild(Cont);
			}
			if (pageToken == undefined){
				sideBarListen = document.getElementsByClassName("sidebarList")[0].addEventListener("click", function(event){
				
					if (event.target.classList.contains("checkbox")){
						if (event.target.dataset.checked == "false"){
							event.target.classList.add("activeCheckbox");
							document.getElementsByClassName("songList")[0].classList.add("addMode");
							event.target.dataset.checked = "true";
							currentlyEditingPlaylistId.push(event.target.parentElement.dataset.id);
						}
						else{
							event.target.classList.remove("activeCheckbox");
							event.target.dataset.checked = "false";
							document.getElementsByClassName("songList")[0].classList.remove("addMode");
							currentlyEditingPlaylistId.splice(currentlyEditingPlaylistId.indexOf(event.target.parentElement.dataset.id), 1);
						}
					}
					else if (event.target.closest(".sidebarEntryPlaylist") != null){
						window.location.hash = '/PlaylistList'+ event.target.closest(".sidebarEntryPlaylist").dataset.id;
					}
					// else if (event.target.parentElement.className == "sidebarEntryPlaylist"){
					// 		window.location.hash = ('/PlaylistList' + event.target.parentElement.dataset.id);
					// 	//loadChannel(event.target.parentElement.dataset.id);
					// }
					// else if (event.target.className == "sidebarEntryPlaylist"){
					// 		window.location.hash = ('/PlaylistList' + event.target.dataset.id);
					// 	//loadChannel(event.target.dataset.id);
					// }
				});
			}
			

			if (responsePlaylist.nextPageToken != undefined){
				loadSidebar("Playlist", responsePlaylist.nextPageToken);
			}
		});
	}
	else if (type == "Stations"){
		header.innerHTML = "STATIONS";
	}
}

function makeChannelHead(channelID, callback){
	var request = gapi.client.request({
		'method': 'GET',
		'path': '/youtube/v3/channels',
		'params': {'part': 'snippet,contentDetails,brandingSettings', 'maxResults':maxResults, 'id': channelID}
	});
	request.execute(function(responseChannel) {

		l(responseChannel);

// 		var NX = new XMLHttpRequest();
// 		NX.open("GET", ("uploadPic2.php?url="+responseChannel.items[0].brandingSettings.image.bannerMobileLowImageUrl+"&num=0"), true);
// 		NX.onreadystatechange = function() {
// 			if (NX.readyState == 4) {

				var a;
				var r;
				var g;
				var b;

// 				if (NX.responseText.substring(0,1) == "I"){
// 					a = "http://yt3.ggpht.com/xQhp8-B774IYTnvEG4zHESE2CNHF_RokEet5Ne6G1zq1j4Xg-PT0ytalVJxmf206_O96HDtcItiaadGAZA=w1060-fcrop64=1,00005a57ffffa5a8-nd-c0xffffffff-rj-k-no";
// 					r = 234;
// 					g = 49;
// 					b = 49;
// 				}
				//else{
					a = responseChannel.items[0].brandingSettings.image.bannerExternalUrl;
// 					var results = JSON.parse(NX.responseText)
// 					r = results['red'];
// 					g = results['green'];
// 					b = results['blue'];
				//}

				var be = responseChannel.items[0].snippet.title;
				var c = "Channel";

				

				//var d = "linear-gradient(to right, rgb("+r+","+g+","+b+") 200px, rgb("+r+","+g+","+b+",0.85) 340px, rgba("+r+","+g+","+b+",0.67) 430px, #ffffff00)";
				var d = "";
				var e = ""; 
				var f = "";

// 				if ((r+g+b) > 600){
// 					e = "black";
// 					f = "rgba(0,0,0,0.5)";
// 				}

				var channelExclusive = document.getElementById("channelExclusive"+channelID);
				channelExclusive.innerHTML = `
					<div class="channelTopCont" style="background-image: url('${a}')">
						<div class="channelHead" style="background: ${d}">
							<div class="channelDetailsCont">
								<div class='channelName' style="color: ${e}">
									${be}
								</div>
								<div class='channelSubtext' style="color: ${f}">
									${c}
								</div>
							</div>
							<div class="channelCont">
								<div class="channelActionButton">
									<span>PLAY ALL</span>
								</div>
								<div class="channelActionButton">
									<span>PLAYLISTS</span>
								</div>
								<div class="channelActionButton">
									<span>EDIT...</span>
								</div>
							</div>
						</div>
					</div>
					<div class="songList">

					</div>
				`;

				channelExclusive.addEventListener("click", function(event){
					if (event.target.innerHTML.includes("PLAY ALL")){
						BSplayer.playAll();
					}
					else if (event.target.innerHTML.includes("PLAYLISTS")){
						window.location.hash = "/ChannelPlaylists"+channelID;
						//loadChannelPlaylists(channelID);
					}
					else if (event.target.innerHTML.includes("EDIT...")){
						//BSplayer.playAll();
					}
				});

				if (callback == makeSongList){
					callback(responseChannel.items[0].contentDetails.relatedPlaylists.uploads, undefined, ("channelExclusive"+channelID));
				}
				else if (callback == loadChannelPlaylists){
					callback(channelID, undefined);
				}

				//makeSongList(responseChannel.items[0].contentDetails.relatedPlaylists.uploads, undefined, ("channelExclusive"+channelID));
//			}
// 		};
// 		NX.send();
	});
}

function updateSongNums(){
	let numElements = document.getElementsByClassName("songList")[0].getElementsByClassName("entryNum");
	for (var i = 0; i < numElements.length; i++) {
		numElements[i].innerHTML = (i+1)+".";
	}
}

var SongOptions = [
	{
		optionName	: 'Remove',
		mineOnly	: true,
		action 		: function(event, parent){
			let id = event.target.closest(".songEntry").dataset.playlistItemId;
			let child = event.target.closest(".songEntry");

			pushDialogBox(
				`Remove "${event.target.parentElement.parentElement.parentElement.getElementsByClassName("entryName")[0].innerHTML}"?`,
				"Are you sure you want to remove this song from the playlist?",
				"Remove",
				"Cancel",
				onConfirm,
				onCancel
			);

			function onConfirm(){
				deletePlaylistItem(id);
				parent.removeChild(child);
				updateSongNums();
			}
			function onCancel(){}
		}
	},
	{
		optionName	: 'Open in Youtube',
		mineOnly	: false,
		action 		: function(event){
			var id = event.target.closest(".songEntry").dataset.id;
			window.open("https://www.youtube.com/watch?v="+id, "_blank");
		}
	},
	{
		optionName	: 'Put in New Playlist',
		mineOnly	: false,
		action 		: function(event){
			var thisId = [event.target.closest(".songEntry").dataset.id];
			var thisTitle = event.target.closest(".songEntry").getElementsByClassName("entryName")[0].innerHTML;
			createPlaylist(thisTitle, "Playlist created by Youtube Soundsystem", true, function(response){
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

							createSidebarEntry(a, b, id, true, true);
						});
					}
				});
			});
		}
	},
	{
		optionName	: 'Seed Station',
		mineOnly	: false,
		action 		: function(event){
			seedStation(event.target.closest(".songEntry").dataset.id);
		}
	},
	{
		optionName	: 'Download MP3',
		mineOnly	: false,
		action 		: function(event){
			var thisId = event.target.closest(".songEntry").dataset.id;
			var thisTitle = event.target.closest(".songEntry").getElementsByClassName("entryName")[0].innerHTML;
			var thisLength = event.target.closest(".songEntry").getElementsByClassName("entryDuration")[0].innerHTML;
			var data = {
				"items": [
					{
						"id":thisId,
						"title":thisTitle,
						"tracks":[]
					}
				]
			};
			isAlbum(thisId, function(response, titles, times, responseVideo){
				if (response){
					times.push(thisLength);

					for (var i = 0; i < titles.length-1; i++) {
						var tempTrack = {
							"title":titles[i],
							"start_time":toSeconds(times[i]),
							"end_time":toSeconds(times[i+1])
						};
						data.items[0].tracks.push(tempTrack);
					}
				}

				l(data);

// 				var NX = new XMLHttpRequest();
// 				NX.open("POST", "http://27raj121.ddns.net:8080/testing/", true);
// 				NX.onreadystatechange = function() {
// 					if (NX.readyState == 4) {
// 						//func(JSON.parse(NX.responseText));
// 						l("complete");
// 					}
// 				}
// 				NX.send(JSON.stringify(data));
			});
		}
	},
];

function makeSongList(playlistID, pageToken, exclusiveId, mine){
	var pId = playlistID;

	var sortable = Sortable.create(document.getElementsByClassName("songList")[0], {
		onEnd: function (evt) {
			if (evt.newIndex != evt.oldIndex){
				moveSong(pId, evt.item.dataset.playlistItemId, evt.item.dataset.id, evt.newIndex, function(r){
					l(r);
					updateSongNums();
				});
			}
		},
		draggable:".songEntry",
		handle:".songThumb"
	});

	var params = {'part': 'contentDetails', 'maxResults':maxResults, "playlistId": playlistID};

	if (pageToken != undefined){
		params["pageToken"] = pageToken;
	}
	var request = gapi.client.request({
		'method': 'GET',
		'path': '/youtube/v3/playlistItems',
		'params': params
	});
	request.execute(function(responsePlaylist) {
		var idString = "";
		var parent = document.getElementById(exclusiveId).getElementsByClassName("songList")[0];
		var playlistItemIDs = [];
		if (currentlyEditingPlaylistId.length > 0){
			parent.classList.add("addMode");
		}
		for (vid in responsePlaylist.items){
			if ((parseInt(vid)+1) == responsePlaylist.items.length){
				idString += (responsePlaylist.items[vid].contentDetails.videoId);
				playlistItemIDs.push(responsePlaylist.items[vid].id);
				var request = gapi.client.request({
					'method': 'GET',
					'path': '/youtube/v3/videos',
					'params': {'part': 'snippet,contentDetails', 'maxResults':maxResults, "id":idString}
				});
				request.execute(function(responseVideo) {
					
					var offset = document.getElementsByClassName('songEntry').length;
					for (x in responseVideo.items){
						var a = (parseInt(x)+1) + offset;
						var b = responseVideo.items[x].snippet.title;
						var c = convertTime(responseVideo.items[x].contentDetails.duration);
						var d = responseVideo.items[x].snippet.thumbnails.medium.url;
						var e = playlistItemIDs[parseInt(x)];
						//var v = responseVideo.items[x].statistics.viewCount;
						var options = "";

						var songEntry = document.createElement("DIV");
						songEntry.classList.add("songEntry");
						songEntry.dataset.id = responseVideo.items[x].id;
						songEntry.dataset.playlistItemId = e;
						
						for (var i = 0; i < SongOptions.length; i++) {
							if (SongOptions[i].mineOnly == false){
								options+= '<li>'+SongOptions[i].optionName+'</li>';
							}
							else if (SongOptions[i].mineOnly && mine){
								options+= '<li>'+SongOptions[i].optionName+'</li>';
							}
						}

						//<span class="views">(${v} views)</span>
						songEntry.innerHTML = `
							<div class="songThumb" style="background-image: url('${d}');">
								<div></div>
							</div>
							<span class='entryNum'>${a}.</span>
							<span class='entryName'>${b}</span>
							<span class='entryDuration'>${c}</span>
							<div class="actions">
								<div class="outBottomLeft">
									${options}
								</div>
							</div>
						`;

						var video = new videoEntry(
							responseVideo.items[x].id,
							responseVideo.items[x].snippet.thumbnails.medium.url,
							responseVideo.items[x].snippet.title,
							responseVideo.items[x].snippet.channelTitle,
							responseVideo.items[x].snippet.channelId,
							convertToSeconds(responseVideo.items[x].contentDetails.duration),
							responseVideo.items[x].snippet.description,
							isVideoAlbum(responseVideo.items[x].snippet.description)
						);
						BSplayer.displayedVideos[responseVideo.items[x].id] = video;
						BSplayer.displayedIds.push(responseVideo.items[x].id);
						parent.appendChild(songEntry);
					}

					if (responsePlaylist.nextPageToken != undefined){
						functionToCall = function(id, tok){
							makeSongList(id, tok, exclusiveId, mine);
						};
						nextToken = responsePlaylist.nextPageToken;
						nextId = playlistID;
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
				playlistItemIDs.push(responsePlaylist.items[vid].id);
			}	
		}

		if (pageToken == undefined){
			parent.addEventListener("click", function(event){
				var threeDotListen;

				if (event.target.parentElement.parentElement.className == "actions"){
					for (var i = 0; i < SongOptions.length; i++) {
						if (SongOptions[i].optionName == event.target.innerHTML){
							SongOptions[i].action(event, parent);
							break;
						}
					}
				}
				else if (event.target.className == "actions"){
					event.target.getElementsByTagName("DIV")[0].style.visibility = "visible";
					//threeDotListen = undefined;
					threeDotListen = event.target.getElementsByTagName("DIV")[0].addEventListener("mouseleave", function(){
						this.style.visibility = "hidden";
					});
				}
				else if (event.target.parentElement.className == "songThumb"){
					if (currentlyEditingPlaylistId.length > 0){
						for (x in currentlyEditingPlaylistId){
							addToPlaylist(currentlyEditingPlaylistId[x], [event.target.parentElement.parentElement.dataset.id], function(){
								pushMessage("Success! Song Added");
							});
						}
					}
				}
				else if (event.target.parentElement.className == "songEntry"){
						BSplayer.addToQueue(BSplayer.displayedVideos[event.target.parentElement.dataset.id]);
				}
				else if (event.target.className == "songEntry"){
						BSplayer.addToQueue(BSplayer.displayedVideos[event.target.dataset.id]);
				}
			});
		}
	});			
}

function makePlaylistList(pageToken, exclusive){
	
	var sortable = Sortable.create(document.getElementsByClassName("songList")[0], {
		// onEnd: function (evt) {
		// 	var itemEl = evt.item;  // dragged HTMLElement
		// 	evt.to;    // target list
		// 	evt.from;  // previous list
		// 	evt.oldIndex;  // element's old index within old parent
		// 	evt.newIndex;  // element's new index within new parent


		// 	window.localStorage.setItem('???', JSON.stringify(???));
		// }
		draggable:".listEntry",
		handle:".songThumb"
	});

	var params = {'part': 'snippet,contentDetails', 'maxResults':maxResults, 'mine':true};

	if (pageToken != undefined){
		params["pageToken"] = pageToken;
	}
	var request = gapi.client.request({
		'method': 'GET',
		'path': '/youtube/v3/playlists',
		'params': params
	});
	request.execute(function(responsePlaylist) {
		generatePlaylists(responsePlaylist, exclusive);
	});
}

function loadChannelPlaylists(channelID, pageToken){
		
	var exclusive = "channelExclusive"+channelID;

	var params = {'part': 'snippet,contentDetails', 'channelId':channelID, 'maxResults':maxResults};

	if (pageToken != undefined){
		params["pageToken"] = pageToken;
	}
	var request = gapi.client.request({
		'method': 'GET',
		'path': '/youtube/v3/playlists',
		'params': params
	});
	request.execute(function(responsePlaylist) {
		generatePlaylists(responsePlaylist, exclusive);
	});
}

function searchTerm(searchStr, pageToken){

	var params = {'part': 'snippet', 'q':searchStr, 'maxResults':maxResults};
	l(searchStr);

	if (pageToken != undefined){
		params["pageToken"] = pageToken;
	}
	else{
		nextToken = undefined;
		nextId = undefined;
		functionToCall = undefined
		BSplayer.displayedVideos = {};
		BSplayer.displayedIds = [];
		document.getElementById("BigChannelCont").innerHTML = "";

		var searchExclusive = document.createElement("DIV");
		searchExclusive.id = "searchExclusive";
		searchExclusive.innerHTML = `<div class="songList"></div>`;
		document.getElementById("BigChannelCont").appendChild(searchExclusive);

	}
	var request = gapi.client.request({
		'method': 'GET',
		'path': '/youtube/v3/search',
		'params': params
	});
	request.execute(function(responseSearch) {
		var parent = document.getElementById("searchExclusive").getElementsByClassName("songList")[0];
		//var offset = document.getElementsByClassName("songEntry").length;
		if (currentlyEditingPlaylistId.length > 0){
			parent.classList.add("addMode");
		}

		var callsFinished = 0;
		var videoString = "";
		var playlistString = "";
		var channelString = "";
		var resultObj = [];

		for (x in responseSearch.items){
			if (responseSearch.items[x].id.kind == "youtube#video"){
				videoString += (responseSearch.items[x].id.videoId+",");
				resultObj[parseInt(x)] = 'v';
			}
			else if (responseSearch.items[x].id.kind == "youtube#playlist"){
				playlistString += (responseSearch.items[x].id.playlistId+",");
				resultObj[parseInt(x)] = 'p';
			}
			else if (responseSearch.items[x].id.kind == "youtube#channel"){
				channelString += (responseSearch.items[x].id.channelId+",");
				resultObj[parseInt(x)] = 'c';
			}
		}
		videoString.slice(0,-1);
		playlistString.slice(0,-1);
		channelString.slice(0,-1);

		var request = gapi.client.request({
			'method': 'GET',
			'path': '/youtube/v3/videos',
			'params': {'part': 'snippet,contentDetails', 'maxResults':maxResults, "id":videoString}
		});
		request.execute(function(responseVideo) {
			var counter = 0;
			for (x in resultObj){
				if (resultObj[parseInt(x)] == 'v'){
					resultObj[parseInt(x)] = responseVideo.items[counter];
					counter++;
				}
			}

			callsFinished++;
			if (callsFinished == 3){
				addSearchResults(responseSearch);
			}
		});

		var request = gapi.client.request({
			'method': 'GET',
			'path': '/youtube/v3/playlists',
			'params': {'part': 'snippet,contentDetails', 'maxResults':maxResults, 'id': playlistString}
		});
		request.execute(function(responsePlaylist) {
			var counter = 0;
			for (x in resultObj){
				if (resultObj[parseInt(x)] == 'p'){
					resultObj[parseInt(x)] = responsePlaylist.items[counter];
					counter++;
				}
			}

			callsFinished++;
			if (callsFinished == 3){
				addSearchResults(responseSearch);
			}
		});

		var request = gapi.client.request({
			'method': 'GET',
			'path': '/youtube/v3/channels',
			'params': {'part': 'snippet,contentDetails,brandingSettings', 'maxResults':maxResults, 'id': channelString},
		});
		request.execute(function(responseChannel) {
			var counter = 0;
			for (x in resultObj){
				if (resultObj[parseInt(x)] == 'c'){
					resultObj[parseInt(x)] = responseChannel.items[counter];
					counter++;
				}
			}

			callsFinished++;
			if (callsFinished == 3){
				addSearchResults(responseSearch);
			}
		});

		function addSearchResults(responseSearch){
			for (x in responseSearch.items){
				var a = responseSearch.items[x].id.kind; 				// youtube#video, youtube#channel, youtube#playlist
				//var b = Object.values(responseSearch.items.id)[1];	// videoId, channelId, playlistId
				var b = responseSearch.items[x].id.videoId;
				var b1 = responseSearch.items[x].id.channelId;
				var b2 = responseSearch.items[x].id.playlistId;
				var c = responseSearch.items[x].snippet.channelId;
				var d = responseSearch.items[x].snippet.channelTitle;
				var g = responseSearch.items[x].snippet.description;
				var f = responseSearch.items[x].snippet.title;
				var e = responseSearch.items[x].snippet.thumbnails.high.url;

				if (a == "youtube#video"){
					var details = resultObj[parseInt(x)];

					var a1 = details.snippet.title;
					var a2 = convertTime(details.contentDetails.duration);
					var a3 = details.snippet.thumbnails.medium.url;
					var a4 = details.id;
					var a5 = details.snippet.channelTitle;
					var a6 = details.snippet.channelId;

					var searchEntry = document.createElement("DIV");
					searchEntry.classList.add("searchEntry");
					searchEntry.dataset.id = a4;
					searchEntry.dataset.channelId = a6;
					searchEntry.dataset.type = "v";

					searchEntry.innerHTML += `
						<div class="songThumb" style="background-image: url('${a3}');">
							<div></div>
						</div>
						<div class="entryTextCont">
							<span class='entryName'>${a1}</span>
							<span class='entrySubtext'>${a5}</span>
						</div>
						<span class='entryDuration'>${a2}</span>
					`;

					var video = new videoEntry(
						details.id,
						details.snippet.thumbnails.medium.url,
						details.snippet.title,
						details.snippet.channelTitle,
						details.snippet.channelId,
						convertToSeconds(details.contentDetails.duration),
						details.snippet.description,
						isVideoAlbum(details.snippet.description)
					);

					BSplayer.displayedVideos[details.id] = video;
					BSplayer.displayedIds.push(details.id);

					parent.appendChild(searchEntry);
				}
				else if (a == "youtube#channel"){
					var details = resultObj[parseInt(x)];
					l(details);

					var a1 = details.brandingSettings.image.bannerImageUrl;
					var a2 = details.snippet.thumbnails.default.url;
					var a3 = details.snippet.title;
					var a4 = details.id;

					var searchEntry = document.createElement("DIV");
					searchEntry.classList.add("searchEntryChannel");
					searchEntry.dataset.id = a4;
					searchEntry.dataset.type = "c";

					searchEntry.innerHTML += `
						<div class="songThumb" style="background-image: url('${a2}');"></div>
						<div class="entryTextCont">
							<span class='entryName'>${a3}</span>
							<span class='entrySubtext'>Channel</span>
						</div>
						<span class='entryDuration'>12 videos</span>
					`;

					parent.appendChild(searchEntry);
				}
				else if (a == "youtube#playlist"){
					var details = resultObj[parseInt(x)];

					var a1 = details.snippet.title;				// Playlist title
					var a2 = details.contentDetails.itemCount;		//vid number
					var a3 = details.snippet.thumbnails.high.url 	//Thumbnail
					var a4 = details.snippet.thumbnails.default.url;
					var a5 = details.id;
					var a6 = details.snippet.channelId;
					var a7 = details.snippet.channelTitle;

					var searchEntry = document.createElement("DIV");
					searchEntry.classList.add("searchEntryPlaylist");
					searchEntry.dataset.id = a5;
					searchEntry.dataset.channelId = a6;
					searchEntry.dataset.type = "p";

					searchEntry.innerHTML += `
						<div class="songThumb" style="background-image: url('${a4}');"></div>
						<div class="entryTextCont">
							<span class='entryName'>${a1}</span>
							<span class='entrySubtext'>${a7}</span>
						</div>
						<span class='entryDuration'>${a2} videos</span>
					`;

					parent.appendChild(searchEntry);
				}

			}

			if (pageToken == undefined){
				parent.addEventListener("click", function(event){

					if (event.target.parentElement.className == "songThumb"){
						if (currentlyEditingPlaylistId.length > 0 && event.target.parentElement.parentElement.dataset.type == "v"){
							for (x in currentlyEditingPlaylistId){
								addToPlaylist(currentlyEditingPlaylistId[x], [event.target.parentElement.parentElement.dataset.id], function(){
									pushMessage("Success! Song Added");
								});
							}
						}
					}
					else if (event.target.className == "entrySubtext" && event.target.closest(".searchEntry") != null){
						window.location.hash = "/ChannelList"+event.target.closest(".searchEntry").dataset.channelId;
					}
					else if (event.target.className == "entrySubtext" && event.target.closest(".searchEntryPlaylist") != null){
						window.location.hash = "/ChannelList"+event.target.closest(".searchEntryPlaylist").dataset.channelId;
					}

					else if (event.target.closest(".searchEntry") != null){
						BSplayer.addToQueue(BSplayer.displayedVideos[event.target.closest(".searchEntry").dataset.id]);
					}

					// else if (event.target.parentElement.className == "searchEntry"){
					// 	BSplayer.addToQueue(BSplayer.displayedVideos[event.target.parentElement.dataset.id]);
					// }
					// else if (event.target.className == "searchEntry"){
					// 	BSplayer.addToQueue(BSplayer.displayedVideos[event.target.dataset.id]);
					// }				
					// else if (event.target.parentElement.parentElement.className == "searchEntry"){
					// 	BSplayer.addToQueue(BSplayer.displayedVideos[event.target.parentElement.parentElement.dataset.id]);
					// }

					else if (event.target.closest(".searchEntryChannel") != null){
						window.location.hash = '/ChannelList'+ event.target.closest(".searchEntryChannel").dataset.id;
					}

					// else if (event.target.parentElement.className == "searchEntryChannel"){
					// 	window.location.hash = "/ChannelList"+event.target.parentElement.dataset.id;
					// }
					// else if (event.target.className == "searchEntryChannel"){
					// 	window.location.hash = "/ChannelList"+event.target.dataset.id;
					// }
					// else if (event.target.parentElement.parentElement.className == "searchEntryChannel"){
					// 	window.location.hash = "/ChannelList"+event.target.parentElement.parentElement.dataset.id;
					// }

					else if (event.target.closest(".searchEntryPlaylist") != null){
						window.location.hash = '/PlaylistList'+ event.target.closest(".searchEntryPlaylist").dataset.id;
					}

					// else if (event.target.parentElement.className == "searchEntryPlaylist"){
					// 	window.location.hash = "/PlaylistList"+event.target.parentElement.dataset.id;
					// }
					// else if (event.target.className == "searchEntryPlaylist"){
					// 	window.location.hash = "/PlaylistList"+event.target.dataset.id;
					// }
					// else if (event.target.parentElement.parentElement.className == "searchEntryPlaylist"){
					// 	window.location.hash = "/PlaylistList"+event.target.parentElement.parentElement.dataset.id;
					// }
				});
			}

			if (responseSearch.nextPageToken != undefined){
				functionToCall = function(id, tok){
					searchTerm(id, tok);
				};
				nextToken = responseSearch.nextPageToken;
				nextId = searchStr;
			}
			else{
				functionToCall = undefined;
				nextToken = undefined;
				nextId = undefined;
			}
		}
	});
}

var playlistListListen;
var preventNav = false;

function generatePlaylists(responsePlaylist, exclusive){

	var parent = document.getElementById(exclusive).getElementsByClassName("songList")[0];
	var offset = document.getElementsByClassName("listEntry").length;
	for (x in responsePlaylist.items){
		var index = (parseInt(x)+1)+offset;
		var a = responsePlaylist.items[x].snippet.title;				// Playlist title
		var b = responsePlaylist.items[x].contentDetails.itemCount;		//vid number
		//var c = responsePlaylist.items[x].snippet.thumbnails.high.url 	//Thumbnail
		
		var d = responsePlaylist.items[x].snippet.thumbnails;
		if (d.default != undefined)
			d = d.default.url;
		else
			d = d.standard.url;

		var id = responsePlaylist.items[x].id;

		var listEntry = document.createElement("DIV");
		listEntry.classList.add("listEntry");
		listEntry.dataset.id = id;

		//<span class='entryName'>${a}</span>

		listEntry.innerHTML += `
			<div class="songThumb" style="background-image: url('${d}');">
				<div></div>
			</div>
			<div class="playlistName">
				<span>${a}</span>
			</div>
			<span class='entryDuration'>${b + " videos"}</span>
			<div class="actions">
				<div class="outBottomLeft">
					<li>Rename</li>
					<li>Options</li>
					<li>Remove</li>
					<li>Open in Youtube</li>
				</div>
			</div>
		`;

		parent.appendChild(listEntry);
	}

	if (document.getElementsByClassName("createPlaylistCont")[0] != undefined){
		document.getElementsByClassName("createPlaylistCont")[0].getElementsByTagName("INPUT")[0].addEventListener("click", function(){
			this.placeholder = "Give it a Name...";
		});

		document.getElementsByClassName("createPlaylistCont")[0].onkeypress = function(e){
			e.stopPropagation();
			var input = document.getElementsByClassName("createPlaylistCont")[0].getElementsByTagName("INPUT")[0];
			if (e.which == '13'){
				this.placeholder = "Create a Playlist";
				createPlaylist(input.value, "Playlist created by Youtube Soundsystem", true, function(response){
					input.value = "";
					document.activeElement = null;
					//l(response);

					var a = response.snippet.title;				// Playlist title
					var b = 0;		//vid number
					var c = response.snippet.thumbnails.high.url 	//Thumbnail
					var d = response.snippet.thumbnails.default.url;
					var id = response.id;

					var listEntry = document.createElement("DIV");
					listEntry.classList.add("listEntry");
					listEntry.dataset.id = id;

					listEntry.innerHTML += `
						<div class="songThumb" style="background-image: url('${d}');">
							<div></div>
						</div>
						<div class="playlistName">
							<span>${a}</span>
						</div>
						<span class='entryDuration'>${b + " videos"}</span>
						<div class="actions">
							<div class="outBottomLeft">
								<li>Rename</li>
								<li>Options</li>
								<li>Remove</li>
								<li>Open in Youtube</li>
								<li>Download MP3</li>
							</div>
						</div>
					`;

					parent.insertBefore(listEntry, parent.children[1]);

					if (document.getElementById("sidebar").getElementsByClassName("header")[0].getElementsByTagName("SPAN")[0].innerHTML == "PLAYLISTS"){
						createSidebarEntry(d, a, id, true, true);
						// var Cont = document.createElement("DIV");
						// Cont.classList.add("sidebarEntryPlaylist");
						// Cont.dataset.id = id;
						// Cont.title = a;
						// Cont.innerHTML = `
						// 	<div class="miniChannelImage" style="background-image: url('${d}');"></div>
						// 	<div class="miniChannelTitle">${a}</div>
						// 	<div class="checkbox" data-checked="false"></div>
						// `;
						// document.getElementsByClassName("sidebarList")[0].insertBefore(Cont, document.getElementsByClassName("sidebarList")[0].children[0]);
					}
				});
			}
		};
	}

	playlistListListen = parent.addEventListener("click", function(event){
		//l(parent.className);
		if (event.target.parentElement.parentElement.className == "actions"){
			if (event.target.innerHTML == 'Rename'){
				var tempId = event.target.parentElement.parentElement.parentElement.dataset.id;
				var textbox = event.target.parentElement.parentElement.parentElement.getElementsByClassName("playlistName")[0];
				textbox.classList.add("editing");
				textbox.getElementsByTagName("SPAN")[0].contentEditable  = true;
				textbox.getElementsByTagName("SPAN")[0].focus();
				textbox.getElementsByTagName("SPAN")[0].addEventListener("focusout", focusOff);
				preventNav = true;
				var tempVal = textbox.getElementsByTagName("SPAN")[0].innerHTML;

				textbox.getElementsByTagName("SPAN")[0].onkeypress = function(e){
					e.stopPropagation();
					if (e.which == '13'){
						if (textbox.getElementsByTagName("SPAN")[0].innerHTML == ""){
							textbox.getElementsByTagName("SPAN")[0].innerHTML = tempVal;
							//pushMessage(textbox.getElementsByTagName("SPAN")[0].innerHTML);
						}
						else if(textbox.getElementsByTagName("SPAN")[0].innerHTML != tempVal){
							renamePlaylist(tempId, textbox.getElementsByTagName("SPAN")[0].innerHTML);
							//pushMessage(textbox.getElementsByTagName("SPAN")[0].innerHTML);
						}
						textbox.classList.remove("editing");
						textbox.getElementsByTagName("SPAN")[0].contentEditable  = false;
						textbox.getElementsByTagName("SPAN")[0].blur();
						preventNav = false;
						textbox.getElementsByTagName("SPAN")[0].removeEventListener("focusout", focusOff);
					}
				};

				function focusOff(){
					if (textbox.getElementsByTagName("SPAN")[0].innerHTML == ""){
						textbox.getElementsByTagName("SPAN")[0].innerHTML = tempVal;
						//pushMessage(textbox.getElementsByTagName("SPAN")[0].innerHTML);
					}
					else if(textbox.getElementsByTagName("SPAN")[0].innerHTML != tempVal){
						renamePlaylist(tempId, textbox.getElementsByTagName("SPAN")[0].innerHTML);
						//pushMessage(textbox.getElementsByTagName("SPAN")[0].innerHTML);
					}
					textbox.classList.remove("editing");
					textbox.getElementsByTagName("SPAN")[0].contentEditable  = false;
					textbox.getElementsByTagName("SPAN")[0].blur();
					preventNav = false;
					textbox.getElementsByTagName("SPAN")[0].removeEventListener("focusout", focusOff);
				}
			}
			else if (event.target.innerHTML == 'Remove'){
					var tempId = event.target.parentElement.parentElement.parentElement.dataset.id;
					var tempElement = event.target.parentElement.parentElement.parentElement;

							pushDialogBox(
								`Remove "${event.target.parentElement.parentElement.parentElement.getElementsByClassName("playlistName")[0].getElementsByTagName("SPAN")[0].innerHTML}"?`,
								"Are you sure you want to remove this playlist?",
								"Remove",
								"Cancel",
								onConfirm,
								onCancel
							);

							function onConfirm(){
								deletePlaylist(tempId);
								parent.removeChild(tempElement);
								document.getElementsByClassName("sidebarList")[0].removeChild(document.getElementsByClassName("sidebarList")[0].querySelector('div[data-id="'+tempId+'"]'));
							}
							function onCancel(){

							}
			}
			else if (event.target.innerHTML == 'Other'){
				
			}
			else if (event.target.innerHTML == "Open in Youtube"){
				var id = event.target.parentElement.parentElement.parentElement.dataset.id;

				// var textArea = document.createElement("textarea");
				// textArea.value = "https://www.youtube.com/watch?v="+id;
				// document.body.appendChild(textArea);
				// textArea.focus();
				// textArea.select();
				// var successful = document.execCommand('copy');
				// if (successful){
				// 	pushMessage("URL Copied");
				// }
				// document.body.removeChild(textArea);

				window.open("https://www.youtube.com/playlist?list="+id, "_blank");
			}

		}
		else if (event.target.className == "actions"){
			event.target.getElementsByTagName("DIV")[0].style.visibility = "visible";
			//threeDotListen = undefined;
			threeDotListen = event.target.getElementsByTagName("DIV")[0].addEventListener("mouseleave", function(){
				this.style.visibility = "hidden";
			});
		}

		else if (event.target.closest(".listEntry") != null && !preventNav){
			window.location.hash = '/PlaylistList'+ event.target.closest(".listEntry").dataset.id;
		}

		// else if (event.target.parentElement.parentElement.className == "listEntry" && !preventNav){
		// 	window.location.hash = '/PlaylistList'+ event.target.parentElement.parentElement.dataset.id;
		// }
		// else if (event.target.parentElement.className == "listEntry" && !preventNav){
		// 	window.location.hash = '/PlaylistList'+ event.target.parentElement.dataset.id;
		// }
		// else if (event.target.className == "listEntry" && !preventNav){
		// 	window.location.hash = '/PlaylistList'+ event.target.dataset.id;
		// }
	});

	l(responsePlaylist.nextPageToken);

	if (responsePlaylist.nextPageToken != undefined){
		if (exclusive.slice(0,1) == "c"){
			functionToCall = function(id, tok){
				loadChannelPlaylists(id, tok);
			};
			nextToken = responsePlaylist.nextPageToken;
			nextId = exclusive.substring(16);
		}
		else{
			functionToCall = function(id, tok){
				makePlaylistList(tok, id);
			};
			nextToken = responsePlaylist.nextPageToken;
			nextId = exclusive;
		}
		
	}
	else{
		functionToCall = undefined;
		nextToken = undefined;
		nextId = undefined;
	}
}

function loadTracklist(videoId){

	isAlbum(videoId, function(response, titles, times, responseVideo){
		if(response){
			BSplayer.displayedVideos = {};
			BSplayer.displayedIds = [];

			document.getElementById("BigChannelCont").innerHTML = "";
			var tracklistExclusive = document.createElement("DIV");
			tracklistExclusive.id = "tracklistExclusive"+videoId;

			tracklistExclusive.innerHTML = `
				<div class="songList">

				</div>
			`;

			document.getElementById("BigChannelCont").appendChild(tracklistExclusive);

			var parent = document.getElementById("tracklistExclusive"+videoId).getElementsByClassName("songList")[0];
			var video;

			for (x in times){
				var a = toSeconds(times[x]);
				var b = titles[parseInt(x)];
				var c = parseInt(x)+1;
				var d = responseVideo.items[0].snippet.thumbnails.medium.url;
				var e = times[x];

				var songEntry = document.createElement("DIV");
				songEntry.classList.add("songEntry");
				songEntry.dataset.id = responseVideo.items[0].id;
				songEntry.dataset.time = a;

				songEntry.innerHTML = `
					<div class="songThumb" style="background-image: url('${d}');">
						<div></div>
					</div>
					<span class='entryNum'>${c}</span>
					<span class='entryName'>${b}</span>
					<span class='entryDuration'>${e}</span>
					<div class="actions">
						<div class="outBottomLeft">
						</div>
					</div>
				`;

				parent.appendChild(songEntry);

				video = new videoEntry(
					responseVideo.items[0].id,
					responseVideo.items[0].snippet.thumbnails.medium.url,
					responseVideo.items[0].snippet.title,
					responseVideo.items[0].snippet.channelTitle,
					responseVideo.items[0].snippet.channelId,
					convertToSeconds(responseVideo.items[0].contentDetails.duration),
					responseVideo.items[0].snippet.description,
					isVideoAlbum(responseVideo.items[0].snippet.description)
				);

			}

			parent.addEventListener("click", function(event){
				var threeDotListen;

				if (event.target.parentElement.className == "songEntry"){
					if (BSplayer.currentVideo != undefined && event.target.parentElement.dataset.id == BSplayer.currentVideo.id){
						player.seekTo(event.target.parentElement.dataset.time);
					}
					else{
						BSplayer.addToQueue(video);
						if (BSplayer.currentVideo != undefined && event.target.parentElement.dataset.id == BSplayer.currentVideo.id){
							player.seekTo(event.target.parentElement.dataset.time);
						}
					}
				}
				else if (event.target.className == "songEntry"){
					if (BSplayer.currentVideo != undefined && event.target.dataset.id == BSplayer.currentVideo.id){
						player.seekTo(event.target.dataset.time);
					}
					else{
						BSplayer.addToQueue(video);
						if (BSplayer.currentVideo != undefined && event.target.dataset.id == BSplayer.currentVideo.id){
							player.seekTo(event.target.dataset.time);
						}
					}
				}
				else if (event.target.parentElement.className == "songThumb"){
					if (currentlyEditingPlaylistId.length > 0){
						for (x in currentlyEditingPlaylistId){
							addToPlaylist(currentlyEditingPlaylistId[x], [event.target.parentElement.parentElement.dataset.id], function(){
								pushMessage("Success! Song Added");
							});
						}
					}
				}
			});
		}
		else{
		// var request = gapi.client.request({
			// 	'method': 'GET',
			// 	'path': '/youtube/v3/commentThreads',
			// 	'params': {'part': 'snippet,replies', "videoId":videoId}
			// });
			// request.execute(function(responseComments) {
			// 	l(responseComments);
			// });
			pushMessage("No Tracks Found");
		}
	});		
}

function loadStations(){
	BSplayer.displayedVideos = {};
	BSplayer.displayedIds = [];

	document.getElementById("BigChannelCont").innerHTML = "";
	var stationExclusive = document.createElement("DIV");
	stationExclusive.id = "stationExclusive";
	document.getElementById("BigChannelCont").appendChild(stationExclusive);

	stationExclusive.innerHTML = `
		<div class="stationCont">
			<div class="stationContTile">
				<div class="stationTile" style="
					background: linear-gradient(to right, rgba(234, 49, 49, 0.75), rgba(234, 49, 49, 0.25)) 0% 0% / cover, 
					url('https://www.kyivpost.com/wp-content/uploads/2018/05/Jazz-Festival-800x520.jpg') center center;
					background-size: cover;
				">
					<span class="stationName">Jazz</span>
				</div>
			</div>
			<div class="stationContTile">
				<div class="stationTile" style="
					background: linear-gradient(to right, rgba(234, 49, 49, 0.75), rgba(234, 49, 49, 0.25)) 0% 0% / cover, 
					url('https://daily.jstor.org/wp-content/uploads/2015/10/Disco_1050x700.jpg') center center;
					background-size: cover;
				">
					<span class="stationName">Disco</span>
				</div>
			</div>
			<div class="stationContTile">
				<div class="stationTile" style="
					background: linear-gradient(to right, rgba(234, 49, 49, 0.75), rgba(234, 49, 49, 0.25)) 0% 0% / cover, 
					url('https://www.bluesguitarinsider.com/wp-content/uploads/2012/07/b-b-king-box.jpg') center center;
					background-size: cover;
				">
					<span class="stationName">Blues</span>
				</div>
			</div>
			<div class="stationContTile">
				<div class="stationTile" style="
					background: linear-gradient(to right, rgba(234, 49, 49, 0.75), rgba(234, 49, 49, 0.25)) 0% 0% / cover, 
					url('https://cdn.trendhunterstatic.com/thumbs/classical-music.jpeg') center center;
					background-size: cover;
				">
					<span class="stationName">Classical</span>
				</div>
			</div>
			<div class="stationContTile">
				<div class="stationTile" style="
					background: linear-gradient(to right, rgba(234, 49, 49, 0.75), rgba(234, 49, 49, 0.25)) 0% 0% / cover, 
					url('http://reggaereggaechristmas.com/wp-content/uploads/2017/10/bg2-1280x768.jpg') center center;
					background-size: cover;
				">
					<span class="stationName">Reggae</span>
				</div>
			</div>
		</div>
	`;
}

function seedStation(videoId, pageToken){
	BSplayer.displayedPlaylist = [];
	var params = {'part': 'snippet', 'relatedToVideoId':videoId, 'type':'video', 'maxResults':10};

	if (pageToken != undefined){
		params["pageToken"] = pageToken;
	}
	else{
		nextToken = undefined;
		nextId = undefined;
		functionToCall = undefined;
	}
	var request = gapi.client.request({
		'method': 'GET',
		'path': '/youtube/v3/search',
		'params': params
	});
	request.execute(function(responseSearch) {
		var idString = "";
		for (vid in responseSearch.items){
			if ((parseInt(vid)+1) == responseSearch.items.length){
				idString += (responseSearch.items[vid].id.videoId);
				var request = gapi.client.request({
					'method': 'GET',
					'path': '/youtube/v3/videos',
					'params': {'part': 'snippet,contentDetails', 'maxResults':maxResults, "id":idString}
				});
				request.execute(function(responseVideo) {
					
					var offset = document.getElementsByClassName('songEntry').length;
					for (x in responseVideo.items){
						var video = new videoEntry(
							responseVideo.items[x].id,
							responseVideo.items[x].snippet.thumbnails.medium.url,
							responseVideo.items[x].snippet.title,
							responseVideo.items[x].snippet.channelTitle,
							responseVideo.items[x].snippet.channelId,
							convertToSeconds(responseVideo.items[x].contentDetails.duration),
							responseVideo.items[x].snippet.description,
							isVideoAlbum(responseVideo.items[x].snippet.description)
						);
						BSplayer.displayedPlaylist.push(video);
						// if (parseInt(x) == 4){
						// 	break;
						// }
					}
					BSplayer.playAll();

					if (responseSearch.nextPageToken != undefined){
						functionToCall = function(id, tok){
							seedStation(id, tok, exclusiveId, mine);
						};
						nextToken = responseSearch.nextPageToken;
						nextId = playlistID;
					}
					else{
						functionToCall = undefined;
						nextToken = undefined;
						nextId = undefined;
					}
				});
			}
			else {
				l(responseSearch.items);
				idString += (responseSearch.items[vid].id.videoId + ",");
			}	
		}
	});
}

function createSidebarEntry(thumb, title, id, isPlaylist, addBefore){
	var Cont = document.createElement("DIV");
	Cont.dataset.id = id;
	Cont.title = title;
	Cont.innerHTML = `
		<div class="miniChannelImage" style="background-image: url('${thumb}');"></div>
		<div class="miniChannelTitle">${title}</div>
	`;

	if (isPlaylist){
		Cont.classList.add("sidebarEntryPlaylist");
		Cont.innerHTML += `
			<div class="checkbox" data-checked="false"></div>
		`;
	}
	else
		Cont.classList.add("sidebarEntry");

	if (addBefore)
		document.getElementsByClassName("sidebarList")[0].insertBefore(Cont, document.getElementsByClassName("sidebarList")[0].children[0]);
	else
		document.getElementsByClassName("sidebarList")[0].appendChild(Cont);
}
