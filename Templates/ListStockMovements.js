
var dataModel = {

    pageCount: ko.observable(),
    pageNo: ko.observable(1),
    rowsPerPage: ko.observable(20),
    totalRowCount: ko.observable(),
    savemessage: ko.observable(),
    savemessagecode: ko.observable(),
  
    fromobject:ko.observable(12),
    movementList: ko.observableArray([]),
    selectedMovementCard: ko.observable(),
    personellist:ko.observable(),
    fromObjectName: ko.observable(),
    selectedFromObjectType:ko.observable(),
    toObjectName: ko.observable(),
    productName: ko.observable(),
    serialNo: ko.observable(),
    movementdate: ko.observable(),
    objectList: ko.observableArray([]),
    objectsList: ko.observableArray([]),
    stockCardList: ko.observableArray([]),
    personelStockList: ko.observableArray([]),
    serialList: ko.observableArray([]),
    stockSerialControl: ko.observable(),
    amount:ko.observable(),
    newamount: ko.observable(),
    newserialno: ko.observable(),
    newtoobjecttype: ko.observable(),
    newtoobject: ko.observable(),
    newselectedproduct: ko.observable(),
    isSatinalma: ko.observable(),
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
            movementdate: self.movementdate() ?( $("#movementdate").val() ? { value: self.movementdate() }:null  ): null,
        };
        crmAPI.getStockMovements(data, function (a, b, c) {
            self.movementList(a.data.rows);
            self.pageCount(a.data.pagingInfo.pageCount);
            self.totalRowCount(a.data.pagingInfo.totalRowCount);
            $(".edit").click(function () {
                self.getStockMovementCard($(this).val());
                self.getStockCards();
                self.getpersonel();
                console.log($(this).val());
            });
        }, null, null);
    },

    getObjectTypes: function () {
        var self = this;
        crmAPI.getObjectType(function (a, b, c) { self.objectList(a); },null,null)
    },
    getObjects: function () {
        var self = this;
        var data = {
            objecttype: {value:self.selectedFromObjectType()},
        };
        crmAPI.getObject(data, function (a, b, c) {
            self.objectsList(a);
        }, null, null);
    },
    getStockCards: function () {
        var self = this;
        var data = {
            stockcard:{ fieldName: 'productname', op: 6, value: '' },
        };
        crmAPI.getStockCards(data, function (a, b, c) {
            self.stockCardList(a.data.rows);
            $("#newproduct,#newobject").multiselect({
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
            $("#newproduct").multiselect({
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
            $("#newproduct").multiselect("setOptions", dataModel.stockCardList()).multiselect("rebuild");
        }, null, null);
    },
    getPersonelStock: function () {
        var self = this;
        var data = {
            personelid: self.fromobject(),
        };
        crmAPI.getPersonelStock(data, function (a, b, c) {
            self.personelStockList(a);
            $("#newproduct,#newobject,#newserial").multiselect({
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
            $("#newproduct").multiselect("setOptions", dataModel.personelStockList()).multiselect("rebuild");
        }, null, null);
    },
    getSerialsOnPersonel: function () {
        var self = this;
        var data = {
            personelid:self.fromobject(),
            stockcardid:self.newselectedproduct(),
        };
        crmAPI.getSerialsOnPersonel(data, function (a, b, c) {
            self.serialList(a);
            $("#newserial").multiselect({
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
            $("#newserial").multiselect("setOptions", dataModel.serialList()).multiselect("rebuild");
        }, null, null);
    },
    getpersonel: function () {
        var self = this;
        var data = { personel: self.newtoobjecttype() ? { fieldName: "category", op: 2, value: self.newtoobjecttype(), } : { fieldName: "personelname", op: 6, value: '', } };
        crmAPI.getPersonels(data,function (a, b, c) {
            self.personellist(a.data.rows);
            $("#newpersonel").multiselect({
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
              $("#newpersonel").multiselect("setOptions", dataModel.personellist()).multiselect("rebuild");
        }, null, null)
    },
    getStockMovementCard: function (movementid) {
        var self = this;
        var data = { movement: { value: movementid } };
        crmAPI.getStockMovements(data, function (a, b, c) {
            self.selectedMovementCard(a.data.rows[0]);
            $("#editproduct,#editobject,#editpersonel").multiselect({
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
    getSerialControl: function (stockid) {
        var self = this;
        var data = {
            stockcard:stockid? { fieldName: 'stockid', op: 2, value: stockid }:null,
        };
        if (stockid!=null)
        crmAPI.getStockCards(data, function (a, b, c) {
            self.stockSerialControl(a.data.rows[0].hasserial);
        }, null, null);
        return false;
    },
    saveStockMovement: function () {
        var self = this;
        var data = self.selectedStockCard();
        crmAPI.saveStockMovement(data, function (a, b, c) {
            self.savemessage(a.errorMessage);
            self.savemessagecode(a.errorCode);
            window.setTimeout(function () {
                $('#myModal').modal('hide');
                self.getStockMovements(1, dataModel.rowsPerPage());
            }, 1000);
        }, null, null);
    },

    insertStockMovements: function () {
        var self = this;
        var postdata = [];
            var pd = {
                amount: self.newamount(),
                serialno: self.newserialno(),
                fromobjecttype:2,
                fromobject:12,
                toobjecttype: self.newtoobjecttype(),
                toobject: self.newtoobject(),
                stockcardid: self.newselectedproduct(),
            };
            postdata.push(pd);
        crmAPI.InsertStockMovement(postdata, function (a, b, c) {
            self.message(a);
        }, null, null);
        console.log(postdata);
    },
    clean: function () {
        var self = this;
        self.fromObjectName(null);
        self.toObjectName(null);
        self.serialNo(null);
        self.movementdate(null);
        self.productName(null);
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
        self.getObjectTypes();
        $('#new').click(function () {
            self.getPersonelStock();
            self.getpersonel();
            self.getStockCards();
        });
       
        ko.applyBindings(dataModel, $("#bindingContainer")[0]);
    }
}

dataModel.newtoobjecttype.subscribe(function (v) {
    dataModel.getpersonel();
});
dataModel.newselectedproduct.subscribe(function (v) {
    dataModel.getSerialControl(v);
    dataModel.getSerialsOnPersonel();

    dataModel.amount(dataModel.personelStockList()[$("#newproduct")[0].selectedIndex] ?
        dataModel.personelStockList()[$("#newproduct")[0].selectedIndex-1].amount:"Sıfır");
});
dataModel.newtoobject.subscribe(function () {
    dataModel.isSatinalma(dataModel.fromobject() == dataModel.newtoobject()
? true : false);
});
