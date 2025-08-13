from django.shortcuts import render, redirect
from .forms import CustomSignupForm

def signup_view(request):
    if request.method == 'POST':
        form = CustomSignupForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('login')  # or any page
    else:
        form = CustomSignupForm()
    return render(request, 'signup.html', {'form': form})
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import authenticate, login

def login_view(request):
    if request.method == 'POST':
        form = AuthenticationForm(data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('home')  # Change to wherever you want after login
    else:
        form = AuthenticationForm()
    return render(request, 'login.html', {'form': form})
def home_view(request):
    return render(request, 'home.html')

