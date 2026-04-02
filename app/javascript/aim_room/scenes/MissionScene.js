import Phaser from 'phaser'
import React, { useEffect, useRef } from 'react'
import Header from '../components/Header.js';
import ModalContainer from '../components/ModalContainer'
import DebugWindow from '../components/DebugWindow.js'; // パスは


export default class MissionScene extends Phaser.Scene {

  constructor() {
    super('MissionScene');
    this.isLoggedIn=false;
    this.cursors;
    this.camera;
    this.loginSection;
    this.signupSection;
    this.loginMask;
    this.signupMask;
    this.isDragging = false;
    this.lastPointerPosition = { x: 0, y: 0 };
    this.getButton;

    this.missions_data;
    this.userMissionStatus;
    //this.loginSection_badge;
  }

  init() {
    //素材のアセットコンパイルでのフィンガープリント付きのパスを取得
    //const gameElement = document.querySelector('[data-react-class="AimRoom"]');
    //this.props = JSON.parse(gameElement.getAttribute('data-react-props'));
        
    this.isLoggedIn = this.registry.get('isLoggedIn')
    // #region
    /*this.loginPlugin = this.plugins.get('LoginPlugin');
    this.loginPlugin.checkLoginStatus().then(isLoggedIn => {
      this.isLoggedIn=isLoggedIn
    });*/
    // #endregion

    this.missions_data = this.registry.get('missions_data')
    console.log("this.missions_data:",this.missions_data)
    //console.log("this.missions_data:"+JSON.stringify(this.missions_data))

    this.rails_env = this.registry.get('rails_env')

    //ユーザーデータ・所持品や現在の設定(アイテムの配置状態など)
    this.user_data_json = this.registry.get('user_data_json')

  }

  preload() {
    /*this.load.image('gacha_backgroud', this.props.gacha_backgroud);
    this.load.image('other_backgroud', this.props.other_backgroud);
    this.load.image('check', this.props.check_icon);
    */
  }

  create() {
    //「読み込み中」のテキスト表示
    this.loadingText = this.add.text(400, 300, 'Loading Missions...', { fontSize: '32px' }).setOrigin(0.5);

    //セットアップを開始（戻り値を受け取ろうとせず、呼び出すだけでOK）
    //非同期でデータを取得（awaitせずにメソッドを呼ぶだけ）
    //fetchを中間に入れることで処理が止まらない
    this.loadAndPrepareUI();
  }

