class ContactController < ApplicationController
  def new
    @contact = Contact.new
  end

  def create
    @contact = Contact.new(contact_params)
    if @contact.save
      # お問い合わせ内容が保存された場合の処理
      flash[:success] = 'お問い合わせを受け付けました。'
      redirect_to new_contact_path
    else
      # お問い合わせ内容が保存されなかった場合の処理
      flash[:danger] = '正しく送信されませんでした'
      render :new
    end
  end

  private

  def contact_params
    params.require(:contact).permit(:name, :email, :message)
  end
end
