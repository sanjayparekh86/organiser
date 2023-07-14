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
//        alert("home loaded")
        this.getBoxesData();
        this.applyEvents();
//        CONST.db.transaction(function (tx) {
//            tx.executeSql(`select * from ${CONST.table.base_container}`, [], function (tx, results) {
//                var len = results.rows.length;
//                for (var i = 0; i < len; i++) {
//                    var note = results.rows.item(i);
//                    console.log(note)
//                }
//            }, CONST.errorCB)
//        }, CONST.errorCB, CONST.successCB)
    },
    image_selection_options: {
        quality: 50,
        allowEdit: true,
    },
    applyEvents: function () {
        /*$('.fixed-action-btn').click(function () {
         
         $('#choose_image').popup("open");
         })*/
        $('.fixed-action-btn').floatingActionButton({direction: "top"});
        $("body").click(function (e) {
            if ($(e.target).hasClass("material-icons") == false) {
                $('.fixed-action-btn').floatingActionButton("close");
            }
        });
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
    },
    imageChooseFail: function (message) {
//        $('#choose_image').popup("close")
//        alert('Failed because: ' + message);
    },
    imageChooseSuccess: function (imageData) {

        moveFile(imageData, app.moveSuccess);
    },
    moveSuccess: function (fileObj) {
        var imageData = fileObj.nativeURL;
        localStorage.setItem("fileObj", JSON.stringify(fileObj));
        redirect("organise.html")
//        window.location = "organise.html";
    },
    getBoxesData: function () {
        $.ajax({
            url: APPAPI.getboxes,
            method: "post",
            data: {user_id: localStorage.getItem("user_id")},
            beforeSend: function () {
                // show loading
                showLoading();
            },
            success: function (response) {
                hideLoading()
                var res = $.parseJSON(response);
                if (res.success) {
                    console.log(res.data);
                    app.data = res.data;
                    app.render_boxes()
                }
            }
        })
    },
    render_boxes: function () {
        if (Object.keys(app.data).length > 0) {
            $(".box_containers").show();
            $.each(app.data, function (k, v) {
                var html = "";
                html += `<div id="box_${v.id}" data-box_id="${v.id}" class="box_cont col s6 m3 l4 ui-body-a ui-corner-all">
                    <div class="col ui-bar-a ui-corner-all base_box_img" id="base_img_${v.id}" >
                            <img src="${v.image_url}" class='base_image'  />`;

                html += `</div>`
                html += `<div class="col">${v.name}</div></div>`;
                $(".box_containers").append(html);

            });
            setTimeout(function () {
                $.each(app.data, function (k, v) {
                    var d = $.parseJSON(v.data);
//                    console.log($(`#base_img_${v.id}`).width(), $(`#base_img_${v.id}`).height())
//                console.log(d);
                    var new_width = $(`#base_img_${v.id}`).width(), new_height = $(`#base_img_${v.id}`).height()
                    var old_width = d.width, old_height = d.height;
                    $.each(v.container, function (kk, vv) {
                        var new_c_width = new_width * vv.width / old_width;
                        var new_c_height = new_height * vv.height / old_height;
                        var new_c_top = new_height * vv.top / old_height;
                        var new_c_left = new_width * vv.left / old_width;
                        var s = `style="width:${new_c_width}px;height:${new_c_height}px;top:${new_c_top}px;left:${new_c_left}px;;"`;
//                    var cont_width = 
                        var c = `<div ${s} data-id="${vv.id}" data-counter="${vv.counter}" class='small_container cyan accent-2'>
                        <a href="javascript:;" data-base_id="${v.id}" data-container_id="${vv.id}" onclick="app.show_contaienr_popup(this);" class="show_contaienr_popup">
                        <div id="child_${vv.id}" class="child_container" style="">
                                <span> ${vv.counter}</span>
                        </div>
                        </a>
                        </div>`;
                        $(`#base_img_${v.id}`).append(c);
                    })

                });

            }, 200);

        }
    },
    show_contaienr_popup: function (ele) {
        var $this = $(ele);
//        alert($this.data("base_id") + "-" + $this.data("container_id"));
        console.log(app.data[$this.data("base_id")].container[$this.data("container_id")]);
        var li = `<ul id='items_list' data-role="listview" data-inset="true">`;
        var items = app.data[$this.data("base_id")].container[$this.data("container_id")].items;
        if (items.length > 0) {
            $.each(items, function (k, v) {
                li += `<li class="">
                            ${v.image_url != undefined && v.image_url != null ? "<img src='" + v.image_url + "'>" : ""}
                            <h2>${v.name}</h2>
                       <!-- <a href="javascript:;" class="item_action" data-item="${k}">
                        </a>
                        <a href="javascript:;" class="item_action" data-item="${k}">Edit</a> -->
                    </li>`;

            })

            li += `</ul>`;
            $(".container_images").html(li);
            $("#items_list").listview({
//            filter: true
            });
            $("#modal1").modal()
            $("#modal1").modal("open")
            /* $("#choose_image").popup("open", {
             beforeposition: function () {
             $(this).css({
             //                        top:"25px"
             //                        width: window.innerWidth - 20,
             //                    height: window.innerHeight - 14
             });
             },
             x: 10,
             y: 10
             });*/
        }
    }
};
app.initialize();
