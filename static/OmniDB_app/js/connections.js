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

/// <summary>
/// Startup function.
/// </summary>
$(function () {
	v_connections_data = new Object();
  v_connections_data.technologies = null;
  v_connections_data.card_list = [];
  v_connections_data.current_id = -1;

	// $('#modal_connections').on('hide.bs.modal', function (e) {
  //   startConnectionManagement();
  // });
});

function startConnectionManagement() {
	getDatabaseList();
  getGroups();
  showConnectionList(true,true);
}


function showConnectionList(p_open_modal, p_change_group) {

	var v_conn_id_list = [];
	var v_total_public_conn = 0;

	for (var i=0; i < v_connTabControl.tabList.length; i++) {
		var v_tab = v_connTabControl.tabList[i];
		if (v_tab.tag && v_tab.tag.mode=='connection')
			v_conn_id_list.push(v_tab.tag.selectedDatabaseIndex);
		else if (v_tab.tag && v_tab.tag.mode=='outer_terminal' && v_tab.tag.connId!=null)
			v_conn_id_list.push( v_tab.tag.connId);
	}

	var input = JSON.stringify({"p_conn_id_list": v_conn_id_list});

	execAjax('/get_connections/',
		input,
		function(p_return) {

      v_connections_data.card_list = [];
      v_connections_data.technologies = p_return.v_data.v_technologies;

      //Building connection cards
			var v_container = null;
      var v_container = document.createElement('div');
      v_container.className = 'container-fluid';

      var v_row = null;

      var v_target_div = document.getElementById('connection_card_list');

      var v_row = document.createElement('div');
      v_row.className = 'row';

			v_row.innerHTML =
			'<div id="connections_management_empty_all" class="my-4 text-center w-100" style="display:none;">' +
				'<h5 class="">没有可用的连接.</h5>' +
				'<button type="button" class="mt-4 btn omnidb__theme__btn--primary" onclick="newConnection();">新建连接</button>' +
			'</div>' +
			'<div id="connections_management_empty_with_public" class="my-4 text-center w-100" style="display:none;">' +
				'<i class="fas fa-arrow-up text-info"></i>' +
				'<h5 class="">您的用户尚未配置连接，但有 <i class="fas fa-users text-info mx-2"></i> 公共连接。</h5>' +
				'<h5 class="d-inline-block mt-4 mr-2">您还可以创建自己的</h5>' +
				'<button type="button" class="mt-2 btn omnidb__theme__btn--primary" onclick="newConnection();">新建连接</button>' +
			'</div>' +
			'<div id="connections_management_empty_group" class="my-4 text-center w-100" style="display:none;">' +
				'<h5 class="">尚未为此组分配任何连接.</h5>' +
				'<button type="button" class="mt-4 btn omnidb__theme__btn--primary" onclick="manageGroup();">管理组</button>' +
			'</div>';

      for (var i=0; i<p_return.v_data.v_conn_list.length; i++) {
        var v_conn_obj = p_return.v_data.v_conn_list[i];

        var v_col_div = document.createElement('div');
        v_col_div.className = 'omnidb__connections__cols';
        v_row.appendChild(v_col_div);
				if (v_conn_obj.public && !v_connections_data.show_public && !v_conn_obj.is_mine) {
					v_col_div.classList.add('d-none');
				}

        var v_card_div = document.createElement('div');
        v_card_div.className = 'card omnidb__connections__card';
        v_col_div.appendChild(v_card_div);

        var v_cover_div = document.createElement('label');
        v_cover_div.className = 'connection-card-cover m-0';
				v_cover_div.setAttribute('for','connection_item_input_' + i);

        var v_checkbox = document.createElement('input');
        v_checkbox.className = 'connection-card-checkbox';
				v_checkbox.id = 'connection_item_input_' + i;
        v_checkbox.type="checkbox";


				var v_check_svg =
				'<svg class="connection-card-svg" width="42" height="42" viewBox="0 0 42 42" xmlns="http://www.w3.org/2000/svg">' +
					'<path d="M 6 18 L 15 32 L 34 13" stroke-width="4" stroke="#4a81d4" fill="transparent"></path>' +
					'<circle r="19" cx="21" cy="21" stroke-width="2" stroke="#b2b2b2" fill="transparent"></circle>' +
				'</svg>';

				v_cover_div.innerHTML = v_check_svg;

        var v_card_body_div = document.createElement('div');
        v_card_body_div.className = 'card-body';
        v_card_div.appendChild(v_card_body_div);
				// Empty icon info
				var v_icon = '';
				// Empty title info
				var v_title = '';
				// Empty details info
				var v_details = '';
				// Empty tunnel info
				var v_tunnel = '<div class="card-subtitle tunnel text-muted">No Tunnel Configured</div>';

				// Showing terminal connection info
        if (v_conn_obj.technology=='terminal') {
					v_icon = '<i class="fas fa-terminal"></i>';
					// Showing connection string info
					if (v_conn_obj.alias && v_conn_obj.alias !== '') {
						v_title = '<h5 class="card-title">' + v_conn_obj.alias + '</h5>';
					}
					else {
						v_title = '<h5 class="card-title">Terminal</h5>';
					}
					// Showing tunnel info
					v_tunnel = '<h6 class="card-subtitle text-muted">' + v_conn_obj.tunnel.user + '@' + v_conn_obj.tunnel.server + ':' + v_conn_obj.tunnel.port + '</h6>';
				}
        else {
					v_icon = '<i class="technology-icon node-' + v_conn_obj.technology + '"></i>';
					v_title = '<h5 class="card-title">' + v_conn_obj.alias + '</h5>';
					// Showing connection string info
          if (v_conn_obj.conn_string && v_conn_obj.conn_string!='') {
						v_details += '<h6 class="card-subtitle mb-2 text-muted"><i title="Connection String" class="fas fa-quote-left"></i> ' + v_conn_obj.conn_string + '</h6>';
					}
					// Showing connection server and port info
          else {
						v_details +=
						'<h6 class="card-subtitle mb-2 text-muted">' + v_conn_obj.server + ':' + v_conn_obj.port + '</h6>' +
						'<p class="card-text">' + v_conn_obj.user + '@' + v_conn_obj.service + '</p>';
					}
					// Showing tunnel info
					if (v_conn_obj.tunnel.enabled===true) {
						v_tunnel = '<div class="card-subtitle tunnel text-muted">' + v_conn_obj.tunnel.user + '@' + v_conn_obj.tunnel.server + ':' + v_conn_obj.tunnel.port + '</div>';
					}
        }


				v_card_body_div.innerHTML +=
				'<div class="card-body-icon">' +
					v_icon +
				'</div>' +
				'<div class="card-body-title">' +
					v_title +
				'</div>' +
				'<div class="card-body-details">' +
					v_details +
				'</div>' +
				'<div class="card-body-tunnel">' +
					v_tunnel +
				'</div>';
				v_card_body_div.appendChild(v_checkbox);
				v_card_body_div.appendChild(v_cover_div);

				var v_card_body_buttons = document.createElement('div');
				v_card_body_buttons.className = 'card-body-buttons';
				v_card_body_div.appendChild(v_card_body_buttons);

				var v_button_select = document.createElement('button');
				v_button_select.className = 'btn btn-success btn-sm omnidb__connections__btn--select';
				v_button_select.title = "Select";
				/*if (v_conn_obj.locked==true) {
					v_button_select.setAttribute("disabled",true);
				}*/
				v_button_select.innerHTML = '<svg width="15px" height="160px" viewBox="0 0 15 160" style="width: auto;height: 100%;stroke: none;stroke-width: 0;"><path stroke-width="0" stroke="none" d="M 0 0 L 15 80 L 0 160 Z"></path></svg><i class="fas fa-plug"></i>';
				v_card_body_buttons.appendChild(v_button_select);

        var v_button_edit = document.createElement('button');
        v_button_edit.className = 'btn btn-sm mx-1 omnidb__theme__btn--primary';
        v_button_edit.title = "Edit";
        /*if (v_conn_obj.locked==true) {
					v_button_edit.setAttribute("disabled",true);
				}*/
        v_button_edit.innerHTML = '<i class="fas fa-pen"</i>'
        v_card_body_buttons.appendChild(v_button_edit);

        var v_button_delete = document.createElement('button');
        v_button_delete.className = 'btn btn-danger btn-sm mx-1';
        v_button_delete.title = "Delete";
        if (v_conn_obj.locked==true) {
					v_button_delete.setAttribute("disabled",true);
				}
        v_button_delete.innerHTML = '<i class="fas fa-trash-alt"></i>'
        v_card_body_buttons.appendChild(v_button_delete);

				v_button_select.onclick = (function(conn_obj) {
					return function() {
						selectConnection(conn_obj);
					};
				}(v_conn_obj));

        v_button_edit.onclick = (function(conn_obj) {
          return function() {
            editConnection(conn_obj);
          };
        }(v_conn_obj));

        v_button_delete.onclick = (function(conn_obj) {
          return function() {
            deleteConnection(conn_obj);
          };
        }(v_conn_obj));

				// Adding public visuals.
				if (v_conn_obj.public) {
					v_total_public_conn += 1;
					var v_public_icon = document.createElement('i');
					v_public_icon.setAttribute('style', 'color: #FFF;position: absolute;top: -5px;left: -5px;background-color: #c57dd2;padding: 4px 2px;border-radius: 100%;');
					v_public_icon.classList = 'fas fa-users';
					v_card_body_div.appendChild(v_public_icon);
					v_card_div.style['border-color'] = '#c57dd2';
					v_card_div.classList.add('omnidb__connections__card--public');
					v_card_div.classList.add('d-none');
					v_card_div.classList.add('fade');
					if (v_connections_data.show_public || v_conn_obj.is_mine) {
						v_card_div.classList.remove('d-none');
						v_card_div.classList.add('show');
					}
				}

        v_connections_data.card_list.push(
          {
            'data': v_conn_obj,
            'card_div': v_col_div,
            'cover_div': v_cover_div,
            'checkbox': v_checkbox
          }
        );
      }

			v_container.appendChild(v_row);

      v_target_div.innerHTML = '';
      v_target_div.appendChild(v_container);


      if (p_open_modal) {
				$('#modal_connections').modal();
			}

      if (p_change_group) {
				groupChange(document.getElementById('group_selector').value);
			}

			// Updating total public connections counter.
			document.getElementById('conn_list_public_counter').innerHTML = v_total_public_conn;

			updateConnectionsTitleInfo();

		},
		null,
		'box',
		true
	);
}

