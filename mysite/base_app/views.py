from django.shortcuts import render,redirect
from django.http import HttpResponse
from django.contrib.auth.models import User
from django.contrib import messages
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from datetime import timedelta
from django.utils import timezone
from django.urls import reverse_lazy
import json
from django.http import JsonResponse
from django.db.models import Sum
# from django.shortcuts import render, get_object_or_404
from .models import ItemList,AboutUs,Sitereview,OwnRecipe,Profile,mealChallenges,Premium,MenuRecipe,QuickRecipe,book,ParentTitle,ParentSubCatTitle,ParentRecipe,Visitor,PlanCategory,MoodList,MoodyRecipe,Ingredient,Recipe,Order, OrderItem, Payment,Cart,CartItem
 
# Create your views here.

def HomeView(request):
     # create session if not exists
    if not request.session.session_key:
        request.session.create()

    session_key = request.session.session_key

    # save visitor if not already saved
    Visitor.objects.get_or_create(visitor_id=session_key)
    
    return render(request,'base_app/home.html')

def AboutView(request):
   desc = AboutUs.objects.all()
   return render(request,'base_app/about.html',{'desc': desc})

def LikeView(request):
    return render(request,'base_app/like.html') 

def MoodyView(request):
    moods_all = MoodList.objects.all()
    
    # Remove duplicates
    seen = set()
    moods_unique = []
    for mood in moods_all:
        if mood.Moody_Name not in seen:
            moods_unique.append(mood)
            seen.add(mood.Moody_Name)
    
    recipes = MoodyRecipe.objects.all()

    # ✅ ADD THIS PART
    is_premium_user = False
    if request.user.is_authenticated:

        # ✅ EXPIRY CHECK ADDED
        profile = request.user.profile
        if profile.is_premium and profile.premium_end:
            if timezone.now() > profile.premium_end:
                profile.is_premium = False
                profile.premium_plan = None
                profile.save()

        # ✅ YOUR ORIGINAL LOGIC (UNCHANGED)
        is_premium_user = request.user.profile.is_premium

    return render(request, 'base_app/mood.html', {
        'moods': moods_unique,
        'recipes': recipes,
        'is_premium_user': is_premium_user   # ✅ IMPORTANT
    })

def PlansView(request):
     # Prefetch Plan → OurPlan
    categories = PlanCategory.objects.prefetch_related(
        "plans__ourplans"
    )

    # Premium check (same like your parents view)
    is_premium_user = (
        request.user.is_authenticated
        and hasattr(request.user, "profile")
        and request.user.profile.is_premium
    )

    # ✅ ADD EXPIRY CHECK (without changing your logic)
    if request.user.is_authenticated and hasattr(request.user, "profile"):
        profile = request.user.profile
        if profile.is_premium and profile.premium_end:
            if timezone.now() > profile.premium_end:
                profile.is_premium = False
                profile.premium_plan = None
                profile.save()

                # update variable also
                is_premium_user = False

    return render(
        request,
        "base_app/plans.html",
        {
            "categories": categories,
            "is_premium_user": is_premium_user,
        }
    )

def cartView(request):
    return render(request,'base_app/cart.html',{"is_logged_in": request.user.is_authenticated})

@login_required
def checkout_order(request):

    if request.method == "POST":

        data = json.loads(request.body)

        cart_items = data.get("items")
        address = data.get("address")
        payment_method = data.get("payment_method")
        total = data.get("total")

        # Create Order
        order = Order.objects.create(
            user=request.user,
            address=address,
            payment_method=payment_method,
            total_amount=total
        )

        # Create Order Items
        for item in cart_items:
            OrderItem.objects.create(
                order=order,
                item_name=item["name"],
                price=item["price"],
                quantity=item["qty"]
            )

        # Create Payment Record
        Payment.objects.create(
            order=order,
            payment_method=payment_method,
            status="SUCCESS"
        )

        return JsonResponse({"status": "success"})
    
@login_required
def sync_cart(request):

    if request.method == "POST":

        data = json.loads(request.body)
        items = data.get("items")

        cart, created = Cart.objects.get_or_create(user=request.user)

        # remove old cart items
        CartItem.objects.filter(cart=cart).delete()

        for item in items:
            CartItem.objects.create(
                cart=cart,
                item_name=item["name"],
                price=item["price"],
                quantity=item["qty"]
            )

        return JsonResponse({"status":"synced"})
    
    
@login_required
def add_to_cart(request):

    if request.method == "POST":

        data = json.loads(request.body)

        name = data.get("name")
        price = data.get("price")

        cart, created = Cart.objects.get_or_create(user=request.user)

        item, created = CartItem.objects.get_or_create(
            cart=cart,
            item_name=name,
            price=price
        )

        if not created:
            item.quantity += 1
            item.save()

        return JsonResponse({"status":"added"})