  //UIのセットアップ・処理待ちを行わせて処理が止まらないようにする
  async loadAndPrepareUI() {
    console.log("loadAndPrepareUIメソッド")

    //ユーザーのミッション状態を取得・戻り値を1つのオブジェクトとして取得
    //awaitで処理待ち
    //const data = await checkMissionBonus();
    const data = await this.checkMissionBonus();
    this.userMissionStatus = data;
    //console.log("ユーザーのミッション状態を取得・missionStatus:",this.missionStatus)
    console.log("ユーザーのミッション状態を取得・missionStatus:",JSON.stringify(this.userMissionStatus))

    //データが届いたら「読み込み中」を消す
    this.loadingText.destroy();

    //debubウィンドウに渡すデータ
    const forDebugData={
      missions_data: this.missions_data,
      userMissionStatus:this.userMissionStatus
    }
    //デバッグウィンドウの初期化
    this.debugWindow = new DebugWindow(this,forDebugData);
    this.debugWindow.init();

    //ミッションの一覧の画面を作成し表示
    //ユーザーのミッションデータを使いミッション画面のUIを作成
    this.setup_ui_mission(this.userMissionStatus);
    //this.create_mission_ui(this.missionStatus)

  }
  //ユーザーのミッション状態を取得・戻り値を1つのオブジェクトとして取得
  async checkMissionBonus(){
    // #region
    /*fetch('/checkMissionBonus', { 
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content 
      }
    })
    .then(response => response.json())
    .then(data => {
    */
    // #endregion
   try {
      const response = await fetch('/checkMissionBonus', { 
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content 
        }
      });
      //fetch の完了を待機
      const data = await response.json();
      //console.log("checkMissionBonusのfetch完了時のdata：",data)

      //変数が多いのでjsonにまとめる
      // 1つのオブジェクトにまとめて返却する
      return {
        login: {
          newAchiveNum: data.loginMission.newAchiveNum,
          alreadyGettedNum: data.loginMission.alreadyGetted,
          YetGettingNewAchiveNum: data.loginMission.newAchiveNum > 0
        },
        gacha: {
          newAchiveNum: data.gachaRollMission.newAchiveNum,
          alreadyGettedNum: data.gachaRollMission.alreadyGetted,
          YetGettingNewAchiveNum: data.gachaRollMission.newAchiveNum > 0
        },
        playtime: {
          newAchiveNum: data.playtimeMission.newAchiveNum,
          alreadyGettedNum: data.playtimeMission.alreadyGetted,
          YetGettingNewAchiveNum: data.playtimeMission.newAchiveNum > 0
        }
      };

      // #region  一気に取得
      /*
      //console.log("既にゲットしてるログボGettedLoginBonus"+data.GettedLoginBonus)
      //console.log(data.longstay)
      this.longinBonusNewAchiveNum = data.loginMission.newAchiveNum
      this.longinBonusAlreadyGettedNum = data.loginMission.alreadyGetted
      let longinBonusNewAchiveNum_for = data.loginMission.newAchiveNum;//forで使う
      let loginYetGettingNewAchiveNum = 0 < this.longinBonusNewAchiveNum;//true or false

      this.gachaRollBonusNewAchiveNum = data.gachaRollMission.newAchiveNum
      this.gachaRollBonusAlreadyGettedNum = data.gachaRollMission.alreadyGetted
      let gachaRollBonusNewAchiveNum_for = data.gachaRollMission.newAchiveNum;//forで使う
      let gachaRollYetGettingNewAchiveNum = 0 < this.gachaRollBonusNewAchiveNum;//true or false

      this.playtimeBonusNewAchiveNum = data.playtimeMission.newAchiveNum
      this.playtimeBonusAlreadyGettedNum = data.playtimeMission.alreadyGetted
      let playtimeBonusNewAchiveNum_for = data.playtimeMission.newAchiveNum;//forで使う
      let playtimeYetGettingNewAchiveNum = 0 < this.playtimeBonusNewAchiveNum;//true or false

      console.log(`longinBonusNewAchiveNum: ${this.longinBonusNewAchiveNum}`)
      console.log(`longinBonusAlreadyGettedNum: ${this.longinBonusAlreadyGettedNum}`)
      console.log(`loginYetGettingNewAchiveNum: ${loginYetGettingNewAchiveNum}`)

      console.log(`gachaRollBonusNewAchiveNum: ${this.gachaRollBonusNewAchiveNum}`)
      console.log(`gachaRollBonusAlreadyGettedNum: ${this.gachaRollBonusAlreadyGettedNum}`)
      console.log(`gachaRollYetGettingNewAchiveNum: ${gachaRollYetGettingNewAchiveNum}`)

      console.log(`playtimeBonusNewAchiveNum: ${this.playtimeBonusNewAchiveNum}`)
      console.log(`playtimeBonusAlreadyGettedNum: ${this.playtimeBonusAlreadyGettedNum}`)
      console.log(`playtimeYetGettingNewAchiveNum: ${playtimeYetGettingNewAchiveNum}`)
      */
      //#endregion
    //})
    } catch (error) {
      console.error("通信またはデータ処理に失敗しました:", error);
      throw error; // エラーを呼び出し元に伝える
    }
  }

  //ミッションの一覧の画面を作成し表示
  setup_ui_mission(userMissionStatus){
    const game_width = this.scale.width
    const game_height = this.scale.height

    console.log("setup_ui_mission:",userMissionStatus)

    this.longinBonusNewAchiveNum = userMissionStatus.login.newAchiveNum
    this.longinBonusAlreadyGettedNum = userMissionStatus.login.alreadyGettedNum
    let longinBonusNewAchiveNum_for = userMissionStatus.login.newAchiveNum;//forで使う
    let loginYetGettingNewAchiveNum = 0 < this.longinBonusNewAchiveNum;//true or false

    this.playtimeBonusNewAchiveNum = userMissionStatus.playtime.newAchiveNum
    this.playtimeBonusAlreadyGettedNum = userMissionStatus.playtime.alreadyGettedNum
    let playtimeBonusNewAchiveNum_for = userMissionStatus.playtime.newAchiveNum;//forで使う
    let playtimeYetGettingNewAchiveNum = 0 < this.playtimeBonusNewAchiveNum;//true or false

    this.gachaRollBonusNewAchiveNum = userMissionStatus.gacha.newAchiveNum
    this.gachaRollBonusAlreadyGettedNum = userMissionStatus.gacha.alreadyGettedNum
    let gachaRollBonusNewAchiveNum_for = userMissionStatus.gacha.newAchiveNum;//forで使う
    let gachaRollYetGettingNewAchiveNum = 0 < this.gachaRollBonusNewAchiveNum;//true or false

    console.log(`longinBonusNewAchiveNum: ${this.longinBonusNewAchiveNum}`)
    console.log(`longinBonusAlreadyGettedNum: ${this.longinBonusAlreadyGettedNum}`)
    console.log(`loginYetGettingNewAchiveNum: ${loginYetGettingNewAchiveNum}`)

    console.log(`gachaRollBonusNewAchiveNum: ${this.gachaRollBonusNewAchiveNum}`)
    console.log(`gachaRollBonusAlreadyGettedNum: ${this.gachaRollBonusAlreadyGettedNum}`)
    console.log(`gachaRollYetGettingNewAchiveNum: ${gachaRollYetGettingNewAchiveNum}`)

    console.log(`playtimeBonusNewAchiveNum: ${this.playtimeBonusNewAchiveNum}`)
    console.log(`playtimeBonusAlreadyGettedNum: ${this.playtimeBonusAlreadyGettedNum}`)
    console.log(`playtimeYetGettingNewAchiveNum: ${playtimeYetGettingNewAchiveNum}`)


    /*const mission_data=[
      {id: 1, name: 'login', type: 'login', num: 20, get: 2,cristal: 10, status: 'yet'},
      {id: 2, name: 'レアガチャ', description: 'レアなパックです。',cristalCost: 150},
    ];*/

    //画面全体の背景
    this.background = this.add.image(game_width/2, game_height/2, 'other_backgroud')
    this.background.setDisplaySize(game_width, game_height);

    const mainContainer = this.add.container(0, 0);

    //画面上部のヘッダー
    this.Header = new Header(this, 'ミッション',this.loginPlugin);

    //線を引く処理
    //const line = this.add.line(0,0,lineStartX,lineStartY,lineEndX,lineEndY,0xffffff);
    //section.add(line);

    //サイズと位置の変数
    const sectionWidth=2500
    const sectionHeight=120
    const SectionPosition_x=20;
    const loginSectionPosition_y=100;
    const loginlineStartX=0; const loginlineStartY=50; const loginlineEndX=2000; const loginlineEndY=50;
    const playTimeSectionPosition_y=200;
    const playTimelineStartX=0; const playTimelineStartY=50; const playTimelineEndX=2000; const playTimelineEndY=50;
    const gachaRollSectionPosition_y=300;
    const gachaRolllineStartX=0; const gachaRolllineStartY=50; const gachaRolllineEndX=2000; const gachaRolllineEndY=50;

    const loginMissionItemPos_y = loginSectionPosition_y-30;
    const playtimeMissionItemPos_y = playTimeSectionPosition_y-130;
    const gachaRollMissionItemPos_y = gachaRollSectionPosition_y-230;


    // ログインセクション	
    this.loginSection = this.add.container(SectionPosition_x, loginSectionPosition_y);
    const loginBg = this.add.rectangle(20, 0, sectionWidth, sectionHeight, 0x003366).setOrigin(0, 0);
    const loginBgInside = this.add.rectangle(40, 40, sectionWidth-100, sectionHeight-60, "#00003f").setOrigin(0, 0);
    const loginLine = this.add.line(40,20,loginlineStartX,loginlineStartY,loginlineEndX,loginlineEndY,0xffffff).setLineWidth(2).setOrigin(0, 0);
    const loginTitle = this.add.text(40, 15, 'ログイン', { fontSize: '12px', fill: '#ffffff' });
    //this.loginSection.add([loginBg,loginBgInside, loginTitle]);
    this.loginSection.add([loginBg,loginBgInside, loginLine ,loginTitle]);

    //プレイ時間セクション
    this.playTimeSection = this.add.container(SectionPosition_x, playTimeSectionPosition_y);
    const playTimeBg = this.add.rectangle(20, 0, sectionWidth, sectionHeight, 0x003366).setOrigin(0, 0);
    const playTimeBgInside = this.add.rectangle(40, 40, sectionWidth-100, sectionHeight-60, "#00003f").setOrigin(0, 0);
    const playTimeLine = this.add.line(40,20,playTimelineStartX,playTimelineStartY,playTimelineEndX,playTimelineEndY,0xffffff).setLineWidth(2).setOrigin(0, 0);
    const playTimeTitle = this.add.text(40, 20, 'プレイタイムボーナス', { fontSize: '12px', fill: '#ffffff' });
    this.playTimeSection.add([playTimeBg, playTimeBgInside, playTimeLine, playTimeTitle]);

    //ガチャ回転数セクション
    this.gachaRollSection = this.add.container(SectionPosition_x, gachaRollSectionPosition_y);
    const gachaRollBg = this.add.rectangle(20, 0, sectionWidth, sectionHeight, 0x003366).setOrigin(0, 0);
    const gachaRollBgInside = this.add.rectangle(40, 40, sectionWidth-100, sectionHeight-60, "#00003f").setOrigin(0, 0);
    const gachaRollLine = this.add.line(40,20,gachaRolllineStartX,gachaRolllineStartY,gachaRolllineEndX,gachaRolllineEndY,0xffffff).setLineWidth(2).setOrigin(0, 0);
    const gachaRollTitle = this.add.text(40, 20, 'ガチャ回転回数', { fontSize: '12px', fill: '#ffffff' });
    this.gachaRollSection.add([gachaRollBg, gachaRollBgInside, gachaRollLine, gachaRollTitle]);

    //→(右)ボタン・←(左)ボタン
    const right_btn= this.add.text(game_width-100, 100, '>', {fontSize: '16px',color: '#ccff00',backgroundColor: '#212121',align: 'center',padding: { x: 5, y: 5 }}).setOrigin(0, 0).setFixedSize(30, 30).setInteractive();
    right_btn.on('pointerdown', () => {this.toRight(this.loginSection)});
    right_btn.on('pointerover', () => {this.input.setDefaultCursor('pointer');right_btn.setTint(0xfdd35c);});
    right_btn.on('pointerout', () => {this.input.setDefaultCursor('default');right_btn.setTint(0xccff00);});
    const left_btn= this.add.text(game_width-150, 100, '<', {fontSize: '16px',color: '#ccff00',backgroundColor: '#212121',align: 'center',padding: { x: 5, y: 5 }}).setOrigin(0, 0).setFixedSize(30, 30).setInteractive();
    left_btn.on('pointerdown', () => {this.toLeft(this.loginSection)});
    left_btn.on('pointerover', () => {this.input.setDefaultCursor('pointer');left_btn.setTint(0xfdd35c);});
    left_btn.on('pointerout', () => {this.input.setDefaultCursor('default');left_btn.setTint(0xccff00);});

    const playTime_right_btn= this.add.text(game_width-100, 200, '>', {fontSize: '16px',color: '#ccff00',backgroundColor: '#212121',align: 'center',padding: { x: 5, y: 5 }}).setOrigin(0, 0).setFixedSize(30, 30).setInteractive();
    playTime_right_btn.on('pointerdown', () => {this.toRight(this.playTimeSection)});
    playTime_right_btn.on('pointerover', () => {this.input.setDefaultCursor('pointer');playTime_right_btn.setTint(0xfdd35c);});
    playTime_right_btn.on('pointerout', () => {this.input.setDefaultCursor('default');playTime_right_btn.setTint(0xccff00);});
    const playTime_left_btn= this.add.text(game_width-150, 200, '<', {fontSize: '16px',color: '#ccff00',backgroundColor: '#212121',align: 'center',padding: { x: 5, y: 5 }}).setOrigin(0, 0).setFixedSize(30, 30).setInteractive();
    playTime_left_btn.on('pointerdown', () => {this.toLeft(this.playTimeSection)});
    playTime_left_btn.on('pointerover', () => {this.input.setDefaultCursor('pointer');left_btn.setTint(0xfdd35c);});
    playTime_left_btn.on('pointerout', () => {this.input.setDefaultCursor('default');left_btn.setTint(0xccff00);});

    const gachaRoll_right_btn= this.add.text(game_width-100, 300, '>', {fontSize: '16px',color: '#ccff00',backgroundColor: '#212121',align: 'center',padding: { x: 5, y: 5 }}).setOrigin(0, 0).setFixedSize(30, 30).setInteractive();
    gachaRoll_right_btn.on('pointerdown', () => {this.toRight(this.gachaRollSection)});
    gachaRoll_right_btn.on('pointerover', () => {this.input.setDefaultCursor('pointer');gachaRoll_right_btn.setTint(0xfdd35c);});
    gachaRoll_right_btn.on('pointerout', () => {this.input.setDefaultCursor('default');gachaRoll_right_btn.setTint(0xccff00);});
    const gachaRoll_left_btn= this.add.text(game_width-150, 300, '<', {fontSize: '16px',color: '#ccff00',backgroundColor: '#212121',align: 'center',padding: { x: 5, y: 5 }}).setOrigin(0, 0).setFixedSize(30, 30).setInteractive();
    gachaRoll_left_btn.on('pointerdown', () => {this.toLeft(this.gachaRollSection)});
    gachaRoll_left_btn.on('pointerover', () => {this.input.setDefaultCursor('pointer');gachaRoll_left_btn.setTint(0xfdd35c);});
    gachaRoll_left_btn.on('pointerout', () => {this.input.setDefaultCursor('default');gachaRoll_left_btn.setTint(0xccff00);});

    //未獲得報酬を全獲得ボタン
    this.allBonusGetButton = this.add.text(game_width / 2, window.innerHeight-150, '報酬をゲット', {fontSize: '24px',fill: '#ccff00',backgroundColor: '#212121',padding: { x: 5, y: 5 }}).setOrigin(0.5).setInteractive()
    this.allBonusGetButton.on('pointerdown', this.all_getMissionBonus, this)// 閉じるボタンのイベントリスナー
    this.allBonusGetButton.on('pointerover', () => {
      this.input.setDefaultCursor('pointer');
      this.allBonusGetButton.setTint(0xfdd35c);
    });
    this.allBonusGetButton.on('pointerout', () => {
      this.input.setDefaultCursor('default');
      this.allBonusGetButton.setTint(0xccff00);
    });

    //const footer = this.add.rectangle(0, window.innerHeight - 40, window.innerWidth, 40, 0x2c3e50).setOrigin(0, 0);
    //const footerText = this.add.text(window.innerWidth / 2, window.innerHeight - 20, '© 2024 My App', { fontSize: '14px', fill: '#ffffff' }).setOrigin(0.5);
    //mainContainer.add([footer, footerText]);

    /*this.camera = this.cameras.main;
    this.camera.setBounds(0, 0, 1600, 1200);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.input.on('wheel', this.handleScroll, this);
    this.input.on('pointerdown', this.startDrag, this);
    this.input.on('pointermove', this.doDrag, this);
    this.input.on('pointerup', this.endDrag, this);
    */

    //this.containers = [];

    //線
    //const lineStartX = this.loginSection.x - this.loginSection.width / 2 + 40;
    //const lineEndX = this.loginSection.x + this.loginSection.width / 2 - 40;
    //const lineY = this.loginSection.y+130;
    //const lineY = this.loginSection.y-40;
    

    //それぞれの種類のミッションのUIを作成
    //this.mission_create(loginSection_Y,longinBonusNewAchiveNum_for,this.longinBonusAlreadyGettedNum,this.loginSection,1);
    //this.mission_create(playtimeSection_Y,playtimeBonusNewAchiveNum_for,this.playtimeBonusAlreadyGettedNum,this.playTimeSection,2);
    //this.mission_create(gachaRollSection_Y,gachaRollBonusNewAchiveNum_for,this.gachaRollBonusAlreadyGettedNum,this.gachaRollSection,3);
    

    
    this.mission_create(loginMissionItemPos_y, longinBonusNewAchiveNum_for,this.longinBonusAlreadyGettedNum,this.loginSection,1);
    this.mission_create(playtimeMissionItemPos_y, playtimeBonusNewAchiveNum_for,this.playtimeBonusAlreadyGettedNum,this.playTimeSection,2);
    this.mission_create(gachaRollMissionItemPos_y, gachaRollBonusNewAchiveNum_for,this.gachaRollBonusAlreadyGettedNum,this.gachaRollSection,3);


    //通知バッジ
    if(loginYetGettingNewAchiveNum){
      //const loginSection_badgeX = this.loginSection.x + this.loginSection.width / 2 + 30;
      //const loginSection_badgeY = this.loginSection.y - this.loginSection.height / 2 + 10;
      //const loginSection_badgeX = SectionPosition_x + sectionWidth / 2 + 30;
      const loginSection_badgeX = SectionPosition_x + 110;
      const loginSection_badgeY = loginSectionPosition_y+20;
      this.loginSection_badge = this.createBadge(this, loginSection_badgeX, loginSection_badgeY, this.longinBonusNewAchiveNum);
    }
    if(playtimeYetGettingNewAchiveNum){
      const playTimeSection_badgeX = SectionPosition_x + 180;
      const playTimeSection_badgeY = playTimeSectionPosition_y+25;
      this.playTimeSection_badge = this.createBadge(this, playTimeSection_badgeX, playTimeSection_badgeY, this.playtimeBonusNewAchiveNum);
    }
    if(gachaRollYetGettingNewAchiveNum){
      const gachaRollSection_badgeX = SectionPosition_x + 150;
      const gachaRollSection_badgeY = gachaRollSectionPosition_y+25;
      this.gachaRollSectionbadge = this.createBadge(this, gachaRollSection_badgeX, gachaRollSection_badgeY, this.gachaRollBonusNewAchiveNum);
    }

    //通知バッジ作成
    //const badgeX = this.button.x + this.button.width / 2 - 10;
    //const badgeY = this.button.y - this.button.height / 2 + 10;
    //const { badge, text } = createBadge(this, badgeX, badgeY, missionNum);
    //const badgeX = 200 + 200 / 2 - 10;
    //const badgeY =400 - 200 / 2 + 10;
    //const { badge, text } = this.createBadge(this, badgeX, badgeY, data.login);
    //const { badge, text } = this.createBadge(this, badgeX, badgeY, 2);

    //全ての未獲得報酬獲得ボタンの通知バッジ
    const allBonusGetButton_badgeX = this.allBonusGetButton.x + this.allBonusGetButton.width / 2 + 30;
    const allBonusGetButton_badgeY = this.allBonusGetButton.y - this.allBonusGetButton.height / 2 + 10;
    //const { getButton_badge, getButton_text } = this.createBadge(this, getButton_badgeX, getButton_badgeY, data.longstay+data.login);
    //this.getButton_badge = this.createBadge(this, getButton_badgeX, getButton_badgeY, parseInt(data.longstay)+parseInt(data.login));
    this.allBonusGetButton_badge = this.createBadge(this, allBonusGetButton_badgeX, allBonusGetButton_badgeY, parseInt(this.longinBonusNewAchiveNum)+parseInt(this.longinBonusNewAchiveNum));

  }

  //個別のミッション作成
  //mission_create(lineY,NewAchiveNum_for,AlreadyGettedNum,section,mission_type_num){
  mission_create(missionItemPos_y,NewAchiveNum_for,AlreadyGettedNum,section,mission_type_num){
    console.log(`mission_createのsection: ${JSON.stringify(section)}`)
    console.log(`mission_createのNewAchiveNum_for: ${NewAchiveNum_for}`)
    console.log(`mission_createのAlreadyGettedNum: ${AlreadyGettedNum}`)
    //this.containers = [];

    const StartX = section.x - section.width / 2 + 40;
    const EndX = section.x + section.width / 2 - 40;

    //#region 
    //const lineY = this.loginSection.y+130;
    //#region 
    //const lineY = this.loginSection.y-20;
    //#endregion
    //const line = this.add.line(0, 0, lineStartX, lineY, lineEndX, lineY, 0xFF0000);
    //line.setLineWidth(2);
    //#endregion
    
    //コンテナmissionItem
    const missionItemWidth = 40;
    const missionItemHeight = 40;
    const missionItemSpacing = (EndX - StartX - missionItemWidth) / 19;

    //ループして個別のミッションを作成している
    /* 処理の流れ
      ループ内で共通のmissionItemRectangle(アイテムのエリアの長方形)を追加
      ↓
      iを0~20でループさせ、iがそのミッション
      ↓
      すでに取得済みのミッションの場合は
      ↓

      いったんthis.containerに全部突っ込むか

      セクションに追加
      左から下の層
      missionItemRectangle,money_text, money_img
      section.add(
    
    */
    for (let i = 0; i < 20; i++) {

      //const containerX = StartX + (missionItemWidth + missionItemSpacing) * i*5;
      const missionItemPos_x = StartX + (missionItemWidth + missionItemSpacing) * i*5;

      const missionItemContainer = this.add.container(missionItemPos_x, missionItemPos_y);

      //ミッションの1つ1つのコンテナ
      //const missionItemRectangle = this.add.rectangle(missionItemPos_x, missionItemPos_y, missionItemWidth, missionItemHeight, 0x474695);
      const missionItemRectangle = this.add.rectangle(0, 0, missionItemWidth, missionItemHeight, 0x474695);
      missionItemRectangle.setStrokeStyle(1, 0x808080);
      //missionItemRectangle.setInteractive({ useHandCursor: true });

      missionItemContainer.setSize(missionItemWidth, missionItemHeight);
      //missionItemRectangle.setInteractive()
      missionItemContainer.setInteractive({ useHandCursor: true });
      missionItemContainer.on('pointerover', () => {
      //missionItemRectangle.on('pointerover', () => {
        this.input.setDefaultCursor('pointer');
        //this.container.setTint(0xfdd35c);
        missionItemRectangle.setFillStyle(0xfdd35c, 1); // 第1引数に色、第2引数にアルファ値（不透明度）を指定
      });
      missionItemContainer.on('pointerout', () => {
        this.input.setDefaultCursor('default');
        //this.container.setTint(0xccff00);
        missionItemRectangle.setFillStyle(0x474695, 1);// 元の色（0x474695）に戻す
      });

      //報酬額のテキスト
      //const money_text =this.add.text(missionItemPos_x, missionItemPos_y+0, `50`, {fontSize: '12px',fill: '#f5f5f5'}).setOrigin(0.5);
      const money_text =this.add.text(0, 15, `50`, {fontSize: '12px',fill: '#f5f5f5'}).setOrigin(0.5);
      //this.add.text(containerX, lineY+20, `50`, {fontSize: '24px',fill: '#000'}).setOrigin(0.5);

      //報酬の画像
      //const money_img = this.add.image(missionItemPos_x, missionItemPos_y-0, 'money');
      const money_img = this.add.image(0, -5, 'money');
      money_img.setDisplaySize(25, 25);// 画像の幅と高さを指定
      //money_img.setInteractive();
      //money_img.setInteractive({ useHandCursor: true });


      //すでに取得済みのミッション
      //missionItemRectangle(アイテムのエリアの長方形)、money_text(報酬額のテキスト)、money_img(報酬の画像)
      if (i < AlreadyGettedNum){
        //console.log("すでに取得済みのミッション・i < AlreadyGettedNum")

        //1つのミッションのクリックイベント
        missionItemContainer.on('pointerdown', () => {
        //missionItemRectangle.on('pointerdown', () => {
          console.log("すでに取得済みのミッションです")
        });

        //報酬額のテキスト
        /*
        //const money_text =this.add.text(missionItemPos_x, missionItemPos_y+20, `50`, {fontSize: '12px',fill: '#f5f5f5'}).setOrigin(0.5);
        const money_text =this.add.text(0, 20, `50`, {fontSize: '12px',fill: '#f5f5f5'}).setOrigin(0.5);

        //報酬の画像
        //const money_img = this.add.image(missionItemPos_x, missionItemPos_y-0, 'money');
        const money_img = this.add.image(0, 0, 'money');
        money_img.setDisplaySize(25, 25);// 画像の幅と高さを指定
        //money_img.setInteractive();
        //money_img.setInteractive({ useHandCursor: true });
        */

        missionItemContainer.add([missionItemRectangle,money_text, money_img]);

        //オーバーレイ
        //this.overlay = this.add.rectangle(missionItemPos_x, missionItemPos_y, missionItemWidth, missionItemHeight, 0x000000, 0.7);
        this.overlay = this.add.rectangle(0, 0, missionItemWidth, missionItemHeight, 0x000000, 0.7);
       
        //const checkBtn = this.add.image(missionItemPos_x+30, missionItemPos_y-30, 'check');
        const checkBtn = this.add.image(30, -30, 'check');
        checkBtn.setDisplaySize(15, 15);// 画像の幅と高さを指定
        
        //section.add([this.overlay, checkBtn]);
        missionItemContainer.add([this.overlay, checkBtn]);



        //セクションに追加
        //section.add([this.container,money_text, money_img]);

      }else{//まだ未取得のミッション
        //console.log("まだ未取得のミッション")
        
        //まだ取得してないけど、獲得条件を満たしているミッションなら
        if( 0 < NewAchiveNum_for ){
          console.log("まだ取得してないけど、獲得条件を満たしているミッション")

          //const yetGettingNewAchive_bg = this.add.rectangle(missionItemPos_x, missionItemPos_y, missionItemWidth+5, missionItemHeight+5, 0xCCCC00).setStrokeStyle(5, 0xffffff);
          const yetGettingNewAchive_bg = this.add.rectangle(0, 0, missionItemWidth+5, missionItemHeight+5, 0xCCCC00).setStrokeStyle(5, 0xffffff);
          //yetGettingNewAchive_bg.setInteractive({ useHandCursor: true });
          //section.add(yetGettingNewAchive_bg)
          missionItemContainer.add([yetGettingNewAchive_bg])

          /*
          yetGettingNewAchive_bg.on('pointerover', () => {
            this.input.setDefaultCursor('pointer');
            missionItemRectangle.setFillStyle(0xfdd35c, 1); // 第1引数に色、第2引数にアルファ値（不透明度）を指定
          });
          yetGettingNewAchive_bg.on('pointerout', () => {
            this.input.setDefaultCursor('default');
            missionItemRectangle.setFillStyle(0x474695, 1);// 元の色（0x474695）に戻す
          });

          money_img.on('pointerover', () => {
            this.input.setDefaultCursor('pointer');
            missionItemRectangle.setFillStyle(0xfdd35c, 1); // 第1引数に色、第2引数にアルファ値（不透明度）を指定
          });
          money_img.on('pointerout', () => {
            this.input.setDefaultCursor('default');
            missionItemRectangle.setFillStyle(0x474695, 1);// 元の色（0x474695）に戻す
          });
          */

          missionItemContainer.on('pointerdown', () => { 
            console.log("ああああyetGettingNewAchive_bgクリックでone_getMissionBonus呼び出す")
            this.one_getMissionBonus(missionItemContainer, missionItemPos_x, missionItemPos_y, missionItemWidth, missionItemHeight, mission_type_num, yetGettingNewAchive_bg) 
          });
        }

        //報酬額のテキスト
        /*
        //const money_text =this.add.text(missionItemPos_x, missionItemPos_y+0, `50`, {fontSize: '12px',fill: '#f5f5f5'}).setOrigin(0.5);
        const money_text =this.add.text(0, 0, `50`, {fontSize: '12px',fill: '#f5f5f5'}).setOrigin(0.5);
        //this.add.text(containerX, lineY+20, `50`, {fontSize: '24px',fill: '#000'}).setOrigin(0.5);

        //報酬の画像
        //const money_img = this.add.image(missionItemPos_x, missionItemPos_y-0, 'money');
        const money_img = this.add.image(0, 0, 'money');
        money_img.setDisplaySize(25, 25);// 画像の幅と高さを指定
        //money_img.setInteractive();
        money_img.setInteractive({ useHandCursor: true });
        */

        /*missionItemContainer.on('pointerdown', () => {
          console.log("ああああthis.containerクリックでone_getMissionBonus呼び出す")
          this.one_getMissionBonus(this.container,missionItemPos_x, missionItemPos_y,missionItemWidth, missionItemHeight,mission_type_num) 
          //console.log("すでに取得済みのミッションです")
        });
        */

        missionItemContainer.add([missionItemRectangle,money_text, money_img]);
        //section.add([this.container,money_text, money_img]);
        
        //まだ取得してないけど、獲得条件を満たしているミッションなら
        if( 0 < NewAchiveNum_for ){
          NewAchiveNum_for--;//ここで引いておけば獲得権持っててまだ未獲得のボーナスが2なら2回処理・1なら1回処理がされるのでいける
        }

      }


      //this.containers.push(this.container); 

      //if (i < data.GettedLoginBonus){
      //if (i <this.longinBonusAlreadyGettedNum){
      /*if (i < AlreadyGettedNum){
        //オーバーレイ
        //this.overlay = this.add.rectangle(missionItemPos_x, missionItemPos_y, missionItemWidth, missionItemHeight, 0x000000, 0.7);
        this.overlay = this.add.rectangle(0, 0, missionItemWidth, missionItemHeight, 0x000000, 0.7);
       
        //const checkBtn = this.add.image(missionItemPos_x+30, missionItemPos_y-30, 'check');
        const checkBtn = this.add.image(30, -30, 'check');
        checkBtn.setDisplaySize(15, 15);// 画像の幅と高さを指定
        
        //section.add([this.overlay, checkBtn]);
        missionItemContainer.add([this.overlay, checkBtn]);
      }*/

      section.add(missionItemContainer);

    }
  }

  //通知のバッジ作成
  createBadge(scene, x, y, num) {
    const badgeContainer = this.add.container(x, y);
    const badge = scene.add.circle(0, 0, 10, 0xff0000);
    const text = scene.add.text(0, 0, num.toString(), {font: '15px Arial',fill: '#ffffff'}).setOrigin(0.5);
    badgeContainer.add([badge,text])
    return badgeContainer ;
  }

  //達成したミッションボーナスを一気に全て獲得する
  all_getMissionBonus(containerX, lineY,missionItemWidth, missionItemHeight){
    console.log("達成したミッションボーナスを一気に全て獲得する・all_getMissionBonus")
    fetch('/all_getMissionBonus', { 
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content 
      },
      body: JSON.stringify({
        longinBonusNewAchiveNum: this.longinBonusNewAchiveNum,
        longstayBonusNewAchiveNum: 0
      })
    })
    .then(response => response.json())
    .then(data => {
        this.containers[data.GettedLoginBonus-1].setFillStyle(0xFF0000);
        this.overlay = this.add.rectangle(containerX, lineY, missionItemWidth, missionItemHeight, 0x000000, 0.7);
        const checkBtn = this.add.image(containerX+0, lineY-30, 'check');
        checkBtn.setDisplaySize(15, 15);// 画像の幅と高さを指定
        this.loginSection.add([this.overlay, checkBtn]);

        console.log(data.GettedLoginBonus)
        console.log(data.longstay)
        //this.loginSection_badge.setVisible(false)
        //this.signupSection_badge.setVisible(false)
        //this.getButton_badge.setVisible(false)
        this.loginSection_badge.destroy();
        this.gachaRollSection_badge.destroy();
        this.playTimeSection_badge.destroy();
        this.getButton_badge.destroy();
        for (let i = 0; i < data.login; i++) {
          console.log("アチーブ取得")
        }
        //モーダル出現・ゲットしたクリスタル表示
    })
  }
  //達成したミッションボーナスを1つだけ獲得する
  one_getMissionBonus(missionItemContainer, missionItemPos_x, missionItemPos_y, missionItemWidth, missionItemHeight, mission_type_num, yetGettingNewAchive_bg){
  //one_getMissionBonus(this.container,missionItemPos_x, missionItemPos_y,missionItemWidth, missionItemHeight,mission_type_num) 

    console.log("達成したミッションボーナスを1つだけ獲得する・one_getMissionBonus")

    const debugMode = document.getElementById("debug-mode").checked
    console.log("開発モード：",debugMode)
    
    if(debugMode){//開発モードがtrueなら
      //開発モードの時はDBに反映させない
      console.log("開発モードの時はDBに反映させない")

      //オーバーレイと取得済みボタン
      //this.overlay = this.add.rectangle(missionItemPos_x, missionItemPos_y, missionItemWidth, missionItemHeight, 0x000000, 0.7);
      //const checkBtn = this.add.image(missionItemPos_x+30, missionItemPos_y-30, 'check');
      this.overlay = this.add.rectangle(0, 0, missionItemWidth, missionItemHeight, 0x000000, 0.7);
      const checkBtn = this.add.image(30, -30, 'check');
      checkBtn.setDisplaySize(30, 30);// 画像の幅と高さを指定
      missionItemContainer.add([this.overlay, checkBtn]);
      //this.loginSection.add([this.overlay, checkBtn]);

      //ゲットできるアイテムコンテナから枠を削除
      missionItemContainer.remove(yetGettingNewAchive_bg);

      //取得したモダールを表示
      this.get_bonus_modal(50);



    }else{
      fetch('/one_getMissionBonus', { 
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content 
        },
        body: JSON.stringify({
          mission_type_num: mission_type_num
        })
      })
      .then(response => response.json())
      .then(data => {

          console.log("達成したミッションボーナスを1つだけ獲得する:",data)

          //通知バッジ削除
          this.loginSection_badge.destroy();
          this.gachaRollSection_badge.destroy();
          this.playTimeSection_badge.destroy();
          this.getButton_badge.destroy();

          for (let i = 0; i < data.login; i++) {
            console.log("アチーブ取得")
          }

          //オーバーレイと取得済みボタン
          this.overlay = this.add.rectangle(missionItemPos_x, missionItemPos_y, missionItemWidth, missionItemHeight, 0x000000, 0.7);
          const checkBtn = this.add.image(missionItemPos_x+30, missionItemPos_y-30, 'check');
          checkBtn.setDisplaySize(30, 30);// 画像の幅と高さを指定
          this.loginSection.add([this.overlay, checkBtn]);

          //取得したモダールを表示
          this.get_bonus_modal(50);

      })
    }
  }
  //ゲットした報酬をモーダルで表示・まだなんにも書いてない
  get_bonus_modal(get_cristal_amount){
    console.log("クリスタルゲット")

    //モーダル出現・ゲットしたクリスタル表示
    //const gettedContainer = this.add.container(window.innerWidth/2, window.innerHeight/2);
    const gettedContainer = this.add.container(0,0);
    const cristal_img = this.add.image(0,0, 'money');

    // コンテンツテキスト
    const text = this.add.text(0, -20, "クリスタルを"+get_cristal_amount+"ゲット", {fontSize: '24px',fill: '#000000',align: 'center',wordWrap: { width: 500 - 80 }}).setOrigin(0.5)
    gettedContainer.add([cristal_img,text])
    gettedContainer.setVisible(false)

    this.modal = new ModalContainer(this, this.scale.width / 2, this.scale.height / 2, 1500, 900, gettedContainer)
    this.modal.open()
  }

  //右→ボタン押したらモーダルの右へ移動して表示させる
  toRight(Section) {
    console.log("Section.x: "+Section.x)
    //if(Section.x > -1280){
    if(Section.x > -1580){
      Section.x = Section.x-100;
    }
  }
  //左←ボタン押したらモーダルの左へ移動して表示させる
  toLeft(Section) {
    if(Section.x < 20){
      Section.x = Section.x+100;
    }
  }
  /*
  handleScroll(pointer, gameObjects, deltaX, deltaY, deltaZ) {
    const scrollSpeed = 15;
    if (pointer.y > 80 && pointer.y < 280) {
      this.loginSection.x = Phaser.Math.Clamp(this.loginSection.x - deltaX * scrollSpeed, -720, 0);
    } else if (pointer.y > 300 && pointer.y < 500) {
      this.gachaRollSection.x = Phaser.Math.Clamp(this.gachaRollSection.x - deltaX * scrollSpeed, -720, 0);
    }else if (pointer.y > 500 && pointer.y < 650) {
      this.playTimeSection.x = Phaser.Math.Clamp(this.playTimeSection.x - deltaX * scrollSpeed, -720, 0);
    }else {
      this.camera.scrollY = Phaser.Math.Clamp(this.camera.scrollY + deltaY, 0, 600);
    }
}

 startDrag(pointer) {
  this.isDragging = true;
  this.lastPointerPosition = { x: pointer.x, y: pointer.y };
}

 doDrag(pointer) {
    if (!this.isDragging) return;

    const dx = pointer.x - this.lastPointerPosition.x;
    const dy = pointer.y - this.lastPointerPosition.y;

    if (pointer.y > 80 && pointer.y < 280) {
      this.loginSection.x = Phaser.Math.Clamp(this.loginSection.x + dx, -720, 0);
    } else if (pointer.y > 300 && pointer.y < 500) {
      this.gachaRollSection.x = Phaser.Math.Clamp(this.gachaRollSection.x + dx, -720, 0);
    } else if (pointer.y > 300 && pointer.y < 500) {
      this.playTimeSection.x = Phaser.Math.Clamp(this.playTimeSection.x + dx, -720, 0);
    }else {
      this.camera.scrollY = Phaser.Math.Clamp(this.camera.scrollY - dy, 0, 600);
    }

    this.lastPointerPosition = { x: pointer.x, y: pointer.y };
}

 endDrag() {
  this.isDragging = false;
}*/

  //何にも書いてない
  update() {

    /*
    const scrollSpeed = 10;
    const pointer = this.input.activePointer;

    if (this.cursors.up.isDown) {
      this.camera.scrollY = Phaser.Math.Clamp(this.camera.scrollY - scrollSpeed, 0, 600);
    } else if (this.cursors.down.isDown) {
      this.camera.scrollY = Phaser.Math.Clamp(this.camera.scrollY + scrollSpeed, 0, 600);
    }

    if (this.cursors.left.isDown) {
        if (pointer.y > 80 && pointer.y < 280) {
          this.loginSection.x = Phaser.Math.Clamp(this.loginSection.x + scrollSpeed, -720, 0);
        } else if (pointer.y > 300 && pointer.y < 500) {
          this.gachaRollSection.x = Phaser.Math.Clamp(this.gachaRollSection.x + scrollSpeed, -720, 0);
        }else if (pointer.y > 300 && pointer.y < 500) {
          this.playTimeSection.x = Phaser.Math.Clamp(this.playTimeSection.x + scrollSpeed, -720, 0);
        }
    } else if (this.cursors.right.isDown) {
        if (pointer.y > 80 && pointer.y < 280) {
          this.loginSection.x = Phaser.Math.Clamp(this.loginSection.x - scrollSpeed, -720, 0);
        } else if (pointer.y > 300 && pointer.y < 500) {
          this.gachaRollSection.x = Phaser.Math.Clamp(this.gachaRollSection.x - scrollSpeed, -720, 0);
        }else if (pointer.y > 300 && pointer.y < 500) {
          this.playTimeSection.x = Phaser.Math.Clamp(this.playTimeSection.x - scrollSpeed, -720, 0);
        }
    }*/
  }
}