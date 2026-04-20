-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 20, 2026 at 01:14 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `payroll_system`
--

-- --------------------------------------------------------

--
-- Table structure for table `calculation_settings`
--

CREATE TABLE `calculation_settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `value` text NOT NULL,
  `date_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `calculation_settings`
--

INSERT INTO `calculation_settings` (`id`, `name`, `value`, `date_updated`) VALUES
(1, 'total_worked_hours', '8', '2026-03-25 02:01:25');

-- --------------------------------------------------------

--
-- Table structure for table `deductions`
--

CREATE TABLE `deductions` (
  `id` int(11) NOT NULL,
  `employee_id` int(10) UNSIGNED NOT NULL,
  `sss` int(11) NOT NULL DEFAULT 0,
  `pagibig` int(11) NOT NULL DEFAULT 0,
  `microdev` int(11) NOT NULL DEFAULT 0,
  `month` varchar(50) DEFAULT NULL,
  `year` year(4) NOT NULL,
  `date_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `deductions`
--

INSERT INTO `deductions` (`id`, `employee_id`, `sss`, `pagibig`, `microdev`, `month`, `year`, `date_updated`) VALUES
(55, 307412, 500, 300, 400, 'february', '2026', '2026-03-19 02:26:42'),
(56, 30573, 0, 0, 0, 'february', '2026', '2026-03-19 02:26:19'),
(57, 30574, 0, 0, 0, 'february', '2026', '2026-03-19 02:26:19'),
(58, 307412, 500, 500, 300, 'march', '2026', '2026-03-24 03:27:13'),
(59, 30573, 0, 0, 0, 'march', '2026', '2026-03-24 03:27:13'),
(60, 30574, 0, 0, 0, 'march', '2026', '2026-03-24 03:27:13'),
(61, 12515, 0, 0, 0, 'march', '2026', '2026-03-24 03:27:13'),
(62, 51243, 0, 0, 0, 'march', '2026', '2026-03-24 03:27:13');

-- --------------------------------------------------------

--
-- Table structure for table `dtr`
--

CREATE TABLE `dtr` (
  `id` int(10) UNSIGNED NOT NULL,
  `employee_id` int(10) UNSIGNED NOT NULL,
  `month` tinyint(4) NOT NULL,
  `year` smallint(6) NOT NULL,
  `day` tinyint(4) NOT NULL,
  `hours` tinyint(4) NOT NULL DEFAULT 0,
  `minutes` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `dtr_part_time`
--

CREATE TABLE `dtr_part_time` (
  `id` int(10) UNSIGNED NOT NULL,
  `employee_id` int(10) UNSIGNED NOT NULL,
  `month` varchar(20) NOT NULL,
  `year` year(4) NOT NULL,
  `day` tinyint(4) NOT NULL,
  `am_in` time DEFAULT NULL,
  `am_out` time DEFAULT NULL,
  `pm_in` time DEFAULT NULL,
  `pm_out` time DEFAULT NULL,
  `hours` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `minutes` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dtr_part_time`
--

INSERT INTO `dtr_part_time` (`id`, `employee_id`, `month`, `year`, `day`, `am_in`, `am_out`, `pm_in`, `pm_out`, `hours`, `minutes`, `created_at`, `updated_at`) VALUES
(1, 307412, '1', '2026', 5, NULL, NULL, NULL, NULL, 0, 0, '2026-03-24 12:16:27', '2026-03-24 12:46:01'),
(4, 307412, '1', '2026', 6, NULL, NULL, NULL, NULL, 0, 0, '2026-03-24 12:21:47', '2026-03-24 12:45:28'),
(9, 307412, '1', '2026', 12, '08:00:00', '10:00:00', '13:00:00', '16:00:00', 5, 0, '2026-03-24 12:27:13', '2026-03-24 12:41:14');

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` int(10) UNSIGNED NOT NULL,
  `employee_id` int(10) UNSIGNED NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `middle_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) NOT NULL,
  `classification` enum('full-time','part-time') NOT NULL,
  `designation` varchar(250) DEFAULT NULL,
  `salary` decimal(12,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `employee_id`, `first_name`, `middle_name`, `last_name`, `classification`, `designation`, `salary`, `created_at`, `updated_at`) VALUES
(1, 307412, 'Richard', 'A', 'Lanterna', 'full-time', 'Instructor', 12000.00, '2026-03-17 02:09:35', '2026-03-25 02:37:26'),
(2, 30573, 'Ernesto', 'Cotales', 'Sabornido', 'full-time', 'Instructor', 10000.00, '2026-03-18 01:16:53', '2026-03-20 08:37:40'),
(3, 30574, 'Rosie', NULL, 'Yator', 'full-time', 'Instructor', 10000.00, '2026-03-18 01:58:05', '2026-03-20 08:37:49'),
(4, 12515, 'Philip test', NULL, 'Gumera', 'full-time', 'Registrar Staff', 10000.00, '2026-03-20 07:45:57', '2026-03-20 08:37:29'),
(5, 51243, 'Roben', 'L.', 'Malaubang', 'part-time', 'Instructor', 100.00, '2026-03-21 02:23:44', '2026-03-21 02:23:44');

