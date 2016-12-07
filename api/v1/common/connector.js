'use strict'

var Http = require('machinepack-http');

function request(config, params, body,  cb) {

    request: Http.sendHttpRequest({
      url: config.url,//'/pets/18',
      baseUrl: config.baseUrl,//'http://google.com',
      method: config.method,//'get',
      params: params,
      body: body,
      formData: false,
      headers: {Authorization : config.token},

    }).exec({
// An unexpected error occurred.
      error: function (err) {
        return cb({
          status : 500,
          message : err
        })
      },
// 404 status code returned from server
      notFound: function (result) {
        return cb({status : 404,
          message : result.body
        })
      },
// 400 status code returned from server
      badRequest: function (result) {
        return cb({status : 400,
          message : result.body
        })
      },
// 403 status code returned from server
      forbidden: function (result) {
        return cb({status : 403,
          message : result.body
        })
      },
// 401 status code returned from server
      unauthorized: function (result) {
        return cb({status : 401,
          message : result.body
        })
      },
// 5xx status code returned from server (this usually means something went wrong on the other end)
      serverError: function (result) {
        return cb({status : 500,
          message : result.body
        })
      },
// Unexpected connection error: could not send or receive HTTP request.
      requestFailed: function () {
        return cb({status : 500,
          message : 'Unexpected connection error: could not send or receive HTTP request'
        })
      },
// OK.
      success: function (result) {
        return cb(null, {
          status : 200,
          body: JSON.parse(result.body)
        })
      },
    })


}


module.exports = {
  request : request
}
