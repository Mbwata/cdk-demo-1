import { MineCraftStack } from '../lib/stacks/minecraft-stack';
import { App } from 'aws-cdk-lib';

const app = new App();


new MineCraftStack(app, 'MinecraftStack',
{
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});
