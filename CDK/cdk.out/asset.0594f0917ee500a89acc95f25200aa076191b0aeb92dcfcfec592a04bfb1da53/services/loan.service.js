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
            const { Item } = await docClient.scan(params).promise();
            console.log("outside getDashboard");
            return Item;
        }
        catch (err) {
            console.log('DynamoDB error: ', err);
            return null;
        }
    }
    static async getLoans(isActive) {
    }
    static async getLoanByID(loanID) {
    }
    static async createLoan(loan) {
        try {
            console.log("inside createLoan");
            const dbData = await this.getDashboard();
            const items = {
                loanID: "LC-100000" + dbData.length,
                isActive: true,
                ...loan
            };
            const params = {
                TableName: process.env.LOANS_TABLE,
                Item: items
            };
            const { Item } = await docClient.put(params).promise();
            console.log("ouyside createLoan");
            return Item;
        }
        catch (err) {
            console.log('DynamoDB error: ', err);
            return null;
        }
    }
    static async updateLoan(loan) {
    }
    static async deleteLoan(loanID) {
    }
}
exports.LoanService = LoanService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hbi5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibG9hbi5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUMvQixNQUFNLFNBQVMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsY0FBYyxFQUFFLENBQUM7QUFFcEQsTUFBYSxXQUFXO0lBRXBCLE1BQU0sQ0FBQyxLQUFLLENBQUMsWUFBWTtRQUNyQixNQUFNLE1BQU0sR0FBRztZQUNYLFNBQVMsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVc7U0FDckMsQ0FBQTtRQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsQ0FBQztRQUNuQyxJQUFJO1lBQ0EsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLE1BQU0sU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtZQUN2RCxPQUFPLENBQUMsR0FBRyxDQUFDLHNCQUFzQixDQUFDLENBQUE7WUFDbkMsT0FBTyxJQUFJLENBQUM7U0FDZjtRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLENBQUMsQ0FBQTtZQUNwQyxPQUFPLElBQUksQ0FBQTtTQUNkO0lBQ0wsQ0FBQztJQUVELE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLFFBQWlCO0lBRXZDLENBQUM7SUFFRCxNQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxNQUFjO0lBRXZDLENBQUM7SUFFRCxNQUFNLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFTO1FBQzdCLElBQUk7WUFDQSxPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUM7WUFDakMsTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDekMsTUFBTSxLQUFLLEdBQUc7Z0JBQ1YsTUFBTSxFQUFFLFdBQVcsR0FBRyxNQUFNLENBQUMsTUFBTTtnQkFDbkMsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsR0FBRyxJQUFJO2FBQ1YsQ0FBQTtZQUNELE1BQU0sTUFBTSxHQUFHO2dCQUNYLFNBQVMsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVc7Z0JBQ2xDLElBQUksRUFBRSxLQUFLO2FBQ2QsQ0FBQTtZQUNELE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxNQUFNLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDdkQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1lBQ2xDLE9BQU8sSUFBSSxDQUFDO1NBQ2Y7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxDQUFDLENBQUE7WUFDcEMsT0FBTyxJQUFJLENBQUE7U0FDZDtJQUNMLENBQUM7SUFFRCxNQUFNLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFTO0lBRWpDLENBQUM7SUFFRCxNQUFNLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxNQUFjO0lBRXRDLENBQUM7Q0FDSjtBQXRERCxrQ0FzREMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBBV1MgPSByZXF1aXJlKCdhd3Mtc2RrJyk7XG5jb25zdCBkb2NDbGllbnQgPSBuZXcgQVdTLkR5bmFtb0RCLkRvY3VtZW50Q2xpZW50KCk7XG5cbmV4cG9ydCBjbGFzcyBMb2FuU2VydmljZSB7XG5cbiAgICBzdGF0aWMgYXN5bmMgZ2V0RGFzaGJvYXJkKCl7XG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IHtcbiAgICAgICAgICAgIFRhYmxlTmFtZTogcHJvY2Vzcy5lbnYuTE9BTlNfVEFCTEUsXG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coXCJpbnNpZGUgZ2V0RGFzaGJvYXJkXCIpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgeyBJdGVtIH0gPSBhd2FpdCBkb2NDbGllbnQuc2NhbihwYXJhbXMpLnByb21pc2UoKVxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJvdXRzaWRlIGdldERhc2hib2FyZFwiKVxuICAgICAgICAgICAgcmV0dXJuIEl0ZW07XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0R5bmFtb0RCIGVycm9yOiAnLCBlcnIpXG4gICAgICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIGFzeW5jIGdldExvYW5zKGlzQWN0aXZlOiBib29sZWFuKXtcblxuICAgIH1cblxuICAgIHN0YXRpYyBhc3luYyBnZXRMb2FuQnlJRChsb2FuSUQ6IHN0cmluZyl7XG5cbiAgICB9XG5cbiAgICBzdGF0aWMgYXN5bmMgY3JlYXRlTG9hbihsb2FuOiBhbnkpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJpbnNpZGUgY3JlYXRlTG9hblwiKTtcbiAgICAgICAgICAgIGNvbnN0IGRiRGF0YSA9IGF3YWl0IHRoaXMuZ2V0RGFzaGJvYXJkKCk7XG4gICAgICAgICAgICBjb25zdCBpdGVtcyA9IHtcbiAgICAgICAgICAgICAgICBsb2FuSUQ6IFwiTEMtMTAwMDAwXCIgKyBkYkRhdGEubGVuZ3RoLFxuICAgICAgICAgICAgICAgIGlzQWN0aXZlOiB0cnVlLFxuICAgICAgICAgICAgICAgIC4uLmxvYW5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHBhcmFtcyA9IHtcbiAgICAgICAgICAgICAgICBUYWJsZU5hbWU6IHByb2Nlc3MuZW52LkxPQU5TX1RBQkxFLFxuICAgICAgICAgICAgICAgIEl0ZW06IGl0ZW1zXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCB7IEl0ZW0gfSA9IGF3YWl0IGRvY0NsaWVudC5wdXQocGFyYW1zKS5wcm9taXNlKCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm91eXNpZGUgY3JlYXRlTG9hblwiKTtcbiAgICAgICAgICAgIHJldHVybiBJdGVtO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdEeW5hbW9EQiBlcnJvcjogJywgZXJyKVxuICAgICAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBhc3luYyB1cGRhdGVMb2FuKGxvYW46IGFueSl7XG5cbiAgICB9XG5cbiAgICBzdGF0aWMgYXN5bmMgZGVsZXRlTG9hbihsb2FuSUQ6IHN0cmluZyl7XG4gICAgICAgIFxuICAgIH1cbn0iXX0=