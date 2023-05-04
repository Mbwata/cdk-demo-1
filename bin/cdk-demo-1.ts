#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CdkDemo1Stack } from '../lib/cdk-demo-1-stack';

const app = new cdk.App();
new CdkDemo1Stack(app, 'CdkDemo1Stack');
