require "test_helper"

class FooterControllerTest < ActionDispatch::IntegrationTest
  test "should get query" do
    get footer_query_url
    assert_response :success
  end

  test "should get terms" do
    get footer_terms_url
    assert_response :success
  end
end
