<script setup>
// ##########################################################

import {computed, defineProps, onMounted, ref} from 'vue'
import {DeckEncoder} from 'runeterra'
import card_json from "@/assets/cards/cards.json"

// ##########################################################

const props = defineProps({
    match: Object
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
        return props.match.info.players[0]
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
const formatCard = (card_raw) => {
    const card_json_raw = card_json.find((x) => {
        return x.cardCode === card_raw.code
    })

    const card = {
        code: card_raw.code,
        count: card_raw.count,
        rarity: null,
        type: null,
        regions: null,
        attack: null,
        cost: null,
        health: null,
        description: null,
        name: null,
        keywords: null,
        spellSpeed: null,
        subtypes: null,
        supertype: null,
        assets: null
    }
    if(card_json_raw){
        card.rarity = card_json_raw.rarity.toLowerCase()
        card.type = card_json_raw.type.map(x => x.toLowerCase())
        card.regions = card_json_raw.regions
        card.attack = card_json_raw.attack
        card.cost = card_json_raw.cost
        card.health = card_json_raw.health
        card.description = card_json_raw.description
        card.name = card_json_raw.name
        card.keywords = card_json_raw.keywords
        card.spellSpeed = card_json_raw.spellSpeed
        card.subtypes = card_json_raw.subtypes
        card.supertype = card_json_raw.supertype
        card.assets = card_json_raw.assets

    } else {
        console.log("Card not found in json")
        console.log(card_raw)
    }

    return card
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
        const card = formatCard(card_raw)
        cards.push(card)

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
        if(card.type.includes("spell")){
            deck.spells.push(card)
        } else if(card.type.includes("equipment")){
            deck.equipments.push(card)
        } else if(card.type.includes("landmark")){
            deck.equipments.push(card)
        } else if(card.type.includes("unit") && card.rarity === "champion"){
            deck.champions.push(card)
        } else if(card.type.includes("unit") && card.rarity !== "champion"){
            deck.followers.push(card)
        }
    }
    console.log(deck)

    return deck
}
// const getChampionImageSrc = () => {
//     return ""
//     // const base_url = "https://dd.b.pvp.net/4_4_0"
//     // return `${base_url}/${set}/en_us/img/cards/${card_code}.png`
// }

const champions = ref([])
const testChampions = () => {
    const champions = []
    for(const card of card_json){
        if(card.rarity.toLowerCase() === "champion"){
            champions.push(card.assets.gameAbsolutePath)
        }
    }
    return champions
}

// ##########################################################

onMounted(() => {
    champions.value = testChampions()
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
            <div class="deck__info">
                <div class="participant player">
                    <div class="factions">
                        <img
                            class="faction"
                            v-for="(faction, idx) in player_factions"
                            :key="idx"
                            :src="getFactionImage(faction)"
                        >
                    </div>
                    <div class="champions">
                        <div
                            class="champion-wrapper"
                            v-for="(champion, idx) in player_deck.champions"
                            :key="idx"
                        >
                            <img
                                class="champion"
                                :src="champion.assets[0].gameAbsolutePath"
                            >
                        </div>
                    </div>
<!--                    <div class="name">-->
<!--                        {{ player.gameName }} #{{ player.tagLine }}-->
<!--                    </div>-->
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
                    <div class="champions">
                        <div
                            class="champion-wrapper"
                            v-for="(champion, idx) in opponent_deck.champions"
                            :key="idx"
                        >
                            <img
                                class="champion"
                                :src="champion.assets[0].gameAbsolutePath"
                            >
                        </div>
                    </div>
                    <div class="name">
                        <div v-if="opponent">
                            {{ opponent.gameName }} #{{ opponent.tagLine }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="deck" v-if="show_deck">
<!--            <img src="https://ddragon.leagueoflegends.com/cdn/13.8.1/img/champion/Aatrox.png">-->
            {{ player_deck }}

            <br><br>
            {{ opponent_deck }}


            <div v-for="(champion, idx) in champions" :key="idx">
                <img :src="champion">
            </div>
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

.deck__info{
    padding: .375rem .75rem;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
}

.deck__info .participant{
    align-items: center;
    margin: .5rem .75rem;
    /*height: 3rem;*/
    display: grid;
    gap: .75rem;
    grid-template-columns: 3.25rem 5rem auto;
}

.deck__info .participant .factions{
    display: flex;
    flex-direction: row;
    gap: .25rem;
}
.deck__info .participant .factions .faction{
    width: 1.5rem;
    height: 1.5rem;
    align-items: flex-start;
}

.deck__info .participant .champions {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: .25rem;
    align-content: center;
    justify-content: center;
}

.deck__info .participant .champions .champion-wrapper{
    width: 2.125rem;
    height: 2.125rem;
    border-radius: 50%;
    overflow: hidden;
    border: 1px solid transparent;
    padding: 0;
    align-self: center;
    justify-self: center;
}

.deck__info .participant .champions .champion-wrapper .champion{
    width: 4.25rem;
    height: 6.4rem;
    margin-left: -20px;
    margin-top: -.5rem;
    vertical-align: middle;
}

.deck__info .participant .name {
    font-size: .875rem;
    font-weight: bold;
    text-align: left;
}

.participant{

}
</style>