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
            console.log("inside getLoanHistoryByID");
            const data = await docClient.scan(params).promise();
            console.log("outSide getLoanHistoryByID");
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
            const dateAndTime = new Date();
            const items = {
                loanID: "HISTORY-" + loanID + "-" + (10000 + historyData.length + Math.floor(Math.random() * 100)),
                interestPaid: interestPaid,
                historyLoanId: loanID,
                date: JSON.stringify(dateAndTime)
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