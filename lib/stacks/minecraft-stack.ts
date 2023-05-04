import * as cdk from 'aws-cdk-lib';
import { Construct } from "constructs";
import { MattEc2 } from '../constructs/matt-ec2';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export class MineCraftStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const ubuntuAmi = ec2.MachineImage.lookup({
            name: 'ubuntu/images/hvm-ssd/ubuntu-focal-20.04-arm64-server-*',
            //name: 'ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*',
            owners: ['099720109477'], // Canonical
        });

        new MattEc2(this, 'MinecraftEC2', {
            vpc: ec2.Vpc.fromLookup(this, 'vpc', {
                vpcId: 'vpc-19186463'
            }),
            ami: ubuntuAmi
        })
    }
}