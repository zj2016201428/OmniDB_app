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

function getAllSnippets() {
  execAjax('/get_all_snippets/',
			JSON.stringify({}),
			function(p_return) {

        v_connTabControl.tag.globalSnippets = p_return;

			},
			null,
			'box',
			false);
}

/// <summary>
/// Retrieving tree.
/// </summary>
function getTreeSnippets(p_div) {

  var context_menu = {
    'cm_node_root' : {
      elements : [
        {
          text : '刷新',
          icon: 'fas cm-all fa-sync-alt',
          action : function(node) {
            if (node.childNodes==0)
              refreshTreeSnippets(node);
            else {
              node.collapseNode();
              node.expandNode();
            }
          }
        },
        {
          text : '新建文件夹',
          icon: 'fas cm-all fa-folder',
          action : function(node) {
            newNodeSnippet(node,'node');
          }
        },
        {
          text : '新建代码块',
          icon: 'fas cm-all fa-align-left',
          action : function(node) {
            newNodeSnippet(node,'snippet');
          }
        }
      ]
    },
    'cm_node' : {
      elements : [
        {
          text : '刷新',
          icon: 'fas cm-all fa-sync-alt',
          action : function(node) {
            if (node.childNodes==0)
              refreshTreeSnippets(node);
            else {
              node.collapseNode();
              node.expandNode();
            }
          }
        },
        {
          text : '新建文件夹',
          icon: 'fas cm-all fa-folder',
          action : function(node) {
            newNodeSnippet(node,'node');
          }
        },
        {
          text : '新建代码块',
          icon: 'fas cm-all fa-align-left',
          action : function(node) {
            newNodeSnippet(node,'snippet');
          }
        },
        {
          text : '文件夹重命名',
          icon: 'fas cm-all fa-edit',
          action : function(node) {
            renameNodeSnippet(node);
          }
        },
        {
          text : '删除文件夹',
          icon: 'fas cm-all fa-times',
          action : function(node) {
            deleteNodeSnippet(node);
          }
        }
      ]
    },
    'cm_snippet' : {
      elements : [
        {
          text : '编辑',
          icon: 'fas cm-all fa-edit',
          action : function(node) {
            startEditSnippetText(node);
          }
        },
        {
          text : '重命名',
          icon: 'fas cm-all fa-edit',
          action : function(node) {
            renameNodeSnippet(node);
          }
        },
        {
          text : '删除',
          icon: 'fas cm-all fa-times',
          action : function(node) {
            deleteNodeSnippet(node);
          }
        }
      ]
    }
  };

  var tree = createTree(p_div,'#fcfdfd',context_menu);
  tree.tag = {
  }


  tree.nodeAfterOpenEvent = function(node) {
    refreshTreeSnippets(node);
  }

  var node1 = tree.createNode('Snippets',false,'fas node-all fa-list-alt node-snippet-list',null,{ type: 'node', id:null},'cm_节点初始化');
  node1.createChildNode('',true,'node-spin',null,null);

  tree.drawTree();
  v_connTabControl.snippet_tree = tree;

}

/// <summary>
/// Refreshing tree node.
/// </summary>
/// <param name="node">Node object.</param>
function refreshTreeSnippets(node) {
	if (node.tag!=undefined)
    if (node.tag.type=='node') {
      getChildSnippetNodes(node);
    }
}

/// <summary>
/// Retrieving snippet nodes.
/// </summary>
/// <param name="node">Node object.</param>
function getChildSnippetNodes(node) {

	node.removeChildNodes();
	node.createChildNode('',false,'node-spin',null,null);


	execAjax('/get_node_children/',
			JSON.stringify({"p_sn_id_parent": node.tag.id}),
			function(p_return) {

				if (node.childNodes.length > 0)
					node.removeChildNodes();

				for (i=0; i<p_return.v_data.v_list_nodes.length; i++) {
          var v_node = node.createChildNode(p_return.v_data.v_list_nodes[i].v_name,false,'fas node-all fa-folder node-snippet-folder',{ type: 'node', id: p_return.v_data.v_list_nodes[i].v_id, id_parent: node.tag.id, name: p_return.v_data.v_list_nodes[i].v_name},'cm_节点');
          v_node.createChildNode('',true,'node-spin',null,null);
        }

        for (i=0; i<p_return.v_data.v_list_texts.length; i++) {
          var v_node = node.createChildNode(p_return.v_data.v_list_texts[i].v_name,false,'fas node-all fa-align-left node-snippet-snippet',{ type: 'snippet', id: p_return.v_data.v_list_texts[i].v_id, id_parent: node.tag.id, name: p_return.v_data.v_list_texts[i].v_name},'cm_代码块');
          v_node.doubleClickNodeEvent = function(p_node) {
            startEditSnippetText(p_node);
          }
        }

			},
			null,
			'box',
			false);
}

