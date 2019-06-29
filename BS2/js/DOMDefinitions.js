var DOM = {};

DOM.Playback = {
	Parent 				: document.getElementById("playback"),
	Thumbnail 			: document.getElementsByClassName("thumbPic")[0],
	Title 				: document.getElementsByClassName("playbackTitle")[0],
	Subtitle 			: document.getElementsByClassName("playbackSubtext")[0],
	TracklistToggle			: document.getElementsByClassName("tracklistToggle")[0],
	DescToggle			: document.getElementsByClassName("descToggle")[0],
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
	Controls			: document.getElementsByClassName("playbackSubSubCont")[0],
	ThreeDot			: document.getElementById("playback").getElementsByClassName("actions")[0],
	Controls			: document.getElementsByClassName("playbackSubSubCont")[0],
	Desc				: document.getElementsByClassName("descCont")[0],
	Svg					: document.getElementById("albumSVG")
};
DOM.Queue = {
	Parent 				: document.getElementById("queue"),
	List 				: document.getElementById("BigQueueCont").getElementsByClassName("queueList")[0],
	Clear 				: document.getElementById("clearMiniButton"),
	PlayList 			: document.getElementById("BigPlaylistQueueCont").getElementsByClassName("queueList")[0],
	Shuffle				: document.getElementById("shuffleMiniButton"),
	ClearPlaylist		: document.getElementById("clearPlaylistMiniButton"),
	Loop				: document.getElementById("loopMiniButton")
};
DOM.Sidebar = {
	Parent 				: document.getElementById("sidebar"),
	BigContainer		: document.getElementById("BigSidebarCont"),
	Header				: document.getElementsByClassName("header")[0],
	DropDown0			: document.getElementById("sidebar").getElementsByClassName("header")[0].getElementsByTagName("LI")[0],
	DropDown1			: document.getElementById("sidebar").getElementsByClassName("header")[0].getElementsByTagName("LI")[1],
	DropDown2			: document.getElementById("sidebar").getElementsByClassName("header")[0].getElementsByTagName("LI")[2]
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
DOM.Dialog = {
	All 				: document.getElementsByClassName("dialogBack")[0],
	Box					: document.getElementsByClassName("dialogBox")[0],
	Title 				: document.getElementsByClassName("dialogTitle")[0],
	Subtitle			: document.getElementsByClassName("dialogSubTitle")[0],
	RightButton			: document.getElementsByClassName("dialogButton")[0],
	LeftButton			: document.getElementsByClassName("dialogButton")[1]
};