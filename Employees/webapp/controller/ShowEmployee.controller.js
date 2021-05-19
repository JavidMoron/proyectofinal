// @ts-nocheck
sap.ui.define([
	"sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History"
], function (Controller,History) {
	"use strict";
	
	function onInit(){
		this._splitAppEmployee = this.byId("splitAppEmployee");
	}
	
	function onPressBack(){
			// vamos al menu
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("App", {}, true);
	}
	
	function onSearchEmployee(){
		var filters = [];
        filters.push(new Filter("FirstName", FilterOperator.Contains, this.getView().byId("filterEmployee").getValue()));
        var oList = this.getView().byId("employeeList");
        var oBinding = oList.getBinding("items");
        oBinding.filter(filters);
	}
	
	function onSelectEmployee(oEvent){
		this._splitAppEmployee.to(this.createId("detailEmployee"));
		var context = oEvent.getParameter("listItem").getBindingContext("odataModel");
		this.employeeId = context.getProperty("EmployeeId");
		var detailEmployee = this.byId("detailEmployee");
		detailEmployee.bindElement("odataModel>/Users(EmployeeId='"+ this.employeeId +"',SapId='"+this.getOwnerComponent().SapId+"')");
		
	}
	
	function onDeleteEmployee(oEvent){
		sap.m.MessageBox.confirm(this.getView().getModel("i18n").getResourceBundle().getText("deleteEmployee"),{
			title : this.getView().getModel("i18n").getResourceBundle().getText("confirm"),
			onClose : function(oAction){
			    	if(oAction === "OK"){
						this.getView().getModel("odataModel").remove("/Users(EmployeeId='" + this.employeeId + "',SapId='"+this.getOwnerComponent().SapId+"')",{
							success : function(data){
								sap.m.MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("employeeDeleted"));
								this._splitAppEmployee.to(this.createId("detailSelectEmployee"));
							}.bind(this),
							error : function(e){
								sap.base.Log.info(e);
							}.bind(this)
						});
			    	}
			}.bind(this)
		});
	}
	
	function onRiseEmployee(oEvent){
		if(!this.riseDialog){
			this.riseDialog = sap.ui.xmlfragment("logaligroup/Employees/fragment/RiseEmployee", this);
			this.getView().addDependent(this.riseDialog);
		}
		this.riseDialog.setModel(new sap.ui.model.json.JSONModel({}),"newRise");
		this.riseDialog.open();
	}
	
	function onCloseRiseDialog(){
		this.riseDialog.close();
	}
	
	function addRise(oEvent){
		var newRise = this.riseDialog.getModel("newRise");
		var odata = newRise.getData();
		var body = {
			Ammount : odata.Ammount,
			CreationDate : odata.CreationDate,
			Comments : odata.Comments,
			SapId : this.getOwnerComponent().SapId,
			EmployeeId : this.employeeId
		};
		this.getView().setBusy(true);
		this.getView().getModel("odataModel").create("/Salaries",body,{
			success : function(){
				this.getView().setBusy(false);
				sap.m.MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("riseOK"));
				this.onCloseRiseDialog();
			}.bind(this),
			error : function(){
                this.getView().setBusy(false);
                sap.m.MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("riseKO"));
			}.bind(this)
		});
		
    }

	function onChange (oEvent) {
       var oUploadCollection = oEvent.getSource();
	   var oCustomerHeaderToken = new sap.m.UploadCollectionParameter({
	    name: "x-csrf-token",
	    value: this.getView().getModel("odataModel").getSecurityToken()
	   });
	   oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
	 }
	
	 function onBeforeUploadStart (oEvent) {
	   var oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
				name: "slug",
				value: this.getOwnerComponent().SapId+";"+this.employeeId+";"+oEvent.getParameter("fileName")
			});
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
      }
    
    function onUploadComplete (oEvent) {
        var oUploadCollection = oEvent.getSource();
        oUploadCollection.getBinding("items").refresh();
    }

    function onFileDeleted(oEvent){
        var oUploadCollection = oEvent.getSource();
        var sPath = oEvent.getParameter("item").getBindingContext("odataModel").getPath();
        this.getView().getModel("odataModel").remove(sPath, {
            success: function(){
                oUploadCollection.getBinding("items").refresh();
            },
            error: function(){

            }
        });
    }

    function downloadFile(oEvent){
        var sPath = oEvent.getSource().getBindingContext("odataModel").getPath();
        window.open("/sap/opu/odata/sap/ZEMPLOYEES_SRV"+sPath+"/$value");
    }

	return Controller.extend("logaligroup.rrhh.HTML5Module.controller.ShowEmployee", {
		onInit: onInit,
		onPressBack : onPressBack,
		onSearchEmployee : onSearchEmployee,
		onSelectEmployee : onSelectEmployee,
		onDeleteEmployee : onDeleteEmployee,
		onRiseEmployee : onRiseEmployee,
		onCloseRiseDialog : onCloseRiseDialog,
        addRise : addRise,
        onChange : onChange,
        onBeforeUploadStart : onBeforeUploadStart,
        onUploadComplete : onUploadComplete,
        onFileDeleted : onFileDeleted,
        downloadFile : downloadFile
	});

});