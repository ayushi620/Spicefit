from django.db import models
from django.contrib.auth.models import User  
from django.utils import timezone                                                                                                                                                                                                                                          

# Create your models here.
 

class ItemList(models.Model):
    Category_Name = models.CharField(max_length=40)

    def __str__(self):
        return self.Category_Name
    
    class Meta:
        verbose_name_plural = "📂Menu → Categories"
    
class MoodList(models.Model):
    Moody_Name = models.CharField(max_length=40)
    icon = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.Moody_Name
    
    class Meta:
        verbose_name_plural = "🎭Mood → Categories"
 
class MoodyRecipe(models.Model):
    Mood_Cat = models.ForeignKey(MoodList, related_name='mood',on_delete=models.CASCADE)
    Item_name = models.CharField(max_length=100)
    moody_recipe =  models.TextField()
    moody_ingrident = models.TextField()
    is_premium = models.BooleanField(default=False)
    Menu_img = models.ImageField(upload_to="uploads/")

    def __str__(self):
        return f"{self.Item_name} — {'(Premium)' if self.is_premium else ''}"
    
    class Meta:
        verbose_name_plural = "🎭MoodyPage → Recipes"

class AboutUs(models.Model):
    des = models.TextField(blank=False)
    des1 = models.TextField(blank=False)

    def __str__(self):
        return self.des
    class Meta:
        verbose_name_plural = "📌About → AboutUs"
    

class mealChallenges(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    color = models.CharField(max_length=20, default="orange")

    def __str__(self):
        return self.title
    class Meta:
        verbose_name_plural = "🍲MealPage → title"

class mealtitles(models.Model):
    challenge = models.ForeignKey(
        mealChallenges,
        on_delete=models.CASCADE,
        related_name="titles"
    )
    title = models.CharField(max_length=200) 
    image = models.ImageField(upload_to="uploads/", blank=True, null=True)


    def __str__(self):
        return self.title
    
    class Meta:
        verbose_name_plural = "🍲MealPage → Stitles"
    
    


class mealRecipe(models.Model):
    title = models.ForeignKey(
        mealtitles,
        on_delete=models.CASCADE,
        related_name="recipes"
    )
    recipeName = models.CharField(max_length=200)
    image = models.ImageField(upload_to="uploads/")
    ingredients = models.TextField()
    steps = models.TextField()
    is_premium = models.BooleanField(default=False)

    def __str__(self):
        return self.recipeName
    
    class Meta:
        verbose_name_plural = "🍲MealPage → Recipes"
    

class MenuRecipe(models.Model):
    Menu_Cat = models.ForeignKey(ItemList, related_name='category',on_delete=models.CASCADE)
    Item_name = models.CharField(max_length=100)
    Item_price = models.IntegerField()
    menu_recipe =  models.TextField()
    is_premium = models.BooleanField(default=False)
    Menu_img = models.ImageField(upload_to="uploads/")

    def __str__(self):
        return f"{self.Item_name} — ₹{self.Item_price} {'(Premium)' if self.is_premium else ''}"
    
    class Meta:
        verbose_name_plural = "📂MenuPage → Recipes"



class QuickRecipe(models.Model):
    Item_name = models.CharField(max_length=100)
    ingrident =  models.TextField()
    quick_recipe =  models.TextField()
    is_premium = models.BooleanField(default=False)
    quick_img = models.ImageField(upload_to="uploads/")

    def __str__(self):
       return f"{self.Item_name} — {'(Premium)' if self.is_premium else ''}"
    
    class Meta:
        verbose_name_plural = "⚡QuickPage → Recipes"


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=10, blank=True, null=True)
    password = models.CharField(max_length=100)
    address = models.CharField(max_length=255, blank=True, null=True)
    is_premium = models.BooleanField(default=False)

    premium_plan = models.CharField(max_length=50, blank=True, null=True)  # ✅ ADD THIS
    premium_start = models.DateTimeField(null=True, blank=True)
    premium_end = models.DateTimeField(null=True, blank=True)   # ✅ NEW


    def __str__(self):
        return f"Profile ID: {self.id} | User ID: {self.user.id} | {self.user.username}"

    class Meta:
        verbose_name_plural = "👤Users → Profiles"


