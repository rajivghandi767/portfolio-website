import logging
import os
from django.http import FileResponse, Http404, JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_control
from django.views.decorators.vary import vary_on_headers
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.decorators import action
from rest_framework.response import Response
from django.conf import settings
from .models import Info, Resume
from .serializers import InfoSerializer, ResumeSerializer

logger = logging.getLogger(__name__)


class InfoViewSet(viewsets.ModelViewSet):
    """
    ViewSet for handling profile information (Info model)
    Provides CRUD operations for profile data
    """
    queryset = Info.objects.all()
    serializer_class = InfoSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def list(self, request, *args, **kwargs):
        """Enhanced list method with error handling"""
        try:
            response = super().list(request, *args, **kwargs)
            logger.info(
                f"Info list retrieved successfully. Count: {len(response.data)}")
            return response
        except Exception as e:
            logger.error(
                f"Error retrieving info list: {str(e)}", exc_info=True)
            return Response(
                {'error': 'Failed to retrieve profile information'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def retrieve(self, request, *args, **kwargs):
        """Enhanced retrieve method with error handling"""
        try:
            response = super().retrieve(request, *args, **kwargs)
            logger.info(f"Info object retrieved: ID {kwargs.get('pk')}")
            return response
        except Info.DoesNotExist:
            logger.warning(f"Info object not found: ID {kwargs.get('pk')}")
            return Response(
                {'error': 'Profile information not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(
                f"Error retrieving info object: {str(e)}", exc_info=True)
            return Response(
                {'error': 'Failed to retrieve profile information'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ResumeViewSet(viewsets.ModelViewSet):
    """
    ViewSet for handling resume files
    Provides file upload, download, and viewing functionality
    """
    queryset = Resume.objects.all()
    serializer_class = ResumeSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    @method_decorator(cache_control(max_age=3600))  # Cache for 1 hour
    @method_decorator(vary_on_headers('User-Agent'))
    @action(detail=False, methods=['get'])
    def view(self, request):
        """
        Serve resume file for viewing (inline display)
        Optimized for iframe embedding and PDF viewing
        """
        try:
            # Get the active resume
            resume = Resume.objects.filter(
                is_active=True).latest('uploaded_at')

            # Verify file exists
            if not resume.file:
                logger.error("Active resume has no file attached")
                return Response(
                    {'error': 'Resume file not found'},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Check if file exists on disk
            try:
                file_path = resume.file.path
                if not os.path.exists(file_path):
                    logger.error(
                        f"Resume file does not exist on disk: {file_path}")
                    return Response(
                        {'error': 'Resume file not found on server'},
                        status=status.HTTP_404_NOT_FOUND
                    )
            except Exception as e:
                logger.error(f"Error checking file path: {str(e)}")
                return Response(
                    {'error': 'Error accessing resume file'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            try:
                # Create file response for inline viewing
                response = FileResponse(
                    resume.file.open('rb'),
                    content_type='application/pdf',
                    as_attachment=False  # Inline display
                )

                # Set headers for proper PDF viewing in browsers
                response['Content-Disposition'] = 'inline; filename="Rajiv_Wallace_Resume.pdf"'
                # Allow iframe embedding
                response['X-Frame-Options'] = 'SAMEORIGIN'
                response['Content-Security-Policy'] = "frame-ancestors 'self'"
                # Cache for 1 hour
                response['Cache-Control'] = 'public, max-age=3600'

                logger.info(f"Resume served for viewing: {resume.filename}")
                return response

            except Exception as e:
                logger.error(
                    f"Error creating file response: {str(e)}", exc_info=True)
                return Response(
                    {'error': 'Error serving resume file'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        except Resume.DoesNotExist:
            logger.warning("No active resume found for viewing")
            return Response(
                {'error': 'No active resume found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(
                f"Unexpected error in resume view: {str(e)}", exc_info=True)
            return Response(
                {'error': 'Internal server error while retrieving resume'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['get'])
    def download(self, request):
        """
        Serve resume file for download
        Forces download with proper filename
        """
        try:
            # Get the active resume
            resume = Resume.objects.filter(
                is_active=True).latest('uploaded_at')

            # Verify file exists
            if not resume.file:
                logger.error("Active resume has no file attached")
                return Response(
                    {'error': 'Resume file not found'},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Check if file exists on disk
            try:
                file_path = resume.file.path
                if not os.path.exists(file_path):
                    logger.error(
                        f"Resume file does not exist on disk: {file_path}")
                    return Response(
                        {'error': 'Resume file not found on server'},
                        status=status.HTTP_404_NOT_FOUND
                    )
            except Exception as e:
                logger.error(f"Error checking file path: {str(e)}")
                return Response(
                    {'error': 'Error accessing resume file'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            try:
                # Create file response for download
                response = FileResponse(
                    resume.file.open('rb'),
                    content_type='application/pdf',
                    as_attachment=True  # Force download
                )

                # Set download filename
                response['Content-Disposition'] = 'attachment; filename="Rajiv_Wallace_Resume.pdf"'

                # Add helpful headers
                response['Content-Length'] = resume.file.size

                logger.info(f"Resume served for download: {resume.filename}")
                return response

            except Exception as e:
                logger.error(
                    f"Error creating download response: {str(e)}", exc_info=True)
                return Response(
                    {'error': 'Error serving resume file for download'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        except Resume.DoesNotExist:
            logger.warning("No active resume found for download")
            return Response(
                {'error': 'No active resume found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(
                f"Unexpected error in resume download: {str(e)}", exc_info=True)
            return Response(
                {'error': 'Internal server error while downloading resume'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['get'])
    def status(self, request):
        """
        Get status information about available resumes
        Useful for debugging and admin purposes
        """
        try:
            total_resumes = Resume.objects.count()
            active_resumes = Resume.objects.filter(is_active=True).count()

            status_info = {
                'total_resumes': total_resumes,
                'active_resumes': active_resumes,
                'has_active_resume': active_resumes > 0
            }

            # Add active resume info if available
            if active_resumes > 0:
                try:
                    active_resume = Resume.objects.filter(
                        is_active=True).latest('uploaded_at')
                    status_info.update({
                        'active_resume_id': active_resume.id,
                        'active_resume_filename': active_resume.filename,
                        'active_resume_uploaded_at': active_resume.uploaded_at,
                        'active_resume_size': active_resume.file_size_display,
                        'file_accessible': active_resume.is_file_accessible
                    })
                except Exception as e:
                    logger.warning(
                        f"Error getting active resume details: {str(e)}")
                    status_info['error'] = 'Active resume exists but details unavailable'

            logger.info("Resume status retrieved successfully")
            return Response(status_info, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(
                f"Error getting resume status: {str(e)}", exc_info=True)
            return Response(
                {'error': 'Failed to retrieve resume status'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def perform_create(self, serializer):
        """
        Enhanced create method with automatic activation logic
        """
        try:
            # If this resume is being set as active, deactivate others
            if serializer.validated_data.get('is_active', False):
                Resume.objects.update(is_active=False)
                logger.info(
                    "Deactivated existing resumes for new active resume")

            serializer.save()

            resume = serializer.instance
            logger.info(
                f"Resume created successfully: {resume.filename} (Active: {resume.is_active})")

        except Exception as e:
            logger.error(f"Error creating resume: {str(e)}", exc_info=True)
            raise

    def perform_update(self, serializer):
        """
        Enhanced update method with activation logic
        """
        try:
            # If this resume is being set as active, deactivate others
            if serializer.validated_data.get('is_active', False):
                Resume.objects.exclude(
                    pk=serializer.instance.pk).update(is_active=False)
                logger.info(
                    f"Deactivated other resumes for updated resume: {serializer.instance.pk}")

            serializer.save()

            resume = serializer.instance
            logger.info(
                f"Resume updated successfully: {resume.filename} (Active: {resume.is_active})")

        except Exception as e:
            logger.error(f"Error updating resume: {str(e)}", exc_info=True)
            raise

    def perform_destroy(self, instance):
        """
        Enhanced delete method with logging
        """
        filename = instance.filename
        try:
            super().perform_destroy(instance)
            logger.info(f"Resume deleted successfully: {filename}")
        except Exception as e:
            logger.error(
                f"Error deleting resume {filename}: {str(e)}", exc_info=True)
            raise
