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
/// Opens OmniDB about window.
/// </summary>
function showAbout() {

	$('#modal_about').modal();

}
/*
var v_light_terminal_theme = {
	background: '#f4f4f4',
	brightBlue: '#006de2',
	brightGreen: '#4b9800',
	foreground: '#353535',
	cursor: '#353535',
	cursorAccent: '#353535',
	selection: '#00000030'
}
*/
var v_light_terminal_theme = {
	background: '#f4f4f4',
	brightBlue: '#006de2',
	brightGreen: '#4b9800',
	foreground: '#454545',
	cursor: '#454545',
	cursorAccent: '#454545',
	selection: '#00000030'
}

var v_dark_terminal_theme = {
	background: '#1a1a1d'
}

var v_current_terminal_theme;

/// <summary>
/// Startup function.
/// </summary>
$(function() {

	// var v_fileref = document.getElementById("ss_theme");
  // v_fileref.setAttribute("href", v_url_folder + '/static/OmniDB_app/new/css/themes/' + v_theme + '.css');


	//var v_configTabControl = createTabControl('config_tabs',0,null);
	//v_configTabControl.selectTabIndex(0);

	//setting font size of body
	document.getElementsByTagName('html')[0].style['font-size'] = v_font_size + 'px';

	if (v_theme=='light') {
		v_current_terminal_theme = v_light_terminal_theme;
		document.body.classList.remove('omnidb--theme-dark');
		document.body.classList.add('omnidb--theme-light');
	}
	else {
		v_current_terminal_theme = v_dark_terminal_theme;
		document.body.classList.remove('omnidb--theme-light');
		document.body.classList.add('omnidb--theme-dark');
	}
});

function adjustChartTheme(p_chart) {
	var v_chart_font_color = '#666666';
	var v_chart_grid_color = "rgba(0, 0, 0, 0.1)";

	if (v_theme=='light') {
		v_chart_font_color = '#666666';
		v_chart_grid_color = "rgba(0, 0, 0, 0.1)";
	}
 	else {
		v_chart_font_color = '#DCDDDE';
		v_chart_grid_color = "rgba(100, 100, 100, 0.3)";
	}

	try {
		p_chart.legend.options.labels.fontColor = v_chart_font_color;
		p_chart.options.title.fontColor = v_chart_font_color;
		p_chart.scales["y-axis-0"].options.gridLines.color = v_chart_grid_color;
		p_chart.scales["x-axis-0"].options.gridLines.color = v_chart_grid_color;
		p_chart.scales["y-axis-0"].options.ticks.minor.fontColor = v_chart_font_color;
		p_chart.scales["y-axis-0"].options.scaleLabel.fontColor = v_chart_font_color;
		p_chart.scales["x-axis-0"].options.ticks.minor.fontColor = v_chart_font_color;
		p_chart.scales["x-axis-0"].options.scaleLabel.fontColor = v_chart_font_color;
	}
	catch(err) {
	}
	p_chart.update();
}

function adjustGraphTheme(p_graph) {
	var v_font_color = '#666666';

	if (v_theme=='light') {
		v_font_color = '#666666';
	}
	else {
		v_font_color = '#DCDDDE';
	}

	try {
		p_graph.style().selector('node').style('color', v_font_color);
		p_graph.style().selector('edge').style('color', v_font_color);
		p_graph.nodes().updateStyle();
		p_graph.edges().updateStyle();
	}
	catch(err) {
	}
}

