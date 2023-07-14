/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var LAYOUT = {
    menu: `<ul data-role="listview">
                    <li data-icon="delete"><a href="#" data-rel="close">Close</a></li>
                    <li><a href="#">List item</a></li>
                    <li><a href="#">List item</a></li>
                    <li><a href="#">List item</a></li>
                </ul>
                <br><br>
                <button class="ui-btn ui-corner-all ui-shadow" onclick="logout();">Logout</button>`,
    initialize: function () {

        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    onDeviceReady: function () {
        this.receivedEvent('deviceready');
    },

    receivedEvent: function (id) {
        this.renderHeader();
        this.renderMenu();
        this.renderFooter();
    },
    renderHeader: function () {
        //stuffy-finder
        
    },
    renderMenu: function () {
        $(".main_menu").html(this.menu);
    },
    renderFooter: function () {},

}
LAYOUT.initialize();



