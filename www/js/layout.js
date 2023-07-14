/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var LAYOUT = {
    menu: `<ul id='main_menu_list' data-role="listview">
                    <li data-icon="delete"><a href="#" data-rel="close">Close</a></li>
                    <li><a href="#" onclick="redirect('home.html')">Home</a></li>
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
    goto: function (url) {
        redirect(url)
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
//        alert("menu render") <a href="#email"><span class="white-text email">${user_details.email}</span></a>
        if (sessionStorage.getItem("user_details")) {
            var user_details = $.parseJSON(sessionStorage.getItem("user_details"));
            var total_boxes = user_details.total_boxes != undefined && user_details.total_boxes != null ? user_details.total_boxes : 0;
            var total_containers = user_details.total_containers != undefined && user_details.total_containers != null ? user_details.total_containers : 0;
            var total_items = user_details.total_items != undefined && user_details.total_items != null ? user_details.total_items : 0;
            var item_photos = user_details.item_photos != undefined && user_details.item_photos != null ? user_details.item_photos : 0;
            var plan_info = ` <div class="collection">
                            <h4 href="#!" class="collection-item">${user_details.name} Plan</h4>
                            <a href="#!" class="collection-item"><span class="new badge">${total_boxes}/${user_details.boxes}</span>Boxes</a>
                            <a href="#!" class="collection-item"><span class="new badge">${total_items}/${user_details.items}</span>Items</a>
                            <a href="#!" class="collection-item"><span class="new badge">${item_photos}/${user_details.item_images}</span>Item Photos</a>

    
  </div>`
            this.menu = `<ul id="slide-out" class="sidenav" style="transform: translateX(0%); ">
    <li><div class="user-view1 cyan darken-2 white-text ">      
      Hello,
      <a href="#name"><span class="white-text name">${user_details.first_name}</span></a>
      
    </div></li>
        <li><div class="divider"></div></li>
    <li><a href="#!" onclick="redirect('home.html')"><i class="material-icons">home</i>Home</a></li>
    <li><a href="#!" onclick="redirect('account.html');"><i class="material-icons">person</i>Profile</a></li>
    <li><div class="divider"></div></li>
    
    <li><a class="waves-effect" href="#!" onclick="redirect('credits.html');"><i class="material-icons">style</i>Credits</a></li> 
    <li><a class="waves-effect" href="#!" onclick="logout();"><i class="material-icons">power_settings_new</i>Logout</a></li>
        <li style="display:none"><div class="divider"></div></li>
        <li>${plan_info}</li>
  </ul>`
            $(".main_menu").html(this.menu);
//        $("#main_menu_list").listview({
////            filter: true
//        });
            $("#panel-overlay").css("position", "fixed")
        }
    },
    renderFooter: function () {},

}
LAYOUT.initialize();



