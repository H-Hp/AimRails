class CreateAims < ActiveRecord::Migration[6.1]
  def change
    create_table :aims do |t|
      t.string :titile
      t.text :content

      t.timestamps
    end
  end
end
