$.confirm = function (body, success_callback, fail_callback, call_close_fail) {
    var c_d = $("<div>");
    c_d.attr("id", 'confirm-dialog')
    c_d.html(body);
    if (call_close_fail == undefined)
        call_close_fail = true;
    c_d.dialog({
        autoOpen: true,
        modal: true,
        title: store_name,
        draggable: true,
        resizable: false,
        width: "800",
        dialogClass: 'confirm-dialog exclude',
        closeOnEscape: false,
        position: ['center', 450],
        open: function () {
            c_d.dialog("option", "position", {my: "center", at: "center", of: window});
            $(".confirm-dialog").find(".ui-dialog-buttonset").find("button:first").html("Yes").addClass("applyTooptip btn btn-success").attr("data-title", "Yes");
            $(".confirm-dialog").find(".ui-dialog-buttonset").find("button:last").html("No").addClass("applyTooptip btn btn-danger").attr("data-title", "No");
//                $(".ui-dialog-buttonset").find("button").addClass("");
//            $(".confirm-dialog").find(".ui-dialog-titlebar").css({"background": "rgba(40, 86, 15, 0.03) -moz-linear-gradient(center top , rgba(188, 61, 61, 0.77) 1%, #a65e44 100%) repeat scroll 0 0", "color": "#FFF"})
            $(".confirm-dialog").find(".ui-widget-overlay").css("opacity", "0.6");
        },
        close: function () {
//            fail_callback();
            $("#confirm-dialog").dialog("destroy");
            $("#confirm-dialog").remove();
            if (call_close_fail)
                fail_callback();
        },
        buttons: {
            "Yes": function (e) {
                $(".confirm-dialog").find(".ui-dialog-buttonset").find("button:first").html("Processing..").attr("disabled", "disabled")
                $(".confirm-dialog").find(".ui-dialog-buttonset").find("button:last").remove()
                success_callback();
                $("#confirm-dialog").dialog("close");
            },
            "No": function () {
                $("#confirm-dialog").dialog("close");
                $(".confirm-dialog").find(".ui-dialog-buttonset").find("button:first").html("Processing..").attr("disabled", "disabled")
                $(".confirm-dialog").find(".ui-dialog-buttonset").find("button:last").remove();
                fail_callback();
            }
        }
    })

}

$.alert = function (body, success_callback, call_close_fail) {
    var c_d = $("<div>");
    c_d.attr("id", 'alert-dialog')
    c_d.html(body);
    if (call_close_fail == undefined)
        call_close_fail = true;
    c_d.dialog({
        autoOpen: true,
        modal: true,
        title: store_name,
        draggable: true,
        resizable: false,
        width: "800",
        dialogClass: 'confirm-dialog alert-dialog',
        closeOnEscape: false,
        position: ['center', 450],
        open: function () {
            c_d.dialog("option", "position", {my: "center", at: "center", of: window});
            $(".alert-dialog").find(".ui-dialog-buttonset").find("button:first").html("OK").addClass("applyTooptip btn btn-success").attr("data-title", "OK");
//                $(".ui-dialog-buttonset").find("button").addClass("");
//            $(".alert-dialog").find(".ui-dialog-titlebar").css({"background": "rgba(40, 86, 15, 0.03) -moz-linear-gradient(center top , rgba(188, 61, 61, 0.77) 1%, #a65e44 100%) repeat scroll 0 0", "color": "#FFF"})
            $(".alert-dialog").find(".ui-widget-overlay").css("opacity", "0.6");
        },
        close: function () {
//            fail_callback();
            $("#alert-dialog").dialog("destroy");
            $("#alert-dialog").remove();
            success_callback();
            if (typeof call_close_fail == "function") {
                call_close_fail();
            }
        },
        buttons: {
            "OK": function (e) {

                success_callback();
                $("#alert-dialog").dialog("close");
            }
        }
    })

}