function init(){

  var auth = new CQAuth();
  var list = new CQList();
  var keyhelper = new CQKeyboard({ list: list });

  $("#login").show();

  $("#login-text").on("click touchstart", function(event){
    event.preventDefault();
    event.stopPropagation();
    auth.login();
  });

  if( auth.isLogin() ){
    list.load(auth.client);
    list.create();

    $('#list,#login,#edit').hide();
    $('#list').show();

  }

  $('#edit-title').on("keydown", function(event){
    if( event.keyCode === 13 ){ //Return
      event.preventDefault();
      event.stopPropagation();
      $('#edit-area').focus();
    }
  });

  $('#edit-save').on("click", function(event){
    list.save();
    list.create();

    $('#list,#login,#edit').hide();
    $('#list').show();
  });

  $('#edit-delete').on("click", function(event){
    list.del();
    list.create();

    $('#list,#login,#edit').hide();
    $('#list').show();
  });

  $('.logout').on("click", function(event){
    auth.logout();
  });

  $(document).on("keydown", function(event){

    if( !/INPUT|TEXTAREA|BUTTON/.test(event.target.tagName.toUpperCase()) ){
      if( event.keyCode === 74 ){ //j
        keyhelper.nextItem();
      } else if( event.keyCode === 75 ){  //k
        keyhelper.prevItem();
      } else if( event.keyCode === 13 ){ //Enter
        keyhelper.selectItem();
      } else if( event.keyCode === 191 || event.keyCode === 27) { //? or ESC
        keyhelper.toggleHelp();
      } else if ( event.ctrlKey && event.keyCode === 80 ) { // Ctrl + p
        keyhelper.prevItem();
      } else if ( event.ctrlKey && event.keyCode === 78 ) { // Ctrl + n
        keyhelper.nextItem();
      } else if ( event.keyCode === 38 ){ //up
        keyhelper.prevItem();
      } else if ( event.keyCode === 40 ){ // down
        keyhelper.nextItem();
      } else if ( event.shiftKey && event.keyCode == 76 ) { // Shift + l as secret command
        keyhelper.loginStart();
      } else if ( event.shiftKey && event.keyCode == 79 ) { // Shift + o as secret command
        keyhelper.logoutStart();
      }
    }

    if ( event.ctrlKey && event.keyCode == 83 ) { // Ctrl + s as secret command
      keyhelper.saveStart();
    }


  });

  $('#edit-public').on("click", function(event){
    var text = $('#edit-area').val();
    var title= $('#edit-id').val();
    auth.share(title+".txt", text);
  });

  $('#edit-private').on("click", function(event){
    $("#edit-share-button").empty();
  });

}

//Loader
$(document).ready(init);
