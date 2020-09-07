<h3 align="center">Rocket.Chat-Kanboard</h3>

---

<p align="center"> This script integrates task manupulation routine from [Rocket.Chat](https://github.com/RocketChat/Rocket.Chat) to [Kanboard](https://github.com/kanboard/kanboard)
    <br> 
</p>

## 📝 Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Deployment](#deployment)
- [Usage](#usage)

## 🧐 About <a name = "about"></a>

With this script you can:
* create tasks
* move tasks to "Completed" column
* more?
* get project and column internal id from Kanboard

## 🏁 Getting Started <a name = "getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

- Clone this repo first, there are some configuration to be done localy to this script.

- Modify contents of *kanboard-integration-example.js* to fit you setup:
- Use API key provided by kanboard in "Settings > API" menu. 
- User jsonprc is the default API user, reffer to Kanboard API manuals for information on this and difference in access models
  - authcreds = "jsonrpc:183802e14c2601b77a44b413484110e5c1cb7227bfba3f6ca05d01d5c515";

- Kanboard Project_id is where new tasks from this integration will be created.
- Use command "projects" from integration, it could help you find correct kanboard_project_id.
  - kanboard_project_id = 6;

- Kanboard project's kanboard_column_id is the default column where new tasks will be created, I am using "In progress" column.
- Use command "columns `project id here`" from integration, it will list all columns with their names and id for specified project. 
  - kanboard_column_id = 28;

- kanboard_column_id_completed is the default column where completed task will be moved to (it will not close the tasks, just move it to "Completed" column). 
  - kanboard_column_id_completed = 29;

- default_user is the action that applies to unauthorized Rocket.Chat users accessing integration, see code comments on how this work.
  - default_user = -1;

## 🏁 User mapping <a name = "user_map"></a>

  In *kanboard-integration-example.js*, line 40.
  Map your Rocket.Chat users to appropriate users in Kanboard by copying/adding 'case' switches in code,
  in example script there are one active and one commented user.
  User *geexmmo* is a Rocket.Chat user that accessing integration, he is mapped to user *Arthur Geexmmo* with id 7 in Kanboard.


## 🚀 Deployment <a name = "deployment"></a>

* Create outgoing integration in Rocket.Chat
  * Fill name, channel name and other fields.
  * Fill **"URLs"** field with link to your Kanboard API (https://tasks.example.org/jsonrpc.php)
  * Paste content of your modified copy of *kanboard-integration-example.js* into **"Script"** field
  * *Test if it works*

## 🎈 Usage <a name="usage"></a>

Chat command *help* should get you an idea of how to use this script.

