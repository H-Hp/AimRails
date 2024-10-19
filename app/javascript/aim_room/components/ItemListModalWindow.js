import Phaser from 'phaser'
import ButtonText from './ButtonText.js';


export default class ModalWindow extends Phaser.GameObjects.Container {
  constructor(scene, x, y, width, height, content,my_items, updateCallback) {
    super(scene, x, y)
    
    this.updateCallback = updateCallback;

    this.width = width
    this.height = height
    const window_innerWidth = window.innerWidth
    const window_innerHeight = window.innerHeight

    const ModalContainer = scene.add.container(10, 10);

    this.modalBg = scene.add.image(0, 0, 'bg');
    this.modalBg.setOrigin(0, 0);//画像の中心がcontainerに入るので、原点を画像の左上に変更
    this.modalBg.setDisplaySize(window_innerWidth*0.45, window_innerHeight*0.8);
    ModalContainer.add(this.modalBg)

    this.itemsContainer = scene.add.container(0, 0);
    ModalContainer.add(this.itemsContainer)

    // 閉じるボタンのイベントリスナー
    this.closeButton = scene.add.image(window_innerWidth*0.45,  20, 'close').setDisplaySize(50, 50).setInteractive({ useHandCursor: true });
    this.closeButton.on('pointerdown', this.close, ModalContainer);// 閉じるボタンのイベントリスナー
    ModalContainer.add(this.closeButton)



    const itemsPerColumn = 7;
    const columnCount = Math.ceil(my_items.length / itemsPerColumn);

    my_items.forEach((item, i) => {
      console.log(`name: ${item.name}, description: ${item.description}`);
      const columnIndex = Math.floor(i / itemsPerColumn);
      const rowIndex = i % itemsPerColumn;

      // Adjust positioning as needed
      const x = 100 + (columnIndex * 150); // Spacing columns horizontally
      const y = 100 + (rowIndex * 150); 

      const itemContainer = scene.add.container(x, y);
      this.itemsContainer.add(itemContainer)

      const itemBackground = scene.add.rectangle(0, 0, 100, 125, 0x192f60);
      itemBackground.setStrokeStyle(5, 0xffffff);
      itemBackground.setInteractive({ useHandCursor: true });
      itemContainer.add(itemBackground);
      
      let loader = new Phaser.Loader.LoaderPlugin(scene);// 新しいローダーを作成
      if(item.type=="music"){
        console.log("音楽ふぁｆ")
        loader.image('myitem'+item.id, 'assets/images/item/music.png');// 画像を読み込む
      }else{
        loader.image('myitem'+item.id, 'assets/images/item/'+item.path+'.png');// 画像を読み込む
      }
      let item_img =null;
      loader.once('complete', () => {  // 読み込み完了後に画像を表示
        item_img = scene.add.image(0, -25, 'myitem'+item.id);
        item_img.setDisplaySize(100, 75);// 画像の幅と高さを指定
        item_img.setInteractive();
        itemContainer.add(item_img);
        item_img.on('pointerdown', () => { this.oneitem_modalOpen(scene,item) })
      });
      loader.start();// 読み込みを開始

      const nameText = scene.add.text(-40, 40, item.name, { fontSize: '16px', fill: '#ffffff' });
      itemContainer.add(nameText);
      
      // コンテナ全体をカバーする透明な長方形を作成
      const hitArea = new Phaser.Geom.Rectangle(-150, -100, 200, 250)
      itemContainer.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains)

      itemContainer.on('pointerdown', () => { this.oneitem_modalOpen(scene,item) });
      itemContainer.on('pointerover', () => { scene.input.setDefaultCursor('pointer');itemBackground.setScale(1.1) })
      itemContainer.on('pointerout', () => { scene.input.setDefaultCursor('default');itemBackground.setScale(1); })
      itemBackground.on('pointerdown', () => { this.oneitem_modalOpen(scene,item) })
      nameText.on('pointerdown', () => { this.oneitem_modalOpen(scene,item) })
      //this.add(itemContainer)
      
  });


