function CQKeyboard(data){
  this.init(data);
}

CQKeyboard.prototype = {
  init: function(data){
    this.list = data.list;
  },
  prevItem: function(){
    var acv = $('#list-datas').find(".active").eq(0);
    var prv = ( acv.prev('li').length > 0 ) ? acv.prev('li') : $('#list-datas li:last').eq(0);
    acv.removeClass("active");
    prv.addClass("active");
  },
  nextItem: function(){
    var acv = $('#list-datas').find(".active").eq(0);
    var nxt = ( acv.next('li').length > 0 ) ? acv.next('li') : $('#list-datas li').eq(0);
    acv.removeClass("active");
    nxt.addClass("active");
  },
  selectItem: function(){
    var id = $("#list-datas li.active").attr("data-id");
    this.list.showEditor(id);
  },
  toggleHelp: function(){
    $('#help').toggle();
  },
  loginStart: function(){
    $('#login-text').click();
  },
  logoutStart: function(){
    $('.logout').click();
  },
  saveStart: function(){
    $('#edit-save').click();
  }
}
