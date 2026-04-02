export default class UIScene extends Phaser.Scene {

  constructor(){
    super('UIScene')
  }

  create(){

    const button = this.add.text(
      50,
      50,
      'Mission',
      {fontSize:'24px', backgroundColor:'#3cf113'}
    )
    .setInteractive()

    button.on('pointerdown', ()=>{

      this.scene.start('MissionScene')

    })

  }

}