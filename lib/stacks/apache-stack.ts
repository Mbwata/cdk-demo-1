import * as cdk from 'aws-cdk-lib';
import { Construct } from "constructs";
import { EnvType, MattEc2 } from '../constructs/matt-ec2';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export class ApacheStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const env = EnvType.TEST;

        const apacheServer = new MattEc2(this, 'ApacheEC2', {
            vpc: ec2.Vpc.fromLookup(this, 'vpc', {
                vpcId: 'vpc-19186463'
            }),
            os: 'rhel',
            arch: 'arm64',
            envType: env
        })
        //add ingress rules
        apacheServer.securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'allow ssh access');
        apacheServer.securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), 'open port 80');
        apacheServer.ec2instance.addUserData('yes | dnf install httpd\nsystemctl enable httpd\nsystemctl start httpd\necho Matt Rules > /var/www/html/index.html');
    }


}