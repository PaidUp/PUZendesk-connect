module.exports = {
  friendlyName: 'user-create',
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
    },
    fullName: {
      example: 'John Doe',
      description: 'User full name.',
      required: true
    },
    phone: {
      example: '+133344455555',
      description: 'User full name.',
      required: false
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

    client.search.query("email:" + inputs.email, function (err, req, result) {
      if (err) {
        return exits.error(err);
      }
      if (result.length) {
        var cli = result[0];
        client.users.update(cli.id, {
          user: {
            name: inputs.fullName,
            phone: inputs.phone,
            user_fields: { payment_url: "https://app.getpaidup.com" }
          }
        }, function (err, req, result) {
          if (err) {
            return exits.error(err);
          }

          return exits.success(result);
        });
      } else {
        client.users.create({
          user: {
            name: inputs.fullName,
            phone: inputs.phone,
            email: inputs.email,
            verified: true,
            tags: ['notpaidupcustomer'],
            user_fields: {
              paidup_customer: 'notpaidupcustomer',
              payment_url: 'https://app.getpaidup.com'
            }
          },
        }, function (err, req, result) {
          if (err) {
            return exits.error(err);
          }
          return exits.success(result);
        });
      }
    });
  },
};
