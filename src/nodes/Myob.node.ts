import {
  INodeType, INodeTypeDescription, IExecuteFunctions, INodeExecutionData,
  NodeConnectionType,
} from 'n8n-workflow';
import { myobRequest } from '../transport/MyobApi.request';

export class Myob implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'MYOB Sales Order',
		name: 'myob',
		icon: 'file:myob.png',
		group: ['output'],
		version: 1,
        inputs: [NodeConnectionType.Main],
        outputs: [NodeConnectionType.Main],
		description: 'Create sales orders in MYOB Business API',
		defaults: { name: 'MYOB Sales Order' },
		credentials: [
			{ name: 'myobOAuth2Api', required: true },
		],
		properties: [
			{
				displayName: 'Customer UID',
				name: 'customerUid',
				type: 'string',
				default: '',
				required: true,
				description: 'The unique ID of the customer (GUID format)',
			},
			{
				displayName: 'Tax Inclusive',
				name: 'isTaxInclusive',
				type: 'boolean',
				default: true,
				description: 'Whether prices include tax',
			},
			{
				displayName: 'Journal Memo',
				name: 'journalMemo',
				type: 'string',
				default: '',
				description: 'Internal memo for the journal entry (optional)',
			},
			{
				displayName: 'Comment',
				name: 'comment',
				type: 'string',
				default: '',
				description: 'Comment for the sales order (optional)',
			},
			{
				displayName: 'Purchase Order Number',
				name: 'purchaseOrderNumber',
				type: 'string',
				default: '',
				description: 'Purchase order reference number (optional)',
			},
			{
				displayName: 'Shipping Address Line 1',
				name: 'shippingLine1',
				type: 'string',
				default: '',
				description: 'First line of shipping address (optional)',
			},
			{
				displayName: 'Shipping Address Line 2',
				name: 'shippingLine2',
				type: 'string',
				default: '',
				description: 'Second line of shipping address (optional)',
			},
			{
				displayName: 'Shipping Address Line 3',
				name: 'shippingLine3',
				type: 'string',
				default: '',
				description: 'Third line of shipping address (optional)',
			},
			{
				displayName: 'Shipping Address Line 4',
				name: 'shippingLine4',
				type: 'string',
				default: '',
				description: 'Fourth line of shipping address (optional)',
			},
			{
				displayName: 'Shipping Address Line 5',
				name: 'shippingLine5',
				type: 'string',
				default: '',
				description: 'Fifth line of shipping address (optional)',
			},
			{
				displayName: 'Shipping SKU',
				name: 'shippingSku',
				type: 'string',
				default: '',
				description: 'SKU for shipping line item (e.g., P&P1, P&P2) - will be added as last line item if provided',
			},
			{
				displayName: 'Shipping Price',
				name: 'shippingPrice',
				type: 'number',
				default: 0,
				description: 'Price for shipping line item - will be added as last line item if Shipping SKU is provided',
			},
			{
				displayName: 'Shipping Description',
				name: 'shippingDescription',
				type: 'string',
				default: '',
				description: 'Description for shipping line item (optional - uses MYOB item default if not provided)',
			},
			{
				displayName: 'Input Method',
				name: 'inputMethod',
				type: 'options',
				default: 'ui',
				description: 'How to specify the line items',
				options: [
					{ name: 'UI Form', value: 'ui', description: 'Add line items using the form below' },
					{ name: 'JSON Array', value: 'json', description: 'Provide line items as a JSON array (for dynamic data)' },
				],
			},
			{
				displayName: 'Line Items',
				name: 'lineItems',
				type: 'fixedCollection',
				typeOptions: { multipleValues: true },
				default: [{}],
				required: true,
				displayOptions: {
					show: { inputMethod: ['ui'] }
				},
				description: 'Line items for the sales order',
				options: [
					{
						name: 'item',
						displayName: 'Line Item',
						values: [
							{ displayName: 'SKU (Item Number)', name: 'sku', type: 'string', default: '', required: true, description: 'The SKU/Item Number - will automatically lookup the MYOB Item UID' },
							{ displayName: 'Quantity', name: 'quantity', type: 'number', default: 1, required: true },
							{ displayName: 'Unit Price', name: 'unitPrice', type: 'number', default: 0, required: true },
							{ displayName: 'Tax Code UID', name: 'taxCodeUid', type: 'string', default: '', description: 'The unique ID of the tax code (optional - uses item default if not specified)' },
							{ displayName: 'Description', name: 'description', type: 'string', default: '', description: 'Optional description override (optional - uses item default if not specified)' },
						],
					},
				],
			},
			{
				displayName: 'Default SKU',
				name: 'defaultSku',
				type: 'string',
				default: 'DEFAULT-ITEM',
				required: true,
				displayOptions: {
					show: { inputMethod: ['json'] }
				},
				description: 'Default SKU to use when line items have no SKU, empty SKU, or when SKU lookup fails',
			},
			{
				displayName: 'Default Tax Code UID',
				name: 'defaultTaxCodeUid',
				type: 'string',
				default: '',
				displayOptions: {
					show: { inputMethod: ['json'] }
				},
				description: 'Default Tax Code UID to use for all line items (optional - uses item default if not specified)',
			},
			{
				displayName: 'Line Items Data',
				name: 'lineItemsData',
				type: 'json',
				default: '[]',
				required: true,
				displayOptions: {
					show: { inputMethod: ['json'] }
				},
				description: 'Raw line items array from Shopify webhook or other source. Will extract sku, quantity, price automatically',
				placeholder: 'Paste Shopify line_items array or use expression like {{ $json.line_items }}',
			},
		],
	};

	async execute(this: IExecuteFunctions) {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];

        // Process all input data as a single sales order
        if (items.length === 0) {
            throw new Error('No input data received');
        }
        
        // Use the first item for parameters, ignore additional items to prevent multiple executions
        const i = 0;
        try {
            // Get credentials to build the base URL
            const credentials = await this.getCredentials('myobOAuth2Api');
            const baseUrl = `https://api.myob.com/accountright/${credentials.companyFileGuid}`;
            
            const customerUid = this.getNodeParameter('customerUid', i) as string;
            const isTaxInclusive = this.getNodeParameter('isTaxInclusive', i) as boolean;
            const journalMemo = this.getNodeParameter('journalMemo', i) as string;
            const comment = this.getNodeParameter('comment', i) as string;
            const purchaseOrderNumber = this.getNodeParameter('purchaseOrderNumber', i) as string;
            const shippingLine1 = this.getNodeParameter('shippingLine1', i) as string;
            const shippingLine2 = this.getNodeParameter('shippingLine2', i) as string;
            const shippingLine3 = this.getNodeParameter('shippingLine3', i) as string;
            const shippingLine4 = this.getNodeParameter('shippingLine4', i) as string;
            const shippingLine5 = this.getNodeParameter('shippingLine5', i) as string;
            const shippingSku = this.getNodeParameter('shippingSku', i) as string;
            const shippingPrice = this.getNodeParameter('shippingPrice', i) as number;
            const shippingDescription = this.getNodeParameter('shippingDescription', i) as string;
            const inputMethod = this.getNodeParameter('inputMethod', i) as string;
            
            // Clean up purchase order number by removing # symbol
            const cleanedPurchaseOrderNumber = purchaseOrderNumber ? purchaseOrderNumber.replace(/^#/, '').trim() : '';
                
                // Validate required fields
                if (!customerUid) {
                    throw new Error('Customer UID is required');
                }

                // Get line items based on input method
                let lineItemsArray: any[] = [];
                let defaultSku = '';
                let defaultTaxCodeUid = '';
                
                if (inputMethod === 'json') {
                    const rawLineItemsData = this.getNodeParameter('lineItemsData', i);
                    defaultSku = this.getNodeParameter('defaultSku', i) as string;
                    defaultTaxCodeUid = this.getNodeParameter('defaultTaxCodeUid', i) as string;
                    
                    try {
                        let rawData;
                        
                        // Handle both string (JSON) and already-parsed object/array data
                        if (typeof rawLineItemsData === 'string') {
                            rawData = JSON.parse(rawLineItemsData);
                        } else if (Array.isArray(rawLineItemsData)) {
                            rawData = rawLineItemsData;
                        } else if (typeof rawLineItemsData === 'object' && rawLineItemsData !== null) {
                            // If it's an object but not an array, it might be wrapped
                            rawData = rawLineItemsData;
                        } else {
                            throw new Error('Line Items Data must be a JSON string or array');
                        }
                        
                        if (!Array.isArray(rawData)) {
                            throw new Error('Line Items Data must be an array');
                        }
                        
                        // Transform Shopify/raw data to standardized format
                        lineItemsArray = rawData.map((shopifyItem: any) => {
                            // Handle empty SKU strings specifically (Shopify can have sku: "")
                            const itemSku = (shopifyItem.sku && shopifyItem.sku.trim() !== '') ? shopifyItem.sku.trim() : defaultSku;
                            
                            // Use current_quantity if available, fallback to quantity, then to 1
                            const itemQuantity = shopifyItem.current_quantity || shopifyItem.quantity || 1;
                            
                            // Parse price from string to number
                            const itemPrice = parseFloat(shopifyItem.price || shopifyItem.unit_price || '0');
                            
                            // Calculate discount amount from Shopify discount_allocations
                            let discountAmount = 0;
                            console.log('Processing item:', shopifyItem.sku || 'No SKU', 'Price:', shopifyItem.price);
                            console.log('Discount allocations:', shopifyItem.discount_allocations);
                            console.log('Total discount:', shopifyItem.total_discount);
                            
                            if (shopifyItem.discount_allocations && Array.isArray(shopifyItem.discount_allocations)) {
                                discountAmount = shopifyItem.discount_allocations.reduce((total: number, discount: any) => {
                                    const discountValue = parseFloat(discount.amount || '0');
                                    console.log('Adding discount allocation:', discountValue);
                                    return total + discountValue;
                                }, 0);
                            } else if (shopifyItem.total_discount) {
                                // Fallback to total_discount if discount_allocations not available
                                discountAmount = parseFloat(shopifyItem.total_discount || '0');
                                console.log('Using total_discount:', discountAmount);
                            }
                            
                            console.log('Final discount amount:', discountAmount);
                            
                            // Build description from available fields
                            let itemDescription = shopifyItem.title || shopifyItem.name || '';
                            if (shopifyItem.variant_title && shopifyItem.variant_title.trim() !== '') {
                                itemDescription = `${itemDescription} - ${shopifyItem.variant_title}`.trim();
                            }
                            
                            return {
                                sku: itemSku,
                                quantity: itemQuantity,
                                unitPrice: itemPrice,
                                discountAmount: discountAmount,
                                taxCodeUid: defaultTaxCodeUid,
                                description: itemDescription || shopifyItem.description || ''
                            };
                        });
                        
                    } catch (error: any) {
                        throw new Error(`Invalid Line Items Data: ${error.message}`);
                    }
                } else {
                    const lineItemsData = this.getNodeParameter('lineItems', i) as any;
                    if (!lineItemsData || !lineItemsData.item || lineItemsData.item.length === 0) {
                        throw new Error('At least one line item is required');
                    }
                    lineItemsArray = lineItemsData.item;
                }

                if (lineItemsArray.length === 0) {
                    throw new Error('At least one line item is required');
                }

                // Build lines array with SKU lookup
                const lines = [];
                for (const item of lineItemsArray) {
                    let itemUid = '';
                    let itemDescription = item.description || '';
                    
                    // Look up Item UID from SKU with fallback to default SKU
                    let actualSku = item.sku;
                    if (item.sku && item.sku.trim() !== '') {
                        try {
                            const skuEncoded = encodeURIComponent(`'${item.sku}'`);
                            const lookupUrl = `/Inventory/Item?$filter=Number eq ${skuEncoded}`;
                            const lookupResponse: any = await myobRequest.call(this, 'GET', lookupUrl, {}, {}, baseUrl);
                            
                            if (lookupResponse && lookupResponse.Items && lookupResponse.Items.length > 0) {
                                itemUid = lookupResponse.Items[0].UID;
                                // Use MYOB description if no override provided
                                if (!itemDescription || itemDescription.trim() === '') {
                                    itemDescription = lookupResponse.Items[0].Description || '';
                                }
                            } else {
                                // SKU not found, fallback to default SKU
                                console.log(`SKU '${item.sku}' not found in MYOB, falling back to default SKU '${defaultSku}'`);
                                actualSku = defaultSku;
                                
                                if (defaultSku && defaultSku.trim() !== '') {
                                    const defaultSkuEncoded = encodeURIComponent(`'${defaultSku}'`);
                                    const defaultLookupUrl = `/Inventory/Item?$filter=Number eq ${defaultSkuEncoded}`;
                                    const defaultLookupResponse: any = await myobRequest.call(this, 'GET', defaultLookupUrl, {}, {}, baseUrl);
                                    
                                    if (defaultLookupResponse && defaultLookupResponse.Items && defaultLookupResponse.Items.length > 0) {
                                        itemUid = defaultLookupResponse.Items[0].UID;
                                        // Use MYOB description if no override provided
                                        if (!itemDescription || itemDescription.trim() === '') {
                                            itemDescription = defaultLookupResponse.Items[0].Description || '';
                                        }
                                    } else {
                                        throw new Error(`Default SKU '${defaultSku}' not found in MYOB`);
                                    }
                                } else {
                                    throw new Error(`SKU '${item.sku}' not found in MYOB and no default SKU provided`);
                                }
                            }
                        } catch (error: any) {
                            // If it's a network/API error (not SKU not found), still try default SKU
                            if (error.message.includes('not found in MYOB')) {
                                throw error; // Re-throw our custom not found errors
                            } else {
                                console.log(`Failed to lookup SKU '${item.sku}': ${error.message}, falling back to default SKU '${defaultSku}'`);
                                actualSku = defaultSku;
                                
                                if (defaultSku && defaultSku.trim() !== '') {
                                    const defaultSkuEncoded = encodeURIComponent(`'${defaultSku}'`);
                                    const defaultLookupUrl = `/Inventory/Item?$filter=Number eq ${defaultSkuEncoded}`;
                                    const defaultLookupResponse: any = await myobRequest.call(this, 'GET', defaultLookupUrl, {}, {}, baseUrl);
                                    
                                    if (defaultLookupResponse && defaultLookupResponse.Items && defaultLookupResponse.Items.length > 0) {
                                        itemUid = defaultLookupResponse.Items[0].UID;
                                        // Use MYOB description if no override provided
                                        if (!itemDescription || itemDescription.trim() === '') {
                                            itemDescription = defaultLookupResponse.Items[0].Description || '';
                                        }
                                    } else {
                                        throw new Error(`Default SKU '${defaultSku}' not found in MYOB`);
                                    }
                                } else {
                                    throw new Error(`Failed to lookup SKU '${item.sku}': ${error.message}, and no default SKU provided`);
                                }
                            }
                        }
                    } else {
                        // No SKU provided, use default SKU
                        console.log(`No SKU provided for item, using default SKU '${defaultSku}'`);
                        actualSku = defaultSku;
                        
                        if (defaultSku && defaultSku.trim() !== '') {
                            const defaultSkuEncoded = encodeURIComponent(`'${defaultSku}'`);
                            const defaultLookupUrl = `/Inventory/Item?$filter=Number eq ${defaultSkuEncoded}`;
                            const defaultLookupResponse: any = await myobRequest.call(this, 'GET', defaultLookupUrl, {}, {}, baseUrl);
                            
                            if (defaultLookupResponse && defaultLookupResponse.Items && defaultLookupResponse.Items.length > 0) {
                                itemUid = defaultLookupResponse.Items[0].UID;
                                // Use MYOB description if no override provided
                                if (!itemDescription || itemDescription.trim() === '') {
                                    itemDescription = defaultLookupResponse.Items[0].Description || '';
                                }
                            } else {
                                throw new Error(`Default SKU '${defaultSku}' not found in MYOB`);
                            }
                        } else {
                            throw new Error('No SKU provided and no default SKU available');
                        }
                    }

                    const lineItem: any = {
                        Item: { UID: itemUid },
                        ShipQuantity: item.quantity,
                        UnitPrice: item.unitPrice,
                    };

                    // Add discount percentage if present (from Shopify discounts)
                    if (item.discountAmount && item.discountAmount > 0 && item.unitPrice > 0) {
                        // Convert discount amount to percentage based on total line value (unit price × quantity)
                        const totalLineValue = item.unitPrice * item.quantity;
                        const discountPercent = (item.discountAmount / totalLineValue) * 100;
                        lineItem.DiscountPercent = Math.round(discountPercent * 100) / 100; // Round to 2 decimal places
                        console.log(`Converted discount amount ${item.discountAmount} to percentage: ${lineItem.DiscountPercent}% (unit price: ${item.unitPrice}, quantity: ${item.quantity}, total line value: ${totalLineValue})`);
                    }

                    // Add TaxCode if provided
                    if (item.taxCodeUid && item.taxCodeUid.trim() !== '') {
                        lineItem.TaxCode = { UID: item.taxCodeUid };
                    }

                    // Add description if available
                    if (itemDescription && itemDescription.trim() !== '') {
                        lineItem.Description = itemDescription;
                    }

                    lines.push(lineItem);
                }

                // Add shipping line item if provided
                if (shippingSku && shippingSku.trim() !== '') {
                    let shippingItemUid = '';
                    try {
                        const skuEncoded = encodeURIComponent(`'${shippingSku}'`);
                        const lookupUrl = `/Inventory/Item?$filter=Number eq ${skuEncoded}`;
                        const lookupResponse: any = await myobRequest.call(this, 'GET', lookupUrl, {}, {}, baseUrl);
                        
                        if (lookupResponse && lookupResponse.Items && lookupResponse.Items.length > 0) {
                            shippingItemUid = lookupResponse.Items[0].UID;
                            
                            const shippingLineItem: any = {
                                Item: { UID: shippingItemUid },
                                ShipQuantity: 1,
                                UnitPrice: shippingPrice,
                            };
                            
                            // Add default tax code if provided
                            if (defaultTaxCodeUid && defaultTaxCodeUid.trim() !== '') {
                                shippingLineItem.TaxCode = { UID: defaultTaxCodeUid };
                            }
                            
                            // Add custom shipping description if provided
                            if (shippingDescription && shippingDescription.trim() !== '') {
                                shippingLineItem.Description = shippingDescription;
                            }
                            
                            lines.push(shippingLineItem);
                        } else {
                            throw new Error(`Shipping SKU '${shippingSku}' not found in MYOB`);
                        }
                    } catch (error: any) {
                        throw new Error(`Failed to lookup Shipping SKU '${shippingSku}': ${error.message}`);
                    }
                }

                // Build shipping address from lines (similar to your example)
                let shippingAddress = '';
                const newline = '\r\n';
                
                // Add each line to the shipping address, appending newline after each
                if (shippingLine1 && shippingLine1.trim() !== '') {
                    shippingAddress = shippingLine1;
                }
                if (shippingLine2 && shippingLine2.trim() !== '') {
                    shippingAddress = shippingAddress + (shippingAddress ? newline : '') + shippingLine2;
                }
                if (shippingLine3 && shippingLine3.trim() !== '') {
                    shippingAddress = shippingAddress + (shippingAddress ? newline : '') + shippingLine3;
                }
                if (shippingLine4 && shippingLine4.trim() !== '') {
                    shippingAddress = shippingAddress + (shippingAddress ? newline : '') + shippingLine4;
                }
                if (shippingLine5 && shippingLine5.trim() !== '') {
                    shippingAddress = shippingAddress + (shippingAddress ? newline : '') + shippingLine5;
                }

                // Build the payload according to MYOB Business API structure
                const payload: any = {
                    OrderType: 'Item',
                    Customer: { UID: customerUid },
                    Date: new Date().toISOString(),
                    IsTaxInclusive: isTaxInclusive,
                    Lines: lines,
                };

                // Add optional fields if provided
                if (journalMemo && journalMemo.trim() !== '') {
                    payload.JournalMemo = journalMemo;
                }
                
                if (comment && comment.trim() !== '') {
                    payload.Comment = comment;
                }
                
                if (cleanedPurchaseOrderNumber && cleanedPurchaseOrderNumber.trim() !== '') {
                    payload.CustomerPurchaseOrderNumber = cleanedPurchaseOrderNumber;
                }
                
                if (shippingAddress && shippingAddress.trim() !== '') {
                    payload.ShipToAddress = shippingAddress;
                }

                // Debug: Log the payload being sent to MYOB
                console.log('MYOB Payload:', JSON.stringify(payload, null, 2));
                
                // Make the API call to create sales order
                const res: any = await myobRequest.call(this, 'POST', '/Sale/Order/Item', payload, {}, baseUrl);
                
                // Debug: Log the response from MYOB
                console.log('MYOB Response:', JSON.stringify(res, null, 2));
                
                // Ensure we return the response properly with payload info
                if (res) {
                    returnData.push({ 
                        json: {
                            myobResponse: res,
                            sentPayload: payload,
                            success: true
                        }
                    });
                } else {
                    returnData.push({ 
                        json: { 
                            success: true, 
                            message: 'Sales order created but no response data',
                            sentPayload: payload
                        }
                    });
                }
                
        } catch (error: any) {
            if (this.continueOnFail()) {
                returnData.push({ json: { error: error.message || error.toString() } });
            } else {
                throw error;
            }
        }

        return this.prepareOutputData(returnData);
    }
}