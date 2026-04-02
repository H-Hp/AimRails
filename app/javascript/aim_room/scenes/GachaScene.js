import Phaser from 'phaser'
import CristalAmountButton from '../components/CristalAmountButton.js';
import ModalWindow from '../components/ModalWindow'
import Header from '../components/Header.js';
import ButtonText from '../components/ButtonText.js';
import AjaxUtility from '../components/ajaxUtils';
//import LoginPlugin from '../components/LoginPlugin';
import DebugWindow from '../components/DebugWindow.js'; // パスは

export default class GachaScene extends Phaser.Scene {

  constructor() {
    super('GachaScene');
    this.isLoggedIn=false;
  }

  init() {
    this.game_width = this.scale.width
    this.game_height = this.scale.height

    //素材のアセットコンパイルでのフィンガープリント付きのパスを取得
    const gameElement = document.querySelector('[data-react-class="AimRoom"]');
    this.props = JSON.parse(gameElement.getAttribute('data-react-props'));
  
    this.ajaxUtil = new AjaxUtility();

    //ユーザーデータ・所持品や現在の設定(アイテムの配置状態など)
    this.user_data_json = this.registry.get('user_data_json')

    this.rails_env = this.registry.get('rails_env')

    //ログイン判定
    this.isLoggedIn = this.registry.get('isLoggedIn')
    /*this.loginPlugin = this.plugins.get('LoginPlugin');
    this.loginPlugin.checkLoginStatus().then(isLoggedIn => {
      this.isLoggedIn=isLoggedIn
      if (this.isLoggedIn) {
        console.log('ログイン成功');
        // ログイン後の処理
      } else {
        console.log('ログインしていませんぉ');
        // 未ログイン時の処理
      }
    });
    */

    this.gachas_data = this.registry.get('gachas_data')
    console.log("this.gachas_data:",this.gachas_data)

    //debubウィンドウに渡すデータ
    const forDebugData={
      gachas_data: this.gachas_data,
    }
    //デバッグウィンドウの初期化
    this.debugWindow = new DebugWindow(this,forDebugData);
    this.debugWindow.init();
    
  }

  preload() {
    this.load.image('gacha_backgroud', this.props.gacha_backgroud);
    this.load.image('other_backgroud', this.props.other_backgroud);
    this.load.image('gacha_thumbnail1', this.props.gacha_thumbnail1);
    this.load.image('gacha_thumbnail2', this.props.gacha_thumbnail2);
    this.load.image('get_icon', this.props.get_icon);
    this.load.image('getModal1', this.props.getModal1);
    this.load.image('getModal2', this.props.getModal2);
    this.load.image('getModal3', this.props.getModal3);

    this.load.spritesheet('box', this.props.gachaAnime, { frameWidth: 204, frameHeight: 204 });
    this.load.spritesheet('sweet', this.props.pipo, { frameWidth: 480, frameHeight: 480 });
    this.load.spritesheet('pipofm', this.props.pipofm, { frameWidth: 480, frameHeight: 480 });

    this.load.video('gacha_movie', this.props.gacha_movie, true);
    this.load.audio('gacha_se1', this.props.gacha_se1);
    this.load.audio('gacha_se2', this.props.gacha_se2);

  }

  create() {
    this.create_ui_gacha_list()//ガチャの一覧の画面作成
  }

