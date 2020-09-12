const matchEndpoint = require("../../constants").MATCH_V4;

module.exports = function(apiClient) {
  function getMatchHistory(encryptedAccountId) {
    let lastIteration = false;
    let beginIndex = (fetchedGames = totalGames = 0);
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

  return {
    getMatchHistory,
    fetchByEncryptedAccountId,
    fetchByMatchId(matchId) {
      return apiClient.dispatch({
        url: `${matchEndpoint}matches/${matchId}`
      });
    },
    async fetchAllMatchesByEncryptedAccountId(encryptedAccountId) {
      let matches = [];
      let lastIteration = false;
      let beginIndex = (fetchedGames = totalGames = 0);

      while (totalGames >= fetchedGames) {
        console.log(beginIndex, totalGames, fetchedGames);
        let data = await this.fetchByEncryptedAccountId(encryptedAccountId, {
          beginIndex: beginIndex,
          endIndex: (beginIndex += 100)
        });
        data.matches.forEach(match => matches.push(match));
        totalGames = data.totalGames;
        fetchedGames += data.matches.length;
        if (lastIteration) break;
        if (totalGames === fetchedGames) lastIteration = true;
      }

      return matches;
    }
  };
};
