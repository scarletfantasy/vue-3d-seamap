<template>
  <div>
  <div id="map" class="map"></div>
  <div id="anchor"><img src="angle.png" alt="示例锚点"/></div>

  </div>
</template>
<script>
import 'ol/ol.css'
import SeaMapInstance from './map/map'
import Source from './map/source'
import Ships from './map/ship'
import * as olProj from "ol/proj";
import Overlay from "ol/Overlay";

export default {
  name: 'SeaMap',
  components: {
  },
  props:["rotatey","worldpos"],
  mixins: [
    SeaMapInstance, Source, Ships
  ],
  data () {
    return {
      anchor:null,
      box:null
    }
  },
  created () {

  },
  mounted () {
    console.log('mount')

    console.log(this.map)
    /*this.box = new Overlay({
      element: document.getElementById('box')
    });
    this.box.setPosition(olProj.transform([ 119.22, 39.222 ], 'EPSG:4326',
            'EPSG:3857'));
    // 然后添加到map上
    this.map.addOverlay(this.box);*/
    this.anchor = new Overlay({
      element: document.getElementById('anchor')
    });
    this.anchor.setPosition(olProj.transform([ 119.22, 39.222 ], 'EPSG:4326',
            'EPSG:3857'));
    // 然后添加到map上
    this.map.addOverlay(this.anchor);

  },
  methods: {
  },
  watch:{'rotatey':function (val)
    {
      let anchor=document.getElementById("anchor")
      if(this.rotatey)
      {
        let s='rotate('+(-60+this.rotatey*180/3.14)+'deg)'

        anchor.style.transform=s

      }

    },
    'worldpos.x':function(val)
    {

      this.anchor.setPosition(olProj.transform([ this.worldpos.x, this.worldpos.y ], 'EPSG:4326',
          'EPSG:3857'));
    },
    'worldpos.y':function(val)
    {

      this.anchor.setPosition(olProj.transform([ this.worldpos.x, this.worldpos.y ], 'EPSG:4326',
          'EPSG:3857'));
    }
  }
}
</script>
<style>
  .map {
    width: 400px;
    height: 400px;

  }
  #anchor{
    transform:rotate(-60deg);
    transform-origin: 5px 40px;


  }
  #box{
    border:1px dashed #F00;
    width:40px;
    height:40px;
    transform: translate(-50%, 0);
  }
</style>
