<template>
  <div id="map" class="map"></div>
</template>
<script>
import 'ol/ol.css'
import SeaMapInstance from './map/map'
import Source from './map/source'
import Ships from './map/ship'

export default {
  name: 'SeaMap',
  components: {
  },
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
  }
}
</script>
<style>
  .map {
    width: 1900px;
    height: 1080px;
  }
</style>
