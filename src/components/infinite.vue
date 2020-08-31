<template>
  <div id="maindiv">
    <Buoy v-for="(item) in buoys " :key="item.name" :id="item.name" ></Buoy>
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
    <script id="surfvertex1" type="x-shader/x-vertex">
        uniform float time;
        out vec2 texcoord;
        void main(){
            texcoord=uv;
            float x = position.x;
            float y = position.y;
            float PI = 3.141592653589;

            float sx = 0.0;
            float sy = 0.0;
            float sz = 0.0;

            float ti = 0.0;
            float index = 1.0;
            vec2 dir;
            for(int i = 0;i<3;i++){
                ti = ti + 0.25;
                index +=1.0;
                if(mod(index,2.0)==0.0){
                    dir = vec2(1.0,ti);
                }else{
                    dir = vec2(-1.0,ti);
                }
                float l1 = 2.0 * PI / (5.0 + ti);
                float s1 = 20.0 * 2.0 / l1;
                float x1 = 0.1 * dir.x * sin(dot(normalize(dir),vec2(x,y)) * l1 + time * s1);
                float y1 = 0.1 * dir.y * sin(dot(normalize(dir),vec2(x,y)) * l1 + time * s1);
                float z1 = 1.0 * sin(dot(normalize(dir),vec2(x,y)) * l1 + time * s1);
                sx +=x1;
                sy +=y1;
                sz +=z1;
            }
            sx = x + sx;
            sy = y + sy;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(x,y,sin(sz)*0.25 ,1.0);
        }
    </script>
    <script id="surffragment" type="x-shader/x-fragment">
      in vec2 texcoord;
      uniform sampler2D tex;
      uniform float time;
      void main()
      {
        vec2 coord=vec2(fract(texcoord.x+time*0.0005f),fract(texcoord.y+time*0.0005f));
        gl_FragColor = vec4(texture(tex,coord).xyz,0.5);
      }
    </script>
    <script id="surffragment1" type="x-shader/x-fragment">
      in vec2 texcoord;
      uniform sampler2D tex;
      void main(){
            gl_FragColor = vec4(texture(tex,texcoord).xyz,0.5);
        }
    </script>
    <script id="groundvertex" type="x-shader/x-vertex">
      uniform sampler2D height;
      out vec2 texcoord;
      out float seaheight;
      out vec3 wpos;
      void main()
      {
        vec4 worldpos=modelMatrix * vec4( position, 1.0 );
        seaheight=texture(height,uv).x;
        worldpos=vec4(worldpos.x,worldpos.y+seaheight*10.0f,worldpos.zw);
        wpos=vec3(worldpos.x,worldpos.y,worldpos.z);
        gl_Position = projectionMatrix * viewMatrix * worldpos;
        texcoord=uv;
      }
    </script>
    <script id="groundfragment" type="x-shader/x-fragment">
      in vec2 texcoord;
      uniform sampler2D tex;
      uniform float time;
      void main()
      {
        gl_FragColor = vec4(texture(tex,texcoord).xyz,1.0);
      }
  </script>
    <script id="groundfragment1" type="x-shader/x-fragment">
      in vec2 texcoord;
      in float seaheight;
      in vec3 wpos;
      uniform sampler2D tex;
      uniform float time;
      void main()
      {
        float dis=length(wpos-cameraPosition)/30.0;
        if(dis>1.0f)
        {
          dis=1.0f;
        }
        gl_FragColor = vec4(texture(tex,texcoord).xyz*seaheight*10.0f,1.0)*(1.0-dis)+dis*vec4(0.596,0.961,1.0,1.0);
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
  name: 'infinite',
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
      labelRenderer:null,
      surfmat:null,
      groundmat:null,
      count:0.0,
      buoys:[{name:"test",pos:{x:0.0,y:1.0,z:0.0}},{name:"test1",pos:{x:2.0,y:0.0,z:-2.0}},{name:"test2",pos:{x:2.0,y:0.0,z:4.0}}],
      worldpos:{x:0.0,y:0.0}
    }
  },
  methods: {
    init: function () {
      let container = document.getElementById('three')
      this.camera = new Three.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.01, 30)
      this.camera.position.z = 20
      //this.camera.position.y=10;
      //this.camera.rotation.x=-3.14/12;
      this.scene = new Three.Scene()
      this.loader=new Three.TextureLoader()
      this.generateground()
      this.generateseacube()
      this.generatesurface()
      //this.scene.background = new Three.CubeTextureLoader().setPath("skybox/").load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png', ])

      this.renderer = new Three.WebGLRenderer({antialias: true})
      this.renderer.setClearColor(0x98F5FF)
      this.renderer.sortObjects=false
      this.renderer.setSize(container.clientWidth, container.clientHeight)
      //this.renderer.setCullFace()
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

      this.count+=0.001;
      for(var i=0;i<this.buoys.length;i++)
      {
        let buoy=document.getElementById(this.buoys[i].name)

        buoy.style.opacity=1-(this.camera.position.z-this.buoys[i].pos.z)/15

      }
      this.surfmat.uniforms.time.value=this.count;
      this.renderer.render(this.scene, this.camera)

      this.labelRenderer.render(this.scene,this.camera)
    },

    generateseacube()
    {

      let geometry = new Three.BoxGeometry(50, 10, 50)
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
        side:Three.DoubleSide
        //depthWrite:false
      })
      this.mesh = new Three.Mesh(geometry, material)
      this.scene.add(this.mesh)
      /*let buoyDiv = document.getElementById("css2d");
      buoyDiv.style.marginTop = '-1em';
      let buoyLabel = new CSS2DObject( buoyDiv );
      buoyLabel.position.set( 0, 0, 0 );
      this.mesh.add( buoyLabel );*/
      for(var i=0;i<this.buoys.length;i++)
      {
        this.generatebouy(this.buoys[i].pos,this.buoys[i].name)
      }
    },
    generatebouy(pos,name)
    {


      let buoyDiv = document.getElementById(name)

      buoyDiv.style.marginTop = '-1em';
      let buoyLabel = new CSS2DObject( buoyDiv );
      buoyLabel.position.set( pos.x, pos.y, pos.z );
      this.mesh.add( buoyLabel );
    },
    generateground()

    {
      let geometry=new Three.PlaneGeometry(50,50,100,100)
      let texture=this.loader.load("ground1.jpg")
      let heighttex=this.loader.load("im1.png")

      this.groundmat=new Three.ShaderMaterial({
            uniforms:{
              tex:{value:texture},
              height:{value:heighttex},
              time:{value:this.count}
            },
            vertexShader: document.getElementById( 'groundvertex' ).textContent,
            fragmentShader: document.getElementById( 'groundfragment1' ).textContent,
          }
      )
      let mesh=new Three.Mesh(geometry,this.groundmat)
      mesh.position.y=-5
      mesh.rotation.x=-3.1415/2;
      this.scene.add(mesh)
      let geometry1=new Three.BoxGeometry(50,2,50);
      let material1=new Three.MeshBasicMaterial({map:texture})
      let mesh1=new Three.Mesh(geometry1,material1)
      mesh1.position.y=-6

      this.scene.add(mesh1)
    },
    generatesurface()
    {
      let texture=this.loader.load("sea.jpg")

      this.surfmat=new Three.ShaderMaterial({
            uniforms:{
              tex:{value:texture},
              time:{value:0.0}

            },
            vertexShader: document.getElementById( 'surfvertex1' ).textContent,
            fragmentShader: document.getElementById( 'surffragment1' ).textContent,
            blending:Three.CustomBlending,
            side:Three.DoubleSide,
            depthTest:false
          }
      )
      let geometry=new Three.PlaneGeometry(50.0,50.0,100,20)




      let mesh=new Three.Mesh(geometry,this.surfmat)
      mesh.rotation.x=-3.1415/2;
      mesh.position.y=5.0



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
#css2d{
  opacity: 1.0;
}
</style>
