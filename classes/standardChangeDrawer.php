<?php

/**
 * Class standardChangeDrawer - Calculates change using the least number
 * of currency "pieces."
 */
class standardChangeDrawer extends changeDrawer
{

    /**
     * Calculate the change to return by denomination for the given
     * input amount.
     *
     * @return bool
     */
    public function calculateChange()
    {
        $denominations = new standardDenominationFactory();

        // Loop through the change "compartments"
        while ($this->amountRemaining >= changeDrawer::ONE_PENNY) {

            $result = $denominations->getDenomination($this->amountRemaining);

            $this->calculateAmountRemaining($result);

            // Take the resulting data and add it to the denomination totals
            $this->updateCurrencyCounts($result);

        }

    }


}