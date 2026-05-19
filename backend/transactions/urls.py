from django.urls import path
from . import views

urlpatterns = [
    path('transactions/', views.TransactionListCreateView.as_view(), name='transaction-list-create'),
    path('transactions/<int:pk>/', views.TransactionDetailView.as_view(), name='transaction-detail'),
    path('categories/', views.CategoryListView.as_view(), name='category-list'),
    path('register/', views.RegisterView.as_view(), name='register'),
]