function changeTheme(p_option) {
	// var v_fileref = document.getElementById("ss_theme");

	if (p_option=='dark') {
		// v_fileref.setAttribute("href", v_url_folder + '/static/OmniDB_app/new/css/themes/dark.css');
		v_theme = 'dark';
		v_editor_theme = 'omnidb_dark';
		v_current_terminal_theme = v_dark_terminal_theme;
		document.body.classList.remove('omnidb--theme-light');
		document.body.classList.add('omnidb--theme-dark');
	}
	else {
		// v_fileref.setAttribute("href", v_url_folder + '/static/OmniDB_app/new/css/themes/light.css');
		v_theme = 'light';
		v_editor_theme = 'omnidb';
		v_current_terminal_theme = v_light_terminal_theme;
		document.body.classList.remove('omnidb--theme-dark');
		document.body.classList.add('omnidb--theme-light');
	}
	// Updating theme of all consoles.
	try {
		for (let i = 0; i < v_connTabControl.tabList.length; i++) {
			var v_outer_tab = v_connTabControl.tabList[i];
			if (v_outer_tab.tag) {
				if (v_outer_tab.tag.tabControl) {
					if (v_outer_tab.tag.tabControl.tabList) {
						for (let j = 0; j < v_outer_tab.tag.tabControl.tabList.length; j++) {
							var v_inner_tab_tag = v_outer_tab.tag.tabControl.tabList[j].tag;
							if (v_inner_tab_tag.editor) {
								v_inner_tab_tag.editor.setTheme("ace/theme/" + v_editor_theme);
							}
							else if (v_inner_tab_tag.editor_console) {
								v_inner_tab_tag.editor_console.setOption('theme', v_current_terminal_theme);
							}
						}
					}
				}
			}

		}
	}
	catch (e) {
		console.warn(e);
	}

	var els = document.getElementsByClassName("ace_editor");

	Array.prototype.forEach.call(els, function(el) {
			ace.edit(el).setTheme("ace/theme/" + v_editor_theme);
	});

	Chart.helpers.each(Chart.instances, function(instance){
		adjustChartTheme(instance.chart);
	})

	//Adjusting terminal themes
	for (var i=0; i < v_connTabControl.tabList.length; i++) {
		var v_tab = v_connTabControl.tabList[i];
		if (v_tab.tag!=null) {
			if (v_tab.tag.mode=='outer_terminal') {
				v_tab.tag.editor_console.setOption('theme',v_current_terminal_theme);
			}
		}
	}

	//Adjusting graph themes
	for (var i=0; i < v_connTabControl.tabList.length; i++) {
		var v_tab = v_connTabControl.tabList[i];
		if (v_tab.tag!=null) {
			if (v_tab.tag.mode=='connection') {
				for (var j=0; j < v_tab.tag.tabControl.tabList.length; j++) {
					var v_inner_tab = v_tab.tag.tabControl.tabList[j];
					if (v_inner_tab.tag!=null) {
						if (v_inner_tab.tag.mode=='monitor_dashboard') {
							for (var k=0; k < v_inner_tab.tag.units.length; k++) {
								if (v_inner_tab.tag.units[k].type=='graph')
									adjustGraphTheme(v_inner_tab.tag.units[k].object);
							}
						}
					}
				}
			}
		}
	}

	//Hooks
	if (v_connTabControl.tag.hooks.changeTheme.length>0) {
		for (var i=0; i<v_connTabControl.tag.hooks.changeTheme.length; i++)
			v_connTabControl.tag.hooks.changeTheme[i](null,v_theme);
	}
}

function changeFontSize(p_option) {
	var els = document.getElementsByClassName("ace_editor");
	v_font_size = p_option;

	//Adjusting terminal themes
	for (var i=0; i < v_connTabControl.tabList.length; i++) {
		var v_tab = v_connTabControl.tabList[i];
		if (v_tab.tag!=null) {
			if (v_tab.tag.mode=='outer_terminal') {
				v_tab.tag.editor_console.setOption('fontSize',p_option);
				v_tab.tag.editor_console.fit();
			}
		}
	}

	Array.prototype.forEach.call(els, function(el) {
	    // Do stuff here
			ace.edit(el).setFontSize(Number(p_option));
	});
}

function changeInterfaceFontSize(p_option) {
	v_font_size = p_option;
	document.getElementsByTagName('html')[0].style['font-size'] = v_font_size + 'px';
	$('.ace_editor').each(function(index) {
		let editor = ace.edit(this);
		editor.setFontSize(v_font_size + 'px');
	});
	var v_outer_tab_list = v_connTabControl.tabList;
	for (let i = 0; i < v_outer_tab_list.length; i++) {
		var v_outer_tab_tag = v_outer_tab_list[i].tag;
		if (v_outer_tab_tag) {
			var v_outer_tab_tag_inner_tab_control = v_outer_tab_tag.tabControl;
			if (v_outer_tab_tag_inner_tab_control) {
				var v_outer_tab_tag_inner_tab_list = v_outer_tab_tag_inner_tab_control.tabList;
				for (let j = 0; j < v_outer_tab_tag_inner_tab_list.length; j++) {
					var v_inner_tab_tag = v_outer_tab_tag_inner_tab_list[j].tag;
					if (v_inner_tab_tag) {
						if (v_inner_tab_tag.editor_console) {
							v_inner_tab_tag.editor_console.setOption('fontSize', Number(v_font_size));
						}
					}
				}
			}
		}
	}

	refreshHeights();
}

