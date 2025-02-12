import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ChauffeurService} from '../chauffeur.service';

@Component({
  selector: 'app-chauffeur-view',
  templateUrl: './chauffeur-view.component.html',
  styleUrls: ['./chauffeur-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChauffeurViewComponent implements OnInit {

  chauffeur: any;

  constructor(
      private route: ActivatedRoute,
      private chauffeurService: ChauffeurService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const chauffeurId = params['id'];
      this.chauffeurService.getChauffeurById(chauffeurId).subscribe(response => {
        this.chauffeur = response;
      });
    });
  }
}
