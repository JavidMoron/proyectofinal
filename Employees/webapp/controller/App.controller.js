sap.ui.define([
		"sap/ui/core/mvc/Controller"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller) {
		"use strict";

		return Controller.extend("logaligroup.Employees.controller.App", {
			onInit: function () {

            },
            
            onAfterRendering: function(){
                var genericTileFirmarPedido = this.byId("linkFirmarPedido");
                var idGenericTileFirmarPedido = genericTileFirmarPedido.getId();

                jQuery("#"+idGenericTileFirmarPedido)[0].id = "";
            },

            navToCreateEmployee: function (){
                sap.ui.core.UIComponent.getRouterFor(this).navTo("CreateEmployee",{},false);
            },

            navToShowEmployee: function (){
                sap.ui.core.UIComponent.getRouterFor(this).navTo("ShowEmployee",{},false);
            }
		});
	});
