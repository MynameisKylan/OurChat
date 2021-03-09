class ApplicationController < ActionController::API
  include ::ActionController::Cookies

  before_action :authorized
  before_action :configure_permitted_parameters, if: :devise_controller?

  def encode_token(payload)
    JWT.encode(payload, ENV['jwt_secret'])
  end

  def current_user
    User.find(decoded_token[0]['user_id'])
  end

  # Return format: [{"user_id"=>X}, {"alg"=>"XXXX"}]
  def decoded_token
    if cookies.signed[:jwt]
      token = cookies.signed[:jwt]
      begin
        JWT.decode(token, ENV['jwt_secret'], true, algorithm: 'HS256')
      rescue JWT::DecodeError
        nil
      end
    end
  end

  protected def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:username])
  end

  private

  def logged_in_user
    if decoded_token
      user_id = decoded_token[0]['user_id']
      @user = User.find(user_id)
    end
  end

  def logged_in?
    !!logged_in_user
  end

  def authorized
    render json: { error: 'Unauthorized. Please log in' }, status: :unauthorized unless logged_in?
  end
end
