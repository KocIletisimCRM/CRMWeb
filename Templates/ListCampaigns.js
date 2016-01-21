
var dataModel = {

    pageCount: ko.observable(),
    pageNo: ko.observable(1),
    rowsPerPage: ko.observable(20),
    totalRowCount: ko.observable(),
    savemessage: ko.observable(),
    savemessagecode: ko.observable(),


    newcampname: ko.observable(),
    newcatname: ko.observable(),
    newsubcatname: ko.observable(),

    campaignList: ko.observableArray([]),
    selectedCampaignRow: ko.observable(),//düzenleye tıklandığında seçilen kampanya
    campaignCombo: ko.observableArray([]),
    selectedCampaign:ko.observable(),
    categoryCombo: ko.observableArray([]),
    selectedCategory:ko.observable(),
    subcategoryCombo: ko.observableArray([]),
    selectedSubcategory: ko.observable(),
    productListCombo:ko.observableArray([]),
    productIds:ko.observableArray([]),
    documentListCombo: ko.observableArray([]),
    documentIds: ko.observableArray([]),

    getCampaigns: function (pageno, rowsperpage) {
        var self = this;
        var data = {
            pageNo: pageno,
            rowsPerPage: rowsperpage,
            campaign: self.selectedCampaign() ? { fieldName: 'id', op: 2, value: self.selectedCampaign() } : { fieldName: 'name', op: 6, value: '' },
            category: self.selectedCategory() ? { fieldName: 'category', op: 6, value: self.selectedCategory() } : null,
            subcategory:self.selectedSubcategory() ? { fieldName: 'subcategory', op: 6, value: self.selectedSubcategory() } :null,
        };
        crmAPI.getCampaigns(data, function (a, b, c) {
            self.campaignList(a.data.rows);
            self.pageCount(a.data.pagingInfo.pageCount);
            self.totalRowCount(a.data.pagingInfo.totalRowCount);
            self.savemessage(null);
            self.savemessagecode(null);
            $(".edit").click(function () {
                self.getCampaignCard($(this).val());
                $("#category,#editcategory").multiselect("refresh");
                $("#subcategory,#editsubcategory").multiselect("refresh");
               
                console.log($(this).val());
            });
        }, null, null);
    },
    getCampaignCard: function (id) {
        var self = this;
        var data = {
            campaign: { fieldName: 'id', op: 2, value: id },
        };
        crmAPI.getCampaigns(data, function (a, b, c) {
            self.selectedCampaignRow(a.data.rows[0]);
           
        }, null, null);
    },
    getcategory: function () {
        var self = this;
        data = {
            category: { fieldName: 'category', op: 6, value: '' }
        },
        crmAPI.getCampaignInfo(data, function (a, b, c) {
            self.categoryCombo(a);
            $("#category,#editcategory").multiselect({
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
    getsubcategory: function () {
        var self = this;
        data = {
            subcategory: { fieldName: 'subcategory', op: 6, value: '' }
        },
        crmAPI.getCampaignInfo(data, function (a, b, c) {
            self.subcategoryCombo(a);
            $("#subcategory,#editsubcategory").multiselect({
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
            //$("#subcategory,#editsubcategory").multiselect("setOptions", self.subcategoryCombo()).multiselect("rebuild");
            //$("#subcategory,#editsubcategory").multiselect("refresh");
        }, null, null)
    },
    getcamapign: function () {
        var self = this;
        data = {
            campaign: { fieldName: 'name', op: 6, value: '' }
        },
        crmAPI.getCampaignInfo(data, function (a, b, c) {
            self.campaignCombo(a);
            $("#campaign").multiselect("setOptions", self.campaignCombo()).multiselect("rebuild");
        }, null, null)
    },
    getproduct: function () {
        var self = this;
        crmAPI.getProductList(function (a, b, c) {
            self.productListCombo(a);
            $("#newproducts").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: 'Ürün Seçiniz',
                nSelectedText: 'Ürün Seçildi!',
                numberDisplayed: 3,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
            $("#editproduct").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: 'Ürün Seçiniz',
                nSelectedText: 'Ürün Seçildi!',
                numberDisplayed: 3,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
            $('#editproduct').multiselect('select', self.productIds());
        }, null, null)
    },
    getDocuments: function () {
        var self = this;
        var data = {
            documentname: { fieldName: 'documentname', op: 6, value: '' },
        };
        crmAPI.getDocuments(data, function (a, b, c) {
            self.documentListCombo(a.data.rows);
            $("#newdocuments").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: 'Belge Seçiniz',
                nSelectedText: 'Belge Seçildi!',
                numberDisplayed: 3,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
            $("#editdocument").multiselect({
                includeSelectAllOption: true,
                selectAllValue: 'select-all-value',
                maxHeight: 250,
                buttonWidth: '100%',
                nonSelectedText: 'Belge Seçiniz',
                nSelectedText: 'Belge Seçildi!',
                numberDisplayed: 3,
                selectAllText: 'Tümünü Seç!',
                enableFiltering: true,
                filterPlaceholder: 'Ara'
            });
            if(self.documentIds()!==null)
            $('#editdocument').multiselect('select', dataModel.documentIds());
        }, null, null);
    },

    saveCampaigns: function () {
        var self = this;
        self.selectedCampaignRow().products = $("#editproduct").val()? $("#editproduct").val().toString():null;
        self.selectedCampaignRow().documents = $("#editdocument").val()?$("#editdocument").val().toString():null;
        var data = self.selectedCampaignRow();
        crmAPI.saveCampaigns(data, function (a, b, c) {
            self.savemessage(a.errorMessage);
            self.savemessagecode(a.errorCode);
            window.setTimeout(function () {
                $('#myModal').modal('hide');
                self.getCampaigns(dataModel.pageNo(), dataModel.rowsPerPage());
            }, 1000);
        }, null, null);
    },
    insertCampaigns: function () {
        var self = this;
        var data = {
            name: self.newcampname(),
            category: self.newcatname(),
            subcategory: self.newsubcatname(),
            products: $('#newproducts').val()?$('#newproducts').val().toString():null,
            documents:$('#newdocuments').val()? $('#newdocuments').val().toString():null,
            
        };
        crmAPI.insertCampaigns(data, function (a, b, c) {
            self.savemessage(a.errorMessage);
            self.savemessagecode(a.errorCode);
            window.setTimeout(function () {
                $('#myModal1').modal('hide');
                self.getCampaigns(dataModel.pageNo(), dataModel.rowsPerPage());
            }, 1000);
        }, null, null);
    },

    clean: function () {
        var self = this;
        self.selectedCampaign(null);
        self.selectedCategory(null);
        self.selectedSubcategory(null);
        self.getCampaigns(dataModel.pageNo(), dataModel.rowsPerPage());
 
    },
    navigate: {
        gotoPage: function (pageNo) {
            if (pageNo == dataModel.pageNo() || pageNo <= 0 || pageNo > dataModel.pageCount()) return;
            dataModel.getCampaigns(pageNo, dataModel.rowsPerPage());
        },
        gotoFirstPage: function () {
            dataModel.navigate.gotoPage(1);
        },
        gotoLastPage: function () {
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
    renderBindings: function () {
        var self = this;
        self.getCampaigns(dataModel.pageNo(), dataModel.rowsPerPage());
        self.getcamapign();
        self.getcategory();
        self.getsubcategory();
        $('#new').click(function () {
            self.getDocuments();
            self.getproduct();
        });
        ko.applyBindings(dataModel, $("#bindingContainer")[0]);
    }
}

dataModel.selectedCampaignRow.subscribe(function (v) {
    if(v.products!=null)
        dataModel.productIds(v.products.split(","));
    else
        dataModel.productIds(null);
    if (v.documents != null)
        dataModel.documentIds(v.documents.split(","));
    else
        dataModel.documentIds(null);
    dataModel.getproduct();
    dataModel.getcategory();
    dataModel.getsubcategory();
    dataModel.getDocuments();
});