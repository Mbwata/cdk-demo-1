import * as cdk from 'aws-cdk-lib';
import { Construct } from "constructs";
import { MattEc2 } from '../constructs/matt-ec2';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export class MineCraftStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const minecraftServer = new MattEc2(this, 'MinecraftEC2', {
            vpc: ec2.Vpc.fromLookup(this, 'vpc', {
                vpcId: 'vpc-19186463'
            }),
        })
        //add ingress rules
        minecraftServer.securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'allow ssh access');
        minecraftServer.securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(19132), 'open minecraft TCP port');
        minecraftServer.securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.udp(19132), 'open minecraft UDP port');
        minecraftServer.ec2instance.addUserData(`su - ubuntu -c 'curl https://raw.githubusercontent.com/Mbwata/cdk-demo-1/main/scripts/SetupMinecraft.sh | bash'`);
    }


}