      // マスクを作成し、アイテムコンテナに適用
      //const mask = this.make.graphics({});
      const mask = scene.make.graphics({});
      mask.fillRect(50, 0,window_innerWidth*0.45, window_innerHeight*0.8);
      this.itemsContainer.setMask(mask.createGeometryMask());

      this.camera = scene.cameras.main;
      this.camera.setBounds(0, 0, 1600, 1200);

      this.cursors = scene.input.keyboard.createCursorKeys();

      scene.input.on('wheel', this.handleScroll, this);
      scene.input.on('pointerdown', this.startDrag, this);
      scene.input.on('pointermove', this.doDrag, this);
      scene.input.on('pointerup', this.endDrag, this);
      


      // シーンにこのコンテナを追加
      scene.add.existing(this)

      // 最初は非表示
      this.setVisible(false)
  }
  oneitem_modalOpen(scene,item) {
    
    //const oneitemModalContainer = scene.add.container(window.innerWidth/2+450, 500);// Create a container for the button
    const oneitemModalContainer = scene.add.container(window.innerWidth*0.5, 10);// Create a container for the button
    //const oneitem_background = scene.add.rectangle(0, 0, window.innerWidth / 2.5, height*1.5, 0x000000, 0.7)
    //const oneitem_background = scene.add.rectangle(0, 0, window.innerWidth / 2.5, window.innerHeight/1.5, 0x000000, 0.7)
    //oneitemModalContainer.add(oneitem_background)

    this.oneitem_modalBg = scene.add.image(0, 0, 'bg2');
    this.oneitem_modalBg.setOrigin(0, 0);//画像の中心がcontainerに入るので、原点を画像の左上に変更
    //this.oneitem_modalBg.setDisplaySize(window.innerWidth / 2.5, height*1.5);
    //this.oneitem_modalBg.setDisplaySize(window.innerWidth / 2.5, window.innerHeight/1.3);
    this.oneitem_modalBg.setDisplaySize(window.innerWidth*0.45, window.innerHeight*0.8);
    oneitemModalContainer.add(this.oneitem_modalBg)

    //const one_nameText = scene.add.text(-width/2.7, -height/1.5, item.name, { fontSize: '40px', fill: '#ffffff' });
    //const one_nameText = scene.add.text(-width/5, -height/3, item.name, { fontSize: '40px', fill: '#ffffff' });
    //const one_nameText = scene.add.text(-window.innerWidth/2/5, -window.innerHeight/2/3, item.name, { fontSize: '40px', fill: '#ffffff' });
    const one_nameText = scene.add.text(window.innerWidth*0.1, 50, item.name, { fontSize: '20px', fill: '#ffffff' });
    oneitemModalContainer.add(one_nameText)

    //const oneitem_descriptionText = scene.add.text(-window.innerWidth/2/5, -window.innerHeight/2/4, item.description, { fontSize: '25px', fill: '#ffffff' });
    const oneitem_descriptionText = scene.add.text(window.innerWidth*0.1, 90, item.description, { fontSize: '15px', fill: '#ffffff' });
    oneitemModalContainer.add(oneitem_descriptionText)

    //const one_item_img = scene.add.image(0, 0, 'myitem'+item.id);
    const one_item_img = scene.add.image(0, window.innerHeight*0.3, 'myitem'+item.id);
    //one_item_img.setDisplaySize(width/1.5, height/1.5);// 画像の幅と高さを指定
    one_item_img.setOrigin(0, 0);//画像の中心がcontainerに入るので、原点を画像の左上に変更
    //one_item_img.setDisplaySize(window.innerWidth/2/3, window.innerHeight/2/3);// 画像の幅と高さを指定
    one_item_img.setDisplaySize(window.innerWidth*0.45, window.innerHeight*0.3);// 画像の幅と高さを指定
    one_item_img.setInteractive();
    oneitemModalContainer.add(one_item_img)

    let text="設定する"
    if(item.type=="background"){
      text="背景に設定"
    }else if(item.type=="obj"){
      text="配置する"
    }else if(item.type=="chara"){
      text="メインキャラに設定する"
    }else if(item.type=="desk"){
      text="机に設定する"
    }
    if(item.type!="music"){
      //const in_Button = new ButtonText(scene, width/2/2-60, height/2, '壁紙にする', () => {  if (this.updateCallback) { this.updateCallback(item); }  });
      const in_Button = new ButtonText(scene, 10, 90, text, () => {  if (this.updateCallback) { this.updateCallback(item); }  });
      oneitemModalContainer.add(in_Button)
    }

    // 閉じるボタン
    //this.oneitem_closeButton = scene.add.image(-window.innerWidth/2/2/2/2+600 ,  -window.innerHeight/2/2-50, 'close').setDisplaySize(50, 50).setInteractive({ useHandCursor: true });
    this.oneitem_closeButton = scene.add.image(window.innerWidth*0.45 , 20, 'close').setDisplaySize(50, 50).setInteractive({ useHandCursor: true });
    this.oneitem_closeButton.on('pointerdown', this.oneitem_close, oneitemModalContainer);// 閉じるボタンのイベントリスナー
    oneitemModalContainer.add(this.oneitem_closeButton)

    const oneitem_sellButton = new ButtonText(scene, 150, 90, '売る', () => { this.item_sell(item) });
    oneitemModalContainer.add(oneitem_sellButton)

  }

  open() {
    this.setVisible(true)
  }

  close() {
    this.setVisible(false)
  }
  //oneitem_close(container){
    //container.setVisible(false)
  oneitem_close(){
    this.setVisible(false)
  }
  item_sell(item){
    console.log(item.name+"を売る")
  }

  handleScroll(pointer, gameObjects, deltaX, deltaY, deltaZ) {
    const scrollSpeed = 0.25;
    //if(this.itemsContainer.y <= -430){this.itemsContainer.y=-430+1;return}
    this.itemsContainer.y = Phaser.Math.Clamp(this.itemsContainer.y - deltaY * scrollSpeed, -720, 0);
    //console.log("ホイール・handleScroll"+this.itemsContainer.y)
}
startDrag(pointer) {
    this.isDragging = true;
    this.lastPointerPosition = { x: pointer.x, y: pointer.y };
    //console.log("vvｍ"+pointer.y)
}