function groupChange(p_value) {
	var v_empty_group_div = document.getElementById('connections_management_empty_group');

  if (p_value!=-1) {
    document.getElementById('button_group_actions').style.display = '';

    // Filtering group cards
    var v_group_obj = {conn_list:[]};

    // Finding the selected group object
    for (var i=0; i<v_connections_data.v_group_list.length; i++) {
      if (p_value == v_connections_data.v_group_list[i].id) {
        v_group_obj = v_connections_data.v_group_list[i];
        break;
      }
    }

		var v_group_valid_conn = 0;

		// Going over the cards and adjusting cover div and checkbox
		for (var i=0; i<v_connections_data.card_list.length; i++) {
			var v_conn_obj = v_connections_data.card_list[i];

			// Check the div if it belongs to the currently selected group
			if (v_group_obj.conn_list.includes(v_conn_obj.data.id)) {
				$(v_conn_obj.card_div).fadeIn(400);
				v_group_valid_conn++;
			}
			else {
				$(v_conn_obj.card_div).fadeOut(400);
			}
		}

		// Updating visibility of empty group.
		if (v_empty_group_div) {
			if (v_group_valid_conn === 0) {
				v_empty_group_div.style.display = '';
			}
			else {
				v_empty_group_div.style.display = 'none';
			}
		}

  }
  else {
		// Updating visibility of empty group.
		if (v_empty_group_div) {
			v_empty_group_div.style.display = 'none';
		}
    document.getElementById('button_group_actions').style.display = 'none';
    document.getElementById('group_selector').value = -1;

    // Going over the cards and adjusting cover div and checkbox
    for (var i=0; i<v_connections_data.card_list.length; i++) {
      var v_conn_obj = v_connections_data.card_list[i];
      $(v_conn_obj.card_div).fadeIn(400);
    }
  }

	updateConnectionsTitleInfo();
}

