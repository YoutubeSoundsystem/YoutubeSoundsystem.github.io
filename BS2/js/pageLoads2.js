
// function makeAPIcall(params) {
// 	return results;
// }

// makeAPIcall(
// 	{
// 		'Method'	: 'GET',
// 		'Path'		: 'subscriptions',
// 		'Params'	: {
// 			'Part'		: 'snippet',
// 			'Mine'		: 'true',
// 			'maxResults': maxResults
// 		}
// 	},
// 	true
// );

// function init

// var actions
// 	function delete
// 	function openInYoutube
// 	function seedStation
// 	function saveToPlaylist
// 	function options

// function generatePlaylists
// 	var mine
// 	var availibleOptions
// 	function makeShell
// 	function makeEntry

// function generateSongs
// 	var mine
// 	var availibleOptions
// 	function makeShell
// 	function makeEntry

// function generateChannels
// 	var mine
// 	var availibleOptions
// 	function makeShell
// 	function makeEntry

// function generateSearch
// 	function makeShell
// 	function makeEntry

// function constructSonglist

// 	make requests
// 	setup object
// 	setup listeners
// 	function createElements

// 	function updateDOM
// 		function updateVideoCount
// 		function updateName
// 		function songs
		

var SongList = {
	'playlistID' : 'Uownj08rno4n9fn',
	'playlistThumbUrl' : 'www.utube.com/thumb107.png',
	'playlistName' : 'BF4 OST',
	'videoCount' : 34,
	'mine' : true,
	'songs' : {
		{
			'index':0,
			'playlistItemId' : 'UDMJGHR84JFU',
			videoEntry :{
				id
				thumbnail
				title
				channelname
				channelid
				duration
				description
				album :{
					trackEntry :{
						name
						starttime
						endtime
					},
					trackEntry,
					trackEntry
				}
			}
		},
		{
			'index':1,
			'playlistItemId' : 'UDMJGHR84JFU',
			videoEntry
		},
		{
			'index':2,
			'playlistItemId' : 'UDMJGHR84JFU',
			videoEntry
		}
	},
	'options' : {
		'overall': {
			{
				'actionName' : 'Play All',
				'actionCode' : '0',
				'action' : function playAll,
				'mineonly' : false
			}
		}
		'songSpecific' : {
			{
				'actionName' : "Open in Youtube",
				'actionCode' : '1',
				'action' : function openInYoutube,
				'mineonly' : true
			},
			{
				'actionName' : 'Remove',
				'actionCode' : '2',
				'action' : function remove,
				'mineonly' : true
			}
		}
	}
};

SongList functions

function 