import Phaser from 'phaser'

export default class PreloadScene extends Phaser.Scene {

  constructor() {
    super('PreloadScene')
    this.isLoggedIn = false;// ログイン状態を保持するフラグ
  }

  init() {
    console.log("ローディング中...")

    this.background = null
    this.desk = null

    //素材のアセットコンパイルでのフィンガープリント付きのパスを取得
    const gameElement = document.querySelector('[data-react-class="AimRoom"]');
    this.props = JSON.parse(gameElement.getAttribute('data-react-props'));
    console.dir(this.props)//"MainSceneのinit()でrailsから受け取った[data-react-class="AimRoom"]のdomのデータ："

    //ログイン判定
    // #region
    /*this.loginPlugin = this.plugins.get('LoginPlugin');
    this.loginPlugin.checkLoginStatus().then(isLoggedIn => {
      this.isLoggedIn=isLoggedIn
      this.registry.set('isLoggedIn', isLoggedIn)//registryで他のシーンでもログインログアウトのフラグを使い回す
    });
    */
   // #endregion
    this.isLoggedIn=this.props.isLoggedIn
    this.registry.set('isLoggedIn', this.isLoggedIn)//registryで他のシーンでもログインログアウトのフラグを使い回す

    let user_data_json

    if (localStorage.getItem('user_data_json')) {//localStorageにデータがあればパースして使用
      try {
        user_data_json = JSON.parse(localStorage.getItem('user_data_json'));
        console.log("LocalStorageからデータを読み込みました", user_data_json);
        
        //ログイン中ならuser_data_json書き換え
        if(this.isLoggedIn){
          user_data_json.placed_items = this.props.aim_room_data.placed_items;
          console.log("ログイン中ならuser_data_jsonをaim_room_data.placed_itemsに書き換え:",this.props.aim_room_data.placed_items)
          user_data_json.owned_items.push(...this.props.user_items_not_default_data);
          user_data_json.user_info.user_id=this.props.user_id
          user_data_json.user_info.user_name=this.props.user_name

          
        }
      } catch (e) {
        console.error("LocalStorageのuser_data_jsonのデータ解析エラー:", e);
        user_data_json = this.getDefaultUserDataJson(); // 壊れていた時のフォールバック
      }
    } else {//なければデフォルト値を定義
      console.log("user_data_jsonのデータがないため初期データを生成します");
      user_data_json = this.getDefaultUserDataJson();
      // 初期状態を保存しておく
      //localStorage.setItem('user_data_json', JSON.stringify(user_data_json));
    }

    //ユーザーデータ・所持品や現在の設定(アイテムの配置状態など)
    /*user_data_json={
      //owned_item_ids: [1,2,3,4,5,7,11,14,15,16],
      owned_items: [
        { id: 1, name:"bg0", item_type: "background", path: "" , key: "bg0", description: "bg0", properties: { prefix: "flames690/bg0_00" } },
        { id: 2, name:"chara0",item_type: "chara", path:"" , key: "chara0", description: "chara0", properties: { prefix: "chara0" } },
        { id: 3, name:"desk0",item_type: "desk", path: "", key: "desk0", description: "desk0", properties: {} },
        { id: 4, name:"しずかな音楽",item_type: "music", path: "", key: "music01", description: "music01", properties: {} },
        { id: 5, name:"シャイニングスター",item_type: "music", path: "", key: "music02", description: "music02", properties: {} },
        { id: 7, name:"bg1",item_type: "background", path: "", key: "bg1", description: "bg1", properties: { prefix: "open_toons_output/bg1.00" } },
        { id: 11, name:"chara1",item_type: "chara", path: "", key: "chara1", description: "chara1", properties: { prefix: "chara1" } },
        { id: 14, name:"board0",item_type: "board", path: "", key: "board0", description: "board0", properties: {} },
        { id: 15, name:"picture0",item_type: "picture", path: "", key: "picture0", description: "picture0", properties: {} },
        { id: 16, name:"キャンドル",item_type: "obj", path: "", key: "obj2", description: "obj2", properties: { prefix: "resized_flames300x300/candle_00" } },
      ],
      placed_items:{
        bg: "bg0",
        chara: "chara0",
        desk: "desk0",
        board: "board0",
        picture: "picture0",
        obj: "obj2",
      }
    }
    */

    // Phaserのグローバルデータ保存場所（registry）にセット
    // これでどのシーンからも this.registry.get('user_data') で呼べる
    this.registry.set('user_data_json', user_data_json)

    this.registry.set('gachas_data', this.props.gachas_data)
    this.registry.set('missions_data', this.props.missions_data)

  }