  //ガチャの一覧の画面を作成し表示
  create_ui_gacha_list(){
    const background = this.add.image(this.game_width/2,this.game_height/2,'other_backgroud');
    background.setDisplaySize(this.game_width, this.game_height);
    //backgroud.setScale(2);

    this.Header = new Header(this, 'ガチャ',this.loginPlugin);

    const gachasContainer = this.add.container(50, 50);
    /*const gacha_data=[
      {id: 1, name: 'ノーマルガチャ', description: '基本的なパックです。',cristalCost: 100, weights:[[5,0.01],[4,0.1],[3,0.89]], pickup: [[6,0.4],[7,0.4],[8,0.1]] },
      {id: 2, name: 'レアガチャ', description: 'レアなパックです。',cristalCost: 150, weights:[[5,0.01],[4,0.1],[3,0.89]], pickup: [[12,0.4],[13,0.4]]},
    ];*/
    const gacha_data=this.gachas_data

    const gacha_width = this.game_width * 0.35;
    const spacing = gacha_width + 50; // コンテナ間の間隔を設定




    //ループしてガチャを作成して表示
    gacha_data.forEach((gacha, i) => {

      // gacha_idが2の場合まだ開発中なのでここで処理を終了する・development環境では表示
      /*if (gacha.id === 2 && this.rails_env!== "development") {
        console.log("gacha_idが2の場合まだ開発中なので作成表示処理を中断・development環境では作成と表示する");
        return; // これ以降の処理は実行されない
      }*/

      const x = i * spacing;
      const y = 400;
      const gacha_height=this.game_width*0.30
      const gacha_y=0

      //const gachaContainer = this.add.container(x, y);// Create a container for the button
      const gachaContainer = this.add.container(x, 50);// Create a container for the button
      gachasContainer.add(gachaContainer);

      //const gachaBackground = this.add.rectangle(0, 0, 400, 450, 0x4a4a4a);
      const gachaBackground = this.add.rectangle(0, 0, gacha_width, this.game_height*0.75, 0x000066);
      gachaBackground.setInteractive({ useHandCursor: true });
      gachaBackground.setStrokeStyle(5, 0xffffff);
      gachaBackground.setOrigin(0, 0);//オブジェクトの中心がcontainerに入るので、原点を画像の左上に変更
      gachaContainer.add(gachaBackground);
      
      const title = this.add.text(0, gacha_y, gacha.name, {fontSize: '16px',color: '#ffffff',padding: { x: 20, y: 10 },align: 'center'}).setOrigin(0,0).setFixedSize(gacha_width, 50)
      gachaContainer.add(title);

      const gacha_thumbnail = this.add.image(gacha_width/4, gacha_y+50, 'gacha_thumbnail'+gacha.id);
      //acha_thumbnail.setDisplaySize(400, 350);// 画像の幅と高さを指定
      gacha_thumbnail.setDisplaySize(gacha_width/1.5, gacha_height/1.5);// 画像の幅と高さを指定
      gacha_thumbnail.setOrigin(0, 0);//オブジェクトの中心がcontainerに入るので、原点を画像の左上に変更
      gachaContainer.add(gacha_thumbnail);

      //const gachaButton = this.add.text(0, gacha_y+450, '1パック 100', {fontSize: '16px',color: '#ccff00',backgroundColor: '#666666',padding: { x: 20, y: 10 },align: 'center'}).setOrigin(0,0).setFixedSize(gacha_width, 50)
      //gachaContainer.add(gachaButton);
      const cost_container = this.add.container(gacha_width/3, gacha_y + 450);
      const cost_background = this.add.rectangle(0, 0, gacha_width/2, 50, 0x212121);
      cost_background.setOrigin(0, 0);
      const cost_text1 = this.add.text(10, 25, '1パック', {fontSize: '16px',color: '#ccff00'}).setOrigin(0, 0.5);
      const cost_image = this.add.image(cost_text1.width + 50, 25, 'money').setScale(0.05); // Adjust scale as needed
      const cost_text2 = this.add.text(cost_image.x + cost_image.displayWidth + 10, 25, '100', {fontSize: '16px',color: '#ccff00'}).setOrigin(0, 0.5);
      cost_container.add([cost_background, cost_text1, cost_image, cost_text2]);
      cost_container.setSize(gacha_width, 50);
      gachaContainer.add(cost_container);


      gachaBackground.on('pointerdown', () => {
        this.create_ui_gacha_confirm(gacha)
      });
      gachaBackground.on('pointerover', () => {
        this.input.setDefaultCursor('pointer');
        gachaBackground.fillColor = 0x003366;

      });
      gachaBackground.on('pointerout', () => {
        this.input.setDefaultCursor('default');
        gachaBackground.fillColor = 0x000066;

      });

      //gachaContainer.add(this.gachaButton);
    });
    
    this.resultText = this.add.text(400, 300, '', {fontSize: '36px',color: '#ffffff'}).setOrigin(0.5)
    this.anims.create({key: 'open',frames: this.anims.generateFrameNumbers('box', { start: 0, end: 5 }),frameRate: 5,repeat: 2});
    this.anims.create({key: 'ame',frames: this.anims.generateFrameNumbers('sweet', { start: 0, end: 13 }),frameRate: 60,repeat: 15 });
    this.anims.create({key: 'bomb',frames: this.anims.generateFrameNumbers('pipofm', { start: 0, end: 17 }), frameRate: 10, repeat: 3 });

    this.sweet = this.add.sprite(400, 300, 'sweet').setVisible(false).setDisplaySize(1000, 800);;
    this.box = this.add.sprite(400, 300, 'box').setVisible(false).setDisplaySize(1000, 800);;
    this.pipofm = this.add.sprite(400, 300, 'pipofm').setVisible(false).setDisplaySize(1000, 800);;

    this.sweet.setScale(1.5);  // スプライトを1.5倍に拡大
    this.box.setScale(1.5);  // スプライトを1.5倍に拡大
    this.pipofm.setScale(1.5);  // スプライトを1.5倍に拡大
  }

