terraform {
  required_version = ">= 1.5.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.90"
    }
  }

  # Uncomment to use Azure Blob Storage remote backend
  # backend "azurerm" {
  #   resource_group_name  = "rg-terraform-state"
  #   storage_account_name = "sttfstatecurrency"
  #   container_name       = "tfstate"
  #   key                  = "currency-converter.tfstate"
  # }
}

provider "azurerm" {
  features {}
}
