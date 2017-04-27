$(function(){
	init()
	initGuestLabel($('#guestLabel_top'),guest_label_color,'transparent');// 初始化用户颜色标签控
	var labelList=$('#guestLabel_top').find('.guestLabelList');
	var lis=labelList.find('li');
	lis.click(function(){
		initSuppliers(dtd)
// $('#tagidts').val($(this).attr("data-bgclr"));
// console.log('颜色值',$('#tagidts').val());
	})
	
	$("span[name=search_count]").on("click",function(){
		initSizeCount($(this))
	
	})
})

var searchArgs = {
	serachKey: "",
	tagName:  "",
	accountId: "",
	levelId:  "",
	groupId:  "",
	pageSize: 10,
	pageOffset: 0
}
var pageNum = 1
var suppliers;
var label_color = []
var dtd = $.Deferred();
var pageTotal
function init(){
	initSuppliers(dtd)
	$.when(initSuppliers(dtd)).done(function(){
		setCommonPage2Event($('.im_pageBg'),pageTotal,function(num){
			pageNum = num
			searchArgs.pageOffset = (num-1)*searchArgs.pageSize 
			initSuppliers(dtd)
		})
	})
	initProperty()
}

function searchChange(){
	initSuppliers(dtd)
	$.when(initSuppliers(dtd)).done(function(){
		setCommonPage2Event($('.im_pageBg'),pageTotal,function(num){
			pageNum = num
			searchArgs.pageOffset = (num-1)*searchArgs.pageSize 
			initSuppliers(dtd)
		})
	})
}

function initSuppliers(dtd){
	searchArgs.accountId = $("#account_select").val()
	searchArgs.levelId = $("#level_select").val()
	searchArgs.groupId = $("#group_select").val()
	searchArgs.tagName = $("#guestLabel_top").css("background-color")
	searchArgs.serachKey = $("#search_key").val()
	console.log(searchArgs)
	$.ajax({
		type:'post',
		url:'/supplierManager/searchSuppliers/',
		dataType:'json',
		data:searchArgs,
		success:function(rs){
				$(".rControlLine .orange").text("("+rs.totalcount+")")
				suppliers = rs.rows
				$(".im_table").empty()
				var tb = '<thead><tr>'+
	       			'<th width="45">序号</th>'+
	       			'<th width="70">标签</th>'+
	       			'<th width="230">名称</th>'+
	       			'<th width="230">优势航线</th>'+
	       			'<th width="190">联系人</th>'+
	       			'<th width="125">账期</th>'+
	       			'<th width="100">级别</th>'+
	       			'<th width="113">群组</th>'+
	       			'<th width="130">操作</th>'+
	       		'</tr><thead><tr style="height:10px;border:0;"></tr>'
	       			
	       		for(var i in rs.rows){
	       			var sequence = searchArgs.pageOffset*(pageNum-1)+(parseInt(i)+parseInt(1))
	       			var persons =  rs.rows[i].persons
	       			var routes =  rs.rows[i].routes
	       			tb += '<tbody><tr>'+
		       			'<td>'+sequence+'</td>'+
		       			'<td><div class="labelDiv" style="background:'+rs.rows[i].tagName+';"></div></td>'+
		       			'<td style="text-align:left;text-indent:12px;"><span class="blue hand" onClick="guestDetailsDlgShow('+rs.rows[i].id+')">'+rs.rows[i].companyName+'</span></td>'+
		       			'<td  style="text-align:left;text-indent:12px;">'
		       			
		       			for(var k in routes){
		       				// console.log($.parseJSON(persons[j]))
		       				tb += '<span>'+routes[k]+', </span>'
		       			}
		       			
	       				tb += '</td><td style="text-align:left;text-indent:12px;">'
		       			
		       			for(var j in persons){
		       				// console.log($.parseJSON(persons[j]))
		       				tb += '<span class="blue hand" onClick="linkmanDetails('+"'"+persons[j].personName+"'"+','+"'"+persons[j].phone+"'"+','+"'"+persons[j].email+"'"+','+"'"+persons[j].qq+"'"+')">'+persons[j].personName+', '+'</span>'
		       			}
		       				
		       			tb += '</td>'+
		       				  '<td>' + rs.rows[i].accountName + '</td>'+
		       			      '<td>' + rs.rows[i].levelName + '</td>'+
		       			      '<td>' + rs.rows[i].groupName + '</td>'+
		       			      '<td>'+
		       				'<div class="operBtn guest" onClick="addLinkmanDlgShow('+rs.rows[i].id+')" title="添加联系人"></div>'+
		       				'<div class="operBtn edit" onClick="editGuestDlgShow('+rs.rows[i].id+')" title="编辑"></div>'+
		       				'<div class="operBtn delete" title="删除"></div>'+
						'</td></tr>'
	       		}	
	       			
				// init(rs,1,pageSize)
				$(".im_table").append(tb)
				
				pageTotal = rs.totalcount % searchArgs.pageSize > 0 ? Math.floor(rs.totalcount / searchArgs.pageSize) + 1 :  rs.totalcount / searchArgs.pageSize
				// initTotalPage(pageTotal)
//				if(isNaN(pageTotal)){
//					pageTotal = 1
//				}		
				dtd.resolve()
				
			},
			error:function(XMLHttpRequest, textStatus, errorThrown){
				console.log(XMLHttpRequest)
				console.log(textStatus)
				console.log(errorThrown)
			}
		})
		return dtd
	}

var properties = {
		demands: [],
		types: [],
		groups: [],
		tags: []
}

function initProperty(){
		$.post("/supplierAttrManager/getTags",function(data){
				properties.tags =  data.rows
		})
		$.post("/supplierAttrManager/getAccounts",function(data){
			properties.accounts =  data.rows
			var account_data = "<option>全部</option>"
				for(var i in data.rows){
					account_data += '<option value="'+data.rows[i].id+'">'+data.rows[i].accountName+'</option>'
				}
				$("#account_select").html(account_data)
		})
		$.post("/supplierAttrManager/getLevels",function(data){
			properties.levels =  data.rows
			var level_data = "<option>全部</option>"
				for(var i in data.rows){
					level_data += '<option value="'+data.rows[i].id+'">'+data.rows[i].levelName+'</option>'
				}
				$("#level_select").html(level_data)
			
		})
		$.post("/supplierAttrManager/getGroups",function(data){
			properties.groups =  data.rows
			var group_data = "<option>全部</option>"
				for(var i in data.rows){
					group_data += '<option value="'+data.rows[i].id+'">'+data.rows[i].groupName+'</option>'
				}
			$("#group_select").html(group_data)
		})
}

