function CQEdit(){
  this.init();
}

CQEdit.prototype = {
  init: function(){
    this.title = "";
    this.content = "";
    this.setTitle(this.title);
    this.setText(this.content);
    this.timer = null;

    $("#edit-share-button").empty();
  },
  setTitle: function(text){
    $("#edit-title").val(text);
  },
  setText: function(text){
    $("#edit-area").val(text);
  },
  setId: function(id){
    $("#edit-id").val(id);
  },
  setLink: function(url){
    var aTag = document.createElement("a");
    $(aTag).attr({
      "href":url,
      "target" : "_blank"
    }).text(url);
    $("#edit-share-button").append(aTag);
  },
  focus: function(){
    $("#edit-title").focus();
  },
  show: function(){
    $("#list,#login,#edit").hide();
    $("#edit").show();
  },
  autosave: function(callback){
    this.timer = setInterval(callback, 3000 );
  },
  stop: function(){
    clearInterval(this.timer);
  }
}
