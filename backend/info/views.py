from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.decorators import action
from rest_framework.response import Response
from django.http import HttpResponse, FileResponse
from .models import Info
from .serializers import InfoSerializer
from .models import Resume
from .serializers import ResumeSerializer


class InfoViewSet(viewsets.ModelViewSet):
    queryset = Info.objects.all()
    serializer_class = InfoSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class ResumeViewSet(viewsets.ModelViewSet):
    queryset = Resume.objects.all()
    serializer_class = ResumeSerializer

    @action(detail=False, methods=['get'])
    def view(self, request):
        try:
            resume = Resume.objects.filter(
                is_active=True).latest('uploaded_at')
            response = FileResponse(
                resume.file, content_type='application/pdf')

            # Set required headers for iframe viewing
            response['X-Frame-Options'] = 'SAMEORIGIN'
            response['Content-Security-Policy'] = "frame-ancestors 'self'"
            response['Content-Disposition'] = 'inline; filename="Rajiv_Wallace_Resume.pdf"'

            return response
        except Resume.DoesNotExist:
            return Response(
                {'error': 'No active resume found'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['get'])
    def download(self, request):
        try:
            resume = Resume.objects.filter(
                is_active=True).latest('uploaded_at')
            response = FileResponse(
                resume.file, content_type='application/pdf')
            response['Content-Disposition'] = 'attachment; filename="Rajiv_Wallace_Resume.pdf"'
            return response
        except Resume.DoesNotExist:
            return Response(
                {'error': 'No active resume found'},
                status=status.HTTP_404_NOT_FOUND
            )

    def perform_create(self, serializer):
        """
        Override create to handle the is_active flag
        """
        if serializer.validated_data.get('is_active', False):
            Resume.objects.update(is_active=False)
        serializer.save()
