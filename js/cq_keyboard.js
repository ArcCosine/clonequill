function CQKeyboard(data){
  this.init(data);
}

CQKeyboard.prototype = {
  init: function(data){
    this.list = data.list;
  },
  control: function( event, option ){
    var keyHash = {
      74 : { callback: this.nextItem },
      75 : { callback: this.prevItem },
      13 : { callback: this.selectItem },
      191: { callback: this.toggleHelp },
      27 : { callback: this.toggleHelp },
      65 : { callback: this.newItem },
      78 : { callback: this.nextItem, ctrl: true },
      80 : { callback: this.prevItem, ctrl: true },
      38 : { callback: this.prevItem },
      40 : { callback: this.nextItem },
      76 : { callback: this.loginStart, shift: true },
      79 : { callback: this.logoutStart, shift: true },
    }
    var keyCode = event.keyCode;

    if( typeof keyHash[keyCode] !== "undefined" ){
      var obj = keyHash[keyCode];
      if( typeof obj.ctrl !== "undefined" && option.ctrl ){
        this.cancel(event);
        obj.callback.apply(this);
      }else if( typeof obj.shift !== "undefined" && option.shift ){
        this.cancel(event);
        obj.callback.apply(this);
      } else if( typeof obj.ctrl === "undefined" && typeof obj.shift === "undefined" && option.ctrl === false && option.shift === false ){
        this.cancel(event);
        obj.callback.apply(this);
      }
    }

  },
  cancel: function(event){
    event.preventDefault();
    event.stopPropagation();
  },
  newItem: function(){
    $("#list-datas li").eq(0).click();
  },
  prevItem: function(){
    var acv = $("#list-datas").find(".active").eq(0);
    var prv = ( acv.prev("li").length > 0 ) ? acv.prev("li") : $("#list-datas li:last").eq(0);
    acv.removeClass("active");
    prv.addClass("active");
  },
  nextItem: function(){
    var acv = $("#list-datas").find(".active").eq(0);
    var nxt = ( acv.next("li").length > 0 ) ? acv.next("li") : $("#list-datas li").eq(0);
    acv.removeClass("active");
    nxt.addClass("active");
  },
  selectItem: function(){
    var id = $("#list-datas li.active").attr("data-id");
    this.list.showEditor(id);
  },
  toggleHelp: function(){
    $("#help").toggle();
  },
  loginStart: function(){
    $("#login-text").click();
  },
  logoutStart: function(){
    $(".logout").click();
  },
  saveStart: function(){
    $("#edit-save").click();
  },
  delStart: function(){
    $("#edit-delete").click();
  }
}
