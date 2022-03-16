/**
 * Hero slider
 */
document.querySelectorAll('.js-slider-hero').forEach(item => {
    new Splide(item, {
        type: 'loop',
        pagination: false,
        perPage: 1,
    }).mount();
})

/**
 * Group slider
 */
document.querySelectorAll('.js-slider-group').forEach(item => {
    new Splide(item, {
        type: 'loop',
        perPage: 3,
        pagination: false,
        gap: '20px'
    }).mount();
})

/**
 * Teaser slider
 */
document.querySelectorAll('.js-slider-teaser').forEach(item => {
    new Splide(item, {
        type: 'loop',
        perPage: 4,
        pagination: false,
        gap: '20px'
    }).mount();
})

/**
 * News slider
 */
document.querySelectorAll('.js-slider-news').forEach(item => {
    new Splide(item, {
        type: 'loop',
        perPage: 3,
        pagination: false,
        gap: '20px'
    }).mount();
})

/**
 * Gallery slider
 */
document.querySelectorAll('.js-slider-gallery').forEach(item => {
    new Splide(item, {
        type: 'loop',
        perPage: 2,
        pagination: false,
        gap: '20px',
        focus: 'center',
        padding: '200'
    }).mount();
})

/**
 * Gallery slider
 */
document.querySelectorAll('.js-slider-blog').forEach(item => {
    new Splide(item, {
        type: 'loop',
        perPage: 3,
        pagination: false,
        gap: '20px',
        
    }).mount();
})

/**
 * Cluster Map
 */

function initClusterMap() {

    const map = new google.maps.Map(document.querySelector(".js-claster-map"), {
        zoom: 6,
        center: {
            // Берлин
            lat: 52.518,
            lng: 13.375
        },
        //disableDefaultUI: true,
        scrollwheel: true,
        disableDoubleClickZoom: false,
        draggable: true,
        keyboardShortcuts: true,
        mapTypeControl: false,
        zoomControl: true,
        scaleControl: true,
    });

    // Инфоокно, если надо
    const infoWindow = new google.maps.InfoWindow();

    // Обработка маркеров
    const markers = clusterData.map((item, i) => {

        const marker = new google.maps.Marker({
            position: {
                lat: item.lat,
                lng: item.lng,
            },
            label: (i + 1) + '',
            title: item.title,
            // icon:  {
            //     url: "/template/img/markers/marker.png",
            //     scaledSize: new google.maps.Size(32, 40),
            // }
        });

        // Клик по маркеру
        marker.addListener("click", () => {
            // Вариант открытие окна
            infoWindow.close();
            infoWindow.setContent(`<a href="${item.href}">${marker.getTitle()}</a>`);
            infoWindow.open(marker.getMap(), marker);

            // Вариант Переход по ссылке
            //document.location.href = item.href;
        });
        return marker;
    });

    // Центрируем карту по маркерам
    const bounds = new google.maps.LatLngBounds();
    markers.forEach((_, i) => bounds.extend(markers[i].getPosition()))
    map.fitBounds(bounds);

    google.maps.event.addListenerOnce(map, 'bounds_changed', function (event) {
        this.setZoom(map.getZoom() - 1);

        if (this.getZoom() > 17) {
            this.setZoom(17);
        }
    });

    // Add a marker clusterer to manage the markers.
    new MarkerClusterer(map, markers, {
        imagePath: "/template/img/markers/m",
    });
}
