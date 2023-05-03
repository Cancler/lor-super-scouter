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
        // if(match_ids){
        //     const slice = match_ids.slice(0, 10)
        //     for(const match_id of slice){
        //         const match = await riot_api.lorMatch.getByMatchId({
        //             region: selected_region.value,
        //             match_id: match_id
        //         })
        //         if(match){
        //             const player_1 = match.info.players.filter(x => {
        //                 return x.puuid === opponent_puuid.value
        //             })[0]
        //             player_1.tagLine = opponent_tag_line.value
        //             player_1.gameName = opponent_game_name.value
        //
        //             const player_2 = match.info.players.filter(x => {
        //                 return x.puuid !== opponent_puuid.value
        //             })[0]
        //             const account = await riot_api.account.getByPUUID(
        //                 {
        //                     region: Platform.EUROPE,
        //                     puuid: player_2.puuid
        //                 }
        //             )
        //             player_2.tagLine = account.tagLine
        //             player_2.gameName = account.gameName
        //
        //             match.info.players = [player_1, player_2]
        //
        //             opponent_history.value.push(match)
        //         }
        //     }
        // }

        opponent_history.value = [{"metadata":{"data_version":"2","match_id":"2807ea20-7db7-4fd3-a809-0b587d9aac48","participants":["zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","PPYIuU2iMUDdy5dhyb2ja9fD-otAsl4XcEZq13o9_DzUBEhTlw2Rpmk_UpYQjVJh92XR1dCoezeH9A"]},"info":{"game_mode":"Constructed","game_type":"Ranked","game_start_time_utc":"2023-05-03T14:37:36.3619293+00:00","game_version":"live-green-4-04-29","players":[{"puuid":"zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","deck_id":"f29d55ce-e7bf-470a-b511-877bfd6f309a","deck_code":"CIEACAIDFAAQEAYDAEBQMFABAYDB4AIGAMUQCBYGDIBAOAYHBACAEBQUCY3TUAIBAIDCQAQBAIDBEAIHAMBQ","factions":["faction_Bilgewater_Name","faction_Noxus_Name"],"game_outcome":"win","order_of_play":1,"tagLine":"187","gameName":"Cancler"},{"puuid":"PPYIuU2iMUDdy5dhyb2ja9fD-otAsl4XcEZq13o9_DzUBEhTlw2Rpmk_UpYQjVJh92XR1dCoezeH9A","deck_id":"4f27b466-8160-4b50-ad30-f84f78f2e42a","deck_code":"CMBQCBQHAUCAIBQBAMCQ6BYEA4ARGFSBIRFFAAIBAQDUKAQBAQDTWAIGAYWQ","factions":["faction_Bilgewater_Name","faction_Shurima_Name"],"game_outcome":"loss","order_of_play":0,"tagLine":"EUW","gameName":"Gab1603"}],"total_turn_count":17}},{"metadata":{"data_version":"2","match_id":"45f330a4-a02d-4d22-8099-0b78e11f3546","participants":["zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","QOAe1gdWsX5lVHAnnSGHHX57zLgNc_3BR-HJbihDQJV9GCrj_rHJYXVWcBiH9DjM7AcGlsS4WRokHQ"]},"info":{"game_mode":"Constructed","game_type":"Ranked","game_start_time_utc":"2023-05-03T14:34:52.6027851+00:00","game_version":"live-green-4-04-29","players":[{"puuid":"zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","deck_id":"f29d55ce-e7bf-470a-b511-877bfd6f309a","deck_code":"CIEACAIDFAAQEAYDAEBQMFABAYDB4AIGAMUQCBYGDIBAOAYHBACAEBQUCY3TUAIBAIDCQAQBAIDBEAIHAMBQ","factions":["faction_Bilgewater_Name","faction_Noxus_Name"],"game_outcome":"win","order_of_play":1,"tagLine":"187","gameName":"Cancler"},{"puuid":"QOAe1gdWsX5lVHAnnSGHHX57zLgNc_3BR-HJbihDQJV9GCrj_rHJYXVWcBiH9DjM7AcGlsS4WRokHQ","deck_id":"730be3e7-cc60-459e-b8db-daae6f8835c2","deck_code":"CQCACBYKBEBAMAYODABQKCRROSQQCAYGBIHRCFIEAEBQGDIBAUFNKAIBA4BQ4AQGBIJSOAYBAEBTGAIFBLDACAIGBILQ","factions":["faction_BandleCity_Name","faction_Noxus_Name"],"game_outcome":"loss","order_of_play":0,"tagLine":"EUNE","gameName":"ImPyroh"}],"total_turn_count":9}},{"metadata":{"data_version":"2","match_id":"6f704255-f248-4469-beac-6eec331d8e46","participants":["ZlG8BagdzLbP7b-nDzeeP3ygNA1iOnzt5pShxybUN4QqXI68zbY4lv5WJyJlwlzYChaKKrSibfOiqQ","zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA"]},"info":{"game_mode":"Constructed","game_type":"Ranked","game_start_time_utc":"2023-05-03T14:26:48.5880655+00:00","game_version":"live-green-4-04-29","players":[{"puuid":"zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","deck_id":"f29d55ce-e7bf-470a-b511-877bfd6f309a","deck_code":"CIEACAIDFAAQEAYDAEBQMFABAYDB4AIGAMUQCBYGDIBAOAYHBACAEBQUCY3TUAIBAIDCQAQBAIDBEAIHAMBQ","factions":["faction_Bilgewater_Name","faction_Noxus_Name"],"game_outcome":"win","order_of_play":0,"tagLine":"187","gameName":"Cancler"},{"puuid":"ZlG8BagdzLbP7b-nDzeeP3ygNA1iOnzt5pShxybUN4QqXI68zbY4lv5WJyJlwlzYChaKKrSibfOiqQ","deck_id":"48c2e3e4-91b0-4962-a1a3-36836bab48b3","deck_code":"CECACBQBCIBACAY7EEBAIAYEB4CACAILDYTCSAQCAEAQIFQCAYARYIYDAECAGCACAEAQCKQCAEBRUNI","factions":["faction_Freljord_Name","faction_Noxus_Name"],"game_outcome":"loss","order_of_play":1,"tagLine":"EUW","gameName":"S1lv3rsc"}],"total_turn_count":16}},{"metadata":{"data_version":"2","match_id":"aaf21a0b-19e0-42bd-a0ee-24a563a8caab","participants":["3DklkzG_O09gZVBadFmdju-e3_FZ9iCrTXjwzOBva0ygXbg-bWGKBNjpKZq3sH7LwhiHvNorodaeJA","zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA"]},"info":{"game_mode":"Constructed","game_type":"Ranked","game_start_time_utc":"2023-05-03T13:27:13.4227517+00:00","game_version":"live-green-4-04-29","players":[{"puuid":"zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","deck_id":"f29d55ce-e7bf-470a-b511-877bfd6f309a","deck_code":"CIEACAIDFAAQEAYDAEBQMFABAYDB4AIGAMUQCBYGDIBAOAYHBACAEBQUCY3TUAIBAIDCQAQBAIDBEAIHAMBQ","factions":["faction_Bilgewater_Name","faction_Noxus_Name"],"game_outcome":"win","order_of_play":1,"tagLine":"187","gameName":"Cancler"},{"puuid":"3DklkzG_O09gZVBadFmdju-e3_FZ9iCrTXjwzOBva0ygXbg-bWGKBNjpKZq3sH7LwhiHvNorodaeJA","deck_id":"f4342735-8d2e-46ee-ab8d-63283d354d7c","deck_code":"CUCQCBQCEIAQMCJIAEDAKBQCAYBRIFYCA4BQGBYIAEAQGCYBAYDCOAIGAERACBQJEAAQMAZCAEDAYCIBAYDQKAQGAQDSKAIBAMBQO","factions":["faction_Noxus_Name","faction_Varus_Name"],"game_outcome":"loss","order_of_play":0,"tagLine":"9410","gameName":"Rone 22"}],"total_turn_count":25}},{"metadata":{"data_version":"2","match_id":"708ce9ff-e57d-4bec-908e-af2bdebb254b","participants":["zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","VF5nB8GQcXXrC8sqx6AA6t7ZXZRNn3We8NsDIUVzk141op4fO6dv0-o_YCg1hTOeHThUtbrXS6TrIQ"]},"info":{"game_mode":"Constructed","game_type":"Ranked","game_start_time_utc":"2023-05-03T12:57:53.8366472+00:00","game_version":"live-green-4-04-29","players":[{"puuid":"zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","deck_id":"f29d55ce-e7bf-470a-b511-877bfd6f309a","deck_code":"CIEACAIDFAAQEAYDAEBQMFABAYDB4AIGAMUQCBYGDIBAOAYHBACAEBQUCY3TUAIBAIDCQAQBAIDBEAIHAMBQ","factions":["faction_Bilgewater_Name","faction_Noxus_Name"],"game_outcome":"win","order_of_play":1,"tagLine":"187","gameName":"Cancler"},{"puuid":"VF5nB8GQcXXrC8sqx6AA6t7ZXZRNn3We8NsDIUVzk141op4fO6dv0-o_YCg1hTOeHThUtbrXS6TrIQ","deck_id":"ee25f085-fcd9-414c-af80-4d2be7834004","deck_code":"CUDQCBQCEIAQMCJIAEDAYCIBAYDQKAQGAMLSEAQGAQDSKAQHAMBQOBABAYDCOAIGAERACBQJEAAQMAYUAIAQCAY3AEDAGJI","factions":["faction_Noxus_Name","faction_Varus_Name"],"game_outcome":"loss","order_of_play":0,"tagLine":"EUW","gameName":"DarkNatsu07"}],"total_turn_count":24}},{"metadata":{"data_version":"2","match_id":"01b28abb-ab29-486e-a6e9-96ae091161b3","participants":["zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","8xEAmB_3s8Xh515Aea260zLTihUlCQYsYIucClqr6u-_dujj5mKZfSm_5MS_2ccFkZLYVg1zqXyP6A"]},"info":{"game_mode":"Constructed","game_type":"Ranked","game_start_time_utc":"2023-05-03T12:52:52.3263078+00:00","game_version":"live-green-4-04-29","players":[{"puuid":"zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","deck_id":"f29d55ce-e7bf-470a-b511-877bfd6f309a","deck_code":"CIEACAIDFAAQEAYDAEBQMFABAYDB4AIGAMUQCBYGDIBAOAYHBACAEBQUCY3TUAIBAIDCQAQBAIDBEAIHAMBQ","factions":["faction_Bilgewater_Name","faction_Noxus_Name"],"game_outcome":"loss","order_of_play":0,"tagLine":"187","gameName":"Cancler"},{"puuid":"8xEAmB_3s8Xh515Aea260zLTihUlCQYsYIucClqr6u-_dujj5mKZfSm_5MS_2ccFkZLYVg1zqXyP6A","deck_id":"c3c39032-10a6-49b8-b560-a0162fdfb228","deck_code":"CMCACBQGFUAQMBYFAQCAMAIDAUHQOBAHAEJRMQKEJJIAAAIBAQDAI","factions":["faction_Bilgewater_Name","faction_Shurima_Name"],"game_outcome":"win","order_of_play":1,"tagLine":"3758","gameName":"Salem di Ozark"}],"total_turn_count":23}},{"metadata":{"data_version":"2","match_id":"6c70bf40-2944-4f2c-ac29-a7bff236e774","participants":["8qaJb55_p-PgfpNJt3ez0H6t-atrthq4bYnAm7G3pgW0RqJR7UtZJGUId0QFDUVVZYdqyvvs98FunQ","zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA"]},"info":{"game_mode":"Constructed","game_type":"Ranked","game_start_time_utc":"2023-05-03T12:48:39.9464972+00:00","game_version":"live-green-4-04-29","players":[{"puuid":"zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","deck_id":"f29d55ce-e7bf-470a-b511-877bfd6f309a","deck_code":"CIEACAIDFAAQEAYDAEBQMFABAYDB4AIGAMUQCBYGDIBAOAYHBACAEBQUCY3TUAIBAIDCQAQBAIDBEAIHAMBQ","factions":["faction_Bilgewater_Name","faction_Noxus_Name"],"game_outcome":"win","order_of_play":0,"tagLine":"187","gameName":"Cancler"},{"puuid":"8qaJb55_p-PgfpNJt3ez0H6t-atrthq4bYnAm7G3pgW0RqJR7UtZJGUId0QFDUVVZYdqyvvs98FunQ","deck_id":"030a6fba-f923-47a1-a3cb-231abd107b73","deck_code":"CQBQCBYKBEAQOBQIA4CQU2LQOSCQDJYBW4A4MAIDAEDASBABA4DAIAYFBJQIQANBAEBQCAIEBAAQKCUEAEAQMBQ5","factions":["faction_BandleCity_Name","faction_Bilgewater_Name"],"game_outcome":"loss","order_of_play":1,"tagLine":"EUW","gameName":"Past in Shame"}],"total_turn_count":21}},{"metadata":{"data_version":"2","match_id":"3a856bab-744f-411d-b740-319753968a82","participants":["zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","x0DvreQ5iVvSjQjHyvL97NKMU1bwxsFzDzXnTo7xBGPJRUWN0eNzPtPh1B9KmP2ncnDri4vGWFGPmg"]},"info":{"game_mode":"Constructed","game_type":"Ranked","game_start_time_utc":"2023-05-03T12:40:28.8015243+00:00","game_version":"live-green-4-04-29","players":[{"puuid":"zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","deck_id":"f29d55ce-e7bf-470a-b511-877bfd6f309a","deck_code":"CIEACAIDFAAQEAYDAEBQMFABAYDB4AIGAMUQCBYGDIBAOAYHBACAEBQUCY3TUAIBAIDCQAQBAIDBEAIHAMBQ","factions":["faction_Bilgewater_Name","faction_Noxus_Name"],"game_outcome":"loss","order_of_play":1,"tagLine":"187","gameName":"Cancler"},{"puuid":"x0DvreQ5iVvSjQjHyvL97NKMU1bwxsFzDzXnTo7xBGPJRUWN0eNzPtPh1B9KmP2ncnDri4vGWFGPmg","deck_id":"2954398f-17f1-4d20-8c2c-400a4649c435","deck_code":"CIDQCAQDAMAQICINAEDASKQBAYBSSAIHAMDQEAIDCMUAMAYJDIOCGLBWLAAACAIBAMMQ","factions":["faction_MtTargon_Name","faction_Noxus_Name"],"game_outcome":"win","order_of_play":0,"tagLine":"EUW","gameName":"Tilted2211"}],"total_turn_count":31}},{"metadata":{"data_version":"2","match_id":"59ad4d02-9bfa-46c3-804c-65740446463e","participants":["cxHCaoJSoR9tgcMGSW72qFDs1L-ll0zD1Affssg4MojkEo17cDELbv9QderO-i6_fjA35crSL0gf1Q","zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA"]},"info":{"game_mode":"Constructed","game_type":"Ranked","game_start_time_utc":"2023-05-03T12:36:46.7529280+00:00","game_version":"live-green-4-04-29","players":[{"puuid":"zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","deck_id":"f29d55ce-e7bf-470a-b511-877bfd6f309a","deck_code":"CIEACAIDFAAQEAYDAEBQMFABAYDB4AIGAMUQCBYGDIBAOAYHBACAEBQUCY3TUAIBAIDCQAQBAIDBEAIHAMBQ","factions":["faction_Bilgewater_Name","faction_Noxus_Name"],"game_outcome":"win","order_of_play":1,"tagLine":"187","gameName":"Cancler"},{"puuid":"cxHCaoJSoR9tgcMGSW72qFDs1L-ll0zD1Affssg4MojkEo17cDELbv9QderO-i6_fjA35crSL0gf1Q","deck_id":"f76ffd78-25ab-45e7-aac8-86f96b316d37","deck_code":"CMCACBQGFUAQMBYFAQCAMAIDAUHQMBAHCMLECRCKKAAQEBAHAFCQA","factions":["faction_Bilgewater_Name","faction_Shurima_Name"],"game_outcome":"loss","order_of_play":0,"tagLine":"EUW","gameName":"Qwakkie"}],"total_turn_count":22}},{"metadata":{"data_version":"2","match_id":"22f0ff44-b6fa-4869-875b-f9674e4a0617","participants":["R4P7tgunzu3WICVCOElYZwJ7yN7y8bI7Yyr2Je_JpSeSWHYUML7Ym2pi2VwpOnV8BwFpS1z4_5F1tw","zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA"]},"info":{"game_mode":"Constructed","game_type":"Ranked","game_start_time_utc":"2023-05-03T12:33:35.0293244+00:00","game_version":"live-green-4-04-29","players":[{"puuid":"zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","deck_id":"f29d55ce-e7bf-470a-b511-877bfd6f309a","deck_code":"CIEACAIDFAAQEAYDAEBQMFABAYDB4AIGAMUQCBYGDIBAOAYHBACAEBQUCY3TUAIBAIDCQAQBAIDBEAIHAMBQ","factions":["faction_Bilgewater_Name","faction_Noxus_Name"],"game_outcome":"loss","order_of_play":0,"tagLine":"187","gameName":"Cancler"},{"puuid":"R4P7tgunzu3WICVCOElYZwJ7yN7y8bI7Yyr2Je_JpSeSWHYUML7Ym2pi2VwpOnV8BwFpS1z4_5F1tw","deck_id":"231f577c-fbea-4936-a67b-56dda326bde6","deck_code":"CQCQCAIEBAAQMABJAEDASBABA4FASCIFBJQGS2TUQUAZEANAAGTQDNYBAAAQCBQKC4","factions":["faction_BandleCity_Name","faction_Demacia_Name"],"game_outcome":"win","order_of_play":1,"tagLine":"insan","gameName":"manmamato"}],"total_turn_count":20}},{"metadata":{"data_version":"2","match_id":"95592eca-3b4a-4f47-8f54-4855eea22b87","participants":["zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","5mDDs_vbMPnN1nL1K_Qb6Kt2jp38iGBX0PyIe12SPbJ6FdBeDHrjAMrEikF1IdzvnIZGGFI6BcQu4Q"]},"info":{"game_mode":"Constructed","game_type":"Ranked","game_start_time_utc":"2023-05-03T12:26:36.2128544+00:00","game_version":"live-green-4-04-29","players":[{"puuid":"zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","deck_id":"f29d55ce-e7bf-470a-b511-877bfd6f309a","deck_code":"CIEACAIDFAAQEAYDAEBQMFABAYDB4AIGAMUQCBYGDIBAOAYHBACAEBQUCY3TUAIBAIDCQAQBAIDBEAIHAMBQ","factions":["faction_Bilgewater_Name","faction_Noxus_Name"],"game_outcome":"loss","order_of_play":0,"tagLine":"187","gameName":"Cancler"},{"puuid":"5mDDs_vbMPnN1nL1K_Qb6Kt2jp38iGBX0PyIe12SPbJ6FdBeDHrjAMrEikF1IdzvnIZGGFI6BcQu4Q","deck_id":"81bf9321-bf0e-44df-bc78-aeb286b18a36","deck_code":"CQCACBQFCQAQOCQJAIAQKAI6AUCQU2LUQUA2OANXAECACBQJAQAQMBJNAIAQKFBRAICQUYEEAEAQCBQFEA","factions":["faction_BandleCity_Name","faction_ShadowIsles_Name"],"game_outcome":"win","order_of_play":1,"tagLine":"EUW","gameName":"Meganoz"}],"total_turn_count":39}},{"metadata":{"data_version":"2","match_id":"b39a283a-9e71-4fb6-af41-570fbcbbcb02","participants":["Zqnygpe7vpDmRIYIYLsw42Uj3QZODdHMopG5NglXgcb7L05auGLwO1yfhQrxPPNd1kW4VlMSOqAq3w","zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA"]},"info":{"game_mode":"Constructed","game_type":"Ranked","game_start_time_utc":"2023-05-03T12:20:16.2314049+00:00","game_version":"live-green-4-04-29","players":[{"puuid":"zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","deck_id":"f29d55ce-e7bf-470a-b511-877bfd6f309a","deck_code":"CIEACAIDFAAQEAYDAEBQMFABAYDB4AIGAMUQCBYGDIBAOAYHBACAEBQUCY3TUAIBAIDCQAQBAIDBEAIHAMBQ","factions":["faction_Bilgewater_Name","faction_Noxus_Name"],"game_outcome":"loss","order_of_play":0,"tagLine":"187","gameName":"Cancler"},{"puuid":"Zqnygpe7vpDmRIYIYLsw42Uj3QZODdHMopG5NglXgcb7L05auGLwO1yfhQrxPPNd1kW4VlMSOqAq3w","deck_id":"6a72f57b-d103-459b-8b83-8412af91b63f","deck_code":"CECACBYDA4BACAZHFABAKAYEAYDQCBAMBUOCMKBNGQBACAIEAEAQKBAZAA","factions":["faction_Noxus_Name","faction_Piltover_Name"],"game_outcome":"win","order_of_play":1,"tagLine":"EUW","gameName":"Rublax"}],"total_turn_count":26}},{"metadata":{"data_version":"2","match_id":"8db4c223-bd81-4e09-980d-a86f23a149d8","participants":["S4G2CPCaTNyHOSP7cj0-OlsJwRMIASxi5pJVA2z9z5Iv_VuZO9F0_23z9pcT0yHKRZ-57wK41rD7DA","zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA"]},"info":{"game_mode":"Constructed","game_type":"Ranked","game_start_time_utc":"2023-05-03T12:11:28.1759063+00:00","game_version":"live-green-4-04-29","players":[{"puuid":"zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","deck_id":"f29d55ce-e7bf-470a-b511-877bfd6f309a","deck_code":"CIEACAIDFAAQEAYDAEBQMFABAYDB4AIGAMUQCBYGDIBAOAYHBACAEBQUCY3TUAIBAIDCQAQBAIDBEAIHAMBQ","factions":["faction_Bilgewater_Name","faction_Noxus_Name"],"game_outcome":"loss","order_of_play":0,"tagLine":"187","gameName":"Cancler"},{"puuid":"S4G2CPCaTNyHOSP7cj0-OlsJwRMIASxi5pJVA2z9z5Iv_VuZO9F0_23z9pcT0yHKRZ-57wK41rD7DA","deck_id":"46bff853-b3b6-4bb0-ba5a-14b338ecbdd1","deck_code":"CMBQCBIABQAQOAAFAUDAOBYIBEFCEBABAIAAUAIEAABQEAIABQGQEBAHHNTQKAICAABACBQAAYAQMBIDAIAQACI2AICAOT3N","factions":["faction_Demacia_Name","faction_Shurima_Name"],"game_outcome":"win","order_of_play":1,"tagLine":"6666","gameName":"squirttaylor"}],"total_turn_count":26}},{"metadata":{"data_version":"2","match_id":"a468bbd4-e80a-40e7-bc17-ef73417ea7f0","participants":["zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","0dubwB-P2EAd_hAdGPdXxqSpOA5jR6jN3b1mKKRVGq5w0aFA2YKwndUphZe0QGZE2ScNw4c7jqbiwA"]},"info":{"game_mode":"Constructed","game_type":"Ranked","game_start_time_utc":"2023-05-03T12:05:46.8951176+00:00","game_version":"live-green-4-04-29","players":[{"puuid":"zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","deck_id":"f29d55ce-e7bf-470a-b511-877bfd6f309a","deck_code":"CIEACAIDFAAQEAYDAEBQMFABAYDB4AIGAMUQCBYGDIBAOAYHBACAEBQUCY3TUAIBAIDCQAQBAIDBEAIHAMBQ","factions":["faction_Bilgewater_Name","faction_Noxus_Name"],"game_outcome":"win","order_of_play":1,"tagLine":"187","gameName":"Cancler"},{"puuid":"0dubwB-P2EAd_hAdGPdXxqSpOA5jR6jN3b1mKKRVGq5w0aFA2YKwndUphZe0QGZE2ScNw4c7jqbiwA","deck_id":"647cfd78-0eab-4361-acae-be5160609f67","deck_code":"CEDQCAICFEAQCBBUAEBAEBIBAMCAWAIHAQEQEBQECIKAIBYCBMGRCFACAEAQEMICAYCASIQBAEDQEEY","factions":["faction_Ionia_Name","faction_Piltover_Name"],"game_outcome":"loss","order_of_play":0,"tagLine":"1628","gameName":"Haym Arco"}],"total_turn_count":25}},{"metadata":{"data_version":"2","match_id":"c46e98e2-6cac-48e0-825b-c420b2a1d3bf","participants":["zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","9BlLzTrVxJGlXk4JA50r23VdIRyqNmeEJ4NXG6pedGPKuSd2otmiRxWWvr5shYRCfaZmV4LPJzmUpg"]},"info":{"game_mode":"Constructed","game_type":"Ranked","game_start_time_utc":"2023-05-03T11:58:49.9352121+00:00","game_version":"live-green-4-04-29","players":[{"puuid":"zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","deck_id":"f29d55ce-e7bf-470a-b511-877bfd6f309a","deck_code":"CIEACAIDFAAQEAYDAEBQMFABAYDB4AIGAMUQCBYGDIBAOAYHBACAEBQUCY3TUAIBAIDCQAQBAIDBEAIHAMBQ","factions":["faction_Bilgewater_Name","faction_Noxus_Name"],"game_outcome":"loss","order_of_play":1,"tagLine":"187","gameName":"Cancler"},{"puuid":"9BlLzTrVxJGlXk4JA50r23VdIRyqNmeEJ4NXG6pedGPKuSd2otmiRxWWvr5shYRCfaZmV4LPJzmUpg","deck_id":"1b07bbb5-19c4-450b-92cd-3aa70bb86010","deck_code":"CQCQCBIFBAAQOCQJAIDAKFBAAMCQUMK5MIBQMCQPCEKQGAIFBIAQCBIFBIBACBIBGEBACAIFB4AQKCS6","factions":["faction_BandleCity_Name","faction_ShadowIsles_Name"],"game_outcome":"win","order_of_play":0,"tagLine":"EUW","gameName":"guncika"}],"total_turn_count":35}},{"metadata":{"data_version":"2","match_id":"89cc567b-2fbb-47d0-9cc5-24bab136759a","participants":["zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","Ceu2GXbN6EW5b5RUgRszEIcJatqPSWrWpGZGLHOU6d87v4f6KF8neW4XTlpYc7kEEhwcSfcnPNjHrg"]},"info":{"game_mode":"Constructed","game_type":"Ranked","game_start_time_utc":"2023-05-03T11:54:13.6041434+00:00","game_version":"live-green-4-04-29","players":[{"puuid":"zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","deck_id":"f29d55ce-e7bf-470a-b511-877bfd6f309a","deck_code":"CIEACAIDFAAQEAYDAEBQMFABAYDB4AIGAMUQCBYGDIBAOAYHBACAEBQUCY3TUAIBAIDCQAQBAIDBEAIHAMBQ","factions":["faction_Bilgewater_Name","faction_Noxus_Name"],"game_outcome":"loss","order_of_play":0,"tagLine":"187","gameName":"Cancler"},{"puuid":"Ceu2GXbN6EW5b5RUgRszEIcJatqPSWrWpGZGLHOU6d87v4f6KF8neW4XTlpYc7kEEhwcSfcnPNjHrg","deck_id":"0cb7ddfc-8d85-42c1-a9e6-058abb08c075","deck_code":"CUEQCAQGHQAQEAYDAECASDIBAUAQMAIGBQBACBYDBYBACAYPFABAMAQDB4BAMAYIBQBACAIEBUAQEAYEAA","factions":["faction_Jhin_Name","faction_Noxus_Name"],"game_outcome":"win","order_of_play":1,"tagLine":"EUW","gameName":"Poοpy"}],"total_turn_count":19}},{"metadata":{"data_version":"2","match_id":"2d9682ce-de60-447b-b545-7621f5994745","participants":["zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","0dubwB-P2EAd_hAdGPdXxqSpOA5jR6jN3b1mKKRVGq5w0aFA2YKwndUphZe0QGZE2ScNw4c7jqbiwA"]},"info":{"game_mode":"Constructed","game_type":"Ranked","game_start_time_utc":"2023-05-03T11:49:55.2057389+00:00","game_version":"live-green-4-04-29","players":[{"puuid":"zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","deck_id":"f29d55ce-e7bf-470a-b511-877bfd6f309a","deck_code":"CIEACAIDFAAQEAYDAEBQMFABAYDB4AIGAMUQCBYGDIBAOAYHBACAEBQUCY3TUAIBAIDCQAQBAIDBEAIHAMBQ","factions":["faction_Bilgewater_Name","faction_Noxus_Name"],"game_outcome":"win","order_of_play":1,"tagLine":"187","gameName":"Cancler"},{"puuid":"0dubwB-P2EAd_hAdGPdXxqSpOA5jR6jN3b1mKKRVGq5w0aFA2YKwndUphZe0QGZE2ScNw4c7jqbiwA","deck_id":"2ab935da-3404-4a71-8b12-85f6c5eb3fc3","deck_code":"CMDACAIABQAQEAAKAECAAAYBAUAAYAQEA5FG2BAGA4DQQCIKAEAQMAAGAYAQCAAJAEBAABABAQABAAIEA45QCBQABMBQMBYVEIUA","factions":["faction_Demacia_Name","faction_Shurima_Name"],"game_outcome":"loss","order_of_play":0,"tagLine":"1628","gameName":"Haym Arco"}],"total_turn_count":16}},{"metadata":{"data_version":"2","match_id":"db9c9ca6-cf07-455c-83df-6afc4f08494f","participants":["9BlLzTrVxJGlXk4JA50r23VdIRyqNmeEJ4NXG6pedGPKuSd2otmiRxWWvr5shYRCfaZmV4LPJzmUpg","zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA"]},"info":{"game_mode":"Constructed","game_type":"Ranked","game_start_time_utc":"2023-05-03T11:39:57.6368215+00:00","game_version":"live-green-4-04-29","players":[{"puuid":"zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","deck_id":"f29d55ce-e7bf-470a-b511-877bfd6f309a","deck_code":"CIEACAIDFAAQEAYDAEBQMFABAYDB4AIGAMUQCBYGDIBAOAYHBACAEBQUCY3TUAIBAIDCQAQBAIDBEAIHAMBQ","factions":["faction_Bilgewater_Name","faction_Noxus_Name"],"game_outcome":"loss","order_of_play":1,"tagLine":"187","gameName":"Cancler"},{"puuid":"9BlLzTrVxJGlXk4JA50r23VdIRyqNmeEJ4NXG6pedGPKuSd2otmiRxWWvr5shYRCfaZmV4LPJzmUpg","deck_id":"1b07bbb5-19c4-450b-92cd-3aa70bb86010","deck_code":"CQCQCBIFBAAQOCQJAIDAKFBAAMCQUMK5MIBQMCQPCEKQGAIFBIAQCBIFBIBACBIBGEBACAIFB4AQKCS6","factions":["faction_BandleCity_Name","faction_ShadowIsles_Name"],"game_outcome":"win","order_of_play":0,"tagLine":"EUW","gameName":"guncika"}],"total_turn_count":50}},{"metadata":{"data_version":"2","match_id":"72cd16bb-d610-489e-b0d6-4eebe0e885ce","participants":["zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","ZrvTOh09cm7go73414Z3vBau95ASpOgKMIB6PJpirifIusDSGhuBi1Wodq5xUxLuXoJdH7dz9sXCDw"]},"info":{"game_mode":"Constructed","game_type":"Normal","game_start_time_utc":"2023-05-03T11:34:18.2190552+00:00","game_version":"live-green-4-04-29","players":[{"puuid":"zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","deck_id":"1c163bc3-3c93-4993-b94b-0b310febb743","deck_code":"CIFACAIEGQAQCBI6AEBQKBIBAQCAWAIFAUFQCBQGDUAQMBBJAEDQICIBA4CQEAYGAUDCULIBAEDAICABAIAQKAZO","factions":["faction_Piltover_Name","faction_ShadowIsles_Name"],"game_outcome":"loss","order_of_play":0,"tagLine":"187","gameName":"Cancler"},{"puuid":"ZrvTOh09cm7go73414Z3vBau95ASpOgKMIB6PJpirifIusDSGhuBi1Wodq5xUxLuXoJdH7dz9sXCDw","deck_id":"581ab284-1a67-40b7-bc96-a31034207b7b","deck_code":"CMBAGBQHAUYTGBAEA4TGMZ3NAMAQKBYWAEDAOOAFAQDQGLZ3INEAEAIGA4VAIBAHDQ7GK2Y","factions":["faction_Shurima_Name"],"game_outcome":"win","order_of_play":1,"tagLine":"6134","gameName":"SakDow"}],"total_turn_count":24}},{"metadata":{"data_version":"2","match_id":"e4b31ea5-b5f2-45ec-a9af-73fb7ef5ce21","participants":["zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","-Ecqa-O2VP34PO0I3a_jcgMASLrKFe4qRhgYLqxIA55oFHBbx2GmTPd5O-aFlEuttsd4q1Wax6MqJA"]},"info":{"game_mode":"Constructed","game_type":"Normal","game_start_time_utc":"2023-05-03T11:28:29.2130837+00:00","game_version":"live-green-4-04-29","players":[{"puuid":"zAdiTIMHjogG3FrPO29CjissN_20seVkLp2rE6vJQjPb2f3QtOaLcDybt3NhWmT9p9y8-4mxvc9KJA","deck_id":"1c163bc3-3c93-4993-b94b-0b310febb743","deck_code":"CIFACAIEGQAQCBI6AEBQKBIBAQCAWAIFAUFQCBQGDUAQMBBJAEDQICIBA4CQEAYGAUDCULIBAEDAICABAIAQKAZO","factions":["faction_Piltover_Name","faction_ShadowIsles_Name"],"game_outcome":"loss","order_of_play":1,"tagLine":"187","gameName":"Cancler"},{"puuid":"-Ecqa-O2VP34PO0I3a_jcgMASLrKFe4qRhgYLqxIA55oFHBbx2GmTPd5O-aFlEuttsd4q1Wax6MqJA","deck_id":"505d2745-e724-40ab-ad5b-03c42659c604","deck_code":"CEBQEBADAQHQGAIDD4QTKBIBAECBMHRGFEBACBADBABACAILGABAEAIBAEVAEBQBDQRQ","factions":["faction_Freljord_Name","faction_Noxus_Name"],"game_outcome":"win","order_of_play":0,"tagLine":"RU1","gameName":"SharKISS"}],"total_turn_count":22}}]
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
    width: 50rem;
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