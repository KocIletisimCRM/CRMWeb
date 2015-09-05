/// <reference path="crmwebapi.js" />


jQuery.fn.extend({
    loadTemplate: function (url, onload) {
        return this.load(url, function () {
            if (dataModel && dataModel.renderBindings) dataModel.renderBindings();
            if (onload) onload();
        });

    }
});