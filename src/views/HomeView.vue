<script setup>
// ##########################################################

import {computed, ref} from "vue";
import {ClientAPI, Platform, LorCluster, RiotAPI} from "@/api";
import store from "@/store";
import LorMatch from "@/component/LorMatch.vue"

// ##########################################################

const client_api = new ClientAPI(21337)
const riot_api = new RiotAPI(store.get("token"))

// ##########################################################

const opponent_name = computed(() => {
    if(rectangles.value){
        return rectangles.value.OpponentName
    }

    return null
})
const opponent = computed(() => {
    if(opponent_game_name.value
        && opponent_tag_line.value){
        return {
            gameName: opponent_game_name.value,
            tagLine: opponent_tag_line.value,
            puuid: opponent_puuid.value,
            history: opponent_history.value,
            loaded_history: opponent_loaded_history.value
        }
    }

    return null
})

// ##########################################################

const product_name = ref(process.env.VUE_APP_PRODUCT_NAME)
const rectangles = ref(null);
const opponent_game_name = ref("");
const opponent_tag_line = ref("");
const opponent_puuid = ref("");
const opponent_history = ref([]);
const opponent_loaded_history = ref(false);
const selected_region = ref(LorCluster.EUROPE);
const loading_opponent = ref(false);
const loading_history = ref(false);
const opponents = ref([]);

// ##########################################################

