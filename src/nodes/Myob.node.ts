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
				displayName: 'Customer PO Number',
				name: 'customerPo',
				type: 'string',
				default: '',
				description: 'Customer purchase order number (optional)',
			},
			{
				displayName: 'Line Items',
				name: 'lineItems',
				type: 'fixedCollection',
				typeOptions: { multipleValues: true },
				default: [{}],
				required: true,
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
		],
	};

	async execute(this: IExecuteFunctions) {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];

        for (let i = 0; i < items.length; i++) {
            try {
                // Get credentials to build the base URL
                const credentials = await this.getCredentials('myobOAuth2Api');
                const baseUrl = `https://api.myob.com/accountright/${credentials.companyFileGuid}`;
                
                const customerUid = this.getNodeParameter('customerUid', i) as string;
                const isTaxInclusive = this.getNodeParameter('isTaxInclusive', i) as boolean;
                const customerPo = this.getNodeParameter('customerPo', i) as string;
                const lineItemsData = this.getNodeParameter('lineItems', i) as any;

                // Validate required fields
                if (!customerUid) {
                    throw new Error('Customer UID is required');
                }

                if (!lineItemsData || !lineItemsData.item || lineItemsData.item.length === 0) {
                    throw new Error('At least one line item is required');
                }

                // Build lines array with SKU lookup
                const lines = [];
                for (const item of lineItemsData.item) {
                    let itemUid = '';
                    let itemDescription = item.description || '';
                    
                    // Look up Item UID from SKU
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
                                throw new Error(`Item with SKU '${item.sku}' not found in MYOB`);
                            }
                        } catch (error: any) {
                            throw new Error(`Failed to lookup SKU '${item.sku}': ${error.message}`);
                        }
                    } else {
                        throw new Error('SKU is required for each line item');
                    }

                    const lineItem: any = {
                        Item: { UID: itemUid },
                        ShipQuantity: item.quantity,
                        UnitPrice: item.unitPrice,
                    };

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

                // Build the payload according to MYOB Business API structure
                const payload = {
                    OrderType: 'Item',
                    Customer: { UID: customerUid },
                    Date: new Date().toISOString(),
                    IsTaxInclusive: isTaxInclusive,
                    Lines: lines,
                };

                // Add optional customer PO if provided
                if (customerPo && customerPo.trim() !== '') {
                    (payload as any).CustomerPO = customerPo;
                }

                // Make the API call to create sales order
                const res: any = await myobRequest.call(this, 'POST', '/Sale/Order/Item', payload, {}, baseUrl);
                returnData.push({ json: res ?? {} });
                
            } catch (error: any) {
                if (this.continueOnFail()) {
                    returnData.push({ json: { error: error.message || error.toString() } });
                } else {
                    throw error;
                }
            }
        }

        return this.prepareOutputData(returnData);
    }
}