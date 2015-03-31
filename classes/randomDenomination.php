<?php 
class randomDenomination extends denomination{

    /**
     * The maximum number of units (pennies, dimes, dollars) you can take in one swipe of the drawer
     * @var int
     */
    protected $maxUnits = 5;

    /**
     * First calculate how many of this denomination you could use and then take the lesser
     * of the calculated number or the defined maximum quantity - this helps generate a more
     * random amount and kinds of denominations in the change
     *
     * @param $amount
     */
    protected function getQuantity($amount)
    {
        // The max quantity based on remaining amount and this units value
        $quantity = floor($amount / $this->unitValue);

        // Throttle the quantity to a maximum per attempt in the drawer
        $this->quantity = ($quantity > $this->maxUnits)? $this->maxUnits : $quantity;
    }


}