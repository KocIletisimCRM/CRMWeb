/// <reference path="crmwebapi.js" />

$(document).ready(function () {
    $('#taskNameFilter').multiselect();
});

var taskFilterModel = (function () {
    return {
        data: ko.observable([]),
        value: ko.observable({}),
        afterTemplateRender: function () {
            var _self = taskFilterModel;
            crmAPI.getTaskFilter(function (data) {
                _self.data(data);
                $('#taskNameFilter').multiselect('rebuild');
            }, function (error) {

            });
        }
    }
})();
ko.applyBindings();