odoo.define('arabic_receipt_rest.posreceipt', function(require){
"use strict";
    var screens = require('point_of_sale.screens');
    var Model = require('web.Model');
    var models = require('point_of_sale.models');
    var core = require('web.core');
    var _t = core._t;
    var QWeb = core.qweb;


    screens.ReceiptScreenWidget.include({

    print_xml: function() {
        var self = this;
        var ord = this.pos.get_order();
        if(self.pos.config.arabic_allow)
        {

        var dataa = {
            receipt: ord.export_for_printing(),
            conf_id: self.pos.config.id,
        };
        new Model('pos.order').call('pos_malik', [dataa]).then(function(result){
            //if(result.sig === false){
            var env = {
            malik: result,
            receipt: ord.export_for_printing(),
            };
            var receipt = QWeb.render('Xml_Arabic',env);

            self.pos.proxy.print_receipt(receipt);
            ord._printed = true;
            //}
        });

        }
        else{
            this._super();
        }
    },


    });
    var _super_order = models.Order.prototype;
    models.Order = models.Order.extend({
     printChanges: function(){
        var self = this;
        var printers = this.pos.printers;
        for(var i = 0; i < printers.length; i++){
            var changes = this.computeChanges(printers[i].config.product_categories_ids);
            if ( changes['new'].length > 0 || changes['cancelled'].length > 0){
               if(self.pos.config.arabic_allow){
               var dataa = {
                   changes: changes,
                   cl: self.pos.get_order().get_client() || "no"
               };
               var x = i;
               new Model('pos.order').call('print_kitchen_malik_1', [dataa]).then(function(result){
                   self.pos.printers[x].print(QWeb.render('Xml_Arabicc',{malik: result}));
                   });

               }
               else{
               var receipt = QWeb.render('OrderChangeReceipt',{changes:changes, widget:this});
               printers[i].print(receipt);
               }

            }
        }

     },

    });
    ///////////////////////////////////////////////////////////////////////////////////
    var PrintBillButton_1 = screens.ActionButtonWidget.extend({
    template: 'PrintBillButton_1',
    print_xml: function(){
        var self = this;
        var ord = this.pos.get_order();
        if(self.pos.config.arabic_allow)
        {
        if(ord.get_orderlines().length > 0){
        var receipt = ord.export_for_printing();
        var dataa = {
            receipt: receipt,
        };
        new Model('pos.order').call('pos_malik', [dataa]).then(function(result){
            //if(result.sig === false){
            var env = {
            malik: result,
            receipt: receipt,
            };
            receipt.bill = true;
            self.pos.proxy.print_receipt(QWeb.render('Xml_Arabic',env));
            //}
        });

        }


        }
        else{
            this._super();
        }
    },
    button_click: function(){
        if (!this.pos.config.iface_print_via_proxy) {
            this.gui.show_screen('bill');
        } else {
            this.print_xml();
        }
    },
    });
    screens.define_action_button({
    'name': 'print_bill_1',
    'widget': PrintBillButton_1,
    'condition': function(){
        return this.pos.config.iface_printbill;
    },
    });
    ///////////////////////////////////////////////////////////////////////////////////
});