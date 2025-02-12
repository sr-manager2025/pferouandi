import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { CoreSidebarService } from '../../../../../../../@core/components/core-sidebar/core-sidebar.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { EnginGpsLocationService } from '../../mouvement-engin/engin-gps-location.service';
import { ChauffeurService } from '../../chauffeur/chauffeur.service';
import { Chauffeur } from '../../../models/chauffeur';


@Component({
  selector: 'app-affectation-chauffeur-cout',
  templateUrl: './affectation-chauffeur-cout.component.html',
  styleUrls: ['./affectation-chauffeur-cout.component.scss'],
})
export class AffectationChauffeurCoutComponent implements OnInit {
  @Input() selectedEngin: any;
  private _unsubscribeAll: Subject<any> = new Subject();
  selectedDrive: Chauffeur;
  chauffeurs: Chauffeur[] = [];
  enginGpsLocationId = 0;
  coutH = 0.0;
  model = '';
  device = '';
  EnginName = '';

  constructor(
    private _coreSidebarService: CoreSidebarService,
    private chauffeurService: ChauffeurService,
    private enginGpsLocationService: EnginGpsLocationService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadChauffeurs();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedEngin && this.selectedEngin) {
      console.log('Selected Engin Data:', this.selectedEngin); // Debug log

      this.enginGpsLocationId = this.selectedEngin.id || null; // Correct the ID assignment
      this.EnginName = this.selectedEngin.name || '';
      this.selectedDrive = this.selectedEngin.chauffeur || null; // Assign chauffeur object, not hardcoded
      this.coutH = this.selectedEngin.coutH || null;
      this.model = this.selectedEngin.model || '';
      this.device = this.selectedEngin.device || '';
    }
  }



  toggleSidebar(name: string): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  private loadChauffeurs(): void {
    this.chauffeurService.onChauffeurListChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        (data) => {
          this.chauffeurs = data;
        },
        (error) => {
          console.error('Error fetching chauffeurs:', error);
        }
      );
    this.chauffeurService.getAllChauffeurs();
  }

  submitAssociation(): void {
    console.log('Submitting association with the following data:', {
      enginGpsLocationId: this.enginGpsLocationId,
      selectedDrive: this.selectedDrive,
      coutH: this.coutH,
      model: this.model,
      EnginName: this.EnginName,
      device: this.device,
    });

    if (
      !this.enginGpsLocationId ||
      !this.selectedDrive ||
      !this.coutH ||
      !this.model ||
      !this.EnginName ||
      !this.device
    ) {
      this.toastr.error(
        'All fields are required. Please complete the form.',
        'Validation Error!'
      );
      return;
    }

    this.enginGpsLocationService
      .updateEnginGpsLocation(
        this.enginGpsLocationId,
        this.selectedDrive.id,
        this.coutH,
        this.model,
        this.EnginName,
        this.device
      )
      .then(
        () => {
          this.toastr.success(
            'Association completed successfully.',
            'Success!'
          );
          this.toggleSidebar('new-affectation-sidebar');
        },
        (error) => {
          console.error('Error updating EnginGpsLocation:', error);
          this.toastr.error(
            'Failed to update. Please check the console.',
            'Error!'
          );
        }
      );
  }


}