  getDefaultUserDataJson() {
    return {
      user_info:{
        isLoggedIn: this.props.isLoggedIn,
        user_id: 1,
        user_name: "ログアウトユーザー"
      },
      owned_items: [
        { id: 1, name:"bg0", item_type: "background",  key: "bg0", description: "bg0", properties: { prefix: "flames690/bg0_00" } },
        { id: 2, name:"chara0",item_type: "chara",  key: "chara0", description: "chara0", properties: { prefix: "chara0" } },
        { id: 3, name:"机1",item_type: "desk",  key: "desk0", description: "desk0", properties: {} },
        { id: 4, name:"しずかな音楽",item_type: "music", key: "music01", description: "music01", properties: {} },
        { id: 5, name:"シャイニングスター",item_type: "music", path: "", key: "music02", description: "music02", properties: {} },
        { id: 7, name:"bg1",item_type: "background", key: "bg1", description: "bg1", properties: { prefix: "open_toons_output/bg1.00" } },
        { id: 11, name:"chara1",item_type: "chara", key: "chara1", description: "chara1", properties: { prefix: "chara1" } },
        { id: 14, name:"board0",item_type: "board", key: "board0", description: "board0", properties: {} },
        { id: 15, name:"picture0",item_type: "picture", key: "picture0", description: "picture0", properties: {} },
        { id: 16, name:"キャンドル",item_type: "obj", key: "obj2", description: "obj2", properties: { prefix: "resized_flames300x300/candle_00" } },
        { id: 17, name:"机2",item_type: "desk", key: "desk1", description: "desk2", properties: { prefix: "resized_flames300x300/candle_00" } },
      ],
      placed_items:{
        bg: "bg0",
        chara: "chara0",
        desk: "desk0",
        board: "board0",
        picture: "picture0",
        obj: "obj2",
      }
    };
  }