  //選択したガチャの詳細/確認の画面を作成し表示
  create_ui_gacha_confirm(gacha) {
    const modalWidth = 400;
    const modalHeight = 300;
    const modalX = (this.sys.game.config.width - modalWidth) / 2;
    const modalY = (this.sys.game.config.height - modalHeight) / 2;

    const width = this.game_width/2
    const height = this.game_height/2

    const gachaConfirmModalContainer = this.add.container(width, height);// Create a container for the button

    // 半透明の黒いオーバーレイを作成
    this.overlay = this.add.rectangle(0, 0, this.sys.game.config.width, this.sys.game.config.height, 0x000000, 0.7);
    //this.overlay.setOrigin(0);
    gachaConfirmModalContainer.add(this.overlay)

    // モーダルウィンドウの本体
    //this.window = this.add.rectangle(0, 0, width - 40, height - 40, 0xffffff)
    //gachaConfirmModalContainer.add(this.window)

    // 背景（半透明の黒）
    this.modalBg = this.add.image(0, 0, 'getModal2').setDisplaySize(width*2, height*1.5).setInteractive();
    gachaConfirmModalContainer.add(this.modalBg)

    const gacha_thumbnail = this.add.image(-400, 0, 'gacha_thumbnail'+gacha.id);
    gacha_thumbnail.setDisplaySize(400, 350);// 画像の幅と高さを指定
    //gacha_thumbnail.setInteractive();
    gachaConfirmModalContainer.add(gacha_thumbnail)

    this.name = this.add.text(100, -150, gacha.name, {fontSize: '48px',fill: '#f8f8ff',align: 'center',wordWrap: { width: width - 80 }}).setOrigin(0.5)
    gachaConfirmModalContainer.add(this.name)

    this.description = this.add.text(100, 50, gacha.description, {fontSize: '24px',fill: '#f8f8ff',align: 'center', wordWrap: { width: width - 80 }}).setOrigin(0.5)
    gachaConfirmModalContainer.add(this.description)

    //const gachaButton = this.add.text(0, 250, 'ガチャを引く', {fontSize: '32px',color: '#ffffff',backgroundColor: '#ff0000',padding: { x: 20, y: 10 }}).setOrigin(0.5).setInteractive({ useHandCursor: true })
    //gachaButton.on('pointerdown', () => this.startGacha(gachaButton,gacha.id,gachaConfirmModalContainer))
    //gachaConfirmModalContainer.add(gachaButton)
    //const gachaButton = this.add.text(0, 250, '購入する', {fontSize: '32px',color: '#ffffff',backgroundColor: '#ff0000',padding: { x: 20, y: 10 }}).setOrigin(0.5).setInteractive({ useHandCursor: true })
    const gachaButton = this.add.text(0, 250, gacha.cost+'でガチャを引く', {fontSize: '24px',color: '#ccff00',backgroundColor: '#212121',align: 'center',padding: { x: 20, y: 20 }}).setOrigin(0, 0.5).setFixedSize(300, 50);
    gachaButton.setInteractive();
    gachaButton.on('pointerdown', () => {
      this.startGacha(gachaButton,gacha.id,gachaConfirmModalContainer)
    });
    gachaButton.on('pointerover', () => {this.input.setDefaultCursor('pointer');gachaButton.setTint(0xfdd35c);});
    gachaButton.on('pointerout', () => {this.input.setDefaultCursor('default');gachaButton.setTint(0xccff00);});
    gachaConfirmModalContainer.add(gachaButton)
    
    // 閉じるボタン
    this.closeButton = this.add.image(this.game_width*0.4 , -height/2, 'close').setDisplaySize(50, 50).setInteractive({ useHandCursor: true });
    this.closeButton.on('pointerdown', () => { this.close(gachaConfirmModalContainer)  });// 閉じるボタンのイベントリスナー
    gachaConfirmModalContainer.add(this.closeButton)
  }

