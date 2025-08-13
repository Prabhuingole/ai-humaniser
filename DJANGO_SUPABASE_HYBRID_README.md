# Django + Supabase Hybrid Backend Architecture

## 🚀 Overview

This project implements a **hybrid backend architecture** combining **Django** for business logic and **Supabase** for authentication and real-time features. This approach leverages the strengths of both platforms while maintaining scalability and developer experience.

## 🏗️ Architecture Benefits

### **Why This Hybrid Approach?**

| Component | Django Responsibility | Supabase Responsibility |
|-----------|---------------------|------------------------|
| **Authentication** | User management, sessions | Auth provider, JWT tokens |
| **Database** | Business logic, complex queries | Real-time subscriptions, RLS |
| **API** | Business endpoints, validation | Auto-generated CRUD APIs |
| **File Storage** | File processing, validation | Upload/download, CDN |
| **Real-time** | Event processing | Live subscriptions |

### **Technical Advantages:**

1. **Best of Both Worlds**: Django's mature ecosystem + Supabase's modern features
2. **Scalability**: Django handles complex logic, Supabase scales real-time features
3. **Security**: Row Level Security (RLS) + Django's security middleware
4. **Developer Experience**: Django admin + Supabase dashboard
5. **Cost Efficiency**: Use each platform for its strengths

## 📁 Project Structure

```
├── config/                     # Django settings
│   ├── settings.py            # Main configuration
│   ├── urls.py               # Root URL patterns
│   └── wsgi.py              # WSGI application
├── humaniser/                # Main Django app
│   ├── auth_views.py        # Supabase auth integration
│   ├── auth_urls.py         # Auth URL patterns
│   ├── supabase_service.py  # Supabase client wrapper
│   ├── payment_views.py     # Payment processing
│   ├── payment_models.py    # Payment database models
│   └── payment_urls.py      # Payment URL patterns
├── requirements.txt          # Python dependencies
└── .env.example             # Environment variables template
```

## 🔧 Setup Instructions

### **1. Environment Variables**

Create a `.env` file in the project root:

```bash
# Django Settings
DJANGO_SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database (Optional - for Supabase PostgreSQL)
SUPABASE_DB_NAME=postgres
SUPABASE_DB_USER=postgres
SUPABASE_DB_PASSWORD=your-db-password
SUPABASE_DB_HOST=your-project.supabase.co
SUPABASE_DB_PORT=5432
```

### **2. Install Dependencies**

```bash
pip install -r requirements.txt
```

### **3. Database Setup**

```bash
# Create Django migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser
```

### **4. Run Development Server**

```bash
python manage.py runserver
```

## 🔐 Authentication Flow

### **Sign Up Process:**

1. **Frontend** → Sends user data to Django endpoint
2. **Django** → Validates data and calls Supabase auth
3. **Supabase** → Creates user account and returns session
4. **Django** → Creates local user record for business logic
5. **Response** → Returns both Django token and Supabase session

### **Sign In Process:**

1. **Frontend** → Sends credentials to Django endpoint
2. **Django** → Validates with Supabase auth
3. **Supabase** → Returns user session
4. **Django** → Creates/updates local user record
5. **Response** → Returns authentication tokens

## 🗄️ Database Strategy

### **Django Models (Business Logic):**
- User profiles and preferences
- Payment and subscription data
- Usage tracking and analytics
- Complex business relationships

### **Supabase Tables (Real-time Features):**
- User authentication data
- Real-time chat/messaging
- Live notifications
- File metadata

## 🔌 API Endpoints

### **Authentication Endpoints:**
```
POST /api/auth/signup/          # Create new account
POST /api/auth/signin/          # Sign in user
POST /api/auth/signout/         # Sign out user
POST /api/auth/reset-password/  # Password reset
GET  /api/auth/profile/         # Get user profile
GET  /api/auth/csrf-token/      # Get CSRF token
```

### **Payment Endpoints:**
```
POST /api/payments/create-intent/    # Create payment intent
POST /api/payments/confirm-stripe/   # Confirm Stripe payment
POST /api/payments/confirm-paypal/   # Confirm PayPal payment
POST /api/payments/webhook/stripe/   # Stripe webhook
POST /api/payments/webhook/paypal/   # PayPal webhook
GET  /api/payments/history/          # Payment history
```

