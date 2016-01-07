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
    var baseURL = "http://crmapitest.kociletisim.com.tr:8083/api/Fiber/";
    //var baseURL = "http://localhost:50752/api/Fiber/"; 

        $.ajax({
            method: callType,
            url: baseURL + path,
            data: JSON.stringify(sendData),
            contentType: "application/json",
            async: true,
            
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

        login: function (data, onsuccess, onerror, before) {
            getData("POST", "Login/login", data, onsuccess, onerror, before);
        },
        getTaskFilter: function (data,onsuccess, onerror, before) {
            getData("POST", "Filter/getTasks",data, onsuccess, onerror, before);
        },
        saveTask: function (data, onsuccess, onerror, before) {
            getData("POST", "Task/saveTask", data, onsuccess, onerror, before);
        },
        insertTask: function (data, onsuccess, onerror, before) {
            getData("POST", "Task/insertTask", data, onsuccess, onerror, before);
        },
        getTSPFilter: function (data,onsuccess, onerror, before) {
            getData("POST", "Task/getTaskState",data, onsuccess, onerror, before);
        },
        saveTaskState: function (data, onsuccess, onerror, before) {
            getData("POST", "Task/saveTaskState", data, onsuccess, onerror, before);
        },
        insertTaskState: function (data, onsuccess, onerror, before) {
            getData("POST", "Task/insertTaskState", data, onsuccess, onerror, before);
        },
        getTaskStateMatches: function (data, onsuccess, onerror, before) {
            getData("POST", "Task/getTaskStateMatches", data, onsuccess, onerror, before);
        },
        getDocuments: function (data, onsuccess, onerror, before) {
            getData("POST", "Task/getDocuments", data, onsuccess, onerror, before);
        },
        saveDocument: function (data, onsuccess, onerror, before) {
            getData("POST", "Task/saveDocument", data, onsuccess, onerror, before);
        },
        insertDocument: function (data, onsuccess, onerror, before) {
            getData("POST", "Task/insertDocument", data, onsuccess, onerror, before);
        },
        getCampaigns: function (data, onsuccess, onerror, before) {
            getData("POST", "Task/getCampaigns", data, onsuccess, onerror, before);
        },
        saveCampaigns: function (data, onsuccess, onerror, before) {
            getData("POST", "Task/saveCampaigns", data, onsuccess, onerror, before);
        },
        insertCampaigns: function (data, onsuccess, onerror, before) {
            getData("POST", "Task/insertCampaigns", data, onsuccess, onerror, before);
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
        getNetStatus: function (onsuccess, onerror, before) {
            getData("POST", "Filter/getNetStatus", {}, onsuccess, onerror, before)
        },
        getTelStatus: function (onsuccess, onerror, before) {
            getData("POST", "Filter/getTelStatus", {}, onsuccess, onerror, before)
        },
        getTvKullanımıStatus: function (onsuccess, onerror, before) {
            getData("POST", "Filter/getTvKullanımıStatus", {}, onsuccess, onerror, before)
        },
        getTurkcellTvStatus: function (onsuccess, onerror, before) {
            getData("POST", "Filter/getTurkcellTvStatus", {}, onsuccess, onerror, before)
        },
        getGsmStatus: function (onsuccess, onerror, before) {
            getData("POST", "Filter/getGsmStatus", {}, onsuccess, onerror, before)
        },
        getTaskStatus: function (data,onsuccess, onerror, before) {
            getData("POST", "Filter/getTasks", data, onsuccess, onerror, before)
        },
        getPersonel: function (onsuccess, onerror, before) {
            getData("POST", "Filter/getPersonel", {}, onsuccess, onerror, before)
        },
        getAttacheablePersonel: function (data, onsuccess, onerror, before) {
            getData("POST", "Filter/getAttacheablePersonel", data, onsuccess, onerror, before)
        },
        getProductList: function (onsuccess, onerror, before) {
            getData("POST", "Filter/getProductList", {}, onsuccess, onerror, before)
        },
        getTaskQueues: function (data,onsuccess, onerror, before) {
            getData("POST", "Task/getTaskQueues", data, onsuccess, onerror, before)
        },
        closeTaskQueues: function (data, onsuccess, onerror, before) {
            getData("POST", "Task/closeTaskQueues", data, onsuccess, onerror, before)
        },
        saveTaskQueues: function (data,onsuccess,onerror,before) {
            getData("POST", "Task/saveTaskQueues", data, onsuccess, onerror, before)
        },
        savesalestask: function (data, onsuccess, onerror, before) {
            getData("POST", "Task/saveSalesTask", data, onsuccess, onerror, before)
        },
        saveFaultTask: function (data, onsuccess, onerror, before) {
            getData("POST", "Task/saveFaultTask", data, onsuccess, onerror, before)
        },
        personelattachment: function (data, onsuccess, onerror, before) {
            getData("POST", "Task/personelattachment", data, onsuccess, onerror, before)
        },
        getCampaignInfo: function (data, onsuccess, onerror, before) {
            getData("POST", "Filter/getCampaignInfo", data, onsuccess, onerror, before)
        },
        saveCustomerCard: function (data, onsuccess, onerror, before) {
            getData("POST", "Task/saveCustomerCard", data, onsuccess, onerror, before)
        },
        getBlockList: function (data,onsucces,onerror,before) {
            getData("POST", "SiteBlock/getBlocks",data,onsucces,onerror,before)
        },
        editBlock: function (data, onsucces, onerror, before) {
            getData("POST", "SiteBlock/editBlock", data, onsucces, onerror, before)
        },
        getSiteList: function (data, onsucces, onerror, before) {
            getData("POST", "SiteBlock/getSites", data, onsucces, onerror, before)
        },
        editSite: function (data, onsuccess, onerror, before) {
            getData("POST", "SiteBlock/editSite", data, onsuccess, onerror, before)
        },
        getTaskDefination: function (data, onsucces, onerror, before) {
            getData("POST", "Task/getTaskList", data, onsucces, onerror, before)
        },
        getObjectType: function (onsuccess, onerror, before) {
            getData("POST", "Filter/getObjectType", {}, onsuccess, onerror, before)
        },
        getObject: function (data, onsuccess, onerror, before) {
            getData("POST", "Filter/getObject", data, onsuccess, onerror, before)
        },
        getStockMovements: function (data,onsucces, onerror, before) {
            getData("POST", "Stock/getStockMovements", data,onsucces, onerror, before)
        },
        SaveStockMovementMultiple: function (data, onsucces, onerror, before) {
            getData("POST", "Stock/SaveStockMovementMultiple", data, onsucces, onerror, before)
        },
        InsertStockMovement: function (data, onsucces, onerror, before) {
            getData("POST", "Stock/InsertStockMovement", data, onsucces, onerror, before)
        },      
        getAdress: function (data, onsucces, onerror, before) {
            getData("POST", "Task/getAdress", data, onsucces, onerror, before)
        },
        getProducts: function (data, onsucces, onerror, before) {
            getData("POST", "Task/getProducts", data, onsucces, onerror, before)
        },
        saveProduct: function (data, onsucces, onerror, before) {
            getData("POST", "Task/saveProduct", data, onsucces, onerror, before)
        },
        insertProduct: function (data, onsucces, onerror, before) {
            getData("POST", "Task/insertProduct", data, onsucces, onerror, before)
        },
        getPersonels: function (data, onsucces, onerror, before) {
            getData("POST", "Task/getPersonels", data, onsucces, onerror, before)
        },
        savePersonel: function (data, onsucces, onerror, before) {
            getData("POST", "Task/savePersonel", data, onsucces, onerror, before)
        },
        insertPersonel: function (data, onsucces, onerror, before) {
            getData("POST", "Task/insertPersonel", data, onsucces, onerror, before)
        },
        getStockCards: function (data, onsucces, onerror, before) {
            getData("POST", "Task/getStockCards", data, onsucces, onerror, before)
        },
        saveStockCard: function (data, onsucces, onerror, before) {
            getData("POST", "Task/saveStockCard", data, onsucces, onerror, before)
        },
        insertStockCard: function (data, onsucces, onerror, before) {
            getData("POST", "Task/insertStockCard", data, onsucces, onerror, before)
        },
        getPersonelStock: function (data, onsucces, onerror, before) {
            getData("POST", "Filter/getPersonelStock", data, onsucces, onerror, before)
        },
        getSerialsOnPersonel: function (data, onsucces, onerror, before) {
            getData("POST", "Filter/getSerialsOnPersonel", data, onsucces, onerror, before)
        },
        
        
        uploadFile:function () {
        for (var i = 0; i < fileNode.files.length; i++) {
            var request = new XMLHttpRequest();
            request.upload.addEventListener('loadstart', function () {
                console.log(i+"'inci Yükleme başlatıldı");
            });
            request.upload.addEventListener('progress', function (e) {
                if (e.lengthComputable) {
                    console.log(i+"'inci Yüklenen : " + e.loaded + ",Toplam: " + e.total);
                } else {
                    console.log(i+"'inci Dosya boyutu hesaplanamıyor");
                }
            });
            request.upload.addEventListener('load', function (e) {
                console.log(i + "'inci Dosya Yükleme İşlemi Başarı ile Tamamlandı...");
            });

            request.open("post", "http://localhost:50752/api/Adsl/Upload", true);
            request.setRequestHeader("Content-Type", "multipart/form-data;boundary=SOME_BOUNDARY");
            request.setRequestHeader("X-File-Name", fileNode.files[i].name);
            request.setRequestHeader("X-File-Size", fileNode.files[i].size);
            request.setRequestHeader("X-File-Type", fileNode.files[i].type);
            request.send(fileNode.files[0]);
        }
       
}
        
    }
})();




