
var dataModel = {
    typeHeadTagIds: "#site,#region",
    sitename: ko.observable(),
    region: ko.observable(),




    renderBindings: function () {
        $(this.typeHeadTagIds).kocTypeHead();
        ko.applyBindings(dataModel, $("#bindingContainer")[0]);
    }
}