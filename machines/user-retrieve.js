module.exports = {
  friendlyName: 'user-retrieve',
  description: 'Create Zendesk User',
  extendedDescription: 'Create Zendesk Use',
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
    email: {
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
      example:  '*'
      
    }

  },

  fn: function (inputs, exits) {

    var zendesk = require('node-zendesk');

    var client = zendesk.createClient({
      username: inputs.username,
      token: inputs.token,
      subdomain: 'https://' + inputs.subdomain + '.zendesk.com/api/v2',
      oauth: false
    });



    client.search.query("email:"+inputs.email, function (err, req, result) {
      if (err) {
        return exits.error(err);
      }
      return exits.success(result);
    });

  },
};
