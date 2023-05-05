require 'rails_helper'

RSpec.describe FooterController, type: :controller do
  describe "GET terms" do
    it "リクエストが成功すること" do
      get "terms"
      expect(response).to have_http_status(200)
    end
  end
end