  //ガチャの処理・アイテムデータを取得
  startGacha(gachaButton,gacha_id,gachaConfirmModalContainer) {
    console.log(gacha_id)

    //デバッグウィンドウからチェックボックスの値を取得
    let isGachaSkipSave=false
    let isGachaNoCost=false
    if(document.getElementById("debug-window")){
      isGachaSkipSave =document.getElementById("check-gacha-skip-save").checked;
      isGachaNoCost = document.getElementById("check-gacha-no-cost").checked;
      console.log("isGachaNoCost: "+isGachaNoCost+"・isGachaNoCost:"+isGachaSkipSave)
    }else{
      console.log("デバッグウィンドウが存在しないのでisGachaNoCostとisGachaSkipSaveはfalseのまま")
    }

    gachaConfirmModalContainer.setVisible(false)
    //this.gachaButton.disableInteractive()
    gachaButton.disableInteractive(); // 引数として渡されたボタンを無効化
    this.resultText.setText('');
  
    //#region
  /*
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
  */
    //#endregion

    this.playGachaAnimation();//ガチャの演出アニメーションと音
    
    fetch('/gacha', { 
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content 
      },
      body: JSON.stringify({
        gacha_id: gacha_id,
        isGachaSkipSave: isGachaSkipSave,
        isGachaNoCost: isGachaNoCost
      })
    })
    .then(response => response.json())
    .then(data => {
      //this.time.delayedCall(1500, () => {
      this.time.delayedCall(500, () => {
        //console.log(data.item.name);
        console.log(data.item);
        //this.gachaAnimation.setVisible(false)
        this.updateCristal();
        this.getItemModal(data.item);

        //this.modal = new ModalWindow(this, window.innerWidth / 2, window.innerHeight / 2, window.innerWidth / 2, window.innerHeight / 2, `ゲットしたアイテム: ${data.item.name}!`)
        //this.modal.open()
        //this.resultText.setText(`ゲットしたアイテム: ${data.item.name}!`)
        gachaButton.setInteractive()
      })
    })
  }

  //ガチャの演出アニメーションと音
  playGachaAnimation(){
    this.video = this.add.video(640, 360,'gacha_movie');
    //video.loadURL('assets/video/tunnel.mp4', true);
    this.video.play(true);

    const backSound = this.sound.add('gacha_se1');
    backSound.play();
  }

  //現在のクリスタルの量をゲームに反映
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

  //入手したアイテムを表示するモーダル作成して表示
  async getItemModal(item){
    //this.width = window.innerWidth
    //this.height = window.innerHeight
    const width = this.game_width/2
    const height = this.game_height/2

    //const gachaGetModalContainer = this.add.container(width, height);// Create a container for the button
    let gachaGetModalContainer = null
    gachaGetModalContainer =this.add.container(width, height);// Create a container for the button

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

    // #region
    /*let respons_data = null
    let img_path = null
    let json_path = null
    let thm_path = null
    */
    // #endregion


    // 閉じるボタン
    // this.closeButton = new ButtonText(this, 100, 0, '閉じる', () => { this.close(gachaGetModalContainer) });
    this.closeButton = this.add.image(this.game_width*0.4 , -this.game_height/2/2, 'close').setDisplaySize(50, 50).setInteractive({ useHandCursor: true });
    this.closeButton.on('pointerdown', () => { this.close(gachaGetModalContainer)  });// 閉じるボタンのイベントリスナー
    gachaGetModalContainer.add(this.closeButton)

    //入手したアイテムのキーのテクスチャがまだ存在しない場合のみロードを実行する
    //if (!this.textures.exists(item.key)) {

      //this.load.atlas('obj2', this.props.obj2_img, this.props.obj2_json);
      if(item.item_type=='chara' || item.item_type=='background' || item.item_type=='obj'){
          console.log("入手したアイテムのキーのテクスチャがまだ存在しない場合のみロードを実行する")
          const thm_sendData = { paths: [item.key+'_thm'] };console.log("あああitem.key:",item.key)
          const img_json_sendData = { path: item.key };
          const thm_respons_data = await this.ajaxUtil.ajax('/resolve_asset_path',thm_sendData)
          const img_json_respons_data = await this.ajaxUtil.ajax('/resolve_path_img_json',img_json_sendData)
          console.log("thm_respons_data:",thm_respons_data)
          console.log("img_json_respons_data:",img_json_respons_data)
          const thm_path = thm_respons_data.resolved_paths[0]
          const img_path = img_json_respons_data.img_path
          const json_path = img_json_respons_data.json_path
          console.log("thm_path:",thm_path)
          console.log("img_path:",img_path)
          console.log("json_path:",json_path)

          //ロード完了後の処理を予約（先に書いておくのが安全）
          this.load.once('complete', () => {
              console.log('新しくゲットしたアイテムの全てのアセットの読み込みが完了しました！');          
              const getItemThm = this.add.image(0, 0, item.key+'_thm').setOrigin(0,0);;
              getItemThm.setDisplaySize(500, 500);// 画像の幅と高さを指定
              gachaGetModalContainer.add(getItemThm)
          });

          this.load.atlas(item.key, `${img_path}`, `${json_path}`);
          this.load.image(item.key+'_thm', thm_path);
          this.load.start();

        }else if (item.item_type=='music') {
          return 'music';
        }else{
          const sendData = { paths: [item.key] };
          const respons_data = await this.ajaxUtil.ajax('/resolve_asset_path',sendData)
          img_path = respons_data.resolved_paths
        }
    /*} else {
      console.log(item.key+'はすでにロード済みです。');
      const getItemThm = this.add.image(0, 0,item.key).setOrigin(0,0);
      getItemThm.setDisplaySize(500, 500);// 画像の幅と高さを指定
      gachaGetModalContainer.add(getItemThm)
    }*/

      // #region
      /*
        //let prefix=item.properties['prefix'];
        if(item.item_type=='chara' || item.item_type=='background' || item.item_type=='obj'){
          const sendData = { paths: [item.key+'_thm'] };
          respons_data = await this.ajaxUtil.ajax('/resolve_asset_path',sendData)
          img_path = respons_data.resolved_paths
          //json_path = respons_data.json_path
        }else if (item.item_type=='music') {
          return 'music';
        }else{
          const sendData = { paths: [item.path] };
          respons_data = await this.ajaxUtil.ajax('/resolve_asset_path',sendData)
          img_path = respons_data.resolved_paths
        }

        //const sendData = { paths: [item.path] };
        //respons_data = await this.ajax('/resolve_asset_path',sendData)
        //respons_data = await this.ajaxUtil.ajax('/resolve_asset_path',sendData)
        //const data = await this.ajaxUtil.ajax('/resolve_asset_path', sendData);
        //img_path = respons_data.resolved_paths
        console.log("外部ajaxUtilのimg_path="+img_path)

        let loader = new Phaser.Loader.LoaderPlugin(this);// 新しいローダーを作成
        //loader.image('myitem'+item.id, 'assets/images/item/'+item.path+'.png');// 画像を読み込む
        loader.image('myitem'+item.id, img_path);// 画像を読み込む

        let item_img =null;
        loader.once('complete', () => {// 読み込み完了後に画像を表示
          item_img = this.add.image(0, 0, 'myitem'+item.id).setOrigin(0,0);
          item_img.setDisplaySize(500, 500);// 画像の幅と高さを指定
          gachaGetModalContainer.add(item_img)
        });
        loader.start();// 読み込みを開始
      */
      // #endregion 


  }

  //閉じる
  close(container) {
    //container.setVisible(false)
    container.destroy();
    this.video.destroy();
  }
}