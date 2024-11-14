import Phaser from 'phaser'
import React, { useEffect, useRef } from 'react'
import Header from '../components/Header.js';
import ModalContainer from '../components/ModalContainer'


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

    //this.loginSection_badge;

  }

  init() {
    //素材のアセットコンパイルでのフィンガープリント付きのパスを取得
    const gameElement = document.querySelector('[data-react-class="AimRoom"]');
    this.props = JSON.parse(gameElement.getAttribute('data-react-props'));
        
    this.loginPlugin = this.plugins.get('LoginPlugin');
    this.loginPlugin.checkLoginStatus().then(isLoggedIn => {
      this.isLoggedIn=isLoggedIn
    });


    this.checkMissionBonus()
  }


  preload() {
    this.load.image('gacha_backgroud', this.props.gacha_backgroud);
    this.load.image('check', this.props.check_icon);
  }

  create() {
    const mission_data=[
      {id: 1, name: 'login', type: 'login', num: 20, get: 2,cristal: 10, status: 'yet'},
      {id: 2, name: 'レアガチャ', description: 'レアなパックです。',cristalCost: 150},
    ];

    const background = this.add.image(0, 0, 'gacha_backgroud').setOrigin(0, 0);
    background.setDisplaySize(1600, 1200);

    const mainContainer = this.add.container(0, 0);

    this.Header = new Header(this, 'ミッション',this.loginPlugin);
    /*const header = this.add.rectangle(0, 0, window.innerWidth, 60, 0x2c3e50).setOrigin(0, 0);
    const headerText = this.add.text(window.innerWidth / 2, 60, 'My App', { fontSize: '24px', fill: '#ffffff' }).setOrigin(0.5);
    // メインシーンに戻るボタン
    const backButton = this.add.text(50, 50, '＜', {fontSize: '32px',fill: '#fff'}).setOrigin(0.5).setInteractive();
    backButton.on('pointerdown', () => { this.scene.start('MainScene');});
    mainContainer.add([header, headerText,backButton]);*/


    //const bgcolor = Phaser.Display.Color.HexStringToColor('#11072d');

    // ログインセクション	
    //this.loginSection = this.add.container(100, 160);
    this.loginSection = this.add.container(20, 160);
    //const loginBg = this.add.rectangle(20, 0, 1500, 200, 0x3498db).setOrigin(0, 0);
    //const loginBg = this.add.rectangle(20, 0, 1500, 200, '#073e47').setOrigin(0, 0);
    const loginBg = this.add.rectangle(20, 0, 2500, 200, 0x003366).setOrigin(0, 0);
    const loginBgInside = this.add.rectangle(40, 40, 2400, 150, "#00003f").setOrigin(0, 0);
    const loginTitle = this.add.text(40, 15, 'ログイン', { fontSize: '24px', fill: '#ffffff' });
    //const loginContent = this.add.text(40, 70, 'ユーザー名とパスワードを入力してください。\n横にスクロールすると詳細が表示されます。', { fontSize: '16px', fill: '#ffffff', wordWrap: { width: 1460 } });
    // 追加のコンテンツ（画面外に配置）
    //const loginExtraContent = this.add.text(820, 70, '追加のログイン情報や説明をここに記載します。\nこの部分は画面外にあり、スクロールで表示されます。', { fontSize: '16px', fill: '#ffffff', wordWrap: { width: 640 } });
    //this.loginSection.add([loginBg, loginTitle, loginContent, loginExtraContent]);
    this.loginSection.add([loginBg,loginBgInside, loginTitle]);

    this.playTimeSection = this.add.container(20, 380);
    const playTimeBg = this.add.rectangle(20, 0, 2500, 200, 0x003366).setOrigin(0, 0);
    const playTimeBgInside = this.add.rectangle(40, 40, 2400, 150, "#00003f").setOrigin(0, 0);
    const playTimeTitle = this.add.text(40, 20, 'プレイタイムボーナス', { fontSize: '28px', fill: '#ffffff' });
    this.playTimeSection.add([playTimeBg,playTimeBgInside, playTimeTitle]);

    this.gachaRollSection = this.add.container(20, 560);
    const gachaRollBg = this.add.rectangle(20, 0, 2500, 200, 0x003366).setOrigin(0, 0);
    const gachaRollBgInside = this.add.rectangle(40, 40, 2400, 150, "#00003f").setOrigin(0, 0);
    const gachaRollTitle = this.add.text(40, 20, 'ガチャ回転回数', { fontSize: '28px', fill: '#ffffff' });
    this.gachaRollSection.add([gachaRollBg,gachaRollBgInside, gachaRollTitle]);

    //const getButton = this.add.text(window.innerWidth / 2, window.innerHeight / 2 + 360, '報酬をゲット', {
    this.getButton = this.add.text(window.innerWidth / 2, window.innerHeight / 2 + 360, '報酬をゲット', {
      fontSize: '48px',fill: '#000000',backgroundColor: '#cccccc',padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setInteractive()
    //this.add(this.oneitem_closeButton)
    this.getButton.on('pointerdown', this.all_getMissionBonus, this)// 閉じるボタンのイベントリスナー
    //this.getButton.on('pointerdown', () => { this.all_getMissionBonus(containerX, lineY,containerWidth, containerHeight) });
    //yetGettingNewAchive_bg.on('pointerdown', () => { this.one_getMissionBonus(containerX, lineY,containerWidth, containerHeight) });

    // フッター
    const footer = this.add.rectangle(0, window.innerHeight - 40, window.innerWidth, 40, 0x2c3e50).setOrigin(0, 0);
    const footerText = this.add.text(window.innerWidth / 2, window.innerHeight - 20, '© 2024 My App', { fontSize: '14px', fill: '#ffffff' }).setOrigin(0.5);
    mainContainer.add([footer, footerText]);

    // マスクの適用
    //loginMask = this.add.rectangle(20, 80, config.width - 40, 200, 0xffffff).setOrigin(0, 0);
    //signupMask = this.add.rectangle(20, 300, config.width - 40, 200, 0xffffff).setOrigin(0, 0);
    //loginSection.setMask(new Phaser.Display.Masks.GeometryMask(this, loginMask));
    //signupSection.setMask(new Phaser.Display.Masks.GeometryMask(this, signupMask));

    this.camera = this.cameras.main;
    this.camera.setBounds(0, 0, 1600, 1200);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.input.on('wheel', this.handleScroll, this);
    this.input.on('pointerdown', this.startDrag, this);
    this.input.on('pointermove', this.doDrag, this);
    this.input.on('pointerup', this.endDrag, this);

  }

  checkMissionBonus(){
    fetch('/checkMissionBonus', { 
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content 
      }/*,
      body: JSON.stringify({
        gacha_id: gacha_id
      })*/
    })
      .then(response => response.json())
      .then(data => {
          //console.log(data.login)
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

          this.containers = [];

          //線
          const lineStartX = this.loginSection.x - this.loginSection.width / 2 + 40;
          const lineEndX = this.loginSection.x + this.loginSection.width / 2 - 40;
          //const lineY = this.loginSection.y+130;
          const lineY = this.loginSection.y-20;
          const line = this.add.line(0, 0, lineStartX, lineY, lineEndX, lineY, 0xFF0000);
          line.setLineWidth(2);

          // Create green containers with text
          const containerWidth = 80;
          const containerHeight = 80;
          const containerSpacing = (lineEndX - lineStartX - containerWidth) / 19; // 19 spaces for 20 containers

          this.mission_create(this.loginSection.y-20,longinBonusNewAchiveNum_for,this.longinBonusAlreadyGettedNum,this.loginSection,1);
          this.mission_create(100,playtimeBonusNewAchiveNum_for,this.playtimeBonusAlreadyGettedNum,this.playTimeSection,2);
          this.mission_create(150,gachaRollBonusNewAchiveNum_for,this.gachaRollBonusAlreadyGettedNum,this.gachaRollSection,3);
          
          //通知バッジ
          if(loginYetGettingNewAchiveNum){
            const loginSection_badgeX = this.loginSection.x + this.loginSection.width / 2 + 30;
            const loginSection_badgeY = this.loginSection.y - this.loginSection.height / 2 + 10;
            this.loginSection_badge = this.createBadge(this, loginSection_badgeX, loginSection_badgeY, this.longinBonusNewAchiveNum);
          }
          if(playtimeYetGettingNewAchiveNum){
            const playTimeSection_badgeX = this.playTimeSection.x + this.playTimeSection.width / 2 + 30;
            const playTimeSection_badgeY = this.playTimeSection.y - this.playTimeSection.height / 2 + 10;
            this.playTimeSection_badge = this.createBadge(this, playTimeSection_badgeX, playTimeSection_badgeY, this.longinBonusNewAchiveNum);
          }
          if(gachaRollYetGettingNewAchiveNum){
            const gachaRollSection_badgeX = this.gachaRollSection.x + this.gachaRollSection.width / 2 + 30;
            const gachaRollSection_badgeY = this.gachaRollSection.y - this.gachaRollSection.height / 2 + 10;
            this.gachaRollSectionbadge = this.createBadge(this, gachaRollSection_badgeX, gachaRollSection_badgeY, this.longinBonusNewAchiveNum);
          }

          //通知バッジ作成
          //const badgeX = this.button.x + this.button.width / 2 - 10;
          //const badgeY = this.button.y - this.button.height / 2 + 10;
          //const { badge, text } = createBadge(this, badgeX, badgeY, missionNum);
          //const badgeX = 200 + 200 / 2 - 10;
          //const badgeY =400 - 200 / 2 + 10;
          //const { badge, text } = this.createBadge(this, badgeX, badgeY, data.login);
          //const { badge, text } = this.createBadge(this, badgeX, badgeY, 2);

          const getButton_badgeX = this.getButton.x + this.getButton.width / 2 + 30;
          const getButton_badgeY = this.getButton.y - this.getButton.height / 2 + 10;
          //const { getButton_badge, getButton_text } = this.createBadge(this, getButton_badgeX, getButton_badgeY, data.longstay+data.login);
          //this.getButton_badge = this.createBadge(this, getButton_badgeX, getButton_badgeY, parseInt(data.longstay)+parseInt(data.login));
          this.getButton_badge = this.createBadge(this, getButton_badgeX, getButton_badgeY, parseInt(this.longinBonusNewAchiveNum)+parseInt(this.longinBonusNewAchiveNum));



      })
  }

  mission_create(lineY,NewAchiveNum_for,AlreadyGettedNum,section,mission_type_num){
    console.log(`mission_createのsection: ${section}`)
    console.log(`mission_createのNewAchiveNum_for: ${NewAchiveNum_for}`)
    console.log(`mission_createのAlreadyGettedNum: ${AlreadyGettedNum}`)
    this.containers = [];

    //線
    const lineStartX = this.loginSection.x - this.loginSection.width / 2 + 40;
    const lineEndX = this.loginSection.x + this.loginSection.width / 2 - 40;
    //const lineY = this.loginSection.y+130;
    //const lineY = this.loginSection.y-20;
    const line = this.add.line(0, 0, lineStartX, lineY, lineEndX, lineY, 0xFF0000);
    line.setLineWidth(2);

    // Create green containers with text
    const containerWidth = 80;
    const containerHeight = 80;
    const containerSpacing = (lineEndX - lineStartX - containerWidth) / 19; // 19 spaces for 20 containers

        for (let i = 0; i < 20; i++) {
          const containerX = lineStartX + (containerWidth + containerSpacing) * i*2;
          if (i < AlreadyGettedNum){//すでに取得済みのミッション
            this.container = this.add.rectangle(containerX, lineY, containerWidth, containerHeight, 0x474695);
            this.container.setStrokeStyle(1, 0x808080);

            const cristal =this.add.text(containerX, lineY+20, `50`, {fontSize: '24px',fill: '#f5f5f5'}).setOrigin(0.5);

            const gacha_thumbnail = this.add.image(containerX, lineY-20, 'money');
            gacha_thumbnail.setDisplaySize(50, 50);// 画像の幅と高さを指定
            gacha_thumbnail.setInteractive();
            section.add([this.container,cristal, gacha_thumbnail]);

          }else{//まだ未取得のミッション
            this.container = this.add.rectangle(containerX, lineY, containerWidth, containerHeight, 0x474695);
            this.container.setStrokeStyle(1, 0x808080);
            
            //まだ取得してないけど、獲得条件を満たしているミッションなら
            if(0<NewAchiveNum_for){
              const yetGettingNewAchive_bg = this.add.rectangle(containerX, lineY, containerWidth+5, containerHeight+5, 0xCCCC00).setStrokeStyle(20, 0xffffff).setInteractive({ useHandCursor: true });
              section.add(yetGettingNewAchive_bg)
              yetGettingNewAchive_bg.on('pointerdown', () => { this.one_getMissionBonus(this.container,containerX, lineY,containerWidth, containerHeight,mission_type_num) });
            }

            const cristal =this.add.text(containerX, lineY+20, `50`, {fontSize: '24px',fill: '#f5f5f5'}).setOrigin(0.5);
            //this.add.text(containerX, lineY+20, `50`, {fontSize: '24px',fill: '#000'}).setOrigin(0.5);

            const gacha_thumbnail = this.add.image(containerX, lineY-20, 'money');
            gacha_thumbnail.setDisplaySize(50, 50);// 画像の幅と高さを指定
            gacha_thumbnail.setInteractive();

            
            section.add([this.container,cristal, gacha_thumbnail]);
            
            //まだ取得してないけど、獲得条件を満たしているミッションなら
            if(0<NewAchiveNum_for){
              NewAchiveNum_for--;//ここで引いておけば獲得権持っててまだ未獲得のボーナスが2なら2回処理・1なら1回処理がされるのでいける
            }

          }
          this.containers.push(this.container); 

          
          //if (i < data.GettedLoginBonus){
          //if (i <this.longinBonusAlreadyGettedNum){
          if (i <AlreadyGettedNum){
            this.overlay = this.add.rectangle(containerX, lineY, containerWidth, containerHeight, 0x000000, 0.7);
            const checkBtn = this.add.image(containerX+30, lineY-30, 'check');
            checkBtn.setDisplaySize(30, 30);// 画像の幅と高さを指定
            section.add([this.overlay, checkBtn]);
          }
      }
  }

  createBadge(scene, x, y, num) {
    //function createBadge(scene,button, x, y, num) {
      const badgeContainer = this.add.container(x, y);
      //const badge = scene.add.circle(x, y, 15, 0xff0000);
      //const text = scene.add.text(x, y, num.toString(), {font: '16px Arial',fill: '#ffffff'}).setOrigin(0.5);
      const badge = scene.add.circle(0, 0, 15, 0xff0000);
      const text = scene.add.text(0, 0, num.toString(), {font: '16px Arial',fill: '#ffffff'}).setOrigin(0.5);
      badgeContainer.add([badge,text])
      //return { badge, text };
      return badgeContainer ;
    }


  all_getMissionBonus(containerX, lineY,containerWidth, containerHeight){
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
          this.overlay = this.add.rectangle(containerX, lineY, containerWidth, containerHeight, 0x000000, 0.7);
          const checkBtn = this.add.image(containerX+30, lineY-30, 'check');
          checkBtn.setDisplaySize(30, 30);// 画像の幅と高さを指定
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
  one_getMissionBonus(container,containerX, lineY,containerWidth, containerHeight,mission_type_num){

    fetch('/one_getMissionBonus', { 
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content 
      },
      body: JSON.stringify({
        mission_type_num: mission_type_num
        //longinBonusNewAchiveNum: this.longinBonusNewAchiveNum,
        //longstayBonusNewAchiveNum: 0
      })
    })
      .then(response => response.json())
      .then(data => {

          //this.containers[data.GettedLoginBonus-1].setFillStyle(0xFF0000);
          console.log(data.GettedLoginBonus)
          //console.log(data.longstay)
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

          //オーバーレイと取得済みボタン
          this.overlay = this.add.rectangle(containerX, lineY, containerWidth, containerHeight, 0x000000, 0.7);
          const checkBtn = this.add.image(containerX+30, lineY-30, 'check');
          checkBtn.setDisplaySize(30, 30);// 画像の幅と高さを指定
          this.loginSection.add([this.overlay, checkBtn]);

          //モーダル出現・ゲットしたクリスタル表示
          //const gettedContainer = this.add.container(window.innerWidth/2, window.innerHeight/2);
          const gettedContainer = this.add.container(0,0);
          const cristal_img = this.add.image(0,0, 'money');
          // コンテンツテキスト
          const text = this.add.text(0, -20, "クリスタルを50ゲット", {fontSize: '24px',fill: '#000000',align: 'center',wordWrap: { width: 500 - 80 }}).setOrigin(0.5)
          gettedContainer.add([cristal_img,text])
          gettedContainer.setVisible(false)
          //this.modal = new ModalWindow(this, window.innerWidth / 2, window.innerHeight / 2, 400, 300, 'ログインしてください。\n会員限定でのサービスとなります。')
          this.modal = new ModalContainer(this, window.innerWidth / 2, window.innerHeight / 2, 1500, 900, gettedContainer)
          this.modal.open()

      })
  }

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
}

 update() {
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
    }
}
get_cristal(){
  console.log("クリスタルゲット")
}
}
  /*
    // 背景
    this.add.image(400, 300, 'background');

    // メインシーンに戻るボタン
    const backButton = this.add.text(50, 50, '＜', {
        fontSize: '32px',
        fill: '#fff'
    }).setOrigin(0.5).setInteractive();

    backButton.on('pointerdown', () => {
        this.scene.start('MainScene');
    });
  

    // タイトル
    const title = this.add.text(400, 50, 'ミッション', {
        fontSize: '32px',
        fill: '#ffffff',
        fontStyle: 'bold'
    }).setOrigin(0.5);
*/
    // メインメニュー
    /*const menuItems = ['ゲーム開始', 'キャラクター選択', 'オプション', 'クレジット'];
    const menuButtons = menuItems.map((item, index) => {
        const button = this.add.image(400, 150 + index * 70, 'button2').setInteractive();
        const text = this.add.text(400, 150 + index * 70, item, {
            fontSize: '24px',
            fill: '#000000'
        }).setOrigin(0.5);

        button.on('pointerover', () => {
            button.setTint(0xffff00);
        });

        button.on('pointerout', () => {
            button.clearTint();
        });

        button.on('pointerdown', () => {
            console.log(`${item} clicked`);
            // ここに各メニュー項目のアクション処理を追加
        });

        return { button, text };
    });
    */


    /*
    // 設定項目エリア
    const settingsContainer = this.add.container(400, 450);
    const settingsBox = this.add.rectangle(0, 0, 780, 250, 0x000000, 0.7);
    settingsContainer.add(settingsBox);

    const settingsTitle = this.add.text(-370, -110, '設定', {
        fontSize: '24px',
        fill: '#ffffff',
        fontStyle: 'bold'
    });
    settingsContainer.add(settingsTitle);

    // スクロール可能な設定項目
    const settingsContent = this.add.container(0, 0);
    settingsContainer.add(settingsContent);

    const settingsItems = [
        { type: 'slider', label: 'ログイン' },
        { type: 'slider', label: 'SE音量' },
        { type: 'checkbox', label: 'フルスクリーン' },
        { type: 'buttons', label: '言語', options: ['日本語', 'English', '中文', '한국어'] },
        { type: 'buttons', label: 'グラフィック品質', options: ['低', '中', '高'] },
        { type: 'checkbox', label: '振動' },
        { type: 'slider', label: 'テキスト速度' },
        { type: 'checkbox', label: '自動セーブ' },
        { type: 'buttons', label: '難易度', options: ['易しい', '普通', '難しい'] },
        { type: 'slider', label: 'カメラ感度' }
    ];

    let yOffset = -100;
    settingsItems.forEach((item, index) => {
        const itemContainer = createSettingItem(this, item, yOffset);
        settingsContent.add(itemContainer);

        const chargeImage = this.add.image(-90, yOffset, 'money');
        chargeImage.setScale(0.1);
        chargeImage.setInteractive({ useHandCursor: true });

        yOffset += 50;
    });

    // マスク作成
    const maskGraphics = this.make.graphics();
    maskGraphics.fillRect(30, 340, 740, 420);
    const mask = maskGraphics.createGeometryMask();
    settingsContent.setMask(mask);

    // スクロールバー
    const scrollbar = this.add.image(370, 0, 'scrollbar');
    const scrollbarHandle = this.add.image(370, 0, 'scrollbarHandle').setInteractive({ draggable: true });
    settingsContainer.add(scrollbar);
    settingsContainer.add(scrollbarHandle);

    const scrollableHeight = yOffset + 100 - 420; // 設定項目の総高さ - 表示領域の高さ

    // スクロール関数
    const updateScroll = (scrollRatio) => {
        const clampedRatio = Phaser.Math.Clamp(scrollRatio, 0, 1);
        settingsContent.y = -clampedRatio * scrollableHeight;
        scrollbarHandle.y = -110 + clampedRatio * 420;
    };

    // スクロールバーのドラッグ
    scrollbarHandle.on('drag', (pointer, dragX, dragY) => {
        const scrollRatio = (dragY + 110) / 420;
        updateScroll(scrollRatio);
    });

    // スワイプでのスクロール
    let isDragging = false;
    let startY = 0;

    settingsBox.setInteractive();
    settingsBox.on('pointerdown', (pointer) => {
        isDragging = true;
        startY = pointer.y;
    });

    this.input.on('pointermove', (pointer) => {
        if (isDragging) {
            const deltaY = startY - pointer.y;
            const scrollRatio = (settingsContent.y - deltaY) / -scrollableHeight;
            updateScroll(scrollRatio);
            startY = pointer.y;
        }
    });

    this.input.on('pointerup', () => {
        isDragging = false;
    });

    // マウスホイールでのスクロール
    this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
        const scrollRatio = (settingsContent.y - deltaY) / -scrollableHeight;
        updateScroll(scrollRatio);
    });

    // 通知エリア
    const notificationBox = this.add.rectangle(400, 870, 780, 50, 0x000000, 0.7);
    const notificationText = this.add.text(20, 755, '新しいイベントが開催中です！参加してレアアイテムをゲットしよう！', {
        fontSize: '16px',
        fill: '#ffffff',
        wordWrap: { width: 760 }
    });

    // 通知テキストのスクロールアニメーション
    this.tweens.add({
        targets: notificationText,
        x: -760,
        duration: 20000,
        repeat: -1,
        ease: 'Linear'
    });
}


}


function createSettingItem(scene, item, yOffset) {
  const container = scene.add.container(0, yOffset);
  const label = scene.add.text(-370, 0, item.label, {
      fontSize: '18px',
      fill: '#ffffff'
  });
  container.add(label);

  switch (item.type) {
      case 'slider':
          const slider = scene.add.image(-200, 0, 'slider');
          const handle = scene.add.image(-200, 0, 'sliderHandle').setInteractive({ draggable: true });
          handle.on('drag', (pointer, dragX) => {
              handle.x = Phaser.Math.Clamp(dragX, slider.x - slider.width / 2, slider.x + slider.width / 2);
              // ここに値の変更処理を追加
          });
          container.add(slider);
          container.add(handle);
          break;
      case 'checkbox':
          const checkbox = scene.add.image(-200, 0, 'checkbox').setInteractive();
          let isChecked = false;
          checkbox.on('pointerdown', () => {
              isChecked = !isChecked;
              checkbox.setTint(isChecked ? 0x00ff00 : 0xffffff);
              // ここに値の変更処理を追加
          });
          container.add(checkbox);
          break;
      case 'buttons':
          item.options.forEach((option, index) => {
              const button = scene.add.text(-200 + index * 100, 0, option, {
                  fontSize: '16px',
                  fill: '#ffffff',
                  backgroundColor: '#444444',
                  padding: { x: 10, y: 5 }
              }).setInteractive();
              button.on('pointerdown', () => {
                  item.options.forEach(opt => opt.setBackgroundColor('#444444'));
                  button.setBackgroundColor('#888888');
                  // ここに値の変更処理を追加
              });
              container.add(button);
          });
          break;
        }

  return container;

}
*/


