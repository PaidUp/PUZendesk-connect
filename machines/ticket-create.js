module.exports = {
  friendlyName: 'ticket-create',
  description: 'Create Zendesk Ticket',
  extendedDescription: 'Create Zendesk Ticket',
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
      description: 'reuester zendesk email.',
      required: true
    },
    assigneeEmail: {
      example: 'assignee zendesk email',
      description: 'assignee email.',
      required: true
    },
    subject: {
      example: 'some subject',
      description: 'ticket subject.',
      required: true
    },
    organization: {
      example: 'organization name',
      description: 'organization mail.',
      required: true
    },
    comment: {
      example: 'some comment',
      description: 'ticket comment.',
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



    client.search.query("email:" + inputs.assigneeEmail, function (err, req, result) {
      if (err) {
        return exits.error(err);
      }


      if (result.length) {
        var assignee = result[0];

        var ticket = {
          ticket: {
            requester: {
              email: inputs.requesterEmail
            },
            assignee_id: assignee.id,
            subject: inputs.organization + ' Payment Failed for ' + inputs.subject,
            organization: inputs.organization,
            comment: {
              body: inputs.comment
            },
            status: 'pending',
            tags: ['ticket_category_payment_failed_new_card']
          }
        }

        client.tickets.create(ticket, 
         function (err, req, result) {
          if (err) {
            return exits.error(err);
          }
          return exits.success(result);
        });
      } else {
        return exits.error({error: "assignee email isn't valid"});
      }
    });
  },
};