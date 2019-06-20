import { MakerService } from './marker-service';

export const MapsPlacesService = {

    markerService: MakerService,
    currentFilter: ko.obervable(''),
    places: ko.obervable({}),

    searchPlace: async function (query, location, map) {
        const service = new google.maps.places.PlacesService(map);

        const request = {
            type: query,
            keyword: query,
            radius: 500,
            location: location,
        };

        service.nearbySearch(request, function (results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                return results;
            }
        });
    },

    getPlaces: function () {
        return this.places();
    },

    setPlaces(places, map, infoWindow) {
        if (!places) {
            return;
        }
        this.places(places);
        this.places().forEach(place => {
            this.markerService.createMarker(place, map, infoWindow);
        });
    },

    getFilteredPlaces: function (map) {
        const filteredPlaces = this.places.filter(place => {
            return place.name.toLowerCase().includes(this.currentFilter());
        });
        this.markerService.filterMarkers(this.currentFilter(), map);
        return filteredPlaces;
    },

    setCurrentFilter: function (text) {
        this.currentFilter(text.toLowerCase());
    },
}