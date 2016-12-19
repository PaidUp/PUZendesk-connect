module.exports = {
  friendlyName: 'user-update',
  description: 'Update Zendesk User',
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
    userEmail: {
      example: 'test@test.com',
      description: 'user zendesk email.',
      required: true
    },
    userType: {
      example: 'user_type_paidup_customer',
      description: 'Type user.',
      required: true
    },
    paidupcustomer: {
      example: 'nopaidupcustomer',
      description: 'type user.',
      required: true
    },
    beneficiary: {
      example: 'some beneficiary description',
      description: 'beneficiary description.',
      required: true
    },
    products: {
      example: 'product name description',
      description: 'product name.',
      required: true
    },
    tags: {
      example: ['some comment'],
      description: 'array ticket tags.',
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

    client.search.query("email:" + inputs.userEmail, function (err, req, result) {
      if (err) {
        return exits.error(err);
      }
      if (result.length) {
        var cli = result[0];
        client.users.update(cli.id, {
          user: {
            tags: inputs.tags,
            phone: inputs.phone,
            user_fields: { 
              payment_url: "https://app.getpaidup.com",
              paidup_customer: inputs.paidupcustomer,
              athlete_name: inputs.beneficiary,
              products: inputs.products,
              user_type: inputs.userType
           }
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
