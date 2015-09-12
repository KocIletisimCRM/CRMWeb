/// <reference path="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js" />
/// <reference path="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js" />
/// <reference path="https://cdnjs.cloudflare.com/ajax/libs/knockout/3.3.0/knockout-min.js" />

 var convertToObservable = function (object) {
    var t = {}, i;
    if (typeof object.valueOf() === "object") {
        for (i in object) {
            object.hasOwnProperty(i) && object[i] && (t[i] = object[i].toObservable());
        }
        return t;
    }
    return typeof object.valueOf() === "array" ? ko.observable([object.valueOf()]) : ko.observable(object.valueOf());
}

var crmAPI = (function () {
    var getData = function (callType, path, sendData, onsuccess, onerror, before) {
        var baseURL = "http://crmapitest.kociletisim.com.tr:8083/api/";
        //var baseURL = "http://localhost:50752/api/";
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
        getTaskFilter: function (data,onsuccess, onerror, before) {
            getData("POST", "Filter/getTasks",data, onsuccess, onerror, before);
        },
        getSiteFilter: function (data, onsuccess, onerror, before) {
            getData("POST", "Filter/getCSB",data,onsuccess,onerror,before)
        },
        getCustomerStatus: function ( onsuccess, onerror, before) {
            getData("POST", "Filter/getCustomerStatus",null, onsuccess, onerror, before)
        },
        getIssStatus: function (onsuccess, onerror, before) {
            getData("POST", "Filter/getIssStatus", {}, onsuccess, onerror, before)
        },
        getTaskStatus: function (onsuccess, onerror, before) {
            getData("POST", "Filter/getTaskStatus", {}, onsuccess, onerror, before)
        },
        getTaskStatus: function (onsuccess, onerror, before) {
            getData("POST", "Filter/getTaskStatus", {}, onsuccess, onerror, before)
        },
        getPersonel: function (onsuccess, onerror, before) {
            getData("POST", "Filter/getPersonel", {}, onsuccess, onerror, before)
        },
        getTaskQueues: function (data,onsuccess, onerror, before) {
            getData("POST", "Task/getTaskQueues", data, onsuccess, onerror, before)
        },
        
        
    }
})();




