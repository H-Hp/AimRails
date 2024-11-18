import Phaser from 'phaser'
import MainScene from './MainScene.js'
import CristalAmountButton from '../components/CristalAmountButton.js';
import Header from '../components/Header.js';
import ButtonText from '../components/ButtonText.js';


export default class ChargeScene extends Phaser.Scene {
  constructor() {
    super('ChargeScene');
    this.isLoggedIn=false;
    this.items = null;
    this.scrollBar = null;
    this.isDragging = false;
    this.startX = 0;
    this.modal = null;
  }

  init() {
    //素材のアセットコンパイルでのフィンガープリント付きのパスを取得
    const gameElement = document.querySelector('[data-react-class="AimRoom"]');
    this.props = JSON.parse(gameElement.getAttribute('data-react-props'));
    
    this.loginPlugin = this.plugins.get('LoginPlugin');
    this.loginPlugin.checkLoginStatus().then(isLoggedIn => {
      this.isLoggedIn=isLoggedIn
    });
  }

  preload() {
    this.load.image('gacha_backgroud', this.props.gacha_backgroud);
    this.load.image('other_backgroud', this.props.other_backgroud);
    this.load.image('getModal1', this.props.getModal1);
    this.load.image('getModal2', this.props.getModal2);
    this.load.image('getModal3', this.props.getModal3);

    this.load.image('charge_item1', this.props.charge_item1);
    this.load.image('charge_item2', this.props.charge_item2);
    this.load.image('charge_item3', this.props.charge_item3);
    this.load.image('charge_item4', this.props.charge_item4);
  }

  create() {

    //const background = this.add.image(0, 0, 'gacha_backgroud').setOrigin(0, 0);
    const background = this.add.image(window.innerWidth/2, window.innerHeight/2, 'other_backgroud')
    background.setDisplaySize(window.innerWidth, window.innerHeight);
    //background.setDisplaySize(1600, 1200);
    //background.setScale(3)

    //クリスタル所持数を取得
    this.Header = new Header(this, 'クリスタル購入',this.loginPlugin);
    this.items = this.add.group();

    const itemData = [
      { id: 1, name: 'クリスタルパック 100', description: '基本的なパックです。', price: '¥120', image: 'item1' , url: 'https://buy.stripe.com/test_00gdRK8c92ib1EYcMM'},
      { id: 2, name: 'クリスタルパック 300', description: '基本的なパックです。', price: '¥360', image: 'item2' , url: 'https://buy.stripe.com/test_6oE8xq8c9g913N64gh'},
      { id: 3, name: 'クリスタルパック 600', description: '基本的なパックです。', price: '¥720', image: 'item3' , url: 'https://buy.stripe.com/test_dR65leeAx3mfdnGdQS'},
      { id: 4, name: 'クリスタルパック 1200', description: '基本的なパックです。', price: '¥1440', image: 'item4' , url: 'https://buy.stripe.com/test_fZefZSbol3mf83mfZ1'}
    ];

    const item_width = window.innerWidth * 0.20;
    const item_height=window.innerWidth*0.30
    const spacing = item_width + 50; // コンテナ間の間隔を設定
  
    itemData.forEach((item, i) => {
      //const x = 150 + i * 450;
      const x = i * spacing;
      const y = 150;

      const item_Container = this.add.container(x+50, y);// Create a container for the button

      //const item_Background = this.add.rectangle(0, 0, 200, 400, 0x4a4a4a);
      const item_Background = this.add.rectangle(0, 0, item_width, item_height, 0x000066);
      item_Background.setInteractive({ useHandCursor: true });
      item_Background.setStrokeStyle(5, 0xffffff);
      item_Background.setOrigin(0, 0);//オブジェクトの中心がcontainerに入るので、原点を画像の左上に変更
      item_Container.add(item_Background);

      //const nameText = this.add.text(x, y + 100, itemData[i].name, { fontSize: '16px', fill: '#fff' });
      const nameText = this.add.text(0,20, item.name, { fontSize: '16px', fill: '#fff',align: 'center',padding: { x: 20, y: 10 } });
      nameText.setOrigin(0,0);
      nameText.setFixedSize(item_width, 50)
      item_Container.add(nameText);

      const item_image = this.add.image(item_width/2, 100, 'charge_'+item.image).setOrigin(0,0).setScale(0.1);
      //const item_image2 = this.add.image(item_width/2+20, 120, 'charge_'+item.image).setOrigin(0,0).setScale(0.1);
      item_Container.add(item_image);
      //item_Container.add(item_image2);
            
      //const priceText = this.add.text(x, y + 130, itemData[i].price, { fontSize: '20px', fill: '#fff' });
      //const priceText = this.add.text(0, 160, item.price, { fontSize: '25px', fill: '#fff' });
      const priceText = this.add.text(item_width/2, 300, item.price, {fontSize: '16px',color: '#ccff00',backgroundColor: '#212121',align: 'center',padding: { x: 20, y: 20 }}).setOrigin(0, 0.5).setFixedSize(item_width/3, 50);
      //priceText.setOrigin(0,0);//goStripe(url) 
      item_Container.add(priceText);

      //const urlText = this.add.text(x, y + 130, itemData[i].price, { fontSize: '20px', fill: '#fff' });
      //urlText.setOrigin(0.5);
      
      this.items.add(item_Container);

      item_Background.on('pointerdown', () => {
        this.showModal(item)
        //this.goStripe(item.url)
      });
      item_Background.on('pointerover', () => {
        this.input.setDefaultCursor('pointer');
        item_Background.fillColor = 0x003366;
  
      });
      item_Background.on('pointerout', () => {
        this.input.setDefaultCursor('default');
        item_Background.fillColor = 0x000066;
      });
  
      
    });

    const termsButton = this.add.text(50, window.innerHeight-150, '利用規約', {fontSize: '20px',color: '#ffffff',backgroundColor: '#212121',padding: { x: 10, y: 10 }}).setOrigin(0.5).setInteractive({ useHandCursor: true })
    .on('pointerdown', () => this.showTerms(this))

    const announcementText = this.add.text(50, window.innerHeight-100, "クリスタルパックを選択したことにより、上記利用規約に同意したものとみなされます。\nクリスタルは購入手続き完了後に加算されます。クリスタルはこのアプリ内でのみご利用いただけます。", { fontSize: '18px', fill: '#fff' });

    this.input.on('pointerdown', this.startDrag, this);
    this.input.on('pointermove', this.doDrag, this);
    this.input.on('pointerup', this.stopDrag, this);

    

    // モーダルウィンドウの作成（初期状態は非表示）
    //this.createModal();

    //購入完了後
    /*const BuyedButton = this.add.text(50, 800, '購入処理後', {
        fontSize: '32px',
        fill: '#fff'
      }).setOrigin(0.5).setInteractive();
      BuyedButton.on('pointerdown', () => {
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
        });*/
  }

