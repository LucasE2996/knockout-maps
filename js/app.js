function initMap() {
    const myLatLgn = { lat: -23.6020717, lng: -46.6763941 };

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: myLatLgn,
    });

    
}
