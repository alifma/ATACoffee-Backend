-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 09, 2021 at 03:14 PM
-- Server version: 10.4.17-MariaDB
-- PHP Version: 8.0.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `coffe_shop`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `username` varchar(100) DEFAULT NULL,
  `firstname` varchar(100) DEFAULT NULL,
  `lastname` varchar(100) DEFAULT NULL,
  `handphone` varchar(50) NOT NULL,
  `gender` varchar(30) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `lahir` date DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `access` int(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `username`, `firstname`, `lastname`, `handphone`, `gender`, `address`, `lahir`, `image`, `email`, `password`, `access`) VALUES
(1, 'ari', NULL, NULL, NULL, '081340331123', NULL, '', NULL, NULL, 'arc@gmail.com', '$2b$10$/nRpvD1znjbpEEEfBhuf6e8lMfEBXuuYtvhrHhXxhrcehWodqAZMi', 1),
(2, 'ari dwi sukmawan', 'aridwi27', 'ari dwi', 'sukmawan', '087899719758', 'pria', 'jl garuda ', '0000-00-00', '1612873508034.jpg', 'aridwisukmawan@gmail.com', '$2b$10$bU/O5cOs4HO9hhDfYrBzJenvJBGODVcgzD67GCrKr.oAdDg9miXfG', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
