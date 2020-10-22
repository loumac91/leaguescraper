const axios = require("axios");
const Queue = require("smart-request-balancer");
const { v4: createKey } = require("uuid");
const {
  RIOT_EUW_URL,
  API_CLIENT_TIMEOUT,
  API_CLIENT_REQUEST_RATE,
  API_CLIENT_REQUEST_TIME_FRAME_IN_SECONDS,
  API_CLIENT_RULE_NAME,
  API_CLIENT_RETRY_TIME
} = require("../constants");

function requestUrl({ params, url }) {
  if (params) {
    const queryString = Object.keys(params)
      .reduce((p, k) => {
        const param = params[k];
        if (param) p.push(`${[k]}=${param}`);
        return p;
      }, [])
      .join("&");

    url += url.indexOf("?") === -1 ? "?" : "&";
    url += queryString;
  }
  
  return url;
}

module.exports = function(apiKey) {
  const apiClient = axios.create({
    baseURL: RIOT_EUW_URL,
    timeout: API_CLIENT_TIMEOUT,
    headers: {
      "X-Riot-Token": apiKey,
      Accept: "application/json"
    }
  });

  // GUIDELINES:
  // 20 requests every 1 seconds(s)
  // 100 requests every 2 minutes(s)
  // 1.2 requests per second over 2 minutes
  // Round to 1.5 every second for safety
  // Therefore 6 requests every 5 seconds

  const queue = new Queue({
    rules: {
      [API_CLIENT_RULE_NAME]: {
        rate: API_CLIENT_REQUEST_RATE,
        limit: API_CLIENT_REQUEST_TIME_FRAME_IN_SECONDS,
        priority: 2
      }
    },
    overall: {
      rate: 50,
      limit: 60,
      priority: 1
    },
    retryTime: API_CLIENT_RETRY_TIME,
    ignoreOverallOverheat: true
  });

  return {
    dispatch: function(options) {
      return queue
        .request(
          retry => {
            return apiClient
              .request({
                method: options.method || "get",
                url: requestUrl(options)
              })
              .then(response => response.data)
              .catch(error => {
                if (error.response.status === 429) {
                  return retry();
                }

                if (error.response.status == 404) {
                  throw "404";
                }
                
                throw error;
              });
          },
          createKey(),
          API_CLIENT_RULE_NAME
        )
        .then(response => response)
        .catch(e => console.error(e));
    }
  };
};