/// <summary>
/// Removes tab.
/// </summary>
/// <param name="p_tab">Tab object.</param>
function closeSnippetTab(p_tab) {

  p_tab.removeTab();
  if (p_tab.tag.ht!=null) {
  	p_tab.tag.ht.destroy();
  	p_tab.tag.div_result.innerHTML = '';
  }

  if (p_tab.tag.editor!=null)
  	p_tab.tag.editor.destroy();

}

function saveSnippetText(event) {

  var v_callback = function(p_return_object) {
    v_connTabControl.snippet_tag.tabControl.selectedTab.tag.snippetObject = p_return_object;
    v_connTabControl.snippet_tag.tabControl.selectedTab.tag.tab_title_span.innerHTML = p_return_object.name;
  }

  //var v_snippet_tab_list = v_connTabControl.snippet_tag.tabControl.tabList;

  if (v_connTabControl.snippet_tag.tabControl.selectedTab.tag.snippetObject.id != null) {
    var v_save_object = {
      v_id: v_connTabControl.snippet_tag.tabControl.selectedTab.tag.snippetObject.id,
      v_name : v_connTabControl.snippet_tag.tabControl.selectedTab.tag.snippetObject.name,
      v_parent : v_connTabControl.snippet_tag.tabControl.selectedTab.tag.snippetObject.parent
    }
    saveSnippetTextConfirm(
      v_save_object,
      v_connTabControl.snippet_tag.tabControl.selectedTab.tag.editor.getValue(),
      v_callback
    )
  }
  else {
    customMenu(
      {
        x:event.clientX+5,
        y:event.clientY+5
      },
      buildSnippetContextMenuObjects('save',
                                     v_connTabControl.tag.globalSnippets,
                                     v_connTabControl.snippet_tag.tabControl.selectedTab.tag.editor,
                                     v_callback
                                   ),
      null
    );


  }
}

function snippetTreeFindNode(p_id, p_current_node) {
  var v_node = null;

  for (var i=0; i < p_current_node.childNodes.length; i++) {
    if (p_current_node.childNodes[i].tag.id == p_id)
      return p_current_node.childNodes[i];
    else {
      v_node = snippetTreeFindNode(p_id, p_current_node.childNodes[i]);
      if (v_node!=null)
        return v_node;
    }
  }
  return v_node;
}

function saveSnippetTextConfirm(p_save_object, p_text, p_callback) {
  execAjax(
    '/save_snippet_text/',
    JSON.stringify({"p_id": p_save_object.v_id,
                   "p_parent": p_save_object.v_parent,
                   "p_name": p_save_object.v_name,
                   "p_text": p_text
                 }),
    function(p_return) {
      var v_node = null;
      if (p_return.v_data.parent==null) {
        v_node = v_connTabControl.snippet_tree.childNodes[0];
      }
      else {
        v_node = snippetTreeFindNode(p_return.v_data.parent, v_connTabControl.snippet_tree.childNodes[0]);
      }

      if (v_node!=null) {
        if (v_node.childNodes==0)
          refreshTreeSnippets(v_node);
        else {
          v_node.collapseNode();
          v_node.expandNode();
        }
      }

      if (p_callback!=null)
        p_callback(p_return.v_data);

      showAlert('Snippet saved.');

      getAllSnippets();
    },
    null,
    'box'
  );
}

function newNodeSnippet(p_node,p_mode) {
  var v_placeholder = '代码块名';
  if (p_mode=='node')
    v_placeholder = '节点名';

  showConfirm(
    '<input id="element_name" class="form-control" placeholder="' + v_placeholder + '" style="width: 100%;">',
    function() {
           execAjax('/new_node_snippet/',
         			JSON.stringify({"p_sn_id_parent": p_node.tag.id,
                              "p_mode": p_mode,
                              "p_name": document.getElementById('element_name').value}),
         			function(p_return) {
                 refreshTreeSnippets(p_node);

                 getAllSnippets();
         			},
         			null,
         			'box');

    },
    null,
    function() {
      var v_input = document.getElementById('element_name');
      v_input.focus();
      v_input.selectionStart = 0;
      v_input.selectionEnd = 10000;
    }
  );

  var v_input = document.getElementById('element_name');
	v_input.onkeydown = function() {
		if (event.keyCode == 13)
			document.getElementById('modal_message_ok').click();
		else if (event.keyCode == 27)
			document.getElementById('modal_message_cancel').click();
	}
}

function renameNodeSnippet(p_node) {

  showConfirm(
    '<input id="element_name" class="form-control" value="' + p_node.text + '" style="width: 100%;">',
    function() {
      execAjax('/rename_node_snippet/',
      	JSON.stringify({"p_id": p_node.tag.id,
                      "p_mode": p_node.tag.type,
                      "p_name": document.getElementById('element_name').value}),
      	function(p_return) {
         refreshTreeSnippets(p_node.parent);

         getAllSnippets();
      	},
      	null,
      	'box'
      );
    },
    null,
    function() {
      var v_input = document.getElementById('element_name');
      v_input.focus();
      v_input.selectionStart = 0;
      v_input.selectionEnd = 10000;
    }
  );

  var v_input = document.getElementById('element_name');
	v_input.onkeydown = function() {
		if (event.keyCode == 13)
			document.getElementById('modal_message_ok').click();
		else if (event.keyCode == 27)
			document.getElementById('modal_message_cancel').click();
	}
}

