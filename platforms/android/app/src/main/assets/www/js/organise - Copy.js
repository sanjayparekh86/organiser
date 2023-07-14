var app = {
    panzoom: null,
    containers: {},
    counter: 1,
    minzoom: 1,
    maxzoom: 10,
    mincontainerzoom: 1,
    maxcontainerzoom: 5,
    img_width: 0,
    img_height: 0,
    cont_width: 0,
    cont_height: 0,
    max_left: 0,
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        this.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        //        $(document).on("pagecreate", "#page1", function () {
        app.add_image();
        $("#move_base").on("click", function () {
            $("#move_base").hide();
//            app.panzoom.setOptions({"disablePan": false});
//            app.panzoom.setOptions({"disableZoom": false});
//            var zoom = app.panzoom.getScale();
            app.fixContainers();
            $(".full-width-slider").show();
            $("#slider2").slider("enable");
            $(".small_container").draggable("disable");
            $("#save").show();
            app.applysliderZoom(app.panzoom, 1);
        });
        $("#save").click(function () {
            $("#move_base").show();
            app.fixContainers();
//            app.panzoom.setOptions({"disablePan": true});
//            app.panzoom.setOptions({"disableZoom": true});
            app.enableContainerEvents(app.counter, 1);
            $(".small_container").draggable("enable");
            $("#save").hide();
            $(".full-width-slider").hide();
            $("#move_base").show();
        })
        //        });

    },
    image_selection_options: {
        quality: 50,
        allowEdit: true,
    },
    add_image: function () {
        app.apply_zooming();
        $("#add_image").click(function () {
            $('#choose_image').popup("open");
            //            return false;
        })
        app.image_selection_options.destinationType = Camera.DestinationType.FILE_URI
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
            $("#popupForm").popup("open", {
                positionTo: "window"
            });
            $("#add_to_container").off("click").on("click", function () {
                var name = $("#container_name").val();
                $("#container_name").val("");
                var container_desc = $("#container_desc").val();
                $("#container_desc").val("");
                app.containers[app.counter] = {name: name, desc: container_desc};
                app.addContainer();
                $("#popupForm").popup("close");
                $("#add_to_container").off("click")
            })
//            app.addContainer();
        });
    },
    addContainer: function () {
        // first disable all small containers
        app.fixContainers();
//        app.panzoom.setOptions({"disablePan": true});
//        app.panzoom.setOptions({"disableZoom": true});
        var id = `container_${app.counter}`;

        var div = `<div id="container_${app.counter}" class="small_container"  data-counter="${app.counter}">
            <div id="child_${id}" class="ui-nodisc-icon child_container" style="">
                <a href="javascript:;" class="edit_container ui-btn ui-shadow ui-corner-all ui-icon-bullets ui-btn-icon-notext ui-btn-b ui-btn-inline">edit</a>
    <a href="javascript:;" class="delete_container ui-btn ui-shadow ui-corner-all ui-icon-delete ui-btn-icon-notext ui-btn-b ui-btn-inline delete-icon">Delete</a>
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
        $("#panzoom").append(content);
        $(`#container_${app.counter}`)
                .draggable({containment: "parent", cancel: '.ui-btn'})
                .resizable({
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
        //        $(`#${id}`).draggable(/*{containment: "parent"}*/);
        /*
         * add ui draggable to fix scaling issue
         * const elem = document.getElementById(id)
         app.containers[app.counter] = {
         element: elem,
         panzoom: Panzoom(elem, {
         maxScale: 3,
         minScale: 0.5,
         contain: 'inside',
         disableZoom: true,
         //                focal:{}
         // panOnlyWhenZoomed:true
         })
         }
         app.containers[app.counter].panzoom.pan(0, 0);
         app.containers[app.counter].panzoomOptions = {"pan": {},
         zoom: 1};
         //        app.containers[app.counter].panzoom.zoom(1);*/
        app.enableContainerEvents(app.counter, 1);
        $("#move_base").show();
        app.counter++;

    },
    fixContainers: function () {
        if ($(".small_container").length > 0) {
            $(".small_container").each(function () {
                var ele = $(this).data("counter");

                /*app.containers[ele].panzoomOptions = {"pan": app.containers[ele].panzoom.getPan(),
                 zoom: app.containers[ele].panzoom.getScale()};
                 app.containers[ele].panzoom.setOptions({"disablePan": true, "disableZoom": true});*/
            });
            $(".small_container.active").removeClass("active");
        }
    },
    enableContainerEvents: function (counter, zoom) {
        $(".full-width-slider").hide();
        $("#slider2").slider("disable");
        $(`.small_container`).off("tap dragstart resizestart");
        //        $(`#container_${counter}`)
        $(`.small_container`).on("tap dragstart resizestart", function () {
            if ($(this).hasClass("active") == false) {
                app.fixContainers();
                $(this).addClass("active")
            }
        });
        $(".delete_container,.edit_container").off("click")
        $(".delete_container").on("click", function () {
            var $this = $(this);
            alert("delete_container")
            $("#popupDialog").popup("open");

            $(".do_delete").off("click").on("click", function () {
                alert("do_delete")
                var container = $this.parents(".small_container")
                var ele = container.data("counter");
                delete app.containers[ele];
                container.remove();
                $("#popupDialog").popup("close");
            })
        });
        $(".edit_container").on("click", function () {
            var $this = $(this);
            var container = $this.parents(".small_container")
            var ele = container.data("counter");
            $("#container_name").val(app.containers[ele].name);
            $("#container_desc").val(app.containers[ele].desc);

            $("#add_to_container").off("click").on("click", function () {
                var name = $("#container_name").val();
                $("#container_name").val("");
                var container_desc = $("#container_desc").val();
                $("#container_desc").val("");
                app.containers[ele].name = name;
                app.containers[ele].desc = container_desc;
//                app.addContainer();
                $("#popupForm").popup("close");
                $("#add_to_container").off("click")
            })
            $("#popupForm").popup("open", {
                positionTo: "window",
            });
        });
        $("#slider2").attr({"min": app.mincontainerzoom, "max": app.maxcontainerzoom});
        /* $(`#container_${counter}`).on("tap panzoomchange", function () {
         if ($(this).hasClass("active") == false) {
         app.fixContainers();
         $(this).addClass("active");
         var ele = $(this).data("counter");
         app.panzoom.setOptions({"disablePan": true});
         app.panzoom.setOptions({"disableZoom": true});
         app.containers[ele].panzoom.setOptions({"disablePan": false, "disableZoom": false});
         var zoom = app.containers[ele].panzoomOptions.zoom;
         //            app.containers[ele].panzoom.pan = app.containers[ele].panzoom.getPan();
         //            app.enableContainerEvents(ele, app.containers[ele].panzoom.zoom);
         
         //                debugger;
         //                console.log(zoom)
         app.applysliderZoom(app.containers[ele].panzoom, zoom);
         //            $(`#container_${counter}`).off("tap")
         }
         
         });*/
        //        $(`#container_${counter}`).off("panzoomend").on("panzoomend", function () {
        //            app.enableContainerEvents(counter, zoom)
        //        })

    },
    imageChooseFail: function (message) {
        $('#choose_image').popup("close")
        alert('Failed because: ' + message);
    },
    imageChooseSuccess: function (imageData) {
        $('#choose_image').popup("close");
        var image = document.getElementById('uploaded_image');
        image.src = imageData + '?' + Math.random();
        //        
        if (app.panzoom != null) {
            app.panzoom.destroy();
        }
        app.apply_zooming();
    },
    init_width: 0,
    init_height: 0,
    apply_zooming: function () {
        // set image to fit box
        app.setImageAspectRatio();
        app.setContainerTopLeft();

        $(".panzoom").draggable({
            drag: function (event, ui) {
                app.fixImageDrag(ui.position);
            }
        });
        /*const elem = document.getElementById("panzoom");
         app.panzoom = Panzoom(elem, {
         maxScale: 10,
         minScale: 1,
         disableZoom: true,
         contain: 'outside',
         // panOnlyWhenZoomed:true
         });
         setTimeout(function () {
         app.panzoom.pan(0, 0, {force: true})
         app.panzoom.zoom(1, {animate: true, force: true});
         }, 200);
         
         $("#slider2").attr({"min": app.minzoom, "max": app.maxzoom});*/
        app.applysliderZoom(app.panzoom, 1);
        //        $("#slider2").change(function () {
        //            app.panzoom.zoom($("#slider2").val(), {force: true});
        //        });
        //        elem.addEventListener('panzoomchange', (event) => {
        //            $("#slider2").val(event.detail.scale);
        //        })
    },
    fixImageDrag: (position) => {
        if (position.top >= 0) {
            position.top = 0;
        }
        if (position.left >= 0) {
            position.left = 0;
        }
        if (Math.abs(position.left) >= app.max_left) {
            position.left = -app.max_left;
        }
        if (Math.abs(position.top) >= app.max_top) {
            position.top = -app.max_top;
        }
        return position;
    },
    zoom_val: $("#slider2").val(),
    setContainerTopLeft: () => {
        app.img_width = Math.abs($('#panzoom img').width());
        app.img_height = Math.abs($('#panzoom img').height());
        app.cont_width = Math.abs($('#panzoom-parent').width());
        app.cont_height = Math.abs($('#panzoom-parent').height());
        app.max_left = app.img_width - app.cont_width;
        app.max_top = app.img_height - app.cont_height;
    },
    zoomstep: 1,
    applysliderZoom: (elem, zoom) => {
        $("#slider2").val(app.zoom_val).slider("refresh");
        $("#slider2").off("change").on("change", function () {
            var zoom = parseFloat($("#slider2").val());
            if (parseFloat(zoom) > parseFloat(app.zoom_val)) {
                console.log($("#uploaded_image").width(), $("#uploaded_image").height(), zoom * app.zoomstep)
                $("#uploaded_image").width(parseFloat($("#uploaded_image").width()) + (zoom * app.zoomstep))
                $("#uploaded_image").height(parseFloat($("#uploaded_image").height()) + (zoom * app.zoomstep));
            } else if (parseFloat(zoom) < parseFloat(app.zoom_val)) {
                console.log($("#uploaded_image").width(), $("#uploaded_image").height(), zoom * app.zoomstep)
                $("#uploaded_image").width(parseFloat($("#uploaded_image").width()) - (zoom * app.zoomstep))
                $("#uploaded_image").height(parseFloat($("#uploaded_image").height()) - (zoom * app.zoomstep));
            }
            console.log("after => ", $("#uploaded_image").width(), $("#uploaded_image").height(), zoom * app.zoomstep)
            app.zoom_val = parseFloat(zoom);
            app.setContainerTopLeft();
            var pos = app.fixImageDrag($("#panzoom").position());
            $("#panzoom").css({top: pos.top + "px", "left": pos.left + "px"})
        })
        /*$("#slider2").off("slidechange").on("slidechange", function (event, ui) {
         console.log(ui.value)
         //            elem.zoom($("#slider2").val(), {force: true});
         
         });
         $("#slider2").on("slidestart", function (event, ui) {
         //            elem.setOptions({disableYAxis: true});
         });
         $("#slider2").on("slidestop", function (event, ui) {
         //            elem.setOptions({disableYAxis: false});
         });*/
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
        app.init_width = $("#uploaded_image").width();
        app.init_height = $("#uploaded_image").height();
        /*} else {
         }*/

        //        $("#uploaded_image").css({"width": newImgWidth + "px", "height": newImgHeight + "px"})
        //        
        //        if (img_height >= con_height) {
        //            img_height = con_height;
        //            $("#choose_image").css("height", img_height + "px")
        //        } else if (img_width >= con_width) {
        //            img_width = con_width;
        //            $("#choose_image").css("width", img_width + "px")
        //        }
    },

};

app.initialize();
