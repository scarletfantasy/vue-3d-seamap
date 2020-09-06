<template>
    <div>
        <p>test</p>
    </div>
</template>

<script>

    export default {
        name: "miniseamap",
        props:["camera","worldpos"],
        data(){
            return{
                position:null,
                direction:null,
                offset:null
            }
        },

        updated() {

        },
        mounted:function () {



        }

    }
</script>

<style scoped>

</style>
