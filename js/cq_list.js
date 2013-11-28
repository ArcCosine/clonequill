function CQList(){
  this.init();
}

CQList.prototype = {
  init : function(){
    this.NEW_TEXT = '<i class="icon-plus"></i>New Text'
    this.client = null;
    this.table = null;
  },
  load: function(client){
    this.client = client;
  },
  create: function(){
    var _self = this;

    this.client.getDatastoreManager().openDefaultDatastore(function (error, datastore) {
      if (error) {
        alert('Error opening default datastore: ' + error);
      }

      _self.table = datastore.getTable('quill');

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
  update: function() {
    // clear lists.
    $('#list-datas').empty();

		var records = this.table.query();
    // sort by created
    this.sort( 'created', records );

    var list = document.createDocumentFragment();
    var li = list.appendChild(document.createElement("li"));
    $(li).attr({ "data-id" : "NEW"}).html(this.NEW_TEXT).addClass("active");
    var arrow = li.appendChild(document.createElement("i"));
    $(arrow).addClass("icon-right-open");


		// Add an item to the list for each task.
		for (var i = 0, iz = records.length; i < iz; i++) {
			var record = records[i];
      var li = list.appendChild(document.createElement("li"));
      $(li).attr({ "data-id" : record.getId() }).text(record.get("title"));
      if ( record.get("share")  ===  "public" ) {
        $(li).addClass("public");
      }
      var arrow = li.appendChild(document.createElement("i"));
      $(arrow).addClass("icon-right-open");
    }
    $('#list-datas').append(list);
  },
  showEditor: function(id){
    var edit = new CQEdit();

    if( id !== "NEW" ){

      var record = this.table.get(id);

      edit.setTitle(record.get("title"));
      edit.setText(record.get("content"));
      if( record.get('share')  ===  "public" ){
        $('input#edit-public').prop("checked", true );
        var link = record.get('link');
        if(  link !== "" ){
          edit.setLink(link);
        }
      } else {
        $('input#edit-private').prop("checked", true );
      }
    }
    edit.setId(id);

    $('#list,#login,#edit').hide();
    $('#edit').show();

    edit.focus();

  },
  addEvent: function(){
    var _self = this;

    $(document).on("click",'#list-datas li', function(event){

      event.preventDefault();
      event.stopPropagation();

      var id = $(this).attr("data-id");
      _self.showEditor(id);

    });
  },
  save: function(){
    var _self = this;

    var title = $("#edit-title").val(), content = $('#edit-area').val(), id = $('#edit-id').val(),
    share = $('input[name="edit-share"]:checked').val(),
    sharelink = $('#edit-share-button a').length > 0 ? $('#edit-share-button a').attr("href") : "";

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
      var oldcontent = record.get('content');

      record.set('title',title);
      record.set('content',content);
      record.set('share',share);

      if( share === "public" && sharelink !== "" ){
        record.set('link',sharelink);
        if( oldcontent !== content ){
          this.client.writeFile(id+".txt", content, function(error){
            if( error ){
              console.log(error);
            }
          });
        }
      }
    }
  },
  del: function(){
    var id = $('#edit-id').val();
    if( id === "" || id === "NEW" ){
      return;
    }
    if( window.confirm("本当に削除しますか？") ){
      this.table.get(id).deleteRecord();
    }
  }
}
