const apiKey = require("../constants").API_KEY;
const createApiClient = require('./apiClient');
const createSummonerEndpoint = require('./endpoints/summoner');
const createMatchEndpoint = require('./endpoints/match');

const apiClient = createApiClient(apiKey);
const summonerEndpoint = createSummonerEndpoint(apiClient);
const matchEndpoint = createMatchEndpoint(apiClient);


module.exports = {
  summonerEndpoint,
  matchEndpoint    
}