// 客户导入
function importGuestShow(){
	var doHtml=
'<div class="winModBg0">'+
	'<div class="winModBg wEditMod importDlg">'+
    	'<div class="titleBg">'+
        	'<div class="caption">导入客户</div>'+
            '<div class="closeBtn">X</div>'+
        '</div>'+
    	'<ul class="editList">'+
        	'<li><div class="wLabel iLabel">步骤一：<div class="imp"></div></div></li>'+
            '<li>'+
            	'<div class="wLabel">模板：<div class="imp"></div></div>'+
                '<div class="btnMod2"><a href="/supplierManager/downloadExample">点击下载模板</a></div>'+
            '</li>'+
            '<li>'+
            	'<div class="tishi1 modTishiBg">'+
                	'<div class="modTishiTxt">下载最新的Excel导入模版文件</div>'+
                    '<div class="modTishiTxt">保存至本地文件夹</div>'+
                '</div>'+
            '</li>'+
            '<li><div class="wLabel iLabel">步骤二：<div class="imp"></div></div></li>'+
            '<li>'+
            	'<div class="wLabel">上传：<div class="imp"></div></div>'+
                '<div id="guestModUploadBtn" class="btnMod2">点击上传文件</div>'+
                '<input id="guestModUploadFile" type="file" style="display:none;"  name="xls"/>'+
                '<div class="guestModFileData">'+
                    '<div class="fileName"></div>'+
                    '<div class="fileDel">删除</div>'+
                '</div>'+
            '</li>'+
            '<li>'+
            	'<div class="tishi1 modTishiBg">'+
                	'<div class="modTishiTxt">确认是否为最新的客户导入模版，若不是，请重新在步骤一中下载；</div>'+
                    '<div class="modTishiTxt">仅支持Excel文件格式,建议使用97-2003版本；</div>'+
                    '<div class="modTishiTxt">文件不能大于1M（1024K）；</div>'+
                    '<div class="modTishiTxt">一次性导入的客户数量不要超过200条；</div>'+
                    '<div class="modTishiTxt">注意表格中的必填项和格式</div>'+
                '</div>'+
            '</li>'+
            '<li>'+
            	'<div class="bottomBtns">'+
                	'<div id="importDlg_importBtn" class="btnMod1">导入</div>'+
                '</div>'+
            '</li>'+
        '</ul>'+
    '</div>'+
'</div>';
	$('body').append($(doHtml));
	
	modDlgEvent($('.importDlg'));// 自制弹出框公用事件
	
	// 上传文件相关事件
	$('#guestModUploadBtn').click(function(){
		$('#guestModUploadFile').trigger('click');
	})
	$('#guestModUploadFile').change(function(){
		$('#guestModUploadBtn').hide();
		$('.guestModFileData').show();
		var fileRoad=$(this).val().split('\\');
		var fileName=fileRoad[fileRoad.length-1];
		$('.guestModFileData .fileName').html(fileName);
	})
	$('.guestModFileData .fileDel').click(function(){
		$('#guestModUploadBtn').show();
		$('.guestModFileData').hide();
		$('#guestModUploadFile').val('');
	})
	// 上传文件相关事件 end
	// 导入按钮点击
	$('#importDlg_importBtn').click(function(){
		//$('#guestModUploadFile').files[0]
		if($('#guestModUploadFile').val()==''){
			zcAlert('请选择导入文件');
		}else{						  
			var url="/supplierManager/importSuppliers";
			   $.ajaxFileUpload(
				        {
				            url: url,
				            secureuri: false,//是否启用安全提交
				            fileElementId: "guestModUploadFile",
				            dataType: 'JSON',
				            success:function(data)
				            {
				            	var data = data.replace("<pre>","").replace("</pre>","")
				            	data = $.parseJSON(data)
				            	console.log(data)
				            	if(data.result == false){
				            		importErrorShow(data.errors);
				            	}
							},error(){
								console.log("2222222222")
							}
					      });
			// 客户导入错误提示
		}
	})
}
// 客户导入错误提示
function importErrorShow(data){
	console.log(data)
	var doHtml=
'<div class="winModBg0" style="z-index:1001;">'+
	'<div class="winModBg wEditMod importErrorDlg">'+
    	'<div class="titleBg">'+
        	'<div class="caption">客户导入错误提示</div>'+
            '<div class="closeBtn">X</div>'+
        '</div>'+
    	'<div class="errorListBg">'+
        	'<ul class="errorList">'+
            	'<li class="eHeader">'+
                	'<div class="eIndex">行数</div>'+
                    '<div>公司名称</div>'+
                    '<div>公司地址</div>'+
                    '<div>邮编</div>'+
                    '<div>办公电话</div>'+
                    '<div>传真</div>'+
                    '<div>邮箱</div>'+
                    '<div>联系人</div>'+
                '</li>'
                for(var i in data){
                	doHtml += '<li name="error_data">'+
                		'<div class="eIndex">'+data[i].sequence+'</div>'+
                        '<div><span class="green" title="'+(data[i].companyName||'-')+'">'+(data[i].companyName||'-')+'</span></div>'+
                        '<div><span class="red" title="'+(data[i].address||'-')+'">'+(data[i].address||'-')+'</span></div>'+
                        '<div><span class="green" title="'+(data[i].postCode||'-')+'" >'+(data[i].postCode||'-')+'</span></div>'+
                        '<div><span class="green" title="'+(data[i].phone||'-')+'" >'+(data[i].phone||'-')+'</span></div>'+
                        '<div><span class="green" title="'+(data[i].faxes||'-')+'" >'+(data[i].faxes||'-')+'</span></div>'+
                        '<div><span class="red" title="'+(data[i].email||'-')+'">'+(data[i].email||'-')+'</span></div>'+
                        '<div><span class="green" title="'+(data[i].persons||'-')+'">'+(data[i].persons||'-')+'</span></div>'+
                        '</li>'
                }
                
	   doHtml += '</ul>'+
        '</div>'+
        '<div class="eTishi modTishiBg">'+
        	'<div class="modTishiTxt">行数代表的是批量导入的Excel文件中的对应行数；</div>'+
            '<div class="modTishiTxt">错误数据给出相应提示：必填项未填写，给出“<span class="red">无数据</span>”提示；数据内容格式错，给出“<span class="red">格式错</span>“，例如，应该是日期格式，填写的是文本格式。应该是数字格式填写的是其他格式”</div>'+
            '<div class="modTishiTxt">正确数据给出“<span class="green">-</span>”提示</div>'+
        '</div>'+
        '<div id="importErrorClose" class="eBtn btnMod1">关闭</div>'+
    '</div>'+
'</div>';
	$('body').append(doHtml);
	
	var spans =  $("li[name=error_data] div span")
	for(var i in spans){
		if(spans.eq(i).text() == "-"){
			spans.eq(i).css("color","#00cc00")
		}else{
			spans.eq(i).css("color","#f00")
		}
	}
	
	
	modDlgEvent($('.importErrorDlg'));// 自制弹出框公用事件
	$('#importErrorClose').click(function(){
		$('.importErrorDlg .closeBtn').trigger('click');
	})
}
// 添加客户
function addGuestDlgShow(){
	var doHtml=
'<div class="winModBg0">'+
	'<div class="winModBg wEditMod addGuestDlg">'+
    	'<div class="titleBg">'+
        	'<div class="caption">添加客户</div>'+
            '<div class="closeBtn">X</div>'+
        '</div>'+
        '<form id="supplier_data" >'+
        '<ul class="editList" style="position:relative;">'+
        	'<li>'+
            	'<div class="wLabel">公司名称：<div class="imp">*</div></div>'+
                '<input type="text" class="box1" style="width:390px;" name="companyName" id="companyName"/>'+
            '</li>'+
            '<li>'+
            	'<div class="wLabel">公司地址：<div class="imp"></div></div>'+
                '<input type="text" class="box1" style="width:390px;" name="address" id="address"/>'+
            '</li>'+
            '<li>'+
            	'<div class="wLabel">邮编：<div class="imp"></div></div>'+
                '<input type="text" class="box1" name="postCode"  id="email" />'+
            '</li>'+
            '<li>'+
            	'<div class="wLabel">办公电话：<div class="imp"></div></div>'+
                '<input type="text" class="box1" name="phone" id="phone" />'+
            '</li>'+
            '<li>'+
            	'<div class="wLabel">传真：<div class="imp"></div></div>'+
                '<input type="text" class="box1" id="faxes" name="faxes"/>'+
            '</li>'+
            '<li>'+
            	'<div class="wLabel">账期：<div class="imp"></div></div>'+
                '<select class="select1" id="account_select_t">'+
                '</select>'+
                '<div id="addGuest_addNeed" class="addBtn1 blueBtn">添加账期</div>'+
            '</li>'+
            '<li>'+
            	'<div class="wLabel">级别：<div class="imp"></div></div>'+
                '<select class="select1" id="level_select_t">'+
                '</select>'+
                '<div id="addGuest_addType" class="addBtn1 blueBtn">添加级别</div>'+
            '</li>'+
            '<li>'+
            	'<div class="wLabel">群组：<div class="imp"></div></div>'+
                '<select class="select1" id="group_select_t">'+
                '</select>'+
                '<div id="addGuest_addGroup" class="addBtn1 blueBtn">添加群组</div>'+
            '</li>'+
            '<li>'+
            	'<div class="wLabel">标签：<div class="imp"></div></div>'+
                '<div id="editGuestLabel" class="guestLabel">'+
                    '<span>选择标签颜色</span>'+
                    '<ul class="guestLabelList">'+
                        '<li></li><li></li><li></li>'+
                        '<li></li><li></li><li></li>'+
                        '<li></li><li></li><li></li>'+
                    '</ul>'+
                '</div>'+
                '<div id="addGuest_addLabel" class="addBtn1 blueBtn">添加标签</div>'+
            '</li>'+
        	'<li>'+
        		'<div class="wLabel">覆盖航线：<div class="imp"></div></div>'+
        		'<div class="shipLineBg">'+
				'<ul class="lineList" id="routeList" >'+
				'</ul>'+
				'<div id="shipLineAdd" class="b_btn">+</div>'+
				'</div>'+
            '</li>'+
			'<li><input type="hidden" value=1 name="count_person"/>'+
			'<div class="wLabel linkManMark">联系人 1：<div class="imp">*</div></div>'+
				'<input type="text" class="box1" id="linkman_name_1" name="linkman_name_1"/>'+
				'<input  id="linkman_tagName_1" type="hidden" value="联系人 1" name="linkman_tagName_1"/>'+
			'</li>'+
			'<li>'+
				'<div class="wLabel">手机号：<div class="imp"></div></div>'+
				'<input type="text" class="box1" id="linkman_phone_1" name="linkman_phone_1" />'+
			'</li>'+
			'<li>'+
				'<div class="wLabel">邮箱：<div class="imp"></div></div>'+
				'<input type="text" class="box1" id="linkman_email_1" name="linkman_email_1" />'+
			'</li>'+
			'<li>'+
				'<div class="wLabel">QQ：<div class="imp"></div></div>'+
				'<input type="text" class="box1" id="linkman_qq_1" name="linkman_qq_1" />'+
			'</li>'+
			'<li>'+
            	'<div class="bottomBtns">'+
                	'<div id="addLinkman" class="blueBtn">添加联系人</div>'+
                '</div>'+
            '</li>'+
            '<li>'+
            	'<div class="bottomBtns">'+
                	'<div id="addGuestResetBtn" class="btnMod1">重置</div>'+
                    '<div id="addGuestNoBtn" class="btnMod1">取消</div>'+
                    '<div id="addGuestYesBtn" class="btnMod1">确定</div>'+
                '</div>'+
            '</li>'+
            '<div class="shipLinesBg">'+
        	'<ul class="linesList" id="hideLines">'+
    			'<li><input type="checkbox" /><span>中东印巴红海线</span><input type="hidden" value="中东印巴红海线"/></li>'+
    			'<li><input type="checkbox" /><span>中美加勒比海墨西哥线</span><input type="hidden" value="中美加勒比海墨西哥线"/></li>'+
    			'<li><input type="checkbox" /><span>欧洲线</span><input type="hidden" value="欧洲线"/></li>'+
    			'<li><input type="checkbox" /><span>非洲线</span><input type="hidden" value="非洲线"/></li>'+
    			'<li><input type="checkbox" /><span>南美线</span><input type="hidden" value="南美线"/></li>'+
    			'<li><input type="checkbox" /><span>澳新太平洋群岛线</span><input type="hidden" value="澳新太平洋群岛线"/></li>'+
    			'<li><input type="checkbox" /><span>北美线</span><input type="hidden" value="北美线"/></li>'+
    			'<li><input type="checkbox" /><span>中亚俄罗斯线</span><input type="hidden" value="中亚俄罗斯线"/></li>'+
    			'<li><input type="checkbox" /><span>地中海黑海线</span><input type="hidden" value="地中海黑海线"/></li>'+
    			'<li><input type="checkbox" /><span>东南亚日韩台湾线</span><input type="hidden" value="东南亚日韩台湾线"/></li>'+
    			'<li><input type="checkbox" /><span>其他</span><input type="hidden" value="其他"/></li>'+
    		'</ul>'+
	        '<div class="btnsBg" style="">'+
	        	'<div id="shipLinesAllCheck" class="btnMod1">全选</div>'+
	        	'<div id="shipLinesAllUnCheck" class="btnMod1">取消选择</div>'+
	        	'<div id="shipLinesAllOk" class="btnMod1">确定</div>'+
	        	'<div id="shipLinesAllClose" class="btnMod1">关闭</div>'+
	        '</div>'+
	    '</div>'+
        '</ul>'+
        '</form>'+
    '</div>'+
'</div>';
	$('body').append($(doHtml));
	
	
	var account_data = "<option>未分类</option>"
	for(var i in properties.accounts){
		account_data += '<option value="'+properties.accounts[i].id+'">'+properties.accounts[i].accountName+'</option>'
		}
	$("#account_select_t").html(account_data)
	
	var level_data = "<option>未分类</option>"
	for(var i in properties.levels){
		level_data += '<option value="'+properties.levels[i].id+'">'+properties.levels[i].levelName+'</option>'
		}
	$("#level_select_t").html(level_data)
		
	var group_data = "<option>未分类</option>"
	for(var i in properties.groups){
			group_data += '<option value="'+properties.groups[i].id+'">'+properties.groups[i].groupName+'</option>'
		}
	$("#group_select_t").html(group_data)
	
	modDlgEvent($('.addGuestDlg'));// 自制弹出框公用事件 居中_拖拽_关闭
	// 右上角关闭按钮和取消
	$('#addGuestNoBtn').on('click',function(){
		$('.addGuestDlg .closeBtn').trigger('click');
	});
	// 重置按钮
	$('#addGuestResetBtn').click(function(){
		winReset();
	})
	
	
	$("#addGuestYesBtn").click(function(){
		// $(this).parents().find("input[type=hidden]").val()
		var lis =  $("#routeList").children("li")
		    var routes = []
		    for(var i=0 , l=lis.length; i < l ; i++){
		    	routes.push(lis.eq(i).children().eq(0).text())
		    }
		var accountId =  $("#account_select_t").val()
		var levelId =  $("#level_select_t").val()
		var groupId =  $("#group_select_t").val()
		var tagName	= $("#editGuestLabel").css("background-color")
						
		save_client_url = "/supplierManager/saveSupplier?accountId="+accountId+"&levelId="+levelId+"&groupId="+groupId+"&tagName="+tagName+"&routes="+routes
       	
		$.ajax({
       		 cache: true,
      	     type: "POST",
        	 url:save_client_url,
        	 data:$('#supplier_data').serialize(),// 你的formid
             async: false,
             success: function(data) {
            	 $('.addGuestDlg .closeBtn').trigger('click');
            	 if(data == "true"){
            		 zcAlert("保存成功")
            	 }else{
            		 zcAlert("保存失败")	
            	 }
            	 init()
             },
             error: function(request) {
           		 alert("Connection error");
      	  	}
		
       	})
	})
	// 颜色标签
	var lable_color = []
	for(var i in properties.tags){
		lable_color.push(properties.tags[i].tagName)
	}
	initGuestLabel($('#editGuestLabel'),lable_color,'transparent');// 初始化用户颜色标签控件
																	// common.js中定义
	// 添加业务需求、添加类型、添加群组、添加标签
	$('#addGuest_addNeed').click(function(){
		addNeedShow($(this));// 添加业务需求
	})
	$('#addGuest_addType').click(function(){
		addTypeShow($(this));// 添加类型
	})
	$('#addGuest_addGroup').click(function(){
		addGroupShow($(this));// 添加群组
	})
	$('#addGuest_addLabel').click(function(){
		addLabelShow();// 添加标签
	})
	// 添加联系人
	$('#addLinkman').click(function(){
		var haveNum=$('.linkManMark').length;
		var index=haveNum+1;
		if(index>5){
			zcAlert('联系人最多5个');
			return;
		}
		//var indexWord=['','一','二','三','四','五'];
		var linkmanHtml=
		'<li>'+
			'<div class="wLabel linkManMark">联系人'+ index+'：<div class="imp">*</div></div>'+
			'<input type="text" class="box1" id="linkman_name_'+index+'" name="linkman_name_'+index+'" />'+
			'<input type="hidden"  id="linkman_tagName_'+index+'"  value="联系人'+ index+'" name="linkman_tagName_'+index+'" />'+
		'</li>'+
		'<li>'+
			'<div class="wLabel">手机号：<div class="imp"></div></div>'+
			'<input type="text" class="box1" id="linkman_phone_'+index+'" name="linkman_phone_'+index+'" />'+
		'</li>'+
		'<li>'+
			'<div class="wLabel">邮箱：<div class="imp"></div></div>'+
			'<input type="text" class="box1" id="linkman_mail_'+index+'" name="linkman_mail_'+index+'" />'+
		'</li>'+
		'<li>'+
			'<div class="wLabel">QQ：<div class="imp"></div></div>'+
			'<input type="text" class="box1" id="linkman_qq_'+index+'" name="linkman_qq_'+index+'" />'+
		'</li>';
		$(linkmanHtml).insertBefore($(this).parents('li'));
		$('.addGuestDlg .editList').get(0).scrollTop = $('.addGuestDlg .editList').get(0).scrollHeight;
		var count = $(this).parents().find("input[name=count_person]").val()
		$(this).parents().find("input[name=count_person]").val(parseInt(count)+1)
	})
	// 重置
	function winReset(){
		$('.addGuestDlg').parent().remove();
		addGuestDlgShow();
	}
	
	shipLineEvent()
}
// 客户详情
function guestDetailsDlgShow(id){
	var doHtml
	for(var i in suppliers){
		if(id == suppliers[i].id){
			 doHtml=
				'<div class="winModBg0">'+
					'<div class="winModBg wEditMod guestDetailsDlg">'+
				    	'<div class="titleBg">'+
				        	'<div class="caption">客户详情</div>'+
				            '<div class="closeBtn">X</div>'+
				        '</div>'+
				        '<ul class="editList" >'+
				        	'<li>'+
				            	'<div class="wLabel">公司名称：<div class="imp"></div></div>'+
				                '<div class="txt1" >'+suppliers[i].companyName+'</div>'+
				            '</li>'+
				            '<li>'+
				            	'<div class="wLabel">公司地址：<div class="imp"></div></div>'+
				                '<div class="txt1" >'+suppliers[i].address+'</div>'+
				            '</li>'+
				            '<li>'+
				            	'<div class="wLabel">邮编：<div class="imp"></div></div>'+
				                '<div class="txt1" >'+suppliers[i].postCode+'</div>'+
				            '</li>'+
				            '<li>'+
				            	'<div class="wLabel">办公电话：<div class="imp"></div></div>'+
				                '<div class="txt1" >'+suppliers[i].telephone+'</div>'+
				            '</li>'+
				            '<li>'+
				            	'<div class="wLabel">传真：<div class="imp"></div></div>'+
				                '<div class="txt1" >'+suppliers[i].faxes+'</div>'+
				            '</li>'+
				            '<li>'+
				            	'<div class="wLabel">账期：<div class="imp"></div></div>'+
				                '<div class="txt1" >'+suppliers[i].accountName+'</div>'+
				            '</li>'+
				            '<li>'+
				            	'<div class="wLabel">级别：<div class="imp"></div></div>'+
				                '<div class="txt1" >'+suppliers[i].levelName+'</div>'+
				            '</li>'+
				            '<li>'+
				            	'<div class="wLabel">群组：<div class="imp"></div></div>'+
				                '<div class="txt1" >'+suppliers[i].groupName+'</div>'+
				            '</li>'+
				            '<li>'+
				            	'<div class="wLabel">标签：<div class="imp"></div></div>'+
				                '<div class="guestLabel" style="background:'+suppliers[i].tagName+';"></div>'+
				            '</li>'+
				            '<li>'+
			        			'<div class="wLabel">覆盖航线：<div class="imp"></div></div>'+
			        			'<div class="shipLineBg">'+
			        			'<ul class="lineList" id="routeList" >'
			        			
			        			 for(var j in suppliers[i].routes){
						        	  var p = suppliers[i].routes[j]
						        	  doHtml += '<li><div class="lineName">'+p+'</div></li>'
			        			 } 
			        		 	
			 					doHtml +=  '</ul>'+
			        			'</li>'
				                
				          for(var j in suppliers[i].persons){
				        	  var p = suppliers[i].persons[j]
				        	  doHtml += '<li>'+
								'<div class="wLabel linkManMark">'+p.tagName+'：<div class="imp"></div></div>'+
								'<div class="txt1" >'+p.personName+'</div>'+
								'<div class="blueBtn" onClick="linkmanDetails('+"'"+p.personName+"'"+','+"'"+p.phone+"'"+','+"'"+p.email+"'"+','+"'"+p.qq+"'"+')" >详细</div>'+
							'</li>'
				          }      
				                
			 				doHtml += '<li>'+
				            	'<div class="bottomBtns">'+
				                    '<div id="guestDetailsBackBtn" class="btnMod1">返回</div>'+
				                '</div>'+
				            '</li>'+
				        '</ul>'+
				    '</div>'+
				'</div>';
		}
		
	}
	
	$('body').append($(doHtml));
	
	modDlgEvent($('.guestDetailsDlg'));// 自制弹出框公用事件 居中_拖拽_关闭
	
	$('#guestDetailsBackBtn').click(function(){
		$('.guestDetailsDlg .closeBtn').trigger('click');
	})
}
// 编辑客户
function editGuestDlgShow(id){
	var doHtml
	for(var i in suppliers){
		if(id == suppliers[i].id){
			 doHtml=
				 '<div class="winModBg0">'+
				 	'<div class="winModBg wEditMod addGuestDlg">'+
				     	'<div class="titleBg">'+
				         	'<div class="caption">编辑客户</div>'+
				             '<div class="closeBtn">X</div>'+
				         '</div>'+
				         '<form id="supplier_data">'+
				         '<input type="hidden" value="'+suppliers[i].id+'" name="id" >'+
				         '<ul class="editList" style="position:relative;">'+
				         	'<li>'+
				             	'<div class="wLabel">公司名称：<div class="imp">*</div></div>'+
				                 '<input type="text" class="box1" style="width:390px;" value="'+suppliers[i].companyName+'" name="companyName"/>'+
				             '</li>'+
				             '<li>'+
				             	'<div class="wLabel">公司地址：<div class="imp"></div></div>'+
				                 '<input type="text" class="box1" style="width:390px;" value="'+suppliers[i].address+'" name="address"/>'+
				             '</li>'+
				             '<li>'+
				             	'<div class="wLabel">邮编：<div class="imp"></div></div>'+
				                 '<input type="text" class="box1" value="'+suppliers[i].postCode+'" name="email" />'+
				             '</li>'+
				             '<li>'+
				             	'<div class="wLabel">办公电话：<div class="imp"></div></div>'+
				                 '<input type="text" class="box1" value="'+suppliers[i].phone+'" name="telephone"/>'+
				             '</li>'+
				             '<li>'+
				             	'<div class="wLabel">传真：<div class="imp"></div></div>'+
				                 '<input type="text" class="box1" value="'+suppliers[i].faxes+'" name="faxes" />'+
				             '</li>'+
				             '<li>'+
				             	'<div class="wLabel">业务需求：<div class="imp"></div></div>'+
				                 '<select class="select1" id="account_name">'+
				                 '</select>'+
				                 '<div id="addGuest_addNeed" class="addBtn1 blueBtn">添加业务需求</div>'+
				             '</li>'+
				             '<li>'+
				             	'<div class="wLabel">客户类型：<div class="imp"></div></div>'+
				                 '<select class="select1" id="level_name">'+
				                 '</select>'+
				                 '<div id="addGuest_addType" class="addBtn1 blueBtn">添加类型</div>'+
				             '</li>'+
				             '<li>'+
				             	'<div class="wLabel">群组：<div class="imp"></div></div>'+
				                 '<select class="select1" id="group_name">'+
				                 '</select>'+
				                 '<div id="addGuest_addGroup" class="addBtn1 blueBtn">添加群组</div>'+
				             '</li>'+
				             '<li>'+
				             	'<div class="wLabel">标签：<div class="imp"></div></div>'+
				                 '<div id="editGuestLabel" class="guestLabel">'+
				                     '<span>修改标签颜色</span>'+
				                     '<ul class="guestLabelList">'+
				                         '<li></li><li></li><li></li>'+
				                         '<li></li><li></li><li></li>'+
				                         '<li></li><li></li><li></li>'+
				                     '</ul>'+
				                 '</div>'+
				                 '<div id="addGuest_addLabel" class="addBtn1 blueBtn">添加标签</div>'+
				             '</li>'+
				                '<li>'+
				         		'<div class="wLabel">覆盖航线：<div class="imp"></div></div>'+
				         		'<div class="shipLineBg">'+
				 				'<ul class="lineList" id="routeList" >'+
				 				 '</ul>'+
				 				'<div id="shipLineAdd" class="b_btn">+</div>'+
				 				'</div>'+
				             '</li>'
				                 
				                 
				              for(var j in suppliers[i].persons){
					        	  var p = suppliers[i].persons[j]
					        	  doHtml += '<li name="cps">'+
									'<div class="wLabel linkManMark">'+p.tagName+'：<div class="imp"></div></div>'+
									'<input type="text" class="box1" id="linkman_name_1" value="'+p.personName+'" />'+
									'<div class="blueBtn" onClick="editLinkmanDlgShow(event)">详细/编辑</div>'+
									'<input type="hidden" name="linkman_old_'+j+'" value="'+p.personName+','+p.phone+','+p.email+','+p.qq+','+p.tagName+'"/>'+
									'<div class="blueBtn" onclick="delOldPerson(event)" >删除</div>'+
									'</li>'
					          } 
				             
			             doHtml += '<li><input type="hidden" value="'+suppliers[i].persons.length+'" name="count_old_person"/>'+
				             	'<div class="bottomBtns">'+
				                 	'<div id="addLinkman" class="blueBtn">添加联系人</div>'+
				                 '</div>'+
				             '</li>'+
				             '<li>'+
				             	'<div class="bottomBtns">'+
				                     '<div id="editGuestNoBtn" class="btnMod1">取消</div>'+
				                     '<div id="editGuestYesBtn" class="btnMod1">确定</div>'+
				                 '</div>'+
				             '</li>'+
				             '<div class="shipLinesBg">'+
				         	'<ul class="linesList" id="hideLines">'+
				     			'<li><input type="checkbox" /><span>中东印巴红海线</span><input type="hidden" value="中东印巴红海线"/></li>'+
				     			'<li><input type="checkbox" /><span>中美加勒比海墨西哥线</span><input type="hidden" value="中美加勒比海墨西哥线"/></li>'+
				     			'<li><input type="checkbox" /><span>欧洲线</span><input type="hidden" value="欧洲线"/></li>'+
				     			'<li><input type="checkbox" /><span>非洲线</span><input type="hidden" value="非洲线"/></li>'+
				     			'<li><input type="checkbox" /><span>南美线</span><input type="hidden" value="南美线"/></li>'+
				     			'<li><input type="checkbox" /><span>澳新太平洋群岛线</span><input type="hidden" value="澳新太平洋群岛线"/></li>'+
				     			'<li><input type="checkbox" /><span>北美线</span><input type="hidden" value="北美线"/></li>'+
				     			'<li><input type="checkbox" /><span>中亚俄罗斯线</span><input type="hidden" value="中亚俄罗斯线"/></li>'+
				     			'<li><input type="checkbox" /><span>地中海黑海线</span><input type="hidden" value="地中海黑海线"/></li>'+
				     			'<li><input type="checkbox" /><span>东南亚日韩台湾线</span><input type="hidden" value="东南亚日韩台湾线"/></li>'+
				     			'<li><input type="checkbox" /><span>其他</span><input type="hidden" value="其他"/></li>'+
				     		'</ul>'+
				 	        '<div class="btnsBg" style="">'+
				 	        	'<div id="shipLinesAllCheck" class="btnMod1">全选</div>'+
				 	        	'<div id="shipLinesAllUnCheck" class="btnMod1">取消选择</div>'+
				 	        	'<div id="shipLinesAllOk" class="btnMod1">确定</div>'+
				 	        	'<div id="shipLinesAllClose" class="btnMod1">关闭</div>'+
				 	        '</div>'+
				 	    '</div>'+
				             
				         '</ul>'+
				         '</form>'+
				     '</div>'+
				 '</div>';
			 
			 $('body').append($(doHtml));
			 
			 var account_option=""
			 for(var j in properties.accounts){
				 account_option += '<option value="'+properties.accounts[j].id+'">'+properties.accounts[j].accountName+'</option>'
		        }
			 
			 $("#account_name").html(account_option)
			 if(suppliers[i].accountName != null && suppliers[i].accountName != "-" && suppliers[i].accountName != ""){
				 $('#account_name option:contains('+suppliers[i].accountName+')').attr("selected",true);
			 }else{
				 $("#account_name").append("<option >未分类</option>");
				 $('#account_name option:contains("未分类")').attr("selected",true);
			 }
			
			 
			 var level_option=""
			for(var k in properties.levels){
					 level_option += '<option value="'+properties.levels[k].id+'">'+properties.levels[k].levelName+'</option>'
				 }
			 $("#level_name").html(level_option)
			 if(suppliers[i].levelName != null && suppliers[i].levelName != "-" && suppliers[i].levelName != ""){
				 $('#level_name option:contains('+suppliers[i].levelName+')').attr("selected",true);
			 }else{
				 $("#level_name").append("<option >未分类</option>");
				 $('#level_name option:contains("未分类")').attr("selected",true);
			 }
			 
			 
			 
			 var group_option=""
			for(var n in properties.groups){
					 group_option += '<option value="'+properties.groups[n].id+'">'+properties.groups[n].groupName+'</option>'
				 }
			 
			 $("#group_name").html(group_option)
			 if(suppliers[i].groupName != null && suppliers[i].groupName != "-" && suppliers[i].groupName != ""){
				 $('#group_name option:contains('+suppliers[i].groupName+')').attr("selected",true);
			 }else{
				 $("#group_name").append("<option >未分类</option>");
				 $('#group_name option:contains("未分类")').attr("selected",true);
			 }
			 
			 var routeHtml=""
				 for( var j=0,l=suppliers[i].routes.length; j<l ; j++){
						
						routeHtml += '<li><div class="lineName">'+suppliers[i].routes[j]+'</div><div class="b_btn">x</div></li>'
						//console.log($("#hideLines").find("span[text="+users[i].routes[j]+"]"))
						
						//console.log($("#hideLines").find("input[value="+users[i].routes[j]+"]").prev())
						$("#hideLines").find("input[value="+suppliers[i].routes[j]+"]").prev().prev().prop("checked",true)
						
						var lis = $("#hideLines").children("li")
						
					}
					$(".lineList").html(routeHtml)
					$('.lineList .b_btn').click(function(){
						$(this).parent().remove();
					})
			 
			 
			
			 initLabel($('#editGuestLabel'),suppliers[i].tagName)
			 //initGuestLabel($('#editGuestLabel'),label_color,suppliers[i].tagName);
		}
	}
	
	
	
	modDlgEvent($('.addGuestDlg'));// 自制弹出框公用事件 居中_拖拽_关闭
	// 右上角关闭按钮和取消
	$('#editGuestNoBtn').on('click',function(){
		$('.addGuestDlg .closeBtn').trigger('click');
	});
	
	$('#editGuestYesBtn').on('click',function(){
		var lis =  $("#routeList").children("li")
	    var routes = []
	    for(var i=0 , l=lis.length; i < l ; i++){
	    	routes.push(lis.eq(i).children().eq(0).text())
	    }
		
		var accountId =  $("#account_name").val()
		var levelId =  $("#level_name").val()
		var groupId =  $("#group_name").val()
		var tagName	= $("#editGuestLabel").css("background-color")
						
		save_client_url = "/supplierManager/editSupplier?accountId="+accountId+"&levelId="+levelId+"&groupId="+groupId+"&tagName="+tagName+"&routes="+routes
       	
		$.ajax({
       		 cache: true,
      	     type: "POST",
        	 url:save_client_url,
        	 data:$('#supplier_data').serialize(),// 你的formid
             async: false,
             success: function(data) {
            	 $('.addGuestDlg .closeBtn').trigger('click');
            	 if(data == "true"){
            		 zcAlert("保存成功")
            	 }else{
            		 zcAlert("保存失败")	
            	 }
            	 init()
             },
             error: function(request) {
           		 alert("Connection error");
      	  	}
       	})
		
		$('.addGuestDlg .closeBtn').trigger('click');
	});
	
	// 添加业务需求、添加类型、添加群组、添加标签
	$('#addGuest_addNeed').click(function(){
		addNeedShow($(this));// 添加业务需求
	})
	$('#addGuest_addType').click(function(){
		addTypeShow($(this));// 添加类型
	})
	$('#addGuest_addGroup').click(function(){
		addGroupShow($(this));// 添加群组
	})
	$('#addGuest_addLabel').click(function(){
		addLabelShow($(this));// 添加标签
	})
	// 添加联系人
	$('#addLinkman').click(function(){
		var haveNum=$('.linkManMark').length;
		var index=haveNum+1;
		if(index>5){
			zcAlert('联系人最多5个');
			return;
		}
		//var indexWord=['','一','二','三','四','五'];
		var linkmanHtml=
		'<li><input type="hidden" value=0 name="count_new_person"/>'+
			'<div class="wLabel linkManMark">联系人  '+ index+'：<div class="imp">*</div></div>'+
			'<input type="text" class="box1" id="linkman_name_'+index+'" name="linkman_name_'+index+'"  />'+
			'<input type="hidden"  id="linkman_tagName_'+index+'"  value="联系人  '+ index+'" name="linkman_tagName_'+index+'" />'+
		'</li>'+
		'<li>'+
			'<div class="wLabel">手机号：<div class="imp"></div></div>'+
			'<input type="text" class="box1" id="linkman_phone_'+index+'" name="linkman_phone_'+index+'" />'+
		'</li>'+
		'<li>'+
			'<div class="wLabel">邮箱：<div class="imp"></div></div>'+
			'<input type="text" class="box1" id="linkman_mail_'+index+'" name="linkman_mail_'+index+'" />'+
		'</li>'+
		'<li>'+
			'<div class="wLabel">QQ：<div class="imp"></div></div>'+
			'<input type="text" class="box1" id="linkman_qq_'+index+'" name="linkman_qq_'+index+'" />'+
		'</li>';
		$(linkmanHtml).insertBefore($(this).parents('li'));
		$('.addGuestDlg .editList').get(0).scrollTop = $('.addGuestDlg .editList').get(0).scrollHeight;
		var count = $(this).parents().find("input[name=count_new_person]").val()
		$(this).parents().find("input[name=count_new_person]").val(parseInt(count)+1)
	})
	shipLineEvent()
}
// 添加业务需求
function addNeedShow(ele){
	var doHtml=
'<div class="childDlgBg0">'+
	'<div class="winModBg wEditMod addNeedDlg">'+
    	'<div class="titleBg" style="cursor:default;">'+
        	'<div class="caption">添加业务需求</div>'+
            '<div class="closeBtn">X</div>'+
        '</div>'+
        '<ul class="editList">'+
			'<div class="tishi2 modTishiBg">'+
				'<div class="modTishiTxt">带“*”号为必填项；</div>'+
				'<div class="modTishiTxt">名称最多支持10个汉字。</div>'+
			'</div>'+
        	'<li>'+
            	'<div class="wLabel">需求名称：<div class="imp">*</div></div>'+
                '<input type="text" class="box1" />'+
            '</li>'+
            '<li>'+
            	'<div class="bottomBtns">'+
                    '<div id="addNeedNoBtn" class="btnMod1">取消</div>'+
                    '<div id="addNeedYesBtn" class="btnMod1">确定</div>'+
                '</div>'+
            '</li>'+
        '</ul>'+
    '</div>'+
'</div>';
	$('.addGuestDlg .editList').append($(doHtml));
	setEleMiddle($('.addNeedDlg'));// 使元素居中
	// 右上角关闭按钮和取消
	$('.addNeedDlg .closeBtn').on('click',function(){
		winClose();
	});
	$('.addNeedDlg #addNeedYesBtn').on('click',function(){
			var demandName = $(".childDlgBg0").find("input").val()
			$.post("/supplierAttrManager/saveAccount?accountName="+accountName,function(data){
				if(data == "true"){
					winClose();
					zcAlert("添加成功")
					initDemandSelect(ele.parent("li").find("select"))
					//initDemandSelect($("#account_name"))
				}else{
					zcAlert("添加失败")
				}
			})
	});
	// 窗口关闭
	function winClose(){
		$('.addNeedDlg').parent().remove();
	}
}
// 添加类型
function addTypeShow(ele){
	var doHtml=
'<div class="childDlgBg0">'+
	'<div class="winModBg wEditMod addTypeDlg">'+
    	'<div class="titleBg" style="cursor:default;">'+
        	'<div class="caption">添加类型</div>'+
            '<div class="closeBtn">X</div>'+
        '</div>'+
        '<ul class="editList">'+
			'<div class="tishi2 modTishiBg">'+
				'<div class="modTishiTxt">带“*”号为必填项；</div>'+
				'<div class="modTishiTxt">名称最多支持10个汉字。</div>'+
			'</div>'+
        	'<li>'+
            	'<div class="wLabel">类型名称：<div class="imp">*</div></div>'+
                '<input type="text" class="box1" />'+
            '</li>'+
            '<li>'+
            	'<div class="bottomBtns">'+
                    '<div id="addTypeNoBtn" class="btnMod1">取消</div>'+
                    '<div id="addTypeYesBtn" class="btnMod1">确定</div>'+
                '</div>'+
            '</li>'+
        '</ul>'+
    '</div>'+
'</div>';
	$('.addGuestDlg .editList').append($(doHtml));
	setEleMiddle($('.addTypeDlg'));// 使元素居中
	// 右上角关闭按钮和取消
	$('.addTypeDlg .closeBtn').on('click',function(){
		winClose();
	});
	// 确定
	$('#addTypeYesBtn').click(function(){
		var typeName = $(".childDlgBg0").find("input").val()
		$.post("/supplierAttrManager/saveLevel?levelName="+levelName,function(data){
			if(data == "true"){
				winClose();
				zcAlert("添加成功")
				initTypeSelect(ele.parent("li").find("select"))
				//initTypeSelect($("#level_name"))
			}else{
				zcAlert("添加失败")
			}
		})
	})
	// 窗口关闭
	function winClose(){
		$('.addTypeDlg').parent().remove();
	}
}
// 添加群组
function addGroupShow(ele){
	var doHtml=
'<div class="childDlgBg0">'+
	'<div class="winModBg wEditMod addGroupDlg">'+
    	'<div class="titleBg" style="cursor:default;">'+
        	'<div class="caption">添加群组</div>'+
            '<div class="closeBtn">X</div>'+
        '</div>'+
        '<ul class="editList">'+
			'<div class="tishi2 modTishiBg">'+
				'<div class="modTishiTxt">带“*”号为必填项；</div>'+
				'<div class="modTishiTxt">群组名称建议3~8个汉字，最多支持10个汉字；</div>'+
				'<div class="modTishiTxt">描述最多支持20个汉字。</div>'+
			'</div>'+
        	'<li>'+
            	'<div class="wLabel">群组名称：<div class="imp">*</div></div>'+
                '<input type="text" class="box1" />'+
            '</li>'+
			'<li>'+
            	'<div class="wLabel">描述：<div class="imp">*</div></div>'+
                '<textarea class="area1" style="width:200px;"></textarea>'+
            '</li>'+
            '<li>'+
            	'<div class="bottomBtns">'+
                    '<div id="addGroupNoBtn" class="btnMod1">取消</div>'+
                    '<div id="addGroupYesBtn" class="btnMod1">确定</div>'+
                '</div>'+
            '</li>'+
        '</ul>'+
    '</div>'+
'</div>';
	$('.addGuestDlg .editList').append($(doHtml));
	setEleMiddle($('.addGroupDlg'));// 使元素居中
	// 右上角关闭按钮和取消
	$('.addGroupDlg .closeBtn').on('click',function(){
		winClose();
	});
	// 确定
	$('#addGroupYesBtn').click(function(){
		var groupName = $(".childDlgBg0").find("input").val()
		var description  = $(".childDlgBg0").find("textarea").val()
		$.post("/supplierAttrManager/saveGroup?groupName="+groupName+"&description="+description,function(data){
			if(data == "true"){
				winClose();
				zcAlert("添加成功")
				initGroupSelect(ele.parent("li").find("select"))
				//initGroupSelect($("#group_name"))
				
			}else{
				zcAlert("添加失败")
			}
		})
	})
	// 窗口关闭
	function winClose(){
		$('.addGroupDlg').parent().remove();
	}
}
// 添加标签
function addLabelShow(){
	var doHtml=
'<div class="childDlgBg0">'+
	'<div class="winModBg wEditMod addLabelDlg">'+
    	'<div class="titleBg" style="cursor:default;">'+
        	'<div class="caption">添加标签</div>'+
            '<div class="closeBtn">X</div>'+
        '</div>'+
        '<ul class="editList" >'+
			'<div class="tishi2 modTishiBg">'+
				'<div class="modTishiTxt">带“*”号为必填项；</div>'+
				'<div class="modTishiTxt">提供9种颜色供选择；</div>'+
				'<div class="modTishiTxt">描述最多支持20个汉字。</div>'+
			'</div>'+
        	'<li>'+
            	'<div class="wLabel">标签颜色：<div class="imp">*</div></div>'+
                '<div id="addLabel" class="guestLabel">'+
                    '<span>选择标签颜色</span>'+
                    '<ul class="guestLabelList">'+
                        '<li></li><li></li><li></li>'+
                        '<li></li><li></li><li></li>'+
                        '<li></li><li></li><li></li>'+
                    '</ul>'+
                '</div>'+
            '</li>'+
			'<li>'+
            	'<div class="wLabel">描述：<div class="imp">*</div></div>'+
                '<textarea class="area1" style="width:200px;"></textarea>'+
            '</li>'+
            '<li>'+
            	'<div class="bottomBtns">'+
                    '<div id="addLabelNoBtn" class="btnMod1">取消</div>'+
                    '<div id="addLabelYesBtn" class="btnMod1">确定</div>'+
                '</div>'+
            '</li>'+
        '</ul>'+
    '</div>'+
'</div>';
	$('.addGuestDlg .editList').append($(doHtml));
	setEleMiddle($('.addLabelDlg'));// 使元素居中
	// var guest_label_color =
//	var lable_color = []
//	for(var i in properties.tags){
//		lable_color.push(properties.tags[i].tagName)
//	}
	
	initGuestLabel($('#addLabel'),guest_label_color,'transparent');// 初始化用户颜色标签控件
																	// common.js中定义
	// 右上角关闭按钮和取消
	$('.addLabelDlg .closeBtn').on('click',function(){
		winClose();
	});
	// 确定
	$('#addLabelYesBtn').click(function(){
		var tagName = $("#addLabel").css("background-color")
		var description  = $(".childDlgBg0").find("textarea").val()
		$.post("/supplierAttrManager/saveTag?tagName="+tagName+"&description="+description,function(data){
			if(data == "true"){
				winClose();
				initLabel($('#editGuestLabel'),$('#editGuestLabel').css('background-color'))
				zcAlert("添加成功")
			}else{
				zcAlert("添加失败")
			}
		})
	})
	// 窗口关闭
	function winClose(){
		$('.addLabelDlg').parent().remove();
	}
}
// 联系人详情
function linkmanDetails(name,phone,email,qq){
	
	var doHtml=
'<div class="winModBg0" style="z-index:1000;">'+
	'<div class="winModBg wEditMod linkmanDetailsDlg">'+
    	'<div class="titleBg">'+
        	'<div class="caption">联系人详情</div>'+
            '<div class="closeBtn">X</div>'+
        '</div>'+
        '<ul class="editList">'+
        	'<li>'+
            	'<div class="wLabel">名称：<div class="imp"></div></div>'+
                '<div class="txt1" >'+name+'</div>'+
            '</li>'+
			'<li>'+
            	'<div class="wLabel">手机号：<div class="imp"></div></div>'+
                '<div class="txt1" >'+phone+'</div>'+
            '</li>'+
			'<li>'+
            	'<div class="wLabel">邮箱：<div class="imp"></div></div>'+
                '<div class="txt1" >'+email+'</div>'+
            '</li>'+
			'<li>'+
            	'<div class="wLabel">QQ：<div class="imp"></div></div>'+
                '<div class="txt1" >'+qq+'</div>'+
            '</li>'+
			'<li>'+
            	'<div class="bottomBtns">'+
                    '<div id="linkmanDetailsBack" class="btnMod1">返回</div>'+
                '</div>'+
            '</li>'+
        '</ul>'+
    '</div>'+
'</div>';
	$('body').append($(doHtml));
	modDlgEvent($('.linkmanDetailsDlg'));
	
	$('#linkmanDetailsBack').click(function(){
		$('.linkmanDetailsDlg .closeBtn').trigger('click');
	})
}
// 添加联系人
function addLinkmanDlgShow(id){
	var doHtml=
'<div class="winModBg0">'+
	'<div class="winModBg wEditMod addLinkmanDlg">'+
    	'<div class="titleBg">'+
        	'<div class="caption">添加联系人</div>'+
            '<div class="closeBtn">X</div>'+
        '</div>'+
        '<form id="add_supplier_account">'+
        '<ul class="editList">'+
        	'<li>'+
            	'<div class="wLabel">名称：<div class="imp">*</div></div>'+
                '<input class="box1" name="personName"/>'+
            '</li>'+
			'<li>'+
            	'<div class="wLabel">手机号：<div class="imp"></div></div>'+
                '<input class="box1" name="phone"/>'+
            '</li>'+
			'<li>'+
            	'<div class="wLabel">邮箱：<div class="imp"></div></div>'+
                '<input class="box1" name="email"/>'+
            '</li>'+
			'<li>'+
            	'<div class="wLabel">QQ：<div class="imp"></div></div>'+
                '<input class="box1" name="qq"/>'+
            '</li>'+
			'<li>'+
            	'<div class="bottomBtns">'+
                    '<div id="addLinkmanNoBtn" class="btnMod1">取消</div>'+
                    '<div id="addLinkmanYesBtn" class="btnMod1">确定</div>'+
                '</div>'+
            '</li>'+
        '</ul>'+
        '</form>'+
    '</div>';
'</div>';
	$('body').append($(doHtml));
	modDlgEvent($('.addLinkmanDlg'));
	
	// 取消
	$('#addLinkmanNoBtn').click(function(){
		$('.addLinkmanDlg .closeBtn').trigger('click');
	})
	
	$('#addLinkmanYesBtn').click(function(){
		$.ajax({
			cache: true,
			type:  "POST",
			url:   "/supplierManager/saveSupplierPerson?id="+id,
			data:  $('#add_supplier_account').serialize(),
			async: false,
			success:function(data){
				if(data=="true"){
					$('.addLinkmanDlg .closeBtn').trigger('click');
					zcAlert("添加成功")
					initSuppliers(dtd)
				}else{
					zcAlert("添加失败")
				}
			},
		 	error: function(request) {
       		 console.log("Connection error")
		 	}
		})
		
		$('.addLinkmanDlg .closeBtn').trigger('click');
	})
}
// 编辑联系人
function editLinkmanDlgShow(eve){
	var data_ele = $(eve.target).next()
	var prev_ele = $(eve.target).prev()
	var data_split = data_ele.val().split(",")
	
	var doHtml=
'<div class="winModBg0">'+
	'<div class="winModBg wEditMod editLinkmanDlg">'+
    	'<div class="titleBg">'+
        	'<div class="caption">编辑联系人</div>'+
            '<div class="closeBtn">X</div>'+
        '</div>'+
        '<ul class="editList">'+
        	'<li>'+
            	'<div class="wLabel">名称：<div class="imp">*</div></div>'+
                '<input class="box1" value="'+data_split[0]+'" id="edit_cPerson_name" />'+
            '</li>'+
			'<li>'+
            	'<div class="wLabel">手机号：<div class="imp"></div></div>'+
                '<input class="box1" value="'+data_split[1]+'" id="edit_cPerson_phone"/>'+
            '</li>'+
			'<li>'+
            	'<div class="wLabel">邮箱：<div class="imp"></div></div>'+
                '<input class="box1" value="'+data_split[2]+'" id="edit_cPerson_email"/>'+
            '</li>'+
			'<li>'+
            	'<div class="wLabel">QQ：<div class="imp"></div></div>'+
                '<input class="box1" value="'+data_split[3]+'" id="edit_cPerson_qq"/>'+
            '</li>'+
			'<li>'+
            	'<div class="bottomBtns">'+
                    '<div id="editLinkmanNoBtn" class="btnMod1">取消</div>'+
                    '<div id="editLinkmanYesBtn" class="btnMod1">修改</div>'+
                '</div>'+
            '</li>'+
        '</ul>'+
    '</div>'+
'</div>';
	$('body').append($(doHtml));
	modDlgEvent($('.editLinkmanDlg'));
	
	// 取消
	$('#editLinkmanNoBtn').click(function(){
		$('.editLinkmanDlg .closeBtn').trigger('click');
	})
	
	$('#editLinkmanYesBtn').click(function(){
		prev_ele.val($("#edit_cPerson_name").val())
		data_ele.val($("#edit_cPerson_name").val()+","+$("#edit_cPerson_phone").val()+","+$("#edit_cPerson_email").val()+","+$("#edit_cPerson_qq").val()+","+data_split[4])
		zcAlert("修改成功")
		$('.editLinkmanDlg .closeBtn').trigger('click');
	})
}


