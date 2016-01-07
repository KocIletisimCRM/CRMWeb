
var dataModel = {

    taskorderno: ko.observable(),
    taskname: ko.observable(),
    taskid: ko.observable(),
    taskstatetype:ko.observable(),
    previoustask: ko.observable(),
    relatedtask: ko.observable(),
    taskstatus: ko.observable(),
    creationdate: ko.observable(),
    attachmentdate: ko.observable(),
    appointmentdate: ko.observable(),
    consummationdate: ko.observable(),
    personelname: ko.observable(),
    personelid: ko.observable(),
    assistantpersonel: ko.observable(),
    sitename: ko.observable(),
    blockname: ko.observable(),
    region: ko.observable(),
    customername: ko.observable(),
    customerid: ko.observable(),
    flat:ko.observable(),
    locationid: ko.observable(),
    customer: ko.observableArray([]),
    selectedCustomer:ko.observable(),
    customergsm: ko.observable(),
    customerstatus: ko.observable(),
    description: ko.observable(),
    taskstatuslist: ko.observableArray([]),
    personellist:ko.observableArray([]),
    ctstatuslist: ko.observableArray([]),
    issStatusList: ko.observableArray([]),
    netStatusList: ko.observableArray([]),
    telStatusList: ko.observableArray([]),
    tvStatusList: ko.observableArray([]),
    TurkcellTvStatusList: ko.observableArray([]),
    gsmStatusList: ko.observableArray([]),
    message: ko.observable(),
    flag: ko.observable(false),

    //abone ürün kampanya bilgileri işlemleri

    //yon: function () {
    //    var self = this;
    //    var tempPage = document.location.hash.replace("#", "").split("?")[0];
    //    $("#editContainer").loadTemplate("Templates/New/AboneUrunBilgileri.html");
    //},
   getCustomerCard : function () {
       var self = this;
       self.getIssStatus();
       self.getGsmStatus();
       self.getNetStatus();
       self.getTvKullanımıStatus();
       self.getTurkcellTvStatus();
       self.getTelStatus();
        var obj = self.customer();
        obj.closedKatZiyareti = false;
        self.selectedCustomer(obj);
        //getCustomerCard.CustomerCard(self.customerid(),function (a, b, c) {self.customerCardList(a) });
   },
   saveCustomer: function () {
       var self = this;
       self.selectedCustomer().customer_status = { id: $("#abonedurumuinfo").val() };
       self.selectedCustomer().issStatus = { id: $("#issstatus").val() };
       self.selectedCustomer().netStatus = { id: $("#netstatus").val() };
       self.selectedCustomer().gsmKullanımıStatus = { id: $("#gsmstatus").val() };
       self.selectedCustomer().telStatus = { id: $("#telstatus").val() };
       self.selectedCustomer().TvKullanımıStatus = { id: $("#tvstatus").val() };
       self.selectedCustomer().TvKullanımıStatus = { id: $("#telstatus").val() };
       var data = self.selectedCustomer();
       crmAPI.saveCustomerCard(data, function (a, b, c) {
           if (a == "ok")
               self.refresh();
       }, null, null);
   },
    subcategorylist: ko.observableArray([]),
    categorylist: ko.observableArray([]),
    campaignlist: ko.observableArray([]),
    productlist: ko.observableArray([]),
    selectedProductIds:ko.observableArray([]),
    category: ko.observable(),
    subcategory: ko.observable(),
    campaignid: ko.observable(),
    customerProductList: ko.observableArray([]),
    info:ko.observable(),//eğer müşterinin dökümanları geliyorsa kaydet butonunu disable yapalım
    closedTaskqueueResponseMessage: ko.observable(),

    getcategory: function () {
        var self = this;
        data = {
            category: { fieldName: 'category', op: 6, value: '' }
        },
        crmAPI.getCampaignInfo(data, function (a, b, c) {
            self.categorylist(a);
            $("#kategori").multiselect("setOptions", self.categorylist()).multiselect("rebuild");
           
            self.category(self.customerProductList()[0]? self.customerProductList()[0].campaigns.category:null);
                $("#kategori").multiselect("refresh");
            
           
        }, null, null)
    },
    getsubcategory: function () {
        var self = this;
        data = {
            category: { fieldName: 'category', op: 6, value: self.category()?self.category() :'' },
            subcategory: { fieldName: 'subcategory', op: 6, value: '' }
        },
        crmAPI.getCampaignInfo(data, function (a, b, c) {
            self.subcategorylist(a);
            $("#urun").multiselect("setOptions", self.subcategorylist()).multiselect("rebuild");
            self.subcategory(self.customerProductList()[0] ?self.customerProductList()[0].campaigns.subcategory:null);
            $("#urun").multiselect("refresh");
        }, null, null)
    },
    getcamapign: function () {
        var self = this;
        data = {
            category: { fieldName: 'category', op: 6, value: self.category() ? self.category() : '' },
            subcategory: { fieldName: 'subcategory', op: 6, value: self.subcategory()?self.subcategory():'' },
            campaign: { fieldName: 'name', op: 6, value: '' }
        },
        crmAPI.getCampaignInfo(data, function (a, b, c) {
            self.campaignlist(a);
            $("#kampanya").multiselect("setOptions", self.campaignlist()).multiselect("rebuild");
            self.campaignid(self.customerProductList()[0] ? self.customerProductList()[0].campaigns.id :null);
            $("#kampanya").multiselect("refresh");
        }, null, null)
    },
    getproduct: function () {
        var self = this;
        data = {
            category: { fieldName: 'category', op: 6, value: self.category() ? self.category() : '' },
            subcategory: { fieldName: 'subcategory', op: 6, value: self.subcategory() ? self.subcategory() : '' },
            campaign: { fieldName: 'id', op: 2, value: self.campaignid() },
            products:{fieldName:'productname',op:6,value:''}
        },
        crmAPI.getCampaignInfo(data, function (a, b, c) {
            $.each(a, function (index, category) {
                category.selectedProduct = ko.observable("0");
                category.selectedProduct.subscribe(function (v) {
                    self.selectedProductIds.push(v);
                    console.log(v);
                });
                $.each(category.products, function (pindex, product) {
                    $.each(self.customerProductList(), function (cpIndex, customerProduct) {
                        if (product.productid === customerProduct.productid) category.selectedProduct(product.productid+"");
                    });
                });
            });
            self.productlist(a);
        }, null, null)
    },
    stockcardlist: ko.observableArray([]),
    stockmovement: ko.observableArray([]),

    fileNode: ko.observable(document.getElementById("file")),

    gettaskstatus: function (statusVal) {
        var self = this;
        var data = {
            task: { fieldName: "taskid", op: 2, value:self.taskid()},
            taskstate: { fieldName: "taskstate", op: 6, value: '' },
        };
        crmAPI.getTaskStatus(data, function (a, b, c) {
             self.taskstatuslist(a);
             self.taskstatus(statusVal);
             $("#taskdurumu").multiselect({
                 includeSelectAllOption: true,
                 selectAllValue: 'select-all-value',
                 maxHeight: 250,
                 buttonWidth: '100%',
                 nonSelectedText: 'Seçiniz',
                 numberDisplayed: 2,
                 selectAllText: 'Tümünü Seç!',
                 enableFiltering: true,
                 filterPlaceholder: 'Ara'
             });
         }, null, null)
    },
    redirect : function () {
        window.location.href = "app.html";
    },
    refresh: function () {
        var self = this;
        window.location.reload();
    },
    getpersonel: function () {
        var self = this;
        crmAPI.getPersonel(function (a, b, c) {
            self.personellist(a);
            $("#assistantPersonel").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: 'Personel Seçiniz',
                nSelectedText: 'Personel Seçildi!',
                numberDisplayed: 2,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
        }, null, null)
    },
    getCustomerStatus: function () {
        var self = this;
        crmAPI.getCustomerStatus(function (a, b, c) {
            self.ctstatuslist(a);
            $("#abonedurumu,#abonedurumuinfo").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: 'Abone Durumunu Seçiniz',
                nSelectedText: 'Abone Durumu Seçildi!',
                numberDisplayed: 2,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
        }, null, null)
    },
    getIssStatus: function () {
        var self = this;
        crmAPI.getIssStatus(function (a, b, c) {
            self.issStatusList(a);
    }, null, null);
    },
    getNetStatus: function () {
        var self = this;
        crmAPI.getNetStatus(function (a, b, c) {
            self.netStatusList(a);
        }, null, null)
    },
    getTelStatus: function () {
        var self = this;
        crmAPI.getTelStatus(function (a, b, c) {
            self.telStatusList(a);
        }, null, null)
    },
    getTvKullanımıStatus: function () {
        var self = this;
        crmAPI.getTvKullanımıStatus(function (a, b, c) {
            self.tvStatusList(a);
        }, null, null)
    },
    getTurkcellTvStatus: function () {
        var self = this;
        crmAPI.getTurkcellTvStatus(function (a, b, c) {
            self.TurkcellTvStatusList(a);
        }, null, null)
    },
    getGsmStatus: function () {
        var self = this;
        crmAPI.getGsmStatus(function (a, b, c) {
            self.gsmStatusList(a);
        }, null, null)
    },
    saveTaskQueues: function () {
        var self = this;
        data = {
            taskorderno: self.taskorderno(),
            task:{taskid:self.taskid()},
            taskstatepool: 
                {
                    taskstateid: self.taskstatus() ? self.taskstatus() : null,
                taskstate: $("#taskdurumu option:selected").text() ? $("#taskdurumu option:selected").text():null
                },

            description: self.description() ? self.description() : null,
            asistanPersonel: { personelid: self.assistantpersonel()>0? self.assistantpersonel() : null },
            appointmentdate: self.appointmentdate() ? moment(self.appointmentdate()).format() : null,
            consummationdate: self.consummationdate() ? moment(self.consummationdate()).format() : null,
            creationdate: self.creationdate() ? moment(self.creationdate()).format() : null,
            attachmentdate: self.attachmentdate() ? moment(self.attachmentdate()).format() : null,
        };
        crmAPI.saveTaskQueues(data, function (a, b, c) {
            self.message(a);
        }, null, null)

    },
    closeTaskQueues: function () {
        var self = this;
        var data = {
            campaignid: self.campaignid(),
            selectedProductsIds: self.selectedProductIds(),
            taskorderno: self.taskorderno(),
        };
        crmAPI.closeTaskQueues(data, function (a,b,c) {
            self.closedTaskqueueResponseMessage(a);
        }, null, null);

    },
    saveStockMovements: function () {
        var self = this;
        var postdata = [];
        for (var i = 0; i < dataModel.stockcardlist().length; i++) {
            var pd =  {
                movementid: self.stockcardlist()[i].movementid,
                relatedtaskqueue: self.stockcardlist()[i].relatedtaskqueue,
                amount: self.stockcardlist()[i].used(),
                serialno:self.stockcardlist()[i].serial(),
                fromobjecttype:self.stockcardlist()[i].fromobjecttype,
                fromobject:self.stockcardlist()[i].fromobject,
                toobjecttype:self.stockcardlist()[i].toobjecttype,
                toobject:self.stockcardlist()[i].toobject,
                stockcardid:self.stockcardlist()[i].stockid,               
            };
            postdata.push(pd);
        }
        crmAPI.SaveStockMovementMultiple(postdata, function (a, b, c) {
            self.message(a);
        }, null, null);
        console.log(postdata);
    },
    upload: function () {
        var self = this;
        crmAPI.uploadFile();
    },

    renderBindings: function () {
        var self = this;

        var hashSearches = document.location.hash.split("?");
        if(hashSearches.length > 1) { 
            $("#kategori").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: ' Seçiniz',
                nSelectedText: ' Seçildi!',
                numberDisplayed: 2,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
            $("#urun").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: ' Seçiniz',
                nSelectedText: ' Seçildi!',
                numberDisplayed: 2,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
            $("#kampanya").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: ' Seçiniz',
                nSelectedText: ' Seçildi!',
                numberDisplayed: 2,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
            $("#input-702").fileinput({
                uploadUrl: "http://localhost:50752/api/Adsl/Task/upload", // server upload action
                uploadAsync: true,
                minFileCount: 1,
                maxFileCount: 10,
                overwriteInitial: false,
                uploadExtraData: function () {
                    return {
                        img_key: self.customerid() + "-" + self.customername(),
                        tqid: self.taskorderno(),
                        docid:1
                    };
                }
            });
            var data = { taskOrderNo: hashSearches[1] };
            crmAPI.getTaskQueues(data, function (a, b, c) {
                self.taskorderno(a.data.rows[0].taskorderno);               
                self.taskname(a.data.rows[0].task.taskname);
                self.taskid(a.data.rows[0].task.taskid);
                self.taskstatetype(a.data.rows[0].taskstatepool && a.data.rows[0].taskstatepool.statetype || null)
                var status = a.data.rows[0].taskstatepool && a.data.rows[0].taskstatepool.taskstateid || null;
                self.gettaskstatus(status);

                self.previoustask(a.data.rows[0].previoustaskorderid);
                self.relatedtask(a.data.rows[0].relatedtaskorderid);
                self.creationdate(a.data.rows[0].creationdate);
                self.attachmentdate(a.data.rows[0].attachmentdate && a.data.rows[0].attachmentdate || null);
                self.appointmentdate(a.data.rows[0].appointmentdate ? a.data.rows[0].appointmentdate : null);
                self.consummationdate(a.data.rows[0].consummationdate && moment(a.data.rows[0].consummationdate).format('lll') || null);
                self.personelname(a.data.rows[0].attachedpersonel && a.data.rows[0].attachedpersonel.personelname || 'atanmamış');
                self.personelid(a.data.rows[0].attachedpersonel && a.data.rows[0].attachedpersonel.personelid || 0);
                self.assistantpersonel(a.data.rows[0].asistanPersonel ? a.data.rows[0].asistanPersonel.personelid : 'atanmamış');
                $("#assistantPersonel").multiselect("refresh");
                self.sitename(((a.data.rows[0].attachedobject.sitename || (a.data.rows[0].attachedobject.site && a.data.rows[0].attachedobject.site.sitename) ||
                               (a.data.rows[0].attachedobject.block && a.data.rows[0].attachedobject.block.site && a.data.rows[0].attachedobject.block.site.sitename)) ||
                              '&lt;boş&gt;'
                             ));
                self.blockname(a.data.rows[0].attachedobject.blockname || (a.data.rows[0].attachedobject.block && a.data.rows[0].attachedobject.block.blockname) || '');
                self.region(((a.data.rows[0].attachedobject.region || (a.data.rows[0].attachedobject.site && a.data.rows[0].attachedobject.site.region) ||
                               (a.data.rows[0].attachedobject.block && a.data.rows[0].attachedobject.block.site && a.data.rows[0].attachedobject.block.site.region)) ||
                              '&lt;boş&gt;'
                             ));
                self.customername(a.data.rows[0].attachedobject.customername && (a.data.rows[0].attachedobject.customername + ' ' + a.data.rows[0].attachedobject.customersurname) || '');
                self.customerid(a.data.rows[0].attachedobject.customerid && (a.data.rows[0].attachedobject.customerid) || '');
                console.log("asdf");
 
                self.customer(a.data.rows[0].attachedobject);
                self.flat(a.data.rows[0].attachedobject && (a.data.rows[0].attachedobject.flat) || '');
                self.customergsm(a.data.rows[0].attachedobject && a.data.rows[0].attachedobject.gsm || '');
                self.customerstatus(a.data.rows[0].attachedobject.customer_status && a.data.rows[0].attachedobject.customer_status.Text || '');
                $("#abonedurumu").multiselect("refresh");
                self.description(a.data.rows[0].description);
                self.locationid(a.data.rows[0].attachedobject.locationid || (a.data.rows[0].attachedobject.block && a.data.rows[0].attachedobject.block.locationid) || '');
                self.customerProductList(a.data.rows[0].customerproduct);
                self.info(a.data.rows[0].customerproduct[0] ?a.data.rows[0].customerproduct[0].campaigns.category:null);
                self.getcategory();
                self.stockmovement(a.data.rows[0].stockmovement);
                $.each(a.data.rows[0].stockcardlist, function (index, stockcard) {
                    stockcard.movementid = 0;
                    stockcard.fromobject = 0;
                    stockcard.toobject = 0;
                    stockcard.relatedtaskqueue = 0;
                    stockcard.fromobjecttype = 0;
                    stockcard.toobjecttype = 0;
                    stockcard.used = ko.observable(0);
                    stockcard.max = ko.observable(0);
                    stockcard.available = ko.observable(0);
                    stockcard.serial = ko.observable();
                    stockcard.serials = ko.observableArray([]);
                    stockcard.used.subscribe(function (v) {
                        if (v > stockcard.max())
                           stockcard.used(stockcard.max());
                        else if (v < 0)
                            stockcard.used(0);
                        stockcard.available(stockcard.max() - stockcard.used());
                        return v;
                    });
                    $.each(a.data.rows[0].attachedpersonel.stockstatus, function (sindex, status) {
                        if (stockcard.stockid == status.stockcardid) {
                            stockcard.available(status.amount);
                            stockcard.serials(status.serials);
                        }
                    });
                    $.each(a.data.rows[0].stockmovement, function (mindex, movement) {
                        if (stockcard.stockid == movement.stockcardid) {
                            stockcard.movementid = movement.movementid;
                            stockcard.fromobject = movement.fromobject;
                            stockcard.toobject = movement.toobject;
                            stockcard.relatedtaskqueue = movement.relatedtaskqueue;
                            stockcard.fromobjecttype = movement.fromobjecttype;
                            stockcard.toobjecttype = movement.toobjecttype;
                            stockcard.max(stockcard.available() + movement.amount);
                            if (stockcard.hasserial == true) stockcard.max(1);
                            stockcard.used(movement.amount);
                            if (movement.serialno) stockcard.serials.unshift(movement.serialno);
                            stockcard.serial(movement.serialno);
                        }
                    });                  
                });
                self.stockcardlist(a.data.rows[0].stockcardlist);
                
            }, null, null);          
            self.getpersonel();
            self.getCustomerStatus();
            $('#daterangepicker1,#daterangepicker2,#daterangepicker3,#daterangepicker4').daterangepicker({
                "singleDatePicker": true,
                "autoApply": false,
                "linkedCalendars": false,
                "timePicker": true,
                "timePicker24Hour": true,
                "timePickerSeconds": true,
                "locale": {
                    "format": 'MM/DD/YYYY h:mm A',
                },
            });

            ko.applyBindings(dataModel, $("#bindingContainer")[0]);
        }
    }



}

dataModel.category.subscribe(function (v) {
    dataModel.getsubcategory();
});
dataModel.subcategory.subscribe(function (v) {
    dataModel.productlist([]);
    if(v)
        dataModel.getcamapign();
});
dataModel.campaignid.subscribe(function (v) {
    dataModel.productlist([]);
    if(v)
    dataModel.getproduct();
});
dataModel.campaignInfoIsVisible = ko.computed(function () {
    if (dataModel.taskstatus() != null && dataModel.taskstatus() != 0 && dataModel.taskstatetype() != 2 && dataModel.consummationdate() !=null) {
        return true;
    }
    return false;
});


