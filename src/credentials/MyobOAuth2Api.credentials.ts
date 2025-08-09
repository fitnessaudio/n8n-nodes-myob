import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class MyobOAuth2Api implements ICredentialType {
	name = 'myobOAuth2Api';
	displayName = 'MYOB OAuth2 (Cloud)';
	extends = ['oAuth2Api'];
	properties: CredentialsProperty[] = [
		{ displayName: 'Client ID', name: 'clientId', type: 'string', default: '' },
		{ displayName: 'Client Secret', name: 'clientSecret', type: 'string', typeOptions:{password:true}, default: '' },
		{ displayName: 'Auth URL', name: 'authUrl', type: 'hidden', default: 'https://secure.myob.com/oauth2/account/authorize' },
		{ displayName: 'Access Token URL', name: 'accessTokenUrl', type: 'hidden', default: 'https://secure.myob.com/oauth2/v1/authorize' },
		{ displayName: 'Scope', name: 'scope', type: 'string', default: 'CompanyFile' },
		{ displayName: 'Include API Key Header', name: 'includeApiKey', type: 'boolean', default: true }
	];
}