function initLabel(ele,tag_name){
	label_color = []
	$.post("/supplierAttrManager/getTags",function(data){
		properties.tags =  data.rows
		for(var i in properties.tags){
			label_color.push(properties.tags[i].tagName)
		}
		initGuestLabel($('#editGuestLabel'),label_color,tag_name);
	})
}

function initDemandSelect(ele){
	var old_val = ele.val()
	$.post("/supplierAttrManager/getAccounts",function(data){
		properties.accounts =  data.rows
		var account_data
		if(old_val == "未分类"){
			 account_data = "<option>未分类</option>"
		}else{
			account_data = ""
		}
		for(var i in data.rows){
			account_data += '<option value="'+data.rows[i].id+'">'+data.rows[i].accountName+'</option>'
		}
		ele.html(account_data)
//		if(old_val == "未分类"){
//			ele.append("<option >未分类<option>")
//			ele.val("未分类")
//		}else{
//			ele.val(old_val)
//		}
		ele.val(old_val)
	})
}

function initTypeSelect(ele){
	var old_val = ele.val()
	$.post("/supplierAttrManager/getLevels",function(data){
		properties.levels =  data.rows
		var level_data
		if(old_val == "未分类"){
			level_data = "<option>未分类</option>"
		}else{
			level_data = ""
		}
		for(var i in data.rows){
			level_data += '<option value="'+data.rows[i].id+'">'+data.rows[i].levelName+'</option>'
		}
		ele.html(level_data)
		ele.val(old_val)
	})
}

