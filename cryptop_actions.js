
//------------------------------------------------------------------ Actions ---
// Actions appelées dans le code HTML quand des événements surviennent
//
actions = {

  //------------------------------- Initialisation et chargement des données ---

  async initAndGo(initialConfig) {
    console.log('initAndGo: ', initialConfig);

    if (initialConfig.config.dataMode == 'online') {
      const params = {
        target : initialConfig.config.targets.wished,
        debug  : initialConfig.config.debug,
      };
      let coinlayerData = await coinlayerRequest(params);
      if (coinlayerData.success) {
        initialConfig.data.online = coinlayerData;
      } else {
        console.log('initAndGo: Données en ligne indisponibles');
        console.log('initAndGo: BASCULEMENT EN MODE HORS-LIGNE');
        initialConfig.config.dataMode = 'offline';
      }
    }
  model.samPresent({do:'init', config:initialConfig});
  },

  reinit(data) {
    const initialConfigName =  data.e.target.value;
    configsSelected = initialConfigName;
    actions.initAndGo(configs[initialConfigName]);
  },

  async updateOnlineCurrenciesData(data) {
    const params = {
      debug  : data.debug,
      target : data.target,
    };
    let coinlayerData = await coinlayerRequest(params);
    if (coinlayerData.live.success) {
      model.samPresent({do:'updateCurrenciesData', currenciesData: coinlayerData});
    } else {
      console.log('updateOnlineCurrenciesData: Données en ligne indisponibles');
      console.log('updateOnlineCurrenciesData: BASCULEMENT EN MODE HORS-LIGNE');
      model.samPresent({do:'changeDataMode', dataMode:'offline'});
    }
  },

  //----------------------------------------------------------- CurrenciesUI ---

  // TODO: ajoutez vos fonctions...
  filtreTexte(data){
    model.samPresent({do:'filtreTexte', x:data.e.target.value })
  },
  filtreNombre(data){
    model.samPresent({do:'filtreNombre', x:data.e.target.value })
  },
  changeDevise(data){
    model.samPresent({do:'changeDevise', x:data.e.target.value })
  },
  changeCoinsColor(data){
    model.samPresent({do:'changeCoinsColor', x:data.code})
  },
  changeFiatsColor(data){
    model.samPresent({do:'changeFiatsColor', x:data.code})
  },
  //----------------------------------------------- CurrenciesUI et WalletUI ---
  changeTab(data) {
    model.samPresent({do:'changeTab', ...data});
  },
  confirmPortofolio() {
    model.samPresent({do:'confirmPortofolio'});
  },
  changeCoinQuantity(data) {
    model.samPresent({do: 'changeCoinQuantity', val:data.e.target.value, code:data.code})
    //console.log(data);
  },
  confirmAjouter() {
    model.samPresent({do:'confirmAjouter'});
  },

  //----------------------------------------------------------- CurrenciesUI ---

  // TODO: ajoutez vos fonctions...

  //---------------------------------------------------------- PreferencesUI ---

  changeTarget(data) {
    data.target = data.e.target.value;
    delete data.e;
    this.updateOnlineCurrenciesData(data)
  },

  changeDataMode(data) {
    data.dataMode = data.e.target.value;
    delete data.e;
    if (data.dataMode == 'online') {
      this.updateOnlineCurrenciesData(data)
    }
    model.samPresent({do:'changeDataMode', ...data});
  },
  annulerPortofolio() {
    model.samPresent({do:'annulerPortofolio'});
  },
  annulerAjouter() {
    model.samPresent({do:'annulerAjouter'});
  },

  //--------------------------------------------------------------- WalletUI ---

  sort(data) {
    model.samPresent({do:'sort', ...data});
  },
  changePage(data){
    model.samPresent({do:'changePage', ...data})
  },
  changeRowsPerPage(data){
    model.samPresent({do:'changeRowsPerPage', ...data})
  },
  // TODO: ajoutez vos fonctions...

};
