"""
URL configuration for spiceFit_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
# from django.contrib.auth.views import LoginView, LogoutView
from django.contrib.auth import views as auth_views
from base_app.views import *

urlpatterns = [
    path('admin/', admin.site.urls),
     path('',HomeView, name='home'),  
    path('home/', HomeView, name='home'),
    # path('home/',HomeView),
    path('about/',AboutView),
    path('like/',LikeView,name="like"),
    path('quick/',quick_recipe_view,name="quicks"),
    path("meal/",meal_challenges_view, name="meal_challenges"),
    path('menu/',menu_recipe_view,name='menu_recipe'),
    path('cart/',cartView,name='cart'),
    path('book/',bookView,name='books'),
     path('mood/',MoodyView,name='mood'),
    path('expert/',expertView,name='advice'),
    path('filter/',ingredient_filterView,name='filter'),
    path('parents/',parentsView,name='for_new_parents'),
    path('profile/',ProfileView,name='profile'),
    path('premium/',PremiumView,name="PremiumView"),
    path('buy-premium/<str:plan>/',buy_premium, name='buy_premium'), 
    path('review/',review,name='review'),
    path('OwnRecipe/',OwnRecipeView,name="own_recipe"),
   path('register/', register_view, name='register'),
    path('login/', login_view, name='login'),
     path('plans/', PlansView, name='plans'),
     path("checkout/",checkout_order, name="checkout_order"),
     path("add-cart/",add_to_cart,name="add_cart"),
path("get-cart/",get_cart,name="get_cart"),
path("remove-cart/",remove_cart_item,name="remove_cart"),
path("sync-cart/", sync_cart, name="sync_cart"),
path('logout/', auth_views.LogoutView.as_view(next_page='login'), name='logout'),
    path('order-history/',order_history, name='order_history'),
   
    # path('logout/', auth_views.LogoutView.as_view(), name='logout'),
]
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
