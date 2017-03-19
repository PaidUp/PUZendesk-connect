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
      description: 'requester zendesk email.',
      required: true
    },
    requesterName: {
      example: 'John Doe',
      description: 'requester zendesk name.',
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
    comment: {
      example: 'some comment',
      description: 'ticket comment.',
      required: true
    },
    status: {
      example: 'pending',
      description: 'ticket status.',
      required: true
    },
    tags: {
      example: ['some comment'],
      description: 'array ticket tags.',
      required: true
    },
    customFields: {
      example: [],//{id: 111, value: "xxx" }
      description: 'array custom fields.',
      required: true
    },
    removeTags: {
      example: [],//{id: 111, value: "xxx" }
      description: 'array tags for remove.',
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
      if (!result.length) {
        client.users.create({
          user: {
            name: inputs.requesterName,
            email: inputs.requesterEmail,
            verified: true,
            user_fields: {
              payment_url: 'https://app.getpaidup.com'
            }
          },
        }, function (err, req, result) {
          if (err) {
            return exits.error(err);
          }
          createTicket(client, inputs, function (error, data) {
            if (err) {
              return exits.error(err);
            }
            return exits.success(data)
          });
        });
      }
      else {
        createTicket(client, inputs, function (error, data) {
          if (err) {
            return exits.error(err);
          }
          return exits.success(data)
        });
      }
    })

    function createTicket(client, inputs, cb) {
      client.search.query("email:" + inputs.assigneeEmail, function (err, req, result) {
        if (err) {
          return cb(err);
        }

        if (result.length) {
          var assignee = result[0];

          var ticket = {
            ticket: {
              requester: {
                email: inputs.requesterEmail
              },
              assignee_id: assignee.id,
              subject: inputs.subject,
              comment: {
                body: inputs.comment
              },
              status: inputs.status,
              tags: inputs.tags,
              custom_fields: inputs.customFields
            }
          }

          client.tickets.create(ticket,
            function (err, req, result) {
              if (err) {
                return cb(err);
              }
              if (inputs.removeTags.length) {
                client.tickets.updateMany(result.id, {
                  "ticket": {
                    "remove_tags": inputs.removeTags
                  }
                }, function (err, req, resultUpd) {
                  if (err) {
                    return exits.error(err);
                  }
                  return exits.success(resultUpd);
                });
              }
            });
        } else {
          return cb({ error: "assignee email isn't valid" });
        }
      });
    }

  },
};
