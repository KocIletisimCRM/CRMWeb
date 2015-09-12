
var dataModel = {

    taskorderno: ko.observable(),
    taskname: ko.observable(),
    previoustask: ko.observable(),
    relatedtask: ko.observable(),
    taskstatus: ko.observable(),
    creationdate: ko.observable(),
    attachmentdate: ko.observable(),
    appointmentdate: ko.observable(),
    consummationdate: ko.observable(),
    personelname: ko.observable(),
    assistantpersonelname: ko.observable(),
    sitename: ko.observable(),
    blockname: ko.observable(),
    region: ko.observable(),
    customername: ko.observable(),
    locationid: ko.observable(),
    customergsm: ko.observable(),
    customerstatus: ko.observable(),
    description:ko.observable(),
    renderBindings: function () {
        var self = this;
        var hashSearches = document.location.hash.split("?");
        if(hashSearches.length > 1) { 
            var data = { taskOrderNo: hashSearches[1] };
            crmAPI.getTaskQueues(data, function (a, b, c) {
                self.taskorderno(a.data.rows[0].taskorderno);
                self.taskname(a.data.rows[0].task.taskname);
                self.previoustask(a.data.rows[0].previoustaskorderid);
                self.relatedtask(a.data.rows[0].relatedtaskorderid);
                self.taskstatus(a.data.rows[0].status);
                self.creationdate(moment(a.data.rows[0].creationdate).format('lll'));
                self.attachmentdate(a.data.rows[0].attachmentdate && moment(a.data.rows[0].attachmentdate).format('lll') || null);
                self.appointmentdate(a.data.rows[0].appointmentdate && moment(a.data.rows[0].appointmentdate).format('lll') || null);
                self.consummationdate(a.data.rows[0].consummationdate && moment(a.data.rows[0].consummationdate).format('lll') || null);
                self.personelname(a.data.rows[0].attachedpersonel && a.data.rows[0].attachedpersonel.personelname || 'atanmamış');
                self.assistantpersonelname(a.data.rows[0].asistanPersonel && a.data.rows[0].asistanPersonel.personelname || 'atanmamış');
                self.sitename(((a.data.rows[0].attachedobject.sitename || (a.data.rows[0].attachedobject.site && a.data.rows[0].attachedobject.site.sitename) ||
                               (a.data.rows[0].attachedobject.block && a.data.rows[0].attachedobject.block.site && a.data.rows[0].attachedobject.block.site.sitename)) ||
                              '&lt;boş&gt;'
                             ));
                self.blockname(a.data.rows[0].attachedobject.blockname || (a.data.rows[0].attachedobject.block && a.data.rows[0].attachedobject.block.blockname) || '&lt;boş&gt;');
                self.region(((a.data.rows[0].attachedobject.region || (a.data.rows[0].attachedobject.site && a.data.rows[0].attachedobject.site.region) ||
                               (a.data.rows[0].attachedobject.block && a.data.rows[0].attachedobject.block.site && a.data.rows[0].attachedobject.block.site.region)) ||
                              '&lt;boş&gt;'
                             ));
                self.customername(a.data.rows[0].attachedobject.customername && (a.data.rows[0].attachedobject.customername + ' ' + a.data.rows[0].attachedobject.customersurname) || '&lt;boş&gt;');
                self.customergsm(a.data.rows[0].attachedobject && a.data.rows[0].attachedobject.gsm || '&lt;boş&gt;');
                self.customerstatus(a.data.rows[0].attachedobject.customer_status && a.data.rows[0].attachedobject.customer_status.Text || '&lt;boş&gt;');
                self.description(a.data.rows[0].description);
                self.locationid(a.data.rows[0].attachedobject.locationid || (a.data.rows[0].attachedobject.block && a.data.rows[0].attachedobject.block.locationid) || '&lt;boş&gt;');
            }, null, null)

         
            $(function () {
                $('#datetimepicker1,#datetimepicker2, #datetimepicker3,#datetimepicker4').datetimepicker();
            });
         
            ko.applyBindings(dataModel, $("#bindingContainer")[0]);
        }
    }
}
