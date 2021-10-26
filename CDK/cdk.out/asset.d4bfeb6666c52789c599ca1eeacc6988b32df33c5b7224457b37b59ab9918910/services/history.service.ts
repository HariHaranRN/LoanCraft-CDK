const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

export class HistoryService {

    static async getLoanHistoryByID(loanID: string){
        const params = {
            TableName: process.env.LOANS_TABLE,
            FilterExpression: 'begins_with(#loanID, :loanID) And #historyLoanId=:historyLoanId',
            ExpressionAttributeValues: {
            ':loanID': 'HISTORY',
            ':historyLoanId': loanID
            },
            ExpressionAttributeNames: {
            '#loanID': 'loanID',
            '#historyLoanId': 'historyLoanId'
            },
        }
        try {
            console.log("inside getLoans");
            const data = await docClient.scan(params).promise();
            console.log("outSide getloans", data.Items);
            return data.Items;
        } catch (err) {
            console.log('DynamoDB error: ', err);
            return null;
        }
    }

    static async updateHistory(loanID: string, interestPaid: number){

        try {
            console.log("inside updateHistory");
            const historyData = await this.getLoanHistoryByID(loanID);
            const items = {
                loanID: "HISTORY-"+ (10000 + historyData.length + Math.floor(Math.random() * 100)),
                interestPaid: interestPaid,
                historyLoanId: loanID,
                date: new Date()
            }
            const params = {
                TableName: process.env.LOANS_TABLE,
                Item: items
            }
            await docClient.put(params).promise();
            console.log("outside updateHistory");
            return [];
        } catch (err) {
            console.log('DynamoDB error: ', err);
            return null;
        }
    }
}