# Changelog

All notable changes to this project will be documented in this file.

## [0.5.12] - 2025-08-10

### 🔧 **FIXED MYOB API RESPONSE HANDLING**
- **returnFullResponse Implementation**: Added `returnFullResponse: true` to HTTP requests to get complete response data
- **Status Code Handling**: Now properly captures and processes HTTP status codes from MYOB API
- **Response Body Extraction**: Correctly extracts response body from n8n's full response format
- **Success/Failure Detection**: Uses HTTP status codes to determine if sales order creation was successful
- **Enhanced Response Data**: Now returns status codes, status messages, and response headers

### Fixed
- **Missing MYOB Response Data**: MYOB API responses are now properly captured and returned
- **Success Detection**: Uses HTTP status codes (200-299) to determine success instead of relying on response body
- **Empty Response Handling**: Properly handles cases where MYOB returns success with empty body (201 Created)
- **GET Request Compatibility**: SKU lookup requests still work correctly with body extraction

### Added
- **returnFullResponse Flag**: Added to all HTTP requests to get complete response information
- **Status Code Validation**: Checks HTTP status codes to determine request success
- **Response Headers**: Now captures and returns HTTP response headers from MYOB
- **Enhanced Output Format**: Returns statusCode, statusMessage, and response headers

### Enhanced
- **Response Processing Logic**: Smart handling of full response format vs direct response format
- **Debugging Information**: Enhanced logging shows status codes and response structure
- **Success Determination**: More reliable success detection using HTTP standards
- **API Compliance**: Better alignment with REST API response patterns

### Technical
- **Full Response Format**: `{body, headers, statusCode, statusMessage}` handling implemented
- **Method-Specific Processing**: GET requests return body only, POST requests return full response
- **Transport Layer Enhancement**: Smart response format detection and extraction
- **Status Code Ranges**: 200-299 range used for success determination

### Example New Output Format
```json
{
  "success": true,
  "statusCode": 201,
  "statusMessage": "Created",
  "myobResponse": {
    "UID": "12345678-1234-1234-1234-123456789012",
    "Number": "SO-000123",
    "Date": "2025-08-10T10:30:00Z"
  },
  "responseHeaders": {
    "content-type": "application/json",
    "x-myobapi-version": "v2"
  },
  "sentPayload": { /* original payload */ }
}
```

### Status
- ✅ **MYOB API Response Data Now Captured**
- ✅ **HTTP Status Code Based Success Detection**
- ✅ **Complete Response Information Available**
- ✅ **All Previous Features Maintained**

## [0.5.11] - 2025-08-10

### 🔍 **ENHANCED MYOB API RESPONSE DEBUGGING**
- **Comprehensive Request/Response Logging**: Added detailed logging throughout the API request/response cycle
- **Response Analysis**: Enhanced debugging to identify if MYOB API responses are being received but not passed through
- **Transport Layer Debugging**: Added extensive logging to the MyobApi.request.ts transport layer
- **Response Structure Analysis**: Detailed logging of response types, properties, and content
- **Sales Order Response Tracking**: Special logging for sales order creation responses to identify missing data

### Added
- **Detailed API Request Logging**: Logs method, URL, headers, and payload information
- **Response Type Analysis**: Logs response type, null/undefined checks, and object structure
- **Sales Order Specific Debugging**: Special analysis for sales order creation responses
- **Error Response Debugging**: Enhanced error logging with full error object details
- **Response Content Validation**: Checks for expected MYOB fields like UID and Number

### Enhanced
- **Troubleshooting Capabilities**: Much more detailed logging to identify response handling issues
- **n8n OAuth2 Wrapper Analysis**: Debugging to identify if the wrapper is filtering responses
- **Console Log Visibility**: All debugging info visible in n8n console logs
- **Response Comparison**: Analysis of what MYOB should return vs what's actually received

### Technical
- **Transport Layer Enhancement**: MyobApi.request.ts now includes comprehensive debugging
- **Response Processing Analysis**: Detailed logging of how n8n's OAuth2 wrapper handles responses
- **Error Handling Improvement**: Better error logging and analysis for API failures
- **Performance Monitoring**: Tracks request/response timing and data sizes

