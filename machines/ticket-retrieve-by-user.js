module.exports = {
  friendlyName: 'ticket-retrieve-by-user',
  description: 'Tickets list by user',
  extendedDescription: 'Tickets list by user',
  cacheable: false,
  sync: false,
  inputs: {
    username: {
      example: 'ricardo@getpaidup.com',
      description: 'Zendesk email admin account',
      required: true
    },
    token: {
      example: 'secret-word',
      description: 'secret word for autenticate.',
      required: true
    },
    subdomain: {
      example: 'paidup',
      description: 'zendesk subdomain.',
      required: true
    },
    requesterEmail: {
      example: 'test@test.com',
      description: 'user zendesk email.',
      required: true
    }
  },
  defaultExit: 'success',
  exits: {
    success: {
      friendlyName: 'then',
      description: 'Object result',
      example: "*"
    },
    error: {
      description: 'Some error with his status',
      example: '*'
    }
  },

  fn: function (inputs, exits) {

    var zendesk = require('node-zendesk');

    var client = zendesk.createClient({
      username: inputs.username,
      token: inputs.token,
      remoteUri: 'https://' + inputs.subdomain + '.zendesk.com/api/v2',
      oauth: false
    });

    client.search.query("email:" + inputs.requesterEmail, function (err, req, result) {
      if (err) {
        return exits.error(err);
      }
      if (result.length) {
        var cli = result[0];
        client.tickets.listByUserRequested(cli.id, function (err, req, result) {
          if (err) {
            return exits.error(err);
          }

          return exits.success(result);
        });
      } else {
        return exits.success([]);
      }
    });
  },
};
