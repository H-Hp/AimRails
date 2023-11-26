class RemoveUpdatedAtFromRelationships < ActiveRecord::Migration[6.1]
  def change
    remove_column :relationships, :updated_at, :datetime
  end
end
