
var dataModel = {

    savemessage: ko.observable(),
    savemessagecode: ko.observable(),
    password: ko.observable(),
    personel:ko.observable(),
    getPersonelCard: function (personelid) {
        var self = this;
        var data = {
            personel: { fieldName: 'personelid', op: 2, value: personelid },
        };
        crmAPI.getPersonels(data, function (a, b, c) {
            self.personel(a.data.rows[0]);
        }, null, null);
    },
    savePersonel: function () {
        var self = this;
        var data = self.personel();
        crmAPI.savePersonel(data, function (a, b, c) {
            self.savemessage(a.errorMessage);
            self.savemessagecode(a.errorCode);
            window.setTimeout(function () {
                $('#myModal').modal('hide');
                
            }, 1000);
        }, null, null);
    },
    renderBindings: function () {
        var self=this;
        $(document).ready(function () {
            crmAPI.userInfo(function (a, b, c) {
                var ID = a.userId;
                self.getPersonelCard(ID);
            }, null, null);

        });
        ko.applyBindings(dataModel, $("#bindingmodal")[0]);
    }
}