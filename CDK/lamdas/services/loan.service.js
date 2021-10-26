"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoanService = void 0;
const history_service_1 = require("./history.service");
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
class LoanService {
    static async getDashboard() {
        const params = {
            TableName: process.env.LOANS_TABLE,
            FilterExpression: 'begins_with(#loanID, :loanID)',
            ExpressionAttributeValues: {
                ':loanID': "LC",
            },
            ExpressionAttributeNames: {
                '#loanID': 'loanID',
            },
        };
        console.log("inside getDashboard");
        try {
            const data = await docClient.scan(params).promise();
            console.log("outside getDashboard");
            return data.Items;
        }
        catch (err) {
            console.log('DynamoDB error: ', err);
            return null;
        }
    }
    static async getLoans(isActive) {
        const params = {
            TableName: process.env.LOANS_TABLE,
            FilterExpression: '#isActive = :isActive',
            ExpressionAttributeValues: {
                ':isActive': isActive,
            },
            ExpressionAttributeNames: {
                '#isActive': 'isActive',
            },
        };
        try {
            console.log("inside getLoans");
            const data = await docClient.scan(params).promise();
            console.log("outSide getloans", data.Items);
            return data.Items;
        }
        catch (err) {
            console.log('DynamoDB error: ', err);
            return null;
        }
    }
    static async getLoanByID(loanID) {
        const params = {
            TableName: process.env.LOANS_TABLE,
            FilterExpression: '#loanID = :loanID',
            ExpressionAttributeValues: {
                ':loanID': loanID,
            },
            ExpressionAttributeNames: {
                '#loanID': 'loanID',
            },
        };
        try {
            console.log("inside getLoanByID");
            const data = await docClient.scan(params).promise();
            console.log("outSide getLoanByID");
            return data.Items;
        }
        catch (err) {
            console.log('DynamoDB error: ', err);
            return null;
        }
    }
    static async createLoan(loan) {
        try {
            console.log("inside createLoan");
            const dbData = await this.getDashboard();
            const items = {
                loanID: "LC-" + (100000 + dbData.length + Math.floor(Math.random() * 10000)),
                isActive: true,
                ...loan
            };
            const params = {
                TableName: process.env.LOANS_TABLE,
                Item: items,
            };
            await docClient.put(params).promise();
            console.log("outside createLoan");
            return loan;
        }
        catch (err) {
            console.log('DynamoDB error: ', err);
            return null;
        }
    }
    static async updateLoan(loan) {
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
        }
        catch (err) {
            console.log('DynamoDB error: ', err);
            return null;
        }
    }
    static async changeLoanStatus(loanID, isActive) {
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
        }
        catch (err) {
            console.log('DynamoDB error: ', err);
            return null;
        }
    }
    static async updatePendingAmount(loanID, interestPaid, dateOfPaid) {
        const loan = await this.getLoanByID(loanID);
        const totalPaid = interestPaid + loan[0].interestPaid;
        console.log(totalPaid);
        const params = {
            TableName: process.env.LOANS_TABLE,
            Key: {
                loanID: loanID,
            },
            UpdateExpression: 'SET #interestPaid=:interestPaid',
            ExpressionAttributeValues: {
                ':interestPaid': parseInt(totalPaid),
            },
            ExpressionAttributeNames: {
                '#interestPaid': 'interestPaid',
            },
            ReturnValues: 'ALL_NEW',
        };
        try {
            const result = await docClient.update(params).promise();
            await history_service_1.HistoryService.updateHistory(loanID, interestPaid, dateOfPaid);
            return result.Attributes;
        }
        catch (err) {
            console.log('DynamoDB error: ', err);
            return null;
        }
    }
    static async deleteLoan(loanID) {
        const params = {
            TableName: process.env.LOANS_TABLE,
            Key: {
                loanID: loanID
            }
        };
        try {
            await docClient.delete(params).promise();
            return loanID;
        }
        catch (err) {
            console.log('DynamoDB error: ', err);
            return null;
        }
    }
}
exports.LoanService = LoanService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hbi5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibG9hbi5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHVEQUFtRDtBQUVuRCxNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDL0IsTUFBTSxTQUFTLEdBQUcsSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBRXBELE1BQWEsV0FBVztJQUVwQixNQUFNLENBQUMsS0FBSyxDQUFDLFlBQVk7UUFDckIsTUFBTSxNQUFNLEdBQUc7WUFDWCxTQUFTLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXO1lBQ2xDLGdCQUFnQixFQUFFLCtCQUErQjtZQUNqRCx5QkFBeUIsRUFBRTtnQkFDM0IsU0FBUyxFQUFFLElBQUk7YUFDZDtZQUNELHdCQUF3QixFQUFFO2dCQUMxQixTQUFTLEVBQUUsUUFBUTthQUNsQjtTQUNKLENBQUE7UUFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDLENBQUM7UUFDbkMsSUFBSTtZQUNBLE1BQU0sSUFBSSxHQUFHLE1BQU0sU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNwRCxPQUFPLENBQUMsR0FBRyxDQUFDLHNCQUFzQixDQUFDLENBQUM7WUFDcEMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO1NBQ3JCO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDVixPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ3JDLE9BQU8sSUFBSSxDQUFDO1NBQ2Y7SUFDTCxDQUFDO0lBRUQsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsUUFBaUI7UUFDbkMsTUFBTSxNQUFNLEdBQUc7WUFDWCxTQUFTLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXO1lBQ2xDLGdCQUFnQixFQUFFLHVC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RUFBRSxjQUFjO2FBQ2hDO1lBQ0QsWUFBWSxFQUFFLFNBQVM7U0FDMUIsQ0FBQztRQUVGLElBQUk7WUFDQSxNQUFNLE1BQU0sR0FBRyxNQUFNLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDeEQsTUFBTSxnQ0FBYyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsWUFBWSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQ3JFLE9BQU8sTUFBTSxDQUFDLFVBQVUsQ0FBQztTQUM1QjtRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNyQyxPQUFPLElBQUksQ0FBQztTQUNmO0lBQ0wsQ0FBQztJQUVELE1BQU0sQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLE1BQWM7UUFDbEMsTUFBTSxNQUFNLEdBQUc7WUFDWCxTQUFTLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXO1lBQ2xDLEdBQUcsRUFBRTtnQkFDRCxNQUFNLEVBQUUsTUFBTTthQUNqQjtTQUNKLENBQUE7UUFDRCxJQUFJO1lBQ0EsTUFBTSxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFBO1lBQ3hDLE9BQU8sTUFBTSxDQUFBO1NBQ2hCO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDVixPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLEdBQUcsQ0FBQyxDQUFBO1lBQ3BDLE9BQU8sSUFBSSxDQUFBO1NBQ2Q7SUFDTCxDQUFDO0NBQ0o7QUF4TUQsa0NBd01DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSGlzdG9yeVNlcnZpY2UgfSBmcm9tIFwiLi9oaXN0b3J5LnNlcnZpY2VcIjtcblxuY29uc3QgQVdTID0gcmVxdWlyZSgnYXdzLXNkaycpO1xuY29uc3QgZG9jQ2xpZW50ID0gbmV3IEFXUy5EeW5hbW9EQi5Eb2N1bWVudENsaWVudCgpO1xuXG5leHBvcnQgY2xhc3MgTG9hblNlcnZpY2Uge1xuXG4gICAgc3RhdGljIGFzeW5jIGdldERhc2hib2FyZCgpe1xuICAgICAgICBjb25zdCBwYXJhbXMgPSB7XG4gICAgICAgICAgICBUYWJsZU5hbWU6IHByb2Nlc3MuZW52LkxPQU5TX1RBQkxFLFxuICAgICAgICAgICAgRmlsdGVyRXhwcmVzc2lvbjogJ2JlZ2luc193aXRoKCNsb2FuSUQsIDpsb2FuSUQpJyxcbiAgICAgICAgICAgIEV4cHJlc3Npb25BdHRyaWJ1dGVWYWx1ZXM6IHtcbiAgICAgICAgICAgICc6bG9hbklEJzogXCJMQ1wiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEV4cHJlc3Npb25BdHRyaWJ1dGVOYW1lczoge1xuICAgICAgICAgICAgJyNsb2FuSUQnOiAnbG9hbklEJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coXCJpbnNpZGUgZ2V0RGFzaGJvYXJkXCIpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IGRvY0NsaWVudC5zY2FuKHBhcmFtcykucHJvbWlzZSgpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJvdXRzaWRlIGdldERhc2hib2FyZFwiKTtcbiAgICAgICAgICAgIHJldHVybiBkYXRhLkl0ZW1zO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdEeW5hbW9EQiBlcnJvcjogJywgZXJyKTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIGFzeW5jIGdldExvYW5zKGlzQWN0aXZlOiBib29sZWFuKXtcbiAgICAgICAgY29uc3QgcGFyYW1zID0ge1xuICAgICAgICAgICAgVGFibGVOYW1lOiBwcm9jZXNzLmVudi5MT0FOU19UQUJMRSxcbiAgICAgICAgICAgIEZpbHRlckV4cHJlc3Npb246ICcjaXNBY3RpdmUgPSA6aXNBY3RpdmUnLFxuICAgICAgICAgICAgRXhwcmVzc2lvbkF0dHJpYnV0ZVZhbHVlczoge1xuICAgICAgICAgICAgJzppc0FjdGl2ZSc6IGlzQWN0aXZlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEV4cHJlc3Npb25BdHRyaWJ1dGVOYW1lczoge1xuICAgICAgICAgICAgJyNpc0FjdGl2ZSc6ICdpc0FjdGl2ZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICB9XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImluc2lkZSBnZXRMb2Fuc1wiKTtcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBkb2NDbGllbnQuc2NhbihwYXJhbXMpLnByb21pc2UoKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwib3V0U2lkZSBnZXRsb2Fuc1wiLCBkYXRhLkl0ZW1zKTtcbiAgICAgICAgICAgIHJldHVybiBkYXRhLkl0ZW1zO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdEeW5hbW9EQiBlcnJvcjogJywgZXJyKTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIGFzeW5jIGdldExvYW5CeUlEKGxvYW5JRDogc3RyaW5nKXtcbiAgICAgICAgY29uc3QgcGFyYW1zID0ge1xuICAgICAgICAgICAgVGFibGVOYW1lOiBwcm9jZXNzLmVudi5MT0FOU19UQUJMRSxcbiAgICAgICAgICAgIEZpbHRlckV4cHJlc3Npb246ICcjbG9hbklEID0gOmxvYW5JRCcsXG4gICAgICAgICAgICBFeHByZXNzaW9uQXR0cmlidXRlVmFsdWVzOiB7XG4gICAgICAgICAgICAnOmxvYW5JRCc6IGxvYW5JRCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBFeHByZXNzaW9uQXR0cmlidXRlTmFtZXM6IHtcbiAgICAgICAgICAgICcjbG9hbklEJzogJ2xvYW5JRCcsXG4gICAgICAgICAgICB9LFxuICAgICAgICB9XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImluc2lkZSBnZXRMb2FuQnlJRFwiKTtcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBkb2NDbGllbnQuc2NhbihwYXJhbXMpLnByb21pc2UoKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwib3V0U2lkZSBnZXRMb2FuQnlJRFwiKTtcbiAgICAgICAgICAgIHJldHVybiBkYXRhLkl0ZW1zO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdEeW5hbW9EQiBlcnJvcjogJywgZXJyKTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIGFzeW5jIGNyZWF0ZUxvYW4obG9hbjogYW55KXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaW5zaWRlIGNyZWF0ZUxvYW5cIik7XG4gICAgICAgICAgICBjb25zdCBkYkRhdGEgPSBhd2FpdCB0aGlzLmdldERhc2hib2FyZCgpO1xuICAgICAgICAgICAgY29uc3QgaXRlbXMgPSB7XG4gICAgICAgICAgICAgICAgbG9hbklEOiBcIkxDLVwiICsgKDEwMDAwMCArIGRiRGF0YS5sZW5ndGggKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDAwMCkpLFxuICAgICAgICAgICAgICAgIGlzQWN0aXZlOiB0cnVlLFxuICAgICAgICAgICAgICAgIC4uLmxvYW5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHBhcmFtcyA9IHtcbiAgICAgICAgICAgICAgICBUYWJsZU5hbWU6IHByb2Nlc3MuZW52LkxPQU5TX1RBQkxFLFxuICAgICAgICAgICAgICAgIEl0ZW06IGl0ZW1zLFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYXdhaXQgZG9jQ2xpZW50LnB1dChwYXJhbXMpLnByb21pc2UoKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwib3V0c2lkZSBjcmVhdGVMb2FuXCIpO1xuICAgICAgICAgICAgcmV0dXJuIGxvYW47XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0R5bmFtb0RCIGVycm9yOiAnLCBlcnIpO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgYXN5bmMgdXBkYXRlTG9hbihsb2FuOiBhbnkpe1xuICAgICAgICBjb25zdCBwYXJhbXMgPSB7XG4gICAgICAgICAgICBUYWJsZU5hbWU6IHByb2Nlc3MuZW52LkxPQU5TX1RBQkxFLFxuICAgICAgICAgICAgS2V5OiB7XG4gICAgICAgICAgICAgIGxvYW5JRDogbG9hbi5sb2FuSUQsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgVXBkYXRlRXhwcmVzc2lvbjogJ1NFVCAjbmFtZT06bmFtZSwgI3BhcmVudE5hbWU9OnBhcmVudE5hbWUsICNkYXRlPTpkYXRlLCAjbW9iaWxlPTptb2JpbGUsICNhTW9iaWxlPTphTW9iaWxlLCAjYWRkcmVzcz06YWRkcmVzcywgI2Ftb3VudD06YW1vdW50LCAjaW50ZXJlc3Q9OmludGVyZXN0LCAjbm90ZXM9Om5vdGVzJyxcbiAgICAgICAgICAgIEV4cHJlc3Npb25BdHRyaWJ1dGVWYWx1ZXM6IHtcbiAgICAgICAgICAgICAgJzpuYW1lJzogbG9hbi5uYW1lLFxuICAgICAgICAgICAgICAnOnBhcmVudE5hbWUnOiBsb2FuLnBhcmVudE5hbWUsXG4gICAgICAgICAgICAgICc6ZGF0ZSc6IGxvYW4uZGF0ZSxcbiAgICAgICAgICAgICAgJzptb2JpbGUnOiBsb2FuLm1vYmlsZSxcbiAgICAgICAgICAgICAgJzphTW9iaWxlJzogbG9hbi5hTW9iaWxlLFxuICAgICAgICAgICAgICAnOmFkZHJlc3MnOiBsb2FuLmFkZHJlc3MsXG4gICAgICAgICAgICAgICc6YW1vdW50JzogbG9hbi5hbW91bnQsXG4gICAgICAgICAgICAgICc6aW50ZXJlc3QnOiBsb2FuLmludGVyZXN0LFxuICAgICAgICAgICAgICAnOm5vdGVzJzogbG9hbi5ub3Rlc1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEV4cHJlc3Npb25BdHRyaWJ1dGVOYW1lczoge1xuICAgICAgICAgICAgICAnI25hbWUnOiAnbmFtZScsXG4gICAgICAgICAgICAgICcjcGFyZW50TmFtZSc6ICdwYXJlbnROYW1lJyxcbiAgICAgICAgICAgICAgJyNkYXRlJzogJ2RhdGUnLFxuICAgICAgICAgICAgICAnI21vYmlsZSc6ICdtb2JpbGUnLFxuICAgICAgICAgICAgICAnI2FNb2JpbGUnOiAnYU1vYmlsZScsXG4gICAgICAgICAgICAgICcjYWRkcmVzcyc6ICdhZGRyZXNzJyxcbiAgICAgICAgICAgICAgJyNhbW91bnQnOiAnYW1vdW50JyxcbiAgICAgICAgICAgICAgJyNpbnRlcmVzdCc6ICdpbnRlcmVzdCcsXG4gICAgICAgICAgICAgICcjbm90ZXMnOiAnbm90ZXMnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgUmV0dXJuVmFsdWVzOiAnQUxMX05FVycsXG4gICAgICAgIH07XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGRvY0NsaWVudC51cGRhdGUocGFyYW1zKS5wcm9taXNlKCk7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0LkF0dHJpYnV0ZXM7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0R5bmFtb0RCIGVycm9yOiAnLCBlcnIpO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgYXN5bmMgY2hhbmdlTG9hblN0YXR1cyhsb2FuSUQ6IHN0cmluZywgaXNBY3RpdmU6IGJvb2xlYW4pe1xuICAgICAgICBjb25zdCBwYXJhbXMgPSB7XG4gICAgICAgICAgICBUYWJsZU5hbWU6IHByb2Nlc3MuZW52LkxPQU5TX1RBQkxFLFxuICAgICAgICAgICAgS2V5OiB7XG4gICAgICAgICAgICAgIGxvYW5JRDogbG9hbklELFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFVwZGF0ZUV4cHJlc3Npb246ICdTRVQgI2lzQWN0aXZlPTppc0FjdGl2ZScsXG4gICAgICAgICAgICBFeHByZXNzaW9uQXR0cmlidXRlVmFsdWVzOiB7XG4gICAgICAgICAgICAgICc6aXNBY3RpdmUnOiBpc0FjdGl2ZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBFeHByZXNzaW9uQXR0cmlidXRlTmFtZXM6IHtcbiAgICAgICAgICAgICAgJyNpc0FjdGl2ZSc6ICdpc0FjdGl2ZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgUmV0dXJuVmFsdWVzOiAnQUxMX05FVycsXG4gICAgICAgIH07XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGRvY0NsaWVudC51cGRhdGUocGFyYW1zKS5wcm9taXNlKCk7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0LkF0dHJpYnV0ZXM7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0R5bmFtb0RCIGVycm9yOiAnLCBlcnIpO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgYXN5bmMgdXBkYXRlUGVuZGluZ0Ftb3VudChsb2FuSUQ6IHN0cmluZywgaW50ZXJlc3RQYWlkOiBudW1iZXIsIGRhdGVPZlBhaWQ6IHN0cmluZyl7XG4gICAgICAgIGNvbnN0IGxvYW4gPSBhd2FpdCB0aGlzLmdldExvYW5CeUlEKGxvYW5JRClcbiAgICAgICAgY29uc3QgdG90YWxQYWlkID0gaW50ZXJlc3RQYWlkICsgbG9hblswXS5pbnRlcmVzdFBhaWQ7XG4gICAgICAgIGNvbnNvbGUubG9nKHRvdGFsUGFpZCk7XG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IHtcbiAgICAgICAgICAgIFRhYmxlTmFtZTogcHJvY2Vzcy5lbnYuTE9BTlNfVEFCTEUsXG4gICAgICAgICAgICBLZXk6IHtcbiAgICAgICAgICAgICAgbG9hbklEOiBsb2FuSUQsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgVXBkYXRlRXhwcmVzc2lvbjogJ1NFVCAjaW50ZXJlc3RQYWlkPTppbnRlcmVzdFBhaWQnLFxuICAgICAgICAgICAgRXhwcmVzc2lvbkF0dHJpYnV0ZVZhbHVlczoge1xuICAgICAgICAgICAgICAnOmludGVyZXN0UGFpZCc6IHBhcnNlSW50KHRvdGFsUGFpZCksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRXhwcmVzc2lvbkF0dHJpYnV0ZU5hbWVzOiB7XG4gICAgICAgICAgICAgICcjaW50ZXJlc3RQYWlkJzogJ2ludGVyZXN0UGFpZCcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgUmV0dXJuVmFsdWVzOiAnQUxMX05FVycsXG4gICAgICAgIH07XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGRvY0NsaWVudC51cGRhdGUocGFyYW1zKS5wcm9taXNlKCk7XG4gICAgICAgICAgICBhd2FpdCBIaXN0b3J5U2VydmljZS51cGRhdGVIaXN0b3J5KGxvYW5JRCwgaW50ZXJlc3RQYWlkLCBkYXRlT2ZQYWlkKTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQuQXR0cmlidXRlcztcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnRHluYW1vREIgZXJyb3I6ICcsIGVycik7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBhc3luYyBkZWxldGVMb2FuKGxvYW5JRDogc3RyaW5nKXtcbiAgICAgICAgY29uc3QgcGFyYW1zID0ge1xuICAgICAgICAgICAgVGFibGVOYW1lOiBwcm9jZXNzLmVudi5MT0FOU19UQUJMRSxcbiAgICAgICAgICAgIEtleToge1xuICAgICAgICAgICAgICAgIGxvYW5JRDogbG9hbklEXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGF3YWl0IGRvY0NsaWVudC5kZWxldGUocGFyYW1zKS5wcm9taXNlKClcbiAgICAgICAgICAgIHJldHVybiBsb2FuSURcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnRHluYW1vREIgZXJyb3I6ICcsIGVycilcbiAgICAgICAgICAgIHJldHVybiBudWxsXG4gICAgICAgIH1cbiAgICB9XG59Il19