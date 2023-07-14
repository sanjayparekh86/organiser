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
        localStorage.removeItem("selected_box");
        localStorage.setItem("action","add");
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
                hideLoading();
                var res = $.parseJSON(response);
                if (res.success) {
//                    console.log(res.data);
                    app.data = res.data;
                    localStorage.setItem("all_boxes", JSON.stringify(res.data))
                    app.render_boxes();
                }
            }
        })
    },
    itms_arr: {},
    itms_container: {},
    render_boxes: function () {
        if (Object.keys(app.data).length > 0) {
            $(".box_containers").show();
            $.each(app.data, function (k, v) {
                var html = "";
//                console.log(v)
                var col = "s6 m3 l4";
                /* var d = $.parseJSON(v.data);
                 if(parseFloat(d.img_width) > parseFloat(d.img_height)){  */
                col = "s12 m12 l6";
                //}
                html += `<div id="box_${v.id}" data-box_id="${v.id}" class="box_cont col ${col} ui-body-a ui-corner-all">
                            <div class="col ui-bar-a ui-corner-all base_box_img" id="base_img_${v.id}" >
                            <img src="${v.image_url}" class='base_image'  />`;

                html += `</div>`
                html += `<div class="row1 no-bottom-margin">
                            <div class="col s10 l10 m10 no-padding"><label>${v.name}</label></div>
                                <div class="col s2 l2 m2 right-align no-padding">
                                      <a class="btn-floating1 btn-flat1 btn-small waves-effect waves-light blue view_box" data-id="${v.id}" href="javascript:;"><i class="tiny material-icons white-text">remove_red_eye</i></a>
                                </div>
                            </div>
                        </div>`;
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
                        var c = `<div ${s} data-id="${vv.id}" data-counter="${vv.counter}" class='small_container cyan accent-2 '>
                        <a data-position="bottom" data-tooltip="${vv.name}" href="javascript:;" data-base_id="${v.id}" data-container_id="${vv.id}" onclick="app.show_contaienr_popup(this);" class="show_contaienr_popup tooltipped">
                        <div id="child_${vv.id}" class="child_container" style="">
                                <span> ${vv.counter}</span>
                        </div>
                        </a>
                        </div>`;
                        $(`#base_img_${v.id}`).append(c);
                        var items = vv.items;
                        if (vv.name != "" && vv.name != null) {
                            if (app.itms_container[vv.name] == undefined) {
                                app.itms_container[vv.name] = {};
                            }
                            app.itms_container[vv.name] = {k: {kk: {box: k, container: kk}}};
                        }
                        if (items.length > 0) {
                            $.each(items, function (kkk, vvv) {
                                app.itms_arr[vvv.name] = vvv.image_url != undefined && vvv.image_url != null ? vvv.image_url : "";
                                if (app.itms_container[vvv.name] == undefined) {
                                    app.itms_container[vvv.name] = {};
                                }
                                if (app.itms_container[vvv.name][k] == undefined) {
                                    app.itms_container[vvv.name][k] = {}
                                }
                                if (app.itms_container[vvv.name][k][kk] == undefined) {
                                    app.itms_container[vvv.name][k][kk] = {}
                                }
                                app.itms_container[vvv.name][k][kk] = {box: k, container: kk}
                            })
                        }
//                        $('.tooltipped').tooltip();

                    });

                });
                $('#search').autocomplete({
                    data: app.itms_arr,
                    onAutocomplete: function (a) {
                        app.filter_box(a);
                    }
                });
                $('#search').on("blur keyup", function () {
                    var a = $(this).val();

                    app.filter_box(a);
                    if ($.trim(a) == "") {
                        $(".search_icn").show();
                        $(".clear_icon").hide();
                    } else {
                        $(".search_icn").hide();
                        $(".clear_icon").show();
                    }
                });
                $(".clear_icon").click(function () {
                    $('#search').val("").blur()
                })
                $(window).scroll(function () {
                    if ($('.ui-content').height() + 50 <= ($(window).height() + $(window).scrollTop())) {
                        $(".fixed-action-btn").hide("fade")
                    } else {
                        $(".fixed-action-btn").show("fade")
//                        document.getElementsByClassName("fixed-action-btn").style.display = 'block';

                    }
                });
                $(".view_box").click(function () {
                    var selected_id = $(this).data("id");
                    localStorage.setItem("selected_box",selected_id);
                    localStorage.setItem("action","edit");
                    redirect("organise.html");
                })

            }, 200);

        }
    },
    filter_box: function (a) {
        $(".animate_red").removeClass("animate_red");
        if (Object.keys(app.itms_container).length > 0 && a != "") {
            $(".box_cont").hide();
            for (var i in app.itms_container) {
                if (i.toLowerCase().includes(a.toLowerCase())) {
//                    console.log(app.itms_container[i]);
                    if (Object.keys(app.itms_container[i]).length) {
                        for (var j in app.itms_container[i]) {
                            if (Object.keys(app.itms_container[i][j]).length > 0) {
                                for (var k in app.itms_container[i][j]) {
                                    if (Object.keys(app.itms_container[i][j][k]).length > 0) {
                                        var box = app.itms_container[i][j][k].box;
                                        var container = app.itms_container[i][j][k].container;
                                        $(".box_cont[data-box_id='" + box + "']").show();
                                        var cntrs = $("#box_" + box).find(".small_container[data-id='" + container + "']");
                                        cntrs.addClass("animate_red");
                                        setTimeout(function () {
//                                            cntrs.removeClass("animate_red");
                                        }, 2000)
                                    }
                                }
                            }
                        }
                    }
                }
            }
            /*$.each(app.itms_container, function (k, v) {
             if (k.includes(a)) {
             console.log(v);
             
             }
             })*/
        } else {
            $(".box_cont").show();
            $(".animate_red").removeClass("animate_red");
        }
        return
        if (app.itms_container[a] != undefined) {

            var box = app.itms_container[a].box;
            var container = app.itms_container[a].container;

            $(".box_cont").hide();
//            for(var b in )
            $(".box_cont[data-box_id='" + box + "']").show();
            $("#box_" + box).show();
            var cntrs = $("#box_" + box).find(".small_container[data-id='" + container + "']");
            cntrs.addClass("animate_red");
            setTimeout(function () {
                cntrs.removeClass("animate_red");
            }, 200)
        }
    },
    show_contaienr_popup: function (ele) {
        var $this = $(ele);
//        alert($this.data("base_id") + "-" + $this.data("container_id"));
//        console.log(app.data[$this.data("base_id")].container[$this.data("container_id")]);
        var li = `<h4>${app.data[$this.data("base_id")].container[$this.data("container_id")].counter}. ${app.data[$this.data("base_id")].container[$this.data("container_id")].name}</h4>`
        li += `<ul id='items_list' data-role="listview" data-inset="true">`;
        var items = app.data[$this.data("base_id")].container[$this.data("container_id")].items;

        if (items.length > 0) {

            $.each(items, function (k, v) {
                li += `<li class="">
                            ${v.image != undefined && v.image != null ? "<img src='" + v.image + "'>" : ""}
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
            $("#modal1").modal("open");
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

        } else {

        }

    }
};
app.initialize();
