output "resource_group_name" {
  description = "Name of the Azure Resource Group hosting the Static Web App"
  value       = azurerm_resource_group.rg.name
}

output "static_web_app_id" {
  description = "Azure Resource ID of the Static Web App"
  value       = azurerm_static_web_app.swa.id
}

output "static_web_app_name" {
  description = "Name of the Azure Static Web App resource"
  value       = azurerm_static_web_app.swa.name
}

output "default_hostname" {
  description = "Default auto-generated Azure hostname (*.azurestaticapps.net)"
  value       = azurerm_static_web_app.swa.default_host_name
}

output "static_web_app_url" {
  description = "Full URL to access the deployed web application"
  value       = "https://${azurerm_static_web_app.swa.default_host_name}"
}

output "api_key" {
  description = "Deployment token / API key used by GitHub Actions or SWA CLI for deployment"
  value       = azurerm_static_web_app.swa.api_key
  sensitive   = true
}
