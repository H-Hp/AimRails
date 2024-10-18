import Phaser from 'phaser'
import CristalAmountButton from '../components/CristalAmountButton.js';

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene')
  }
  init() {
    // データ属性から値を読み取る
    const gameElement = document.querySelector('[data-react-class="AimRoom"]');
    this.props = JSON.parse(gameElement.getAttribute('data-react-props'));

  }
  preload() {
    this.load.image('background', this.props.back);
    this.load.image('desk', this.props.desk);
    this.load.spritesheet('character', this.props.chara, { frameWidth: 341, frameHeight: 341 });
    this.load.image('shop_icon', this.props.shop_icon);
    this.load.image('bag_icon', this.props.bag_icon);
    this.load.image('gacha_icon', this.props.gacha_icon);
    this.load.image('mission_icon', this.props.mission_icon);
    this.load.image('money', this.props.money_icon);

    this.load.image('playButton', this.props.play_button);
    this.load.image('pauseButton', this.props.pause_button);
    this.load.image('nextButton', this.props.next_button);
    this.load.image('prevButton', this.props.prev_button);

  }
  create() {
    this.background = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'background');

    this.desk = this.add.image(window.innerWidth/2,window.innerHeight/2+500,'desk');
    this.desk.setScale(2.3);// 画像のサイズを2倍にする

    this.anims.create({
      key: 'study',
      frames: this.anims.generateFrameNumbers('character', { start: 0, end: 8 }),
      frameRate: 1,
      repeat: -1
    });

    // キャラクターのスプライトを作成し、アニメーションを再生
    this.character = this.add.sprite(window.innerWidth/2,window.innerHeight/2, 'character');
    this.character.setScale(2.3);// 画像のサイズを2倍にする
    this.character.play('study'); // 初期アニメーションを設定

    this.menuContainer = this.add.container(0, window.innerHeight - 100);
    this.under = this.add.rectangle(0, 0, window.innerWidth,100, 0x000200, 1);
    this.under.setOrigin(0, 0);
    this.menuContainer.add(this.under);

    this.bagButton = this.add.image(window.innerWidth*0.7, 50, 'bag_icon').setScale(0.2).setInteractive();
    this.menuContainer.add(this.bagButton);

    this.mission_button = this.add.image(window.innerWidth*0.75, 50, 'mission_icon').setInteractive().setScale(0.2);
    this.menuContainer.add(this.mission_button);

    this.gacha_button = this.add.image(window.innerWidth*0.8, 50, 'gacha_icon').setInteractive().setScale(0.05);
    this.menuContainer.add(this.gacha_button);

    this.CristalAmountButton = new CristalAmountButton(this, window.innerWidth*0.9, 50, this.isLoggedIn); 
    this.menuContainer.add(this.CristalAmountButton); 
  }


}