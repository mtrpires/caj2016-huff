// JavaScript Document
var inHome = true;
var mapData;
var markers;
var markersByType;
var map;
var customMarkers;
var customMarkerPath = 'M0-19.2c-3.8,0-6.9,3.1-6.9,6.9C-6.9-7.9-0.4-0.4,0,0c0,0,6.9-7.9,6.9-12.4C6.9-16.2,3.8-19.2,0-19.2z';
var colors = ['#EB614C', '#FEBD3B', '#0BBD9E', '#7B0043', '#000000'];
var currColor = 0;
var logoAnimTimeout;
var markerInterval;
var markerNum=0;
var selectedTypes = ['Homofobia', 'Lesbofobia', 'Transfobia', 'Bifobia'];
var mapLoaded =false;
var clickedIndex;

function initMap() {
    var options = {
      center: new google.maps.LatLng(-23.5276039, -46.7406564),
      zoom: 5,
      styles: mapStyle,
      mapTypeControl: false,
      streetViewControl: false
    };
    map = new google.maps.Map(document.getElementById("map"), options);
    google.maps.event.addListener(map,'tilesloaded',function(){
        if(!mapLoaded){
            $('#btStart').delay(200).fadeIn(400);
            $('#preloader').fadeOut(200);
            mapLoaded=true;
        }
    });
}

function addMarkers(){

    var i = markerNum;

    if(markerNum >= mapData.length){ 
        clearInterval(markerInterval);
        return;
    }

    //for(var i=0; i<mapData.length;i++){
    var coords = new google.maps.LatLng(mapData[i].latitude,mapData[i].longitude);
    var newMarker = new google.maps.Marker({
        position: coords,
        map: map,
        icon: customMarkers[mapData[i].tipo],
        title: mapData[i].tipo
    });

    if(selectedTypes.indexOf(mapData[i].tipo) > -1){
        newMarker.setVisible(true);
    }else{
        newMarker.setVisible(false);
    }

    if(!markersByType[mapData[i].tipo]){
        markersByType[mapData[i].tipo] = [];
    }
    markersByType[mapData[i].tipo].push(newMarker);
    markers[i] = newMarker;
    markerNum++;

    if(markerNum >= mapData.length){ clearInterval(markerInterval); }

    newMarker.addListener('click', function() {
        clickedIndex = markers.indexOf(newMarker);
        setTimeout(showInfo, 1000);

        map.setZoom(11);
        map.setCenter(newMarker.getPosition());
    });

    
    //}
}

function loadData(){
    d3.tsv('assets/data/mapdata.tsv', function(data){
        //console.log(data);
        mapData = data;
        initMap();
    });
}

function animateLogo(){
    
    if(inHome){
        $('#logobg').css({fill: colors[currColor], transition: "2.0s"});
        logoAnimTimeout = setTimeout(animateLogo, 2200);       
    }else{
        clearTimeout(logoAnimTimeout);
        $('#logobg').css({fill: colors[colors.length-1], transition: "0.2s"});
    }

    currColor++;
    if(currColor > colors.length-1){ currColor = 0 }
}

function legendaClick(event){
    event.preventDefault();
    
    var markerList;
    var type = $(this).find('span').html();
    var typeIndex = selectedTypes.indexOf(type);

    //console.log(type);
    markerList = markersByType[type];

    if(typeIndex == -1){
        selectedTypes.push(type);
        $(this).addClass('selected');

        for(var i=0; i<markerList.length;i++){
            markerList[i].setVisible(true);
        }
    }else{
        selectedTypes.splice(typeIndex,1);
        $(this).removeClass('selected');

        for(var i=0; i<markerList.length;i++){
            markerList[i].setVisible(false);
        }
    }
}

