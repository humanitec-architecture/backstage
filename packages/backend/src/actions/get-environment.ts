import { createTemplateAction } from '@backstage/plugin-scaffolder-backend';

interface EnvironmentAction {
  orgId: string
  awsRegion: string
  cloudProvider: string
}

export function createGetEnvironmentAction({ orgId, awsRegion, cloudProvider }: EnvironmentAction) {
  return createTemplateAction({
    id: 'backend:get-environment',
    schema: {
      output: {
        required: [],
        properties: {
          orgId: {
            type: 'string'
          },
          awsRegion: {
            type: 'string'
          },
          cloudProvider: {
            type: 'string'
          },
          githubOIDCCustomization: {
            type: 'object'
          }
        }
      }
    },
    handler: async (ctx) => {
      ctx.output('orgId', orgId);
      ctx.output('awsRegion', awsRegion);
      ctx.output('cloudProvider', cloudProvider);

      let githubOIDCCustomization
      if (cloudProvider === 'azure') {
        githubOIDCCustomization = {
          "useDefault": false,
          "includeClaimKeys": ["repository_owner"]
        }
      }
      ctx.output('githubOIDCCustomization', githubOIDCCustomization);
    },
  });
}
