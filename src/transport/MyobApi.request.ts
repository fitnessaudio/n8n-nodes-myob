import type { IExecuteFunctions } from 'n8n-workflow';

export async function myobRequest(
	this: IExecuteFunctions,
	method: string,
	resource: string,
	body: unknown,
	qs: Record<string, unknown>,
	baseUrl: string, // e.g. https://api.myob.com/accountright/{companyFileGuid}
) {
	const oauth = await this.getCredentials('myobOAuth2Api').catch(() => null);
	const cf = await this.getCredentials('myobCompanyFileApi');

	const headers: Record<string, string> = {
		'x-myobapi-version': 'v2',
		'x-myobapi-cftoken': Buffer.from(`${cf.user}:${cf.password}`).toString('base64'),
		'Content-Type': 'application/json',
	};

	// Cloud calls also include API key and Authorization via OAuth helper
	if (oauth?.clientId && oauth?.includeApiKey) headers['x-myobapi-key'] = String(oauth.clientId);

	const options: any = {
		method, uri: `${baseUrl}${resource}`, qs, body, json: true, headers,
	};

	// Local API (no OAuth configured)
	if (!oauth) {
		// @ts-ignore
		return this.helpers.request!(options);
	}

	// Cloud API
	// @ts-ignore
	return this.helpers.requestWithAuthentication!.call(this, 'myobOAuth2Api', options);
}