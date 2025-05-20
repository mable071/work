-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 20, 2025 at 01:21 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `garage_management`
--

-- --------------------------------------------------------

--
-- Table structure for table `cars`
--

CREATE TABLE `cars` (
  `id` int(11) NOT NULL,
  `make` varchar(255) NOT NULL,
  `model` varchar(255) NOT NULL,
  `year` int(11) NOT NULL,
  `license_plate` varchar(255) NOT NULL,
  `vin` varchar(255) NOT NULL,
  `color` varchar(255) NOT NULL,
  `mileage` int(11) NOT NULL DEFAULT 0,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cars`
--

INSERT INTO `cars` (`id`, `make`, `model`, `year`, `license_plate`, `vin`, `color`, `mileage`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Sed assumenda vel te', 'Laborum Consequatur', 1992, 'Earum necessitatibus', 'Do quasi earum aut a', 'Labore provident as', 5, 'active', '2025-05-20 10:56:27', '2025-05-20 10:56:27');

-- --------------------------------------------------------

--
-- Table structure for table `parts_useds`
--

CREATE TABLE `parts_useds` (
  `id` int(11) NOT NULL,
  `service_record_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL,
  `cost` decimal(10,2) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `service_record_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_date` datetime NOT NULL,
  `payment_method` enum('cash','credit_card','debit_card','bank_transfer') NOT NULL,
  `status` enum('pending','completed','failed','refunded') DEFAULT 'pending',
  `transaction_id` varchar(255) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `service_record_id`, `amount`, `payment_date`, `payment_method`, `status`, `transaction_id`, `notes`, `created_at`, `updated_at`) VALUES
(1, 1, 88.00, '2018-04-05 21:22:00', 'cash', 'failed', NULL, NULL, '2025-05-20 11:05:13', '2025-05-20 11:05:13');

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `base_price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `duration` int(11) NOT NULL DEFAULT 60,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`id`, `name`, `description`, `base_price`, `duration`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Idola Cotton', 'Vel rerum provident', 164.00, 86, 'active', '2025-05-20 10:58:23', '2025-05-20 10:58:23'),
(2, 'Jesse Pittman', 'Quod ullamco iste ex', 93.00, 96, 'active', '2025-05-20 11:04:48', '2025-05-20 11:04:48');

-- --------------------------------------------------------

--
-- Table structure for table `service_records`
--

CREATE TABLE `service_records` (
  `id` int(11) NOT NULL,
  `car_id` int(11) NOT NULL,
  `service_id` int(11) NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime DEFAULT NULL,
  `status` enum('pending','in_progress','completed','cancelled') DEFAULT 'pending',
  `cost` decimal(10,2) NOT NULL DEFAULT 0.00,
  `technician` varchar(255) NOT NULL,
  `notes` text DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `service_records`
--

INSERT INTO `service_records` (`id`, `car_id`, `service_id`, `start_date`, `end_date`, `status`, `cost`, `technician`, `notes`, `created_at`, `updated_at`) VALUES
(1, 1, 2, '1986-10-12 20:13:00', '2017-01-03 08:02:00', 'in_progress', 83.00, 'Excepteur consectetu', 'Rerum excepteur sed ', '2025-05-20 11:05:04', '2025-05-20 11:05:04');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') DEFAULT 'user',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `created_at`, `updated_at`) VALUES
(1, 'nigga', 'nigga@gmail.com', '$2a$10$Oqspihzn5elODD4zj7aULemK0g79azqOsOJv5IsMOAF7Wo8FDYt.S', 'user', '2025-05-20 10:33:58', '2025-05-20 10:33:58');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cars`
--
ALTER TABLE `cars`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `license_plate` (`license_plate`),
  ADD UNIQUE KEY `vin` (`vin`),
  ADD UNIQUE KEY `license_plate_2` (`license_plate`),
  ADD UNIQUE KEY `vin_2` (`vin`),
  ADD UNIQUE KEY `license_plate_3` (`license_plate`),
  ADD UNIQUE KEY `vin_3` (`vin`);

--
-- Indexes for table `parts_useds`
--
ALTER TABLE `parts_useds`
  ADD PRIMARY KEY (`id`),
  ADD KEY `service_record_id` (`service_record_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `transaction_id` (`transaction_id`),
  ADD UNIQUE KEY `transaction_id_2` (`transaction_id`),
  ADD UNIQUE KEY `transaction_id_3` (`transaction_id`),
  ADD KEY `service_record_id` (`service_record_id`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `name_2` (`name`),
  ADD UNIQUE KEY `name_3` (`name`);

--
-- Indexes for table `service_records`
--
ALTER TABLE `service_records`
  ADD PRIMARY KEY (`id`),
  ADD KEY `car_id` (`car_id`),
  ADD KEY `service_id` (`service_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username_2` (`username`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `username_3` (`username`),
  ADD UNIQUE KEY `email_3` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cars`
--
ALTER TABLE `cars`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `parts_useds`
--
ALTER TABLE `parts_useds`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `service_records`
--
ALTER TABLE `service_records`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `parts_useds`
--
ALTER TABLE `parts_useds`
  ADD CONSTRAINT `parts_useds_ibfk_1` FOREIGN KEY (`service_record_id`) REFERENCES `service_records` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`service_record_id`) REFERENCES `service_records` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `service_records`
--
ALTER TABLE `service_records`
  ADD CONSTRAINT `service_records_ibfk_5` FOREIGN KEY (`car_id`) REFERENCES `cars` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `service_records_ibfk_6` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
