<?php

/**
 * Class randomChangeDrawer - Calculates change using random
 * currency "pieces" until we have what we need.
 */
class randomChangeDrawer extends changeDrawer
{

    /**
     * Calculate the change to return.
     *
     * @return bool
     */
    public function calculateChange()
    {
        $denominations = DenominationFactory::build('random');

        // Loop through random change "compartments" until we have the right amount of change
        while ($this->amountRemaining > changeDrawer::ONE_PENNY) {

            // Get some cash from the random compartment in the drawer
            $result = $denominations->getDenomination($this->amountRemaining);

            // Figure out what is left
            $this->calculateAmountRemaining($result);

            // Take the "cash" from this iteration and add it to the totals
            $this->updateCurrencyCounts($result);
        }
    }

}