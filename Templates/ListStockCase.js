
var dataModel = {

    pageCount: ko.observable(),
    pageNo: ko.observable(1),
    rowsPerPage: ko.observable(20),
    totalRowCount: ko.observable(),
    savemessage: ko.observable(),
    savemessagecode: ko.observable(),


    movementList: ko.observableArray([]),
    fromObjectName: ko.observable(),
    toObjectName: ko.observable(),
    productName: ko.observable(),
    serialNo: ko.observable(),
    movementdate: ko.observable(),
    getStockMovements: function (pageno, rowsperpage) {
        var self = this;
        self.pageNo(pageno);
        self.rowsPerPage(rowsperpage);
        var data = {
            pageNo: pageno,
            rowsPerPage: rowsperpage,
            fromobject: { value: self.fromObjectName() ? self.fromObjectName() : null, },
            toobject: { value: self.toObjectName() ? self.toObjectName() : null },
            product: self.productName() ? { fieldName: 'productname', op: 6, value: self.productName() } : null,
            serialno: self.serialNo() ? { value: self.serialNo() } : null,
            movementdate: self.movementdate() ? { value: self.movementdate() } : null,
        };
        crmAPI.getStockMovements(data, function (a, b, c) {
            self.movementList(a.data.rows);
            self.pageCount(a.data.pagingInfo.pageCount);
            self.totalRowCount(a.data.pagingInfo.totalRowCount);
        }, null, null);
    },
    clean: function () {
        var self = this;
        self.fromObjectName(null);
        self.toObjectName(null);
        self.serialNo(null);
        self.movementdate(null);
        self.getStockMovements(dataModel.pageNo(), dataModel.rowsPerPage());
    },
    navigate: {
        gotoPage: function (pageNo) {
            if (pageNo == dataModel.pageNo() || pageNo <= 0 || pageNo > dataModel.pageCount()) return;
            dataModel.getStockMovements(pageNo, dataModel.rowsPerPage());
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
        $('#movementdate').daterangepicker({
            "timePicker": true,
            ranges: {
                'Bugün': [moment(), moment().add(1, 'days')],
                'Dün': [moment().subtract(1, 'days'), moment()],
                'Son 7 Gün': [moment().subtract(6, 'days'), moment()],
                'Son 30 Gün': [moment().subtract(29, 'days'), moment()],
                'Bu Ay': [moment().startOf('month'), moment().endOf('month')],
                'Geçen Ay': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            }
        });
        self.getStockMovements(dataModel.pageNo(), dataModel.rowsPerPage());
        ko.applyBindings(dataModel, $("#bindingContainer")[0]);
    }
}