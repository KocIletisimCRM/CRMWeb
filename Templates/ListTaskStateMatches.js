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


    taskList: ko.observableArray([]),
    stockList: ko.observableArray([]),
    stateList: ko.observableArray([]),
    docList: ko.observableArray([]),
    selectedState: ko.observable(),
    selectedTask: ko.observable(),
    selectedTSM: ko.observable(),
    tsmList: ko.observableArray([]),
    savemessage: ko.observable(),
    savemessagecode: ko.observable(),
    taskstatecontrol: ko.observable(true),
    autoTaskIds: ko.observableArray([]),
    opTaskIds: ko.observableArray([]),
    stockIds: ko.observableArray([]),
    docIds: ko.observableArray([]),

    getTsmTable: function (pageno, rowsperpage) {
        var self = this;
        self.pageNo(pageno);
        self.rowsPerPage(rowsperpage);
        var data = {
            pageNo: pageno,
            rowsPerPage: rowsperpage,
            taskstate: self.selectedState() ? { fieldName: "taskstateid", op: 2, value: self.selectedState() } : { fieldName: "taskstate", op: 6, value: '' },
            task: self.selectedTask() ? { fieldName: "taskid", op: 2, value: self.selectedTask() } : { fieldName: "taskname", op: 6, value: '' }
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
            if (a.data.rows[0].taskstatepool.taskstateid == 9116)
                self.taskstatecontrol(false);
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
    getStates: function () {
        var self = this;
        var data = {
            taskstate: { fieldName: 'taskstate', op: 6, value: '' },
        };
        crmAPI.getTSPFilter(data, function (a, b, c) {
            self.stateList(a.data.rows);
            $("#newstatus").multiselect({
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
            $('#durumtanimi,#editmandatorytask,#editoptask,#newoptask,#newmandatorytask,#newtaskcombo').multiselect({
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
            $('#editmandatorytask').multiselect('select', self.autoTaskIds());
            $('#editoptask').multiselect('select', self.opTaskIds());
        }, null, null);

    },
    getStockCard: function () {
        var self = this;
        var data = {
            stockcard: { fieldName: 'productname', op: 6, value: '' },
        };
        crmAPI.getStockCards(data, function (a, b, c) {
            self.stockList(a.data.rows);
            $('#editstock,#newstock').multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: 'ÜrünSeçiniz',
                nSelectedText: 'Ürün Seçildi!',
                numberDisplayed: 2,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'

            });
            $('#editstock').multiselect('select', self.stockIds());
        }, null, null);

    },
    getDocs: function () {
        var self = this;
        var data = {
            documentname: { fieldName: 'documentname', op: 6, value: '' },
        };
        crmAPI.getDocuments(data, function (a, b, c) {
            self.docList(a.data.rows);
            $('#editdoc,#newdoc').multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: 'Belge Seçiniz',
                nSelectedText: 'BelgeSeçildi!',
                numberDisplayed: 2,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'

            });
            $('#editdoc').multiselect('select', self.docIds());
        }, null, null);
    },

    saveTsm: function () {
        var self = this;
        self.selectedTSM().automandatorytasks = $("#editmandatorytask").val() ? $("#editmandatorytask").val().toString() : null;
        self.selectedTSM().autooptionaltasks = $("#editoptask").val() ? $("#editoptask").val().toString() : null;
        self.selectedTSM().stockcards = $("#editstock").val() ? $("#editstock").val().toString() : null;
        self.selectedTSM().documents = $("#editdoc").val() ? $("#editdoc").val().toString() : null;
        var data = self.selectedTSM();
        crmAPI.saveTaskStateMatches(data, function (a, b, c) {
            self.savemessage(a.errorMessage);
            self.savemessagecode(a.errorCode);
            window.setTimeout(function () {
                $('#myModal').modal('hide');
                self.getTsmTable(1, dataModel.rowsPerPage());
            }, 1000);
        }, null, null);
    },
    insertTSM: function () {
        var self = this;

        var data = {
            task: { taskid: $("#newtaskcombo").val() ? $("#newtaskcombo").val().toString() : null, },
            taskstatepool: { taskstateid: $("#newstatus").val() ? $("#newstatus").val().toString() : null, },
            automandatorytasks: $("#newmandatorytask").val() ? $("#newmandatorytask").val().toString() : null,
            autooptionaltasks: $("#newoptask").val() ? $("#newoptask").val().toString() : null,
            stockcards: $("#newstock").val() ? $("#newstock").val().toString() : null,
            documents: $("#newdoc").val() ? $("#newdoc").val().toString() : null,
        };
        if (data.task.taskid != null && data.taskstatepool.taskstateid != null)
            crmAPI.insertTaskStateMatches(data, function (a, b, c) {
                self.savemessage(a.errorMessage);
                self.savemessagecode(a.errorCode);
                window.setTimeout(function () {
                    $('#myModal1').modal('hide');
                    self.getTsmTable(1, dataModel.rowsPerPage());
                }, 1000);
            }, null, null);
        else
            alert("Eksik yada hatalı bilgi girdiniz.!");
    },
    clean: function () {
        var self = this;
        self.selectedState(null);
        self.selectedTask(null);
        self.tsmList(null);
        self.getTsmTable(self.pageNo(), self.rowsPerPage());

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
    enterfilter: function (d, e) {
        var self = this;
        if (e && (e.which == 1 || e.which == 13)) {
            self.getTsmTable(1, dataModel.rowsPerPage());
        }
        return true;
    },
    renderBindings: function () {
        var self = this;
        self.getStates();
        self.getTaskList();
        self.getTsmTable(dataModel.pageNo(), dataModel.rowsPerPage());
        $('#new').click(function () {
            self.getTaskList();
            self.getStockCard();
            self.getStates();
            self.getDocs();
        });

        ko.applyBindings(dataModel, $("#bindingContainer")[0]);
    }
}
dataModel.selectedTSM.subscribe(function (v) {
    if (v.automandatorytasks != null)
        dataModel.autoTaskIds(v.automandatorytasks.split(","));
    else
        dataModel.autoTaskIds(null);

    if (v.autooptionaltasks != null)
        dataModel.opTaskIds(v.autooptionaltasks.split(","));
    else
        dataModel.opTaskIds(null);
    dataModel.getTaskList();

    if (v.stockcards != null)
        dataModel.stockIds(v.stockcards.split(","));
    else
        dataModel.stockIds(null);
    dataModel.getStockCard();
    if (v.documents != null)
        dataModel.docIds(v.documents.split(","));
    else
        dataModel.docIds(null);
    dataModel.getDocs();
});