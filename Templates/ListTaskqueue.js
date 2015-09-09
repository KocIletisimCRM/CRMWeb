/// <reference path="../Scripts/koc-typehead-v1.0.js" />
/// <reference path="../Scripts/crmwebapi.js" />
///

var dataModel = {

    multiSelectTagIds: "#blokadi,#taskNameFilter,#servissaglayici,#abonedurumu,#personel,#taskdurumu",
    typeHeadTagIds: "#site",

    selectedTaskname:ko.observable(),
    sitename: ko.observable(),
    blockname: ko.observable(),
    customername: ko.observable(),
    customerstatus: ko.observable(),
    iss: ko.observable(),
    attachmentdate: ko.observable(),
    appointmentdate: ko.observable(),
    selectedPersonelname: ko.observable(),
    selectedTaskstatus: ko.observable(),
    consummationdate: ko.observable(),
    description:ko.observable(),

    tasks: ko.observableArray([]),
    ctstatuslist: ko.observableArray([]),
    isslist: ko.observableArray([]),
    taskstatuslist: ko.observableArray([]),
    personellist: ko.observableArray([]),
    taskqueuelist: ko.observableArray([]),
    totalpagecount: ko.observable(0),

    getTasks: function () {
        var self = this;
        crmAPI.getTaskFilter({}, function (a, b, c) {
            self.tasks(a);
            $("#taskNameFilter").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: 'Task Adını Seçiniz',
                nSelectedText: 'Task Adı Seçildi!',
                numberDisplayed: 2,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
        }, null, null);
    
    },
    getCustomerStatus: function () {
        var self = this;
        crmAPI.getCustomerStatus( function (a, b, c) {
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
    getisslist: function () {
        var self = this;
        crmAPI.getIssStatus(function (a, b, c) {
            self.isslist(a);
            $("#servissaglayici").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: 'ISS Seçiniz',
                nSelectedText: 'ISS Seçildi!',
                numberDisplayed: 2,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
        }, null, null)
    },
    gettaskstatus: function () {
        var self = this;
        crmAPI.getTaskStatus(function (a, b, c) {
            self.taskstatuslist(a);
            $("#taskdurumu").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: 'Task Durumunu Seçiniz',
                nSelectedText: 'Task Durumu Seçildi!',
                numberDisplayed: 2,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
        }, null, null)
    },
    getpersonel: function () {
        var self = this;    
        crmAPI.getPersonel(function (a, b, c) {
            self.personellist(a);
            $("#personel").multiselect({
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
    gettaskqueue: function () {
        var self = this;
        var data = {
            pageNo: 1,
            rowsPerPage: 20,
            site: { fieldName: "sitename", op: 6, value: this.sitename() },
            block: { fieldName: "blockname", op: 6, value: this.blockname() },
            customer: { fieldName: "customername", op: 6, value: this.customername() },
            task: { fieldName: "taskname", op: 6, value: this.selectedTaskname() },
            personel: { fieldName: "personelname", op: 6, value: this.selectedPersonelname() },
            taskstate: { fieldName: "taskstate", op: 6, value: this.selectedTaskstatus() },
        };
        crmAPI.getTaskQueues(data, function (a, b, c) {
            self.taskqueuelist(a.data.rows);
            self.totalpagecount(a.data.pageCount);
        }, null, null)
    },
    getFilter: function () {
        var self = this;
        var data = {
            pageNo: 1,
            rowsPerPage: 20,
            site: { fieldName: "sitename", op: 6, value: this.sitename() },
            block: { fieldName: "blockname", op: 6, value: this.blockname() },
            customer: { fieldName: "customername", op: 6, value: this.customername() },
            task: { fieldName: "taskname", op: 6, value: this.selectedTaskname() },
            personel: { fieldName: "personelname", op: 6, value: this.selectedPersonelname() },
            taskstate: { fieldName: "taskstate", op: 6, value: this.selectedTaskstatus() },
        };
        crmAPI.getTaskQueues(data, function (a, b, c) {
            self.taskqueuelist(a.data.rows);
            self.totalpagecount(a.data.pageCount);
        }, null, null)
    },
    pageNo: ko.observable(0),
    select :function (d, e) {
        $("#customer tr").removeClass("selected");
        $(e.currentTarget).addClass("selected");
        this.customerid = d.customerid;
    },


    renderBindings: function () {
        $("#blokadi").multiselect({
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
        this.getisslist();
        this.gettaskstatus();
        this.getTasks();
        this.getpersonel();
        this.getCustomerStatus();
        this.gettaskqueue();
        ko.applyBindings(dataModel, $("#bindingContainer")[0]);

        $(this.typeHeadTagIds).kocTypeHead();
        
    }

}
