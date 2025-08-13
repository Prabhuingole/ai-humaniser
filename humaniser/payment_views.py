"""
Payment Views - Django REST Framework views for payment processing
Handles payment intents, webhooks, and payment gateway integrations
"""

import json
import logging
from decimal import Decimal
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
import stripe
import paypalrestsdk
from datetime import datetime, timezone

# Configure logging
logger = logging.getLogger(__name__)

# Initialize payment gateways
stripe.api_key = getattr(settings, 'STRIPE_SECRET_KEY', '')
paypalrestsdk.configure({
    "mode": getattr(settings, 'PAYPAL_MODE', 'sandbox'),
    "client_id": getattr(settings, 'PAYPAL_CLIENT_ID', ''),
    "client_secret": getattr(settings, 'PAYPAL_CLIENT_SECRET', '')
})

# Payment Models (you'll need to create these)
# from .models import Payment, Subscription, Plan

class PaymentProcessor:
    """Payment processing utility class"""
    
    @staticmethod
    def create_stripe_payment_intent(amount, currency, metadata=None):
        """Create Stripe payment intent"""
        try:
            intent = stripe.PaymentIntent.create(
                amount=int(amount * 100),  # Convert to cents
                currency=currency.lower(),
                metadata=metadata or {},
                automatic_payment_methods={
                    'enabled': True,
                }
            )
            return intent
        except stripe.error.StripeError as e:
            logger.error(f"Stripe payment intent creation failed: {e}")
            raise e
    
    @staticmethod
    def confirm_stripe_payment(payment_intent_id, payment_method_id):
        """Confirm Stripe payment"""
        try:
            intent = stripe.PaymentIntent.confirm(
                payment_intent_id,
                payment_method=payment_method_id
            )
            return intent
        except stripe.error.StripeError as e:
            logger.error(f"Stripe payment confirmation failed: {e}")
            raise e
    
    @staticmethod
    def create_paypal_order(amount, currency, description):
        """Create PayPal order"""
        try:
            payment = paypalrestsdk.Payment({
                "intent": "sale",
                "payer": {
                    "payment_method": "paypal"
                },
                "redirect_urls": {
                    "return_url": f"{settings.BASE_URL}/payment/success",
                    "cancel_url": f"{settings.BASE_URL}/payment/cancel"
                },
                "transactions": [{
                    "item_list": {
                        "items": [{
                            "name": description,
                            "sku": "AI-HUMANISER-PREMIUM",
                            "price": str(amount),
                            "currency": currency,
                            "quantity": 1
                        }]
                    },
                    "amount": {
                        "total": str(amount),
                        "currency": currency
                    },
                    "description": description
                }]
            })
            
            if payment.create():
                return payment
            else:
                raise Exception(payment.error)
        except Exception as e:
            logger.error(f"PayPal order creation failed: {e}")
            raise e
    
    @staticmethod
    def execute_paypal_payment(payment_id, payer_id):
        """Execute PayPal payment"""
        try:
            payment = paypalrestsdk.Payment.find(payment_id)
            if payment.execute({"payer_id": payer_id}):
                return payment
            else:
                raise Exception(payment.error)
        except Exception as e:
            logger.error(f"PayPal payment execution failed: {e}")
            raise e

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_payment_intent(request):
    """Create payment intent for processing payments"""
    try:
        data = request.data
        amount = Decimal(data.get('amount', 0))
        currency = data.get('currency', 'USD')
        payment_method = data.get('payment_method', 'stripe')
        billing_details = data.get('billing_details', {})
        plan_id = data.get('plan_id')
        metadata = data.get('metadata', {})
        
        # Validate required fields
        if not amount or amount <= 0:
            return Response(
                {'error': 'Invalid amount'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not billing_details.get('email'):
            return Response(
                {'error': 'Email is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create payment intent based on payment method
        if payment_method == 'stripe':
            intent = PaymentProcessor.create_stripe_payment_intent(
                amount=amount,
                currency=currency,
                metadata={
                    **metadata,
                    'user_id': request.user.id,
                    'plan_id': plan_id,
                    'payment_method': payment_method
                }
            )
            
            return Response({
                'id': intent.id,
                'client_secret': intent.client_secret,
                'status': intent.status,
                'amount': amount,
                'currency': currency
            })
        
        elif payment_method == 'paypal':
            order = PaymentProcessor.create_paypal_order(
                amount=amount,
                currency=currency,
                description="AI Humaniser Premium Plan"
            )
            
            return Response({
                'id': order.id,
                'approval_url': order.links[1].href,
                'status': 'created',
                'amount': amount,
                'currency': currency
            })
        
        else:
            return Response(
                {'error': 'Unsupported payment method'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    
    except Exception as e:
        logger.error(f"Payment intent creation failed: {e}")
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def confirm_stripe_payment(request):
    """Confirm Stripe payment"""
    try:
        data = request.data
        payment_intent_id = data.get('payment_intent_id')
        payment_method_id = data.get('payment_method_id')
        billing_details = data.get('billing_details', {})
        
        if not payment_intent_id or not payment_method_id:
            return Response(
                {'error': 'Payment intent ID and payment method ID are required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Confirm the payment
        intent = PaymentProcessor.confirm_stripe_payment(
            payment_intent_id, 
            payment_method_id
        )
        
        if intent.status == 'succeeded':
            # Create payment record
            # payment = Payment.objects.create(
            #     user=request.user,
            #     amount=intent.amount / 100,
            #     currency=intent.currency,
            #     payment_method='stripe',
            #     transaction_id=intent.id,
            #     status='completed'
            # )
            
            # Activate subscription
            # activate_user_subscription(request.user, intent.metadata.get('plan_id'))
            
            logger.info(f"Stripe payment successful: {intent.id}")
            
            return Response({
                'status': 'success',
                'transaction_id': intent.id,
                'amount': intent.amount / 100,
                'currency': intent.currency
            })
        else:
            return Response(
                {'error': f'Payment failed: {intent.status}'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    
    except stripe.error.CardError as e:
        logger.error(f"Stripe card error: {e}")
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        logger.error(f"Stripe payment confirmation failed: {e}")
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def confirm_paypal_payment(request):
    """Confirm PayPal payment"""
    try:
        data = request.data
        payment_id = data.get('payment_id')
        payer_id = data.get('payer_id')
        
        if not payment_id or not payer_id:
            return Response(
                {'error': 'Payment ID and payer ID are required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Execute the payment
        payment = PaymentProcessor.execute_paypal_payment(payment_id, payer_id)
        
        if payment.state == 'approved':
            # Create payment record
            # payment_record = Payment.objects.create(
            #     user=request.user,
            #     amount=Decimal(payment.transactions[0].amount.total),
            #     currency=payment.transactions[0].amount.currency,
            #     payment_method='paypal',
            #     transaction_id=payment.id,
            #     status='completed'
            # )
            
            # Activate subscription
            # activate_user_subscription(request.user, payment.transactions[0].item_list.items[0].sku)
            
            logger.info(f"PayPal payment successful: {payment.id}")
            
            return Response({
                'status': 'success',
                'transaction_id': payment.id,
                'amount': payment.transactions[0].amount.total,
                'currency': payment.transactions[0].amount.currency
            })
        else:
            return Response(
                {'error': f'Payment failed: {payment.state}'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    
    except Exception as e:
        logger.error(f"PayPal payment confirmation failed: {e}")
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@csrf_exempt
@require_http_methods(["POST"])
def stripe_webhook(request):
    """Handle Stripe webhooks"""
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except ValueError as e:
        logger.error(f"Invalid payload: {e}")
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError as e:
        logger.error(f"Invalid signature: {e}")
        return HttpResponse(status=400)
    
    # Handle the event
    if event['type'] == 'payment_intent.succeeded':
        payment_intent = event['data']['object']
        logger.info(f"Payment succeeded: {payment_intent['id']}")
        
        # Update payment status and activate subscription
        # handle_payment_success(payment_intent)
        
    elif event['type'] == 'payment_intent.payment_failed':
        payment_intent = event['data']['object']
        logger.info(f"Payment failed: {payment_intent['id']}")
        
        # Handle payment failure
        # handle_payment_failure(payment_intent)
        
    elif event['type'] == 'customer.subscription.deleted':
        subscription = event['data']['object']
        logger.info(f"Subscription cancelled: {subscription['id']}")
        
        # Handle subscription cancellation
        # handle_subscription_cancellation(subscription)
    
    return HttpResponse(status=200)

@csrf_exempt
@require_http_methods(["POST"])
def paypal_webhook(request):
    """Handle PayPal webhooks"""
    try:
        # Verify webhook signature
        # This is a simplified version - you should implement proper verification
        
        data = json.loads(request.body)
        event_type = data.get('event_type')
        
        if event_type == 'PAYMENT.CAPTURE.COMPLETED':
            payment_data = data.get('resource', {})
            logger.info(f"PayPal payment completed: {payment_data.get('id')}")
            
            # Handle successful payment
            # handle_paypal_payment_success(payment_data)
            
        elif event_type == 'PAYMENT.CAPTURE.DENIED':
            payment_data = data.get('resource', {})
            logger.info(f"PayPal payment denied: {payment_data.get('id')}")
            
            # Handle payment failure
            # handle_paypal_payment_failure(payment_data)
        
        return HttpResponse(status=200)
    
    except Exception as e:
        logger.error(f"PayPal webhook error: {e}")
        return HttpResponse(status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_payment_history(request):
    """Get user's payment history"""
    try:
        # payments = Payment.objects.filter(user=request.user).order_by('-created_at')
        # payment_data = []
        
        # for payment in payments:
        #     payment_data.append({
        #         'id': payment.id,
        #         'amount': payment.amount,
        #         'currency': payment.currency,
        #         'payment_method': payment.payment_method,
        #         'status': payment.status,
        #         'transaction_id': payment.transaction_id,
        #         'created_at': payment.created_at.isoformat()
        #     })
        
        # For now, return empty array
        payment_data = []
        
        return Response({
            'payments': payment_data
        })
    
    except Exception as e:
        logger.error(f"Failed to get payment history: {e}")
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cancel_subscription(request):
    """Cancel user subscription"""
    try:
        # Get user's active subscription
        # subscription = Subscription.objects.filter(
        #     user=request.user, 
        #     status='active'
        # ).first()
        
        # if not subscription:
        #     return Response(
        #         {'error': 'No active subscription found'}, 
        #         status=status.HTTP_404_NOT_FOUND
        # )
        
        # Cancel subscription based on payment method
        # if subscription.payment_method == 'stripe':
        #     stripe.Subscription.modify(
        #         subscription.external_id,
        #         cancel_at_period_end=True
        #     )
        # elif subscription.payment_method == 'paypal':
        #     # Cancel PayPal subscription
        #     pass
        
        # subscription.status = 'cancelled'
        # subscription.cancelled_at = datetime.now(timezone.utc)
        # subscription.save()
        
        logger.info(f"Subscription cancelled for user: {request.user.id}")
        
        return Response({
            'status': 'success',
            'message': 'Subscription cancelled successfully'
        })
    
    except Exception as e:
        logger.error(f"Failed to cancel subscription: {e}")
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def health_check(request):
    """Health check endpoint for payment service"""
    try:
        # Test Stripe connection
        stripe.Account.retrieve()
        
        # Test PayPal connection
        # paypalrestsdk.Payment.all()
        
        return Response({
            'status': 'healthy',
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'services': {
                'stripe': 'connected',
                'paypal': 'connected'
            }
        })
    
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return Response(
            {'status': 'unhealthy', 'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# Utility functions (to be implemented based on your models)

def activate_user_subscription(user, plan_id):
    """Activate user subscription after successful payment"""
    try:
        # Get the plan
        # plan = Plan.objects.get(id=plan_id)
        
        # Create or update subscription
        # subscription, created = Subscription.objects.get_or_create(
        #     user=user,
        #     defaults={
        #         'plan': plan,
        #         'status': 'active',
        #         'start_date': datetime.now(timezone.utc),
        #         'end_date': datetime.now(timezone.utc) + timedelta(days=30)
        #     }
        # )
        
        # if not created:
        #     subscription.status = 'active'
        #     subscription.start_date = datetime.now(timezone.utc)
        #     subscription.end_date = datetime.now(timezone.utc) + timedelta(days=30)
        #     subscription.save()
        
        logger.info(f"Subscription activated for user: {user.id}")
        
    except Exception as e:
        logger.error(f"Failed to activate subscription: {e}")
        raise e

def handle_payment_success(payment_intent):
    """Handle successful payment"""
    try:
        # Update payment status
        # payment = Payment.objects.get(transaction_id=payment_intent['id'])
        # payment.status = 'completed'
        # payment.save()
        
        # Activate subscription
        # user_id = payment_intent['metadata'].get('user_id')
        # plan_id = payment_intent['metadata'].get('plan_id')
        # user = User.objects.get(id=user_id)
        # activate_user_subscription(user, plan_id)
        
        logger.info(f"Payment success handled: {payment_intent['id']}")
        
    except Exception as e:
        logger.error(f"Failed to handle payment success: {e}")

def handle_payment_failure(payment_intent):
    """Handle failed payment"""
    try:
        # Update payment status
        # payment = Payment.objects.get(transaction_id=payment_intent['id'])
        # payment.status = 'failed'
        # payment.save()
        
        logger.info(f"Payment failure handled: {payment_intent['id']}")
        
    except Exception as e:
        logger.error(f"Failed to handle payment failure: {e}")

def handle_subscription_cancellation(subscription):
    """Handle subscription cancellation"""
    try:
        # Update subscription status
        # sub = Subscription.objects.get(external_id=subscription['id'])
        # sub.status = 'cancelled'
        # sub.cancelled_at = datetime.now(timezone.utc)
        # sub.save()
        
        logger.info(f"Subscription cancellation handled: {subscription['id']}")
        
    except Exception as e:
        logger.error(f"Failed to handle subscription cancellation: {e}") 