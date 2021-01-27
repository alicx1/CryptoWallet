
//--------------------------------------------------------------------- View ---
// Génération de portions en HTML et affichage
//
view = {

  // Injecte le HTML dans une balise de la page Web.
  samDisplay(sectionId, representation) {
    const section = document.getElementById(sectionId);
    section.innerHTML = representation;
  },

  // Renvoit le HTML de l'interface complète de l'application
  appUI(model, state) {
    const configsChooserHTML = this.configsChooserUI();
    return `
    <div class="container">
      ${configsChooserHTML}
      <h1 class="text-center">Portfolio Cryptos</h1>
      <br />
      <div class="row">
        <div class="col-lg-6">
            ${state.representations.currencies}
        <br />
        </div>

        <div class="col-lg-6">
          ${state.representations.preferences}
          <br />
          ${state.representations.wallet}
          <br />
        </div>
      </div>
    </div>
    `;
  },

  configsChooserUI() {
    const options = Object.keys(configs).map(v => {
      const selected = configsSelected == v ? 'selected="selected"' : '';
      return `
      <option ${selected}>${v}</option>
      `;
    }).join('\n');
    return `
    <div class="row">
      <div class="col-md-7"></div>
      <div class="col-md-5">
      <br />
        <div class="d-flex justify-content-end">
          <div class="input-group">
            <div class="input-group-prepend ">
              <label class="input-group-text">Config initiale :</label>
            </div>
            <select class="custom-select" onchange="actions.reinit({e:event})">
              ${options}
            </select>
          </div>
        </div>
      </div>
    </div>
    <br />
    `;
  },

  currenciesUI(model, state) {
    const tabName = model.ui.currenciesCard.selectedTab;
    switch (tabName) {
      case 'cryptos': return this.currenciesCrytopsUI(model, state); break;
      case 'fiats'  : return this.currenciesFiatsUI  (model, state); break;
      default:
        console.error('view.currenciesUI() : unknown tab name: ', tabName);
        return '<p>Error in view.currenciesUI()</p>';
    }
  },

  currenciesCrytopsUI(model, state) {

    const paginationHTML = this.paginationUI(model, state, 'cryptos');
    const filtreTexte = model.ui.currenciesCard.tabs.cryptos.filters.text;
    const filtreNombre = model.ui.currenciesCard.tabs.cryptos.filters.price;
    const rowsPerPage = model.ui.currenciesCard.tabs.cryptos.pagination.rowsPerPage;
    const rowsPerPageIndex = model.ui.currenciesCard.tabs.cryptos.pagination.rowsPerPageIndex;
    const currentPage = model.ui.currenciesCard.tabs.cryptos.pagination.currentPage;
    const rowsPerPageActive = rowsPerPage[rowsPerPageIndex];
    const debut = (currentPage * rowsPerPageActive - rowsPerPageActive) + 1;
    var fin = 0;
    if ((debut+rowsPerPageActive) <= state.data.cryptos.filtered.length) {
      fin = debut+rowsPerPageActive;
    }
    else {
      fin = state.data.cryptos.filtered.length;
    }
    const tabProv = state.data.cryptos.filtered.slice(debut-1,fin);

    return `
    <div class="card border-secondary" id="currencies">
      <div class="card-header">
        <ul class="nav nav-pills card-header-tabs">
          <li class="nav-item">
            <a class="nav-link active" href="#currencies"> Cryptos <span
                class="badge badge-light">${state.data.cryptos.filtered.length} / ${state.data.cryptos.listNum}</span></a>
          </li>
          <li class="nav-item">
            <a class="nav-link text-secondary" href="#currencies"
              onclick="actions.changeTab({tab:'currenciesFiats'})"> Monnaies cibles
              <span class="badge badge-secondary">${state.data.fiats.filtered.length} / ${state.data.fiats.listNum}</span></a>
          </li>
        </ul>
      </div>
      <div class="card-body">
        <div class="input-group">
          <div class="input-group-append">
            <span class="input-group-text">Filtres : </span>
          </div>
          <input value="${filtreTexte}" id="filterText" type="text" class="form-control"
            placeholder="code ou nom..."  onchange="actions.filtreTexte({e:event})"/>
          <div class="input-group-append">
            <span class="input-group-text">Prix &gt; </span>
          </div>
          <input id="filterSup" type="number" class="form-control" value="${filtreNombre}" min="0" onchange="actions.filtreNombre({e:event})"/>
        </div> <br />
        <div class="table-responsive">
          <table class="col-12 table table-sm table-bordered">
            <thead>
              <th class="align-middle text-center col-2">
                <a href="#currencies" onclick="actions.sort({currency:'cryptos', column:0})">Code</a>
              </th>
              <th class="align-middle text-center col-5">
                <a href="#currencies" onclick="actions.sort({currency:'cryptos', column:1})">Nom</a>
              </th>
              <th class="align-middle text-center col-2">
                <a href="#currencies" onclick="actions.sort({currency:'cryptos', column:2})">Prix</a>
              </th>
              <th class="align-middle text-center col-3">
                <a href="#currencies" onclick="actions.sort({currency:'cryptos', column:3})">Variation</a>
              </th>
            </thead>

            ${tabProv.map((v,i) =>

            `<tr class="${state.data.coins.posValueCodes.includes(v.code)? 'bg-success text-light' : state.data.coins.nullValueCodes.includes(v.code)? 'bg-warning' : ''}" onclick="actions.changeCoinsColor({code:'${v.code}'})">
              <td class="text-center">
                <span class="badge badge-pill badge-light">
                  <img src="${v.icon_url}" /> ${v.code}
                </span></td>
              <td><b>${v.name}</b></td>
              <td class="text-right"><b>${v.price.toFixed(2)}</b></td>
              <td class="text-right">${v.change.toFixed(3)} ${v.change==0 ? `∼` : v.change>0 ? `↗` : `↘`}</td>
            </tr>
            `).join('\n')}


          </table>
        </div>
        ${paginationHTML}
      </div>
      <div class="card-footer text-muted"> Cryptos préférées :
      ${state.data.coins.allCodes.map((v) =>
      `<span class="badge badge-${state.data.coins.nullValueCodes.includes(v)? 'warning' : `success`}">${v}</span>`
    ).join(' ')}
      </div>
    </div>
    `;
  },

  paginationUI(model, state, currency) {
    const rowsPerPage = model.ui.currenciesCard.tabs[currency].pagination.rowsPerPage;
    const rowsPerPageIndex = model.ui.currenciesCard.tabs[currency].pagination.rowsPerPageIndex;
    const nbPages = state.ui.currenciesCard.tabs[currency].pagination.nbPages;

    const currentPage = model.ui.currenciesCard.tabs[currency].pagination.currentPage;
    const maxPages = model.ui.currenciesCard.tabs[currency].pagination.maxPages;

    var debut = Math.max(currentPage - Math.floor(maxPages / 2) + 1, 1);
    const fin = Math.min(debut + maxPages - 1, nbPages);
    debut = Math.max(1, fin - maxPages + 1);

    var rendu = "";

    for(var i = debut;i<=fin; i++) {
      rendu += `<li class="page-item ${i== currentPage? `active` : ``}">
        <a class="page-link" href="#currencies" onclick="actions.changePage({index:${i},currency:'${currency}'})">${i}</a>
        </li>`
      }

    return `
    <section id="pagination">
      <div class="row justify-content-center">
        <nav class="col-auto">
          <ul class="pagination">
            <li class="page-item ${currentPage == 1? `disabled` : ``}">
              <a class="page-link" href="#currencies" onclick="actions.changePage({index:${currentPage - 1},currency:'${currency}'})">&lt;</a>
            </li>
            ${rendu}
            <li class="page-item ${currentPage == nbPages? `disabled` : ``}">
              <a class="page-link" href="#currencies" onclick="actions.changePage({index:${currentPage + 1},currency:'${currency}'})">&gt;</a>
            </li>
          </ul>
        </nav>
        <div class="col-auto">
          <div class="input-group mb-3">
            <select class="custom-select" id="selectTo" onchange="actions.changeRowsPerPage({e:event, currency:'${currency}'})">
              ${rowsPerPage.map((v,i) => `<option ${i==rowsPerPageIndex? `selected="selected"` : ``} value="${i}">${rowsPerPage[i]}</option>`).join('\n')}
            </select>
            <div class="input-group-append">
              <span class="input-group-text">par page</span>
            </div>
          </div>
        </div>
      </div>
    </section>
    `;
  },

  currenciesFiatsUI(model,state) {

    const paginationHTML = this.paginationUI(model, state, 'fiats');
    const deviseFilter = model.ui.currenciesCard.tabs.fiats.filters.text;
    const rowsPerPage = model.ui.currenciesCard.tabs.fiats.pagination.rowsPerPage;
    const rowsPerPageIndex = model.ui.currenciesCard.tabs.fiats.pagination.rowsPerPageIndex;
    const currentPage = model.ui.currenciesCard.tabs.fiats.pagination.currentPage;
    const rowsPerPageActive = rowsPerPage[rowsPerPageIndex];
    const debut = (currentPage * rowsPerPageActive - rowsPerPageActive) + 1;
    var fin = 0;
    if ((debut+rowsPerPageActive) <= state.data.fiats.filtered.length) {
      fin = debut+rowsPerPageActive;
    }
    else {
      fin = state.data.fiats.filtered.length;
    }
    const tabProv = state.data.fiats.filtered.slice(debut-1,fin);
;

    return `
    <div class="card border-secondary"
      id="currencies">
      <div class="card-header">
        <ul class="nav nav-pills card-header-tabs">
          <li class="nav-item">
            <a class="nav-link text-secondary" href="#currencies"
              onclick="actions.changeTab({tab:'currenciesCryptos'})"> Cryptos <span
                class="badge badge-secondary">${state.data.cryptos.filtered.length} / ${state.data.cryptos.listNum}</span></a>
          </li>
          <li class="nav-item">
            <a class="nav-link active" href="#currencies">Monnaies cibles <span
                class="badge badge-light">${state.data.fiats.filtered.length} / ${state.data.fiats.listNum}</span></a>
          </li>
        </ul>
      </div>
      <div class="card-body">
        <div class="input-group">
          <div class="input-group-append">
            <span class="input-group-text">Filtres : </span>
          </div>
          <input value="${deviseFilter}" id="filterText" type="text" class="form-control"
            placeholder="code ou nom..." onchange="actions.changeDevise({e:event})"/>
        </div>
        <div class="table-responsive">
          <table class="col-12 table table-sm table-bordered">
            <thead>
              <th class="align-middle text-center col-2">
                <a href="#currencies" onclick="actions.sort({currency:'fiats', column:0})">Code</a>
              </th>
              <th class="align-middle text-center col-5">
                <a href="#currencies" onclick="actions.sort({currency:'fiats', column:1})">Nom</a>
              </th>
              <th class="align-middle text-center col-2">
                <a href="#currencies" onclick="actions.sort({currency:'fiats', column:2})">Symbole</a>
              </th>

            </thead>

            ${tabProv.map((v,i)=>

            `<tr class="${(model.config.targets.active == v.code)? 'bg-success text-light' : model.config.targets.list.includes(v.code)? 'bg-warning' : ''}" onclick="actions.changeFiatsColor({code:'${v.code}'})">
              <td class="text-center">${v.code}</td>
              <td><b>${v.name}</b></td>
              <td class="text-center">${v.symbol}</td>
            </tr>
            `).join('\n')}


          </table>
        </div>
        ${paginationHTML}
      </div>
      <div class="card-footer text-muted"> Monnaies préférées :
      ${model.config.targets.list.map((v)=>
        `<span class="badge badge-${(model.config.targets.active == v)? 'success' : 'warning'}">${v}</span>`
      ).join(' ')}
      </div>
    </div>
    `;
  },

  preferencesUI(model, state) {

    const authors        = model.config.authors;
    const debug          = model.config.debug;
    const activeTarget   = model.config.targets.active;
    const updateDisabled = model.config.dataMode == 'offline' ? 'disabled="disabled"' : '';
    const target         = model.config.targets.active;
    const targetsList    = mergeUnique(model.config.targets.list,[target]).sort();
    const fiatsList      = state.data.fiats.list;

    const fiatOptionsHTML = targetsList.map( (v) => {
      const code = fiatsList[v].code;
      const name = fiatsList[v].name;
      const isOffline = model.config.dataMode == 'offline';
      const selected = code == target ? 'selected="selected"' : '';
      const disabled = isOffline && code != target ? 'disabled="disabled"' : '';
      return `
      <option value="${code}" ${selected} ${disabled}>${code} - ${name}</option>
      `;
    }).join('\n');

    const dataModeOptionsHTML = [['online', 'En ligne'], ['offline', 'Hors ligne']].map( v => {
      const selected = v[0] == model.config.dataMode ? 'selected="selected"' : '';
      return `<option value="${v[0]}" ${selected}>${v[1]}</option>`;
    }).join('\n');

    return `
    <div class="card border-secondary">
      <div class="card-header d-flex justify-content-between">
        <h5 class=""> Préférences </h5>
        <h5 class="text-secondary"><abbr title="${authors}">Crédits</abbr></h5>
      </div>
      <div class="card-body">
        <div class="input-group">
          <div class="input-group-prepend">
            <label class="input-group-text" for="inputGroupSelect01">Monnaie
              cible</label>
          </div>
          <select class="custom-select" id="inputGroupSelect01"
          onchange="actions.changeTarget({e:event, debug:'${debug}'})">
            ${fiatOptionsHTML}
          </select>
        </div>
        <p></p>
        <div class="input-group">
          <div class="input-group-prepend">
            <label class="input-group-text">Données</label>
          </div>
          <select class="custom-select" onchange="actions.changeDataMode({e:event, target:'${activeTarget}', debug:'${debug}'})">
            ${dataModeOptionsHTML}
          </select>
          <div class="input-group-append">
            <button class="btn btn-primary" ${updateDisabled}
            onclick="actions.updateOnlineCurrenciesData({target: '${activeTarget}', debug:'${debug}'})">
            Actualiser</button>
          </div>
        </div>
      </div>
    </div>
    `;
  },

  walletUI(model, state) {
    const tabName = model.ui.walletCard.selectedTab;
    switch (tabName) {
      case 'portfolio': return this.walletPortfolioUI(model, state); break;
      case 'ajouter'  : return this.walletAjouterUI  (model, state); break;
      default:
        console.error('view.currenciesUI() : unknown tab name: ', tabName);
        return '<p>Error in view.currenciesUI()</p>';
    }
  },

  walletPortfolioUI(model, state) {
    return `
    <div class="card border-secondary text-center" id="wallet">
      <div class="card-header">
        <ul class="nav nav-pills card-header-tabs">
          <li class="nav-item">
            <a class="nav-link active" href="#wallet">Portfolio <span
                class="badge badge-light">${state.data.coins.posValueCodes.length}</span></a>
          </li>
          <li class="nav-item">
            <a class="nav-link text-secondary" href="#wallet"
              onclick="actions.changeTab({tab:'walletAjouter'})"> Ajouter <span
                class="badge badge-secondary">${state.data.coins.nullValueCodes.length}</span></a>
          </li>
        </ul>
      </div>
      <div class="card-body text-center">
        <br />
        <div class="table-responsive">
          <table class="col-12 table table-sm table-bordered">
            <thead>
              <th class="align-middle text-center col-1"> Code </th>
              <th class="align-middle text-center col-4"> Nom </th>
              <th class="align-middle text-center col-2"> Prix </th>
              <th class="align-middle text-center col-3"> Qté </th>
              <th class="align-middle text-center col-2"> Total </th>
            </thead>
            ${state.data.coins.posValueCodes.map((v)=>

            `<tr>
              <td class="text-center">
                <span class="badge badge-pill badge-light">
                  <img src="${eval("state.data.cryptos.list." + v + ".icon_url")}" /> ${v}
                </span></td>
              <td><b>${eval("state.data.cryptos.list." + v + ".name")}</b></td>
              <td class="text-right">${eval("state.data.cryptos.list." + v + ".price").toFixed(2)}</td>
              <td class="text-right">
                <input type="text" class="form-control ${changeCouleur(v)}" value="${(eval("model.config.coins." + v + ".quantityNew") !== '')? eval("model.config.coins." + v + ".quantityNew") : eval("model.config.coins." + v + ".quantity") }" onchange="actions.changeCoinQuantity({e:event, code:'${v}'})"/>
              </td>
              <td class="text-right"><span class="${changeCouleur(v)}"><b>${isNaN(calculTotal(v))? calculTotal(v) : calculTotal(v).toFixed(2)}</b></span></td>
            </tr>
            `).join('\n')}

          </table>
        </div>
        <div class="input-group d-flex justify-content-end">
          <div class="input-group-prepend">
            <button class="btn ${isConfirmerPortofolioActive()? `btn-primary` : `disabled`}" onclick="actions.confirmPortofolio()">Confirmer</button>
          </div>
          <div class="input-group-append">
            <button class="btn ${isAnnulerPortofolioActive()? `btn-secondary` : `disabled`}" onclick="actions.annulerPortofolio()">Annuler</button>
          </div>
        </div>
      </div>
      <div class="card-footer">
        <h3><span class="badge ${isAnnulerPortofolioActive()? `badge-primary` : `badge badge-success`}">Total : ${totalPortofilio()} ${model.config.targets.active}</span></h3>
      </div>
    </div>
    `;
  },

  walletAjouterUI(model, state) {
    return `
    <div class="card border-secondary text-center" id="wallet">
      <div class="card-header">
        <ul class="nav nav-pills card-header-tabs">
          <li class="nav-item">
            <a class="nav-link text-secondary" href="#wallet"
              onclick="actions.changeTab({tab:'walletPortfolio'})"> Portfolio <span
                class="badge badge-secondary">${state.data.coins.posValueCodes.length}</span></a>
          </li>
          <li class="nav-item">
            <a class="nav-link active" href="#wallet">Ajouter <span
                class="badge badge-light">${state.data.coins.nullValueCodes.length}</span></a>
          </li>
        </ul>
      </div>
      <div class="card-body">
        <br />
        <div class="table-responsive">
          <table class="col-12 table table-sm table-bordered">
            <thead>
              <th class="align-middle text-center col-1"> Code </th>
              <th class="align-middle text-center col-4"> Nom </th>
              <th class="align-middle text-center col-2"> Prix </th>
              <th class="align-middle text-center col-3"> Qté </th>
              <th class="align-middle text-center col-2"> Total </th>
            </thead>
            ${state.data.coins.nullValueCodes.map((v,i)=> `
            <tr>
              <td class="text-center">
                <span class="badge badge-pill badge-light">
                  <img src="${eval("state.data.cryptos.list." + v + ".icon_url")}" /> ${v}
                </span></td>
              <td><b>${eval("state.data.cryptos.list." + v + ".name")}</b></td>
              <td class="text-right">${eval("state.data.cryptos.list." + v + ".price").toFixed(2)}</td>
              <td class="text-right">
                <input type="text" class="form-control ${changeCouleur(v)}" value="${(eval("model.config.coins." + v + ".quantityNew") !== '')? eval("model.config.coins." + v + ".quantityNew") : eval("model.config.coins." + v + ".quantity") }" onchange="actions.changeCoinQuantity({e:event, code:'${v}'})" />
              </td>
              <td class="text-right"><span class="${changeCouleur(v)}"><b>${isNaN(calculTotal(v))? calculTotal(v) : calculTotal(v).toFixed(2)}</b></span></td>
            </tr>`).join('\n')}

          </table>
        </div>
        <div class="input-group d-flex justify-content-end">
          <div class="input-group-prepend">
            <button class="btn ${isConfirmerAjouterActive()? `btn-primary` : `disabled`}" onclick="actions.confirmAjouter()">Confirmer</button>
          </div>
          <div class="input-group-append">
            <button class="btn ${isAnnulerAjouterActive()? `btn-secondary` : `disabled`}" onclick="actions.annulerAjouter()">Annuler</button>
          </div>
        </div>
      </div>
      <div class="card-footer">
        <h3><span class="badge ${isAnnulerAjouterActive()? `badge-primary` : `badge badge-success`}">Total : ${totalAjouter()} ${model.config.targets.active}</span></h3>
      </div>
    </div>
    `;
  },


}
