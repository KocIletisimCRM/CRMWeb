
var dataModel = {
    blockname: ko.observable(),
    blockid:ko.observable(),
    selectedBlockId: ko.observable(),
    selectedBlock:ko.observable(),
    region: ko.observable(),
    site: ko.observable(),
    telocadia: ko.observable(),
    locationid: ko.observable(),
    fiberStartDate: ko.observable(),
    blockList: ko.observableArray([]),
    pageCount: ko.observable(),
    pageNo: ko.observable(1),
    rowsPerPage: ko.observable(20),
    totalRowCount: ko.observable(),
    siteList: ko.observableArray([]),
    selectedsiteid: ko.observable(),
    errorcode: ko.observable(),
    errormessage:ko.observable(),
    getBlockList: function (pageno, rowsperpage) {
        var self = this;
        self.pageNo(pageno);
        self.rowsPerPage(rowsperpage);
        var data = {
            pageNo: pageno,
            rowsPerPage: rowsperpage,
            block: self.blockname() ? { fieldName: "blockname", op: 6, value: self.blockname() } : null,
            sitename: self.site() ? { fieldName: "sitename", op: 6, value: self.site() } : null,
            region: self.region() ? { fieldName: "region", op: 6, value: self.region() } : null,
            telocadia: self.telocadia() ? { fieldName: "telocadia", op: 2, value: self.telocadia() } : null,
        };
        crmAPI.getBlockList(data, function (a,b,c) {
            self.blockList(a.data.rows);
            self.pageCount(a.data.pagingInfo.pageCount);
            self.totalRowCount(a.data.pagingInfo.totalRowCount);
            self.errorcode(null);
            self.errormessage(null);
            $(".edit").click(function () {
                $('#daterangepicker1,#daterangepicker2,#daterangepicker3').daterangepicker({
                    "singleDatePicker": true,
                    "autoApply": false,
                    "linkedCalendars": false,
                    "timePicker": true,
                    "timePicker24Hour": true,
                    "timePickerSeconds": true,
                    "locale": {
                        "format": 'MM/DD/YYYY h:mm A',
                    },
                });
                self.getSite();
                self.getBlockCard($(this).val());           
                console.log($(this).val());
            });

        },null,null);
    },
    getBlockCard: function (blockid) {
        var self = this;
        var data = {
            block: { fieldName: "blockid", op: 2, value: blockid },
        };
        crmAPI.getBlockList(data, function (a, b, c) {
            self.selectedBlock(a.data.rows[0]);
        }, null, null);
    },
    getSite: function () {
        var self = this;
        var data = { site: { fieldName: "sitename", value:'', op: 6 } }
        crmAPI.getSiteFilter(data, function (a, b, c) {
            self.siteList(a);
            $("#sitename").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: 'Site Seçiniz',
                nSelectedText: 'Site Seçildi!',
                numberDisplayed: 2,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
        }, null, null);
    },
    editBlock: function () {
        var self = this;
        var data = self.selectedBlock();
        crmAPI.editBlock(data, function (a, b, c) {
            self.errorcode(a.errorCode);
            self.errormessage(a.errorMessage);
            window.setTimeout(function () {
                $('#myModal').modal('hide');
                self.getBlockList(1, dataModel.rowsPerPage());
            }, 1000);
        }, null, null);
    },

    clean: function () {
        var self = this;
        self.region(null);
        self.site(null);
        self.telocadia(null);
        self.locationid(null);
        self.fiberStartDate(null);
    },
    enterfilter: function (d, e) {
        var self = this;
        if (e && (e.which == 1 || e.which == 13)) {
            self.getBlockList(1, self.rowsPerPage());
        }
        return true;
    },
    navigate: {
        gotoPage: function (pageNo) {
            if (pageNo == dataModel.pageNo() || pageNo <= 0 || pageNo > dataModel.pageCount()) return;
            dataModel.getBlockList(pageNo, dataModel.rowsPerPage());
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
    
        self.getBlockList(dataModel.pageNo(), dataModel.rowsPerPage());
        ko.applyBindings(dataModel, $("#bindingContainer")[0]);
    }
}