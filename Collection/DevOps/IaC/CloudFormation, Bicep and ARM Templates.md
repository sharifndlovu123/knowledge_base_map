The cloud-native IaC formats: **CloudFormation** for AWS, and **ARM templates** with their friendlier front end **Bicep** for Azure. General ideas are in [[Infrastructure as Code]]; the multi-cloud alternative is [[Terraform]].

## Tools at a glance

| | CloudFormation | ARM template | Bicep |
| - | -------------- | ------------ | ----- |
| Cloud | AWS | Azure | Azure |
| Format | YAML / JSON | JSON | Bicep DSL (compiles to ARM JSON) |
| Unit of deployment | **Stack** | **Deployment** (to a resource group, subscription, management group or tenant) | Same as ARM |
| Preview | **Change sets** | **What-if** | **What-if** |
| State | Held by the service (stack) | Held by Azure Resource Manager | Same as ARM |
| Higher-level options | CDK, SAM | Template specs, Deployment stacks | Modules, Azure Verified Modules |
| CLI | `aws cloudformation` | `az deployment` | `az deployment` / `bicep` |

---

# AWS CloudFormation

Templates describe resources; AWS creates them as a **stack** and tracks it, rolling back on failure.

## Template anatomy

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: Web tier

Parameters:
  Environment:
    Type: String
    AllowedValues: [dev, staging, prod]
    Default: dev
  InstanceType:
    Type: String
    Default: t3.micro

Mappings:
  RegionAmi:
    af-south-1:
      Ami: ami-0abcdef1234567890

Conditions:
  IsProd: !Equals [!Ref Environment, prod]

Resources:
  WebSecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupDescription: Allow HTTPS
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 443
          ToPort: 443
          CidrIp: 0.0.0.0/0

  WebServer:
    Type: AWS::EC2::Instance
    Properties:
      InstanceType: !If [IsProd, m6i.large, !Ref InstanceType]
      ImageId: !FindInMap [RegionAmi, !Ref 'AWS::Region', Ami]
      SecurityGroupIds:
        - !GetAtt WebSecurityGroup.GroupId
      Tags:
        - Key: Name
          Value: !Sub '${Environment}-web'

Outputs:
  InstanceId:
    Description: ID of the web server
    Value: !Ref WebServer
    Export:
      Name: !Sub '${AWS::StackName}-InstanceId'
```

| Section | Purpose |
| ------- | ------- |
| **Parameters** | Inputs at deploy time |
| **Mappings** | Static lookup tables (region → AMI) |
| **Conditions** | If / else for resources and properties |
| **Resources** | The only required section |
| **Outputs** | Values to show or **export** to other stacks |
| **Metadata, Rules, Transform** | Extras; `Transform: AWS::Serverless-2016-10-31` enables SAM |

## Intrinsic functions

| Function | Use |
| -------- | --- |
| `!Ref` | Parameter value or a resource's primary id |
| `!GetAtt` | A resource attribute (`Bucket.Arn`) |
| `!Sub` | String substitution `${Var}` |
| `!Join`, `!Select`, `!Split` | String and list handling |
| `!If`, `!Equals`, `!And`, `!Not` | Conditions |
| `!FindInMap` | Mapping lookup |
| `!ImportValue` | Use another stack's export |
| Pseudo parameters | `AWS::Region`, `AWS::AccountId`, `AWS::StackName` |

## Commands

```
$ aws cloudformation validate-template --template-body file://template.yaml
$ aws cloudformation deploy --template-file template.yaml --stack-name web-dev \
    --parameter-overrides Environment=dev --capabilities CAPABILITY_IAM
$ aws cloudformation create-change-set --stack-name web-dev --change-set-name preview \
    --template-body file://template.yaml
$ aws cloudformation describe-stack-events --stack-name web-dev
$ aws cloudformation describe-stacks --stack-name web-dev --query 'Stacks[0].Outputs'
$ aws cloudformation delete-stack --stack-name web-dev
```

## Useful features
- **Change sets** preview creates / modifies / replacements before you execute
- **Rollback** on failed create or update; **rollback triggers** with CloudWatch alarms
- **Drift detection**: finds out-of-band changes
- **StackSets**: deploy to many accounts and regions
- **Nested stacks** and **modules** for reuse; **cross-stack references** with `Export` / `ImportValue`
- **DeletionPolicy** (`Retain`, `Snapshot`) and **UpdateReplacePolicy** protect data
- **`cfn-init` / `cfn-signal`** and **creation policies** for instance bootstrap
- **Custom resources** (Lambda-backed) for things CloudFormation cannot do
- Lint with **`cfn-lint`**, security-scan with **cfn-nag** or Checkov
- Other AWS pieces: **SAM** and **CDK** ([[6. AWS Developer Services and Serverless]]); CloudFormation in pipelines ([[AWS CodePipeline]])

---

# Azure ARM Templates

The native **Azure Resource Manager** declarative format. Everything in Azure (Portal, CLI, SDKs) ends up as an ARM call, so a template is the full-fidelity way to describe resources ([[1. Azure Core Concepts]]).

## Anatomy

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "storageName": {
      "type": "string",
      "minLength": 3,
      "maxLength": 24
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]"
    }
  },
  "variables": {
    "sku": "Standard_LRS"
  },
  "resources": [
    {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2023-01-01",
      "name": "[parameters('storageName')]",
      "location": "[parameters('location')]",
      "sku": { "name": "[variables('sku')]" },
      "kind": "StorageV2"
    }
  ],
  "outputs": {
    "endpoint": {
      "type": "string",
      "value": "[reference(parameters('storageName')).primaryEndpoints.blob]"
    }
  }
}
```

