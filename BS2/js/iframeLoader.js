function onYouTubeIframeAPIReady() {
	player = new YT.Player('player', {			//Youtube Player Initialization 
		height: '390',
		width: '640',
		videoId: '', //Random video ID
		// playerVars: {
  //           controls: 0,
  //           disablekb: 1,
  //           fs: 0,
  //           iv_load_policy: 3,
  //           modestbranding: 1,
  //           rel: 0,
  //           showinfo: 0

  //       },
		events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange,	//Enables Event Listner for video state changes (ended, etc.) 
			'onError': onPlayerError
		}
	});
	// PlayerIn = true;
	// if (SignedIn == true){
	// 	startHashHandling();
	// }
	window.addEventListener("load", function(event) {
		player.unMute(); 
		// window.frames[0].document.getElementsByClassName("ytp-large-play-button")[0].remove();
		// window.frames[0].document.getElementsByClassName("ytp-watermark")[0].remove();
	});
}

function onPlayerReady(event){			//Event Listender for when a video is finished playing
	PlayerIn = true;
	if (SignedIn == true){
		startHashHandling();
	}
}

function onPlayerError(event){
	// if(event.data == 2){
	// 	pushMessage("Whoops! There was a problem on our end");
	// }
	if(event.data == 100){
		pushMessage("Video cannot be found...");
	}
	else if(event.data == 101){
		pushMessage("That video cannot be played on this site");
	}
	// else{
	// 	pushMessage("There was a problem loading that video");
	// }
}