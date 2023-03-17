require "test_helper"

class UserControllerTest < ActionDispatch::IntegrationTest
  test "should get new_user" do
    get user_new_user_url
    assert_response :success
  end

  test "should get mypage" do
    get user_mypage_url
    assert_response :success
  end

  test "should get account_delete" do
    get user_account_delete_url
    assert_response :success
  end
end
