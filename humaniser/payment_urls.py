"""
Payment URLs - URL patterns for payment-related endpoints
Defines routes for payment processing, webhooks, and subscription management
"""

from django.urls import path
from . import payment_views

app_name = 'payments'

urlpatterns = [
    # Payment Processing
    path('create-intent/', payment_views.create_payment_intent, name='create_payment_intent'),
    path('stripe/confirm/', payment_views.confirm_stripe_payment, name='confirm_stripe_payment'),
    path('paypal/confirm/', payment_views.confirm_paypal_payment, name='confirm_paypal_payment'),
    
    # Webhooks
    path('webhooks/stripe/', payment_views.stripe_webhook, name='stripe_webhook'),
    path('webhooks/paypal/', payment_views.paypal_webhook, name='paypal_webhook'),
    
    # Subscription Management
    path('subscription/cancel/', payment_views.cancel_subscription, name='cancel_subscription'),
    path('history/', payment_views.get_payment_history, name='payment_history'),
    
    # Health Check
    path('health/', payment_views.health_check, name='health_check'),
] 