class RemoveUpdatedAtFromContacts < ActiveRecord::Migration[6.1]
  def change
    remove_column :contacts, :updated_at, :datetime
  end
end
