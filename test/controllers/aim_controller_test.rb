require "test_helper"

class AimControllerTest < ActionDispatch::IntegrationTest
  test "should get search" do
    get aim_search_url
    assert_response :success
  end

  test "should get aim" do
    get aim_aim_url
    assert_response :success
  end

  test "should get create" do
    get aim_create_url
    assert_response :success
  end

  test "should get edit" do
    get aim_edit_url
    assert_response :success
  end
end
