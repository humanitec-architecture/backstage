import { CatalogClient } from '@backstage/catalog-client';
import { ScmIntegrations } from '@backstage/integration';
import { createBuiltinActions, createRouter } from '@backstage/plugin-scaffolder-backend';
import { createHumanitecApp } from "@frontside/backstage-plugin-humanitec-backend";
import { createEcrAction } from '@roadiehq/scaffolder-backend-module-aws';
import { Router } from 'express';
import { createGetEnvironmentAction } from '../actions/get-environment';
import type { PluginEnvironment } from '../types';

export default async function createPlugin({
  logger,
  config,
  database,
  reader,
  discovery,
  identity,
  permissions,
}: PluginEnvironment): Promise<Router> {
  const catalogClient = new CatalogClient({
    discoveryApi: discovery,
  });
  const integrations = ScmIntegrations.fromConfig(config);
  const builtInActions = createBuiltinActions({
    integrations,
    catalogClient,
    config: config,
    reader: reader,
  });

  const actions = [
    ...builtInActions,
    createEcrAction(),
    createGetEnvironmentAction({
      orgId: config.getString('humanitec.orgId'),
      awsRegion: process.env.AWS_DEFAULT_REGION || '',
      cloudProvider: config.getString('cloudProvider'),
    }),
    createHumanitecApp({
      orgId: config.getString('humanitec.orgId'),
      token: config.getString('humanitec.token')
    })
  ];

  return await createRouter({
    logger: logger,
    config: config,
    database: database,
    reader: reader,
    catalogClient,
    identity: identity,
    permissions: permissions,
    actions,
  });
}
