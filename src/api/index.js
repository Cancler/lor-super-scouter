import { ipcRenderer } from 'electron'
export const Platform = {
    EUW1: "euw1",
    EUNE1: "eun1",
    NA1: "na1",
    LA1: "la1",
    LA2: "la2",
    KR: "kr",
    JP1: "jp1",
    BR1: "br1",
    OC1: "oc1",
    RU: "ru",
    TR1: "tr1",
    EUROPE: "europe",
    ASIA: "asia",
    SEA: "sea",
    AMERICAS: "americas",
    AP: "ap",
    BR: "br",
    EU: "eu",
    NA: "na",
    LATAM: "latam"
}
export const LorCluster = {
    AMERICAS: "americas",
    APAC: "apac",
    EUROPE: "europe",
    SEA: "sea"
}

export class ClientAPI {
    constructor(port) {
        this.port = port
        this.base_url = "http://127.0.0.1"
    }
    getPositionalRectangles = () => {
        const endpoint = "positional-rectangles"
        const url = `${this.base_url}:${this.port}/${endpoint}`
        return ipcRenderer.invoke('request', {
            method: "GET",
            url
        }).then((data) => data)
            .catch((error) => {
                console.log(error)
                return undefined
            })
    }
}

export class RiotAPI {
    constructor(token){
        this.token = token
        this.riot_url_pre = "https://"
        this.riot_url_post = ".api.riotgames.com"
    }

    get account() {
        return {
            getByPUUID: ({region, puuid}) => {
                const endpoint = `/riot/account/v1/accounts/by-puuid/${puuid}`
                return this.get(region, endpoint)
            },
            getByRiotId: ({region, game_name, tag_line}) => {
                const endpoint = `/riot/account/v1/accounts/by-riot-id/${game_name}/${tag_line}`
                return this.get(region, endpoint)
            }
        }
    }

    get lorRanked() {
        return {
            getLeaderboard: ({region}) => {
                const endpoint = "/lor/ranked/v1/leaderboards"
                return this.get(region, endpoint)
            }
        }
    }

    get lorMatch() {
        return {
            getByPUUID: ({region, puuid}) => {
                const endpoint = `/lor/match/v1/matches/by-puuid/${puuid}/ids`
                return this.get(region, endpoint)
            },
            getByMatchId: ({region, match_id}) => {
                const endpoint = `/lor/match/v1/matches/${match_id}`
                return this.get(region, endpoint)
            }
        }
    }

    get(region, endpoint) {
        const base_url = `${this.riot_url_pre}${region}${this.riot_url_post}`
        const url = `${base_url}${endpoint}?api_key=${this.token}`
        return ipcRenderer.invoke('request', {
            method: "GET",
            url
        }).then((data) => data)
            .catch((error) => {
                console.log(error)
                return undefined
            })
    }
}