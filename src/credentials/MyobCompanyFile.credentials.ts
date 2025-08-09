import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class MyobCompanyFile implements ICredentialType {
	name = 'myobCompanyFileApi';
	displayName = 'MYOB Company File (AR v2)';
	properties: CredentialsProperty[] = [
		{ displayName: 'Username', name: 'user', type: 'string', default: 'Administrator' },
		{ displayName: 'Password', name: 'password', type: 'string', typeOptions:{password:true}, default: '' },
	];
}