function manageGroup() {
  document.getElementById('group_actions_1').style.display = 'none';
  document.getElementById('group_actions_2').style.display = '';
	document.getElementById('button_new_connection').setAttribute('disabled',true);
	document.getElementById('group_selector').setAttribute('disabled',true);
	document.getElementById('button_new_group').setAttribute('disabled',true);
	document.getElementById('button_group_actions').setAttribute('disabled',true);

	var v_empty_group_div = document.getElementById('connections_management_empty_group');
	if (v_empty_group_div) {
		v_empty_group_div.style.display = 'none';
	}

	$('.omnidb__connections__card-list').addClass('omnidb__connections__card-list--connection-management');

  var v_current_group_id = document.getElementById('group_selector').value;
  var v_group_obj = null;

  // Finding the selected group object
  for (var i=0; i<v_connections_data.v_group_list.length; i++) {
    if (v_current_group_id == v_connections_data.v_group_list[i].id) {
      v_group_obj = v_connections_data.v_group_list[i];
      break;
    }
  }

  // Going over the cards and adjusting cover div and checkbox
  for (var i=0; i<v_connections_data.card_list.length; i++) {
    var v_conn_obj = v_connections_data.card_list[i];
    // v_conn_obj.cover_div.style.display = '';
    $(v_conn_obj.card_div).fadeIn(400);

    // Check the div if it belongs to the currently selected group
    if (v_group_obj.conn_list.includes(v_conn_obj.data.id)) {
      v_conn_obj.checkbox.checked = true;
    }
  }

	updateConnectionsTitleInfo();
}

function manageGroupSave() {

  document.getElementById('group_actions_1').style.display = '';
  document.getElementById('group_actions_2').style.display = 'none';

	document.getElementById('button_new_connection').removeAttribute('disabled');
	document.getElementById('group_selector').removeAttribute('disabled');
	document.getElementById('button_new_group').removeAttribute('disabled');
	document.getElementById('button_group_actions').removeAttribute('disabled');

	$('.omnidb__connections__card-list').removeClass('omnidb__connections__card-list--connection-management');

	v_conn_data = [];

  // Going over the cards and adjusting cover div and checkbox
  for (var i=0; i<v_connections_data.card_list.length; i++) {
    var v_conn_obj = v_connections_data.card_list[i];
		v_conn_data.push({
			'id': v_conn_obj.data.id,
			'selected': v_conn_obj.checkbox.checked
		});
    v_conn_obj.checkbox.checked = false;
  }

	execAjax('/save_group_connections/',
		JSON.stringify({
			"p_group": document.getElementById('group_selector').value,
			"p_conn_data_list": v_conn_data
		}),
		function(p_return) {
			getDatabaseList();
			getGroups();
		},
		null,
		'box'
	);
}

function newGroupConfirm(p_name) {
	execAjax('/new_group/',
		JSON.stringify({"p_name": p_name}),
		function(p_return) {
			getDatabaseList();
			getGroups();
		},
		null,
		'box'
	);
}

function renameGroupConfirm(p_id, p_name) {
	execAjax('/edit_group/',
		JSON.stringify({"p_id": p_id,"p_name": p_name}),
		function(p_return) {
			getDatabaseList();
			getGroups();
		},
		null,
		'box'
	);
}

function deleteGroup() {
	var v_group_id = document.getElementById('group_selector').value;

	showConfirm('Are you sure you want to delete the current group?',
		function() {
			deleteGroupConfirm(v_group_id);
		}
	);
}

function deleteGroupConfirm(p_group_id) {
	execAjax('/delete_group/',
		JSON.stringify({"p_id": p_group_id}),
		function(p_return) {
			getDatabaseList();
			getGroups();
		},
		null,
		'box'
	);
}

