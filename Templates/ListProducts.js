
var dataModel = {

    pageCount: ko.observable(),
    pageNo: ko.observable(1),
    rowsPerPage: ko.observable(20),
    totalRowCount: ko.observable(),
    savemessage: ko.observable(),
    savemessagecode: ko.observable(),

    productList: ko.observableArray([]),
    productCombo: ko.observableArray([]),
    selectedProduct: ko.observable(),
    autoTaskIds:ko.observableArray([]),
    autoTaskList:ko.observableArray([]),


    productid: ko.observable(),
    category: ko.observable(),
    newcategory: ko.observable(),
    maxduration: ko.observable(),
    newproductname: ko.observable(),
    newdocdescription: ko.observable(),
    getProducts: function (pageno, rowsperpage) {
        var self = this;
        self.pageNo(pageno);
        var data = {
            pageNo: pageno,
            rowsPerPage: rowsperpage,
            product: self.productid() ? { fieldName: 'productid', op: 2, value: self.productid() } : { fieldName: 'productname', op: 6, value: '' },
            category: self.category() ? { fieldName: 'category', op: 6, value: self.category() } : { fieldName: 'category', op: 6, value: '' },
        };
        crmAPI.getProducts(data, function (a, b, c) {
            self.productList(a.data.rows);
            self.pageCount(a.data.pagingInfo.pageCount);
            self.totalRowCount(a.data.pagingInfo.totalRowCount);
            self.savemessage(null);
            self.savemessagecode(null);
            $(".edit").click(function () {
                self.getProductCard($(this).val());
                console.log($(this).val());
            });
        }, null, null);
    },
    getProductCard: function (productid) {
        var self = this;
        var data = {
            product: { fieldName: 'productid', op: 2, value: productid },
        };
        crmAPI.getProducts(data, function (a, b, c) {
            self.selectedProduct(a.data.rows[0]);
        }, null, null);
    },
    getProductsCombo: function () {
        var self = this;
        var data = {      
            product:{ fieldName: 'productname', op: 6, value: '' },
        };
        crmAPI.getProducts(data, function (a, b, c) {
            self.productCombo(a.data.rows);
            $("#filter1,#filter2").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: ' Seçiniz',
                nSelectedText: ' Seçildi!',
                numberDisplayed: 3,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
        }, null, null);
    },

    getTaskList: function () {
        var self = this;
        var data = {
            task: {fieldName:'taskname',op:6,value:''},
        };
        crmAPI.getTaskFilter(data,function (a, b, c) {
            self.autoTaskList(a);
            $("#newautotask").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: ' Seçiniz',
                nSelectedText: ' Seçildi!',
                numberDisplayed: 3,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
            $("#autotask").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: 'Task Seçiniz',
                nSelectedText: 'Task Seçildi!',
                numberDisplayed: 3,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
            $('#autotask').multiselect('select', self.autoTaskIds());
        }, null, null)
    },
    saveProduct: function () {
        var self = this;
        self.selectedProduct().automandatorytasks = $("#autotask").val()?$("#autotask").val().toString():null;
        var data = self.selectedProduct();
        crmAPI.saveProduct(data, function (a, b, c) {
            self.savemessage(a.errorMessage);
            self.savemessagecode(a.errorCode);
            window.setTimeout(function () {
                $('#myModal').modal('hide');
                self.getProducts(1, dataModel.rowsPerPage());
            }, 1000);
        }, null, null);
    },
    insertProduct: function () {
        var self = this;
        var data = {
            productname: self.newproductname(),
            category: self.newcategory(),
            maxduration: self.maxduration(),
            automandatorytasks:  $("#newautotask").val()?$("#newautotask").val().toString():null,
        };
        crmAPI.insertProduct(data, function (a, b, c) {
            self.savemessage(a.errorMessage);
            self.savemessagecode(a.errorCode);
            window.setTimeout(function () {
                $('#myModal1').modal('hide');
                self.getProducts(1, dataModel.rowsPerPage());
            }, 1000);
        }, null, null);
    },

    clean: function () {
        var self = this;
        self.productid(null);
        self.category(null);
        self.getProducts(dataModel.pageNo(), dataModel.rowsPerPage());
    },
    navigate: {
        gotoPage: function (pageNo) {
            if (pageNo == dataModel.pageNo() || pageNo <= 0 || pageNo > dataModel.pageCount()) return;
            dataModel.getProducts(pageNo, dataModel.rowsPerPage());
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
        self.getProducts(dataModel.pageNo(), dataModel.rowsPerPage());
        ko.applyBindings(dataModel, $("#bindingContainer")[0]);
        $('#new').click(function () {
            self.getTaskList();
        });
        self.getProductsCombo();
       
    }
}

dataModel.selectedProduct.subscribe(function (v) {
    if (v.automandatorytasks != null)
        dataModel.autoTaskIds(v.automandatorytasks.split(","));
    else
        dataModel.autoTaskIds(null);
    dataModel.getTaskList();

});