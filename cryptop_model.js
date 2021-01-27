
//-------------------------------------------------------------------- Model ---
// Unique source de vérité de l'application
//
model = {

  config: {},
  data : {},
  ui   : {},

  // Demande au modèle de se mettre à jour en fonction des données qu'on
  // lui présente.
  // l'argument data est un objet confectionné dans les actions.
  // Les propriétés de data apportent les modifications à faire sur le modèle.
  samPresent(data) {

    switch (data.do) {

      case 'init': {
        Object.assign(this, data.config);
        const conf = this.config;
        conf.targets.list = mergeUnique([conf.targets.wished], conf.targets.list).sort();
        const isOnline = conf.dataMode == 'online';
        conf.targets.active = isOnline ? conf.targets.wished : this.data.offline.live.target;
        this.hasChanged.currencies = true;
        if (conf.debug) console.log('model.samPresent - init - targets.list  : ', conf.targets.list);
        if (conf.debug) console.log('model.samPresent - init - targets.active: ', conf.targets.active);
      } break;

      case 'updateCurrenciesData': {
        this.data.online = data.currenciesData;
        this.config.targets.active = data.currenciesData.live.target;
        this.hasChanged.currencies = true;
      } break;

      case 'changeDataMode': {
        this.config.dataMode = data.dataMode;
        if (data.dataMode == 'offline') {
          this.config.targets.active = this.data.offline.live.target;
          this.hasChanged.currencies = true;
        }
      } break;

      case 'changeTab': {
        switch (data.tab) {
          case 'currenciesCryptos':
            this.ui.currenciesCard.selectedTab = 'cryptos';
            break;
          case 'currenciesFiats':
            this.ui.currenciesCard.selectedTab = 'fiats';
            break;
          case 'walletPortfolio':
            this.ui.walletCard.selectedTab = 'portfolio';
            break;
          case 'walletAjouter':
            this.ui.walletCard.selectedTab = 'ajouter';
            break;
            default:
        }
      } break;

      case 'filtreTexte': {
        this.ui.currenciesCard.tabs.cryptos.filters.text=data.x;
        this.hasChanged.cryptos.filter = true;
      } break;

      case 'filtreNombre': {
        this.ui.currenciesCard.tabs.cryptos.filters.price=data.x;
        this.hasChanged.cryptos.filter = true;
      } break;

      case 'changeDevise': {
        this.ui.currenciesCard.tabs.fiats.filters.text=data.x;
        this.hasChanged.fiats.filter = true;
      } break;

      case 'changeCoinsColor': {
        //console.log(data.x)
        //Si monnaie jaune on enlève des deux tableaux et config
        if (state.data.coins.nullValueCodes.includes(data.x)){
          var pos = state.data.coins.nullValueCodes.indexOf(data.x);
          state.data.coins.nullValueCodes.splice(pos, 1).sort();
          var pos2 = state.data.coins.allCodes.indexOf(data.x);
          state.data.coins.allCodes.splice(pos2, 1).sort();
          delete model.config.coins[data.x];

          }
          //Si monnaire verte on fait rien
          else if (state.data.coins.posValueCodes.includes(data.x)) {}
          //Sinon, on ajoute dans les tableaux et config
          else {
            state.data.coins.nullValueCodes.push(data.x);
            state.data.coins.allCodes.push(data.x);
            state.data.coins.nullValueCodes.sort();
            state.data.coins.allCodes.sort();
            model.config.coins[data.x] = { quantity: 0, quantityNew: "" };
          }
          this.hasChanged.cryptos.filter = true;
        }break;
        case 'changeFiatsColor': {
          console.log(data.x)
          if (model.config.targets.list.includes(data.x)){
            var pos = model.config.targets.list.indexOf(data.x);
            model.config.targets.list.splice(pos, 1).sort();
            }
            else if (model.config.targets.active == data.x) {}
            else {
              model.config.targets.list.push(data.x);
              model.config.targets.list.sort();
            }
            this.hasChanged.fiats.filter = true;
          }break;
          case 'confirmPortofolio': {
            var porto = state.data.coins.posValueCodes;
            var aux = state.data.coins.posValueCodes;

            for (let i = 0; i<porto.length; i++) {
              //Si quantité =0
              if (eval("model.config.coins." + porto[i] + ".quantityNew") === 0) {
                //on ajoute aux ajouter.
                state.data.coins.nullValueCodes.push(porto[i]);
                state.data.coins.nullValueCodes.sort();

                //On enleve du potofolio aux
                var pos = aux.indexOf(porto[i]);
                aux.splice(pos, 1).sort();

                //On met à jour la quantité
                model.config.coins[porto[i]].quantity = 0;
                model.config.coins[porto[i]].quantityNew = "";
                }

                //Sinon on met à jour
              else if (!(eval("model.config.coins." + porto[i] + ".quantityNew") == ``)) {
                model.config.coins[porto[i]].quantity = model.config.coins[porto[i]].quantityNew;
                model.config.coins[porto[i]].quantityNew = "";

              }
            }//for
            state.data.coins.posValueCodes = aux;
            this.hasChanged.coins = true;

          }break;


          case 'changeCoinQuantity': {
              if (model.config.coins[data.code].quantity !== data.val){
                model.config.coins[data.code].quantityNew = data.val;
              }
          }break;


          case 'confirmAjouter': {
            var ajout = state.data.coins.nullValueCodes;
            var aux = state.data.coins.nullValueCodes;

            for (var i = 0; i<ajout.length; i++) {
              //on met dans le portofolio
              if (!(eval("model.config.coins." + ajout[i] + ".quantityNew") === "")) {
                state.data.coins.posValueCodes.push(ajout[i]);
                state.data.coins.posValueCodes.sort();
                model.config.coins[ajout[i]].quantity = model.config.coins[ajout[i]].quantityNew;
                model.config.coins[ajout[i]].quantityNew = "";
              }
            }//for
            state.data.coins.nullValueCodes = aux;
            this.hasChanged.coins = true;
          }break;
          case 'annulerPortofolio': {
            var porto = state.data.coins.posValueCodes;

            for (var i = 0; i<porto.length; i++) {
                model.config.coins[porto[i]].quantityNew = "";
              }
          }break;
          case 'annulerAjouter': {
            var porto = state.data.coins.nullValueCodes;

            for (var i = 0; i<porto.length; i++) {
                model.config.coins[porto[i]].quantityNew = "";
              }
          }break;
          case 'sort': {
          this.ui.currenciesCard.tabs[data.currency].sort.column = data.column;
          this.hasChanged[data.currency].sort = true;
          this.ui.currenciesCard.tabs[data.currency].sort.incOrder[data.column] = !this.ui.currenciesCard.tabs[data.currency].sort.incOrder[data.column];
          }break;
          case 'changePage': {
            this.ui.currenciesCard.tabs[data.currency].pagination.currentPage = data.index;
            this.hasChanged[data.currency].pagination = true;
          }break;
          case 'changeRowsPerPage': {
            this.ui.currenciesCard.tabs[data.currency].pagination.rowsPerPageIndex = data.e.target.value;
            this.hasChanged[data.currency].pagination = true;
          }break;
      // TODO: ajoutez des cas répondant à vos actions...


      default:
        console.error(`model.samPresent(), unknown do: '${data.do}' `);
    }
    // Demande à l'état de l'application de prendre en compte la modification
    // du modèle
    state.samUpdate(this);
  }
};
