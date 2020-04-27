$(function(){
  function buildHTML(message){
    if ( message.image ) {
      var html =
        `<div class="message">
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
     `<div class="message">
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
});