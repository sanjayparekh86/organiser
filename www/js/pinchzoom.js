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
 *//*
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
  

}
};

app.initialize();*/

$(function () {
    var elem =document.getElementById("panzoom");
    var instance = panzoom(elem, {
        // zoomSpeed: 0.065 // 6.5% per mouse wheel event
        bounds: true,
        smoothScroll: false,
        boundsPadding: 1
    });
    /*elem.panzoom({
        maxScale: 5,
       // $zoomRange: $("#amount"),
    //    contain: "automatic"
    });*/
    $("#disable_func").click(function () {
        instance.pause();
    })
    $("#enable_func").click(function () {
        instance.resume();
    })
    $("#zoomIn").click(function () {
        elem.panzoom("zoom");
    })
    $("#zoomOut").click(function () {
        elem.panzoom("zoom", true);
    })
    /*const panzoom = Panzoom($(".panzoom"))
    zoomInButton.addEventListener('click', panzoom.zoomIn)
    zoomOutButton.addEventListener('click', panzoom.zoomOut)
    resetButton.addEventListener('click', panzoom.reset)
    rangeInput.addEventListener('input', (event) => {
        panzoom.zoom(event.target.valueAsNumber)
    })*/
    /*const elem = document.getElementById("panzoom")
    const panzoom = Panzoom(elem, {
        maxScale: 5,
        contain: 'inside'
    })
    panzoom.pan(10, 10)
    panzoom.zoom(2, { animate: true })

    // Panning and pinch zooming are bound automatically (unless disablePan is true).
    // There are several available methods for zooming
    // that can be bound on button clicks or mousewheel.
    document.getElementById("zoomIn").addEventListener('click', panzoom.zoomIn)
    document.getElementById("zoomOut").addEventListener('click', panzoom.zoomOut)
    //   elem.parentElement.addEventListener('wheel', panzoom.zoomWithWheel)*/
})