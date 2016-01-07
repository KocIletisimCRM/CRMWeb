
var dataModel = {

    attachedpersonelid: ko.observable(),
    date: ko.observable(),
    personellist: ko.observableArray([]),
    regionlist: ko.observableArray([]),
    sitelist: ko.observableArray([]),
    blocklist: ko.observableArray([]),
    region: ko.observable(),
    siteid: ko.observable(),
    blockid: ko.observable(),
    returntaskorderno: ko.observable(),
    saveMessage:ko.observable(),
    getpersonel: function () {
        self = this;
        crmAPI.getPersonel(function (a, b, c) {
            self.personellist(a);
            $("#ppersonel").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                numberDisplayed: 2,
                nonSelectedText: ' Seçiniz',
                nSelectedText: ' Seçildi!',
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
        }, null, null)
    },
    getregion: function () {
        var self = this;
        var data = { region: { fieldName: "region", value: '', op: 6 } }
        crmAPI.getSiteFilter(data, function (a, b, c) {
            self.regionlist(a);
            $("#obek").multiselect("setOptions", self.regionlist()).multiselect("rebuild");
        }, null, null);
    },
    getSite: function () {
        var self = this;
        var data = { site: { fieldName: "region", value: self.region(), op: 6 } }
        crmAPI.getSiteFilter(data, function (a, b, c) {
            self.sitelist(a);
            $("#site").multiselect("setOptions", self.sitelist()).multiselect("rebuild");
        }, null, null);
    },
    getBlock: function () {
        var self = this;
        var data = { block: { fieldName: "siteid", value: parseInt(self.siteid()), op: 2 } }
        crmAPI.getSiteFilter(data, function (a, b, c) {
            self.blocklist(a);
            $("#blok").multiselect("setOptions", self.blocklist()).multiselect("rebuild");
        }, null, null);
    },
    refresh: function () {
        var self = this;
        window.location.reload();
    },
    savePenetrasyonStart: function () {
        var self = this;
        var data = {
            date: self.date(),
            attachedpersonelid: self.attachedpersonelid(),
            blockid:self.blockid()
        };
        crmAPI.savePenetrasyonStart(data, function (a, b, c) {
            self.saveMessage(a)
            window.setTimeout(function () {
                $('#myModal').modal('hide');
                self.refresh();
            }, 1000);
        }, null, null);
       
    },
    renderBindings: function () {
        var self = this;
        $("#obek,#site,#blok").multiselect({
            includeSelectAllOption: true,
            selectAllValue: 'select-all-value',
            maxHeight: 250,
            buttonWidth: '100%',
            numberDisplayed: 2,
            nonSelectedText: ' Seçiniz',
            nSelectedText: ' Seçildi!',
            selectAllText: 'Tümünü Seç!',
            enableFiltering: true,
            filterPlaceholder: 'Ara'
        });
        self.getpersonel();
        self.getregion();
        $('#daterangepicker11').daterangepicker({
            "singleDatePicker": true,
            "autoApply": true,
            "linkedCalendars": false,
            "timePicker": true,
            "timePicker24Hour": true,
            "timePickerSeconds": true,
            "locale": {
                "format": 'MM/DD/YYYY h:mm A',
            },
        });
   
        ko.applyBindings(dataModel, $("#bindingmodal")[0]);
    }
}
dataModel.region.subscribe(function (v) {
    dataModel.getSite();
});
dataModel.siteid.subscribe(function (v) {
    dataModel.getBlock();
});