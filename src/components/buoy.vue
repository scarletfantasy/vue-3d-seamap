<template>
  <div >
    <Button shape="circle" type="primary" icon="ios-pin" @click="test" ghost></Button>
    <Card v-show="visi" >
      <div id="chart" style="width: 600px;height: 400px;"></div>
    </Card>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
name: "buoy",
  data(){
  return{
    visi:false,
    charts: '',
    opinion:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎'],
    opinionData:[
      {value:335, name:'直接访问'},
      {value:310, name:'邮件营销'},
      {value:234, name:'联盟广告'},
      {value:135, name:'视频广告'},
      {value:1548, name:'搜索引擎'}
    ]
  }
  },
  methods:{
    test:function (){
      console.log("hello")
      this.visi=!this.visi
    },
    drawPie(){
      this.charts = echarts.init(document.getElementById("chart"))
      this.charts.setOption({
        tooltip: {
          trigger: 'item',
          
        },
        legend: {
          orient: 'vertical',
          x: 'left',
          data:this.opinion
        },
        series: [
          {
            name:'访问来源',
            type:'pie',
            radius:['50%','70%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '30',
                  fontWeight: 'blod'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data:this.opinionData
          }
        ]
      })
    }
  },
  mounted(){
    this.$nextTick(function() {
      this.drawPie()
    })
  }
}
</script>

<style scoped>

</style>