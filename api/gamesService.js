const { createFileAsync, readFileAsync, getFilesFromDirectoryAsync } = require("../helpers/fileHelper");
const { createAsyncGenerator } = require("../helpers/functionHelper");
const { DEFAULT_OUTPUT_PATH, SUMMONER_NAMES } = require("../constants");

const path = require("path");

async function getSummonerGameFilesMap() {
  const gameFiles = await getFilesFromDirectoryAsync(DEFAULT_OUTPUT_PATH);
  return SUMMONER_NAMES.map(summonerName => {
    const pattern = `^(${summonerName}).*$`
    const regExpression = new RegExp(pattern, "i");
    const summonersGameFiles = gameFiles.filter(gf => {
      const matches = regExpression.exec(gf);
      return matches && matches[1];
    });

    return {
      summonerName,
      summonersGameFiles
    }
  });
}

async function mergeGameData() {
  const summonerGamesMap = await getSummonerGameFilesMap();

  try {
    for (const summonerGameMap of summonerGamesMap) {
      const filePromises = summonerGameMap.summonersGameFiles.map(f => readFileAsync(DEFAULT_OUTPUT_PATH, f));
      let allGames = [];
      for await (const file of createAsyncGenerator(filePromises)) {
        const parsedGames = JSON.parse(file);
        allGames = [ ...allGames, ...parsedGames ];
      }

      const uniqueGames = allGames.filter((v, i, t) => t.indexOf(v) === i);

      const fileName = `${summonerGameMap.summonerName}-AllGames.json`;
      await createFileAsync(path.join(DEFAULT_OUTPUT_PATH, "test"), fileName, uniqueGames);
    }
  } catch (error) {
    console.error(`Something went wrong: ${error}`);
  }
}

module.exports = {
  mergeGameData
}
