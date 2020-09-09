<template>
  <div>

  <div>
    <infinite ></infinite>

  </div>


  </div>
</template>

<script>


import tdview from "@/components/tdview";
import Infinite from "@/components/infinite";
import SeaMap from "./components/SeaMap";
export default {
  name: 'App',
  components: {

    Infinite,


  },
  data(){
    return{
      showcube:true
    }
  },
  mounted() {
    console.log("hello")
  }

}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

</style>
