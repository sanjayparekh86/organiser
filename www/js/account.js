var app = {
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    data: null,
    onDeviceReady: function () {
        this.receivedEvent('deviceready');
    },
    max_section: 5,
    receivedEvent: function (id) {
        // get items from local database

        this.getUserProfile();
        // this.applyEvents();
    },
    getUserProfile: function () {
        var user_details = sessionStorage.getItem("user_details");
        if (user_details != null && localStorage.getItem("user_id") != null) {
            var ud = $.parseJSON(user_details);
            // fill  form
            $("#device_id").val(device.uuid);
            $("#txt_first_name").val(ud.first_name);
            $("#txt_last_name").val(ud.last_name);
            $("#txt_email").val(ud.email);
            console.log(ud)
        } else {
            CONST.getUserDetails();
            app.getUserProfile();
        }
    }

};
app.initialize();
