"""
URL configuration for authentication endpoints
"""
from django.urls import path
from .auth_views import (
    SignUpView,
    SignInView,
    SignOutView,
    PasswordResetView,
    UserProfileView,
    csrf_token,
    health_check
)

urlpatterns = [
    # Authentication endpoints
    path('auth/signup/', SignUpView.as_view(), name='auth_signup'),
    path('auth/signin/', SignInView.as_view(), name='auth_signin'),
    path('auth/signout/', SignOutView.as_view(), name='auth_signout'),
    path('auth/reset-password/', PasswordResetView.as_view(), name='auth_reset_password'),
    path('auth/profile/', UserProfileView.as_view(), name='auth_profile'),
    
    # Utility endpoints
    path('auth/csrf-token/', csrf_token, name='csrf_token'),
    path('health/', health_check, name='health_check'),
] 