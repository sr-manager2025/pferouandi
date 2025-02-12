import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Subject} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {ChauffeurService} from '../chauffeur.service';
import {takeUntil} from 'rxjs/operators';
import {cloneDeep} from 'lodash';

@Component({
    selector: 'app-chauffeur-edit',
    templateUrl: './chauffeur-edit.component.html',
    styleUrls: ['./chauffeur-edit.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ChauffeurEditComponent implements OnInit {


    public chauffeur: any = {};
    public avatarImage: string;
    private file: File;
    private tempChauffeur: any; // For storing initial chauffeur data copy

    @ViewChild('chauffeurForm') chauffeurForm: NgForm;
    private unsubscribeAll: Subject<any>;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private chauffeurService: ChauffeurService
    ) {
        this.unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        const chauffeurId = +this.route.snapshot.paramMap.get('id');
        this.fetchChauffeurDetails(chauffeurId);
    }

    ngOnDestroy(): void {
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }

    fetchChauffeurDetails(chauffeurId: number): void {
        this.chauffeurService.getChauffeurById(chauffeurId)
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe(chauffeur => {
                this.chauffeur = chauffeur;
                this.avatarImage = chauffeur.imgPath; // Assuming imgPath exists in your chauffeur object
                this.tempChauffeur = cloneDeep(chauffeur); // Save a copy of initial data for resetting
            });
    }

    resetForm(): void {
        this.chauffeur = cloneDeep(this.tempChauffeur);
        this.chauffeurForm.resetForm(this.chauffeur);
        this.avatarImage = this.chauffeur.imgPath; // Reset avatar image display
        this.file = null; // Reset file selection
    }

    submit(): void {
        if (this.chauffeurForm.valid) {
            const chauffeurId = +this.route.snapshot.paramMap.get('id');

            this.chauffeurService.updateChauffeur(chauffeurId, this.chauffeur, this.file).then(
                updatedChauffeur => {
                    console.log('Chauffeur updated:', updatedChauffeur);
                    this.router.navigate(['projets/logistique/enginChantier/chauffeur/chauffeur-list']);

                },
                error => {
                    console.error('Error updating chauffeur:', error);
                }
            );
        } else {
            console.log('Form is invalid');
        }
    }


    uploadImage(event: any): void {
        if (event.target.files.length > 0) {
            this.file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                this.avatarImage = reader.result as string;
            };
            reader.readAsDataURL(this.file);
        }
    }
}
