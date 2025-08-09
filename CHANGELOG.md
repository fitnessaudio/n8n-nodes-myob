# Changelog

All notable changes to this project will be documented in this file.

## [0.4.0] - 2025-08-09

### 🚀 **MAJOR UPGRADE: SKU AUTO-LOOKUP!**
- **SKU-Based Items**: Changed from Item UID to SKU (Item Number) - much more user-friendly!
- **Automatic Lookup**: Node automatically looks up MYOB Item UID from SKU
- **Smart Description**: Uses MYOB item description if no override provided
- **Better UX**: Users can now use familiar SKU codes instead of obscure UIDs
- **Error Handling**: Clear error messages for SKU lookup failures

### Added
- **SKU Auto-Lookup**: Automatically converts SKU to MYOB Item UID via API call
- **Dynamic Description**: Fetches item description from MYOB when not overridden
- **SKU Validation**: Proper error handling for missing or invalid SKUs

### Changed
- **BREAKING**: Item UID field changed to SKU (Item Number) field
- **Field Name**: "Item UID" → "SKU (Item Number)"
- **Lookup Process**: Node now makes additional API calls to resolve SKUs to UIDs
- **Description Logic**: Now uses MYOB item description by default

### Enhanced
- **User Experience**: Much easier to use - just enter SKU codes
- **Documentation**: Updated examples and troubleshooting for SKU usage
- **Error Messages**: More helpful error messages for SKU-related issues

### Migration Notes
- **Existing Workflows**: Need to update Item UID fields to use SKU values instead
- **Field Mapping**: Replace `itemUid` with `sku` in your workflows
- **Testing**: Verify SKUs exist in MYOB before using

## [0.3.6] - 2025-08-09

### 🏆 **MYOB SALES ORDER CREATION NOW WORKING!**
- **OAuth2 Authentication**: ✅ Successfully working!
- **TaxCode Field Added**: Added optional Tax Code UID field for line items to fix MYOB validation
- **API Integration**: ✅ Successfully creating sales orders in MYOB!
- **Error Handling**: Fixed "TaxCode is required" validation error from MYOB API

### Added
- **Tax Code UID field** for line items (optional - uses item default if not specified)
- Proper TaxCode handling in API payload construction
- Documentation for TaxCode troubleshooting

### Fixed
- MYOB "TaxCode is required" validation error
- Line item structure now includes optional TaxCode when provided

### Documentation
- Added TaxCode field information to README
- Enhanced troubleshooting section with TaxCode guidance
- Updated example with Tax Code UID usage

### Status
- ✅ **OAuth2 Authentication Working**
- ✅ **MYOB API Integration Working**
- ✅ **Sales Order Creation Working**

## [0.3.5] - 2025-08-09

### 🔙 **AUTHENTICATION REVERTED + LOGO KEPT**
- **Authentication Method**: Reverted back to `header` (as requested - this was working)
- **MYOB Logo**: Kept the official MYOB logo for better visual identification
- **Removed**: Experimental POST method configuration that wasn't needed
- **Status**: Back to working OAuth2 configuration with visual improvements

### Changed
- Authentication method reverted from `body` back to `header`
- Removed `accessTokenRequestMethod` configuration

### Kept
- Official MYOB logo (7.3kB) for node branding
- All other working OAuth2 configuration

## [0.3.4] - 2025-08-09

### 🎨 **MYOB ICON ADDED + OAUTH2 CONTENT-TYPE FIX**
- **MYOB Logo**: Added official MYOB logo to node and credentials for better visual identification
- **OAuth2 Content-Type**: Changed authentication method to `body` to fix "Unsupported content type" error
- **Token Request Method**: Explicitly set POST method for token requests
- **Better UX**: Node now displays with proper MYOB branding

### Added
- Official MYOB logo (300x300px) for node and credentials
- Proper OAuth2 token request configuration

### Fixed
- "Unsupported content type: text/plain" error in OAuth2 token exchange
- Content-Type header issue with MYOB's OAuth2 endpoint

### Changed
- Authentication method back to `body` for proper form encoding
- Added explicit POST method configuration for token requests

## [0.3.3] - 2025-08-09

### 🔄 **OAUTH2 CONFIGURATION REVERT**
- **Reverted Token URL**: Back to using `/authorize` endpoint (as this was working in 0.3.0)
- **Kept Authentication Method**: Maintained `header` authentication
- **Focus on OAuth2 Only**: Removed experimental API key authentication
- **Content-Type Issue**: Investigating MYOB's specific OAuth2 requirements

### Changed
- Access Token URL reverted to `https://secure.myob.com/oauth2/v1/authorize`
- Removed alternative API key credential option to focus on OAuth2

### Note
- If you're experiencing content-type errors, this version reverts to the configuration that was showing the MYOB login page properly
- We're working on resolving the token exchange content-type issue

