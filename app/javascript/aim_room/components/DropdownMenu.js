import Phaser from 'phaser';

class DropdownMenu extends Phaser.GameObjects.Container {
  constructor(scene, x, y, options) {
      super(scene, x, y);
      this.scene = scene;
      this.options = options;
      //this.selectedOption = 'Select an option';
      this.selectedOption = options[0];
      this.isOpen = false;

      this.createDropdown();
      scene.add.existing(this);
  }

  createDropdown() {
      //const dropdownWidth = 200;
      const dropdownWidth = 160;
      const dropdownHeight = 40;
      const optionHeight = 30;

      // ドロップダウンの背景
      this.dropdownBg = this.scene.add.graphics();
      this.dropdownBg.fillStyle(0x444444, 1);
      this.dropdownBg.fillRect(0, 0, dropdownWidth, dropdownHeight);

      // ドロップダウンのテキスト
      this.dropdownText = this.scene.add.text(10, 10, this.selectedOption, {
          fontSize: '18px',
          fill: '#ffffff'
      });

      // ドロップダウン矢印
      this.arrow = this.scene.add.triangle(180, 20, 0, 0, 10, 10, 20, 0, 0xffffff);

      // オプションのコンテナ（初期状態では非表示）
      this.optionsContainer = this.scene.add.container(0, 40);
      this.optionsContainer.setVisible(false);

      // オプションの背景とテキストを作成
      this.options.forEach((option, index) => {
          const optionBg = this.scene.add.graphics();
          optionBg.fillStyle(0x666666, 1);
          optionBg.fillRect(0, index * optionHeight, dropdownWidth, optionHeight);

          const optionText = this.scene.add.text(10, index * optionHeight + 5, option, {
              //fontSize: '16px',
              fontSize: '10px',
              fill: '#ffffff'
          });

          optionBg.setInteractive(new Phaser.Geom.Rectangle(0, index * optionHeight, dropdownWidth, optionHeight), Phaser.Geom.Rectangle.Contains);
          
          optionBg.on('pointerover', () => {
              optionBg.clear();
              optionBg.fillStyle(0x888888, 1);
              optionBg.fillRect(0, index * optionHeight, dropdownWidth, optionHeight);
          });

          optionBg.on('pointerout', () => {
              optionBg.clear();
              optionBg.fillStyle(0x666666, 1);
              optionBg.fillRect(0, index * optionHeight, dropdownWidth, optionHeight);
          });

          optionBg.on('pointerdown', () => {
              this.selectOption(option);
          });

          this.optionsContainer.add([optionBg, optionText]);
      });

      // ドロップダウンをクリックしたときの処理
      this.dropdownBg.setInteractive(new Phaser.Geom.Rectangle(0, 0, dropdownWidth, dropdownHeight), Phaser.Geom.Rectangle.Contains);
      this.dropdownBg.on('pointerdown', this.toggleDropdown, this);

      this.add([this.dropdownBg, this.dropdownText, this.arrow, this.optionsContainer]);
  }

  toggleDropdown() {
      this.isOpen = !this.isOpen;
      this.optionsContainer.setVisible(this.isOpen);
      
      // 矢印の回転
      this.arrow.angle = this.isOpen ? 180 : 0;
  }

  selectOption(option) {
      this.selectedOption = option;
      this.dropdownText.setText(option);
      this.toggleDropdown();
      
      // 選択イベントを発火
      this.emit('optionSelected', option);
  }
}

export default DropdownMenu;