function newGroup() {
	showConfirm('<input id="group_name_input"/ class="form-control" placeholder="Group Name" style="width: 100%;">',
		function() {
			newGroupConfirm(document.getElementById('group_name_input').value);
		}
	);

  var v_input = document.getElementById('group_name_input');

	v_input.onkeydown = function() {
		if (event.keyCode == 13) {
			document.getElementById('modal_message_ok').click();
		}
		else if (event.keyCode == 27) {
			document.getElementById('modal_message_cancel').click();
		}
	}
  setTimeout(function () {
  	v_input.focus();
  },500);
}

function renameGroup() {
	var v_select = document.getElementById('group_selector');
	showConfirm('<input id="group_name_input"/ class="form-control" placeholder="Group Name" value="' + v_select.options[v_select.selectedIndex].text + '" style="width: 100%;">',
		function() {
			renameGroupConfirm(
				document.getElementById('group_selector').value,
				document.getElementById('group_name_input').value
			);
		}
	);
	var v_input = document.getElementById('group_name_input');
	v_input.onkeydown = function() {
		if (event.keyCode == 13) {
			document.getElementById('modal_message_ok').click();
		}
		else if (event.keyCode == 27) {
			document.getElementById('modal_message_cancel').click();
		}
	}
  setTimeout(function () {
  	v_input.focus();
    v_input.selectionStart = v_input.selectionEnd = 10000;
  },500);
}

function getGroups() {
	execAjax('/get_groups/',
		JSON.stringify({}),
		function(p_return) {
			v_connections_data.v_group_list = p_return.v_data;
			var select = document.getElementById('group_selector');
			var current_value = select.value;
			select.innerHTML = '';
			var option = document.createElement('option');
			option.value = -1;
			option.textContent = 'Select group';
			select.appendChild(option);
			var found = false;
			for (var i=0; i<p_return.v_data.length; i++) {
				option = document.createElement('option');
				option.value = p_return.v_data[i].id;
				option.textContent = p_return.v_data[i].name;
				if (option.value == current_value) {
					option.selected = true;
					found = true;
				}
				select.appendChild(option);
			}
			if (!found==true && current_value!=-1) {
				groupChange(-1);
			}
      else {
        groupChange(document.getElementById('group_selector').value);
      }
		},
		null,
		'box'
	);
}

/// <summary>
/// Tests specific connection.
/// </summary>
function testConnection(p_password = null) {
	var input = JSON.stringify({
		"id": v_connections_data.current_id,
    "type": document.getElementById('conn_form_type').value,
    "connstring": document.getElementById('conn_form_connstring').value,
    "server": document.getElementById('conn_form_server').value,
    "port": document.getElementById('conn_form_port').value,
    "database": document.getElementById('conn_form_database').value,
    "user": document.getElementById('conn_form_user').value,
		"password": document.getElementById('conn_form_user_pass').value,
		"temp_password": p_password,
    "tunnel": {
      "enabled": document.getElementById('conn_form_use_tunnel').checked,
      "server": document.getElementById('conn_form_ssh_server').value,
      "port": document.getElementById('conn_form_ssh_port').value,
      "user": document.getElementById('conn_form_ssh_user').value,
      "password": document.getElementById('conn_form_ssh_password').value,
      "key": document.getElementById('conn_form_ssh_key').value
    }
  });

	execAjax('/test_connection/',
		input,
		function(p_return) {
			if (p_return.v_data=="Connection successful.")
				showAlert(p_return.v_data);
			else
        showError(p_return.v_data);
		},
		function(p_return) {
      showConfirm(
        p_return.v_data +
        '<input id="txt_test_password_prompt" class="form-control" type="password" placeholder="Password" style="margin-bottom:20px; margin-top: 20px; text-align: center;"/>',
      function() {
        testConnection(document.getElementById('txt_test_password_prompt').value);
      },
      null,
      function() {
        var v_input = document.getElementById('txt_test_password_prompt');
        v_input.focus();
      });

      var v_input = document.getElementById('txt_test_password_prompt');
    	v_input.onkeydown = function() {
    		if (event.keyCode == 13)
    			document.getElementById('modal_message_ok').click();
    		else if (event.keyCode == 27)
    			document.getElementById('modal_message_cancel').click();
    	}

    },
		'box',
		true,
		true
	);
}

function saveConnection() {

	var input = JSON.stringify({
    "id": v_connections_data.current_id,
    "type": document.getElementById('conn_form_type').value,
		"public": document.getElementById('conn_form_public').checked,
    "connstring": document.getElementById('conn_form_connstring').value,
    "server": document.getElementById('conn_form_server').value,
    "port": document.getElementById('conn_form_port').value,
    "database": document.getElementById('conn_form_database').value,
    "user": document.getElementById('conn_form_user').value,
		"password": document.getElementById('conn_form_user_pass').value,
    "title": document.getElementById('conn_form_title').value,
    "tunnel": {
      "enabled": document.getElementById('conn_form_use_tunnel').checked,
      "server": document.getElementById('conn_form_ssh_server').value,
      "port": document.getElementById('conn_form_ssh_port').value,
      "user": document.getElementById('conn_form_ssh_user').value,
      "password": document.getElementById('conn_form_ssh_password').value,
      "key": document.getElementById('conn_form_ssh_key').value
    }
  });

	execAjax('/save_connection/',
		input,
		function(p_return) {
      $('#modal_edit_connection').modal('hide');
			getDatabaseList();
      showConnectionList(false,true);
		},
		null,
		'box'
	);
}