/// <summary>
/// Opens user config window.
/// </summary>
function showConfigUser() {

	document.getElementById('sel_interface_font_size').value = v_font_size;
	document.getElementById('sel_editor_theme').value = v_theme;

	document.getElementById('txt_confirm_new_pwd').value = '';
	document.getElementById('txt_new_pwd').value = '';

	document.getElementById('sel_csv_encoding').value = v_csv_encoding;
	document.getElementById('txt_csv_delimiter').value = v_csv_delimiter;

	$('#modal_config').modal({ backdrop: 'static', keyboard: false });

}

/// <summary>
/// Go to connections.
/// </summary>
function goToConnections() {

	showConfirm('You will lose existing changes. Would you like to continue?',
		function() {

			window.open("../connections","_self");

		});

}

/// <summary>
/// Go to connections.
/// </summary>
function confirmSignout() {

	showConfirm('Are you sure you want to sign out?',
		function() {

			window.open("../logout","_self");

		});

}

/// <summary>
/// Shows website in outer tab.
/// </summary>
function showWebsite(p_name, p_url) {

	if (v_connTabControl)
		$('#modal_about').modal('hide');
		v_connTabControl.tag.createWebsiteOuterTab(p_name,p_url);

}

/// <summary>
/// Saves user config to OmniDB database.
/// </summary>
function saveConfigUser() {

	v_font_size = document.getElementById('sel_interface_font_size').value;
	v_theme_id = document.getElementById('sel_editor_theme').value.split('/')[0];

	var v_confirm_pwd = document.getElementById('txt_confirm_new_pwd');
	var v_pwd = document.getElementById('txt_new_pwd');

	v_csv_encoding = document.getElementById('sel_csv_encoding').value;
	v_csv_delimiter = document.getElementById('txt_csv_delimiter').value;

	if ((v_confirm_pwd.value!='' || v_pwd.value!='') && (v_pwd.value!=v_confirm_pwd.value))
		showAlert('New Password and Confirm New Password fields do not match.');
	else {
		var input = JSON.stringify(
			{
				"p_font_size" : v_font_size,
				"p_theme" : v_theme,
				"p_pwd" : v_pwd.value,
				"p_csv_encoding": v_csv_encoding,
				"p_csv_delimiter": v_csv_delimiter
			});

		execAjax('/save_config_user/',
				input,
				function(p_return) {
					$('#modal_config').modal('hide');
					showAlert('Configuration saved.');

				});
	}
}

/// <summary>
/// Saves shortcuts to OmniDB database.
/// </summary>
function saveShortcuts() {

	var v_shortcut_list = [];

	for (var property in v_shortcut_object.shortcuts) {
    if (v_shortcut_object.shortcuts.hasOwnProperty(property)) {
        v_shortcut_list.push(v_shortcut_object.shortcuts[property]);
    }
  }

	var input = JSON.stringify({
		"p_shortcuts": v_shortcut_list,
		"p_current_os": v_current_os
	});

	execAjax('/save_shortcuts/',
			input,
			function(p_return) {
				showAlert('Shortcuts saved.');

			});
}

