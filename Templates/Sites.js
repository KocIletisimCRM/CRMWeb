
var dataModel = {
    typeHeadTagIds: "#site,#region",
    renderBindings: function () {
        $(this.typeHeadTagIds).kocTypeHead();
        ko.applyBindings(dataModel, $("#bindingContainer")[0]);
    }
}