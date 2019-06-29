
var channelID = "UCbq8Mfm4TrH_ux7z6VqQhhw";		//Youtube Channel ID to be loaded

var playbackBarInt;								//Global Interval variable for Playback TimeBar updating
var loopInt;	
var time;

var player;										//Global Youtube IFrame object

class videoEntry {								//Class for storing info of videos that are availible for selection
	constructor(Id, Thumb, Title, Chan, ChanId, Dur, Desc, Album){
		this.id = Id;							//Youtube video ID
		this.thumbnail = Thumb;					//Youtube Thumbnail URL (Medium 320px*180px version)
		this.title = Title;						//Actual video title
		this.channel = Chan;					//Channel to which the video belongs
		this.channelId = ChanId;					//Channel to which the video belongs
		this.duration = Dur;					//The viewing length of the video (in seconds)
		this.description = Desc;					//The viewing length of the video (in seconds)
		this.album = Album;
	}
} 

function NewXML(url, func){
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
 
function makeQueueEntry(vidName){
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
	DOM.Queue.List.appendChild(cont);
}

function makePlaylistQueueEntry(vidName){
	var cont = document.createElement("DIV");
	cont.classList.add("queueEntry");
	cont.id = QueueEntryCounter;
	cont.innerHTML = `
		<div class="queueEntryName">
			<span>${vidName}</span>
		</div>
	`;
	QueueEntryCounter += 1;
	DOM.Queue.PlayList.appendChild(cont);
}

var selectedPlaylists = [];
//var selectedSongs = [];
function handlePlaylistEdit(id, type){
	l("MIDDLE CLICK HANDLED");
	if (type == "playlist" && !selectedPlaylists.includes(id)){
		selectedPlaylists.push(id);
	}
	else if (type == "playlist" && selectedPlaylists.includes(id)){
		selectedPlaylists.slice(selectedPlaylists.indexOf(id), 1);
	}
	else if (type == "song"){
		for (x in selectedPlaylists){
			var idArray = [id];
			addToPlaylist(selectedPlaylists[x], idArray);
		}
	}
}
var timeout1;
var isDone = true;

function pushMessage(text){
	toast = document.getElementById('toast1');

	if (!isDone){
		window.clearTimeout(timeout1);
		toast.classList.add('noTransition');
		toast.style.marginLeft = "100%";
		var flush = toast.offsetHeight;
		toast.classList.remove('noTransition');
		toast.style.marginLeft = "0%";

		toast.getElementsByClassName('toastText')[0].innerHTML = text;
		timeout1 = window.setTimeout(function(){
			toast.style.marginLeft = "100%";
			window.setTimeout(function(){
				isDone = true;
			}, 1000);
		}, 3000);
	}
	else{
		toast.getElementsByClassName('toastText')[0].innerHTML = text;
		toast.style.marginLeft = "0%";
		isDone = false;
		window.clearTimeout(timeout1);
		timeout1 = window.setTimeout(function(){
			toast.style.marginLeft = "100%";
			window.setTimeout(function(){
				isDone = true;
			}, 1000);
		}, 3000);
	}
}

function pushDialogBox(title, subtitle, button1Text, button2Text, button1Action, button2Action){
	l("dialog box pushed");
	openDialog();

	DOM.Dialog.Title.innerHTML = title;
	DOM.Dialog.Subtitle.innerHTML = subtitle;
	DOM.Dialog.RightButton.innerHTML = button1Text;
	DOM.Dialog.LeftButton.innerHTML = button2Text;

	DOM.Dialog.RightButton.addEventListener("click", action1);
	DOM.Dialog.LeftButton.addEventListener("click", action2);

	function action1(){
		button1Action();
		closeDialog();
		l("Action 1 Confirmed");
	}
	function action2(){
		if (button2Action != undefined){
			button2Action();
		}
		closeDialog();
		l("Action 2 Confirmed");
	}

	function closeDialog(){
		l("close dialog");
		DOM.Dialog.All.style.visibility = "hidden";
		DOM.Dialog.RightButton.removeEventListener("click", action1);
		DOM.Dialog.LeftButton.removeEventListener("click", action2);
	}
	function openDialog(){
		l("open dialog");
		DOM.Dialog.All.style.visibility = "visible";
	}

}

function get_stamps(description) {
	let desc = description.split("\n");
	let stamps = [];
	for (var i = 0; i < desc.length; i++) {
		let temp = desc[i].match(/(\d+:)?\d+:\d+/);
		if (temp != null)
			stamps.push(temp[0]);
	}
	//let stamps = description.match(/(\d+:)?\d+:\d+/g);
	if (stamps != null){return stamps;}
	else {return undefined;}
	// for(let i=0; i<stamps.length; i++) {
	// 	stamps[i] = "<button onclick='player.seekTo("+toSeconds(stamps[i])+")'>"+stamps[i]+"</button>";
	// }
	//return stamps;
}

function toSeconds(time) {
	time = time.split(":");
	let s = 0;
	for(let i=time.length-1; i>=0; i--) {
		s += parseInt(time[i])*(60**(time.length-i-1));
	}
	return s;
}

function get_names(description) {
	let names = description.match(/.*(\d+:)?\d+:\d+.*/g);
	let result = [];
	if (names != null){
		for(let i=0; i<names.length; i++) {
			// remove timestamps
			let name = names[i].replace(/\(?(\d+:)?\d+:\d+\)?/gi,"").trim();
			// get rid of leading track nums
			name = name.replace(/^[\d.-]+/gi,"").trim();
			result[i] = name;
		}
		return result;
	}
	else {return undefined;}
	
}

// function get_names(description) {
// 	let names = description.match(/.*(\d+:)?\d+:\d+.*/g);
// 	let result = [];
// 	if(names != null){
// 		for(let i=0; i<names.length; i++) {
// 			if (names[i].match(/[A-Za-z|&'",/!# -]{2,}/i) != null) {
// 				result[i] = names[i].match(/[A-Za-z|&'",/!# -]{2,}/i)[0].trim();
// 			}
// 			else{
// 				result[i] = names[i];
// 			}
// 		}
// 		return result;
// 	}
// 	else {return undefined;}
// }

function isAlbum(videoId, callback){
	var request = gapi.client.request({
		'method': 'GET',
		'path': '/youtube/v3/videos',
		'params': {'part': 'snippet,contentDetails', "id":videoId}
	});
	request.execute(function(responseVideo) {
		var times = get_stamps(responseVideo.items[0].snippet.description);
		var titles = get_names(responseVideo.items[0].snippet.description);
		if (titles != undefined && times != undefined) {
			callback(true, titles, times, responseVideo);
		}
		else {
			callback(false);
		}
	});
}

function isVideoAlbum(desc){
	var times = get_stamps(desc);
	var titles = get_names(desc);
	if (titles != undefined && times != undefined) {
		return [titles, times];
	}
	else {
		return false;
	}
}