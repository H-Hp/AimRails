class AddUseridAndImageUrlToTable < ActiveRecord::Migration[6.1]
  def change
    add_column :aims, :user_id, :integer
    add_column :aims, :image_url, :string
  end
end
