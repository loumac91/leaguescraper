const matchEndpoint = require("../../constants").MATCH_ENDPOINT;

module.exports = function(apiClient) {
  function getMatchHistory(encryptedAccountId) {
    let lastIteration = false;
    let beginIndex = 0, fetchedGames = 0, totalGames = 0;
    return {
      [Symbol.asyncIterator]: async function*() {
        while (totalGames >= fetchedGames && !lastIteration) {
          const result = await fetchByEncryptedAccountId(encryptedAccountId, {
            beginIndex: beginIndex,
            endIndex: (beginIndex += 100)
          });
          totalGames = result.totalGames;
          fetchedGames += result.matches.length;
          console.log(beginIndex, totalGames, fetchedGames);
          if (totalGames === fetchedGames) lastIteration = true;
          yield result;
        }
      }
    };
  }

  async function fetchByEncryptedAccountId(encryptedAccountId, params) {
    return await apiClient.dispatch({
      params,
      url: `${matchEndpoint}matchlists/by-account/${encryptedAccountId}`
    });
  }

  async function fetchMatchById(matchId) {
    return await apiClient.dispatch({
      url: `${matchEndpoint}matches/${matchId}`
    });
  }

  return {
    getMatchHistory,
    fetchByEncryptedAccountId,
    fetchMatchById
  };
};
