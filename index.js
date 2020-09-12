const createApiService = require("./api/apiService");
const { createAsyncGenerator } = require("./helpers/functionHelper");
const { create } = require("./helpers/fileHelper");
const { API_KEY, DEFAULT_OUTPUT_PATH, SUMMONER_NAMES } = require("./constants");

const { summonerEndpoint, matchEndpoint } = createApiService(API_KEY);

async function writeMatchHistoryOutput(summonerName, matches) {
  const fileName = `${summonerName}-Games`;
  await create(DEFAULT_OUTPUT_PATH, fileName, matches);
}

(async () => {
  try {
    const summoners = await Promise.all(
      SUMMONER_NAMES.map(name => summonerEndpoint.fetchBySummonerName(name))
    );

    let matchHistory = {};
    for await (const summoner of createAsyncGenerator(summoners)) {
      try {
        for await (const matches of matchEndpoint.getMatchHistory(
          summoner.accountId
        )) {
          if (!matchHistory[summoner.name]) {
            matchHistory[summoner.name] = [];
          }
          matchHistory[summoner.name].push(matches);
        }
      } catch (error) {
        console.log(`Couldn't fetch matches for summoner: ${summoner.name}`);
        continue;
      }
    }

    const writePromises = Object.entries(matchHistory).map(([key, value]) =>
      writeMatchHistoryOutput(
        key,
        value.map(v => v.matches)
      )
    );

    await Promise.all(writePromises);
  } catch (e) {
    console.log(`Something went wrong. Error: ${e}`);
  }
})();


// TODO

// Still can get 404 from riot api when no data
// e.g. Urn Bad Rat
// Need to name files and time stamp them
// Need to check whether file still exists
// Should place into folder aswell?
