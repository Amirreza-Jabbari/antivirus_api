from django.urls import path
from .views import FileScanAPIView, ScanResultAPIView

urlpatterns = [
    path('scan/', FileScanAPIView.as_view(), name='file_scan'),
    path('results/<str:task_id>/', ScanResultAPIView.as_view(), name='scan_result'),
]
