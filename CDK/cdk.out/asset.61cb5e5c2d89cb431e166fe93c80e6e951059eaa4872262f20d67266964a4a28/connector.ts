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
        case "deleteLoan":
            return await LoanService.deleteLoan(event.arguments.loanID);
        case "getLoanHistory":
            return await HistoryService.getLoanHistory(event.arguments.loanID);
        case "updateHistory":
            return await HistoryService.updateHistory(event.arguments.loan);
        default:
            return null;
    }
}