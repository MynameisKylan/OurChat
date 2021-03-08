class RegistrationsController < Devise::RegistrationsController
  skip_before_action :authorized
  respond_to :json

  def respond_with(resource, opts = {})
    token = encode_token({ user_id: resource.id })
    render json: { user: resource, token: token }
  end

  # POST /resource
  # Overwritten to render error message on failure to create User
  def create
    build_resource(sign_up_params)

    resource.save
    yield resource if block_given?
    if resource.persisted?
      if resource.active_for_authentication?
        set_flash_message! :notice, :signed_up
        sign_up(resource_name, resource)
        respond_with resource, location: after_sign_up_path_for(resource)
      else
        set_flash_message! :notice, :"signed_up_but_#{resource.inactive_message}"
        expire_data_after_sign_in!
        respond_with resource, location: after_inactive_sign_up_path_for(resource)
      end
    else
      clean_up_passwords resource
      set_minimum_password_length
      render json: { errors: resource.errors.to_a }
    end
  end
end