function initGroupSelect(ele){
	var old_val = ele.val()
	$.post("/supplierAttrManager/getGroups",function(data){
		properties.levels =  data.rows
		var group_data
		if(old_val == "未分类"){
			group_data = "<option>未分类</option>"
		}else{
			group_data = ""
		}
		for(var i in data.rows){
			group_data += '<option value="'+data.rows[i].id+'">'+data.rows[i].groupName+'</option>'
		}
		ele.html(group_data)
		ele.val(old_val)
	})
}

function delOldPerson(eve){
	var e_li = $(eve.target).parents("li")
	var arr = e_li.nextAll("li[name=cps]")
	console.log(arr.length)
	for(var i =0,l=arr.length; i<l; i++){
			console.log(arr.eq(i).find("input[type=hidden]"))
			var name = arr.eq(i).find("input[type=hidden]").attr("name")
			arr.eq(i).find("input[type=hidden]").attr("name","linkman_old_"+parseInt(name.substring(12,13)-1))
	}
	e_li.remove()
}

function initSizeCount(ele){
	searchArgs.pageSize = parseInt(ele.text())
	pageNum = 1
	initSuppliers(dtd)
	$.when(initSuppliers(dtd)).done(function(){
		setCommonPage2Event($('.im_pageBg'),pageTotal,function(num){
			pageNum = num
			searchArgs.pageOffset = (num-1)*searchArgs.pageSize 
			initSuppliers(dtd)
		})
	})
}