### Debug Output Examples
```
=== MYOB API REQUEST DEBUG ===
Method: POST
Full URL: https://api.myob.com/accountright/{guid}/Sale/Order/Item
Headers: [sanitized header info]
Body size: 1234 characters

=== SALES ORDER CREATION RESPONSE ANALYSIS ===
Expected MYOB response should contain UID, Number, Date, etc.
Actual response received: [response details]

=== MYOB API RESPONSE DEBUG ===
Response type: object
Response keys: ['UID', 'Number', 'Date', ...]
```

### Status
- ✅ **Comprehensive API Debugging Active**
- ✅ **Response Analysis Enhanced**
- ✅ **Error Tracking Improved**
- ✅ **All Previous Features Maintained**

## [0.5.10] - 2025-08-10

### 🖼️ **FIXED MYOB LOGO IN PACKAGE**
- **Fixed Logo Packaging**: MYOB logo PNG file now correctly included in npm package
- **Updated Build Process**: Build script now copies PNG files from nodes/ to dist/nodes/ directory
- **Resolved Icon Display**: Node icon will now display properly in n8n interface
- **Cross-Platform Build**: Updated build script to work with PowerShell for Windows compatibility

### Fixed
- **Missing Logo File**: PNG file not included in published package tar.gz archive
- **Build Process**: TypeScript compiler wasn't copying non-JS files
- **Icon Display**: Node showed generic icon instead of MYOB logo

### Added
- **Logo Copy Step**: Build script now includes PowerShell command to copy PNG files
- **Asset Pipeline**: Automated copying of image assets during build process

### Enhanced
- **Package Completeness**: All required assets now properly included in published package
- **Professional Appearance**: MYOB logo displays correctly in n8n node interface
- **Build Reliability**: More robust build process that handles all asset types

### Technical
- **Build Script Update**: Added `powershell "Copy-Item 'nodes/*.png' 'dist/nodes/' -ErrorAction SilentlyContinue"`
- **File Structure**: PNG files now properly copied to dist/nodes/ alongside compiled JS
- **Package Contents**: Both source (nodes/) and compiled (dist/) directories include logo file

### Status
- ✅ **MYOB Logo Displays Correctly**
- ✅ **Complete Asset Pipeline**
- ✅ **Professional Node Appearance**
- ✅ **All Previous Features Maintained**

## [0.5.9] - 2025-08-10

### 🛡️ **SKU FALLBACK RESILIENCE**
- **Smart SKU Fallback**: When a SKU lookup fails, node now automatically falls back to the Default SKU instead of stopping execution
- **Improved Error Resilience**: No more workflow failures due to incorrect or missing SKUs from Shopify
- **Seamless Processing**: Orders continue to process even when some products have incorrect SKUs
- **Enhanced Console Logging**: Clear logs show when SKU fallback occurs for better troubleshooting

### Fixed
- **SKU Lookup Failures**: Node no longer fails with "Item with SKU 'WRONG-SKU' not found in MYOB" errors
- **Workflow Continuity**: Orders process successfully even with SKU mismatches
- **Automatic Recovery**: Falls back to default SKU for both missing SKUs and API lookup errors

### Added
- **Automatic SKU Fallback**: When primary SKU fails, automatically uses Default SKU
- **Enhanced Logging**: Console logs show SKU fallback process for debugging
- **Multiple Fallback Scenarios**: Handles empty SKUs, missing SKUs, and lookup failures

### Enhanced
- **Robust Order Processing**: Workflows continue running despite SKU issues
- **Better Error Handling**: Graceful fallback instead of hard failures
- **Updated Field Description**: Default SKU field now mentions fallback functionality

### Console Log Examples
```
✅ Normal: SKU 'VALID-SKU' found and processed
⚠️ Fallback: SKU 'WRONG-SKU' not found in MYOB, falling back to default SKU 'DEFAULT-ITEM'
⚠️ Fallback: No SKU provided for item, using default SKU 'DEFAULT-ITEM'
⚠️ Fallback: Failed to lookup SKU 'NETWORK-ERROR': Connection timeout, falling back to default SKU 'DEFAULT-ITEM'
```

### Use Cases
- **Shopify Integration**: Handle product SKU mismatches without stopping order processing
- **Data Quality Issues**: Continue processing even with incomplete product data
- **API Reliability**: Graceful handling of network/API errors during SKU lookups
- **Development/Testing**: Use default SKU for testing without requiring exact SKU matches

