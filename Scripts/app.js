/// <reference path="crmwebapi.js" />


jQuery.fn.extend({
    loadTemplate: function (url, onload) {
        return this.load(url, function () {
            if (dataModel && dataModel.renderBindings) dataModel.renderBindings();
            if (onload) onload(); 
        });
    }
});

$(window).bind("hashchange", function () {
    document.location.reload();
}).load(function () {
    var tempPage = document.location.hash.replace("#", "").split("?")[0];
    $("#templateContainer").loadTemplate("Templates/" + (tempPage || "ListTaskqueue") + ".html");
  });
