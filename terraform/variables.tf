variable "app_name" {
  description = "Application base name used for resource naming"
  type        = string
  default     = "currency-converter"
}

variable "environment" {
  description = "Target deployment environment (e.g. dev, staging, prod)"
  type        = string
  default     = "prod"
}

variable "location" {
  description = "Azure region for Static Web App metadata and Resource Group (e.g. eastus2, centralus, westus2, westeurope, eastasia)"
  type        = string
  default     = "eastus2"
}

variable "sku_tier" {
  description = "Pricing tier of the Static Web App (Free or Standard)"
  type        = string
  default     = "Free"

  validation {
    condition     = contains(["Free", "Standard"], var.sku_tier)
    error_message = "sku_tier must be either 'Free' or 'Standard'."
  }
}

variable "sku_size" {
  description = "Size of the Static Web App (Free or Standard)"
  type        = string
  default     = "Free"

  validation {
    condition     = contains(["Free", "Standard"], var.sku_size)
    error_message = "sku_size must be either 'Free' or 'Standard'."
  }
}

variable "tags" {
  description = "Key-value tags to apply to all Azure resources"
  type        = map(string)
  default = {
    Project     = "CurrencyConverter"
    ManagedBy   = "Terraform"
    Environment = "prod"
  }
}

variable "custom_domain" {
  description = "Optional custom domain name to attach to the Static Web App (e.g. currency.example.com)"
  type        = string
  default     = ""
}
