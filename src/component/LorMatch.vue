<script setup>
// ##########################################################

import {computed, defineProps, ref} from 'vue'
import {DeckEncoder} from 'runeterra'
import card_json from "@/data/cards.json"
import LorDeck from "@/component/LorDeck"

// ##########################################################

const props = defineProps({
    match: Object
})

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

    if(player_deck_code.value && player.value){
        return formatDeck(player_deck_code.value, player_factions.value)
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
        return opponent.value.deck_code
    }

    return null
})
const opponent_deck = computed(() => {
    if(opponent_deck_code.value && opponent.value){
        return formatDeck(opponent_deck_code.value, opponent_factions.value)
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

const show_deck = ref(false)
const show_player_deck = ref(true)

// ##########################################################

const getFactionImage = (faction) => {
    try{
        // return require(`@/assets/${faction}.png`)
        return require(`@/assets/factions/icon-${faction.toLowerCase()}.png`)
    } catch (e){
        return require("@/assets/factions/icon-runeterra.png")
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
        assets: null,
        formats: null
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
        card.formats = card_json_raw.formats

    } else {
        console.log("Card not found in json")
        console.log(card_raw)
    }

    return card
}
const isFactionInRegions = (regions, faction) =>{
    for(const region of regions){
        const _region = region.split("&")[0].split(" ").join("")
        if (_region.toLowerCase() === faction.toLowerCase()){
            return true
        }
    }

    return false
}
const getFactionCount = (faction, deck) => {
    let count = 0
    let not_in = 0
    for(const champion of deck.champions){
        if(isFactionInRegions(champion.regions, faction)){
            count += champion.count
        } else{
            not_in += champion.count
        }
    }
    for(const follower of deck.followers){
        if(isFactionInRegions(follower.regions, faction)){
            count += follower.count
        } else{
            not_in += follower.count
        }
    }

    for(const spell of deck.spells){
        if(isFactionInRegions(spell.regions, faction)){
            count += spell.count
        } else{
            not_in += spell.count
        }
    }

    for(const equipment of deck.equipments){
        if(isFactionInRegions(equipment.regions, faction)){
            count += equipment.count
        } else{
            not_in += equipment.count
        }
    }

    for(const landmark of deck.landmarks){
        if(isFactionInRegions(landmark.regions, faction)){
            count += landmark.count
        } else{
            not_in += landmark.count
        }
    }

    return [count, not_in]
}
const formatDeck = (deck_code, factions) => {
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
        equipments: [],
        formats: [],
        factions: []
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

        for(const format of card.formats){
            if(!deck.formats.includes(format)){
                deck.formats.push(format)
            }
        }
    }
    console.log(deck)

    for(const faction of factions){
        const [count, not_in] = getFactionCount(faction, deck)

        deck.factions.push({
            name: faction,
            count: (count > 0) ? count : not_in
        })
    }

    return deck
}

// ##########################################################
</script>
<template>
    <div class="match" :data-outcome="outcome">
        <div class="info-wrapper" @click="show_deck=!show_deck">
            <div class="game__info">
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
            <div class="deck__info noselect">
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
                            <div class="champion-count-wrapper">
                                <div class="champion-count">{{ champion.count }}</div>
                            </div>
                            <div class="champion-img-wrapper">
                                <img
                                    class="champion"
                                    :src="champion.assets[0].gameAbsolutePath"
                                >
                            </div>
                        </div>
                    </div>
                    <div class="name">
                    </div>
                </div>
                <div class="vs">vs.</div>
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
                            <div class="champion-count-wrapper">
                                <div class="champion-count">{{ champion.count }}</div>
                            </div>
                            <div class="champion-img-wrapper">
                                <img
                                    class="champion"
                                    :src="champion.assets[0].gameAbsolutePath"
                                >
                            </div>
                        </div>
                    </div>
                    <div class="name">
                        <div v-if="opponent">
                            {{ opponent.gameName }} #{{ opponent.tagLine }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="expand">
                <img
                    class="expand__icon"
                    v-if="!show_deck"
                    :src="require('@/assets/icons/expand_more_FILL0_wght400_GRAD0_opsz48.svg')"
                >
                <img
                    class="expand__icon"
                    v-else
                    :src="require('@/assets/icons/expand_less_FILL0_wght400_GRAD0_opsz48.svg')"
                >
            </div>
        </div>
        <div class="deck" v-if="show_deck">
            <LorDeck
                v-if="show_player_deck"
                :deck="player_deck"
            ></LorDeck>
            <LorDeck
                v-else
                :deck="opponent_deck"
            ></LorDeck>
        </div>
    </div>
</template>
<style scoped>
.match{
    cursor: pointer;
    color: #9E9EB1;
    display: flex;
    flex-direction: column;
    gap: .25rem;
}
.deck{
    border-radius: .375rem;
}
.info-wrapper {
    border-left: .375rem solid #9E9EB1;
    border-radius: .375rem;
}
.match[data-outcome="win"] .deck{
    background-color: #28344e;
}
.match[data-outcome="win"] .info-wrapper{
    background-color: #28344e;
    border-left-color: #5383E8;
}
.match[data-outcome="win"] .queue-type{
    color: #5383E8;
}
.match[data-outcome="win"] .expand{
    background-color: #2f436e;
}
.match[data-outcome="loss"] .deck{
    background-color: #59343b;
}
.match[data-outcome="loss"] .info-wrapper{
    background-color: #59343b;
    border-left-color: #E84057;
}
.match[data-outcome="loss"] .expand{
    background-color: #703c47;

}
.match[data-outcome="loss"] .queue-type{
    color: #E84057;
}
.match[data-outcome="tie"] .deck{
    background-color: #282830;
}
.info-wrapper{
    display: grid;
    grid-template-areas:
        "game_info game_info game_info game_info game_info game_info game_info game_info game_info expand expand expand"
        "deck_info deck_info deck_info deck_info deck_info deck_info deck_info deck_info deck_info expand expand expand";
    grid-template-columns: repeat(9, 1fr) auto;
}
.expand{
    grid-area: expand;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    padding: .375rem .25rem .375rem .25rem;
    background-color: #424254;
    border-radius: .375rem;
}
.expand__icon{
    width: 1.5rem;
    height: 1.5rem;
    filter: invert(91%) sepia(2%) saturate(5604%) hue-rotate(196deg) brightness(70%) contrast(96%);
}
.game__info{
    font-size: .75rem;
    display: flex;
    flex-direction: row;
    gap: 1rem;
    padding: .25rem .75rem;
    grid-area: game_info;
}
.queue-type{
    text-transform: uppercase;
    font-weight: bold;
}
.deck__info{
    padding: .375rem .75rem;
    display: grid;
    grid-template-columns: 1fr auto 2fr;
    grid-area: deck_info;
    gap: .25rem;
}
.vs{
    display: flex;
    justify-content: center;
    align-items: center;
}
.participant{
    align-items: center;
    margin: .5rem .75rem;
    display: grid;
    gap: .75rem;
    grid-template-columns: 4rem 7.5rem auto;
}
.factions{
    display: flex;
    flex-direction: row;
}
.faction{
    width: 2rem;
    height: auto;
    align-items: flex-start;
}
.champions {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: .25rem;
    align-content: center;
    justify-content: center;
}
.champion-img-wrapper{
    width: 2.125rem;
    height: 2.125rem;
    border-radius: 50%;
    overflow: hidden;
    border: 1px solid transparent;
    padding: 0;
    align-self: center;
    justify-self: center;
}
.champion{
    width: 4.25rem;
    height: 6.4rem;
    margin-left: -20px;
    margin-top: -.5rem;
    vertical-align: middle;
}
.champion-count-wrapper{
    padding-left: 24px;
    position: relative;
}
.champion-count{
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #262931;
    box-shadow: 0 2px 4px #140b247f;
    border: 1px solid #ffffff0c;
    border-radius: 100%;
    font-size: .6rem;
    color: #fff;
    z-index: 999;
    font-weight: bold;
    text-align: center;
    line-height: 15px;
    box-sizing: border-box;
    width: 16px;
    height: 16px;
    position: absolute;
}
.name {
    font-size: .875rem;
    font-weight: 500;
    color: #c9c9c9;
    text-align: left;
}
</style>