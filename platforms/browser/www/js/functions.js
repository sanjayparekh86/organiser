
function is_login() {
    if (localStorage.getItem("user_id") == null || localStorage.getItem("user_id") == "") {
        window.location = "login.html";
    }
}

function logout() {
    localStorage.removeItem("user_id");
    localStorage.removeItem("email");
    window.location = "login.html"
}
function validaeForm(frmName, rulesObj, messageObj, groupObj, callback)
{
// validate form
    $('#' + frmName).validate({
        ignore: '',
        onkeyup: false,
        errorClass: "text-error",
        validClass: "text-success",
        rules: rulesObj,
        messages: messageObj,
        groups: groupObj,
        invalidHandler: function (form, validator) {

        },
        showErrors: function (errorMap, errorList) {
// create array of error list string
            var strElement = $.param(errorMap).split("&");
// check error string is blank or not
            if ($.trim(strElement) != "")
            {
// get id of first element
///following one line is added by keyur
                strElement[0] = unescape(strElement[0]);
                var arrName = strElement[0].split("=");
// get element id
                var eleId = $('[name="' + arrName[0] + '"]').attr("id");
// find tab div id of form element
                if (eleId == undefined)
                {///this condition is added by keyur
                    var parentId = $('[name="' + arrName[0] + '"]').parents('div[id]').parents('div[id]').attr("id");
                } else
                    var parentId = $("#" + eleId).parents('div[id]').attr("id");
// active tab 

            }
// show default error message
            this.defaultShowErrors();
            if (callback != undefined && callback != "") {
                callback();
            }
        }
    });
}
window.spinner_loading = false;
window.spinner_interval = null;
window.spinner_timer = null;

function showLoading(msg = "Loading") {
//    $.mobile.loading("show", {
//                    text: msg,
//                    textVisible: true,
//                    theme: "a",
//                    textonly: false,
//                    html: ""
//        });

    SpinnerDialog.show(null,msg+ "...", true);
    window.spinner_loading = true;

    window.spinner_interval = setInterval(function () {
//        progress.update("Still loading...");
        if (window.spinner_loading) {
            SpinnerDialog.show(null, "Still loading...", true);
        } else {
            clearInterval(window.spinner_interval)
        }
    }, 3000);

//    setTimeout(function () {
//        SpinnerDialog.hide();
//    }, 6000);
}
function hideLoading() {
//    $.mobile.loading("hide");
    SpinnerDialog.hide();
    clearInterval(window.spinner_interval)
    window.spinner_loading = false;
}

function toast(msg) {
    window.plugins.toast.show(msg, 'long', 'bottom', function (a) {
//        console.log('toast success: ' + a)
    }, function (b) {
//        alert('toast error: ' + b)
    })
}
/**
 * 
 * @param {type} imageData
 * @param {type} app_folder
 * @param {type} callback
 * @returns {undefined}
 */
function moveFile(imageData, callback) {
    window.resolveLocalFileSystemURL(imageData, function (entry) {
        var d = new Date();
        var n = d.getTime();
        var newFileName = n + ".jpg";

        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSys) {
            //The folder is created if doesn't exist
            fileSys.root.getDirectory(CONST.app_folder,
                    {create: true, exclusive: false},
                    function (directory) {
                        entry.moveTo(directory, newFileName, function (entry) {
                            callback(entry)
                            // successMove()
//                                console.log(entry)
                        }, resOnError);
                    },
                    resOnError);
        }, resOnError);

    }, resOnError);
}

function resOnError(error) {
    alert(error.code);
}

function redirect(path) {
    window.location = path;
}

var uploadImage = function (FUName, fileURI, FUApiURL, params, FUcallack) {
    var options = new FileUploadOptions();
//    $.extend(options, FUoptions);
    var options = new FileUploadOptions();
    options.fileKey = "base_image";
    options.fileName = FUName;
    options.mimeType = "image/jpeg";

    options.chunkedMode = false;
    options.params = params;

    var ft = new FileTransfer();
    showLoading();
    ft.upload(fileURI, FUApiURL, function (result) {
        FUcallack(result);
    }, function (error) {
        alert('error : ' + JSON.stringify(error));
        hideLoading()
    }, options);
}

function is_local_file(file){
    return file.startsWith("file://");
}