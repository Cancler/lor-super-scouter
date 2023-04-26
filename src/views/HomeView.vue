<script setup>
// import { Kayn, REGIONS } from "kayn"
// const kayn = Kayn(process.env.VUE_APP_RGAPI_TOKEN)({
//     region: REGIONS.EUROPE_WEST
// })
// import { RiotAPI, PlatformId } from '@fightmegg/riot-api'
// const riot_api = new RiotAPI(process.env.VUE_APP_RGAPI_TOKEN)
import {ref} from "vue";
import store from "@/store"
const product_name = ref(process.env.VUE_APP_PRODUCT_NAME)
const startScouting = async() => {
    console.log("start scouting...")
    console.log(store.get("token"))
    console.log(store.get("app-path"))
    // kayn.Summoner.by.name("Shaco Mid").callback(function(err, summoner) {
    //     console.log(err)
    //     console.log(summoner)
    // })
    // const summoner = await riot_api.summoner.getBySummonerName({
    //     region: PlatformId.EUROPE,
    //     summonerName: "Shaco Mid"
    // })
    //
    // console.log(summoner);
}

</script>

<template>
    <div class="headline">
        <img class="headline__img"
            :src="require('@/assets/Scout.png')">
        <div class="headline__text">
            {{ product_name }}
        </div>
    </div>
    <button @click="startScouting">
        Start Scouting
    </button>
</template>

<style scoped>

.headline{
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-bottom: 1rem;
}

.headline__img{
    width: 5rem;
    height: 5rem;
    padding-right: 1.5rem;
}

.headline__text{
    font-size: 2.5rem;
}

</style>