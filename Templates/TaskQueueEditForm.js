﻿
var dataModel = {

    taskorderno: ko.observable(),
    taskname: ko.observable(),
    taskid: ko.observable(),
    taskstatetype:ko.observable(),
    previoustask: ko.observable(),
    relatedtask: ko.observable(),
    taskstatus: ko.observable(),
    creationdate: ko.observable(),
    attachmentdate: ko.observable(),
    appointmentdate: ko.observable(),
    consummationdate: ko.observable(),
    personelname: ko.observable(),
    assistantpersonel: ko.observable(),
    sitename: ko.observable(),
    blockname: ko.observable(),
    region: ko.observable(),
    customername: ko.observable(),
    customerid:ko.observable(),
    locationid: ko.observable(),
    customergsm: ko.observable(),
    customerstatus: ko.observable(),
    description: ko.observable(),
    taskstatuslist: ko.observableArray([]),
    personellist:ko.observableArray([]),
    ctstatuslist: ko.observableArray([]),
    message: ko.observable(),
    flag: ko.observable(false),


    //abone ürün kampanya bilgileri işlemleri
    subcategorylist: ko.observableArray([]),
    categorylist: ko.observableArray([]),
    campaignlist: ko.observableArray([]),
    category: ko.observable(),
    subcategory: ko.observable(),
    campaignname:ko.observable(),
   

    getcategory: function () {
        var self = this;
        data = {
            category: { fieldName: 'category', op: 6, value: '' }
        },
        crmAPI.getCampaignInfo(data, function (a, b, c) {
            self.categorylist(a);
            $("#kategori").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: ' Seçiniz',
                nSelectedText: ' Seçildi!',
                numberDisplayed: 2,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
        }, null, null)
    },
    getsubcategory: function () {
        var self = this;
        data = {
            category: { fieldName: 'category', op: 6, value: self.category()?self.category() :'' },
            subcategory: { fieldName: 'subcategory', op: 6, value: '' }
        },
        crmAPI.getCampaignInfo(data, function (a, b, c) {
            self.subcategorylist(a);
            $("#urun").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: ' Seçiniz',
                nSelectedText: ' Seçildi!',
                numberDisplayed: 2,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
        }, null, null)
    },
    getcamapign: function () {
        var self = this;
        data = {
            category: { fieldName: 'category', op: 6, value: self.category() ? self.category() : '' },
            subcategory: { fieldName: 'subcategory', op: 6, value: self.subcategory()?self.subcategory():'' },
            campaign: { fieldName: 'name', op: 6, value: '' }
        },
        crmAPI.getCampaignInfo(data, function (a, b, c) {
            self.campaignlist(a);
            $("#kampanya").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: ' Seçiniz',
                nSelectedText: ' Seçildi!',
                numberDisplayed: 2,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
        }, null, null)
    },
    getproduct: function () {
        var self = this;
        data = {
            category: { fieldName: 'category', op: 6, value: self.category() ? self.category() : '' },
            subcategory: { fieldName: 'subcategory', op: 6, value: self.subcategory() ? self.subcategory() : '' },
            campaign: { fieldName: 'name', op: 6, value: '' },
            selectedcampaign:{fieldName:'',op:6,value:self.campaignname()}
        },
        crmAPI.getCampaignInfo(data, function (a, b, c) {
            self.campaignlist(a);
            $("#kampanya").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: ' Seçiniz',
                nSelectedText: ' Seçildi!',
                numberDisplayed: 2,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
        }, null, null)
    },



    gettaskstatus: function (statusVal) {
        var self = this;
        var data = {
            task: { fieldName: "taskid", op: 2, value:self.taskid()},
            taskstate: { fieldName: "taskstate", op: 6, value: '' },
        };
        crmAPI.getTaskStatus(data, function (a, b, c) {
             self.taskstatuslist(a);
             self.taskstatus(statusVal);
             $("#taskdurumu").multiselect({
                 includeSelectAllOption: true,
                 selectAllValue: 'select-all-value',
                 maxHeight: 250,
                 buttonWidth: '100%',
                 nonSelectedText: 'Seçiniz',
                 numberDisplayed: 2,
                 selectAllText: 'Tümünü Seç!',
                 enableFiltering: true,
                 filterPlaceholder: 'Ara'
             });
         }, null, null)
    },
    redirect : function () {
        window.location.href = "app.html";
    },
    getpersonel: function () {
        var self = this;
        crmAPI.getPersonel(function (a, b, c) {
            self.personellist(a);
            $("#assistantPersonel").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: 'Personel Seçiniz',
                nSelectedText: 'Personel Seçildi!',
                numberDisplayed: 2,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
        }, null, null)
    },
    getCustomerStatus: function () {
        var self = this;
        crmAPI.getCustomerStatus(function (a, b, c) {
            self.ctstatuslist(a);
            $("#abonedurumu").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: 'Abone Durumunu Seçiniz',
                nSelectedText: 'Abone Durumu Seçildi!',
                numberDisplayed: 2,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
        }, null, null)
    },
    saveTaskQueues: function () {
        var self = this;
        data = {
            taskorderno: self.taskorderno(),
            task:{taskid:self.taskid()},
            //taskstatepool: 
            //    { taskstateid: $("#taskdurumu").val() ?$("#taskdurumu").val()[0]:null ,
            //    taskstate: $("#taskdurumu option:selected").text() ? $("#taskdurumu option:selected").text():null
            //    },
            taskstatepool: self.taskstatus() ? self.taskstatus() :null,
            description: self.description() ? self.description() : null,
            asistanPersonel: { personelid: self.assistantpersonel()>0? self.assistantpersonel() : null },
            appointmentdate: self.appointmentdate() ? moment(self.appointmentdate()).format() : null,
            consummationdate: self.consummationdate() ? moment(self.consummationdate()).format() : null,
            creationdate: self.creationdate() ? moment(self.creationdate()).format() : null,
            attachmentdate: self.attachmentdate() ? moment(self.attachmentdate()).format() : null,
        };
        crmAPI.saveTaskQueues(data, function (a, b, c) {
            self.message(a);
        }, null, null)

    },
    renderBindings: function () {
        var self = this;

        var hashSearches = document.location.hash.split("?");
        if(hashSearches.length > 1) { 
            var data = { taskOrderNo: hashSearches[1] };
            crmAPI.getTaskQueues(data, function (a, b, c) {
                self.taskorderno(a.data.rows[0].taskorderno);               
                self.taskname(a.data.rows[0].task.taskname);
                self.taskid(a.data.rows[0].task.taskid);
                self.taskstatetype(a.data.rows[0].taskstatepool && a.data.rows[0].taskstatepool.statetype || null)
                var status = a.data.rows[0].taskstatepool && a.data.rows[0].taskstatepool.taskstateid || null;
                self.gettaskstatus(status);

                self.previoustask(a.data.rows[0].previoustaskorderid);
                self.relatedtask(a.data.rows[0].relatedtaskorderid);
                self.creationdate(moment(a.data.rows[0].creationdate).format('lll'));
                self.attachmentdate(a.data.rows[0].attachmentdate && a.data.rows[0].attachmentdate || null);
                self.appointmentdate(a.data.rows[0].appointmentdate ? a.data.rows[0].appointmentdate : null);
                self.consummationdate(a.data.rows[0].consummationdate && moment(a.data.rows[0].consummationdate).format('lll') || null);
                self.personelname(a.data.rows[0].attachedpersonel && a.data.rows[0].attachedpersonel.personelname || 'atanmamış');
                self.assistantpersonel(a.data.rows[0].asistanPersonel ? a.data.rows[0].asistanPersonel.personelid : 'atanmamış');
                $("#assistantPersonel").multiselect("refresh");
                self.sitename(((a.data.rows[0].attachedobject.sitename || (a.data.rows[0].attachedobject.site && a.data.rows[0].attachedobject.site.sitename) ||
                               (a.data.rows[0].attachedobject.block && a.data.rows[0].attachedobject.block.site && a.data.rows[0].attachedobject.block.site.sitename)) ||
                              '&lt;boş&gt;'
                             ));
                self.blockname(a.data.rows[0].attachedobject.blockname || (a.data.rows[0].attachedobject.block && a.data.rows[0].attachedobject.block.blockname) || '');
                self.region(((a.data.rows[0].attachedobject.region || (a.data.rows[0].attachedobject.site && a.data.rows[0].attachedobject.site.region) ||
                               (a.data.rows[0].attachedobject.block && a.data.rows[0].attachedobject.block.site && a.data.rows[0].attachedobject.block.site.region)) ||
                              '&lt;boş&gt;'
                             ));
                self.customername(a.data.rows[0].attachedobject.customername && (a.data.rows[0].attachedobject.customername + ' ' + a.data.rows[0].attachedobject.customersurname) || '');
                self.customerid(a.data.rows[0].attachedobject.customerid && (a.data.rows[0].attachedobject.customerid) || '');
                self.customergsm(a.data.rows[0].attachedobject && a.data.rows[0].attachedobject.gsm || '');
                self.customerstatus(a.data.rows[0].attachedobject.customer_status && a.data.rows[0].attachedobject.customer_status.Text || '');
                $("#abonedurumu").multiselect("refresh");
                self.description(a.data.rows[0].description);
                self.locationid(a.data.rows[0].attachedobject.locationid || (a.data.rows[0].attachedobject.block && a.data.rows[0].attachedobject.block.locationid) || '');
            }, null, null);          
            self.getpersonel();
            self.getCustomerStatus();
            self.getcategory();
           
            $('#daterangepicker1,#daterangepicker2,#daterangepicker3,#daterangepicker4').daterangepicker({
                "singleDatePicker": true,
                "autoApply": true,
                "linkedCalendars": false,
                "timePicker": true,
                "timePicker24Hour": true,
                "timePickerSeconds": true,
                "locale": {
                    "format": 'MM/DD/YYYY h:mm A',
                },
            });
            ko.applyBindings(dataModel, $("#bindingContainer")[0]);
        }
    }
}

dataModel.category.subscribe(function (v) {
    dataModel.getsubcategory();
});
dataModel.subcategory.subscribe(function (v) {
    dataModel.getcamapign();
});
