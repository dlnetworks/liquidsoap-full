var map;
var infowindow;

function update_radios(div)
{
    var div = document.getElementById(div);

    var latlng = new google.maps.LatLng(48.86, 2.33);
    var options = {
        zoom: 1,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        streetViewControl: false,
        mapTypeControl: false
    };
    infowindow = new google.maps.InfoWindow({disableAutoPan: true, content: "Content..."});
    map = new google.maps.Map(document.getElementById('map'), options);

    $.getJSON(
        "http://savonet.rastageeks.org/liqflows.py?fmt=json&cmd=radios",
        function(radios){
            if (radios.length == 0)
            {
                div.innerHTML = "<b>No registered radio is currently broadcasting!</b>";
                return;
            }
            content = "";
            content += "<ul>\n";
            line = '<li><div class="radio"><a href="WEBSITE" target="_blank">NAME</a> <span class="streams">[STREAMS]</span></div><div class="genre">GENRE</div><div class="description">DESCRIPTION</div><div class="metadata">METADATA</div></li>';
            for (i=0; i < radios.length; i++)
            {
                r = radios[i];
                l = line;
                l = l.replace("NAME",r.name);
                l = l.replace("WEBSITE",r.website);
                l = l.replace("DESCRIPTION",r.description);
                l = l.replace("GENRE",r.genre);
                metadata = "";
                if (r.artist != null)
                {
                    metadata += r.artist;
                    metadata += " ";
                    if (r.title != null)
                        metadata += "&mdash; ";
                }
                if (r.title != null)
                    metadata += '<span class="title">'+r.title+'</span>';
                l = l.replace("METADATA",metadata);
                streams = "";
                for (j = 0; j < r.streams.length; j++)
                {
                    s = r.streams[j];
                    if (j != 0)
                        streams += " &ndash; ";
                    streams += '<a href="'+s.url+'">'+s.format+'</a>'
                }
                l = l.replace("STREAMS",streams);
                content += l + "\n";
                if ((r.latitude != null) && (r.longitude != null))
                {
                    marker = new google.maps.Marker({
			position: new google.maps.LatLng(r.latitude, r.longitude),
			map: map,
			title: r.name
		    });
                    google.maps.event.addListener(marker, 'click', function(){
                        infowindow.setContent(this.title);
                        infowindow.open(map, this);
                    });
                }
            }
            content += "</ul>\n";
            div.innerHTML = content;
        }
    );
}