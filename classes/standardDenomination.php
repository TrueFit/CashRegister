<?php

class standardDenomination extends denomination
{
    /**
     * Start with largest denominations until you get a small enough denomination to use.
     *
     * @param $amount
     * @return mixed
     */
    public function getDenomination($amount)
    {
        if ( $amount > 20.0 ) {
            $d = new standardTwentyDollarDenomination();
        } else if ( $amount > 10.0 ) {
            $d = new standardTenDollarDenomination();
        } else if ( $amount > 5.0 ) {
            $d = new standardFiveDollarDenomination();
        } else if ( $amount > 1.0 ) {
            $d = new standardDollarDenomination();
        } else if ( $amount > 0.25 ) {
            $d = new standardQuarterDenomination();
        } else if ( $amount > 0.10 ) {
            $d = new standardDimeDenomination();
        } else if ( $amount > 0.05 ) {
            $d = new standardNickelDenomination();
        } else {
            $d = new standardPennyDenomination();
        }

        // Calculate next "chunk" of change
        $d->makeChange($amount);

        // Return amount and text string
        return $this->returnResults($d);

    }


}