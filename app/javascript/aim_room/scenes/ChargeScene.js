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
    this.load.image('getModal1', this.props.getModal1);
    this.load.image('getModal2', this.props.getModal2);
    this.load.image('getModal3', this.props.getModal3);

    this.load.image('charge_item1', this.props.money_icon);
    this.load.image('charge_item2', this.props.money_icon);
    this.load.image('charge_item3', this.props.money_icon);
    this.load.image('charge_item4', this.props.money_icon);
    this.load.image('charge_item5', this.props.money_icon);
    this.load.image('charge_item6', this.props.money_icon);


    /*this.load.image('gacha_backgroud', 'assets/images/Gacha/backgroud.png');
    this.load.image('charge_item1', 'assets/images/money/money.png');
    this.load.image('charge_item2', 'assets/images/money/money.png');
    this.load.image('charge_item3', 'assets/images/money/money.png');
    this.load.image('charge_item4', 'assets/images/money/money.png');
    this.load.image('charge_item5', 'assets/images/money/money.png');
    this.load.image('charge_item6', 'assets/images/money/money.png');

    this.load.image('getModal1', 'assets/images/Gacha/getModal1.jpeg');
    this.load.image('getModal2', 'assets/images/Gacha/getModal2.jpeg');
    this.load.image('getModal3', 'assets/images/Gacha/getModal3.jpg');*/
  }

  create() {

    const background = this.add.image(0, 0, 'gacha_backgroud').setOrigin(0, 0);
    //background.setDisplaySize(1600, 1200);
    background.setScale(3)

    //クリスタル所持数を取得
    this.Header = new Header(this, 'クリスタル購入',this.loginPlugin);
    this.items = this.add.group();

    /*const itemData = [
      { name: 'クリスタルパック 1,500', price: '¥1480', image: 'item1' , url: 'https://buy.stripe.com/test_00gdRK8c92ib1EYcMM'},
      { name: 'クリスタルパック 3,500', price: '¥3540', image: 'item2' , url: 'https://buy.stripe.com/test_00gdRK8c92ib1EYcMM'},
      { name: 'クリスタルパック 50', price: '¥130', image: 'item3' , url: 'https://buy.stripe.com/test_00gdRK8c92ib1EYcMM'},
      { name: 'クリスタルパック 110', price: '¥250', image: 'item4' , url: 'https://buy.stripe.com/test_00gdRK8c92ib1EYcMM'},
      { name: 'クリスタルパック 330', price: '¥730', image: 'item5' , url: 'https://buy.stripe.com/test_00gdRK8c92ib1EYcMM'},
      { name: 'クリスタルパック 680', price: '¥1480', image: 'item6' , url: 'https://buy.stripe.com/test_00gdRK8c92ib1EYcMM'}
    ];*/

    const itemData = [
      { id: 1, name: 'クリスタルパック 100', description: '基本的なパックです。', price: '¥120', image: 'item1' , url: 'https://buy.stripe.com/test_00gdRK8c92ib1EYcMM'},
      { id: 2, name: 'クリスタルパック 300', description: '基本的なパックです。', price: '¥360', image: 'item2' , url: 'https://buy.stripe.com/test_6oE8xq8c9g913N64gh'},
      { id: 3, name: 'クリスタルパック 600', description: '基本的なパックです。', price: '¥720', image: 'item3' , url: 'https://buy.stripe.com/test_dR65leeAx3mfdnGdQS'},
      { id: 4, name: 'クリスタルパック 1200', description: '基本的なパックです。', price: '¥1440', image: 'item4' , url: 'https://buy.stripe.com/test_fZefZSbol3mf83mfZ1'}
    ];


    itemData.forEach((item, i) => {
      const x = 150 + i * 450;
      const y = 400;

      const item_Container = this.add.container(x, y+150);// Create a container for the button

      //const item_Background = this.add.rectangle(0, 0, 200, 400, 0x4a4a4a);
      const item_Background = this.add.rectangle(0, 0, 350, 600, 0x4a4a4a);
      item_Background.setInteractive({ useHandCursor: true });
      //item_Background.on('pointerdown', () => this.showModal(item.name, item.price, item.url));
      item_Background.on('pointerdown', () => this.showModal(item));
      //item_Background.on('pointerdown', () => this.goStripe(item.url));
      item_Container.add(item_Background);

      //const nameText = this.add.text(x, y + 100, itemData[i].name, { fontSize: '16px', fill: '#fff' });
      const nameText = this.add.text(0, -130, item.name, { fontSize: '30px', fill: '#fff' });
      nameText.setOrigin(0.5);
      //nameText.on('pointerdown', () => this.showModal(item.name, item.price, item.url));
      nameText.on('pointerdown', () => this.showModal(item));
      //nameText.on('pointerdown', () => this.goStripe(item.url));
      item_Container.add(nameText);

      const item_image = this.add.image(0, 0, 'charge_'+item.image);
      item_image.setScale(0.2);
      //item_image.setScale(0.5);
      item_image.setInteractive();
      //item.on('pointerdown', () => this.showModal(itemData[i].name, itemData[i].price));
      //item_image.on('pointerdown', () => this.showModal(itemData[i].name, itemData[i].price, itemData[i].url));
      //item_image.on('pointerdown', () => this.showModal(item.name, item.price, item.url));
      item_image.on('pointerdown', () => this.showModal(item));
      //item_image.on('pointerdown', () => this.goStripe(item.url));
      item_Container.add(item_image);
            
      //const priceText = this.add.text(x, y + 130, itemData[i].price, { fontSize: '20px', fill: '#fff' });
      const priceText = this.add.text(0, 160, item.price, { fontSize: '25px', fill: '#fff' });
      priceText.setOrigin(0.5);//goStripe(url) 
      //priceText.on('pointerdown', () => this.showModal(item.name, item.price, item.url));
      priceText.on('pointerdown', () => this.goStripe(item.url));
      item_Container.add(priceText);

      //const urlText = this.add.text(x, y + 130, itemData[i].price, { fontSize: '20px', fill: '#fff' });
      //urlText.setOrigin(0.5);
      
      this.items.add(item_Container);
      
    });

    const termsButton = this.add.text(1000, 900, '利用規約', {
      fontSize: '32px',
      color: '#ffffff',
      backgroundColor: '#ff0000',
      padding: { x: 20, y: 10 }
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true })
    .on('pointerdown', () => this.showTerms(this))

    const announcementText = this.add.text(300, 950, "クリスタルパックを選択したことにより、上記利用規約に同意したものとみなされます。\nクリスタルは購入手続き完了後に加算されます。クリスタルはこのアプリ内でのみご利用いただけます。", { fontSize: '18px', fill: '#fff' });
    //announcementText.setOrigin(0.5);

    //this.scrollBar = this.add.rectangle(400, 550, 600, 10, 0x888888);

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

    const modalBg = scene.add.rectangle(0, 0, 1000, 800, 0x000000, 0.8);
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
        { fontSize: '20px', fill: '#ffffff', align: 'left', wordWrap: { width: 780 } }
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
      this.modalBg = this.add.image(0, 0, 'getModal2');
      this.modalBg.setDisplaySize(width*2, height*1.5);
      gachaConfirmModalContainer.add(this.modalBg)

      //const gacha_thumbnail = this.add.image(-400, 0, 'gacha_thumbnail'+gacha.id);
      const gacha_thumbnail = this.add.image(-400, 0, 'charge_item'+item.id);
      gacha_thumbnail.setDisplaySize(400, 350);// 画像の幅と高さを指定
      gacha_thumbnail.setInteractive();
      gachaConfirmModalContainer.add(gacha_thumbnail)

      this.name = this.add.text(100, -150, item.name, {fontSize: '48px',fill: '#f8f8ff',align: 'center',wordWrap: { width: width - 80 }}).setOrigin(0.5)
      gachaConfirmModalContainer.add(this.name)

      this.description = this.add.text(100, 50, item.description, {fontSize: '24px',fill: '#f8f8ff',align: 'center', wordWrap: { width: width - 80 }}).setOrigin(0.5)
      gachaConfirmModalContainer.add(this.description)

      const gachaButton = this.add.text(0, 250, '購入する', {
        fontSize: '32px',
        color: '#ffffff',
        backgroundColor: '#ff0000',
        padding: { x: 20, y: 10 }
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      //.on('pointerdown', () => this.startGacha(gachaButton,item.id,gachaConfirmModalContainer))
      .on('pointerdown', () => this.goStripe(item.url))
      //item_image.on('pointerdown', () => this.goStripe(item.url));
      gachaConfirmModalContainer.add(gachaButton)

      // 閉じるボタン
      //this.closeButton = new ButtonText(this, width / 2 - 60, height / 2 - 60, '閉じる', () => {this.close()});
      //this.closeButton = this.add.text(width / 2 - 60, height / 2 - 60, '閉じる', {fontSize: '20px',fill: '#000000',backgroundColor: '#cccccc',padding: { x: 10, y: 5 }}).setOrigin(0.5).setInteractive()
      //this.closeButton = this.add.text(width / 2 - 60, height / 2 - 60, '閉じる', {fontSize: '20px',fill: '#000000',backgroundColor: '#cccccc',padding: { x: 10, y: 5 }}).setOrigin(0.5).setInteractive()
      this.closeButton = new ButtonText(this, 100, 0, '閉じる', () => { this.closeModal(gachaConfirmModalContainer) });
      //this.closeButton.setOrigin(0.5)
      gachaConfirmModalContainer.add(this.closeButton)
      //this.closeButton.on('pointerdown', this.close, gachaConfirmModalContainer)
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