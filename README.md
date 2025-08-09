# n8n-nodes-myob

A simple n8n community node that creates sales orders in MYOB Business API with support for multiple line items.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Resources](#resources)  

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

1. Go to **Settings > Community Nodes**.
2. Select **Install**.
3. Enter `n8n-nodes-myob` in **Enter npm package name**.
4. Agree to the [risks](https://docs.n8n.io/integrations/community-nodes/risks/) of using community nodes: select **I understand the risks of installing unverified code from a public source**.
5. Select **Install**.

After installing the node, you can use it like any other node in n8n.

## What it does

**One simple function**: Create sales orders in MYOB with multiple line items.

That's it! No complex operations, no confusing options. Just create sales orders.

## Credentials

This node supports both local and cloud MYOB AccountRight instances:

### MYOB Company File (Required)
Used for both local and cloud connections:
- **Username**: The username for the company file (default: Administrator)
- **Password**: The password for the company file

### MYOB OAuth2 (Required for Cloud)
For MYOB cloud instances, you need OAuth2 credentials:

#### Getting Your API Credentials
1. Register at the [MYOB Developer Portal](https://developer.myob.com/)
2. Create an app to get your API Key and Secret
3. Set your redirect URI (for N8N: `{n8n-url}/rest/oauth2-credential/callback`)

#### Configure in N8N
- **Client ID**: Enter your **MYOB API Key** from the developer portal here
- **Client Secret**: Enter your **MYOB API Secret** from the developer portal here
- **Company File Username**: Usually "Administrator" (default)
- **Company File Password**: Your MYOB company file password
- **Company File GUID**: Your specific company file identifier
- **Scope**: `sme-company-settings sme-sales sme-inventory` (space-separated)
- **Auth URL**: `https://secure.myob.com/oauth2/account/authorize`
- **Token URL**: `https://secure.myob.com/oauth2/v1/token`

#### OAuth2 Flow
When you save OAuth2 credentials in N8N:
1. N8N redirects you to MYOB's login page
2. You authorize the app
3. MYOB returns an access token
4. N8N stores the token and handles refresh automatically

## Compatibility

* n8n v0.87.0 or later

## Usage

### Quick Setup

1. **Add the MYOB Sales Order node** to your workflow
2. **Set up credentials**:
   - Company File (username/password)
   - OAuth2 (if using cloud)
3. **Configure the node**:
   - **Customer UID**: The customer's unique ID
   - **Line Items**: Add products with Item UID, quantity, and price
   
   The base URL is automatically constructed from your OAuth2 credentials.

### Required Fields
- ✅ **Customer UID**: Customer's GUID from MYOB
- ✅ **Line Items**:
  - SKU (Item Number) - automatically looks up MYOB Item UID
  - Quantity (how many)
  - Unit Price (price per item)

### Optional Fields
- **Tax Inclusive**: Whether prices include tax (default: true)
- **Customer PO Number**: Reference number
- **Tax Code UID**: Tax code for line items (uses item default if not specified)
- **Description**: Override item descriptions

### Example
```
Customer UID: 98765-def-43210
Line Items:
  - SKU: WIDGET-001, Quantity: 2, Price: 50.00, Tax Code UID: tax-code-123
  - SKU: GADGET-002, Quantity: 1, Price: 75.00
```

Result: Creates a sales order for $175 (2×$50 + 1×$75)

## Troubleshooting

### Common Issues

**OAuth2 Authentication Failed ("invalid_client" error)**
- **Check Redirect URI**: Must exactly match in MYOB Developer Portal: `{your-n8n-url}/rest/oauth2-credential/callback`
- **Verify API Credentials**: Double-check your API Key and Secret from MYOB Developer Portal
- **Check Company File GUID**: Ensure you have the correct GUID for your company file
- **Verify Scopes**: Must include `sme-company-settings sme-sales sme-inventory`
- **Company File Access**: Ensure the username/password can access the specific company file
- **API App Status**: Confirm your MYOB Developer app is active and approved

**OAuth2 Content-Type Error ("Unsupported content type" / "Bad Request")**
- This is a known issue with MYOB's OAuth2 implementation in n8n
- MYOB expects `application/x-www-form-urlencoded` but n8n may send `text/plain`
- **Alternative**: Use MYOB's direct API key authentication instead of OAuth2
- **Workaround**: Try re-saving your OAuth2 credentials multiple times
- **Contact**: Reach out if this persists - we may need to implement direct API key auth

**"Company file not found" Error**
- Double-check your company file GUID in the OAuth2 credentials
- Ensure the user has access to the specific company file

**"Item not found" Error**
- Verify SKUs exist in MYOB and are active
- Check that items are set up for sales
- SKU lookup uses the exact Item Number from MYOB (case-sensitive)

**"Customer not found" Error**
- Ensure Customer UID exists and is active in MYOB
- Customer must be set up as a sales customer

**"TaxCode is required" Error**
- Add a Tax Code UID to your line items, or
- Ensure your items in MYOB have default tax codes assigned
- Tax Code UIDs can be found in MYOB under Lists > Tax Codes

### Getting Data from MYOB
**For Customer UIDs:**
1. Use MYOB's API browser in the developer portal
2. Call the customers endpoint to get the UIDs
3. Check the URLs in MYOB - UIDs are often visible in the browser address bar

**For Item SKUs:**
1. Use the Item Number field from your MYOB items
2. Found under Inventory > Items in MYOB
3. Must match exactly (case-sensitive)

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
* [MYOB AccountRight API Documentation](https://developer.myob.com/api/accountright/v2/)

## License

[MIT](https://github.com/n8n-io/n8n-nodes-starter/blob/master/LICENSE.md)
