import Phaser from 'phaser'
//import ModalWindow from './ModalWindow'

export default class CristalAmountButton extends Phaser.GameObjects.Container {
  constructor(scene, x, y, isLoggedIn) {
      super(scene, x, y);
      this.scene = scene;
      this.cristalAmount = 0;
      this.isLoggedIn = isLoggedIn;

      this.checkCristalAmount();
      scene.add.existing(this);
  }

  checkCristalAmount() {
/*    fetch('/check_crystal_amount', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
      },
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      //this.registry.set('cristal_amount', data.cristal_amount);
      this.cristalAmount = data.cristal_amount
      this.createButton();
      //this.scene.restart()  // シーンを再起動してログイン状態を反映
    })
    .catch(error => console.error('Error:', error))
    */
    this.cristalAmount = 100
    this.createButton();
  }
  createButton() {
      this.buttonBackground = this.scene.add.rectangle(0, 0, window.innerWidth/8, 50, 0x4a4a4a);
      this.add(this.buttonBackground);

      // Add the money image to the button
      this.chargeImage = this.scene.add.image(-50, 0, 'money');
      //this.chargeImage.setScale(0.1);
      this.chargeImage.setScale(0.07);
      this.add(this.chargeImage);

      // Add the currency text
      //this.buttonText = this.scene.add.text(20, 0, `${this.cristalAmount}`, {fontSize: '32px',fontFamily: 'Arial',color: '#ffffff' }).setOrigin(0, 0.5);
      this.buttonText = this.scene.add.text(20, 0, `${this.cristalAmount}`, {fontSize: '15px',fontFamily: 'Arial',color: '#ffffff' }).setOrigin(0, 0.5);
      this.add(this.buttonText);

      // Create a hit area for the entire container
      //const hitArea = new Phaser.Geom.Rectangle(-150, -100, 300, 200);
      const hitArea = new Phaser.Geom.Rectangle(-window.innerWidth/8, -50, window.innerWidth/8, 50);
      this.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

      this.createEvents();
  }

  createEvents() {
      this.on('pointerdown', this.handleClick, this);
      this.on('pointerover', this.handlePointerOver, this);
      this.on('pointerout', this.handlePointerOut, this);
  }

  handleClick() {
      if (this.scene.isLoggedIn) {
          this.scene.scene.start('ChargeScene');
      } else {
          //this.modal = new ModalWindow(this.scene, window.innerWidth / 2, window.innerHeight / 2, 400, 300, 'ログインしてください。\n会員限定でのサービスとなります。');
          //this.modal.open();
      }
  }

  handlePointerOver() {
      this.scene.input.setDefaultCursor('pointer');
      this.buttonBackground.setScale(1.1);
  }

  handlePointerOut() {
      this.scene.input.setDefaultCursor('default');
      this.buttonBackground.setScale(1);
  }

  updateCristalAmount(amount) {
      this.cristalAmount = amount;
      this.buttonText.setText(`${this.cristalAmount}`);
  }
}