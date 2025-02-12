import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

// ContentHeader component interface
export interface ContentHeader {
    headerTitle: string;
    actionButton: boolean;
    menuApps: boolean;
    menuRegistreCaisse: boolean;
    breadcrumb?: {
        type?: string;
        links?: Array<{
            name?: string;
            isLink?: boolean;
            link?: string;
        }>;
    };
}

@Component({
    selector: 'app-content-header',
    templateUrl: './content-header.component.html'
})
export class ContentHeaderComponent implements OnInit {
    // input variable
    @Input() contentHeader: ContentHeader;

    /*@Input() menuApps: Boolean=false;
    @Input() menuRegistreCaisse: Boolean=false;*/


    constructor() {
    }

    ngOnInit() {
    }


}
