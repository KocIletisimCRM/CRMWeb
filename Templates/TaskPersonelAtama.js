/// <reference path="../Scripts/koc-typehead-v1.0.js" />
/// <reference path="../Scripts/knockout-3.3.0.js" />
/// <reference path="../Scripts/crmwebapi.js" />

var tqlFilter = crmAPI.getCookie("tqlFilter");

var dataModel = {
    pageCount: ko.observable(),
    pageNo: ko.observable(tqlFilter.pageNo || 1),
    rowsPerPage: ko.observable(tqlFilter.rowsPerPage || 20),
    errormessage: ko.observable(),
    errorcode: ko.observable(),
    selectedPersonelname: ko.observable(),
    selectedid: ko.observable(),
    selectedTaskname: ko.observable(),
    selectedTaskTypename: ko.observable(),
    selectedPersonelname: ko.observable(),
    selectedclosedtask: ko.observable(),
    selectedformedtask: ko.observableArray([]),
    selectedoffpersonel: ko.observable(),
    selectedappointedpersonel: ko.observable(),
    selectedclosedtasktype: ko.observable(),
    selectedformedtasktype: ko.observable(),
    tasks: ko.observableArray([]),
    tasksforclosedtype: ko.observableArray([]),
    tasksforformedtype: ko.observableArray([]),
    taskTypeList: ko.observableArray([]),
    personellist: ko.observableArray([]),
    appointlist: ko.observableArray([]), // atanan task list
    totalpagecount: ko.observable(0),
    totalRowCount: ko.observable(),
    selectedAtama: ko.observable(),
    user: ko.observable(),
    kaydetButonEnabla: ko.pureComputed(function () {
        return (dataModel.selectedformedtasktype() != null) && (dataModel.selectedappointedpersonel() != null)
    }),

    queryButtonClick: function () {
        var self = this;
        self.getFilter(1, dataModel.rowsPerPage());
    },
    getTasks: function () {
        var self = this;
        var data = {
            task: { fieldName: "taskname", op: 6, value: "" },
        };
        crmAPI.getTaskFilter(data, function (a, b, c) {
            self.tasks(a);
            $("#taskNameFilter,#closedtask,#formedtask").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: 'Seçiniz',
                nSelectedText: 'Task Seçildi!',
                numberDisplayed: 2,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
        }, null, null);
    },
    getTasksForClosedType: function () {
        var self = this;
        var data = {
            task: { fieldName: "tasktype", op: 2, value: self.selectedclosedtasktype() },
        };
        crmAPI.getTaskFilter(data, function (a, b, c) {
            self.tasksforclosedtype(a);
            $("#closedtask,#editclosedtask").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: 'Seçiniz',
                nSelectedText: 'Task Seçildi!',
                numberDisplayed: 2,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
            $('#closedtask,#editclosedtask').multiselect('select', self.tasksforclosedtype()).multiselect('rebuild');
        }, null, null);
    },
    getTasksForFormedType: function () {
        var self = this;
        var data = {
            task: { fieldName: "tasktype", op: 2, value: self.selectedformedtasktype() },
        };
        crmAPI.getTaskFilter(data, function (a, b, c) {
            self.tasksforformedtype(a);
            $("#formedtask,#editformedtask").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: 'Seçiniz',
                nSelectedText: 'Task Seçildi!',
                numberDisplayed: 2,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
            $('#formedtask,#editformedtask').multiselect('select', self.tasksforformedtype()).multiselect('rebuild');
        }, null, null);
    },
    getTaskType: function () {
        var self = this;
        crmAPI.getTaskType(function (a, b, c) {
            self.taskTypeList(a);
            $("#closedtasktype,#formedtasktype,#editclosedtasktype,#editformedtasktype,#taskTypeFilter").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: 'Seçiniz',
                nSelectedText: 'Task Türü Seçildi!',
                numberDisplayed: 2,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
            $('#closedtasktype,#formedtasktype,#editclosedtasktype,#editformedtasktype,#taskTypeFilter').multiselect('select', self.tasksforformedtype()).multiselect('rebuild');
        }, null, null)
    },
    getpersonel: function () {
        var self = this;
        crmAPI.getPersonel(function (a, b, c) {
            self.personellist(a);
            $("#editappointedpersonel,#editoffpersonel,#personel,#appointedpersonel,#offpersonel").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: 'Seçiniz',
                nSelectedText: 'Personel Seçildi!',
                numberDisplayed: 2,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
            $('#editappointedpersonel,#editoffpersonel,#personel,#appointedpersonel,#offpersonel').multiselect('select', self.personellist()).multiselect('rebuild');
        }, null, null)
    },
    clean: function () {
        var self = this;
        $("#taskNameFilter,#personel").multiselect('deselectAll', false);
        $("#taskNameFilter,#personel").multiselect('refresh');
        self.selectedPersonelname(null);
        self.selectedTaskname('');
        self.getFilter(dataModel.pageNo(), dataModel.rowsPerPage());
    },
    cleannewatama: function () {
        var self = this;
        self.selectedappointedpersonel(null),
        self.selectedoffpersonel(null),
        self.selectedclosedtasktype(null),
        self.selectedformedtasktype(null),
        self.selectedclosedtask(null),
        self.selectedformedtask(null)
        $('#offpersonel,#closedtasktype,#closedtask,#appointedpersonel,#formedtask,#formedtasktype').multiselect('rebuild');
        window.setTimeout(function () {
            $('#newap').modal('hide');
        }, 2000);
    },
    enterfilter: function (d, e) {
        var self = this;
        if (e && (e.which == 1 || e.which == 13)) {
            self.getFilter(1, self.rowsPerPage());
        }
        return true;
    },
    getFilter: function (pageno, rowsperpage) {
        var self = this;
        self.errormessage(null);
        self.errorcode(null);
        self.pageNo(pageno);
        self.rowsPerPage(rowsperpage);
        self.selectedTaskname($("#taskNameFilter").val() ? $("#taskNameFilter").val() : '');
        self.selectedPersonelname($("#personel").val() ? $("#personel").val() : '');
        self.selectedTaskTypename($("#taskTypeFilter").val() ? $("#taskTypeFilter").val() : '');
        var data = {
            pageNo: pageno,
            rowsPerPage: rowsperpage,
            task: self.selectedTaskname() ? { fieldName: "formedtask", op: 2, value: self.selectedTaskname() } : null,
            tasktype: self.selectedTaskTypename() ? { fieldName: "formedtasktype", op: 2, value: self.selectedTaskTypename() } : null,
            personel: self.selectedPersonelname() ? (self.selectedPersonelname() == "0" ? { fieldName: "appointedpersonel", op: 8, value: null } : { fieldName: "appointedpersonel", op: 2, value: self.selectedPersonelname() }) : null,
        };
        crmAPI.setCookie("tqlFilter", data);
        crmAPI.getTaskPersonelAtama(data, function (a, b, c) {
            self.appointlist(a.data.rows);
            self.pageCount(a.data.pagingInfo.pageCount);
            self.totalRowCount(a.data.pagingInfo.totalRowCount);
            self.errormessage(null);
            self.errorcode(null);
            $(".edit").click(function () {
                self.getEditAtama($(this).val());
            });
        }, null, null);
    },
    getEditAtama: function (id) {
        var self = this;
        var data = {
            id: { fieldName: 'id', op: 2, value: id },
        };
        crmAPI.getTaskPersonelAtama(data, function (a, b, c) {
            self.selectedclosedtasktype(a.data.rows[0].closedtasktype);
            self.selectedformedtasktype(a.data.rows[0].formedtasktype);
            self.selectedAtama(a.data.rows[0]);
            $("#editclosedtask,#editformedtask,#editappointedpersonel,#editoffpersonel,#editclosedtasktype,#editformedtasktype").multiselect({
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
            $('#editclosedtask,#editformedtask,#editappointedpersonel,#editoffpersonel,#editclosedtasktype,#editformedtasktype').multiselect('rebuild');
            if (a.data.rows[0].taskformed != null && $('#editformedtask').val() == "")
                dataModel.getEditAtama(id);
            if (a.data.rows[0].taskclosed != null && $('#editclosedtask').val() == "")
                dataModel.getEditAtama(id);
        }, null, null);
    },
    redirect: function () {
        window.location.href = "app.html";
    },
    getUserInfo: function () {
        var self = this;
        crmAPI.userInfo(function (a, b, c) {
            self.user(a);
        }, null, null)
    },
    navigate: {
        gotoPage: function (pageNo) {
            if (pageNo == dataModel.pageNo() || pageNo <= 0 || pageNo > dataModel.pageCount()) return;
            dataModel.getFilter(pageNo, dataModel.rowsPerPage());
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
    insertAtama: function () {
        var self = this;
        self.selectedformedtask($("#formedtask").val() ? $("#formedtask").val() : '');
        var data = {
            closedtasktype: self.selectedclosedtasktype(),
            closedtask: self.selectedclosedtask(),
            offpersonel: self.selectedoffpersonel(),
            formedtasktype: self.selectedformedtasktype(),
            formedtaskarray: self.selectedformedtask(),
            appointedpersonel: self.selectedappointedpersonel(),
        };
        crmAPI.insertPersonelAtama(data, function (a, b, c) {
            self.errormessage(a[Object.keys(a)[1]]);
            self.errorcode(a[Object.keys(a)[0]]);
            if (self.errorcode() == 1) {
                $('label[id=info]').css({ 'color': '#006400' });
                window.setTimeout(function () {
                    $('#newap').modal('hide');
                    self.getFilter(1, dataModel.rowsPerPage());
                }, 2000);
                self.cleannewatama();
            }
            else if (self.errorcode() == 2) {
                $('label[id=info]').css({ 'color': '#B22222' });
                self.cleannewatama();
            }
        }, null, null);
    },
    saveAtama: function () {
        var self = this;
        self.selectedAtama().formedtasktype = self.selectedformedtasktype();
        self.selectedAtama().closedtasktype = self.selectedclosedtasktype();
        var data = self.selectedAtama();
        crmAPI.updatePersonelAtama(data, function (a, b, c) {
            self.errormessage(a[Object.keys(a)[1]]);
            self.errorcode(a[Object.keys(a)[0]]);
            if (self.errorcode() == 1) {
                $('label[id=editinfo]').css({ 'color': '#006400' });
                window.setTimeout(function () {
                    $('#editap').modal('hide');
                    self.errormessage(null),
                    self.errorcode(null),
                    self.getFilter(1, dataModel.rowsPerPage());
                }, 2000);
            }
            else if (self.errorcode() == 2) {
                $('label[id=editinfo]').css({ 'color': '#B22222' });
            }
        }, null, null);
    },
    renderBindings: function () {
        var self = this;
        self.getUserInfo();
        self.getTasks();
        self.getTaskType();
        self.getpersonel();
        self.getFilter(dataModel.pageNo(), dataModel.rowsPerPage());
        ko.applyBindings(dataModel, $("#bindingContainer")[0]);
    },
}

$('#editap').on('hidden.bs.modal', function () {
    dataModel.selectedclosedtasktype(null);
    dataModel.selectedformedtasktype(null);
})

dataModel.selectedclosedtasktype.subscribe(function (v) {
    if (v == null) {
        dataModel.tasksforclosedtype([]);
        $('#closedtask').multiselect('select', dataModel.tasksforclosedtype()).multiselect('rebuild');
    }
    else {
        dataModel.getTasksForClosedType();
    }
});
dataModel.selectedformedtasktype.subscribe(function (v) {
    if (v == null) {
        dataModel.tasksforformedtype([]);
        $('#formedtask').multiselect('select', dataModel.tasksforformedtype()).multiselect('rebuild');
    }
    else {
        dataModel.getTasksForFormedType();
    }
});
