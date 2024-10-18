import Phaser from 'phaser'
/*import CristalAmountButton from '../components/CristalAmountButton.js';
import ModalWindow from '../components/ModalWindow'
import Header from '../components/Header.js';
import ButtonText from '../components/ButtonText.js';
*/

//import LoginPlugin from '../components/LoginPlugin';


export default class GachaScene extends Phaser.Scene {

  constructor() {
    super('GachaScene');
    this.isLoggedIn=false;
  }

  preload() {
    this.load.image('gacha_backgroud', 'assets/images/Gacha/backgroud.png');
    this.load.image('gacha_thumbnail1', 'assets/images/Gacha/gacha_thumbnail1.png');
    this.load.image('gacha_thumbnail2', 'assets/images/Gacha/gacha_thumbnail2.png');
    this.load.image('get_icon', 'assets/images/Gacha/get.png');
    this.load.image('getModal1', 'assets/images/Gacha/getModal1.jpeg');
    this.load.image('getModal2', 'assets/images/Gacha/getModal2.jpeg');
    this.load.image('getModal3', 'assets/images/Gacha/getModal3.jpg');

    this.load.spritesheet('box', 'assets/images/Gacha/gachaAnime612x612.png', { frameWidth: 204, frameHeight: 204 });
    this.load.spritesheet('sweet', 'assets/images/Gacha/pipo-sweetseffect001_480.png', { frameWidth: 480, frameHeight: 480 });
    this.load.spritesheet('pipofm', 'assets/images/Gacha/pipofm-topen03_480.png', { frameWidth: 480, frameHeight: 480 });

      //this.load.image('sky', 'assets/sky.png');
      //this.load.image('button', 'assets/sky.png');
      //this.load.spritesheet('gachaAnimation', '/assets/gacha_animation.png', { frameWidth: 200, frameHeight: 200 })
      //this.load.spritesheet('gachaAnimation', 'assets/images/Chara/SpriteSheet/image_fx_.png', { frameWidth: 200, frameHeight: 200 })

 }

 init() {
  /*
    this.loginPlugin = this.plugins.get('LoginPlugin');
    this.loginPlugin.checkLoginStatus().then(isLoggedIn => {
      this.isLoggedIn=isLoggedIn
      if (this.isLoggedIn) {
        console.log('ログイン成功ぉ');
        // ログイン後の処理
      } else {
        console.log('ログインしていませんぉ');
        // 未ログイン時の処理
      }
    });
  */
  }
    

