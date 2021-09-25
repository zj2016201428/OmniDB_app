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
/// Retrieving tree.
/// </summary>
function getTreeSqlite(p_div) {
    var context_menu = {
        'cm_server': {
            elements: [{
                text: 'Refresh',
                icon: 'fas cm-all fa-sync-alt',
                action: function(node) {
                    if (node.childNodes == 0) {
                        refreshTreeSqlite(node);
                    }
                    else {
                        node.collapseNode();
                        node.expandNode();
                    }
                }
            }]
        },
        'cm_tables': {
            elements: [{
                text: 'Refresh',
                icon: 'fas cm-all fa-sync-alt',
                action: function(node) {
                    if (node.childNodes == 0) {
                        refreshTreeSqlite(node);
                    }
                    else {
                        node.collapseNode();
                        node.expandNode();
                    }
                }
            }, {
                text: 'Create Table',
                icon: 'fas cm-all fa-edit',
                action: function(node) {
                    tabSQLTemplate(
                        '创建表',
                        node.tree.tag.create_table
                    );
                }
            }]
        },
        'cm_table': {
            elements: [{
                text: 'Refresh',
                icon: 'fas cm-all fa-sync-alt',
                action: function(node) {
                    if (node.childNodes == 0) {
                        refreshTreeSqlite(node);
                    }
                    else {
                        node.collapseNode();
                        node.expandNode();
                    }
                }
            }, {
                text: 'Data Actions',
                icon: 'fas cm-all fa-list',
                submenu: {
                    elements: [{
                        text: 'Query Data',
                        icon: 'fas cm-all fa-search',
                        action: function(node) {
                            TemplateSelectSqlite(
                                node.text,
                                't'
                            );
                        }
                    }, {
                        text: 'Edit Data',
                        icon: 'fas cm-all fa-table',
                        action: function(node) {
                            v_startEditData(
                                node.text
                            );
                        }
                    }, {
                        text: 'Insert Record',
                        icon: 'fas cm-all fa-edit',
                        action: function(node) {
                            TemplateInsertSqlite(
                                node.text
                            );
                        }
                    }, {
                        text: 'Update Records',
                        icon: 'fas cm-all fa-edit',
                        action: function(node) {
                            TemplateUpdateSqlite(
                                node.text
                            );
                        }
                    }, {
                        text: 'Delete Records',
                        icon: 'fas cm-all fa-times',
                        action: function(node) {
                          tabSQLTemplate(
                              '删除记录',
                              node.tree.tag.delete.replace(
                                  '#table_name#',
                                  node.text
                              )
                          );
                        }
                    }]
                }
            }, {
                text: 'Table Actions',
                icon: 'fas cm-all fa-list',
                submenu: {
                    elements: [{
                        text: 'Alter Table',
                        icon: 'fas cm-all fa-edit',
                        action: function(node) {
                            tabSQLTemplate(
                                '修改表',
                                node.tree.tag.alter_table.replace(
                                    '#table_name#',
                                    node.text
                                )
                            );
                        }
                    }, {
                        text: 'Drop Table',
                        icon: 'fas cm-all fa-times',
                        action: function(node) {
                            tabSQLTemplate(
                                '删除表',
                                node.tree.tag.drop_table.replace(
                                    '#table_name#',
                                    node.text
                                )
                            );
                        }
                    }]
                }
            }]
        },
        'cm_columns': {
            elements: [{
                text: 'Create Column',
                icon: 'fas cm-all fa-edit',
                action: function(node) {
                    tabSQLTemplate(
                        '创建列',
                        node.tree.tag.create_column.replace(
                            '#table_name#',
                            node.parent.text
                        )
                    );
                }
            }]
        },
        'cm_column': {
            elements: []
        },
        'cm_pks': {
            elements: [{
                text: 'Refresh',
                icon: 'fas cm-all fa-sync-alt',
                action: function(node) {
                    if (node.childNodes == 0) {
                        refreshTreeSqlite(node);
                    }
                    else {
                        node.collapseNode();
                        node.expandNode();
                    }
                }
            }]
        },
        'cm_pk': {
            elements: [{
                text: 'Refresh',
                icon: 'fas cm-all fa-sync-alt',
                action: function(node) {
                    if (node.childNodes == 0) {
                        refreshTreeSqlite(node);
                    }
                    else {
                        node.collapseNode();
                        node.expandNode();
                    }
                }
            }]
        },
        'cm_fks': {
            elements: [{
                text: 'Refresh',
                icon: 'fas cm-all fa-sync-alt',
                action: function(node) {
                    if (node.childNodes == 0) {
                        refreshTreeSqlite(node);
                    }
                    else {
                        node.collapseNode();
                        node.expandNode();
                    }
                }
            }]
        },
        'cm_fk': {
            elements: [{
                text: 'Refresh',
                icon: 'fas cm-all fa-sync-alt',
                action: function(node) {
                    if (node.childNodes == 0) {
                        refreshTreeSqlite(node);
                    }
                    else {
                        node.collapseNode();
                        node.expandNode();
                    }
                }
            }]
        },
        'cm_uniques': {
            elements: [{
                text: 'Refresh',
                icon: 'fas cm-all fa-sync-alt',
                action: function(node) {
                    if (node.childNodes == 0) {
                        refreshTreeSqlite(node);
                    }
                    else {
                        node.collapseNode();
                        node.expandNode();
                    }
                }
            }]
        },
        'cm_unique': {
            elements: [{
                text: 'Refresh',
                icon: 'fas cm-all fa-sync-alt',
                action: function(node) {
                    if (node.childNodes == 0) {
                        refreshTreeSqlite(node);
                    }
                    else {
                        node.collapseNode();
                        node.expandNode();
                    }
                }
            }]
        },
        'cm_indexes': {
            elements: [{
                text: 'Refresh',
                icon: 'fas cm-all fa-sync-alt',
                action: function(node) {
                    if (node.childNodes == 0) {
                        refreshTreeSqlite(node);
                    }
                    else {
                        node.collapseNode();
                        node.expandNode();
                    }
                }
            }, {
                text: 'Create Index',
                icon: 'fas cm-all fa-edit',
                action: function(node) {
                    tabSQLTemplate(
                        '创建索引',
                        node.tree.tag.create_index.replace(
                            '#table_name#',
                            node.parent.text
                        )
                    );
                }
            }]
        },
        'cm_index': {
            elements: [{
                text: 'Refresh',
                icon: 'fas cm-all fa-sync-alt',
                action: function(node) {
                    if (node.childNodes == 0) {
                        refreshTreeSqlite(node);
                    }
                    else {
                        node.collapseNode();
                        node.expandNode();
                    }
                }
            }, {
                text: 'Reindex',
                icon: 'fas cm-all fa-edit',
                action: function(node) {
                    tabSQLTemplate(
                        '重新索引',
                        node.tree.tag.reindex.replace(
                            '#index_name#',
                            node.text.replace(
                                ' (Unique)',
                                ''
                            ).replace(
                                ' (Non Unique)',
                                ''
                            )
                        )
                    );
                }
            }, {
                text: 'Drop Index',
                icon: 'fas cm-all fa-times',
                action: function(node) {
                    tabSQLTemplate(
                        '删除索引',
                        node.tree.tag.drop_index.replace(
                            '#index_name#',
                            node.text.replace(
                                ' (Unique)',
                                ''
                            ).replace(
                                ' (Non Unique)',
                                ''
                            )
                        )
                    );
                }
            }]
        },
        'cm_triggers': {
            elements: [{
                text: 'Refresh',
                icon: 'fas cm-all fa-sync-alt',
                action: function(node) {
                    if (node.childNodes == 0) {
                        refreshTreeSqlite(node);
                    }
                    else {
                        node.collapseNode();
                        node.expandNode();
                    }
                },
            }, {
                text: 'Create Trigger',
                icon: 'fas cm-all fa-edit',
                action: function(node) {
                    tabSQLTemplate(
                        '创建触发器',
                        node.tree.tag.create_trigger.replace(
                            '#table_name#',
                            node.parent.text
                        )
                    );
                }
            }]
        },
        'cm_trigger': {
            elements: [{
                text: 'Alter Trigger',
                icon: 'fas cm-all fa-edit',
                action: function(node) {
                    tabSQLTemplate(
                        '修改触发器',
                        node.tree.tag.alter_trigger.replace(
                            '#table_name#',
                            node.parent.parent.text
                        ).replace(
                            '#trigger_name#',
                            node.text
                        )
                    );
                }
            }, {
                text: 'Drop Trigger',
                icon: 'fas cm-all fa-times',
                action: function(node) {
                    tabSQLTemplate(
                        '删除触发器',
                        node.tree.tag.drop_trigger.replace(
                            '#table_name#',
                            node.parent.parent.text
                        ).replace(
                            '#trigger_name#',
                            node.text
                        )
                    );
                }
            }]
        },
        'cm_views': {
            elements: [{
                text: 'Refresh',
                icon: 'fas cm-all fa-sync-alt',
                action: function(node) {
                    if (node.childNodes == 0) {
                        refreshTreeSqlite(node);
                    }
                    else {
                        node.collapseNode();
                        node.expandNode();
                    }
                }
            }, {
                text: 'Create View',
                icon: 'fas cm-all fa-edit',
                action: function(node) {
                    tabSQLTemplate(
                        '创建视图',
                        node.tree.tag.create_view
                    );
                }
            }]
        },
        'cm_view': {
            elements: [{
                text: 'Refresh',
                icon: 'fas cm-all fa-sync-alt',
                action: function(node) {
                    if (node.childNodes == 0) {
                        refreshTreeSqlite(node);
                    }
                    else {
                        node.collapseNode();
                        node.expandNode();
                    }
                }
            }, {
                text: 'Query Data',
                icon: 'fas cm-all fa-search',
                action: function(node) {
                    TemplateSelectSqlite(
                        node.text,
                        'v'
                    );
                }
            }, {
                text: 'Drop View',
                icon: 'fas cm-all fa-times',
                action: function(node) {
                    tabSQLTemplate(
                        '删除视图',
                        node.tree.tag.drop_view.replace(
                            '#view_name#',
                            node.text
                        )
                    );
                }
            }]
        },
        'cm_refresh': {
            elements: [{
                text: 'Refresh',
                icon: 'fas cm-all fa-sync-alt',
                action: function(node) {
                    if (node.childNodes == 0) {
                        refreshTreeSqlite(node);
                    }
                    else {
                        node.collapseNode();
                        node.expandNode();
                    }
                }
            }]
        }
    };

    var tree = createTree(p_div, '#fcfdfd', context_menu);
    v_connTabControl.selectedTab.tag.tree = tree;

    let v_autocomplete_switch_status = (v_connTabControl.selectedTab.tag.enable_autocomplete !== false) ? ' checked ' : '';

    v_connTabControl.selectedTab.tag.divDetails.innerHTML =
        '<i class="fas fa-server mr-1"></i>selected DB: ' +
        '<b>' + v_connTabControl.selectedTab.tag.selectedDatabase + '</b>' +
        '<div class="omnidb__switch omnidb__switch--sm float-right" data-toggle="tooltip" data-placement="bottom" data-html="true" title="" data-original-title="<h5>Toggle autocomplete.</h5><div>Switch OFF <b>disables the autocomplete</b> on the inner tabs for this connection.</div>">' +
    	'    <input type="checkbox" ' + v_autocomplete_switch_status + ' id="autocomplete_toggler_' + v_connTabControl.selectedTab.tag.tab_id + '" class="omnidb__switch--input" onchange="toggleConnectionAutocomplete(\'autocomplete_toggler_' + v_connTabControl.selectedTab.tag.tab_id + '\')">' +
    	'    <label for="autocomplete_toggler_' + v_connTabControl.selectedTab.tag.tab_id + '" class="omnidb__switch--label"><span><i class="fas fa-spell-check"></i></span></label>' +
		'</div>';

    tree.nodeAfterOpenEvent = function(node) {
        refreshTreeSqlite(node);

        // Adjusting scroll position of tree
        try {
            let v_first_child_toggle = node.elementUl.childNodes[0].childNodes[0].childNodes[0].childNodes[0];
            let pos_x = v_first_child_toggle.offsetLeft - 24;
            let pos_y = v_first_child_toggle.offsetTop - 64;
            v_connTabControl.selectedTab.tag.divTree.scroll(pos_x, pos_y);
        }
        catch(e) {
            // Do nothing
        }
    }

    tree.clickNodeEvent = function(node) {
        if (v_connTabControl.selectedTab.tag.treeTabsVisible) {
            getPropertiesSqlite(node);
        }
        else {
            // Do nothing
        }
    }

    tree.beforeContextMenuEvent = function(node, callback) {
        var v_elements = [];

        //Hooks
        if (v_connTabControl.tag.hooks.sqliteTreeContextMenu.length > 0) {
            for (var i = 0; i < v_connTabControl.tag.hooks.sqliteTreeContextMenu.length; i++) {
                v_elements = v_elements.concat(v_connTabControl.tag.hooks.sqliteTreeContextMenu[i](node));
            }
        }

        callback(v_elements);
    }

    var node_server = tree.createNode(
        'SQLite',
        false,
        'node-sqlite',
        null,
        {
            type: 'server'
        },
        'cm_服务'
    );

    node_server.createChildNode(
        '',
        true,
        'node-spin',
        null,
        null
    );

    tree.drawTree();
}

