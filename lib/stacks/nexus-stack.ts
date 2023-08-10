import * as cdk from 'aws-cdk-lib';
import { Construct } from "constructs";
import { EnvType, MattEc2 } from '../constructs/matt-ec2';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export class NexusStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        //select env size
        const env = EnvType.DEV;
        //create server
        const nexusServer = new MattEc2(this, 'NexusEC2', {os: 'centos',envType: env})
        //add ingress rules
        nexusServer.securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'allow ssh access');
        nexusServer.securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), 'open needed TCP port');
        nexusServer.securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(8081), 'open needed TCP port');
        nexusServer.ec2instance.addUserData(`yum update -y\nyum install wget -y\nyum install java-1.8.0-openjdk.x86_64 -y\nmkdir /app && cd /app\nwget -O nexus.tar.gz https://download.sonatype.com/nexus/3/latest-unix.tar.gz\ntar -xvf nexus.tar.gz\nmv nexus-3* nexus\nadduser nexus\nchown -R nexus:nexus /app/nexus\nchown -R nexus:nexus /app/sonatype-work\necho 'run_as_user="nexus"' >> /app/nexus/bin/nexus.rc\necho '[Unit]\nDescription=nexus service\nAfter=network.target\n\n[Service]\nType=forking\nLimitNOFILE=65536\nUser=nexus\nGroup=nexus\nExecStart=/app/nexus/bin/nexus start\nExecStop=/app/nexus/bin/nexus stop\nUser=nexus\nRestart=on-abort\n\n[Install]\nWantedBy=multi-user.target' >> /etc/systemd/system/nexus.service\nchkconfig nexus on\nsudo systemctl start nexus`);
    }
}