### **Health Check:**
```
GET /api/health/                     # System health status
```

## 🔄 Real-time Features

### **Supabase Subscriptions:**

```python
# Subscribe to user data changes
subscription = supabase_service.subscribe_to_changes(
    table='user_profiles',
    callback=handle_user_update
)

# Handle real-time updates
def handle_user_update(payload):
    # Process real-time data
    user_id = payload['new']['id']
    # Update Django cache or trigger business logic
```

## 🛡️ Security Considerations

### **Authentication Security:**
- JWT tokens from Supabase
- Django session management
- CSRF protection for forms
- Rate limiting on endpoints

### **Data Security:**
- Row Level Security (RLS) in Supabase
- Django's built-in security middleware
- Input validation and sanitization
- Secure file upload handling

## 🚀 Deployment Strategy

### **Development:**
- Django development server
- Supabase local development
- SQLite for Django database

### **Production:**
- **Frontend**: Vercel (React)
- **Backend**: Django on VPS/Cloud
- **Database**: Supabase PostgreSQL
- **Domain**: GoDaddy

### **Environment Configuration:**

```bash
# Production settings
DEBUG=False
ALLOWED_HOSTS=your-domain.com,api.your-domain.com
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-key
```

## 📊 Monitoring and Logging

### **Django Logging:**
```python
# Logs stored in logs/django.log
LOGGING = {
    'version': 1,
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': 'logs/django.log',
        },
    },
}
```

### **Health Monitoring:**
```bash
# Check system health
curl https://api.your-domain.com/api/health/
```

## 🔧 Customization

### **Adding New Supabase Features:**

1. **Create Supabase table** in dashboard
2. **Add methods** to `supabase_service.py`
3. **Create Django views** for business logic
4. **Add URL patterns** to `auth_urls.py`

### **Extending Authentication:**

```python
# Custom user metadata
user_data = {
    'name': 'John Doe',
    'subscription_tier': 'premium',
    'preferences': {'theme': 'dark'}
}

result = supabase_service.sign_up(
    email='john@example.com',
    password='secure_password',
    user_data=user_data
)
```

## 🧪 Testing

### **Running Tests:**
```bash
# Install test dependencies
pip install pytest pytest-django

# Run tests
pytest

# Run with coverage
pytest --cov=humaniser
```

## 📈 Performance Optimization

### **Caching Strategy:**
- Django cache for business data
- Supabase cache for real-time data
- Redis for session storage

### **Database Optimization:**
- Django ORM for complex queries
- Supabase for simple CRUD operations
- Connection pooling for both

## 🔗 Integration Examples

### **Frontend Integration (React):**

```javascript
// Sign up with Supabase + Django
const signUp = async (userData) => {
  const response = await fetch('/api/auth/signup/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  
  const result = await response.json();
  
  if (result.success) {
    // Store both tokens
    localStorage.setItem('django_token', result.user.token);
    localStorage.setItem('supabase_session', result.supabase_session);
  }
};
```

### **Real-time Updates:**

```javascript
// Subscribe to Supabase real-time
const subscription = supabase
  .channel('user_updates')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'user_profiles' },
    (payload) => {
      // Handle real-time updates
      console.log('User updated:', payload);
    }
  )
  .subscribe();
```

## 🎯 Best Practices

1. **Use Django for:**
   - Complex business logic
   - Payment processing
   - Admin interface
   - Data validation

2. **Use Supabase for:**
   - User authentication
   - Real-time features
   - File storage
   - Simple CRUD operations

3. **Security:**
   - Always validate data on both ends
   - Use environment variables for secrets
   - Implement proper error handling
   - Monitor API usage and performance

## 🚀 Next Steps

1. **Set up Supabase project** and configure authentication
2. **Deploy Django backend** to your preferred hosting
3. **Configure domain and SSL** certificates
4. **Set up monitoring** and logging
5. **Implement real-time features** using Supabase subscriptions

This hybrid architecture provides the best of both worlds: Django's mature ecosystem for business logic and Supabase's modern features for real-time functionality and authentication. 