/* exported Script */
/* globals console, _, s, HTTP */

/** Global Helpers
 *
 * console - A normal console instance
 * _       - An underscore instance
 * s       - An underscore string instance
 * HTTP    - The Meteor HTTP object to do sync http calls
 */
authcreds = "jsonrpc:183802e14c2601b77a44b413484110e5c1cb7227bfba3f6ca05d01d5c515";
kanboard_project_id = 6;
kanboard_column_id = 28;
kanboard_column_id_completed = 29;
/* if Rocket.Chat user is accesing this script and are not defined above in 'rocketchat_to_kanboard_user_id' switch,
default_user = -1 will cause api error and task will not be created
default_user = 0 will cause task to be created and assigned to nobody  
*/ 
default_user = -1;

class Script {
 /**
  * @params {object} request
  */
 prepare_outgoing_request({ request }) {
   // request.params            {object}
   // request.method            {string}
   // request.url               {string}
   // request.auth              {string}
   // request.headers           {object}
   // request.data.token        {string}
   // request.data.channel_id   {string}
   // request.data.channel_name {string}
   // request.data.timestamp    {date}
   // request.data.user_id      {string}
   // request.data.user_name    {string}
   // request.data.text         {string}
   // request.data.trigger_word {string}

   // Mapping Rocket.Chat user name to kanboard user_id
   rocketchat_to_kanboard_user_id = request.data.user_name;
   switch (rocketchat_to_kanboard_user_id) {
   // Rocket.Chat user 'geexmmo' will be mapped to kanboard user with id=7 
     case 'geexmmo':
      kanboard_user_id = 7;
    break;
   //  case 'goga':
   //    kanboard_user_id = 5;
   //  break;
    default:
     kanboard_user_id = default_user;
   }
   
   let match;

   //
   // createTask
   //
   // Match chat messages for keyword 'new' and send appropriate request to api
   match = request.data.text.match(/^new/);
   // removing first word from 'request.data.text' - what is left will be used as task title
   var str = request.data.text
   var argument = str.split(' ').slice(1).join(' ')
   // json data structuring
   if (match) {
     return {
       method: 'POST',
       url: request.url,
       headers: request.headers,
       auth: authcreds,
       data: {'jsonrpc': '2.0','method': 'createTask','id': 1,
             'params': {'owner_id': kanboard_user_id,
             'creator_id': 1,
             'date_due': '',
             'score': 0,
             'title': argument,
             'description': 'Created from API',
             'project_id': kanboard_project_id,
             'column_id': kanboard_column_id}}
     };
   }

   //
   // moveTaskPosition (finished tasks)
   //
   // Match chat messages for keyword 'close' and send appropriate request to api
   match = request.data.text.match(/^close/);
   // removing first word from 'request.data.text' - what is left will be used as task title
   var str = request.data.text
   var argument = str.split(' ').slice(1).join(' ')
   // json data structuring
   if (match) {
     return {
       method: 'POST',
       url: request.url,
       headers: request.headers,
       auth: authcreds,
       data: {"jsonrpc": "2.0","method": "moveTaskPosition","id": 2,
             "params": {"project_id": kanboard_project_id,
             "task_id": argument,
             "column_id": kanboard_column_id_completed,
             "position": 1,
             "swimlane_id": 1}}
     };
   }
   
   //
   // getAllProjects
   //
   // Match chat messages for keyword 'projects' and send appropriate request to api
   match = request.data.text.match(/^projects/);
   // json data structuring
   if (match) {
     return {
       method: 'POST',
       url: request.url,
       headers: request.headers,
       auth: authcreds,
       data: {"jsonrpc": "2.0","method": "getAllProjects","id": 3}
     };
   }
   
   //
   // getColumns
   //
   // Match chat messages for keyword 'columns' and send appropriate request to api
   match = request.data.text.match(/^columns/);
   // removing first word from 'request.data.text' - what is left will be used as project_id in query
   var str = request.data.text
   var argument = str.split(' ').slice(1).join(' ')
   // json data structuring
   if (match) {
     return {
       method: 'POST',
       url: request.url,
       headers: request.headers,
       auth: authcreds,
       data: {"jsonrpc": "2.0","method": "getColumns","id": 4,"params": [argument]}
    };
   }

   // Prevent the request and return a new message with options
   match = request.data.text.match(/^help$/);
   if (match) {
     return {
       message: {
         text: [
           '**commands**',
           '```',
             '  new "text" Creates new task from user mapped to your Rocket.Chat username',
           '```'
         ].join('\n')
       }
     };
   }
 }

 /**
  * @params {object} request, response
  */
 process_outgoing_response({ request, response }) {
   // request              {object} - the object returned by prepare_outgoing_request

   // response.error       {object}
   // response.status_code {integer}
   // response.content     {object}
   // response.content_raw {string/object}
   // response.headers     {object}

   // var text = [];
   // response.content.forEach(function(obj) {
   //   text.push('> '+obj.state+' [#'+obj.number+']('+obj.html_url+') - '+obj.title);
   // });

   // example of json parsing, will return obj code (task id if succeded in creating a task)
   //var text = response.content.result;
   // var text = response.content_raw;
   
   // Mapping response from repsonse id
   response_jsonid = response.content.id;
   var text = [];
   switch (response_jsonid) {
    // createTask
    case 1:
     text.push('Задача создана, id: '+response.content.result);
    break;
    // moveTaskPosition
    case 1:
     text.push('Задача перемещена, id: '+response.content.result);
    break;

    // getAllProjects
    case 3:
     response.content.result.forEach(function(obj) {
       text.push('project_id: "'+obj.id+'" #'+obj.name+' owner_id: "'+obj.owner_id+'"');
     });
    break;
    // getColumns
    case 4:
     response.content.result.forEach(function(obj) {
       text.push('column_id: "'+obj.id+'" #'+obj.title);
     });
    break;
    // if nothing mathed - there is an error probably, whole json will be displayed
    default:
     text.push(response.content_raw);
   }

   return {
     content: {
       text: text.join('\n'),
       // text: text,
       parseUrls: false
       // "attachments": [{
       //   "color": "#FF0000",
       //   "author_name": "Rocket.Cat",
       //   "author_link": "https://open.rocket.chat/direct/rocket.cat",
       //   "author_icon": "https://open.rocket.chat/avatar/rocket.cat.jpg",
       //   "title": "Rocket.Chat",
       //   "title_link": "https://rocket.chat",
       //   "text": "Rocket.Chat, the best open source chat",
       //   "fields": [{
       //     "title": "Priority",
       //     "value": "High",
       //     "short": false
       //   }],
       //   "image_url": "https://rocket.chat/images/mockup.png",
       //   "thumb_url": "https://rocket.chat/images/mockup.png"
       // }]
     }
   };
 }
}