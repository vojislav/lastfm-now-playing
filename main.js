// get your own last.fm api key from https://www.last.fm/api/account/create
const LASTFM_API_KEY = "d74f9fdb9c79a50ffac2ca0700892ca1"
const username = "vojoh" // change username here
const url = "https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&format=json&extended=true&api_key=" + LASTFM_API_KEY + "&limit=1&user=" + username

// make API call
function httpGet(url) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, false);
	xmlHttp.send(null);
	return xmlHttp.responseText;
}

// converts unix time to relative time text (eg. 2 hours ago)
function relativeTime(time, time_text) {
    var time_now = Math.round(Date.now() / 1000)
    var time_diff = time_now - time

    let SEC_IN_MIN = 60
    let SEC_IN_HOUR = SEC_IN_MIN * 60
    let SEC_IN_DAY = SEC_IN_HOUR * 24

    if (time_diff < SEC_IN_HOUR) {
        let minutes = Math.round(time_diff / SEC_IN_MIN)
        return minutes + " minute" +
            ((minutes != 1) ? "s" : "") + " ago"
    }
    if (time_diff >= SEC_IN_HOUR && time_diff < SEC_IN_DAY) {
        let hours = Math.round(time_diff / SEC_IN_HOUR)
        return hours + " hour" +
            ((hours != 1) ? "s" : "") + " ago"
    }
    if (time_diff >= SEC_IN_DAY)
        return time_text
}

var json = JSON.parse(httpGet(url));
var last_track = json.recenttracks.track[0]
var track = last_track.name
var trackLink = last_track.url
var artist = last_track.artist.name
let relative_time = null
if (last_track.date) {
    var unix_date = last_track.date.uts
    var date_text = last_track.date["#text"]
    relative_time = relativeTime(unix_date, date_text)
}
var now_playing = (last_track["@attr"] == undefined) ? false : true
var imageLink = last_track.image[1]["#text"]
var loved = last_track.loved == "1"

trackElem = document.getElementById('track')
artistElem = document.getElementById('artist')
dateElem = document.getElementById('date')
nowplayingElem = document.getElementById('now-playing')
albumcoverElem = document.getElementById('album-cover')

trackLinkElem = document.createElement('a')
trackLinkElem.id = "track"
trackLinkElem.href = trackLink
trackLinkElem.target = "_blank"
trackLinkElem.textContent = track

heartSpan = document.createElement('span')
heartSpan.id = 'heart'
heartSpan.textContent = loved ? "❤️" : ""

userLinkElem = document.createElement('a')
userLinkElem.href = "https://www.last.fm/user/" + username
userLinkElem.target = "_blank"
userLinkElem.textContent = (relative_time != null) ? relative_time : "Now playing..."

trackElem.appendChild(trackLinkElem)
trackElem.appendChild(heartSpan)
artistElem.textContent = artist
dateElem.appendChild(userLinkElem)
albumcoverElem.src = imageLink

console.log(
    "Artist: " + artist + "\n" +
    "Track: " + track + "\n" +
    "Date: " + relative_time + "\n" +
    "Now playing: " + now_playing + "\n" +
    "Loved: " + loved)
