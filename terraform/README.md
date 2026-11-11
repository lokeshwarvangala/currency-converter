# Azure Static Web Apps - Terraform Infrastructure

This directory contains production-ready Terraform infrastructure code to provision an **Azure Static Web App (Free Tier)** for the Currency Converter application.

---

## Architecture Overview

- **Cloud Provider**: Microsoft Azure (`azurerm` provider `~> 3.90`)
- **Resource Group**: `rg-currency-converter-<env>`
- **Service**: Azure Static Web App (`swa-currency-converter-<env>`)
- **Hosting Tier**: Free Tier (zero cost, global CDN distribution, 3 staging environments, custom domains with free auto-renewing SSL certificates)
- **Deployment Strategy**: Infrastructure-only provisioning with secure deployment token export for GitHub Actions CI/CD and Azure SWA CLI.

---

## File Structure

```
terraform/
├── main.tf                 # Resource Group, Static Web App, and optional Custom Domain
├── variables.tf            # Input variables with validation & defaults
├── outputs.tf              # App URLs, Resource IDs, and deployment token (api_key)
├── versions.tf             # Terraform & AzureRM provider versions + remote backend template
├── terraform.tfvars.example# Sample variable values
└── README.md               # Infrastructure documentation
```

---

## Prerequisites

1. **Terraform**: Version `1.5.0` or higher installed.
2. **Azure CLI**: Version `2.50.0` or higher.
3. Authenticate with Azure:
   ```bash
   az login
   az account set --subscription "<YOUR_SUBSCRIPTION_ID>"
   ```

---

## Quickstart: Provision Infrastructure

### 1. Initialize Terraform

```bash
cd terraform
terraform init
```

### 2. Configure Variables (Optional)

Copy the sample variables file:
```bash
cp terraform.tfvars.example terraform.tfvars
```
Adjust `environment`, `location` (`eastus2`, `centralus`, `westus2`, `westeurope`, etc.), or tags as needed.

### 3. Review Plan & Apply

```bash
terraform plan
terraform apply -auto-approve
```

---

## Outputs & Next Steps

Once provisioned, Terraform prints the application URL:
```bash
# View the live application URL
terraform output static_web_app_url

# Extract the deployment token securely
terraform output -raw api_key
```

### Option A: Automated CI/CD via GitHub Actions (Recommended)

1. Go to your GitHub repository: **Settings > Secrets and variables > Actions**.
2. Click **New repository secret**.
3. Name: `AZURE_STATIC_WEB_APPS_API_TOKEN`
4. Value: Paste the output of `terraform output -raw api_key`.
5. Push to the `main` branch. The included [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml) will build and deploy the app automatically.

### Option B: Local CLI Deployment

To deploy directly from your local machine using the Static Web Apps CLI:

```bash
# 1. Build the production bundle
npm run build

# 2. Deploy to production using the exported token
TOKEN=$(cd terraform && terraform output -raw api_key)
npm run deploy:swa -- --deployment-token "$TOKEN"
```

---

## Teardown / Cleanup

To delete all created Azure resources:

```bash
cd terraform
terraform destroy -auto-approve
```
