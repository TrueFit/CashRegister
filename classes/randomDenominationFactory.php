<?php

class randomDenominationFactory extends denominationFactory
{

    /**
     * Used by the drawer to know how many random choices it has
     *
     * @var int */
    private $numDenominations = 8;

    /**
     * Based on the amount of change needed and the
     *
     * @param $amount - value of change still needed
     * @return mixed
     */
    public function getDenomination($amount)
    {

        /**
         * Randomly pick a denomination to grab
         */
        $index = $this->randomAmount();

        switch ($index) {
            case 0:
                $d = new randomTwentyDollarDenomination();
                break;
            case 1:
                $d = new randomTenDollarDenomination();
                break;
            case 2:
                $d = new randomFiveDollarDenomination();
                break;
            case 3:
                $d = new randomDollarDenomination();
                break;
            case 4:
                $d = new randomQuarterDenomination();
                break;
            case 5:
                $d = new randomDimeDenomination();
                break;
            case 6:
                $d = new randomNickelDenomination();
                break;
            case 7:
            default:
                $d = new randomPennyDenomination();
                break;
        }

        // Calculate next "chunk" of change
        $d->makeChange($amount);

        // Return amount and text string
        return $this->returnResults($d);

    }

    private function randomAmount(){
        return rand(0, $this->numDenominations - 1);
    }

}