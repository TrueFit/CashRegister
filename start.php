<?php

/**
 * Project: CashRegister coding assignment
 *
 * Submitted by: Scott Madeira
 *
 * File: start.php - scaffolding code to exercise the CashRegister implementation
 *
 */

function __autoload($class_name)
{
    include 'classes\\'.$class_name . '.php';
}


// Terminate if no input file is given
if ( count($argv) == 1 ) die("\nUsage:  php CashRegister inputfile.txt\n");

// Terminate if filename doesn't exist
$filename = $argv[ 1 ];
if ( !file_exists($filename) ) die("\nFile not found!\n");

// Open the input file
$fp = fopen($filename, "r") or die("\nUnable to open file!\n");

// Initialize a "view" to print change - really just a dump with some formatting
$view = new printChange();


// Loop through the input file
while ($data = fgetcsv($fp)) {

    list($cost, $tendered) = $data;

    // Print input data
    $view->printInput($cost, $tendered);

    try {
        $cashRegister = new cashRegister($cost, $tendered);
    } catch (Exception $e) {
        echo 'We have a problem: ', $e->getMessage(), "\n";
        continue;
    }

    // Get the change due to customer
    $change = $cashRegister->makeChange();

    $view->printResults($change);

}

// Close input file
fclose($fp);



