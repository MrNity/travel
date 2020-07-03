new Vue({
    el: '#app',
    data: {
        lon: 0,
        lat: 0,
        error: '',
        selectedCoords: {}
    },
    methods: {
        initialize() {
            navigator.geolocation.getCurrentPosition((position) => {
                this.lon = position.coords.longitude
                this.lat = position.coords.latitude
                this.drawMap()
            }, () => {
                alert('Ошибка получения геопозиции! Невозможно загрузить карту.')
                this.error = 'Ошибка получения геопозиции! Невозможно загрузить карту.'
            })
        },
        drawMap() {
            let lon = this.lon
            let lat = this.lat
            
            mapboxgl.accessToken = 'pk.eyJ1Ijoidmxhbml0eWRpciIsImEiOiJja2Jkbzc1d3AwZG1yMnZxZTFlbGwwZWliIn0.PvHgeJqx1cp1RXw9ATNUHg'
            
            let map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/vlanitydir/ckbdn0ttk2ckr1imb7usq3s8f',
                center: [lon, lat],
                zoom: 15
            })
            map.on('load', function() {
                
                var el = document.createElement('div')
                el.className = `marker marker-blue marker-here`

                el.style.backgroundImage = `url(../public/images/icons/marker.svg)`
                
                let popup = new mapboxgl.Popup({offset: 35})
                
                el.addEventListener('mouseenter', function() {
                    popup.setLngLat([lon, lat]).setHTML('Вы здесь!').addTo(map)
                })
                el.addEventListener('mouseleave', function() {
                    popup.remove()
                })
                
                let marker = new mapboxgl.Marker(el).setLngLat([lon, lat]).addTo(map)
                
                axios.get(`https://176.124.3.93:6568/points`).then(res => {
                    let data = res.data
                    let features = []
                    
                    data.forEach(el => {
                        let imgs = ''
                        if (el.files.length != 0) {
                            imgs = `<p><img src="../public/images/${el.files[0]}" alt="${el.title}" width="200" height="150" style="object-fit: cover;"></p>`
                        }
                        features.push({
                            'type': 'Feature',
                            'properties': {
                                'description': `<h3>${el.title}</h3><p style="overflow: hidden;
	text-overflow: ellipsis; white-space: nowrap;">${el.description}</p>${imgs}`,
                                'icon': el.icon,
                                'link': `/place/${el.id}`,
                                'iconColor': el.iconColor
                            },
                            'geometry': {
                                'type': 'Point',
                                'coordinates': [el.coords.lng, el.coords.lat]
                            }
                        })
                    })
                    
                    var geojson = {
                        'type': 'FeatureCollection',
                        features
                    }
                    
                    let popups = new mapboxgl.Popup({offset: 15})
                    
                    geojson.features.forEach(function(marker) {
                        var el = document.createElement('div')
                        el.className = `marker marker-${marker.properties.iconColor}`
                        
                        el.style.backgroundImage = `url(../public/images/icons/${marker.properties.icon})`

                        el.addEventListener('click', function() {
                            var link = marker.properties.link
                            window.open(link)
                        })

                        el.addEventListener('mouseenter', function() {
                            var coordinates = marker.geometry.coordinates.slice()
                            var description = marker.properties.description

                            popups.setLngLat(coordinates).setHTML(description).addTo(map)
                        })
                        el.addEventListener('mouseleave', function() {
                            popups.remove()
                        })

                        new mapboxgl.Marker(el)
                            .setLngLat(marker.geometry.coordinates)
                            .addTo(map)
                    })
                })
            })
            map.on('click', function(e) {
                this.selectedCoords = JSON.stringify(e.lngLat.wrap())
                console.log(this.selectedCoords)
            })
        }
    },
    mounted() {
        this.initialize()
    }
})