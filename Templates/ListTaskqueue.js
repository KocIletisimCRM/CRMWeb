﻿/// <reference path="../Scripts/koc-typehead-v1.0.js" />
/// <reference path="../Scripts/knockout-3.3.0.js" />
/// <reference path="../Scripts/crmwebapi.js" />
///

var dataModel = {
    multiSelectTagIds: "#blokadi,#taskNameFilter,#servissaglayici,#abonedurumu,#personel,#taskdurumu",
    typeHeadTagIds: "#site",

    pageCount: ko.observable(),
    pageNo: ko.observable(1),
    rowsPerPage: ko.observable(20),
    querytime: ko.observable(0),
    isLoading:ko.observable(),
    selectedTaskname:ko.observable(),
    sitename: ko.observable(),
    blockname: ko.observable(),
    customername: ko.observable(),
    customerstatus: ko.observable(),
    selectedIss: ko.observable(),
    attachmentDate: ko.observable(),
    appointmentDate: ko.observable(),
    consummationDate:ko.observable(),
    selectedPersonelname: ko.observable(),
    selectedTaskstatus: ko.observable(),
    selectedCustomerstatus:ko.observable(),
    description: ko.observable(),
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
    clean: function () {
        var self = this;
        self.appointmentDate(null);
        self.attachmentDate(null);
        self.customername(null);
        self.consummationDate(null);
        self.sitename(null);
        self.selectedCustomerstatus(null);
        self.selectedPersonelname(null);
        self.selectedIss(null);
        self.selectedTaskname(null);
        self.selectedTaskstatus(null);
    },

    getFilter: function (pageno,rowsperpage) {
        var self = this;
        self.pageNo(pageno);
        self.rowsPerPage(rowsperpage);
        self.isLoading(true);
        var data = {
            pageNo:pageno,
            rowsPerPage:rowsperpage,
            site: this.sitename()? { fieldName: "sitename", op: 6, value: this.sitename() }: null,
            customer: this.customername()?{ fieldName: "customername", op: 6, value: this.customername() }:null,
            task:this.selectedTaskname()? { fieldName: "taskname", op: 6, value: this.selectedTaskname() }:null,
            personel: this.selectedPersonelname() ? { fieldName: "personelname", op: 6, value: this.selectedPersonelname() } : null,
            taskstate: this.selectedTaskstatus() ?{ fieldName: "taskstate", op: 6, value: this.selectedTaskstatus() }:null,
            iss: this.selectedIss() ? { fieldName: "issText", op: 6, value: this.selectedIss() } : null,
            customerstatus: this.selectedCustomerstatus() ? { fieldName: "Text", op: 6, value: this.selectedCustomerstatus() } : null,
            attachmentDate: this.attachmentDate() ? this.attachmentDate() : null,
            appointmentDate: this.appointmentDate() ? this.appointmentDate() : null,
            consummationDate:this.consummationDate()? this.consummationDate() :null,
        };
        crmAPI.getTaskQueues(data, function (a, b, c) {
            self.taskqueuelist(a.data.rows);
            self.pageCount(a.data.pagingInfo.pageCount);
            self.querytime(a.performance.TotalResponseDuration);
            self.isLoading(false);
        }, null, null)
    },
    select :function (d, e) {
        $("#customer tr").removeClass("selected");
        $(e.currentTarget).addClass("selected");
        this.customerid = d.customerid;
    },
    navigate: {
        gotoPage: function (pageNo) {
            if (pageNo == dataModel.pageNo() || pageNo <= 0 || pageNo > dataModel.pageCount()) return;
            dataModel.getFilter(pageNo, dataModel.rowsPerPage());
            dataModel.isLoading(false);
        },
        gotoFirstPage: function(){
            dataModel.navigate.gotoPage(1);
        },
        gotoLastPage:function(){
            dataModel.navigate.gotoPage(dataModel.pageCount());
        },
        gotoNextPage: function () {
            var pc = dataModel.pageNo() + 1;
            if (pc >= dataModel.pageCount()) return;
            dataModel.navigate.gotoPage(pc);
        },
        gotoBackPage: function () {
            var pc = dataModel.pageNo() - 1;
            if (pc <= 0) return;
            dataModel.navigate.gotoPage(pc);
        },
    },
    
    renderBindings: function () {
        var self = this;
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
        $(function () {
            $('#datetimepicker1,#datetimepicker2,#datetimepicker3').datetimepicker();
        });
        $('#daterangepicker1,#daterangepicker2,#daterangepicker3').daterangepicker({
            "timePicker": true,
            ranges: {
                'Bugün': [moment(), moment().add(1,'days')],
                'Dün': [moment().subtract(1, 'days'), moment()],
                'Son 7 Gün': [moment().subtract(6, 'days'), moment()],
                'Son 30 Gün': [moment().subtract(29, 'days'), moment()],
                'Bu Ay': [moment().startOf('month'), moment().endOf('month')],
                'Geçen Ay': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            }
        });

        self.getisslist();
        self.gettaskstatus();
        self.getTasks();
        self.getpersonel();
        self.getCustomerStatus();
        self.getFilter(dataModel.pageNo(), dataModel.rowsPerPage());
        

        ko.applyBindings(dataModel, $("#bindingContainer")[0]);

        $(this.typeHeadTagIds).kocTypeHead();
        
    }
   
}