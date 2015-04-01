<?php

abstract class denomination
{

    /**
     * Value of denomination: $0.25, $1.00, etc
     * @var float
     */
    protected $unitValue = 0.0;

    /**
     * Number of denomination needed
     * @var int
     */
    protected $quantity = 0;

    /**
     * Total value of this denomination
     * @var int
     */
    protected $total = 0;

    /**
     * The singular text to be used: dollar, quarter, penny, etc.
     * @var string
     */
    protected $singularText = '';

    /**
     * The plural text to be used: dollars, quarters, pennies, etc.
     * @var string
     */
    protected $pluralText = '';

    /**
     * The output string for this denomination - 4 pennies, 1 quarter, etc.
     * @var string
     */
    protected $changeString = '';


    public function makeChange($amount)
    {
        // Amount of change is less than this denomination so exit
        if ( $this->denominationTooBig($amount) ) return false;

        // Calculate quantity of this denomination
        $this->getQuantity($amount);

        // Set the total amount for this denomination
        $this->setTotal();

        return $this;
    }

    /**
     * Verify that the amount of change is greater than this denomination
     *
     * @param $amount
     * @return bool
     */
    protected function denominationTooBig($amount)
    {
        return (bool)($this->unitValue > $amount);
    }

    /**
     * Calculate how many of this denomination cna be used as change
     *
     * @param $amount
     */
    protected function getQuantity($amount)
    {
        $this->quantity = floor($amount / $this->unitValue);
    }

    /**
     * Calculate the total value of this denomination of change
     */
    protected function setTotal()
    {
        $this->total = $this->unitValue * $this->quantity;
    }

    /**
     * Return the total value from this denomination of change
     *
     * @return int
     */
    public function getTotal(){
        return $this->total;
    }

    /**
     * Get the number of this denomination that was used
     *
     * @return int
     */
    public function getSelectedQuantity()
    {
        return $this->quantity;
    }

    /**
     * return the name of this denomination of currency
     * @return string
     */
    public function getText(){
        return $this->singularText;
    }

    /**
     * Return the results of the cash grab
     *
     * @param $d
     * @return mixed
     */
    protected function returnResults($d){
        // Return amount and text string
        $result[ 'quantity' ] = $d->getSelectedQuantity();
        $result[ 'text' ] = $d->getText();
        $result[ 'subTotal' ] = $d->getTotal();
        return $result;
    }

}