## [0.3.2] - 2025-08-09

### 🔧 **OAUTH2 AUTHENTICATION FIXES**
- **Fixed Token URL**: Corrected OAuth2 token endpoint from `/authorize` to `/token`
- **Fixed Authentication Method**: Changed from `body` to `header` authentication for better MYOB compatibility
- **Enhanced Troubleshooting**: Added specific guidance for "invalid_client" OAuth2 errors
- **Improved Documentation**: Better explanation of required OAuth2 fields and setup process

### Fixed
- OAuth2 "invalid_client" authentication errors
- Incorrect access token URL endpoint
- Authentication method for MYOB OAuth2 flow

### Documentation
- Added detailed OAuth2 troubleshooting section
- Clarified all required OAuth2 credential fields
- Enhanced error resolution guidance

## [0.3.1] - 2025-08-09

### 🎯 **SIMPLIFIED USER EXPERIENCE**
- **Automatic Base URL**: No longer need to manually enter base URL - it's automatically constructed from your OAuth2 credentials
- **One less field**: Removed Base URL parameter from node configuration
- **Easier setup**: Just add your customer UID and line items, the node handles the rest
- **Better user flow**: Base URL is built internally using the company file GUID from credentials

### Changed
- Removed `baseUrl` parameter from node interface
- Base URL now automatically constructed as `https://api.myob.com/accountright/{companyFileGuid}`
- Updated documentation to reflect simplified setup process
- Updated example workflow to match new structure

### Fixed
- Eliminated potential user errors from incorrect base URL format
- Reduced configuration complexity for end users

## [0.3.0] - 2025-08-09

### 🔐 **OAUTH2 AUTHENTICATION FIXED**
- **Proper OAuth2 implementation**: Fixed OAuth2 flow to match MYOB's specific requirements
- **Correct endpoints**: Updated to use proper MYOB OAuth2 URLs
- **Better credentials**: Added detailed descriptions and proper scopes
- **Cloud API support**: Now properly handles MYOB cloud authentication
- **Troubleshooting guide**: Added common issues and solutions to README

### Added
- Detailed OAuth2 setup instructions in README
- Troubleshooting section with common issues
- Better credential field descriptions
- Proper MYOB-specific OAuth2 scopes
- Instructions for getting UIDs from MYOB

### Fixed
- OAuth2 token URL (was `/token`, now `/authorize`)
- OAuth2 authentication flow for MYOB cloud
- API key header handling for cloud requests
- Credential configuration for proper MYOB integration

### Technical
- Updated OAuth2 credentials to extend N8N's oAuth2Api properly
- Improved API request function with better header handling
- Added proper content-type and accept headers
- Enhanced error handling for authentication issues

## [0.2.0] - 2025-08-09

### ✨ **SIMPLIFIED VERSION**
- **Removed complexity**: No more confusing operations and conditionals
- **One purpose**: Create sales orders in MYOB with multiple line items
- **Easier setup**: Just 4 required fields (Base URL, Customer UID, Line Items)
- **Better UX**: Clear field names and descriptions
- **Faster**: Streamlined execution without unnecessary operations
- **Focused**: Built specifically for sales order creation - does one thing well

### Changed
- Simplified node interface to focus only on sales order creation
- Removed get/getAll operations to reduce complexity
- Improved field names and descriptions for clarity
- Moved from 'transform' to 'output' category in N8N
- Updated package description to reflect simplified functionality

### Technical
- Reduced bundle size from 24.4kB to 16.4kB
- Removed unused conditional fields and operations
- Cleaner, more maintainable code structure

## [0.1.0] - 2025-08-09

### Added
- Initial release of MYOB AccountRight node for n8n
- Sales Order resource with three operations:
  - Create (Item): Create a new sales order with item lines
  - Get All: Retrieve all sales orders with optional pagination
  - Get by ID: Retrieve a specific sales order by UID
- Support for both local and cloud MYOB AccountRight instances
- Comprehensive field support for sales orders:
  - Customer UID (required)
  - Multiple line items with quantities and prices
  - Optional fields: dates, customer PO, freight, tax codes, locations
  - Description overrides, discounts (percentage and fixed amount)
- Dual authentication support:
  - Company File credentials (required for both local and cloud)
  - OAuth2 credentials (optional, for cloud API only)
- Robust error handling with "Continue on Fail" support
- Input validation for required fields
- Automatic date handling (defaults to current date)
- TypeScript implementation with full type safety
- Comprehensive documentation and examples

### Features
- Handles both tax-inclusive and tax-exclusive pricing
- Supports multiple inventory locations
- Line-level tax code overrides
- Freight and freight tax calculation
- Journal memo support for internal tracking
- Customer purchase order reference tracking

### Technical
- Built with TypeScript 5.0+
- Follows n8n community node standards
- Proper error handling and user feedback
- Extensible architecture for future enhancements
