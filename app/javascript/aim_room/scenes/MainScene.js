import Phaser from 'phaser'
import CristalAmountButton from '../components/CristalAmountButton.js';
import ModalWindow from '../components/ModalWindow'
import Music from '../components/Music.js';
import LoginoutButton from '../components/LoginoutButton.js';
import ItemListModalWindow from '../components/ItemListModalWindow.js'


export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene')

   this.isLoggedIn = false;
  }
  init() {
    //素材のアセットコンパイルでのフィンガープリント付きのパスを取得
    const gameElement = document.querySelector('[data-react-class="AimRoom"]');
    this.props = JSON.parse(gameElement.getAttribute('data-react-props'));

    //ログイン判定
    this.loginPlugin = this.plugins.get('LoginPlugin');
    this.loginPlugin.checkLoginStatus().then(isLoggedIn => {
      this.isLoggedIn=isLoggedIn
    });

  }
  preload() {
    this.load.image('background', this.props.back);
    this.load.image('desk', this.props.desk);
    this.load.spritesheet('character', this.props.chara, { frameWidth: 341, frameHeight: 341 });
    this.load.audio('music01', this.props.music1);
    this.load.audio('music02', this.props.music2);

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
    this.bagButton.on('pointerdown', () => {
        if (this.isLoggedIn) {// ログイン済みの場合の処理
          fetch('/getMyItem', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
            },
            body: JSON.stringify({
              user_id: 1
            })
          })
          .then(response => response.json())
          .then(data => {
              console.log("data:"+data.myitems);
              const numberString = data.myitems;
              const itemData=data.itemData;
              console.log(`itemData ：${itemData}`);
              const my_items=[];
              numberString.forEach(id => {
                const item = itemData.find(item => item.id === id);
                if (item) {
                  my_items.push({ id: item.id, name: item.name, description: item.description, quantity: item.max_quantity, path: item.path, type: item.type});
                  console.log(`ID: ${item.id}, Name: ${item.name}, Type: ${item.type}, Description: ${item.description}, Rarity: ${item.rarity}, Max Quantity: ${item.max_quantity}, path: ${item.path}`);
                }
              });
              //this.modal = new ItemListModalWindow(this, window.innerWidth/2, window.innerHeight/2, window.innerWidth*0.6, window.innerHeight*0.6, '保有アイテム',my_items,this.updateEnvironment.bind(this))
              this.modal = new ItemListModalWindow(this, window.innerWidth/2, window.innerHeight/2, window.innerWidth*0.6, window.innerHeight*0.6, '保有アイテム',my_items,console.log("a"))
              this.modal.open()
          })
          .catch(error => console.error('Error:', error));
        } else {// 未ログインの場合の処理
          this.modal = new ModalWindow(this, window.innerWidth / 2, window.innerHeight / 2, 400, 300, 'ログインしてください。\n会員限定でのサービスとなります。')
          this.modal.open()
        }
    });
    this.bagButton.on('pointerover', () => {
      this.input.setDefaultCursor('pointer')
      this.bagButton.setTint(0x44ff44);  // ホバー時に緑色にティント
    })
    this.bagButton.on('pointerout', () => {
      this.input.setDefaultCursor('default')
      this.bagButton.clearTint();  // ホバーが外れたらティントをクリア
    });

    //this.LoginoutButton = new LoginoutButton(this, window.innerWidth*0.2, 0, this.isLoggedIn);
    //this.menuContainer.add(this.LoginoutButton);

    this.mission_button = this.add.image(window.innerWidth*0.75, 50, 'mission_icon').setInteractive().setScale(0.2);
    this.menuContainer.add(this.mission_button);
    this.mission_button.on('pointerdown', () => {
        if (this.isLoggedIn) {// ログイン済みの場合の処理
          this.scene.start('MissionScene'); // TestSceneに遷移
        } else {// 未ログインの場合の処理
          this.modal = new ModalWindow(this, window.innerWidth / 2, window.innerHeight / 2, 400, 300, 'ログインしてください。\n会員限定でのサービスとなります。')
          this.modal.open()
        }
    });      
    this.mission_button.on('pointerover', () => {// ボタンのホバーエフェクト
      this.input.setDefaultCursor('pointer')
      this.mission_button.setTint(0x44ff44);  // ホバー時に緑色にティント
    });
    this.mission_button.on('pointerout', () => {
      this.input.setDefaultCursor('default')
      this.mission_button.clearTint();  // ホバーが外れたらティントをクリア
    });

    this.gacha_button = this.add.image(window.innerWidth*0.8, 50, 'gacha_icon').setInteractive().setScale(0.05);
    this.menuContainer.add(this.gacha_button);
    this.gacha_button.on('pointerdown', () => {
        console.log('ガチャボタンがクリックされました');
        if (this.isLoggedIn) {// ログイン済みの場合の処理
          this.scene.start('GachaScene');
        } else {// 未ログインの場合の処理
          this.modal = new ModalWindow(this, window.innerWidth / 2, window.innerHeight / 2, 400, 300, 'ログインしてください。\n会員限定でのサービスとなります。')
          this.modal.open()
        }
    });      
    this.gacha_button.on('pointerover', () => {// ボタンのホバーエフェクト
      this.input.setDefaultCursor('pointer')
      this.gacha_button.setTint(0x44ff44);  // ホバー時に緑色にティント
    });
    this.gacha_button.on('pointerout', () => {
      this.input.setDefaultCursor('default')
      this.gacha_button.clearTint();  // ホバーが外れたらティントをクリア
    });

    this.CristalAmountButton = new CristalAmountButton(this, window.innerWidth*0.9, 50, this.isLoggedIn); 
    this.menuContainer.add(this.CristalAmountButton); 

    const music=[
      {"name": "静けき音楽","path": "music01"},
      {"name": "シャイニングスター","path": "music02"}
    ];
    const musicNames = [];
    const musicPaths = [];
    music.forEach(music => {
      console.log(`Name: ${music.name}, Path: ${music.path}`);
      musicNames.push(music.name);
      musicPaths.push(music.path);
      //this.load.audio(`${music.path}`, `assets/images/item/${music.path}.mp3`);
    }); 

    this.music = new Music(this, 0, 0,musicPaths,musicNames);
    this.menuContainer.add(this.music);

    //自動リサイズ 
    this.scale.on('resize', this.resize, this);// リサイズイベントのリスナーを追加 
    this.resize.call(this, this.scale.gameSize);// 初期配置 
  }

  resize(gameSize) { 
    // キャンバスのサイズを取得 
    const width = gameSize.width; 
    const height = gameSize.height; 
    //this.menuContainer.setPosition(0, window.innerHeight-100); 
    this.bagButton.setPosition(window.innerWidth*0.7, 50); 
    this.mission_button.setPosition(window.innerWidth*0.75, 50); 
    this.gacha_button.setPosition(window.innerWidth*0.8, 50); 
    this.CristalAmountButton.setPosition(window.innerWidth*0.9, 50);  
  } 
}