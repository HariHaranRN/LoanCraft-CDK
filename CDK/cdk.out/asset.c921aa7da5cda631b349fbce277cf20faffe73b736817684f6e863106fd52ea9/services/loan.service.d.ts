export declare class LoanService {
    static getDashboard(): Promise<any>;
    static getLoans(isActive: boolean): Promise<void>;
    static getLoanByID(loanID: string): Promise<void>;
    static createLoan(loan: any): Promise<any>;
    static updateLoan(loan: any): Promise<void>;
    static deleteLoan(loanID: string): Promise<void>;
}
