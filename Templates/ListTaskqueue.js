﻿/// <reference path="../Scripts/koc-typehead-v1.0.js" />
/// <reference path="../Scripts/crmwebapi.js" />
///

var dataModel = {

    multiSelectTagIds: "#blokadi,#taskNameFilter,#servissaglayici,#abonedurumu,#personel,#taskdurumu",
    typeHeadTagIds: "#site",
    tasks: ko.observableArray([]),
    ctstatuslist: ko.observableArray([]),
    isslist: ko.observableArray([]),
    taskstatuslist: ko.observableArray([]),
    personellist: ko.observableArray([]),
    taskqueuelist: ko.observableArray([]),
    totalpagecount:ko.observable(0),
    getTasks: function () {
        var self = this;
        crmAPI.getTaskFilter({}, function (a, b, c) {
            self.tasks(a);
            $("#taskNameFilter").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value'
            });
        }, null, null);
    
    },
    getCustomerStatus: function () {
        var self = this;
        crmAPI.getCustomerStatus( function (a, b, c) {
            self.ctstatuslist(a);
            $("#abonedurumu").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value'
            });
        }, null, null)
    },
    getisslist: function () {
        var self = this;
        crmAPI.getIssStatus(function (a, b, c) {
            self.isslist(a);
            $("#servissaglayici").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value'
            });
        }, null, null)
    },
    gettaskstatus: function () {
        var self = this;
        crmAPI.getTaskStatus(function (a, b, c) {
            self.taskstatuslist(a);
            $("#taskdurumu").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value'
            });
        }, null, null)
    },
    getpersonel: function () {
        var self = this;    
        crmAPI.getPersonel(function (a, b, c) {
            self.personellist(a);
            $("#personel").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value'
            });
        }, null, null)
    },
    pageNo: ko.observable(0),
    gettaskqueue: function () {
        var self = this;
        crmAPI.getTaskQueues({ pageNo: 1, rowsPerPage: 20, filter: {tableName:'taskqueue',keyField:'taskorderno'}},function (a, b, c) {
            self.taskqueuelist(a.data.rows);
            self.totalpagecount(a.data.pageCount);
        }, null, null)
    },

    renderBindings: function () {
        $("#blokadi").multiselect({
            includeSelectAllOption: true,
            selectAllValue: 'select-all-value'
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
