
var dataModel = {

    pageCount: ko.observable(),
    pageNo: ko.observable(1),
    rowsPerPage: ko.observable(20),
    totalRowCount: ko.observable(),
    savemessage: ko.observable(),
    savemessagecode: ko.observable(),

    docList: ko.observableArray([]),
    selectedDoc: ko.observable(),
    docname: ko.observable(),
    docdescription:ko.observable(),
    newdocname:ko.observable(),
    newdocdescription:ko.observable(),
    getDocuments: function (pageno, rowsperpage) {
        var self = this;
        var data = {
            pageNo: pageno,
            rowsPerPage: rowsperpage,
            documentname: self.docname() ?{ fieldName: 'documentname', op: 6, value: self.docname() }: { fieldName: 'documentname', op: 6, value: '' },
            documentdescription: self.docdescription() ? { fieldName: 'documentdescription', op: 6, value: self.docdescription() } : null,
        };
        crmAPI.getDocuments(data, function (a, b, c) {
            self.docList(a.data.rows);
            self.pageCount(a.data.pagingInfo.pageCount);
            self.totalRowCount(a.data.pagingInfo.totalRowCount);
            self.savemessage(null);
            self.savemessagecode(null);
            $(".edit").click(function () {
                self.getDocCard($(this).val());
                console.log($(this).val());
            });
        }, null, null);
    },
    getDocCard: function (documentid) {
        var self = this;
        var data = {
            documentname: { fieldName: 'documentid', op: 2, value: documentid },
        };
        crmAPI.getDocuments(data, function (a, b, c) {
            self.selectedDoc(a.data.rows[0]);
        }, null, null);
    },
    saveDoc: function () {
        var self = this;
        var data = self.selectedDoc();
        crmAPI.saveDocument(data, function (a, b, c) {
            self.savemessage(a.errorMessage);
            self.savemessagecode(a.errorCode);
            window.setTimeout(function () {
                $('#myModal').modal('hide');
                self.getDocuments(1, dataModel.rowsPerPage());
            }, 1000);
        }, null, null);
    },
    insertDoc: function () {
        var self = this;
        var data = {
            documentname: self.newdocname(),
            documentdescription:self.newdocdescription(),
        };
        crmAPI.insertDocument(data, function (a, b, c) {
            self.savemessage(a.errorMessage);
            self.savemessagecode(a.errorCode);
            window.setTimeout(function () {
                $('#myModal1').modal('hide');
                self.getDocuments(1, dataModel.rowsPerPage());
            }, 1000);
        }, null, null);
    },

    clean: function () {
        var self = this;
        self.docname(null);
        self.docdescription(null);
        self.getDocuments();
    },
    navigate: {
        gotoPage: function (pageNo) {
            if (pageNo == dataModel.pageNo() || pageNo <= 0 || pageNo > dataModel.pageCount()) return;
            dataModel.getDocuments(pageNo, dataModel.rowsPerPage());
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
    renderBindings: function () {
        var self = this;
        self.getDocuments(dataModel.pageNo(), dataModel.rowsPerPage());
        ko.applyBindings(dataModel, $("#bindingContainer")[0]);
    }
}