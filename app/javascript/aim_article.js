document.addEventListener('DOMContentLoaded', () => {

// ローカルストレージから値を取得
  let theme = localStorage.getItem('theme');
  const stretch = localStorage.getItem('stretch');
  console.log("theme:"+theme)
  if(!theme){//値がセットされてない初期
    theme='light';
    setTheme(theme);
    localStorage.setItem('theme', theme);
  }

  if(theme=="dark"){$(".Logo-black").hide();$(".Logo-white").show();}else if(theme=="light"){$(".Logo-black").show();$(".Logo-white").hide();}


  //ダーク-ライトモードここから
  // 初期テーマの設定
  setTheme(theme);

  // テーマを切り替える関数
  function toggleTheme() {
    const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    if(newTheme=="dark"){$(".Logo-black").hide();$(".Logo-white").show();}else if(newTheme=="light"){$(".Logo-black").show();$(".Logo-white").hide();}

    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  }

  // テーマに応じてスタイルを設定する関数
  function setTheme(theme) {
    document.body.className = theme + '-mode';
  }
  //ダーク-ライトモードここまで

  //スマホ用のハンバーガーアイコンのクリックで再度メニュを開閉
document.querySelector('.mobile-menu-icon').addEventListener('click', function() {
  var leftMenu = $(".Left");
  if (leftMenu.css("display") === "none") {
    leftMenu.css("display", "block");
  } else {
    leftMenu.css("display", "none");
  }
});


$(function(){
	$(".Logo , .LogoTitle").click(function() {//セレクタorでどっちかにマッチ
		location.href="/";
	});
});


//こっからヘッダーの処理
$(function(){

// 要素を取得
const toggleArrow = document.getElementById("arrow");

const dropdownBtn_user_icon = document.getElementById("header-user-icon-btn");
const dropdownMenu_user_icon = document.getElementById("dropdown-user-icon");
// Toggle dropdown function
const toggleDropdown_user_icon = function () {
  dropdownMenu_user_icon.classList.toggle("show");
  //toggleArrow.classList.toggle("arrow");
};
// Toggle dropdown open/close when dropdown button is clicked
dropdownBtn_user_icon.addEventListener("click", function (e) {
  e.stopPropagation();
  toggleDropdown_user_icon();
  dropdownMenu_notifications.style.zIndex = -1;
  dropdownMenu_user_icon.style.zIndex = 10000;
});
// Close dropdown when dom element is clicked
document.documentElement.addEventListener("click", function () {
  if (dropdownMenu_user_icon.classList.contains("show")) {
    toggleDropdown_user_icon();

  }
});


const dropdownBtn_notifications = document.getElementById("notifications-button");
const dropdownMenu_notifications = document.getElementById("dropdown-notifications");
// Toggle dropdown function
const toggleDropdown_notifications = function () {
  dropdownMenu_notifications.classList.toggle("show");
  //toggleArrow.classList.toggle("arrow");
};
// Toggle dropdown open/close when dropdown button is clicked
dropdownBtn_notifications.addEventListener("click", function (e) {
  e.stopPropagation();
  toggleDropdown_notifications();
  dropdownMenu_user_icon.style.zIndex = -1;
  dropdownMenu_notifications.style.zIndex = 10000;

  javascript:notification_check_form.submit()//通知を既読にする
  document.querySelector('.badge').style.display = 'none';//通知バッジを非表示
  

});
// Close dropdown when dom element is clicked
document.documentElement.addEventListener("click", function () {
  if (dropdownMenu_notifications.classList.contains("show")) {
    toggleDropdown_notifications();
  }
});

});

/*
//ログアウト
const logout_btn = document.getElementById("logout-btn");
logout_btn.addEventListener("click", function (e) {
  fetch('/logout', {
    method: 'POST', 
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then((data) => {
    console.log('Success:', data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
});
*/

})