/*
//export class MissionScene extends Phaser.Scene {
export default class MissionScene extends Phaser.Scene {

  constructor() {
    super('MissionScene');
  }

  preload() {
      this.load.image('sky', 'assets/sky.png');
  }

  create() {
      this.add.text(400, 300, 'ミッション', {
          fontSize: '48px',
          fill: '#fff'
      }).setOrigin(0.5);

      // メインシーンに戻るボタン
      const backButton = this.add.text(400, 400, 'メインに戻る', {
          fontSize: '32px',
          fill: '#fff'
      }).setOrigin(0.5).setInteractive();

      backButton.on('pointerdown', () => {
          this.scene.start('MainScene');
      });
  }

  update() {
      // ゲームのロジック
  }
}
*/


/*

//class MissionScene extends Phaser.Scene {
export default class MissionScene extends Phaser.Scene {

  constructor() {
    super('MissionScene')
    this.tabs = []
    this.content = null
    this.mask = null
  }

  preload() {
    this.load.image('background', 'https://example.com/path/to/background.png')
    this.load.image('mission-icon', 'https://example.com/path/to/mission-icon.png')
  }

  create() {
    this.add.image(0, 0, 'background').setOrigin(0, 0)

    this.createTabs()
    this.createScrollableContent()
  }

  createTabs() {
    const tabNames = ['新規獲得ミッション', '期間限定ミッション', 'デイリーミッション']
    const tabWidth = this.scale.width / tabNames.length

    tabNames.forEach((name, index) => {
      const tab = this.add.text(index * tabWidth, 0, name, {
        fontSize: '24px',
        color: '#ffffff',
        backgroundColor: index === 0 ? '#4CAF50' : '#333333',
        padding: { x: 10, y: 5 }
      })
      tab.setInteractive({ useHandCursor: true })
        .on('pointerdown', () => this.selectTab(index))
      this.tabs.push(tab)
    })
  }

  selectTab(index) {
    this.tabs.forEach((tab, i) => {
      tab.setBackgroundColor(i === index ? '#4CAF50' : '#333333')
    })
    // Here you would update the content based on the selected tab
  }

  createScrollableContent() {
    this.content = this.add.container(0, 50)

    const missions = [
      { name: 'ミッション1', progress: 0.5 },
      { name: 'ミッション2', progress: 0.3 },
      { name: 'ミッション3', progress: 0.7 },
      { name: 'ミッション4', progress: 0.2 },
      { name: 'ミッション5', progress: 0.9 },
      { name: 'ミッション6', progress: 0.1 },
      { name: 'ミッション7', progress: 0.6 },
      { name: 'ミッション8', progress: 0.4 },
    ]

    missions.forEach((mission, index) => {
      const y = index * 120
      const missionContainer = this.add.container(20, y)

      const bg = this.add.rectangle(0, 0, 760, 100, 0x333333)
      bg.setOrigin(0, 0)

      const icon = this.add.image(20, 50, 'mission-icon')
      icon.setScale(0.5)

      const text = this.add.text(100, 20, mission.name, { fontSize: '20px', color: '#ffffff' })

      const progressBg = this.add.rectangle(100, 70, 600, 20, 0x666666)
      const progressBar = this.add.rectangle(100, 70, 600 * mission.progress, 20, 0x4CAF50)
      progressBar.setOrigin(0, 0.5)

      missionContainer.add([bg, icon, text, progressBg, progressBar])
      this.content.add(missionContainer)
    })

    const maskGraphics = this.make.graphics()
    maskGraphics.fillStyle(0xffffff)
    maskGraphics.fillRect(0, 50, 800, 550)
    this.mask = maskGraphics.createGeometryMask()
    this.content.setMask(this.mask)

    this.input.on('pointermove', (pointer) => {
      if (pointer.isDown) {
        this.content.y += (pointer.y - pointer.prevPosition.y)
        this.content.y = Phaser.Math.Clamp(this.content.y, -this.content.height + 600, 50)
      }
    })
  }
}
*/


/*
const MissionScene = () => {
  const gameRef = useRef(null)

  useEffect(() => {
    if (gameRef.current) return

    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: [MissionScene],
      backgroundColor: '#2d2d2d'
    }

    gameRef.current = new Phaser.Game(config)

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true)
        gameRef.current = null
      }
    }
  }, [])

  return React.createElement('div', { id: 'phaser-game' })
}
*/
//export default MissionScene