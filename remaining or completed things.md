

|completed project things|remaining things|
|-|-|
|pages : home ,about ,menu ,quick ,like ,cart, books ,advice,like button,user premium,|quick or meal footer spacing ,moody page,menu footer,premium,profile,payment,parents,meal ,parent premium<br />our plans,adding images into meal,ingrident filter,|
|database: menu,about,meal,quick,user,profile,admin,category,chanllenges,own recipe,books,new parents|database: cart, moody,premium data base,report|





------what to do for make premium user free to use all recipe--------

1. &nbsp;  import this in your view at their you make to premium also check the model they are having a field is\_premium or not:



1. &nbsp;# Check if the logged-in user is premium
2. &nbsp;   is\_premium\_user = (
3. &nbsp;       request.user.is\_authenticated 
4. &nbsp;       and hasattr(request.user, 'profile') 
5. &nbsp;       and request.user.profile.is\_premium
6. &nbsp;	)





2\.    now to remove a crown you having import the if condition like this and also do recipe. at their put your loop data like 

&nbsp;      having {% for i in quickRecipe%} so you have to write i replacing recipe.:



&nbsp;	<div class="image-container">

&nbsp;            <img src="{{ recipe.image.url }}" alt="{{ recipe.title }}">

&nbsp;                  {% if recipe.is\_premium and not is\_premium\_user %}

&nbsp;                       <i class="fa-solid fa-crown icon-left"></i>

&nbsp;                   {% endif %}

&nbsp;             <button class="like-btn" data-id="{{ recipe.id }}"

&nbsp; 		{% if recipe.is\_premium and not is\_premium\_user %}disabled title="Premium only"{% endif %}>

&nbsp; 			<i class="fa-solid fa-heart icon-right"></i>

&nbsp;	       </button>

&nbsp;        </div>



3\.     now do same for ingrident and recipe:

&nbsp;	<div class="btn-group">

&nbsp;                <button class="btn-ing"

&nbsp;                     {% if recipe.is\_premium and not is\_premium\_user %}disabled title="Premium only"{% endif %}

&nbsp;                      onclick="openBox('Ingredients', this)" data-ing="{{ recipe.ingredients }}">Ingredients</button>

&nbsp;                <button class="btn-view" 

&nbsp;                  	{% if recipe.is\_premium and not is\_premium\_user %}disabled title="Premium only"{% endif %}

&nbsp;                        onclick="openBox('Recipe', this)" data-recipe="{{ recipe.steps }}">View Recipe</button>

&nbsp;       </div> 


report , ingrident page in login page , profile 








to start ngrok



in vs code python manange.py runserver 8000

in c:\\ngrok>  ngrok http 8000


myenv\Scripts\activate



@admin.register(Dashboard)
class DashboardAdmin(admin.ModelAdmin):

    list_display = (
        'moody_recipe_count',
        'meal_recipe_count',
        'menu_recipe_count',
        'quick_recipe_count',
        'parent_recipe_count',
        'our_plan_count',
        'recipe_count',
        'profile_count',
        'approved_own_recipe_count',
        'book_count',
        'approved_review_count',
        'total_visitor_count',
        'order_item_count',
        'success_payment_count'
    
    )
    # 🍲 Recipes
    def moody_recipe_count(self, obj):
        return MoodyRecipe.objects.count()
    moody_recipe_count.short_description = "Moody Recipes"

    def meal_recipe_count(self, obj):
        return mealRecipe.objects.count()
    meal_recipe_count.short_description = "Meal Recipes"

    def menu_recipe_count(self, obj):
        return MenuRecipe.objects.count()
    menu_recipe_count.short_description = "Menu Recipes"

    def quick_recipe_count(self, obj):
        return QuickRecipe.objects.count()
    quick_recipe_count.short_description = "Quick Recipes"

    def parent_recipe_count(self, obj):
        return ParentRecipe.objects.count()
    parent_recipe_count.short_description = "Parent Recipes"

     # 🍽️ Main Recipe Model
    def recipe_count(self, obj):
        return Recipe.objects.count()
    recipe_count.short_description = "ingri. recipes"

      # 🗓️ Plans
    def our_plan_count(self, obj):
        return OurPlan.objects.count()
    our_plan_count.short_description = "Plans recipes"

     # 📚 Books
    def book_count(self, obj):
        return book.objects.count()
    book_count.short_description = "Total Books"

     # 👨‍🍳 User Recipes
    def approved_own_recipe_count(self, obj):
        return OwnRecipe.objects.filter(is_approved=True).count()
    approved_own_recipe_count.short_description = "User Recipes"

    # 👤 Users
    def profile_count(self, obj):
        return Profile.objects.count()
    profile_count.short_description = "Total Users"

    # ⭐ Reviews
    def approved_review_count(self, obj):
        return Sitereview.objects.filter(is_approved=True).count()
    approved_review_count.short_description = "Approved Reviews"

    # 👁️ Visitors
    def total_visitor_count(self, obj):
        return Visitor.objects.count()
    total_visitor_count.short_description = "Total Visitors"


    # 📦 Order Items
    def order_item_count(self, obj):
        return OrderItem.objects.count()
    order_item_count.short_description = "Total orders"

    # 💳 Successful Payments ONLY
    def success_payment_count(self, obj):
        return Payment.objects.filter(status='SUCCESS').count()
    success_payment_count.short_description = "Successful Payments"




