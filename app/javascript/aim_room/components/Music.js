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

      this.muteCheckbox = null
      this.muteCheckboxFill = null
      this.muteLabel = null

      this.volumeBar = null
      this.volumeBarFill = null
      this.volumeMarker = null

      this.seekBar = null;
      this.seekBarFill = null;
      this.seekMarker = null
      this.seekPosition = 0

      this.currentMusic = null;
      this.musicList = musicPaths;
      this.currentTrack = 0;

      this.volume = 0.1
      this.isMuted = false
      this.isDraggingVolume = false
      this.isDraggingSeek = false
  
      // メソッドをインスタンスにバインド
      this.togglePlay = this.togglePlay.bind(this);
      this.nextTrack = this.nextTrack.bind(this);
      this.prevTrack = this.prevTrack.bind(this);
      this.loadTrack = this.loadTrack.bind(this);
      //this.updateSeekBar = this.updateSeekBar.bind(this);
      this.updateBars = this.updateBars.bind(this);

      this.selectionText;

      this.loadAudioSettings()

      this.musicContainer = scene.add.container(0, 50);

      //ウィンドウ
      this.window = scene.add.rectangle(200, -100, window.innerWidth*0.6, 150, 0x192f60)
      this.musicContainer.add(this.window)

      // Previous Track Button
      //this.prevButton = scene.add.image(320, y, 'prevButton')
      this.prevButton = scene.add.image(window.innerWidth*0.15, y, 'prevButton').setInteractive().setScale(0.2)
        .on('pointerdown', () => this.prevTrack());
      this.prevButton.on('pointerover', () => { scene.input.setDefaultCursor('pointer') })
      this.prevButton.on('pointerout', () => { scene.input.setDefaultCursor('default') });
      this.musicContainer.add(this.prevButton)

      
      // Play/Pause Button
      //this.playButton = scene.add.image(400, y, 'playButton')
      this.playButton = scene.add.image(window.innerWidth*0.2, y, 'playButton').setInteractive().setScale(0.2)
      .on('pointerdown', () => this.togglePlay());
      this.playButton.on('pointerover', () => { scene.input.setDefaultCursor('pointer') })
      this.playButton.on('pointerout', () => { scene.input.setDefaultCursor('default') });
      this.musicContainer.add(this.playButton)

      // Next Track Button
      //this.nextButton = scene.add.image(480, y, 'nextButton').setInteractive().setScale(0.2).on('pointerdown', () => this.nextTrack());
      this.nextButton = scene.add.image(window.innerWidth*0.25, y, 'nextButton').setInteractive().setScale(0.2).on('pointerdown', () => this.nextTrack());
      this.nextButton.on('pointerover', () => { scene.input.setDefaultCursor('pointer') })
      this.nextButton.on('pointerout', () => { scene.input.setDefaultCursor('default') });
      this.musicContainer.add(this.nextButton)

      // Mute Checkbox
      this.muteCheckbox = scene.add.rectangle(window.innerWidth*0.35, y, 20, 20, 0xffffff).setStrokeStyle(2, 0x000000).setInteractive({ useHandCursor: true })
        .on('pointerdown', this.toggleMute, this)
      this.muteCheckboxFill = scene.add.rectangle(window.innerWidth*0.35, y, 5, 5, 0x000000).setVisible(false)
      this.muteLabel = scene.add.text(window.innerWidth*0.28, y-5, 'Mute', { fontSize: '18px', color: '#ffffff' })
      this.musicContainer.add([this.muteCheckbox, this.muteCheckboxFill,this.muteLabel ])

      // Seek Bar
      this.seekBar = scene.add.rectangle(window.innerWidth*0.35, y-30, 200, 10, 0x888888).setInteractive({ useHandCursor: true })
        .on('pointerdown', this.startSeekDrag, this)
        .on('pointermove', this.updateSeekDrag, this)
        .on('pointerup', this.endSeekDrag, this)
      this.seekBarFill = scene.add.rectangle(window.innerWidth*0.35-100, y-30, 0, 10, 0xffffff).setOrigin(0, 0.5)
      this.seekMarker = scene.add.circle(window.innerWidth*0.35, y-30, 8, 0xff0000).setInteractive({ useHandCursor: true })
        .on('pointerdown', this.startSeekDrag, this)
        .on('pointermove', this.updateSeekDrag, this)
        .on('pointerup', this.endSeekDrag, this)
      this.musicContainer.add([this.seekBar, this.seekBarFill,this.seekMarker ])


      // Volume Bar
      this.volumeBar = scene.add.rectangle(window.innerWidth*0.35, y+30, 200, 10, 0x888888).setInteractive({ useHandCursor: true })
        .on('pointerdown', this.startVolumeDrag, this)
        .on('pointermove', this.updateVolumeDrag, this)
        .on('pointerup', this.endVolumeDrag, this)
      this.volumeBarFill = scene.add.rectangle(window.innerWidth*0.35-100, y+30, 20, 10, 0xffffff).setOrigin(0, 0.5)
      this.volumeMarker = scene.add.circle(window.innerWidth*0.35, y+30, 8, 0x00ff00).setInteractive({ useHandCursor: true })
        .on('pointerdown', this.startVolumeDrag, this)
        .on('pointermove', this.updateVolumeDrag, this)
        .on('pointerup', this.endVolumeDrag, this)
      this.musicContainer.add([this.volumeBar, this.volumeBarFill,this.volumeMarker ])
    
      // 閉じるボタンのイベントリスナー
      this.closeWindowButton = scene.add.image(window.innerWidth*0.45,  -50, 'close').setDisplaySize(50, 50).setInteractive({ useHandCursor: true });
      this.closeWindowButton.on('pointerdown', this.closeWindow, this.musicContainer);// 閉じるボタンのイベントリスナー
      this.musicContainer.add(this.closeWindowButton)


      /*// Seek Bar
      //this.seekBar = scene.add.rectangle(650, y, 200, 10, 0x888888);
      //this.seekBarFill = scene.add.rectangle(650, y, 0, 10, 0xffffff)
      this.seekBar = scene.add.rectangle(window.innerWidth*0.42, y, 200, 10, 0x888888);
      this.seekBarFill = scene.add.rectangle(window.innerWidth*0.42, y, 0, 10, 0xffffff).setOrigin(0, 0.5);
      this.seekBarFill.on('pointerover', () => { scene.input.setDefaultCursor('pointer') })
      this.seekBarFill.on('pointerout', () => { scene.input.setDefaultCursor('default') });
      this.musicContainer.add([this.seekBar,this.seekBarFill])
      */

      this.serAudio()

      // Load first track
      this.loadTrack(this.currentTrack);
      //scene.loadTrack(this.currentTrack);

      // Update seek bar
      scene.time.addEvent({
      //this.time.addEvent({
          delay: 100,
          //callback: this.updateSeekBar,
          callback: this.updateBars,
          callbackScope: this,
          loop: true
      });

      //const options = ['Option 1', 'Option 2', 'Option 3'];
      //const options = musicList;
      const options = musicNames;
      this.dropdown = new DropdownMenu(scene, 10, y-25, options);
      this.dropdown.on('optionSelected', this.handleOptionSelected, this);// ドロップダウンの選択イベントをリッスン
      this.musicContainer.add(this.dropdown)
      
      //this.add([this.playButton,this.nextButton,this.prevButton,this.seekBar,this.seekBarFill]);
      this.add(this.musicContainer)
      scene.add.existing(this); //シーンにこのコンテナを追加

  }

  loadAudioSettings() {
    const storedMuted = localStorage.getItem('isMuted')
    if (storedMuted !== null) {
      this.isMuted = JSON.parse(storedMuted)
    }

    const storedVolume = localStorage.getItem('volume')
    if (storedVolume !== null) {
      this.volume = JSON.parse(storedVolume)
    }

    const storedSeek = localStorage.getItem('seekPosition')
    if (storedSeek !== null) {
      this.seekPosition = JSON.parse(storedSeek)
    }

  }
  serAudio(){
    if(this.toggleMute){
      this.muteCheckboxFill.setVisible(true)
    }else{
      this.muteCheckboxFill.setVisible(false)
    }
  }

  saveAudioSettings() {
    localStorage.setItem('isMuted', JSON.stringify(this.isMuted))
    localStorage.setItem('volume', JSON.stringify(this.volume))
    /*if (this.currentMusic && this.currentMusic.isPlaying) {
      console.log("this.seekPosition:"+this.seekPosition)
      localStorage.setItem('seekPosition', JSON.stringify(this.currentMusic.seek))
    }*/
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
    //console.log("index:"+index)
    //console.log("this.musicList[index]:"+this.musicList[index])
    //console.log("this.musicList[0]:"+this.musicList[0])
    //console.log("this.seekPosition:"+this.seekPosition)
    const soundKey = this.musicList[index];
      if (this.currentMusic) {
          this.currentMusic.stop();
      }

      // Check if the sound is already in the sound manager
      if (this.myscene.sound.get(soundKey)) {
          this.currentMusic = this.myscene.sound.get(soundKey);
      } else {
          // If not, add the sound
          this.currentMusic = this.myscene.sound.add(soundKey);
          }
      
      //this.currentMusic = this.myscene.sound.add(this.musicList[index]);
      this.currentMusic.setVolume(this.volume)
      this.updateVolume()
      this.currentMusic.play({ seek: this.seekPosition });
      this.playButton.setTexture('pauseButton');
  }
  handleOptionSelected(option) {
    console.log("handleOptionSelectedのoption:"+option)
      //this.selectionText.setText(`Selected: ${option}`);

      this.currentTrack = (this.currentTrack + 1) % this.musicList.length;
      this.loadTrack(this.currentTrack);
  }

  toggleMute() {
    this.isMuted = !this.isMuted
    this.muteCheckboxFill.setVisible(this.isMuted)
    this.updateVolume()
    this.saveAudioSettings()
  }

  updateVolume() {
    const effectiveVolume = this.isMuted ? 0 : this.volume
    this.currentMusic.setVolume(effectiveVolume)
    this.saveAudioSettings()
  }

  startVolumeDrag(pointer) {
    this.isDraggingVolume = true
    this.updateVolumeDrag(pointer)
  }

  updateVolumeDrag(pointer) {
    if (this.isDraggingVolume) {
      //const newVolume = Phaser.Math.Clamp((pointer.x - this.volumeBar.x) / this.volumeBar.width, 0, 1)
      const newVolume = Phaser.Math.Clamp((pointer.x - this.volumeBar.x+100) / this.volumeBar.width, 0, 1)
      console.log("updateVolumeDrag(pointer)newVolume:"+newVolume)
      this.volume = newVolume
      this.updateVolume()
      this.updateVolumeMarker()
    }
  }

  endVolumeDrag() {
    this.isDraggingVolume = false
  }

  startSeekDrag(pointer) {
    this.isDraggingSeek = true
    this.currentMusic.pause()
    this.updateSeekDrag(pointer)
  }

  updateSeekDrag(pointer) {
    //console.log("pointer.x:"+pointer.x)
    //console.log("this.seekBar.x:"+this.seekBar.x)
    if (this.isDraggingSeek) {
      const newPosition = Phaser.Math.Clamp((pointer.x - this.seekBar.x+100) / this.seekBar.width, 0, 1)
      //console.log("updateSeekDrag(pointer)のnewPosition:"+newPosition)
      const seekTime = this.currentMusic.duration * newPosition
      this.currentMusic.seek = seekTime
      this.updateSeekMarker()
    }
  }

  endSeekDrag() {
    this.isDraggingSeek = false
    this.currentMusic.resume()
  }

  updateBars() {
    if (this.currentMusic && this.currentMusic.isPlaying) {
      const progress = this.currentMusic.seek / this.currentMusic.duration
      //this.seekBarFill.width = this.seekBar.width * progress
      this.seekBarFill.width = this.seekBar.width * progress
      //console.log("updateBars()のprogress:"+progress)
      //console.log("updateBars()のthis.seekBarFill.width:"+this.seekBarFill.width)
      this.updateSeekMarker()
    }
    //console.log("updateBars()のthis.volume:"+this.volume)
    //console.log("updateBars()のthis.volumeBar.width:"+this.volumeBar.width)

    //this.volumeBarFill.width = this.volumeBar.width * this.volume
    this.volumeBarFill.width = this.volumeBar.width * this.volume
    this.updateVolumeMarker()
  }

  updateSeekMarker() {
    //console.log("updateSeekMarkerのthis.seekBar.x:"+this.seekBar.x)
    //console.log("updateSeekMarkerのthis.seekBarFill.width:"+this.seekBarFill.width)
    this.seekMarker.x = this.seekBar.x + this.seekBarFill.width-100
  }

  updateVolumeMarker() {
    //console.log("updateVolumeMarkerのthis.volumeBar.x:"+this.volumeBar.x)
    //console.log("updateVolumeMarkerのthis.volumeBarFill.width:"+this.volumeBarFill.width)
    //this.volumeMarker.x = this.volumeBar.x + this.volumeBarFill.width
    this.volumeMarker.x = this.volumeBar.x + this.volumeBarFill.width-100
  }
  closeWindow(){
    this.setVisible(false)
  }

}