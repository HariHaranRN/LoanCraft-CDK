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
            Key: { isActive: isActive }
        };
        console.log("inside getLoans");
        try {
            const data = await docClient.get(params).promise();
            console.log("outSide getloans");
            return data.Items;
        }
        catch (err) {
            console.log('DynamoDB error: ', err);
            return null;
        }
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
            console.log(data);
            console.log("outside createLoan");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hbi5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibG9hbi5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUMvQixNQUFNLFNBQVMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsY0FBYyxFQUFFLENBQUM7QUFFcEQsTUFBYSxXQUFXO0lBRXBCLE1BQU0sQ0FBQyxLQUFLLENBQUMsWUFBWTtRQUNyQixNQUFNLE1BQU0sR0FBRztZQUNYLFNBQVMsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVc7U0FDckMsQ0FBQTtRQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsQ0FBQztRQUNuQyxJQUFJO1lBQ0EsTUFBTSxJQUFJLEdBQUcsTUFBTSxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFBO1lBQ25ELE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLENBQUMsQ0FBQztZQUNwQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7U0FDckI7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxDQUFDLENBQUE7WUFDcEMsT0FBTyxJQUFJLENBQUE7U0FDZDtJQUNMLENBQUM7SUFFRCxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxRQUFpQjtRQUNuQyxNQUFNLE1BQU0sR0FBRztZQUNYLFNBQVMsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVc7WUFDbEMsR0FBRyxFQUFFLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRTtTQUM5QixDQUFBO1FBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQy9CLElBQUk7WUFDQSxNQUFNLElBQUksR0FBRyxNQUFNLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUE7WUFDbEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1lBQ2hDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztTQUNyQjtRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLENBQUMsQ0FBQTtZQUNwQyxPQUFPLElBQUksQ0FBQTtTQUNkO0lBQ0wsQ0FBQztJQUVELE1BQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLE1BQWM7SUFFdkMsQ0FBQztJQUVELE1BQU0sQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQVM7UUFDN0IsSUFBSTtZQUNBLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsQ0FBQztZQUNqQyxNQUFNLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUN6QyxNQUFNLEtBQUssR0FBRztnQkFDVixNQUFNLEVBQUUsS0FBSyxHQUFHLENBQUMsS0FBSyxHQUFHLE1BQU0sTUFBTSxDQUFDLE1BQU0sQ0FBQztnQkFDN0MsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsR0FBRyxJQUFJO2FBQ1YsQ0FBQTtZQUNELE1BQU0sTUFBTSxHQUFHO2dCQUNYLFNBQVMsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVc7Z0JBQ2xDLElBQUksRUFBRSxLQUFLO2FBQ2QsQ0FBQTtZQUNELE1BQU0sSUFBSSxHQUFHLE1BQU0sU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNuRCxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2xCLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQztZQUNsQyxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7U0FDMUI7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxDQUFDLENBQUE7WUFDcEMsT0FBTyxJQUFJLENBQUE7U0FDZDtJQUNMLENBQUM7SUFFRCxNQUFNLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFTO0lBRWpDLENBQUM7SUFFRCxNQUFNLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxNQUFjO0lBRXRDLENBQUM7Q0FDSjtBQW5FRCxrQ0FtRUMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBBV1MgPSByZXF1aXJlKCdhd3Mtc2RrJyk7XG5jb25zdCBkb2NDbGllbnQgPSBuZXcgQVdTLkR5bmFtb0RCLkRvY3VtZW50Q2xpZW50KCk7XG5cbmV4cG9ydCBjbGFzcyBMb2FuU2VydmljZSB7XG5cbiAgICBzdGF0aWMgYXN5bmMgZ2V0RGFzaGJvYXJkKCl7XG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IHtcbiAgICAgICAgICAgIFRhYmxlTmFtZTogcHJvY2Vzcy5lbnYuTE9BTlNfVEFCTEUsXG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coXCJpbnNpZGUgZ2V0RGFzaGJvYXJkXCIpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IGRvY0NsaWVudC5zY2FuKHBhcmFtcykucHJvbWlzZSgpXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm91dHNpZGUgZ2V0RGFzaGJvYXJkXCIpO1xuICAgICAgICAgICAgcmV0dXJuIGRhdGEuSXRlbXM7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0R5bmFtb0RCIGVycm9yOiAnLCBlcnIpXG4gICAgICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIGFzeW5jIGdldExvYW5zKGlzQWN0aXZlOiBib29sZWFuKXtcbiAgICAgICAgY29uc3QgcGFyYW1zID0ge1xuICAgICAgICAgICAgVGFibGVOYW1lOiBwcm9jZXNzLmVudi5MT0FOU19UQUJMRSxcbiAgICAgICAgICAgIEtleTogeyBpc0FjdGl2ZTogaXNBY3RpdmUgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKFwiaW5zaWRlIGdldExvYW5zXCIpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IGRvY0NsaWVudC5nZXQocGFyYW1zKS5wcm9taXNlKClcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwib3V0U2lkZSBnZXRsb2Fuc1wiKTtcbiAgICAgICAgICAgIHJldHVybiBkYXRhLkl0ZW1zO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdEeW5hbW9EQiBlcnJvcjogJywgZXJyKVxuICAgICAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBhc3luYyBnZXRMb2FuQnlJRChsb2FuSUQ6IHN0cmluZyl7XG5cbiAgICB9XG5cbiAgICBzdGF0aWMgYXN5bmMgY3JlYXRlTG9hbihsb2FuOiBhbnkpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJpbnNpZGUgY3JlYXRlTG9hblwiKTtcbiAgICAgICAgICAgIGNvbnN0IGRiRGF0YSA9IGF3YWl0IHRoaXMuZ2V0RGFzaGJvYXJkKCk7XG4gICAgICAgICAgICBjb25zdCBpdGVtcyA9IHtcbiAgICAgICAgICAgICAgICBsb2FuSUQ6IFwiTEMtXCIgKyAoMTAwMDAgKyBhd2FpdCBkYkRhdGEubGVuZ3RoKSxcbiAgICAgICAgICAgICAgICBpc0FjdGl2ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAuLi5sb2FuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBwYXJhbXMgPSB7XG4gICAgICAgICAgICAgICAgVGFibGVOYW1lOiBwcm9jZXNzLmVudi5MT0FOU19UQUJMRSxcbiAgICAgICAgICAgICAgICBJdGVtOiBpdGVtc1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IGRvY0NsaWVudC5wdXQocGFyYW1zKS5wcm9taXNlKCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwib3V0c2lkZSBjcmVhdGVMb2FuXCIpO1xuICAgICAgICAgICAgcmV0dXJuIGRhdGEuQXR0cmlidXRlcztcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnRHluYW1vREIgZXJyb3I6ICcsIGVycilcbiAgICAgICAgICAgIHJldHVybiBudWxsXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgYXN5bmMgdXBkYXRlTG9hbihsb2FuOiBhbnkpe1xuXG4gICAgfVxuXG4gICAgc3RhdGljIGFzeW5jIGRlbGV0ZUxvYW4obG9hbklEOiBzdHJpbmcpe1xuICAgICAgICBcbiAgICB9XG59Il19