class OwnRecipe(models.Model):
    recipe_name = models.CharField(max_length=100, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    recipe = models.TextField(blank=True, null=True)
    is_approved = models.BooleanField(default=False)  # Admin approval
    created_at = models.DateTimeField(auto_now_add=True)  # Optional
    image = models.ImageField(upload_to='uploads/',blank=True,null=True)

    def __str__(self):
        return self.recipe_name
    
    class Meta:
        verbose_name_plural = "👨‍🍳Users → Recipes"

    
class book(models.Model):
    book_img = models.ImageField(upload_to="uploads/")
    book_name = models.CharField(max_length=100,blank=True, null=True)
    amazon_link = models.URLField(blank=True, null=True)  
    
    def __str__(self):
        return self.book_name
    
    class Meta:
        verbose_name_plural = "📚BookPage → Books"

class Sitereview(models.Model):
    User_Name = models.TextField(max_length=15)
    des = models.TextField(blank=False)
    Rating = models.IntegerField() 
    image = models.ImageField(upload_to='uploads/', blank=True, null=True)  
    created_at = models.DateTimeField(auto_now_add=True)  # Timestamp
    is_approved = models.BooleanField(default=False)  

    def __str__(self):
        return self.User_Name
    class Meta:
        verbose_name_plural = "⭐Users Reviews"

class ParentTitle(models.Model): 
    Ptitle = models.CharField(max_length=100) 

    def __str__(self): 
         return self.Ptitle
    
    class Meta:
        verbose_name_plural = "🧩ParentPage → Titles"
    
class ParentSubCatTitle(models.Model): 
    Stitle = models.ForeignKey( ParentTitle, on_delete=models.CASCADE, related_name="recipes" ) 
    ParentSTitle = models.CharField(max_length=100) 
    desc = models.TextField(blank=True, null=True)

    def __str__(self): 
         return self.ParentSTitle
    
    class Meta:
        verbose_name_plural = "🧩ParentPage →Stitles"


    
class ParentRecipe(models.Model): 
    Rtitle = models.ForeignKey(ParentSubCatTitle,on_delete=models.CASCADE, related_name="recipes") 
    PrecipeName = models.CharField(max_length=200) 
    parent_image = models.ImageField(upload_to="uploads/") 
    Parent_ing = models.TextField() 
    Parent_steps = models.TextField() 
    is_premium = models.BooleanField(default=False) 
    
    def __str__(self): 
        return self.PrecipeName 
    
    class Meta:
        verbose_name_plural = "🧩ParentPage → Recipes"


class Visitor(models.Model):
    visitor_id = models.CharField(max_length=255, unique=True)
    session_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
     return f"Visitor #{self.id}"
    
    class Meta:
        verbose_name_plural = "👁️ Site Visitors"


class PlanCategory(models.Model):
    name = models.CharField(max_length=100)   # Diet, Skill, Lifestyle
    icon = models.CharField(max_length=100, blank=True)
    description = models.TextField()

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "🥗 Plan Categories"


class Plan(models.Model):
    category = models.ForeignKey(PlanCategory, on_delete=models.CASCADE, related_name="plans")
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "🥗Sub Plans"


class OurPlan(models.Model):
    plan = models.ForeignKey(Plan, on_delete=models.CASCADE, related_name="ourplans")
    title = models.CharField(max_length=200)
    image = models.ImageField(upload_to="ourplans/")
    ingredients = models.TextField()
    instructions = models.TextField()
    is_premium = models.BooleanField(default=False)

    def __str__(self):
        return self.title
    
    class Meta:
        verbose_name_plural = "🥗Plans recipes"
    
class Ingredient(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "🥬 Ingredients"


class Recipe(models.Model):
    title = models.CharField(max_length=200)
    image = models.ImageField(upload_to="recipes/")
    ingredients = models.TextField()
    recipe = models.TextField()
    is_premium = models.BooleanField(default=False)

    def __str__(self):
        return self.title
    
    class Meta:
        verbose_name_plural = "🥬 Ing. recipes"
    

class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}'s Cart"
    
    class Meta:
        verbose_name_plural = "🛍️ Cart"



class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")
    item_name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.IntegerField(default=1)
 
    def total_price(self):
        return self.price * self.quantity

    def __str__(self):
        return f"{self.item_name} x{self.quantity} ({self.cart.user.username})"
    
    class Meta:
        verbose_name_plural = "🛍️ Cart Items"


class Order(models.Model):

    PAYMENT_METHODS = [
        ('UPI', 'UPI'),
        ('CARD', 'Card'),
        ('COD', 'Cash on Delivery'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    address = models.TextField()
    payment_method = models.CharField(max_length=10, choices=PAYMENT_METHODS)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.id} - {self.user.username}"
    
    class Meta:
        verbose_name_plural = "🛒 Orders"




class OrderItem(models.Model):

    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    item_name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.IntegerField()

    def total_price(self):
        return self.price * self.quantity

    def __str__(self):
        return f"{self.item_name} x{self.quantity} (Order {self.order.id})"

    class Meta:
        verbose_name_plural = "🛒 Order Items"

class Payment(models.Model):

    STATUS = [
        ('PENDING', 'Pending'),
        ('SUCCESS', 'Success'),
        ('FAILED', 'Failed'),
    ]

    order = models.OneToOneField(Order, on_delete=models.CASCADE)
    payment_method = models.CharField(max_length=10)
    transaction_id = models.CharField(max_length=200, blank=True, null=True)
    status = models.CharField(max_length=10, choices=STATUS, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment for Order {self.order.id} - {self.status}"
    
    class Meta:
        verbose_name_plural = "💳 Payments"

class Dashboard(models.Model):
    
    class Meta:
        verbose_name_plural = "📊 report"

    def __str__(self):
        return "Dashboard"
    



class Premium(models.Model):
    
    PAYMENT_METHODS = [
        ('UPI', 'UPI'),
        ('CARD', 'Card'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="premium_orders")
    premium_type = models.CharField(max_length=50)
    payment_method = models.CharField(max_length=10, choices=PAYMENT_METHODS)
    buy_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.premium_type}"

    class Meta:
        verbose_name_plural = "👑 Premium Users"
    

