class CreateMemberships < ActiveRecord::Migration[6.0]
  def change
    create_table :memberships do |t|
      t.belongs_to :user
      t.belongs_to :conversation
      t.timestamps
    end
  end
end