### Technical
- **Fallback Logic**: Automatically tries Default SKU when primary SKU fails
- **Error Classification**: Distinguishes between SKU not found vs API errors
- **Multiple Recovery Paths**: Handles various failure scenarios gracefully
- **Preserved Functionality**: All existing features maintained with added resilience

### Status
- ✅ **Automatic SKU Fallback Active**
- ✅ **Improved Workflow Resilience**
- ✅ **Enhanced Error Recovery**
- ✅ **All Previous Features Maintained**

## [0.5.8] - 2025-08-10

### 📈 **FIXED DISCOUNT CALCULATION + SHIPPING DESCRIPTION**
- **Fixed Discount Percentage Calculation**: Now calculates discount percentage based on total line value (unit price × quantity) instead of just unit price
- **Added Shipping Description Field**: New optional field to set custom description for shipping line items
- **Correct Multi-Quantity Discounts**: Fixes issue where items with quantity > 1 had incorrect discount percentages
- **Enhanced Shipping Control**: Can now override shipping item description or use MYOB defaults

### Fixed
- **Discount Calculation**: For items with quantity > 1, discount percentage now calculated correctly
  - Old: `(discountAmount / unitPrice) * 100` 
  - New: `(discountAmount / (unitPrice × quantity)) * 100`
- **Example**: $4.80 discount on 2×$24.00 items now shows 10% instead of 20%

### Added
- **Shipping Description Field**: Optional field to customize shipping line item description
- **Enhanced Debug Logging**: Shows unit price, quantity, and total line value in discount calculations

### Enhanced
- **Accurate Discount Percentages**: Multi-quantity line items now show correct discount percentages in MYOB
- **Better Shipping Control**: Choose between custom shipping description or MYOB item defaults
- **Improved Calculations**: More detailed logging shows the complete discount calculation process

### Example Fixed Calculation
```
Shopify Data:
- Item: Windscreens, Price: $24.00, Quantity: 2, Discount: $4.80
- Total Line Value: $48.00

Old Calculation: 4.80 / 24.00 * 100 = 20% ❌
New Calculation: 4.80 / 48.00 * 100 = 10% ✅

Console Log: "Converted discount amount 4.80 to percentage: 10% (unit price: 24, quantity: 2, total line value: 48)"
```

### Technical
- **Proper Line Total Calculation**: Discount percentage based on (unit price × quantity)
- **Shipping Description Parameter**: New `shippingDescription` field added to node interface
- **Enhanced Debugging**: More comprehensive logging for discount calculation troubleshooting

### Status
- ✅ **Correct Multi-Quantity Discount Percentages**
- ✅ **Custom Shipping Descriptions Available**
- ✅ **Enhanced Discount Calculation Logging**
- ✅ **All Previous Features Maintained**

## [0.5.7] - 2025-08-10

### 🎯 **CORRECT DISCOUNT FIELD - BUSINESS API V2 COMPLIANT**
- **Fixed Discount Field**: Changed from discount amount to `DiscountPercent` to match MYOB Business API v2 specification
- **Automatic Percentage Conversion**: Now converts Shopify discount amounts to percentages automatically
- **Proper API Compliance**: Uses correct field structure from MYOB Business API v2 documentation
- **Smart Calculation**: Calculates discount percentage as (discountAmount / unitPrice) * 100
- **Enhanced Logging**: Added conversion logging to show discount amount → percentage calculation

### Fixed
- Discount field now uses `DiscountPercent` (percentage) instead of flat discount amount
- Proper API compliance with MYOB Business API v2 Sale/Order/Item endpoint
- Automatic conversion from Shopify discount amounts to MYOB discount percentages

### Added
- Automatic discount amount to percentage conversion
- Enhanced logging showing discount conversion process
- Precision rounding to 2 decimal places for discount percentages
- Safety checks to prevent division by zero

### Enhanced
- **Shopify Compatibility**: Seamlessly converts Shopify flat discount amounts to MYOB percentages
- **API Accuracy**: Now follows exact MYOB Business API v2 field specifications
- **Better Debugging**: Logs show both original amount and calculated percentage

### Example Conversion
```
Shopify: $31.35 discount on $97.00 item
MYOB: 32.32% discount (31.35 / 97.00 * 100)

Console Log: "Converted discount amount 31.35 to percentage: 32.32% (price: 97.00)"
```

### Technical
- Uses MYOB Business API v2 Sale/Order/Item field structure
- Prevents errors by checking unitPrice > 0 before conversion
- Rounds percentages to 2 decimal places for precision
- Maintains backward compatibility with existing workflows