function deleteConnection(p_conn_obj) {
  showConfirm("Are you sure you want to delete this connection?",
	  function() {

	    var input = JSON.stringify({
	      "id": p_conn_obj.id
	    });

	  	execAjax('/delete_connection/',
				input,
				function(p_return) {
					getDatabaseList();
	        showConnectionList(false,true);
				},
				null,
				'box'
			);
		}
	);
}

function adjustTechSelector() {
  var select = document.getElementById('conn_form_type');
  select.innerHTML = '';
  var option = document.createElement('option');
  option.value = -1;
  option.textContent = 'Select Type';
  select.appendChild(option);
  for (var i=0; i<v_connections_data.technologies.length; i++) {
    option = document.createElement('option');
    option.value = v_connections_data.technologies[i];
    option.textContent = v_connections_data.technologies[i];
    select.appendChild(option);
  }
}

function editConnection(p_conn_obj) {

  v_connections_data.current_id = p_conn_obj.id;
  adjustTechSelector();

  document.getElementById('conn_form_type').value = p_conn_obj.technology;
  document.getElementById('conn_form_title').value = p_conn_obj.alias;
  document.getElementById('conn_form_connstring').value = p_conn_obj.conn_string;
  document.getElementById('conn_form_server').value = p_conn_obj.server;
  document.getElementById('conn_form_port').value = p_conn_obj.port;
  document.getElementById('conn_form_database').value = p_conn_obj.service;
  document.getElementById('conn_form_user').value = p_conn_obj.user;
	document.getElementById('conn_form_user_pass').value = '';
  document.getElementById('conn_form_use_tunnel').checked = p_conn_obj.tunnel.enabled;
  document.getElementById('conn_form_ssh_server').value = p_conn_obj.tunnel.server;
  document.getElementById('conn_form_ssh_port').value = p_conn_obj.tunnel.port;
  document.getElementById('conn_form_ssh_user').value = p_conn_obj.tunnel.user;
  document.getElementById('conn_form_ssh_password').value = '';
  document.getElementById('conn_form_ssh_key').value = '';
	document.getElementById('conn_form_public').checked = (p_conn_obj.public);

	let v_enable_list = [];
	let v_disable_list = [];

	if (p_conn_obj.password && p_conn_obj.password !== null && p_conn_obj.password !== '') {
		if ($('#conn_form_user_pass_check_icon').length === 0) {
			$('#conn_form_user_pass').prev().append('<i id="conn_form_user_pass_check_icon" class="fas fa-check text-success ml-2"></i>');
		}
	}
	else {
		$('#conn_form_user_pass_check_icon').remove();
	}

	if (p_conn_obj.tunnel.password && p_conn_obj.tunnel.password !== null && p_conn_obj.tunnel.password !== '') {
		if ($('#conn_form_ssh_password_check_icon').length === 0) {
			$('#conn_form_ssh_password').prev().append('<i id="conn_form_ssh_password_check_icon" class="fas fa-check text-success ml-2"></i>');
		}
	}
	else {
		$('#conn_form_ssh_password_check_icon').remove();
	}

	if (p_conn_obj.tunnel.key && p_conn_obj.tunnel.key !== null && p_conn_obj.tunnel.key !== '') {
		if ($('#conn_form_ssh_key_check_icon').length === 0) {
			$('#conn_form_ssh_key').prev().append('<i id="conn_form_ssh_key_check_icon" class="fas fa-check text-success ml-2"></i>');
		}
	}
	else {
		$('#conn_form_ssh_key_check_icon').remove();
	}

	if (p_conn_obj.technology === 'terminal') {
		v_disable_list = [
			'conn_form_connstring',
			'conn_form_server',
			'conn_form_port',
			'conn_form_database',
			'conn_form_user',
			'conn_form_user_pass'
		];
		v_enable_list = [
			'conn_form_ssh_server',
			'conn_form_ssh_port',
			'conn_form_ssh_user',
			'conn_form_ssh_password',
			'conn_form_ssh_key',
			'conn_form_ssh_key_input'
		];
		document.getElementById('conn_form_use_tunnel').checked = true;
		document.getElementById('conn_form_use_tunnel').setAttribute('disabled', true);
	}
	else if (p_conn_obj.technology === 'sqlite') {
		v_disable_list = [
			'conn_form_connstring',
			'conn_form_server',
			'conn_form_port',
			'conn_form_user',
			'conn_form_user_pass'
		];
		v_enable_list = [
			'conn_form_database'
		]
		if (p_conn_obj.tunnel.enabled) {
			v_enable_list = v_enable_list.concat([
				'conn_form_ssh_server',
				'conn_form_ssh_port',
				'conn_form_ssh_user',
				'conn_form_ssh_password',
				'conn_form_ssh_key',
				'conn_form_ssh_key_input'
			]);
		}
		else {
			v_disable_list = v_disable_list.concat([
			 'conn_form_ssh_server',
			 'conn_form_ssh_port',
			 'conn_form_ssh_user',
			 'conn_form_ssh_password',
			 'conn_form_ssh_key',
			 'conn_form_ssh_key_input'
		 ]);
		}
	}
	else {
		// Has connection string.
		if (p_conn_obj.conn_string.trim() !== '' && p_conn_obj.conn_string.trim() !== null) {
			v_disable_list = [
				'conn_form_server',
				'conn_form_port',
				'conn_form_database',
				'conn_form_user',
				'conn_form_user_pass'
			];
			v_enable_list = [
				'conn_form_connstring'
			];
		}
		// Has server config per input.
		else if (p_conn_obj.server.trim() !== '' && p_conn_obj.server.trim() !== null) {
			v_disable_list = [
				'conn_form_connstring'
			];
			v_enable_list = [
				'conn_form_server',
				'conn_form_port',
				'conn_form_database',
				'conn_form_user',
				'conn_form_user_pass'
			];
		}
		if (p_conn_obj.tunnel.enabled) {
			v_enable_list = v_enable_list.concat([
				'conn_form_ssh_server',
				'conn_form_ssh_port',
				'conn_form_ssh_user',
				'conn_form_ssh_password',
				'conn_form_ssh_key',
				'conn_form_ssh_key_input'
			]);
		}
		else {
			v_disable_list = v_disable_list.concat([
			 'conn_form_ssh_server',
			 'conn_form_ssh_port',
			 'conn_form_ssh_user',
			 'conn_form_ssh_password',
			 'conn_form_ssh_key',
			 'conn_form_ssh_key_input'
		 ]);
		}
	}

	// Updating the fields.
	updateModalEditConnectionFields(v_disable_list, v_enable_list);

  $('#modal_edit_connection').modal();

}