@login_required
def get_cart(request):

    cart = Cart.objects.filter(user=request.user).first()

    items = []

    if cart:
        for i in cart.items.all():
            items.append({
                "name": i.item_name,
                "price": float(i.price),
                "qty": i.quantity
            })

    return JsonResponse({"items":items})

@login_required
def remove_cart_item(request):

    if request.method == "POST":

        data = json.loads(request.body)
        name = data.get("name")

        cart = Cart.objects.filter(user=request.user).first()

        if cart:
            CartItem.objects.filter(cart=cart,item_name=name).delete()

        return JsonResponse({"status":"removed"})

def ingredient_filterView(request):
    ingredients = Ingredient.objects.all()
    recipes = Recipe.objects.all() 

    is_premium_user = False

    if request.user.is_authenticated:

        # ✅ ADDED EXPIRY CHECK (no change to your logic)
        profile = request.user.profile
        if profile.is_premium and profile.premium_end:
            if timezone.now() > profile.premium_end:
                profile.is_premium = False
                profile.premium_plan = None
                profile.save()

        # ✅ YOUR ORIGINAL CODE (UNCHANGED)
        if request.user.profile.is_premium:
            is_premium_user = True

    return render(request,"base_app/filter.html",{
        "ingredients":ingredients,
        "recipes":recipes,
        "is_premium_user":is_premium_user
    })

@login_required
def PremiumView(request):

    if request.method == "POST":

        premium_type = request.POST.get("premium_type")
        payment_method = request.POST.get("payment_method")

        if not premium_type or not payment_method:
            return redirect("premium")

        duration_map = {
            "Weekly": 7,
            "Bi-Weekly": 14,
            "Monthly": 30,
            "Quarterly": 90,
            "Half-Yearly": 180,
            "Yearly": 365,
        }

        # ✅ SAVE premium (no expiry_date)
        Premium.objects.create(
            user=request.user,
            premium_type=premium_type,
            payment_method=payment_method
        )

        # ✅ UPDATE PROFILE (this is your expiry system)
        profile = request.user.profile

        if premium_type in duration_map:
            profile.is_premium = True
            profile.premium_plan = premium_type
            profile.premium_start = timezone.now()
            profile.premium_end = timezone.now() + timedelta(days=duration_map[premium_type])
            profile.save()

        return redirect("profile")

    return render(request, "base_app/premium.html")


def parentsView(request):
    titles = ParentTitle.objects.prefetch_related(
        "recipes__recipes"   # ParentSubCatTitle → ParentRecipe
    )

    is_premium_user = (
        request.user.is_authenticated
        and hasattr(request.user, "profile")
        and request.user.profile.is_premium
    )

    # ✅ ADD EXPIRY CHECK (no structure change)
    if request.user.is_authenticated and hasattr(request.user, "profile"):
        profile = request.user.profile
        if profile.is_premium and profile.premium_end:
            if timezone.now() > profile.premium_end:
                profile.is_premium = False
                profile.premium_plan = None
                profile.save()

                # update variable also
                is_premium_user = False

    return render(
        request,
        "base_app/parents.html",
        {
            "titles": titles,
            "is_premium_user": is_premium_user,
        }
    )

def bookView(request):
    books = book.objects.all()
    return render(request, 'base_app/book.html', {'books': books})

def expertView(request):
    return render(request,'base_app/expert.html') 

@login_required(login_url='login')
def ProfileView(request):
    profile = Profile.objects.filter(user=request.user).first()

    # 🔥 Total quantity of all ordered items (logged-in user only)
    total_quantity = OrderItem.objects.filter(
        order__user=request.user
    ).aggregate(total=Sum('quantity'))['total'] or 0

    # 🔥 Last 5 orders for the logged-in user only
    recent_orders = OrderItem.objects.filter(
        order__user=request.user
    ).order_by('-order__created_at')[:5]

    return render(request, "base_app/profile.html", {
        "profile": profile,
        "total_quantity": total_quantity,
        "recent_orders": recent_orders  # Only logged-in user's recent orders
    })
def meal_challenges_view(request):
    challenges = mealChallenges.objects.all()
    title = mealChallenges.objects.all()

    # Check if the logged-in user is premium
    is_premium_user = (
        request.user.is_authenticated 
        and hasattr(request.user, 'profile') 
        and request.user.profile.is_premium
    )

    # ✅ ADD EXPIRY CHECK
    if request.user.is_authenticated and hasattr(request.user, "profile"):
        profile = request.user.profile
        if profile.is_premium and profile.premium_end:
            if timezone.now() > profile.premium_end:
                profile.is_premium = False
                profile.premium_plan = None
                profile.save()
                is_premium_user = False

    return render(request, "base_app/meal.html", {
        "challenges": challenges,
        "title": title,
        "is_premium_user": is_premium_user
    })

