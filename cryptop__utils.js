
// Renvoie la fusion de deux tableaux, dépourvue de doublons
function mergeUnique(a1, a2) {
  return [...new Set([...a1, ...a2])];
}
//Calcul le total des monnaies
function calculTotal(v) {
  if (eval("model.config.coins." + v + ".quantityNew") < 0 || eval("isNaN(model.config.coins." + v + ".quantityNew)")) return "???";
  else if ((eval("model.config.coins." + v + ".quantityNew") == ``)) return (eval("model.config.coins." + v + ".quantity") * eval("state.data.cryptos.list." + v + ".price"));
  else return (eval("model.config.coins." + v + ".quantityNew") * eval("state.data.cryptos.list." + v + ".price"));
}

function totalPortofilio() {
  let som =0;
  let long = state.data.coins.posValueCodes.length;
  for (var i= 0; i<long; i++) {
    let tmp = calculTotal(state.data.coins.posValueCodes[i]);
    if (isNaN(tmp)) {}
    else{ som += tmp;}
  }
  return (som.toFixed(2));
}

function totalAjouter() {
  let som =0;
  let long = state.data.coins.nullValueCodes.length;
  for (var i= 0; i<long; i++) {
    let tmp = calculTotal(state.data.coins.nullValueCodes[i]);
    if (isNaN(tmp)) {}
    else{ som += tmp;}
  }
  return (som.toFixed(2));
}
//Couleur html bleue, rouge et noire
function changeCouleur(v) {
  if (eval("model.config.coins." + v + ".quantityNew") < 0 || eval("isNaN(model.config.coins." + v + ".quantityNew)")) return "text-danger";
  else if (eval("model.config.coins." + v + ".quantityNew") !== ``) return "text-primary";
  else return "";
}

function isConfirmerPortofolioActive() {
  var porto = state.data.coins.posValueCodes;
  var aux = 0;
  for (var i = 0; i < porto.length; i++){
    if (model.config.coins[porto[i]].quantityNew < 0) return false;
    if (isNaN(model.config.coins[porto[i]].quantityNew)) return false;
    if (model.config.coins[porto[i]].quantityNew == "") aux++;
  }
  if (aux == i) return false;
  return true;
}
function isConfirmerAjouterActive() {
  var porto = state.data.coins.nullValueCodes;
  var aux = 0;
  for (var i = 0; i < porto.length; i++){
    if (model.config.coins[porto[i]].quantityNew < 0) return false;
    if (isNaN(model.config.coins[porto[i]].quantityNew)) return false;
    if (model.config.coins[porto[i]].quantityNew == "") aux++;
  }
  if (aux == i) return false;
  return true;
}
function isAnnulerPortofolioActive() {
  let porto = state.data.coins.posValueCodes;

  for (let i = 0; i<porto.length; i++) {
      if (model.config.coins[porto[i]].quantityNew !== "") return true;
    }
    return false;
}
function isAnnulerAjouterActive() {
  let ajout = state.data.coins.nullValueCodes;

  for (let i = 0; i<ajout.length; i++) {
      if (model.config.coins[ajout[i]].quantityNew !== "") return true;
    }
    return false;
}
