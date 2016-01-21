
var dataModel = {

    pageCount: ko.observable(),
    pageNo: ko.observable(1),
    rowsPerPage: ko.observable(20),
    totalRowCount: ko.observable(),
    savemessage: ko.observable(),
    savemessagecode: ko.observable(),

    personelList: ko.observableArray([]),
    personelname: ko.observable(),
    objectList: ko.observableArray([]),
    selectedPersonel: ko.observable(),
    rolesList: ko.observableArray([]),

    newpersonelname: ko.observable(),
    newcategory: ko.observable(),
    newpassword: ko.observable(),
    newmobile: ko.observable(),
    newemail: ko.observable(),
    newnotes: ko.observable(),

    getPersonels: function (pageno, rowsperpage) {
        var self = this;
        self.pageNo(pageno);
        var data = {
            pageNo: pageno,
            rowsPerPage: rowsperpage,
            personel: self.personelname() ? { fieldName: 'personelname', op: 6, value: self.personelname() } : { fieldName: 'personelname', op: 6, value: '' },
        };
        crmAPI.getPersonels(data, function (a, b, c) {
            self.personelList(a.data.rows);
            self.pageCount(a.data.pagingInfo.pageCount);
            self.totalRowCount(a.data.pagingInfo.totalRowCount);
            self.savemessage(null);
            self.savemessagecode(null);
            $(".edit").click(function () {
                self.getPersonelCard($(this).val());
                console.log($(this).val());
            });
        }, null, null);
    },
    getPersonelCard: function (personelid) {
        var self = this;
        var data = {
            personel: { fieldName: 'personelid', op: 2, value: personelid },
        };
        crmAPI.getPersonels(data, function (a, b, c) {
            self.getObjects();
            self.selectedPersonel(a.data.rows[0]);
        }, null, null);
    },
    getObjects: function () {
        var self = this;
        crmAPI.getObjectType(function (a, b, c) {
            self.objectList(a);
            $("#object").multiselect({
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
            $("#newcategory").multiselect({
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
    savePersonel: function () {
        var self = this;
        var rol = 0;
        if ($("#object").val()) {
            for (var i = 0; i < $("#object").val().length; i++) {
                rol |= $("#object").val()[i];
            }
        }
        self.selectedPersonel().category = rol;
        self.selectedPersonel().roles = rol;

        var data = self.selectedPersonel();
        crmAPI.savePersonel(data, function (a, b, c) {
            self.savemessage(a.errorMessage);
            self.savemessagecode(a.errorCode);
            window.setTimeout(function () {
                $('#myModal').modal('hide');
                self.getPersonels(1, dataModel.rowsPerPage());
            }, 1000);
        }, null, null);
    },
    insertPersonel: function () {
        var self = this;
        var rol = 0;
        for (var i = 0; i < $("#newcategory").val().length; i++) {
            rol = rol | $("#newcategory").val()[i];
        }
        self.newcategory(rol);
        var data = {
            personelname: self.newpersonelname(),
            category: self.newcategory(),
            password: self.newpassword(),
            mobile: self.newmobile(),
            email: self.newemail(),
            notes: self.newnotes(),
        };
        crmAPI.insertPersonel(data, function (a, b, c) {
            self.savemessage(a.errorMessage);
            self.savemessagecode(a.errorCode);
            window.setTimeout(function () {
                $('#myModal1').modal('hide');
                self.getPersonels(1, dataModel.rowsPerPage());
            }, 1000);
        }, null, null);
    },
    getRoles: ko.pureComputed(function () {
        var roles = [];
        for (var i = 0; i < dataModel.objectList().length; i++) {
            if ((dataModel.selectedPersonel().category & dataModel.objectList()[i].typeid) == dataModel.objectList()[i].typeid)
                roles.push(dataModel.objectList()[i].typeid);
        }
        return roles;
    }),

    clean: function () {
        var self = this;
        self.personelname(null);
        self.selectil(null);
        self.selectilce(null);
        self.getPersonels(dataModel.pageNo(), dataModel.rowsPerPage());
    },
    navigate: {
        gotoPage: function (pageNo) {
            if (pageNo == dataModel.pageNo() || pageNo <= 0 || pageNo > dataModel.pageCount()) return;
            dataModel.getPersonels(pageNo, dataModel.rowsPerPage());
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
            self.getPersonels(1, dataModel.rowsPerPage());
        }
        return true;
    },
    renderBindings: function () {
        var self = this;
        self.getPersonels(dataModel.pageNo(), dataModel.rowsPerPage());
        ko.applyBindings(dataModel, $("#bindingContainer")[0]);
        $('#new').click(function () {
            self.getObjects();
        });

    }
}
