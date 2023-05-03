<script setup>
// ##########################################################

import {computed, defineProps} from "vue"
import LorCard from "@/component/LorCard"

// ##########################################################

const props = defineProps({
    deck: Object
})

// ##########################################################

const champions_background = computed(() => {
    if(props.deck){
        if(props.deck.champions.length > 0){
            // return null
            return props.deck.champions[0].assets[0].fullAbsolutePath
        }
    }

    return null
})
const landmarks_count = computed(() => {
    const initial_value = 0
    if(props.deck){
        return props.deck.landmarks.reduce((a, b) => a + b.count, initial_value)
    } else {
        return initial_value
    }
})
const spells_count = computed(() => {
    const initial_value = 0
    if(props.deck){
        return props.deck.spells.reduce((a, b) => a + b.count, initial_value)
    } else {
        return initial_value
    }
})
const champions_count = computed(() => {
    const initial_value = 0
    if(props.deck){
        return props.deck.champions.reduce((a, b) => a + b.count, initial_value)
    } else {
        return initial_value
    }
})
const followers_count = computed(() => {
    const initial_value = 0
    if(props.deck){
        return props.deck.followers.reduce((a, b) => a + b.count, initial_value)
    } else {
        return initial_value
    }
})
const equipments_count = computed(() => {
    const initial_value = 0
    if(props.deck){
        return props.deck.equipments.reduce((a, b) => a + b.count, initial_value)
    } else {
        return initial_value
    }
})

// ##########################################################

// refs

// ##########################################################

const getFactionImage = (faction) => {
    try{
        return require(`@/assets/factions/icon-${faction.toLowerCase()}.png`)
    } catch (e){
        return require("@/assets/factions/icon-runeterra.png")
    }
}
const getFormatImage = (format) => {
    try{
        return require(`@/assets/formats/${format.toLowerCase()}.png`)
    } catch (e){
        return ""
    }
}
const copy = () => {
    console.log("copying...")
}