const resetSelectedOpponent = () => {
    opponent_game_name.value = ""
    opponent_tag_line.value = ""
    opponent_puuid.value = ""
    opponent_history.value = []
    opponent_loaded_history.value = false;
}
const startScouting = async() => {
    rectangles.value = await client_api.getPositionalRectangles();
    loading_opponent.value = true
    opponents.value = []

    resetSelectedOpponent()

    if(opponent_name.value){
        opponent_game_name.value = opponent_name.value

        for (const value of Object.values(Platform)) {
            // Region doesn't matter what you
            // insert here since the api still works
            const data = await riot_api.account.getByRiotId({
                region: Platform.EUROPE,
                game_name: opponent_name.value,
                tag_line: value
            })
            if(data){
                if("puuid" in data){
                    data.history = []
                    data.loaded_history = false;
                    opponents.value.push(data)
                }
            }
        }
    }
    loading_opponent.value = false
}
const getMatchHistory = async() => {
    if(opponent.value && selected_region.value){
        if(!opponent.value.puuid){
            const account = await riot_api.account.getByRiotId({
                region: selected_region.value,
                game_name: opponent.value.gameName,
                tag_line: opponent.value.tagLine
            })
            opponent_puuid.value = account.puuid
        }

        loading_history.value = true
        opponent_history.value = []

        const match_ids = await riot_api.lorMatch.getByPUUID({
            region: selected_region.value,
            puuid: opponent.value.puuid
        })
        console.log(match_ids)
        if(match_ids){
            const slice = match_ids.slice(0, 10)
            for(const match_id of slice){
                const match = await riot_api.lorMatch.getByMatchId({
                    region: selected_region.value,
                    match_id: match_id
                })
                if(match){
                    const player_1 = match.info.players.filter(x => {
                        return x.puuid === opponent_puuid.value
                    })[0]
                    player_1.tagLine = opponent_tag_line.value
                    player_1.gameName = opponent_game_name.value

                    const player_2 = match.info.players.filter(x => {
                        return x.puuid !== opponent_puuid.value
                    })[0]

                    match.info.players = []
                    match.info.players.push(player_1)

                    if(player_2){
                        const account = await riot_api.account.getByPUUID(
                            {
                                region: Platform.EUROPE,
                                puuid: player_2.puuid
                            }
                        )
                        player_2.tagLine = account.tagLine
                        player_2.gameName = account.gameName
                        match.info.players.push(player_2)
                    }
                    opponent_history.value.push(match)
                }
            }
        }

        // opponent_history.value = [{"metadata":{"data_version":"2","match_id":"96fcbad2-03f3-4093-a518-dd0e3b593729","participants":["zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA"]},"info":{"game_mode":"Constructed","game_type":"AI","game_start_time_utc":"2023-05-04T05:32:14.8294569+00:00","game_version":"live-green-4-04-29","players":[{"puuid":"zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","deck_id":"7cfa5eb7-db4b-42c5-8f5a-aa3f06cf651b","deck_code":"CMCACBIFBMBACBJIGEBQMBYEAUTAMBAHAIIBYJRPQIAQEAIFA4LACBQFEAAA","factions":["faction_ShadowIsles_Name","faction_Shurima_Name"],"game_outcome":"win","order_of_play":0,"tagLine":"187","gameName":"Cancler"}],"total_turn_count":80}},{"metadata":{"data_version":"2","match_id":"10447e82-fd9a-4d37-9c70-7293e2a9fbb4","participants":["zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA"]},"info":{"game_mode":"Constructed","game_type":"AI","game_start_time_utc":"2023-05-04T05:10:30.8866574+00:00","game_version":"live-green-4-04-29","players":[{"puuid":"zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","deck_id":"7754ccd3-6171-4770-84f6-24b3bdedaf45","deck_code":"CQCACBIHCABQKCQGJGTACBAGA4CAKLRQAUCAODI4E5OYEAIAAEAQIB2F","factions":["faction_BandleCity_Name","faction_Shurima_Name"],"game_outcome":"win","order_of_play":0,"tagLine":"187","gameName":"Cancler"}],"total_turn_count":123}},{"metadata":{"data_version":"2","match_id":"7399d556-6824-4099-861c-ca09ce2bf46c","participants":["zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","_rVTiqjH6zgHHvB2W2YW5UZFMdV-x_xoUuSSMdRUbp1E3FuK_f_gpKRAc0-yQgekTvFjQu3DXsasPQ"]},"info":{"game_mode":"Constructed","game_type":"Ranked","game_start_time_utc":"2023-05-04T04:15:01.8223316+00:00","game_version":"live-green-4-04-29","players":[{"puuid":"zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","deck_id":"946cf5c1-8664-436e-b214-e0da57d22bdc","deck_code":"CUBQCAQAAIAQMBAIAQDAACQRCUOQOAIBAAOQCBIABQAQMAISAEDAYGQBAYDQIAIHAACQGBQABMMDABABAIAAMAIEAABQCBQACIAQMCIG","factions":["faction_Aatrox_Name","faction_Demacia_Name"],"game_outcome":"win","order_of_play":0,"tagLine":"187","gameName":"Cancler"},{"puuid":"_rVTiqjH6zgHHvB2W2YW5UZFMdV-x_xoUuSSMdRUbp1E3FuK_f_gpKRAc0-yQgekTvFjQu3DXsasPQ","deck_id":"9394198a-348e-4165-a180-c2b8128e6274","deck_code":"CICQCAQGFYAQGBQUAIDAMHRJAIDQMGQ3AUDQGAYHBAEQ4AYBAIDBIAIFAYFQCBYGDEAQCAYGBY","factions":["faction_Bilgewater_Name","faction_Noxus_Name"],"game_outcome":"loss","order_of_play":1,"tagLine":"1866","gameName":"Kaihansen"}],"total_turn_count":30}},{"metadata":{"data_version":"2","match_id":"5914f882-3c7b-41b8-98e8-e46f89de67f5","participants":["zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","e3ceGXXClMFEHJMoEgb4fzuE1aGnrGMyDyh3_nV9orpId6V5OOfleRlayxrgjcOrwrLMBLnTbIrPKw"]},"info":{"game_mode":"Constructed","game_type":"Ranked","game_start_time_utc":"2023-05-04T04:05:17.7739369+00:00","game_version":"live-green-4-04-29","players":[{"puuid":"zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","deck_id":"946cf5c1-8664-436e-b214-e0da57d22bdc","deck_code":"CUBQCAQAAIAQMBAIAQDAACQRCUOQOAIBAAOQCBIABQAQMAISAEDAYGQBAYDQIAIHAACQGBQABMMDABABAIAAMAIEAABQCBQACIAQMCIG","factions":["faction_Aatrox_Name","faction_Demacia_Name"],"game_outcome":"win","order_of_play":0,"tagLine":"187","gameName":"Cancler"},{"puuid":"e3ceGXXClMFEHJMoEgb4fzuE1aGnrGMyDyh3_nV9orpId6V5OOfleRlayxrgjcOrwrLMBLnTbIrPKw","deck_id":"d8b1c10f-76df-473b-a269-c025e4181a84","deck_code":"CICACBIGAEBAEBQFFUBAEAYBA4DAMBQGA4OB4IRDAMAQEAYDAEDAGDQBA4DAQAIBA4DBU","factions":["faction_Bilgewater_Name","faction_Noxus_Name"],"game_outcome":"loss","order_of_play":1,"tagLine":"5064","gameName":"Zaptor0249"}],"total_turn_count":28}},{"metadata":{"data_version":"2","match_id":"36414d86-2adf-481e-b900-f068fbcf70b7","participants":["Zgf9D-9U037AkUQWQeHxKd8lQtPtXJB8nnQfsJ9cbZvOf6GV5kTe4y38ky2k3bHTWLRPAae_P8qoZw","zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA"]},"info":{"game_mode":"Constructed","game_type":"Ranked","game_start_time_utc":"2023-05-04T04:01:16.5825539+00:00","game_version":"live-green-4-04-29","players":[{"puuid":"zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","deck_id":"946cf5c1-8664-436e-b214-e0da57d22bdc","deck_code":"CUBQCAQAAIAQMBAIAQDAACQRCUOQOAIBAAOQCBIABQAQMAISAEDAYGQBAYDQIAIHAACQGBQABMMDABABAIAAMAIEAABQCBQACIAQMCIG","factions":["faction_Aatrox_Name","faction_Demacia_Name"],"game_outcome":"loss","order_of_play":0,"tagLine":"187","gameName":"Cancler"},{"puuid":"Zgf9D-9U037AkUQWQeHxKd8lQtPtXJB8nnQfsJ9cbZvOf6GV5kTe4y38ky2k3bHTWLRPAae_P8qoZw","deck_id":"6c6f207b-b89a-4ab4-87df-a77189eb150c","deck_code":"CIDACAIDFAAQEBRNAECQMAIBAYDB4AQHAMDQSAYCAMAQGBYFAEAQGBYBAIBQIAIGAYDQCBYGDMAQOAYOAMAQCAYPAEDAMKIBA4DA4","factions":["faction_Bilgewater_Name","faction_Noxus_Name"],"game_outcome":"win","order_of_play":1,"tagLine":"2655","gameName":"GenerateA"}],"total_turn_count":13}},{"metadata":{"data_version":"2","match_id":"56f9c4e6-d587-40e8-88e5-bea4e790f152","participants":["80OxOwtsgwWp77lYOPlgtciVLihBoo03W5AAJXdjoH94pnsIQF2OOfpSkzw142h1TifL9ZvYWDpqpg","zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA"]},"info":{"game_mode":"Constructed","game_type":"Ranked","game_start_time_utc":"2023-05-03T18:08:22.2939346+00:00","game_version":"live-green-4-04-29","players":[{"puuid":"zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","deck_id":"f29d55ce-e7bf-470a-b511-877bfd6f309a","deck_code":"CIEACAIDFAAQEAYDAEBQMFABAYDB4AIGAMUQCBYGDIBAOAYHBACAEBQUCY3TUAIBAIDCQAQBAIDBEAIHAMBQ","factions":["faction_Bilgewater_Name","faction_Noxus_Name"],"game_outcome":"win","order_of_play":1,"tagLine":"187","gameName":"Cancler"},{"puuid":"80OxOwtsgwWp77lYOPlgtciVLihBoo03W5AAJXdjoH94pnsIQF2OOfpSkzw142h1TifL9ZvYWDpqpg","deck_id":"27bf29a3-9147-486c-8464-56ee51aeb493","deck_code":"CQCACBQGDUAQOCQJAEDQMCAHAUFGS4DUQUA2OANXAHDACAYBAYDB4AIHAYCAEBIKMCQQCAQBAECAQAIGBILQ","factions":["faction_BandleCity_Name","faction_Bilgewater_Name"],"game_outcome":"loss","order_of_play":0,"tagLine":"6941","gameName":"Draiike"}],"total_turn_count":18}},{"metadata":{"data_version":"2","match_id":"c5e8f906-d47a-4eba-8bd6-bf801e97a6bd","participants":["zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","KC8grrNFJuyex8iE-rLaTF8R3SZaEm1gnUfDUtELFcOXkG1O0EviaeycGm6sVQedbTumTYT6uK6AOw"]},"info":{"game_mode":"Constructed","game_type":"Ranked","game_start_time_utc":"2023-05-03T18:03:54.8499776+00:00","game_version":"live-green-4-04-29","players":[{"puuid":"zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","deck_id":"f29d55ce-e7bf-470a-b511-877bfd6f309a","deck_code":"CIEACAIDFAAQEAYDAEBQMFABAYDB4AIGAMUQCBYGDIBAOAYHBACAEBQUCY3TUAIBAIDCQAQBAIDBEAIHAMBQ","factions":["faction_Bilgewater_Name","faction_Noxus_Name"],"game_outcome":"win","order_of_play":1,"tagLine":"187","gameName":"Cancler"},{"puuid":"KC8grrNFJuyex8iE-rLaTF8R3SZaEm1gnUfDUtELFcOXkG1O0EviaeycGm6sVQedbTumTYT6uK6AOw","deck_id":"f2d718dc-cf73-4d4c-af5a-b15a88da4edd","deck_code":"CIBQCAQGFUBAEAYBA4CQMBQGA4PCEIYFAEBAMEQBAMBQ2AIGAMHACBYDBYBAMBQVDQBQCAQDAMAQMAYYAIBAMBI4","factions":["faction_Bilgewater_Name","faction_Noxus_Name"],"game_outcome":"loss","order_of_play":0,"tagLine":"down","gameName":"lalalCZ"}],"total_turn_count":17}},{"metadata":{"data_version":"2","match_id":"4c7ad47d-f53f-477a-9974-b85415de4254","participants":["zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","Zqnygpe7vpDmRIYIYLsw42Uj3QZODdHMopG5NglXgcb7L05auGLwO1yfhQrxPPNd1kW4VlMSOqAq3w"]},"info":{"game_mode":"Constructed","game_type":"Ranked","game_start_time_utc":"2023-05-03T17:57:33.6414030+00:00","game_version":"live-green-4-04-29","players":[{"puuid":"zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","deck_id":"f29d55ce-e7bf-470a-b511-877bfd6f309a","deck_code":"CIEACAIDFAAQEAYDAEBQMFABAYDB4AIGAMUQCBYGDIBAOAYHBACAEBQUCY3TUAIBAIDCQAQBAIDBEAIHAMBQ","factions":["faction_Bilgewater_Name","faction_Noxus_Name"],"game_outcome":"loss","order_of_play":0,"tagLine":"187","gameName":"Cancler"},{"puuid":"Zqnygpe7vpDmRIYIYLsw42Uj3QZODdHMopG5NglXgcb7L05auGLwO1yfhQrxPPNd1kW4VlMSOqAq3w","deck_id":"6a72f57b-d103-459b-8b83-8412af91b63f","deck_code":"CECACBYDA4BACAZHFABAKAYEAYDQCBAMBUOCMKBNGQBACAIEAEAQKBAZAA","factions":["faction_Noxus_Name","faction_Piltover_Name"],"game_outcome":"win","order_of_play":1,"tagLine":"EUW","gameName":"Rublax"}],"total_turn_count":26}},{"metadata":{"data_version":"2","match_id":"2763c729-397b-4325-844c-752bb48c4fbf","participants":["zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","AzwjM9p9fRTqljAcxedhuddhe5l__r1zr2eD9rih-nOwRA3kd3lTyFcq71Sx_hySBylU_gizkKmlkg"]},"info":{"game_mode":"Constructed","game_type":"Ranked","game_start_time_utc":"2023-05-03T17:50:57.6412335+00:00","game_version":"live-green-4-04-29","players":[{"puuid":"zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","deck_id":"f29d55ce-e7bf-470a-b511-877bfd6f309a","deck_code":"CIEACAIDFAAQEAYDAEBQMFABAYDB4AIGAMUQCBYGDIBAOAYHBACAEBQUCY3TUAIBAIDCQAQBAIDBEAIHAMBQ","factions":["faction_Bilgewater_Name","faction_Noxus_Name"],"game_outcome":"loss","order_of_play":0,"tagLine":"187","gameName":"Cancler"},{"puuid":"AzwjM9p9fRTqljAcxedhuddhe5l__r1zr2eD9rih-nOwRA3kd3lTyFcq71Sx_hySBylU_gizkKmlkg","deck_id":"73e53d47-be76-436f-9bcd-3ed9a3c82aaa","deck_code":"CEDQCAICFEAQCBBUAEBAEBIBAMCAWAIHAQEQEBQECIXAIBYCBMIRGFACAEAQEMICAYCASIQBAEDAELA","factions":["faction_Ionia_Name","faction_Piltover_Name"],"game_outcome":"win","order_of_play":1,"tagLine":"5368","gameName":"6atbko"}],"total_turn_count":24}},{"metadata":{"data_version":"2","match_id":"e2cd8e46-64f2-46a0-9ca0-c2af3c8d964c","participants":["jj15ucgKcGSTUZmhrhT4nts73tCYIX19UtsJtuGslFT_r4qwStIiFgQpmdpYu66NLzCXv0M8zr5lCA","zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA"]},"info":{"game_mode":"Constructed","game_type":"Ranked","game_start_time_utc":"2023-05-03T17:41:40.4100870+00:00","game_version":"live-green-4-04-29","players":[{"puuid":"zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","deck_id":"f29d55ce-e7bf-470a-b511-877bfd6f309a","deck_code":"CIEACAIDFAAQEAYDAEBQMFABAYDB4AIGAMUQCBYGDIBAOAYHBACAEBQUCY3TUAIBAIDCQAQBAIDBEAIHAMBQ","factions":["faction_Bilgewater_Name","faction_Noxus_Name"],"game_outcome":"loss","order_of_play":1,"tagLine":"187","gameName":"Cancler"},{"puuid":"jj15ucgKcGSTUZmhrhT4nts73tCYIX19UtsJtuGslFT_r4qwStIiFgQpmdpYu66NLzCXv0M8zr5lCA","deck_id":"ec1e8e9b-5f8c-44ca-9978-3794bd603dc6","deck_code":"CQBQCBIKGEAQOBAJAIDAIFJIAIAQKBAGAEDQIEIHAECAIBYBA4FASAQFAQGRCAYBAQASCNADAYFBOJZIAYDAICIWEARCWLQIAUFAIKB2L2IQDNABYYA5KAI","factions":["faction_BandleCity_Name","faction_Piltover_Name"],"game_outcome":"win","order_of_play":0,"tagLine":"APH","gameName":"APH nvrwalkalone"}],"total_turn_count":34}}]
        // opponent_history.value = opponent_history.value.slice(0, 1)


        loading_history.value = false
        opponent_loaded_history.value = true
    }
}
const selectOpponent = (opponent) => {
    opponent_game_name.value = opponent.gameName
    opponent_tag_line.value = opponent.tagLine
    opponent_puuid.value = opponent.puuid
}