### Status
- ✅ **MYOB Business API v2 Compliant Discount Field**
- ✅ **Automatic Amount-to-Percentage Conversion**
- ✅ **Enhanced Conversion Logging**
- ✅ **All Previous Features Maintained**

## [0.5.6] - 2025-08-10

### 🔧 **DISCOUNT FIELD FIX + PAYLOAD VISIBILITY**
- **Fixed Discount Field Case**: Changed discount field from `"Discount"` to `"discount"` (lowercase) to match MYOB EXO API documentation
- **Added Payload to Output**: Node output now includes the exact payload sent to MYOB for debugging purposes
- **Enhanced Output Structure**: Output now shows both MYOB response and sent payload for complete transparency
- **Better Debugging**: Can now see exactly what data is being sent to MYOB API

### Fixed
- Discount field case sensitivity (`"discount"` instead of `"Discount"`) based on MYOB EXO API docs
- Output structure now includes complete payload information

### Added
- `sentPayload` field in node output showing exact data sent to MYOB
- `myobResponse` field containing the API response from MYOB
- Enhanced output structure for better debugging and transparency

### Enhanced
- **Complete Visibility**: See both what was sent and what was received
- **Better Troubleshooting**: Full payload visibility helps identify API issues
- **API Compliance**: Lowercase field names matching MYOB EXO documentation

### Output Structure Example
```json
{
  "success": true,
  "myobResponse": { /* MYOB API Response */ },
  "sentPayload": {
    "OrderType": "Item",
    "Lines": [
      {
        "discount": 31.35,
        "UnitPrice": 97.00,
        /* ... other fields */
      }
    ]
  }
}
```

### Status
- ✅ **Lowercase Discount Field (EXO API Compliant)**
- ✅ **Complete Payload Visibility in Output**
- ✅ **Enhanced Debugging Capabilities**
- ✅ **All Previous Features Maintained**

## [0.5.5] - 2025-08-10

### 🔍 **DISCOUNT DEBUGGING ENHANCED**
- **Enhanced Discount Debugging**: Added detailed console logs for discount calculation process
- **Improved Discount Tracing**: Better visibility into Shopify discount data processing
- **Debug Logging**: Console logs now show:
  - Item processing details (SKU, price)
  - Discount allocations array content
  - Total discount fallback values
  - Individual discount allocation amounts
  - Final calculated discount amount

### Added
- Comprehensive discount debugging with console.log statements
- Step-by-step discount calculation visibility
- Enhanced troubleshooting capabilities for discount issues

### Enhanced
- **Discount Calculation Transparency**: Full visibility into discount processing logic
- **Better Troubleshooting**: Console logs help identify where discount calculations may fail
- **Debug Information**: All discount-related data logged for analysis

### Technical
- Added console.log statements throughout discount calculation process
- Improved debugging workflow for discount-related issues
- Better error tracing for Shopify discount integration

### Debug Output Example
```
Processing item: LED-FLEX-3K Price: 97.00
Discount allocations: [{"amount": "31.35"}]
Total discount: undefined
Adding discount allocation: 31.35
Final discount amount: 31.35
```

### Status
- ✅ **Enhanced Discount Debugging Active**
- ✅ **Console Logging for Troubleshooting**
- ✅ **All Previous Features Maintained**

## [0.5.4] - 2025-08-10

### 🔧 **DISCOUNT FIELD CORRECTION**
- **Fixed MYOB Discount Field**: Corrected discount field name from `DiscountAmount` to `Discount` for proper MYOB API compatibility
- **Verified Output**: Confirmed JSON output display in n8n interface shows complete MYOB API response
- **Discount Integration**: Now properly applies Shopify discount amounts using correct MYOB field name

### Fixed
- MYOB API discount field name (`Discount` instead of `DiscountAmount`)
- Discount amounts now properly applied to MYOB sales order line items
- JSON output correctly displays MYOB API response in n8n interface

### Technical
- Corrected field mapping for MYOB Business API discount structure
- Maintained all existing discount calculation logic
- Output handling confirmed working for JSON display

### Status
- ✅ **Correct MYOB Discount Field Name**
- ✅ **Shopify Discounts Applied to MYOB**
- ✅ **JSON Output Display Working**
- ✅ **All Previous Features Maintained**

