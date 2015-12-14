
var dataModel = {

    pageCount: ko.observable(),
    pageNo: ko.observable(1),
    rowsPerPage: ko.observable(20),
    totalRowCount: ko.observable(),
    savemessage: ko.observable(),
    savemessagecode: ko.observable(),

    stockCardList: ko.observableArray([]),
    selectedStockCard: ko.observable(),
    productName:ko.observable(),
    category:ko.observable(),

    newProductName: ko.observable(),
    newCategory: ko.observable(),
    newHasSerial: ko.observable(),
    newStockBirim: ko.observable(),
    newDescription: ko.observable(),

    getStockCards: function (pageno, rowsperpage) {
        var self = this;
        self.pageNo(pageno);
        var data = {
            pageNo: pageno,
            rowsPerPage: rowsperpage,
            stockcard: self.productName() ? { fieldName: 'productname', op: 6, value: self.productName() } : { fieldName: 'productname', op: 6, value: '' },
            category: self.category() ? { fieldName: 'category', op: 6, value: self.category() } : { fieldName: 'category', op: 6, value: '' },
        };
        crmAPI.getStockCards(data, function (a, b, c) {
            self.stockCardList(a.data.rows);
            self.pageCount(a.data.pagingInfo.pageCount);
            self.totalRowCount(a.data.pagingInfo.totalRowCount);
            self.savemessage(null);
            self.savemessagecode(null);
            $(".edit").click(function () {
                self.getStockCard($(this).val());
                console.log($(this).val());
            });
        }, null, null);
    },
    getStockCard: function (stockid) {
        var self = this;
        var data = {
            stockcard:{ fieldName: 'stockid', op: 2, value: stockid },
        };
        crmAPI.getStockCards(data, function (a, b, c) {
            self.selectedStockCard(a.data.rows[0]);
        }, null, null);
    },
   
    saveStockCard: function () {
        var self = this;
        var data = self.selectedStockCard();
        crmAPI.saveStockCard(data, function (a, b, c) {
            self.savemessage(a.errorMessage);
            self.savemessagecode(a.errorCode);
            window.setTimeout(function () {
                $('#myModal').modal('hide');
                self.getStockCards(1, dataModel.rowsPerPage());
            }, 1000);
        }, null, null);
    },
    insertStockCard: function () {
        var self = this;
        var data = {
            productname: self.newProductName(),
            category: self.newCategory(),
            hasserial: self.newHasSerial(),
            unit: self.newStockBirim(),
            description: self.newDescription(),
        };
        crmAPI.insertStockCard(data, function (a, b, c) {
            self.savemessage(a.errorMessage);
            self.savemessagecode(a.errorCode);
            window.setTimeout(function () {
                $('#myModal1').modal('hide');
                self.getStockCards(1, dataModel.rowsPerPage());
            }, 1000);
        }, null, null);
    },

    clean: function () {
        var self = this;
        self.productName(null);
        self.category(null);
        self.getStockCards(dataModel.pageNo(), dataModel.rowsPerPage());
    },
    navigate: {
        gotoPage: function (pageNo) {
            if (pageNo == dataModel.pageNo() || pageNo <= 0 || pageNo > dataModel.pageCount()) return;
            dataModel.getStockCards(pageNo, dataModel.rowsPerPage());
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
        self.getStockCards(dataModel.pageNo(), dataModel.rowsPerPage());
        ko.applyBindings(dataModel, $("#bindingContainer")[0]);

    }
}
