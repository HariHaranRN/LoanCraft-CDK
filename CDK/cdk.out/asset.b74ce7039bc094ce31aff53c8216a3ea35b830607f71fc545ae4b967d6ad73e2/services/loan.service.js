"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoanService = void 0;
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
class LoanService {
    static async getDashboard() {
        const params = {
            TableName: process.env.LOANS_TABLE,
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
                loanID: "LC-" + (10000 + await dbData.length),
                isActive: true,
                ...loan
            };
            const params = {
                TableName: process.env.LOANS_TABLE,
                Item: items
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
    static async updatePendingAmount(loanID, interestPaid) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hbi5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibG9hbi5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUMvQixNQUFNLFNBQVMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsY0FBYyxFQUFFLENBQUM7QUFFcEQsTUFBYSxXQUFXO0lBRXBCLE1BQU0sQ0FBQyxLQUFLLENBQUMsWUFBWTtRQUNyQixNQUFNLE1BQU0sR0FBRztZQUNYLFNBQVMsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVc7U0FDckMsQ0FBQTtRQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsQ0FBQztRQUNuQyxJQUFJO1lBQ0EsTUFBTSxJQUFJLEdBQUcsTUFBTSxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ3BELE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLENBQUMsQ0FBQztZQUNwQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7U0FDckI7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDckMsT0FBTyxJQUFJLENBQUM7U0FDZjtJQUNMLENBQUM7SUFFRCxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxRQUFpQjtRQUNuQyxNQUFNLE1BQU0sR0FBRztZQUNYLFNBQVMsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVc7WUFDbEMsZ0JBQWdCLEVBQUUsdUJBQXVCO1lBQ3pDLHlCQUF5QixFQUFFO2dCQUMzQixXQUFXLEVBQUUsUUFBUTthQUNwQjtZQUNELHdCQUF3QixFQUFFO2dCQUMxQixXQUFXLEVBQUUsVUFBVTthQUN0QjtTQUNKLENBQUE7UUFDRCxJQUFJO1lBQ0EsT0FBTyxD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RCxNQUFNLEVBQUUsTUFBTTthQUNqQjtTQUNKLENBQUE7UUFDRCxJQUFJO1lBQ0EsTUFBTSxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFBO1lBQ3hDLE9BQU8sTUFBTSxDQUFBO1NBQ2hCO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDVixPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLEdBQUcsQ0FBQyxDQUFBO1lBQ3BDLE9BQU8sSUFBSSxDQUFBO1NBQ2Q7SUFDTCxDQUFDO0NBQ0o7QUE1TEQsa0NBNExDIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgQVdTID0gcmVxdWlyZSgnYXdzLXNkaycpO1xuY29uc3QgZG9jQ2xpZW50ID0gbmV3IEFXUy5EeW5hbW9EQi5Eb2N1bWVudENsaWVudCgpO1xuXG5leHBvcnQgY2xhc3MgTG9hblNlcnZpY2Uge1xuXG4gICAgc3RhdGljIGFzeW5jIGdldERhc2hib2FyZCgpe1xuICAgICAgICBjb25zdCBwYXJhbXMgPSB7XG4gICAgICAgICAgICBUYWJsZU5hbWU6IHByb2Nlc3MuZW52LkxPQU5TX1RBQkxFLFxuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKFwiaW5zaWRlIGdldERhc2hib2FyZFwiKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBkb2NDbGllbnQuc2NhbihwYXJhbXMpLnByb21pc2UoKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwib3V0c2lkZSBnZXREYXNoYm9hcmRcIik7XG4gICAgICAgICAgICByZXR1cm4gZGF0YS5JdGVtcztcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnRHluYW1vREIgZXJyb3I6ICcsIGVycik7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBhc3luYyBnZXRMb2Fucyhpc0FjdGl2ZTogYm9vbGVhbil7XG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IHtcbiAgICAgICAgICAgIFRhYmxlTmFtZTogcHJvY2Vzcy5lbnYuTE9BTlNfVEFCTEUsXG4gICAgICAgICAgICBGaWx0ZXJFeHByZXNzaW9uOiAnI2lzQWN0aXZlID0gOmlzQWN0aXZlJyxcbiAgICAgICAgICAgIEV4cHJlc3Npb25BdHRyaWJ1dGVWYWx1ZXM6IHtcbiAgICAgICAgICAgICc6aXNBY3RpdmUnOiBpc0FjdGl2ZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBFeHByZXNzaW9uQXR0cmlidXRlTmFtZXM6IHtcbiAgICAgICAgICAgICcjaXNBY3RpdmUnOiAnaXNBY3RpdmUnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfVxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJpbnNpZGUgZ2V0TG9hbnNcIik7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgZG9jQ2xpZW50LnNjYW4ocGFyYW1zKS5wcm9taXNlKCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm91dFNpZGUgZ2V0bG9hbnNcIiwgZGF0YS5JdGVtcyk7XG4gICAgICAgICAgICByZXR1cm4gZGF0YS5JdGVtcztcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnRHluYW1vREIgZXJyb3I6ICcsIGVycik7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBhc3luYyBnZXRMb2FuQnlJRChsb2FuSUQ6IHN0cmluZyl7XG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IHtcbiAgICAgICAgICAgIFRhYmxlTmFtZTogcHJvY2Vzcy5lbnYuTE9BTlNfVEFCTEUsXG4gICAgICAgICAgICBGaWx0ZXJFeHByZXNzaW9uOiAnI2xvYW5JRCA9IDpsb2FuSUQnLFxuICAgICAgICAgICAgRXhwcmVzc2lvbkF0dHJpYnV0ZVZhbHVlczoge1xuICAgICAgICAgICAgJzpsb2FuSUQnOiBsb2FuSUQsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRXhwcmVzc2lvbkF0dHJpYnV0ZU5hbWVzOiB7XG4gICAgICAgICAgICAnI2xvYW5JRCc6ICdsb2FuSUQnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfVxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJpbnNpZGUgZ2V0TG9hbkJ5SURcIik7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgZG9jQ2xpZW50LnNjYW4ocGFyYW1zKS5wcm9taXNlKCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm91dFNpZGUgZ2V0TG9hbkJ5SURcIik7XG4gICAgICAgICAgICByZXR1cm4gZGF0YS5JdGVtcztcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnRHluYW1vREIgZXJyb3I6ICcsIGVycik7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBhc3luYyBjcmVhdGVMb2FuKGxvYW46IGFueSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImluc2lkZSBjcmVhdGVMb2FuXCIpO1xuICAgICAgICAgICAgY29uc3QgZGJEYXRhID0gYXdhaXQgdGhpcy5nZXREYXNoYm9hcmQoKTtcbiAgICAgICAgICAgIGNvbnN0IGl0ZW1zID0ge1xuICAgICAgICAgICAgICAgIGxvYW5JRDogXCJMQy1cIiArICgxMDAwMCArIGF3YWl0IGRiRGF0YS5sZW5ndGgpLFxuICAgICAgICAgICAgICAgIGlzQWN0aXZlOiB0cnVlLFxuICAgICAgICAgICAgICAgIC4uLmxvYW5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHBhcmFtcyA9IHtcbiAgICAgICAgICAgICAgICBUYWJsZU5hbWU6IHByb2Nlc3MuZW52LkxPQU5TX1RBQkxFLFxuICAgICAgICAgICAgICAgIEl0ZW06IGl0ZW1zXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhd2FpdCBkb2NDbGllbnQucHV0KHBhcmFtcykucHJvbWlzZSgpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJvdXRzaWRlIGNyZWF0ZUxvYW5cIik7XG4gICAgICAgICAgICByZXR1cm4gbG9hbjtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnRHluYW1vREIgZXJyb3I6ICcsIGVycik7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBhc3luYyB1cGRhdGVMb2FuKGxvYW46IGFueSl7XG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IHtcbiAgICAgICAgICAgIFRhYmxlTmFtZTogcHJvY2Vzcy5lbnYuTE9BTlNfVEFCTEUsXG4gICAgICAgICAgICBLZXk6IHtcbiAgICAgICAgICAgICAgbG9hbklEOiBsb2FuLmxvYW5JRCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBVcGRhdGVFeHByZXNzaW9uOiAnU0VUICNuYW1lPTpuYW1lLCAjcGFyZW50TmFtZT06cGFyZW50TmFtZSwgI2RhdGU9OmRhdGUsIG1vYmlsZT06bW9iaWxlLCAjYU1vYmlsZT06YU1vYmlsZSwgI2FkZHJlc3M9OmFkZHJlc3MsICNhbW91bnQ9OmFtb3VudCwgaW50ZXJlc3Q9OmludGVyZXN0LCAjbm90ZXM9Om5vdGVzJyxcbiAgICAgICAgICAgIEV4cHJlc3Npb25BdHRyaWJ1dGVWYWx1ZXM6IHtcbiAgICAgICAgICAgICAgJzpuYW1lJzogbG9hbi5uYW1lLFxuICAgICAgICAgICAgICAnOnBhcmVudE5hbWUnOiBsb2FuLnBhcmVudE5hbWUsXG4gICAgICAgICAgICAgICc6ZGF0ZSc6IGxvYW4uZGF0ZSxcbiAgICAgICAgICAgICAgJzptb2JpbGUnOiBsb2FuLm1vYmlsZSxcbiAgICAgICAgICAgICAgJzphTW9iaWxlJzogbG9hbi5hTW9iaWxlLFxuICAgICAgICAgICAgICAnOmFkZHJlc3MnOiBsb2FuLmFkZHJlc3MsXG4gICAgICAgICAgICAgICc6YW1vdW50JzogbG9hbi5hbW91bnQsXG4gICAgICAgICAgICAgICc6aW50ZXJlc3QnOiBsb2FuLmludGVyZXN0LFxuICAgICAgICAgICAgICAnOm5vdGVzJzogbG9hbi5ub3Rlc1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEV4cHJlc3Npb25BdHRyaWJ1dGVOYW1lczoge1xuICAgICAgICAgICAgICAnI25hbWUnOiAnbmFtZScsXG4gICAgICAgICAgICAgICcjcGFyZW50TmFtZSc6ICdwYXJlbnROYW1lJyxcbiAgICAgICAgICAgICAgJyNkYXRlJzogJ2RhdGUnLFxuICAgICAgICAgICAgICAnI21vYmlsZSc6ICdtb2JpbGUnLFxuICAgICAgICAgICAgICAnI2FkZHJlc3MnOiAnYWRkcmVzcycsXG4gICAgICAgICAgICAgICcjYW1vdW50JzogJ2Ftb3VudCcsXG4gICAgICAgICAgICAgICcjaW50ZXJlc3QnOiAnaW50ZXJlc3QnLFxuICAgICAgICAgICAgICAnI25vdGVzJzogJ25vdGVzJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFJldHVyblZhbHVlczogJ0FMTF9ORVcnLFxuICAgICAgICB9O1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBkb2NDbGllbnQudXBkYXRlKHBhcmFtcykucHJvbWlzZSgpO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdC5BdHRyaWJ1dGVzO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdEeW5hbW9EQiBlcnJvcjogJywgZXJyKTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIGFzeW5jIGNoYW5nZUxvYW5TdGF0dXMobG9hbklEOiBzdHJpbmcsIGlzQWN0aXZlOiBib29sZWFuKXtcbiAgICAgICAgY29uc3QgcGFyYW1zID0ge1xuICAgICAgICAgICAgVGFibGVOYW1lOiBwcm9jZXNzLmVudi5MT0FOU19UQUJMRSxcbiAgICAgICAgICAgIEtleToge1xuICAgICAgICAgICAgICBsb2FuSUQ6IGxvYW5JRCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBVcGRhdGVFeHByZXNzaW9uOiAnU0VUICNpc0FjdGl2ZT06aXNBY3RpdmUnLFxuICAgICAgICAgICAgRXhwcmVzc2lvbkF0dHJpYnV0ZVZhbHVlczoge1xuICAgICAgICAgICAgICAnOmlzQWN0aXZlJzogaXNBY3RpdmUsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRXhwcmVzc2lvbkF0dHJpYnV0ZU5hbWVzOiB7XG4gICAgICAgICAgICAgICcjaXNBY3RpdmUnOiAnaXNBY3RpdmUnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFJldHVyblZhbHVlczogJ0FMTF9ORVcnLFxuICAgICAgICB9O1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBkb2NDbGllbnQudXBkYXRlKHBhcmFtcykucHJvbWlzZSgpO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdC5BdHRyaWJ1dGVzO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdEeW5hbW9EQiBlcnJvcjogJywgZXJyKTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIGFzeW5jIHVwZGF0ZVBlbmRpbmdBbW91bnQobG9hbklEOiBzdHJpbmcsIGludGVyZXN0UGFpZDogbnVtYmVyKXtcbiAgICAgICAgY29uc3QgcGFyYW1zID0ge1xuICAgICAgICAgICAgVGFibGVOYW1lOiBwcm9jZXNzLmVudi5MT0FOU19UQUJMRSxcbiAgICAgICAgICAgIEtleToge1xuICAgICAgICAgICAgICBsb2FuSUQ6IGxvYW5JRCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBVcGRhdGVFeHByZXNzaW9uOiAnU0VUICNpbnRlcmVzdFBhaWQ9OmludGVyZXN0UGFpZCcsXG4gICAgICAgICAgICBFeHByZXNzaW9uQXR0cmlidXRlVmFsdWVzOiB7XG4gICAgICAgICAgICAgICc6aW50ZXJlc3RQYWlkJzogaW50ZXJlc3RQYWlkLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEV4cHJlc3Npb25BdHRyaWJ1dGVOYW1lczoge1xuICAgICAgICAgICAgICAnI2ludGVyZXN0UGFpZCc6ICdpbnRlcmVzdFBhaWQnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFJldHVyblZhbHVlczogJ0FMTF9ORVcnLFxuICAgICAgICB9O1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBkb2NDbGllbnQudXBkYXRlKHBhcmFtcykucHJvbWlzZSgpO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdC5BdHRyaWJ1dGVzO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdEeW5hbW9EQiBlcnJvcjogJywgZXJyKTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIGFzeW5jIGRlbGV0ZUxvYW4obG9hbklEOiBzdHJpbmcpe1xuICAgICAgICBjb25zdCBwYXJhbXMgPSB7XG4gICAgICAgICAgICBUYWJsZU5hbWU6IHByb2Nlc3MuZW52LkxPQU5TX1RBQkxFLFxuICAgICAgICAgICAgS2V5OiB7XG4gICAgICAgICAgICAgICAgbG9hbklEOiBsb2FuSURcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgYXdhaXQgZG9jQ2xpZW50LmRlbGV0ZShwYXJhbXMpLnByb21pc2UoKVxuICAgICAgICAgICAgcmV0dXJuIGxvYW5JRFxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdEeW5hbW9EQiBlcnJvcjogJywgZXJyKVxuICAgICAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgICAgfVxuICAgIH1cbn0iXX0=