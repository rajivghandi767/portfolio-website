# Create the Terraform state bucket
resource "google_storage_bucket" "tf_state" {
  name          = "rajiv-portfolio-tf-state"
  location      = "US"
  force_destroy = false
  uniform_bucket_level_access = true
  versioning {
    enabled = true
  }
}

# 1. Create the GCS Bucket for Media
resource "google_storage_bucket" "media" {
  name          = var.media_bucket_name
  location      = "US"
  force_destroy = false

  uniform_bucket_level_access = true

  # CORS configuration is essential for web applications interacting directly with GCS
  cors {
    origin          = ["*"] # Consider restricting to rajivwallace.com in the future
    method          = ["GET", "HEAD", "PUT", "POST", "DELETE", "OPTIONS"]
    response_header = ["*"]
    max_age_seconds = 3600
  }
}

# 2. Make bucket objects publicly readable (so visitors can see portfolio images)
resource "google_storage_bucket_iam_member" "public_read" {
  bucket = google_storage_bucket.media.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}

# 3. Create Service Account for the Django application
resource "google_service_account" "app_sa" {
  account_id   = "portfolio-app-sa"
  display_name = "Portfolio App Service Account"
  description  = "Service Account used by the Django app to manage GCS objects."
}

# 4. Grant Service Account permissions to the bucket
resource "google_storage_bucket_iam_member" "app_bucket_admin" {
  bucket = google_storage_bucket.media.name
  role   = "roles/storage.objectAdmin"
  member = "serviceAccount:${google_service_account.app_sa.email}"
}

# 5. Generate JSON Key for the Django application
resource "google_service_account_key" "app_key" {
  service_account_id = google_service_account.app_sa.name
}

# Outputs are purely for convenience so you don't have to dig into the tfstate 
# or GCP console to retrieve the generated credentials.
output "gcs_credentials_json" {
  value     = base64decode(google_service_account_key.app_key.private_key)
  sensitive = true
}
