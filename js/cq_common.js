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
    list.showList();
  }

  $("#edit-title").on("keydown", function(event){
    if( event.keyCode === 13 ){ //Return
      event.preventDefault();
      event.stopPropagation();
      $("#edit-area").focus();
    }
  });

  $("#edit-save").on("click", function(event){
    list.save();
    list.create();
    list.showList();
  });

  $("#edit-delete").on("click", function(event){
    list.del();
    list.create();
    list.showList();
  });

  $("#edit-public").on("click", function(event){
    var text = $("#edit-area").val();
    var title= $("#edit-id").val();
    auth.share(title+".txt", text);
  });

  $("#edit-private").on("click", function(event){
    var id = $("#edit-id").val();
    list.remove(id);
    $("#edit-share-button").empty();
  });


  $(".logout").on("click", function(event){
    auth.logout();
  });


  $(document).on("keydown", function(event){

    if( !/INPUT|TEXTAREA|BUTTON/.test(event.target.tagName.toUpperCase()) ){
      var option =  {
        shift: event.shiftKey,
        ctrl: event.ctrlKey
      };
      keyhelper.control( event, option );
    }

    if ( event.ctrlKey && event.keyCode == 83 ) { // Ctrl + s as secret command
      keyhelper.saveStart();
    }

    if ( $('#edit:visible') && event.ctrlKey && event.keyCode == 68 ) { // Ctrl + d as secret command
      keyhelper.delStart();
    }


  });

}

//Loader
$(document).ready(init);