{% extends "admin/change_list.html" %}
{% load admin_urls %}  

{% block content %}
<form class="mb-4 d-flex align-items-center flex-wrap" style="gap: 20px;">
    <label for="order_date_filter" style="font-weight: bold; font-size: 16px;">
        Filter Orders:
    </label>
    <select name="order_date_filter" id="order_date_filter" class="custom-select">
        <option value="all" selected>All</option>
        <option value="today">Today</option>
        <option value="past_7_days">Past 7 Days</option>
        <option value="this_month">This Month</option>
        <option value="this_year">This Year</option>
        <option value="custom">Custom Date</option>
    </select>

    <input type="date" id="custom_date" class="form-control form-control-sm w-auto" style="display:none;">
</form>

<style>
form.d-flex {
    display: flex;        /* Keep items in a row */
    flex-wrap: nowrap;    /* Prevent wrapping to next line */
    align-items: center;  /* Vertical alignment */
}

.custom-select {
    padding: 6px 12px;
    border-radius: 6px;
    border: 1px solid #ccc;
    min-width: 180px;
    font-size: 14px;
}
</style>

<div class="container-fluid">
    <h2 class="mb-4">📊 Dashboard</h2>

    <div class="row"> 
   {% load static %}
{% load admin_urls %}

<div class="container-fluid">
    <!-- Row 1 -->
    <div class="row">
        <div class="col-md-3">
            <a href="{% url 'admin:base_app_moodyrecipe_changelist' %}" class="text-decoration-none" target="_blank">
                <div class="card bg-info text-white mb-3">
                    <div class="card-body">
                        Moody Recipes
                        <h3>{{ moody_recipe_count }}</h3>
                    </div>
                </div>
            </a>
        </div>

        <div class="col-md-3">
            <a href="{% url 'admin:base_app_mealrecipe_changelist' %}" class="text-decoration-none" target="_blank">
                <div class="card bg-success text-white mb-3">
                    <div class="card-body">
                        Meal Recipes
                        <h3>{{ meal_recipe_count }}</h3>
                    </div>
                </div>
            </a>
        </div>

        <div class="col-md-3">
            <a href="{% url 'admin:base_app_menurecipe_changelist' %}" class="text-decoration-none" target="_blank">
                <div class="card bg-warning text-white mb-3">
                    <div class="card-body">
                        Menu Recipes
                        <h3>{{ menu_recipe_count }}</h3>
                    </div>
                </div>
            </a>
        </div>

        <div class="col-md-3">
            <a href="{% url 'admin:base_app_quickrecipe_changelist' %}" class="text-decoration-none" target="_blank">
                <div class="card bg-danger text-white mb-3">
                    <div class="card-body">
                        Quick Recipes
                        <h3>{{ quick_recipe_count }}</h3>
                    </div>
                </div>
            </a>
        </div>
    </div>

    <!-- Row 2 -->
    <div class="row">
        <div class="col-md-3">
            <a href="{% url 'admin:base_app_parentrecipe_changelist' %}" class="text-decoration-none" target="_blank">
                <div class="card bg-secondary text-white mb-3">
                    <div class="card-body">
                        Parent Recipes
                        <h3>{{ parent_recipe_count }}</h3>
                    </div>
                </div>
            </a>
        </div>

        <div class="col-md-3">
            <a href="{% url 'admin:base_app_recipe_changelist' %}" class="text-decoration-none" target="_blank">
                <div class="card bg-primary text-white mb-3">
                    <div class="card-body">
                        Ingredient Recipes
                        <h3>{{ recipe_count }}</h3>
                    </div>
                </div>
            </a>
        </div>

        <div class="col-md-3">
            <a href="{% url 'admin:base_app_ourplan_changelist' %}" class="text-decoration-none" target="_blank">
                <div class="card bg-info text-white mb-3">
                    <div class="card-body">
                        Our Plans
                        <h3>{{ our_plan_count }}</h3>
                    </div>
                </div>
            </a>
        </div>

        <div class="col-md-3">
            <a href="{% url 'admin:base_app_book_changelist' %}" class="text-decoration-none" target="_blank">
                <div class="card bg-success text-white mb-3">
                    <div class="card-body">
                        Total Books
                        <h3>{{ book_count }}</h3>
                    </div>
                </div>
            </a>
        </div>
    </div>

    <!-- Row 3 -->
    <div class="row">
        <div class="col-md-3">
            <a href="{% url 'admin:base_app_ownrecipe_changelist' %}" class="text-decoration-none" target="_blank">
                <div class="card bg-dark text-white mb-3">
                    <div class="card-body">
                        Approved Own Recipes
                        <h3>{{ approved_own_recipe_count }}</h3>
                    </div>
                </div>
            </a>
        </div>

        <div class="col-md-3">
            <a href="{% url 'admin:base_app_profile_changelist' %}" class="text-decoration-none" target="_blank">
                <div class="card bg-warning text-white mb-3">
                    <div class="card-body">
                        Total Profiles
                        <h3>{{ profile_count }}</h3>
                    </div>
                </div>
            </a>
        </div>

        <div class="col-md-3">
            <a href="{% url 'admin:base_app_sitereview_changelist' %}" class="text-decoration-none" target="_blank">
                <div class="card bg-primary text-white mb-3">
                    <div class="card-body">
                        Approved Reviews
                        <h3>{{ approved_review_count }}</h3>
                    </div>
                </div>
            </a>
        </div>

        <div class="col-md-3">
            <a href="{% url 'admin:base_app_visitor_changelist' %}" class="text-decoration-none" target="_blank">
                <div class="card bg-info text-white mb-3">
                    <div class="card-body">
                        Total Visitors
                        <h3>{{ total_visitor_count }}</h3>
                    </div>
                </div>
            </a>
        </div>
    </div>

    <!-- Row 4 -->
    <div class="row">
        <div class="col-md-3">
            <a href="{% url 'admin:base_app_order_changelist' %}" class="text-decoration-none" target="_blank">
                <div class="card bg-danger text-white mb-3">
                    <div class="card-body">
                        Total Orders
                        <h3 id="total_orders_count">{{ all_orders|length }}</h3>
                    </div>
                </div>
            </a>
        </div>

        <div class="col-md-3">
            <a href="{% url 'admin:base_app_payment_changelist' %}" class="text-decoration-none" target="_blank">
                <div class="card bg-success text-white mb-3">
                    <div class="card-body">
                        Total Payment
                        <h3 id="success_payments_count">0.00</h3>
                    </div>
                </div>
            </a>
        </div>
    </div>
