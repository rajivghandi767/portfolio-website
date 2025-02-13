from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Info
from .serializers import InfoSerializer
from .models import Resume
from .serializers import ResumeSerializer


class InfoViewSet(viewsets.ModelViewSet):
    queryset = Info.objects.all()
    serializer_class = InfoSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class ResumeViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing resume operations.
    Provides CRUD operations and a custom action for viewing the active resume.
    """
    queryset = Resume.objects.all()
    serializer_class = ResumeSerializer

    def get_queryset(self):
        """
        Customize the queryset to return resumes ordered by version.
        This ensures we always see the most recent versions first.
        """
        return Resume.objects.all().order_by('-version')

    @action(detail=False, methods=['get'])
    def view(self, request):
        """
        Custom action to retrieve the currently active resume.
        This endpoint will be available at /api/resume/view/
        """
        try:
            # Get the active resume
            active_resume = get_object_or_404(Resume, is_active=True)

            # Serialize the resume with the current request context
            serializer = self.get_serializer(active_resume)

            return Response({
                'status': 'success',
                'data': serializer.data
            })
        except Resume.DoesNotExist:
            return Response(
                {'error': 'No active resume found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def create(self, request, *args, **kwargs):
        """
        Override create method to handle resume uploads.
        This ensures proper handling of the active status and versioning.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            resume = serializer.save()
            return Response({
                'status': 'success',
                'message': f'Resume "{resume.title}" uploaded successfully',
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        """
        Override update method to handle resume updates.
        This ensures proper handling of the active status when updating.
        """
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(
            instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)

        try:
            resume = serializer.save()
            return Response({
                'status': 'success',
                'message': f'Resume "{resume.title}" updated successfully',
                'data': serializer.data
            })
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
