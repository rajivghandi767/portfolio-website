import logging
from django.http import FileResponse
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Info, Resume
from .serializers import InfoSerializer, ResumeSerializer, ResumeListSerializer

logger = logging.getLogger(__name__)


class InfoViewSet(viewsets.ModelViewSet):
    queryset = Info.objects.all()
    serializer_class = InfoSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class ResumeViewSet(viewsets.ModelViewSet):
    queryset = Resume.objects.all().order_by('-uploaded_at')
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.action == 'list':
            return ResumeListSerializer
        return ResumeSerializer

    def _serve_file(self, request, as_attachment):
        try:
            resume = Resume.get_active_resume()
            if not resume or not resume.is_file_accessible:
                logger.warning(
                    f"File serve failed: No active/accessible resume. Attachment: {as_attachment}")
                return Response({'error': 'No active resume is available.'}, status=status.HTTP_404_NOT_FOUND)

            try:
                file_handle = resume.file.open('rb')

                response = FileResponse(
                    file_handle, content_type='application/pdf', as_attachment=as_attachment)

                filename = "Rajiv_Wallace_Resume.pdf"
                if as_attachment:
                    response['Content-Disposition'] = f'attachment; filename="{filename}"'
                    response['Content-Length'] = resume.file.size
                else:
                    response['Content-Disposition'] = f'inline; filename="{filename}"'

                logger.info(
                    f"Resume served. Attachment: {as_attachment}, File: {resume.file.name}")
                return response

            except FileNotFoundError:
                logger.error(
                    f"File not found on storage for resume ID {resume.id}: {resume.file.name}")
                return Response({'error': 'The resume file is missing from the server. Please upload it again.'}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                logger.error(
                    f"Error serving file for resume ID {resume.id}: {str(e)}", exc_info=True)
                return Response({'error': 'An error occurred while accessing the file handle.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:
            logger.error(
                f"Unexpected error preparing to serve file. Attachment: {as_attachment}. Error: {str(e)}", exc_info=True)
            return Response({'error': 'An unexpected error occurred while preparing the file.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'])
    def view(self, request):
        return self._serve_file(request, as_attachment=False)

    @action(detail=False, methods=['get'])
    def download(self, request):
        return self._serve_file(request, as_attachment=True)

    @action(detail=False, methods=['get'])
    def status(self, request):
        try:
            total_resumes = Resume.objects.count()
            active_resume = Resume.get_active_resume()

            status_info = {
                'total_resumes': total_resumes,
                'active_resumes': 1 if active_resume else 0,
                'has_active_resume': bool(active_resume)
            }

            if active_resume:
                status_info.update({
                    'active_resume_id': active_resume.id,
                    'active_resume_filename': active_resume.file.name if active_resume.file else None,
                    'active_resume_uploaded_at': active_resume.uploaded_at,
                    'active_resume_size': active_resume.file_size_display,
                    'file_accessible': active_resume.is_file_accessible
                })

            return Response(status_info, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(
                f"Error getting resume status: {str(e)}", exc_info=True)
            return Response({'error': 'Failed to retrieve resume status'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
