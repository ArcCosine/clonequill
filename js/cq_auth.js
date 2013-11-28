function CQAuth(){
  this.init();
}

CQAuth.prototype = {
  init: function(){

    var DROPBOX_APP_KEY = "7fbztn41f0rkbif";  //Set your app key

    this.client = new Dropbox.Client({key: DROPBOX_APP_KEY});

    // OAuth check
    this.client.authenticate({interactive:false}, function (error) {
      if( error ){
        alert('Authentication error: ' + error);
      }
    });
  },
  login: function(){
    this.client.authenticate();
  },
  logout: function(noReload){
    this.client.signOut({mustInvalidate: false}, function(error){
      if( error ){
        alert('Singn out error: ' + error);
      }
    });
    if( typeof noReload !== "undefined" && !noReload ){
      return false;
    }
    location.reload();
  },
  isLogin: function(){
    return this.client.isAuthenticated();
  },
  share: function(filename,txt){
    $("#edit-share-button").html("Saving now....");
    var _self = this;
    this.client.writeFile( filename, txt, function(error, status){
      if( error ){
        console.log(error);
      } else {
        _self.shareUrl(filename);
      }
    });
  },
  shareUrl: function( filename ){
    this.client.makeUrl( filename, {}, function( error , share ){
      if( error ){
        console.log(error);
      } else {
        $("#edit-share-button").empty();
        var aTag = document.createElement("a");
        $(aTag).attr({
          "href":share.url,
          "target" : "_blank"
        }).text(share.url);
        $("#edit-share-button").append(aTag);
      }
    });
  }
}
