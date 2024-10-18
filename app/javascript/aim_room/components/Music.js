import Phaser from 'phaser';
import DropdownMenu from './DropdownMenu.js';

export default class Music extends Phaser.GameObjects.Container {
    constructor(scene, x,y,musicPaths,musicNames) {
      super(scene, x, y);
      //super(scene);
      this.myscene= scene;

      this.playButton = null;
      this.nextButton = null;
      this.prevButton = null;
      this.seekBar = null;
      this.seekBarFill = null;
      this.currentMusic = null;
      //this.musicList = musicList;
      this.musicList = musicPaths;
      this.currentTrack = 0;


      // メソッドをインスタンスにバインド
      this.togglePlay = this.togglePlay.bind(this);
      this.nextTrack = this.nextTrack.bind(this);
      this.prevTrack = this.prevTrack.bind(this);
      this.loadTrack = this.loadTrack.bind(this);
      //this.updateSeekBar = this.updateSeekBar.bind(this);

      this.selectionText;

      this.musicContainer = scene.add.container(0, 50);


      // Previous Track Button
      //this.prevButton = scene.add.image(320, y, 'prevButton')
      this.prevButton = scene.add.image(window.innerWidth*0.2, y, 'prevButton')
        .setInteractive()
        .setScale(0.2)
        .on('pointerdown', () => this.prevTrack());
      this.prevButton.on('pointerover', () => {
        scene.input.setDefaultCursor('pointer')
      })
      this.prevButton.on('pointerout', () => {
        scene.input.setDefaultCursor('default')
      });
      this.musicContainer.add(this.prevButton)

      
      // Play/Pause Button
      //this.playButton = scene.add.image(400, y, 'playButton')
      this.playButton = scene.add.image(window.innerWidth*0.25, y, 'playButton')
      .setInteractive()
      .setScale(0.2)
      .on('pointerdown', () => this.togglePlay());
      this.playButton.on('pointerover', () => {
        scene.input.setDefaultCursor('pointer')
      })
      this.playButton.on('pointerout', () => {
        scene.input.setDefaultCursor('default')
      });
      this.musicContainer.add(this.playButton)
  

      // Next Track Button
      //this.nextButton = scene.add.image(480, y, 'nextButton').setInteractive().setScale(0.2).on('pointerdown', () => this.nextTrack());
      this.nextButton = scene.add.image(window.innerWidth*0.3, y, 'nextButton').setInteractive().setScale(0.2).on('pointerdown', () => this.nextTrack());
      this.nextButton.on('pointerover', () => { scene.input.setDefaultCursor('pointer') })
      this.nextButton.on('pointerout', () => { scene.input.setDefaultCursor('default') });
      this.musicContainer.add(this.nextButton)


      // Seek Bar
      //this.seekBar = scene.add.rectangle(650, y, 200, 10, 0x888888);
      //this.seekBarFill = scene.add.rectangle(650, y, 0, 10, 0xffffff)
      this.seekBar = scene.add.rectangle(window.innerWidth*0.42, y, 200, 10, 0x888888);
      this.seekBarFill = scene.add.rectangle(window.innerWidth*0.42, y, 0, 10, 0xffffff)
        .setOrigin(0, 0.5);
      this.seekBarFill.on('pointerover', () => {
        scene.input.setDefaultCursor('pointer')
      })
      this.seekBarFill.on('pointerout', () => {
        scene.input.setDefaultCursor('default')
      });
      this.musicContainer.add([this.seekBar,this.seekBarFill])

      // Load first track
      this.loadTrack(this.currentTrack);
      //scene.loadTrack(this.currentTrack);

      // Update seek bar
      scene.time.addEvent({
      //this.time.addEvent({
          delay: 100,
          callback: this.updateSeekBar,
          callbackScope: this,
          loop: true
      });

      //const options = ['Option 1', 'Option 2', 'Option 3'];
      //const options = musicList;
      const options = musicNames;
      this.dropdown = new DropdownMenu(scene, 10, y-50, options);
      this.dropdown.on('optionSelected', this.handleOptionSelected, this);// ドロップダウンの選択イベントをリッスン
      this.musicContainer.add(this.dropdown)
      
      //this.add([this.playButton,this.nextButton,this.prevButton,this.seekBar,this.seekBarFill]);
      this.add(this.musicContainer)
      scene.add.existing(this); //シーンにこのコンテナを追加

  }

  togglePlay() {
      if (this.currentMusic.isPlaying) {
          this.currentMusic.pause();
          this.playButton.setTexture('playButton');
      } else {
          this.currentMusic.resume();
          this.playButton.setTexture('pauseButton');
      }
  }

  nextTrack() {
      this.currentTrack = (this.currentTrack + 1) % this.musicList.length;
      this.loadTrack(this.currentTrack);
  }

  prevTrack() {
      this.currentTrack = (this.currentTrack - 1 + this.musicList.length) % this.musicList.length;
      this.loadTrack(this.currentTrack);
  }

  loadTrack(index) {
    console.log("index:"+index)
    console.log("this.musicList[index]:"+this.musicList[index])
    console.log("this.musicList[0]:"+this.musicList[0])
      if (this.currentMusic) {
          this.currentMusic.stop();
      }
      this.currentMusic = this.myscene.sound.add(this.musicList[index]);
      this.currentMusic.play();
      this.playButton.setTexture('pauseButton');
  }
  handleOptionSelected(option) {
      this.selectionText.setText(`Selected: ${option}`);

      this.currentTrack = (this.currentTrack + 1) % this.musicList.length;
      this.loadTrack(this.currentTrack);
  }
}