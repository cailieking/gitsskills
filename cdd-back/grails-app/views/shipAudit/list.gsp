<g:set var="springSecurityService" bean="springSecurityService" />
<g:set var="cityService" bean="cityService" />
<g:set var="springSecurityService" bean="springSecurityService" />
<%@page import="com.cdd.base.enums.Status"%>
<%@page import="com.cdd.base.enums.OrderStatus"%>
<%@page import="com.cdd.base.enums.Provinces"%>
<!DOCTYPE html>
<html>
<head>
<title>运价审核</title>
<meta name="layout" content="main">
<asset:stylesheet src="table.css" />
<asset:javascript src="list-table.js" />
<style>
.audit_box{
width:100%;

}
.audit_box input{
	display:inline-block;
	width:100px;
	padding: 2px 3px; 
	margin-right:10px;
}
.refer,.more{
 display:inline-block;
 padding:4px 25px;
  background:orange;
 color:white;
 border-radius:3px;
  text-decoration:none;
 
 
}

.audit_area{
	float: left; 
	width:100%;	
	margin:10px 0 ;
}

#refer-01{
margin: 0 40px 0  325px;

}
.definite_area{
  display:none
}
.display{
display:block
}
.definite_area>input{
	margin-bottom:20px;	
}

</style>
</head>
<body>
	<%--<div class="row">
		--%><div class="col-lg-12">
			<div class="block">
			<div class="audit_box">
				   <div class="audit_area">
						  运价编号：<input type="text" name="yjnumber"  id="yjnumber" />
						  提交人：<input type="text" name="submitman"  id="submitman"/>
						提交时间：<input name="submittime"   type="text" class="datepicker" id="submittime"/>
						 <a href="javascript:;" class="refer " id="refer-01" >查询</a>
						 <a href="javascript:;" class="more" >更多查询条件</a>
				  </div>
			
			<div  class="definite_area">
			  	   		
				   	<span style="margin-left:28px;">航线：</span><input type="text" id="hx" class="route">
						   <span style="margin-left:15px;">公司：</span><input type="text" id="company" class="company">
						   <span style="margin-left:18px;">船公司：</span><input type="text" id="chuancompany" class="chuancompany">
				   	<!--  运输类型：<select id="transType">
						   		<option value="">类型</option>
						   		<option value="Whole">整箱</option>
						   		<option value="Together">拼箱</option>
						   	</select>
						   	-->
				   			<span style="margin-left:15px;">始发港：</span><input type="text" id="start" class="start_port">
						   	<span style="margin-left:15px;">中转港：</span><input type="text" id="middle" class="middle_port">
						    <span style="margin-left:15px;">目的港：</span><input type="text" id="end" class="end_port">
			  
			   <div style="float: left;margin-bottom:10px; ">
			   <%--
				   	船期：<select><option>全部</option></select>截<select><option>全部</option></select>开
				   	
				   --%>	
				   	<span style="margin-left:28px;">船程：</span><input type="text" id="hc">
						   	<span style="margin-left:2px;">所在地：</span>
						<select name="cityId" class="selectautocomplete" id="cityId" style="width:96px">
							<option value="">--请选择--</option>
							<g:each in="${Provinces.values()}" var="province">
								<optgroup label="${province.desc}">
									<g:each in="${cityService.getCities(province.code).list}" var="city">
											<option value="${city.id}">${city.name}</option>
									</g:each>
								</optgroup>
							</g:each>
						</select>
					</formTable>
				   	<span style="margin-left:28px;">联系人：</span><input type="text" id="contact">
						    <span style="margin-left:0px">开始日期：</span><input type="text" class="datepicker" id="starttime" >
						   	<span style="margin-left:0px;">结束时间：</span><input type="text" class="datepicker" id="endtime">
						   	<a href="javascript:;" class=" refer" id="refer-02" >查询</a>		  	
			   </div>
			   </div>
			   </div>
			   
				<table id="list"></table>
			</div>
		</div><%--
	</div>