function exportSuppliers(){
	$("#exportData").attr("action","/supplierManager/exportSuppliers?searchArgs") 
	
	$("#exportData").submit()
}


function shipLineEvent(){
	$('#shipLineAdd').click(function(){
		console.log("33")
		$('.shipLinesBg').show();
	});
	$('#shipLinesAllCheck').click(function(){
		$('.linesList input[type="checkbox"]').prop('checked',true);
	});
	$('#shipLinesAllUnCheck').click(function(){
		$('.linesList input[type="checkbox"]').prop('checked',false);
	});
	$('#shipLinesAllOk').click(function(){
		var checks=$('.linesList input[type="checkbox"]:checked');
		if(checks.length>0){
			var checkData=[];
			for(var i=0;i<checks.length;i++){
				var temp={};
				temp.name=checks.eq(i).next().html();
				checkData.push(temp);
			}
			setLineList(checkData)
		}else{
			$('.lineList').html('');
		}
		$('.shipLinesBg').hide();
	});
	$('#shipLinesAllClose').click(function(){
		$('.shipLinesBg').hide();
	});
	
	//设置负责航线
	function setLineList(data){
		var doHtml="";
		for(var i=0;i<data.length;i++){
			doHtml+='<li><div class="lineName">'+data[i].name+'</div><div class="b_btn">x</div></li>'
		}
		$('.lineList').html(doHtml);
		$('.lineList .b_btn').click(function(){
			$(this).parent().remove();
		})
	}
}