export class PerformanceOverTimeRequestDTO {
    public startDate: string;
    public endDate: string;


    constructor(startDate: string, endDate: string) {
        this.startDate = startDate;
        this.endDate = endDate;
    }
}
