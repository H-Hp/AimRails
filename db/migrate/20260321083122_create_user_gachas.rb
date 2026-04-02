class CreateUserGachas < ActiveRecord::Migration[6.1]
  def change
    create_table :user_gachas do |t|
      # user_id: 外部キー。null禁止。
      t.references :user, null: false, foreign_key: true
      
      # gacha_id: どのガチャで当たったか。
      t.references :gacha, null: false, foreign_key: true
      
      # item_id: 当たったアイテム。
      t.references :item, null: false, foreign_key: true
      
      # 取得日時
      t.datetime :acquired_at, null: false

      # t.timestamps は記述しないことで created_at / updated_at を作成させない
    end
  end
end
