import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { InstanceClass, InstanceSize, InstanceType } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

export interface ec2Props {
    readonly instanceSize?: InstanceSize;
    readonly instanceClass?: InstanceClass;
    readonly vpc: ec2.IVpc
    readonly os?: 'rhel' | 'ubuntu'
    readonly rsaKey?: ec2.CfnKeyPair
};

export class MattEc2 extends Construct {
    public rsaKey: ec2.CfnKeyPair;
    constructor(scope: Construct, id: string, props: ec2Props) {
        super(scope, id);


        const ami = props.os === 'rhel' ?
            ec2.MachineImage.lookup({
                name: 'RHEL-8*_HVM-*-arm64-*-Hourly2-GP2',
                owners: ['309956199498'], // Red Hat
            }) : props.os === 'ubuntu' ?
                ec2.MachineImage.lookup({
                    name: 'ubuntu/images/hvm-ssd/ubuntu-focal-20.04-arm64-server-*',
                    owners: ['099720109477'], // Canonical
                }) : ec2.MachineImage.lookup({
                    name: 'ubuntu/images/hvm-ssd/ubuntu-focal-20.04-arm64-server-*',
                    owners: ['099720109477'], // Canonical
                })





        const instanceClass = props?.instanceClass ?? InstanceClass.BURSTABLE4_GRAVITON
        const instanceSize = props?.instanceSize ?? InstanceSize.NANO
        const sg = new ec2.SecurityGroup(this, 'EC2SecurityGroup', {
            vpc: props.vpc,
            allowAllOutbound: true,
        });
        sg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'allow ssh access');
        // this.rsaKey = props.rsaKey ?? new ec2.CfnKeyPair(this, 'rsaKey', {
        //     keyName: 'stanly',
        //     keyType: 'rsa',
        // })
        const ec2instance = new ec2.Instance(this, 'EC2Instance', {
            instanceType: InstanceType.of(instanceClass, instanceSize),
            vpc: props.vpc,
            machineImage: ami,
            securityGroup: sg,
            keyName: 'new-key'
        });
    }
};