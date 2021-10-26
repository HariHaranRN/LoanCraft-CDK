const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

export class LoanService {

    static async getDashboard(){
        const params = {
            TableName: process.env.LOANS_TABLE,
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
                loanID: "LC-" + (10000 + await dbData.length),
                isActive: true,
                ...loan
            }
            const params = {
                TableName: process.env.LOANS_TABLE,
                Item: items
            }
            await docClient.put(params).promise();
            console.log("outside createLoan");
            return loan;
        } catch (err) {
            console.log('DynamoDB error: ', err);
            return null;
        }
    }

    static async updateLoan(loan: any){
        console.log(loan);
        const params = {
            TableName: process.env.LOANS_TABLE,
            Key: {
              loanID: loan.loanID,
            },
            UpdateExpression: 'SET #name=:name, #parentName=:parentName, #date=:date, mobile=:mobile, #aMobile=:aMobile, #address=:address, #amount=:amount, interest=:interest, #notes=:notes',
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

    static async closeLoan(loanID: any){

    }

    static async deleteLoan(loanID: string){
        
    }
}