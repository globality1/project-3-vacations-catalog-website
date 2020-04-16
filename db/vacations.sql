-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 15, 2020 at 09:19 PM
-- Server version: 10.4.11-MariaDB
-- PHP Version: 7.4.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `vacations`
--
CREATE DATABASE IF NOT EXISTS `vacations` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `vacations`;

-- --------------------------------------------------------

--
-- Table structure for table `followers`
--

CREATE TABLE `followers` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `vacationid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `followers`
--

INSERT INTO `followers` (`id`, `userId`, `vacationid`) VALUES
(132, 30, 18),
(133, 30, 19),
(134, 30, 22),
(135, 30, 21),
(136, 31, 18),
(138, 31, 20),
(139, 31, 17),
(141, 30, 17),
(179, 1, 18),
(195, 1, 19),
(196, 1, 20);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userId` int(11) NOT NULL,
  `firstName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `userName` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `isAdmin` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userId`, `firstName`, `lastName`, `userName`, `password`, `isAdmin`) VALUES
(1, 'Admin', 'Admin', 'Admin', 'Aa123456', 1),
(30, 'User1', 'User1', 'User1', 'Aa123456', 0),
(31, 'User2', 'User2', 'User2', 'Aa123456', 0),
(32, 'User3', 'User3', 'User3', 'Aa123456', 0),
(34, 'adsf', 'asdf', 'adsf', 'adf', 0);

--
-- Triggers `users`
--
DELIMITER $$
CREATE TRIGGER `remove_deleted_vacation_follow_users` AFTER DELETE ON `users` FOR EACH ROW BEGIN
    DELETE FROM followers
        WHERE followers.userId = old.userId;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `vacations`
--

CREATE TABLE `vacations` (
  `vacationId` int(11) NOT NULL,
  `vacationName` varchar(80) NOT NULL,
  `description` varchar(4000) NOT NULL,
  `destination` varchar(255) NOT NULL,
  `picFileName` varchar(255) NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL,
  `price` decimal(10,0) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `vacations`
--

INSERT INTO `vacations` (`vacationId`, `vacationName`, `description`, `destination`, `picFileName`, `startDate`, `endDate`, `price`) VALUES
(17, 'Egypt 28.04', 'Com and Enjoy your time in egypt, ride camels and drink some sand coffee with snakes.', 'Egypt', 'bb95a0e6-96cb-4c1f-9ea4-190d02c82728.jpg', '2020-04-28', '2020-04-30', '500'),
(18, 'Hawaii 04.05', 'Come and Drink some coconut juice with our hula girls and our fist size local crabs', 'Huwaii', 'cd33ee08-957b-41c3-ada5-3eb73b5d7d82.jpg', '2020-05-04', '2020-05-11', '689'),
(19, 'Venezuela 05.05', 'Come and Swim in the ruins of venezuela before it sinks physically and not just economically... Just please come...', 'Venezuela', 'd43e0f39-30ee-4c62-ac6a-04e7a2dbb2a8.jpg', '2020-05-05', '2020-05-14', '1'),
(20, 'Carribbeans 06.05', 'Come and swim with sharks that are bigger than your house!', 'Carribbeans', 'dfd0bb58-1751-4615-b8d8-75ca761b296f.jpg', '2020-05-06', '2020-04-30', '465'),
(21, 'San Diego 25.04', 'Come and Enjoy the sunny beaches in San diego and enjoy our best beer', 'San Diego', 'cbbf679e-a666-48ad-9497-685fd56a4ddb.jpg', '2020-04-25', '2020-04-30', '1500'),
(22, 'Beijing 08.05', 'Come and feel like a real kung fu figther, drink some sake and laugh from jokes', 'Beijing', '81d1cc38-e0ee-4e0c-9da4-c739f69e3a86.jpg', '2020-05-08', '2020-05-14', '369');

--
-- Triggers `vacations`
--
DELIMITER $$
CREATE TRIGGER `remove_deleted_vacation_follow` AFTER DELETE ON `vacations` FOR EACH ROW BEGIN
    DELETE FROM followers
        WHERE followers.vacationid = old.vacationId;
END
$$
DELIMITER ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `followers`
--
ALTER TABLE `followers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userid_index` (`userId`) USING BTREE,
  ADD KEY `vacationid_index` (`vacationid`) USING BTREE;

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userId`),
  ADD UNIQUE KEY `userName` (`userName`);

--
-- Indexes for table `vacations`
--
ALTER TABLE `vacations`
  ADD PRIMARY KEY (`vacationId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `followers`
--
ALTER TABLE `followers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=197;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `vacations`
--
ALTER TABLE `vacations`
  MODIFY `vacationId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `followers`
--
ALTER TABLE `followers`
  ADD CONSTRAINT `followers_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE CASCADE,
  ADD CONSTRAINT `followers_ibfk_2` FOREIGN KEY (`vacationid`) REFERENCES `vacations` (`vacationId`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
