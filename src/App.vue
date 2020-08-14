<template>
  <div>
  <buoy id="css2d">

  </buoy>

  <div id="three"></div>
  <script id="seavertex" type="x-shader/x-vertex">
      void main()
      {
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }
  </script>
  <script id="seafragment" type="x-shader/x-fragment">
      uniform vec3 color;
      void main()
      {
        gl_FragColor = vec4(color,0.5);
      }
  </script>
    <script id="surfvertex" type="x-shader/x-vertex">
      out vec2 texcoord;
      void main()
      {
        texcoord=uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }
  </script>
    <script id="surffragment" type="x-shader/x-fragment">
      in vec2 texcoord;
      uniform sampler2D tex;
      void main()
      {
        gl_FragColor = vec4(texture(tex,texcoord).xyz,0.5);
      }
  </script>
    <script id="groundvertex" type="x-shader/x-vertex">
      uniform sampler2D height;
      out vec2 texcoord;
      void main()
      {
        vec4 worldpos=modelMatrix * vec4( position, 1.0 );
        worldpos=vec4(worldpos.x,worldpos.y+texture(height,uv).x*4.0f,worldpos.zw);
        gl_Position = projectionMatrix * viewMatrix * worldpos;
        texcoord=uv;
      }
  </script>
    <script id="groundfragment" type="x-shader/x-fragment">
      in vec2 texcoord;
      uniform sampler2D tex;
      void main()
      {
        gl_FragColor = vec4(texture(tex,texcoord).xyz,1.0);
      }
  </script>

  </div>
</template>

<script>

import * as Three from 'three';
import {CSS2DRenderer,CSS2DObject} from 'three-css2drender'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Buoy from "@/components/buoy";
export default {
  name: 'App',
  components: {
    Buoy

  },
  data () {
    return {
      camera: null,
      scene: null,
      renderer: null,
      mesh: null,
      loader:null,
      labelRenderer:null
    }
  },
  methods: {
    init: function () {
      let container = document.getElementById('three')
      this.camera = new Three.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.01, 30)
      this.camera.position.z = 20
      this.camera.position.y=10;
      this.camera.rotation.x=-3.14/12;
      this.scene = new Three.Scene()
      this.loader=new Three.TextureLoader()






      this.generateground()
      this.generatesurface()
      this.generateseacube()

      //this.scene.background = new Three.CubeTextureLoader().setPath("skybox/").load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png', ])

      this.renderer = new Three.WebGLRenderer({antialias: true})
      this.renderer.setClearColor(0xffffff)
      this.renderer.sortObjects=false
      this.renderer.setSize(container.clientWidth, container.clientHeight)
      container.appendChild(this.renderer.domElement)
      this.labelRenderer = new CSS2DRenderer();
      this.labelRenderer.setSize( container.clientWidth, container.clientHeight);
      this.labelRenderer.domElement.style.position = 'absolute';
      this.labelRenderer.domElement.style.top = '0px';
      container.appendChild(this.labelRenderer.domElement)

      let controls = new OrbitControls( this.camera, this.labelRenderer.domElement );
      controls.minDistance = 5;
      controls.maxDistance = 100;

    },
    animate: function () {
      requestAnimationFrame(this.animate)

      this.renderer.render(this.scene, this.camera)
      this.labelRenderer.render(this.scene,this.camera)
    },

    generateseacube()
    {
      let geometry = new Three.BoxGeometry(10, 10, 10)
      let material = new Three.ShaderMaterial({
        uniforms: {
          color: { value: new Three.Color( 0x98F5FF ) }
        },
        vertexShader: document.getElementById( 'seavertex' ).textContent,
        fragmentShader: document.getElementById( 'seafragment' ).textContent,
        extensions:{
          fragDepth:true,
        },
        blending:Three.CustomBlending,

        //depthWrite:false
      })
      this.mesh = new Three.Mesh(geometry, material)
      this.scene.add(this.mesh)
      let buoyDiv = document.getElementById("css2d");
      //buoyDiv.className = 'label';
      //buoyDiv.textContent = 'buoy';
      buoyDiv.style.marginTop = '-1em';
      let buoyLabel = new CSS2DObject( buoyDiv );
      buoyLabel.position.set( 0, 2, 0 );
      this.mesh.add( buoyLabel );
    },
    generateground()
    {
      let geometry=new Three.PlaneGeometry(10,10,10,10)
      let texture=this.loader.load("ground.jpg")
      let heighttex=this.loader.load("mountain.png")

      let material=new Three.ShaderMaterial({
        uniforms:{
          tex:{value:texture},
          height:{value:heighttex}
        },
        vertexShader: document.getElementById( 'groundvertex' ).textContent,
        fragmentShader: document.getElementById( 'groundfragment' ).textContent,
          }
      )
      let mesh=new Three.Mesh(geometry,material)
      mesh.position.y=-5
      mesh.rotation.x=-3.1415/2;
      this.scene.add(mesh)
      let geometry1=new Three.BoxGeometry(10,2,10);
      let material1=new Three.MeshBasicMaterial({map:texture})
      let mesh1=new Three.Mesh(geometry1,material1)
      mesh1.position.y=-6

      this.scene.add(mesh1)
    },
    generatesurface()
    {
      let texture=this.loader.load("sea.jpg")

      let material=new Three.ShaderMaterial({
            uniforms:{
              tex:{value:texture},

            },
            vertexShader: document.getElementById( 'surfvertex' ).textContent,
            fragmentShader: document.getElementById( 'surffragment' ).textContent,
            blending:Three.CustomBlending,
            side:Three.DoubleSide
          }
      )
      let geometry=new Three.PlaneGeometry(10,10,10,10)




      let mesh=new Three.Mesh(geometry,material)
      mesh.rotation.x=-3.1415/2;
      mesh.position.y=5.1



      this.scene.add(mesh)
    }

  },
  mounted () {
    this.init()
    this.animate()
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
#three{
  width: 800px;
  height: 600px;
}
</style>
