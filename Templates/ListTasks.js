
/// <reference path="../Scripts/koc-typehead-v1.0.js" />
/// <reference path="../Scripts/knockout-3.3.0.js" />
/// <reference path="../Scripts/crmwebapi.js" />

var dataModel = {
    tasklist: ko.observableArray([]),
    taskCombo: ko.observableArray([]),
    selectedTask:ko.observable(),
    taskname:ko.observable(),
    pageCount: ko.observable(),
    pageNo: ko.observable(1),
    rowsPerPage: ko.observable(20),
    selectedTaskid: ko.observable(),
    objectTypeList: ko.observableArray([]),
    selectedObjectType: ko.observable(),
    personelTypeList:ko.observableArray([]),
    selectedPersonelType: ko.observable(),
    taskTypeList:ko.observableArray([]),
    savemessage: ko.observable(),
    saveerrorcode:ko.observable(),
    newtaskname: ko.observable(),
    newtaskscore: ko.observable(),
    newpersoneltype: ko.observable(),
    newobjecttype: ko.observable(),
    newtasktype:ko.observable(),

    //combo için
    getTaskList: function () {
        var self = this;
        var data = {
            task: { fieldName: "taskname", op: 6, value: "" },
        };
        crmAPI.getTaskDefination(data, function (a, b, c) {
            self.taskCombo(a);
            $('#taskadi').multiselect({
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
    //sayfadaki tablo için
    getTask: function (pageno,rowsperpage) {
        var self = this;
        self.pageNo(pageno);
        self.rowsPerPage(rowsperpage);
        var data = {
            pageNo:pageno,
            rowsPerPage:rowsperpage,
            task: self.selectedTaskid() ? { fieldName: 'taskid', op: 2, value: self.selectedTaskid() } : { fieldName: 'taskname', op: 6, value: '' },
        };
        crmAPI.getTaskDefination(data, function (a, b, c) {
            self.tasklist(a);
            self.savemessage(null);
            self.saveerrorcode(null);
            $(".edit").click(function () {
                self.getTaskCard($(this).val());
            });
            $("#new").click(function () {
                self.getObjectType();
                self.getPersonelType();
            });

        }, null, null);
    },
    getObjectType: function () {
        var self = this;
        var data = {
            objecttype: { fieldName: 'typname', op: 6, value: '' },
        };
        crmAPI.getTaskFilter(data,function (a, b, c) {
            self.objectTypeList(a);
            $("#ilgi").multiselect({
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
        }, null, null)
    },
    getPersonelType: function () {
        var self = this;
        var data = {
            personeltype: { fieldName: 'typname', op: 6, value: '' },
        };
        crmAPI.getTaskFilter(data, function (a, b, c) {
            self.personelTypeList(a);
            $("#gorevli").multiselect({
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
        }, null, null);
    },
    //getTaskType: function () {
    //    var self = this;
    //    var data = {
    //        taskType: {fieldName:'TaskTypeName',op:6,value:''},
    //    }; 
    //    crmAPI.getTaskFilter(data, function (a, b, c) {
    //        self.taskTypeList(a);
    //        $("#tasktype").multiselect({
    //            includeSelectAllOption: true,
    //            selectAllValue: 'select-all-value',
    //            maxHeight: 250,
    //            buttonWidth: '100%',
    //            nonSelectedText: 'Seçiniz',
    //            numberDisplayed: 2,
    //            selectAllText: 'Tümünü Seç!',
    //            enableFiltering: true,
    //            filterPlaceholder: 'Ara'
    //        });
    //    }, null, null);
    //},
    getTaskCard: function (taskid) {
        var self = this;
        var data = {
            task: {fieldname:'taskid',op:2,value:taskid}
        };
        crmAPI.getTaskDefination(data, function (a, b, c) {
            self.selectedTask(a[0]);
            self.getObjectType();
            self.getPersonelType();
        }, null, null);
    },
    saveTask: function () {
        var self = this;
        self.selectedTask().objecttypes = { typeid: $('#ilgi').val() };
        self.selectedTask().personeltypes = { typeid: $('#gorevli').val() };
        self.selectedTask().tasktypes = { TaskTypeId: $('#edittaskturu').val() };
        var data = self.selectedTask();
        crmAPI.saveTask(data, function (a, b, c) {
            self.savemessage(a.errorMessage);
            self.saveerrorcode(a.errorCode);
            window.setTimeout(function () {
                $('#myModal').modal('hide');
                self.getTask(1, dataModel.rowsPerPage());
            }, 1000);
        },null,null);
    },
    insertTask: function () {
        var self = this;
        var data = {
            taskname: self.newtaskname(),
            tasktypes: { TaskTypeId: $("#newtaskturu").val()},
            objecttypes: { typeid: self.newobjecttype() },
            personeltypes: { typeid: self.newpersoneltype() },
            performancescore:self.newtaskscore(),
        };
        crmAPI.insertTask(data, function (a, b, c) {
            self.saveerrorcode(a.errorCode);
            self.savemessage(a.errorMessage);
            window.setTimeout(function () {
                $('#myModal1').modal('hide');
                self.getTask(1, dataModel.rowsPerPage());
            }, 1000);
        }, null, null);
    },

    navigate: {
        gotoPage: function (pageNo) {
            if (pageNo == dataModel.pageNo() || pageNo <= 0 || pageNo > dataModel.pageCount()) return;
            dataModel.getTask(pageNo, dataModel.rowsPerPage());
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
    clean: function () {
        var self = this;
        self.selectedTaskid(null);
        self.taskCombo(null);
        self.getTask(self.pageNo(), self.rowsPerPage());
    },
    renderBindings: function () {
        var self = this;
        self.getTask(dataModel.pageNo(), dataModel.rowsPerPage());
        self.getTaskList();
        ko.applyBindings(dataModel, $("#bindingContainer")[0]);
    },
}