type LoanEvents = {
    info: {
        fieldName: string
    }
    arguments: {
        loanID: string
        historyId: string
        loan: Loan
        interestPaid: number
        isActive: boolean
    }
}

type Loan = {
    name: string
    parentName: string
    date: string
    mobile: string
    aMobile: string
    address: string
    amount: number
    interest: number
    interestPaid: number
    notes: string
    historyId: string
    historyEntryPosition: string
    historyDate: string
    isActive: boolean
}