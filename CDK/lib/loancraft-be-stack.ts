import * as cdk from '@aws-cdk/core';
import * as appsync from '@aws-cdk/aws-appsync';
import * as ddb from '@aws-cdk/aws-dynamodb';
import * as lambda from '@aws-cdk/aws-lambda';

export class LoancraftBeStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new appsync.GraphqlApi(this, 'Api', {
      name: 'loanCraft-cdk',
      schema: appsync.Schema.fromAsset('graphql/schema.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY
        },
      },
      xrayEnabled: true,
    });

    // lib/appsync-cdk-app-stack.ts
    const loansLambdaResource = new lambda.Function(this, 'AppSyncLoansHandler', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'connector.handler',
      code: lambda.Code.fromAsset('lamdas'),
      memorySize: 1024
    });

    // Set the new Lambda function as a data source for the AppSync API
    const loanLambda = api.addLambdaDataSource('lambdaDatasource', loansLambdaResource);

    const LoansTable = new ddb.Table(this, 'CDKLoansTable', {
      billingMode: ddb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'loanID',
        type: ddb.AttributeType.STRING,
      },
    });
    // enable the Lambda function to access the DynamoDB table (using IAM)
    LoansTable.grantFullAccess(loansLambdaResource)
    
    // Create an environment variable that we will use in the function code
    loansLambdaResource.addEnvironment('LOANS_TABLE', LoansTable.tableName);

    loanLambda.createResolver({
      typeName: "Query",
      fieldName: "getDashboard"
    });

    loanLambda.createResolver({
      typeName: "Query",
      fieldName: "getLoans"
    });

    loanLambda.createResolver({
      typeName: "Query",
      fieldName: "getLoanByID"
    });

    loanLambda.createResolver({
      typeName: "Query",
      fieldName: "getLoanHistoryByID"
    });

    loanLambda.createResolver({
      typeName: "Mutation",
      fieldName: "createLoan"
    });

    loanLambda.createResolver({
      typeName: "Mutation",
      fieldName: "updateLoan"
    });

    loanLambda.createResolver({
      typeName: "Mutation",
      fieldName: "updatePendingAmount"
    });

    loanLambda.createResolver({
      typeName: "Mutation",
      fieldName: "changeLoanStatus"
    });

    loanLambda.createResolver({
      typeName: "Mutation",
      fieldName: "deleteLoan"
    });

    // Prints out the AppSync GraphQL endpoint to the terminal
    new cdk.CfnOutput(this, "GraphQLAPIURL", {
     value: api.graphqlUrl
    });

    // Prints out the AppSync GraphQL API key to the terminal
    new cdk.CfnOutput(this, "GraphQLAPIKey", {
      value: api.apiKey || ''
    });

    // Prints out the stack region to the terminal
    new cdk.CfnOutput(this, "Stack Region", {
      value: this.region
    });
  }
}