function newConnection() {

  v_connections_data.current_id = -1;
  adjustTechSelector();

	document.getElementById('conn_form_button_test_connection').setAttribute('disabled',true);
	document.getElementById('conn_form_button_save_connection').setAttribute('disabled',true);
  document.getElementById('conn_form_type').value = -1;
	document.getElementById('conn_form_title').value = '';
	document.getElementById('conn_form_public').checked = false;
  document.getElementById('conn_form_connstring').value = '';
  document.getElementById('conn_form_server').value = '';
  document.getElementById('conn_form_port').value = '';
  document.getElementById('conn_form_database').value = '';
  document.getElementById('conn_form_user').value = '';
	document.getElementById('conn_form_user_pass').value = '';
  document.getElementById('conn_form_use_tunnel').checked = false;
  document.getElementById('conn_form_ssh_server').value = '';
  document.getElementById('conn_form_ssh_port').value = '22';
  document.getElementById('conn_form_ssh_user').value = '';
  document.getElementById('conn_form_ssh_password').value = '';
  document.getElementById('conn_form_ssh_key').value = '';
	document.getElementById('conn_form_ssh_key_input').value = null;
	document.getElementById('conn_form_ssh_key_input_label').innerHTML = 'Click to select';

	$('#conn_form_user_pass_check_icon').remove();
	$('#conn_form_ssh_password_check_icon').remove();
	$('#conn_form_ssh_key_check_icon').remove();

  $('#modal_edit_connection').modal();
}

function selectConnection(p_conn_obj) {
	$('#modal_connections').modal('hide');
	if (p_conn_obj.technology === 'terminal') {
		v_connTabControl.tag.createOuterTerminalTab(p_conn_obj.id, p_conn_obj.alias, p_conn_obj.tunnel.user + '@' + p_conn_obj.tunnel.server + ':' + p_conn_obj.tunnel.port);
	}
	else {
		v_connTabControl.tag.createConnTab(p_conn_obj.id);
	}
}

function toggleConnectionsLayout(l_type) {
	if (l_type === 'cards') {
		$('.omnidb__connections__card-list').removeClass('omnidb__connections__card-list--rows');
		$('.omnidb__connections__card-list').addClass('omnidb__connections__card-list--cards');
	}
	else if (l_type === 'rows') {
		$('.omnidb__connections__card-list').removeClass('omnidb__connections__card-list--cards');
		$('.omnidb__connections__card-list').addClass('omnidb__connections__card-list--rows');
	}
}

function toggleConnectionsPublic() {
	updateConnectionsTitleInfo();
	var v_public = document.getElementById('conn_list_public').checked;
	if (v_public) {
		v_connections_data.show_public = true;
		$('.omnidb__connections__card--public').parent().removeClass('d-none');
		$('.omnidb__connections__card--public').removeClass('d-none');
		$('.omnidb__connections__card--public').addClass('show');
	}
	else {
		v_connections_data.show_public = false;
		for (let i = 0; i < v_connections_data.card_list.length; i++) {
			v_conn_div = $(v_connections_data.card_list[i].card_div);
			v_conn_obj = v_connections_data.card_list[i].data;
			if (v_conn_obj.public) {
				if (!v_conn_obj.is_mine) {
					v_conn_div.children().removeClass('show');
					v_conn_div.children().addClass('d-none');
					v_conn_div.addClass('d-none');
				}
			}
		}
	}
}

/**
 * ## updateModalEditConnectionState
 * @desc Constructs a set of string arrays containing connection inputs that should be validated, enabled and disabled.
 * These arrays are constructed based on a set of rules, ex:
 * - conn_form_type as 'Terminal' makes:
 * 	- required: 'conn_form_server', 'conn_form_port', 'conn_form_database'
 *  - enabled: 'conn_form_ssh_server', 'conn_form_ssh_port', 'conn_form_ssh_database', 'conn_form_ssh_password', 'conn_form_ssh_key', 'conn_form_ssh_key_input'
 *  - disabled: 'conn_form_server', 'conn_form_port', 'conn_form_database', 'conn_form_password', 'conn_form_key', 'conn_form_ssh_input'
 *
 * @param  {Object} e Event.
 */