// ##########################################################
</script>
<template>
    <div class="deck" :style="{ '--background-image': 'url(' + champions_background + ')' }">
        <div class="copy">
            <button
                type="button"
                class="btn btn-secondary btn-sm"
                @click="copy"
            >
                Copy Deckcode
            </button>
        </div>
        <div class="overview">
            <div class="factions-wrapper">
                <div class="title title--info">
                    <div class="text">Regions</div>
                </div>
                <div class="factions">
                    <div
                        class="faction-wrapper"
                        v-for="(faction, idx) in deck.factions"
                        :key="idx"
                    >
                        <div class="faction-count-wrapper">
                            <div class="faction-count">{{ faction.count }}</div>
                        </div>
                        <div class="faction-img-wrapper">
                            <img
                                class="faction"
                                :src="getFactionImage(faction.name)"
                            >
                        </div>
                    </div>
                </div>
            </div>
            <div class="rarities-wrapper">
                <div class="title title--info">
                    <div class="text">Rarity</div>
                </div>
                <div class="rarities">
                    <div class="rarity-wrapper common">
                        <div class="rarity-count-wrapper">
                            <div class="rarity-count">{{ deck.common }}</div>
                        </div>
                        <div class="faction-img-wrapper">
                            <img
                                class="rarity"
                                :src="require('@/assets/rarity/common.png')"
                            >
                        </div>
                    </div>
                    <div class="rarity-wrapper rare">
                        <div class="rarity-count-wrapper">
                            <div class="rarity-count">{{ deck.rare }}</div>
                        </div>
                        <div class="faction-img-wrapper">
                            <img
                                class="rarity"
                                :src="require('@/assets/rarity/rare.png')"
                            >
                        </div>
                    </div>
                    <div class="rarity-wrapper epic">
                        <div class="rarity-count-wrapper">
                            <div class="rarity-count">{{ deck.epic }}</div>
                        </div>
                        <div class="faction-img-wrapper">
                            <img
                                class="rarity"
                                :src="require('@/assets/rarity/epic.png')"
                            >
                        </div>
                    </div>
                    <div class="rarity-wrapper champion">
                        <div class="rarity-count-wrapper">
                            <div class="rarity-count">{{ deck.champion }}</div>
                        </div>
                        <div class="faction-img-wrapper">
                            <img
                                class="rarity"
                                :src="require('@/assets/rarity/champion.png')"
                            >
                        </div>
                    </div>
                </div>
            </div>
            <div class="formats-wrapper">
                <div class="title title--info">
                    <div class="text">Formats</div>
                </div>
                <div class="formats">
                    <div
                        class="format-wrapper"
                        v-for="(format, idx) in deck.formats.filter(x => getFormatImage(x))"
                        :key="idx"
                    >
                        <div class="format-img-wrapper">
                            <img
                                class="format"
                                :src="getFormatImage(format)"
                            >
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="lor-cards c1">
            <div
                class="cards champions"
                v-if="deck.champions.length > 0"
            >
                <div class="title title--type">
                    <div class="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24" version="1.1">
                            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                <path d="M20.1851064,2 C20.1851064,2 21.1283688,3.40468227 21.4652482,5.61204013 L21.4652482,5.61204013 L20.1851064,7.35117057 L21.6,7.35117057 C21.6,7.81939799 21.5326241,8.28762542 21.4652482,8.75585284 L21.4652482,8.75585284 L19.5113475,11.3645485 L20.7914894,11.3645485 C20.2524823,12.6354515 19.5113475,14.0401338 18.3659574,15.5117057 L18.432,15.423 L18.4277345,15.6880161 C18.2460521,20.6766391 13.7021748,21.9495904 13.5204924,21.998513 L13.5148936,22 L14.1212766,18.0535117 L15.4687943,18.0535117 L15.4687943,14.7090301 L16.8163121,13.3712375 L16.8163121,9.35785953 L13.1106383,12.0334448 L13.1106383,15.5117057 L11.0893617,15.5117057 L11.0893617,12.0334448 L7.38368794,9.35785953 L7.38368794,13.3712375 L8.73120567,14.7090301 L8.73120567,18.0535117 L10.1460993,18.0535117 L10.8198582,22 C10.8198582,22 5.76666667,20.729097 5.76666667,15.3779264 L5.768,15.492 L5.76666667,15.5117057 C4.71672577,14.2240803 3.94985717,12.9364548 3.46606087,11.7003515 L3.34113475,11.3645485 L4.68865248,11.3645485 L2.66737589,8.75585284 C2.6,8.22073579 2.6,7.81939799 2.6,7.35117057 L2.6,7.35117057 L4.0822695,7.35117057 L2.73475177,5.61204013 C3.07163121,3.40468227 4.01489362,2 4.01489362,2 L4.01489362,2 L6.60916592,7.15404495 C7.70207112,5.27128596 9.74939389,4.00668896 12.1,4.00668896 L12.1,4.00668896 L12.3325479,4.0108275 C14.5851816,4.09113888 16.534128,5.33364654 17.5908341,7.15404495 Z" id="Combined-Shape" fill="#fff" fill-rule="nonzero"></path>
                            </g>
                        </svg>
                    </div>
                    <div class="text">Champions</div>
                    <div class="count">
                        <div class="count__text">
                            {{ champions_count }}
                        </div>
                    </div>
                </div>
                <LorCard
                    v-for="(card, idx) in deck.champions"
                    :key="idx"
                    :card="card"
                />
            </div>
            <div
                class="cards landmarks"
                v-if="deck.landmarks.length === 0"
            >
                <div class="title title--type">
                    <div class="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35 35" width="16px" height="16px">
                            <g>
                                <path d="M23.3 10.7v8.9c0 .8-.7 1.5-1.6 1.5h-.4c-.9 0-1.6-.7-1.6-1.5V7.2l-4.3-1.6v14.1c0 .8-.7 1.5-1.6 1.5h-.4c-.9 0-1.6-.7-1.6-1.5v-17L7.3 1v22.5h20V12l-4-1.3zm5.5 18.2c-.5-.2-1.6-.6-1.6-1.9v-.6h-20v.6c0 1.2-1.1 1.6-1.6 1.9-1.7.7-1.6 1.7-1.6 2.4v1.8h26.4v-1.8c0-.7.1-1.7-1.6-2.4z" fill="#fff"></path>
                            </g>
                        </svg>
                    </div>
                    <div class="text">Landmarks</div>
                    <div class="count">
                        <div class="count__text">
                            {{ landmarks_count }}
                        </div>
                    </div>
                </div>
                <LorCard
                    v-for="(card, idx) in deck.landmarks"
                    :key="idx"
                    :card="card"
                />
            </div>
            <div
                class="cards equipments"
                v-if="deck.equipments.length === 0"
            >
                <div class="title title--type">
                    <div class="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M9.50943 16.6978L2.24528 9.18132L1 11.478L7.22642 17.7418L9.50943 16.6978Z" fill="#fff"></path>
                            <path d="M6.18868 6.67582L4.9434 5.42308L7.01887 3.33516L8.26415 4.58791L6.18868 6.67582Z" fill="#fff"></path>
                            <path d="M9.30189 14.6099L4.11321 9.39011L4.9434 8.34615H6.18868L9.92453 4.7967V3.54396L10.9623 2.5L15.9434 3.12637L16.3585 7.92857L15.5283 8.76374L14.0755 8.97253L13.2453 10.0165L14.6981 11.2692L15.5283 10.4341L16.9811 11.0604L12.8302 15.2363L12 13.7747L12.8302 12.9396L11.3774 11.478L10.3396 12.7308V13.9835L9.30189 14.6099Z" fill="#fff"></path>
                            <path d="M20.9245 21.5L14.9057 15.0275L16.566 13.3571L23 19.4121L20.9245 21.5Z" fill="#fff"></path>
                        </svg>
                    </div>
                    <div class="text">Equipments</div>
                    <div class="count">
                        <div class="count__text">
                            {{ equipments_count }}
                        </div>
                    </div>
                </div>
                <LorCard
                    v-for="(card, idx) in deck.equipments"
                    :key="idx"
                    :card="card"
                />
            </div>
        </div>
        <div class="lor-cards c2">
            <div
                class="cards units"
                v-if="deck.followers.length > 0"
            >
                <div class="title title--type">
                    <div class="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24" version="1.1">
                            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                <path d="M19.2179487,3.42857143 L12.1666667,2 L12.1666667,2 L12.1666667,2 L12.1666667,2 L12.1666667,2 L5.11538462,3.42857143 C5.11538462,3.42857143 6.87820513,10.0714286 3,17.0714286 L10.0512821,22 L10.6858974,12 C10.6858974,12 6.66666667,14.2857143 7.23076923,7.71428571 L12.1666667,6.28571429 L17.1025641,7.71428571 C17.6666667,14.2142857 13.6474359,12 13.6474359,12 L14.2820513,22 L21.3333333,17.0714286 C17.525641,10.0714286 19.2179487,3.42857143 19.2179487,3.42857143 Z" id="XMLID_28_" fill="#fff" fill-rule="nonzero"></path>
                            </g>
                        </svg>
                    </div>
                    <div class="text">Units</div>
                    <div class="count">
                        <div class="count__text">
                            {{ followers_count }}
                        </div>
                    </div>
                </div>
                <LorCard
                    v-for="(card, idx) in deck.followers"
                    :key="idx"
                    :card="card"
                />
            </div>
        </div>
        <div class="lor-cards c3">
            <div
                class="cards spells"
                v-if="deck.spells.length > 0"
            >
                <div class="title title--type">
                    <div class="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24" version="1.1">
                            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                <path d="M4.52065393,15.7135794 C4.52065393,15.7135794 3.88318686,11.6423605 9.69122016,6.64261804 C9.97453886,6.9997425 10.3286872,7.35686696 10.6828356,7.57114164 C11.674451,6.9997425 12.3119181,5.92836911 12.3119181,4.78557082 C12.3119181,3.57134764 11.674451,2.57139914 10.6828356,2 C12.8077258,2 16.2783799,5.14269529 16.2783799,10.1424378 L16.2783799,10.7852618 C15.7825722,10.4281374 15.0742754,10.2138627 14.4368083,10.2138627 C12.8785555,10.2138627 11.461962,11.0709614 10.7536653,12.3566095 C11.5327917,13.6422575 12.8785555,14.4993562 14.4368083,14.4993562 C15.9950612,14.4993562 17.553314,13.4279829 18.1907811,11.999485 C18.6157591,12.4994592 19.1823965,13.4279829 19.3948855,14.4993562 C19.3948855,14.4993562 20.386501,18.9276996 16.2783799,20.9990215 C12.1702588,23.0703434 8.203797,21.2847211 8.203797,21.2847211 C8.203797,21.2847211 12.0994291,21.356146 13.1618742,18.2848756 C13.1618742,18.2134507 8.41628602,18.9276996 4.52065393,15.7135794 Z" id="XMLID_28_" fill="#fff" fill-rule="nonzero"></path>
                            </g>
                        </svg>
                    </div>
                    <div class="text">Spells</div>
                    <div class="count">
                        <div class="count__text">
                            {{ spells_count }}
                        </div>
                    </div>
                </div>
                <LorCard
                    v-for="(card, idx) in deck.spells"
                    :key="idx"
                    :card="card"
                />
            </div>
        </div>
    </div>