  create() {
    
    
    const backgroud = this.add.image(window.innerWidth/2,window.innerHeight/2,'gacha_backgroud');
    backgroud.setScale(2);
    backgroud.setScale(1.5);

    ////this.Header = new Header(this, 'ガチャ',this.loginPlugin);

    const gachasContainer = this.add.container(50, 50);
  const gacha_data=[
    {id: 1, name: 'ノーマルガチャ', description: '基本的なパックです。',cristalCost: 100},
    {id: 2, name: 'レアガチャ', description: 'レアなパックです。',cristalCost: 150},
  ];
  gacha_data.forEach((gacha, i) => {
    //const x = 500 + i * 550;
    const x = 50 + i * 350;
    const y = 400;

    //const gachaContainer = this.add.container(x, y);// Create a container for the button
    const gachaContainer = this.add.container(x, 50);// Create a container for the button
    gachasContainer.add(gachaContainer);

    //const gachaBackground = this.add.rectangle(0, 0, 400, 450, 0x4a4a4a);
    const gachaBackground = this.add.rectangle(0, 0, window.innerWidth*0.2, window.innerHeight*0.55, 0x4a4a4a);
    gachaBackground.setInteractive({ useHandCursor: true });
    gachaBackground.setOrigin(0, 0);//オブジェクトの中心がcontainerに入るので、原点を画像の左上に変更
    gachaContainer.add(gachaBackground);
    

    const gacha_thumbnail = this.add.image(0, 0, 'gacha_thumbnail'+gacha.id);
    //acha_thumbnail.setDisplaySize(400, 350);// 画像の幅と高さを指定
    gacha_thumbnail.setDisplaySize(window.innerWidth*0.2, window.innerHeight*0.2);// 画像の幅と高さを指定
    gacha_thumbnail.setOrigin(0, 0);//オブジェクトの中心がcontainerに入るので、原点を画像の左上に変更
    gacha_thumbnail.setInteractive();
    gachaContainer.add(gacha_thumbnail);

    //this.gachaButton = this.add.text(0, 250, 'ガチャを引く', {
    //const gachaButton = this.add.text(0, window.innerHeight*0.3, 'ガチャを引く', {fontSize: '24px',color: '#ffffff',backgroundColor: '#ff0000',padding: { x: 20, y: 10 }}).setOrigin(0.5).setInteractive({ useHandCursor: true })
    const gachaButton = this.add.text(0, window.innerHeight*0.3, 'ガチャを引く', {fontSize: '32px',color: '#ffffff',backgroundColor: '#ff0000',padding: { x: 20, y: 10 }}).setOrigin(0,0).setInteractive({ useHandCursor: true })
    //.on('pointerdown', () => this.startGacha(gachaButton,gacha.id))
    .on('pointerdown', () => this.confirmGacha(gachaButton,gacha))
    gachaContainer.add(gachaButton);
    //gachaContainer.add(this.gachaButton);
  });
    
    
    

    this.resultText = this.add.text(400, 300, '', {
      fontSize: '36px',
      color: '#ffffff'
    }).setOrigin(0.5)

    //this.gachaAnimation = this.add.sprite(400, 300, 'gachaAnimation').setVisible(false).setDisplaySize(1000, 800);
    /*this.gachaAnimation = this.add.sprite(window.innerWidth / 2, window.innerHeight / 2, 'gachaAnimation').setVisible(false).setDisplaySize(window.innerWidth / 2, window.innerHeight / 2);
    this.anims.create({
      key: 'spin',
      frames: this.anims.generateFrameNumbers('gachaAnimation', { start: 0, end: 4 }),
      frameRate: 10,
      repeat: 2
    })*/
      this.anims.create({
        key: 'open',
        frames: this.anims.generateFrameNumbers('box', { start: 0, end: 5 }),
        frameRate: 5,
        repeat: 2
    });
    this.anims.create({
        key: 'ame',
        frames: this.anims.generateFrameNumbers('sweet', { start: 0, end: 13 }),
        frameRate: 60,
        repeat: 15
    });
    this.anims.create({
        key: 'bomb',
        frames: this.anims.generateFrameNumbers('pipofm', { start: 0, end: 17 }),
        frameRate: 10,
        repeat: 3
    });

    this.sweet = this.add.sprite(400, 300, 'sweet').setVisible(false).setDisplaySize(1000, 800);;
    this.box = this.add.sprite(400, 300, 'box').setVisible(false).setDisplaySize(1000, 800);;
    this.pipofm = this.add.sprite(400, 300, 'pipofm').setVisible(false).setDisplaySize(1000, 800);;

    this.sweet.setScale(1.5);  // スプライトを1.5倍に拡大
    this.box.setScale(1.5);  // スプライトを1.5倍に拡大
    this.pipofm.setScale(1.5);  // スプライトを1.5倍に拡大
  }