function updateModalEditConnectionState(e) {
  let v_e_target = e.target;
  let v_e_target_id = v_e_target.getAttribute('id');
  let v_e_value = e.target.value;
	// IDs of elements that should be disabled.
  let v_disable_list = [];
	// IDs of elements that should be enabled.
  let v_enable_list = [];
	// IDs of elements that should be required.
	let v_form_cases = ['conn_form_type'];
	let v_technology = document.getElementById('conn_form_type').value;
	let v_allow_tunnel = document.getElementById('conn_form_use_tunnel').checked;
	let v_use_connection_string = document.getElementById('conn_form_connstring').value;
	let v_has_ssh_key_file = document.getElementById('conn_form_ssh_key_input').value;

	// Case where technology is terminal.
	if (v_technology === 'terminal') {
		v_allow_tunnel = true;
		document.getElementById('conn_form_use_tunnel').checked = true;
		document.getElementById('conn_form_use_tunnel').setAttribute('disabled', true);
	}
	else {
		document.getElementById('conn_form_use_tunnel').removeAttribute('disabled');
	}

	// Checking connection string.
	if (typeof v_use_connection_string === 'string') {
		v_use_connection_string = v_use_connection_string.trim();
	}
	// Case where technology is terminal.
	if (v_technology === 'terminal') {
		v_disable_list.push('conn_form_connstring');
		v_disable_list.push('conn_form_server');
		v_disable_list.push('conn_form_port');
		v_disable_list.push('conn_form_database');
		v_disable_list.push('conn_form_user');
		v_disable_list.push('conn_form_user_pass');
	}
	// Case where technology is sqlite.
	else if (v_technology === 'sqlite') {
		// Disabled fields
		v_disable_list.push('conn_form_connstring');
		v_disable_list.push('conn_form_server');
		v_disable_list.push('conn_form_port');
		v_disable_list.push('conn_form_user');
		v_disable_list.push('conn_form_user_pass');
		// Enabled fields
		v_enable_list.push('conn_form_database');
		// Form cases will check for database.
		v_form_cases.push('conn_form_database');
	}
	// Case where connection string has value.
	else if (v_use_connection_string !== '' && v_use_connection_string !== null) {
		v_disable_list.push('conn_form_server');
		v_disable_list.push('conn_form_port');
		v_disable_list.push('conn_form_database');
		v_disable_list.push('conn_form_user');
		v_disable_list.push('conn_form_user_pass');
		// Form cases will check the connection string.
		v_form_cases.push('conn_form_connstring');
	}
	// Case where connection string is empty.
	else {
		v_enable_list.push('conn_form_server');
		v_enable_list.push('conn_form_port');
		v_enable_list.push('conn_form_database');
		v_enable_list.push('conn_form_user');
		v_enable_list.push('conn_form_user_pass');
		// Form cases will check for single connection inputs, except password.
		v_form_cases.push('conn_form_server');
		v_form_cases.push('conn_form_port');
		v_form_cases.push('conn_form_database');
		v_form_cases.push('conn_form_user');

		let v_block_conn_string = false;
		let v_check_inputs = [
      'conn_form_server',
      'conn_form_port',
      'conn_form_database',
      'conn_form_user',
      'conn_form_user_pass'
    ];
    let v_check_inputs_empty = true;
    for (let i = 0; i < v_check_inputs.length; i++) {
      var v_check_input_value = document.getElementById(v_check_inputs[i]).value;
      if (typeof v_check_input_value === 'string') {
        v_check_input_value = v_check_input_value.trim();
      }
      if (v_check_input_value !== '' && v_check_input_value !== null) {
        v_check_inputs_empty = false;
      }
    }
		// Case where at least one server single input is being type.
    if (!v_check_inputs_empty) {
			v_block_conn_string = true;
		}
		if (v_block_conn_string) {
			v_disable_list.push('conn_form_connstring');
		}
		// Case where connection string is avaiable.
    else {
      v_enable_list.push('conn_form_connstring');
			// Form cases will check the connection string.
			v_form_cases.push('conn_form_connstring');
    }
	}



	if (v_allow_tunnel) {
		v_enable_list.push('conn_form_ssh_server');
		v_enable_list.push('conn_form_ssh_port');
		v_enable_list.push('conn_form_ssh_user');
		v_enable_list.push('conn_form_ssh_password');
		v_enable_list.push('conn_form_ssh_key');
		v_enable_list.push('conn_form_ssh_key_input');
		v_form_cases.push('conn_form_ssh_server');
		v_form_cases.push('conn_form_ssh_port');
		v_form_cases.push('conn_form_ssh_user');
	}
	else {
		v_disable_list.push('conn_form_ssh_server');
		v_disable_list.push('conn_form_ssh_port');
		v_disable_list.push('conn_form_ssh_user');
		v_disable_list.push('conn_form_ssh_password');
		v_disable_list.push('conn_form_ssh_key');
		v_disable_list.push('conn_form_ssh_key_input');
	}




	if (v_e_target_id === 'conn_form_type') {
		// Case where the user picked a terminal needs to lock all server config inputs.
    if (v_e_value === 'terminal') {
      v_disable_list = [
        'conn_form_connstring',
        'conn_form_server',
        'conn_form_port',
        'conn_form_database',
        'conn_form_user',
        'conn_form_user_pass'
      ];
      v_enable_list = [
        'conn_form_ssh_server',
        'conn_form_ssh_port',
        'conn_form_ssh_user',
        'conn_form_ssh_password',
        'conn_form_ssh_key',
				'conn_form_ssh_key_input'
      ];
			document.getElementById('conn_form_use_tunnel').checked = true;
			document.getElementById('conn_form_use_tunnel').setAttribute('disabled', true);
			v_form_cases.push('conn_form_ssh_server');
			v_form_cases.push('conn_form_ssh_port');
			v_form_cases.push('conn_form_ssh_user');
    }
  }

	// Updating the fields.
	updateModalEditConnectionFields(v_disable_list, v_enable_list, v_form_cases);
}

