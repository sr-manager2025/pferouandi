import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { Chauffeur } from '../../../models/chauffeur';
import { CoreSidebarService } from '../../../../../../../@core/components/core-sidebar/core-sidebar.service';
import { ChauffeurService } from '../../chauffeur/chauffeur.service';
import { EnginGpsLocationService } from '../../mouvement-engin/engin-gps-location.service';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-engin',
  templateUrl: './add-engin.component.html',
  styleUrls: ['./add-engin.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AddEnginComponent implements OnInit {
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
  private toastr: ToastrService,
  private router: Router,

  ) { }

  ngOnInit(): void {
    this. loadChauffeurs();
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
  submitEngin(): void {
    console.log('Soumission de l\'ajout avec les données suivantes:', {
      selectedDrive: this.selectedDrive,
      coutH: this.coutH,
      model: this.model,
      EnginName: this.EnginName,
      device: this.device,
    });

    if (
      !this.selectedDrive ||
      !this.coutH ||
      !this.model ||
      !this.EnginName ||
      !this.device
    ) {
      this.toastr.error(
        'Tous les champs sont obligatoires. Veuillez compléter le formulaire.',
        'Erreur de validation !'
      );
      return;
    }

    this.enginGpsLocationService
      .AddEnginLocation(
        this.selectedDrive.id,
        this.coutH,
        this.model,
        this.EnginName,
        this.device
      )
      .then(
        () => {
          this.toastr.success(
            'Ajout effectué avec succès.',
            'Succès !'
          );
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['projets/logistique/enginChantier/engin']);
          });
          this.enginGpsLocationService.getAllEnginGps();
          this.toggleSidebar('new-affectation-sidebar');
        },
        (error) => {
          console.error('Erreur lors de la mise à jour de EnginGpsLocation :', error);
          this.toastr.error(
            'Échec de la mise à jour. Veuillez vérifier la console.',
            'Erreur !'
          );
        }
      );
  }


}
