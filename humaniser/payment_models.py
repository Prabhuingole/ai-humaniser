"""
Payment Models - Django models for payment processing and subscriptions
Defines Payment, Subscription, Plan, and related models
"""

from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator
from decimal import Decimal
import uuid
from datetime import timedelta

class Plan(models.Model):
    """Subscription plan model"""
    
    PLAN_TYPES = [
        ('free', 'Free'),
        ('basic', 'Basic'),
        ('pro', 'Professional'),
        ('enterprise', 'Enterprise'),
    ]
    
    BILLING_CYCLES = [
        ('monthly', 'Monthly'),
        ('yearly', 'Yearly'),
        ('lifetime', 'Lifetime'),
    ]
    
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    plan_type = models.CharField(max_length=20, choices=PLAN_TYPES, default='basic')
    billing_cycle = models.CharField(max_length=20, choices=BILLING_CYCLES, default='monthly')
    
    # Pricing
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal('0.00'))])
    currency = models.CharField(max_length=3, default='USD')
    trial_days = models.PositiveIntegerField(default=0)
    
    # Features
    max_requests_per_month = models.PositiveIntegerField(default=100)
    max_characters_per_request = models.PositiveIntegerField(default=1000)
    ai_detection_enabled = models.BooleanField(default=False)
    plagiarism_check_enabled = models.BooleanField(default=False)
    priority_support = models.BooleanField(default=False)
    api_access = models.BooleanField(default=False)
    team_collaboration = models.BooleanField(default=False)
    custom_templates = models.BooleanField(default=False)
    
    # Status
    is_active = models.BooleanField(default=True)
    is_popular = models.BooleanField(default=False)
    
    # Metadata
    description = models.TextField(blank=True)
    features = models.JSONField(default=list, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['price']
        verbose_name = 'Plan'
        verbose_name_plural = 'Plans'
    
    def __str__(self):
        return f"{self.name} - ${self.price}/{self.billing_cycle}"
    
    @property
    def yearly_price(self):
        """Calculate yearly price with discount"""
        if self.billing_cycle == 'monthly':
            return self.price * 12 * Decimal('0.83')  # 17% discount
        return self.price
    
    @property
    def features_list(self):
        """Get features as list"""
        if isinstance(self.features, list):
            return self.features
        return []

class Payment(models.Model):
    """Payment model for tracking transactions"""
    
    PAYMENT_METHODS = [
        ('stripe', 'Stripe'),
        ('paypal', 'PayPal'),
        ('apple_pay', 'Apple Pay'),
        ('google_pay', 'Google Pay'),
        ('square', 'Square'),
    ]
    
    PAYMENT_STATUS = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
        ('refunded', 'Refunded'),
    ]
    
    # Basic info
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payments')
    plan = models.ForeignKey(Plan, on_delete=models.CASCADE, related_name='payments')
    
    # Payment details
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS)
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default='pending')
    
    # Gateway info
    transaction_id = models.CharField(max_length=255, unique=True)
    gateway_response = models.JSONField(default=dict, blank=True)
    
    # Billing info
    billing_email = models.EmailField()
    billing_name = models.CharField(max_length=255)
    billing_address = models.TextField(blank=True)
    billing_city = models.CharField(max_length=100, blank=True)
    billing_state = models.CharField(max_length=100, blank=True)
    billing_country = models.CharField(max_length=100, blank=True)
    billing_postal_code = models.CharField(max_length=20, blank=True)
    
    # Metadata
    metadata = models.JSONField(default=dict, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Payment'
        verbose_name_plural = 'Payments'
    
    def __str__(self):
        return f"{self.user.email} - ${self.amount} {self.currency} - {self.status}"
    
    @property
    def is_successful(self):
        return self.status == 'completed'
    
    @property
    def is_failed(self):
        return self.status in ['failed', 'cancelled']
    
    def mark_completed(self):
        """Mark payment as completed"""
        from django.utils import timezone
        self.status = 'completed'
        self.completed_at = timezone.now()
        self.save()

class Subscription(models.Model):
    """Subscription model for user subscriptions"""
    
    SUBSCRIPTION_STATUS = [
        ('active', 'Active'),
        ('cancelled', 'Cancelled'),
        ('expired', 'Expired'),
        ('past_due', 'Past Due'),
        ('unpaid', 'Unpaid'),
        ('trialing', 'Trialing'),
    ]
    
    # Basic info
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subscriptions')
    plan = models.ForeignKey(Plan, on_delete=models.CASCADE, related_name='subscriptions')
    
    # Status and dates
    status = models.CharField(max_length=20, choices=SUBSCRIPTION_STATUS, default='active')
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    trial_end_date = models.DateTimeField(null=True, blank=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)
    
    # Payment info
    payment = models.OneToOneField(Payment, on_delete=models.SET_NULL, null=True, blank=True)
    external_id = models.CharField(max_length=255, unique=True, null=True, blank=True)  # Stripe/PayPal subscription ID
    
    # Billing
    current_period_start = models.DateTimeField()
    current_period_end = models.DateTimeField()
    cancel_at_period_end = models.BooleanField(default=False)
    
    # Usage tracking
    requests_used_this_month = models.PositiveIntegerField(default=0)
    characters_used_this_month = models.PositiveIntegerField(default=0)
    
    # Metadata
    metadata = models.JSONField(default=dict, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Subscription'
        verbose_name_plural = 'Subscriptions'
    
    def __str__(self):
        return f"{self.user.email} - {self.plan.name} - {self.status}"
    
    @property
    def is_active(self):
        """Check if subscription is active"""
        from django.utils import timezone
        now = timezone.now()
        return (
            self.status == 'active' and 
            self.start_date <= now <= self.end_date
        )
    
    @property
    def is_trialing(self):
        """Check if subscription is in trial period"""
        from django.utils import timezone
        now = timezone.now()
        return (
            self.status == 'trialing' and 
            self.trial_end_date and 
            now <= self.trial_end_date
        )
    
    @property
    def days_remaining(self):
        """Get days remaining in subscription"""
        from django.utils import timezone
        now = timezone.now()
        if self.end_date > now:
            return (self.end_date - now).days
        return 0
    
    @property
    def can_make_request(self):
        """Check if user can make a request based on plan limits"""
        if self.is_trialing:
            return True
        
        if not self.is_active:
            return False
        
        return self.requests_used_this_month < self.plan.max_requests_per_month
    
    def increment_usage(self, characters_used):
        """Increment usage counters"""
        self.requests_used_this_month += 1
        self.characters_used_this_month += characters_used
        self.save()
    
    def cancel(self):
        """Cancel subscription"""
        from django.utils import timezone
        self.status = 'cancelled'
        self.cancelled_at = timezone.now()
        self.cancel_at_period_end = True
        self.save()
    
    def reactivate(self):
        """Reactivate cancelled subscription"""
        self.status = 'active'
        self.cancel_at_period_end = False
        self.save()

class Invoice(models.Model):
    """Invoice model for billing"""
    
    INVOICE_STATUS = [
        ('draft', 'Draft'),
        ('open', 'Open'),
        ('paid', 'Paid'),
        ('uncollectible', 'Uncollectible'),
        ('void', 'Void'),
    ]
    
    # Basic info
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='invoices')
    subscription = models.ForeignKey(Subscription, on_delete=models.CASCADE, related_name='invoices')
    
    # Invoice details
    invoice_number = models.CharField(max_length=50, unique=True)
    status = models.CharField(max_length=20, choices=INVOICE_STATUS, default='draft')
    
    # Amount
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    tax = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    total = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    
    # Dates
    invoice_date = models.DateTimeField()
    due_date = models.DateTimeField()
    paid_date = models.DateTimeField(null=True, blank=True)
    
    # Billing info
    billing_email = models.EmailField()
    billing_name = models.CharField(max_length=255)
    billing_address = models.TextField(blank=True)
    
    # Metadata
    metadata = models.JSONField(default=dict, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Invoice'
        verbose_name_plural = 'Invoices'
    
    def __str__(self):
        return f"Invoice {self.invoice_number} - {self.user.email} - ${self.total}"
    
    @property
    def is_paid(self):
        return self.status == 'paid'
    
    @property
    def is_overdue(self):
        from django.utils import timezone
        now = timezone.now()
        return not self.is_paid and self.due_date < now
    
    def mark_paid(self):
        """Mark invoice as paid"""
        from django.utils import timezone
        self.status = 'paid'
        self.paid_date = timezone.now()
        self.save()

class PaymentMethod(models.Model):
    """Payment method model for storing user payment methods"""
    
    PAYMENT_METHOD_TYPES = [
        ('card', 'Credit Card'),
        ('bank_account', 'Bank Account'),
        ('paypal', 'PayPal'),
        ('apple_pay', 'Apple Pay'),
        ('google_pay', 'Google Pay'),
    ]
    
    # Basic info
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payment_methods')
    
    # Payment method details
    type = models.CharField(max_length=20, choices=PAYMENT_METHOD_TYPES)
    external_id = models.CharField(max_length=255, unique=True)  # Stripe/PayPal payment method ID
    
    # Card info (for card payments)
    card_brand = models.CharField(max_length=20, blank=True)
    card_last4 = models.CharField(max_length=4, blank=True)
    card_exp_month = models.PositiveIntegerField(null=True, blank=True)
    card_exp_year = models.PositiveIntegerField(null=True, blank=True)
    
    # Bank info (for bank transfers)
    bank_name = models.CharField(max_length=100, blank=True)
    bank_last4 = models.CharField(max_length=4, blank=True)
    bank_routing_number = models.CharField(max_length=20, blank=True)
    
    # Status
    is_default = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    
    # Metadata
    metadata = models.JSONField(default=dict, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Payment Method'
        verbose_name_plural = 'Payment Methods'
    
    def __str__(self):
        if self.type == 'card':
            return f"{self.card_brand} •••• {self.card_last4}"
        elif self.type == 'bank_account':
            return f"{self.bank_name} •••• {self.bank_last4}"
        else:
            return f"{self.get_type_display()}"
    
    def save(self, *args, **kwargs):
        """Ensure only one default payment method per user"""
        if self.is_default:
            PaymentMethod.objects.filter(
                user=self.user, 
                is_default=True
            ).exclude(pk=self.pk).update(is_default=False)
        super().save(*args, **kwargs)

class UsageLog(models.Model):
    """Usage log for tracking API usage"""
    
    # Basic info
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='usage_logs')
    subscription = models.ForeignKey(Subscription, on_delete=models.CASCADE, related_name='usage_logs')
    
    # Usage details
    service_type = models.CharField(max_length=50)  # 'ai_humanizer', 'ai_detector', 'plagiarism_check'
    characters_processed = models.PositiveIntegerField()
    processing_time = models.DurationField(null=True, blank=True)
    
    # Request details
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    
    # Response
    success = models.BooleanField(default=True)
    error_message = models.TextField(blank=True)
    
    # Metadata
    metadata = models.JSONField(default=dict, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Usage Log'
        verbose_name_plural = 'Usage Logs'
    
    def __str__(self):
        return f"{self.user.email} - {self.service_type} - {self.characters_processed} chars"

# Signals for automatic actions
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

@receiver(post_save, sender=Payment)
def handle_payment_save(sender, instance, created, **kwargs):
    """Handle payment save events"""
    if created and instance.status == 'completed':
        # Create or update subscription
        subscription, created = Subscription.objects.get_or_create(
            user=instance.user,
            defaults={
                'plan': instance.plan,
                'status': 'active',
                'start_date': instance.created_at,
                'end_date': instance.created_at + timedelta(days=30),
                'current_period_start': instance.created_at,
                'current_period_end': instance.created_at + timedelta(days=30),
                'payment': instance,
            }
        )
        
        if not created:
            subscription.status = 'active'
            subscription.payment = instance
            subscription.save()

@receiver(post_save, sender=Subscription)
def handle_subscription_save(sender, instance, created, **kwargs):
    """Handle subscription save events"""
    if created:
        # Reset usage counters for new subscription
        instance.requests_used_this_month = 0
        instance.characters_used_this_month = 0
        instance.save()

@receiver(post_delete, sender=PaymentMethod)
def handle_payment_method_delete(sender, instance, **kwargs):
    """Handle payment method deletion"""
    # If this was the default payment method, set another as default
    if instance.is_default:
        other_method = PaymentMethod.objects.filter(
            user=instance.user,
            is_active=True
        ).exclude(pk=instance.pk).first()
        
        if other_method:
            other_method.is_default = True
            other_method.save() 