## [0.5.3] - 2025-08-10

### 💰 **SHOPIFY DISCOUNT SUPPORT & IMPROVEMENTS**
- **Shopify Discount Integration**: Automatically extracts and applies Shopify discount amounts to MYOB line items
- **Smart Discount Detection**: Supports both `discount_allocations` array and `total_discount` fallback
- **MYOB Discount Field**: Adds `DiscountAmount` field to line items when discounts are present
- **Clean Shipping Items**: Shipping line items no longer include blank descriptions (uses MYOB inventory default)
- **Enhanced JSON Output**: Node now returns the complete MYOB API response as JSON for better integration

### Added
- **Discount Amount Processing**: Calculates total discount per line item from Shopify data
- **DiscountAmount Field**: Adds discount amounts directly to MYOB sales order line items
- **Shopify discount_allocations Support**: Handles multiple discount applications per line item
- **Complete API Response**: Returns full MYOB API response for downstream processing

### Enhanced
- **Discount Calculation**: Automatically sums all discount allocations per line item
- **Fallback Logic**: Uses `total_discount` if `discount_allocations` not available
- **Clean Integration**: Shipping items use MYOB inventory descriptions (no blank overrides)
- **Better Output**: Full JSON response from MYOB API for better workflow integration

### Technical
- **Discount Processing**: Robust parsing of Shopify discount structures
- **Error Handling**: Graceful handling of missing discount data
- **API Response**: Complete MYOB response preserved in node output
- **Performance**: Efficient discount calculation with reduce operations

### Example Discount Processing
```
Shopify Line Item:
- Price: $33.00
- Discount Allocations: [{"amount": "31.35"}]
- Result: MYOB Line Item with $31.35 discount

Multiple Discounts:
- discount_allocations: [{"amount": "10.00"}, {"amount": "5.50"}]
- Result: Total discount of $15.50 applied to MYOB
```

### Status
- ✅ **Shopify Discount Support Working**
- ✅ **MYOB Discount Field Integration** 
- ✅ **Clean Shipping Line Items**
- ✅ **Complete JSON Output Response**
- ✅ **Multiple Discount Types Supported**

## [0.5.2] - 2025-08-10

### 🛠️ **FINAL BUG FIXES & API CORRECTION**
- **Fixed MYOB API Field**: Corrected Purchase Order field from `CustomerPO` and `PurchaseOrderNumber` to the correct `CustomerPurchaseOrderNumber`
- **Removed Duplicate Field**: Eliminated redundant "Customer PO Number" field - now only one "Purchase Order Number" field
- **Enhanced Execution Control**: Improved handling of multiple input items to prevent duplicate sales order creation
- **Single Sales Order Guarantee**: Node now processes all input data as a single sales order execution

### Fixed
- Correct MYOB API field mapping for Purchase Order Number (`CustomerPurchaseOrderNumber`)
- Removed duplicate purchase order fields causing confusion
- Multiple sales order creation issue (final fix)
- Input data processing to handle single execution properly

### Changed
- **Purchase Order Field**: Now uses correct MYOB API field `CustomerPurchaseOrderNumber`
- **Cleaner UI**: Removed redundant "Customer PO Number" field
- **Better Documentation**: Field descriptions updated for clarity

### Technical
- Improved input data validation and processing
- Enhanced error handling for edge cases
- Better execution flow control

### Status
- ✅ **Correct Purchase Order Field Working**
- ✅ **Single Sales Order Creation Guaranteed** 
- ✅ **Hash Symbol Auto-Removal Working**
- ✅ **Multiple Line Items Per Order Working**
- ✅ **Clean UI with Single Purchase Order Field**

## [0.5.1] - 2025-08-09

### 🐛 **CRITICAL BUG FIXES**
- **Fixed Multiple Sales Orders**: Node was creating 3 sales orders instead of 1 - now creates exactly one per execution
- **Fixed Purchase Order Number**: Purchase Order Number was missing from MYOB payload - now properly included
- **Added # Symbol Removal**: Automatically removes # symbol from Purchase Order Number (e.g., "#831811-HAS" becomes "831811-HAS")
- **Fixed Execution Loop**: Removed unnecessary loop that was processing each line item as separate sales order

