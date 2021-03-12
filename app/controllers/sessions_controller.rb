class SessionsController < Devise::SessionsController
  skip_before_action :authorized
  respond_to :json

  # Rails looks in same namespace for serializers (ex: serializers/session_serializer.rb)
  def respond_with(resource, _opts = {})
    token = encode_token({ user_id: resource.id })
    # Send httponly cookie with jwt - client requests cookie on login with {withCredentials: true}
    cookies.signed[:jwt] = { value: token, httponly: true, expires: 2.hours.from_now, same_site: 'Lax' }
    render json: { user: resource.username }
  end

  # # Overwrite create to stop redirect
  def create
    self.resource = warden.authenticate(auth_options)
    if resource
      sign_in(resource_name, resource)
      yield resource if block_given?
      respond_with resource
    else
      render json: { error: 'Incorrect Email or Password' }
    end
  end
end
