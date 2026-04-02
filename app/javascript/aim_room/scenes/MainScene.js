import Phaser from 'phaser'
import CristalAmountButton from '../components/CristalAmountButton.js';
import ModalWindow from '../components/ModalWindow'
import Music from '../components/Music.js';
import LoginButton from '../components/LoginButton.js';
import LogoutButton from '../components/LogoutButton.js';
import CreateAccountButton from '../components/CreateAccountButton.js';
import ItemListModalWindow from '../components/ItemListModalWindow.js'
import Tooltip from '../components/Tooltip.js'
import DebugWindow from '../components/DebugWindow.js'; // パスは

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene')//superは親クラス（Phaser.Scene）のコンストラクタを呼ぶ処理・今回の場合はPhaser.Sceneのconstructorを呼びこのSceneの名前を"MainScene"として登録する処理
    this.isLoggedIn = false;// ログイン状態を保持するフラグ
  }
  //init()はconstructor()のあとに最初に呼ばれる・Scene開始時の初期化・Phaser組込みメソッド
  init() {
    console.log("メインシーン")
    this.background = null
    this.desk = null
    this.isFocusMode = false;

    this.game_width = this.scale.width
    this.game_height = this.scale.height

    //ユーザーデータ・所持品や現在の設定(アイテムの配置状態など)
    this.user_data_json = this.registry.get('user_data_json')

    this.rails_env = this.registry.get('rails_env')

    //ログイン判定
    this.isLoggedIn = this.registry.get('isLoggedIn')
    /*this.loginPlugin = this.plugins.get('LoginPlugin');
    this.loginPlugin.checkLoginStatus().then(isLoggedIn => {
      this.isLoggedIn=isLoggedIn
    });
    */

    this.debugWindow = new DebugWindow(this);
    this.debugWindow.init();
  }
  //preload()はinit()のあとに呼ばれる・画像・音・JSONなどの読み込み・Phaser組込みメソッド
  preload() {
    /*
    //ゲームで使う画像・音声などを読み込む処理
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
    */
  }

  //create()はpreload()のあとに呼ばれる・ゲームオブジェクト作成・Phaser組込みメソッド
  // 環境初期化処理
  create() {
    //async create() {
    //await this.init_env() // 環境初期化処理を実行
    this.init_game();

    this.tooltip = new Tooltip(this)//メニューの吹き出し

    this.menu_init()

    //this.debugWindow_init();
    
  }

  //アイテムの配置など
  init_game(){
    //this.user_data_json.placed_items.bg
    const bg_key = this.user_data_json.placed_items.bg //bg0,bg1
    const bgItemData = this.user_data_json.owned_items.find(item => item.key === bg_key);//owned_itemsからbg0のkeyで探してデータ取得・{ id: 1, name:"bg0", item_type: "background", path: "" , key: "bg0", description: "bg0", properties: { prefix: "flames690/bg0_00" } },
    //const bg_prefix = bgItemData.properties.prefix
    //console.log("this.user_data_json.placed_items.bg:",this.user_data_json.placed_items.bg)
    const board_key = this.user_data_json.placed_items.board//board0,board1
    const picture_key = this.user_data_json.placed_items.picture//picture,picture1
    const desk_key = this.user_data_json.placed_items.desk//desk0,desk1
    const chara_key = this.user_data_json.placed_items.chara //chara0,chara1
    const charaItemData = this.user_data_json.owned_items.find(item => item.key === chara_key);//owned_itemsからchara0のkeyで探してデータ取得・{ id: 2, name:"chara0",item_type: "chara", path:"" , key: "chara0", description: "chara0", properties: { prefix: "chara0" } },
    const obj_key = this.user_data_json.placed_items.obj //obj0,obj1,obj2
    const objItemData = this.user_data_json.owned_items.find(item => item.key === obj_key);//owned_itemsからobj0のkeyで探してデータ取得・{ id: 16, name:"キャンドル",item_type: "obj", path: "", key: "obj2", description: "obj2", properties: { prefix: "resized_flames300x300/candle_00" } },
    
    //bg
    this.anims.create({
      key: bg_key+'_anim_key',//このアニメーションの名前。bg0_anim_key・sprite.play('bg_key')などあとで再生するときに使う。
      frames: this.anims.generateFrameNames(bg_key, {//bg というtexture atlas/spritesheetのキーからフレーム名を生成
        prefix: bgItemData.properties.prefix,//"bg0_"などの画像ファイル名の先頭文字列
        suffix: '.png',//ファイルの拡張子
        start: 1,//フレーム番号の範囲のスタート地点
        end: 50,//フレーム番号の範囲のゴール地点
        zeroPad: 2//番号を2桁にする、00や01など
      }),
      frameRate: 18,//フレームレート
      repeat: -1//無限ループ
    });
    this.background = this.add.sprite(0, 0, bg_key).setOrigin(0)
    this.background.setScale(Math.max(this.scale.width / this.background.width, this.scale.height / this.background.height))
    this.background.play(bg_key+'_anim_key');//bg0_anim_key

    //絵のボード
    this.board = this.add.image(window.innerWidth/2+200,window.innerHeight/2+100,board_key);
    this.board.setTexture(board_key);
    this.board.setScale(0.5)

    //絵
    this.picture = this.add.image(window.innerWidth/2+200,window.innerHeight/2+50,picture_key);
    this.picture.setTexture(picture_key);
    this.picture.setDisplaySize(200,200)
    this.picture.setInteractive();//クリック可能にする
    this.picture.on("pointerover", () => {//ホバー時
      this.input.setDefaultCursor('pointer')
    })
    this.picture.on("pointerout", () => {//ホバー外れたら
      this.input.setDefaultCursor('default')//マウスカーソル変更
    })
    this.picture.on('pointerdown', () => {
      this.sparkEffect(this.picture.x, this.picture.y);
    });

    //机
    this.desk = this.add.image(window.innerWidth/2,window.innerHeight/2+100,desk_key);
    this.desk.setTexture(desk_key);

    //キャラ
    this.anims.create({
      key: chara_key+'_read_anim_key',//chara0_read_anim_key
      frames: this.anims.generateFrameNames(chara_key, {
        prefix: charaItemData.properties.prefix+'/read/read_00',
        suffix: '.png',
        start: 0,
        end: 75,
        zeroPad: 2}
      ),
      frameRate: 5,
      repeat: -1
    });
    this.anims.create({
      key: chara_key+'_study_anim_key',
      frames: this.anims.generateFrameNames(chara_key, {
        prefix: charaItemData.properties.prefix+'/study/study_00',
        suffix: '.png',
        start: 0,
        end: 75, 
        zeroPad: 2
      }),
      frameRate: 18,
      repeat: -1
    });
    this.chara = this.add.sprite(window.innerWidth/2,window.innerHeight/2+100,chara_key).setScale(1)
    this.chara.play(chara_key+'_read_anim_key');
    this.chara.setInteractive();//クリック可能にする
    this.chara.on("pointerover", () => {//ホバー時
      this.input.setDefaultCursor('pointer')
    })
    this.chara.on("pointerout", () => {//ホバー外れたら
      this.input.setDefaultCursor('default')//マウスカーソル変更
    })
    this.chara.on('pointerdown', () => {
      this.sparkEffect(this.chara.x, this.chara.y);
    });

    //obj
    this.anims.create({
      key: obj_key+'_anim_key',//obj0_anim_key//このアニメーションの名前。sprite.play('bg_key')などあとで再生するときに使う。
      frames: this.anims.generateFrameNames(obj_key, {//bg というtexture atlas/spritesheetのキーからフレーム名を生成
        prefix: objItemData.properties.prefix,//"bg0_"などの画像ファイル名の先頭文字列
        suffix: '.png',//ファイルの拡張子
        start: 1,//フレーム番号の範囲のスタート地点
        end: 50,//フレーム番号の範囲のゴール地点
        zeroPad: 2//番号を2桁にする、00や01など
      }),
      frameRate: 18,//フレームレート
      repeat: -1//無限ループ
    });
    this.obj = this.add.sprite(window.innerWidth/3,window.innerHeight/2+200, obj_key).setScale(0.5).setOrigin(1)
    this.obj.play(obj_key+'_anim_key');
    this.obj.setInteractive();//クリック可能にする
    this.obj.on("pointerover", () => {//ホバー時
      this.input.setDefaultCursor('pointer')
    })
    this.obj.on("pointerout", () => {//ホバー外れたら
      this.input.setDefaultCursor('default')//マウスカーソル変更
    })
    this.obj.on('pointerdown', () => {
      this.sparkEffect(this.obj.x, this.obj.y);
    });

    /*
    if(!this.isLoggedIn){//ログアウト時のデフォルトのアセット
      //const bg_prefix="flames690/bg0_00"
      const chara_prefix="chara0"
      const obj_prefix="resized_flames300x300/candle_00"
      
      
      //this.background = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'bg');
      //this.background.setTexture(`bg`);
      //Phaserでbgのアニメーションを作成している処理
      this.anims.create({
        key: 'bg_key',//このアニメーションの名前。sprite.play('bg_key')などあとで再生するときに使う。
        frames: this.anims.generateFrameNames('bg', {//bg というtexture atlas/spritesheetのキーからフレーム名を生成
          prefix: bg_prefix,//"bg0_"などの画像ファイル名の先頭文字列
          suffix: '.png',//ファイルの拡張子
          start: 1,//フレーム番号の範囲のスタート地点
          end: 50,//フレーム番号の範囲のゴール地点
          zeroPad: 2//番号を2桁にする、00や01など
        }),
        frameRate: 18,//フレームレート
        repeat: -1//無限ループ
      });
      //this.background = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, 'bg')
      this.background = this.add.sprite(0, 0, 'bg').setOrigin(0)
      this.background.setScale(Math.max(this.scale.width / this.background.width, this.scale.height / this.background.height))
      this.background.play('bg_key');
      
      //絵のボード
      this.board = this.add.image(window.innerWidth/2+200,window.innerHeight/2+100,'board');
      this.board.setTexture('board');
      this.board.setScale(0.5)

      //絵
      this.picture = this.add.image(window.innerWidth/2+200,window.innerHeight/2+50,'picture');
      this.picture.setTexture('picture');
      this.picture.setDisplaySize(200,200)
      this.picture.setInteractive();//クリック可能にする
      this.picture.on("pointerover", () => {//ホバー時
        this.input.setDefaultCursor('pointer')
      })
      this.picture.on("pointerout", () => {//ホバー外れたら
        this.input.setDefaultCursor('default')//マウスカーソル変更
      })
      this.picture.on('pointerdown', () => {
        this.sparkEffect(this.picture.x, this.picture.y);
      });
      //this.picture.setScale(0.3)

      //机
      this.desk = this.add.image(window.innerWidth/2,window.innerHeight/2+100,'desk');
      //this.desk.setScale(2.3);// 画像のサイズを2倍にする
      this.desk.setTexture('desk');
      

      //キャラ
      //if (this.textures.get('chara') && this.textures.get('chara').has(`${chara_prefix}00.png`)) {
      this.anims.create({
        key: 'read',
        frames: this.anims.generateFrameNames('chara', {
          prefix: chara_prefix+'/read/read_00',
          suffix: '.png',
          start: 0,
          end: 75,
          zeroPad: 2}
        ),
        frameRate: 5,
        repeat: -1
      });
      this.anims.create({
        key: 'study',
        frames: this.anims.generateFrameNames('chara', {
          prefix: chara_prefix+'/study/study_00',
          suffix: '.png',
          start: 0,
          end: 75, 
          zeroPad: 2
        }),
        frameRate: 18,
        repeat: -1
      });
      this.chara = this.add.sprite(window.innerWidth/2,window.innerHeight/2+100,'chara').setScale(1)
      this.chara.play('read');
      this.chara.setInteractive();//クリック可能にする
      this.chara.on("pointerover", () => {//ホバー時
        this.input.setDefaultCursor('pointer')
      })
      this.chara.on("pointerout", () => {//ホバー外れたら
        this.input.setDefaultCursor('default')//マウスカーソル変更
      })
      this.chara.on('pointerdown', () => {
        this.sparkEffect(this.chara.x, this.chara.y);
      });

      //obj
      this.anims.create({
        key: 'obj_key',//このアニメーションの名前。sprite.play('bg_key')などあとで再生するときに使う。
        frames: this.anims.generateFrameNames('obj', {//bg というtexture atlas/spritesheetのキーからフレーム名を生成
          prefix: obj_prefix,//"bg0_"などの画像ファイル名の先頭文字列
          suffix: '.png',//ファイルの拡張子
          start: 1,//フレーム番号の範囲のスタート地点
          end: 50,//フレーム番号の範囲のゴール地点
          zeroPad: 2//番号を2桁にする、00や01など
        }),
        frameRate: 18,//フレームレート
        repeat: -1//無限ループ
      });
      //this.background = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, 'bg')
      this.obj = this.add.sprite(window.innerWidth/3,window.innerHeight/2+200, 'obj').setScale(0.5).setOrigin(1)
      //this.obj.setScale(Math.max(this.scale.width / this.obj.width, this.scale.height / this.obj.height))
      this.obj.play('obj_key');
      this.obj.setInteractive();//クリック可能にする
      this.obj.on("pointerover", () => {//ホバー時
        this.input.setDefaultCursor('pointer')
      })
      this.obj.on("pointerout", () => {//ホバー外れたら
        this.input.setDefaultCursor('default')//マウスカーソル変更
      })
      this.obj.on('pointerdown', () => {
        this.sparkEffect(this.obj.x, this.obj.y);
      });

      //}
    }
    */
    /*
    if (this.textures.get('obj') && this.textures.get('obj').has(`${obj_prefix}00.png`)) {
      this.anims.create({key: 'obj_key',frames: this.anims.generateFrameNames('obj', {prefix: obj_prefix,suffix: '.png',start: 0,end: 75,zeroPad: 2}),frameRate: 5,repeat: -1});
      this.obj = this.add.sprite(window.innerWidth/2+300,window.innerHeight/2+200,'obj').setScale(0.5)
      this.obj.play('obj_key');
    }
    */
  }

  /*async init_env(){
    //await init_env(){
    //init_env(){

    //ゲーム環境の初期ロード
    
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
        //this.load.image('desk', `${desk_path}`);
        //this.load.spritesheet(`${chara_path}`, `${chara_path}`, { frameWidth: 230,frameHeight: 230});
        //this.load.spritesheet(`chara-${chara_path}`, `${chara_path}`, { frameWidth: 230,frameHeight: 230});
        //this.load.atlas('chara', `${chara_img_path}`, `${chara_json_path}`);
        //this.load.atlas('obj', `${obj_img_path}`, `${obj_json_path}`);
        //this.load.image('picture', `${picture_path}`);
        
        if (desk_path) {
           this.load.image('desk', desk_path)
        }

        if (picture_path) {
          this.load.image('picture', picture_path)
        }

        if (chara_img_path && chara_json_path) {
          this.load.atlas('chara', chara_img_path, chara_json_path)
        }

        if (obj_img_path && obj_json_path) {
          this.load.atlas('obj', obj_img_path, obj_json_path)
        }


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
          if (music.path) {
            this.load.audio(`${music.path}`, `assets/images/item/${music.path}.mp3`);
          }
        }); 
        console.log('Music Names:', musicNames);
        console.log('Music Paths:', musicPaths);

        this.load.once('complete', () => {//画像のロードが全部終わったら実行
          console.log(`background-${bg_img_path}`)
          if (!this.textures.exists(bg_img_path)) {
            //this.background.setTexture(`background-${bg_path}`);
            if (this.textures.get('bg') && this.textures.get('bg').has(`${bg_prefix}00.png`)) {
              //Phaserでbgのアニメーションを作成している処理
              this.anims.create({
                key: 'bg_key',//このアニメーションの名前。sprite.play('bg_key')などあとで再生するときに使う。
                frames: this.anims.generateFrameNames('bg', {//bg というtexture atlas/spritesheetのキーからフレーム名を生成
                  prefix: bg_prefix,//"bg0_"などの画像ファイル名の先頭文字列
                  suffix: '.png',//ファイルの拡張子
                  start: 0,//フレーム番号の範囲のスタート地点
                  end: 75,//フレーム番号の範囲のゴール地点
                  zeroPad: 2//番号を2桁にする、00や01など
                }),
                frameRate: 18,//フレームレート
                repeat: -1//無限ループ
              });
            }
            //this.background = this.add.sprite(window.innerWidth, window.innerHeight,'bg').setScale(2)
            //this.background = this.add.sprite(window.innerWidth/2,window.innerHeight/2,'bg').setScale(2)
            //this.background = this.add.sprite(window.innerWidth/2,window.innerHeight/2,'bg').setDisplaySize(window.innerWidth, window.innerHeight);
            //this.background = this.add.sprite(window.innerWidth/2,window.innerHeight/2,'bg').setDisplaySize(window.innerWidth, window.innerHeight);

            //this.background.play('bg_key');//アニメーション再生
          }
            //this.background.setDisplaySize(this.cameras.main.width, this.cameras.main.height);

            //this.background.setDisplaySize(window.innerWidth, window.innerHeight);
            this.background = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'bg');
            //this.background = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, `background-${bg_path}`);
            //this.desk.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
        

            this.boad = this.add.image(window.innerWidth/2+200,window.innerHeight/2+100,'boad');
            this.boad.setTexture('boad');
            this.boad.setScale(0.5)

            this.picture = this.add.image(window.innerWidth/2+200,window.innerHeight/2+50,'picture');
            this.picture.setTexture('picture');
            this.picture.setDisplaySize(200,200)
            //this.picture.setScale(0.3)

            this.desk = this.add.image(window.innerWidth/2,window.innerHeight/2+100,'desk');
            //this.desk.setScale(2.3);// 画像のサイズを2倍にする
            this.desk.setTexture('desk');

            if (this.textures.get('chara') && this.textures.get('chara').has(`${bg_prefix}00.png`)) {
              this.anims.create({key: 'read',frames: this.anims.generateFrameNames('chara', {prefix: chara_prefix+'/read/read_00',suffix: '.png',start: 0,end: 75,zeroPad: 2}),frameRate: 5,repeat: -1});
              this.anims.create({key: 'study',frames: this.anims.generateFrameNames('chara', {prefix: chara_prefix+'/study/study_00',suffix: '.png',start: 0,end: 75, zeroPad: 2}),frameRate: 18,repeat: -1});
              this.chara = this.add.sprite(window.innerWidth/2,window.innerHeight/2+100,'chara').setScale(1)
              this.chara.play('read');
            }
            
            if (this.textures.get('obj') && this.textures.get('obj').has(`${bg_prefix}00.png`)) {
              this.anims.create({key: 'obj_key',frames: this.anims.generateFrameNames('obj', {prefix: obj_prefix,suffix: '.png',start: 0,end: 75,zeroPad: 2}),frameRate: 5,repeat: -1});
              this.obj = this.add.sprite(window.innerWidth/2+300,window.innerHeight/2+200,'obj').setScale(0.5)
              this.obj.play('obj_key');
            }

            this.menu_init()

            if(!musicPaths===0){//配列が空じゃなければ
              //this.music = new Music(this, 400, under_y,musicList);
              //this.music = new Music(this, 400, 1050,musicList);
              //this.music = new Music(this, 400, 1050,musicPaths,musicNames);
              //this.music = new Music(this, 200, 50,musicPaths,musicNames);
              this.music = new Music(this, 0, 0,musicPaths,musicNames);
              this.menuContainer.add(this.music);
            }
        });
        this.load.start();  
    } catch (error) {
      console.error("エラーが発生しました:", error);
    }
  }
  */
  
  menu_init(){
    const fullscreen=()=>{
      console.log("FULLSCREEN")
      if(this.scale.isFullscreen){
        this.scale.stopFullscreen()
      }else{
        this.scale.startFullscreen()
      }
    }
    const openMusic=()=>{
      console.log("BGMモーダルオープン")
      const musicNames = this.registry.get('musicNames')
      const musicPaths = this.registry.get('musicPaths')
      this.music = new Music(this, 0, -100,musicPaths,musicNames);
      this.menuContainer.add(this.music)
    }
    const FocusMode=()=>{
      this.isFocusMode = !this.isFocusMode;
      this.menuContainer.list.forEach(icon => {
        //if (icon !== this.focusIcon) {
        if (icon.name !== "focus_mode") {
          icon.setVisible(!this.isFocusMode);
        }else{
          //フォーカスモードのオンとオフのアイコンの切り替え
          if (this.isFocusMode) {
            icon.setTexture('focus_on_icon')
          }else{
            icon.setTexture('focus_off_icon')
          }
        }
      });

      //フォーカスモードのオンとオフのアイコンの切り替え
      /*if (this.isFocusMode) {
        this.focusIcon.setTexture('fullscreen_icon');
        this.focusIcon.setName('fullscreen_icon');
      } else {
        this.focusIcon.setTexture('focus_icon');
        this.focusIcon.setName('focus_icon');
      }*/
      /*this.focusIcon.setTexture(
        //this.isFocusMode ? 'focus_on' : 'focus_off'
        this.isFocusMode ? 'fullscreen_icon' : 'focus_icon'
      );*/
    }
    const openBag=()=>{
      this.modal = new ItemListModalWindow(this, window.innerWidth/2, window.innerHeight/2, window.innerWidth*0.6, window.innerHeight*0.6, '保有アイテム',this.user_data_json.owned_items,this.updateEnvironment.bind(this))
      this.modal.open()
      /*
      //const user_id = 0//未ログインの場合はuser_idを0にして未ログイン時のアイテムを取得する

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
        console.log(this.user_data_json.owned_items)
        //this.user_data_json.owned_items
        //const owned_items = [1,2,3,4,6,13,12,11];
        //const owned_item_ids = [1,2,3];
        //const owned_items=data.owned_items;
        //console.log(`owned_items: ${owned_items}`);
        this.modal = new ItemListModalWindow(this, window.innerWidth/2, window.innerHeight/2, window.innerWidth*0.6, window.innerHeight*0.6, '保有アイテム',this.user_data_json.owned_items,this.updateEnvironment.bind(this))
        this.modal.open()

        //this.modal = new ModalWindow(this, window.innerWidth / 2, window.innerHeight / 2, 400, 300, 'ログインしてください。\n会員限定でのサービスとなります。')
        //this.modal.open()
      }
      */
    }
    const openMission=()=>{
      if (this.isLoggedIn) {// ログイン済みの場合の処理
        this.scene.start('MissionScene'); // TestSceneに遷移
      } else {// 未ログインの場合の処理
        //this.modal = new ModalWindow(this, window.innerWidth / 2, window.innerHeight / 2, 400, 300, 'ログインしてください。\n会員限定でのサービスとなります。')
        this.modal = new ModalWindow(this, this.game_width / 2, this.game_height / 2, this.game_width*0.6, this.game_height*0.5, 'ログインしてください。\n会員限定でのサービスとなります。')
        this.modal.open()
      }
    }
    const openGacha=()=>{
        console.log('ガチャボタンがクリックされました');
        if (this.isLoggedIn) {// ログイン済みの場合の処理
          //this.music.saveAudioSettings()
          this.scene.start('GachaScene');
        } else {// 未ログインの場合の処理
          this.modal = new ModalWindow(this, window.innerWidth / 2, window.innerHeight / 2, 400, 300, 'ログインしてください。\n会員限定でのサービスとなります。')
          this.modal.open()
        }
    }
    const openAim=()=>{
      console.log('Aimページへ');
      window.location.href = "/top";
    }

    //this.CristalAmountButton = new CristalAmountButton(this, window.innerWidth*0.9, 50, this.isLoggedIn); 
    //this.menuContainer.add(this.CristalAmountButton); 

    /*this.uiLayer = this.add.layer()//UIレイヤーを作る
    //メニューの位置
    const margin = 20
    const menuY = this.scale.height - margin
    //アイコンを横一列に並べる
    const icons = [
      "fullscreen_icon",
      "music_icon",
      "focus_icon",
      "gacha_icon",
      "bag_icon",
      "mission_icon"
    ]
    const iconCount = icons.length
    const spacing = this.scale.width / (iconCount + 1)//横幅を均等割りする
    //アイコン配置
    icons.forEach((key, i) => {
      const x = spacing * (i + 1)
      const y = this.scale.height - 40
      const icon = this.add.image(x, y, key)
      icon.setScale(0.6)
      this.uiLayer.add(icon)
    })
    //UIをカメラから除外
    this.cameras.main.ignore(this.uiLayer)//これでゲームスクロールしてもUI固定
    
    //UIバー背景を追加
    const bar = this.add.rectangle(
      this.scale.width / 2,
      this.scale.height - 40,
      this.scale.width,
      80,
      0x000200,
      0.5
    )
    this.uiLayer.add(bar)
    */
    /*const icons = [
      "fullscreen_icon",
      "music_icon",
      "focus_icon",
      //"gacha_icon",
      "bag_icon",
      "mission_icon"
    ]*/
    this.menuItems = [
      {
        type: "icon",
        name: "fullscreen",
        key: "fullscreen_icon", 
        onClick: fullscreen, 
        scale:0.2, 
        show: () => true,
        tooltipText: "フルスクリーン" 
      },{ 
        type: "icon",
        name: "music",
        key: "music_icon", 
        onClick: openMusic, 
        scale:0.2, 
        show: () => true,
        tooltipText: "ミュージック" 
      },{ 
        type: "icon",
        name: "focus_mode",
        key: "focus_off_icon", 
        onClick: FocusMode, 
        scale:0.2, 
        show: () => true,
        tooltipText: "フォーカスモード" 
      },{ 
        type: "icon",
        name: "bag",
        key: "bag_icon", 
        onClick: openBag, 
        scale:0.2, 
        show: () => true,
        tooltipText: "所持品"
      },{ 
        type: "icon",
        name: "mission",
        key: "mission_icon", 
        onClick: openMission, 
        scale:0.2, 
        show: () => this.isLoggedIn,
        tooltipText: "ミッション" 
      },{ 
        type: "icon",
        name: "gacha",
        key: "gacha_icon", 
        onClick: openGacha, 
        scale:0.05, 
        show: () => this.isLoggedIn && this.rails_env==="development",
        tooltipText: "ガチャ" 
      },{ 
        type: "icon",
        name: "aim",
        key: "aim_logo", 
        onClick: openAim, 
        scale:0.1, 
        show: () => true,
        tooltipText: "Aimページ" 
      },{ 
        type: "component",
        create: () => new LoginButton(this, 0, 0, this.isLoggedIn),
        show: () => !this.isLoggedIn
      },{ 
        type: "component",
        create: () => new CreateAccountButton(this, 15, 0, this.isLoggedIn),
        show: () => !this.isLoggedIn
      },{ 
        type: "component",
        create: () => new LogoutButton(this, 0, 0, this.isLoggedIn),
        show: () => this.isLoggedIn
      },{ 
        type: "component",
        //create: () => new CristalAmountButton(this, window.innerWidth*0.9, 50, this.isLoggedIn),
        create: () => new CristalAmountButton(this, 150, 0, this.isLoggedIn),
        show: () => this.isLoggedIn
      }
    ]

    const spacing = 80
    //const menuContainer = this.add.container()
    this.menuContainer = this.add.container()
    //アイコンを配置していく
    this.menuItems
      .filter(item => item.show(this))//ログイン中とログアウト中でラインナップ変える
      .forEach((item, i) => {
        let element
        if (item.type === "icon") {
          element = this.add.image(i * spacing,0,item.key)
          element.setInteractive()
          element.setName(item.name)
          //icon.setScale(0.2)
          element.setScale(item.scale)
          //独自イベント
          element.on("pointerup", () => {
            item.onClick()
          })
        }
        if (item.type === "component") {
          element = item.create()
          element.x = i * spacing
          element.y = 0
        }
        //共通イベント実装
        element.on("pointerover", (pointer) => {//ホバー時
          //icon.setScale(1.1)
          this.input.setDefaultCursor('pointer')
          element.setTint(0x44ff44);  //緑色にティント
          this.tooltip.show(item.tooltipText, pointer.x + 10,pointer.y + 10)//吹き出し
        })
        element.on("pointerout", () => {//ホバー外れたら
          //icon.setScale(1)
          this.input.setDefaultCursor('default')//マウスカーソル変更
          element.clearTint();  // ティントをクリア
          this.tooltip.hide()//吹き出しを消す
        })
        element.on("pointerdown", () => {
          element.setTint(0xaaaaaa)
        })
        element.on("pointerup", () => {
          element.clearTint()
        })

        this.menuContainer.add(element)
    })
    this.menuContainer.setPosition(
      this.scale.width / 2 - (this.menuItems.length - 1) * spacing / 2,
      this.scale.height - 60
    )

    //this.cameras.main.ignore(menuContainer)//UIをカメラから除外・これでゲームスクロールしてもUI固定
 
    //アカウント作成/ログイン/ログアウトボタン
    //this.LoginoutButton = new LoginoutButton(this, window.innerWidth*0.2, 0, this.isLoggedIn);
    //this.LoginButton = new LoginButton(this, window.innerWidth*0.2, 0, this.isLoggedIn);
    //this.LogoutButton = new LogoutButton(this, window.innerWidth*0.2, 0, this.isLoggedIn);
    //this.CreateAccountButton = new CreateAccountButton(this, window.innerWidth*0.2, 0, this.isLoggedIn);
    //this.menuContainer.add(this.LoginButton);

    /*
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
    this.bagButton.on('pointerover', (pointer) => {//ボタンホバー時
      this.input.setDefaultCursor('pointer')
      this.bagButton.setTint(0x44ff44);  //緑色にティント
      this.tooltip.show("所持品一覧",pointer.x + 10,pointer.y + 10)//吹き出し
    })
    this.bagButton.on('pointerout', () => {//ボタンホバー外れたら
      this.input.setDefaultCursor('default')
      this.bagButton.clearTint();  // ティントをクリア
      this.tooltip.hide()
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
    this.mission_button.on('pointerover', (pointer) => {// ボタンのホバーエフェクト
      this.input.setDefaultCursor('pointer')
      this.mission_button.setTint(0x44ff44);  // ホバー時に緑色にティント
      this.tooltip.show("ミッション",pointer.x + 10,pointer.y + 10)//吹き出し
    });
    this.mission_button.on('pointerout', () => {
      this.input.setDefaultCursor('default')
      this.mission_button.clearTint();  // ホバーが外れたらティントをクリア
      this.tooltip.hide()
    });

    this.gacha_button = this.add.image(window.innerWidth*0.8, 50, 'gacha_icon').setInteractive().setScale(0.05);
    this.menuContainer.add(this.gacha_button);
    this.gacha_button.on('pointerdown', () => {
        console.log('ガチャボタンがクリックされました');
        if (this.isLoggedIn) {// ログイン済みの場合の処理
          this.music.saveAudioSettings()
          this.scene.start('GachaScene');
        } else {// 未ログインの場合の処理
          this.modal = new ModalWindow(this, window.innerWidth / 2, window.innerHeight / 2, 400, 300, 'ログインしてください。\n会員限定でのサービスとなります。')
          this.modal.open()
        }
    });      
    this.gacha_button.on('pointerover', (pointer) => {// ボタンのホバーエフェクト
      this.input.setDefaultCursor('pointer')
      this.gacha_button.setTint(0x44ff44);  // ホバー時に緑色にティント
      this.tooltip.show("ガチャ",pointer.x + 10,pointer.y + 10)//吹き出し
      
    });
    this.gacha_button.on('pointerout', () => {
      this.input.setDefaultCursor('default')
      this.gacha_button.clearTint();  // ホバーが外れたらティントをクリア
      this.tooltip.hide()
    });

    //const FULLSCREEN_button = this.add.text(20,20, "FULLSCREEN",{fontSize:"24px",backgroundColor:"#000",color:"#fff",padding:{x:10,y:5}}).setInteractive()
    //this.FULLSCREEN_button = this.add.text(window.innerWidth*6.5, 50, "FULLSCREEN",{fontSize:"24px",backgroundColor:"#000",color:"#fff",padding:{x:10,y:5}}).setInteractive()
    this.FULLSCREEN_button = this.add.image(window.innerWidth*6.5, 50, "fullscreen_icon").setInteractive().setScale(0.05);
    this.menuContainer.add(this.FULLSCREEN_button);
    this.FULLSCREEN_button.on("pointerdown",()=>{
      if(this.scale.isFullscreen){
        this.scale.stopFullscreen()
        console.log("FULLSCREEN")
      }else{
        this.scale.startFullscreen()
      }
    })
    this.FULLSCREEN_button.on('pointerover', (pointer) => {// ボタンのホバーエフェクト
      this.input.setDefaultCursor('pointer')
      this.FULLSCREEN_button.setTint(0x44ff44);  // ホバー時に緑色にティント
      this.tooltip.show("フルスクリーン",pointer.x + 10,pointer.y + 10)//吹き出し
      
    });
    this.FULLSCREEN_button.on('pointerout', () => {
      this.input.setDefaultCursor('default')
      this.FULLSCREEN_button.clearTint();  // ホバーが外れたらティントをクリア
      this.tooltip.hide()
    });

    this.music_open_button = this.add.image(window.innerWidth*4.5, 50, "music_icon").setInteractive().setScale(0.25);
    this.menuContainer.add(this.music_open_button);
    this.music_open_button.on("pointerdown",()=>{
      console.log("BGMモーダルオープン")
      const musicNames = this.registry.get('musicNames')
      const musicPaths = this.registry.get('musicPaths')
      this.music = new Music(this, 0, 0,musicPaths,musicNames);
    */
    /*if(!musicPaths===0){//配列が空じゃなければ
      //this.music = new Music(this, 400, under_y,musicList);
      //this.music = new Music(this, 400, 1050,musicList);
      //this.music = new Music(this, 400, 1050,musicPaths,musicNames);
      //this.music = new Music(this, 200, 50,musicPaths,musicNames);
      this.music = new Music(this, 0, 0,musicPaths,musicNames);
      this.menuContainer.add(this.music);
    }*/
    /*
    })
    this.music_open_button.on('pointerover', (pointer) => {// ボタンのホバーエフェクト
      this.input.setDefaultCursor('pointer')
      this.music_open_button.setTint(0x44ff44);  // ホバー時に緑色にティント
      this.tooltip.show("BGM",pointer.x + 10,pointer.y + 10)//吹き出し
      
    });
    this.music_open_button.on('pointerout', () => {
      this.input.setDefaultCursor('default')
      this.music_open_button.clearTint();  // ホバーが外れたらティントをクリア
      this.tooltip.hide()
    });

    this.focus_button = this.add.image(window.innerWidth*4.5, 50, "focus_icon").setInteractive().setScale(0.25);
    this.menuContainer.add(this.focus_button);
    this.focus_button.on("pointerdown",()=>{
      console.log("フォーカス")
    })
    this.focus_button.on('pointerover', (pointer) => {// ボタンのホバーエフェクト
      this.input.setDefaultCursor('pointer')
      this.focus_button.setTint(0x44ff44);  // ホバー時に緑色にティント
      this.tooltip.show("フォーカスモード",pointer.x + 10,pointer.y + 10)//吹き出し
      
    });
    this.focus_button.on('pointerout', () => {
      this.input.setDefaultCursor('default')
      this.focus_button.clearTint();  // ホバーが外れたらティントをクリア
      this.tooltip.hide()
    });

    this.CristalAmountButton = new CristalAmountButton(this, window.innerWidth*0.9, 50, this.isLoggedIn); 
    this.menuContainer.add(this.CristalAmountButton); 

    //自動リサイズ 
    this.scale.on('resize', this.resize, this);// リサイズイベントのリスナーを追加 
    this.resize.call(this, this.scale.gameSize);// 初期配置 
    */
  }

  /*
  debugWindow_init(){

    //デバッグウィンドウ
    console.log(this.rails_env)
    //document.addEventListener("keydown", (e) => {
    this.input.keyboard.on('keydown-D', () => {
      //if (railsEnv === "development" && e.key === "d") {
      if (this.rails_env === "development") {
        console.log("developmentでdボタン")
        //toggleDebugWindow()
        let debug = document.getElementById("debug-window")
        if (debug) {
          //debug.remove()
          debug.style.display = debug.style.display === "none" ? "block" : "none";
          return
        }
        const html = `
          <div id="debug-window" style="
            position:fixed;
            top:10px;
            left:10px;
            font-size:8px;
            width:70%;
            height:80%;
            background:rgba(0,0,0,0.75);
            color:white;
            padding:10px;
            z-index:9999;
          ">
            <h3>デバッグ</h3>
          
            <div id="debug-scroll" style="
              height:95%;
              overflow-y:auto;
              padding-right:6px;
            ">
              <p>Rails env: ${this.railsEnv}</p>
              
              <div style="margin-bottom:8px;">
                ログイン状態:
                <span id="login-state">false</span>
              </div>
              <button id="toggle-login-btn">
                ログインログアウト切り替え
              </button>
              <br>

              <div style="margin-bottom:8px;">
                FPS:0
              </div>

              <p>ゲームサイズwidth・this.scale.width: ${this.scale.width}</p>
              <p>ゲームサイズheight・this.scale.height: ${this.scale.height}</p>

              <p>ブラウザウィンドウのサイズ・window.innerWidth: ${window.innerWidth}</p>
              <p>ブラウザウィンドウのサイズ・window.innerHeight: ${window.innerHeight}</p>

              <div style="background:rgba(255,255,255,0.1); padding:10px; margin-bottom:10px;">
                <label style="display:block; margin:5px 0; cursor:pointer;">
                  <input type="checkbox" id="check-gacha-skip-save"> 
                  ガチャを回した後にDBに保存しない・isGachaSkipSave
                </label>
                <label style="display:block; margin:5px 0; cursor:pointer;">
                  <input type="checkbox" id="check-gacha-no-cost"> 
                  ガチャを回した後にクリスタルを消費しない・isGachaNoCost
                </label>
              </div>

              <button id="delete-user_data_json-btn">
                user_data_jsonデータの削除
              </button>

              <!-- アコーディオン -->
              <details open style="margin-bottom:6px;">
                <summary style="cursor:pointer;">user_data_json</summary>
                <pre id="debug-game" style="
                  white-space:pre-wrap;
                  background:rgba(255,255,255,0.08);
                  padding:6px;
                  color:white
                ">
                ${JSON.stringify(this.user_data_json, null, 2)}
                </pre>
              </details>

              <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
              <p>
              v
              v
              </p>
              <br>
            </div>
          </div>
        `
        document.body.insertAdjacentHTML("beforeend", html)

        //ログイン状態切り替え
        const toggleLoginBtn = document.getElementById("toggle-login-btn");
        const loginStateText = document.getElementById("login-state");
        toggleLoginBtn.addEventListener("click", () => {
          this.isLoggedIn = !this.isLoggedIn;
          loginStateText.textContent = this.isLoggedIn;
          console.log("Login状態:", this.isLoggedIn);
          this.refreshMenu()//ログイン状態が変わったらUI再生成
        });

        const delete_user_data_json_btn = document.getElementById("delete-user_data_json-btn");
        delete_user_data_json_btn.addEventListener("click", () => {
          localStorage.removeItem('user_data_json');
          console.log("user_data_jsonのデータ削除");
        });

        
      }
    })
  }
  */

  refreshMenu(){
    this.menuContainer.removeAll(true)
    const visibleItems = this.menuItems.filter(item => item.show(this))
    const spacing = 80
    visibleItems
      //.forEach((item,i)=>{
      .filter(item => item.show(this))//ログイン中とログアウト中でラインナップ変える
      .forEach((item, i) => {
        let element
        if (item.type === "icon") {
          element = this.add.image(i * spacing,0,item.key)
          element.setInteractive()
          //icon.setScale(0.2)
          element.setScale(item.scale)
          //独自イベント
          element.on("pointerup", () => {
            item.onClick()
          })
        }
        if (item.type === "component") {
          element = item.create()
          element.x = i * spacing
          element.y = 0
        }
        //共通イベント実装
        element.on("pointerover", (pointer) => {//ホバー時
          //icon.setScale(1.1)
          this.input.setDefaultCursor('pointer')
          element.setTint(0x44ff44);  //緑色にティント
          this.tooltip.show(item.tooltipText, pointer.x + 10,pointer.y + 10)//吹き出し
        })
        element.on("pointerout", () => {//ホバー外れたら
          //icon.setScale(1)
          this.input.setDefaultCursor('default')//マウスカーソル変更
          element.clearTint();  // ティントをクリア
          this.tooltip.hide()//吹き出しを消す
        })
        element.on("pointerdown", () => {
          element.setTint(0xaaaaaa)
        })
        element.on("pointerup", () => {
          element.clearTint()
        })

        this.menuContainer.add(element)
      
      /*const icon = this.add.image(i * 80,0,item.key)
      icon.setInteractive()
      icon.setScale(item.scale)
      //共通イベント実装
      icon.on("pointerover", (pointer) => {//ホバー時
        //icon.setScale(1.1)
        this.input.setDefaultCursor('pointer')
        icon.setTint(0x44ff44);  //緑色にティント
        this.tooltip.show(item.tooltipText, pointer.x + 10,pointer.y + 10)//吹き出し
      })
      icon.on("pointerout", () => {//ホバー外れたら
        //icon.setScale(1)
        this.input.setDefaultCursor('default')//マウスカーソル変更
        icon.clearTint();  // ティントをクリア
        this.tooltip.hide()//吹き出しを消す
      })
      icon.on("pointerdown", () => {
        icon.setTint(0xaaaaaa)
      })
      icon.on("pointerup", () => {
        icon.clearTint()
      })
      //独自イベント
      icon.on("pointerup", () => {
        item.onClick()
      })
      */
      //this.menuContainer.add(icon)
    })
  }
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
  
  //サイズ指定
  //resize(gameSize) { 
    /*
    // キャンバスのサイズを取得 
    const width = gameSize.width; 
    const height = gameSize.height; 
    this.under.setDisplaySize(window.innerWidth, window.innerHeight);

    this.background.setPosition(window.innerWidth/2, window.innerHeight/2).setDisplaySize(window.innerWidth, window.innerHeight);
    //this.menuContainer.setPosition(0, window.innerHeight-100); 
    this.bagButton.setPosition(window.innerWidth*0.7, 50); 
    this.mission_button.setPosition(window.innerWidth*0.75, 50); 
    this.gacha_button.setPosition(window.innerWidth*0.8, 50); 
    this.CristalAmountButton.setPosition(window.innerWidth*0.9, 50);  
    this.FULLSCREEN_button.setPosition(window.innerWidth*0.65, 50);
    this.music_open_button.setPosition(window.innerWidth*0.6, 50);  
    this.focus_button.setPosition(window.innerWidth*0.55, 50);  
    */
  //}

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
  //サーバとの通信をメソッド化して使いまわせるように共通化
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


  sparkEffect(x, y) {
    console.log("sparkEffect")
    //const particles = this.add.particles(x, y, 'spark', {
    /*const particles = this.add.particles(x+100, y+100, 'shop_icon', {

      speed: { min: 50, max: 200 },
      angle: { min: 0, max: 360 },

      scale: { start: 0.6, end: 0 },

      lifespan: 600,

      blendMode: 'ADD',

      quantity: 20
    });

    // 一度だけ再生
    particles.explode(20, x, y);

    // 自動削除
    this.time.delayedCall(600, () => {
      particles.destroy();
    });
    */
    const particles = this.add.particles(0, 0, 'shop_icon', {

      speed: { min: 50, max: 200 },
      angle: { min: 0, max: 360 },

      scale: { start: 0.6, end: 0 },

      alpha: { start: 1, end: 0 },

      lifespan: 600,

      quantity: 20,

      blendMode: 'ADD'
    });

    particles.explode(20, x, y);

    this.time.delayedCall(600, () => {
      particles.destroy();
    });
  }


  //update()は毎フレーム呼ばれる・約60fpsで呼ばれる・Phaser組込みメソッド
  update() {

  }
  //オブジェクトの変更した時の処理
  async updateEnvironment(item,resolved_path) {
    console.log(item)
    // #region
    /*
    //updateBackground(item_path) {
    //updateEnvironment(item,resolved_path) {
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
    let prefix=item.properties['prefix'];//console.log("prefix:"+prefix)
    //item.path= resolved_path
    //console.log("img_path: "+img_path);
    */
    // #endregion
    /*if(item.item_type=='chara' || item.item_type=='background' || item.item_type=='obj'){
      const sendData = { path: item.path };
      respons_data = await this.ajax('/resolve_path_img_json',sendData)
      img_path = respons_data.img_path
      json_path = respons_data.json_path
    }else{
      const sendData = { paths: [item.path] };
      respons_data = await this.ajax('/resolve_asset_path',sendData)
      img_path = respons_data.resolved_paths
    }
    */
   
    if(item.item_type=="chara"){
      const old_chara_key = this.user_data_json.placed_items.chara //変更前の古いアイテムのkeyの取得chara0,chara1
      this.chara.stop();// 現在のアニメーションを停止
      if (this.anims.exists(old_chara_key+'_read_anim_key') && this.anims.exists(old_chara_key+'_study_anim_key')) {// 既存のアニメーションを削除
        this.anims.remove(old_chara_key+'_read_anim_key');
        this.anims.remove(old_chara_key+'_study_anim_key');
      }
      this.chara.destroy()// 既存のキャラを削除
      //this.textures.remove('chara');// 古いテクスチャを削除（メモリ解放）

      //新しく作る
      this.anims.create({key: item.key+'_read_anim_key',frames: this.anims.generateFrameNames(item.key, {prefix: item.properties['prefix']+'/read/read_00',suffix: '.png',start: 0,end: 75,zeroPad: 2}),frameRate: 5,repeat: -1});
      this.anims.create({key: item.key+'_study_anim_key',frames: this.anims.generateFrameNames(item.key, {prefix: item.properties['prefix']+'/study/study_00',suffix: '.png',start: 0,end: 75, zeroPad: 2}),frameRate: 18,repeat: -1});
      this.chara = this.add.sprite(window.innerWidth/2,window.innerHeight/2+100,item.key).setScale(1)
      this.chara.setTexture(item.key);// テクスチャを更新
      this.chara.play(item.key+'_study_anim_key');//アニメーションを再生

      this.user_data_json.placed_items.chara = item.key;//user_data_jsonの更新

      //this.chara.play('read');
      /*
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
      */
      /*this.load.atlas('chara', `${img_path}`, `${json_path}`);
      this.load.once('complete', () => {
        this.anims.create({key: 'read',frames: this.anims.generateFrameNames('chara', {prefix: prefix+'/read/read_00',suffix: '.png',start: 0,end: 75,zeroPad: 2}),frameRate: 5,repeat: -1});
        this.anims.create({key: 'study',frames: this.anims.generateFrameNames('chara', {prefix: prefix+'/study/study_00',suffix: '.png',start: 0,end: 75, zeroPad: 2}),frameRate: 18,repeat: -1});
        const chara = this.add.sprite(window.innerWidth/2,window.innerHeight/2+100,'chara').setScale(1)
        chara.play('read');
      });*/
    }else if(item.item_type=="background"){
      const old_bg_key = this.user_data_json.placed_items.bg //変更前の古いアイテムのkeyの取得chara0,chara1
      this.background.stop();// 現在のアニメーションを停止
      if (this.anims.exists(old_bg_key+'_anim_key') && this.anims.exists(old_bg_key+'_anim_key')) {// 既存のアニメーションを削除
        this.anims.remove(old_bg_key+'_anim_key');
        this.anims.remove(old_bg_key+'_anim_key');
      }
      this.background.destroy()// 既存のbgを削除

      //新しく作る
      this.anims.create({key: item.key+'_anim_key',frames: this.anims.generateFrameNames(item.key, {prefix: item.properties['prefix'],suffix: '.png',start: 0,end: 75,zeroPad: 2}),frameRate: 5,repeat: -1});
      this.background = this.add.sprite(0, 0, item.key).setOrigin(0)
      this.background.setScale(Math.max(this.scale.width / this.background.width, this.scale.height / this.background.height))
      this.background.play(item.key+'_anim_key');//bg0_anim_key

      this.user_data_json.placed_items.bg = item.key;//user_data_jsonの更新

      /*this.background.stop();// 現在のアニメーションを停止
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
      */
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
      const old_obj_key = this.user_data_json.placed_items.obj //変更前の古いアイテムのkeyの取得chara0,chara1
      this.obj.stop();// 現在のアニメーションを停止
      if (this.anims.exists(old_obj_key+'_anim_key') && this.anims.exists(old_obj_key+'_anim_key')) {// 既存のアニメーションを削除
        this.anims.remove(old_obj_key+'_anim_key');
        this.anims.remove(old_obj_key+'_anim_key');
      }
      this.obj.destroy()// 既存のbgを削除

      //新しく作る
      this.anims.create({key: item.key+'_anim_key',frames: this.anims.generateFrameNames(item.key, {prefix: item.properties['prefix'],suffix: '.png',start: 0,end: 75,zeroPad: 2}),frameRate: 5,repeat: -1});
      this.obj = this.add.sprite(window.innerWidth/3,window.innerHeight/2+200, item.key).setScale(0.5).setOrigin(1)
      this.obj.play(item.key+'_anim_key');
      this.user_data_json.placed_items.obj = item.key;//user_data_jsonの更新


      /*this.obj.stop();// 現在のアニメーションを停止
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
      */
      /*this.load.atlas('obj', `${img_path}`, `${json_path}`);
      this.load.once('complete', () => {
        this.anims.create({key: 'obj_key',frames: this.anims.generateFrameNames('obj', {prefix: prefix,suffix: '.png',start: 0,end: 75,zeroPad: 2}),frameRate: 18,repeat: -1});
        this.obj = this.add.sprite(window.innerWidth/2,window.innerHeight/2,'obj').setScale(2)
        this.obj.play('obj_key');
      });*/
    }else if(item.item_type=="desk"){
      this.desk.setTexture(item.key);
      this.user_data_json.placed_items.desk = item.key;//user_data_jsonの更新
      /*this.load.image('new-desk', `${img_path}`);
      this.load.once('complete', () => {
        //this.desk = this.add.image(window.innerWidth/2,window.innerHeight/2+100,'desk');
        this.desk.setTexture('new-desk');
      });
      */
    }else if(item.item_type=="picture"){
      this.picture.setTexture(item.key);
      this.user_data_json.placed_items.picture = item.key;//user_data_jsonの更新
      /*this.load.image('new-picture', `${img_path}`);
      this.load.once('complete', () => {
        //this.picture = this.add.image(window.innerWidth/2+200,window.innerHeight/2+100,'picture');
        this.picture.setTexture('new-picture');
        //this.picture.setScale(0.3)
      });
      */
    }
    //DBに反映
    if(this.isLoggedIn){
      //const sendData = { type: item.type, id: item.id };
      const sendData = { new_placed_items: this.user_data_json.placed_items };
      const data = this.ajax('/update_env',sendData)
    }

    //registryを更新（参照渡しなのでそのままでも変わるが明示的に）
    this.registry.set('user_data_json', this.user_data_json);

    // LocalStorageに保存（これでリロードしても消えない）
    localStorage.setItem('user_data_json', JSON.stringify(this.user_data_json));
    
    this.load.start();
    this.scene.restart();
  }
  updateObjectPosition() {
    if (this.under) {
      // オブジェクトを画面の一番下に配置
      this.under.setPosition(this.cameras.main.width / 2, this.cameras.main.height);
    }
  }

  //shutdown()はSceneが停止するときに呼ばれる・this.scene.stop()または別Sceneに切り替えのとき・Phaser組込みメソッド
  shutdown(){

  }
	//destroy()はSceneが 完全に削除されるときに呼ばれる・メモリ解放などに使う・Phaser組込みメソッド
  destroy(){

  }
}