/// <summary>
/// Displays edit cell window.
/// </summary>
/// <param name="p_ht">Handsontable object.</param>
/// <param name="p_row">Row number.</param>
/// <param name="p_col">Column number.</param>
/// <param name="p_content">Cell content.</param>
/// <param name="p_can_alter">If ready only or not.</param>
function editCellData(p_ht, p_row, p_col, p_content, p_can_alter) {
	var v_edit_modal = document.getElementById('div_edit_content');
	if (!v_edit_modal) {
		v_edit_modal = document.createElement('div');
		v_edit_modal.setAttribute('id','div_edit_content');
		v_edit_modal.setAttribute('tabindex','-1');
		v_edit_modal.setAttribute('role','dialog');
		v_edit_modal.setAttribute('aria-hidden','true');
		v_edit_modal.classList = 'modal fade';

		document.body.append(v_edit_modal);
	}

	v_canEditContent = p_can_alter;
	var v_save_btn_attr = '';
	if (!v_canEditContent) {
		v_save_btn_attr = ' disabled title="Unable to manually edit data without primary key" ';
	}
	v_edit_modal.innerHTML =
	'<div id="modal_message_dialog" class="modal-dialog" role="document" style="width: 1200px;max-width: 90vw;">' +
		'<div class="modal-content">' +
			'<div class="modal-header">' +
				'<h4 class="mb-0">Edit Data</h4>' +
				'<button type="button" class="close" data-dismiss="modal" aria-label="Close" onclick="cancelEditContent()">' +
					'<span aria-hidden="true">&times;</span>' +
				'</button>' +
			'</div>' +
			'<div id="modal_message_content" class="modal-body" style="white-space: pre-line;">' +
				'<div id="txt_edit_content" style="width: 100%; height: 70vh; font-size: 12px; border: 1px solid rgb(195, 195, 195);">' +
				'</div>' +
			'</div>' +
			'<div class="modal-footer">' +
				'<button ' + v_save_btn_attr + ' type="button" class="btn omnidb__theme__btn--primary" data-dismiss="modal" onclick="saveEditContent()">Save</button>' +
				'<button type="button" class="btn omnidb__theme__btn--secondary" data-dismiss="modal" onclick="cancelEditContent()">Cancel</button>' +
			'</div>' +
		'</div>' +
	'</div>';

	if (v_editContentObject!=null)
		if (v_editContentObject.editor!=null) {
			 v_editContentObject.editor.destroy();
			 document.getElementById('txt_edit_content').innerHTML = '';
		}

	var langTools = ace.require("ace/ext/language_tools");
	var v_editor = ace.edit('txt_edit_content');
	v_editor.setTheme("ace/theme/" + v_editor_theme);
	v_editor.session.setMode("ace/mode/text");
	v_editor.$blockScrolling = Infinity;

	v_editor.setFontSize(Number(v_font_size));

	v_editor.setOptions({enableBasicAutocompletion: true});

	document.getElementById('txt_edit_content').onclick = function() {
  		v_editor.focus();
    };

	if (p_content!=null)
		v_editor.setValue(String(p_content));
	else
		v_editor.setValue('');

	v_editor.clearSelection();

	if (p_can_alter)
		v_editor.setReadOnly(false);
	else
		v_editor.setReadOnly(true);

	//Remove shortcuts from ace in order to avoid conflict with omnidb shortcuts
	v_editor.commands.bindKey("Cmd-,", null)
	v_editor.commands.bindKey("Ctrl-,", null)
	v_editor.commands.bindKey("Cmd-Delete", null)
	v_editor.commands.bindKey("Ctrl-Delete", null)

	v_editContentObject = new Object();
	v_editContentObject.editor = v_editor;
	v_editContentObject.row = p_row;
	v_editContentObject.col = p_col;
	v_editContentObject.ht = p_ht;

	$('#div_edit_content').modal({
    backdrop: 'static',
    keyboard: false
  });

}

function saveEditContent() {
	$('#div_edit_content').modal('hide');

	if (v_canEditContent) {
		v_editContentObject.ht.setDataAtCell(v_editContentObject.row, v_editContentObject.col, v_editContentObject.editor.getValue());
	}
	else {
		alert('No permissions.');
	}

	v_editContentObject.editor.setValue('');
}

function cancelEditContent() {
	$('#div_edit_content').modal('hide');

	v_editContentObject.editor.setValue('');
}

/// <summary>
/// Hides edit cell window.
/// </summary>
function hideEditContent() {

	$('#div_edit_content').modal('hide');

	if (v_canEditContent)
		v_editContentObject.ht.setDataAtCell(v_editContentObject.row, v_editContentObject.col, v_editContentObject.editor.getValue());

	v_editContentObject.editor.setValue('');

}
