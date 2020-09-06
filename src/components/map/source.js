import Tile from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
import TileWMS from 'ol/source/TileWMS'

const Source = {
  data () {
    return {
      seamap: null,
      mappoint: null,
      seapoint: null,
      
    }
  },
  created() {
    this.getSource()
  },
  mounted() {

  },
  methods: {
    getSeamap() {
      this.seamap = new Tile({
        source: new XYZ({
          url : "http://112.126.96.159/Ship/Map?z={z}&y={y}&x={x}",
          projection : 'EPSG:3857'
        })
      })
    },
    getMappoint() {
      this.mappoint = new Tile({
        source: new TileWMS({
          url : "http://gis.chinaports.com/geoserver/gwc/service/wms",
          params : {
            'LAYERS' : 'greennodes:ship_pos',
            'TILED' : true,
            'VERSION' : '1.1.1'
          },
          serverType : 'geoserver',
          hidpi : false,// 固定width,height
          maxZoom : 11,
        }),
        minResolution: 60,
        zIndex: 1
      })
    },
    getSeapoint() {
      this.seapoint = new Tile({
        source: new XYZ({
          url : "http://112.126.96.159/Ship/point/{z}/{y}/{x}.png",
          projection : 'EPSG:3857',
          maxZoom: 10
        }),
        minResolution: 60,
        zIndex: 1
      })
    },
    getSource() {
      this.getSeamap()
      this.getMappoint()
      this.getSeapoint()
    }
  }
}

export default Source