/// <summary>
/// Refreshing tree node confirm.
/// </summary>
/// <param name="node">Node object.</param>
function refreshTreeSqlite(node) {
    if (node.tag != undefined) {
        if (node.tag.type == 'table_list') {
            getTablesSqlite(node);
        }
        else if (node.tag.type == 'table') {
            getColumnsSqlite(node);
        }
        else if (node.tag.type == 'primary_key') {
            getPKSqlite(node);
        }
        else if (node.tag.type == 'pk') {
            getPKColumnsSqlite(node);
        }
        else if (node.tag.type == 'uniques') {
            getUniquesSqlite(node);
        }
        else if (node.tag.type == 'unique') {
            getUniquesColumnsSqlite(node);
        }
        else if (node.tag.type == 'foreign_keys') {
            getFKsSqlite(node);
        }
        else if (node.tag.type == 'foreign_key') {
            getFKsColumnsSqlite(node);
        }
        else if (node.tag.type == 'view_list') {
            getViewsSqlite(node);
        }
        else if (node.tag.type == 'view') {
            getViewsColumnsSqlite(node);
        }
        else if (node.tag.type == 'indexes') {
            getIndexesSqlite(node);
        }
        else if (node.tag.type == 'index') {
            getIndexesColumnsSqlite(node);
        }
        else if (node.tag.type == 'trigger_list') {
            getTriggersSqlite(node);
        }
        else if (node.tag.type == 'server') {
            getTreeDetailsSqlite(node);
        } else {
          afterNodeOpenedCallbackSqlite(node);
        }
    }
}

