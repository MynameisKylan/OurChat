class PagesController < ApplicationController
  skip_before_action :authorized
  def home
  end
end
