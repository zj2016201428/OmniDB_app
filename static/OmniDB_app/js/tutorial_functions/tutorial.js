/*
This file is part of OmniDB.
OmniDB is open-source software, distributed "AS IS" under the MIT license in the hope that it will be useful.

The MIT License (MIT)

Portions Copyright (c) 2015-2020, The OmniDB Team
Portions Copyright (c) 2017-2020, 2ndQuadrant Limited

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

function startTutorial(p_tutorial_name) {
  if (v_omnis.omnis_ui_assistant) {
    v_omnis.omnis_ui_assistant.self_destruct();
  }
  // Disabling interactions with omnis.
  v_omnis.div.classList.add('omnis--active');
  // Instantiate the component.
  v_omnis.omnis_ui_assistant = createOmnisUiAssistant({
    p_callback_end: function(){
      // Configuring to delete the componente when it's no longer used.
      delete v_omnis.omnis_ui_assistant;
      // Enabling interactions with omnis.
      v_omnis.div.classList.remove('omnis--active');
    },
    // Omnis Object
    p_omnis: v_omnis
  });
  // Setting the tutorial to the default example tutorial `main`.
  var v_tutorial_name = (p_tutorial_name) ? p_tutorial_name : 'main';
  var v_button_inner_query_attr = ' disabled title="首先打开一个新连接." ';
  if (v_connTabControl.selectedTab.tag.tabControl) {
    if (v_connTabControl.selectedTab.tag.tabControl.tabList.length > 0) {
      v_button_inner_query_attr = '';
    }
  }
  var v_button_inner_query =
  '<li class="mb-2">' +
    `<button ` + v_button_inner_query_attr + ` type="button" class="btn omnidb__theme__btn--primary d-flex align-items-center" onclick="startTutorial('connection_tab');">` +
      '<i class="fas fa-list mr-2"></i>The Connection Tab' +
    '</button>' +
  '</li>';
  // Configuring the available tutorials.
  var v_tutorials = {
    'main': [
      {
        p_message: 'This contains the outer connection and global panels [ connections_list_manager, snippets_panel, [conn_1, conn_2, ...], add_connection]',
        p_target: document.getElementsByClassName('omnidb__tab-menu omnidb__tab-menu--primary')[0],
        p_title: 'Primary menu'
      },
      {
        p_message: 'This contains general settings and options, such as [ versioning, connections_list_manager, user_setting, plugins...]',
        p_target: document.getElementsByClassName('omnidb__utilities-menu')[0],
        p_title: 'Utilities menu'
      }
    ],
    'utilities_menu': [
      {
        p_callback_end: function() {$('.omnidb__utilities-menu').removeClass('omnidb__utilities-menu--show');},
        p_callback_start: function() {$('.omnidb__utilities-menu').addClass('omnidb__utilities-menu--show');},
        p_clone_target: true,
        p_message: `
        <p>Contains general settings and options:</p>
        <ul>
        <li>Username and versioning.</li>
        <li><i class="fas fa-plug omnidb__theme__text--primary mr-2"></i>Connection management.</li>
        <li><i class="fas fa-user omnidb__theme__text--primary mr-2"></i>User management.</li>
        <li><i class="fas fa-cog omnidb__theme__text--primary mr-2"></i>UI settings (shortcuts, theme, fonts...).</li>
        <li><i class="fas fa-cube omnidb__theme__text--primary mr-2"></i>Plugins management.</li>
        <li><i class="fas fa-sign-out-alt omnidb__theme__text--primary mr-2"></i>About.</li>
        </ul>
        `,
        p_target: document.getElementsByClassName('omnidb__utilities-menu')[0],
        p_title: 'Utilities Menu',
        p_update_delay: 350
      },
      {
        p_callback_end: function() {$('.omnidb__utilities-menu').removeClass('omnidb__utilities-menu--show');},
        p_callback_start: function() {$('.omnidb__utilities-menu').addClass('omnidb__utilities-menu--show');},
        p_clone_target: true,
        p_message: `
        <p>If you just configured OmniDB and logged with the default <strong>admin</strong> user, you should create the first user.</p>
        <p>Follow this walkthrough if you want to create other users as well.</p>
        `,
        p_next_button: false,
        p_target: document.getElementById('omnidb__utilities-menu__link-user'),
        p_title: 'Managing Users'
      },
      {
        p_callback_after_update_start: function() {setTimeout(function(){
            if (v_omnis.omnis_ui_assistant.divClonedElement.children[0]) {
              v_omnis.omnis_ui_assistant.divClonedElement.children[0].classList.remove('ml-2');
            }
          },50);
        },
        p_clone_target: true,
        p_message: `
        <p>Click on <strong>Add new user</strong>.</p>
        `,
        p_next_button: false,
        p_target: function() {var v_target = document.getElementById('omnidb_utilities_menu_btn_new_user'); return v_target},
        p_title: 'Add a New User',
        p_update_delay: 1000
      },
      {
        p_message: `
        <ul>
        <li><i class="fas fa-user omnidb__theme__text--primary mr-2"></i>OmniDB login name.</li>
        <li><i class="fas fa-key omnidb__theme__text--primary mr-2"></i>OmniDB login password.</li>
        <li><i class="fas fa-star omnidb__theme__text--primary mr-2"></i>Defines if the user can manage other OmniDB users.</li>
        </ul>
        <div class="alert alert-danger">The default <strong>admin user</strong> should be deleted once a new super user has been created.</div>
        `,
        p_target: function() {var v_target = document.getElementById('omnidb_user_content'); return v_target},
        p_title: 'User Options',
        p_update_delay: 350
      }
    ],
    'connections_menu': [
      {
        p_clone_target: true,
        p_message: `
        <p>This is the outer connections menu. Each connection added becomes a new item in this menu.</p>
        <p>The menu initially contains.</p>
        <ul>
        <li>Connections manager.</li>
        <li>Welcome, tutorial and useful links.</li>
        <li>Snippets panel toggler.</li>
        <li>Add connection.</li>
        </ul>
        <p>Let's first <span class="badge badge-info">add a new connection</span>.</p>
        <p>Please, click on the <i class="fas fa-plus"></i> button.</p>
        `,
        p_target: document.getElementsByClassName('omnidb__tab-menu omnidb__tab-menu--primary')[0],
        p_title: 'Primary menu'
      },
      {
        p_callback_after_update_start: function() {setTimeout(function(){var v_target = document.getElementById('button_new_connection'); v_omnis.omnis_ui_assistant.divClonedElement.children[0].classList.remove('ml-2');},50);},
        p_callback_start: function() {startConnectionManagement();},
        p_clone_target: true,
        p_message: `
        <p>Click on <strong>New Connection</strong>.</p>
        `,
        p_next_button: false,
        p_target: function() {var v_target = document.getElementById('button_new_connection'); return v_target},
        p_title: 'Add a New Connection',
        p_update_delay: 1000
      },
      {
        p_message: `
        <p>Select the proper DBMS technology.</p>
        `,
        p_target: function() {var v_target = document.getElementById('conn_form_type'); return v_target},
        p_title: 'Connection Type',
        p_update_delay: 300
      },
      {
        p_message: `
        <p>Type a helpful name for the connection.</p>
        <p>This is used as name reference on many UI areas.</p>
        <p>i.e: Local dvdrental barman.</p>
        `,
        p_target: function() {var v_target = document.getElementById('conn_form_title'); return v_target},
        p_title: 'Title'
      },
      {
        p_message: `
        <p>Type the server address. Do not include ports.</p>
        <p>i.e:127.0.0.1</p>
        `,
        p_target: function() {var v_target = document.getElementById('conn_form_server'); return v_target},
        p_title: 'Server'
      },
      {
        p_message: `
        <p>Type the port of the server.</p>
        <p>i.e: PostgreSQL uses 5432 by default, but if you are using pgbouncer, you may want to use 6432 as the entry point.</p>
        `,
        p_target: function() {var v_target = document.getElementById('conn_form_port'); return v_target},
        p_title: 'Port'
      },
      {
        p_message: `
        <p>Type the name of the database.</p>
        <p>i.e: postgres, dvdrental.</p>
        `,
        p_target: function() {var v_target = document.getElementById('conn_form_database'); return v_target},
        p_title: 'Database'
      },
      {
        p_message: `
        <p>Type the name of the user with priviledges to access the database.</p>
        <p>i.e: postgres.</p>
        `,
        p_target: function() {var v_target = document.getElementById('conn_form_user'); return v_target},
        p_title: 'User'
      },
      {
        p_message: `
        <p>This is <strong>optional</strong>.</p>
        <p>If you don't save the user password, you will be required to manually input it everytime a new connection to this database is started.</p>
        <p>If saved, this password will be stored in the database configured for OmniDB (default is omnidb.db).</p>
        `,
        p_target: function() {var v_target = document.getElementById('conn_form_user_pass'); return v_target},
        p_title: 'User password'
      },
      {
        p_message: `
        <p>You may want to hit 'test' before saving the conntion.</p>
        <p>After that, click save.</p>
        `,
        p_target: function() {var v_target = document.getElementById('conn_form_button_test_connection'); return v_target},
        p_title: 'Test the Connection'
      }
    ],
    'terminal_connection': [
      {
        p_clone_target: true,
        p_message: `
        <p>First let's open the <strong>connections management</strong> interface.</p>
        <p>Please, click on the OmniDB Icon button.</p>
        `,
        p_target: document.getElementsByClassName('omnidb__tab-menu omnidb__tab-menu--primary')[0],
        p_title: 'Accessing connections managemnet'
      },
      {
        p_callback_after_update_start: function() {setTimeout(function(){var v_target = document.getElementById('button_new_connection'); v_omnis.omnis_ui_assistant.divClonedElement.children[0].classList.remove('ml-2');},50);},
        p_callback_start: function() {startConnectionManagement();},
        p_clone_target: true,
        p_message: `
        <p>Click on <strong>New Connection</strong>.</p>
        `,
        p_next_button: false,
        p_target: function() {var v_target = document.getElementById('button_new_connection'); return v_target},
        p_title: 'Add a New Connection',
        p_update_delay: 1000
      },
      {
        p_message: `
        <p>Select the Terminal technology.</p>
        `,
        p_target: function() {var v_target = document.getElementById('conn_form_type'); return v_target},
        p_title: 'Connection Type',
        p_update_delay: 300
      },
      {
        p_message: `
        <p>Type a helpful name for the terminal connection.</p>
        <p>This is used as name reference on many UI areas.</p>
        <p>i.e: Local terminal.</p>
        `,
        p_target: function() {var v_target = document.getElementById('conn_form_title'); return v_target},
        p_title: 'Title'
      },
      {
        p_message: `
        <p>The terminal utilizes SSH technology.</p>
        <p>As you can see, in this case SSH parameters are mandatory.</p>
        `,
        p_target: function() {var v_target = document.getElementById('conn_form_use_tunnel'); return v_target},
        p_title: 'SSH parameters'
      },
      {
        p_message: `
        <p>Type the ssh server address. Do not include ports.</p>
        <p>i.e:127.0.0.1</p>
        `,
        p_target: function() {var v_target = document.getElementById('conn_form_ssh_server'); return v_target},
        p_title: 'SSH server'
      },
      {
        p_message: `
        <p>Type the port of the SSH server.</p>
        <p>i.e: 22 is a default port for working with SSH tunnels.</p>
        `,
        p_target: function() {var v_target = document.getElementById('conn_form_ssh_port'); return v_target},
        p_title: 'SSH Port'
      },
      {
        p_message: `
        <p>Type the name of the SSH user.</p>
        <p>i.e: If you are on linux, your linux user is available for a local connection.</p>
        `,
        p_target: function() {var v_target = document.getElementById('conn_form_ssh_user'); return v_target},
        p_title: 'SSH User'
      },
      {
        p_message: `
        <p>If you want you can save the password of your user.</p>
        <p>* Leaving this empty will force the tool to request for your password everytime you open a terminal connection.</p>
        <p>i.e: If you are on linux, your linux user is available for a local connection.</p>
        `,
        p_target: function() {var v_target = document.getElementById('conn_form_ssh_password'); return v_target},
        p_title: 'SSH Password (optional)'
      },
      {
        p_message: `
        <p>This is <strong>optional</strong>.</p>
        <p>It allows you to configure a SSH key.</p>
        `,
        p_target: function() {var v_target = document.getElementById('conn_form_ssh_key_input_label'); return v_target},
        p_title: 'SSH Key'
      },
      {
        p_message: `
        <p>You may want to hit 'test' before saving the conntion.</p>
        <p>After that, click save.</p>
        `,
        p_target: function() {var v_target = document.getElementById('conn_form_button_test_connection'); return v_target},
        p_title: 'Test the Connection'
      }
    ],
    'snippets': [
      {
        p_clone_target: true,
        p_message: `
        <p>The snippet panel is now accessible globally.</p>
        <p>Please, click on the <i class="fas fa-book"></i> button.</p>
        `,
        p_target: document.getElementsByClassName('omnidb__tab-menu omnidb__tab-menu--primary')[0],
        p_title: 'Global Snippet Panel'
      },
      {
        // p_callback_after_update_start: function() {setTimeout(function(){var v_target = document.getElementById(v_connTabControl.snippet_tag.tabControl.selectedTab.tag.editorDivId);},50);},
        p_callback_start: function() {toggleSnippetPanel();},
        p_message: `
        <p>Inside this tab you can create and edit a snippet.</p>
        <p>Go ahead and try to create some simple snippet, i.e:</p>
        <code>WHERE true SELECT 1;</code>
        <p>Then experiment clicking on the <strong>indent button</strong> below the editor, and then <strong>next</strong>.</p>
        `,
        p_next_button: true,
        p_target: function() {var v_target = document.getElementById('a_' + v_connTabControl.snippet_tag.tabControl.selectedTab.tag.tab_id); return v_target},
        p_title: 'Snippets editor',
        p_update_delay: 600
      },
      {
        p_message: `
        <p>As you can see, the identation feature automatically adjusts your code following a pattern.</p>
        <p>Now go ahead and click <strong>save</strong></p>
        `,
        p_next_button: true,
        p_target: function() {var v_target = document.getElementById('a_' + v_connTabControl.snippet_tag.tabControl.selectedTab.tag.tab_id); return v_target},
        p_title: 'Indenting'
      },
      {
        p_message: `
        <p>Every snippet you save is stored under your user.</p>
        <p>The tree on the left allows you to easily access it by double-clicking on the snippet.</p>
        `,
        p_next_button: false,
        p_target: function() {var v_target = document.getElementById(v_connTabControl.snippet_tag.divTree.getAttribute('id')); return v_target},
        p_title: 'Saved Snippets',
        p_update_delay: 600
      }
    ],
    'selecting_connection': [
      {
        p_message: `
        <p>The <strong>outer_tab</strong> contains global panels related to workspace and also access to created connections.</p>
        <ol style="padding-left: 1.5rem;">
          <li class="mb-2">
            To access a connection, click on the <i class="fas fa-plus"></i> button.
          </li>
          <li class="mb-2">
            Navigate to the proper technology on the custom menu.
          </li>
          <li class="mb-2">
            Click on the connection.
          </li>
        </ol>
        <p>Now you can close this walkthrough and open a new connection.</p>
        `,
        p_position: function() {var v_target = v_connTabControl.tabList[v_connTabControl.tabList.length - 1].elementA; return {x:v_target.getBoundingClientRect().x + 40,y:v_target.getBoundingClientRect().y}},
        p_target: function(){var v_target = v_connTabControl.tabList[v_connTabControl.tabList.length - 1].elementA; return v_target;},
        p_title: 'Selecting a Connection'
      }
    ],
    'connection_tab': [
      {
        p_message: `
        <p>This identifies the database you are connected with:</p>
        `,
        p_target: function(){var v_target = v_connTabControl.selectedTab.tag.divDetails; return v_target;},
        p_title: 'Current Connection'
      },
      {
        p_message: `
        <p>This tree is main your access point to this connection.</p>
        <p><strong>How-to</strong>:</p>
        <ul style="padding-left: 1.5rem;">
          <li class="mb-1">
            <strong>Double-click</strong>: expands child nodes based on the database internal structure.
          </li>
          <li class="mb-2">
            <strong>Right-click</strong>: Context menu with actions based on the node type.
          </li>
        </ul>
        `,
        p_target: function(){var v_target = v_connTabControl.selectedTab.tag.divTree; return v_target;},
        p_title: 'Aimara Tree'
      },
      {
        p_message: `
        <p>These tabs provide additional info to the node you interact with in the Aimara Tree.</p>
        <p>Keep in mind that every node interaction that returns this type of info needs to query for consistency.</p>
        <p>To minimize queries, these only run when one of these tabs is visible.</p>
        <p><strong>Recommendation</strong>: Only open the property/ddl when you need to update this info.</p>
        `,
        p_target: function(){var v_target = v_connTabControl.selectedTab.tag.divTreeTabs; return v_target;},
        p_title: 'Properties / DDL'
      },
      {
        p_message: `
        <p>There are two types of inner_tabs available.</p>
        <ol style="padding-left: 1.5rem;">
          <li class="mb-1">
            <strong><i class="fas fa-terminal"></i> Console Tab</strong>: Contains a psql console.
          </li>
          <li class="mb-1">
            <strong>Query Tabs</strong>: These have SQL editors whose commands are executed on the selected database.
          </li>
        </ol>
        <div class="alert-info p-2">Keep in mind that when you run a query from the contextual menu of the Aimara Tree, it will open a new query tab and execute it.</div>
        `,
        p_target: function(){var v_target = v_connTabControl.selectedTab.tag.tabControl.tabList[0].elementA; return v_target;},
        p_title: 'Inner Tabs'
      },
      {
        p_message: `
        <p>These buttons request actions based on the SQL editor and the querying status.</p>
        <p>For example, you can <span class="bg-info rounded px-1 text-white">run</span> a query, <span class="bg-info rounded px-1 text-white">cancel</span> an ongoing query, <span class="bg-info rounded px-1 text-white">fetch more</span>, <span class="bg-info rounded px-1 text-white">explain</span>, <span class="bg-info rounded px-1 text-white">explain analyze</span>.</p>
        <p>If you navigate the Tree on the left to find a table and use the action Query Table from it's context menu, the editor will autofill and the run query will be issued.</p>
        `,
        p_position: function() {var v_target = $(v_connTabControl.selectedTab.tag.tabControl.selectedTab.elementDiv).find('.omnidb__tab-actions')[0]; return {x:v_target.getBoundingClientRect().x + 40,y:v_target.getBoundingClientRect().y}},
        p_target: function(){var v_target = $(v_connTabControl.selectedTab.tag.tabControl.selectedTab.elementDiv).find('.omnidb__tab-actions')[0]; return v_target;},
        p_title: 'Actions Panel'
      },
      {
        p_message: `
        <p>Query returns will fill the area below your screen, even when they return errors.</p>
        <p>After running a query, this area will contain 3 special tabs.</p>
        <ol style="padding-left: 1.5rem;">
          <li class="mb-1">
            <strong>Data</strong>: Contains a table with query results, when successful.
          </li>
          <li class="mb-1">
            <strong>Messages</strong>: Displays error messages.
          </li>
          <li class="mb-1">
            <strong>Explain</strong>: Contains a special component to display explain/explain analyze results.
          </li>
        </ol>
        `,
        p_position: function() {var v_target = v_connTabControl.selectedTab.tag.tabControl.selectedTab.tag.div_result; return {x:v_target.getBoundingClientRect().x + 40,y:v_target.getBoundingClientRect().y + 40}},
        p_target: function(){var v_target = $(v_connTabControl.selectedTab.tag.tabControl.selectedTab.tag.divResult).find('.omnidb__tab-actions')[0]; return v_target;},
        p_title: 'Query Result'
      }
    ]
  }
  // Configuring tutorial getting started, changes based on gv_desktopMode
  let v_tutorial_link_creating_user = (gv_desktopMode)
  ? ''
  : `
  <li class="mb-2">
    <button type="button" class="btn omnidb__theme__btn--primary d-flex align-items-center" onclick="startTutorial('utilities_menu');">
      <i class="fas fa-user-plus mr-2"></i>Create an omnidb user
    </button>
  </li>`;
  v_tutorials.getting_started = [
    {
      p_message:
      '<ol style="padding-left: 1.5rem;">' +
        v_tutorial_link_creating_user +
        `
        <li class="mb-2">
          <button type="button" class="btn omnidb__theme__btn--primary d-flex align-items-center" onclick="startTutorial('connections_menu');">
            <i class="fas fa-plug mr-2"></i>Create a database connection
          </button>
        </li>
        <li class="mb-2">
          <button type="button" class="btn omnidb__theme__btn--primary d-flex align-items-center" onclick="startTutorial('terminal_connection');">
            <i class="fas fa-terminal mr-2"></i>Create a terminal connection
          </button>
        </li>
        <li class="mb-2">
          <button type="button" class="btn omnidb__theme__btn--primary d-flex align-items-center" onclick="startTutorial('snippets');">
            <i class="fas fa-book mr-2"></i>Meet the snippets panel
          </button>
        </li>
        <li class="mb-2">
          <button type="button" class="btn omnidb__theme__btn--primary d-flex align-items-center" onclick="startTutorial('selecting_connection');">
            <i class="fas fa-plus mr-2"></i>Using a connection
          </button>
        </li>
        ` +
        v_button_inner_query +
      '</ol>',
      p_title: '<i class="fas fa-list mr-2"></i> Getting started'
    }
  ];

  // Selecting a tutorial
  var v_steps = v_tutorials[v_tutorial_name];
  // Update the step list with the new walkthrough
  v_omnis.omnis_ui_assistant.updateStepList(v_steps);
  // Go to the first step of the walkthrough
  v_omnis.omnis_ui_assistant.goToStep(0);
}
