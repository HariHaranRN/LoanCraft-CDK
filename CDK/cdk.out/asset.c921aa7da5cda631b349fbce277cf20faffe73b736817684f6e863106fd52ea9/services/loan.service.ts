const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

export class LoanService {

    static async getDashboard(){
        const params = {
            TableName: process.env.LOANS_TABLE,
        }
        console.log("inside getDashboard");
        try {
            const data = await docClient.scan(params).promise()
            console.log("outside getDashboard")
            return data.Items
        } catch (err) {
            console.log('DynamoDB error: ', err)
            return null
        }
    }

    static async getLoans(isActive: boolean){

    }

    static async getLoanByID(loanID: string){

    }

    static async createLoan(loan: any){
        try {
            console.log("inside createLoan");
            const dbData = await this.getDashboard();
            const items = {
                loanID: "LC-100000" + dbData.length,
                isActive: true,
                ...loan
            }
            const params = {
                TableName: process.env.LOANS_TABLE,
                Item: items
            }
            const result = await docClient.put(params).promise();
            console.log("ouyside createLoan");
            return result;
        } catch (err) {
            console.log('DynamoDB error: ', err)
            return null
        }
    }

    static async updateLoan(loan: any){

    }

    static async deleteLoan(loanID: string){
        
    }
}