# SPECS FONCTIONNELLES — airbnb3

## Contexte
Clone fonctionnel d'Airbnb.com — plateforme de location de logements entre particuliers.

## Stack technique
- Next.js 15 + TypeScript + Tailwind CSS
- NextAuth.js (authentification)
- Prisma + SQLite (base de données)
- Lucide React (icônes)

## Stories MVP (9 stories)

### Story #1 — Authentification

**En tant que** utilisateur  
**Je veux** m'inscrire, me connecter et gérer mon profil  
**Pour** accéder aux fonctionnalités réservées aux membres

**Critères d'acceptation :**
- [ ] Formulaire d'inscription avec email, mot de passe, nom
- [ ] Validation des champs (email valide, mot de passe fort)
- [ ] Formulaire de connexion
- [ ] Page profil (/profile) avec informations utilisateur
- [ ] Déconnexion fonctionnelle
- [ ] Middleware protège les routes /dashboard/*

**Edge cases :**
- Email déjà utilisé → message d'erreur clair
- Mot de passe oublié → lien "reset password" (placeholder)
- Session expirée → redirection vers login

**Complexité :** M  
**Dépendances :** Aucune

---

### Story #2 — Recherche & résultats

**En tant que** voyageur  
**Je veux** rechercher des logements avec filtres  
**Pour** trouver un hébergement adapté à mes besoins

**Critères d'acceptation :**
- [ ] Barre de recherche avec destination, dates, voyageurs
- [ ] Page résultats (/search) avec grille de logements
- [ ] Filtres : prix min/max, type de logement, équipements
- [ ] Pagination ou scroll infini
- [ ] Tri : prix croissant/décroissant, meilleures notes
- [ ] Nombre de résultats affiché

**Edge cases :**
- Aucun résultat → message "Aucun logement trouvé"
- Dates passées → validation côté client
- Destination vide → suggestions populaires

**Complexité :** L  
**Dépendances :** Story #9 (base de données)

---

### Story #3 — Page détail logement

**En tant que** voyageur  
**Je veux** voir les détails complets d'un logement  
**Pour** décider si je veux réserver

**Critères d'acceptation :**
- [ ] Galerie d'images avec navigation
- [ ] Titre, description, prix par nuit
- [ ] Localisation (ville, carte statique)
- [ ] Équipements listés
- [ ] Avis des précédents voyageurs
- [ ] Informations sur l'hôte
- [ ] Calendrier de disponibilité
- [ ] Bouton "Réserver"

**Edge cases :**
- Images non chargées → placeholder
- Aucun avis → message "Soyez le premier à noter"
- Logement complet → bouton "Indisponible"

**Complexité :** M  
**Dépendances :** Story #9 (base de données)

---

### Story #4 — Système de réservation

**En tant que** voyageur  
**Je veux** réserver un logement pour des dates spécifiques  
**Pour** confirmer mon séjour

**Critères d'acceptation :**
- [ ] Sélection des dates sur calendrier
- [ ] Calcul du prix total (prips × nuits)
- [ ] Formulaire de réservation
- [ ] Confirmation avec récapitulatif
- [ ] Page "Mes réservations" (/dashboard/traveler)
- [ ] Annulation de réservation
- [ ] Statut : confirmée, annulée, terminée

**Edge cases :**
- Dates déjà réservées → message d'erreur
- Réservation annulée → remboursement (simulé)
- Changement de dates → recalcul prix

**Complexité :** L  
**Dépendances :** Story #1 (auth), Story #3 (détail)

---

### Story #5 — Messagerie hôte/voyageur

**En tant que** voyageur ou hôte  
**Je veux** échanger des messages avec l'autre partie  
**Pour** poser des questions ou répondre aux demandes

**Critères d'acceptation :**
- [ ] Interface de messagerie dans chaque réservation
- [ ] Envoi de messages texte
- [ ] Marquer les messages comme lus
- [ ] Historique des conversations
- [ ] Notifications (badge non lus)
- [ ] Design thread conversation

**Edge cases :**
- Message vide → validation
- Conversation sans réponse → rappel après 24h (simulé)
- Hôte ne répond pas → message automatique

**Complexité :** M  
**Dépendances :** Story #4 (réservation)

---

### Story #6 — Dashboard hôte

**En tant que** hôte  
**Je veux** gérer mes annonces et réservations  
**Pour** administrer mon activité de location

**Critères d'acceptation :**
- [ ] Tableau de bord (/dashboard/host)
- [ ] Liste de mes annonces avec statut
- [ ] Création d'une nouvelle annonce
- [ ] Édition/suppression d'annonce
- [ ] Gestion des réservations (confirmer/refuser)
- [ ] Calendrier de disponibilité
- [ ] Revenus totaux (simulés)

**Edge cases :**
- Aucune annonce → CTA "Créez votre première annonce"
- Conflit de dates → avertissement
- Annonce désactivée → non visible dans les résultats

**Complexité :** L  
**Dépendances :** Story #1 (auth), Story #9 (base de données)

---

### Story #7 — Dashboard voyageur

**En tant que** voyageur  
**Je veux** voir mes réservations et voyages passés  
**Pour** suivre mes plans de voyage

**Critères d'acceptation :**
- [ ] Tableau de bord (/dashboard/traveler)
- [ ] Réservations à venir
- [ ] Voyages passés
- [ ] Favoris (logements sauvegardés)
- [ ] Avis à laisser après séjour
- [ ] Historique des messages

**Edge cases :**
- Aucune réservation → suggestions de destinations
- Séjour en cours → badge "En cours"
- Avis déjà laissé → bouton "Modifier"

**Complexité :** M  
**Dépendances :** Story #1 (auth), Story #4 (réservation)

---

### Story #8 — Avis et notes

**En tant que** voyageur  
**Je veux** laisser un avis sur un logement après mon séjour  
**Pour** aider les futurs voyageurs

**Critères d'acceptation :**
- [ ] Formulaire d'avis (note 1-5, commentaire)
- [ ] Affichage des avis sur page détail
- [ ] Note moyenne calculée
- [ ] Réponse de l'hôte possible
- [ ] Filtrage avis par note
- [ ] Pagination des avis

**Edge cases :**
- Avis vide → validation
- Note extrême (1 ou 5) → vérification
- Avis dupliqué → prévention
- Séjour non terminé → pas d'avis possible

**Complexité :** S  
**Dépendances :** Story #4 (réservation)

---

### Story #9 — Base de données & seed

**En tant que** développeur  
**Je veux** une base de données peuplée avec des données réalistes  
**Pour** tester et démontrer l'application

**Critères d'acceptation :**
- [ ] Schéma Prisma complet (User, Listing, Booking, Message, Review)
- [ ] Seed de 25 logements réalistes en France
- [ ] Images Unsplash pour chaque logement
- [ ] 10 utilisateurs fictifs
- [ ] 50 réservations historiques
- [ ] 100 avis et notes
- [ ] Commandes : `npx prisma db push`, `npx prisma db seed`

**Edge cases :**
- Données corrompues → seed idempotent
- Images non disponibles → fallback local
- Dates cohérentes (pas de réservations dans le futur lointain)

**Complexité :** M  
**Dépendances :** Aucune (prérequis pour les autres stories)

---

## Stories supplémentaires proposées par le BA

### Story #10 — Favoris

**En tant que** voyageur  
**Je veux** sauvegarder des logements dans mes favoris  
**Pour** les consulter plus tard

**Critères d'acceptation :**
- [ ] Bouton ♡ sur chaque carte logement
- [ ] Page /favorites avec logements sauvegardés
- [ ] Suppression des favoris
- [ ] Partage des favoris (lien)

**Complexité :** S  
**Dépendances :** Story #1 (auth), Story #2 (recherche)

---

### Story #11 — Calendrier de disponibilité

**En tant que** hôte  
**Je veux** gérer les dates disponibles de mon logement  
**Pour** éviter les doubles réservations

**Critères d'acceptation :**
- [ ] Calendrier interactif dans dashboard hôte
- [ ] Marquer des dates comme indisponibles
- [ ] Blocage de périodes
- [ ] Synchronisation avec réservations existantes

**Complexité :** M  
**Dépendances :** Story #6 (dashboard hôte)

---

### Story #12 — Notifications

**En tant que** utilisateur  
**Je veux** recevoir des notifications pour les événements importants  
**Pour** rester informé

**Critères d'acceptation :**
- [ ] Notifications : nouvelle réservation, message, avis
- [ ] Badge sur l'icône cloche
- [ ] Liste des notifications
- [ ] Marquer comme lues
- [ ] Paramètres de notification

**Complexité :** M  
**Dépendances :** Story #1 (auth)

---

## Priorisation

### MVP (Phase 1)
1. #9 — Base de données & seed
2. #1 — Authentification
3. #2 — Recherche & résultats
4. #3 — Page détail logement
5. #4 — Système de réservation
6. #5 — Messagerie
7. #6 — Dashboard hôte
8. #7 — Dashboard voyageur
9. #8 — Avis et notes

### Phase 2 (améliorations)
10. #10 — Favoris
11. #11 — Calendrier de disponibilité
12. #12 — Notifications

## Design référence
Site à imiter : Airbnb.com
- Couleurs : #FF385C (rouge), #222222 (texte), #717171 (secondaire)
- Police : Circular (Airbnb Cereal)
- Espacements : généreux, cards avec ombres
- Responsive : mobile-first

## Validation
Toutes les stories doivent être testées par le QA avec les critères d'acceptation ci-dessus.