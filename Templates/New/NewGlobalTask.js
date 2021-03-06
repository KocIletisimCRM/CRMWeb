﻿var dataModel = {
    customername: ko.observable(),
    customerid: ko.observable(),
    tc: ko.observable(),
    gsm: ko.observable(),
    control: ko.observable(),
    attachedpersonelid: ko.observable(),
    creationdate: ko.observable(),
    personellist: ko.observableArray([]),
    regionlist: ko.observableArray([]),
    sitelist: ko.observableArray([]),
    sitelists: ko.observableArray([]),
    blocklist: ko.observableArray([]),
    customerlist: ko.observableArray([]),
    globaltasklist: ko.observableArray([]),
    region: ko.observable(),
    siteid: ko.observable(),
    blockid: ko.observable(),
    returntaskorderno: ko.observable(),
    selectedtaskid: ko.observable(),
    description: ko.observable(),
    isAttacheableCustomer: ko.observable(),
    newcustomer: ko.pureComputed(function () {
        return dataModel.selectedtaskid() == 10236 ? true : false;
    }),
    getpersonel: function () {
        self = this;
        self.personellist(null);
        crmAPI.getPersonel(function (a, b, c) {
            self.personellist(a);
            $("#salespersonel").multiselect({
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
            $("#salespersonel").multiselect("setOptions", dataModel.personellist()).multiselect("rebuild");
        }, null, null)
    },
    getregion: function () {
        var self = this;
        var data = { region: { fieldName: "region", value: '', op: 6 } }
        crmAPI.getSiteFilter(data, function (a, b, c) {
            self.regionlist(a);
            $("#region").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: 'Öbek Seçiniz',
                nSelectedText: 'Öbek Seçildi!',
                numberDisplayed: 2,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
        }, null, null);
    },
    getSite: function () {
        var self = this;
        self.sitelists(null);
        var data = { site: { fieldName: "region", value: self.region(), op: 6 } }
        crmAPI.getSiteFilter(data, function (a, b, c) {
            self.sitelists(a);
            for (var i = 0; i < self.sitelists().length; i++) {
                self.sitelists()[i].sitename = self.sitelists()[i].sitename.toUpperCase();
            }
            self.sitelist(self.sitelists());
            $("#salessite").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: 'Site Seçiniz',
                nSelectedText: 'Site Seçildi!',
                numberDisplayed: 2,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
            $("#salessite").multiselect("setOptions", dataModel.sitelist()).multiselect("rebuild");
        }, null, null);
    },
    getBlock: function () {
        var self = this;
        self.blocklist(null);
        var data = { block: { fieldName: "siteid", value: self.siteid(), op: 2 } }
        crmAPI.getSiteFilter(data, function (a, b, c) {
            self.blocklist(a);
            $("#salesblock").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: 'Blok Seçiniz',
                nSelectedText: 'Blok Seçildi!',
                numberDisplayed: 2,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
            $("#salesblock").multiselect("setOptions", dataModel.blocklist()).multiselect("rebuild");

        }, null, null);
    },
    getcustomer: function () {
        var self = this;
        self.customerlist(null);
        var data = { customer: { fieldName: "blockid", value: self.blockid(), op: 2 } }
        crmAPI.getSiteFilter(data, function (a, b, c) {
            self.customerlist(a);
            $("#salescustomer").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: 'Müşteri Seçiniz',
                nSelectedText: 'Müşteri Seçildi!',
                numberDisplayed: 2,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
            $("#salescustomer").multiselect("setOptions", dataModel.customerlist()).multiselect("rebuild");
        }, null, null);
    },
    getTasks: function () {
        var self = this;
        var taskids = [6117, 1, 6115, 8164, 65, 8165, 36, 85, 87, 3, 10207, 10231, 10236, 10256, 10255];
        var data = {
            task: { fieldName: "taskid", op: 7, value: taskids },
        };
        crmAPI.getTaskFilter(data, function (a, b, c) {
            self.globaltasklist(a);
            $("#newglobaltaskcombo").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: 'Task Seçiniz',
                nSelectedText: 'Task Seçildi!',
                numberDisplayed: 2,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
        }, null, null)
    },
    savesalestask: function () {
        var self = this;
        if (self.newcustomer() && !self.customername())
            return alert("Müşteri Bilgilerini Doldurunuz !");
        $('.btn').prop('disabled', true);
        var data = {
            newcustomer: self.newcustomer(),
            customername: self.customername(),
            tc: self.tc(),
            gsm: self.gsm(),
            creationdate: $("#daterangepicker11").val()?$("#daterangepicker11").val():null,
            customerid: self.isAttacheableCustomer() ? self.customerid() : null,
            attachedpersonelid: self.attachedpersonelid(),
            taskid: self.selectedtaskid(),
            description: self.description(),
            blockid: self.blockid(),
        };
        crmAPI.saveGlobalTask(data, function (a, b, c) {
            $('.btn').prop('disabled', true);
            self.returntaskorderno(a)
        }, null, null);
    },
    renderBindings: function () {
        var self = this;
        self.getpersonel();
        self.getregion();
        self.getTasks();
        $('#daterangepicker11').daterangepicker({
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
        ko.applyBindings(dataModel, $("#bindingmodal")[0]);
    }
}
dataModel.region.subscribe(function (v) {
    dataModel.getSite();
});
dataModel.siteid.subscribe(function (v) {
    dataModel.getBlock();
});
dataModel.blockid.subscribe(function () {
    dataModel.customerid(null);
    dataModel.getcustomer();
});
dataModel.returntaskorderno.subscribe(function (v) {
    window.location.href = "app.html#TaskQueueEditForm?" + v;
});
dataModel.selectedtaskid.subscribe(function () {
    var index = parseInt($("#newglobaltaskcombo").prop('selectedIndex'));
    dataModel.isAttacheableCustomer(dataModel.globaltasklist()[index - 1].attachableobjecttype == 16777220 ? true : false);
});