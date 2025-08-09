import {
	IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription,
} from 'n8n-workflow';
import { myobRequest } from '../transport/MyobApi.request';

export class Myob implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'MYOB AccountRight',
		name: 'myob',
		group: ['transform'],
		version: 1,
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
				// Build payload
				const linesIn = (this.getNodeParameter('linesItem', i) as any[]).map((wrapper) => wrapper.line);
				const lines = linesIn.map((l) => {
					const line: any = {
						Item: { UID: l.itemUid },
						ShipQuantity: l.qty,
						UnitPrice: l.unitPrice,
					};
					if (l.description) line.Description = l.description;
					if (l.discountPercent) line.DiscountPercent = l.discountPercent;
					if (l.discountAmount) line.DiscountAmount = l.discountAmount;
					if (l.taxCodeUid) line.TaxCode = { UID: l.taxCodeUid };
					if (l.locationUid) line.Location = { UID: l.locationUid };
					return line;
				});

				const payload: any = {
					OrderType: 'Item',
					Customer: { UID: this.getNodeParameter('customerUid', i) as string },
					Date: date,
					IsTaxInclusive: this.getNodeParameter('isTaxInclusive', i) as boolean,
					JournalMemo: this.getNodeParameter('journalMemo', i) as string || undefined,
					CustomerPurchaseOrderNumber: this.getNodeParameter('customerPo', i, '') || undefined,
					PromisedDate: this.getNodeParameter('promisedDate', i, '') || undefined,
					Freight: this.getNodeParameter('freight', i, 0) || undefined,
					FreightTaxCode: (() => {
						const uid = this.getNodeParameter('freightTaxCodeUid', i, '') as string;
						return uid ? { UID: uid } : undefined;
					})(),
					Lines: lines,
				};

				// POST
				const res: any = await myobRequest.call(this, 'POST', '/Sale/Order/Item', payload, {}, baseUrl);

				// Normalize to array of outputs
				const out = (res && Array.isArray(res)) ? res : [res ?? {}];
				out.forEach((r) => returnData.push({ json: r }));
			} else {
				throw new Error('Operation not implemented');
			}
		}

		return this.prepareOutputData(returnData);
	}
}