  showTerms(scene){
    //window.innerWidth / 2
    //const modal = scene.add.container(400, 300);
    const modal = scene.add.container(window.innerWidth / 2, window.innerHeight / 2);
    modal.setDepth(1000);

    const modalBg = scene.add.rectangle(0, 0, window.innerWidth, window.innerHeight*0.8, 0x000000, 0.8);
    const modalContent = scene.add.text(0, -180, 
        '利用規約\n\n' +
        '1. ゲーム内通貨の購入は、実際の金銭取引を伴います。\n\n' +
        '2. 購入したゲーム内通貨は、本ゲーム内でのみ使用可能です。\n\n' +
        '3. 一度購入したゲーム内通貨の返金は原則として行いません。\n\n' +
        '4. ゲーム内通貨の不正取得や不正使用は禁止されています。\n\n' +
        '5. 当社は、予告なくゲーム内通貨の価格や交換レートを変更する権利を有します。\n\n' +
        '6. ゲームアカウントの削除時、未使用のゲーム内通貨は失効します。\n\n' +
        '7. 未成年者がゲーム内通貨を購入する場合、保護者の同意が必要です。\n\n' +
        '8. 当社は、本規約を随時更新する権利を有します。更新後の継続使用をもって、新規約に同意したものとみなします。',
        { fontSize: '16px', fill: '#ffffff', align: 'left', wordWrap: { width: 780 } }
    );
    modalContent.setOrigin(0.5, 0);

    //this.closeButton = new ButtonText(scene, 280, 50, '閉じる', () => { modal.destroy() });
    const closeButton = new ButtonText(scene, 0, 100, '閉じる', () => { modal.destroy() });
    modal.add([modalBg, modalContent, closeButton]);
  }
    showModal(item) {
      const modalWidth = 400;
      const modalHeight = 300;
      const modalX = (this.sys.game.config.width - modalWidth) / 2;
      const modalY = (this.sys.game.config.height - modalHeight) / 2;
      const width = window.innerWidth/2
      const height = window.innerHeight/2

      const gachaConfirmModalContainer = this.add.container(width, height);// Create a container for the button

      // 半透明の黒いオーバーレイを作成
      this.overlay = this.add.rectangle(0, 0, this.sys.game.config.width, this.sys.game.config.height, 0x000000, 0.7);
      gachaConfirmModalContainer.add(this.overlay)

      // モーダルウィンドウの本体
      //this.window = this.add.rectangle(0, 0, width - 40, height - 40, 0xffffff)
      //gachaConfirmModalContainer.add(this.window)

      // 背景（半透明の黒）
      this.modalBg = this.add.image(0, 0, 'getModal2').setDisplaySize(width*2, height*1.5).setInteractive();
      gachaConfirmModalContainer.add(this.modalBg)

      //const gacha_thumbnail = this.add.image(-400, 0, 'gacha_thumbnail'+gacha.id);
      const gacha_thumbnail = this.add.image(-400, 0, 'charge_item'+item.id);
      gacha_thumbnail.setDisplaySize(400, 350);// 画像の幅と高さを指定
      //gacha_thumbnail.setInteractive();
      gachaConfirmModalContainer.add(gacha_thumbnail)

      this.name = this.add.text(100, -150, item.name, {fontSize: '48px',fill: '#f8f8ff',align: 'center',wordWrap: { width: width - 80 }}).setOrigin(0.5)
      gachaConfirmModalContainer.add(this.name)

      this.description = this.add.text(100, 50, item.description, {fontSize: '24px',fill: '#f8f8ff',align: 'center', wordWrap: { width: width - 80 }}).setOrigin(0.5)
      gachaConfirmModalContainer.add(this.description)

      //const gachaButton = this.add.text(0, 250, '購入する', {fontSize: '32px',color: '#ffffff',backgroundColor: '#ff0000',padding: { x: 20, y: 10 }}).setOrigin(0.5).setInteractive({ useHandCursor: true })
      const gachaButton = this.add.text(0, 250, item.price+'で購入する', {fontSize: '24px',color: '#ccff00',backgroundColor: '#212121',align: 'center',padding: { x: 20, y: 20 }}).setOrigin(0, 0.5).setFixedSize(300, 50);
      gachaButton.setInteractive();
      gachaButton.on('pointerdown', () => {this.goStripe(item.url)});
      gachaButton.on('pointerover', () => {this.input.setDefaultCursor('pointer');gachaButton.setTint(0xfdd35c);});
      gachaButton.on('pointerout', () => {this.input.setDefaultCursor('default');gachaButton.setTint(0xccff00);});
      //gachaButton.on('pointerover', () => {this.input.setDefaultCursor('pointer');gachaButton.fillColor = 0x003366;});
      //gachaButton.on('pointerout', () => {this.input.setDefaultCursor('default');gachaButton.fillColor = 0x000066;});
      gachaConfirmModalContainer.add(gachaButton)

      this.closeButton = this.add.image(window.innerWidth*0.4 , -height/2, 'close').setDisplaySize(50, 50).setInteractive({ useHandCursor: true }).setOrigin(0,0);
      this.closeButton.on('pointerdown', () => { this.closeModal(gachaConfirmModalContainer)  });// 閉じるボタンのイベントリスナー
      gachaConfirmModalContainer.add(this.closeButton)
    }
    closeModal(container) {
      container.setVisible(false);
    }

