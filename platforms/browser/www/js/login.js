var app = {
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function () {
        this.receivedEvent('deviceready');
    },
    max_section: 5,
    receivedEvent: function (id) {
        // get items from local database
        this.applyFormEvents();

    },
    applyFormEvents: function () {
        signup_obj.apply_signup_form();
        login_obj.apply_login_form();
    }

};
app.initialize();
var signup_obj = {
    apply_signup_form: function () {
        $("#device_id").val(device.uuid);
        var rules = {
            txt_first_name: {required: true},
            txt_email: {required: true, email: true,
                remote: {
                    url: APPAPI.uniqEmail,
                    type: "post",
                }
            },
            txt_password: {
                minlength: 5,
                required: true
            },
            txt_password_confirm: {
                minlength: 5,
                equalTo: "#txt_password"
            }

        };
        var message = {
            txt_first_name: {required: "Please enter first name"},
            txt_email: {required: "Please enter email", email: "Invalid Email", remote: "This email is already registerd"},
            txt_password: {
                minlength: "Minimum 5 character",
                required: "Please enter password"
            },
            txt_password_confirm: {
                minlength: "Minimum 5 character",
                equalTo: "Mismatch confirm password"
            }

        };
        validaeForm("signupfrm", rules, message);

        $("#btn-submit-signup").click(function () {
            if ($("#signupfrm").valid()) {
                var data = $("#signupfrm").serialize();
                $.ajax({
                    url: APPAPI.signup,
                    method: "post",
                    data: data,
                    beforeSend: function () {
                        // show loading
                        showLoading();
                    },
                    success: function (response) {
                        hideLoading()
                        var res = $.parseJSON(response);
                        if (res.success) {
                            localStorage.setItem("user_email", res.data.email);
                            $("#auth_user_email").val(res.data.email);
                            $(":mobile-pagecontainer").pagecontainer("change", "#authentication_page", {changeHash: true});
                        }
                    }
                })
            }
            return false
        });
        $("#btn_authenticate").click(function () {

            if ($("#auth_user_email").val() == "") {
                alert("Please enter email address");
                return false;
            }
            if ($("#authcode").val() == "") {
                alert("Please enter authentication code");
                return false;
            }
            $.ajax({
                url: APPAPI.authenticate,
                method: "post",
                data: {"email": $("#auth_user_email").val(), "authcode": $("#authcode").val()},
                beforeSend: function () {
                    // show loading
                    showLoading();
                },
                success: function (response) {
                    hideLoading();
                    var res = $.parseJSON(response);
                    if (res.success == "1") {
                        localStorage.setItem("user_id", res.data.id)
                        localStorage.setItem("user_details", JSON.stringify(res.data));
                        window.location = "home.html";
//                        $.mobile.changePage("home.html", {transition: "slideup", changeHash: true, reloadPage: true});
//                        $(":mobile-pagecontainer").pagecontainer("change", "#authentication_page", {changeHash: true});
                    } else if (res.success == "0") {
                        toast(res.data.msg);
                    }
                }
            })

            return false
        });


    }
}

var login_obj = {
    apply_login_form: function () {
        $("#device_id").val(device.uuid);
        var rules = {

            email: {required: true, email: true},
            password: {
                minlength: 5,
                required: true
            }

        };
        var message = {
            email: {required: "Please enter email", email: "Invalid Email"},
            password: {
                minlength: "Minimum 5 character",
                required: "Please enter password"
            },

        };
        validaeForm("loginfrm", rules, message);

        $("#btn_login").click(function () {
            if ($("#loginfrm").valid()) {
                var data = $("#loginfrm").serialize();
                $.ajax({
                    url: APPAPI.login,
                    method: "post",
                    data: data,
                    beforeSend: function () {
                        // show loading
                        showLoading();
                    },
                    success: function (response) {
                        hideLoading()
                        var res = $.parseJSON(response);
                        if (res.success) {
                            localStorage.setItem("user_id", res.data.id)
                            localStorage.setItem("user_details", JSON.stringify(res.data));
                            window.location = "home.html";
//                            $.mobile.changePage("home.html", {transition: "slideup", changeHash: true, reloadPage: true});
                        } else {
                            toast(res.data.msg)
                        }
                    }
                })
            }
            return false
        });
    }
}
