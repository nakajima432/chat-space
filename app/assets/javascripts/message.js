$(function(){
  function buildHTML(message){
    if ( message.image ) {
      var html =
        `<div class="message" data-message-id=${message.id}>
          <div class="upper-info">
            <div class="talker">
              ${message.user_name}
            </div>
            <div class="date">
              ${message.created_at}
            </div>
          </div>
          <div class="lower-message">
            <p class="content">
              ${message.content}
            </p>
            <img src="${message.image}", class="lower-message__image">
          </div>
        </div>`
    return html;
  } else {
    var html =
     `<div class="message" data-message-id=${message.id}>
        <div class="upper-info">
          <div class="talker">
            ${message.user_name}
          </div>
          <div class="date">
            ${message.created_at}
          </div>
        </div>
        <div class="lower-message">
          <p class="content">
            ${message.content}
          </p>
        </div>
      </div>`
      return html;
    };
  }
  $('#new_message').on('submit', function(e){
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr('action');
    $.ajax({
      url: url,
      type: "POST",
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(data){
      var html = buildHTML(data);
      $('.message-box').append(html);
      $('form')[0].reset();
      $('.submit-btn').prop('disabled', false);
      $('.message-box').animate({ scrollTop: $('.message-box')[0].scrollHeight});
    })
    .fail(function(data) {
      alert("メッセージ送信に失敗しました");
    })
  })
  // 自動更新機能はここから
  var reloadMessages = function() {
    //カスタムデータ属性を利用し、ブラウザに表示されている最新メッセージのidを取得
    var last_message_id = $('.message:last').data("message-id");
    $.ajax({
      //ルーティングで設定した通り/groups/id番号/api/messagesとなるよう文字列を書く
      url: "api/messages",
      //ルーティングで設定した通りhttpメソッドをgetに指定
      type: 'get',
      dataType: 'json',
      //dataオプションでリクエストに値を含める
      data: {id: last_message_id}
    })
    .done(function(messages) {
      if (messages.length !== 0) { //jbuilderから送られた配列内にメッセージが一つでも格納されていれば下記の設定が起動する
        //追加するHTMLの入れ物を作る
        var insertHTML = '';
        //配列messagesの中身一つ一つを取り出し、HTMLに変換したものを入れ物に足し合わせる
        $.each(messages, function(i, message) { //第一引数iは、inputの頭文字
          insertHTML += buildHTML(message)
        });
        //メッセージが入ったHTMLに、入れ物ごと追加
        $('.message-box').append(insertHTML); //message-boxクラスにわざわざinsertHTMLを入れて取得したメッセージのHTMLを表示する理由は、下記の自動更新スクロール設定を起動するため
        $('.message-box').animate({ scrollTop: $('.message-box')[0].scrollHeight});
      }
    })
    .fail(function() {
      alert('error');
    });
  };
  // 下記のreloadMessages関数からイベントが発火する（自動更新機能が起動する）
  if (document.location.href.match(/\/groups\/\d+\/messages/)) {  //今いるページのリンクが/groups/グループID/messagesのパスとマッチすれば以下を実行。
    setInterval(reloadMessages, 7000);
  }
});