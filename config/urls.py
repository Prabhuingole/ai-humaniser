from django.contrib import admin
from django.urls import path, include  # ✅ include is enough

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('humaniser.urls')),  # ✅ correct way to hook your app
    path('accounts/', include('django.contrib.auth.urls')),
]