-- --------------------------------------------------------

--
-- Table structure for table `faculty_loads`
--

CREATE TABLE `faculty_loads` (
  `id` int(11) NOT NULL,
  `employee_id` int(10) UNSIGNED NOT NULL,
  `subject_id` int(11) NOT NULL,
  `semester` enum('1st','2nd','Summer') NOT NULL,
  `school_year` varchar(9) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `faculty_loads`
--

INSERT INTO `faculty_loads` (`id`, `employee_id`, `subject_id`, `semester`, `school_year`, `created_at`, `updated_at`) VALUES
(4, 30573, 9, '2nd', '2026-2027', '2026-03-20 01:36:35', '2026-03-20 01:36:35'),
(5, 307412, 9, '2nd', '2026-2027', '2026-03-24 03:35:00', '2026-03-24 03:35:00'),
(6, 307412, 10, '1st', '2026-2027', '2026-03-24 03:35:56', '2026-03-24 03:35:56');

-- --------------------------------------------------------

--
-- Table structure for table `faculty_load_schedules`
--

CREATE TABLE `faculty_load_schedules` (
  `id` int(11) NOT NULL,
  `load_id` int(11) NOT NULL,
  `day` enum('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday') NOT NULL,
  `time_start` time NOT NULL,
  `time_end` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `faculty_load_schedules`
--

INSERT INTO `faculty_load_schedules` (`id`, `load_id`, `day`, `time_start`, `time_end`) VALUES
(5, 4, 'Monday', '20:00:00', '10:00:00'),
(6, 5, 'Wednesday', '17:00:00', '20:00:00'),
(9, 6, 'Monday', '08:00:00', '10:00:00'),
(10, 6, 'Tuesday', '08:00:00', '10:00:00'),
(11, 6, 'Monday', '13:00:00', '16:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `hours_rendered`
--

CREATE TABLE `hours_rendered` (
  `id` int(10) UNSIGNED NOT NULL,
  `employee_id` int(10) UNSIGNED NOT NULL,
  `hours` int(11) NOT NULL DEFAULT 0,
  `minutes` int(11) NOT NULL DEFAULT 0,
  `month` varchar(50) NOT NULL,
  `year` year(4) NOT NULL,
  `day` int(11) DEFAULT NULL,
  `date_updated` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hours_rendered`
--

INSERT INTO `hours_rendered` (`id`, `employee_id`, `hours`, `minutes`, `month`, `year`, `day`, `date_updated`) VALUES
(12, 307412, 0, 0, '1', '2026', 5, '2026-03-24 20:46:01'),
(15, 307412, 0, 0, '1', '2026', 6, '2026-03-24 20:45:28'),
(20, 307412, 5, 0, '1', '2026', 12, '2026-03-24 20:41:14');

-- --------------------------------------------------------

--
-- Table structure for table `subjects`
--

CREATE TABLE `subjects` (
  `id` int(11) NOT NULL,
  `code` varchar(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subjects`
--

INSERT INTO `subjects` (`id`, `code`, `name`, `updated_at`) VALUES
(9, 'IS 102', 'Computer Programming 2', '2026-03-19 13:51:00'),
(10, 'Database', 'Database', '2026-03-24 03:35:09');

-- --------------------------------------------------------

--
-- Table structure for table `travel_order`
--

CREATE TABLE `travel_order` (
  `id` int(11) NOT NULL,
  `employee_id` int(10) UNSIGNED NOT NULL,
  `purpose` text NOT NULL,
  `message` text DEFAULT NULL,
  `from` date DEFAULT NULL,
  `to` date DEFAULT NULL,
  `classification` varchar(50) DEFAULT NULL,
  `date_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `travel_order`
--

INSERT INTO `travel_order` (`id`, `employee_id`, `purpose`, `message`, `from`, `to`, `classification`, `date_updated`) VALUES
(67, 30573, 'Birthday', 'Akoa ning birthday halfday lang', '2026-02-02', '2026-02-02', 'half-day', '2026-03-25 00:32:16'),
(68, 30574, 'ZDSPGC AURORA CAMPUS', 'ZDSPGC AURORA CAMPUS', '2025-11-23', '2025-11-24', 'more-day', '2026-03-25 00:39:24');

-- --------------------------------------------------------

--
-- Table structure for table `undertime`
--

CREATE TABLE `undertime` (
  `id` int(11) NOT NULL,
  `employee_id` int(10) UNSIGNED NOT NULL,
  `hours` int(11) NOT NULL DEFAULT 0,
  `minutes` int(11) NOT NULL DEFAULT 0,
  `month` varchar(50) NOT NULL,
  `year` year(4) NOT NULL,
  `date_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `undertime`
--

INSERT INTO `undertime` (`id`, `employee_id`, `hours`, `minutes`, `month`, `year`, `date_updated`) VALUES
(48, 307412, 21, 0, 'march', '2026', '2026-03-24 03:26:09'),
(49, 30573, 24, 0, 'march', '2026', '2026-03-24 03:26:09'),
(50, 30574, 30, 0, 'march', '2026', '2026-03-24 03:26:09'),
(51, 307412, 5, 0, 'february', '2026', '2026-03-18 11:06:32'),
(52, 30573, 20, 0, 'february', '2026', '2026-03-18 10:52:09'),
(53, 30574, 0, 0, 'february', '2026', '2026-03-18 10:52:09'),
(54, 30573, 10, 0, 'april', '2026', '2026-03-18 11:07:06'),
(55, 12515, 0, 0, 'march', '2026', '2026-03-24 03:26:09'),
(56, 51243, 0, 0, 'march', '2026', '2026-03-24 03:26:09'),
(57, 307412, 4, 29, 'november', '2025', '2026-03-25 02:37:44'),
(58, 30573, 14, 47, 'november', '2025', '2026-03-25 02:38:57'),
(59, 30574, 46, 2, 'november', '2025', '2026-03-25 02:51:57'),
(60, 12515, 0, 0, 'november', '2025', '2026-03-25 00:38:06'),
(61, 51243, 0, 0, 'november', '2025', '2026-03-25 00:38:06');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `employee_id` varchar(50) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `middle_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) NOT NULL,
  `profile_pic` varchar(255) DEFAULT NULL,
  `password_hash` text NOT NULL,
  `role` enum('admin','hr','accountant','employee') DEFAULT 'employee',
  `is_active` tinyint(1) DEFAULT 1,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `employee_id`, `first_name`, `middle_name`, `last_name`, `profile_pic`, `password_hash`, `role`, `is_active`, `date_created`, `last_updated`) VALUES
(1, '30735', 'Ernesto', 'Cotales', 'Sabornido', NULL, '$2b$10$XyU8Kd16eGjYJy7x9mxr2uxxbtulvEtHtX5RS/TtE4PcKE2uM/gLq', 'accountant', 1, '2026-03-16 09:43:24', '2026-03-16 11:27:43');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `calculation_settings`
--
ALTER TABLE `calculation_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deductions`
--
ALTER TABLE `deductions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employee_id` (`employee_id`);

--
-- Indexes for table `dtr`
--
ALTER TABLE `dtr`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_dtr` (`employee_id`,`month`,`year`,`day`);

--
-- Indexes for table `dtr_part_time`
--
ALTER TABLE `dtr_part_time`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_dtr` (`employee_id`,`month`,`year`,`day`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `employee_id` (`employee_id`);

--
-- Indexes for table `faculty_loads`
--
ALTER TABLE `faculty_loads`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employee_id` (`employee_id`),
  ADD KEY `subject_id` (`subject_id`);

--
-- Indexes for table `faculty_load_schedules`
--
ALTER TABLE `faculty_load_schedules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `load_id` (`load_id`);

--
-- Indexes for table `hours_rendered`
--
ALTER TABLE `hours_rendered`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_hours_rendered` (`employee_id`,`month`,`year`,`day`);

--
-- Indexes for table `subjects`
--
ALTER TABLE `subjects`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `travel_order`
--
ALTER TABLE `travel_order`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employee_id` (`employee_id`);

--
-- Indexes for table `undertime`
--
ALTER TABLE `undertime`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employee_id` (`employee_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_employee` (`employee_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `calculation_settings`
--
ALTER TABLE `calculation_settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `deductions`
--
ALTER TABLE `deductions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- AUTO_INCREMENT for table `dtr`
--
ALTER TABLE `dtr`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `dtr_part_time`
--
ALTER TABLE `dtr_part_time`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `faculty_loads`
--
ALTER TABLE `faculty_loads`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `faculty_load_schedules`
--
ALTER TABLE `faculty_load_schedules`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `hours_rendered`
--
ALTER TABLE `hours_rendered`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT for table `subjects`
--
ALTER TABLE `subjects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `travel_order`
--
ALTER TABLE `travel_order`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;

--
-- AUTO_INCREMENT for table `undertime`
--
ALTER TABLE `undertime`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `deductions`
--
ALTER TABLE `deductions`
  ADD CONSTRAINT `deduction_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE CASCADE;

--
-- Constraints for table `dtr`
--
ALTER TABLE `dtr`
  ADD CONSTRAINT `dtr_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `dtr_part_time`
--
ALTER TABLE `dtr_part_time`
  ADD CONSTRAINT `dtr_part_time_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`);

--
-- Constraints for table `faculty_loads`
--
ALTER TABLE `faculty_loads`
  ADD CONSTRAINT `faculty_loads_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`),
  ADD CONSTRAINT `faculty_loads_ibfk_2` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`);

--
-- Constraints for table `faculty_load_schedules`
--
ALTER TABLE `faculty_load_schedules`
  ADD CONSTRAINT `faculty_load_schedules_ibfk_1` FOREIGN KEY (`load_id`) REFERENCES `faculty_loads` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `hours_rendered`
--
ALTER TABLE `hours_rendered`
  ADD CONSTRAINT `fk_hours_employee` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `travel_order`
--
ALTER TABLE `travel_order`
  ADD CONSTRAINT `travel_order_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE CASCADE;

--
-- Constraints for table `undertime`
--
ALTER TABLE `undertime`
  ADD CONSTRAINT `undertime_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
