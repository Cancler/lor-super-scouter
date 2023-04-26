<script setup>
// import { Kayn, REGIONS } from "kayn"
// const kayn = Kayn(process.env.VUE_APP_RGAPI_TOKEN)({
//     region: REGIONS.EUROPE_WEST
// })
// import { RiotAPI, PlatformId } from '@fightmegg/riot-api'
// const riot_api = new RiotAPI(process.env.VUE_APP_RGAPI_TOKEN)

const startScouting = async() => {
    console.log("start scouting...")
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
    <h1>Test</h1>
    <button @click="startScouting">Start Scouting</button>
</template>

<style scoped></style>