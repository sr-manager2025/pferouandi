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
(124, 'ASSIST_ACHAT', 'ADMINISTARTION'),
(125, 'ASSIST_COMPTA', 'ADMINISTARTION'),
(126, 'ASSIST_INFO', 'ADMINISTARTION'),
(127, 'ASSIST_LOG', 'ADMINISTARTION'),
(128, 'ASSIST_MARCHE', 'ADMINISTARTION'),
(129, 'ASSIST_RH', 'ADMINISTARTION'),
(130, 'ASSIST_ST', 'ADMINISTARTION'),
(131, 'CHEF_CH', 'CHANTIER'),
(132, 'COMPT_CH', 'CHANTIER'),
(133, 'COND_CH', 'CHANTIER'),
(134, 'DAF', 'ADMINISTARTION'),
(135, 'DIR_PROJET', 'ADMINISTARTION'),
(136, 'DIR_TECH', 'ADMINISTARTION'),
(137, 'GARDIENT_CH_JOUR', 'CHANTIER'),
(138, 'CHEF_ZONE', 'CHANTIER'),
(139, 'ING_CH', 'CHANTIER'),
(140, 'METREUR', 'ADMINISTARTION'),
(141, 'POINTEUR', 'CHANTIER'),
(142, 'RESP_ACHAT', 'ADMINISTARTION'),
(143, 'RESP_COMPTA', 'ADMINISTARTION'),
(144, 'RESP_DEPOT', 'CHANTIER'),
(145, 'RESP_INFO', 'ADMINISTARTION'),
(146, 'RESP_LOG', 'ADMINISTARTION'),
(147, 'RESP_MARCHE', 'ADMINISTARTION'),
(148, 'RESP_METREE', 'ADMINISTARTION'),
(149, 'RESP_RH', 'ADMINISTARTION'),
(150, 'RESP_ST', 'ADMINISTARTION'),
(151, 'TECH_CH', 'CHANTIER'),
(152, 'TOPOGRAPHE', 'CHANTIER'),
(153, 'PDG', 'ADMINISTARTION'),
(154, 'DGA', 'ADMINISTARTION'),
(155, 'CAPORAL', 'CHANTIER'),
(156, 'TRACEUR', 'CHANTIER'),
(157, 'MAGASINIER_CH', 'CHANTIER'),
(158, 'RESP_CAISSE', 'ADMINISTARTION'),
(159, 'CAISSIER', 'ADMINISTARTION'),
(160, 'CDG', 'ADMINISTARTION'),
(161, 'AUDIT', 'ADMINISTARTION'),
(162, 'JUR', 'ADMINISTARTION'),
(164, 'DIR_RESSOURCES', 'ADMINISTARTION'),
(165, 'GARDIENT_CH_NUIT', 'CHANTIER'),
(166, 'RESP_RWOOD', 'ADMINISTARTION'),
(167, 'RESP_RMETAL', 'ADMINISTARTION'),
(168, 'RESP_STR_RALU', 'ADMINISTARTION'),
(169, 'RESP_STR_RFLOW', 'ADMINISTARTION'),
(170, 'RESP_STR_RWOOD', 'ADMINISTARTION'),
(171, 'RESP_STR_RMETAL', 'ADMINISTARTION'),
(172, 'RESP_STR_RELEC', 'ADMINISTARTION'),
(173, 'MANAGER_ATELIERS', 'ADMINISTARTION');

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
(58, b'1', b'1', b'1', '6121.jpg', b'1', 'abousalih@rouandi.ma', b'1', 'LAHCEN', 'ABOUSALIH', '$2a$10$JuJtlmOyPiZBLqJeZ9ZZfuN/puMzWs87xpjvAkcQJ7L9h52zmrzH2', 'ADMIN', '', '6121', NULL, NULL, 'LAHCEN ABOUSALIH', b'0', NULL),
(59, b'1', b'1', b'1', 'unknown.png', b'1', 'hrouandi@gmail.com', b'1', 'HICHAM', 'ROUANDI', '$2a$10$G31pvobLWpptmbNjKTpfkOEPdNEaArXyPaB28K52aEm08q8S1v3sK', 'PDG', '', '6015', NULL, NULL, 'HICHAM ROUANDI', b'0', NULL),
(60, b'1', b'1', b'1', 'unknown.png', b'1', 'm.rakib@rouandi.ma', b'1', 'MOHAMMED', 'RAKIB', '$2a$10$.AUqerOayAQvJBR/YhuKZuXqUsY3VfgCD8C6eO4f7pt4OmPsAnGWy', 'DGA', '', '6008', NULL, NULL, 'MOHAMMED RAKIB', b'0', NULL),
(61, b'1', b'1', b'1', 'unknown.png', b'1', 'i.houna@rouandi.ma', b'1', 'IMAD', 'HOUNA', '$2a$10$.3I.IRYdqdlUC5pzOYMUounJzi3mIjT4Fk80pNvJkyFmhAJmfujoG', 'DAF', '', '6000', NULL, NULL, 'IMAD HOUNA', b'0', NULL),
(62, b'0', b'0', b'1', 'unknown.png', b'0', 'a.assal@rouandi.ma', b'1', 'ABDELOUAHED', 'ASSAL', '$2a$10$R35twSO7j9SjshxPORgqf.xBmXUtJKw3wKxLN0Dsmx6QCrqQ8bSOG', 'RESP_METREE', '', '6002', NULL, NULL, 'ABDELOUAHED ASSAL', b'0', NULL),
(63, b'0', b'0', b'1', 'unknown.png', b'0', 'j.grouni@rouandi.ma', b'1', 'JIHANE', 'GROUNI', '$2a$10$NWmzi/4KQ.OjsOX9KIqHOuda25FN4cVy5xNknzFSg5xNUT.8YH2..', 'RESP_ST', '', '6027', NULL, NULL, 'JIHANE GROUNI', b'0', NULL),
(64, b'0', b'0', b'1', 'unknown.png', b'0', 'L.branca@rouandi.ma', b'1', 'LATIFA', 'BRANCA', '$2a$10$8Lp1q2G5MLkRXHstUnIdN.oX4NvbaeWA3hhojS99Fl6gp9xU2/ODO', 'RESP_ST', '', '6075', NULL, NULL, 'LATIFA BRANCA', b'0', NULL),
(65, b'1', b'0', b'1', 'unknown.png', b'1', 'l.branca@rouandi.ma', b'1', 'HIBA', 'IFRIQUI', '$2a$10$m71wnQgDxjBEKSAqHt4U4e26uVL4dZHe5ltNSCjl61JieQv9305E.', 'USER', '', '6018', NULL, NULL, 'HIBA IFRIQUI', b'0', NULL),
(66, b'1', b'1', b'1', 'unknown.png', b'1', 's.sniba@rouandi.ma', b'1', 'JAMILA', 'SNIBA', '$2a$10$fiG.fvMMLWQGytLKa.sj2.qWGP4C4wh/ngiIvRfe2GcQbkVUw.n4e', 'CDG', '', '6145', NULL, NULL, 'JAMILA SNIBA', b'0', NULL),
(67, b'1', b'1', b'1', 'unknown.png', b'1', 'f.hadry@rouandi.ma', b'1', 'FATIMZAHRA', 'HADRI', '$2a$10$9RT48fAZClS7DvAH.dHQM.oqvZjGHPv///qq6ao/QHniMrlq.pynK', 'USER', '', '6088', NULL, NULL, 'FATIMZAHRA HADRI', b'0', NULL),
(68, b'1', b'0', b'1', 'unknown.png', b'1', 'y.hadi@rouandi.ma', b'1', 'YOUNESS', 'HADI', '$2a$10$FTe6lu0wKY/OCSnm5PVrq.iDoFJDc8wDBIfnFSXHT/C9LTyvwigxC', 'CHEF_ZONE', '', '6051', NULL, NULL, 'YOUNESS HADI', b'0', NULL),
(69, b'0', b'0', b'1', 'unknown.png', b'0', 'outhman.rouandi@gmail.com', b'1', 'OUTMANE', 'LAAMACH ', '$2a$10$qzHTNrDrc.aCcd/1OeifCu2C8h95cNi1S.CUAgs3G.w74cNfPsWfO', 'CHEF_ZONE', '', '6063', NULL, NULL, 'OUTMANE LAAMACH ', b'0', NULL),
(70, b'1', b'0', b'1', 'unknown.png', b'1', 't.boulouiz@rouandi.ma', b'1', 'TARIK', 'BOULOUIZ', '$2a$10$C2swtWkEYDcODiigKc0oCe01yJ9KJk9Xw5jCl0YzR7RG0QbRvdONu', 'CHEF_ZONE', '', '6152', NULL, NULL, 'TARIK BOULOUIZ', b'0', NULL),
(71, b'1', b'1', b'1', 'unknown.png', b'1', 'm.yassi@rouandi.ma', b'1', 'MOHAMMED', 'YASSI', '$2a$10$zaDwfbZ.CgAK5j8NG3kWf.ScwdEIRVu9OFlvfDNPsyIt1MEKLts4.', 'COND_CH', '', '6084', NULL, NULL, 'MOHAMMED YASSI', b'0', NULL),
(72, b'1', b'1', b'1', 'unknown.png', b'1', 'o.tanani@rouandi.ma', b'1', 'OUSSAMA', 'TANANI', '$2a$10$o4Y/5sbaSNPnBlvI0uCSze/am04mbhauaz6nuPdyekQBc8c1h/rke', 'TECH_CH', '', '6124', NULL, NULL, 'OUSSAMA TANANI', b'0', NULL),
(73, b'1', b'1', b'1', 'unknown.png', b'1', 'rajae.allouani@gmail.com', b'1', 'RAJAE', 'ALLOUANI', '$2a$10$p.rZ6OXR3K3II9CP7GeFgOs6NiFM/YFG.BD5/iKD7EbkMEAiP9Yne', 'TECH_CH', '', '6115', NULL, NULL, 'RAJAE ALLOUANI', b'0', NULL),
(74, b'1', b'0', b'1', 'unknown.png', b'1', 'm.yassi@rouandi.ma', b'1', 'AZIZ', 'ELBOUAZIZI', '$2a$10$8Z1ZuZnbhNuh.Dj72Kyw0.PqsI9stPF3lOzHA4jCKF2VhooigxncO', 'CHEF_CH', '', '6030', NULL, NULL, 'AZIZ ELBOUAZIZI', b'0', NULL),
(75, b'0', b'0', b'1', 'unknown.png', b'0', 'a.allili@rouandi.ma', b'1', 'ABDELFETTAH', 'ALLILI', '$2a$10$l0Y3K08wnqTrHdTxi.Ou.u/w.JkPf6.cAGOX0zDUZIIZz1n4Fw3HC', 'COMPT_CH', '', '6057', NULL, NULL, 'ABDELFETTAH ALLILI', b'0', NULL),
(76, b'0', b'0', b'1', 'unknown.png', b'0', 'b.beliyd@rouandi.ma', b'1', 'BRAHIM', 'BELIYD', '$2a$10$TQdu.ZfGIfzDvbDLI8vdpOsgFaHydcn3jCwqUvHR4qfmbaJxrwxqS', 'COMPT_CH', '', '6034', NULL, NULL, 'BRAHIM BELIYD', b'0', NULL),
(77, b'0', b'0', b'1', 'unknown.png', b'0', 's.benkarim@rouandi.ma', b'1', 'SOULAYMANE', 'BENKARIM ', '$2a$10$96wgkx9u6EulcdbTuJ7A/OFmgY9R65iyovm7bU8R5qvMpveyaCU2O', 'COND_CH', '', '6089', NULL, NULL, 'SOULAYMANE BENKARIM ', b'0', NULL),
(78, b'1', b'0', b'1', 'unknown.png', b'1', 'm.adjari@rouandi.ma', b'1', 'MOHAMED', 'ADJARI', '$2a$10$ILqAnIiGYZFq2CDg5aE.dOYp0kw0M14u6FrmWA4/lNbzrTDvmKR7y', 'CHEF_CH', '', '6116', NULL, NULL, 'MOHAMED ADJARI', b'0', NULL),
(79, b'1', b'1', b'1', 'unknown.png', b'1', 'm.bougadi@rouandi.ma', b'1', 'MEHDI ', 'BOUGADI ', '$2a$10$dLN6yWWso0hXTCsLJGMwGOqRaUo3POwAmWTAeJF6yiELNo.E9hme6', 'TECH_CH', '', '6126', NULL, NULL, 'MEHDI  BOUGADI ', b'0', NULL),
(80, b'0', b'0', b'1', 'unknown.png', b'0', 'a.ouhassan@rouandi.ma', b'1', 'AISSAM', 'OUHASSAN', '$2a$10$BNqAGte4gX200pVtKzRMwu7axQsjihYIjgl7ufcjHkvyQ7MR/Ifn2', 'MAGASINIER_CH', '', '6103', NULL, NULL, 'AISSAM OUHASSAN', b'0', NULL),
(81, b'0', b'0', b'1', 'unknown.png\r\n', b'0', 's.barakat@rouandi.ma', b'1', 'SOUKAINA', 'BARAKAT', '$2a$10$cdAKItKzmr0cmGkNmp6JE.9xuOLhQDlZZXNE4KaDOMydDkelrkZeu', 'RESP_ST', '123', '6151', '123', '123', 'SOUKAINA BARAKAT', b'0', NULL),
(82, b'1', b'1', b'1', 'unknown.png', b'1', 'beaitbaarab@gmail.com', b'1', 'BADR EDDINE', 'AIT BAARAB ', '$2a$10$tBV/ig9xQLXmPVmSdE2e2Oi1pq54uWCW6Qiset9.xYr3eQtPCP/gq', 'COND_CH', NULL, '6109', '', '', 'BADR EDDINE AIT BAARAB ', b'0', NULL),
(83, b'1', b'1', b'1', 'unknown.png', b'1', 'a.goujil@roandi.ma', b'1', 'ANOUAR', 'GOUJIL', '$2a$10$57aDsNfqq/LX6Y3WzKJ0y.Z.6ZTL3uIQhClyPUjmwT3WCRoDQVvpG', 'CHEF_ZONE', NULL, '6001', '', '', 'ANOUAR GOUJIL', b'0', NULL),
(84, b'1', b'1', b'1', 'unknown.png', b'1', 'i.errazi@rouandi.ma', b'1', 'Issam', 'ERRAZI ', '$2a$10$k1TrAUlbKQ.HQnetu1X5E.HYYaG.YS6G5gEqoU6.mCss1WpZpUrqG', 'COND_CH', NULL, '6090', '', '', 'Issam ERRAZI ', b'0', NULL),
(85, b'0', b'0', b'1', 'unknown.png', b'0', 'a.aiouaj@rouandi.ma', b'1', 'Abdelaali', 'AIOUAJ', '$2a$10$dpIktWObj4B7jJhJvcARC.4mJ3fiPgvl.BAokjwAGfiNlR4u2HwH2', 'CHEF_CH', NULL, '6123', '', '', 'Abdelaali AIOUAJ', b'0', NULL),
(86, b'0', b'0', b'1', 'unknown.png', b'0', 'm.qassemi@rouandi.ma', b'1', 'Mohamed', 'QASSEMI', '$2a$10$uaKWdkHHynnBizIxrZWPhOf20no1Q80XVlhiIzD3o.vBXmLldx0q6', 'TECH_CH', NULL, '6082', '', '', 'Mohamed QASSEMI', b'0', NULL),
(87, b'0', b'0', b'1', 'unknown.png', b'0', 'amayman.amagdoul12@gmail.com', b'1', 'Aymane', 'Amagdoul', '$2a$10$2WH3MV/vz5L5r1AY2OGMw.Uromj674VyrKeyLYI5kPQ4mupQFLIvm', 'TECH_CH', NULL, '6072', '', '', 'Aymane Amagdoul', b'0', NULL),
(88, b'0', b'0', b'1', 'unknown.png', b'0', 'w.elasri@rouandi.ma', b'1', 'Walid ', 'El Asri', '$2a$10$Ol0Oq9AdftbGfywSaG.YL.a.c6rmdXfz7UwSAEc6lTKc7aZ0K/PB2', 'TECH_CH', NULL, '6160', '', '', 'Walid  El Asri', b'0', NULL),
(89, b'1', b'1', b'1', 'unknown.png', b'1', 'o.elhamoudi@rouandi.ma', b'1', 'Omar', 'EL hamoudi', '$2a$10$qomMHk5gZGE/MmRnZfmiPeKQxi3tNw/91o.HkwyyVCWvOt2Kh3/iy', 'TECH_CH', NULL, '6165', '', '', 'Omar EL hamoudi', b'0', NULL),
(90, b'1', b'1', b'1', 'unknown.png', b'1', NULL, b'1', 'Khalid ', 'Ouziad ', '$2a$10$udNONOFHdk.Ris8F1XgLwesBMhNconj7rt7KO5ZTCI7zgyQED91h2', 'TECH_CH', NULL, '6158', '', '', 'Khalid  Ouziad ', b'0', NULL),
(91, b'1', b'1', b'1', 'unknown.png', b'1', NULL, b'1', 'Walid', 'IDAZZI', '$2a$10$26mbo7fXcMWkt7euM7hvqulID2vg90gK7LECeffSTt5R83bHnRExK', 'TECH_CH', NULL, '6012', '', '', 'Walid IDAZZI', b'0', NULL),
(92, b'1', b'0', b'1', 'unknown.png', b'1', 'TEST@GMAIL.COM', b'1', 'ZOUHAIR', 'ZOUHAIR', '$2a$10$IxVL/8s52QBlUMzsgTrCjeWHefhkY.A.fdldxr2zlGa6QU9fvjGWe', 'TECH_CH', NULL, 'zouhir', '', '', 'ZOUHAIR ZOUHAIR', b'0', NULL),
(93, b'0', b'0', b'1', 'unknown.png', b'0', 'a.aniya@rouandi.ma', b'1', 'Abdessamad', 'ANIYA', '$2a$10$fw8xVCTLrtDg1pbB8BHPkuyM4ngfGcbJJWcLPRY4l.t6hxffmwCoa', 'COND_CH', NULL, '6164', '', '', 'Abdessamad ANIYA', b'0', NULL),
(94, b'1', b'1', b'1', 'unknown.png', b'1', 'o.badia@rouandi.ma', b'1', 'Oussama', 'BADIA', '$2a$10$8R18WIXB6GJZQckvfZPiIe8EgFBCokX9NUUlbzM4SqcdwObPyvXlS', 'COND_CH', NULL, '6094', '', '', 'Oussama BADIA', b'0', NULL),
(95, b'0', b'0', b'1', 'unknown.png', b'0', 'm.jazouli@rouandi.ma', b'1', 'Mustapha', 'JAZOULI', '$2a$10$yHP8tWy/9m3S/WP.rR9Fj.iQjslEQeu7t7lIzeXd2JIS49DYsu8RW', 'CHEF_CH', NULL, '6039', '', '', 'Mustapha JAZOULI', b'0', NULL),
(96, b'0', b'0', b'1', 'unknown.png', b'0', 'm.kaym@rouandi.ma', b'1', 'Mohamed', 'KARYM ', '$2a$10$4.HihtpE8vEfNClG4iW1wudmuZwzg.E8uhnYTuLTmgsJMuapxnCMi', 'COMPT_CH', NULL, '6009', '', '', 'Mohamed KARYM ', b'0', NULL),
(97, b'1', b'1', b'1', 'unknown.png', b'1', 'n.larhmich@rouandi.ma', b'1', 'Nouaman', 'LARHMICH', '$2a$10$e7CUkLlmtmWss4Ra8QiU1.3kOT7/kh5Mp/ecJj7Gz6JZWVdP7oxRi', 'CHEF_ZONE', NULL, '6133', '', '', 'Nouaman LARHMICH', b'0', NULL),
(98, b'0', b'0', b'1', 'unknown.png', b'0', 'm.baizou@rouandi.ma', b'1', 'Mustapha', 'BAIZOU', '$2a$10$TsOiHv2AoSJHRwR8wsJp4ebXa1iNo9OxgnMf6p5fqzrdSNGU0th0q', 'COND_CH', NULL, '6006', '', '', 'Mustapha BAIZOU', b'0', NULL),
(99, b'1', b'1', b'1', 'unknown.png', b'1', 'm.baddag@rouandi.ma', b'1', 'EL MAHDI', 'BADDAG', '$2a$10$5fE.BO0zE9MXnYFWopZIte03os6HkqvOn3UZnh/ajVf8jyBORRC/K', 'CHEF_ZONE', NULL, '6068', NULL, NULL, 'EL MAHDI BADDAG', b'0', NULL),
(100, b'1', b'1', b'1', 'unknown.png', b'1', 't.khachame@rouandi.ma', b'1', 'TARIK', 'KHACHAME', '$2a$10$t4UM.O4Gq3JuxuTakOCNPuwcngWuBe89KkaDBHlv26YUW.qBL1N32', 'CHEF_ZONE', NULL, 'tarik', '', '', 'TARIK KHACHAME', b'0', NULL),
(101, b'1', b'1', b'1', 'unknown.png', b'1', 'a.lehnine@rouandi.ma', b'1', 'AMINE', 'LEHNINE', '$2a$10$LJ1HgKUTeeRkaQ.xvBDkx.4laH0qiTdnp59f0y4Az23IepK.StJIS', 'COND_CH', NULL, 'amine', '', '', 'AMINE LEHNINE', b'0', NULL),
(102, b'1', b'1', b'1', 'unknown.png', b'1', 'k.elbehja@rouandi.ma', b'1', 'KHAOULA', 'EL BEHJA', '$2a$10$mxT1w9T0jsiSVOwNpwtTyulUKJQKwKzAtsUW7R0by.VgfcPSV3hDS', 'RESP_ST', NULL, 'khaoula', '', '', 'KHAOULA EL BEHJA', b'0', NULL),
(103, b'0', b'0', b'1', 'unknown.png', b'0', 'b.charafi@rouandi.ma', b'1', 'BRAHIM', 'CHARAFI', '$2a$10$AHimUKZDUwBt1d3I/Usy.edyAH.Lbe8wI6Dvd07pGIo564vfdM3Ce', 'COND_CH', NULL, 'charafi', '', '', 'BRAHIM CHARAFI', b'0', NULL),
(104, b'0', b'0', b'1', 'unknown.png', b'0', 'k.tsoulifaroukh@rouandi.ma', b'1', 'KAMAL', 'TSOULI FAROUKH ', '$2a$10$CXV.cDJloMgbBZdeYswyVuFtDAFq4AocEk8ww4DhqHFyTTZRgzLN.', 'CHEF_ZONE', NULL, 'kamal', '', '', 'KAMAL TSOULI FAROUKH ', b'0', NULL),
(105, b'1', b'1', b'1', 'unknown.png', b'1', 'h.bahassi@rouandi.ma', b'1', 'HICHAM', 'BAHASSI', '$2a$10$tg857gqn.Pns5EqFq9kf7OvF/5u7pnnaD.HwOp8R6.6hhYXbpm6We', 'CHEF_ZONE', NULL, '6061-1', '', '', 'HICHAM BAHASSI', b'0', NULL),
(106, b'1', b'1', b'1', 'unknown.png', b'1', 'h.bahassi@rouandi.ma', b'1', 'HICHAM', 'BAHASSI', '$2a$10$pTf.xXzsDlExJGgQifB/HOsBrdfErfU50yQDAS7htar75cZp.0WAq', 'COND_CH', NULL, '6061-2', '', '', 'HICHAM BAHASSI', b'0', NULL),
(107, b'1', b'1', b'1', 'unknown.png', b'1', 'o.badia@rouandi.ma', b'1', 'OUSSAMA', 'BADIA', '$2a$10$3bGh9PyPIfZKM7mkdP9nbexfagwEIV4hrqIzqEqiDImrpai3efiR6', 'CHEF_ZONE', NULL, 'oussama', '', '', 'OUSSAMA BADIA', b'0', NULL),
(108, b'1', b'1', b'1', 'unknown.png', b'1', 'beaitbaarab@gmail.com', b'1', 'BADR EDDINE', 'AIT BAARAB', '$2a$10$9EwB9bND/Zyrv.YjZ./XRueIIWjzSo7lGIW/HBmnCWVzTsl7qjHSO', 'CHEF_ZONE', NULL, 'badr', '', '', 'BADR EDDINE AIT BAARAB', b'0', NULL),
(110, b'1', b'1', b'1', 'unknown.png', b'1', 'i.errazi@rouandi.ma', b'1', 'ISSAM', 'ERRAZI', '$2a$10$ZePiWBvPBqmwZ6nNIl2bY.tMIfzjag506WUtY1IipSI2Zs6yqNBeS', 'CHEF_ZONE', NULL, 'issam', '', '', 'ISSAM ERRAZI', b'0', NULL),
(111, b'1', b'1', b'1', 'unknown.png', b'1', 'n.larhmich@rouandi.ma', b'1', 'NOUAMANE', 'LARHMICH', '$2a$10$LAG7Us19lg.hmv22tEBkxOT3d7G7kne.Gh1v1GOpBMZixm20.Ktdq', 'COND_CH', NULL, 'nouamane', '', '', 'NOUAMANE LARHMICH', b'0', NULL),
(112, b'1', b'1', b'1', 'unknown.png', b'1', 'a.goujil@rouandi.ma', b'1', 'ANOUAR', 'GOUJIL', '$2a$10$MgcuFefzG2O.Prw/SvoAkeVhMvfqRy8Pjm6HJ3rmc7rmKnS9OjKjG', 'COND_CH', NULL, 'anouar', '', '', 'ANOUAR GOUJIL', b'0', NULL),
(113, b'1', b'1', b'1', 'unknown.png', b'1', 'h.elkhaoua@rouandi.ma', b'1', 'HIND', 'EL KHAOUA', '$2a$10$TsadJRCnGvB3UDMNWnbtf.cMgkMF5HymAAQeVHwzJ.GTNWLe3KrrG', 'RESP_ST', NULL, '6162', '', '', 'HIND EL KHAOUA', b'0', NULL),
(114, b'0', b'0', b'1', 'unknown.png', b'0', 'i.bouazaoui@rouandi.ma', b'1', 'IKRAM', 'BOUAZZAOUI', '$2a$10$h81BsDa4UwW/2ROyoLNMhePeldNM/i8TixGYNBTIFVQUOU/ALgLxm', 'RESP_ST', NULL, '6174', '', '', 'IKRAM BOUAZZAOUI', b'0', NULL),
(115, b'1', b'1', b'1', 'unknown.png', b'1', 'i.himmi@rouandi.ma', b'1', 'IBRAHIM', 'HIMMI', '$2a$10$kHbHFOR96jsey9E4Oq/wUuxc5atCM3/NycN9L1yAEyXzv/GUjrlim', 'TECH_CH', NULL, '6046', '', '', 'IBRAHIM HIMMI', b'0', NULL),
(116, b'1', b'1', b'1', 'unknown.png', b'1', 'n.omair@rouandi.ma', b'1', 'NOUHAILA', 'OMAIR', '$2a$10$vytPJA9WeAC6RzqdFMG5o.oj5OAy4HNgtoXvvhWZGN/k9cGFm5EyS', 'CDG', NULL, 'nouhaila', '', '', 'NOUHAILA OMAIR', b'0', NULL),
(117, b'1', b'1', b'1', 'unknown.png', b'1', 'b.taoussi@rouandi.ma', b'1', 'Badreddine', 'TAOUSSI', '$2a$10$8apbynQTMIDCGb0MRiypw.5rdPEH66uDJpfHGdd6Xg.hm80rUyq4.', 'RESP_ST', NULL, 'b.taoussi', '', '', 'Badreddine TAOUSSI', b'0', NULL),
(118, b'1', b'1', b'1', 'unknown.png', b'1', 'a.oukessou@rouandi.ma', b'1', 'ABDELLAH', 'OUKESSOU', '$2a$10$RlhZAsokaVA9fT0T71pweeZC1ThLC9VVHMmkQnvMCMzx58CWGoP0i', 'TECH_CH', NULL, 'a.oukessou', '', '', 'ABDELLAH OUKESSOU', b'0', NULL),
(119, b'1', b'1', b'1', 'unknown.png', b'1', 'a.arrich@rouandi.ma', b'1', 'ABDELHAK', 'ARRICH', '$2a$10$e1Pd3CMKBAxKIH3IOCY3QOx98.ZNNpHG6E9RIUOqoI5riEJSWs1Na', 'CHEF_ZONE', NULL, 'a.arrich', '', '', 'ABDELHAK ARRICH', b'0', NULL),
(120, b'1', b'1', b'1', 'unknown.png', b'1', 'admin@srmanager.ma', b'1', 'LAHCEN', 'ABOUSALIH', '$2a$10$XkB/lfTAqspqvQ3RrFQQsetkBc1U48cbzAaQ7XXDBpXPpBmcL7TRi', 'ADMIN', NULL, 'srmanager-api', '', '', 'LAHCEN ABOUSALIH', b'0', NULL),
(121, b'1', b'1', b'1', 'unknown.png', b'1', 'f.bouchama@rouandi.ma', b'1', 'FATIMA EZZAHRA', 'BOUCHAMA', '$2a$10$1S.Sdpf5VWvYv.e9oE3POuKDrYSwmHBQFolEME0fljHIXEQKMtulC', 'ASSIST_COMPTA', NULL, 'f.bouchama', '', '', 'FATIMA EZZAHRA BOUCHAMA', b'0', NULL),
(124, b'1', b'1', b'1', 'unknown.png', b'1', 's.elbahi@rouandi.ma', b'1', 'SAAD', 'EL BAHI', '$2a$10$7p05u0P5JRGkwASukm1WLuWB9mPPqZwGfhHMk0mJ1c0gjPlUwEss6', 'RESP_LOG', NULL, 's.elbahi', '', '', 'SAAD EL BAHI', b'0', NULL),
(125, b'1', b'0', b'1', 'unknown.png', b'1', 'r.bouzid@rouandi.ma', b'1', 'rkia', 'bouzid', '$2a$10$bVqNeWokx3MuZ9RRMhf2X.nKj2E3xV2hLGZI9qRgcuDbyZsxr8GrK', 'ADMIN', NULL, 'r,bouzid', '', '', 'rkia bouzid', b'0', NULL),
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
(71, 133),
(58, 123),
(79, 151),
(74, 131),
(70, 138),
(78, 131),
(84, 133),
(90, 151),
(82, 133),
(91, 151),
(73, 151),
(65, 122),
(68, 138),
(68, 133),
(99, 138),
(99, 133),
(92, 151),
(83, 138),
(62, 148),
(63, 150),
(81, 150),
(85, 131),
(86, 151),
(95, 131),
(100, 138),
(102, 150),
(94, 133),
(94, 151),
(101, 133),
(72, 151),
(105, 138),
(106, 133),
(66, 160),
(107, 138),
(60, 154),
(76, 132),
(108, 138),
(80, 157),
(69, 138),
(75, 132),
(75, 141),
(77, 133),
(96, 132),
(110, 138),
(67, 122),
(67, 159),
(97, 138),
(111, 133),
(98, 133),
(93, 133),
(93, 151),
(112, 133),
(113, 150),
(87, 151),
(115, 151),
(64, 150),
(64, 130),
(61, 134),
(61, 164),
(61, 159),
(104, 138),
(89, 151),
(88, 151),
(103, 133),
(114, 150),
(116, 160),
(117, 150),
(118, 151),
(119, 138),
(59, 153),
(120, 123),
(121, 125),
(124, 146),
(124, 123),
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
