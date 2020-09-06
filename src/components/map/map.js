import {ZoomSlider, Zoom} from 'ol/control'
import Map from 'ol/Map'
import View from 'ol/View'
import * as olProj from 'ol/proj'

const SeaMapInstance= {
  data () {
    return {
      map: null,
      view: null,
      viewheight: 0.173,
      viewwidth: 0.445,
      trailbegin: false,
      vectorshow: false,
      showtimer: null
    }
  },
  mounted() {
    this.getMapInstance()
  },
  methods: {
    getMapInstance() {
      var zoomslider = new ZoomSlider()
      var zoomcontrol = new Zoom()

      this.map = new Map({
        layers: [ this.seamap ],
          view: new View({
            center: olProj.transform([ 119.22, 39.222 ], 'EPSG:4326',
              'EPSG:3857'),
            projection: 'EPSG:3857',
            zoom: 5,
            minZoom: 2,
            maxZoom: 18,
          }),
        target: 'map',
        controls: [ zoomslider, zoomcontrol ]
      })
      this.view = this.map.getView()

      this.map.on('moveend', this.movemap)
    },
    movemap() {
      this.textmap.text = []

      var zoom = this.view.getZoom()
      console.log(zoom)
      if (this.trailbegin) {
        // historyzoom()
        return
      }
      if (zoom >= 12) {
        var centernew = olProj.toLonLat(this.view.getCenter(), "EPSG:3857")
        var rbnew = olProj.toLonLat(this.map.getCoordinateFromPixel(this.map.getSize()), "EPSG:3857")
        var ltnew = olProj.toLonLat(this.map.getCoordinateFromPixel([ 0, 0 ]), "EPSG:3857")
        if (ltnew[0] < this.lt[0] || ltnew[1] > this.lt[1] || rbnew[0] > this.rb[0]
            || rbnew[1] < this.rb[1] || this.vectorshow == false) {
          this.vectorshow = true;

          this.lt[0] = centernew[0] - this.viewwidth
          this.lt[1] = centernew[1] + this.viewheight
          this.rb[0] = centernew[0] + this.viewwidth
          this.rb[1] = centernew[1] - this.viewheight
          this.getship(this.lt, this.rb)
          // clearInterval(this.showtimer)
          // this.showtimer = setInterval("showclock()", 60000)
        }
      }
    }
  }
}

export default SeaMapInstance