</template>
<style scoped>
.deck{
    display: grid;
    grid-template-areas:
        "copy copy copy copy copy copy copy copy copy copy copy copy"
        "overview overview overview overview overview overview overview overview overview overview overview overview"
        "c1 c1 c1 c1 c2 c2 c2 c2 c3 c3 c3 c3";
    grid-template-columns: repeat(12, 1fr);
    justify-content: center;
    align-content: center;
    grid-gap: 1.5rem;
    padding: 1.5rem;
    position: relative;
    width: 100%;

}
.deck::before{
    content: "";
    border-radius: .375rem;
    /*noinspection CssUnresolvedCustomProperty*/
    background-image: var(--background-image);
    background-size: cover;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    opacity: 0.3;
}
.deck > * {
    position: relative;
}
.copy > * {
    position: relative;
}
.copy {
    grid-column: span 5;
    display: flex;
    align-items: flex-start;
}
.overview {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    width: 100%;
    grid-area: overview;
    gap: 1.25rem;
}
.overview > *{
    position: relative;
}
.lor-cards > * {
    position: relative;
}
.lor-cards{
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}
.cards{
    display: flex;
    flex-direction: column;
    gap: .25rem;
}
.c1 {
    grid-area: c1;
}
.c2 {
    grid-area: c2;
}
.c3 {
    grid-area: c3;
}
.title{
    text-align: left;
    color: #ffffff;
    text-transform: uppercase;
    font-size: .75rem;
    min-height: 1.25rem;
    line-height: 1.25rem;
    border-bottom: 1px solid transparent;
    margin-bottom: .5rem;
}
.title--info{
    border-bottom-color: rgba(255,255,255,.15);
}
.title--type{
    display: grid;
    gap: .5rem;
    grid-template-columns: 1rem auto 1fr;
}
.count{
    display: flex;
    justify-content: flex-end;
}
.count__text{
    border-bottom: 1px solid rgba(255,255,255,.15);
    width: 1.375rem;
    text-align: center;
}
.icon{
    display: flex;
    justify-content: center;
    align-items: center;
}
.icon img{
    width: 1rem;
    height: auto;
}
.factions-wrapper{
    flex: 1;
}
.rarities-wrapper{
    flex: 1;
}
.formats-wrapper{
    flex: 1;
}
.factions{
    display: grid;
    /*width: 15rem;*/
    gap: .25rem;
    grid-template-columns: repeat(auto-fill, 2.5rem);
}
.faction-count-wrapper{
    padding-left: 1.75rem;
    position: relative;
    height: 0;
}
.faction-count{
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #262931;
    box-shadow: #140b247f 0 2px 4px;
    border: 1px solid #b59371;
    border-radius: 100%;
    font-size: 10px;
    font-weight: 500;
    text-align: center;
    line-height: 15px;
    box-sizing: border-box;
    color: #ffffff;
    width: 1rem;
    height: 1rem;
    position: relative;
}
.faction {
    width: 2rem;
    height: auto;
}
.rarities{
    display: grid;
    /*width: 15rem;*/
    gap: .25rem;
    grid-template-columns: repeat(auto-fill, 2.5rem);
}
.rarity-count-wrapper{
    padding-left: 1.75rem;
    position: relative;
    height: 0;
}
.rarity-count{
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #262931;
    box-shadow: #140b247f 0 2px 4px;
    border: 1px solid #b59371;
    border-radius: 100%;
    font-size: 10px;
    font-weight: 500;
    text-align: center;
    line-height: 15px;
    box-sizing: border-box;
    color: #ffffff;
    width: 1rem;
    height: 1rem;
    position: relative;
}
.rarity {
    width: 2rem;
    height: 2rem;
}
.formats{
    display: grid;
    /*width: 15rem;*/
    gap: .25rem;
    grid-template-columns: repeat(auto-fill, 2.5rem);
}
.format {
    width: 2rem;
    height: auto;
}
</style>