function afterNodeOpenedCallbackSqlite(node) {
    //Hooks
    if (v_connTabControl.tag.hooks.sqliteTreeNodeOpen.length > 0) {
        for (var i = 0; i < v_connTabControl.tag.hooks.sqliteTreeNodeOpen.length; i++) {
            v_connTabControl.tag.hooks.sqliteTreeNodeOpen[i](node);
        }
    }
}

/// <summary>
/// Retrieving tree details.
/// </summary>
/// <param name="node">Node object.</param>
function getTreeDetailsSqlite(node) {
    node.removeChildNodes();

    node.createChildNode(
        '',
        false,
        'node-spin',
        null,
        null
    );

    execAjax(
        '/get_tree_info_sqlite/',
        JSON.stringify({
            'p_database_index': v_connTabControl.selectedTab.tag.selectedDatabaseIndex,
            'p_tab_id': v_connTabControl.selectedTab.id
        }),
        function(p_return) {
            node.tree.contextMenu.cm_server.elements = []

            node.tree.contextMenu.cm_server.elements.push({
                text: 'Refresh',
                icon: 'fas cm-all fa-sync-alt',
                action: function(node) {
                    if (node.childNodes == 0) {
                        refreshTreeSqlite(node);
                    }
                    else {
                        node.collapseNode();
                        node.expandNode();
                    }
                }
            });

            if (node.childNodes.length > 0) {
                node.removeChildNodes();
            }

            node.tree.tag = {
                version: p_return.v_data.v_database_return.version,
                create_view: p_return.v_data.v_database_return.create_view,
                drop_view: p_return.v_data.v_database_return.drop_view,
                create_table: p_return.v_data.v_database_return.create_table,
                alter_table: p_return.v_data.v_database_return.alter_table,
                drop_table: p_return.v_data.v_database_return.drop_table,
                create_column: p_return.v_data.v_database_return.create_column,
                alter_column: p_return.v_data.v_database_return.alter_column,
                drop_column: p_return.v_data.v_database_return.drop_column,
                create_index: p_return.v_data.v_database_return.create_index,
                reindex: p_return.v_data.v_database_return.reindex,
                drop_index: p_return.v_data.v_database_return.drop_index,
                delete: p_return.v_data.v_database_return.delete,
                create_trigger: p_return.v_data.v_database_return.create_trigger,
                drop_trigger: p_return.v_data.v_database_return.drop_trigger
            }

            var node_tables = node.createChildNode(
                'Tables',
                false,
                'fas node-all fa-th node-table-list',
                {
                    type: 'table_list',
                    num_tables: 0
                },
                'cm_表',
                null,
                false
            );

            node_tables.createChildNode(
                '',
                true,
                'node-spin',
                null,
                null,
                null,
                false
            );

            var node_views = node.createChildNode(
                'Views',
                false,
                'fas node-all fa-eye node-view-list',
                {
                    type: 'view_list',
                    num_views: 0
                },
                'cm_视图',
                null,
                false
            );

            node_views.createChildNode(
                '',
                true,
                'node-spin',
                null,
                null,
                null,
                false
            );

            node.setText(p_return.v_data.v_database_return.version);

            node.drawChildNodes();

            afterNodeOpenedCallbackSqlite(node);

        },
        function(p_return) {
            nodeOpenError(p_return, node);
        },
        'box',
        false
    );
}


function nodeOpenError(p_return, p_node) {
    p_node.collapseNode();

    showPasswordPrompt(
        v_connTabControl.selectedTab.tag.selectedDatabaseIndex,
        function() {
            p_node.expandNode();
        },
        null,
        p_return.v_data.message
    );
}

