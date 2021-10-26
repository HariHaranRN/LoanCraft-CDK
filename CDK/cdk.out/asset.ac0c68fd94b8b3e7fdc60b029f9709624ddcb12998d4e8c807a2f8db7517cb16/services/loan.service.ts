import { HistoryService } from "./history.service";

const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

export class LoanService {

    static async getDashboard(){
        const params = {
            TableName: process.env.LOANS_TABLE,
            FilterExpression: 'begins_with(#loanID, :loanID)',
            ExpressionAttributeValues: {
            ':loanID': "LC",
            },
            ExpressionAttributeNames: {
            '#loanID': 'loanID',
            },
        }
        console.log("inside getDashboard");
        try {
            const data = await docClient.scan(params).promise();
            console.log("outside getDashboard");
            return data.Items;
        } catch (err) {
            console.log('DynamoDB error: ', err);
            return null;
        }
    }

    static async getLoans(isActive: boolean){
        const params = {
            TableName: process.env.LOANS_TABLE,
            FilterExpression: '#isActive = :isActive',
            ExpressionAttributeValues: {
            ':isActive': isActive,
            },
            ExpressionAttributeNames: {
            '#isActive': 'isActive',
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

    static async getLoanByID(loanID: string){
        const params = {
            TableName: process.env.LOANS_TABLE,
            FilterExpression: '#loanID = :loanID',
            ExpressionAttributeValues: {
            ':loanID': loanID,
            },
            ExpressionAttributeNames: {
            '#loanID': 'loanID',
            },
        }
        try {
            console.log("inside getLoanByID");
            const data = await docClient.scan(params).promise();
            console.log("outSide getLoanByID");
            return data.Items;
        } catch (err) {
            console.log('DynamoDB error: ', err);
            return null;
        }
    }

    static async createLoan(loan: any){
        try {
            console.log("inside createLoan");
            const dbData = await this.getDashboard();
            const items = {
                loanID: "LC-" + (10000 + dbData.length + Math.floor(Math.random() * 100)),
                isActive: true,
                ...loan
            }
            const params = {
                TableName: process.env.LOANS_TABLE,
                Item: items,
                ReturnValues: 'ALL_NEW',
            }
            const result = await docClient.put(params).promise();
            console.log("outside createLoan");
            return result.Attributes;
        } catch (err) {
            console.log('DynamoDB error: ', err);
            return null;
        }
    }

    static async updateLoan(loan: any){
        const params = {
            TableName: process.env.LOANS_TABLE,
            Key: {
              loanID: loan.loanID,
            },
            UpdateExpression: 'SET #name=:name, #parentName=:parentName, #date=:date, #mobile=:mobile, #aMobile=:aMobile, #address=:address, #amount=:amount, #interest=:interest, #notes=:notes',
            ExpressionAttributeValues: {
              ':name': loan.name,
              ':parentName': loan.parentName,
              ':date': loan.date,
              ':mobile': loan.mobile,
              ':aMobile': loan.aMobile,
              ':address': loan.address,
              ':amount': loan.amount,
              ':interest': loan.interest,
              ':notes': loan.notes
            },
            ExpressionAttributeNames: {
              '#name': 'name',
              '#parentName': 'parentName',
              '#date': 'date',
              '#mobile': 'mobile',
              '#aMobile': 'aMobile',
              '#address': 'address',
              '#amount': 'amount',
              '#interest': 'interest',
              '#notes': 'notes'
            },
            ReturnValues: 'ALL_NEW',
        };

        try {
            const result = await docClient.update(params).promise();
            return result.Attributes;
        } catch (err) {
            console.log('DynamoDB error: ', err);
            return null;
        }
    }

    static async changeLoanStatus(loanID: string, isActive: boolean){
        const params = {
            TableName: process.env.LOANS_TABLE,
            Key: {
              loanID: loanID,
            },
            UpdateExpression: 'SET #isActive=:isActive',
            ExpressionAttributeValues: {
              ':isActive': isActive,
            },
            ExpressionAttributeNames: {
              '#isActive': 'isActive',
            },
            ReturnValues: 'ALL_NEW',
        };

        try {
            const result = await docClient.update(params).promise();
            return result.Attributes;
        } catch (err) {
            console.log('DynamoDB error: ', err);
            return null;
        }
    }

    static async updatePendingAmount(loanID: string, interestPaid: number){
        const params = {
            TableName: process.env.LOANS_TABLE,
            Key: {
              loanID: loanID,
            },
            UpdateExpression: 'SET #interestPaid=:interestPaid',
            ExpressionAttributeValues: {
              ':interestPaid': interestPaid,
            },
            ExpressionAttributeNames: {
              '#interestPaid': 'interestPaid',
            },
            ReturnValues: 'ALL_NEW',
        };

        try {
            const result = await docClient.update(params).promise();
            await HistoryService.updateHistory(loanID, interestPaid);
            return result.Attributes;
        } catch (err) {
            console.log('DynamoDB error: ', err);
            return null;
        }
    }

    static async deleteLoan(loanID: string){
        const params = {
            TableName: process.env.LOANS_TABLE,
            Key: {
                loanID: loanID
            }
        }
        try {
            await docClient.delete(params).promise()
            return loanID
        } catch (err) {
            console.log('DynamoDB error: ', err)
            return null
        }
    }
}