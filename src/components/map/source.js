import Tile from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
import TileWMS from 'ol/source/TileWMS'
import Feature from "ol/Feature";
import Point from "ol/geom/Point";


import {Vector} from "ol/layer";
import * as ol from "ol";
import VectorSource from "ol/source/Vector";
import Style from "ol/style/Style";
import Icon from "ol/style/Icon";


const Source = {
  data () {
    return {
      seamap: null,
      mappoint: null,
      seapoint: null,
      eyeview:null
      
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
    getView()
    {
      this.eyeview=new Vector({
        source: new VectorSource()
      })
      let feature = new Feature({
        geometry: new Point([104, 30])
      });
      feature.setStyle(new Style({
        image: new Icon({
          src: 'angle.png',

        }),

      }));
      this.eyeview.getSource().addFeature(feature)

    },
    getSource() {
      this.getSeamap()
      this.getMappoint()
      this.getSeapoint()
      this.getView()

    }
  }
}

export default Source
