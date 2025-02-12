export class NotificationsFakeData {
    public static data = {
        messages: [
            {
                image: 'assets/images/portrait/small/6121.jpg',
                heading: '<span class="font-weight-bolder">Filicitation  🎉</span> winner!',
                text: 'Nouveau marché public adjugé en faveur de SR'
            },
            {
                image: 'assets/images/portrait/small/6121.jpg',
                heading: '<span class="font-weight-bolder">Nouveau message </span>  reçu',
                text: 'Vous avez 10 messages non lus'
            },
            {
                image: 'assets/images/portrait/small/6121.jpg',
                heading: '<span class="font-weight-bolder">Commade rejetée 👋</span>  vérifier',
                text: 'Veuillez verifier et mettre a jour votre commande'
            }
        ],
        systemMessages: [
            {
                icon: 'x',
                heading: '<span class="font-weight-bolder">Server down</span> registered',
                text: 'USA Server is down due to hight CPU usage'
            },
            {
                icon: 'check',
                heading: '<span class="font-weight-bolder">Sales report</span> generated',
                text: 'Last month sales report generated'
            },
            {
                icon: 'alert-triangle',
                heading: '<span class="font-weight-bolder">High memory</span> usage',
                text: 'BLR Server using high memory'
            }
        ],
        system: true
    };
}
