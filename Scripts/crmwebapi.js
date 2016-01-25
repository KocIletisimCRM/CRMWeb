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

     var getCookie = function (cname) {
         var name = cname + "=";
         var ca = document.cookie.split(';');
         for (var i = 0; i < ca.length; i++) {
             var c = ca[i];
             while (c.charAt(0) == ' ') c = c.substring(1);
             if (c.indexOf(name) == 0) {
                 try {
                     return JSON.parse(c.substring(name.length, c.length));
                 }
                 catch (e) {
                     return c.substring(name.length, c.length);
                 }
             }
         }
         return {};
     };

     var setCookie = function (key, keyvalue, value) {
         var cookieObj;
         try {
             cookieObj = JSON.parse(getCookie(key));
         } catch (e) {
             cookieObj = getCookie(key) || {}
         }
         if (value) cookieObj[keyvalue] = value;
         else cookieObj = keyvalue;
         document.cookie = key + "=" + JSON.stringify(cookieObj);
     };

     var getData = function (callType, path, sendData, onsuccess, onerror, before) {
          var baseURL = "http://crmapitest.kociletisim.com.tr/api/Fiber/";
          //var baseURL = "http://localhost:50752/api/Fiber/";
         $.ajax({
             method: callType,
             url: baseURL + path,
             data: JSON.stringify(sendData),
             contentType: "application/json",
             async: true,
             beforeSend: function (xhr) {
                 //Download progress
                 //$.mobile.loading('show');

                 if (sendData && sendData.username) {
                     xhr.setRequestHeader("X-KOC-UserName", sendData.username);
                     xhr.setRequestHeader("X-KOC-Pass", sendData.password);
                     xhr.setRequestHeader("X-KOC-UserType", sendData.userType);
                 } else {
                     var x = document.cookie;

                     var token = getCookie("token");
                     xhr.setRequestHeader("X-KOC-Token", token);
                 }

                 if (before) before();
             }
         }).success(function (data, status, xhr) {
             if (sendData && sendData.username) {
                 var token = xhr.getResponseHeader("X-KOC-Token"); // Cooki'ye yaz
                 document.cookie = "token=" + token;
                 if (!token)
                     alert("Kullanıcı Bilgileri Hatalı");
             } else {
                 if (data.loginError)
                     window.location.href = "Login.html"; // hata var token geçersiz ,login sayfasına yönlendir. Ama önce süreli bir ekranda hata görünsün.
                 //document.location.href = document.location.host;
             }
             if (onsuccess) onsuccess(data);
         }).fail(function (xhr, status, error) {
             if (onerror)
                 onerror(error);
         });
     }
     return {
         getCookie: function (key) { return getCookie(key); },
         setCookie: function (key, keyvalue, value) { setCookie(key, keyvalue, value); },

        login: function (data, onsuccess, onerror, before) {
             getData("POST", "Authorize/getToken", data, onsuccess, onerror, before);
        },
        userInfo: function (onsuccess, onerror, before) {
            getData("POST", "Authorize/getUserInfo", {}, onsuccess, onerror, before);
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
            getData("POST", "Taskstatepool/getTaskState", data, onsuccess, onerror, before);
        },
        saveTaskState: function (data, onsuccess, onerror, before) {
            getData("POST", "Taskstatepool/saveTaskState", data, onsuccess, onerror, before);
        },
        insertTaskState: function (data, onsuccess, onerror, before) {
            getData("POST", "Taskstatepool/insertTaskState", data, onsuccess, onerror, before);
        },
        saveTaskStateMatches: function (data, onsuccess, onerror, before) {
            getData("POST", "Taskstatematches/saveTaskStateMatches", data, onsuccess, onerror, before);
        },
        insertTaskStateMatches: function (data, onsuccess, onerror, before) {
            getData("POST", "Taskstatematches/insertTaskStateMatches", data, onsuccess, onerror, before);
        },
        getTaskStateMatches: function (data, onsuccess, onerror, before) {
            getData("POST", "Taskstatematches/getTaskStateMatches", data, onsuccess, onerror, before);
        },
        getDocuments: function (data, onsuccess, onerror, before) {
            getData("POST", "Document/getDocuments", data, onsuccess, onerror, before);
        },
        saveDocument: function (data, onsuccess, onerror, before) {
            getData("POST", "Document/saveDocument", data, onsuccess, onerror, before);
        },
        insertDocument: function (data, onsuccess, onerror, before) {
            getData("POST", "Document/insertDocument", data, onsuccess, onerror, before);
        },
        getCampaigns: function (data, onsuccess, onerror, before) {
            getData("POST", "Campaign/getCampaigns", data, onsuccess, onerror, before);
        },
        saveCampaigns: function (data, onsuccess, onerror, before) {
            getData("POST", "Campaign/saveCampaigns", data, onsuccess, onerror, before);
        },
        insertCampaigns: function (data, onsuccess, onerror, before) {
            getData("POST", "Campaign/insertCampaigns", data, onsuccess, onerror, before);
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
            getData("POST", "Taskqueue/getTaskQueues", data, onsuccess, onerror, before)
        },
        getTQStockMovements: function (data, onsuccess, onerror, before) {
            getData("POST", "TaskQueue/getTQStockMovements", data, onsuccess, onerror, before)
        },
        getTQDocuments: function (data, onsuccess, onerror, before) {
            getData("POST", "TaskQueue/getTQDocuments", data, onsuccess, onerror, before)
        },
        closeTaskQueues: function (data, onsuccess, onerror, before) {
            getData("POST", "Task/closeTaskQueues", data, onsuccess, onerror, before)
        },
        saveTaskQueues: function (data,onsuccess,onerror,before) {
            getData("POST", "Taskqueue/saveTaskQueues", data, onsuccess, onerror, before)
        },
        savesalestask: function (data, onsuccess, onerror, before) {
            getData("POST", "Taskqueue/saveSalesTask", data, onsuccess, onerror, before)
        },
        saveFaultTask: function (data, onsuccess, onerror, before) {
            getData("POST", "Taskqueue/saveFaultTask", data, onsuccess, onerror, before)
        },
        personelattachment: function (data, onsuccess, onerror, before) {
            getData("POST", "Taskqueue/personelattachment", data, onsuccess, onerror, before)
        },
        getCampaignInfo: function (data, onsuccess, onerror, before) {
            getData("POST", "Filter/getCampaignInfo", data, onsuccess, onerror, before)
        },
        saveCustomerCard: function (data, onsuccess, onerror, before) {
            getData("POST", "Taskqueue/saveCustomerCard", data, onsuccess, onerror, before)
        },
        getBlockList: function (data,onsucces,onerror,before) {
            getData("POST", "SiteBlock/getBlocks",data,onsucces,onerror,before)
        },
        editBlock: function (data, onsucces, onerror, before) {
            getData("POST", "SiteBlock/editBlock", data, onsucces, onerror, before)
        },
        insertBlock: function (data, onsucces, onerror, before) {
            getData("POST", "SiteBlock/insertBlock", data, onsucces, onerror, before)
        },
        getSiteList: function (data, onsucces, onerror, before) {
            getData("POST", "SiteBlock/getSites", data, onsucces, onerror, before)
        },
        editSite: function (data, onsuccess, onerror, before) {
            getData("POST", "SiteBlock/editSite", data, onsuccess, onerror, before)
        },
        insertSite: function (data, onsuccess, onerror, before) {
            getData("POST", "SiteBlock/insertSite", data, onsuccess, onerror, before)
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
        confirmSM: function (data, onsucces, onerror, before) {
            getData("POST", "Stock/confirmSM", data, onsucces, onerror, before)
        },
        getAdress: function (data, onsucces, onerror, before) {
            getData("POST", "Task/getAdress", data, onsucces, onerror, before)
        },
        getProducts: function (data, onsucces, onerror, before) {
            getData("POST", "Product/getProducts", data, onsucces, onerror, before)
        },
        saveProduct: function (data, onsucces, onerror, before) {
            getData("POST", "Product/saveProduct", data, onsucces, onerror, before)
        },
        insertProduct: function (data, onsucces, onerror, before) {
            getData("POST", "Product/insertProduct", data, onsucces, onerror, before)
        },
        getPersonels: function (data, onsucces, onerror, before) {
            getData("POST", "Personel/getPersonels", data, onsucces, onerror, before)
        },
        savePersonel: function (data, onsucces, onerror, before) {
            getData("POST", "Personel/savePersonel", data, onsucces, onerror, before)
        },
        insertPersonel: function (data, onsucces, onerror, before) {
            getData("POST", "Personel/insertPersonel", data, onsucces, onerror, before)
        },
        getStockCards: function (data, onsucces, onerror, before) {
            getData("POST", "Stockcard/getStockCards", data, onsucces, onerror, before)
        },
        saveStockCard: function (data, onsucces, onerror, before) {
            getData("POST", "Stockcard/saveStockCard", data, onsucces, onerror, before)
        },
        insertStockCard: function (data, onsucces, onerror, before) {
            getData("POST", "Stockcard/insertStockCard", data, onsucces, onerror, before)
        },
        getPersonelStock: function (data, onsucces, onerror, before) {
            getData("POST", "Filter/getPersonelStock", data, onsucces, onerror, before)
        },
        getSerialsOnPersonel: function (data, onsucces, onerror, before) {
            getData("POST", "Filter/getSerialsOnPersonel", data, onsucces, onerror, before)
        },
        ///Save Tasks Metodları
        savePenetrasyonStart:function(data,onsuccess,onerror,before){
            getData("POST", "SaveTasks/savePenetrasyon",data,onsuccess,onerror,before)
        },
        saveGlobalTask: function (data, onsuccess, onerror, before) {
            getData("POST", "SaveTasks/saveGlobalTask", data, onsuccess, onerror, before)
        },
        //
        
        
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




