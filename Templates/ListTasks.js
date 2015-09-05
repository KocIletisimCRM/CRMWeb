
var dataModel = {

    multiSelectTagIds: "#taskadi",
    renderBindings: function () {
        $('#taskadi').multiselect({
            includeSelectAllOption: true,
            selectAllValue: 'select-all-value'
        });
        ko.applyBindings(dataModel, $("#bindingContainer")[0]);
    }
}