class RenamePathToKeyInItems < ActiveRecord::Migration[6.1]
  def change
    rename_column :items, :path, :key
  end
end
