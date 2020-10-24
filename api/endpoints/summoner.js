const summonerEndpoint = require("../../constants").SUMMONER_ENDPOINT;

module.exports = function (apiClient) {
  async function fetchBySummonerName(summonerName) {
    console.log(`fetching ${summonerName}`);
    return await apiClient.dispatch({
      url: `${summonerEndpoint}summoners/by-name/${summonerName}`,
    });
  }

  return {
    fetchBySummonerName,
  };
};
