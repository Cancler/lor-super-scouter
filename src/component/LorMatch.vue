<script setup>
// ##########################################################

import {computed, defineProps, onMounted, ref} from 'vue';
import {DeckEncoder} from 'runeterra'
import card_json from "@/assets/cards/cards.json"

// ##########################################################

const props = defineProps({
    match: Object,
    puuid: String
});

// ##########################################################

const date = computed(() => {
    if(props.match){
        const d = new Date(props.match?.info.game_start_time_utc)
        return d.toLocaleString()
    }
    return null
})
const outcome = computed(() => {
    if(props.match && player.value){
        return player.value.game_outcome
    }

    return null
})

// # ----------------------------------------------------

const player = computed(() => {
    if(props.match){
        return props.match.info.players.filter((x) => {
            return x.puuid === props.puuid
        })[0]
    }

    return null
})
const player_deck_code = computed(() => {
    if(player.value){
        return player.value.deck_code
    }

    return null
})
const player_deck = computed(() => {

    if(player_deck_code.value){
        return formatDeck(player_deck_code.value)
    }

    return null
})
const player_factions = computed(() => {
    if(player.value){
        return player.value.factions.map((x) => {
            return x.split("_")[1]
        })
    }
    return []
})

// # ----------------------------------------------------

const opponent = computed(() => {
    if(props.match){
        return props.match.info.players[1]
    }

    return null
})
const opponent_deck_code = computed(() => {
    if(opponent.value){
        return opponent.value.deck_code;
    }

    return null
})
const opponent_deck = computed(() => {
    if(opponent_deck_code.value){
        return formatDeck(opponent_deck_code.value)
    }

    return null
})
const opponent_factions = computed(() => {
    if(opponent.value){
        return opponent.value.factions.map((x) => {
            return x.split("_")[1]
        })
    }

    return []
})

// ##########################################################

const show_deck = ref(false);

// ##########################################################

const getFactionImage = (faction) => {
    try{
        return require(`@/assets/${faction}.png`)
    } catch (e){
        console.log(e)
        return require("@/assets/Runeterra.png")
    }
}
const formatDeck = (deck_code) => {
    const cards = []
    const cards_raw = DeckEncoder.decode(deck_code)
    const deck = {
        common: 0,
        rare: 0,
        epic: 0,
        champion: 0,
        champions: [],
        followers: [],
        spells: [],
        landmarks: [],
        equipments: []
    }
    for(const card_raw of cards_raw){
        const card_json_raw = card_json.find((x) => {
            return x.cardCode === card_raw.code
        })

        const card = {
            code: card_raw.code,
            count: card_raw.count,
            rarity: null,
            type: null
        }
        if(card_json_raw){
            card.rarity = card_json_raw.rarity.toLowerCase()
            card.type = card_json_raw.type.toLowerCase()

        } else {
            console.log("Card not found in json")
            console.log(card_raw)
        }

        cards.push(card)
        // console.log(card_raw)
        // console.log(card)
        // console.log(card_json_raw)
        if(card.rarity === "common"){
            deck.common += card_raw.count
        }
        if(card.rarity === "rare"){
            deck.rare += card_raw.count
        }
        if(card.rarity === "epic"){
            deck.epic += card_raw.count
        }
        if(card.rarity === "champion"){
            deck.champion += card_raw.count
        }
        if(card.type === "spell"){
            deck.spells.push(card)
        }
        if(card.type === "unit" && card.rarity === "champion"){
            deck.champions.push(card)
        }
        if(card.type === "unit" && card.rarity !== "champion"){
            deck.followers.push(card)
        }
    }
    console.log(deck)

    return deck
}

// ##########################################################

onMounted(() => {
    console.log(props.match)
    console.log(card_json);
})

// ##########################################################
</script>
<template>
    <div class="match" :data-outcome="outcome">
        <div class="info-wrapper" @click="show_deck=!show_deck">
            <div class="game__info" >
                <div class="queue-type">
                    {{ match?.info.game_mode }}
                </div>
                <div class="game-start-time">
                    {{ date }}
                </div>
                <div class="total-rounds">
                    Rounds: {{ match?.info.total_turn_count }}
                </div>
            </div>
            <div class="deck_info">
                <div class="participant player">
                    <div class="factions">
                        <img
                            class="faction"
                            v-for="(faction, idx) in player_factions"
                            :key="idx"
                            :src="getFactionImage(faction)"
                        >
                    </div>
                </div>
                <div class="participant opponent">
                    <div class="factions">
                        <img
                            class="faction"
                            v-for="(faction, idx) in opponent_factions"
                            :key="idx"
                            :src="getFactionImage(faction)"
                        >
                    </div>
                </div>
            </div>
        </div>
        <div class="deck" v-if="show_deck">
<!--            <img src="https://ddragon.leagueoflegends.com/cdn/13.8.1/img/champion/Aatrox.png">-->
            {{ player_deck }}

            <br><br>
            {{ opponent_deck }}
        </div>
    </div>
</template>
<style scoped>
.match{
    border-radius: .375rem;
    border-left: .375rem solid #9E9EB1;
    cursor: pointer;
    color: #9E9EB1;
}
.match[data-outcome="win"]{
    background-color: #28344e;
    border-left-color: #5383E8;
}
.match[data-outcome="win"] .game__info .queue-type{
    color: #5383E8;
}
.match[data-outcome="loss"]{
    background-color: #59343b;
    border-left-color: #E84057;
}
.match[data-outcome="los"] .game__info .queue-type{
    color: #E84057;
}
.match[data-outcome="tie"] {
    background-color: #282830;
}

.game__info{
    font-size: .75rem;
    display: flex;
    flex-direction: row;
    gap: 1rem;
    padding: .25rem .75rem;
}
.game__info .queue-type{
    text-transform: uppercase;
    font-weight: bold;
}

.deck_info{
    padding: .375rem .75rem;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
}

.deck_info .participant{
    display: flex;
    align-items: center;
    margin: .5rem .75rem;
    height: 3rem;
}

.deck_info .participant .factions{
    display: flex;
    flex-direction: row;
    gap: .35rem;
}
.deck_info .participant .factions .faction{
    width: 1.5rem;
    height: 1.5rem;
}

.participant{
    display: grid;

}
</style>