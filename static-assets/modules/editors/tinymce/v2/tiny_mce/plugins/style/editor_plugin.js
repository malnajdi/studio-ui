(function(){tinymce2.create("tinymce2.plugins.StylePlugin",{init:function(a,b){a.addCommand("mceStyleProps",function(){var c=false;var f=a.selection.getSelectedBlocks();var d=[];if(f.length===1){d.push(a.selection.getNode().style.cssText)}else{tinymce2.each(f,function(g){d.push(a.dom.getAttrib(g,"style"))});c=true}a.windowManager.open({file:b+"/props.htm",width:480+parseInt(a.getLang("style.delta_width",0)),height:340+parseInt(a.getLang("style.delta_height",0)),inline:1},{applyStyleToBlocks:c,plugin_url:b,styles:d})});a.addCommand("mceSetElementStyle",function(d,c){if(e=a.selection.getNode()){a.dom.setAttrib(e,"style",c);a.execCommand("mceRepaint")}});a.onNodeChange.add(function(d,c,f){c.setDisabled("styleprops",f.nodeName==="BODY")});a.addButton("styleprops",{title:"style.desc",cmd:"mceStyleProps"})},getInfo:function(){return{longname:"Style",author:"Moxiecode Systems AB",authorurl:"http://tinymce2.moxiecode.com",infourl:"http://wiki.moxiecode.com/index.php/tinymce2:Plugins/style",version:tinymce2.majorVersion+"."+tinymce2.minorVersion}}});tinymce2.PluginManager.add("style",tinymce2.plugins.StylePlugin)})();