/// <summary>
/// Retrieving tables.
/// </summary>
/// <param name="node">Node object.</param>
function getTablesSqlite(node) {
    node.removeChildNodes();

    node.createChildNode(
        '',
        false,
        'node-spin',
        null,
        null
    );

    execAjax(
        '/get_tables_sqlite/',
        JSON.stringify({
            'p_database_index': v_connTabControl.selectedTab.tag.selectedDatabaseIndex,
            'p_tab_id': v_connTabControl.selectedTab.id
        }),
        function(p_return) {
            if (node.childNodes.length > 0) {
                node.removeChildNodes();
            }

            node.setText('Tables (' + p_return.v_data.length + ')');

            node.tag.num_tables = p_return.v_data.length;

            for (i = 0; i < p_return.v_data.length; i++) {
                v_node = node.createChildNode(
                    p_return.v_data[i].v_name,
                    false,
                    'fas node-all fa-table node-table',
                    {
                        type: 'table',
                        has_primary_keys: p_return.v_data[i].v_has_primary_keys,
                        has_foreign_keys: p_return.v_data[i].v_has_foreign_keys,
                        has_uniques: p_return.v_data[i].v_has_uniques,
                        has_indexes: p_return.v_data[i].v_has_indexes,
                        has_checks: p_return.v_data[i].v_has_checks,
                        has_excludes: p_return.v_data[i].v_has_excludes,
                        has_rules: p_return.v_data[i].v_has_rules,
                        has_triggers: p_return.v_data[i].v_has_triggers,
                        has_partitions: p_return.v_data[i].v_has_partitions,
                        has_statistics: p_return.v_data[i].v_has_statistics,
                        database: v_connTabControl.selectedTab.tag.selectedDatabase
                    },
                    'cm_表',
                    null,
                    false
                );

                v_node.createChildNode(
                    '',
                    false,
                    'node-spin',
                    {
                        type: 'table_field'
                    },
                    null,
                    null,
                    false
                );

            }

            node.drawChildNodes();

            afterNodeOpenedCallbackSqlite(node);
        },
        function(p_return) {
            nodeOpenError(p_return, node);
        },
        'box',
        false
    );
}

/// <summary>
/// Retrieving columns.
/// </summary>
/// <param name="node">Node object.</param>
function getColumnsSqlite(node) {
    node.removeChildNodes();

    node.createChildNode(
        '',
        false,
        'node-spin',
        null,
        null
    );

    execAjax(
        '/get_columns_sqlite/',
        JSON.stringify({
            'p_database_index': v_connTabControl.selectedTab.tag.selectedDatabaseIndex,
            'p_tab_id': v_connTabControl.selectedTab.id,
            'p_table': node.text
        }),
        function(p_return) {
            if (node.childNodes.length > 0) {
                node.removeChildNodes();
            }

            v_list = node.createChildNode(
                'Columns (' + p_return.v_data.length + ')',
                false,
                'fas node-all fa-columns node-column',
                {
                    type: 'column_list',
                    database: v_connTabControl.selectedTab.tag.selectedDatabase
                },
                'cm_列',
                null,
                false
            );

            for (i = 0; i < p_return.v_data.length; i++) {
                v_node = v_list.createChildNode(
                    p_return.v_data[i].v_column_name,
                    false,
                    'fas node-all fa-columns node-column',
                    {
                        type: 'table_field',
                        database: v_connTabControl.selectedTab.tag.selectedDatabase
                    },
                    'cm_列',
                    null,
                    false
                );

                v_node.createChildNode(
                    'Type: ' + p_return.v_data[i].v_data_type,
                    false,
                    'fas node-all fa-ellipsis-h node-bullet',
                    {
                        database: v_connTabControl.selectedTab.tag.selectedDatabase
                    },
                    null,
                    null,
                    false
                );

                v_node.createChildNode(
                    'Nullable: ' + p_return.v_data[i].v_nullable,
                    false,
                    'fas node-all fa-ellipsis-h node-bullet',
                    {
                        database: v_connTabControl.selectedTab.tag.selectedDatabase
                    },
                    null,
                    null,
                    false
                );
            }

            if (node.tag.has_primary_keys) {
                v_node = node.createChildNode(
                    'Primary Key',
                    false,
                    'fas node-all fa-key node-pkey',
                    {
                        type: 'primary_key',
                        database: v_connTabControl.selectedTab.tag.selectedDatabase
                    },
                    'cm_主键',
                    null,
                    false
                );

                v_node.createChildNode(
                    '',
                    false,
                    'node-spin',
                    null,
                    null,
                    null,
                    false
                );
            }

            if (node.tag.has_foreign_keys) {
                v_node = node.createChildNode(
                    'Foreign Keys',
                    false,
                    'fas node-all fa-key node-fkey',
                    {
                        type: 'foreign_keys',
                        database: v_connTabControl.selectedTab.tag.selectedDatabase
                    },
                    'cm_外键',
                    null,
                    false
                );

                v_node.createChildNode(
                    '',
                    false,
                    'node-spin',
                    null,
                    null,
                    null,
                    false
                );
            }

            if (node.tag.has_uniques) {
                v_node = node.createChildNode(
                    'Uniques',
                    false,
                    'fas node-all fa-key node-unique',
                    {
                        type: 'uniques',
                        database: v_connTabControl.selectedTab.tag.selectedDatabase
                    },
                    'cm_独立单元',
                    null,
                    false
                );

                v_node.createChildNode(
                    '',
                    false,
                    'node-spin',
                    null,
                    null,
                    null,
                    false
                );
            }

            if (node.tag.has_checks) {
                v_node = node.createChildNode(
                    'Checks',
                    false,
                    'fas node-all fa-check-square node-check',
                    {
                        type: 'check_list',
                        database: v_connTabControl.selectedTab.tag.selectedDatabase
                    },
                    'cm_检查',
                    null,
                    false
                );

                v_node.createChildNode(
                    '',
                    false,
                    'node-spin',
                    null,
                    null,
                    null,
                    false
                );
            }

            if (node.tag.has_indexes) {
                v_node = node.createChildNode(
                    'Indexes',
                    false,
                    'fas node-all fa-thumbtack node-index',
                    {
                        type: 'indexes',
                        database: v_connTabControl.selectedTab.tag.selectedDatabase
                    },
                    'cm_索引',
                    null,
                    false
                );

                v_node.createChildNode(
                    '',
                    false,
                    'node-spin',
                    null,
                    null,
                    null,
                    false
                );
            }

            if (node.tag.has_triggers) {
                v_node = node.createChildNode(
                    'Triggers',
                    false,
                    'fas node-all fa-bolt node-trigger',
                    {
                        type: 'trigger_list',
                        database: v_connTabControl.selectedTab.tag.selectedDatabase
                    },
                    'cm_触发器',
                    null,
                    false
                );

                v_node.createChildNode(
                    '',
                    false,
                    'node-spin',
                    null,
                    null,
                    null,
                    false
                );
            }

            node.drawChildNodes();

            afterNodeOpenedCallbackSqlite(node);
        },
        function(p_return) {
            nodeOpenError(p_return, node);
        },
        'box',
        false
    );
}

