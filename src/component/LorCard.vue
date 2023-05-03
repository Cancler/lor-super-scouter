<script setup>
// ##########################################################

import {defineProps, onMounted} from "vue"

// ##########################################################

const props = defineProps({
    card: Object
})

// ##########################################################

// computed

// ##########################################################

// refs

// ##########################################################

// funcs

// ##########################################################

onMounted(() => {
    console.log(props.card)
})

// ##########################################################
</script>
<template>
    <div class="lor-card">
        <div class="card__cost">
            <div class="circle">
                <div class="cost">
                    {{ card.cost}}
                </div>
            </div>
        </div>
        <div class="card__text">
            {{ card.name }}
        </div>
        <div class="card__count">
            <div class="count">
                {{ card.count }}
            </div>
        </div>
    </div>
</template>
<style scoped>
.lor-card{
    border-radius: .375rem;
    background-color: red;
    color: #ffffff;
    display: grid;
    grid-template-columns: 1fr 4fr 1fr;
    grid-template-rows: 3.125rem;
}
.card__cost{
    display: flex;
    justify-content: center;
    align-items: center;
}
.circle{
    box-shadow: #140b2499 0 0 4px;
    border-radius: 50%;
    overflow: hidden;
    flex: 0 0 auto;
    width: 25px;
    height: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.cost{
    font-size: .75rem;
    display: flex;
    color: #ffffff;
    place-content: center;
    justify-content: center;
    text-align: center;
    align-items: center;
    border-radius: 100%;
    background-image: linear-gradient(137deg,rgb(160,223,246) 16%,rgba(41,150,164,0) 25%,rgba(41,150,164,0) 104%,rgb(160,223,246) 82%),radial-gradient(circle at 50% 50%,rgb(47,79,143),rgb(41,70,129) 44%,rgb(9,127,149) 73%,rgb(45,165,183) 76%);
    width: 1.5rem;
    height: 1.5rem;
    flex: 0 0 auto;
    margin-top: 1px;
    border: 1px solid #262931;
    /*height: 20px;*/
    /*width: 20px;*/
}

.card__text{
    font-size: .875rem;
    line-height: 20px;
    font-weight: 500;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    flex: 0 1 auto;
    align-self: center;
    text-shadow: #000000 0 1px 3px;
    letter-spacing: .25px;
    text-align: left;
    margin: 0;
}
.card__count{
    display: flex;
    justify-content: center;
    align-items: center;
}
.count{
    border: 1px solid #b59371;
    background-color: #262931;
    font-size: .75rem;
    padding: 0 4px;
    border-radius: 5px;
    width: 21px;
    display: flex;
    text-align: center;
    justify-content: center;
    align-self: center;
}
</style>