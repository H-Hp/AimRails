require 'rails_helper'

RSpec.describe TopController, type: :controller do
  describe "GET top" do
    it "リクエストが成功すること" do
     # get "/"
     #get :top
     get root_path
     expect(response).to have_http_status(200)
    end
  end
end