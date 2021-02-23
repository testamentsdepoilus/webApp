# Testament de Poilus - Application web
Cette application, d'édition numérique de testaments de Poilus, a été développé dans le cadre de projet de testaments de Poilus porté par les  Archives nationales, CY Cergy Paris Université, les archives  départementales des Yvelines, l'école des chartes et Fondation des Sciences du Patrimoine.

Lien vers l'application en ligne : https://edition-testaments-de-poilus.huma-num.fr/

Le code développé dans le cadre de ce projet est proposé en openSource sous license CeCILL-B (voir https://github.com/testamentsdepoilus/webApp/blob/master/LICENSE.md).

### Architercture de l'application 

![web_app_architecture](https://github.com/testamentsdepoilus/webApp/blob/master/frontend/public/images/web_app_architecture.png)

L'application utilise les composants logiciels suivants :

- **ElasticSearch 7.0.0** pour l’indexation des fichiers TEI, et la recherche dans les métadonnées et le contenu textuel des testaments ;
- **React.js** est le framework libre en JavaScript pour le développement des applications web en front-end ;
- **React ApexCharts** comme outil de visualisation  (génération de graphiques) de certaines métadonnées comme les lieux de  conservation des testaments ou la profession des testateurs ([Section Explorer](https://edition-testaments-de-poilus.huma-num.fr/explore)) ;
- **Express.js** est un framework libre en JavaScript pour le développement de serveur. Il est basé sur Node.js ;
- **Python version 3.6** (packages : beautifulsoup4,  elasticsearch, json) pour les scripts de génération des métadonnées à  partir des fichiers TEI et d’indexation dans ElasticSearch.