doDrag(pointer) {
    if (!this.isDragging) return;

    const dx = pointer.x - this.itemsContainer.x;
    const dy = pointer.y - this.itemsContainer.y;

    this.itemsContainer.y = Phaser.Math.Clamp(this.itemsContainer.y + dy, -720, 0);
    this.lastPointerPosition = { x: pointer.x, y: pointer.y };
}

endDrag() {
this.isDragging = false;
}

update() {
    const scrollSpeed = 10;
    //const pointer = scene.input.activePointer;
    const pointer = this.input.activePointer;
    if (this.cursors.down.isDown) {
        this.itemsContainer.y = Phaser.Math.Clamp(this.itemsContainer.y + scrollSpeed, -720, 0);
    } else if (this.cursors.up.isDown) {
        this.itemsContainer.y = Phaser.Math.Clamp(this.itemsContainer.y - scrollSpeed, -720, 0);
    }
}

  OverwriteBackground(id){
    console.log("かべがーみ"+this);
    this.load.image('myitem4', 'assets/images/item/bg1.png');
    // ロード完了時のイベントを設定
    this.load.once('complete', () => {
        // 既存の背景を新しいテクスチャで更新
        //this.background.setTexture('new-background');
        this.background = this.add.image(0, 0, 'myitem4');
    });
    // 新しい画像のロードを開始
    this.load.start();
  }
}