import Phaser from 'phaser';
import ButtonText from './ButtonText.js';

export default class LogoutButton extends Phaser.GameObjects.Container {

  constructor(scene, x, y, isLoggedIn) {
      super(scene, x, y);
      this.logoutButton = new ButtonText(scene, x, y, 'ログアウト', () => {
          this.handleLogout();
      });
      this.add(this.logoutButton);
      scene.add.existing(this);
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