function deleteNodeSnippet(p_node) {

  showConfirm(
    'Are you sure you want to delete this ' + p_node.tag.type + '?',
    function() {
      execAjax('/delete_node_snippet/',
    		JSON.stringify({"p_id": p_node.tag.id,
                      "p_mode": p_node.tag.type}),
    		function(p_return) {
         refreshTreeSnippets(p_node.parent);

         getAllSnippets();
    		},
    		null,
    		'box'
      );
    },
    null,
    function() {
      var v_input = document.getElementById('modal_message_ok');
      v_input.focus();
    }
  );
}

function startEditSnippetText(p_node) {
  // Checking if there is a tab for this snippet.
  var v_snippet_tab_list = v_connTabControl.snippet_tag.tabControl.tabList;
  var v_avaiable_tab = false;
  for (let i = 0; i < v_snippet_tab_list.length; i++) {
    var v_snippet_tab_snippet_object = v_snippet_tab_list[i].tag.snippetObject;
    if (typeof v_snippet_tab_snippet_object === 'object') {
      if (v_snippet_tab_snippet_object.id === p_node.tag.id) {
        v_avaiable_tab = v_snippet_tab_list[i];
      }
    }
  }

  if (v_avaiable_tab) {
    v_connTabControl.snippet_tag.tabControl.selectTab(v_avaiable_tab);
  }
  else {
    v_connTabControl.tag.createSnippetTextTab(p_node.tag);
  }

  execAjax('/get_snippet_text/',
			JSON.stringify({"p_st_id": p_node.tag.id}),
			function(p_return) {
        v_connTabControl.snippet_tag.tabControl.selectedTab.tag.editor.setValue(p_return.v_data);
        v_connTabControl.snippet_tag.tabControl.selectedTab.tag.editor.clearSelection();
        v_connTabControl.snippet_tag.tabControl.selectedTab.tag.editor.gotoLine(0, 0, true);

			},
			null,
			'box');
}

function executeSnippet(p_id,p_editor) {
	execAjax('/get_snippet_text/',
			JSON.stringify({"p_st_id": p_id}),
			function(p_return) {
				p_editor.insert(p_return.v_data);
				p_editor.clearSelection();
			},
			null,
			'box');
}

function buildSnippetContextMenuObjects(p_mode, p_object, p_editor, p_callback) {

  var v_elements = [];

  if (p_mode == 'save') {
    v_elements.push(
      {
        text: '新建代码块',
        icon: 'fas cm-all fa-save',
        action: function() {
          showConfirm(
            '<input id="element_name" class="form-control" placeholder="代码块名" style="width: 100%;">',
            function() {
              saveSnippetTextConfirm(
                {
                  v_id: null,
                  v_name : document.getElementById('element_name').value,
                  v_parent: p_object.id
                },
                p_editor.getValue(),
                p_callback
              );
            },
            null,
            function() {
              var v_input = document.getElementById('element_name');
              v_input.focus();
              v_input.selectionStart = 0;
              v_input.selectionEnd = 10000;
            }
          );
          var v_input = document.getElementById('element_name');
        	v_input.onkeydown = function() {
        		if (event.keyCode == 13)
        			document.getElementById('modal_message_ok').click();
        		else if (event.keyCode == 27)
        			document.getElementById('modal_message_cancel').click();
        	}
        }
      }
    );
  }

  for (var i=0; i<p_object.files.length; i++) (function(i){
    var v_file = p_object.files[i];

    if (p_mode == 'save')
      v_elements.push(
        {
          text: '<b>OVERWRITE</b> ' + v_file.name,
          icon: 'fas cm-all fa-align-left',
          action: function() {
            showConfirm("<b>WARNING</b>, are you sure you want to overwrite file '" + v_file.name + "'?",
	            function() {
                saveSnippetTextConfirm(
                  {
                    v_id: v_file.id,
                    v_name : null,
                    v_parent: null
                  },
                  p_editor.getValue(),
                  p_callback
                );
	            }
            );
          }
        }
      );
    else
      v_elements.push(
        {
          text: v_file.name,
          icon: 'fas cm-all fa-align-left',
          action: function() {
              executeSnippet(v_file.id, p_editor)
          }
        }
      );
  })(i);

  for (var i=0; i<p_object.folders.length; i++) (function(i){
    var v_folder = p_object.folders[i];
    v_elements.push(
      {
        text: v_folder.name,
        icon: 'fas cm-all fa-folder',
        submenu: {
          elements: buildSnippetContextMenuObjects(p_mode, v_folder, p_editor, p_callback)
        }
      }
    );
  })(i);

  return v_elements;
}
