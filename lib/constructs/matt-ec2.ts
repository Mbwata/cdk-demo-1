import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { InstanceClass, InstanceSize, InstanceType, SecurityGroup } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

export interface ec2Props {
    readonly instanceSize?: InstanceSize;
    //readonly instanceClass?: InstanceClass;
    readonly vpc: ec2.IVpc
    readonly arch?: 'arm64' | 'amd64'
    readonly os?: 'rhel' | 'ubuntu'
    readonly rsaKey?: ec2.CfnKeyPair
};

export class MattEc2 extends Construct {
    public rsaKey: ec2.CfnKeyPair;
    public securityGroup: SecurityGroup;
    addUserData: any;
    public ec2instance: ec2.Instance;

    constructor(scope: Construct, id: string, props: ec2Props) {
        super(scope, id);

        const ami = props.os === 'rhel' ?
            ec2.MachineImage.lookup({
                name: `RHEL-9*_HVM-*-${props.arch === 'arm64' ? 'arm64' : 'x86_64'}-*-Hourly2-GP2`,
                owners: ['309956199498'], // Red Hat
            }) : ec2.MachineImage.lookup({
                name: `ubuntu/images/hvm-ssd/ubuntu-focal-20.04-${props.arch === 'arm64' ? 'arm64' : 'amd64'}-server-*`,
                owners: ['099720109477'], // Canonical
            })

        const instanceClass = props.arch === 'arm64' ? InstanceClass.T4G : InstanceClass.T2
        const instanceSize = props?.instanceSize ?? InstanceSize.SMALL
        this.securityGroup = new ec2.SecurityGroup(this, 'EC2SecurityGroup', {
            vpc: props.vpc,
            allowAllOutbound: true,
        });
        this.ec2instance = new ec2.Instance(this, 'EC2Instance', {
            instanceType: InstanceType.of(instanceClass, instanceSize),
            vpc: props.vpc,
            machineImage: ami,
            securityGroup: this.securityGroup,
            keyName: 'new-key',
        
        });
    }
};