/// <summary>
/// Retrieving PKs.
/// </summary>
/// <param name="node">Node object.</param>
function getPKSqlite(node) {
    node.removeChildNodes();

    node.createChildNode(
        '',
        false,
        'node-spin',
        null,
        null
    );

    execAjax(
        '/get_pk_sqlite/',
        JSON.stringify({
            'p_database_index': v_connTabControl.selectedTab.tag.selectedDatabaseIndex,
            'p_tab_id': v_connTabControl.selectedTab.id,
            'p_table': node.parent.text
        }),
        function(p_return) {
            node.setText('Primary Key (' + p_return.v_data.length + ')');

            if (node.childNodes.length > 0) {
                node.removeChildNodes();
            }

            if (p_return.v_data.length > 0) {
                v_node = node.createChildNode(
                    p_return.v_data[0][0],
                    false,
                    'fas node-all fa-key node-pkey',
                    {
                        type: 'pk',
                        database: v_connTabControl.selectedTab.tag.selectedDatabase
                    },
                    'cm_主键'
                );

                v_node.createChildNode(
                    '',
                    false,
                    'node-spin',
                    {
                        type: 'pk_field'
                    },
                    null
                );
            }

            afterNodeOpenedCallbackSqlite(node);
        },
        function(p_return) {
            nodeOpenError(p_return, node);
        },
        'box',
        false
    );
}

/// <summary>
/// Retrieving PKs Columns.
/// </summary>
/// <param name="node">Node object.</param>
function getPKColumnsSqlite(node) {
    node.removeChildNodes();

    node.createChildNode(
        '',
        false,
        'node-spin',
        null,
        null
    );

    execAjax(
        '/get_pk_columns_sqlite/',
        JSON.stringify({
            'p_database_index': v_connTabControl.selectedTab.tag.selectedDatabaseIndex,
            'p_tab_id': v_connTabControl.selectedTab.id,
            'p_table': node.parent.parent.text
        }),
        function(p_return) {
            if (node.childNodes.length > 0) {
                node.removeChildNodes();
            }

            for (var i = 0; i < p_return.v_data.length; i++) {
                v_node.createChildNode(
                    p_return.v_data[i][0],
                    false,
                    'fas node-all fa-columns node-column',
                    {
                        database: v_connTabControl.selectedTab.tag.selectedDatabase
                    },
                    null,
                    null,
                    false
                );
            }

            node.drawChildNodes();

            afterNodeOpenedCallbackSqlite(node);
        },
        function(p_return) {
            nodeOpenError(p_return, node);
        },
        'box',
        false
    );
}

/// <summary>
/// Retrieving FKs.
/// </summary>
/// <param name="node">Node object.</param>
function getFKsSqlite(node) {
    node.removeChildNodes();

    node.createChildNode(
        '',
        false,
        'node-spin',
        null,
        null
    );

    execAjax(
        '/get_fks_sqlite/',
        JSON.stringify({
            'p_database_index': v_connTabControl.selectedTab.tag.selectedDatabaseIndex,
            'p_tab_id': v_connTabControl.selectedTab.id,
            'p_table': node.parent.text
        }),
        function(p_return) {
            node.setText('Foreign Keys (' + p_return.v_data.length + ')');

            if (node.childNodes.length > 0) {
                node.removeChildNodes();
            }

            for (i = 0; i < p_return.v_data.length; i++) {
                v_node = node.createChildNode(
                    p_return.v_data[i][0],
                    false,
                    'fas node-all fa-key node-fkey',
                    {
                        type: 'foreign_key',
                        database: v_connTabControl.selectedTab.tag.selectedDatabase
                    },
                    'cm_外键',
                    null,
                    false
                );

                v_node.createChildNode(
                    'Referenced Table: ' + p_return.v_data[i][1],
                    false,
                    'fas node-all fa-table node-table',
                    {
                        database: v_connTabControl.selectedTab.tag.selectedDatabase
                    },
                    null,
                    null,
                    false
                );

                v_node.createChildNode(
                    'Delete Rule: ' + p_return.v_data[i][2],
                    false,
                    'fas node-all fa-ellipsis-h node-bullet',
                    {
                        database: v_connTabControl.selectedTab.tag.selectedDatabase
                    },
                    null,
                    null,
                    false
                );

                v_node.createChildNode(
                    'Update Rule: ' + p_return.v_data[i][3],
                    false,
                    'fas node-all fa-ellipsis-h node-bullet',
                    {
                        database: v_connTabControl.selectedTab.tag.selectedDatabase
                    },
                    null,
                    null,
                    false
                );

                v_curr_fk = p_return.v_data[i][0];
            }

            node.drawChildNodes();

            afterNodeOpenedCallbackSqlite(node);
        },
        function(p_return) {
            nodeOpenError(p_return, node);
        },
        'box',
        false
    );
}

