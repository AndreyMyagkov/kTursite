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
        gap: '20px',
        breakpoints: {
            768: {
                perPage: 2,
                pagination: false
            },
            480: {
                perPage: 1,
                pagination: true,
                arrows: false
            },
        }
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
        gap: '20px',
        breakpoints: {
            1024: {
                perPage: 3,
                pagination: false
            },
            767: {
                perPage: 2,
                pagination: true,
                arrows: false
            },
            480: {
                perPage: 1,
                pagination: true,
                arrows: false
            },
        }
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
        gap: '20px',
        breakpoints: {
            767: {
                perPage: 2,
                pagination: true,
                arrows: false
            },
            480: {
                perPage: 1,
                pagination: true,
                arrows: false
            },
        }
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
        padding: '200',
        breakpoints: {
            767: {
                perPage: 2,
                pagination: true,
                arrows: false,
                padding: 0,
            },
            650: {
                perPage: 1,
                pagination: true,
                arrows: false
            },
        }
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
        breakpoints: {
            900: {
                perPage: 2,
                pagination: true,
                arrows: false
            },
            650: {
                perPage: 1,
                pagination: true,
                arrows: false
            },
        }
        
    }).mount();
})

/**
 * Cluster Map
 */

function initClusterMap() {

    const map = new google.maps.Map(document.querySelector(".js-claster-map"), {
        zoom: 6,
        center: {
            // ????????????
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

    // ????????????????, ???????? ????????
    const infoWindow = new google.maps.InfoWindow();

    // ?????????????????? ????????????????
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

        // ???????? ???? ??????????????
        marker.addListener("click", () => {
            // ?????????????? ???????????????? ????????
            infoWindow.close();
            infoWindow.setContent(`<a href="${item.href}">${marker.getTitle()}</a>`);
            infoWindow.open(marker.getMap(), marker);

            // ?????????????? ?????????????? ???? ????????????
            //document.location.href = item.href;
        });
        return marker;
    });

    // ???????????????????? ?????????? ???? ????????????????
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
