var app = {
    element: null,
    img: null,
    containers: {},
    counter: 1,
    id: null,
    name: null,
    base_options: {
        id: null,
        base_name: null,
        nativeURL: null,
        imageName: null,
        upload_status: 0,
        img_width: 0,
        img_height: 0,
        cont_width: 0,
        cont_height: 0,
        max_left: 0,
        init_width: 0,
        init_height: 0,
        user_id: null,
        zoom_val: 1,
    },
    panzoom: null,
    zoom_val: $("#slider2").val(),
    app_folder: CONST.app_folder,
    active_container: null,
    current_counter: 1,
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        this.panzoom = $.extend({}, this.base_options);
        this.panzoom.user_id = localStorage.getItem("user_id");
//        console.log(this.panzoom);
        this.receivedEvent('deviceready');
    },
    receivedEvent: function (id) {
//        this.app_folder = CONST.app_folder;
        $("input").addClass("browser-default")
        app.element = $("#panzoom");
        app.add_image();
        $("#move_base").on("click", function () {
            $("#move_base").hide();
            app.setContainerProperties();
            $(".full-width-slider").show();
            $(".action_grid").hide()
            $("#slider2").slider("enable");
            $(".small_container").draggable("disable").resizable("disable");
            $(`.small_container`).off("tap dragstart resizestart");
            $("#save").show();
            $("#add_box").hide();
            app.applysliderZoom(app.element, 1);
        });
        $("#save").click(function () {
            $("#move_base").show();
            app.setContainerProperties();
            app.enableContainerEvents(app.counter, 1);
            $("#save").hide();
            $(".full-width-slider").hide();
            if (Object.keys(app.containers).length > 0)
                $(".action_grid").show()
            $("#move_base,#add_box").show();
        })
        //        });

        $("#save_organiser").click(function () {

            if ($("#base_name").val() == "") {
                toast("Please enter name");
            } else if (Object.keys(app.containers).length === 0) {
                toast("Please add boxe(s)");
            } else {

                // start upload images;
                // first upload base image
                app.panzoom.base_name = $("#base_name").val();
                var base = JSON.stringify(app.panzoom)
                var containers = JSON.stringify(app.containers);

                // first save everything on server then send images
                $.ajax({
                    url: APPAPI.saveBase,
                    data: {base: base, containers: containers},
                    type: "post",
                    beforeSend: function () {
                        showLoading();
                    }, success: function (result) {
//                        alert(result);
                        console.log($.parseJSON(result));
                        var res = $.parseJSON(result);
                        hideLoading();
                        if (res.success == "1") {

//                            app.panzoom = res.data.base;
//                            app.containers = res.data.containers;
                            // upload all images
                            app.upload_base_image();
                            $.each(app.containers, function (k, v) {
                                $.each(v.items, function (kk, i) {
                                    if (i.image != null) {
                                        app.upload_item_image(i.image_name, i.image);
                                    }
                                });
                            })
                            alert("All was done");
                            redirect("home.html")

                        } else {
                            toast(res.data.msg);
                        }

                        return;
//                        var res = $.parseJSON(result);
//                        var data = res.data;
//                        app.panzoom = data;
                    }
                })
                return;

            }
//            localStorage.setItem("base", base);
//            localStorage.setItem("containers", containers);
            /*    CONST.db.transaction(function (tx) {
             tx.executeSql(`INSERT INTO ${CONST.table.base_container}('name','base_data','is_live') values(?,?,?)`,
             ["test1", base, 0],
             function (tx, results) {
             var lastInsertId = results.insertId; // this is the id of the insert just performed
             CONST.db.transaction(function (tx) {
             tx.executeSql(`INSERT INTO ${CONST.table.containers}('base_id','container_data') values(?,?)`,
             [lastInsertId, containers],
             function (tx, results) {
             alert("successfully inserted")
             
             },
             CONST.errorCB
             );
             }, CONST.errorCB, CONST.successCB);
             },
             CONST.errorCB
             )
             }, CONST.errorCB, CONST.successCB);*/
        });
        /**
         * 
         * @type type
         * tx.executeSql("INSERT INTO profile('name','label','list_order','category') values(?,?,?,?)", 
         [currentProfile.name, currentProfile.label, currentProfile.list_order, currentProfile.category], 
         function(tx, results){
         var lastInsertId = results.insertId; // this is the id of the insert just performed
         }, 
         failCB
         )
         */
    },
    upload_base_image: function () {
        if (is_local_file(app.panzoom.nativeURL)) {
            showLoading("Uploading Main Image");
            var params = {};
            if (app.panzoom.upload_status == 0) {
                uploadImage(app.panzoom.imageName, app.panzoom.nativeURL, APPAPI.uploadFile, params, function (result) {
                    hideLoading();
                })
            }
        }
    },
    upload_item_image: function (name, url) {
        if (is_local_file(url)) {
            showLoading("Uploading "+ name);
            var params = {};
            uploadImage(name, url, APPAPI.uploadFile, params, function (result) {
                hideLoading();
            })
        }

    },
    image_selection_options: {
        quality: 50,
        allowEdit: true,
    },
    add_image: function () {
//        app.apply_zooming();
        if (localStorage.getItem("fileObj") != null) {
            var fileObj = $.parseJSON(localStorage.getItem("fileObj"));
            app.moveSuccess(fileObj);
        } else {

        }
        $(".action_grid").hide()
        $("#add_image").click(function () {
            $('#choose_image').popup("open");
            //            return false;
        })
        var devicePlatform = device.platform;
        if (devicePlatform == "Android") {
            app.image_selection_options.destinationType = Camera.DestinationType.FILE_URI;
        } else {
            app.image_selection_options.destinationType = Camera.DestinationType.NATIVE_URI

        }
        $("#from_camera").click(function () {
            if (app.image_selection_options.sourceType != undefined) {
                delete app.image_selection_options.sourceType;
            }
            navigator.camera.getPicture(app.imageChooseSuccess, app.imageChooseFail, app.image_selection_options)
        });
        $("#from_gallery").click(function () {
            app.image_selection_options.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
            navigator.camera.getPicture(app.imageChooseSuccess, app.imageChooseFail, app.image_selection_options)
        });
        $("#add_box").click(function () {

//            $("#popupForm").dialog({
//                autoOpen: true
//            });
//            $("#popupForm").popup("open", {
//                positionTo: "window"
//            });
            app.current_counter = app.counter;
            app.containers[app.counter] = {
                counter: app.counter,
                name: null,
//                    desc: container_desc,
                element: null,
                top: 0,
                left: 0,
                width: 0,
                height: 0,
                items: new Array(),
                is_locked: false
            };

            $(":mobile-pagecontainer").pagecontainer("change", "#containers", {changeHash: true});
            $("#add_to_master").off("click").on("click", function () {
                var name = $("#container_name").val();
                $("#container_name").val("");
//                var container_desc = $("#container_desc").val();
//                $("#container_desc").val("");
//                var item = $("#item_name").val();
//                var itm_img = items_obj.img_url;
                app.containers[app.current_counter].name = name/*, desc: container_desc*/;
//app.containers[app.counter].element = 
                $(".container_images").empty().hide();
                app.addContainer();

                $(":mobile-pagecontainer").pagecontainer("change", "#page1", {changeHash: true});
//                $("#popupForm").popup("close");
                $("#add_to_master").off("click");
                $(".container_images").html("")
            })
//            app.addContainer();
        });
        $("#add_item").click(function () {
            items_obj.action = "add";
            items_obj.item_id = null;
            $("#item_header").html("Add Item");
            $("#item_name").val("");
            $("#item_img_container").hide();
            $("#item_img").removeAttr("src");
            $("#item_edit_options").hide();
            $("#add_item_to_container").show();
            $(":mobile-pagecontainer").pagecontainer("change", "#items", {
                changeHash: true,
                load: function () {

                }
            });
        })
        $("#item_camera").click(function () {

            if (app.image_selection_options.sourceType != undefined) {
                delete app.image_selection_options.sourceType;
            }
            navigator.camera.getPicture(items_obj.itemImageChooseSuccess, items_obj.imageChooseFail, app.image_selection_options)
        });
        $("#item_gallery").click(function () {
            app.image_selection_options.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
            navigator.camera.getPicture(items_obj.itemImageChooseSuccess, items_obj.imageChooseFail, app.image_selection_options)
        });
        $("#add_item_to_container").on("click", function () {
            if ($("#item_name").val() == "") {
                alert("Please enter item name");
                return false;
            }
            // generate items grid on #containers
            var item = $("#item_name").val();
            var itm_img = items_obj.img_url;
            var obj = {
                name: item,
                image: itm_img,
                image_name: items_obj.imageName
            }
            app.containers[app.current_counter].items.push(obj);
            items_obj.populate_container_items(app.current_counter)

            setTimeout(function () {

//                $("#items_list").listview("refresh");

                $(":mobile-pagecontainer").pagecontainer("change", "#containers", {changeHash: true});
            })
        });
        $(".delete_item_img").on("click", function () {
            $(".item_img").removeAttr("src");
            $(".item_img_container").hide();
            items_obj.img_url = null;
        });
    },
    addContainer: function () {
        // first disable all small containers
        app.setContainerProperties();

        var id = `container_${app.counter}`;
        var div = `<div id="container_${app.counter}" class="small_container"  data-counter="${app.counter}">
            <div id="child_${id}" class="child_container" style="">
               <span> ${app.counter}</span>
</div>
                <div class="ui-resizable-handle ui-resizable-nw" id="nwgrip"></div>
                <div class="ui-resizable-handle ui-resizable-ne" id="negrip"></div>
                <div class="ui-resizable-handle ui-resizable-sw" id="swgrip"></div>
                <div class="ui-resizable-handle ui-resizable-se" id="segrip"></div>
                <div class="ui-resizable-handle ui-resizable-n" id="ngrip"></div>
                <div class="ui-resizable-handle ui-resizable-s" id="sgrip"></div>
                <div class="ui-resizable-handle ui-resizable-e" id="egrip"></div>
                <div class="ui-resizable-handle ui-resizable-w" id="wgrip"></div>
        </div>`;
        var content = div;
        app.element.append(content);
        $(`#container_${app.counter}`)
                .draggable({containment: "parent", /*stack: ".child_container",opacity: 0.7*/})
                .resizable({
                    containment: "#panzoom",
                    minHeight: 50,
                    minWidth: 50,
                    handles: {
                        'nw': '#nwgrip',
                        'ne': '#negrip',
                        'sw': '#swgrip',
                        'se': '#segrip',
                        'n': '#ngrip',
                        'e': '#egrip',
                        's': '#sgrip',
                        'w': '#wgrip'
                    }
                });
        app.containers[app.counter].element = $(`#container_${app.counter}`);
        app.containers[app.counter].element.css({top: Math.abs(app.panzoom.position.top), left: Math.abs(app.panzoom.position.left)})
        var pos = $(`#container_${app.counter}`).position();
        // set container at the top left of the visible box
//        app
        app.containers[app.counter].top = pos.top;
        app.containers[app.counter].left = pos.left;
        app.enableContainerEvents(app.counter, 1);
        $("#move_base").show();
        app.setContainerProperties();
        app.container_event(app.containers[app.counter].element);
        app.populateContainerList(app.counter);
        app.counter++;
    },
    populateContainerList: function (counter) {
        return false;
        if ($(".small_container").length > 0) {
            var li = `<ul id='containers_list' data-role="listview" data-inset="true">`;
            $.each(app.containers[counter].items, function (k, v) {
                li += `<li class="">
                        <a href="javascript:;"  data-item="${k}">${v.image != null ? "<img src='" + v.image + "'>" : ""}
                            <h2>${v.name}</h2>
                        </a>
                       <!-- <a href="javascript:;" class="item_action" data-item="${k}">Edit</a> -->
                    </li>`;
            })

            li += `</ul>`;
            $(".container_listview").html(li).show();
            $("#containers_list").listview({
                filter: true
            });
        } else {
            $(".container_listview").html("").hide();
        }
    },
    setContainerProperties: function () {

        if ($(".small_container").length > 0) {
            $(".small_container").each(function () {
                var ele = $(this).data("counter");
                var pos = app.containers[ele].element.position();
                app.containers[ele].top = pos.top;
                app.containers[ele].left = pos.left;
                app.containers[ele].width = app.containers[ele].element.width();
                app.containers[ele].height = app.containers[ele].element.height();
                if (app.containers[ele].is_locked == false)
                    $(this).draggable("enable").resizable("enable");
            });
            $(".small_container.active").removeClass("active");
            app.active_container = null;
//            $(".edit_container,.delete_container,.lock_container").addClass("ui-state-disabled");
        }
    },
    container_event: ($this) => {
        if ($this.hasClass("active") == false) {
            app.setContainerProperties();
            $this.addClass("active");
            app.active_container = $this;
//            $(".edit_container,.delete_container,.lock_container").removeClass("ui-state-disabled");
            var ele = app.active_container.data("counter");
            app.current_counter = ele;
            if (app.containers[app.current_counter].is_locked == true) {

                app.lockContainer();

            } else {

                app.unlockContainer();

            }
            app.populateContainerList(app.current_counter);
        }
    },
    enableContainerEvents: function () {
        $(".full-width-slider").hide();
        $(".action_grid").show();
        $("#slider2").slider("disable");
        $(`.small_container`).off("tap dragstart resizestart");
        $(`.small_container`).on("tap", function () {
            app.container_event($(this))
        })
        $(`.small_container`).on("dragstart", function () {
            app.container_event($(this))
        })
        $(`.small_container`).on("resizestart", function () {
            app.container_event($(this))
        })
        //        $(`#container_${counter}`)

        $(".delete_container,.edit_container,.lock_container").off("click")
        $(".delete_container").on("click", function () {
            if (app.active_container != null) {
                var $this = $(this);
                $("#popupDialog").popup("open");
                $(".do_delete").off("click").on("click", function () {

                    var container = app.active_container;
                    var ele = container.data("counter");
                    delete app.containers[ele];
                    container.remove();
                    $("#popupDialog").popup("close");
                    app.active_container = null;
//                    $(".edit_container,.delete_container,.lock_container").addClass("ui-state-disabled");
                    app.populateContainerList();
                })
            }
        });
        $(".edit_container").on("click", function () {
            if (app.active_container != null) {
                var $this = $(this);
                var container = app.active_container;
                var ele = container.data("counter");
                app.current_counter = ele;
                $("#container_name").val(app.containers[ele].name);
//                $("#container_desc").val(app.containers[ele].desc);
                items_obj.populate_container_items(ele)
                $("#add_to_master").off("click").on("click", function () {
                    var name = $("#container_name").val();
                    $("#container_name").val("");
//                    var container_desc = $("#container_desc").val();
//                    $("#container_desc").val("");
                    app.containers[ele].name = name;
//                    app.containers[ele].desc = container_desc;
//                app.addContainer();
//                    $("#popupForm").popup("close");
                    $(":mobile-pagecontainer").pagecontainer("change", "#page1", {changeHash: true});
                    $("#add_to_master").off("click");
                    app.populateContainerList(ele);
                });
                $(":mobile-pagecontainer").pagecontainer("change", "#containers", {changeHash: true});
//                $("#popupForm").popup("open", {
//                    positionTo: "window",
//                });
            }
        });

        $(".lock_container").on("click", function () {
            if (app.active_container != null) {
                var $this = $(this);
                var container = app.active_container;
                var ele = container.data("counter");
                app.current_counter = ele;
                app.containers[app.current_counter].is_locked = !app.containers[app.current_counter].is_locked;
                if (app.containers[app.current_counter].is_locked == true) {
                    app.lockContainer();
                } else {
                    app.unlockContainer();
                }
            }
        })

    },
    lockContainer: function () {
//        $(".lock_container").removeClass("ui-icon-unlock").addClass("ui-icon-lock")
//        $(".lock_container").removeClass(" ui-btn-a").addClass("ui-btn-b");
//        $(".lock_container").html("Unlock")
        $(".lock_container").find(".material-icons").html('lock');
        $(".lock_container").find("span").html('Unlock Box');
        $(".lock_container").addClass("darken-4")
        app.containers[app.current_counter].element.draggable("disable").resizable("disable");
        app.containers[app.current_counter].element.find(".ui-resizable-handle").hide()

    },
    unlockContainer: function () {
//        $(".lock_container").addClass("ui-icon-unlock").removeClass("ui-icon-lock")
//        $(".lock_container").addClass("ui-btn-a").removeClass("ui-btn-b");
        $(".lock_container").find(".material-icons").html('lock_open')
        $(".lock_container").find("span").html('Lock Box');
        $(".lock_container").removeClass("darken-4")
//        $(".lock_container").html("Lock")

        app.containers[app.current_counter].element.draggable("enable").resizable("enable");
        app.containers[app.current_counter].element.find(".ui-resizable-handle").show()
    },
    imageChooseFail: function (message) {
//        $('#choose_image').popup("close")
//        alert('Failed because: ' + message);
    },
    imageChooseSuccess: function (imageData) {
        if (app.panzoom.nativeURL != null) {
            if (confirm("Do you want to remove all containers?")) {
                app.resetContainers();
            }
        }
        $('#choose_image').popup("close");
        if (app.element != null) {
            app.element.draggable("destroy");
        }
        app.moveFile(imageData, app.moveSuccess);
        $(".full-width-slider").show();
        $(".action_grid").hide()
    },
    resOnError: function (error) {
        alert(error.code);
    },
    moveSuccess: function (fileObj) {
        var imageData = fileObj.nativeURL;
        app.panzoom.nativeURL = fileObj.nativeURL;
        app.panzoom.imageName = fileObj.name;
        var image = document.getElementById('uploaded_image');
        image.src = imageData + '?' + Math.random();
        //        

        setTimeout(app.apply_zooming, 200)
    },
    moveFile: function (imageData, callback) {
//        console.log();
//        return
        window.resolveLocalFileSystemURL(imageData, function (entry) {
            var d = new Date();
            var n = d.getTime();
            var newFileName = n + ".jpg";

            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSys) {
                //The folder is created if doesn't exist
                fileSys.root.getDirectory(app.app_folder,
                        {create: true, exclusive: false},
                        function (directory) {
                            entry.moveTo(directory, newFileName, function (entry) {
                                callback(entry)
                                // successMove()
//                                console.log(entry)
                            }, app.resOnError);
                        },
                        app.resOnError);
            }, app.resOnError);

        }, app.resOnError);
    },
    apply_zooming: function () {
        // set image to fit box
//        resetZoom
//        $("#slider2").val(1);        
        app.panzoom.zoom_val = 1;
        app.setImageAspectRatio();
        app.element.draggable({
            drag: function (event, ui) {
                app.fixImageDrag(ui.position);
                app.panzoom.position.top = ui.position.top;
                app.panzoom.position.left = ui.position.left;
            }
        });
        app.panzoom.position = {top: 0,
            left: 0};
        app.panzoom.width = app.panzoom.init_width, app.panzoom.height = app.panzoom.init_height;
        app.element.css({"top": "0", "left": "0"});
        app.setImgTopLeft();
//        app.fixImageDrag(app.element.position())
        app.applysliderZoom(app.element, 1);
    },
    fixImageDrag: (position) => {
        if (position.top >= 0) {
            position.top = 0;
        }
        if (position.left >= 0) {
            position.left = 0;
        }
        if (Math.abs(position.left) >= app.panzoom.max_left) {
            position.left = -app.panzoom.max_left;
        }
        if (Math.abs(position.top) >= app.panzoom.max_top) {
            position.top = -app.panzoom.max_top;
        }
        return position;
    },
    setImgTopLeft: () => {
        app.panzoom.img_width = Math.abs($('#uploaded_image').width());
        app.panzoom.img_height = Math.abs($('#uploaded_image').height());
        app.panzoom.cont_width = Math.abs($('#panzoom-parent').width());
        app.panzoom.cont_height = Math.abs($('#panzoom-parent').height());
        app.panzoom.max_left = app.panzoom.img_width - app.panzoom.cont_width;
        app.panzoom.max_top = app.panzoom.img_height - app.panzoom.cont_height;
    },
    zoomstep: 10,
    applysliderZoom: (elem) => {
        $("#slider2").val(app.panzoom.zoom_val).slider("refresh");
        $("#slider2").off("change").on("change", function () {
            var zoom = parseFloat($("#slider2").val());
            var img = $("#uploaded_image");
            var width = parseFloat(img.width()), height = parseFloat(img.height());
            var new_width = parseFloat(img.width()), new_height = parseFloat(img.height());
            if (parseFloat(zoom) > parseFloat(app.panzoom.zoom_val)) {
                new_width = width + (zoom - app.panzoom.zoom_val);
                new_height = height + (zoom - app.panzoom.zoom_val);
            } else if (parseFloat(zoom) < parseFloat(app.panzoom.zoom_val)) {
                new_width = width - (app.panzoom.zoom_val - zoom);
                new_height = height - ((app.panzoom.zoom_val - zoom));
            }

//            var pos = app.element.position();
//            app.element.css({top: pos.top - (app.panzoom.zoom_val - zoom) + "px", "left": pos.left - (app.panzoom.zoom_val - zoom) + "px"})
            img.width(new_width)
            img.height(new_height);
            app.panzoom.zoom_val = parseFloat(zoom);
            app.setImgTopLeft();
            var pos = app.fixImageDrag(app.panzoom.position);
            app.element.css({top: pos.top + "px", "left": pos.left + "px"});
            var old_width = app.panzoom.width, old_height = app.panzoom.height;
            $.each(app.containers, function (k, v) {
//                console.log(k, v);
                if (v.element != null) {
                    var ele_pos = v.element.position();
                    app.containers[k].width = (new_width * v.width) / old_width;
                    app.containers[k].height = (new_height * v.height) / old_height;
                    app.containers[k].top = (new_height * ele_pos.top) / old_height;
                    app.containers[k].left = (new_width * ele_pos.left) / old_width;
                    app.containers[k].element.css({
                        width: app.containers[k].width + "px",
                        height: app.containers[k].height + "px",
                        top: app.containers[k].top + "px",
                        left: app.containers[k].left + "px",
                    })
                }
            });
            app.panzoom.position.top = pos.top;
            app.panzoom.position.left = pos.left;
            app.panzoom.width = new_width;
            app.panzoom.height = new_height;
            $("#panzoom").width(app.panzoom.width);
            $("#panzoom").height(app.panzoom.height);
        })
    },
    setImageAspectRatio: function () {
        var image = document.getElementById('uploaded_image');
        var img_width = parseFloat(image.naturalWidth), img_height = parseFloat(image.naturalHeight);
        var parent = document.getElementById('panzoom-parent');
        var con_width = parseFloat(parent.clientWidth), con_height = parseFloat(parent.clientHeight);
        //        app.image_selection_options.targetHeight = con_width;
        //        app.image_selection_options.targetWidth = con_height;
        var targetHeight = (img_width * con_height) / con_width;
        var targetWidth = (img_height * con_width) / con_height;
        var newImgHeight = (con_width * img_height) / img_width;
        var newImgWidth = (con_height * img_width) / img_height;
        $("#uploaded_image").css({"width": "", "height": ""});
        //        if (img_width > img_height) {
        if (newImgWidth >= con_width && newImgHeight > con_height)
            $("#uploaded_image").css("width", newImgWidth + "px")
        else if (newImgHeight >= con_height && newImgWidth > con_width) {
            $("#uploaded_image").css("height", newImgHeight + "px")
        } else if (newImgHeight <= con_height && newImgWidth > con_width) {
            $("#uploaded_image").css("height", con_height + "px")
        } else {
            $("#uploaded_image").css("width", con_width + "px")
        }
        app.panzoom.init_width = $("#uploaded_image").width();
        app.panzoom.init_height = $("#uploaded_image").height();
//        document.getElementById('uploaded_image')
        $("#panzoom").width(app.panzoom.init_width);
        $("#panzoom").height(app.panzoom.init_height);
    },
    resetContainers: function () {
        if (app.panzoom.nativeURL != null) {
            if (app.panzoom.upload_status == 0) {
                app.deleteFile(app.panzoom.nativeURL);
            }
//            app.panzoom = {
//                id: null,
//                base_name: null,
//                nativeURL: null,
//                imageName: null,
//                upload_status: 0,
//                img_width: 0,
//                img_height: 0,
//                cont_width: 0,
//                cont_height: 0,
//                max_left: 0,
//                init_width: 0,
//                init_height: 0,
//            }
            app.panzoom = $.extend({}, app.base_options);
            app.panzoom.user_id = localStorage.getItem("user_id");
        }
        if (Object.keys(app.containers).length > 0) {
            $.each(app.containers, function (k, v) {
                if (v.items) {
                    $.each(v.items, function (kk, vv) {
                        if (vv.image != null) {
                            app.deleteFile(vv.image);
                        }
                    })
                }
            });
            app.containers = {};
            app.counter = 1;
            $(".small_container").remove();
        }
    },
    deleteFile: function (url) {
        window.resolveLocalFileSystemURL(url, function (file) {
            file.remove(function () {
                console.log(url + " deleted");
            }, app.resOnError);
        }, app.resOnError);
    }
};
var items_obj = {
    img_url: null,
    item_id: null,
    imageName: null,
    action: null,
    itemImageChooseSuccess: function (imageData) {
        app.moveFile(imageData, function (fileObj) {
            var img = $(".item_img");
            var imageData = fileObj.nativeURL;
//            app.panzoom.nativeURL = fileObj.nativeURL;
            items_obj.imageName = fileObj.name;
            items_obj.img_url = imageData + '?' + Math.random();
            $(".item_img").attr("src", items_obj.img_url);
            $("#item_img_container").show();
        });
    },
    imageChooseFail: function (message) {

//        alert('Failed because: ' + message);
    },
    populate_container_items(counter) {
//        data-split-icon="gear" data-split-theme="a" 
        if (app.containers[counter].items.length > 0) {
            var li = `<ul id='items_list' data-role="listview" data-inset="true">`;
            $.each(app.containers[counter].items, function (k, v) {
                li += `<li class="">
                        <a href="javascript:;" class="item_action" data-item="${k}">${v.image != null ? "<img src='" + v.image + "'>" : ""}
                            <h2>${v.name}</h2>
                        </a>
                       <!-- <a href="javascript:;" class="item_action" data-item="${k}">Edit</a> -->
                    </li>`;
            })

            li += `</ul>`;
            $(".container_images").html(li);
            $("#items_list").listview({
                filter: true
            });
        }
        $(".container_images").show();
        $("#item_img_container").hide();
        $(".item_img").removeAttr("src");
        $("#item_name").val("");
        items_obj.img_url = null;
        items_obj.imageName = null;
        $(".item_action").on("click", function (evt) {
//            console.log($(this).data("item"))
//                $("#itemPopup").popup("open", {x: evt.pageX, y: evt.pageY});
                evt.preventDefault();
            items_obj.action = "edit";
            items_obj.item_id = $(this).data("item");

            $("#items").pagecontainer({
                load: function (event, ui) {
                    alert("page loaded")
                }
            });
//            app.containers[1].items[items_obj.item_id]
            var item = app.containers[app.current_counter].items[items_obj.item_id];
            $("#item_header").html("Edit Item");
            $("#item_name").val(item.name);
            if (item.image != null) {
                $(".item_img").attr("src", item.image);
                $("#item_img_container").show();
                items_obj.img_url = item.image;
                items_obj.imageName = item.imageName;
            }
            $("#item_header").html("Edit Item");
            $("#item_edit_options").show();
            $("#add_item_to_container").hide();
            $(":mobile-pagecontainer").pagecontainer("change", "#items", {
                changeHash: true,
                load: function () {

                }
            });
        });

        $("#delete_item_to_container").off("click").on("click", function () {
            if (confirm("do you want to remove this item?")) {
                app.containers[app.current_counter].items.splice(items_obj.item_id, 1);
                setTimeout(function () {

//                $("#items_list").listview("refresh");

                    $(":mobile-pagecontainer").pagecontainer("change", "#containers", {changeHash: true});
                })
            }
        });
        $("#edit_item_to_container").off("click").on("click", function () {

            if ($("#item_name").val() == "") {
                alert("Please enter item name");
                return false;
            }
            // generate items grid on #containers
            var item = $("#item_name").val();
            var itm_img = items_obj.img_url;
            var obj = {
                name: item,
                image: itm_img,
                image_name: items_obj.imageName
            }
            app.containers[app.current_counter].items[items_obj.item_id] = obj;
            items_obj.populate_container_items(app.current_counter)

            setTimeout(function () {

//                $("#items_list").listview("refresh");

                $(":mobile-pagecontainer").pagecontainer("change", "#containers", {changeHash: true});
            })
        });

    }
}
app.initialize();


//window.plugins.toast.show('Hello there!', 'long', 'bottom', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)})