window.onload = getStreamables();

function getStreamables() {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			var response = JSON.parse(xhttp.responseText);
			var streamables = [];
			for (var i = 0; i < response.data.children.length; i++) {
				if (response.data.children[i].data.domain == "streamable.com") {
					streamables.push({title: response.data.children[i].data.title, url: response.data.children[i].data.url});
				}
			}
			doSomething(streamables);
		}
	};
	xhttp.open("GET", "https://www.reddit.com/r/soccer/new/.json", true);
	xhttp.send();
}

function doSomething (l) {
	var row = document.createElement("div");
	row.className = "row";
	for (var i = 0; i < l.length; i++) {
		var shortcode = l[i].url.split("/")[3]; //explode "https://streamable.com/moo"
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				var response = JSON.parse(xhttp.responseText);
				var video_src = "https://" + response.files.mp4.url;
				var col = buildColumn(video_src, l[i].title);
				row.appendChild(col);
				if (((i-1) % 2 == 0 && i != 0) || (i + 1 == l.length)) {
					document.getElementById("c").appendChild(row);
					row = document.createElement("div");
					row.className = "row";
				}
				if (i + 1 == l.length) {
					document.getElementById("spinner").remove();
				}
			}
		};
		xhttp.open("GET", "https://api.streamable.com/videos/" + shortcode, false);
		xhttp.send();
	}
}

function buildColumn(video_src, video_title) {
	var col = document.createElement("div");
	col.className = "col s6";
	var title = document.createElement("h6");
	title.innerHTML = video_title + " <a href=\"" + video_src + "\">&#128279;</a>";
	var video_cont = document.createElement("div");
	video_cont.className = "video-container";
	var video = document.createElement("video");
	video.className = "responsive-video";
	video.setAttribute("controls", "true");
	var source = document.createElement("source");
	source.setAttribute("src", video_src);
	source.setAttribute("video", "video/mp4");
	video.appendChild(source);
	video_cont.appendChild(video);
	col.appendChild(title);
	col.appendChild(video_cont);
	return col;
}