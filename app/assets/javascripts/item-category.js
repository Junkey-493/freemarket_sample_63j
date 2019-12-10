
$(document).on('turbolinks:load', function(){

  $(function(){
  
    // カテゴリーセレクトボックスのオプションを作成
    function appendOption(category){
      var html = `<option value="${category.name}" data-category="${category.id}">${category.name}</option>`;
      return html;
    }
    // 子カテゴリーの表示作成
    function appendChidrenBox(insertHTML){
      var childSelectHtml = '';
      childSelectHtml = `<div class='select' id= 'children_wrapper'>
                          <select id="child_category" name="item[child_category]" required>
                            <option value="---" data-category="---">---</option>
                            ${insertHTML}
                          </select>
                          <div class='chevron-down'></div>
                        </div>`;
  
      $('#category').append(childSelectHtml);
      
    }
    // 孫カテゴリーの表示作成
    function appendGrandchidrenBox(insertHTML){
      var grandchildSelectHtml = '';
      grandchildSelectHtml = `<div class='select' id= 'grandchildren_wrapper'>
                                <select class = "grandchild" id="grandchild_category" name="item[grandchild_category]" required>
                                  <option value="---" data-category="---">---</option>
                                  ${insertHTML}
                                </select>
                                <div class='chevron-down'></div>
                              </div>`;
  
        $('#category').append(grandchildSelectHtml);
      
    }
  
    // 親カテゴリー選択後のイベント
    $('#parent_category').on('change', function(){
      var parentCategory = document.getElementById('parent_category').value; //選択された親カテゴリーの名前を取得
      if (parentCategory != "---"){ //親カテゴリーが初期値でないことを確認
        $.ajax({
          url: '/items/get_category_children',
          type: 'GET',
          data: { parent_name: parentCategory },
          dataType: 'json'
        })
        .done(function(children){
          $('#children_wrapper').remove(); //親が変更された時、子以下を削除するする
          $('#grandchildren_wrapper').remove();
          $('#size_wrapper').remove();
          $('#brand_wrapper').remove();
          var insertHTML = '';
          children.forEach(function(child){
            insertHTML += appendOption(child);
          });
          appendChidrenBox(insertHTML);
        })
        .fail(function(){
          alert('カテゴリー取得に失敗しました');
        })
      }else{
        $('#children_wrapper').remove(); //親カテゴリーが初期値になった時、子以下を削除するする
        $('#grandchildren_wrapper').remove();
        $('#size_wrapper').remove();
        $('#brand_wrapper').remove();
      }
    });
    // 子カテゴリー選択後のイベント
    $('#category').on('change', '#child_category', function(){
      var childId = $('#child_category option:selected').data('category'); //選択された子カテゴリーのidを取得
      if (childId != "---"){ //子カテゴリーが初期値でないことを確認
        $.ajax({
          url: '/items/get_category_grandchildren',
          type: 'GET',
          data: { child_id: childId },
          dataType: 'json'
        })
        .done(function(grandchildren){
          if (grandchildren.length != 0) {
            $('#grandchildren_wrapper').remove(); //子が変更された時、孫以下を削除するする
            $('#size_wrapper').remove();
            $('#brand_wrapper').remove();
            var insertHTML = '';
            grandchildren.forEach(function(grandchild){
              insertHTML += appendOption(grandchild);
            });
            appendGrandchidrenBox(insertHTML);
          }
        })
        .fail(function(){
          alert('カテゴリー取得に失敗しました');
        })
      }else{
        $('#grandchildren_wrapper').remove(); //子カテゴリーが初期値になった時、孫以下を削除する
        $('#size_wrapper').remove();
        $('#brand_wrapper').remove();
      }
    });
  });

});

// ==================================================
// 子カテゴリ、孫カテゴリが選択されたいないときにアラートを出す（出品画面）
// ==================================================
$(document).on('turbolinks:load', function(){
  $('#new_item').on('submit', function(e){
    var child_category = $("#child_category").val();
    var grandchild_category = $("#grandchild_category").val();
    if(child_category == "---" || grandchild_category == "---"){
      e.preventDefault();
      $.ajax({
      }).done(function(){
        alert('カテゴリを選択してください');
        $('input[name="commit"]').prop('disabled', false);
      }).fail(function(){
        alert('ajax失敗');
      })
    }
  })
})

// ==================================================
// 子カテゴリ、孫カテゴリが選択されたいないときにアラートを出す（編集画面）
// ==================================================
$(document).on('turbolinks:load', function(){
  $('.edit_item').on('submit', function(e){
    var child_category = $("#child_category").val();
    var grandchild_category = $("#grandchild_category").val();
    if(child_category == "---" || grandchild_category == "---"){
      e.preventDefault();
      $.ajax({
      }).done(function(){
        alert('カテゴリを選択してください');
        $('input[name="commit"]').prop('disabled', false);
      }).fail(function(){
        alert('ajax失敗');
      })
    }
  })
})
