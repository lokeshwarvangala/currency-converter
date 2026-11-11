resource "azurerm_resource_group" "rg" {
  name     = "rg-${var.app_name}-${var.environment}"
  location = var.location
  tags     = var.tags
}

resource "azurerm_static_web_app" "swa" {
  name                = "swa-${var.app_name}-${var.environment}"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku_tier            = var.sku_tier
  sku_size            = var.sku_size
  tags                = var.tags
}

resource "azurerm_static_web_app_custom_domain" "custom_domain" {
  count               = var.custom_domain != "" ? 1 : 0
  static_web_app_id   = azurerm_static_web_app.swa.id
  domain_name         = var.custom_domain
  validation_type     = "cname-delegation"
}
