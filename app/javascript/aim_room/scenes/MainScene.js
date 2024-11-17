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
    this.background = null
    this.desk = null

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
    this.load.image('boad', this.props.boad);

    this.load.image('shop_icon', this.props.shop_icon);
    this.load.image('bag_icon', this.props.bag_icon);
    this.load.image('gacha_icon', this.props.gacha_icon);
    this.load.image('mission_icon', this.props.mission_icon);
    this.load.image('money', this.props.money_icon);

    this.load.image('playButton', this.props.play_button);
    this.load.image('pauseButton', this.props.pause_button);
    this.load.image('nextButton', this.props.next_button);
    this.load.image('prevButton', this.props.prev_button);

    this.load.image('item_modal_bg', this.props.item_modal_bg);
    this.load.image('item_modal_bg2', this.props.item_modal_bg2);
    this.load.image('close', this.props.close);
  }
  async create() {
    await this.init_env()
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


/*
resolve_asset_path() {
  fetch('/resolve_asset_path', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
    },
    body: JSON.stringify({
      path: "aimroom/item/bg0.png"
    })
  })
  .then(response => response.json())
  .then(data => {
    console.log("data.resolved_path"+data.resolved_path);
  })
  .catch(error => console.error('Error:', error))
}*/


async ajax(path,sendData){
  //ajax(path,sendData){
    console.log("ajax呼ばれてる")
    //return fetch(path, { 
    return await fetch(path, { 
    //fetch(path, { 
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content 
      },
      //body: JSON.stringify({sendData: sendData})
      body: JSON.stringify(sendData)
    })
    .then(response => response.json())
    .then(data => {
        //console.log(data.env_data)
        //console.log("background:"+data.env_data[0].background)
        //console.log("background:"+data.env_data[0].background)
        return data
    })
  }


  //await init_env(){
  //init_env(){
  async init_env(){
    
    try {
      //const data = await ajax(path,sendData)
      //const data = ajax('/init_env','')
      const data = await this.ajax('/init_env','')
      console.log("dataだ："+data);
      //const bg_path=data.env_data[0].background
      //const desk_path=data.env_data[0].desk
      //const chara_path=data.env_data[0].chara
      const bg_img_path=data.background_img_path
      const bg_json_path=data.background_json_path
      const bg_prefix=data.background_prefix

      const chara_img_path=data.chara_img_path
      const chara_json_path=data.chara_json_path
      const chara_prefix=data.chara_prefix

      const obj_img_path=data.obj_img_path
      const obj_json_path=data.obj_json_path
      const obj_prefix=data.obj_prefix

      const picture_path=data.picture_path
      const desk_path=data.desk_path


      console.log(`bg_img_path: ${bg_img_path}`);
      console.log(`bg_json_path: ${bg_json_path}`);
      console.log(`desk_path: ${desk_path}`);
      console.log(`chara_img_path: ${chara_img_path}`);
      console.log(`chara_json_path: ${chara_json_path}`);
      console.log(`chara_prefix: ${chara_prefix}`);

      const musicList=data.musics
      console.log(`musicList: ${musicList}`);
      const musicNames = [];
      const musicPaths = [];
      
  
      console.log("上の処理が終わってから実行されます");
      //console.log("ふふｋ"+musicList);console.log("ふふｋ"+musicList[0]);
      // dataを使った処理をここに書きます

      //if(item.type=="background"){
        //this.load.image(`background-${bg_path}`, `assets/images/item/${bg_path}.png`);
        //this.load.image(`desk-${desk_path}`, `assets/images/item/${desk_path}.png`);
        //this.load.spritesheet(`${chara_path}`, `assets/images/item/${chara_path}.png`, { frameWidth: 230,frameHeight: 230});
        if (!this.textures.exists(bg_img_path)) {
          //this.load.image(`background-${bg_path}`, `${bg_path}`);
          this.load.atlas('bg', `${bg_img_path}`, `${bg_json_path}`);


        }

        //this.load.image(`desk-${desk_path}`, `${desk_path}`);
        this.load.image('desk', `${desk_path}`);
        //this.load.spritesheet(`${chara_path}`, `${chara_path}`, { frameWidth: 230,frameHeight: 230});
        //this.load.spritesheet(`chara-${chara_path}`, `${chara_path}`, { frameWidth: 230,frameHeight: 230});
        this.load.atlas('chara', `${chara_img_path}`, `${chara_json_path}`);
        this.load.atlas('obj', `${obj_img_path}`, `${obj_json_path}`);
        this.load.image('picture', `${picture_path}`);


        //const musicList=['music01','music02']
        //musicList.forEach(music_path => {
            //console.log(music_path);
            //this.load.audio(`music-${music_path}`, `assets/images/item/${music_path}.mp3`);
            //this.load.audio(`${music_path}`, `assets/images/item/${music_path}.mp3`);
        //});
        //data.env_data[0].music.forEach(music => {
        musicList.forEach(music => {
          console.log(`Name: ${music.name}, Path: ${music.path}`);
          musicNames.push(music.name);
          musicPaths.push(music.path);
          this.load.audio(`${music.path}`, `assets/images/item/${music.path}.mp3`);
        }); 
        console.log('Music Names:', musicNames);
        console.log('Music Paths:', musicPaths);

        this.load.once('complete', () => {
          console.log(`background-${bg_img_path}`)
          if (!this.textures.exists(bg_img_path)) {
            //this.background.setTexture(`background-${bg_path}`);
            this.anims.create({key: 'bg_key',frames: this.anims.generateFrameNames('bg', {prefix: bg_prefix,suffix: '.png',start: 0,end: 75,zeroPad: 2}),frameRate: 18,repeat: -1});
            //this.background = this.add.sprite(window.innerWidth, window.innerHeight,'bg').setScale(2)
            this.background = this.add.sprite(window.innerWidth/2,window.innerHeight/2,'bg').setScale(2)
            this.background.play('bg_key');
          }
            //this.background.setDisplaySize(window.innerWidth, window.innerHeight);
            //this.background = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'back');
            //this.background = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, `background-${bg_path}`);
            this.background.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
            //this.desk.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
        

            this.boad = this.add.image(window.innerWidth/2+200,window.innerHeight/2+100,'boad');
            this.boad.setTexture('boad');
            this.boad.setScale(0.5)

            this.picture = this.add.image(window.innerWidth/2+200,window.innerHeight/2+100,'picture');
            this.picture.setTexture('picture');
            this.picture.setScale(0.3)



            this.desk = this.add.image(window.innerWidth/2,window.innerHeight/2+100,'desk');
            //this.desk.setScale(2.3);// 画像のサイズを2倍にする
            this.desk.setTexture('desk');

            this.anims.create({key: 'read',frames: this.anims.generateFrameNames('chara', {prefix: chara_prefix+'/read/read_00',suffix: '.png',start: 0,end: 75,zeroPad: 2}),frameRate: 5,repeat: -1});
            this.anims.create({key: 'study',frames: this.anims.generateFrameNames('chara', {prefix: chara_prefix+'/study/study_00',suffix: '.png',start: 0,end: 75, zeroPad: 2}),frameRate: 18,repeat: -1});
            this.chara = this.add.sprite(window.innerWidth/2,window.innerHeight/2+100,'chara').setScale(1)
            this.chara.play('read');
            
            this.anims.create({key: 'obj_key',frames: this.anims.generateFrameNames('obj', {prefix: obj_prefix,suffix: '.png',start: 0,end: 75,zeroPad: 2}),frameRate: 5,repeat: -1});
            this.obj = this.add.sprite(window.innerWidth/2+300,window.innerHeight/2+200,'obj').setScale(0.5)
            this.obj.play('obj_key');



            /*
            //this.character.destroy();
            //this.character = this.add.sprite(window.innerWidth / 2, window.innerHeight / 2, `${chara_path}`);
            this.character = this.add.sprite(window.innerWidth / 2, window.innerHeight / 2, `chara-${chara_path}`);
            //this.character.setTexture(`${chara_path}`);
            //this.character.setTexture(`chara-${chara_path}`);
            this.anims.create({
              key: 'study',
              //frames: this.anims.generateFrameNumbers('character', { start: 0, end: 8 }),
              frames: this.anims.generateFrameNumbers(`chara-${chara_path}`, { start: 0, end: 8 }),
              frameRate: 1,
              repeat: -1
            });
            // キャラクターのスプライトを作成し、アニメーションを再生
            //this.character = this.add.sprite(window.innerWidth/2,window.innerHeight/2, 'character');
            this.character.setScale(2.3);// 画像のサイズを2倍にする
            this.character.play('study'); // 初期アニメーションを設定
            // 必要に応じて、新しいスプライトシートのフレームを設定
            this.character.setFrame(0); // 最初のフレームを表示
            this.anims.create({// アニメーションを作成する場合
                key: 'newAnimation',
                frames: this.anims.generateFrameNumbers(`${chara_path}`, { start: 0, end: 5 }),
                frameRate: 10,
                repeat: -1
            });
            this.character.play('newAnimation');// 新しいアニメーションを再生
            */

            this.menu_init()

            //this.music = new Music(this, 400, under_y,musicList);
            //this.music = new Music(this, 400, 1050,musicList);
            //this.music = new Music(this, 400, 1050,musicPaths,musicNames);
            //this.music = new Music(this, 200, 50,musicPaths,musicNames);
            this.music = new Music(this, 0, 0,musicPaths,musicNames);
            this.menuContainer.add(this.music);

            
        });
        this.load.start();  
    } catch (error) {
      console.error("エラーが発生しました:", error);
    }
  }


  updateObjectPosition() {
    if (this.under) {
      // オブジェクトを画面の一番下に配置
      this.under.setPosition(this.cameras.main.width / 2, this.cameras.main.height);
    }
  }

  update() {
    // Game logic here
  }

  //updateBackground(item_path) {
  //updateEnvironment(item,resolved_path) {
  async updateEnvironment(item,resolved_path) {
    console.log("updateBackground"+item.path);
    console.log("updateBackground item.type)"+item.item_type);
    console.log("updateBackground item.id)"+item.id);
    console.log("item.properties)"+item.properties['prefix']);
    console.log("this.background:"+this.background);

    

    //const asset_path = this.ajax('/resolve_path',`[${item.path}]`)
    //const sendDataPath = { paths: [item.path] };
    //let path = this.ajax('/resolve_path',[item.path])
    //let path = await this.ajax('/resolve_asset_path',sendDataPath)
    //console.log("編集後：resolved_path"+resolved_path);

    let respons_data = null
    let img_path = null
    let json_path = null
    let prefix=item.properties['prefix'];
    if(item.item_type=='chara' || item.item_type=='background' || item.item_type=='obj'){
      const sendData = { path: item.path };
      respons_data = await this.ajax('/resolve_path_img_json',sendData)
      img_path = respons_data.img_path
      json_path = respons_data.json_path
    }else{
      const sendData = { paths: [item.path] };
      respons_data = await this.ajax('/resolve_asset_path',sendData)
      img_path = respons_data.resolved_paths
    }
    //item.path= resolved_path
    console.log("img_path: "+img_path);
   
    if(item.item_type=="chara"){
      this.chara.stop();// 現在のアニメーションを停止
      this.load.atlas('chara_new', `${img_path}`, `${json_path}`);// 新しいアトラスを読み込む
      this.load.once('complete', () => {
          if (this.anims.exists('read') && this.anims.exists('study')) {// 既存のアニメーションを削除
              this.anims.remove('read');
              this.anims.remove('study');
          }
          this.anims.create({key: 'read',frames: this.anims.generateFrameNames('chara_new', {prefix: prefix+'/read/read_00',suffix: '.png',start: 0,end: 75,zeroPad: 2}),frameRate: 5,repeat: -1});
          this.anims.create({key: 'study',frames: this.anims.generateFrameNames('chara_new', {prefix: prefix+'/study/study_00',suffix: '.png',start: 0,end: 75, zeroPad: 2}),frameRate: 18,repeat: -1});
          //this.anims.create({key: 'chara_key',frames: this.anims.generateFrameNames('bg_new', {prefix: prefix,suffix: '.png',start: 0,end: 75,zeroPad: 2}),frameRate: 18,repeat: -1});// 新しいアニメーションを作成
          //this.anims.create({key: 'bg_key',frames: this.anims.generateFrameNames('bg_new', {prefix: bgPrefix,suffix: '.png',start: 0,end: 75,zeroPad: 2}),frameRate: 18,repeat: -1});
          this.chara.setTexture('chara_new');// テクスチャを更新
          this.chara.play('study');//アニメーションを再生
          this.textures.remove('chara');// 古いテクスチャを削除（メモリ解放）
      });
      /*this.load.atlas('chara', `${img_path}`, `${json_path}`);
      this.load.once('complete', () => {
        this.anims.create({key: 'read',frames: this.anims.generateFrameNames('chara', {prefix: prefix+'/read/read_00',suffix: '.png',start: 0,end: 75,zeroPad: 2}),frameRate: 5,repeat: -1});
        this.anims.create({key: 'study',frames: this.anims.generateFrameNames('chara', {prefix: prefix+'/study/study_00',suffix: '.png',start: 0,end: 75, zeroPad: 2}),frameRate: 18,repeat: -1});
        const chara = this.add.sprite(window.innerWidth/2,window.innerHeight/2+100,'chara').setScale(1)
        chara.play('read');
      });*/
    }else if(item.item_type=="background"){
      this.background.stop();// 現在のアニメーションを停止
      this.load.atlas('bg_new', `${img_path}`, `${json_path}`);// 新しいアトラスを読み込む
      this.load.once('complete', () => {
          if (this.anims.exists('bg_key')) {// 既存のアニメーションを削除
              this.anims.remove('bg_key');
          }
          this.anims.create({key: 'bg_key',frames: this.anims.generateFrameNames('bg_new', {prefix: prefix,suffix: '.png',start: 0,end: 75,zeroPad: 2}),frameRate: 18,repeat: -1});// 新しいアニメーションを作成
          //this.anims.create({key: 'bg_key',frames: this.anims.generateFrameNames('bg_new', {prefix: bgPrefix,suffix: '.png',start: 0,end: 75,zeroPad: 2}),frameRate: 18,repeat: -1});
          this.background.setTexture('bg_new');// テクスチャを更新
          this.background.play('bg_key');//アニメーションを再生
          this.textures.remove('bg');// 古いテクスチャを削除（メモリ解放）
      });
      /*// 新しいatlasを読み込む
      //this.load.atlas('new_bg', '/path/to/new_furniture_atlas.png', '/path/to/new_furniture_atlas.json')
      this.load.atlas('new_bg', `${img_path}`, `${json_path}`);

      // 読み込みが完了したら、テクスチャを更新する
      this.load.once('complete', () => {
        const currentFrame = this.background.frame.name;// 現在のフレーム名を保存
        // atlasのテクスチャを更新
        this.textures.remove('bg')
        this.textures.addAtlas('bg', this.textures.get('new_bg').getSourceImage())
        
        // フレームを更新（必要に応じて）
        //this.textures.get('bg').add('desk.png', 0, this.textures.getFrame('bg', 'desk.png'))
        this.textures.get('bg').add(currentFrame, 0, this.textures.getFrame('bg', currentFrame))

        // ゲームオブジェクトのテクスチャを更新
        //deskObject.setTexture('bg', 'desk.png')
        deskObject.setTexture('bg', currentFrame)
      });*/
      /*//this.background.destroy()
      const currentFrame = this.background.frame.name;// 現在のフレーム名を保存
      this.textures.remove('bg');// 既存のテクスチャを削除（必要に応じて）
      //this.load.atlas('bg-new', `${img_path}`, `${json_path}`);
      this.load.atlas('bg', `${img_path}`, `${json_path}`);
      this.load.once('complete', () => {
        this.anims.create({key: 'new-bg_key',frames: this.anims.generateFrameNames('bg', {prefix: prefix,suffix: '.png',start: 0,end: 75,zeroPad: 2}),frameRate: 18,repeat: -1});
        //this.background = this.add.sprite(window.innerWidth/2,window.innerHeight/2,'bg-new').setScale(2)
        //this.background.play('bg_key');
        // 同じフレーム名で更新
        if (this.textures.getFrame('bg', currentFrame)) {
            this.background.setTexture('bg', currentFrame);
        } else {
            // フレームが存在しない場合のフォールバック
            console.warn('Frame not found in new atlas:', currentFrame);
            this.background.setTexture('bg', 'default');
        }
      });*/
    }else if(item.item_type=="obj"){
      this.obj.stop();// 現在のアニメーションを停止
      this.load.atlas('obj_new', `${img_path}`, `${json_path}`);// 新しいアトラスを読み込む
      this.load.once('complete', () => {
          if (this.anims.exists('obj_key')) {// 既存のアニメーションを削除
              this.anims.remove('obj_key');
          }
          this.anims.create({key: 'obj_key',frames: this.anims.generateFrameNames('obj_new', {prefix: prefix,suffix: '.png',start: 0,end: 75,zeroPad: 2}),frameRate: 18,repeat: -1});// 新しいアニメーションを作成
          this.obj.setTexture('obj_new');// テクスチャを更新
          this.obj.play('obj_key');//アニメーションを再生
          this.textures.remove('obj');// 古いテクスチャを削除（メモリ解放）
      });
      /*this.load.atlas('obj', `${img_path}`, `${json_path}`);
      this.load.once('complete', () => {
        this.anims.create({key: 'obj_key',frames: this.anims.generateFrameNames('obj', {prefix: prefix,suffix: '.png',start: 0,end: 75,zeroPad: 2}),frameRate: 18,repeat: -1});
        this.obj = this.add.sprite(window.innerWidth/2,window.innerHeight/2,'obj').setScale(2)
        this.obj.play('obj_key');
      });*/
    }else if(item.item_type=="desk"){
      this.load.image('new-desk', `${img_path}`);
      this.load.once('complete', () => {
        //this.desk = this.add.image(window.innerWidth/2,window.innerHeight/2+100,'desk');
        this.desk.setTexture('new-desk');
      });
    }else if(item.item_type=="picture"){
      this.load.image('new-picture', `${img_path}`);
      this.load.once('complete', () => {
        //this.picture = this.add.image(window.innerWidth/2+200,window.innerHeight/2+100,'picture');
        this.picture.setTexture('new-picture');
        //this.picture.setScale(0.3)
      });
    }
    //DBに反映
    const sendData = { type: item.item_type, id: item.id };
    const data = this.ajax('/update_env',sendData)
    
    this.load.start();
    //this.scene.restart();
}

menu_init(){
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
            const owned_items=data.owned_items;
            console.log(`owned_items: ${owned_items}`);
            this.modal = new ItemListModalWindow(this, window.innerWidth/2, window.innerHeight/2, window.innerWidth*0.6, window.innerHeight*0.6, '保有アイテム',owned_items,this.updateEnvironment.bind(this))
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

  //自動リサイズ 
  this.scale.on('resize', this.resize, this);// リサイズイベントのリスナーを追加 
  this.resize.call(this, this.scale.gameSize);// 初期配置 
}
}