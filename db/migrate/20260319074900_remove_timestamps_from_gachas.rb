class RemoveTimestampsFromGachas < ActiveRecord::Migration[6.1]
  def change
    remove_column :gachas, :created_at, :datetime
	  remove_column :gachas, :updated_at, :datetime
  end
end