| Section | Purpose |
| ------- | ------- |
| `$schema`, `contentVersion` | Required header |
| `parameters` | Inputs |
| `variables` | Computed reusable values |
| `functions` | User-defined functions |
| `resources` | What to create; each has `type`, `apiVersion`, `name`, `location`, `properties` |
| `outputs` | Values returned |

- Expressions are strings in square brackets, e.g. `"[concat(parameters('prefix'), '-web')]"`
- Dependencies: `dependsOn`, or implicit through `reference()` / `resourceId()`
- Loops: `copy`; conditions: `"condition": "[equals(parameters('env'), 'prod')]"`
- **Deployment modes**: **Incremental** (default, leaves other resources alone) and **Complete** (deletes resources not in the template, use with care)
- Scopes: resource group, subscription, management group, tenant

```
$ az group create -n rg-demo -l southafricanorth
$ az deployment group validate -g rg-demo --template-file main.json --parameters storageName=stdemo12345
$ az deployment group what-if -g rg-demo --template-file main.json --parameters storageName=stdemo12345
$ az deployment group create -g rg-demo --template-file main.json --parameters storageName=stdemo12345
$ az deployment group list -g rg-demo -o table
```

ARM JSON is verbose and hard to read, which is why Bicep exists.

---

# Azure Bicep

A **domain-specific language** that **transpiles to ARM JSON**. Same capabilities and day-one support for new Azure resource types, with much cleaner syntax.

```bicep
@description('Name of the storage account')
@minLength(3)
@maxLength(24)
param storageName string

param location string = resourceGroup().location

@allowed(['dev', 'prod'])
param environment string = 'dev'

var sku = environment == 'prod' ? 'Standard_GRS' : 'Standard_LRS'

resource sa 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: storageName
  location: location
  sku: { name: sku }
  kind: 'StorageV2'
  properties: {
    minimumTlsVersion: 'TLS1_2'
    supportsHttpsTrafficOnly: true
  }
  tags: {
    Environment: environment
  }
}

output endpoint string = sa.properties.primaryEndpoints.blob
```

## Why it is nicer
- **Symbolic names** (`sa`) and property access (`sa.id`) replace `resourceId()` and `reference()`
- **Dependencies are automatic** when you reference another resource
- Types, decorators (`@description`, `@secure`, `@allowed`), loops and conditions are readable
- **Modules** for reuse, including from a registry
- Strong editor support in VS Code, plus a **linter**
- Can **decompile** existing ARM JSON: `az bicep decompile --file main.json`

## Loops, conditions and modules

```bicep
param subnets array = ['web', 'app', 'data']

resource vnet 'Microsoft.Network/virtualNetworks@2023-05-01' = {
  name: 'vnet-main'
  location: resourceGroup().location
  properties: {
    addressSpace: { addressPrefixes: ['10.0.0.0/16'] }
    subnets: [for (name, i) in subnets: {
      name: name
      properties: { addressPrefix: '10.0.${i}.0/24' }
    }]
  }
}

resource diag 'Microsoft.Storage/storageAccounts@2023-01-01' = if (environment == 'prod') {
  name: '${storageName}diag'
  location: location
  sku: { name: 'Standard_LRS' }
  kind: 'StorageV2'
}

module network './network.bicep' = {
  name: 'networkDeploy'
  params: {
    location: location
  }
}
```

## Secrets
- Mark parameters `@secure()`
- Reference **Key Vault** secrets in a parameter file instead of passing values ([[5. Azure Identity and Security]])

## Commands

```
$ az bicep install
$ az bicep build --file main.bicep               # produces main.json
$ az deployment group what-if -g rg-demo --template-file main.bicep --parameters storageName=stdemo12345
$ az deployment group create -g rg-demo --template-file main.bicep --parameters storageName=stdemo12345
$ az deployment sub create -l southafricanorth --template-file subscription.bicep   # subscription scope
```

Parameter files use `.bicepparam`:

```bicep
using './main.bicep'

param storageName = 'stdemo12345'
param environment = 'prod'
```

## In pipelines
Use the `AzureResourceManagerTemplateDeployment` task or `az deployment` commands in [[Azure Pipelines]], or `azure/arm-deploy` in [[GitHub Actions]], with workload identity federation. Run **what-if** on pull requests.

---

# Side-by-Side

| Concern | Terraform | CloudFormation | ARM | Bicep |
| ------- | --------- | -------------- | --- | ----- |
| Multi-cloud | Yes | AWS only | Azure only | Azure only |
| Readability | Good (HCL) | Moderate (verbose YAML) | Poor (JSON) | Good |
| State to manage | Yes, you store it | No (service holds it) | No (ARM holds it) | No |
| New services supported | After provider update | Usually quickly, some lag | Day one | Day one |
| Preview | `plan` | Change set | What-if | What-if |
| Rollback on failure | No automatic rollback | Automatic | Optional (`--rollback-on-error`) | Same as ARM |
| Reuse | Modules | Nested stacks, modules, CDK | Template specs | Modules |
| Drift detection | `plan` | Drift detection | What-if | What-if |

## Choosing
- **One cloud, native tooling, no state hassle** → CloudFormation (AWS) or Bicep (Azure)
- **Several clouds, SaaS and Kubernetes in one workflow** → Terraform ([[Terraform Best Practices]])
- **Old ARM JSON that already exists** → keep it working, decompile to Bicep when you next edit it
