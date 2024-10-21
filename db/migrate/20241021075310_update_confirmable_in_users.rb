class UpdateConfirmableInUsers < ActiveRecord::Migration[6.1]
  def change
    # 例: 既存のマイグレーションで削除されなかったカラムがある場合
    remove_column :users, :unconfirmed_email, :string if column_exists?(:users, :unconfirmed_email)
    
    # 例: インデックスが削除されていない場合
    remove_index :users, :confirmation_token if index_exists?(:users, :confirmation_token)
    
    # その他の必要な変更をここに追加
  end
end
