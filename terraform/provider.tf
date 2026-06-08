terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
  
  # Self-sustained remote state storage within the project
  backend "gcs" {
    bucket  = "rajiv-portfolio-tf-state"
    prefix  = "terraform/state"
  }
}

provider "google" {
  project = var.gcp_project
  region  = var.gcp_region
}