  confirmGacha(btn,gacha) {
    
    
    const modalWidth = 400;
    const modalHeight = 300;
    const modalX = (this.sys.game.config.width - modalWidth) / 2;
    const modalY = (this.sys.game.config.height - modalHeight) / 2;

    const width = window.innerWidth/2
    const height = window.innerHeight/2

    

    const gachaConfirmModalContainer = this.add.container(width, height);// Create a container for the button

    // 半透明の黒いオーバーレイを作成
    this.overlay = this.add.rectangle(0, 0, this.sys.game.config.width, this.sys.game.config.height, 0x000000, 0.7);
    //this.overlay.setOrigin(0);
    gachaConfirmModalContainer.add(this.overlay)

    // モーダルウィンドウの本体
    //this.window = this.add.rectangle(0, 0, width - 40, height - 40, 0xffffff)
    //gachaConfirmModalContainer.add(this.window)

    // 背景（半透明の黒）
    //this.background = this.add.rectangle(0, 0, width, height, 0x000000, 0.7)
    //gachaConfirmModalContainer.add(this.background)
    //this.background = this.add.image(width, height, 'getModal2');
    //this.background.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
    //gachaConfirmModalContainer.add(this.background)
    //this.modalBg = this.add.image(modalX, modalY, 'getModal2');
    this.modalBg = this.add.image(0, 0, 'getModal2');
    //this.modalBg.setOrigin(0);
    //this.modalBg.setDisplaySize(modalWidth, modalHeight);
    this.modalBg.setDisplaySize(width*2, height*1.5);
    gachaConfirmModalContainer.add(this.modalBg)

    const gacha_thumbnail = this.add.image(-400, 0, 'gacha_thumbnail'+gacha.id);
    gacha_thumbnail.setDisplaySize(400, 350);// 画像の幅と高さを指定
    gacha_thumbnail.setInteractive();
    gachaConfirmModalContainer.add(gacha_thumbnail)

    this.name = this.add.text(100, -150, gacha.name, {fontSize: '48px',fill: '#f8f8ff',align: 'center',wordWrap: { width: width - 80 }}).setOrigin(0.5)
    gachaConfirmModalContainer.add(this.name)

    this.description = this.add.text(100, 50, gacha.description, {fontSize: '24px',fill: '#f8f8ff',align: 'center', wordWrap: { width: width - 80 }}).setOrigin(0.5)
    gachaConfirmModalContainer.add(this.description)

    // コンテンツテキスト
    /*this.content = this.add.text(0, -20, item.name, {
      fontSize: '24px',
      fill: '#000000',
      align: 'center',
      wordWrap: { width: width - 80 }
    }).setOrigin(0.5)
    this.add(this.content)*/

    const gachaButton = this.add.text(0, 250, 'ガチャを引く', {
      fontSize: '32px',
      color: '#ffffff',
      backgroundColor: '#ff0000',
      padding: { x: 20, y: 10 }
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true })
    .on('pointerdown', () => this.startGacha(gachaButton,gacha.id,gachaConfirmModalContainer))
    gachaConfirmModalContainer.add(gachaButton)

    // 閉じるボタン
    //this.closeButton = new ButtonText(this, width / 2 - 60, height / 2 - 60, '閉じる', () => {this.close()});
    //this.closeButton = this.add.text(width / 2 - 60, height / 2 - 60, '閉じる', {fontSize: '20px',fill: '#000000',backgroundColor: '#cccccc',padding: { x: 10, y: 5 }}).setOrigin(0.5).setInteractive()
    //this.closeButton = this.add.text(width / 2 - 60, height / 2 - 60, '閉じる', {fontSize: '20px',fill: '#000000',backgroundColor: '#cccccc',padding: { x: 10, y: 5 }}).setOrigin(0.5).setInteractive()
    //this.closeButton = new ButtonText(this, 100, 0, '閉じる', () => { this.close(gachaConfirmModalContainer) });
    this.closeButton = this.add.image(window.innerWidth*0.4 , 70, 'close').setDisplaySize(50, 50).setInteractive({ useHandCursor: true });
    //this.closeButton.on('pointerdown', this.close, gachaConfirmModalContainer);// 閉じるボタンのイベントリスナー
    this.closeButton.on('pointerdown', () => { this.close(gachaConfirmModalContainer)  });// 閉じるボタンのイベントリスナー
    //this.closeButton.setOrigin(0.5)
    gachaConfirmModalContainer.add(this.closeButton)
    //this.closeButton.on('pointerdown', this.close, gachaConfirmModalContainer)
  }