function showInfo(){
    var selectedData = mapData[clickedIndex];
    var quem = '';

    $('#details h4').html(selectedData.tipo);
    $('#details p.where').html("<b>Onde:</b> "+selectedData.cidade.toUpperCase());
    $('#details p.violence').html("<b>O que:</b> "+selectedData.forma.toUpperCase());

    $('#details p.when').html("<b>Quando:</b> "+selectedData.data_ocorrencia.toUpperCase());
    $('#details p.description').html("<b>Relato:</b><br/>&quot;"+selectedData.descricao+"&quot;");

    if(selectedData.homofobia_quem != ''){
        quem = selectedData.homofobia_quem;
    }else if(selectedData.lesbofobia_quem != ''){
        quem = selectedData.lesbofobia_quem;
    }else if(selectedData.transfobia_quem != ''){
        quem = selectedData.transfobia_quem;
    }

    if(quem != '' && quem != undefined){
        $('#details p.who').html( "<b>Contra quem:</b> " + quem );
        $('#details p.who').show();
    }else{
        $('#details p.who').hide();
    }

    $('#details').addClass('open');
}

function initForm(){
    $('#formBt').bind('click', function(){
        $('#formLayer').fadeIn(400);
    });

    $('#btFormClose').bind('click', function(){
        $('#formLayer').fadeOut(400);
    });
}

$(document).ready(function(){
    markersByType = {};
    markers = [];

    // quando na home, mudar a cor do logo
    logoAnimTimeout = setTimeout(animateLogo, 2200);
    loadData();

        // botao Entrar
    $('#btStart').bind('click', function(event){
        event.preventDefault();

        $('header').animate({top: '-200px'}, 500);
        $('header').fadeOut(500, function(){
            $('#btStart').hide();
            $('header').addClass('onTop');
            $('header').css({top: '30px'});
            $('header').fadeIn(100);
        });
        inHome = false;
        $('.mapBox').delay(300).fadeIn(500, function(){
            markerInterval = setInterval(addMarkers, 20);
        });
    });

    $('#details .backBt').bind('click', function(event){
        event.preventDefault();
       $('#details').removeClass('open');
       map.setZoom(5);
    });

    // seleção de marcadores visíveis
    $('#legenda li').bind('click', legendaClick);

    initForm();

});



// estilos do mapa
var marker1 = {
    path: customMarkerPath,
    fillColor: '#EB614C',
    fillOpacity: 1,
    scale: 1,
    strokeColor: '#ffffff',
    strokeWeight: 0.7
};
var marker2 = {
    path: customMarkerPath,
    fillColor: '#FEBD3B',
    fillOpacity: 1,
    scale: 1,
    strokeColor: '#ffffff',
    strokeWeight: 0.7
};
var marker3 = {
    path: customMarkerPath,
    fillColor: '#0BBD9E',
    fillOpacity: 1,
    scale: 1,
    strokeColor: '#ffffff',
    strokeWeight: 0.7
};
var marker4 = {
    path: customMarkerPath,
    fillColor: '#7B0043',
    fillOpacity: 1,
    scale: 1,
    strokeColor: '#ffffff',
    strokeWeight: 0.7
};
customMarkers = {   'Homofobia':marker1,
                    'Lesbofobia':marker2,
                    'Transfobia':marker3,
                    'Bifobia':marker4}
var mapStyle = [
    {
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "saturation": 36
            },
            {
                "color": "#333333"
            },
            {
                "lightness": 40
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#ffffff"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#fefefe"
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#cccccc"
            },
            {
                "lightness": 10
            },
            {
                "weight": 1.2
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
            {
                "lightness": 20
            },
            {
                "color": "#ececec"
            }
        ]
    },
    {
        "featureType": "landscape.man_made",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#f0f0ef"
            }
        ]
    },
    {
        "featureType": "landscape.man_made",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#f0f0ef"
            }
        ]
    },
    {
        "featureType": "landscape.man_made",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#d4d4d4"
            }
        ]
    },
    {
        "featureType": "landscape.natural",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#ececec"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#dedede"
            },
            {
                "lightness": 21
            }
        ]
    },
    {
        "featureType": "poi.place_of_worship",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "poi.school",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "off"
            },
            {
                "lightness": 21
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "lightness": 17
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "lightness": 29
            },
            {
                "weight": 0.2
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#dedede"
            },
            {
                "lightness": 18
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f2f2f2"
            },
            {
                "lightness": 19
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#a0d6d1"
            },
            {
                "lightness": 17
            }
        ]
    }
]