require 'rails_helper'

RSpec.describe "AimRooms", type: :request do

  describe "GET /index" do
    it "returns http success" do
      get "/aim_room/index"
      expect(response).to have_http_status(:success)
    end
  end

end
