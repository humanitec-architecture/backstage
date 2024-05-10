import {
  createBackendModule,
  coreServices,
} from '@backstage/backend-plugin-api';
import { scaffolderActionsExtensionPoint } from '@backstage/plugin-scaffolder-node/alpha';
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';

interface EnvironmentAction {
  orgId: string
  cloudProvider: string
}

export function createGetEnvironmentAction({ orgId, cloudProvider }: EnvironmentAction) {
  return createTemplateAction({
    id: 'backend:get-environment',
    schema: {
      output: {
        required: [],
        properties: {
          orgId: {
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


export default createBackendModule({
  moduleId: 'get-environment-scaffolder-module',
  pluginId: 'scaffolder',
  register({ registerInit }) {
    registerInit({
      deps: {
        scaffolderActions: scaffolderActionsExtensionPoint,
        config: coreServices.rootConfig,
      },
      async init({ scaffolderActions, config }) {
        scaffolderActions.addActions(
          createGetEnvironmentAction({
            orgId: config.getString('humanitec.orgId'),
            cloudProvider: config.getString('cloudProvider'),
          }),
        );
      },
    });
  },
});
