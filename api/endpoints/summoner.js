const summonerEndpoint = require('../../constants').SUMMONER_V4;

module.exports = function (apiClient) {
    return {
        fetchBySummonerName(summonerName) {
            console.log("fetching ", summonerName)
            return apiClient.dispatch({
                url: `${summonerEndpoint}summoners/by-name/${summonerName}`
            });
        }
    }
}
