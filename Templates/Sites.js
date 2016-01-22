
var dataModel = {
    region: ko.observable(),
    site: ko.observable(),
    siteList: ko.observableArray([]),
    sitelistmodal: ko.observableArray([]),
    regionlist: ko.observableArray([]),
    newmahalle: ko.observable(),
    editmahalle:ko.observable(),
    siteid: ko.observable(),
    newsitename: ko.observable(),
    newadres: ko.observable(),
    newbolgekod: ko.observable(),
    newdescription:ko.observable(),
    newregion: ko.observable(),
    editregion: ko.observable(),
    pageCount: ko.observable(),
    pageNo: ko.observable(1),
    rowsPerPage: ko.observable(20),
    totalRowCount: ko.observable(),
    selectedSite: ko.observable(),
    errorcode: ko.observable(),
    errormessage:ko.observable(),

    getregion: function () {
        var self = this;
        self.regionlist(null);
        var data = { region: { fieldName: "region", value: '', op: 6 } }
        crmAPI.getSiteFilter(data, function (a, b, c) {
            self.regionlist(a);
            $("#newregion,#editregion").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: 'Öbek Seçiniz',
                nSelectedText: 'Öbek Seçildi!',
                numberDisplayed: 2,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
            $("#newregion,#editregion").multiselect("setOptions", dataModel.sitelistmodal()).multiselect("rebuild");
        }, null, null);
    },
    getSiteList: function (pageno, rowsperpage) {
        var self = this;
        self.pageNo(pageno);
        self.rowsPerPage(rowsperpage);
        var data = {
            pageNo: pageno,
            rowsPerPage: rowsperpage,
            sitename: self.site() ? { fieldName: "sitename", op: 6, value: self.site() } : null,
            region: self.region() ? { fieldName: "region", op: 6, value: self.region() } : null,
        };
        crmAPI.getSiteList(data, function (a, b, c) {
            self.siteList(a.data.rows);
            self.pageCount(a.data.pagingInfo.pageCount);
            self.totalRowCount(a.data.pagingInfo.totalRowCount);
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
                self.getregion();
                self.getSiteCard($(this).val());
            });

        }, null, null);
    },
    getSiteCard: function (siteid) {
        var self = this;
        var self = this;
        var data = {
            sitename: { fieldName: "siteid", op: 2, value: siteid },
        };
        crmAPI.getSiteList(data, function (a, b, c) {
            self.selectedSite(a.data.rows[0]);
        }, null, null);
    },
    editSite: function () {
        var self = this;
        var data = self.selectedSite();
        crmAPI.editSite(data, function (a, b, c) {
            self.errorcode(a.errorCode);
            self.errormessage(a.errorMessage);
            window.setTimeout(function () {
                $('#myModal').modal('hide');
                self.getSiteList(1, dataModel.rowsPerPage());
            }, 1000);
        }, null, null);
    },
    insertSite: function (){
        var self = this;
        var data = {
            sitename: self.newsitename(),
            siteaddress: self.newadres(),
            region: self.newregion(),
            sitedistrict: self.newmahalle(),
            description: self.newdescription(),
            siteregioncode: self.newbolgekod(),
        };
        crmAPI.insertSite(data, function (a, b, c) {
            self.errorcode(a.errorCode);
            self.errormessage(a.errorMessage);
            window.setTimeout(function () {
                $('#myModal1').modal('hide');
                self.getSiteList(1, dataModel.rowsPerPage());
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
            self.getSiteList(1, self.rowsPerPage());
        }
        return true;
    },
    navigate: {
        gotoPage: function (pageNo) {
            if (pageNo == dataModel.pageNo() || pageNo <= 0 || pageNo > dataModel.pageCount()) return;
            dataModel.getSiteList(pageNo, dataModel.rowsPerPage());
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
        self.getSiteList(dataModel.pageNo(), dataModel.rowsPerPage());
        ko.applyBindings(dataModel, $("#bindingContainer")[0]);
        $('#new').click(function () {
            self.getregion();
        });
    }
}