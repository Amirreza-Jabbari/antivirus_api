import os
import uuid
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from celery.result import AsyncResult
from .tasks import yara_full_scan

class FileScanAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, format=None):
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({"error": "No file provided."}, status=status.HTTP_400_BAD_REQUEST)
        
        # File size limit: 20 MB
        if file_obj.size > 20971520:  # 20 MB in bytes
            return Response({"error": "The file size is more than 20 MB."}, status=status.HTTP_400_BAD_REQUEST)
        
        # File extension validation
        allowed_extensions = ['exe', 'zip', 'pdf', 'doc', 'docx', 'txt', 'bin', 'bat']
        ext = file_obj.name.split('.')[-1].lower()
        if ext not in allowed_extensions:
            return Response({"error": "File type is not allowed."}, status=status.HTTP_400_BAD_REQUEST)
        
        # save file in uploads directory
        scan_dir = os.path.join(settings.BASE_DIR, 'uploads')
        if not os.path.exists(scan_dir):
            os.makedirs(scan_dir)
        
        unique_filename = f"{uuid.uuid4().hex}.{ext}"
        file_path = os.path.join(scan_dir, unique_filename)
        with open(file_path, 'wb+') as destination:
            for chunk in file_obj.chunks():
                destination.write(chunk)
        
        # Calling the yara_full_scan task asynchronously
        result = yara_full_scan.delay(file_path)
        return Response({"task_id": result.id}, status=status.HTTP_202_ACCEPTED)

class ScanResultAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, task_id, format=None):
        result = AsyncResult(task_id)
        if result.state in ['STARTED', 'RETRY']:
            return Response({"status": "Processing..."}, status=status.HTTP_200_OK)
        elif result.state == 'PENDING':
            return Response({"status": "Waiting..."}, status=status.HTTP_200_OK)
        elif result.state == 'SUCCESS':
            return Response(result.get(), status=status.HTTP_200_OK)
        elif result.state == 'FAILURE':
            return Response({"status": "Failure", "error": str(result.result)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({"status": result.state}, status=status.HTTP_200_OK)
