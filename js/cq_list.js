function CQList(){
  this.init();
}

CQList.prototype = {
  init : function(){
    this.NEW_TEXT = "<i class='icon-plus'></i>New Text";
    this.client = null;
    this.table = null;
    this.edit = null;
  },
  load: function(client){
    this.client = client;
  },
  create: function(){
    var _self = this;

    this.client.getDatastoreManager().openDefaultDatastore(function (error, datastore) {
      if (error) {
        alert("Error opening default datastore: " + error);
      }

      _self.table = datastore.getTable("quill");

      _self.update();
		  _self.addEvent();

			datastore.recordsChanged.addListener(function(){ _self.update() });
    })
  },
  sort: function( key, records ){
    records.sort( function (a, b ) {
      return ( a.get(key) < b.get(key) ) ? -1 : ( a.get(key) > b.get(key) ) ? 1 : 0;
    });
  },
  nc: function( node, tag ){
    return node.appendChild(document.createElement(tag));
  },
  listParts: function( option ){
    var list = option.list,
        id = option.id,
        html = option.html,
        active = option.active,
        public = option.public;

    var li = this.nc( list, "li" );
    $(li).attr({ "data-id" : id }).html(html).addClass(active).addClass(public);

    var arrow = this.nc(li,"i");
    $(arrow).addClass("icon-right-open");
  },
  update: function() {
    // clear lists.
    $("#list-datas").empty();

		var records = this.table.query();

    // sort by created
    this.sort( "created", records );

    var list = document.createDocumentFragment();

    // Add first list Parts.
    this.listParts({
      list: list,
      id: "NEW",
      html: this.NEW_TEXT,
      active: "active",
      public: ''
    });

		// Add an item to the list for each task.
    for (var i = 0, iz = records.length; i < iz; i++) {
      var record = records[i];

      this.listParts({
        list: list,
        id: record.getId(),
        html: record.get("title"),
        active: "",
        public: (record.get("share")  ===  "public")  ? "public" : ""
      });

    }

    $("#list-datas").append(list);
  },
  showEditor: function(id){
    var _self = this;

    this.edit = new CQEdit();

    if( id !== "NEW" ){

      var record = this.table.get(id);

      this.edit.setTitle(record.get("title"));
      this.edit.setText(record.get("content"));
      if( record.get("share")  ===  "public" ){
        $("input#edit-public").prop("checked", true );
        var link = record.get("link");
        if(  link !== "" ){
          this.edit.setLink(link);
        }
      } else {
        $("input#edit-private").prop("checked", true );
      }
    }
    this.edit.setId(id);

    this.edit.show();
    // this.edit.autosave(function(){ _self.loop(); });

    this.edit.focus();

  },
  addEvent: function(){
    var _self = this;

    $(document).on("click","#list-datas li", function(event){

      event.preventDefault();
      event.stopPropagation();

      var id = $(this).attr("data-id");
      _self.showEditor(id);

    });
  },
  loop: function(){
    this.localSave();
  },
  localSave: function(){
    var title = $("#edit-title").val(), content = $("#edit-area").val(), id = $("#edit-id").val(),
        share = $("input[name='edit-share']:checked").val(),
        sharelink = $("#edit-share-button a").length > 0 ? $("#edit-share-button a").attr("href") : "";

    var saveobj={
      title: title,
      content: content,
      id: id,
      share: share,
      sharelink: share
    };


    var work = JSON.stringify(saveobj);
    //console.log(work);

    localStorage.setItem("clonequill", work );
    localStorage.setItem("clonequill_local", new Date().getTime() );

  },
  save: function(){
    var _self = this;

    var title = $("#edit-title").val(), content = $("#edit-area").val(), id = $("#edit-id").val(),
        share = $("input[name='edit-share']:checked").val(),
        sharelink = $("#edit-share-button a").length > 0 ? $("#edit-share-button a").attr("href") : "";

    this.edit.stop();

    if( title === "" ){ title = "NO TITLE"; }

    if( id === "" || id === "NEW" ){
      var saveobj={
        title: title,
        content: content,
        share: share
      }
      if( share === "public" && sharelink !== "" ){
        saveobj.link = sharelink;
      }
      this.table.insert(saveobj);
    } else {
      var record = this.table.get(id);
      var oldcontent = record.get("content");

      record.set("title",title);
      record.set("content",content);
      record.set("share",share);

      if( share === "public" && sharelink !== ""  ){
        record.set("link",sharelink);
        if( oldcontent !== content ){
          this.write( id, content );
        }
      }
    }
  },
  write: function( id, content ){
    this.client.writeFile( id + ".txt", content, function(error){
      if(error) {
        console.log("read error");
        console.log(error);
      }
    });
  },
  del: function(){

    this.edit.stop();

    var id = $("#edit-id").val();
    if( id === "" || id === "NEW" ){
      return;
    }
    if( window.confirm("Are you sure you want to delete ?") ){

      var record = this.table.get(id);
      var share = record.get("share");
      if( share === "public" ){
        this.remove(id);
      }
      record.deleteRecord();
    }
  },
  remove: function(id) {
    this.client.remove( id + ".txt", function(error){
      if(error) {
        console.log("remove error");
        console.log(error);
      }
    });
  },
  showList: function(){
    $("#list,#login,#edit").hide();
    $("#list").show();
    $(document).focus();
  }
}
