import {
  INodeType, INodeTypeDescription, IExecuteFunctions, INodeExecutionData,
  NodeConnectionType, // <-- add this
        } from 'n8n-workflow';
import { myobRequest } from '../transport/MyobApi.request';

export class Myob implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'MYOB AccountRight',
		name: 'myob',
		group: ['transform'],
		version: 1,
        inputs: [NodeConnectionType.Main],
        outputs: [NodeConnectionType.Main],
		description: 'Interact with MYOB AccountRight API',
		defaults: { name: 'MYOB' },
		credentials: [
			{ name: 'myobCompanyFileApi', required: true },
			{ name: 'myobOAuth2Api', required: false }, // optional for Local API
		],
		properties: [
			{
				displayName: 'Base URL',
				name: 'baseUrl',
				type: 'string',
				default: 'https://api.myob.com/accountright/{companyFileGuid}',
				required: true,
			},
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				options: [{ name: 'Sales Order', value: 'salesOrder' }],
				default: 'salesOrder',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: { show: { resource: ['salesOrder'] } },
				options: [
					{ name: 'Create (Item)', value: 'createItem' },
				],
				default: 'createItem',
			},

			// ---------- Common fields ----------
			{
				displayName: 'Customer UID',
				name: 'customerUid',
				type: 'string',
				default: '',
				required: true,
				displayOptions: { show: { resource: ['salesOrder'], operation: ['createItem'] } },
			},
			{
				displayName: 'Date',
				name: 'date',
				type: 'string',
				default: '',
				displayOptions: { show: { resource: ['salesOrder'], operation: ['createItem'] } },
			},
			{
				displayName: 'Tax Inclusive',
				name: 'isTaxInclusive',
				type: 'boolean',
				default: true,
				displayOptions: { show: { resource: ['salesOrder'], operation: ['createItem'] } },
			},
			{
				displayName: 'Journal Memo',
				name: 'journalMemo',
				type: 'string',
				default: '',
				displayOptions: { show: { resource: ['salesOrder'], operation: ['createItem'] } },
			},

			// ---------- Optional header fields ----------
			{
				displayName: 'Customer PO Number',
				name: 'customerPo',
				type: 'string',
				default: '',
				displayOptions: { show: { resource: ['salesOrder'], operation: ['createItem'] } },
			},
			{
				displayName: 'Promised Date',
				name: 'promisedDate',
				type: 'string',
				default: '',
				description: 'ISO string e.g. 2025-08-09T00:00:00',
				displayOptions: { show: { resource: ['salesOrder'], operation: ['createItem'] } },
			},
			{
				displayName: 'Freight',
				name: 'freight',
				type: 'number',
				default: 0,
				displayOptions: { show: { resource: ['salesOrder'], operation: ['createItem'] } },
			},
			{
				displayName: 'Freight Tax Code UID',
				name: 'freightTaxCodeUid',
				type: 'string',
				default: '',
				displayOptions: { show: { resource: ['salesOrder'], operation: ['createItem'] } },
			},

			// ---------- Lines (Item layout) ----------
			{
				displayName: 'Lines (Item)',
				name: 'linesItem',
				type: 'fixedCollection',
				typeOptions: { multipleValues: true },
				default: [],
				displayOptions: { show: { resource: ['salesOrder'], operation: ['createItem'] } },
				options: [
					{
						name: 'line',
						displayName: 'Line',
						values: [
							{ displayName: 'Item UID', name: 'itemUid', type: 'string', default: '' },
							{ displayName: 'Quantity (ShipQuantity)', name: 'qty', type: 'number', default: 1 },
							{ displayName: 'Unit Price', name: 'unitPrice', type: 'number', default: 0 },
							{ displayName: 'Description Override', name: 'description', type: 'string', default: '' },
							{ displayName: 'Discount %', name: 'discountPercent', type: 'number', default: 0 },
							{ displayName: 'Discount Amount', name: 'discountAmount', type: 'number', default: 0 },
							{ displayName: 'Tax Code UID', name: 'taxCodeUid', type: 'string', default: '' },
							{ displayName: 'Location UID', name: 'locationUid', type: 'string', default: '' },
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
            const baseUrl = this.getNodeParameter('baseUrl', i) as string;
            const resource = this.getNodeParameter('resource', i) as string;
            const operation = this.getNodeParameter('operation', i) as string;

            if (resource === 'salesOrder' && operation === 'createItem') {
            const rawDate = (this.getNodeParameter('date', i) as string) || '';
            const dateStr = rawDate.trim() !== '' ? rawDate : new Date().toISOString();

            const linesWrapped = this.getNodeParameter('linesItem', i) as any[];
            const lines = linesWrapped.map((w) => {
                const l = w.line;
                return {
                Item: { UID: l.itemUid },
                ShipQuantity: l.qty,
                UnitPrice: l.unitPrice,
                };
            });

            const payload = {
                OrderType: 'Item',
                Customer: { UID: this.getNodeParameter('customerUid', i) as string },
                Date: dateStr,
                IsTaxInclusive: this.getNodeParameter('isTaxInclusive', i) as boolean,
                Lines: lines,
            };

            const res: any = await myobRequest.call(this, 'POST', '/Sale/Order/Item', payload, {}, baseUrl);
            returnData.push({ json: res ?? {} });
            } else {
            throw new Error('Operation not implemented');
            }
        }

        return this.prepareOutputData(returnData);
    }
}