import { HistoryService } from "./services/history.service";
import { LoanService } from "./services/loan.service";

exports.handler = async (event:LoanEvents) => {
    switch (event.info.fieldName) {
        case "getDashboard":
            return await LoanService.getDashboard();
        case "getLoans":
            return await LoanService.getLoans(event.arguments.isActive);
        case "getLoanByID":
            return await LoanService.getLoanByID(event.arguments.loanID);
        case "createLoan":
            return await LoanService.createLoan(event.arguments.loan);
        case "updateLoan":
            return await LoanService.updateLoan(event.arguments.loan);
        case "changeLoanStatus":
            return await LoanService.changeLoanStatus(event.arguments.loanID, event.arguments.isActive);
        case "updatePendingAmount":
            return await LoanService.updatePendingAmount(event.arguments.loanID, event.arguments.interestPaid, event.arguments.dateOfPaid)
        case "deleteLoan":
            return await LoanService.deleteLoan(event.arguments.loanID);
        case "getLoanHistoryByID":
            return await HistoryService.getLoanHistoryByID(event.arguments.loanID);
        default:
            return null;
    }
}