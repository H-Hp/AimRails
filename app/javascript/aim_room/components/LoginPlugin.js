import Phaser from 'phaser'

export default class LoginPlugin extends Phaser.Plugins.BasePlugin {
  constructor(pluginManager) {
    super(pluginManager);
    this.isLoggedIn = null;
    this.lastCheckTime = 0;
    this.checkInterval = 60000; // 1分ごとにチェック
  }

  async checkLoginStatus() {
    const currentTime = Date.now();
    if (this.isLoggedIn !== null && currentTime - this.lastCheckTime < this.checkInterval) {
      return this.isLoggedIn;
    }

    try {
      const response = await fetch('/check_login_status', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        },
      });
      const data = await response.json();
      this.isLoggedIn = data.logged_in;
      this.lastCheckTime = currentTime;
      console.log(this.isLoggedIn ? 'ログイン中' : 'ログアウト中');
      return this.isLoggedIn;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  }
}