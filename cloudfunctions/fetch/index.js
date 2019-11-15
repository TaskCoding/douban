const request = require('request');
exports.main = async(event, context) => {
  let url = `${event.api}/${event.path}?` + Object.keys(event.params).map(function(key) {
    return key + "=" + event.params[key]
  }).join("&");

  return new Promise((resolve, reject) => {
    request({
        url: url,
        method: 'get',
        headers: {
          "content-type": "json",
        }
      },
      (error, response, body) => {
        if (error) {
          reject(error);
        }
        resolve(JSON.parse(body));
      });
  })
}