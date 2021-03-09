class RemoveUsersConversations < ActiveRecord::Migration[6.0]
  def change
    drop_table :users_conversations
  end
end
