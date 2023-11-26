class RemoveUpdatedAtFromPlay < ActiveRecord::Migration[6.1]
  def change
    remove_column :plays, :updated_at, :datetime
  end
end