/// <summary>
/// Retrieving FKs Columns.
/// </summary>
/// <param name="node">Node object.</param>
function getFKsColumnsSqlite(node) {
    node.removeChildNodes();

    node.createChildNode(
        '',
        false,
        'node-spin',
        null,
        null
    );

    execAjax(
        '/get_fks_columns_sqlite/',
        JSON.stringify({
            'p_database_index': v_connTabControl.selectedTab.tag.selectedDatabaseIndex,
            'p_tab_id': v_connTabControl.selectedTab.id,
            'p_fkey': node.text,
            'p_table': node.parent.parent.text
        }),
        function(p_return) {
            if (node.childNodes.length > 0) {
                node.removeChildNodes();
            }

            node.createChildNode(
                'Referenced Table: ' + p_return.v_data[0][0],
                false,
                'fas node-all fa-table node-table',
                {
                    database: v_connTabControl.selectedTab.tag.selectedDatabase
                },
                null,
                null,
                false
            );

            node.createChildNode(
                'Delete Rule: ' + p_return.v_data[0][1],
                false,
                'fas node-all fa-ellipsis-h node-bullet',
                {
                    database: v_connTabControl.selectedTab.tag.selectedDatabase
                },
                null,
                null,
                false
            );

            node.createChildNode(
                'Update Rule: ' + p_return.v_data[0][2],
                false,
                'fas node-all fa-ellipsis-h node-bullet',
                {
                    database: v_connTabControl.selectedTab.tag.selectedDatabase
                },
                null,
                null,
                false
            );

            for (var i = 0; i < p_return.v_data.length; i++) {
                node.createChildNode(
                    p_return.v_data[i][3] + " <i class='fas node-all fa-arrow-right'></i> " + p_return.v_data[i][4],
                    false,
                    'fas node-all fa-columns node-column',
                    {
                        database: v_connTabControl.selectedTab.tag.selectedDatabase
                    },
                    null,
                    null,
                    false
                );
            }

            node.drawChildNodes();

            afterNodeOpenedCallbackSqlite(node);
        },
        function(p_return) {
            nodeOpenError(p_return, node);
        },
        'box',
        false
    );
}

/// <summary>
/// Retrieving Uniques.
/// </summary>
/// <param name="node">Node object.</param>
function getUniquesSqlite(node) {
    node.removeChildNodes();

    node.createChildNode(
        '',
        false,
        'node-spin',
        null,
        null
    );

    execAjax(
        '/get_uniques_sqlite/',
        JSON.stringify({
            'p_database_index': v_connTabControl.selectedTab.tag.selectedDatabaseIndex,
            'p_tab_id': v_connTabControl.selectedTab.id,
            'p_table': node.parent.text
        }),
        function(p_return) {
            node.setText('Uniques (' + p_return.v_data.length + ')');

            if (node.childNodes.length > 0) {
                node.removeChildNodes();
            }

            for (var i = 0; i < p_return.v_data.length; i++) {
                v_node = node.createChildNode(
                    p_return.v_data[i][0],
                    false,
                    'fas node-all fa-key node-unique',
                    {
                        type: 'unique',
                        database: v_connTabControl.selectedTab.tag.selectedDatabase
                    },
                    'cm_独立单元',
                    null,
                    false
                );

                v_node.createChildNode(
                    '',
                    false,
                    'node-spin',
                    {
                        type: 'unique_field'
                    },
                    null,
                    null,
                    false
                );
            }

            node.drawChildNodes();

            afterNodeOpenedCallbackSqlite(node);
        },
        function(p_return) {
            nodeOpenError(p_return, node);
        },
        'box',
        false
    );
}

/// <summary>
/// Retrieving Uniques Columns.
/// </summary>
/// <param name="node">Node object.</param>
function getUniquesColumnsSqlite(node) {
    node.removeChildNodes();

    node.createChildNode(
        '',
        false,
        'node-spin',
        null,
        null
    );

    execAjax(
        '/get_uniques_columns_sqlite/',
        JSON.stringify({
            'p_database_index': v_connTabControl.selectedTab.tag.selectedDatabaseIndex,
            'p_tab_id': v_connTabControl.selectedTab.id,
            'p_unique': node.text,
            'p_table': node.parent.parent.text
        }),
        function(p_return) {
            if (node.childNodes.length > 0) {
                node.removeChildNodes();
            }

            for (var i = 0; i < p_return.v_data.length; i++) {
                node.createChildNode(
                    p_return.v_data[i][0],
                    false,
                    'fas node-all fa-columns node-column',
                    {
                        database: v_connTabControl.selectedTab.tag.selectedDatabase
                    },
                    null,
                    null,
                    false
                );

            }

            node.drawChildNodes();

            afterNodeOpenedCallbackSqlite(node);
        },
        function(p_return) {
            nodeOpenError(p_return, node);
        },
        'box',
        false
    );
}

/// <summary>
/// Retrieving Indexes.
/// </summary>
/// <param name="node">Node object.</param>
function getIndexesSqlite(node) {
    node.removeChildNodes();

    node.createChildNode(
        '',
        false,
        'node-spin',
        null,
        null
    );

    execAjax(
        '/get_indexes_sqlite/',
        JSON.stringify({
            'p_database_index': v_connTabControl.selectedTab.tag.selectedDatabaseIndex,
            'p_tab_id': v_connTabControl.selectedTab.id,
            'p_table': node.parent.text
        }),
        function(p_return) {
            node.setText('Indexes (' + p_return.v_data.length + ')');

            if (node.childNodes.length > 0) {
                node.removeChildNodes();
            }

            for (var i = 0; i < p_return.v_data.length; i++) {
                var v_node = node.createChildNode(
                    p_return.v_data[i][0] + ' (' + p_return.v_data[i][1] + ')',
                    false,
                    'fas node-all fa-thumbtack node-index',
                    {
                        type: 'index',
                        database: v_connTabControl.selectedTab.tag.selectedDatabase
                    },
                    'cm_索引',
                    null,
                    false
                );

                v_node.createChildNode(
                    '',
                    false,
                    'node-spin',
                    {
                        type: 'index_field',
                        database: v_connTabControl.selectedTab.tag.selectedDatabase
                    },
                    null,
                    null,
                    false
                );
            }

            node.drawChildNodes();

            afterNodeOpenedCallbackSqlite(node);
        },
        function(p_return) {
            nodeOpenError(p_return, node);
        },
        'box',
        false
    );
}

