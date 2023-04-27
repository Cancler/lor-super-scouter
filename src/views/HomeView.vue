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
const selected_opponent = computed(() => {
    if(selected_opponent_game_name.value
        && selected_opponent_tag_line.value){
        return {
            gameName: selected_opponent_game_name.value,
            tagLine: selected_opponent_tag_line.value,
            puuid: selected_opponent_puuid.value,
            history: selected_opponent_history.value,
            loaded_history: selected_opponent_loaded_history.value
        }
    }

    return null
})

// ##########################################################

const product_name = ref(process.env.VUE_APP_PRODUCT_NAME)
const rectangles = ref(null);
const selected_opponent_game_name = ref("");
const selected_opponent_tag_line = ref("");
const selected_opponent_puuid = ref("");
const selected_opponent_history = ref([]);
const selected_opponent_loaded_history = ref(false);
const selected_region = ref(LorCluster.EUROPE);
const loading_opponent = ref(false);
const loading_history = ref(false);
const opponents = ref([]);

// ##########################################################

const resetSelectedOpponent = () => {
    selected_opponent_game_name.value = ""
    selected_opponent_tag_line.value = ""
    selected_opponent_puuid.value = ""
    selected_opponent_history.value = []
    selected_opponent_loaded_history.value = false;
}
const startScouting = async() => {
    rectangles.value = await client_api.getPositionalRectangles();
    loading_opponent.value = true
    opponents.value = []

    resetSelectedOpponent()

    if(opponent_name.value){
        selected_opponent_game_name.value = opponent_name.value

        for (const value of Object.values(Platform)) {
            // Region doesn't matter what you insert here since the api still works
            const data = await riot_api.account.getByRiotId({
                region: Platform.EUROPE,
                game_name: opponent_name.value,
                tag_line: value
            })
            if(Object.hasOwnProperty.call("puuid", data)){
                data.history = []
                data.loaded_history = false;
                opponents.value.push(data)
            }
        }
    }
    loading_opponent.value = false
}
const getMatchHistory = async() => {
    if(selected_opponent.value && selected_region.value){
        if(!selected_opponent.value.puuid){
            const account = await riot_api.account.getByRiotId({
                region: selected_region.value,
                game_name: selected_opponent.value.gameName,
                tag_line: selected_opponent.value.tagLine
            })
            selected_opponent_puuid.value = account.puuid
        }

        loading_history.value = true
        selected_opponent_history.value = []

        const match_ids = await riot_api.lorMatch.getByPUUID({
            region: selected_region.value,
            puuid: selected_opponent.value.puuid
        })
        console.log(match_ids)
        // if(match_ids){
        //     const slice = match_ids.slice(0, 10)
        //     for(const match_id of slice){
        //         const match = await riot_api.lorMatch.getByMatchId({
        //             region: selected_region.value,
        //             match_id: match_id
        //         })
        //         if(match){
        //             selected_opponent_history.value.push(match)
        //         }
        //     }
        // }
        selected_opponent_history.value = [{"metadata":{"data_version":"2","match_id":"3a6f6927-bcfd-4ceb-ac81-795ad8dea137","participants":["zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","qoxmOIbc1s8xqyvMrhQYV5eXyY4LkBHPFsLDauSyW97oeUP7XtMgapVQxF_vqjDCxrE4P43dWN8fvQ"]},"info":{"game_mode":"Constructed","game_type":"Ranked","game_start_time_utc":"2023-04-27T15:42:10.8289259+00:00","game_version":"live-green-4-04-29","players":[{"puuid":"zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","deck_id":"f29d55ce-e7bf-470a-b511-877bfd6f309a","deck_code":"CIEACAIDFAAQEAYDAEBQMFABAYDB4AIGAMUQCBYGDIBAOAYHBACAEBQUCY3TUAIBAIDCQAQBAIDBEAIHAMBQ","factions":["faction_Bilgewater_Name","faction_Noxus_Name"],"game_outcome":"win","order_of_play":0},{"puuid":"qoxmOIbc1s8xqyvMrhQYV5eXyY4LkBHPFsLDauSyW97oeUP7XtMgapVQxF_vqjDCxrE4P43dWN8fvQ","deck_id":"806c02c9-f0c8-498e-af5c-1b7124eca3ab","deck_code":"CICACBQAEQAQOAAFAMBQSAYOK4CQGAACAYDQQCYDAEBQSZABAYEQOAQBAANB2AQBAEAAOAIDAABQ","factions":["faction_Demacia_Name","faction_MtTargon_Name"],"game_outcome":"loss","order_of_play":1}],"total_turn_count":19}},{"metadata":{"data_version":"2","match_id":"754ea962-4ba4-4146-9e83-fdebebf16c23","participants":["zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","mrOo2hcGS4ygG4C7O_NLcEVsNHGCUSDwfGH2nipgDzqLHSLb5hg7_gndM9vb-oB-2axOAkiPt3x-3A"]},"info":{"game_mode":"Constructed","game_type":"Ranked","game_start_time_utc":"2023-04-27T15:36:06.4787786+00:00","game_version":"live-green-4-04-29","players":[{"puuid":"zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","deck_id":"f29d55ce-e7bf-470a-b511-877bfd6f309a","deck_code":"CIEACAIDFAAQEAYDAEBQMFABAYDB4AIGAMUQCBYGDIBAOAYHBACAEBQUCY3TUAIBAIDCQAQBAIDBEAIHAMBQ","factions":["faction_Bilgewater_Name","faction_Noxus_Name"],"game_outcome":"win","order_of_play":0},{"puuid":"mrOo2hcGS4ygG4C7O_NLcEVsNHGCUSDwfGH2nipgDzqLHSLb5hg7_gndM9vb-oB-2axOAkiPt3x-3A","deck_id":"a0e75514-842b-414a-a47e-388dc55c2e89","deck_code":"CQCACBIFBAAQMBIUAMCQUMK5MIBQMCQPCEKQMAIFBIAQCBIFBIAQMBJAAEDQUCIBA4CQEAQBAUATCAQBAUFNKAIBAYFBO","factions":["faction_BandleCity_Name","faction_ShadowIsles_Name"],"game_outcome":"loss","order_of_play":1}],"total_turn_count":19}},{"metadata":{"data_version":"2","match_id":"faf92c07-00e2-4043-bd33-c04fff7537b3","participants":["zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","5O2ZLiCvRlvWgtUqKxkqEKfXjTnu9ZoTeqcuVXaO1ceAvvtcE1LW-ir-HIZkdTyOl5vgyA8E6iqTNg"]},"info":{"game_mode":"Constructed","game_type":"Ranked","game_start_time_utc":"2023-04-27T15:28:46.0625517+00:00","game_version":"live-green-4-04-29","players":[{"puuid":"zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","deck_id":"f29d55ce-e7bf-470a-b511-877bfd6f309a","deck_code":"CIEACAIDFAAQEAYDAEBQMFABAYDB4AIGAMUQCBYGDIBAOAYHBACAEBQUCY3TUAIBAIDCQAQBAIDBEAIHAMBQ","factions":["faction_Bilgewater_Name","faction_Noxus_Name"],"game_outcome":"win","order_of_play":0},{"puuid":"5O2ZLiCvRlvWgtUqKxkqEKfXjTnu9ZoTeqcuVXaO1ceAvvtcE1LW-ir-HIZkdTyOl5vgyA8E6iqTNg","deck_id":"7770750f-3c6f-4bbd-9709-f17aa82ef2bf","deck_code":"CUCACBIABQAQMAISAEDAICAGAYAAUCYRCUMB2BIBAEAB2AICAABACBAAAMAQMABQAEDAYGQDAEBAABQBAYEQMAIGA4CA","factions":["faction_Aatrox_Name","faction_Demacia_Name"],"game_outcome":"loss","order_of_play":1}],"total_turn_count":27}},{"metadata":{"data_version":"2","match_id":"f4c3fad9-ceeb-4ef4-99c6-10259c61dfc1","participants":["mCOi39kyiAcVMUCloRpgTmYNaag869j39Arm-DJbj5Gb8XmP4ytQcDA_6Owz9Gh0nYDOTWUhyY8OTQ","zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA"]},"info":{"game_mode":"Constructed","game_type":"Ranked","game_start_time_utc":"2023-04-27T15:24:20.3014445+00:00","game_version":"live-green-4-04-29","players":[{"puuid":"mCOi39kyiAcVMUCloRpgTmYNaag869j39Arm-DJbj5Gb8XmP4ytQcDA_6Owz9Gh0nYDOTWUhyY8OTQ","deck_id":"d9781b5b-b9a0-447b-8175-7767b282a5ba","deck_code":"CQCQCAIEBAAQMCQXAEDASBACAEBRGGIIAUFGA2LKOSCQDIABU4A3OAIAAEAQMCRI","factions":["faction_BandleCity_Name","faction_Noxus_Name"],"game_outcome":"win","order_of_play":0},{"puuid":"zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","deck_id":"f29d55ce-e7bf-470a-b511-877bfd6f309a","deck_code":"CIEACAIDFAAQEAYDAEBQMFABAYDB4AIGAMUQCBYGDIBAOAYHBACAEBQUCY3TUAIBAIDCQAQBAIDBEAIHAMBQ","factions":["faction_Bilgewater_Name","faction_Noxus_Name"],"game_outcome":"loss","order_of_play":1}],"total_turn_count":25}},{"metadata":{"data_version":"2","match_id":"2bfaef21-a726-4208-9471-850b0694648b","participants":["k8pjMR1uMsebgNB5hHT9VDikCsH9GyVjMCaxiFdrvY3AUWApllFJYxlOpVI30k1EToB6fIUWtHswBQ","zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA"]},"info":{"game_mode":"Constructed","game_type":"Ranked","game_start_time_utc":"2023-04-27T15:18:29.5629747+00:00","game_version":"live-green-4-04-29","players":[{"puuid":"k8pjMR1uMsebgNB5hHT9VDikCsH9GyVjMCaxiFdrvY3AUWApllFJYxlOpVI30k1EToB6fIUWtHswBQ","deck_id":"40f2f410-763a-4860-b503-30c7784a1bb6","deck_code":"CQBQCBYKBEBAOBQEBAEQKCTJNJ2IIAMFAGQQDJYBW4A4MAICAECQUYABAYEQIAA","factions":["faction_BandleCity_Name","faction_Bilgewater_Name"],"game_outcome":"win","order_of_play":0},{"puuid":"zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","deck_id":"f29d55ce-e7bf-470a-b511-877bfd6f309a","deck_code":"CIEACAIDFAAQEAYDAEBQMFABAYDB4AIGAMUQCBYGDIBAOAYHBACAEBQUCY3TUAIBAIDCQAQBAIDBEAIHAMBQ","factions":["faction_Bilgewater_Name","faction_Noxus_Name"],"game_outcome":"loss","order_of_play":1}],"total_turn_count":29}},{"metadata":{"data_version":"2","match_id":"dd2e811c-c1ce-4f28-a67b-a169b828c228","participants":["s82Z21ujUh1ZmPrrDfAqH4CN1dtufLWdNQ--rZmT7n3ne70Mb_xzvL2cmFC6yukYKVkXOoV2846oBA","zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA"]},"info":{"game_mode":"Constructed","game_type":"Ranked","game_start_time_utc":"2023-04-27T15:12:20.0825088+00:00","game_version":"live-green-4-04-29","players":[{"puuid":"s82Z21ujUh1ZmPrrDfAqH4CN1dtufLWdNQ--rZmT7n3ne70Mb_xzvL2cmFC6yukYKVkXOoV2846oBA","deck_id":"75c36a76-f2c9-4a01-a61a-09b4a891e341","deck_code":"CICACAYJEMAQGAYDAICQSAYGAIDAGFBEAUAQGCJTAECQSDIBA4BQOAQGAMNSEAYGBECAMKAGAEAQGLYBAMEVKAIDAMDQCBIJBAAQKAYEAEDAEHA","factions":["faction_MtTargon_Name","faction_Noxus_Name"],"game_outcome":"loss","order_of_play":1},{"puuid":"zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","deck_id":"f29d55ce-e7bf-470a-b511-877bfd6f309a","deck_code":"CIEACAIDFAAQEAYDAEBQMFABAYDB4AIGAMUQCBYGDIBAOAYHBACAEBQUCY3TUAIBAIDCQAQBAIDBEAIHAMBQ","factions":["faction_Bilgewater_Name","faction_Noxus_Name"],"game_outcome":"win","order_of_play":0}],"total_turn_count":22}},{"metadata":{"data_version":"2","match_id":"48ed6493-a62c-43ef-98d4-e57362c5e13c","participants":["zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","5O2ZLiCvRlvWgtUqKxkqEKfXjTnu9ZoTeqcuVXaO1ceAvvtcE1LW-ir-HIZkdTyOl5vgyA8E6iqTNg"]},"info":{"game_mode":"Constructed","game_type":"Ranked","game_start_time_utc":"2023-04-27T15:09:06.5468592+00:00","game_version":"live-green-4-04-29","players":[{"puuid":"zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","deck_id":"f29d55ce-e7bf-470a-b511-877bfd6f309a","deck_code":"CIEACAIDFAAQEAYDAEBQMFABAYDB4AIGAMUQCBYGDIBAOAYHBACAEBQUCY3TUAIBAIDCQAQBAIDBEAIHAMBQ","factions":["faction_Bilgewater_Name","faction_Noxus_Name"],"game_outcome":"win","order_of_play":1},{"puuid":"5O2ZLiCvRlvWgtUqKxkqEKfXjTnu9ZoTeqcuVXaO1ceAvvtcE1LW-ir-HIZkdTyOl5vgyA8E6iqTNg","deck_id":"7770750f-3c6f-4bbd-9709-f17aa82ef2bf","deck_code":"CUCACBIABQAQMAISAEDAICAGAYAAUCYRCUMB2BIBAEAB2AICAABACBAAAMAQMABQAEDAYGQDAEBAABQBAYEQMAIGA4CA","factions":["faction_Aatrox_Name","faction_Demacia_Name"],"game_outcome":"loss","order_of_play":0}],"total_turn_count":19}},{"metadata":{"data_version":"2","match_id":"43c5bede-ab81-4839-b441-11835dd1cb05","participants":["zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","pug3L3iI7IBvNtAFTetwG_giGoiCkEx8E5EA5wQdiMFUblf9WhfgXsmOfQKa0ewNP2zQR1PvCfeBXQ"]},"info":{"game_mode":"Constructed","game_type":"Ranked","game_start_time_utc":"2023-04-27T15:04:19.2302187+00:00","game_version":"live-green-4-04-29","players":[{"puuid":"zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","deck_id":"f29d55ce-e7bf-470a-b511-877bfd6f309a","deck_code":"CIEACAIDFAAQEAYDAEBQMFABAYDB4AIGAMUQCBYGDIBAOAYHBACAEBQUCY3TUAIBAIDCQAQBAIDBEAIHAMBQ","factions":["faction_Bilgewater_Name","faction_Noxus_Name"],"game_outcome":"loss","order_of_play":0},{"puuid":"pug3L3iI7IBvNtAFTetwG_giGoiCkEx8E5EA5wQdiMFUblf9WhfgXsmOfQKa0ewNP2zQR1PvCfeBXQ","deck_id":"c23cf485-9401-475d-8cf4-74048c2098d3","deck_code":"CMCACBQHAUBACBBIGQBQIBABAQDQKBAHAEOE2T2TAIAQOBAJAICAOC3NAEAQIBZ3","factions":["faction_Piltover_Name","faction_Shurima_Name"],"game_outcome":"win","order_of_play":1}],"total_turn_count":27}},{"metadata":{"data_version":"2","match_id":"22c80db6-6e8d-4103-9113-3a7967366f1c","participants":["zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","3qdffswEyHrsDTxT9NOvi0A9SMxLU-Nr83eUKJIcQv8h8TvbmSKz-Jro2NVTYIoP3quYl7t_BJGmwg"]},"info":{"game_mode":"ChampsUnlimited","game_type":"","game_start_time_utc":"2023-04-27T14:08:03.5995950+00:00","game_version":"live-green-4-04-29","players":[{"puuid":"zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","deck_id":"0a54b208-e0b3-4c33-8a09-f896b4031908_live_cte_deck_0","deck_code":"CICQCAQDAMAQMAZJAEDQGBYDAEBQEDBIAQBAMFQ2EY5AIAIBAM3QCAQGFAAQKBQBAEDAMHQCAEAQGGIBAQBQG","factions":["faction_Bilgewater_Name","faction_Noxus_Name"],"game_outcome":"win","order_of_play":0},{"puuid":"3qdffswEyHrsDTxT9NOvi0A9SMxLU-Nr83eUKJIcQv8h8TvbmSKz-Jro2NVTYIoP3quYl7t_BJGmwg","deck_id":"0a54b208-e0b3-4c33-8a09-f896b4031908_live_cte_deck_0","deck_code":"CEBACAIEEQAQMBAVAQAQCARJAEAQIOABAMCAGAIGAQUAQAICAQEACAYCCQBAIBAHCEBAMAQNEABQCBAQEE2AKAICAICAYLRRAUBAEAYFBAEQUBYGAQEQ4FAWDUQCW","factions":["faction_Ionia_Name","faction_Piltover_Name"],"game_outcome":"loss","order_of_play":1}],"total_turn_count":14}},{"metadata":{"data_version":"2","match_id":"b8bb27ae-a4d1-4530-91db-ecf916c302b8","participants":["rPu_Q98lQhRhrMdlVEoMOkN2bPAzFn0DQgykR1T_0aw4emg8HORc7NLHdSuy9TQV09eQAVSdw8VC6w","zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA"]},"info":{"game_mode":"ChampsUnlimited","game_type":"","game_start_time_utc":"2023-04-27T14:05:22.0281338+00:00","game_version":"live-green-4-04-29","players":[{"puuid":"rPu_Q98lQhRhrMdlVEoMOkN2bPAzFn0DQgykR1T_0aw4emg8HORc7NLHdSuy9TQV09eQAVSdw8VC6w","deck_id":"0a54b208-e0b3-4c33-8a09-f896b4031908_live_cte_deck_0","deck_code":"CECACAIACUAQIAADAIBAAAQGA4DAKDANBYIBIHBGAMAQCBJRAEBAABABAYCSAAIBA4AAK","factions":["faction_Demacia_Name","faction_ShadowIsles_Name"],"game_outcome":"loss","order_of_play":1},{"puuid":"zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","deck_id":"0a54b208-e0b3-4c33-8a09-f896b4031908_live_cte_deck_0","deck_code":"CICQCAQDAMAQMAZJAEDQGBYDAEBQEDBIAQBAMFQ2EY5AIAIBAM3QCAQGFAAQKBQBAEDAMHQCAEAQGGIBAQBQG","factions":["faction_Bilgewater_Name","faction_Noxus_Name"],"game_outcome":"win","order_of_play":0}],"total_turn_count":14}},{"metadata":{"data_version":"2","match_id":"020531df-a8e6-4c33-ae98-26e8f37f37d1","participants":["zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","gU65wb-vmI-dn0tVEW4OKFeeQSY9i9LVq221wfYTZhgnEMmUqIbsTgzfX27ZlkyEMGIrSkmZXOf4PA"]},"info":{"game_mode":"ChampsUnlimited","game_type":"","game_start_time_utc":"2023-04-27T14:00:18.2707236+00:00","game_version":"live-green-4-04-29","players":[{"puuid":"zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","deck_id":"0a54b208-e0b3-4c33-8a09-f896b4031908_live_cte_deck_0","deck_code":"CICQCAQDAMAQMAZJAEDQGBYDAEBQEDBIAQBAMFQ2EY5AIAIBAM3QCAQGFAAQKBQBAEDAMHQCAEAQGGIBAQBQG","factions":["faction_Bilgewater_Name","faction_Noxus_Name"],"game_outcome":"loss","order_of_play":1},{"puuid":"gU65wb-vmI-dn0tVEW4OKFeeQSY9i9LVq221wfYTZhgnEMmUqIbsTgzfX27ZlkyEMGIrSkmZXOf4PA","deck_id":"0a54b208-e0b3-4c33-8a09-f896b4031908_live_cte_deck_0","deck_code":"CECACBQBEQAQMBJAAMAQCDBHFIBQGAIDAYLAGAQBAUASQAQEAEGA4AYBAEARINABAIBQCCQT","factions":["faction_Freljord_Name","faction_ShadowIsles_Name"],"game_outcome":"win","order_of_play":0}],"total_turn_count":24}},{"metadata":{"data_version":"2","match_id":"5b5be6bc-5f3d-4e66-89e5-1451477deef3","participants":["zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","YC0DGukFw4_vW6uFKamXX6mQe5eiC7KBpTi8DwanvrmqVZKVBawt3XNkfYckCtR9TzFtvRBVFnMNIQ"]},"info":{"game_mode":"ChampsUnlimited","game_type":"","game_start_time_utc":"2023-04-27T13:55:47.2386071+00:00","game_version":"live-green-4-04-29","players":[{"puuid":"zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","deck_id":"0a54b208-e0b3-4c33-8a09-f896b4031908_live_cte_deck_0","deck_code":"CICQCAQDAMAQMAZJAEDQGBYDAEBQEDBIAQBAMFQ2EY5AIAIBAM3QCAQGFAAQKBQBAEDAMHQCAEAQGGIBAQBQG","factions":["faction_Bilgewater_Name","faction_Noxus_Name"],"game_outcome":"win","order_of_play":0},{"puuid":"YC0DGukFw4_vW6uFKamXX6mQe5eiC7KBpTi8DwanvrmqVZKVBawt3XNkfYckCtR9TzFtvRBVFnMNIQ","deck_id":"0a54b208-e0b3-4c33-8a09-f896b4031908_live_cte_deck_0","deck_code":"CEDACAIADIAQCAIJAEBQCAQBAUAQIAIGAEJAIBIABEGBEEYDAEAQACYBAYAQQAYGAAFRCLADAEBAAAIBAUABIAIGAAUQ","factions":["faction_Demacia_Name","faction_Freljord_Name"],"game_outcome":"loss","order_of_play":1}],"total_turn_count":18}},{"metadata":{"data_version":"2","match_id":"f9257fbf-78e7-4cce-97c6-8e4e03c83c86","participants":["2v0TOBia2kQRcFbcWHbb3wXl3Uz-rOJP3g7b4SyQLxlC34G9BjlTuf-agPoborfsOnPLWBsG_Vj89A","zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA"]},"info":{"game_mode":"ChampsUnlimited","game_type":"","game_start_time_utc":"2023-04-27T13:48:37.5534205+00:00","game_version":"live-green-4-04-29","players":[{"puuid":"2v0TOBia2kQRcFbcWHbb3wXl3Uz-rOJP3g7b4SyQLxlC34G9BjlTuf-agPoborfsOnPLWBsG_Vj89A","deck_id":"0a54b208-e0b3-4c33-8a09-f896b4031908_live_cte_deck_0","deck_code":"CEBQCBQAGAAQOAAFAMAQABRCE4BQCBQAFMBQIAAEA4EAMAIAAQGBIFI2EQCACAYABQAQIAAKAECQAFICAYACKKI","factions":["faction_Demacia_Name"],"game_outcome":"win","order_of_play":1},{"puuid":"zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","deck_id":"0a54b208-e0b3-4c33-8a09-f896b4031908_live_cte_deck_0","deck_code":"CICQCAQDAMAQMAZJAEDQGBYDAEBQEDBIAQBAMFQ2EY5AIAIBAM3QCAQGFAAQKBQBAEDAMHQCAEAQGGIBAQBQG","factions":["faction_Bilgewater_Name","faction_Noxus_Name"],"game_outcome":"loss","order_of_play":0}],"total_turn_count":27}},{"metadata":{"data_version":"2","match_id":"50fb5b70-b75d-42f3-851e-45cebb60e52b","participants":["ObKne-Hnuf18Ze4RTQts-pKfUBvsrHqLeZVSIYK__F51wKla2IRE8vgww0S8nG8Vbwd4v8ppWfy8qA","zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA"]},"info":{"game_mode":"ChampsUnlimited","game_type":"","game_start_time_utc":"2023-04-27T13:44:56.6097247+00:00","game_version":"live-green-4-04-29","players":[{"puuid":"ObKne-Hnuf18Ze4RTQts-pKfUBvsrHqLeZVSIYK__F51wKla2IRE8vgww0S8nG8Vbwd4v8ppWfy8qA","deck_id":"0a54b208-e0b3-4c33-8a09-f896b4031908_live_cte_deck_0","deck_code":"CQDQCAIACYAQEBQWAEBAABQBAMAAWAIEAABQCBIKFEBAMAALCUDACAIABQAQEAACAECQACIBAYDA4AIGAAUQEBAAAIEAEAIEAAGACBYGAI","factions":["faction_Bilgewater_Name","faction_Demacia_Name"],"game_outcome":"loss","order_of_play":1},{"puuid":"zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","deck_id":"0a54b208-e0b3-4c33-8a09-f896b4031908_live_cte_deck_0","deck_code":"CICQCAQDAMAQMAZJAEDQGBYDAEBQEDBIAQBAMFQ2EY5AIAIBAM3QCAQGFAAQKBQBAEDAMHQCAEAQGGIBAQBQG","factions":["faction_Bilgewater_Name","faction_Noxus_Name"],"game_outcome":"win","order_of_play":0}],"total_turn_count":15}},{"metadata":{"data_version":"2","match_id":"92ff3082-bed7-48b8-98ba-a1e03d18e548","participants":["WioGoSj3uXQ98stwmFyFq-U3ory0JQ7x0yh8CC2csjrnt5wth-3prFZuLPoM8CuvTwg9oMKSntfFUw","zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA"]},"info":{"game_mode":"ChampsUnlimited","game_type":"","game_start_time_utc":"2023-04-27T13:39:49.6032856+00:00","game_version":"live-green-4-04-29","players":[{"puuid":"WioGoSj3uXQ98stwmFyFq-U3ory0JQ7x0yh8CC2csjrnt5wth-3prFZuLPoM8CuvTwg9oMKSntfFUw","deck_id":"0a54b208-e0b3-4c33-8a09-f896b4031908_live_cte_deck_0","deck_code":"CQCACAIEBAAQMCIEAEDAKFAFAUFGS5EFAGTADNYBAMAQMBJAAIAQKAIZAQCQU54EAGQQDRQBAIAQKCQBAEDAUFY","factions":["faction_BandleCity_Name","faction_ShadowIsles_Name"],"game_outcome":"loss","order_of_play":1},{"puuid":"zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","deck_id":"0a54b208-e0b3-4c33-8a09-f896b4031908_live_cte_deck_0","deck_code":"CICQCAQDAMAQMAZJAEDQGBYDAEBQEDBIAQBAMFQ2EY5AIAIBAM3QCAQGFAAQKBQBAEDAMHQCAEAQGGIBAQBQG","factions":["faction_Bilgewater_Name","faction_Noxus_Name"],"game_outcome":"win","order_of_play":0}],"total_turn_count":19}},{"metadata":{"data_version":"2","match_id":"07963d75-bbc0-47d4-a803-1b7e5f3b0ae5","participants":["uWBkNeFzuidfG30fCWprPivBhtAlXkgkA9o2RYMsw3WnDluIHZZY5Er2ccB5LSn_ihj8zaEmmR0gow","zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA"]},"info":{"game_mode":"ChampsUnlimited","game_type":"","game_start_time_utc":"2023-04-27T13:32:21.8133054+00:00","game_version":"live-green-4-04-29","players":[{"puuid":"uWBkNeFzuidfG30fCWprPivBhtAlXkgkA9o2RYMsw3WnDluIHZZY5Er2ccB5LSn_ihj8zaEmmR0gow","deck_id":"0a54b208-e0b3-4c33-8a09-f896b4031908_live_cte_deck_0","deck_code":"CICQCBQGFEBAEBQUFYBAGBQRCQBAOBQ2DMCQOAYDA4EASDQCAECQMCYBA4DBSAA","factions":["faction_Bilgewater_Name","faction_Noxus_Name"],"game_outcome":"loss","order_of_play":0},{"puuid":"zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","deck_id":"0a54b208-e0b3-4c33-8a09-f896b4031908_live_cte_deck_0","deck_code":"CICQCAQDAMAQMAZJAEDQGBYDAEBQEDBIAQBAMFQ2EY5AIAIBAM3QCAQGFAAQKBQBAEDAMHQCAEAQGGIBAQBQG","factions":["faction_Bilgewater_Name","faction_Noxus_Name"],"game_outcome":"win","order_of_play":1}],"total_turn_count":22}},{"metadata":{"data_version":"2","match_id":"7e7b682a-3961-40a8-adf5-b263e9b1fc93","participants":["itjmMz5_HfH0fT2_OAjrkWsKZ88fCJnhAVKiKH6TsGXWefJ8NL09AwE2cUdLhiHJL4Zdn948qM3V3g","zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA"]},"info":{"game_mode":"EternalLobby","game_type":"","game_start_time_utc":"2023-04-27T11:06:04.9065949+00:00","game_version":"live-green-4-04-29","players":[{"puuid":"itjmMz5_HfH0fT2_OAjrkWsKZ88fCJnhAVKiKH6TsGXWefJ8NL09AwE2cUdLhiHJL4Zdn948qM3V3g","deck_id":"461632bc-ac7e-4570-97e5-0ba449de509e","deck_code":"CQBQEAQDAMCAGAIDAIGCQCAFBIDSSMKFJF2KGANGAEAACAIBAM3Q","factions":["faction_BandleCity_Name","faction_Noxus_Name"],"game_outcome":"loss","order_of_play":0},{"puuid":"zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","deck_id":"6349b290-77f6-49d0-9878-b48d0e335cf6","deck_code":"CQCACAIDCMAQCBAIAEDAUGQGAUFGS4DUQUA2OANXAECQCAIDDEAQEAYDAEDASBABAYBROAQFBJQGUAIBA4BQ4","factions":["faction_BandleCity_Name","faction_Noxus_Name"],"game_outcome":"win","order_of_play":1}],"total_turn_count":23}},{"metadata":{"data_version":"2","match_id":"80cdc232-44c9-4a91-bdc0-d6a837f89ffe","participants":["zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","co13DtIecb6yubrqNpapCxMLJpFWfnpkHrlPLNLaG7cHi8h3V4i3XhOQ7zUHd3G7RB4MYDln3jJ2aQ"]},"info":{"game_mode":"Constructed","game_type":"Ranked","game_start_time_utc":"2023-04-27T07:03:32.7128842+00:00","game_version":"live-green-4-04-29","players":[{"puuid":"zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","deck_id":"f29d55ce-e7bf-470a-b511-877bfd6f309a","deck_code":"CIEACAIDFAAQEAYDAEBQMFABAYDB4AIGAMUQCBYGDIBAOAYHBACAEBQUCY3TUAIBAIDCQAQBAIDBEAIHAMBQ","factions":["faction_Bilgewater_Name","faction_Noxus_Name"],"game_outcome":"win","order_of_play":0},{"puuid":"co13DtIecb6yubrqNpapCxMLJpFWfnpkHrlPLNLaG7cHi8h3V4i3XhOQ7zUHd3G7RB4MYDln3jJ2aQ","deck_id":"232e5f1d-4378-4987-a79c-0573838fb38f","deck_code":"CEDACAIFAEAQIBAOAEDAILQBA4CQEAQBAQ2DQBAFAQLBQGI5AQAQKBA7AECQKAYBAYCASAIGAUQAEAIGAQJACBYFAE","factions":["faction_Piltover_Name","faction_ShadowIsles_Name"],"game_outcome":"loss","order_of_play":1}],"total_turn_count":27}},{"metadata":{"data_version":"2","match_id":"d2a2e4fd-56d4-4d6d-add7-e8810297100d","participants":["zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","k9Dvrl5oJovmlJoNbHHKEQjFnh2YqI89MPBLueokYcfB57Bj1PPHXcvgzUSx_Q9qeuLQ4KINfcZacA"]},"info":{"game_mode":"Constructed","game_type":"Ranked","game_start_time_utc":"2023-04-27T07:01:25.1419091+00:00","game_version":"live-green-4-04-29","players":[{"puuid":"zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","deck_id":"f29d55ce-e7bf-470a-b511-877bfd6f309a","deck_code":"CIEACAIDFAAQEAYDAEBQMFABAYDB4AIGAMUQCBYGDIBAOAYHBACAEBQUCY3TUAIBAIDCQAQBAIDBEAIHAMBQ","factions":["faction_Bilgewater_Name","faction_Noxus_Name"],"game_outcome":"win","order_of_play":1},{"puuid":"k9Dvrl5oJovmlJoNbHHKEQjFnh2YqI89MPBLueokYcfB57Bj1PPHXcvgzUSx_Q9qeuLQ4KINfcZacA","deck_id":"7bac7104-abc6-4257-a468-28d2036955ed","deck_code":"CEDACAICFEAQCBIBAEBAEBIBAYCS4AIHAUBAKBYCBMGRCEYUAMAQCARRAEAQKLQCAYCSAKYBAIAQKDZR","factions":["faction_Ionia_Name","faction_ShadowIsles_Name"],"game_outcome":"loss","order_of_play":0}],"total_turn_count":1}},{"metadata":{"data_version":"2","match_id":"e8001046-7ec7-4d9d-a34a-f96c288ef05d","participants":["zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","R2mYSk15oWiapEJVT5A8wfFnJvTsQDsF59PD-GnBAZIj2rqc9PRt0bvXl88k2EKv2XMRkEoDKe_QtA"]},"info":{"game_mode":"Constructed","game_type":"Ranked","game_start_time_utc":"2023-04-27T06:54:39.3727436+00:00","game_version":"live-green-4-04-29","players":[{"puuid":"zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","deck_id":"f29d55ce-e7bf-470a-b511-877bfd6f309a","deck_code":"CIEACAIDFAAQEAYDAEBQMFABAYDB4AIGAMUQCBYGDIBAOAYHBACAEBQUCY3TUAIBAIDCQAQBAIDBEAIHAMBQ","factions":["faction_Bilgewater_Name","faction_Noxus_Name"],"game_outcome":"loss","order_of_play":0},{"puuid":"R2mYSk15oWiapEJVT5A8wfFnJvTsQDsF59PD-GnBAZIj2rqc9PRt0bvXl88k2EKv2XMRkEoDKe_QtA","deck_id":"d96e71e4-786b-45ab-ab4a-802d86ff5d69","deck_code":"CICQCAIFAEAQIBIPAEDAKKYCAICQQCQFAIDBOLBPGU4AEAQCAYOSOAQGAYRCMAICAIDB4JI","factions":["faction_Bilgewater_Name","faction_ShadowIsles_Name"],"game_outcome":"win","order_of_play":1}],"total_turn_count":27}}]
        selected_opponent_history.value = selected_opponent_history.value.slice(0, 1)
        loading_history.value = false
        selected_opponent_loaded_history.value = true
    }
}
const selectOpponent = (opponent) => {
    selected_opponent_game_name.value = opponent.gameName
    selected_opponent_tag_line.value = opponent.tagLine
    selected_opponent_puuid.value = opponent.puuid
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
            No Opponent found
        </div>
        <div v-else-if="opponent_name && opponents.length === 0">
            Couldn't identify tagLine
        </div>
        <div class="opponent-riot-id">
            <div>
                <div class="select-wrapper">
                    <div class="input-group">
                        <input type="text" v-model="selected_opponent_game_name" class="form-control game-name">
                        <span class="input-group-text" id="addon-wrapping">#</span>
                        <input
                            type="text"
                            v-model="selected_opponent_tag_line"
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
                                <a class="dropdown-item" href="#" @click="selectOpponent(opponent)">
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
                        :disabled="!selected_opponent || !selected_region"
                        type="button"
                        class="btn btn-secondary"
                        @click="getMatchHistory"
                    >
                        Load Match History
                    </button>
                    <div v-if="loading_history" class="history">Loading...</div>
                    <div v-else-if="selected_opponent?.history.length > 0" class="history">
                        <LorMatch
                            v-for="(match, idx) in selected_opponent?.history"
                            :key="idx"
                            :match="match"
                            :player_riot_id="{
                                gameName: selected_opponent_game_name,
                                tagLine: selected_opponent_tag_line,
                                puuid: selected_opponent_puuid
                            }"
                        ></LorMatch>
                    </div>
                    <div v-else-if="selected_opponent?.loaded_history" class="no-history">
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
    width: 45rem;
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
    grid-template-columns: 3fr 1fr;
}

.select-wrapper .tag-line{
    width: 5rem;
    flex: unset;
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