/// <reference path="app.js" />

$(document).ready(function () {

        $("#templateContainer").loadTemplate("Templates/ListTaskqueue.html");
        $("#listTaskqueue").click(function () {
            $("#templateContainer").loadTemplate("Templates/ListTaskqueue.html");
        });
        $("#listSites").click(function () {
            $("#templateContainer").loadTemplate("Templates/Sites.html");
        });
        $("#listBlocks").click(function () {
            $("#templateContainer").loadTemplate("Templates/Blocks.html");
        });
        $("#stockcardmovements").click(function () {
            $("#templateContainer").loadTemplate("Templates/ListStockMovements.html");
        });
        $("#stockcase").click(function () {
            $("#templateContainer").loadTemplate("Templates/ListStockCase.html");
        });
        $("#listTaskDefinetion").click(function () {
            $("#templateContainer").loadTemplate("Templates/ListTasks.html");
        });
        $("#taskstatepool").click(function () {
            $("#templateContainer").loadTemplate("Templates/ListTaskStatePool.html");
        });
        $("#taskstatematches").click(function () {
            $("#templateContainer").loadTemplate("Templates/ListTaskStateMatches.html");
        });
        $("#documentdefination").click(function () {
            $("#templateContainer").loadTemplate("Templates/ListDocument.html");
        });
        $("#listcampaigns").click(function () {
            $("#templateContainer").loadTemplate("Templates/ListCampaigns.html");
        });
        $("#listproducts").click(function () {
            $("#templateContainer").loadTemplate("Templates/ListProducts.html");
        });
        $("#liststockcards").click(function () {
            $("#templateContainer").loadTemplate("Templates/ListStockCards.html");
        });
        $("#listpersonel").click(function () {
            $("#templateContainer").loadTemplate("Templates/ListPersonel.html");
        });
        $("#duzenle").click(function () {
            $("#templateContainer").loadTemplate("Templates/TaskQueueEditForm.html");
        });

    });
