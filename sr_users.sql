-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mer. 12 fév. 2025 à 17:33
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `sr_users`
--

-- --------------------------------------------------------

--
-- Structure de la table `app_role`
--

CREATE TABLE `app_role` (
  `id` bigint(20) NOT NULL,
  `role_name` varchar(255) DEFAULT NULL,
  `type_role` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `app_role`
--

INSERT INTO `app_role` (`id`, `role_name`, `type_role`) VALUES
(122, 'USER', 'ADMINISTARTION'),
(123, 'ADMIN', 'ADMINISTARTION'),
-- --------------------------------------------------------

--
-- Structure de la table `app_user`
--

CREATE TABLE `app_user` (
  `id` bigint(20) NOT NULL,
  `account_non_expired` bit(1) NOT NULL,
  `account_non_locked` bit(1) NOT NULL,
  `actived` bit(1) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `credentials_non_expired` bit(1) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `enabled` bit(1) NOT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `access_token` varchar(255) DEFAULT NULL,
  `refresh_token` varchar(255) DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `session_expired` bit(1) NOT NULL,
  `working_days` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `app_user`
--

INSERT INTO `app_user` (`id`, `account_non_expired`, `account_non_locked`, `actived`, `avatar`, `credentials_non_expired`, `email`, `enabled`, `first_name`, `last_name`, `password`, `role`, `token`, `username`, `access_token`, `refresh_token`, `full_name`, `session_expired`, `working_days`) VALUES
125, b'1', b'0', b'1', 'unknown.png', b'1', 'r.bouzid@rouandi.ma', b'1', 'rkia', 'bouzid', '$2a$10$bVqNeWokx3MuZ9RRMhf2X.nKj2E3xV2hLGZI9qRgcuDbyZsxr8GrK', 'ADMIN', NULL, 'r,bouzid', '', '', 'rkia bouzid', b'0', NULL),
(126, b'1', b'1', b'1', 'unknown.png', b'1', 'r.bouzid@rouandi.ma', b'1', 'rkia', 'bouzid', '$2a$10$DwGpMOSv.u4RYrml79Dw1..ABaA3KkW8qHKK8.qNYZXG2MKj02/JK', 'ADMIN', NULL, 'r.bouzid', '', '', 'rkia bouzid', b'0', NULL),
(127, b'1', b'1', b'1', 'unknown.png', b'1', 'c.elkouch@rouandi.ma', b'1', 'chaimaa', 'el kouch', '$2a$10$noqML/hW01VdquDGNpC9WeNTKcI5WNCCGN8ZLQhDAo9uk/TFSfSoe', 'ADMIN', NULL, 'c.elkouch', '', '', 'chaimaa el kouch', b'0', NULL),
(128, b'1', b'1', b'1', 'unknown.png', b'1', 'j.fakrach@rouandi.ma', b'1', 'jihad', 'fakrach', '$2a$10$U.EyjrvBQxgvbtav.cYX7uZik72fp4R9JU0MaXy00AsHp/LnuLDxK', 'ADMIN', NULL, 'j.fakrach', '', '', 'jihad fakrach', b'0', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `app_user_app_roles`
--

CREATE TABLE `app_user_app_roles` (
  `app_user_id` bigint(20) NOT NULL,
  `app_roles_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `app_user_app_roles`
--

INSERT INTO `app_user_app_roles` (`app_user_id`, `app_roles_id`) VALUES
(126, 123),
(125, 123),
(127, 123),
(128, 123);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `app_role`
--
ALTER TABLE `app_role`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `app_user`
--
ALTER TABLE `app_user`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `app_user_app_roles`
--
ALTER TABLE `app_user_app_roles`
  ADD KEY `FK8caosscox5onsgcvll6tqmk21` (`app_roles_id`),
  ADD KEY `FKsno3iwx8ppdc085g7ovuc8h7w` (`app_user_id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `app_role`
--
ALTER TABLE `app_role`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=174;

--
-- AUTO_INCREMENT pour la table `app_user`
--
ALTER TABLE `app_user`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=129;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `app_user_app_roles`
--
ALTER TABLE `app_user_app_roles`
  ADD CONSTRAINT `FK8caosscox5onsgcvll6tqmk21` FOREIGN KEY (`app_roles_id`) REFERENCES `app_role` (`id`),
  ADD CONSTRAINT `FKsno3iwx8ppdc085g7ovuc8h7w` FOREIGN KEY (`app_user_id`) REFERENCES `app_user` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
