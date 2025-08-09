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
	};

	// Use N8N's OAuth2 helper for cloud API calls
	// This will automatically handle the Authorization header with Bearer token
	// @ts-ignore
	return this.helpers.requestWithAuthentication!.call(this, 'myobOAuth2Api', options);
}
