class RenameColumnToTable < ActiveRecord::Migration[6.1]
  def change
    rename_column :aims, :titile, :title
  end
end