  buyItem() {
    const title = this.modal.getChildren()[1];
    console.log(`購入処理: ${title.text}`);

    console.log(`URL: ${this.currentItemURL}`);
    // ここに購入処理を実装
    this.closeModal();
    //window.location.href = 'https://buy.stripe.com/test_00gdRK8c92ib1EYcMM'; // 遷移先のURLを指定
    window.location.href = this.currentItemURL; // 遷移先のURLを指定

  }
  goStripe(url) {
    console.log(`URL: ${url}`);
    //window.location.href = 'https://buy.stripe.com/test_00gdRK8c92ib1EYcMM'; // 遷移先のURLを指定
    window.location.href = url; // 遷移先のURLを指定
  }

  startDrag(pointer) {
    this.isDragging = true;
    this.startX = pointer.x;
  }

  doDrag(pointer) {
    if (!this.isDragging) return;

    const diff = pointer.x - this.startX;
    this.items.getChildren().forEach(item => {
      item.x += diff;
    });

    this.startX = pointer.x;
  }

  stopDrag() {
    this.isDragging = false;
  }

  update() {
    if (!this.items || this.items.getChildren().length === 0) return;

    const leftmostItem = this.items.getChildren()[0];
    const rightmostItem = this.items.getChildren()[this.items.getChildren().length - 1];

    if (leftmostItem.x > 150) {
      const diff = leftmostItem.x - 150;
      this.items.getChildren().forEach(item => {
        item.x -= diff;
      });
    } else if (rightmostItem.x < 650) {
      const diff = 650 - rightmostItem.x;
      this.items.getChildren().forEach(item => {
        item.x += diff;
      });
    }
  }
}
//export default ChargeScene;