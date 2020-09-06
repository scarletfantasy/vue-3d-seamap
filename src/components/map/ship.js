import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Style from 'ol/style/Style'
// import Text from 'ol/style/Text'
// import Fill from 'ol/style/Fill'
// import Stroke from 'ol/style/Stroke'
import Icon from 'ol/style/Icon'
import * as olProj from 'ol/proj'

import * as VM14 from '../utils/vm14'

const Ships = {
  data() {
    return {
      map: null,
      maptype: 1,
      vectorLayer: null,
      lt: [ 0, 0 ],
      rb: [ 0, 0 ],
      center: [ 0, 0 ],
      start: false,
      textmap: {
        "resolution" : 0,
        "text" : []
      },
    }
  },
  methods: {
    showclock() {
      this.textmap.text = []
      this.getship(this.lt, this.rb)
    },

    getshipdata(lefttop, rightbottom) {
      var lefttoplat, rightbottomlat
      if (this.maptype==1) {
        lefttoplat = lefttop[1] + 0.25
        rightbottomlat = rightbottom[1] + 0.25
      }else{
        lefttoplat = lefttop[1]
        rightbottomlat = rightbottom[1]
      }
    
      var sinature = VM14.sinaTure(lefttop[0])
    
      var url = "http://www.sailxy.com/Shipdata?lb_lon=" + (lefttop[0]).toString()
        + "&lb_lat=" + rightbottomlat + "&rt_lon=" + rightbottom[0]
        + "&rt_lat=" + (lefttoplat).toString()+"&sinature="+sinature
      this.$http.post(url).then((res)=>{
        this.showShip(this.getshipgeojson(res.body))
      }, ()=>{
        alert('getshipdata failure')
      })
    },

    getshipgeojson(shipdata) {
      // var timestamp = Date.parse(new Date()) / 1000
      var gesonboject = []
      if (shipdata != "") {
        var ships = shipdata.split('||')
        for (var i = 0; i < ships.length; i++) {
          var shipais = ships[i].split('@')
          if (shipais.length >= 17) {
            var coordinaete
    
            if(this.maptype==1){
              coordinaete = olProj.transform([parseFloat(shipais[18]),
                                              parseFloat(shipais[19])], 'EPSG:4326', 'EPSG:3857')}
            else{
              coordinaete = olProj.transform([parseFloat(shipais[2]),
                                              parseFloat(shipais[3])], 'EPSG:4326', 'EPSG:3857')}                                    
    
              var course = parseInt(shipais[4]) / 1800 * 3.14
              var speed = parseFloat(shipais[6]) / 10
              if (!isNaN(coordinaete[0]) && !isNaN(coordinaete[1])
                  && !isNaN(course) && !isNaN(speed)) {
                var shipjson = new Feature({
                  geometry : new Point(coordinaete),
                  'type' : 'ship',
                  'mmsi' : shipais[1],
                  'name' : shipais[11] == '' ? shipais[1] : shipais[11],
                  "course" : course,
                  'head' : shipais[5],
                  'speed' : speed,
                  'imo' : shipais[9],
                  'status' : shipais[7],
                  'length' : shipais[13],
                  'width' : shipais[14],
                  'callsign' : shipais[10],
                  'draft' : shipais[17],
                  'destnation' : shipais[16],
                  'lasttime' : shipais[8],
                  'eta' : shipais[15],
                  'shiptype' : shipais[12],
                  'lon' : shipais[2],
                  'lat' : shipais[3],
                  'aistype' : shipais[0],
                  'id' : i,
                })
              gesonboject.push(shipjson)
            }
          }
        }
      }
      console.log(gesonboject)
      return gesonboject
    },

    showShip(geojsonObject) {
      this.map.removeLayer(this.vectorLayer)
      // var funGetxy = this.getxy
      // var varTextmap = this.textmap
      var style = new Style({
        image : new Icon({
          src :  'http://www.sailxy.com/images/anchor1.png'
        })
      })
      this.vectorLayer = new VectorLayer({ // 初始化矢量图层
        source : new VectorSource({
          features : geojsonObject
        }),
        style : style
        // style : function(feature, resolution) {
        //   var offsetX = funGetxy(feature, resolution, varTextmap)
        //   var style
        //   if (offsetX) {
        //     style = new Style({
        //       text : new Text({
        //         text : resolution < 30 ? feature.get('name') : '',
        //         font : '600 14px Calibri',
    
        //         fill : new Fill({
        //           color : '#333'// #00008B #000080
        //         }),
        //         backgroundStroke : new Stroke({
        //           color : '#00008B'// #00008B #000080
        //         }), 
        //         padding : [1, 2, 0, 2],
        //         offsetX : 15,
        //         textAlign : 'left'
        //       }),
        //       image : new Icon({
        //         rotation :feature.get('head')==511?feature.get('course') :feature.get('head')/180*3.14,
        //         src : feature.get('speed') > 3 ? '/assets/ship.png'
        //             : '/assets/anchor1.png'
        //       })
        //     })
        //   } else {
        //     style = new Style({
        //       image : new Icon({
        //         rotation : feature.get('course'),
        //         src : feature.get('speed') > 3 ? '/assets/ship.png'
        //             : '/assets/anchor1.png'
        //       })
        //     })
        //   }
        //   return [ style ]
        // }
      })
    
      this.map.addLayer(this.vectorLayer)
      console.log(this.map.getLayerGroup().getLayers())
      console.log('showship end')
      this.start = false
    },

    getxy(feature, resolution, textarray) {
      var re = true
      if (resolution > 20) {
        return false
      }
      if (resolution < 5) {
        return true
      }
      var distance = 400
      if (resolution < 10 && resolution > 9) {
        distance = 200
      }

      if (textarray.resolution != resolution) {
        textarray.text = []
        textarray.resolution = resolution
      }

      var textposition = textarray.text
      var position = feature.getGeometry().getCoordinates()
      var isexsit = false
      for (var i = 0; i < textposition.length; i++) {
        if (feature.get("id") == textposition[i].id) {
          isexsit = true
          continue
        }
        if ((Math.abs(position[0] - textposition[i].position[0]) + Math
            .abs(position[1] - textposition[i].position[1])) < distance) {
          re = false
          break
        }
      }
      if (isexsit == false) {
        textarray.text.push({
          "position" : position,
          "id" : feature.get("id")
        })
      }
      return re
    },

    getship(lt, rb) {
      console.log('getship')
      if (isNaN(rb[0]) || isNaN(rb[1]) || isNaN(lt[0]) || isNaN(lt[0])) {
        rb = olProj.toLonLat(this.map.getCoordinateFromPixel(this.map.getSize()),"EPSG:3857");
        lt = olProj.toLonLat(this.map.getCoordinateFromPixel([ 0, 0 ]), "EPSG:3857");
      }
      this.getshipdata(lt, rb)
    },
  }
}

export default Ships
