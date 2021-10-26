export declare class HistoryService {
    static getLoanHistoryByID(loanID: string): Promise<any>;
    static updateHistory(loanID: string, interestPaid: number, dateOfPaid: string): Promise<never[] | null>;
}
