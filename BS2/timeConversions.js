function convertTime(input) {

        var reptms = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
        var hours = 0, minutes = 0, seconds = 0, totalseconds;
        var final = "";
        var formatHours = "", formatMinutes = "", formatSeconds = "";

        if (reptms.test(input)) {
            var matches = reptms.exec(input);
            if (matches[1]) hours = Number(matches[1]);
            if (matches[2]) minutes = Number(matches[2]);
            if (matches[3]) seconds = Number(matches[3]);
            totalseconds = hours * 3600  + minutes * 60 + seconds;

        	formatHours = hours;
        	formatMinutes = minutes;

        	if (seconds < 10){ formatSeconds = "0"+seconds;}
        	else if (seconds == 0) {formatSeconds = "00";}
        	else{ formatSeconds = seconds; }

        	if (formatHours != 0 && formatMinutes == 0){
        		final = formatHours+":00:"+formatSeconds;
        	}
        	else{
        		final = formatMinutes+":"+formatSeconds;
        	}
        }

        return (final);
}

function convertToSeconds(input) {

        var reptms = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
        var hours = 0, minutes = 0, seconds = 0, totalseconds;

        if (reptms.test(input)) {
            var matches = reptms.exec(input);
            if (matches[1]) hours = Number(matches[1]);
            if (matches[2]) minutes = Number(matches[2]);
            if (matches[3]) seconds = Number(matches[3]);
            totalseconds = hours * 3600  + minutes * 60 + seconds;
        }

        return (totalseconds);
}

function convertToDuration(seconds){

	var hours, minutes, seconds;
	var hourString = "", minuteString = "", secomdString = "";
	var returnString;
	hours = Math.trunc(seconds/3600);
	minutes = Math.trunc((seconds%3600)/60);
	seconds = Math.trunc((seconds%3600)%60);

	if (seconds < 10){ secomdString = "0"+seconds; }
	else { secomdString = ""+seconds; }

	if (minutes < 10 && hours > 0){ minuteString = "0"+minutes; }
	else { minuteString = minutes; }

	if (hours == 0){
		return (minuteString+":"+secomdString);
	}
	else if (isNaN(seconds)){
		return ("0:00");
	}
	else{
		return (hourString+":"+minuteString+":"+secomdString);
	}
}