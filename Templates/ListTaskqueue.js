/// <reference path="../Scripts/koc-typehead-v1.0.js" />
/// <reference path="../Scripts/knockout-3.3.0.js" />
/// <reference path="../Scripts/crmwebapi.js" />
///

var dataModel = {
    user: ko.observable(),
    perOfBayiOrKoc: ko.observable(false), // Sayfada işlem yapan personel bayi mi yoksa şirket personeli mi ? false : bayi --  true : koc personeli
    BayiOrKoc: function () {
        var self = this;
        if (self.user() != null || self.user() != "") {
            var arr = self.user().userName.split('@');
            if (arr[1] == 'kociletisim.com.tr')
                self.perOfBayiOrKoc(true);
            else
                self.perOfBayiOrKoc(false);
        }
    },
    multiSelectTagIds: "#blokadi,#taskNameFilter,#servissaglayici,#abonedurumu,#personel,#taskdurumu",
    typeHeadTagIds: "#site",
    flag: ko.observable(),
    firstLoad: ko.observable(),
    pageCount: ko.observable(),
    pageNo: ko.observable(1),
    rowsPerPage: ko.observable(20),
    querytime: ko.observable(0),
    errormessage: ko.observable(),
    errorcode:ko.observable(),
    isLoading: ko.observable(),
    selectedTaskname: ko.observableArray([]),
    selectedtaskorderno:ko.observableArray([]),
    sitename: ko.observable(),
    blockname: ko.observable(),
    customername: ko.observable(),
    customerstatus: ko.observable(),
    selectedIss: ko.observable(),
    selectedPersonelname: ko.observableArray([]),
    selectedAttachmentPersonelid: ko.observable(),
    attachmentDate: ko.observable(),
    appointmentDate: ko.observable(),
    consummationDate:ko.observable(),
    selectedTaskstatus: ko.observableArray([]),
    selectedCustomerstatus:ko.observable(),
    description: ko.observable(),
    tasks: ko.observableArray([]),
    ctstatuslist: ko.observableArray([]),
    isslist: ko.observableArray([]),
    taskstatuslist: ko.observableArray([]),
    ziyaretStatusList: ko.observableArray([]),
    selectedZiyaretStatus:ko.observable(),
    selectedZiyaretCTstatus:ko.observable(),
    personellist: ko.observableArray([]),
    taskqueuelist: ko.observableArray([]),
    totalpagecount: ko.observable(0),
    totalRowCount: ko.observable(),
    defaultstatus: ko.observable(),
    //kimlik kartı
    selectedCustomer: ko.pureComputed(function () {
        return dataModel.customersformodal()[0];
    }),
    ctstatuslist: ko.observableArray([]),
    issStatusList: ko.observableArray([]),
    netStatusList: ko.observableArray([]),
    telStatusList: ko.observableArray([]),
    tvStatusList: ko.observableArray([]),
    TurkcellTvStatusList: ko.observableArray([]),
    gsmStatusList: ko.observableArray([]),
    katziyareti: ko.observable(),
    isCloseableZiyaret: ko.observable(),
    // end of kimlik kartı
    attacheablePersonelList: ko.observableArray([]),
    newtab: ko.observable(false), //new tab open and close event
    //modal aktif pasif customers
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

    getUserInfo: function () {
        var self = this;
        crmAPI.userInfo(function (a, b, c) {
            self.user(a);
            self.BayiOrKoc();
        }, null, null)
    },
    enterfilter: function (d, e) {
        var self = this;
        if (e && (e.which == 1 || e.which == 13)) {
            self.getFilter(1, dataModel.rowsPerPage());
        }
        return true;
    },
    getTasks: function () {
        var self = this;
        var data={
            task:  { fieldName: "taskname", op: 6, value:"" },
        };
        crmAPI.getTaskFilter(data, function (a, b, c) {
            self.tasks(a);
            $("#taskNameFilter").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: 'Task Adını Seçiniz',
                nSelectedText: 'Task Adı Seçildi!',
                numberDisplayed: 2,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
        }, null, null);
    
    },
    getCustomerStatus: function () {
        var self = this;
        crmAPI.getCustomerStatus( function (a, b, c) {
            self.ctstatuslist(a);
            $("#abonedurumu").multiselect({
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
    getisslist: function () {
        var self = this;
        crmAPI.getIssStatus(function (a, b, c) {
            self.isslist(a);
            $("#servissaglayici").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: 'ISS Seçiniz',
                nSelectedText: 'ISS Seçildi!',
                numberDisplayed: 2,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
        }, null, null)
    },
    gettaskstatus: function () {
        var self = this;
        var data = {
            taskstate:{ fieldName: "taskstate", op: 6, value: "" },
        };
        crmAPI.getTaskStatus(data,function (a, b, c) {
            self.taskstatuslist(a);
            self.defaultstatus('0');
            $("#taskdurumu").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: 'Task Durumunu Seçiniz',
                nSelectedText: 'Task Durumu Seçildi!',
                numberDisplayed: 2,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
        }, null, null)
    },
    getZiyaretTaskstatus: function () {
        var self = this;
        var data = {
          taskid:86,
        };
        crmAPI.getTaskMatchesStatus(data, function (a, b, c) {
            $("#ziyaretcombo").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: 'Task Durumunu Seçiniz',
                nSelectedText: 'Task Durumu Seçildi!',
                numberDisplayed: 2,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
            self.ziyaretStatusList(a);
           $('#ziyaretcombo').multiselect('select', self.ziyaretStatusList()).multiselect('rebuild');
        }, null, null)
    },
    SaveZiyaretStatus:function(){
        var self = this;
        var data = {
            tasks: self.selectedtaskorderno(),
            status:self.selectedZiyaretStatus()
        };
        if (self.selectedtaskorderno()<1 && self.selectedZiyaretStatus()==null) {
            alert("En az bir task ve bir durum seçmelisiniz!");
        }
        else
        crmAPI.saveZiyaretTask(data, function (a, b, c) {
            window.setTimeout(function () {
                $('#katziyareti1').modal('hide');
                self.getFilter(1, dataModel.rowsPerPage());
            }, 1000);
        }, null, null);
    },
    SaveCTStatusOnZiyaret: function () {
        var self = this;
        var dataa = {
            tasks: self.selectedtaskorderno(),
            cstatus: self.selectedZiyaretCTstatus()
        };
        if (self.selectedtaskorderno() < 1 && self.SaveCTStatusOnZiyaret() == null) {
            alert("En az bir task ve bir durum seçmelisiniz!");
        }
        else
            crmAPI.saveCTStatusWithKatZiyaret(dataa, function (a, b, c) {
                window.setTimeout(function () {
                    $('#katziyareti2').modal('hide');
                    self.getFilter(1, dataModel.rowsPerPage());
                    self.selectedZiyaretCTstatus(null);
                }, 1000);
            }, null, null);
    },
    getpersonel: function () {
        var self = this;    
        crmAPI.getPersonel(function (a, b, c) {
            self.personellist(a);
            $("#personel").multiselect({
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
    getAttachablePersonelList: function () {
        var self = this;
        var data = {
            taskorderno: parseInt(self.selectedtaskorderno()[0]),
        };
        crmAPI.getAttacheablePersonel(data, function (a, b, c) {

            self.attacheablePersonelList(a);
            $('#personelatamacombo').multiselect('select', self.attacheablePersonelList()).multiselect('rebuild');
        }, null, null);

    },
    attacheablecontrol: function () {
        var self = this;
        var data = {
            ids: self.selectedtaskorderno(),
            personelid: self.selectedAttachmentPersonelid(),
        };
        crmAPI.personelattachment(data, function (a, b, c) {
            self.errormessage(a.errorMessage);
            self.errorcode(a.errorCode);
            if (a.errorCode != 0)
                window.setTimeout(function () {
                    $('#personelatama').modal('hide');
                    self.getFilter(1, dataModel.rowsPerPage());
                }, 1000);
            self.getAttachablePersonelList();

        }, null, null);
    },
    attachmentpersonel: function () {
        var self = this;
        var data = {
            ids: self.selectedtaskorderno(),
            personelid: self.selectedAttachmentPersonelid(),
        };
        crmAPI.personelattachment(data, function (a, b, c) {
            self.errormessage(a.errorMessage);
            self.errorcode(a.errorCode);
            self.flag(true);
            window.setTimeout(function () {
                $('#personelatama').modal('hide');
                self.getFilter(1, dataModel.rowsPerPage());
            }, 1000);
            self.selectedAttachmentPersonelid(null);
            $("#personelatamacombo").multiselect('deselect', dataModel.selectedAttachmentPersonelid());
            $("#personelatamacombo").multiselect('refresh');
        }, null, null);
    },
    clean: function () {
        var self = this;
        self.appointmentDate(null);
        self.attachmentDate(null);
        self.customername(null);
        self.consummationDate(null);
        self.sitename(null);
        self.selectedCustomerstatus(null);
        $("#taskNameFilter,#abonedurumu,#servissaglayici,#taskdurumu,#personel,#personelatamacombo").multiselect('deselectAll', false);
        $("#taskNameFilter,#abonedurumu,#servissaglayici,#taskdurumu,#personel,#personelatamacombo").multiselect('refresh');
        self.selectedPersonelname(null);
        self.selectedIss(null);
        self.selectedTaskname(null);
        self.selectedTaskstatus(null);
        self.getFilter(dataModel.pageNo(), dataModel.rowsPerPage());
    },
    enterfilter: function (d,e) {
        var self = this;
        if (e && (e.which == 1 || e.which == 13)) {
            self.getFilter(1, self.rowsPerPage());
        }
        return true;
    },
    getFilter: function (pageno,rowsperpage) {
        var self = this;
        self.pageNo(pageno);
        self.rowsPerPage(rowsperpage);
        self.isLoading(true);
        self.errormessage(null);
        self.errorcode(null);
        self.flag(null);
        self.selectedAttachmentPersonelid(null);
        self.selectedTaskname($("#taskNameFilter").val() ? $("#taskNameFilter").val() : '');
        self.selectedTaskstatus($("#taskdurumu").val() ? $("#taskdurumu").val() : null);
        self.selectedPersonelname($("#personel").val() ? $("#personel").val() : '');
        var data = {
            pageNo:pageno,
            rowsPerPage:rowsperpage,
            site: self.sitename() ? { fieldName: "sitename", op: 6, value: self.sitename() } : null,
            customer: self.customername() ? { fieldName: "customername", op: 6, value: self.customername() } : null,
            task: self.selectedTaskname() ? { fieldName: "taskid", op: 7, value: self.selectedTaskname() } : null,
            personel: self.selectedPersonelname().length > 0 ? (self.selectedPersonelname() == "0" ? { fieldName: "personelname", op: 8, value: null } : { fieldName: "personelid", op: 7, value: self.selectedPersonelname() }) : null,
            taskstate: self.selectedTaskstatus() ? (self.selectedTaskstatus() == '0' ? { fieldName: "taskstate", op: 8, value: null } : { fieldName: "taskstateid", op: 7, value: self.selectedTaskstatus() }) : (self.firstLoad() == true ? { fieldName: "taskstate", op: 8, value: null } : null),
            iss: self.selectedIss() ? { fieldName: "issText", op: 6, value: self.selectedIss() } : null,
            customerstatus: self.selectedCustomerstatus() ? { fieldName: "Text", op: 6, value: self.selectedCustomerstatus() } : null,
            attachmentDate: self.attachmentDate() ? self.attachmentDate() : null,
            appointmentDate: self.appointmentDate() ? self.appointmentDate() : null,
            consummationDate: self.consummationDate() ? self.consummationDate() : null,
        };
       
            crmAPI.getTaskQueues(data, function (a, b, c) {
                self.taskqueuelist(a.data.rows);
                self.pageCount(a.data.pagingInfo.pageCount);
                self.querytime(a.performance.TotalResponseDuration);
                self.totalRowCount(a.data.pagingInfo.totalRowCount);
                self.isLoading(false);
                self.errormessage(null);
                self.errorcode(null);
                self.firstLoad(false);
               // self.defaultstatus(0);
                $('.sel').change(function () {
                    var ids = [];
                    $('.sel').each(function () {
                        if ($(this).is(':checked')) {
                            var id = $(this).val();
                            ids.push(id);
                            //console.log("Seçim: " + id + "");
                        }
                    });
                    self.selectedtaskorderno(ids);
                });
                $('.satir').click(function () {
                    var checkedids = [];
                    var id = $(this).index();
                    if ($(".sel")[id - 1].checked != true)
                    {
                        $(".sel")[id - 1].checked = true;
                        $(".sel").change();
                        checkedids.push(id);
                    }
                    else
                   {                       
                        $(".sel")[id - 1].checked = false;
                        $(".sel").change();
                    }
                });
                $('.musteri').click(function () {
                    var row = $(this).parent().parent().index();
                    self.blockidforcust(self.taskqueuelist()[row - 1].attachedobject.block.blockid);
                    self.flatforcust(self.taskqueuelist()[row - 1].attachedobject.flat);
                    //self.selectedCustomer(self.taskqueuelist()[row - 1].attachedobject);
                    self.getCustomers();
                });
            }, null, null)

    },
    select :function (d, e) {
        var self=this;
        $("#taskquetable tr").removeClass("selected");
        $(e.currentTarget).addClass("selected");
        console.log("seçilen " + d.taskorderno);
        self.selectedtaskorderno(d.taskorderno);
        
    },
    redirect: function () {
        window.location.href = "app.html";
    },
    navigate: {
        gotoPage: function (pageNo) {
            if (pageNo == dataModel.pageNo() || pageNo <= 0 || pageNo > dataModel.pageCount()) return;
            dataModel.getFilter(pageNo, dataModel.rowsPerPage());
            dataModel.isLoading(false);
        },
        gotoFirstPage: function(){
            dataModel.navigate.gotoPage(1);
        },
        gotoLastPage:function(){
            dataModel.navigate.gotoPage(dataModel.pageCount());
        },
        gotoNextPage: function () {
            var pc = dataModel.pageNo() + 1;
            if (pc >= dataModel.pageCount()) return;
            dataModel.navigate.gotoPage(pc);
        },
        gotoBackPage: function () {
            var pc = dataModel.pageNo() - 1;
            if (pc <= 0) return;
            dataModel.navigate.gotoPage(pc);
        },
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
    closeableZiyaret: function () {
        if ($("#abonedurumuinfo").val() == "" || $("#issstatus").val() == "") {
            dataModel.isCloseableZiyaret(false);
        }
        else {
            dataModel.isCloseableZiyaret(true);
        }
    },
    saveCustomer: function () {
        var self = this;
        self.selectedCustomer().customername = $("#custName").val();
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
            if (a == "ok") {
               window.setTimeout(function () {
                   $('#customerinfo').modal('hide');
                   self.getFilter(1, dataModel.rowsPerPage());
               }, 1000); 
            }
        }, null, null);
    },
    saveCustomerWithKatZiyaret: function () {
        var self = this;
        self.katziyareti(true);
        self.saveCustomer();
    },
    getCustomers: function (){
        var self = this;
        var data = {
            block: { fieldName: 'blockid', op: 2, value: self.blockidforcust() },
            flatNo: { fieldName: 'flat', op: 2, value: self.flatforcust() },
        };
        crmAPI.getCustomers(data, function (a, b, c) {
            self.customersformodal(a.data.rows);
        }, null, null);
    },
    renderBindings: function () {
        var self = this;
        self.getUserInfo();
        self.firstLoad(true);
        $("#blokadi").multiselect({
            includeSelectAllOption: true,
            selectAllValue: 'select-all-value',
            maxHeight: 250,
            buttonWidth: '100%',
            nonSelectedText: 'Blok Seçiniz',
            nSelectedText: 'Blok Seçildi!',
            numberDisplayed: 2,
            selectAllText: 'Tümünü Seç!',
            enableFiltering: true,
            filterPlaceholder: 'Ara'
            
        });
      
        $(function () {
            $('#datetimepicker1,#datetimepicker2,#datetimepicker3').datetimepicker();
        });
        $('#daterangepicker1,#daterangepicker2,#daterangepicker3').daterangepicker({
            "timePicker": true,
            ranges: {
                'Bugün': [moment(), moment().add(1,'days')],
                'Dün': [moment().subtract(1, 'days'), moment()],
                'Son 7 Gün': [moment().subtract(6, 'days'), moment()],
                'Son 30 Gün': [moment().subtract(29, 'days'), moment()],
                'Bu Ay': [moment().startOf('month'), moment().endOf('month')],
                'Geçen Ay': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            }
        });
        $('#randevutarihi').daterangepicker({
            "singleDatePicker": true,
            "autoApply": true,
            "linkedCalendars": false,
            "timePicker": true,
            "timePicker24Hour": true,
            "timePickerSeconds": true,
            "locale": {
                "format": 'MM/DD/YYYY h:mm A',
            },
        });
        $("#personelatamacombo").multiselect({
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
        self.getisslist();
        self.getNetStatus();
        self.getTelStatus();
        self.getTvKullanımıStatus();
        self.getTurkcellTvStatus();
        self.getGsmStatus();
        self.gettaskstatus();
        self.getTasks();
        self.getpersonel();
        self.getCustomerStatus();
        self.getFilter(dataModel.pageNo(), dataModel.rowsPerPage());           
        ko.applyBindings(dataModel, $("#bindingContainer")[0]);
        $("#katziyareti11").click(function () {
            self.getZiyaretTaskstatus();
            self.selectedZiyaretStatus(null);
        });
        $(this.typeHeadTagIds).kocTypeHead();
        
    }
}

dataModel.flag.subscribe(function (v) {
    if (v == null)
        return true;
    else {
        $("#personelatamacombo").multiselect('deselect', dataModel.selectedAttachmentPersonelid());
        dataModel.selectedAttachmentPersonelid(null);
    }

});
$('#customerinfo').on('shown.bs.modal', function (e) {
    dataModel.closeableZiyaret();
})
$('#customerinfo').on('hidden.bs.modal', function (e) {
    dataModel.newtab(false);
})