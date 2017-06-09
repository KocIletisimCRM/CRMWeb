var dataModel = {
    customer: ko.observable({
        superonlineCustNo: ko.observable(),
        tckimlikno: ko.observable(),
        customername: ko.observable(),
        gsm: ko.observable(),
        phone: ko.observable(),
        customerstatus: ko.observable(),
        iss: ko.observable(),
        netstatu: ko.observable(),
        telstatu: ko.observable(),
        tvstatu: ko.observable(),
        turkcellTv: ko.observable(),
        gsmstatu: ko.observable(),
        description: ko.observable()
    }),
    customerid: ko.observable(),
    attachedpersonelid: ko.observable(),
    creationdate: ko.observable(),
    personellist: ko.observableArray([]),
    regionlist: ko.observableArray([]),
    sitelist: ko.observableArray([]),
    sitelists: ko.observableArray([]),
    blocklist: ko.observableArray([]),
    customerlist: ko.observableArray([]),
    globaltasklist: ko.observableArray([]),
    ctstatuslist: ko.observableArray([]),
    issStatusList: ko.observableArray([]),
    netStatusList: ko.observableArray([]),
    telStatusList: ko.observableArray([]),
    tvStatusList: ko.observableArray([]),
    TurkcellTvStatusList: ko.observableArray([]),
    gsmStatusList: ko.observableArray([]),
    region: ko.observable(),
    siteid: ko.observable(),
    blockid: ko.observable(),
    returntaskorderno: ko.observable(),
    selectedtaskid: ko.observable(),
    description: ko.observable(),
    isAttacheableCustomer: ko.observable(),
    getpersonel: function () {
        self = this;
        self.personellist(null);
        crmAPI.getPersonel(function (a, b, c) {
            self.personellist(a);
            $("#csalespersonel").multiselect({
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
            $("#csalespersonel").multiselect("setOptions", dataModel.personellist()).multiselect("rebuild");
        }, null, null)
    },
    getregion: function () {
        var self = this;
        var data = { region: { fieldName: "region", value: '', op: 6 } }
        crmAPI.getSiteFilter(data, function (a, b, c) {
            self.regionlist(a);
            $("#cregion").multiselect({
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
            $("#csalessite").multiselect({
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
            $("#csalessite").multiselect("setOptions", dataModel.sitelist()).multiselect("rebuild");
        }, null, null);
    },
    getBlock: function () {
        var self = this;
        self.blocklist(null);
        var data = { block: { fieldName: "siteid", value: self.siteid(), op: 2 } }
        crmAPI.getSiteFilter(data, function (a, b, c) {
            self.blocklist(a);
            $("#csalesblock").multiselect({
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
            $("#csalesblock").multiselect("setOptions", dataModel.blocklist()).multiselect("rebuild");

        }, null, null);
    },
    getcustomer: function () {
        var self = this;
        self.customerlist(null);
        var data = { customer: { fieldName: "blockid", value: self.blockid(), op: 2 } }
        crmAPI.getSiteFilter(data, function (a, b, c) {
            self.customerlist(a);
            $("#csalescustomer").multiselect({
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
            $("#csalescustomer").multiselect("setOptions", dataModel.customerlist()).multiselect("rebuild");
        }, null, null);
    },
    getTasks: function () {
        var self = this;
        var taskids = [6117];
        var data = {
            task: { fieldName: "taskid", op: 7, value: taskids },
        };
        crmAPI.getTaskFilter(data, function (a, b, c) {
            self.globaltasklist(a);
            $("#cnewtask").multiselect({
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
    getCustomerStatus: function () {
        var self = this;
        crmAPI.getCustomerStatus(function (a, b, c) {
            self.ctstatuslist(a);
            $("#cabonedurumuinfo").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: 'Seçiniz',
                nSelectedText: 'Seçildi!',
                numberDisplayed: 2,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
        }, null, null)
    },
    getIssStatus: function () {
        var self = this;
        crmAPI.getIssStatus(function (a, b, c) {
            self.issStatusList(a);
            $("#cissstatus").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: 'Seçiniz',
                nSelectedText: 'Seçildi!',
                numberDisplayed: 2,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
        }, null, null);
    },
    getNetStatus: function () {
        var self = this;
        crmAPI.getNetStatus(function (a, b, c) {
            self.netStatusList(a);
            $("#cnetstatus").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: 'Seçiniz',
                nSelectedText: 'Seçildi!',
                numberDisplayed: 2,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
        }, null, null)
    },
    getTelStatus: function () {
        var self = this;
        crmAPI.getTelStatus(function (a, b, c) {
            self.telStatusList(a);
            $("#ctelstatus").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: 'Seçiniz',
                nSelectedText: 'Seçildi!',
                numberDisplayed: 2,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
        }, null, null)
    },
    getTvKullanımıStatus: function () {
        var self = this;
        crmAPI.getTvKullanımıStatus(function (a, b, c) {
            self.tvStatusList(a);
            $("#ctvstatus").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: 'Seçiniz',
                nSelectedText: 'Seçildi!',
                numberDisplayed: 2,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
        }, null, null)
    },
    getTurkcellTvStatus: function () {
        var self = this;
        crmAPI.getTurkcellTvStatus(function (a, b, c) {
            self.TurkcellTvStatusList(a);
            $("#cttvstatus").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: 'Seçiniz',
                nSelectedText: 'Seçildi!',
                numberDisplayed: 2,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
        }, null, null)
    },
    getGsmStatus: function () {
        var self = this;
        crmAPI.getGsmStatus(function (a, b, c) {
            self.gsmStatusList(a);
            $("#cgsmstatus").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: 'Seçiniz',
                nSelectedText: 'Seçildi!',
                numberDisplayed: 2,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
        }, null, null)
    },
    savesalestask: function () {
        var self = this;
        if ((self.customer() && !self.customer().customername()) || !self.customerid())
            return alert("Müşteri Bilgilerini Doldurunuz !");
        var data = {
            creationdate: $("#daterangepicker11").val() ? $("#daterangepicker11").val() : null,
            customerid: self.customerid(),
            attachedpersonelid: self.attachedpersonelid(),
            taskid: self.selectedtaskid(),
            description: self.description(),
            customer: {
                superonlineCustNo: self.customer().superonlineCustNo(),
                tckimlikno: self.customer().tckimlikno(),
                customername: self.customer().customername(),
                gsm: self.customer().gsm(),
                phone: self.customer().phone(),
                customerstatus: self.customer().customerstatus(),
                iss: self.customer().iss(),
                netstatu: self.customer().netstatu(),
                telstatu: self.customer().telstatu(),
                tvstatu: self.customer().tvstatu(),
                turkcellTv: self.customer().turkcellTv(),
                gsmstatu: self.customer().gsmstatu(),
                description: self.customer().description(),
            }
        };
        crmAPI.saveTtvTask(data, function (a, b, c) { self.returntaskorderno(a) }, null, null);
    },
    renderBindings: function () {
        var self = this;
        self.getpersonel();
        self.getregion();
        self.getTasks();
        self.getCustomerStatus();
        self.getIssStatus();
        self.getNetStatus();
        self.getTelStatus();
        self.getTvKullanımıStatus();
        self.getTurkcellTvStatus();
        self.getGsmStatus();
        $('#cdaterangepicker').daterangepicker({
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
        ko.applyBindings(dataModel, $("#modalbinding")[0]);
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
    var index = parseInt($("#cnewtask").prop('selectedIndex'));
    dataModel.isAttacheableCustomer(dataModel.globaltasklist()[index - 1].attachableobjecttype == 16777220 ? true : false);
});