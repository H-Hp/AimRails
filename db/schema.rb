# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2026_04_03_050031) do
  create_schema "auth"
  create_schema "extensions"
  create_schema "graphql"
  create_schema "graphql_public"
  create_schema "pgbouncer"
  create_schema "pgsodium"
  create_schema "pgsodium_masks"
  create_schema "realtime"
  create_schema "storage"
  create_schema "vault"

  # These are extensions that must be enabled in order to support this database
  enable_extension "extensions.pg_stat_statements"
  enable_extension "extensions.pgcrypto"
  enable_extension "extensions.pgjwt"
  enable_extension "extensions.uuid-ossp"
  enable_extension "graphql.pg_graphql"
  enable_extension "pg_catalog.plpgsql"
  enable_extension "pgsodium.pgsodium"
  enable_extension "vault.supabase_vault"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", precision: nil, null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", precision: nil, null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "aim_rooms", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.integer "currency", default: 0
    t.datetime "last_login_at", precision: nil
    t.integer "total_login_days", default: 0
    t.integer "total_gacha_rolls", default: 0
    t.integer "daily_play_time", default: 0
    t.jsonb "placed_items", default: {"bg"=>"bg0", "obj"=>"obj2", "desk"=>"desk0", "board"=>"board0", "chara"=>"chara0", "picture"=>"picture0"}, null: false
    t.integer "pickup_ceil_count", default: 0, null: false
    t.integer "total_ssr_count", default: 0, null: false
    t.index ["user_id"], name: "index_aim_rooms_on_user_id"
  end

  create_table "aims", force: :cascade do |t|
    t.string "title"
    t.text "content"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "user_id"
    t.string "image_url"
  end

  create_table "contacts", force: :cascade do |t|
    t.string "name"
    t.string "email"
    t.text "message"
    t.datetime "created_at", null: false
  end

  create_table "gachas", force: :cascade do |t|
    t.jsonb "weights", default: {}, null: false
    t.jsonb "pickup", default: {}, null: false
    t.string "name", default: "", null: false
    t.text "description", default: "", null: false
    t.integer "cost", default: 0, null: false
  end

  create_table "items", force: :cascade do |t|
    t.bigint "gacha_id"
    t.string "name", null: false
    t.string "item_type", null: false
    t.text "description"
    t.string "rarity"
    t.integer "max_quantity"
    t.string "key"
    t.jsonb "properties", default: {}
  end

  create_table "likes", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.integer "user_id"
    t.integer "aim_id"
  end

  create_table "mission_rewards", force: :cascade do |t|
    t.bigint "mission_id", null: false
    t.integer "threshold"
    t.integer "currency_amount"
    t.index ["mission_id"], name: "index_mission_rewards_on_mission_id"
  end

  create_table "missions", force: :cascade do |t|
    t.string "name", null: false
    t.string "description"
    t.string "mission_type", null: false
    t.integer "required_amount", null: false
    t.integer "reset_frequency", default: 0
  end

  create_table "notifications", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "title", default: "", null: false
    t.string "image_url", default: "default", null: false
    t.string "action", default: "", null: false
    t.boolean "checked", default: false, null: false
    t.datetime "created_at", null: false
    t.integer "sended_id"
    t.string "url"
  end

  create_table "placed_items", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "item_id", null: false
    t.integer "x_position", null: false
    t.integer "y_position", null: false
    t.integer "z_index", null: false
    t.integer "rotation", default: 0
    t.float "scale", default: 1.0
    t.boolean "active", default: true
    t.jsonb "properties", default: {}
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["active"], name: "index_placed_items_on_active"
    t.index ["item_id"], name: "index_placed_items_on_item_id"
    t.index ["user_id"], name: "index_placed_items_on_user_id"
    t.index ["z_index"], name: "index_placed_items_on_z_index"
  end

  create_table "plays", force: :cascade do |t|
    t.string "message", default: "", null: false
    t.datetime "created_at", null: false
  end

  create_table "relationships", force: :cascade do |t|
    t.integer "follower_id"
    t.integer "followed_id"
    t.datetime "created_at", null: false
    t.index ["followed_id"], name: "index_relationships_on_followed_id"
    t.index ["follower_id", "followed_id"], name: "index_relationships_on_follower_id_and_followed_id", unique: true
    t.index ["follower_id"], name: "index_relationships_on_follower_id"
  end

  create_table "user_gachas", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "gacha_id", null: false
    t.bigint "item_id", null: false
    t.datetime "acquired_at", precision: nil, null: false
    t.index ["gacha_id"], name: "index_user_gachas_on_gacha_id"
    t.index ["item_id"], name: "index_user_gachas_on_item_id"
    t.index ["user_id"], name: "index_user_gachas_on_user_id"
  end

  create_table "user_items", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "item_id", null: false
    t.integer "quantity", default: 1
    t.datetime "acquired_at", precision: nil
    t.index ["item_id"], name: "index_user_items_on_item_id"
    t.index ["user_id"], name: "index_user_items_on_user_id"
  end

  create_table "user_missions", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "mission_id", null: false
    t.integer "progress", default: 0
    t.boolean "completed", default: false
    t.boolean "rewarded", default: false
    t.datetime "last_reset_at", precision: nil
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "unclaimed_rewards_count", default: 0
    t.index ["mission_id"], name: "index_user_missions_on_mission_id"
    t.index ["user_id"], name: "index_user_missions_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at", precision: nil
    t.datetime "remember_created_at", precision: nil
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "user_name"
    t.string "icon_url", default: "default"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "aim_rooms", "users"
  add_foreign_key "mission_rewards", "missions"
  add_foreign_key "placed_items", "items"
  add_foreign_key "placed_items", "users"
  add_foreign_key "user_gachas", "gachas"
  add_foreign_key "user_gachas", "items"
  add_foreign_key "user_gachas", "users"
  add_foreign_key "user_items", "items"
  add_foreign_key "user_items", "users"
  add_foreign_key "user_missions", "missions"
  add_foreign_key "user_missions", "users"
end