// ##########################################################
</script>

<template>
    <div class="scouter">
        <div class="headline">
            <img
                class="headline__img"
                :src="require('@/assets/Scout.png')"
            >
            <div class="headline__text">
                {{ product_name }}
            </div>
        </div>
        <button
            type="button"
            class="btn btn-secondary btn-lg"
            @click="startScouting"
        >
            Start Scouting
        </button>
        <div v-if="loading_opponent">
            Loading...
        </div>
        <div v-else-if="!rectangles || !rectangles.OpponentName">
            Game not found
        </div>
        <div v-else-if="opponent_name && opponents.length === 0">
            Couldn't identify tagLine
        </div>
        <div class="opponent-riot-id">
            <div>
                <div class="select-wrapper">
                    <div class="input-group">
                        <input
                            type="text"
                            v-model="opponent_game_name"
                            class="form-control game-name"
                        >
                        <span
                            class="input-group-text"
                            id="addon-wrapping"
                        >
                            #
                        </span>
                        <input
                            type="text"
                            v-model="opponent_tag_line"
                            class="form-control tag-line"
                            aria-describedby="addon-wrapping"
                        >
                        <button
                            class="btn btn-secondary dropdown-toggle"
                            type="button" data-bs-toggle="dropdown"
                            aria-expanded="false"
                            :disabled="opponents.length === 0"
                        >
                            Tag Lines
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end">
                            <li
                                v-for="(opponent, idx) in opponents"
                                :key="idx"
                                :value="opponent.tagLine"
                            >
                                <a
                                    class="dropdown-item"
                                    href="#"
                                    @click="selectOpponent(opponent)"
                                >
                                    {{ opponent.tagLine }}
                                </a>
                            </li>
                        </ul>
                    </div>
                    <select
                        v-model="selected_region"
                        class="form-select"
                    >
                        <option
                            v-for="(region, idx) in Object.values(LorCluster)"
                            :key="idx"
                            :value="region"
                        >
                            {{ region }}
                        </option>
                    </select>
                </div>
                <div class="history-wrapper">
                    <button
                        :disabled="!opponent || !selected_region"
                        type="button"
                        class="btn btn-secondary"
                        @click="getMatchHistory"
                    >
                        Load Match History
                    </button>
                    <div
                        v-if="loading_history"
                        class="history"
                    >
                        Loading...
                    </div>
                    <div
                        v-else-if="opponent?.history.length > 0"
                        class="history"
                    >
                        <LorMatch
                            v-for="(match, idx) in opponent?.history"
                            :key="idx"
                            :match="match"
                        ></LorMatch>
                    </div>
                    <div
                        v-else-if="opponent?.loaded_history"
                        class="no-history"
                    >
                        <div>No Matches Found</div>
                        <img :src="require('@/assets/poro-runeterra.gif')">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.scouter {
    width: 60rem;
}
.headline{
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-bottom: 1rem;
}
.history-wrapper{
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}
.select-wrapper{
    gap: .5rem;
    display: grid;
    place-items: center;
    grid-template-columns: 1fr auto;
}
.select-wrapper .tag-line{
    width: 5rem;
    flex: unset;
}
.select-wrapper .game-name{
}
.history{
    margin-top: 1rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: .5rem;
}
.no-history{
    margin-top: 1rem;
    width: 100%;
}
.headline__img{
    width: 10em;
    height: 10em;
    margin-right: 1.5rem;
}
.headline__text{
    font-size: 2.5rem;
    line-height: 2.5rem;
}
.opponent-riot-id{
    margin-top: 1rem;
    font-size: 1rem;
}
</style>