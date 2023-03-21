require 'rails_helper'

RSpec.describe FooterController, type: :controller do
  describe "GET query" do
    it "リクエストが成功すること" do
      get "query"
      expect(response).to have_http_status(200)
    end
  end
end

