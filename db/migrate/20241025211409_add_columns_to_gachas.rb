class AddColumnsToGachas < ActiveRecord::Migration[6.1]
  def change
    add_column :gachas, :name, :string, null: false, default: "" 
    add_column :gachas, :description, :text, null: false, default: "" 
    add_column :gachas, :cost, :integer, null: false, default: 0 
  end
end
