class UpdateAimRoomsColumns < ActiveRecord::Migration[6.1]
  def change
    #タイムスタンプ（created_at, updated_at）を削除
    remove_timestamps :aim_rooms

    #ceil_count カラムを追加
    # デフォルト値を 0、空を許可しない（null: false）設定にする
    add_column :aim_rooms, :ceil_count, :integer, default: 0, null: false
  end
end
