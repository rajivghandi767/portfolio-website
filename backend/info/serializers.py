import logging
from rest_framework import serializers
from django.urls import reverse
from .models import Info, Resume

logger = logging.getLogger(__name__)


class InfoSerializer(serializers.ModelSerializer):
    """
    Enhanced serializer for Info model with better field handling
    """
    profile_photo_url = serializers.SerializerMethodField()
    has_profile_photo = serializers.SerializerMethodField()

    class Meta:
        model = Info
        fields = [
            "id",
            "profile_photo",
            "profile_photo_url",
            "has_profile_photo",
            "greeting",
            "bio",
            "github",
            "linkedIn",
            "created_at",
            "updated_at"
        ]
        read_only_fields = ('created_at', 'updated_at')

    def get_profile_photo_url(self, obj):
        """
        Get the full URL for the profile photo with error handling
        """
        if obj.profile_photo:
            try:
                request = self.context.get('request')
                if request:
                    return request.build_absolute_uri(obj.profile_photo.url)
                else:
                    # Fallback when no request context available
                    return obj.profile_photo.url
            except Exception as e:
                logger.warning(
                    f"Error getting profile photo URL for info {obj.id}: {str(e)}")
                return None
        return None

    def get_has_profile_photo(self, obj):
        """
        Boolean indicator of whether profile photo exists and is accessible
        """
        return obj.has_profile_photo


class ResumeSerializer(serializers.ModelSerializer):
    """
    Enhanced serializer for Resume model with custom API endpoints
    """
    view_url = serializers.SerializerMethodField()
    download_url = serializers.SerializerMethodField()
    status_url = serializers.SerializerMethodField()
    file_info = serializers.SerializerMethodField()
    file_accessible = serializers.SerializerMethodField()

    class Meta:
        model = Resume
        fields = [
            'id',
            'filename',
            'file_size',
            'uploaded_at',
            'updated_at',
            'is_active',
            'view_url',
            'download_url',
            'status_url',
            'file_info',
            'file_accessible'
        ]
        read_only_fields = ('uploaded_at', 'updated_at',
                            'filename', 'file_size')

    def get_view_url(self, obj):
        """
        Get the API endpoint URL for viewing the resume
        """
        try:
            request = self.context.get('request')
            if obj.is_active and obj.file:
                # This maps to /api/resume/view/
                view_path = reverse('resume-view')
                if request:
                    return request.build_absolute_uri(view_path)
                else:
                    # Fallback URL construction
                    return f"/api/resume/view/"
            return None
        except Exception as e:
            logger.warning(
                f"Error building view URL for resume {obj.id}: {str(e)}")
            return None

    def get_download_url(self, obj):
        """
        Get the API endpoint URL for downloading the resume
        """
        try:
            request = self.context.get('request')
            if obj.is_active and obj.file:
                # This maps to /api/resume/download/
                download_path = reverse('resume-download')
                if request:
                    return request.build_absolute_uri(download_path)
                else:
                    # Fallback URL construction
                    return f"/api/resume/download/"
            return None
        except Exception as e:
            logger.warning(
                f"Error building download URL for resume {obj.id}: {str(e)}")
            return None

    def get_status_url(self, obj):
        """
        Get the API endpoint URL for checking resume status
        """
        try:
            request = self.context.get('request')
            # This maps to /api/resume/status/
            status_path = reverse('resume-status')
            if request:
                return request.build_absolute_uri(status_path)
            else:
                return f"/api/resume/status/"
        except Exception as e:
            logger.warning(f"Error building status URL: {str(e)}")
            return "/api/resume/status/"

    def get_file_info(self, obj):
        """
        Get detailed file information
        """
        if obj.file:
            try:
                return {
                    'filename': obj.filename,
                    'size_bytes': obj.file_size,
                    'size_display': obj.file_size_display,
                    'is_active': obj.is_active,
                    'upload_date': obj.uploaded_at.isoformat() if obj.uploaded_at else None
                }
            except Exception as e:
                logger.warning(
                    f"Error getting file info for resume {obj.id}: {str(e)}")
                return {
                    'error': 'File information unavailable'
                }
        return None

    def get_file_accessible(self, obj):
        """
        Check if the file is accessible
        """
        return obj.is_file_accessible

    def validate_file(self, value):
        """
        Custom validation for the file field
        """
        if value:
            # Additional validation beyond the model validator
            if not value.name.lower().endswith('.pdf'):
                raise serializers.ValidationError(
                    "Only PDF files are allowed.")

            # Check file size (this should match the validator, but provides better error message)
            if value.size > 5 * 1024 * 1024:  # 5MB
                size_mb = value.size / (1024 * 1024)
                raise serializers.ValidationError(
                    f"File too large: {size_mb:.1f}MB. Maximum size is 5MB."
                )

        return value

    def validate_is_active(self, value):
        """
        Custom validation for the is_active field
        """
        # If setting this resume as active, ensure it has a file
        if value and not self.instance and not self.initial_data.get('file'):
            raise serializers.ValidationError(
                "Cannot set resume as active without a file."
            )

        return value

    def create(self, validated_data):
        """
        Enhanced create method with logging
        """
        try:
            resume = super().create(validated_data)
            logger.info(
                f"Resume created via API: {resume.filename} (Active: {resume.is_active})")
            return resume
        except Exception as e:
            logger.error(
                f"Error creating resume via API: {str(e)}", exc_info=True)
            raise

    def update(self, instance, validated_data):
        """
        Enhanced update method with logging
        """
        try:
            old_active_status = instance.is_active
            resume = super().update(instance, validated_data)

            if old_active_status != resume.is_active:
                logger.info(
                    f"Resume activation status changed via API: {resume.filename} - Active: {resume.is_active}")
            else:
                logger.info(f"Resume updated via API: {resume.filename}")

            return resume
        except Exception as e:
            logger.error(
                f"Error updating resume via API: {str(e)}", exc_info=True)
            raise


class ResumeListSerializer(serializers.ModelSerializer):
    """
    Simplified serializer for resume list views (less data for performance)
    """
    file_size_display = serializers.ReadOnlyField()

    class Meta:
        model = Resume
        fields = [
            'id',
            'filename',
            'file_size_display',
            'uploaded_at',
            'is_active'
        ]


class ResumeStatusSerializer(serializers.Serializer):
    """
    Serializer for resume status responses
    """
    total_resumes = serializers.IntegerField()
    active_resumes = serializers.IntegerField()
    has_active_resume = serializers.BooleanField()
    active_resume_id = serializers.IntegerField(required=False)
    active_resume_filename = serializers.CharField(required=False)
    active_resume_uploaded_at = serializers.DateTimeField(required=False)
    active_resume_size = serializers.CharField(required=False)
    file_accessible = serializers.BooleanField(required=False)
    error = serializers.CharField(required=False)
