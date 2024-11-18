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
    this.load.image('other_backgroud', this.props.other_backgroud);
    this.load.image('check', this.props.check_icon);
  }

  create() {
    const mission_data=[
      {id: 1, name: 'login', type: 'login', num: 20, get: 2,cristal: 10, status: 'yet'},
      {id: 2, name: 'レアガチャ', description: 'レアなパックです。',cristalCost: 150},
    ];

    //const background = this.add.image(0, 0, 'gacha_backgroud').setOrigin(0, 0);
    //background.setDisplaySize(1600, 1200);
    const background = this.add.image(window.innerWidth/2, window.innerHeight/2, 'other_backgroud')
    background.setDisplaySize(window.innerWidth, window.innerHeight);

    const mainContainer = this.add.container(0, 0);

    this.Header = new Header(this, 'ミッション',this.loginPlugin);

    // ログインセクション	
    this.loginSection = this.add.container(20, 100);
    const loginBg = this.add.rectangle(20, 0, 2500, 120, 0x003366).setOrigin(0, 0);
    const loginBgInside = this.add.rectangle(40, 40, 2400, 60, "#00003f").setOrigin(0, 0);
    const loginTitle = this.add.text(40, 15, 'ログイン', { fontSize: '12px', fill: '#ffffff' });
    this.loginSection.add([loginBg,loginBgInside, loginTitle]);

    this.playTimeSection = this.add.container(20, 200);
    const playTimeBg = this.add.rectangle(20, 0, 2500, 120, 0x003366).setOrigin(0, 0);
    const playTimeBgInside = this.add.rectangle(40, 40, 2400, 60, "#00003f").setOrigin(0, 0);
    const playTimeTitle = this.add.text(40, 20, 'プレイタイムボーナス', { fontSize: '12px', fill: '#ffffff' });
    this.playTimeSection.add([playTimeBg,playTimeBgInside, playTimeTitle]);

    this.gachaRollSection = this.add.container(20, 300);
    const gachaRollBg = this.add.rectangle(20, 0, 2500, 120, 0x003366).setOrigin(0, 0);
    const gachaRollBgInside = this.add.rectangle(40, 40, 2400, 60, "#00003f").setOrigin(0, 0);
    const gachaRollTitle = this.add.text(40, 20, 'ガチャ回転回数', { fontSize: '12px', fill: '#ffffff' });
    this.gachaRollSection.add([gachaRollBg,gachaRollBgInside, gachaRollTitle]);

    const right_btn= this.add.text(window.innerWidth-100, 100, '>', {fontSize: '16px',color: '#ccff00',backgroundColor: '#212121',align: 'center',padding: { x: 5, y: 5 }}).setOrigin(0, 0).setFixedSize(30, 30).setInteractive();
    right_btn.on('pointerdown', () => {this.toRight(this.loginSection)});
    right_btn.on('pointerover', () => {this.input.setDefaultCursor('pointer');right_btn.setTint(0xfdd35c);});
    right_btn.on('pointerout', () => {this.input.setDefaultCursor('default');right_btn.setTint(0xccff00);});
    const left_btn= this.add.text(window.innerWidth-150, 100, '<', {fontSize: '16px',color: '#ccff00',backgroundColor: '#212121',align: 'center',padding: { x: 5, y: 5 }}).setOrigin(0, 0).setFixedSize(30, 30).setInteractive();
    left_btn.on('pointerdown', () => {this.toLeft(this.loginSection)});
    left_btn.on('pointerover', () => {this.input.setDefaultCursor('pointer');left_btn.setTint(0xfdd35c);});
    left_btn.on('pointerout', () => {this.input.setDefaultCursor('default');left_btn.setTint(0xccff00);});

    const playTime_right_btn= this.add.text(window.innerWidth-100, 200, '>', {fontSize: '16px',color: '#ccff00',backgroundColor: '#212121',align: 'center',padding: { x: 5, y: 5 }}).setOrigin(0, 0).setFixedSize(30, 30).setInteractive();
    playTime_right_btn.on('pointerdown', () => {this.toRight(this.playTimeSection)});
    playTime_right_btn.on('pointerover', () => {this.input.setDefaultCursor('pointer');playTime_right_btn.setTint(0xfdd35c);});
    playTime_right_btn.on('pointerout', () => {this.input.setDefaultCursor('default');playTime_right_btn.setTint(0xccff00);});
    const playTime_left_btn= this.add.text(window.innerWidth-150, 200, '<', {fontSize: '16px',color: '#ccff00',backgroundColor: '#212121',align: 'center',padding: { x: 5, y: 5 }}).setOrigin(0, 0).setFixedSize(30, 30).setInteractive();
    playTime_left_btn.on('pointerdown', () => {this.toLeft(this.playTimeSection)});
    playTime_left_btn.on('pointerover', () => {this.input.setDefaultCursor('pointer');left_btn.setTint(0xfdd35c);});
    playTime_left_btn.on('pointerout', () => {this.input.setDefaultCursor('default');left_btn.setTint(0xccff00);});

    const gachaRoll_right_btn= this.add.text(window.innerWidth-100, 300, '>', {fontSize: '16px',color: '#ccff00',backgroundColor: '#212121',align: 'center',padding: { x: 5, y: 5 }}).setOrigin(0, 0).setFixedSize(30, 30).setInteractive();
    gachaRoll_right_btn.on('pointerdown', () => {this.toRight(this.loginSection)});
    gachaRoll_right_btn.on('pointerover', () => {this.input.setDefaultCursor('pointer');gachaRoll_right_btn.setTint(0xfdd35c);});
    gachaRoll_right_btn.on('pointerout', () => {this.input.setDefaultCursor('default');gachaRoll_right_btn.setTint(0xccff00);});
    const gachaRoll_left_btn= this.add.text(window.innerWidth-150, 300, '<', {fontSize: '16px',color: '#ccff00',backgroundColor: '#212121',align: 'center',padding: { x: 5, y: 5 }}).setOrigin(0, 0).setFixedSize(30, 30).setInteractive();
    gachaRoll_left_btn.on('pointerdown', () => {this.toLeft(this.loginSection)});
    gachaRoll_left_btn.on('pointerover', () => {this.input.setDefaultCursor('pointer');gachaRoll_left_btn.setTint(0xfdd35c);});
    gachaRoll_left_btn.on('pointerout', () => {this.input.setDefaultCursor('default');gachaRoll_left_btn.setTint(0xccff00);});


    this.getButton = this.add.text(window.innerWidth / 2, window.innerHeight-150, '報酬をゲット', {fontSize: '24px',fill: '#ccff00',backgroundColor: '#212121',padding: { x: 5, y: 5 }}).setOrigin(0.5).setInteractive()
    this.getButton.on('pointerdown', this.all_getMissionBonus, this)// 閉じるボタンのイベントリスナー
    this.getButton.on('pointerover', () => {this.input.setDefaultCursor('pointer');this.getButton.setTint(0xfdd35c);});
    this.getButton.on('pointerout', () => {this.input.setDefaultCursor('default');this.getButton.setTint(0xccff00);});

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

  }

  checkMissionBonus(){
    fetch('/checkMissionBonus', { 
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content 
      }
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
          //const lineY = this.loginSection.y-40;
          const loginSection_Y = this.loginSection.y-30;
          const playtimeSection_Y = this.playTimeSection.y-130;
          const gachaRollSection_Y = this.gachaRollSection.y-230;
          //const loginSection_line = this.add.line(0, 0, lineStartX, loginSection_Y, lineEndX, loginSection_Y, 0xFF0000).setLineWidth(2);
          //const playtimeSection_line = this.add.line(0, 0, lineStartX, playtimeSection_Y, lineEndX, playtimeSection_Y, 0xFF0000).setLineWidth(2);
          //const gachaRollSection_line = this.add.line(0, 0, lineStartX, gachaRollSection_Y, lineEndX, gachaRollSection_Y, 0xFF0000).setLineWidth(2);

          // Create green containers with text
          const containerWidth = 80;
          const containerHeight = 80;
          const containerSpacing = (lineEndX - lineStartX - containerWidth) / 19; // 19 spaces for 20 containers

          this.mission_create(loginSection_Y,longinBonusNewAchiveNum_for,this.longinBonusAlreadyGettedNum,this.loginSection,1);
          this.mission_create(playtimeSection_Y,playtimeBonusNewAchiveNum_for,this.playtimeBonusAlreadyGettedNum,this.playTimeSection,2);
          this.mission_create(gachaRollSection_Y,gachaRollBonusNewAchiveNum_for,this.gachaRollBonusAlreadyGettedNum,this.gachaRollSection,3);
          
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
    //const line = this.add.line(0, 0, lineStartX, lineY, lineEndX, lineY, 0xFF0000);
    //line.setLineWidth(2);

    // Create green containers with text
    const containerWidth = 40;
    const containerHeight = 40;
    const containerSpacing = (lineEndX - lineStartX - containerWidth) / 19; // 19 spaces for 20 containers

        for (let i = 0; i < 20; i++) {
          const containerX = lineStartX + (containerWidth + containerSpacing) * i*5;
          if (i < AlreadyGettedNum){//すでに取得済みのミッション
            this.container = this.add.rectangle(containerX, lineY, containerWidth, containerHeight, 0x474695);
            this.container.setStrokeStyle(1, 0x808080);

            const cristal =this.add.text(containerX, lineY+20, `50`, {fontSize: '12px',fill: '#f5f5f5'}).setOrigin(0.5);

            const gacha_thumbnail = this.add.image(containerX, lineY-0, 'money');
            gacha_thumbnail.setDisplaySize(25, 25);// 画像の幅と高さを指定
            gacha_thumbnail.setInteractive();
            section.add([this.container,cristal, gacha_thumbnail]);

          }else{//まだ未取得のミッション
            this.container = this.add.rectangle(containerX, lineY, containerWidth, containerHeight, 0x474695);
            this.container.setStrokeStyle(1, 0x808080);
            
            //まだ取得してないけど、獲得条件を満たしているミッションなら
            if(0<NewAchiveNum_for){
              const yetGettingNewAchive_bg = this.add.rectangle(containerX, lineY, containerWidth+5, containerHeight+5, 0xCCCC00).setStrokeStyle(5, 0xffffff).setInteractive({ useHandCursor: true });
              section.add(yetGettingNewAchive_bg)
              yetGettingNewAchive_bg.on('pointerdown', () => { this.one_getMissionBonus(this.container,containerX, lineY,containerWidth, containerHeight,mission_type_num) });
            }

            const cristal =this.add.text(containerX, lineY+0, `50`, {fontSize: '12px',fill: '#f5f5f5'}).setOrigin(0.5);
            //this.add.text(containerX, lineY+20, `50`, {fontSize: '24px',fill: '#000'}).setOrigin(0.5);

            const gacha_thumbnail = this.add.image(containerX, lineY-0, 'money');
            gacha_thumbnail.setDisplaySize(25, 25);// 画像の幅と高さを指定
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
            checkBtn.setDisplaySize(15, 15);// 画像の幅と高さを指定
            section.add([this.overlay, checkBtn]);
          }
      }
  }

  createBadge(scene, x, y, num) {
    const badgeContainer = this.add.container(x, y);
    const badge = scene.add.circle(0, 0, 8, 0xff0000);
    const text = scene.add.text(0, 0, num.toString(), {font: '12px Arial',fill: '#ffffff'}).setOrigin(0.5);
    badgeContainer.add([badge,text])
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

  toRight(Section) {
    Section.x = Section.x-100;
  }
  toLeft(Section) {
    Section.x = Section.x+100;
  }
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

get_cristal(){
  console.log("クリスタルゲット")
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
}