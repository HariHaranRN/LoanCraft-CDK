export declare class LoanService {
    static getDashboard(): Promise<any>;
    static getLoans(isActive: boolean): Promise<any>;
    static getLoanByID(loanID: string): Promise<any>;
    static createLoan(loan: any): Promise<any>;
    static updateLoan(loan: any): Promise<any>;
    static closeLoan(loanID: any): Promise<any>;
    static deleteLoan(loanID: string): Promise<string | null>;
}
