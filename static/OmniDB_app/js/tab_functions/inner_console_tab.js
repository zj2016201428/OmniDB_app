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

var v_createConsoleTabFunction = function() {

  // Removing last tab of the inner tab list
  v_connTabControl.selectedTab.tag.tabControl.removeLastTab();

  // Creating console tab in the inner tab list
  var v_tab = v_connTabControl.selectedTab.tag.tabControl.createTab({
    p_icon: '<i class="fas fa-terminal icon-tab-title"></i>',
    p_name: '<span> 控制台</span><span id="tab_loading" style="visibility:hidden;"><i class="tab-icon node-spin"></i></span><i title="" id="tab_check" style="display: none;" class="fas fa-check-circle tab-icon icon-check"></i></span>',
    p_selectFunction: function() {
      if(this.tag != null) {
        this.tag.resize();
      }
      if(this.tag != null && this.tag.editor_input != null) {
          this.tag.editor_input.focus();
          checkConsoleStatus(this);
      }
    },
    p_closeFunction: function(e,p_tab) {
      var v_current_tab = p_tab;
      beforeCloseTab(e,
        function() {
          removeTab(v_current_tab);
        });
    }
  });

  // Selecting the newly created tab
  v_connTabControl.selectedTab.tag.tabControl.selectTab(v_tab);

  //Adding unique names to spans
  var v_tab_loading_span = document.getElementById('tab_loading');
  v_tab_loading_span.id = 'tab_loading_' + v_tab.id;
  var v_tab_check_span = document.getElementById('tab_check');
  v_tab_check_span.id = 'tab_check_' + v_tab.id;

  var console_history_modal =
  "<div class='modal fade' id='modal_console_history_" + v_tab.id + "' tabindex='-1' role='dialog' aria-hidden='true'>" +
    "<div class='modal-dialog modal-xl' role='document'>" +
      "<div class='modal-content'>" +
        "<div class='modal-header'>" +
          "<h5 class='modal-title'>" +
            "Console commands history" +
          "</h5>" +
          "<button type='button' class='close' data-dismiss='modal' aria-label='Close' onclick='closeConsoleHistory()'>" +
            "<span aria-hidden='true'>&times;</span>" +
          "</button>" +
        "</div>" +
        "<div class='modal-body'>" +
          "<div id='console_history_div_" + v_tab.id + "' class='console_command_history'>" +
            "<div id='console_history_header_" + v_tab.id + "' class='console_command_history_header'></div>" +
            "<div id='console_history_grid_" + v_tab.id + "' class='console_command_history_grid' style='width: 100%; height: calc(100vh - 16.5rem); overflow: hidden;'></div>" +
          "</div>" +
        "</div>" +
      "</div>" +
    "</div>" +
  "</div>";

  var v_html =
  "<div id='txt_console_" + v_tab.id + "' class='omnidb__txt-console' style=' width: 100%; height: 120px;'></div>" +
  "<div class='omnidb__resize-line__container' onmousedown='resizeVertical(event)' style='width: 100%; height: 5px; cursor: ns-resize;'><div class='resize_line_horizontal' style='height: 0px; border-bottom: 1px dashed #acc4e8;'></div><div style='height:5px;'></div></div>" +
  console_history_modal +
  "<div class='row mb-1'>" +
    "<div class='tab_actions omnidb__tab-actions col-12'>" +
      "<button id='bt_start_" + v_tab.id + "' class='btn btn-sm omnidb__theme__btn--primary omnidb__tab-actions__btn' title='Run' onclick='consoleSQL(false);'><i class='fas fa-play fa-light'></i></button>" +
      "<button id='bt_indent_" + v_tab.id + "' class='btn btn-sm omnidb__theme__btn--secondary omnidb__tab-actions__btn' title='Indent SQL' onclick='indentSQL();'><i class='fas fa-indent fa-light'></i></button>" +
      "<button id='bt_clear_" + v_tab.id + "' class='btn btn-sm omnidb__theme__btn--secondary omnidb__tab-actions__btn' title='Clear Console' onclick='clearConsole();'><i class='fas fa-broom fa-light'></i></button>" +
      "<button id='bt_history_" + v_tab.id + "' class='btn btn-sm omnidb__theme__btn--secondary omnidb__tab-actions__btn' title='Command History' onclick='showConsoleHistory();'><i class='fas fa-list fa-light'></i></button>" +
      "<div class='dbms_object postgresql_object omnidb__form-check form-check form-check-inline'><input id='check_autocommit_" + v_tab.id + "' class='form-check-input' type='checkbox' checked='checked'><label class='form-check-label dbms_object postgresql_object custom_checkbox query_info' for='check_autocommit_" + v_tab.id + "'>Autocommit</label></div>" +
      "<div class='dbms_object postgresql_object omnidb__tab-status'><i id='query_tab_status_" + v_tab.id + "' title='Not connected' class='fas fa-dot-circle tab-status tab-status-closed dbms_object postgresql_object omnidb__tab-status__icon'></i><span id='query_tab_status_text_" + v_tab.id + "' title='Not connected' class='tab-status-text query_info dbms_object postgresql_object ml-1'>Not connected</span></div>" +
      "<button id='bt_fetch_more_" + v_tab.id + "' class='btn btn-sm omnidb__theme__btn--secondary omnidb__tab-actions__btn' title='Fetch More' style='display: none; ' onclick='consoleSQL(false,1);'>Fetch more</button>" +
      "<button id='bt_fetch_all_" + v_tab.id + "' class='btn btn-sm omnidb__theme__btn--secondary omnidb__tab-actions__btn' title='Fetch All' style='margin-left: 5px; display: none; ' onclick='consoleSQL(false,2);'>Fetch all</button>" +
      "<button id='bt_skip_fetch_" + v_tab.id + "' class='btn btn-sm omnidb__theme__btn--secondary omnidb__tab-actions__btn' title='Skip Fetch' style='margin-left: 5px; display: none; ' onclick='consoleSQL(false,3);'>Skip Fetch</button>" +
      "<button id='bt_commit_" + v_tab.id + "' class='dbms_object dbms_object_hidden postgresql_object btn btn-sm omnidb__theme__btn--primary omnidb__tab-actions__btn' title='Run' style='margin-left: 5px; display: none; ' onclick='querySQL(3);'>Commit</button>" +
      "<button id='bt_rollback_" + v_tab.id + "' class='dbms_object dbms_object_hidden postgresql_object btn btn-sm omnidb__theme__btn--secondary omnidb__tab-actions__btn' title='Run' style='margin-left: 5px; display: none; ' onclick='querySQL(4);'>Rollback</button>" +
      "<button id='bt_cancel_" + v_tab.id + "' class='btn btn-sm btn-danger omnidb__tab-actions__btn' title='Cancel' style=' display: none;' onclick='cancelConsole();'>Cancel</button>" +
      "<div id='div_query_info_" + v_tab.id + "' class='omnidb__query-info'></div>" +
    "</div>" +
  "</div>" +
  "<div id='txt_input_" + v_tab.id + "' class='omnidb__console__text-input' style=' width: 100%; height: 150px; border: 1px solid #c3c3c3;'></div>";

  var v_div = document.getElementById('div_' + v_tab.id);
  v_tab.elementDiv.innerHTML = v_html;

  var langTools = ace.require("ace/ext/language_tools");
  var v_editor1 = ace.edit('txt_input_' + v_tab.id);
  v_editor1.$blockScrolling = Infinity;
  v_editor1.setTheme("ace/theme/" + v_editor_theme);
  v_editor1.session.setMode("ace/mode/sql");
  v_editor1.setFontSize(Number(v_font_size));

  // Setting custom keyboard shortcuts callbacks.
  $('#txt_input_' + v_tab.id).find('.ace_text-input').on('keyup',function(event){
    if (v_connTabControl.selectedTab.tag.enable_autocomplete !== false) {
      autocomplete_start(v_editor1,1,event);
    }
  });
  $('#txt_input_' + v_tab.id).find('.ace_text-input').on('keydown',function(event){
    if (v_connTabControl.selectedTab.tag.enable_autocomplete !== false) {
      autocomplete_keydown(v_editor1,event);
    }
    else {
      autocomplete_update_editor_cursor(v_editor1, event);
    }
  });

  // Remove shortcuts from ace in order to avoid conflict with omnidb shortcuts
  v_editor1.commands.bindKey("ctrl-space", null);
  v_editor1.commands.bindKey("Cmd-,", null);
  v_editor1.commands.bindKey("Ctrl-,", null);
  v_editor1.commands.bindKey("Cmd-Delete", null);
  v_editor1.commands.bindKey("Ctrl-Delete", null);
  v_editor1.commands.bindKey("Ctrl-Up", null);
  v_editor1.commands.bindKey("Ctrl-Down", null);
  v_editor1.commands.bindKey("Up", null);
  v_editor1.commands.bindKey("Down", null);
  v_editor1.commands.bindKey("Tab", null);

  document.getElementById('txt_input_' + v_tab.id).onclick = function() {
    v_editor1.focus();
  };

  document.getElementById('txt_input_' + v_tab.id).addEventListener('contextmenu',function(event) {
    event.stopPropagation();
    event.preventDefault();

    var v_option_list = [
      {
        text: 'Copy',
        icon: 'fas cm-all fa-terminal',
        action: function() {
          // Getting the value
          var copy_text = v_editor1.getValue();
          // Calling copy to clipboard.
          uiCopyTextToClipboard(copy_text);
        }
      },
      {
        text: 'Save as snippet',
        icon: 'fas cm-all fa-save',
        submenu: {
          elements: buildSnippetContextMenuObjects('save', v_connTabControl.tag.globalSnippets, v_editor1)
        }
      }
    ];

    if (v_connTabControl.tag.globalSnippets.files.length != 0 || v_connTabControl.tag.globalSnippets.folders.length != 0)
      v_option_list.push(
        {
          text: 'Use snippet',
          icon: 'fas cm-all fa-book',
          submenu: {
            elements: buildSnippetContextMenuObjects('load', v_connTabControl.tag.globalSnippets, v_editor1)
          }
        }
      )
    customMenu(
      {
        x:event.clientX+5,
        y:event.clientY+5
      },
      v_option_list,
      null
    );
  });

  v_editor1.focus();

  /*var v_editor2 = ace.edit('txt_console_' + v_tab.id);
  v_editor2.renderer.setOption('showLineNumbers', false);
  v_editor2.setOptions({});
  v_editor2.$blockScrolling = Infinity;
  v_editor2.setTheme("ace/theme/" + v_editor_theme);
  v_editor2.setFontSize(Number(v_font_size));

  //Remove shortcuts from ace in order to avoid conflict with omnidb shortcuts
  v_editor2.commands.bindKey("Cmd-,", null)
  v_editor2.commands.bindKey("Ctrl-,", null)
  v_editor2.commands.bindKey("Cmd-Delete", null)
  v_editor2.commands.bindKey("Ctrl-Delete", null)
  v_editor2.commands.bindKey("Ctrl-Up", null)
  v_editor2.commands.bindKey("Ctrl-Down", null)

  document.getElementById('txt_console_' + v_tab.id).onclick = function() {
    v_editor2.focus();
  };

  v_editor2.setOptions({
    enableBasicAutocompletion: true
  });
  v_editor2.setValue('>> ' + v_connTabControl.selectedTab.tag.consoleHelp)
  v_editor2.setReadOnly(true);
  v_editor2.clearSelection();*/

  var v_editor2 = new Terminal({
        fontSize: v_font_size,
        theme: v_current_terminal_theme,
        fontFamily: 'Monospace'
  });
  // var v_editor2_fit_addon = new FitAddon();
  // v_editor2.loadAddon(v_editor2_fit_addon);
  v_editor2.open(document.getElementById('txt_console_' + v_tab.id));
  v_editor2.write(v_connTabControl.selectedTab.tag.consoleHelp);
  // v_editor2_fit_addon.fit();
  //Loading Xterm Fit Addon
	Terminal.applyAddon(fit);
  v_editor2.fit();
/*
  v_editor1.commands.bindKey("Enter",
  function() {
    v_editor1.session.insert(v_editor1.getCursorPosition(),'\n');
    consoleSQL();
  });*/

  var v_resizeFunction = function () {
    var v_tab_tag = v_connTabControl.selectedTab.tag.tabControl.selectedTab.tag;
    if (v_tab_tag.div_console) {
      v_tab_tag.div_console.style.height = window.innerHeight - $(v_tab_tag.div_console).offset().top - parseInt(v_tab_tag.div_result.style.height,10) - (1.25)*v_font_size - 38 + 'px';
      v_tab_tag.editor_console.resize();
      v_tab_tag.editor_input.resize();
      v_tab_tag.editor_console.fit();
    }
  }

  var v_tag = {
    tab_id: v_tab.id,
    mode: 'console',
    editor_input: v_editor1,
    editor_console: v_editor2,
    editorDivId: 'txt_console_' + v_tab.id,
    div_console: document.getElementById('txt_console_' + v_tab.id),
    div_result: document.getElementById('txt_input_' + v_tab.id),
    query_info: document.getElementById('div_query_info_' + v_tab.id),
    query_tab_status: document.getElementById('query_tab_status_' + v_tab.id),
    query_tab_status_text: document.getElementById('query_tab_status_text_' + v_tab.id),
    bt_start: document.getElementById('bt_start_' + v_tab.id),
    bt_fetch_more: document.getElementById('bt_fetch_more_' + v_tab.id),
    bt_fetch_all: document.getElementById('bt_fetch_all_' + v_tab.id),
    bt_skip_fetch: document.getElementById('bt_skip_fetch_' + v_tab.id),
    bt_commit: document.getElementById('bt_commit_' + v_tab.id),
    bt_rollback: document.getElementById('bt_rollback_' + v_tab.id),
    bt_indent: document.getElementById('bt_indent_' + v_tab.id),
    bt_cancel: document.getElementById('bt_cancel_' + v_tab.id),
    check_autocommit: document.getElementById('check_autocommit_' + v_tab.id),
    tab_loading_span : v_tab_loading_span,
    tab_check_span : v_tab_check_span,
    context: null,
    tabControl: v_connTabControl.selectedTab.tag.tabControl,
    connTab: v_connTabControl.selectedTab,
    currDatabaseIndex: null,
    resize: v_resizeFunction,
    state: 0,
    // console_history_modal: document.getElementById('modal_console_history_' + v_tab.id),
    // console_history_div: document.getElementById('console_history_div_' + v_tab.id),
    // console_history_grid_div: document.getElementById('console_history_grid_' + v_tab.id),
    // console_history_grid: null,
    console_history_cmd_index: -1,
    tempData: [],
    consoleHistory: {
      modal: document.getElementById('modal_console_history_' + v_tab.id),
      div: document.getElementById('console_history_div_' + v_tab.id),
      headerDiv: document.getElementById('console_history_header_' + v_tab.id),
      gridDiv: document.getElementById('console_history_grid_' + v_tab.id),
      grid: null,
      currentPage: 1,
      pages: 1,
      spanNumPages: null,
      spanCurrPage: null,
      inputStartedFrom: null,
      inputStartedFromLastValue: null,
      inputStartedTo: null,
      inputStartedToLastValue: null,
      inputCommandContains: null,
      inputCommandContainsLastValue: null
    }
  };

  v_tab.tag = v_tag;

  // Creating + tab in the outer tab list
  var v_add_tab = v_connTabControl.selectedTab.tag.tabControl.createTab(
    {
      p_name: '+',
      p_close: false,
      p_selectable: false,
      p_clickFunction: function(e) {
        showMenuNewTab(e);
      }
    });
  v_add_tab.tag = {
    mode: 'add'
  }

  setTimeout(function() {
    v_resizeFunction();
  },10);

  adjustQueryTabObjects(false);

  // Sets a render refresh for the grid on the consoleHistory.modal after the modal is fully loaded
  $(v_connTabControl.selectedTab.tag.tabControl.selectedTab.tag.consoleHistory.modal).on('shown.bs.modal', function () {
    v_connTabControl.selectedTab.tag.tabControl.selectedTab.tag.consoleHistory.grid.render();
  });
}
