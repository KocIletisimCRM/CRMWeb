﻿/// <reference path="../Scripts/koc-typehead-v1.0.js" />
/// <reference path="../Scripts/knockout-3.3.0.js" />
/// <reference path="../Scripts/crmwebapi.js" />
///

var dataModel = {
    pageCount: ko.observable(),
    pageNo: ko.observable(1),
    rowsPerPage: ko.observable(20),
    totalpagecount: ko.observable(0),
    totalRowCount: ko.observable(),

    taskList: ko.observableArray([]),
    stateList:ko.observableArray([]),
    selectedState: ko.observable(),
    selectedTask: ko.observable(),
    selectedTSM: ko.observable(),
    tsmList: ko.observableArray([]),
    savemessage: ko.observable(),
    savemessagecode: ko.observable(),


    getTsmTable: function (pageno, rowsperpage) {
        var self = this;
        self.pageNo(pageno);
        self.rowsPerPage(rowsperpage);
        var data = {
            pageNo: pageno,
            rowsPerPage: rowsperpage,
            taskstate: self.selectedState() ? { fieldName: "taskstateid", op: 2, value: self.selectedState() } : { fieldName: "taskstate", op: 6, value: '' },
            task: self.selectedTask() ? { fieldName: "taskname", op: 6, value: self.selectedTask() } : { fieldName: "taskname", op: 6, value: '' }
        };
        crmAPI.getTaskStateMatches(data, function (a, b, c) {
            self.tsmList(a.data.rows);
            self.pageCount(a.data.pagingInfo.pageCount);
            self.totalRowCount(a.data.pagingInfo.totalRowCount);
            self.savemessage(null);
            self.savemessagecode(null);
            $(".edit").click(function () {
                self.getTSMCard($(this).val());
                console.log($(this).val());
            });
        }, null, null);
    },
    getTSMCard: function (id) {
        var self = this;
        var data = {
            taskstatematches: { fieldName: "id", op: 2, value: id },
        };
        crmAPI.getTaskStateMatches(data, function (a, b, c) {
            self.selectedTSM(a.data.rows[0]);
            $("#edittask,#editstatus").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: ' Seçiniz',
                numberDisplayed: 2,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'

            });
        }, null, null);
    },
    saveTSP: function () {
        var self = this;
        var data = self.selectedTaskstate();
        crmAPI.saveTaskState(data, function (a, b, c) {
            self.savemessage(a.errorMessage);
            self.savemessagecode(a.errorCode);
            window.setTimeout(function () {
                $('#myModal').modal('hide');
                self.getTspTable(1, dataModel.rowsPerPage());
            }, 1000);
        }, null, null);
    },
    insertTSP: function () {
        var self = this;
        self.newstatetype($('#newstatetype').val());
        var data = {
            taskstate: self.newtaskstate(),
            statetype: self.newstatetype(),
        };
        crmAPI.insertTaskState(data, function (a, b, c) {
            self.savemessage(a.errorMessage);
            self.savemessagecode(a.errorCode);
            window.setTimeout(function () {
                $('#myModal1').modal('hide');
                self.getTspTable(1, dataModel.rowsPerPage());
            }, 1000);
        }, null, null);
    },
    navigate: {
        gotoPage: function (pageNo) {
            if (pageNo == dataModel.pageNo() || pageNo <= 0 || pageNo > dataModel.pageCount()) return;
            dataModel.getTsmTable(pageNo, dataModel.rowsPerPage());
        },
        gotoFirstPage: function () {
            dataModel.navigate.gotoPage(1);
        },
        gotoLastPage: function () {
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
    getStates: function () {
        var self = this;
        var data = {
            taskstate: { fieldName: 'taskstate', op: 6, value: '' },
        };
        crmAPI.getTSPFilter(data, function (a, b, c) {
            self.stateList(a.data.rows);
            $("#durumturu").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: 'Durum Seçiniz',
                numberDisplayed: 2,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'

            });

        });
    },
    getTaskList: function () {
        var self = this;
        var data = {
            task: { fieldName: "taskname", op: 6, value: "" },
        };
        crmAPI.getTaskFilter(data, function (a, b, c) {
            self.taskList(a);
            $('#durumtanimi').multiselect({
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
    clean: function () {
        var self = this;
        self.selectedState(null);
        self.selectedTask(null);
        self.tsmList(null);
        self.getTsmTable(self.pageNo(), self.rowsPerPage());

    },
    
    renderBindings: function () {
        var self = this;
        self.getStates();
        self.getTaskList();
        self.getTsmTable(dataModel.pageNo(), dataModel.rowsPerPage());
        ko.applyBindings(dataModel, $("#bindingContainer")[0]);
    }

}