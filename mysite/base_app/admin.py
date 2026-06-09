from django.contrib import admin,messages
from django.db.models import Sum
from django.contrib.auth.models import User
from django.utils.timezone import now
from .models import *
from datetime import timedelta, datetime
# Register your models here.

admin.site.register(ItemList)
admin.site.register(MoodList)
admin.site.register(AboutUs)
admin.site.register(PlanCategory)
admin.site.register(Plan)
admin.site.register(OurPlan)
admin.site.register(QuickRecipe)
admin.site.register(mealChallenges)
admin.site.register(book)
admin.site.register(ParentTitle)
admin.site.register(ParentRecipe)
admin.site.register(Ingredient)
admin.site.register(Recipe)


# # ---------------- CART ----------------

# class CartAdmin(admin.ModelAdmin):

#     list_display = ('user', 'created_at')
#     list_filter = ('created_at',)
#     search_fields = ('user__username',)


# # ---------------- CART ITEM ----------------

# class CartItemAdmin(admin.ModelAdmin):

#     list_display = ('item_name', 'cart', 'price', 'quantity')
#     list_filter = ('cart',)
#     search_fields = ('item_name',)


# ---------------- ORDER ----------------
class OrderAdmin(admin.ModelAdmin):

    list_display = ('id', 'user', 'payment_method', 'total_amount', 'created_at')
    list_filter = ('created_at','payment_method',)
    
    search_fields = ('user__username', 'address')

    def changelist_view(self, request, extra_context=None):
        response = super().changelist_view(request, extra_context)

        try:
            qs = response.context_data['cl'].queryset
            total = qs.aggregate(total=Sum('total_amount'))['total'] or 0
            messages.success(request, f"Total Revenue: ₹ {total}")
        except Exception:
            pass

        return response
# ---------------- ORDER ITEM ----------------

class OrderItemAdmin(admin.ModelAdmin):

    list_display = ('id','item_name', 'order', 'price', 'quantity')
    list_filter = ('order',)
    search_fields = ('item_name',)


# ---------------- PAYMENT ----------------

class PaymentAdmin(admin.ModelAdmin):

    list_display = ('id','order', 'payment_method', 'status', 'created_at')
    list_filter = ('status', 'payment_method')
    search_fields = ('order__id',)


# ---------------- REGISTER ----------------

# admin.site.register(Cart, CartAdmin)
# admin.site.register(CartItem, CartItemAdmin)
admin.site.register(Order, OrderAdmin)
admin.site.register(OrderItem, OrderItemAdmin)
admin.site.register(Payment, PaymentAdmin)

@admin.register(Sitereview)
class SitereviewAdmin(admin.ModelAdmin):
    list_display = ('id','User_Name', 'Rating', 'is_approved', 'created_at')
    list_filter = ('is_approved', 'created_at')
    search_fields = ('User_Name',)
    actions = ['approve_reviews']

    def approve_reviews(self, request, queryset):
        queryset.update(is_approved=True)

    approve_reviews.short_description = "Approve selected reviews"


@admin.register(Visitor)
class VisitorAdmin(admin.ModelAdmin):
    list_display = ('id', 'session_time')
    readonly_fields = ('session_time',)

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('auth_user_id',"user", "get_email", "phone", "address",'user_joined','last_login_time')

    def get_email(self, obj):
        return obj.user.email
    get_email.short_description = "Email"

    def auth_user_id(self, obj):
        return obj.user.id
    auth_user_id.short_description = "Profile id"

        # ✅ Show date user registered
    def user_joined(self, obj):
        return obj.user.date_joined
    user_joined.short_description = "Joined Date"

    # ✅ Show last login time
    def last_login_time(self, obj):
        return obj.user.last_login
    last_login_time.short_description = "Last Login"

@admin.register(OwnRecipe)
class OwnRecipeAdmin(admin.ModelAdmin):
    list_display = ('id','recipe_name', 'email', 'is_approved', 'created_at')
    list_filter = ('is_approved', 'created_at')
    search_fields = ('recipe_name', 'email')
    actions = ['approve_recipes']

    def approve_recipes(self, request, queryset):
        queryset.update(is_approved=True)
    approve_recipes.short_description = "Approve selected recipes"


@admin.register(MenuRecipe)
class MenuAdmin(admin.ModelAdmin):
    list_display = ('id','Item_name', 'Menu_Cat','is_premium')
    search_fields = ('Item_name', 'Menu_Cat')

@admin.register(MoodyRecipe)
class MoodyAdmin(admin.ModelAdmin):
    list_display = ('id','Item_name', 'Mood_Cat','is_premium')
    search_fields = ('Item_name', 'Mood_Cat')

@admin.register(mealRecipe)
class MealRecipeAdmin(admin.ModelAdmin):
    list_display = ('id','title', 'recipeName', 'is_premium')
    search_fields = ('recipeName','title__title', )