--%><script>
var selectedDatas = []
$(function() {
	var yjnumber=$("#yjnumber")
	var submitman=$("#submitman")
	var submittime=$("#submittime")
	//var shstatus=$("#shstatus")
	var hx=$("#hx")
	var company=$("#company")
	var chuancompany=$("#chuancompany")
	//var transType=$("#transType")
	var hc=$("#hc")
	var cityId=$("#cityId")
	var start=$("#start")
	var middle=$("#middle")
	var end=$("#end")
	var contact=$("#contact")
	var starttime=$("#starttime")
	var endtime=$("#endtime")
	//var box= $("input[name='box']")
	var statusSelect = $([
   		'<select class="selectpicker" style="margin-left: 30px;margin-right:30px;float:right;">',
   		'<option value="">审核状态</option>', 
   		<g:each in="${Status.values()}" var="status">
   		'<option value="${status.name()}">${status.text}</option>', 
   		</g:each>
   		'</select>' 
   	].join(''))
	var transTypeSelect=$([
		'<select class="selectpicker" style="float:right;margin-right:30px;">',
		'<option value="">箱型</option>',
		'<option value="Whole">整箱</option>',
		'<option value="Together">拼箱</option>'

    ].join(''))
	$('#list').bootstrapTable({
		url : '${request.contextPath}/shipAudit/list?dataType=json&requestDate='+new Date(),
		sidePagination : 'server', // client or server
		formatSearch : function() {
			return '航线/公司/联系人';
		},
		columns : [{
			checkbox : true
		},{
			field : 'id',
			title : '运价编号',
			formatter : function (value, row, index) {<%--href="/shipAudit/view/'+value+'" target="_blank" --%>
			return [
					'<a class="datatable_operation view" href="javascript:void(0)" >',
					value, 
					'</a>' 
				].join('');
			},
			events : operateEvents
		}, {
			field : 'companyName',
			title : '公司',
			sortable : true
			
		}, {
			field : 'shipCompany',
			title : '船公司',
			sortable : true
			
		}, {
			field : 'contactName',
			title : '联系人',
			sortable : true
		// formatter: operateFormatter,
		//  events: operateEvents
		}, {
			field : 'startPort',
			title : '始发港',
			sortable : true
		// formatter: operateFormatter,
		//  events: operateEvents
		}, {
			field : 'endPort',
			title : '目的港',
			sortable : true
		// formatter: operateFormatter,
		//  events: operateEvents
		},{
			field : 'gp20',
			title : 'USD/20GP',
			sortable : true
		}, {
			field : 'gp40',
			title : 'USD/40GP',
			sortable : true
		}, {
			field : 'createBy',
			title : '提交人',
			sortable : true
		}, {
			field : 'dateCreated',
			title : '提交时间',
			sortable : true
		}, {
			field : 'id',
			title : '操作',
			formatter : function (value, row, index) {<%--target="_blank"--%>
				return [
						'<a class="datatable_operation edit" href="javascript:void(0)"  >',
						'修改', 
						'</a>' 
				].join('');
			},
			events : operateEvents
		} ],
		queryParams: function (params) {
			params.yjnumber = yjnumber.val()
			params.submitman=submitman.val()
			params.submittime=submittime.val()
			//params.shstatus=shstatus.val()
			params.hx=hx.val()
			params.company=company.val()
			params.chuancompany=chuancompany.val()
			//params.transType=transType.val()
			params.hc=hc.val()
			params.middle=middle.val()
			params.contact=contact.val()
			params.starttime=starttime.val()
			params.endtime=endtime.val()
			params.status = statusSelect.val()
			params.transType=transTypeSelect.val()
			params.start=start.val()
			params.end=end.val()
			params.cityId = cityId.val()
			//params.box=box.val()
			return params;
		}
	}).on('check.bs.table', function (e, row) {
		triggerRowSelection();
    }).on('uncheck.bs.table', function (e, row) {
    	triggerRowSelection();
    }).on('check-all.bs.table', function (e) {
    	triggerRowSelection();
    }).on('uncheck-all.bs.table', function (e) {
    	selectedDatas.length = 0;
    })
    
	 
	$(".datatable-search-btn").after(statusSelect);
	
	$(".datatable-search-btn").after(transTypeSelect);
	
	transTypeSelect.change(function(){
		$(".datatable-search-btn").click();
	});
	statusSelect.change(function() {
		$(".datatable-search-btn").click()
	});
	$(".button-highlight").css({'marginLeft':'15px'}); 
	$(".more").click(function(){$(".definite_area").toggleClass("display")})  
	$(".refer").click(function(){$(".button-highlight").click()}) 
       
	
	//不通过
	var nopassBtn = $('<a href="javascript:;" class="button button-glow button-rounded button-caution-flat table-btn">不通过</a>')
	$(".datatable-search-btn").before(nopassBtn);
	nopassBtn.click(function() {
		if(selectedDatas.length > 0) {
			BootstrapDialog.confirm("确定不通过吗？", function(result) {
				if(result) {
					window.location.href = '${request.contextPath}/shipAudit/nopass/?ids=' + selectedDatas.join();
				}
			});
		} else {
			BootstrapDialog.show({
				message: '请选择至少一条记录'
			});
		}
	})
		
	//通过
	var passBtn = $('<a href="javascript:;" class="button button-glow button-rounded button-primary-flat table-btn">通过</a>')
	$(".datatable-search-btn").before(passBtn);
	passBtn.click(function() {
		 
		if(selectedDatas.length > 0) {
			BootstrapDialog.confirm("确定通过吗？", function(result) {
				if(result) {
					window.location.href = '${request.contextPath}/shipAudit/pass/?ids=' + selectedDatas.join();
				}
			});
		} else {
			BootstrapDialog.show({
				message: '请选择至少一条记录'
			});
		}
	})
	//
	var intervalId = window.setInterval(function() {
		var el = $(".bootstrap-select");
		if(el.size() > 0) {
			el.css("float", "right").css("marginLeft", "10px").css("marginTop", "-2px").css("width","150px");
			window.clearInterval(intervalId);;
			window.clearInterval(intervalId);
		}
	}, 10);

});


window.operateEvents = {
	'click .edit' : function(e, value, row, index) {
			window.location.href = '${request.contextPath}/shipAudit/data/' + value;
	},
	'click .view' : function(e, value, row, index) {
		window.location.href = '${request.contextPath}/shipAudit/view/' + value;
	},
};

</script>
</body>
</html>
