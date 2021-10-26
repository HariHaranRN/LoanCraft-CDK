"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoancraftBeStack = void 0;
const cdk = require("@aws-cdk/core");
const appsync = require("@aws-cdk/aws-appsync");
const ddb = require("@aws-cdk/aws-dynamodb");
const lambda = require("@aws-cdk/aws-lambda");
class LoancraftBeStack extends cdk.Stack {
    constructor(scope, id, props) {
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
        LoansTable.grantFullAccess(loansLambdaResource);
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
exports.LoancraftBeStack = LoancraftBeStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hbmNyYWZ0LWJlLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibG9hbmNyYWZ0LWJlLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFDQUFxQztBQUNyQyxnREFBZ0Q7QUFDaEQsNkNBQTZDO0FBQzdDLDhDQUE4QztBQUU5QyxNQUFhLGdCQUFpQixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQzdDLFlBQVksS0FBb0IsRUFBRSxFQUFVLEVBQUUsS0FBc0I7UUFDbEUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsTUFBTSxHQUFHLEdBQUcsSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUU7WUFDOUMsSUFBSSxFQUFFLGVBQWU7WUFDckIsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLHdCQUF3QixDQUFDO1lBQzFELG1CQUFtQixFQUFFO2dCQUNuQixvQkFBb0IsRUFBRTtvQkFDcEIsaUJBQWlCLEVBQUUsT0FBTyxDQUFDLGlCQUFpQixDQUFDLE9BQU87aUJBQ3JEO2FBQ0Y7WUFDRCxXQUFXLEVBQUUsSUFBSTtTQUNsQixDQUFDLENBQUM7UUFFSCwrQkFBK0I7UUFDL0IsTUFBTSxtQkFBbUIsR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLHFCQUFxQixFQUFFO1lBQzNFLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVc7WUFDbkMsT0FBTyxFQUFFLG1CQUFtQjtZQUM1QixJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDO1lBQ3JDLFVBQVUsRUFBRSxJQUFJO1NBQ2pCLENBQUMsQ0FBQztRQUVILG1FQUFtRTtRQUNuRSxNQUFNLFVBQVUsR0FBRyxHQUFHLENBQUMsbUJBQW1CLENBQUMsa0JBQWtCLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztRQUVwRixNQUFNLFVBQVUsR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLGVBQWUsRUFBRTtZQUN0RCxXQUFXLEVBQUUsR0FBRyxDQUFDLFdBQVcsQ0FBQyxlQUFlO1lBQzVDLFlBQVksRUFBRTtnQkFDWixJQUFJLEVBQUUsUUFBUTtnQkFDZCxJQUFJLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxNQUFNO2FBQy9CO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gsc0VBQXNFO1FBQ3RFLFVBQVUsQ0FBQyxlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQTtRQUUvQyx1RUFBdUU7UUFDdkUsbUJBQW1CLENBQUMsY0FBYyxDQUFDLGFBQWEsRUFBRSxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFeEUsVUFBVSxDQUFDLGNBQWMsQ0FBQztZQUN4QixRQUFRLEVBQUUsT0FBTztZQUNqQixTQUFTLEVBQUUsY0FBYztTQUMxQixDQUFDLENBQUM7UUFFSCxVQUFVLENBQUMsY0FBYyxDQUFDO1lBQ3hCLFFBQVEsRUFBRSxPQUFPO1lBQ2pCLFNBQVMsRUFBRSxVQUFVO1NBQ3RCLENBQUMsQ0FBQztRQUVILFVBQVUsQ0FBQyxjQUFjLENBQUM7WUFDeEIsUUFBUSxFQUFFLE9BQU87WUFDakIsU0FBUyxFQUFFLGFBQWE7U0FDekIsQ0FBQyxDQUFDO1FBRUgsVUFBVSxDQUFDLGNBQWMsQ0FBQztZQUN4QixRQUFRLEVBQUUsT0FBTztZQUNqQixTQUFTLEVBQUUsb0JBQW9CO1NBQ2hDLENBQUMsQ0FBQztRQUVILFVBQVUsQ0FBQyxjQUFjLENBQUM7WUFDeEIsUUFBUSxFQUFFLFVBQVU7WUFDcEIsU0FBUyxFQUFFLFlBQVk7U0FDeEIsQ0FBQyxDQUFDO1FBRUgsVUFBVSxDQUFDLGNBQWMsQ0FBQztZQUN4QixRQUFRLEVBQUUsVUFBVTtZQUNwQixTQUFTLEVBQUUsWUFBWTtTQUN4QixDQUFDLENBQUM7UUFFSCxVQUFVLENBQUMsY0FBYyxDQUFDO1lBQ3hCLFFBQVEsRUFBRSxVQUFVO1lBQ3BCLFNBQVMsRUFBRSxxQkFBcUI7U0FDakMsQ0FBQyxDQUFDO1FBRUgsVUFBVSxDQUFDLGNBQWMsQ0FBQztZQUN4QixRQUFRLEVBQUUsVUFBVTtZQUNwQixTQUFTLEVBQUUsa0JBQWtCO1NBQzlCLENBQUMsQ0FBQztRQUVILFVBQVUsQ0FBQyxjQUFjLENBQUM7WUFDeEIsUUFBUSxFQUFFLFVBQVU7WUFDcEIsU0FBUyxFQUFFLFlBQVk7U0FDeEIsQ0FBQyxDQUFDO1FBRUgsMERBQTBEO1FBQzFELElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsZUFBZSxFQUFFO1lBQ3hDLEtBQUssRUFBRSxHQUFHLENBQUMsVUFBVTtTQUNyQixDQUFDLENBQUM7UUFFSCx5REFBeUQ7UUFDekQsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxlQUFlLEVBQUU7WUFDdkMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxNQUFNLElBQUksRUFBRTtTQUN4QixDQUFDLENBQUM7UUFFSCw4Q0FBOEM7UUFDOUMsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxjQUFjLEVBQUU7WUFDdEMsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNO1NBQ25CLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQW5HRCw0Q0FtR0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBhcHBzeW5jIGZyb20gJ0Bhd3MtY2RrL2F3cy1hcHBzeW5jJztcbmltcG9ydCAqIGFzIGRkYiBmcm9tICdAYXdzLWNkay9hd3MtZHluYW1vZGInO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ0Bhd3MtY2RrL2F3cy1sYW1iZGEnO1xuXG5leHBvcnQgY2xhc3MgTG9hbmNyYWZ0QmVTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBjb25zdCBhcGkgPSBuZXcgYXBwc3luYy5HcmFwaHFsQXBpKHRoaXMsICdBcGknLCB7XG4gICAgICBuYW1lOiAnbG9hbkNyYWZ0LWNkaycsXG4gICAgICBzY2hlbWE6IGFwcHN5bmMuU2NoZW1hLmZyb21Bc3NldCgnZ3JhcGhxbC9zY2hlbWEuZ3JhcGhxbCcpLFxuICAgICAgYXV0aG9yaXphdGlvbkNvbmZpZzoge1xuICAgICAgICBkZWZhdWx0QXV0aG9yaXphdGlvbjoge1xuICAgICAgICAgIGF1dGhvcml6YXRpb25UeXBlOiBhcHBzeW5jLkF1dGhvcml6YXRpb25UeXBlLkFQSV9LRVlcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICB4cmF5RW5hYmxlZDogdHJ1ZSxcbiAgICB9KTtcblxuICAgIC8vIGxpYi9hcHBzeW5jLWNkay1hcHAtc3RhY2sudHNcbiAgICBjb25zdCBsb2Fuc0xhbWJkYVJlc291cmNlID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCAnQXBwU3luY0xvYW5zSGFuZGxlcicsIHtcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xMl9YLFxuICAgICAgaGFuZGxlcjogJ2Nvbm5lY3Rvci5oYW5kbGVyJyxcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldCgnbGFtZGFzJyksXG4gICAgICBtZW1vcnlTaXplOiAxMDI0XG4gICAgfSk7XG5cbiAgICAvLyBTZXQgdGhlIG5ldyBMYW1iZGEgZnVuY3Rpb24gYXMgYSBkYXRhIHNvdXJjZSBmb3IgdGhlIEFwcFN5bmMgQVBJXG4gICAgY29uc3QgbG9hbkxhbWJkYSA9IGFwaS5hZGRMYW1iZGFEYXRhU291cmNlKCdsYW1iZGFEYXRhc291cmNlJywgbG9hbnNMYW1iZGFSZXNvdXJjZSk7XG5cbiAgICBjb25zdCBMb2Fuc1RhYmxlID0gbmV3IGRkYi5UYWJsZSh0aGlzLCAnQ0RLTG9hbnNUYWJsZScsIHtcbiAgICAgIGJpbGxpbmdNb2RlOiBkZGIuQmlsbGluZ01vZGUuUEFZX1BFUl9SRVFVRVNULFxuICAgICAgcGFydGl0aW9uS2V5OiB7XG4gICAgICAgIG5hbWU6ICdsb2FuSUQnLFxuICAgICAgICB0eXBlOiBkZGIuQXR0cmlidXRlVHlwZS5TVFJJTkcsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIC8vIGVuYWJsZSB0aGUgTGFtYmRhIGZ1bmN0aW9uIHRvIGFjY2VzcyB0aGUgRHluYW1vREIgdGFibGUgKHVzaW5nIElBTSlcbiAgICBMb2Fuc1RhYmxlLmdyYW50RnVsbEFjY2Vzcyhsb2Fuc0xhbWJkYVJlc291cmNlKVxuICAgIFxuICAgIC8vIENyZWF0ZSBhbiBlbnZpcm9ubWVudCB2YXJpYWJsZSB0aGF0IHdlIHdpbGwgdXNlIGluIHRoZSBmdW5jdGlvbiBjb2RlXG4gICAgbG9hbnNMYW1iZGFSZXNvdXJjZS5hZGRFbnZpcm9ubWVudCgnTE9BTlNfVEFCTEUnLCBMb2Fuc1RhYmxlLnRhYmxlTmFtZSk7XG5cbiAgICBsb2FuTGFtYmRhLmNyZWF0ZVJlc29sdmVyKHtcbiAgICAgIHR5cGVOYW1lOiBcIlF1ZXJ5XCIsXG4gICAgICBmaWVsZE5hbWU6IFwiZ2V0RGFzaGJvYXJkXCJcbiAgICB9KTtcblxuICAgIGxvYW5MYW1iZGEuY3JlYXRlUmVzb2x2ZXIoe1xuICAgICAgdHlwZU5hbWU6IFwiUXVlcnlcIixcbiAgICAgIGZpZWxkTmFtZTogXCJnZXRMb2Fuc1wiXG4gICAgfSk7XG5cbiAgICBsb2FuTGFtYmRhLmNyZWF0ZVJlc29sdmVyKHtcbiAgICAgIHR5cGVOYW1lOiBcIlF1ZXJ5XCIsXG4gICAgICBmaWVsZE5hbWU6IFwiZ2V0TG9hbkJ5SURcIlxuICAgIH0pO1xuXG4gICAgbG9hbkxhbWJkYS5jcmVhdGVSZXNvbHZlcih7XG4gICAgICB0eXBlTmFtZTogXCJRdWVyeVwiLFxuICAgICAgZmllbGROYW1lOiBcImdldExvYW5IaXN0b3J5QnlJRFwiXG4gICAgfSk7XG5cbiAgICBsb2FuTGFtYmRhLmNyZWF0ZVJlc29sdmVyKHtcbiAgICAgIHR5cGVOYW1lOiBcIk11dGF0aW9uXCIsXG4gICAgICBmaWVsZE5hbWU6IFwiY3JlYXRlTG9hblwiXG4gICAgfSk7XG5cbiAgICBsb2FuTGFtYmRhLmNyZWF0ZVJlc29sdmVyKHtcbiAgICAgIHR5cGVOYW1lOiBcIk11dGF0aW9uXCIsXG4gICAgICBmaWVsZE5hbWU6IFwidXBkYXRlTG9hblwiXG4gICAgfSk7XG5cbiAgICBsb2FuTGFtYmRhLmNyZWF0ZVJlc29sdmVyKHtcbiAgICAgIHR5cGVOYW1lOiBcIk11dGF0aW9uXCIsXG4gICAgICBmaWVsZE5hbWU6IFwidXBkYXRlUGVuZGluZ0Ftb3VudFwiXG4gICAgfSk7XG5cbiAgICBsb2FuTGFtYmRhLmNyZWF0ZVJlc29sdmVyKHtcbiAgICAgIHR5cGVOYW1lOiBcIk11dGF0aW9uXCIsXG4gICAgICBmaWVsZE5hbWU6IFwiY2hhbmdlTG9hblN0YXR1c1wiXG4gICAgfSk7XG5cbiAgICBsb2FuTGFtYmRhLmNyZWF0ZVJlc29sdmVyKHtcbiAgICAgIHR5cGVOYW1lOiBcIk11dGF0aW9uXCIsXG4gICAgICBmaWVsZE5hbWU6IFwiZGVsZXRlTG9hblwiXG4gICAgfSk7XG5cbiAgICAvLyBQcmludHMgb3V0IHRoZSBBcHBTeW5jIEdyYXBoUUwgZW5kcG9pbnQgdG8gdGhlIHRlcm1pbmFsXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgXCJHcmFwaFFMQVBJVVJMXCIsIHtcbiAgICAgdmFsdWU6IGFwaS5ncmFwaHFsVXJsXG4gICAgfSk7XG5cbiAgICAvLyBQcmludHMgb3V0IHRoZSBBcHBTeW5jIEdyYXBoUUwgQVBJIGtleSB0byB0aGUgdGVybWluYWxcbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCBcIkdyYXBoUUxBUElLZXlcIiwge1xuICAgICAgdmFsdWU6IGFwaS5hcGlLZXkgfHwgJydcbiAgICB9KTtcblxuICAgIC8vIFByaW50cyBvdXQgdGhlIHN0YWNrIHJlZ2lvbiB0byB0aGUgdGVybWluYWxcbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCBcIlN0YWNrIFJlZ2lvblwiLCB7XG4gICAgICB2YWx1ZTogdGhpcy5yZWdpb25cbiAgICB9KTtcbiAgfVxufVxuIl19