
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
    siteid:ko.observable(),
    blockname: ko.observable(),
    blockid:ko.observable(),
    region: ko.observable(),
    customername: ko.observable(),
    customerid: ko.observable(),
    flat:ko.observable(),
    locationid: ko.observable(),
    telocadia:ko.observable(),
    customer: ko.observableArray([]),
    selectedCustomer: ko.pureComputed(function () {
        return dataModel.customersformodal()[0];
    }),
    custdescription:ko.observable(),
    customergsm: ko.observable(),
    customerstatus: ko.observable(),
    description: ko.observable(),
    descriptionControl: ko.observable(),
    taskstatuslist: ko.observableArray([]),
    personellist:ko.observableArray([]),
    ctstatuslist: ko.observableArray([]),
    issStatusList: ko.observableArray([]),
    netStatusList: ko.observableArray([]),
    telStatusList: ko.observableArray([]),
    tvStatusList: ko.observableArray([]),
    TurkcellTvStatusList: ko.observableArray([]),
    gsmStatusList: ko.observableArray([]),
    katziyareti: ko.observable(),
    isCloseableZiyaret:ko.observable(),
    message: ko.observable(),
    errorcode: ko.observable(),
    errormessage: ko.observable(),
    isCustomer:ko.observable(),
    flag: ko.observable(false),
    editable: ko.observable(),
    tasktype: ko.observable(),
    taskattacheableobject:ko.observable(),
    customerdocument: ko.observableArray([]),
    errormessage: ko.observable(),
    uploadControl: ko.observable(),
    subcategorylist: ko.observableArray([]),
    categorylist: ko.observableArray([]),
    campaignlist: ko.observableArray([]),
    productlist: ko.observableArray([]),
    selectedProductIds: ko.observableArray([]),
    category: ko.observable(),
    subcategory: ko.observable(),
    campaignid: ko.observable(),
    customerProductList: ko.observableArray([]),
    info: ko.observable(),//eğer müşterinin dökümanları geliyorsa kaydet butonunu disable yapalım
    closedTaskqueueResponseMessage: ko.observable(),
    selectedBlock:ko.observable(),
    isAttacheableCustomerTask: ko.pureComputed(function () {
        return dataModel.taskattacheableobject() == 16777220 ? true : false;
    }),
    //modal aktif pasif customers
    newtab: ko.observable(false),
    blockidforcust: ko.observable(),
    flatforcust: ko.observable(),
    customersformodal: ko.observableArray([]),
    customersformodalSelectedIndex: ko.observable(0),
    customerForModalAdd: function(){
        var newCustomer = {};
        for (var field in dataModel.selectedCustomer())
            if (dataModel.selectedCustomer().hasOwnProperty(field))
                newCustomer[field] = null;
        newCustomer.customerid = 0;
        newCustomer.customername =ko.observable("Yeni Müşteri");
        newCustomer.block = dataModel.selectedCustomer().block;
        newCustomer.flat = dataModel.selectedCustomer().flat;
        dataModel.customersformodalSelectedIndex(0);
        dataModel.customersformodal.unshift(newCustomer);
        dataModel.newtab(true);
    },
    //modal aktif pasif customer
    getCustomers: function () {
        var self = this;
        var data = {
            block: { fieldName: 'blockid', op: 2, value: self.blockidforcust() },
            flatNo: { fieldName: 'flat', op: 2, value: self.flatforcust() },
        };
        crmAPI.getCustomers(data, function (a, b, c) {
            self.customersformodal(a.data.rows);
        }, null, null);
    },
    closeableZiyaret: function () {
        if ($("#abonedurumuinfo").val() == "" || $("#issstatus").val()=="") {
             dataModel.isCloseableZiyaret(false);
        }
        else {
            dataModel.isCloseableZiyaret(true);
        }
    },
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
        self.closeableZiyaret();
        self.blockidforcust(self.customer().block.blockid);
        self.flatforcust(self.customer().flat);
        self.getCustomers();
        //self.selectedCustomer(obj);
       // getCustomerCard.CustomerCard(self.customerid(),function (a, b, c) {self.customerCardList(a) });
   },
    saveCustomer: function () {
       var self = this;
       self.selectedCustomer().customer_status = { id: $("#abonedurumuinfo").val() };
       self.selectedCustomer().issStatus = { id: $("#issstatus").val() };
       self.selectedCustomer().netStatus = { id: $("#netstatus").val() };
       self.selectedCustomer().gsmKullanımıStatus = { id: $("#gsmstatus").val() };
       self.selectedCustomer().telStatus = { id: $("#telstatus").val() };
       self.selectedCustomer().TvKullanımıStatus = { id: $("#tvstatus").val() };
       self.selectedCustomer().TurkcellTVStatus = { id: $("#ttvstatus").val() };
       self.selectedCustomer().closedKatZiyareti = self.katziyareti();
       var data = self.selectedCustomer();
       crmAPI.saveCustomerCard(data, function (a, b, c) {
           if (a == "ok")
               self.refresh();
       }, null, null);
    },
    saveCustomerWithKatZiyaret: function () {
        var self = this;
        self.katziyareti(true);
        if ($("#abonedurumuinfo").val()=="") {
            alert("Abone durumu girmeden kat ziyareti kapatılamaz.!");
        }
        else
        self.saveCustomer();
    },
    editBlock: function () {
        var self = this;
        self.selectedBlock().readytosaledate = $("#d1").val() ? $("#d1").val() : null;
        self.selectedBlock().sosaledate = $("#d2").val() ? $("#d2").val() : null;
        self.selectedBlock().kocsaledate = $("#d3").val() ? $("#d3").val() : null;
        var data = self.selectedBlock();
        crmAPI.editBlock(data, function (a, b, c) {
            self.errorcode(a.errorCode);
            self.errormessage(a.errorMessage);
            window.setTimeout(function () {
                $('#BlockModal').modal('hide');
            }, 1000);
        }, null, null);
    },

    campaignEditable: ko.pureComputed(function () {
        var b = true;
        $.each(dataModel.productlist(), function (index, cp) {
            b &= cp.selectedProduct() == 0;
        });
        return (dataModel.editable() || b) && (dataModel.tasktype() === 1);
    }),
    campaignIsValid: ko.pureComputed(function () {
        var b = true;
        $.each(dataModel.productlist(), function (index, cp) {
            b &= cp.selectedProduct() > 0;
        });
        return !dataModel.campaignEditable() || (b && dataModel.productlist().length > 0) || dataModel.taskstatetype()==2;
    }),
    smEditable: ko.pureComputed(function () {
        var b = true;
        $.each(dataModel.stockmovement(), function (index, sm) {
            b &= sm.movementid == 0;
        });
        return b || dataModel.editable();
    }),
    smIsValid: ko.pureComputed(function () {
        var b = true;
        $.each(dataModel.stockmovement(), function (index, sm) {
            b &= sm.used() > 0;
        });
        return !dataModel.smEditable() || b;
    }),
    cdEditable: ko.pureComputed(function () {
        var b = true;
        $.each(dataModel.customerdocument(), function (index, cd) {
            b &= cd.id == 0;
        });
        return b || dataModel.editable();
    }),
    cdIsValid: ko.pureComputed(function () {
        var b = true;
        $.each(dataModel.customerdocument(), function (index, cd) {
            b &= cd.documenturl() && cd.documenturl().length > 0;
        });
        return !dataModel.cdEditable() || b;
    }),
    modelIsValid: ko.pureComputed(function () {
        return dataModel.campaignIsValid() && dataModel.smIsValid() && dataModel.cdIsValid();
    }),
    selectedProducts: ko.pureComputed(function () {
       var self = dataModel;
       var res = [];
       for (var i = 0; i < self.productlist().length; i++) {
           res.push({
               productid: self.productlist()[i].selectedProduct(),
               campaignid: self.campaignid(),
               taskid: self.taskorderno(),
               customerid: self.customerid(),
               id: self.productlist()[i].selectedProduct(),
           });
       }
       return res;
   }),
    selectedProductIds: ko.pureComputed(function () {
       var self = dataModel;
       var res = [];
       for (var i = 0; i < self.selectedProducts().length; i++) {
           res.push(self.selectedProducts()[i].productid);
       }
       return res;
   }),
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
            products: { fieldName: 'productname', op: 6, value: '' }
        },
        crmAPI.getCampaignInfo(data, function (a, b, c) {
            $.each(a, function (index, category) {
                category.selectedProduct = ko.observable("0");
                category.selectedProduct.subscribe(function () {
                    dataModel.getTQDocuments();
                });
                $.each(category.products, function (pindex, product) {
                    $.each(self.customerProductList(), function (cpIndex, customerProduct) {
                        if (product.productid === customerProduct.productid) {
                            category.selectedProduct(product.productid + "");
                        }
                    });
                });
            });
            self.productlist(a);
            var data = {
                taskorderno: dataModel.taskorderno(),
                taskid: dataModel.taskid(),
                stateid: dataModel.taskstatus(),
                campaignid: dataModel.campaignid(),
                customerproducts: dataModel.selectedProductIds(),
                isSalesTask: dataModel.tasktype() == 1
            };
            crmAPI.getTQDocuments(data, function (a, b, c) {
                $.each(a, function (index, doc) {
                    doc.documenturl = ko.observable(doc.documenturl);
                });
                dataModel.customerdocument(a);
            });
        }, null, null)
    },
    stockcardlist: ko.observableArray([]),
    stockmovement: ko.observableArray([]),


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
    getTQDocuments: function () {
        var self = this;
        var data = {
            taskorderno: dataModel.taskorderno(),
            taskid: dataModel.taskid(),
            stateid: dataModel.taskstatus(),
            campaignid: dataModel.campaignid(),
            customerproducts: dataModel.selectedProductIds(),
            isSalesTask: dataModel.tasktype() == 1
        };
        crmAPI.getTQDocuments(data, function (a, b, c) {
            $.each(a, function (index, doc) {
                doc.documenturl = ko.observable(doc.documenturl);
            });
            self.customerdocument(a);
        });
    },
    saveTaskQueues: function () {
        var self = this;
        $('.btn').prop('disabled', true);
        data = {
            taskorderno: self.taskorderno(),
            task: {
                taskid: self.taskid(),
                tasktypes: {
                    TaskTypeId:self.tasktype(),
                }
            },
            taskstatepool: 
                {
                taskstateid: self.taskstatus() ? self.taskstatus() : null,
                taskstate: $("#taskdurumu option:selected").text() ? $("#taskdurumu option:selected").text() : null,
                statetype: self.taskstatuslist()[$("#taskdurumu").prop('selectedIndex')].statetype
                },
            customerdocument: self.customerdocument(),
            stockmovement: self.stockmovement(),
            customerproduct: self.selectedProducts(),
            description: self.description() ? self.description() : null,
            asistanPersonel: { personelid: self.assistantpersonel()>0? self.assistantpersonel() : null },
            appointmentdate: self.appointmentdate() ? moment(self.appointmentdate()).format() : null,
            consummationdate: self.consummationdate() ? moment(self.consummationdate()).format() : null,
            creationdate: self.creationdate() ? moment(self.creationdate()).format() : null,
            attachmentdate: self.attachmentdate() ? moment(self.attachmentdate()).format() : null,
        };
        if (dataModel.cdEditable() && dataModel.customerdocument().length>0) {
            var fi = $('#fileUpload').data().fileinput;
            var fu = $('#fileUpload')[0];
            fu.multiple = true;
            fi.filestack = [];
            if (fi.kocData) {
                var b = true;
                $.each(dataModel.customerdocument(), function (index, doc) {
                    b &= fi.kocData.hasOwnProperty("_" + doc.documentid);
                    if (b) fi.filestack.push(fi.kocData["_" + doc.documentid]);
                })
                if (!b) return alert("Tüm Belgeleri Yükleyiniz");
            }
            else {
                b = false;
                $.each(dataModel.customerdocument(), function (index, doc) {
                    b |= doc.id = 0;
                })
                if (b)
                    return alert("Tüm Belgeleri Yükleyiniz...");
                else
                    return crmAPI.saveTaskQueues(data, function (a, b, c) {
                        self.message(a);
                        window.setTimeout(function () {
                            $("#id_alert").alert('close');
                            self.redirect();
                        }, 1250);
                    }, null, null);
            }

            $("#fileUpload").fileinput("upload");
        }
        else
        crmAPI.saveTaskQueues(data, function (a, b, c) {
            self.message(a);
            window.setTimeout(function () {
                $("#id_alert").alert('close');
                self.redirect();
            }, 1250);
        }, null, null)

    },  
    saveTaskQueueDescription: function () {
        var self = this;
        data = {
            taskorderno: self.taskorderno(),
            task: { taskid: null },
            taskstatepool:
                {
                    taskstateid: 0,
                    taskstate: "AÇIK"
                },
            description: self.description() ? self.description()  : null,
            customerdocument: self.customerdocument(),
            stockmovement: self.stockmovement(),
            customerproduct: self.selectedProducts(),
            asistanPersonel: { personelid: self.assistantpersonel() > 0 ? self.assistantpersonel() : null },
        };
        crmAPI.saveTaskQueues(data, function (a, b, c) {
            self.message(a);
            window.setTimeout(function () {
                $("#id_alert").alert('close');
                self.redirect();
            }, 1250);
        }, null, null);
    },
    selectFile: function (documentid) {
        var fu = $("#fileUpload")[0];
        fu.documentid = documentid;
        $(fu).trigger('click');
    },
    renderBindings: function () {
        var self = this; var i = 0;
        $('#d1,#d2,#d3').daterangepicker({
            "singleDatePicker": true,
            "autoApply": false,
            " autoUpdateInput": false,
            "linkedCalendars": false,
            "timePicker": true,
            "timePicker24Hour": true,
            "drops": "up",
            "timePickerSeconds": true,
            "locale": {
                "format": 'MM/DD/YYYY h:mm A',
            },
        });
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
            $("#fileUpload").fileinput({
                //uploadUrl: "http://localhost:50752/api/Fiber/TaskQueue/upload", // server upload action
                uploadUrl: "http://crmapitest.kociletisim.com.tr/api/Fiber/TaskQueue/upload", // server upload action
                uploadAsync: false,
                minFileCount: 1,
                maxFileCount: 10,
                showUpload: true,
                overwriteInitial: false,
                uploadExtraData: function () {
                    return {
                        customer: self.customername()+'_'+self.customerid(),
                        sitename: self.sitename()+'_'+self.siteid(),
                        blockname: self.blockname()+'_'+self.blockid(),
                        documentids: (function () {
                            var res = [];
                            $.each(dataModel.customerdocument(), function (index, doc) {
                                res.push(doc.documentid);
                            });
                            return JSON.stringify(res);
                        })(),
                        tq: JSON.stringify({
                            taskorderno: self.taskorderno(),
                            task: { taskid: self.taskid() },
                            taskstatepool:
                                {
                                    taskstateid: self.taskstatus() ? self.taskstatus() : null,
                                    taskstate: $("#taskdurumu option:selected").text() ? $("#taskdurumu option:selected").text() : null
                                },
                            customerdocument: self.customerdocument(),
                            stockmovement: self.stockmovement(),
                            customerproduct: self.selectedProducts(),
                            description: self.description() ? self.description() : null,
                            asistanPersonel: { personelid: self.assistantpersonel() > 0 ? self.assistantpersonel() : 0 },
                            appointmentdate: self.appointmentdate() ? self.appointmentdate() : null,
                            consummationdate: self.consummationdate() ? self.consummationdate() : null,
                            creationdate: self.creationdate() ? self.creationdate() : null,
                            attachmentdate: self.attachmentdate() ? self.attachmentdate() : null,
                        })
                    };
                }
            });
            $('#fileUpload').on('fileloaded', function (event, file, previewId, index, reader) {
                var fi = $('#fileUpload').data().fileinput;
                var fu = $('#fileUpload')[0];
                var files = fi.filestack;
                var filenames = fi.filenames;
                fi.kocData = fi.kocData || {};
                fi.kocData["_" + fu.documentid] = files[i];
                i++;
                $.each(self.customerdocument(), function (index, doc) {
                    if (doc.documentid === fu.documentid) doc.documenturl(file.name);
                });
                //console.log(files.length - 1 + "=>" + $('#fileUpload').data().fileinput.filestack[files.length - 1].name);
            })
            $('#fileUpload').on('filebatchpreupload', function (event, data, previewId, index) {
                data.jqXHR.setRequestHeader("X-KOC-Token", crmAPI.getCookie("token"));
            });
            $('#fileUpload').on('filebatchuploadsuccess', function (event, data, previewId, index) {
                dataModel.message("ok");
                //window.setTimeout(function () {
                //    $("#id_alert").alert('close');
                //    self.redirect();
                //}, 1250);
            });
            var data = { taskOrderNo: hashSearches[1] };
            crmAPI.getTaskQueues(data, function (a, b, c) {
                self.taskorderno(a.data.rows[0].taskorderno);               
                self.taskname(a.data.rows[0].task.taskname);
                self.taskid(a.data.rows[0].task.taskid);
                self.taskattacheableobject(a.data.rows[0].task.attachableobjecttype);
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
                self.siteid(((a.data.rows[0].attachedobject.siteid || (a.data.rows[0].attachedobject.site && a.data.rows[0].attachedobject.site.siteid) ||
                              (a.data.rows[0].attachedobject.block && a.data.rows[0].attachedobject.block.site && a.data.rows[0].attachedobject.block.site.siteid)) ||
                             '&lt;boş&gt;'
                            ));
                self.blockname(a.data.rows[0].attachedobject.blockname || (a.data.rows[0].attachedobject.block && a.data.rows[0].attachedobject.block.blockname) || '');
                self.blockid(a.data.rows[0].attachedobject.blockid || (a.data.rows[0].attachedobject.block && a.data.rows[0].attachedobject.block.blockid) || '');
                self.region(((a.data.rows[0].attachedobject.region || (a.data.rows[0].attachedobject.site && a.data.rows[0].attachedobject.site.region) ||
                               (a.data.rows[0].attachedobject.block && a.data.rows[0].attachedobject.block.site && a.data.rows[0].attachedobject.block.site.region)) ||
                              '&lt;boş&gt;'
                             ));
                self.customername(a.data.rows[0].attachedobject.customername || '');
                self.customerid(a.data.rows[0].attachedobject.customerid && (a.data.rows[0].attachedobject.customerid) || '');
                self.customer(a.data.rows[0].attachedobject);
                self.isCustomer(a.data.rows[0].attachedobject.customername?true:false);
                self.selectedBlock(a.data.rows[0].attachedobject!=null ? (a.data.rows[0].attachedobject.customerid!=null ? a.data.rows[0].attachedobject.block : a.data.rows[0].attachedobject) : null);
                $("#d1").val(a.data.rows[0].attachedobject.readytosaledate);
                $("#d2").val(a.data.rows[0].attachedobject.sosaledate);
                $("#d3").val(a.data.rows[0].attachedobject.kocsaledate);
                self.flat(a.data.rows[0].attachedobject && (a.data.rows[0].attachedobject.flat) || '');
                self.customergsm(a.data.rows[0].attachedobject && a.data.rows[0].attachedobject.gsm || '');
                self.customerstatus(a.data.rows[0].attachedobject.customer_status && a.data.rows[0].attachedobject.customer_status.ID || '');
                $("#abonedurumu").multiselect("refresh");
                self.description(a.data.rows[0].description);
                self.descriptionControl(false);
                self.locationid(a.data.rows[0].attachedobject.locationid || (a.data.rows[0].attachedobject.block && a.data.rows[0].attachedobject.block.locationid) || '');
                self.telocadia(a.data.rows[0].attachedobject.telocadia || (a.data.rows[0].attachedobject.block && a.data.rows[0].attachedobject.block.telocadia) || '');
                self.customerProductList(a.data.rows[0].customerproduct);
                self.info(a.data.rows[0].customerproduct[0] ?a.data.rows[0].customerproduct[0].campaigns.category:null);
                self.getcategory();
               
                $.each(a.data.rows[0].stockmovement, function (index, stockmovement) {
                    var ssAmount = (stockmovement.stockStatus ? stockmovement.stockStatus.amount : 0);
                    var ssSerials = (stockmovement.stockStatus ? stockmovement.stockStatus.serials : []);
                    stockmovement.used = ko.observable(stockmovement.amount);
                    stockmovement.max = ko.observable(stockmovement.amount + ssAmount);
                    stockmovement.available = ko.observable(ssAmount);
                    stockmovement.serial = ko.observable(stockmovement.serialno);
                    stockmovement.serials = ko.observableArray(ssSerials);
                    stockmovement.serial.subscribe(function (v) {
                        stockmovement.used(v ? 1 : 0);
                        stockmovement.serialno = v;
                        stockmovement.amount = 1;
                        return v;
                    });
                    stockmovement.used.subscribe(function (v) {
                        if (v > stockmovement.max())
                            stockmovement.used(stockmovement.max());
                        else if (v < 0)
                            stockmovement.used(0);
                        stockmovement.available(stockmovement.max() - stockmovement.used());
                        return v;
                    });
                });
                self.editable(a.data.rows[0].editable);
                self.tasktype(a.data.rows[0].task.tasktypes.TaskTypeId);
                self.stockmovement(a.data.rows[0].stockmovement);
                self.stockcardlist(a.data.rows[0].stockcardlist);
            }, null, null);          
            self.getpersonel();
            self.getCustomerStatus();
            self.getIssStatus();
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
    if (v)
        dataModel.getcamapign();
});
dataModel.campaignid.subscribe(function (v) {
    dataModel.productlist([]);
    if (v)
        dataModel.getproduct();
});
dataModel.taskstatus.subscribe(function () {
    dataModel.errormessage(null);
    var data = {
        taskorderno: dataModel.taskorderno(),
        taskid: dataModel.taskid(),
        stateid: dataModel.taskstatus(),
        campaignid: dataModel.campaignid(),
        customerproducts: dataModel.selectedProductIds(),
        isSalesTask: dataModel.tasktype() == 1
    };
   
    dataModel.taskstatetype(dataModel.taskstatuslist()[$("#taskdurumu").prop('selectedIndex')].statetype);
    crmAPI.getTQStockMovements(data, function (a, b, c) {
        if (a.errorMessage) dataModel.errormessage(a.errorMessage);
        $.each(a, function (index, stockmovement) {
            var ssAmount = (stockmovement.stockStatus ? stockmovement.stockStatus.amount : 0);
            var ssSerials = (stockmovement.stockStatus ? stockmovement.stockStatus.serials : []);
            stockmovement.used = ko.observable(stockmovement.amount);
            stockmovement.used.subscribe(function (v) {
                stockmovement.amount = parseInt(v);
            });
            stockmovement.max = ko.observable(stockmovement.amount + ssAmount);
            stockmovement.available = ko.observable(ssAmount);
            stockmovement.serial = ko.observable(stockmovement.serialno);
            stockmovement.serials = ko.observableArray(ssSerials);
            stockmovement.serial.subscribe(function (v) {
                stockmovement.used(v ? 1 : 0);
                stockmovement.serialno = v;
                stockmovement.amount = 1;
                return v;
            });
            stockmovement.used.subscribe(function (v) {
                if (v > stockmovement.max())
                    stockmovement.used(stockmovement.max());
                else if (v < 0)
                    stockmovement.used(0);
                stockmovement.available(stockmovement.max() - stockmovement.used());
                return v;
            });
        });

        dataModel.stockmovement(a);
    });
    dataModel.getTQDocuments();
});
dataModel.uploadControl.subscribe(function (v) {
    if (v == true)
        $('.fileinput-upload-button').click()
});
dataModel.description.subscribe(function () {
    dataModel.descriptionControl() == false ? dataModel.descriptionControl(true) : dataModel.descriptionControl(false);


});
$('#customerinfo').on('hidden.bs.modal', function (e) {
    dataModel.newtab(false);
})