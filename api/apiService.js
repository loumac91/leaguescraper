const createApiClient = require('./apiClient');
const createSummonerEndpoint = require('./endpoints/summoner');
const createMatchEndpoint = require('./endpoints/match');

module.exports = function (apiKey) {
    const apiClient = createApiClient(apiKey);
    const summonerEndpoint = createSummonerEndpoint(apiClient);
    const matchEndpoint = createMatchEndpoint(apiClient);

    return {
        summonerEndpoint,
        matchEndpoint
    }
}