/**
 * ## updateModalEditConnectionFields
 * @desc Verifies a set of arrays to either disable, enable, set as required and clear fields when necessary.
 *
 * @param  {array} p_disable_list IDs of elements that should be disabled.
 * @param  {array} p_enable_list  IDs of elements that should be enabled.
 * @param  {array} p_form_cases   IDs of elements that should be required.
 */
function updateModalEditConnectionFields(p_disable_list, p_enable_list, p_form_cases) {
	// Disabling elements.
	for (let i = 0; i < p_disable_list.length; i++) {
    var v_item = document.getElementById(p_disable_list[i]);
    v_item.setAttribute('readonly',true);
		v_item.setAttribute('disabled', true);
    v_item.value = null;
  }
	// Enabling elements.
  for (let i = 0; i < p_enable_list.length; i++) {
    var v_item = document.getElementById(p_enable_list[i]);
    v_item.removeAttribute('readonly');
		v_item.removeAttribute('disabled');
  }
	// Removing 'required' class from elements inside the connection modal.
	$('#modal_edit_connection .required').removeClass('required');
	let v_has_invalid = false;
	if (p_form_cases) {
		// Adding 'required' class to required elements inside.
		for (let i = 0; i < p_form_cases.length; i++) {
			$('#'+p_form_cases[i]).parent().addClass('required');
		}
		// Validating values of required elements.
		for (let i = 0; i < p_form_cases.length; i++) {
			if (p_form_cases[i] === 'conn_form_type') {
				if (document.getElementById(p_form_cases[i]).value === '-1') {
					v_has_invalid = true;
					break;
				}
			}
			else {
				let v_value_check = document.getElementById(p_form_cases[i]).value.trim();
				if (v_value_check === '' || v_value_check === null) {
					v_has_invalid = true;
					break;
				}
			}
		}
	}
	// Enabling or Disabling the test and save buttons based on valid data of required fields.
	if (v_has_invalid) {
		document.getElementById('conn_form_button_test_connection').setAttribute('disabled', true);
		document.getElementById('conn_form_button_save_connection').setAttribute('disabled', true);
	}
	else {
		document.getElementById('conn_form_button_test_connection').removeAttribute('disabled');
		document.getElementById('conn_form_button_save_connection').removeAttribute('disabled');
	}

}

function updateConnectionKey(e) {
  var file = (e.target.files) ? e.target.files[0] : false;
	var v_input = document.getElementById('conn_form_ssh_key');
  if (!file) {
		v_input.value = null;
		document.getElementById('conn_form_ssh_key_input_label').innerHTML = 'Click to select';
		updateModalEditConnectionState({target:document.getElementById('conn_form_ssh_key_input')});
    return;
  }
  var reader = new FileReader();
  reader.onload = function(e) {
    var v_contents = e.target.result;
		v_input.value = v_contents;
		document.getElementById('conn_form_ssh_key_input_label').innerHTML = 'Key text loaded';
		updateModalEditConnectionState({target:document.getElementById('conn_form_ssh_key_input')});
  };
  reader.readAsText(file);
}

function updateConnectionsTitleInfo() {
	var v_public = document.getElementById('conn_list_public').checked;
	var v_group_context = document.getElementById('group_selector').value;
	var v_connection_owner = false;
	var v_managing_group = (v_group_context && document.getElementById('group_selector').getAttribute('disabled'));

	for (var i=0; i<v_connections_data.card_list.length; i++) {
		var v_conn_obj = v_connections_data.card_list[i].data;

		if (v_conn_obj.is_mine) {
			v_connection_owner = true;
		}
	}

	// Updating empty connections info status.
	var v_empty_cards = document.getElementById('connections_management_empty_all');
	var v_empty_with_public = document.getElementById('connections_management_empty_with_public');
	// Updating empty connections info status.
	if (v_empty_cards) {
		if (v_connections_data.card_list.length === 0) {
			v_empty_with_public.style.display = 'none';
			v_empty_cards.style.display = '';
		}
		else if (v_group_context !== '-1') {
			v_empty_cards.style.display = 'none';
			v_empty_with_public.style.display = 'none';
		}
		else if (v_public) {
			v_empty_cards.style.display = 'none';
			v_empty_with_public.style.display = 'none';
		}
		else if (!v_connection_owner) {
			v_empty_cards.style.display = 'none';
			v_empty_with_public.style.display = '';
		}

		if (!v_public && v_managing_group && !v_connection_owner) {
			v_empty_with_public.style.display = '';
		}
	}
}
