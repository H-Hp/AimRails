export default class Tooltip {
  constructor(scene){

    this.scene = scene

    this.container = scene.add.container(0,0)
    this.container.setDepth(10000)

    // 背景
    this.bg = scene.add.rectangle(0,0,10,10,0x000000,0.8)
      .setOrigin(0)

    // テキスト
    this.text = scene.add.text(0,0,"",{
      fontSize:"16px",
      color:"#ffffff",
      padding:{x:8,y:5}
    })

    this.container.add([this.bg,this.text])

    this.container.setVisible(false)

  }

  show(text,x,y){

    this.text.setText(text)

    const padding = 10

    const width = this.text.width + padding
    const height = this.text.height + padding

    this.bg.setSize(width,height)

    this.container.setPosition(x,y)

    this.container.setVisible(true)

  }

  hide(){
    this.container.setVisible(false)
  }

}