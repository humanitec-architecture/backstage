import { createTemplateAction } from '@backstage/plugin-scaffolder-backend';

interface EnvironmentAction {
  orgId: string
  awsRegion: string
}

export function createGetEnvironmentAction({ orgId, awsRegion }: EnvironmentAction) {
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
          }
        }
      }
    },
    handler: async (ctx) => {
      ctx.output('orgId', orgId);
      ctx.output('awsRegion', awsRegion);
    },
  });
}
