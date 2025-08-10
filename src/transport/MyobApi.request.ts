import type { IExecuteFunctions } from 'n8n-workflow';

export async function myobRequest(
	this: IExecuteFunctions,
	method: string,
	resource: string,
	body: unknown,
	qs: Record<string, unknown>,
	baseUrl: string, // e.g. https://api.myob.com/accountright/{companyFileGuid}
) {
	// Get OAuth2 credentials (includes company file username/password)
	const credentials = await this.getCredentials('myobOAuth2Api');

	// Base headers required for all MYOB API calls
	const headers: Record<string, string> = {
		'x-myobapi-version': 'v2',
		'x-myobapi-cftoken': Buffer.from(`${credentials.companyFileUsername}:${credentials.companyFilePassword}`).toString('base64'),
		'x-myobapi-key': String(credentials.clientId),
		'Content-Type': 'application/json',
		'Accept': 'application/json',
	};

	const options: any = {
		method, 
		uri: `${baseUrl}${resource}`, 
		qs, 
		body, 
		json: true, 
		headers,
		returnFullResponse: true, // Get complete response including headers and status
	};

	try {
		// Use N8N's OAuth2 helper for cloud API calls
		// @ts-ignore
		const response = await this.helpers.requestWithAuthentication!.call(this, 'myobOAuth2Api', options);
		
		// Handle undefined responses (common for MYOB POST operations)
		if (response === undefined && method === 'POST') {
			// Return synthetic success response for POST operations
			return {
				statusCode: 201,
				statusMessage: 'Created',
				body: null,
				headers: {},
				_synthetic: true
			};
		}
		
		// Handle returnFullResponse format - extract body for GET requests
		if (response && typeof response === 'object' && 'body' in response && 'statusCode' in response) {
			// For GET requests, return just the body
			// For POST requests, return the full response for status checking
			if (method === 'GET') {
				return response.body;
			} else {
				return response;
			}
		}
		
		return response;
		
	} catch (error: any) {
		throw error;
	}
}
