# CryptoWallet

#### French

C'est un projet réalisé lors de ma 2émé année à l'université.
C'est un portfolio pour des cryptomonnaies.

C'est une application front end en JavaScript qui utilise le pattern [SAM](https://sam.js.org/) (action, model, state, view) et un API public [CoinLayer](https://coinlayer.com/).

#### English

This project was done during my second year at University.
It's a wallet for crypto currency.

It's a front-end app developed in JavaScript that uses the [SAM](https://sam.js.org/) (action, model, state, view) pattern and a public API [CoinLayer](https://coinlayer.com/).

## Remarques (fr)

- Testé seulement sur Firefox.

- Dans le fichier `coinlayer.js` il faut changer la valeur de `apiKey` pour avoir accès à la fonction en-ligne qui permet de mettre à jouer les valeurs. (Il faut créer un compte sur [coinLayer](https://coinlayer.com/) pour avoir une clé perso).

- Les fichiers `cryptop__configX.js` sont juste différentes configurations pour tester l'application.

- Les fichiers `cryptop_actions.js`, `cryptop_model.js`, `cryptop_state.js` et `cryptop_view.js` sont séparés pour plus de visibilité. Ils auraient pu être merge dans un seul fichier.

- Il y a des améliorations à faire vu que c'était un ancien projet.

## Notes (en)

- The app is in french and the comments are also in french.

- Only tested on Firefox.

- In the file `coinlayer.js` you need to change the value of `apiKey` in order to get access to the "online" function that allows you to update the values of the currencies. (You need to create an account in [coinLayer](https://coinlayer.com/) to get a personal key).

- The files `cryptop__configX.js` are just different configurations to test the app.

- The files `cryptop_actions.js`, `cryptop_model.js`, `cryptop_state.js` et `cryptop_view.js` are separated for more visibility. You can merge them to have one file.

- This is an old project so it's not very clean and can be improved.

## Preveiw

![interface](https://i.imgur.com/uQtLnOk.png)

## Usage

#### (FR)

L'utilisateur :

- clique dans l'onglet "Cryptos" pour sélectionner les cryptos qui l'intéressent (ou les désélectionner) et qu'on peut filtrer selon leur code/nom ou leur valeur.
- change leur quantité dans l'onglet "Ajouter" pour les ajouter à son portfolio.
- clique dans l'onglet "Monnaies cibles" pour sélectionner (ou désélectionner) ses monnaies préférées.
- change la monnaie cible courante dans l'onglet "Préférences" (il faut mettre les données sur "En ligne").
- modifie la quantité de ses cryptos-monnaies pour connaître la valeur de son portfolio.
- supprime une crypto de son portfolio en mettant une quantité à nulle.
- clique sur "Actualiser" pour mettre à jour la valeur de son portfolio (quand des données sont "En ligne").

#### (EN): I'm too lazy to translate. Sorry :(
