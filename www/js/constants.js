/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var CONST = {
    app_folder: "com.organiser",
    db: null,
    is_online: true,
    current_page: location.pathname.split('/').slice(-1)[0],
    table: {
        base_container: "base_container",
        containers: "containers",
    },
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        document.addEventListener("online", this.onOnline, false);
        document.addEventListener("offline", this.onOffline, false);
    },
    onDeviceReady: function () {
        this.is_online = localStorage.getItem("online_status") == null ? "true" : "false";
        this.receivedEvent('deviceready');
    },
    onOffline: function () {
        if (this.is_online == "true") {
            localStorage.setItem("online_status", "false")
            this.online_status = "false";
//            alert("went offline")
        }
    },
    onOnline: function () {
        if (this.online_status != "true") {
            localStorage.setItem("online_status", "true")
            this.online_status = "true";
//            alert("online now");
        }
    },
    receivedEvent: function (id) {
        if (this.current_page != "login.html") {
            is_login();
            this.getUserDetails();
        }

        /*this.db = window.openDatabase("organiser", "1.0", "organiser_db", 1000000);
         this.db.transaction(this.populateDB, this.errorCB, this.successCB);*/
    },
    populateDB: function (tx) {
//        console.log(tx);
        tx.executeSql(`CREATE TABLE IF NOT EXISTS ${CONST.table.base_container} (id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL,base_data TEXT NOT NULL,is_live INTEGER NULL)`);
        tx.executeSql(`CREATE TABLE IF NOT EXISTS ${CONST.table.containers} (id INTEGER PRIMARY KEY AUTOINCREMENT,base_id int not null,container_data TEXT NOT NULL)`);
    },
    errorCB: function (err) {
        alert("Error processing SQL: " + err.code);
    },
    successCB: function () {
        // alert("success!");
    },
    getUserDetails: () => {
        var user_details = sessionStorage.getItem("user_details");
        if (user_details == null && localStorage.getItem("user_id") != null) {
            $.ajax({
                url: APPAPI.userDetails,
                method: "post",
                data: {user_id: localStorage.getItem("user_id")},
                beforeSend: function () {
                    // show loading
                    showLoading();
                },
                success: function (response) {
                    hideLoading();
                    var res = $.parseJSON(response);
                    if (res.success) {
                        sessionStorage.setItem("user_details", JSON.stringify(res.data));
                        LAYOUT.renderMenu();
                    }
                }
            })
        }
    }
}

CONST.initialize();

const APIURL = "http://192.168.1.5/organiser_api/appapi/waapi.php?action=";
var APPAPI = {
    signup: APIURL + "signup",
    login: APIURL + "login",
    uniqEmail: APIURL + "uniq_email",
    authenticate: APIURL + "authenticate",
    userDetails: APIURL + "getUserDetails",
    getboxes: APIURL + "getboxes",
    uploadFile: APIURL + "upload_file",
    saveBase: APIURL + "save_base",
    saveContainer: APIURL + "save_container",
    saveItems: APIURL + "save_items",
    deleteBox: APIURL + "delete_box"
}


