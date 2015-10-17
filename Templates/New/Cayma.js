
var dataModel = {

    deneme: ko.observable(),
    renderBindings: function () {

        ko.applyBindings(dataModel, $("#bindingmodal")[0]);
    }
}