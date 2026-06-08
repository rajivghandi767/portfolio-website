variable "gcp_project" {
  description = "GCP Project ID"
  type        = string
  default     = "rajiv-portfolio-prod"
}

variable "gcp_region" {
  description = "Default region for resources"
  type        = string
  default     = "us-east1"
}

variable "media_bucket_name" {
  description = "Globally unique name for the media bucket"
  type        = string
  default     = "rajiv-portfolio-media-prod"
}
