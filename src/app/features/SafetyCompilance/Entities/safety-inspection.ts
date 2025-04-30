import { Restaurant } from "./restaurant";
import { StatusRes } from "./restaurant";

export enum InspectionStatus {
    Pass = 'Pass',
    Closed = 'Closed',
    Conditional_Pass = 'Conditional_Pass'
}

export enum InspectionType {
    Inspection = 'Inspection',
    Re_Inspection = 'Re_Inspection',
    Complaint = 'Complaint'
}

export class SafetyInspection {
    inspectionID: number;
    inspector_name: string;
    inspection_date: Date;
    premises_name: string;
    address: string;
    inspectionType: InspectionType;
    inspectionStatus: InspectionStatus;
    infractions: string;
    crucial_infractions: number;
    significant_infractions: number;
    minor_infractions: number;
    corrected_during_inspection: number;
    report_time: Date;
    description: string;
    reinspectionDate: Date;
    isOutOfBusiness: boolean;
    restaurant: Restaurant | null;

    constructor(
        inspectionID: number = 0,
        inspector_name: string = '',
        inspection_date: Date | string = new Date(),
        premises_name: string = '',
        address: string = '',
        inspectionType: string = InspectionType.Inspection,
        inspectionStatus: string = InspectionStatus.Pass,
        infractions: string = '',
        crucial_infractions: number = 0,
        significant_infractions: number = 0,
        minor_infractions: number = 0,
        corrected_during_inspection: number = 0,
        report_time: Date | string = new Date(),
        description: string = '',
        reinspectionDate: Date | string = new Date(),
        isOutOfBusiness: boolean = false,
        restaurant: Restaurant | null = null
    ) {
        this.inspectionID = inspectionID;
        this.inspector_name = inspector_name;
        this.inspection_date = this.parseDate(inspection_date);
        this.premises_name = premises_name;
        this.address = address;
        this.inspectionType = this.parseInspectionType(inspectionType);
        this.inspectionStatus = this.parseInspectionStatus(inspectionStatus);
        this.infractions = infractions;
        this.crucial_infractions = crucial_infractions;
        this.significant_infractions = significant_infractions;
        this.minor_infractions = minor_infractions;
        this.corrected_during_inspection = corrected_during_inspection;
        this.report_time = this.parseDate(report_time);
        this.description = description;
        this.reinspectionDate = this.parseDate(reinspectionDate);
        this.isOutOfBusiness = isOutOfBusiness;
        this.restaurant = restaurant;
    }

    private parseDate(date: Date | string): Date {
        return date instanceof Date ? date : new Date(date);
    }

    private parseInspectionType(type: string): InspectionType {
        if (type === InspectionType.Inspection) return InspectionType.Inspection;
        if (type === InspectionType.Re_Inspection) return InspectionType.Re_Inspection;
        if (type === InspectionType.Complaint) return InspectionType.Complaint;
        return InspectionType.Inspection; // Default value
    }

    private parseInspectionStatus(status: string): InspectionStatus {
        if (status === InspectionStatus.Pass) return InspectionStatus.Pass;
        if (status === InspectionStatus.Closed) return InspectionStatus.Closed;
        if (status === InspectionStatus.Conditional_Pass) return InspectionStatus.Conditional_Pass;
        return InspectionStatus.Pass; // Default value
    }
}