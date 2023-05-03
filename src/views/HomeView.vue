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
    // rectangles.value = await client_api.getPositionalRectangles();
    console.log(client_api)
    rectangles.value = {
        OpponentName: "Düsterer Wolf"
    }
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
                    const account = await riot_api.account.getByPUUID(
                        {
                            region: Platform.EUROPE,
                            puuid: player_2.puuid
                        }
                    )
                    player_2.tagLine = account.tagLine
                    player_2.gameName = account.gameName

                    match.info.players = [player_1, player_2]

                    opponent_history.value.push(match)
                }
            }
        }

        // opponent_history.value = [{"metadata":{"data_version":"2","match_id":"2a563065-e0d8-4394-9546-ef9d5baf0e6c","participants":["uvm0RixjrLuPmxGECbAv3vLgqgIiHOOu4VJHEzL1uJT_IQtu5y3FDfTWfs5gffhvh7wgN2XKI1PUXQ","zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA"]},"info":{"game_mode":"StandardGauntletLobby","game_type":"StandardGauntlet","game_start_time_utc":"2023-05-02T20:21:09.4955286+00:00","game_version":"live-green-4-04-29","players":[{"puuid":"zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","deck_id":"81dc4d0a-cc23-4400-a32d-378794298a58_live_cte_deck_0","deck_code":"CQCQCAIDCMAQCBAIAEBAGAYBAYBROBQFBJUWU4DUQUA3OAICAEDASBACAUFGBIABAQAQKCRRAEDAGJIBA4FASAIHAMHA","factions":["faction_BandleCity_Name","faction_Noxus_Name"],"game_outcome":"win","order_of_play":1,"tagLine":"187","gameName":"Cancler"},{"puuid":"uvm0RixjrLuPmxGECbAv3vLgqgIiHOOu4VJHEzL1uJT_IQtu5y3FDfTWfs5gffhvh7wgN2XKI1PUXQ","deck_id":"81dc4d0a-cc23-4400-a32d-378794298a58_live_cte_deck_2","deck_code":"CUDACBAGBUAQMBQ2AEDASIYBAYBRIAIGA4CAIAQGDAUDOOQEAEBAMPABAYBBOAIGBQNAGBQGA4JB2AIBAYEQM","factions":["faction_Aatrox_Name","faction_Bilgewater_Name"],"game_outcome":"loss","order_of_play":0,"tagLine":"BR1","gameName":"ChibiGangsta"}],"total_turn_count":22}},{"metadata":{"data_version":"2","match_id":"a58640fb-b1ae-4e0d-83b4-95a100ca5a93","participants":["zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","uvm0RixjrLuPmxGECbAv3vLgqgIiHOOu4VJHEzL1uJT_IQtu5y3FDfTWfs5gffhvh7wgN2XKI1PUXQ"]},"info":{"game_mode":"StandardGauntletLobby","game_type":"StandardGauntlet","game_start_time_utc":"2023-05-02T20:12:16.6238170+00:00","game_version":"live-green-4-04-29","players":[{"puuid":"zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","deck_id":"81dc4d0a-cc23-4400-a32d-378794298a58_live_cte_deck_0","deck_code":"CQCQCAIDCMAQCBAIAEBAGAYBAYBROBQFBJUWU4DUQUA3OAICAEDASBACAUFGBIABAQAQKCRRAEDAGJIBA4FASAIHAMHA","factions":["faction_BandleCity_Name","faction_Noxus_Name"],"game_outcome":"loss","order_of_play":0,"tagLine":"187","gameName":"Cancler"},{"puuid":"uvm0RixjrLuPmxGECbAv3vLgqgIiHOOu4VJHEzL1uJT_IQtu5y3FDfTWfs5gffhvh7wgN2XKI1PUXQ","deck_id":"81dc4d0a-cc23-4400-a32d-378794298a58_live_cte_deck_1","deck_code":"CQDACAIDCMAQCBAIAEBAGAYBAYFBUAIGAMLQKBIKNFYHJBIBW4AQGAIBAMUACBYDBYBAKCTANIBACAIDBMAQMCIE","factions":["faction_BandleCity_Name","faction_Noxus_Name"],"game_outcome":"win","order_of_play":1,"tagLine":"BR1","gameName":"ChibiGangsta"}],"total_turn_count":31}},{"metadata":{"data_version":"2","match_id":"b28ccb94-2366-47d7-a194-ca146592549b","participants":["zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","uvm0RixjrLuPmxGECbAv3vLgqgIiHOOu4VJHEzL1uJT_IQtu5y3FDfTWfs5gffhvh7wgN2XKI1PUXQ"]},"info":{"game_mode":"StandardGauntletLobby","game_type":"StandardGauntlet","game_start_time_utc":"2023-05-02T20:01:18.1745917+00:00","game_version":"live-green-4-04-29","players":[{"puuid":"zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","deck_id":"81dc4d0a-cc23-4400-a32d-378794298a58_live_cte_deck_2","deck_code":"CQCACBYKBEBAOBQEBABQMCQPCEKQMBQGAYDRYHRCEMBACBIKYYAQCBYGBYAA","factions":["faction_BandleCity_Name","faction_Bilgewater_Name"],"game_outcome":"win","order_of_play":1,"tagLine":"187","gameName":"Cancler"},{"puuid":"uvm0RixjrLuPmxGECbAv3vLgqgIiHOOu4VJHEzL1uJT_IQtu5y3FDfTWfs5gffhvh7wgN2XKI1PUXQ","deck_id":"81dc4d0a-cc23-4400-a32d-378794298a58_live_cte_deck_2","deck_code":"CUDACBAGBUAQMBQ2AEDASIYBAYBRIAIGA4CAIAQGDAUDOOQEAEBAMPABAYBBOAIGBQNAGBQGA4JB2AIBAYEQM","factions":["faction_Aatrox_Name","faction_Bilgewater_Name"],"game_outcome":"loss","order_of_play":0,"tagLine":"BR1","gameName":"ChibiGangsta"}],"total_turn_count":35}},{"metadata":{"data_version":"2","match_id":"15b8018d-47d0-4146-bc63-9ca830bf388e","participants":["jPVISza_6SN9uXLLm231gvoDOjYakvWYx1qLK2UDOK7n3gY0SnHf6gxYsiTmIuRsBq2aXpWJa0Ja2g","zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA"]},"info":{"game_mode":"StandardGauntletLobby","game_type":"StandardGauntlet","game_start_time_utc":"2023-05-02T19:54:14.8072704+00:00","game_version":"live-green-4-04-29","players":[{"puuid":"zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","deck_id":"81dc4d0a-cc23-4400-a32d-378794298a58_live_cte_deck_2","deck_code":"CQCACBYKBEBAOBQEBABQMCQPCEKQMBQGAYDRYHRCEMBACBIKYYAQCBYGBYAA","factions":["faction_BandleCity_Name","faction_Bilgewater_Name"],"game_outcome":"win","order_of_play":0,"tagLine":"187","gameName":"Cancler"},{"puuid":"jPVISza_6SN9uXLLm231gvoDOjYakvWYx1qLK2UDOK7n3gY0SnHf6gxYsiTmIuRsBq2aXpWJa0Ja2g","deck_id":"81dc4d0a-cc23-4400-a32d-378794298a58_live_cte_deck_1","deck_code":"CIDQCAQDAMAQICINAEDASKQBAYBSSAIHAMDQEAIDCMUAMAYJDIOCGLBWLAAACAIBAMHQ","factions":["faction_MtTargon_Name","faction_Noxus_Name"],"game_outcome":"loss","order_of_play":1,"tagLine":"EUW","gameName":"Djeff the Dwarf"}],"total_turn_count":29}},{"metadata":{"data_version":"2","match_id":"64716545-7335-4c5b-aa70-5641b9115ead","participants":["jPVISza_6SN9uXLLm231gvoDOjYakvWYx1qLK2UDOK7n3gY0SnHf6gxYsiTmIuRsBq2aXpWJa0Ja2g","zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA"]},"info":{"game_mode":"StandardGauntletLobby","game_type":"StandardGauntlet","game_start_time_utc":"2023-05-02T19:49:14.0471282+00:00","game_version":"live-green-4-04-29","players":[{"puuid":"zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","deck_id":"81dc4d0a-cc23-4400-a32d-378794298a58_live_cte_deck_0","deck_code":"CQCQCAIDCMAQCBAIAEBAGAYBAYBROBQFBJUWU4DUQUA3OAICAEDASBACAUFGBIABAQAQKCRRAEDAGJIBA4FASAIHAMHA","factions":["faction_BandleCity_Name","faction_Noxus_Name"],"game_outcome":"win","order_of_play":1,"tagLine":"187","gameName":"Cancler"},{"puuid":"jPVISza_6SN9uXLLm231gvoDOjYakvWYx1qLK2UDOK7n3gY0SnHf6gxYsiTmIuRsBq2aXpWJa0Ja2g","deck_id":"81dc4d0a-cc23-4400-a32d-378794298a58_live_cte_deck_1","deck_code":"CIDQCAQDAMAQICINAEDASKQBAYBSSAIHAMDQEAIDCMUAMAYJDIOCGLBWLAAACAIBAMHQ","factions":["faction_MtTargon_Name","faction_Noxus_Name"],"game_outcome":"loss","order_of_play":0,"tagLine":"EUW","gameName":"Djeff the Dwarf"}],"total_turn_count":16}},{"metadata":{"data_version":"2","match_id":"c9bfcde4-89fe-437e-bb53-b867d0d28a38","participants":["f1eMfBvhV_4jX2trvo01082EIA2geJD92Gd1-BxS_VbO7Fwv20RHlhN9XvuQbSUNdJjU6eKfA3x5vQ","zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA"]},"info":{"game_mode":"StandardGauntletLobby","game_type":"StandardGauntlet","game_start_time_utc":"2023-05-02T19:40:29.2505843+00:00","game_version":"live-green-4-04-29","players":[{"puuid":"zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","deck_id":"81dc4d0a-cc23-4400-a32d-378794298a58_live_cte_deck_1","deck_code":"CUBQCAQAAIAQMBAIAQDAACQRCUOQOAIBAAOQCBIABQAQMAISAEDAYGQBAYDQIAIHAACQGBQABMMDABABAIAAMAIEAABQCBQACIAQMCIG","factions":["faction_Aatrox_Name","faction_Demacia_Name"],"game_outcome":"win","order_of_play":1,"tagLine":"187","gameName":"Cancler"},{"puuid":"f1eMfBvhV_4jX2trvo01082EIA2geJD92Gd1-BxS_VbO7Fwv20RHlhN9XvuQbSUNdJjU6eKfA3x5vQ","deck_id":"81dc4d0a-cc23-4400-a32d-378794298a58_live_cte_deck_0","deck_code":"CQCACAIDCMAQCBAIAEDAGFYHAUFGA2LQOSCQDJYBW4AQKAIBAMMQCAQDAMAQKCTKAEDASBABA4BQ4AA","factions":["faction_BandleCity_Name","faction_Noxus_Name"],"game_outcome":"loss","order_of_play":0,"tagLine":"EUW","gameName":"gilgamma"}],"total_turn_count":34}},{"metadata":{"data_version":"2","match_id":"9ccd75c3-1402-4c20-b2cd-39f1030a8079","participants":["zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","f1eMfBvhV_4jX2trvo01082EIA2geJD92Gd1-BxS_VbO7Fwv20RHlhN9XvuQbSUNdJjU6eKfA3x5vQ"]},"info":{"game_mode":"StandardGauntletLobby","game_type":"StandardGauntlet","game_start_time_utc":"2023-05-02T19:33:10.4124700+00:00","game_version":"live-green-4-04-29","players":[{"puuid":"zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","deck_id":"81dc4d0a-cc23-4400-a32d-378794298a58_live_cte_deck_2","deck_code":"CQCACBYKBEBAOBQEBABQMCQPCEKQMBQGAYDRYHRCEMBACBIKYYAQCBYGBYAA","factions":["faction_BandleCity_Name","faction_Bilgewater_Name"],"game_outcome":"win","order_of_play":0,"tagLine":"187","gameName":"Cancler"},{"puuid":"f1eMfBvhV_4jX2trvo01082EIA2geJD92Gd1-BxS_VbO7Fwv20RHlhN9XvuQbSUNdJjU6eKfA3x5vQ","deck_id":"81dc4d0a-cc23-4400-a32d-378794298a58_live_cte_deck_0","deck_code":"CQCACAIDCMAQCBAIAEDAGFYHAUFGA2LQOSCQDJYBW4AQKAIBAMMQCAQDAMAQKCTKAEDASBABA4BQ4AA","factions":["faction_BandleCity_Name","faction_Noxus_Name"],"game_outcome":"loss","order_of_play":1,"tagLine":"EUW","gameName":"gilgamma"}],"total_turn_count":31}},{"metadata":{"data_version":"2","match_id":"3822e34f-2de4-470e-af2d-80dc44cf909b","participants":["zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","9LJEH0w0BgLTsBgE5_gWUjBCdOTPSm7b-u5v5nTIdTAtXhbHNcIUuZofHBvoZZfOj-m6HkUxqmENtg"]},"info":{"game_mode":"StandardGauntletLobby","game_type":"StandardGauntlet","game_start_time_utc":"2023-05-02T19:21:20.1990177+00:00","game_version":"live-green-4-04-29","players":[{"puuid":"zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","deck_id":"81dc4d0a-cc23-4400-a32d-378794298a58_live_cte_deck_0","deck_code":"CQCQCAIDCMAQCBAIAEBAGAYBAYBROBQFBJUWU4DUQUA3OAICAEDASBACAUFGBIABAQAQKCRRAEDAGJIBA4FASAIHAMHA","factions":["faction_BandleCity_Name","faction_Noxus_Name"],"game_outcome":"win","order_of_play":0,"tagLine":"187","gameName":"Cancler"},{"puuid":"9LJEH0w0BgLTsBgE5_gWUjBCdOTPSm7b-u5v5nTIdTAtXhbHNcIUuZofHBvoZZfOj-m6HkUxqmENtg","deck_id":"81dc4d0a-cc23-4400-a32d-378794298a58_live_cte_deck_2","deck_code":"CICQCAIFAEAQIBIPAEDAKKYCAICQQCQFAIDBOLBPGU4AEAQCAYOSOAQGAYRCMAICAIDB4JI","factions":["faction_Bilgewater_Name","faction_ShadowIsles_Name"],"game_outcome":"loss","order_of_play":1,"tagLine":"66282","gameName":"КЛОУН БОН"}],"total_turn_count":22}},{"metadata":{"data_version":"2","match_id":"08e341ac-7fd7-4fd2-a4bb-e3c1943cecae","participants":["9LJEH0w0BgLTsBgE5_gWUjBCdOTPSm7b-u5v5nTIdTAtXhbHNcIUuZofHBvoZZfOj-m6HkUxqmENtg","zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA"]},"info":{"game_mode":"StandardGauntletLobby","game_type":"StandardGauntlet","game_start_time_utc":"2023-05-02T19:12:12.6183148+00:00","game_version":"live-green-4-04-29","players":[{"puuid":"zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","deck_id":"81dc4d0a-cc23-4400-a32d-378794298a58_live_cte_deck_2","deck_code":"CQCACBYKBEBAOBQEBABQMCQPCEKQMBQGAYDRYHRCEMBACBIKYYAQCBYGBYAA","factions":["faction_BandleCity_Name","faction_Bilgewater_Name"],"game_outcome":"win","order_of_play":0,"tagLine":"187","gameName":"Cancler"},{"puuid":"9LJEH0w0BgLTsBgE5_gWUjBCdOTPSm7b-u5v5nTIdTAtXhbHNcIUuZofHBvoZZfOj-m6HkUxqmENtg","deck_id":"81dc4d0a-cc23-4400-a32d-378794298a58_live_cte_deck_2","deck_code":"CICQCAIFAEAQIBIPAEDAKKYCAICQQCQFAIDBOLBPGU4AEAQCAYOSOAQGAYRCMAICAIDB4JI","factions":["faction_Bilgewater_Name","faction_ShadowIsles_Name"],"game_outcome":"loss","order_of_play":1,"tagLine":"66282","gameName":"КЛОУН БОН"}],"total_turn_count":35}},{"metadata":{"data_version":"2","match_id":"4e333656-fb01-4945-972d-d28f8290c893","participants":["zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","2FFEF0hD4CQiSehhimh82o65vfgE7vX3Z3moaXa_vKKypxShk0ZPDVetmqIQeEdIJL1Y3QG3mVo2yw"]},"info":{"game_mode":"StandardGauntletLobby","game_type":"StandardGauntlet","game_start_time_utc":"2023-05-02T19:02:00.7095725+00:00","game_version":"live-green-4-04-29","players":[{"puuid":"zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","deck_id":"81dc4d0a-cc23-4400-a32d-378794298a58_live_cte_deck_0","deck_code":"CQCQCAIDCMAQCBAIAEBAGAYBAYBROBQFBJUWU4DUQUA3OAICAEDASBACAUFGBIABAQAQKCRRAEDAGJIBA4FASAIHAMHA","factions":["faction_BandleCity_Name","faction_Noxus_Name"],"game_outcome":"win","order_of_play":0,"tagLine":"187","gameName":"Cancler"},{"puuid":"2FFEF0hD4CQiSehhimh82o65vfgE7vX3Z3moaXa_vKKypxShk0ZPDVetmqIQeEdIJL1Y3QG3mVo2yw","deck_id":"81dc4d0a-cc23-4400-a32d-378794298a58_live_cte_deck_2","deck_code":"CQDACAIDCMAQCBAIAEBAGAYBAYFBUAIGAMLQKBIKNFYHJBIBW4AQGAIBAMUACBYDBYBAKCTANIBACAIDBMAQMCIE","factions":["faction_BandleCity_Name","faction_Noxus_Name"],"game_outcome":"loss","order_of_play":1,"tagLine":"cope","gameName":"COPE Jinden"}],"total_turn_count":31}}]
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