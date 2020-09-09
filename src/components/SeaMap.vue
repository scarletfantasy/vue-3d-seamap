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
    }
  },
  created () {
    
  },
  mounted () {
    console.log('mount')

    console.log(this.map)
  },
  methods: {
  },
  watch:{'rotatey':function (val)
    {
      let anchor=document.getElementById("anchor")
      if(this.rotatey)
      {
        let s='rotate('+(-60+this.rotatey*180/3.14)+'deg)'
        console.log(this.rotatey*180/3.14)
        anchor.style.transform=s

      }

    },
    'worldpos.x':function(val)
    {
      console.log(this.worldpos)
      this.anchor.setPosition(olProj.transform([ this.worldpos.x, this.worldpos.y ], 'EPSG:4326',
          'EPSG:3857'));
    },
    'worldpos.y':function(val)
    {
      console.log(this.worldpos)
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
</style>