@admin.register(mealtitles)
class MealTitleAdmin(admin.ModelAdmin):
    list_display = ('id','title', 'challenge_name', 'image')
    search_fields = ('title', 'challenge__title')  # adjust field name
    list_filter = ('challenge',)

    def challenge_name(self, obj):
        return obj.challenge.title   # change if field name is different

    challenge_name.short_description = "Challenge"

@admin.register(ParentSubCatTitle)
class ParentSubCatTitleAdmin(admin.ModelAdmin):
    list_display = ('id','ParentSTitle', 'get_stitle')
    search_fields = ('ParentSTitle', 'Stitle__title')  # change field name if needed
    list_filter = ('Stitle',)

    def get_stitle(self, obj):
        return obj.Stitle.Ptitle   # change "title" if ParentTitle field name is different

    get_stitle.short_description = "Main Title"

from django.contrib import admin
from django.utils.timezone import localtime
from django.core.serializers.json import DjangoJSONEncoder 
from django.http import JsonResponse
from datetime import timedelta, datetime
from django.db.models import Sum
from .models import Dashboard, Order, OrderItem, Payment, MoodyRecipe, mealRecipe, MenuRecipe, QuickRecipe, ParentRecipe, Recipe, OurPlan, book, OwnRecipe, Profile, Sitereview, Visitor
import json

@admin.register(Dashboard)
class DashboardAdmin(admin.ModelAdmin):
    change_list_template = "base_app/dashboard.html"

    def changelist_view(self, request, extra_context=None):
        if extra_context is None:
            extra_context = {}

        # Counts for cards
        extra_context.update({
            'moody_recipe_count': MoodyRecipe.objects.count(),
            'meal_recipe_count': mealRecipe.objects.count(),
            'menu_recipe_count': MenuRecipe.objects.count(),
            'quick_recipe_count': QuickRecipe.objects.count(),
            'parent_recipe_count': ParentRecipe.objects.count(),
            'recipe_count': Recipe.objects.count(),
            'our_plan_count': OurPlan.objects.count(),
            'book_count': book.objects.count(),
            'approved_own_recipe_count': OwnRecipe.objects.filter(is_approved=True).count(),
            'profile_count': Profile.objects.count(),
            'approved_review_count': Sitereview.objects.filter(is_approved=True).count(),
            'total_visitor_count': Visitor.objects.count(),
        })

        # Querysets for tables below container
        extra_context.update({
            'moody_recipes': MoodyRecipe.objects.all(),
            'meal_recipes': mealRecipe.objects.all(),
            'menu_recipes': MenuRecipe.objects.all(),
            'quick_recipes': QuickRecipe.objects.all(),
            'parent_recipes': ParentRecipe.objects.all(),
            'recipes': Recipe.objects.all(),
            'our_plans': OurPlan.objects.all(),
            'books': book.objects.all(),
            'own_recipes': OwnRecipe.objects.all(),
            'profiles': Profile.objects.all(),
            'reviews': Sitereview.objects.all(),
            'visitors': Visitor.objects.all(),
            'orders': Order.objects.all(),
            'payments': Payment.objects.all(),
        })

        # Orders JSON (optional)
        all_orders = []
        for order in Order.objects.all():
            payment = getattr(order, 'payment', None)
            payment_status = payment.status if payment else 'PENDING'
            all_orders.append({
                'id': order.id,
                'user': str(order.user),
                'created_at': localtime(order.created_at).isoformat(),
                'total_amount': float(order.total_amount),
                'payment_status': payment_status,
            })

        extra_context['all_orders'] = json.dumps(all_orders)

        return super().changelist_view(request, extra_context=extra_context)
        

from datetime import timedelta
@admin.register(Premium)
class PremiumAdmin(admin.ModelAdmin):

    list_display = ('id','user', 'premium_type', 'payment_method', 'buy_date','premium_status')
    list_filter = ('premium_type', 'payment_method', 'buy_date')
    search_fields = ('user__username', 'premium_type')  

    def premium_status(self, obj):

        profile = obj.user.profile

        # ✅ Get latest premium for this user
        latest_premium = Premium.objects.filter(user=obj.user).order_by('-buy_date', '-id').first()

        # ❌ If this is NOT latest → always expired
        if obj != latest_premium:
            return "❌ Expired"

        # ✅ Only latest plan checks actual expiry
        if profile.premium_end:
            return "❌ Expired" if timezone.now() > profile.premium_end else "✅ Active"

        return "No Plan"

    premium_status.short_description = "Status"

class MyAdminSite(admin.AdminSite):
    site_header = "My Dashboard"

    class Media:
        css = {
            'all': ('css/admin_custom.css',)  # path inside static folder
        }

admin_site = MyAdminSite(name='myadmin')

    