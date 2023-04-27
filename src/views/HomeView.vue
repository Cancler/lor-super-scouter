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
const initial_opponent = ref(true);
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
    initial_opponent.value = false
    opponents.value = []

    resetSelectedOpponent()

    if(opponent_name.value){
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

        console.log(selected_opponent.value)

        loading_history.value = true
        selected_opponent.value.history = []

        const match_ids = await riot_api.lorMatch.getByPUUID({
            region: selected_region.value,
            puuid: selected_opponent.value.puuid
        })

        if(match_ids){
            for(const match_id of match_ids){
                console.log(match_id)
                const match = await riot_api.lorMatch.getByMatchId({
                    region: selected_region.value,
                    match_id: match_id
                })
                if(match){
                    selected_opponent.value.history.push(match)
                }
            }
            console.log(selected_opponent.value.history)
        }
        loading_history.value = false
        selected_opponent.value.loaded_history = true
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
        <div v-if="!rectangles || !rectangles.OpponentName">
            No Opponent found
        </div>
        <div v-else-if="opponent_name && opponents.length === 0">
            {{ opponent_name }} (Couldn't identify tagLine)
        </div>
        <div class="opponent-riot-id">
            <div v-if="initial_opponent"></div>
            <div v-else-if="loading_opponent">
                Loading...
            </div>

            <div v-else>
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
                            Dropdown
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end">
                            <li
                                v-for="(opponent, idx) in opponents"
                                :key="idx"
                                :value="opponent"
                            >
                                <a class="dropdown-item" href="#" @click="selectOpponent(opponent)">
                                    {{ opponent.gameName }} #{{ opponent.tagLine }}
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
                            :puuid="selected_opponent?.puuid"
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