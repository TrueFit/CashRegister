<?php

/**
 * Class randomChangeDrawer - Calculates change using random
 * currency "pieces" until we have what we need.
 */
class randomChangeDrawer extends changeDrawer
{

    protected $choices = 0;


    /**
     * Calculate the change to return.
     *
     * @return bool
     */
    public function calculateChange()
    {
        $denominations = new randomDenominationFactory();

        // Number of currency units to choose from
        $this->choices = $denominations->numDenominations;

        // Loop through random change "compartments" until we have the right amount of change
        while ($this->amountRemaining > changeDrawer::ONE_PENNY) {

            // Randomly generate the currency unit you want first
            $index = $this->randomCompartment();

            // Get some cash from the random compartment in the drawer
            $result = $denominations->getDenomination($this->amountRemaining, $index);

            // Figure out what is left
            $this->calculateAmountRemaining($result);

            // Take the "cash" from this iteration and add it to the totals
            $this->updateCurrencyCounts($result);
        }
    }

    /**
     * Generate a random index to pick a denomination of currency
     * @return int
     */
    private function randomCompartment(){
        return rand(0, $this->choices - 1);
    }

}