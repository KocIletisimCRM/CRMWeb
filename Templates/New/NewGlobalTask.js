
var dataModel = {

    customerid: ko.observable(),
    attachedpersonelid: ko.observable(),
    appointmentdate: ko.observable(),
    personellist: ko.observableArray([]),
    regionlist: ko.observableArray([]),
    sitelist: ko.observableArray([]),
    blocklist: ko.observableArray([]),
    customerlist: ko.observableArray([]),
    globaltasklist:ko.observableArray([]),
    region: ko.observable(),
    siteid: ko.observable(),
    blockid: ko.observable(),
    returntaskorderno: ko.observable(),
    selectedtaskid:ko.observable(),
    description: ko.observable(),
    isAttacheableCustomer: ko.observable(),
    getpersonel: function () {
        self = this;
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
        var data = { site: { fieldName: "region", value: self.region(), op: 6 } }
        crmAPI.getSiteFilter(data, function (a, b, c) {
            self.sitelist(a);
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
        }, null, null);
    },
    getBlock: function () {
        var self = this;
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
        }, null, null);
    },
    getcustomer: function () {
        var self = this;
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
        }, null, null);
    },
    getTasks: function () {
        var self = this;
        var  taskids = [6117,1,6115,65,8165,36,85,87];
        var data = {
            task: { fieldName: "taskid", op:7 , value:taskids},
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
        var data = {
            customerid: self.isAttacheableCustomer()? self.customerid():null,
            attachedpersonelid: self.attachedpersonelid(),
            taskid: self.selectedtaskid(),
            description: self.description(),
            blockid:self.blockid(),
        };
            crmAPI.saveGlobalTask(data, function (a, b, c) { self.returntaskorderno(a) }, null, null);
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
    dataModel.getcustomer();
});
dataModel.returntaskorderno.subscribe(function (v) {
    window.location.href = "app.html#TaskQueueEditForm?" + v;
});
dataModel.selectedtaskid.subscribe(function () {
 var index =parseInt($("#newglobaltaskcombo").prop('selectedIndex'));
  dataModel.isAttacheableCustomer(dataModel.globaltasklist()[index - 1].attachableobjecttype == 3000 ? true : false);
});