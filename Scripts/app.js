/// <reference path="crmwebapi.js" />



jQuery.fn.extend({
    loadTemplate: function (url, onload) {
        return this.load(url, function () {
            if (dataModel && dataModel.renderBindings) {
                ko.cleanNode("ModalContainer");
                dataModel.renderBindings();
            }
            if (onload) onload(); 
        });
    }
});


$(window).bind("hashchange", function () {
    document.location.reload();
}).load(function () {
    var tempPage = document.location.hash.replace("#", "").split("?")[0];
    $("#templateContainer").loadTemplate("Templates/" + (tempPage || "ListTaskqueue") + ".html");

    $("#fibersatis").click(function () {
        $("#ModalContainer").loadTemplate("Templates/New/FiberSales.html");
    });
    $("#yanindaekurun").click(function () {
        $("#ModalContainer").loadTemplate("Templates/New/YanindaEkUrun.html");
    }); 
    $("#adslsatis").click(function () {
        $("#ModalContainer").loadTemplate("Templates/New/AdslSales.html");
    });
    $("#retentionsatis").click(function () {
        $("#ModalContainer").loadTemplate("Templates/New/RetentionSatis.html");
    });
    $("#caymabedeli").click(function () {
        $("#ModalContainer").loadTemplate("Templates/New/Cayma.html");
    });
    $("#yonetimodasi").click(function () {
        $("#ModalContainer").loadTemplate("Templates/New/YonetimOdasi.html");
    });
    $("#arizataski").click(function () {
        $("#ModalContainer").loadTemplate("Templates/New/ArizaTaski.html");
    });
    $("#newadslsatis").click(function () {
        $("#ModalContainer").loadTemplate("Templates/New/NewAdslSales.html");
    });
    $("#newpenetrasyon").click(function () {
        $("#ModalContainer").loadTemplate("Templates/New/Penetrasyon.html");
    });
    $("#newglobaltask,#newglobaltask1").click(function () {
        $("#ModalContainer").loadTemplate("Templates/New/NewGlobalTask.html");
    });
    $("#newarizatask,#newarizatask1").click(function () {
        $("#ModalContainer").loadTemplate("Templates/New/NewArizaTask.html");
    });
    $("#uruniade").click(function () {
        $("#ModalContainer").loadTemplate("Templates/New/UrunIadeTask.html");
    });
    $("#username,#notice").click(function () {
        $("#ModalContainer").loadTemplate("Templates/New/Profil.html");
    });

    $("#exit").click(function () {
        document.cookie = "token=;";
        crmAPI.setCookie("tqlFilter", "");
        window.location.href = "Login.html";
    });

    $(document).ready(function () {
        var pid=0;
        crmAPI.userInfo(function (a, b, c) {
            $("#username").text(a.userFullName);
            pid = a.userId;
            if (a.userRole != 2147483647) {               
                $("#tanimlamalar").hide(true);
                $("#musteriler").hide(true);
            }
            var data = {
                personel: { fieldName: 'personelid', op: 2, value: pid },
            };
            crmAPI.getPersonels(data, function (a, b, c) {
                var pass = a.data.rows[0].password;
                if (pass == "123456") {
                    $("#notice").text("Güvenliğiniz için Şifrenizi değiştiriniz!");
                }
            }, null, null);
        }, null, null);
       
    });
});