  startGacha(btn,gacha_id,gachaConfirmModalContainer) {
    console.log(gacha_id)

    gachaConfirmModalContainer.setVisible(false)
    //this.gachaButton.disableInteractive()
    btn.disableInteractive(); // 引数として渡されたボタンを無効化
    this.resultText.setText('')
    //this.gachaAnimation.setVisible(true).play('spin')
    this.sweet.setVisible(true).play('ame'); // 初期アニメーションを設定
    this.box.setVisible(true).play('open');
    //this.pipofm.setVisible(true).play('bomb')

    let animAComplete = false
    let animBComplete = false
    let animCComplete = false

    this.sweet.on('animationcomplete', () => {
      animAComplete = true
      checkBothComplete(this)
    })

    this.box.on('animationcomplete', () => {
      animBComplete = true
      checkBothComplete(this)
    })

    function checkBothComplete(a) {
      if (animAComplete && animBComplete) {
        // Start animation C when both A and B are complete
        //this.pipofm.setVisible(true).play('bomb')
        a.pipofm.setVisible(true).play('bomb')
      }
    }
    this.pipofm.on('animationcomplete', () => {
      this.sweet.setVisible(false)
      this.box.setVisible(false)
      this.pipofm.setVisible(false)
      
      fetch('/gacha', { 
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content 
        },
        body: JSON.stringify({
          gacha_id: gacha_id
        })
      })
        .then(response => response.json())
        .then(data => {
          this.time.delayedCall(1500, () => {
            console.log(data.item.name);
            //this.gachaAnimation.setVisible(false)

            this.updateCristal();

            this.getItemModal(data.item);

            //this.modal = new ModalWindow(this, window.innerWidth / 2, window.innerHeight / 2, window.innerWidth / 2, window.innerHeight / 2, `ゲットしたアイテム: ${data.item.name}!`)
            //this.modal.open()

            //this.resultText.setText(`ゲットしたアイテム: ${data.item.name}!`)
            btn.setInteractive()
          })
        })
  })
    
  }

  updateCristal(){
    fetch('/check_crystal_amount', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
      },
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      this.registry.set('cristal_amount', data.cristal_amount);
      this.cristal_amount = data.cristal_amount
      ////this.CristalAmountButton = new CristalAmountButton(this, 800, 50, this.cristal_amount, this.isLoggedIn);

      //this.scene.restart()  // シーンを再起動してログイン状態を反映
    })
    .catch(error => console.error('Error:', error))
  }

  getItemModal(item){
    //this.width = window.innerWidth
    //this.height = window.innerHeight
    const width = window.innerWidth/2
    const height = window.innerHeight/2

    const gachaGetModalContainer = this.add.container(width, height);// Create a container for the button

    // 半透明の黒いオーバーレイを作成
    this.overlay = this.add.rectangle(0, 0, this.sys.game.config.width, this.sys.game.config.height, 0x000000, 0.7);
    //this.overlay.setOrigin(0);
    gachaGetModalContainer.add(this.overlay)

    // 背景（半透明の黒）
    //this.background = this.add.rectangle(0, 0, width, height, 0x000000, 0.7)
    //this.background = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'back');
    //this.background.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
    //this.background = this.add.image(width, height / 2, 'getModal1');
    //this.background.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
    //gachaGetModalContainer.add(this.background)
    this.modalBg = this.add.image(0, 0, 'getModal3');
    this.modalBg.setDisplaySize(width*2, height*1.5);
    gachaGetModalContainer.add(this.modalBg)

    // モーダルウィンドウの本体
    //this.window = this.add.rectangle(0, 0, width - 40, height - 40, 0xffffff)
    //gachaGetModalContainer.add(this.window)

    const getIcon = this.add.image(350, -230, 'get_icon');
    getIcon.setDisplaySize(200, 200);// 画像の幅と高さを指定
    gachaGetModalContainer.add(getIcon)

    // コンテンツテキスト
    this.name = this.add.text(100, -150, item.name, {fontSize: '48px',fill: '#000000',align: 'center',wordWrap: { width: width - 80 }}).setOrigin(0.5)
    gachaGetModalContainer.add(this.name)

    this.description = this.add.text(100, 50, item.description, {fontSize: '24px',fill: '#000000',align: 'center', wordWrap: { width: width - 80 }}).setOrigin(0.5)
    gachaGetModalContainer.add(this.description)

  
      let loader = new Phaser.Loader.LoaderPlugin(this);// 新しいローダーを作成
      loader.image('myitem'+item.id, 'assets/images/item/'+item.path+'.png');// 画像を読み込む
      let item_img =null;
      loader.once('complete', () => {// 読み込み完了後に画像を表示
        item_img = this.add.image(-500, -100, 'myitem'+item.id);
        //item_img.setScale(0.5);
        item_img.setDisplaySize(700, 550);// 画像の幅と高さを指定
        item_img.setInteractive();
        gachaGetModalContainer.add(item_img)
        //this.add(item_img)
        //itemContainer.add(item_img);
      });
      loader.start();// 読み込みを開始
      


    // 閉じるボタン
    ////this.closeButton = new ButtonText(this, 100, 0, '閉じる', () => { this.close(gachaGetModalContainer) });
    gachaGetModalContainer.add(this.closeButton)
  }

  close(container) {
    container.setVisible(false)
  }
}
