import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { InstanceClass, InstanceSize, InstanceType } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

export interface ec2Props {
    readonly instanceSize?: InstanceSize;
    readonly instanceClass?: InstanceClass;
    readonly vpc: ec2.IVpc
    readonly ami: ec2.IMachineImage
    readonly rsaKey?: ec2.CfnKeyPair
};

export class MattEc2 extends Construct {
    public rsaKey: ec2.CfnKeyPair;
    constructor(scope: Construct, id: string, props: ec2Props) {
        super(scope, id);
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
            machineImage: props.ami,
            securityGroup: sg,
            keyName: 'new-key'
        });
    }
};