/// <summary>
/// Retrieving Indexes Columns.
/// </summary>
/// <param name="node">Node object.</param>
function getIndexesColumnsSqlite(node) {
    node.removeChildNodes();

    node.createChildNode(
        '',
        false,
        'node-spin',
        null,
        null
    );

    execAjax(
        '/get_indexes_columns_sqlite/',
        JSON.stringify({
            p_database_index: v_connTabControl.selectedTab.tag.selectedDatabaseIndex,
            p_tab_id: v_connTabControl.selectedTab.id,
            p_index: node.text.replace(' (Non Unique)', '').replace(' (Unique)', ''),
            p_table: node.parent.parent.text
        }),
        function(p_return) {
            if (node.childNodes.length > 0) {
                node.removeChildNodes();
            }

            for (var i = 0; i < p_return.v_data.length; i++) {
                node.createChildNode(
                    p_return.v_data[i][0],
                    false,
                    'fas node-all fa-columns node-column',
                    {
                        database: v_connTabControl.selectedTab.tag.selectedDatabase
                    },
                    null,
                    null,
                    false
                );

            }

            node.drawChildNodes();

            afterNodeOpenedCallbackSqlite(node);
        },
        function(p_return) {
            nodeOpenError(p_return, node);
        },
        'box',
        false
    );
}

/// <summary>
/// Retrieving views.
/// </summary>
/// <param name="node">Node object.</param>
function getViewsSqlite(node) {
    node.removeChildNodes();

    node.createChildNode(
        '',
        false,
        'node-spin',
        null,
        null
    );

    execAjax(
        '/get_views_sqlite/',
        JSON.stringify({
            'p_database_index': v_connTabControl.selectedTab.tag.selectedDatabaseIndex,
            'p_tab_id': v_connTabControl.selectedTab.id
        }),
        function(p_return) {
            if (node.childNodes.length > 0) {
                node.removeChildNodes();
            }

            node.setText('Views (' + p_return.v_data.length + ')');

            node.tag.num_tables = p_return.v_data.length;

            for (var i = 0; i < p_return.v_data.length; i++) {
                var v_node = node.createChildNode(
                    p_return.v_data[i].v_name,
                    false,
                    'fas node-all fa-eye node-view',
                    {
                        type: 'view',
                        database: v_connTabControl.selectedTab.tag.selectedDatabase
                    },
                    'cm_视图',
                    null,
                    false
                );

                v_node.createChildNode(
                    '',
                    false,
                    'node-spin',
                    {
                        type: 'view_field'
                    },
                    null,
                    null,
                    false
                );
            }

            node.drawChildNodes();

            afterNodeOpenedCallbackSqlite(node);
        },
        function(p_return) {
            nodeOpenError(p_return, node);
        },
        'box',
        false
    );
}

/// <summary>
/// Retrieving View Columns.
/// </summary>
/// <param name="node">Node object.</param>
function getViewsColumnsSqlite(node) {
    node.removeChildNodes();

    node.createChildNode(
        '',
        false,
        'node-spin',
        null,
        null
    );

    execAjax(
        '/get_views_columns_sqlite/',
        JSON.stringify({
            p_database_index: v_connTabControl.selectedTab.tag.selectedDatabaseIndex,
            p_tab_id: v_connTabControl.selectedTab.id,
            p_table: node.text
        }),
        function(p_return) {
            if (node.childNodes.length > 0) {
                node.removeChildNodes();
            }

            var v_list = node.createChildNode(
                'Columns (' + p_return.v_data.length +')',
                false,
                'fas node-all fa-columns node-column',
                {
                    database: v_connTabControl.selectedTab.tag.selectedDatabase
                },
                null,
                null,
                false
            );

            for (var i = 0; i < p_return.v_data.length; i++) {
                var v_node = v_list.createChildNode(
                    p_return.v_data[i].v_column_name,
                    false,
                    'fas node-all fa-columns node-column',
                    {
                        type: 'table_field',
                        database: v_connTabControl.selectedTab.tag.selectedDatabase
                    },
                    null,
                    null,
                    false
                );

                v_node.createChildNode(
                    'Type: ' + p_return.v_data[i].v_data_type,
                    false,
                    'fas node-all fa-ellipsis-h node-bullet',
                    {
                        database: v_connTabControl.selectedTab.tag.selectedDatabase
                    },
                    null,
                    null,
                    false
                );
            }

            if (node.tag.has_rules) {
                var v_node = node.createChildNode(
                    'Rules',
                    false,
                    'fas node-all fa-lightbulb node-rule',
                    {
                        type: 'rule_list',
                        database: v_connTabControl.selectedTab.tag.selectedDatabase
                    },
                    'cm_规则',
                    null,
                    false
                );

                v_node.createChildNode(
                    '',
                    false,
                    'node-spin',
                    null,
                    null,
                    null,
                    false
                );
            }

            if (node.tag.has_triggers) {
                var v_node = node.createChildNode(
                    'Triggers',
                    false,
                    'fas node-all fa-bolt node-trigger',
                    {
                        type: 'trigger_list',
                        database: v_connTabControl.selectedTab.tag.selectedDatabase
                    },
                    'cm_视图触发器',
                    null,
                    false
                );

                v_node.createChildNode(
                    '',
                    false,
                    'node-spin',
                    null,
                    null,
                    null,
                    false
                );
            }

            node.drawChildNodes();

            afterNodeOpenedCallbackSqlite(node);
        },
        function(p_return) {
            nodeOpenError(p_return, node);
        },
        'box',
        false
    );
}

/// <summary>
/// Retrieving view definition.
/// </summary>
/// <param name="node">Node object.</param>
function getViewDefinitionSqlite(node) {
    execAjax('/get_view_definition_sqlite/',
        JSON.stringify({
            'p_database_index': v_connTabControl.selectedTab.tag.selectedDatabaseIndex,
            'p_tab_id': v_connTabControl.selectedTab.id,
            'p_view': node.text
        }),
        function(p_return) {
            v_connTabControl.selectedTab.tag.tabControl.selectedTab.tag.editor.setValue(p_return.v_data);
            v_connTabControl.selectedTab.tag.tabControl.selectedTab.tag.editor.clearSelection();
            v_connTabControl.selectedTab.tag.tabControl.selectedTab.tag.editor.gotoLine(0, 0, true);
            //v_connTabControl.selectedTab.tag.tabControl.selectedTab.renameTab(node.text);
            renameTabConfirm(v_connTabControl.selectedTab.tag.tabControl.selectedTab, node.text);

            var v_div_result = v_connTabControl.selectedTab.tag.tabControl.selectedTab.tag.div_result;

            if (v_connTabControl.selectedTab.tag.tabControl.selectedTab.tag.ht != null) {
                v_connTabControl.selectedTab.tag.tabControl.selectedTab.tag.ht.destroy();
                v_connTabControl.selectedTab.tag.tabControl.selectedTab.tag.ht = null;
            }

            v_div_result.innerHTML = '';
        },
        function(p_return) {
            nodeOpenError(p_return, node);
        },
        'box',
        true
    );
}

