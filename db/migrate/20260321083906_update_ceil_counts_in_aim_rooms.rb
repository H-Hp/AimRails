class UpdateCeilCountsInAimRooms < ActiveRecord::Migration[6.1]
  def change
    # 既存のceil_countをpickup_ceil_countにリネーム
    rename_column :aim_rooms, :ceil_count, :pickup_ceil_count

    # total_ssr_countカラムを追加
    # デフォルト値を 0 にし、nullを許可しない
    add_column :aim_rooms, :total_ssr_count, :integer, default: 0, null: false
  end
end
