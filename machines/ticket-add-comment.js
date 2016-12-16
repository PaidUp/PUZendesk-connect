module.exports = {
  friendlyName: 'ticket-add-comment',
  description: 'Tickets add comment',
  extendedDescription: 'add tickets comment',
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
    ticketId: {
      example: '111111111111',
      description: 'zendesk ticket id.',
      required: true
    },
    comment: {
      example: 'some comment',
      description: 'zendesk ticket comment.',
      required: true
    },
    tags: {
      example: ['some_tag'],
      description: 'zendesk ticket tag.',
      required: true
    },
    isPublic: {
      example: true,
      description: 'type of comment.',
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

    client.tickets.update(inputs.ticketId, {
      "ticket": {
        "comment": { "body": inputs.comment, "public": inputs.isPublic },
        "tags": inputs.tags
      }
    }, function (err, req, result) {
      if (err) {
        return exits.error(err);
      }
      return exits.success(result);

    });
  },
};