</div>
</div>
{% endblock %}

{% block extrahead %}
<script>
document.addEventListener('DOMContentLoaded', function() {
    const orders = {{ all_orders|safe }};
    const filterSelect = document.getElementById('order_date_filter');
    const customDateInput = document.getElementById('custom_date');
    const totalOrdersCount = document.getElementById('total_orders_count');
    const successPaymentsCount = document.getElementById('success_payments_count');

    function updateCounts(filteredOrders) {
        totalOrdersCount.textContent = filteredOrders.length;

        const successPaymentsSum = filteredOrders
            .filter(o => o.payment_status && o.payment_status.toUpperCase() === 'SUCCESS')
            .reduce((sum, o) => sum + parseFloat(o.total_amount), 0);

        if(successPaymentsCount) {
            successPaymentsCount.textContent = successPaymentsSum.toFixed(2);
        }
    }

    function filterOrders(filter) {
        let filtered = orders;
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        if (filter === 'today') {
            filtered = orders.filter(o => o.created_at.split('T')[0] === todayStr);
        } else if (filter === 'past_7_days') {
            const weekAgo = new Date(today);
            weekAgo.setDate(today.getDate() - 7);
            filtered = orders.filter(o => new Date(o.created_at) >= weekAgo);
        } else if (filter === 'this_month') {
            const month = today.getMonth();
            const year = today.getFullYear();
            filtered = orders.filter(o => {
                const d = new Date(o.created_at);
                return d.getMonth() === month && d.getFullYear() === year;
            });
        } else if (filter === 'this_year') {
            const year = today.getFullYear();
            filtered = orders.filter(o => new Date(o.created_at).getFullYear() === year);
        } else if (filter === 'custom') {
            const custom = customDateInput.value;
            if (custom) filtered = orders.filter(o => o.created_at.split('T')[0] === custom);
        }

        updateCounts(filtered);
    }

    filterSelect.addEventListener('change', function() {
        if (this.value === 'custom') {
            customDateInput.style.display = 'inline-block';
        } else {
            customDateInput.style.display = 'none';
            filterOrders(this.value);
        }
    });

    if (customDateInput) {
        customDateInput.addEventListener('change', function() {
            filterOrders('custom');
        });
    }

    // Initial: show all orders
    filterOrders('all');
});
</script>
{% endblock %}