/// <summary>
/// Retrieving Triggers.
/// </summary>
/// <param name="node">Node object.</param>
function getTriggersSqlite(node) {
    node.removeChildNodes();

    node.createChildNode(
        '',
        false,
        'node-spin',
        null,
        null
    );

    execAjax(
        '/get_triggers_sqlite/',
        JSON.stringify({
            'p_database_index': v_connTabControl.selectedTab.tag.selectedDatabaseIndex,
            'p_tab_id': v_connTabControl.selectedTab.id,
            'p_table': node.parent.text
        }),
        function(p_return) {
            node.setText('Triggers (' + p_return.v_data.length + ')');

            if (node.childNodes.length > 0) {
                node.removeChildNodes();
            }

            for (var i = 0; i < p_return.v_data.length; i++) {
                var v_node = node.createChildNode(
                    p_return.v_data[i].v_name,
                    false,
                    'fas node-all fa-bolt node-trigger',
                    {
                        type: 'trigger',
                        database: v_connTabControl.selectedTab.tag.selectedDatabase
                    },
                    'cm_触发器',
                    null,
                    true
                );
            }

            node.drawChildNodes();

            afterNodeOpenedCallbackSqlite(node);
        },
        function(p_return) {
            nodeOpenError(p_return, node);
        },
        'box',
        false
    );
}

/// <summary>
/// Retrieving SELECT SQL template.
/// </summary>
function TemplateSelectSqlite(p_table, p_kind) {
    execAjax(
        '/template_select_sqlite/',
        JSON.stringify({
            'p_database_index': v_connTabControl.selectedTab.tag.selectedDatabaseIndex,
            'p_tab_id': v_connTabControl.selectedTab.id,
            'p_table': p_table,
            'p_kind': p_kind
        }),
        function(p_return) {
            let v_tab_name = p_table;
            v_connTabControl.tag.createQueryTab(v_tab_name);

            var v_tab_tag = v_connTabControl.selectedTab.tag.tabControl.selectedTab.tag;
            v_tab_tag.editor.setValue(p_return.v_data.v_template);
            v_tab_tag.editor.clearSelection();

            querySQL(0);
        },
        function(p_return) {
            showError(p_return.v_data);
            return '';
        },
        'box',
        true
    );
}

/// <summary>
/// Retrieving INSERT SQL template.
/// </summary>
function TemplateInsertSqlite(p_table) {
    execAjax(
        '/template_insert_sqlite/',
        JSON.stringify({
            'p_database_index': v_connTabControl.selectedTab.tag.selectedDatabaseIndex,
            'p_tab_id': v_connTabControl.selectedTab.id,
            'p_table': p_table
        }),
        function(p_return) {
          tabSQLTemplate(
              'Insert ' + p_table,
              p_return.v_data.v_template
          );
        },
        function(p_return) {
            showError(p_return.v_data);
            return '';
        },
        'box',
        true
    );
}

/// <summary>
/// Retrieving UPDATE SQL template.
/// </summary>
function TemplateUpdateSqlite(p_table) {
    execAjax(
        '/template_update_sqlite/',
        JSON.stringify({
            'p_database_index': v_connTabControl.selectedTab.tag.selectedDatabaseIndex,
            'p_tab_id': v_connTabControl.selectedTab.id,
            'p_table': p_table
        }),
        function(p_return) {
          tabSQLTemplate(
              'Update ' + p_table,
              p_return.v_data.v_template
          );
        },
        function(p_return) {
            showError(p_return.v_data);
            return '';
        },
        'box',
        true
    );
}

/// <summary>
/// Retrieving properties.
/// </summary>
/// <param name="node">Node object.</param>
function getPropertiesSqlite(node) {
    if (node.tag != undefined) {
        if (node.tag.type == 'table') {
            getProperties('/get_properties_sqlite/', {
                p_table: null,
                p_object: node.text,
                p_type: node.tag.type
            });
        } else if (node.tag.type == 'table_field') {
            getProperties('/get_properties_sqlite/', {
                p_table: node.parent.parent.text,
                p_object: node.text,
                p_type: node.tag.type
            });
        } else if (node.tag.type == 'view') {
            getProperties('/get_properties_sqlite/', {
                p_table: null,
                p_object: node.text,
                p_type: node.tag.type
            });
        } else if (node.tag.type == 'trigger') {
            getProperties('/get_properties_sqlite/', {
                p_table: node.parent.parent.text,
                p_object: node.text,
                p_type: node.tag.type
            });
        } else if (node.tag.type == 'index') {
            getProperties('/get_properties_sqlite/', {
                p_table: node.parent.parent.text,
                p_object: node.text.replace(' (Non Unique)', '').replace(' (Unique)', ''),
                p_type: node.tag.type
            });
        } else if (node.tag.type == 'pk') {
            getProperties('/get_properties_sqlite/', {
                p_table: node.parent.parent.text,
                p_object: node.text,
                p_type: node.tag.type
            });
        } else if (node.tag.type == 'foreign_key') {
            getProperties('/get_properties_sqlite/', {
                p_table: node.parent.parent.text,
                p_object: node.text,
                p_type: node.tag.type
            });
        } else if (node.tag.type == 'unique') {
            getProperties('/get_properties_sqlite/', {
                p_table: node.parent.parent.text,
                p_object: node.text,
                p_type: node.tag.type
            });
        } else {
            clearProperties();
        }
    }

    //Hooks
    if (v_connTabControl.tag.hooks.sqliteTreeNodeClick.length>0) {
      for (var i=0; i<v_connTabControl.tag.hooks.sqliteTreeNodeClick.length; i++)
        v_connTabControl.tag.hooks.sqliteTreeNodeClick[i](node);
    }
}