  preload() {

    const width = this.scale.width
    const height = this.scale.height

    // 背景
    const progressBox = this.add.graphics()
    const progressBar = this.add.graphics()

    progressBox.fillStyle(0x222222,0.8)
    progressBox.fillRect(width/2-200,height/2-25,400,50)

    // テキスト
    const loadingText = this.add.text(
      width/2,
      height/2-60,
      "Loading...",
      {
        fontSize:"24px",
        color:"#ffffff"
      }
    ).setOrigin(0.5)

    // 進捗
    this.load.on("progress",(value)=>{

      progressBar.clear()
      progressBar.fillStyle(0xffffff,1)

      progressBar.fillRect(
        width/2-190,
        height/2-15,
        380*value,
        30
      )

    })

    /*this.scale.on("resize",(gameSize)=>{
      const { width, height } = gameSize
      loadingText.setPosition(width/2,height/2-60)
    })*/

    //ロード終了時
    this.load.on('complete', () => {
      progressBar.destroy()
      progressBox.destroy()
      //loadingText.destroy()
      
      //this.scene.start('MainScene')
      this.scene.start('MissionScene')

    })


    /*
    ==========
    Assets・ゲームで使う画像・音声などを読み込む処理
    ==========
    */

    console.log(this.props.rails_env)
    this.registry.set('rails_env', this.props.rails_env)

    //デフォルトのアセット
    //if(!this.isLoggedIn){//ログアウト時
    //this.load.image('background', this.props.back);
    //this.load.image('bg', this.props.default_bg);
    //this.load.atlas('bg', `${this.props.bg0_img}`, `${this.props.bg0_json}`);
    this.load.atlas('bg0', `${this.props.bg0_img}`, `${this.props.bg0_json}`);
    this.load.atlas('bg1', `${this.props.bg1_img}`, `${this.props.bg1_json}`);
    this.load.image('bg0_thm', this.props.bg0_thm);
    this.load.image('bg1_thm', this.props.bg1_thm);

    //this.load.image('desk', this.props.desk0_img);//配置するものの読み込み
    this.load.image('desk0', this.props.desk0_img);//所持品一覧用の読み込み
    this.load.image('desk1', this.props.desk1_img);

    //this.load.spritesheet('character', this.props.default_chara, { frameWidth: 341, frameHeight: 341 });
    //this.load.atlas('chara', this.props.chara0_img, this.props.chara0_json)
    this.load.atlas('chara0', this.props.chara0_img, this.props.chara0_json)
    this.load.atlas('chara1', this.props.chara1_img, this.props.chara1_json)
    this.load.image('chara0_thm', this.props.chara0_thm);
    this.load.image('chara1_thm', this.props.chara1_thm);

    //this.load.audio('music01', this.props.default_music1);
    //this.load.audio('music02', this.props.default_music2);
    //const musicList=data.musics
    //console.log(`musicList: ${musicList}`);
    this.load.image('music_thm', this.props.default_music_thm);
    const musicNames = [];
    const musicPaths = [];
    //musicNames.push('music01');
    //musicNames.push('music02');
    //musicNames.push(this.props.default_music1);
    //musicNames.push(this.props.default_music2);
    musicNames.push("しずかな音楽");
    musicNames.push("シャイニングスター");
    musicPaths.push(this.props.default_music1);
    musicPaths.push(this.props.default_music2);
    this.load.audio(this.props.default_music1, this.props.default_music1);
    this.load.audio(this.props.default_music2, this.props.default_music2);
    this.registry.set('musicNames', musicNames)
    this.registry.set('musicPaths', musicPaths)
    /*musicList.forEach(music => {
      console.log(`Name: ${music.name}, Path: ${music.path}`);
      musicNames.push(music.name);
      musicPaths.push(music.path);
      if (music.path) {
        this.load.audio(`${music.path}`, `assets/images/item/${music.path}.mp3`);
      }
    });*/
    //console.log('Music Names:', musicNames);
    //console.log('Music Paths:', musicPaths);

    //this.load.image('board', this.props.board0_img);//配置するものの読み込み
    this.load.image('board0', this.props.board0_img);//所持品一覧用の読み込み

    //this.load.image('picture', this.props.picture0_img);//配置するものの読み込み
    this.load.image('picture0', this.props.picture0_img);//所持品一覧用の読み込み

    //this.load.atlas('obj', this.props.obj2_img, this.props.obj2_json)
    this.load.atlas('obj2', this.props.obj2_img, this.props.obj2_json)
    this.load.image('obj2_thm', this.props.obj2_thm);


    //システム共通のアセット
    this.load.image('shop_icon', this.props.shop_icon);
    this.load.image('bag_icon', this.props.bag_icon);
    this.load.image('mission_icon', this.props.mission_icon);
    this.load.image('money', this.props.money_icon);
    this.load.image('music_icon', this.props.music_icon);
    this.load.image('focus_on_icon', this.props.focus_on_icon);
    this.load.image('focus_off_icon', this.props.focus_off_icon);
    this.load.image('fullscreen_icon', this.props.fullscreen_icon);
    this.load.image('aim_logo', this.props.aim_logo);

    this.load.image('gacha_icon', this.props.gacha_icon);
    this.load.image('gacha_backgroud', this.props.gacha_backgroud);
    this.load.image('other_backgroud', this.props.other_backgroud);
    this.load.image('check', this.props.check_icon);

    this.load.image('playButton', this.props.play_button);
    this.load.image('pauseButton', this.props.pause_button);
    this.load.image('nextButton', this.props.next_button);
    this.load.image('prevButton', this.props.prev_button);

    this.load.image('item_modal_bg', this.props.item_modal_bg);
    this.load.image('item_modal_bg2', this.props.item_modal_bg2);
    this.load.image('close', this.props.close);

  }

}