const path = require('path');

// ENDPOINTS
module.exports.RIOT_EUW_URL = "https://euw1.api.riotgames.com/";

const summonerEndpointV4 = "lol/summoner/v4/";
const matchEndpointV4 = "lol/match/v4/";

module.exports.SUMMONER_ENDPOINT = summonerEndpointV4;
module.exports.MATCH_ENDPOINT = matchEndpointV4;

// CONFIG
module.exports.API_KEY = "RGAPI-40d49c47-f28f-4593-8a4a-2629254375fd";
module.exports.DEFAULT_OUTPUT_PATH = path.join(__dirname, "games-data");
module.exports.API_CLIENT_TIMEOUT = 2000;
module.exports.API_CLIENT_REQUEST_RATE = 6;
module.exports.API_CLIENT_REQUEST_TIME_FRAME_IN_SECONDS = 5;
module.exports.API_CLIENT_RETRY_TIME = 1000;
module.exports.API_CLIENT_RULE_NAME = "riotApi";

// SUMMONERS
module.exports.SUMMONER_NAMES = [
  "Peduran",
  "YonnyNoJs",
  "AugustinebN",
  "Pyr0mani4c",
  "Tempest13",
  "gwai",
  "natybear",
  "venerat",
  "heyqtpie",
  "colshk",
  "colshkk",
  "Reaperftw",
  "Urn Bad Rat",
  "zggafllaB"
];
