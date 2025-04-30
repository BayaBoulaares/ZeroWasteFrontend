import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SafetyInspectionService } from '../../../../Services/safety-inspection.service';
import { InspectionStatus, InspectionType, SafetyInspection } from '../../../../Entities/safety-inspection';

@Component({
  selector: 'app-updatesafetyinspection',
  templateUrl: './updatesafetyinspection.component.html',
  styleUrls: ['./updatesafetyinspection.component.css']
})
export class UpdatesafetyinspectionComponent implements OnInit {
  inspectionForm!: FormGroup;
  inspectionId!: number;
  InspectionStatus = InspectionStatus;
  InspectionType = InspectionType;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private inspectionService: SafetyInspectionService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.inspectionId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadInspection();
  }

  initializeForm(): void {
    this.inspectionForm = this.fb.group({
      inspectionID: [null],
      inspector_name: ['', Validators.required],
      premises_name: ['', Validators.required],
      address: ['', Validators.required],
      inspection_date: ['', Validators.required],
      inspectionType: [InspectionType.Inspection],
      inspectionStatus: [InspectionStatus.Pass],
      infractions: [''],
      crucial_infractions: [0],
      significant_infractions: [0],
      minor_infractions: [0],
      corrected_during_inspection: [0],
      report_time: [''],
      description: [''],
      reinspectionDate: [''],
      isOutOfBusiness: [false],
      restaurant: [null]
    });
  }

  loadInspection(): void {
    this.inspectionService.getSafetyInspectionById(this.inspectionId).subscribe({
      next: (inspection) => {
        this.inspectionForm.patchValue({
          ...inspection,
          inspection_date: this.formatDateForInput(inspection.inspection_date),
          report_time: inspection.report_time ? this.formatDateForInput(inspection.report_time) : '',
          reinspectionDate: inspection.reinspectionDate ? this.formatDateForInput(inspection.reinspectionDate) : ''
        });
      },
      error: (error) => {
        console.error('Error loading inspection:', error);
      }
    });
  }

  private formatDateForInput(date: string | Date): string {
    if (typeof date === 'string') {
      return date.split('T')[0];
    }
    return new Date(date).toISOString().split('T')[0];
  }

  onSubmit(): void {
    if (this.inspectionForm.invalid) return;

    const updatedInspection = {
      ...this.inspectionForm.value,
      inspectionID: this.inspectionId
    };

    this.inspectionService.updateSafetyInspection(updatedInspection).subscribe({
      next: () => {
        console.log('Inspection updated successfully');
        this.router.navigate(['/admin/SafetyManagment/SafetyInspection']);
      },
      error: (error) => {
        console.error('Error updating inspection:', error);
      }
    });
  }
}