def menu_recipe_view(request):
    recipes = MenuRecipe.objects.all()
    categories = MenuRecipe.objects.values_list('Menu_Cat__Category_Name', flat=True).distinct()

    # Check if the logged-in user is premium
    is_premium_user = (
        request.user.is_authenticated 
        and hasattr(request.user, 'profile') 
        and request.user.profile.is_premium
    )

    # ✅ ADD EXPIRY CHECK
    if request.user.is_authenticated and hasattr(request.user, "profile"):
        profile = request.user.profile
        if profile.is_premium and profile.premium_end:
            if timezone.now() > profile.premium_end:
                profile.is_premium = False
                profile.premium_plan = None
                profile.save()
                is_premium_user = False

    return render(request, 'base_app/menu.html', {
        'MenuRecipe': recipes,
        'categories': categories,
        'is_premium_user': is_premium_user
    })

def quick_recipe_view(request):
    items = QuickRecipe.objects.all()

    # Check if the logged-in user is premium
    is_premium_user = (
        request.user.is_authenticated 
        and hasattr(request.user, 'profile') 
        and request.user.profile.is_premium
    )

    # ✅ ADD EXPIRY CHECK
    if request.user.is_authenticated and hasattr(request.user, "profile"):
        profile = request.user.profile
        if profile.is_premium and profile.premium_end:
            if timezone.now() > profile.premium_end:
                profile.is_premium = False
                profile.premium_plan = None
                profile.save()
                is_premium_user = False

    return render(request,'base_app/quick.html',{
        'items': items,
        'is_premium_user': is_premium_user
    })

def register_view(request):
    if request.method == "POST":
        username = request.POST.get("username")
        email = request.POST.get("email")
        password = request.POST.get("password")
        phone = request.POST.get("phone")
        address = request.POST.get("address")

        # Check if username exists
        if User.objects.filter(username=username).exists():
            return render(request, "register.html", {"error": "Username already exists"})

        # Create user
        user = User.objects.create_user(username=username, email=email, password=password)

        # Create profile
        Profile.objects.create(user=user, email=email, phone=phone, address=address)

        return redirect("login")
    return render(request, "base_app/register.html")



def login_view(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return redirect("home")
        else:
            return render(request, "login.html", {"error": "Invalid credentials"})

    return render(request, "base_app/login.html")

















@login_required(login_url='login')
def review(request):
    if request.method == "POST":
        Sitereview.objects.create(
            User_Name=request.POST.get('userName'),
            des=request.POST.get('userReview'),
            Rating=request.POST.get('rating'),
            image=request.FILES.get('reviewImage')
        )
        return redirect('/review')

    # show only approved reviews
    reviews = Sitereview.objects.filter(is_approved=True).order_by('-created_at')

    return render(request, 'base_app/review.html', {
        'reviews': reviews
    })
# def OwnRecipeView(request):

#    if request.method == 'POST':
#       name   =  request.POST.get('User_Name')
#       email  = request.POST.get('Email')
#       price  =  request.POST.get('Price')
#       recipe =  request.POST.get('Recipe')
#       if name != '' and email != '' and price != '' and recipe != '':
#          data = OwnRecipe( User = name , price =  price, Recipe = recipe , Email = email )
#          data.save()
#    return render(request,'base_app/OwnRecipe.html')
@login_required(login_url='login')
def OwnRecipeView(request):

    # 1️⃣ Handle recipe submission
    if request.method == 'POST':
        OwnRecipe.objects.create(
            recipe_name=request.POST.get('recipeName'),
            email=request.user.email,
            image=request.FILES.get('image'),
            recipe=request.POST.get('Recipe')
            # is_approved stays False by default
        )
        return redirect('/OwnRecipe')

    # 2️⃣ Fetch only APPROVED recipes for cards
    approved_recipes = OwnRecipe.objects.filter(is_approved=True)

    # 3️⃣ Send approved recipes to template
    return render(
        request,
        'base_app/OwnRecipe.html',
        {'recipes': approved_recipes}
    )

@login_required(login_url='login')
def buy_premium(request, plan):

    profile = request.user.profile

    duration_map = {
        "Weekly": 7,
        "Bi-Weekly": 14,
        "Monthly": 30,
        "Quarterly": 90,
        "Half-Yearly": 180,
        "Yearly": 365,
    }

    if plan in duration_map:
        profile.is_premium = True
        profile.premium_plan = plan
        profile.premium_start = timezone.now()
        profile.premium_end = timezone.now() + timedelta(days=duration_map[plan])
        profile.save()

    return redirect("profile")

@login_required
def order_history(request):
    orders = Order.objects.filter(user=request.user).order_by('-id')

    # Total quantity of all order items for this user
    total_quantity = OrderItem.objects.filter(
        order__user=request.user
    ).aggregate(total=Sum('quantity'))['total'] or 0

    return render(request, 'order_history.html', {
        'orders': orders,
        'total_quantity': total_quantity
    })

def check_premium(user):
    if not user.is_authenticated:
        return False
    
    profile = user.profile
    if profile.is_premium and profile.premium_end:
        if timezone.now() > profile.premium_end:
            profile.is_premium = False
            profile.premium_plan = None
            profile.save()
            return False
    return profile.is_premium

