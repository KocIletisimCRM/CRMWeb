/// <reference path="../Scripts/koc-typehead-v1.0.js" />
/// <reference path="../Scripts/knockout-3.3.0.js" />
/// <reference path="../Scripts/crmwebapi.js" />
///

var dataModel = {
    pageCount: ko.observable(),
    pageNo: ko.observable(1),
    rowsPerPage: ko.observable(20),
    totalpagecount: ko.observable(0),
    totalRowCount: ko.observable(),

    stateList: ko.observableArray([]),
    selectedState: ko.observable(),
    selectedStateType: ko.observable(),
    selectedTaskstate:ko.observable(),
    tspList: ko.observableArray([]),
    savemessage: ko.observable(),
    savemessagecode: ko.observable(),

    newtaskstate: ko.observable(),
    newstatetype:ko.observable(),
    getTspTable: function (pageno, rowsperpage) {
        var self = this;
        self.pageNo(pageno);
        self.rowsPerPage(rowsperpage);
        self.selectedStateType($('#durumturu').val());
        var data = {
            pageNo: pageno,
            rowsPerPage: rowsperpage,
            taskstate: self.selectedState() ? { fieldName: "taskstateid", op: 2, value: self.selectedState() } : { fieldName: "taskstate", op: 6, value: '' },
            statetype: self.selectedStateType() ? { fieldName: "statetype", op: 2, value: self.selectedStateType() } : { fieldName: "statetype", op: 6, value: '' }
        };
        crmAPI.getTSPFilter(data, function (a, b, c) {
            self.tspList(a.data.rows);
            self.pageCount(a.data.pagingInfo.pageCount);
            self.totalRowCount(a.data.pagingInfo.totalRowCount);
            self.savemessage(null);
            self.savemessagecode(null);
            $(".edit").click(function () {
                self.getStateCard($(this).val());
                console.log($(this).val());
            });
        }, null, null);
    },
    getStateCard: function (taskstateid) {
        var self = this;
        var data = {
            taskstate: { fieldName: "taskstateid", op: 2, value: taskstateid } ,
        };
        crmAPI.getTSPFilter(data, function (a, b, c) {
            self.selectedTaskstate(a.data.rows[0]);
            $('#durum').val(a.data.rows[0].statetype)
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
        },null,null);
    },
    navigate: {
        gotoPage: function (pageNo) {
            if (pageNo == dataModel.pageNo() || pageNo <= 0 || pageNo > dataModel.pageCount()) return;
            dataModel.getTspTable(pageNo, dataModel.rowsPerPage());
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
            taskstate: {fieldName:'taskstate',op:6,value:''},
        };
        crmAPI.getTSPFilter(data, function (a, b, c) {
            self.stateList(a.data.rows);
            $("#durumtanimi,#durumturu").multiselect({
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
    clean: function () {
        var self = this;
        self.selectedState(null);
        self.selectedStateType(null);
        self.tspList(null);
        self.getTspTable(self.pageNo(), self.rowsPerPage());
     
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
    renderBindings: function () {
        var self = this;
        self.getStates();
        self.getTspTable(dataModel.pageNo(), dataModel.rowsPerPage());
        ko.applyBindings(dataModel, $("#bindingContainer")[0]);
    }

}