import Phaser from 'phaser';
import ButtonText from './ButtonText.js';

export default class LoginoutButton extends Phaser.GameObjects.Container {

  constructor(scene, x, y, isLoggedIn) {
      super(scene, x, y);

      console.log("LoginoutButtonのisLoggedIn="+isLoggedIn)
      if (isLoggedIn) {// ログイン済みの場合の処理
        //this.add(this.logoutButton);
        //const logoutButton = new ButtonText(scene, x, y, 'ログアウト', () => {
        this.logoutButton = new ButtonText(scene, x, y, 'ログアウト', () => {
            this.handleLogout();
        });
        this.add(this.logoutButton);
      } else {// 未ログインの場合の処理
        this.loginButton = new ButtonText(scene, x, y, 'ログイン', () => {this.handleLogin()});
        this.createAccountButton = new ButtonText(scene, x, y+15, 'アカウント作成', () => {this.handleLogin()});
  
        this.add(this.loginButton);
        this.add(this.createAccountButton);
      }
      
      scene.add.existing(this);

  }

  handleLogin(){
    // ログイン処理をここに追加
    console.log('ログインボタンがクリックされました');
    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
      },
      body: JSON.stringify({
        authentication: 'login'
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        location.reload();  // ページを再読み込み
      } else {
        console.error('Failed to update authentication');
      }
    })
    .catch(error => console.error('Error:', error));

  }
  handleLogout(){
    console.log('ログアウトボタンがクリックされました');
    fetch('/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
      },
      body: JSON.stringify({
        authentication: 'logout'
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        location.reload();  // ページを再読み込み
      } else {
        console.error('Failed to update authentication');
      }
    })
    .catch(error => console.error('Error:', error));
  }
}