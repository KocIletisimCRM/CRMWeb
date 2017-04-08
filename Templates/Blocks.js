
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
    fiberEndDate: ko.observable(),
    fiberSODate: ko.observable(),
    blockList: ko.observableArray([]),
    pageCount: ko.observable(),
    pageNo: ko.observable(1),
    rowsPerPage: ko.observable(20),
    totalRowCount: ko.observable(),
    siteList: ko.observableArray([]),
    selectedsiteid: ko.observable(),
    errorcode: ko.observable(),
    errormessage: ko.observable(),
    personellist: ko.observableArray([]),
    selectedBlocks: ko.observableArray([]),
    selectedpersonelid: ko.observable(),
    newblockname: ko.observable(),
    newsiteid: ko.observable(),
    newhp: ko.observable(),
    newtelocadia: ko.observable(),
    newprojectno: ko.observable(),
    newreadytosaledate: ko.observable(),
    newsosaledate: ko.observable(),
    newkocsaledate: ko.observable(),
    newsatissorumlusu: ko.observable(),
    newsuperintendent: ko.observable(),
    newsuperintendentcontact: ko.observable(),
    newcocierge: ko.observable(),
    newcociergecontact: ko.observable(),
    newverticalproductionline: ko.observable(),
    newbinakodu: ko.observable(),
    newlocationid: ko.observable(),
    newobjid: ko.observable(),

    getpersonel: function () {
        var self = this;
        crmAPI.getPersonel(function (a, b, c) {
            self.personellist(a);
            $("#satissorumlusu,#editsatissorumlusu,#tsatissorumlusu").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: 'Personel Seçiniz',
                nSelectedText: 'Personel Seçildi!',
                numberDisplayed: 2,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            }).multiselect('refresh');
        }, null, null)
    },
    getBlockList: function (pageno, rowsperpage) {
        var self = this;
        self.pageNo(pageno);
        self.rowsPerPage(rowsperpage);
        self.fiberSODate(self.fiberStartDate() + '-' + self.fiberEndDate());
        var locs = $.trim(self.locationid()).replace(new RegExp(" ", 'g'), "").replace(new RegExp("\n", 'g'), "").split('\'');
        if (locs.length > 1) locs.splice(0,1);
        var data = {
            pageNo: pageno,
            rowsPerPage: rowsperpage,
            block: self.blockname() ? { fieldName: "blockname", op: 6, value: self.blockname() } : null,
            SO: self.fiberStartDate() ? { fieldName: "readytosaledate", op: 5, value: self.fiberSODate() } : null,
            sitename: self.site() ? { fieldName: "sitename", op: 6, value: self.site() } : null,
            region: self.region() ? { fieldName: "region", op: 6, value: self.region() } : null,
            telocadia: self.telocadia() ? { fieldName: "telocadia", op: 2, value: self.telocadia() } : null,
            locationid: self.locationid() ? { fieldName: "locationid", op: 11, value: locs } : null, // op: 11 -> string listesi
        };
        crmAPI.getBlockList(data, function (a,b,c) {
            self.blockList(a.data.rows);
            self.pageCount(a.data.pagingInfo.pageCount);
            self.totalRowCount(a.data.pagingInfo.totalRowCount);
            self.errorcode(null);
            self.errormessage(null);
            $(".edit").click(function () {
                self.getpersonel();
                self.getSite();
                self.getBlockCard($(this).val());           
            });
            $('.sel').change(function () {
                var ids = [];
                $('.sel').each(function () {
                    if ($(this).is(':checked')) {
                        var id = $(this).val();
                        ids.push(id);
                    }
                });
                self.selectedBlocks(ids);
            });
        }, null, null);
    },
    getBlockCard: function (blockid) {
        var self = this;
        var data = {
            block: { fieldName: "blockid", op: 2, value: blockid },
        };
        crmAPI.getBlockList(data, function (a, b, c) {
            self.selectedBlock(a.data.rows[0]);
            $("#d1").val(a.data.rows[0].readytosaledate);
            $("#d2").val(a.data.rows[0].sosaledate);
            $("#d3").val(a.data.rows[0].kocsaledate);
        }, null, null);
    },
    getSite: function () {
        var self = this;
        var data = { site: { fieldName: "sitename", value:'', op: 6 } }
        crmAPI.getSiteFilter(data, function (a, b, c) {
            self.siteList(a);
            $("#sitename,#site").multiselect({
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
        self.selectedBlock().readytosaledate = $("#d1").val() ? $("#d1").val() : null;
        self.selectedBlock().sosaledate = $("#d2").val() ? $("#d2").val() : null;
        self.selectedBlock().kocsaledate = $("#d3").val() ? $("#d3").val() : null;
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
    editMultiBlock: function () {
        var self = this;
        document.getElementById("uyari_state").style.display = 'none';
        document.getElementById("tamam").style.display = 'none';
        var data = {
            personelid: self.selectedpersonelid(),
            blockIds: self.selectedBlocks(),
        }
        crmAPI.editSiteMultiple(data, function (a, b, c) {
            if (a == "Tamamlandı") {
                document.getElementById("uyari_state").style.display = 'none';
                document.getElementById("tamam").style.display = 'block';
                window.setTimeout(function () {
                    $('#editMultiple').modal('hide');
                    self.getBlockList(self.pageNo(), self.rowsPerPage());
                }, 1000);
            } else {
                document.getElementById("tamam").style.display = 'none';
                document.getElementById("uyari_state").style.display = 'block';
            }
        }, null, null);
    },
    insertBlock: function () {
        var self = this;
        $('#kayit').prop('disabled', true);
        var data={
            blockname :self.newblockname(),
            site:{
                siteid: self.newsiteid(),
            } ,
            hp : self.newhp(),
            telocadia :self.newtelocadia(),
            projectno :self.newprojectno(),
            readytosaledate :self.newreadytosaledate(),
            sosaledate :self.newsosaledate(),
            kocsaledate :self.newkocsaledate(),
            salespersonel:{
                personelid:self.newsatissorumlusu(), 
            },
            superintendent :self.newsuperintendent(),
            superintendentcontact :self.newsuperintendentcontact(),
            cocierge :self.newcocierge(),
            cociergecontact :self.newcociergecontact(),
            verticalproductionline  :self.newverticalproductionline(),
            binakodu :self.newbinakodu(),
            locationid :self.newlocationid(),
            objid :self.newobjid(),
        };
        crmAPI.insertBlock(data, function (a, b, c) {
            self.errorcode(a.errorCode);
            self.errormessage(a.errorMessage);
            window.setTimeout(function () {
                $('#myModal1').modal('hide');
                $('#kayit').prop('disabled', false);
                self.getBlockList(1, 20);
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
        self.fiberEndDate(null);
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
        $('#daterangepicker1,#daterangepicker2,#daterangepicker3,#daterangepicker4').daterangepicker({
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
        $('#d1,#d2,#d3').daterangepicker({
            "singleDatePicker": true,
            "autoApply": false,
           " autoUpdateInput": false,
            "linkedCalendars": false,
            "timePicker": true,
            "timePicker24Hour": true,
            "drops": "up",
            "timePickerSeconds": true,
            "locale": {
                "format": 'MM/DD/YYYY h:mm A',
            },
        });
        $('#date1,#date2').daterangepicker({
            "singleDatePicker": true,
            "autoApply": false,
            " autoUpdateInput": false,
            "linkedCalendars": false,
            "timePicker": true,
            "timePicker24Hour": true,
            "drops": "down",
            "timePickerSeconds": true,
            "locale": {
                "format": 'MM/DD/YYYY h:mm A',
            },
        });
        self.getBlockList(dataModel.pageNo(), dataModel.rowsPerPage());
        ko.applyBindings(dataModel, $("#bindingContainer")[0]);
        $('#new').click(function () {
            self.getpersonel();
            self.getSite();
        });
        $('#cmulti').click(function () {
            document.getElementById("uyari_state").style.display = 'none';
            document.getElementById("tamam").style.display = 'none';
            self.selectedpersonelid(undefined);
            self.getpersonel();
        });
    }
}