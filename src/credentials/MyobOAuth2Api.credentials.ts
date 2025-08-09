import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class MyobOAuth2Api implements ICredentialType {
	name = 'myobOAuth2Api';
	displayName = 'MYOB OAuth2';
	extends = ['oAuth2Api'];
	properties: INodeProperties[] = [
		{
			displayName: 'Grant Type',
			name: 'grantType',
			type: 'hidden',
			default: 'authorizationCode',
		},
		{
			displayName: 'Authorization URL',
			name: 'authUrl',
			type: 'hidden',
			default: 'https://secure.myob.com/oauth2/account/authorize',
		},
		{
			displayName: 'Access Token URL',
			name: 'accessTokenUrl',
			type: 'hidden',
			default: 'https://secure.myob.com/oauth2/v1/authorize',
		},
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'hidden',
			default: 'sme-company-settings sme-sales sme-inventory',
		},
		{
			displayName: 'Auth URI Query Parameters',
			name: 'authQueryParameters',
			type: 'hidden',
			default: '',
		},
		{
			displayName: 'Authentication',
			name: 'authentication',
			type: 'hidden',
			default: 'header',
		},
		{
			displayName: 'Company File Username',
			name: 'companyFileUsername',
			type: 'string',
			default: 'Administrator',
			description: 'Username for the MYOB company file',
			required: true,
		},
		{
			displayName: 'Company File Password',
			name: 'companyFilePassword',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'Password for the MYOB company file',
			required: true,
		},
		{
			displayName: 'Company File GUID',
			name: 'companyFileGuid',
			type: 'string',
			default: '',
			description: 'The unique GUID of your MYOB company file (e.g., 12345678-abcd-1234-abcd-123456789abc)',
			required: true,
		},
	];
}
