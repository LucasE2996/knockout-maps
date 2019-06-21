const myLatLgn = { lat: -23.6020717, lng: -46.6763941 };
const FS_API_KEY = '';

let MY_MAP;
let infoWindow;
let MY_MAP_SERVICE;

function initMap() {
    MY_MAP = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: myLatLgn,
    });

    infoWindow = new google.maps.InfoWindow;
    getVenues();
}

function getVenues() {
    $.ajax({
        method: 'GET',
        url: `https://api.foursquare.com/v2/venues/explore?client_id=SX1MDAJDOUGKGXC2TDCQCJR4AYYIV5GV2V1KXMWVER5FWNVS&client_secret=KRG35QI0HEINWGGJ2DB1APS032IZJTJ0G5X0H3HLG330YYS3&v=20180323&limit=10&ll=-23.6020717, -46.6763941&query=restaurant`,
        success: function(response) {
            const places = response.response.groups[0].items.map(item => {
                PlacesService.formatPlace(item);
            });
            PlacesService.setPlaces(places);
        },
        error: function(e) {
            console.log(e);
        },
    })
}

const MarkerService = {
    // self: this,

    markers: [],

    getMarkers: function() {
        return this.markers;
    },

    filterMarkers: function(text, map) {
        this.markers.forEach(marker => {
            marker.getTitle().toLowerCase().includes(text.toLowerCase())
                ? marker.setMap(map)
                : marker.setMap(null);
        });
    },

    createMarker: function(place, map) {
        const infoWindowContent = this.newInfoWindowContent(place.name, place.icon, place.vicinity);
        let marker;

        marker = new google.maps.Marker({
            position: place.position,
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

        this.markers.push(marker);
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

const PlacesService = {

    markerService: MarkerService,
    currentFilter: '',
    places: [],

    getPlaces: function () {
        return this.places;
    },

    setPlaces(places, map) {
        if (!places) {
            return;
        }
        this.places = places;
        this.places.forEach(place => {
            this.markerService.createMarker(place, map);
        });
    },

    getFilteredPlaces: function (map) {
        const filteredPlaces = this.places.filter(place => {
            return place.name.toLowerCase().includes(this.currentFilter);
        });
        this.markerService.filterMarkers(this.currentFilter, map);
        return filteredPlaces;
    },

    setCurrentFilter: function (text) {
        this.currentFilter(text.toLowerCase());
    },

    formatPlace: function(item) {
        return {
            id: item.venue.id,
            name: item.venue.name,
            address: item.venue.location.address,
            position: {
                lat: item.venue.location.lat,
                lng: item.venue.location.lng,
            },
        };
    }
}

class ViewModel {

    constructor() {
        this.placesService = PlacesService;
        this.places = ko.observableArray([]);

        this.init();
    }

    init() {
        this.placesService.searchPlace('restaurante', myLatLgn, MY_MAP).then((places) => {
            this.placesService.setPlaces(places, MY_MAP, infoWindow);
            this.places(this.placesService.getPlaces());
        });
    }
}

// ko.applyBindings(new ViewModel());
