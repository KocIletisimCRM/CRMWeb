/// <reference path="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js" />
/// <reference path="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js" />
/// <reference path="https://cdnjs.cloudflare.com/ajax/libs/knockout/3.3.0/knockout-min.js" />

Object.prototype.toObservable = function () {
    var t = {}, i;
    if (typeof this.valueOf() === "object") {
        for (i in this) {
            this.hasOwnProperty(i) && this[i] && (t[i] = this[i].toObservable());
        }
        return t;
    }
    return typeof this.valueOf() === "array" ? ko.observable([this.valueOf()]) : ko.observable(this.valueOf());
}

var crmAPI = (function () {
    var getData = function (callType, path, sendData, onsuccess, onerror, before) {
        var baseURL = "http://localhost:50752/api/";
        $.ajax({
            method: callType,
            url: baseURL + path,
            data: JSON.stringify(sendData),
            contentType: "application/json",
            beforeSend: function () {
                if (before) before();
            }
        }).success(function (data, status, xhr) {
            if (onsuccess) onsuccess(data);
        }).fail(function (xhr, status, error) {
            if (onerror) onerror(error);
        });
    }
    return {
        getTaskFilter: function (onsuccess, onerror, before) {
            getData("GET", "/Filter/getTasks", {}, onsuccess, onerror, before);
        }
    }
})();




