new Vue({
    el: '#app',
    data: {
        id: 0,
        lon: 0,
        lat: 0,
        icon: '',
        iconColor: '',
        error: '',
        selectedCoords: {}
    },
    methods: {
        initialize() {
            let id = this.id
            mapboxgl.accessToken = 'pk.eyJ1Ijoidmxhbml0eWRpciIsImEiOiJja2Jkbzc1d3AwZG1yMnZxZTFlbGwwZWliIn0.PvHgeJqx1cp1RXw9ATNUHg'
            
            let map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/vlanitydir/ckbdn0ttk2ckr1imb7usq3s8f',
                center: [lon, lat],
                zoom: 15
            })
            map.on('load', function() {
                var el = document.createElement('div')
                el.className = `marker marker-${iconColor}`

                el.style.backgroundImage = `url(../public/images/icons/${icon})`
                
                let marker = new mapboxgl.Marker(el).setLngLat([lon, lat]).addTo(map)
                
            })
        }
    },
    mounted() {
        this.initialize()
    }
})