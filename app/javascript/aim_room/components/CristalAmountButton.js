import Phaser from 'phaser'
import ModalWindow from './ModalWindow'

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
    fetch('/check_crystal_amount', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
      },
    })
    .then(response => response.json())
    .then(data => {
      //console.log(data);
      this.cristalAmount = data.cristal_amount

      this.buttonBackground = this.scene.add.rectangle(0, 0, window.innerWidth/8, 50, 0x4a4a4a);
      this.chargeImage = this.scene.add.image(-50, 0, 'money').setScale(0.05);
      this.buttonText = this.scene.add.text(20, 0, `${this.cristalAmount}`, {fontSize: '15px',fontFamily: 'Arial',color: '#ffffff' }).setOrigin(0, 0.5);

      const container = this.scene.add.container(0, 0, [ this.buttonBackground, this.buttonText,this.chargeImage ]);
      this.add(container);
      this.buttonBackground.setInteractive();
  
      this.buttonBackground.on('pointerdown', () => {
        if (this.scene.isLoggedIn) {
          this.scene.scene.start('ChargeScene');
        } else {
            this.modal = new ModalWindow(this.scene, window.innerWidth / 2, window.innerHeight / 2, 400, 300, 'ログインしてください。\n会員限定でのサービスとなります。');
            this.modal.open();
        }
      });
      this.buttonBackground.on('pointerover', () => {
        this.scene.input.setDefaultCursor('pointer');
        this.buttonBackground.fillColor = 0x6c757d;
      });
      this.buttonBackground.on('pointerout', () => {
        this.scene.input.setDefaultCursor('default');
        this.buttonBackground.fillColor = 0x4a4a4a;
      });
    })
    .catch(error => console.error('Error:', error))
  }

  updateCristalAmount(amount) {
      this.cristalAmount = amount;
      this.buttonText.setText(`${this.cristalAmount}`);
  }
}