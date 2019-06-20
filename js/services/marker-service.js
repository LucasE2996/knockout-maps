export const MarkerService = {
    // self: this,

    markers: ko.observableArray([]),

    getMarkers: function() {
        return this.markers();
    },

    filterMarkers: function(text, map) {
        this.markers().forEach(marker => {
            marker.getTitle().toLowerCase().includes(text.toLowerCase())
                ? marker.setMap(map)
                : marker.setMap(null);
        });
    },

    createMarker: function(place, map, infoWindow) {
        const infoWindowContent = this.newInfoWindowContent(place.name, place.icon, place.vicinity);
        let marker;

        marker = new google.maps.Marker({
            position: place.geometry.location,
            map: map,
            title: place.name,
            animation: google.maps.Animation.DROP,
        });

        marker.addListener('click', markerClickEvent);

        function markerClickEvent() {
            infoWindow.setContent(infoWindowContent);
            infoWindow.open(map, marker);
            marker.setAnimation(google.maps.Animation.BOUNCE);

            setTimeout(() => {
                marker.setAnimation(null);
            }, 1000);
        }

        this.markers().push(marker);
    },

    newInfoWindowContent: function(title, icon, address) {
        return `
          <div id="content">
            <div id="siteNotice><img href="${icon}"></img></div>
            <h3 style="font-size:1.2rem;">${title}</h3>
          <div id="bodyContent">
            <p>${address}</p>
          </div>
          </div>
        `;
    },
}