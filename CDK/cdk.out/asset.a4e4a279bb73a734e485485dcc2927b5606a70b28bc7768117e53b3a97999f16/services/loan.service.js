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
            console.log(data);
            return data.Items;
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
                loanID: "LC-" + (10000 + await dbData.length),
                isActive: true,
                ...loan
            };
            const params = {
                TableName: process.env.LOANS_TABLE,
                Item: items
            };
            const data = await docClient.put(params).promise();
            console.log("ouyside createLoan");
            return data.Attributes;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hbi5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibG9hbi5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUMvQixNQUFNLFNBQVMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsY0FBYyxFQUFFLENBQUM7QUFFcEQsTUFBYSxXQUFXO0lBRXBCLE1BQU0sQ0FBQyxLQUFLLENBQUMsWUFBWTtRQUNyQixNQUFNLE1BQU0sR0FBRztZQUNYLFNBQVMsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVc7U0FDckMsQ0FBQTtRQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsQ0FBQztRQUNuQyxJQUFJO1lBQ0EsTUFBTSxJQUFJLEdBQUcsTUFBTSxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFBO1lBQ25ELE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLENBQUMsQ0FBQTtZQUNuQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO1lBQ2pCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztTQUNyQjtRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLENBQUMsQ0FBQTtZQUNwQyxPQUFPLElBQUksQ0FBQTtTQUNkO0lBQ0wsQ0FBQztJQUVELE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLFFBQWlCO0lBRXZDLENBQUM7SUFFRCxNQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxNQUFjO0lBRXZDLENBQUM7SUFFRCxNQUFNLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFTO1FBQzdCLElBQUk7WUFDQSxPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUM7WUFDakMsTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDekMsTUFBTSxLQUFLLEdBQUc7Z0JBQ1YsTUFBTSxFQUFFLEtBQUssR0FBRyxDQUFDLEtBQUssR0FBRyxNQUFNLE1BQU0sQ0FBQyxNQUFNLENBQUM7Z0JBQzdDLFFBQVEsRUFBRSxJQUFJO2dCQUNkLEdBQUcsSUFBSTthQUNWLENBQUE7WUFDRCxNQUFNLE1BQU0sR0FBRztnQkFDWCxTQUFTLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXO2dCQUNsQyxJQUFJLEVBQUUsS0FBSzthQUNkLENBQUE7WUFDRCxNQUFNLElBQUksR0FBRyxNQUFNLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDbkQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1lBQ2xDLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztTQUMxQjtRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLENBQUMsQ0FBQTtZQUNwQyxPQUFPLElBQUksQ0FBQTtTQUNkO0lBQ0wsQ0FBQztJQUVELE1BQU0sQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQVM7SUFFakMsQ0FBQztJQUVELE1BQU0sQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLE1BQWM7SUFFdEMsQ0FBQztDQUNKO0FBdkRELGtDQXVEQyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IEFXUyA9IHJlcXVpcmUoJ2F3cy1zZGsnKTtcbmNvbnN0IGRvY0NsaWVudCA9IG5ldyBBV1MuRHluYW1vREIuRG9jdW1lbnRDbGllbnQoKTtcblxuZXhwb3J0IGNsYXNzIExvYW5TZXJ2aWNlIHtcblxuICAgIHN0YXRpYyBhc3luYyBnZXREYXNoYm9hcmQoKXtcbiAgICAgICAgY29uc3QgcGFyYW1zID0ge1xuICAgICAgICAgICAgVGFibGVOYW1lOiBwcm9jZXNzLmVudi5MT0FOU19UQUJMRSxcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhcImluc2lkZSBnZXREYXNoYm9hcmRcIik7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgZG9jQ2xpZW50LnNjYW4ocGFyYW1zKS5wcm9taXNlKClcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwib3V0c2lkZSBnZXREYXNoYm9hcmRcIilcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpXG4gICAgICAgICAgICByZXR1cm4gZGF0YS5JdGVtcztcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnRHluYW1vREIgZXJyb3I6ICcsIGVycilcbiAgICAgICAgICAgIHJldHVybiBudWxsXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgYXN5bmMgZ2V0TG9hbnMoaXNBY3RpdmU6IGJvb2xlYW4pe1xuXG4gICAgfVxuXG4gICAgc3RhdGljIGFzeW5jIGdldExvYW5CeUlEKGxvYW5JRDogc3RyaW5nKXtcblxuICAgIH1cblxuICAgIHN0YXRpYyBhc3luYyBjcmVhdGVMb2FuKGxvYW46IGFueSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImluc2lkZSBjcmVhdGVMb2FuXCIpO1xuICAgICAgICAgICAgY29uc3QgZGJEYXRhID0gYXdhaXQgdGhpcy5nZXREYXNoYm9hcmQoKTtcbiAgICAgICAgICAgIGNvbnN0IGl0ZW1zID0ge1xuICAgICAgICAgICAgICAgIGxvYW5JRDogXCJMQy1cIiArICgxMDAwMCArIGF3YWl0IGRiRGF0YS5sZW5ndGgpLFxuICAgICAgICAgICAgICAgIGlzQWN0aXZlOiB0cnVlLFxuICAgICAgICAgICAgICAgIC4uLmxvYW5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHBhcmFtcyA9IHtcbiAgICAgICAgICAgICAgICBUYWJsZU5hbWU6IHByb2Nlc3MuZW52LkxPQU5TX1RBQkxFLFxuICAgICAgICAgICAgICAgIEl0ZW06IGl0ZW1zXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgZG9jQ2xpZW50LnB1dChwYXJhbXMpLnByb21pc2UoKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwib3V5c2lkZSBjcmVhdGVMb2FuXCIpO1xuICAgICAgICAgICAgcmV0dXJuIGRhdGEuQXR0cmlidXRlcztcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnRHluYW1vREIgZXJyb3I6ICcsIGVycilcbiAgICAgICAgICAgIHJldHVybiBudWxsXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgYXN5bmMgdXBkYXRlTG9hbihsb2FuOiBhbnkpe1xuXG4gICAgfVxuXG4gICAgc3RhdGljIGFzeW5jIGRlbGV0ZUxvYW4obG9hbklEOiBzdHJpbmcpe1xuICAgICAgICBcbiAgICB9XG59Il19