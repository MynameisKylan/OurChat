class SessionsController < Devise::SessionsController
  skip_before_action :authorized
  respond_to :json

  # Rails looks in same namespace for serializers (ex: serializers/session_serializer.rb)
  def respond_with(resource, opts = {})
    token = encode_token({ user_id: resource.id })
    render json: { user: resource, token: token }
  end

  # # Overwrite create to stop redirect
  def create
    self.resource = warden.authenticate(auth_options)
    if self.resource
      sign_in(resource_name, resource)
      yield resource if block_given?
      respond_with resource
    else
      render json: { error: "Incorrect Email or Password" }
    end
  end
end