<script setup>
import {ref} from 'vue'
import store from "@/store";
import {useRouter} from "vue-router/dist/vue-router";
const token = ref("")
const router = useRouter()
const submitToken = () => {
    if(token.value){
        store.set("token", token.value)
        router.push({name: "home"})
    }
}
</script>
<template>
    <form>
        <div class="form-group">
            <label for="token">RGAPI-TOKEN</label>
            <input class="form-control" v-model=token id="token" aria-describedby="tokenHelp" placeholder="Enter token">
            <small id="tokenHelp" class="form-text text-muted">You need a valid RGPAPI-TOKEN to use this application.</small>
        </div>
        <button type="submit" class="btn btn-primary" @click.prevent="submitToken">Submit</button>
    </form>
</template>
<style scoped>
form{
    width: 25rem;
}
.form-group{
    text-align: left;
}
.form-group label{
    font-size: 1.5rem;
    line-height: 1.5rem;
    padding-bottom: .5rem;
}
.form-group small {
    font-size: .75rem;
}
form button {
    margin-top: .75rem;
    width: 100%;
}

</style>
