
var dataModel = {

    tckimlikno: ko.observable(),
    customername: ko.observable(),
    customersurname: ko.observable(),
    gsm: ko.observable(),
    phone: ko.observable(),
    ilList: ko.observableArray([]),
    ilceList: ko.observableArray([]),
    mahalleList: ko.observableArray([]),
    caddeList: ko.observableArray([]),
    binaList: ko.observableArray([]),
    daireList: ko.observableArray([]),
    selectedIl:ko.observable(),
    selectedIlce:ko.observable(),
    selectedMahalle:ko.observable(),
    selectedCadde:ko.observable(),
    selectedBina:ko.observable(),
    selectedDaire:ko.observable(),

    getIl: function () {
        self = this;
        var data = {
            adres: { fieldName: "ad", op: 6, value:"" },
        };
        crmAPI.getAdress(data, function (a, b, c) {
            self.ilList(a);
        }, null, null)
    },
    getIlce: function (ilKimlikNo) {
        var self = this;
        var data = {
            adres: { fieldName: "ilKimlikNo", op:2, value: ilKimlikNo},
        };
        crmAPI.getAdress(data, function (a, b, c) {
            self.ilceList(a);
        }, null, null)
    },
    getMahalle: function (ilceKimlikNo) {
        var self = this;
        var data = {
            adres: { fieldName: "ilceKimlikNo", op: 2, value: ilceKimlikNo },
        };
        crmAPI.getAdress(data, function (a, b, c) {
            self.mahalleList(a);
        }, null, null)
    },
    getCadde: function (mahalleKoyBaglisiKimlikNo) {
        var self = this;
        var data = {
            adres: { fieldName: "mahalleKoyBaglisiKimlikNo", op: 2, value: mahalleKoyBaglisiKimlikNo },
        };
        crmAPI.getAdress(data, function (a, b, c) {
            self.caddeList(a);
        }, null, null);
    },
    getBina: function (mahalleKoyBaglisiKimlikNo,yolKimlikNo) {
        var self = this;
        var data = {
            adres: { fieldName: "mahalleKoyBaglisiKimlikNo", op: 2, value: mahalleKoyBaglisiKimlikNo },
            subAdres: { fieldName: "yolKimlikNo", op: 2, value: yolKimlikNo },
        };
        crmAPI.getAdress(data, function (a, b, c) {
            self.binaList(a);
        }, null, null);
    },
    getDaire: function (mahalleKoyBaglisiKimlikNo, binaKimlikNo) {
        var self = this;
        var data = {
            adres: { fieldName: "mahalleKoyBaglisiKimlikNo", op: 2, value: mahalleKoyBaglisiKimlikNo },
            subAdres: { fieldName: "yolKimlikNo", op: 2, value: binaKimlikNo },
        };
        crmAPI.getAdress(data, function (a, b, c) {
            self.daireList(a);
        }, null, null);
    },
    insertAdslSalesTask: function () {
        var self = this;
        var data = {
            tc: self.tckimlikno(),

        };
        if (data.customerid != null && data.attachedpersonelid != null && data.appointmentdate != null)
            crmAPI.savesalestask(data, function (a, b, c) { self.returntaskorderno(a) }, null, null);
        else alert("Eksik Bilgi Girdiniz.!");
    },
    renderBindings: function () {
        var self = this;
        self.getIl();
        ko.applyBindings(dataModel, $("#bindingmodal")[0]);
    }
}
dataModel.selectedIl.subscribe(function (v) {
    dataModel.getIlce(v);
});
dataModel.selectedIlce.subscribe(function (v) {
    dataModel.getMahalle(v);
});
dataModel.selectedMahalle.subscribe(function (v) {
    dataModel.getCadde(v);
});
dataModel.selectedCadde.subscribe(function (v) {
    dataModel.getBina(selectedMahalle,v);
});
dataModel.selectedBina.subscribe(function (v) {
    dataModel.getBina(selectedMahalle, v);
});