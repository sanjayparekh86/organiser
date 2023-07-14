/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
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
        var physicalScreenWidth = window.screen.width /** window.devicePixelRatio*/;
        var physicalScreenHeight = window.screen.height /** window.devicePixelRatio*/;
        // $(".panzoom-parent").css({ "width": physicalScreenWidth + "px", "height": physicalScreenHeight + "px", "border": "1px solid red" })
        $('#but_take').click(function () {
            navigator.camera.getPicture(onSuccess, onFail, {
                quality: 50,
                allowEdit: true,
                destinationType: Camera.DestinationType.FILE_URL
            });
        });
        $("#addContainer").click(function () {
//            app.addBox();
            app.addResizable();
        })
        // Select from gallery 
        $("#but_select").click(function () {
            navigator.camera.getPicture(onSuccess, onFail, {
                quality: 50,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                allowEdit: true,
                destinationType: Camera.DestinationType.FILE_URI
            });
        });
        app.drag_resize();
        // Change image source
        function onSuccess(imageData) {
            var image = document.getElementById('uploaded_image');
            image.src = imageData + '?' + Math.random();
            console.log(image.naturalWidth, image.naturalHeight)
            $("#uploaded_image").show();
            // apply_hammerjs();
            setTimeout(function () {
//                app.drag_resize();
            }, 100)

        }

        function onFail(message) {
            alert('Failed because: ' + message);
        }


    },
    panzoom: null,
    containers: {},
    counter: 1,
    img_width: 0,
    img_height: 0,
    cont_width: 0,
    cont_height: 0,
    max_left: 0,
    drag_resize: function () {
        app.img_width = Math.abs($('#panzoom img').innerWidth());
        app.img_height = Math.abs($('#panzoom img').innerHeight());
        app.cont_width = Math.abs($('#panzoom-parent').innerWidth());
        app.cont_height = Math.abs($('#panzoom-parent').innerHeight());
        app.max_left = app.img_width - app.cont_width;
        app.max_top = app.img_height - app.cont_height;
        $(".panzoom").draggable({
            drag: function (event, ui) {
                if (ui.position.top >= 0) {
                    ui.position.top = 0;
                }
                if (ui.position.left >= 0) {
                    ui.position.left = 0;
                }
                if (Math.abs(ui.position.left) >= app.max_left) {
                    ui.position.left = -app.max_left;
                }
                if (Math.abs(ui.position.top) >= app.max_top) {
                    ui.position.top = -app.max_top;
                }
            }
        });
        $("#slider-range").slider({
            // orientation: "vertical",
            range: "min",
            value: 1,
            min: 1,
            max: 100,
            step: 1,
            change: function (event, ui) {
                $(".panzoom").width($(".panzoom").width() + (ui.value * 10))
                $(".panzoom").height($(".panzoom").height() + (ui.value * 10))
//                $("#amount").val(ui.value);
//                app.panzoom.zoom(ui.value)
            }
        });
        return;
        const elem = document.getElementById("panzoom")
//        console.log(elem)
        app.panzoom = Panzoom(elem, {
            maxScale: 10,
            minScale: 1,
            contain: 'outside',
            // panOnlyWhenZoomed:true
        })
        //  app.panzoom.pan(10, 10)
        app.panzoom.zoom(0, {animate: true})

        // Panning and pinch zooming are bound automatically (unless disablePan is true).
        // There are several available methods for zooming
        // that can be bound on button clicks or mousewheel.
//        document.getElementById("zoomIn").addEventListener('click', app.panzoom.zoomIn)
//        document.getElementById("zoomOut").addEventListener('click', app.panzoom.zoomOut)
        document.getElementById("disable_func").addEventListener('click', function () {
            app.panzoom.setOptions({"disablePan": true})
            app.panzoom.setOptions({"disableZoom": true})

        });
        document.getElementById("enable_func").addEventListener('click', function () {
            app.panzoom.setOptions({"disablePan": false})
            app.panzoom.setOptions({"disableZoom": false})
        });
        $("#slider-range").slider({
            // orientation: "vertical",
            range: "min",
            value: 1,
            min: 1,
            max: 10,
            step: 0.2,
            slide: function (event, ui) {
//                $("#amount").val(ui.value);
                app.panzoom.zoom(ui.value)
            }
        });
        elem.addEventListener('panzoomchange', (event) => {
            $("#slider-range").slider('value', event.detail.scale);
        })
        // document.getElementById("zoomreset").addEventListener('click', app.panzoom.reset());

        //   elem.parentElement.addEventListener('wheel', app.panzoom.zoomWithWheel)
    },

    addBox: function () {
        var id = `container_${app.counter}`;
        var div = `<div id="container_${app.counter}" class="small_container" style="">
            <div id="child_${id}" style="width:99px;height:99px;background-color:blue;z-index:200;"></div>
        </div>`
        var content = div;
        $("#panzoom-parent").append(content);

        const elem = document.getElementById(id)
        var container = Panzoom(elem, {
            maxScale: 3,
            contain: 'inside',
            // panOnlyWhenZoomed:true
        })
        container.pan(0, 0);
        app.counter++
    },
    addResizable: function () {
        var id = `container_${app.counter}`;
        var div = `<div id="container_${app.counter}" class="small_container" style="width:99px;height:99px;background-color:blue;z-index:200;">
            <div id="child_${id}" style=""></div>
        </div>`
        var content = div;
//        $("#panzoom-parent").append(content);
        $("#panzoom").append(content);
        $(`#container_${app.counter}`).draggable({containment: "parent"});


        app.counter++
    },

};

app.initialize();
function drag_resize() {
    const elem = document.getElementById("panzoom")
    const panzoom = Panzoom(elem, {
        maxScale: 3,
        contain: 'inside'
    })
    panzoom.pan(10, 10)
    panzoom.zoom(2, {animate: true})

    // Panning and pinch zooming are bound automatically (unless disablePan is true).
    // There are several available methods for zooming
    // that can be bound on button clicks or mousewheel.
    document.getElementById("zoomIn").addEventListener('click', panzoom.zoomIn)
    document.getElementById("zoomOut").addEventListener('click', panzoom.zoomOut)
    //   elem.parentElement.addEventListener('wheel', panzoom.zoomWithWheel)
}