### Fixed
- Multiple sales order creation issue (was creating one per line item)
- Purchase Order Number field not being sent to MYOB API
- Hash (#) symbol handling in Purchase Order Number
- Node execution structure to process single sales order with multiple line items

### Technical
- Simplified execution to process only first input item
- Fixed payload construction to include cleanedPurchaseOrderNumber
- Improved field processing and validation
- Better error handling for edge cases

### Status
- ✅ **Single Sales Order Creation Working**
- ✅ **Purchase Order Number Field Working**
- ✅ **Hash Symbol Auto-Removal Working**
- ✅ **Multiple Line Items Per Order Working**

## [0.5.0] - 2025-08-09

### 🚀 **MAJOR FEATURE UPDATE: SHIPPING & ORDER ENHANCEMENTS!**
- **Shipping Address Support**: Added 5 separate shipping address line fields that combine with newlines
- **Automatic Shipping Line Item**: Added shipping SKU and price fields - automatically added as last line item
- **Enhanced Order Fields**: Added Journal Memo, Comment, and Purchase Order Number fields
- **Complete Order Management**: Full support for comprehensive sales order creation
- **Shopify Shipping Ready**: Perfect for processing Shopify orders with shipping costs and addresses

### Added
- **Shipping Address Lines 1-5**: Separate fields that automatically combine with proper newlines (`\r\n`)
- **Shipping SKU Field**: Automatically looks up shipping item (e.g., P&P1, P&P2) and adds as line item
- **Shipping Price Field**: Sets unit price for shipping line item
- **Journal Memo Field**: Internal memo for journal entries
- **Comment Field**: Order comments and notes
- **Purchase Order Number Field**: Additional PO reference field

### Enhanced
- **Smart Shipping Address Building**: Follows your existing logic - only adds non-empty lines with newlines
- **Automatic Shipping Line Item**: If shipping SKU provided, automatically adds as last line item with quantity 1
- **Tax Code Support**: Shipping line items use default tax code UID when provided
- **Complete Order Data**: Supports all essential sales order fields for full integration

### Technical
- **Newline Handling**: Uses proper `\r\n` newline characters for MYOB compatibility
- **SKU Lookup**: Shipping SKUs go through same validation and lookup process as regular items
- **Error Handling**: Clear error messages if shipping SKU not found in MYOB
- **Optional Fields**: All new fields are optional - won't break existing workflows

### Use Cases
- ✅ **Shopify Orders**: Complete order processing including shipping addresses and costs
- ✅ **E-commerce Integration**: Handle shipping, taxes, and order metadata seamlessly
- ✅ **Custom Shipping Items**: Use your existing P&P1, P&P2 SKUs for shipping costs
- ✅ **Complete Order Tracking**: Journal memos, comments, and PO numbers for full audit trail
- ✅ **Address Management**: Multi-line shipping addresses properly formatted

### Field Mapping Example
```
Shipping Line 1: "123 Main Street"
Shipping Line 2: "Unit 5"
Shipping Line 3: "Business Park"
Shipping Line 4: "Sydney NSW 2000"
Shipping Line 5: "Australia"

Result: "123 Main Street\r\nUnit 5\r\nBusiness Park\r\nSydney NSW 2000\r\nAustralia"

Shipping SKU: "P&P1"
Shipping Price: 15.00
→ Adds line item with P&P1 at $15.00 (quantity 1)
```

## [0.4.4] - 2025-08-09

### 🔧 **DATA PARSING FIX**
- **Fixed JSON Parsing Error**: Fixed "Unexpected token 'o', "[object Obj"..." error when receiving already-parsed data
- **Smart Data Detection**: Now handles both JSON strings and already-parsed JavaScript objects/arrays
- **N8N Expression Support**: Works correctly with n8n expressions that return objects (like `{{ $json.line_items }}`)
- **Backward Compatible**: Still supports JSON string input for manual data entry

### Fixed
- JSON parsing error when data comes from n8n expressions as objects instead of strings
- Support for direct object/array input from Shopify webhooks and other data sources
- Improved error handling for different data input formats

### Enhanced
- **Flexible Input**: Automatically detects and handles string, array, or object input data
- **Error Prevention**: Better validation and error messages for invalid data formats
- **Shopify Ready**: Works seamlessly with `{{ $json.line_items }}` expressions

### Technical
- Added type checking for input data (string vs object vs array)
- Improved data parsing logic to handle n8n's dynamic data types
- Enhanced error reporting for debugging data format issues

## [0.4.3] - 2025-08-09

### 🔧 **SHOPIFY EMPTY SKU FIX**
- **Empty SKU Handling**: Fixed handling of empty SKU strings (`sku: ""`) from Shopify
- **Enhanced Data Extraction**: Improved parsing of Shopify line items with better field mapping
- **Variant Title Support**: Now includes variant_title in item description (e.g., "FlexLED 24v - 3000k")
- **Robust Price Parsing**: Better handling of string-to-number conversion for prices
- **Current Quantity Priority**: Uses `current_quantity` when available, falls back to `quantity`

### Fixed
- Empty SKU string detection (now properly uses default SKU for `sku: ""`)
- Price parsing from string values in Shopify data
- Description building with variant titles

### Enhanced
- **Smart SKU Detection**: Handles both missing SKU properties and empty SKU strings
- **Better Descriptions**: Combines title + variant_title for clearer line item descriptions
- **Shopify Field Priority**: Uses the most appropriate Shopify fields for each MYOB field

### Shopify Data Processing
```
Shopify Item 1: {"sku": "LED-FLEX-3K", "quantity": 1, "price": "97.00", "title": "FlexLED", "variant_title": "3000k"}
→ SKU: "LED-FLEX-3K", Quantity: 1, Price: 97.00, Description: "FlexLED - 3000k"

Shopify Item 2: {"sku": "", "quantity": 1, "price": "97.00", "title": "FlexLED", "variant_title": "4000k"}
→ SKU: "DEFAULT-ITEM", Quantity: 1, Price: 97.00, Description: "FlexLED - 4000k"
```

## [0.4.2] - 2025-08-09

### 🛒 **SHOPIFY DIRECT INTEGRATION!**
- **Default SKU Support**: Added default SKU field for items without SKUs
- **Default Tax Code**: Added default Tax Code UID applied to all line items
- **Shopify Data Structure**: Direct support for Shopify webhook line_items array format
- **Smart Data Extraction**: Automatically extracts sku, quantity, price, title from Shopify data
- **Fallback Values**: Uses sensible defaults for missing data (default SKU, quantity 1, price 0)
- **Seamless Integration**: Just paste {{ $json.line_items }} directly from Shopify webhook

### Added
- **Default SKU Field**: Fallback SKU when line items have empty/missing SKU
- **Default Tax Code UID Field**: Applied to all line items automatically
- **Shopify Data Parser**: Understands Shopify line_items structure natively
- **Smart Field Mapping**: Maps title→description, current_quantity→quantity automatically

### Enhanced
- **Zero Configuration**: Works directly with Shopify webhook data out of the box
- **Error Prevention**: Default values prevent failures from missing data
- **Flexible Data Sources**: Works with Shopify, WooCommerce, or any e-commerce platform

### Shopify Integration Example
```
Input Method: JSON Array
Default SKU: MISC-ITEM
Default Tax Code UID: your-gst-tax-code-uid
Line Items Data: {{ $json.line_items }}
```

## [0.4.1] - 2025-08-09

### 🔄 **DYNAMIC LINE ITEMS SUPPORT!**
- **JSON Array Input**: Added JSON input method for dynamic line items of varying sizes
- **Flexible Input Methods**: Choose between UI Form or JSON Array based on your use case
- **Perfect for Integration**: Handle Shopify orders, CSV imports, API data with varying item counts
- **n8n Expression Support**: Full compatibility with n8n expressions and data mapping
- **Comprehensive Documentation**: Added examples and use cases for dynamic data handling

### Added
- **Input Method Selection**: Toggle between "UI Form" and "JSON Array" input methods
- **JSON Line Items Field**: Accept line items as properly formatted JSON array
- **Dynamic Processing**: Handle any number of line items from external data sources
- **Expression Examples**: Provided n8n expression examples for common use cases

### Enhanced
- **User Experience**: Users can now choose the input method that works best for their workflow
- **Integration Flexibility**: Perfect for e-commerce, ERP, and bulk processing scenarios
- **Documentation**: Comprehensive examples for Shopify, CSV, and API integrations

### Use Cases
- ✅ **Shopify Integration**: Process orders with varying product counts
- ✅ **CSV/Excel Processing**: Bulk import sales orders from spreadsheets
- ✅ **API Integration**: Handle dynamic data from external systems
- ✅ **Database Queries**: Create orders from database results with variable line items

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
