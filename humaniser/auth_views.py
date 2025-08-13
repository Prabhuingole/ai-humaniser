"""
Django REST Framework views for authentication using Supabase
"""
import logging
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.middleware.csrf import get_token
import json

from .supabase_service import supabase_service

logger = logging.getLogger(__name__)

class SupabaseAuthView(APIView):
    """
    Base class for Supabase authentication views
    """
    permission_classes = [AllowAny]
    
    def get_supabase_user(self, request):
        """Extract user info from Supabase token in request headers"""
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return None
        
        token = auth_header.split(' ')[1]
        return supabase_service.get_user(token)

@method_decorator(csrf_exempt, name='dispatch')
class SignUpView(SupabaseAuthView):
    """
    Handle user signup with Supabase authentication
    """
    
    def post(self, request):
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')
            name = data.get('name')
            
            if not all([email, password, name]):
                return Response({
                    'error': 'Email, password, and name are required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Sign up with Supabase
            result = supabase_service.sign_up(
                email=email,
                password=password,
                user_data={'name': name}
            )
            
            if result['success']:
                # Create Django user for business logic
                django_user, created = User.objects.get_or_create(
                    username=email,
                    defaults={
                        'email': email,
                        'first_name': name.split()[0] if name else '',
                        'last_name': ' '.join(name.split()[1:]) if len(name.split()) > 1 else ''
                    }
                )
                
                # Create Django auth token
                token, _ = Token.objects.get_or_create(user=django_user)
                
                logger.info(f"User signed up successfully: {email}")
                return Response({
                    'success': True,
                    'message': 'Account created successfully',
                    'user': {
                        'id': django_user.id,
                        'email': django_user.email,
                        'name': django_user.get_full_name(),
                        'token': token.key
                    },
                    'supabase_session': result.get('session')
                }, status=status.HTTP_201_CREATED)
            else:
                return Response({
                    'error': result.get('error', 'Signup failed')
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            logger.error(f"Signup error: {e}")
            return Response({
                'error': 'Internal server error'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@method_decorator(csrf_exempt, name='dispatch')
class SignInView(SupabaseAuthView):
    """
    Handle user signin with Supabase authentication
    """
    
    def post(self, request):
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')
            
            if not all([email, password]):
                return Response({
                    'error': 'Email and password are required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Sign in with Supabase
            result = supabase_service.sign_in(email=email, password=password)
            
            if result['success']:
                # Get or create Django user
                django_user, created = User.objects.get_or_create(
                    username=email,
                    defaults={
                        'email': email,
                        'first_name': result['user'].get('user_metadata', {}).get('name', '').split()[0] if result['user'].get('user_metadata', {}).get('name') else '',
                        'last_name': ' '.join(result['user'].get('user_metadata', {}).get('name', '').split()[1:]) if result['user'].get('user_metadata', {}).get('name') and len(result['user'].get('user_metadata', {}).get('name', '').split()) > 1 else ''
                    }
                )
                
                # Create Django auth token
                token, _ = Token.objects.get_or_create(user=django_user)
                
                # Login to Django session
                login(request, django_user)
                
                logger.info(f"User signed in successfully: {email}")
                return Response({
                    'success': True,
                    'message': 'Signed in successfully',
                    'user': {
                        'id': django_user.id,
                        'email': django_user.email,
                        'name': django_user.get_full_name(),
                        'token': token.key
                    },
                    'supabase_session': result.get('session')
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'error': result.get('error', 'Invalid credentials')
                }, status=status.HTTP_401_UNAUTHORIZED)
                
        except Exception as e:
            logger.error(f"Signin error: {e}")
            return Response({
                'error': 'Internal server error'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@method_decorator(csrf_exempt, name='dispatch')
class SignOutView(SupabaseAuthView):
    """
    Handle user signout
    """
    
    def post(self, request):
        try:
            # Sign out from Supabase
            auth_header = request.headers.get('Authorization')
            if auth_header and auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
                supabase_service.sign_out(token)
            
            # Sign out from Django
            logout(request)
            
            logger.info("User signed out successfully")
            return Response({
                'success': True,
                'message': 'Signed out successfully'
            }, status=status.HTTP_200_OK)
                
        except Exception as e:
            logger.error(f"Signout error: {e}")
            return Response({
                'error': 'Internal server error'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@method_decorator(csrf_exempt, name='dispatch')
class PasswordResetView(SupabaseAuthView):
    """
    Handle password reset requests
    """
    
    def post(self, request):
        try:
            data = json.loads(request.body)
            email = data.get('email')
            
            if not email:
                return Response({
                    'error': 'Email is required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Send password reset email via Supabase
            result = supabase_service.reset_password(email)
            
            if result['success']:
                logger.info(f"Password reset email sent to: {email}")
                return Response({
                    'success': True,
                    'message': 'Password reset email sent'
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'error': result.get('error', 'Failed to send reset email')
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            logger.error(f"Password reset error: {e}")
            return Response({
                'error': 'Internal server error'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@method_decorator(csrf_exempt, name='dispatch')
class UserProfileView(SupabaseAuthView):
    """
    Get current user profile
    """
    
    def get(self, request):
        try:
            # Get user from Supabase token
            supabase_user = self.get_supabase_user(request)
            if not supabase_user:
                return Response({
                    'error': 'Invalid or missing authentication token'
                }, status=status.HTTP_401_UNAUTHORIZED)
            
            # Get Django user
            django_user = User.objects.filter(email=supabase_user.get('email')).first()
            if not django_user:
                return Response({
                    'error': 'User not found'
                }, status=status.HTTP_404_NOT_FOUND)
            
            # Get Django auth token
            token, _ = Token.objects.get_or_create(user=django_user)
            
            return Response({
                'success': True,
                'user': {
                    'id': django_user.id,
                    'email': django_user.email,
                    'name': django_user.get_full_name(),
                    'token': token.key,
                    'date_joined': django_user.date_joined,
                    'last_login': django_user.last_login
                },
                'supabase_user': supabase_user
            }, status=status.HTTP_200_OK)
                
        except Exception as e:
            logger.error(f"Profile error: {e}")
            return Response({
                'error': 'Internal server error'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny])
def csrf_token(request):
    """
    Get CSRF token for forms
    """
    return Response({
        'csrfToken': get_token(request)
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """
    Health check endpoint
    """
    supabase_status = supabase_service.is_available()
    
    return Response({
        'status': 'healthy',
        'django': True,
        'supabase': supabase_status,
        'timestamp': '2024-01-01T00:00:00Z'  # You can use timezone.now() here
    }) 