import Phaser from 'phaser';
import ButtonText from './ButtonText.js';

export default class CreateAccountButton extends Phaser.GameObjects.Container {
  constructor(scene, x, y, isLoggedIn) {
      super(scene, x, y);
      //this.createAccountButton = new ButtonText(scene, x, y+15, 'アカウント作成', () => {this.handleCreateAccount()});
      this.createAccountButton = new ButtonText(scene, x, y, 'アカウント作成', () => {this.handleCreateAccount()});
      this.add(this.createAccountButton);
      scene.add.existing(this);
  }
  handleCreateAccount(){
        window.location.href = "users/sign_up";
  }
}