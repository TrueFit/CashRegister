<?php

abstract class changeDrawer
{

    /**
     * Comparison to test for zero cents because of floating point math issues
     */
    const ONE_PENNY = 0.01;

    /**
     * @var float
     */
    protected $amount;

    /**
     * @var float
     */
    protected $amountRemaining;

    /**
     * The string of denominations and quantities to be returned
     *  Example: 1 dollar, 2 quarters, 1 nickel, 1 penny
     *
     * @var string
     */
    protected $currencyString = '';

    /**
     * The list of denominations and quantities to give as change
     * @var array
     */
    public $denominations = [];


    public function __construct($amount)
    {
        $this->amount = $amount;
        $this->amountRemaining = $amount;
    }

    /**
     * Calculate the change to return by denomination for the given
     * input amount.
     *
     * @return bool
     */
    abstract public function calculateChange();

    /**
     * Return the string that indicates the change given.
     *
     * @return string
     */
    public function returnChange()
    {
        return $this->denominations;
    }

    /**
     * Subtract change just obtained from the amount of change remaining
     *
     * @param $result
     */
    protected function calculateAmountRemaining($result){
        $this->amountRemaining -= $result['subTotal'];
    }

    /**
     * Create the array of currencies and quantities returned from the factory
     *
     * @param $result
     */
    protected function updateCurrencyCounts($result)
    {
        $text = $result['text'];

        if (array_key_exists($result['text'], $this->denominations)) {
            $this->denominations[$text] += $result['quantity'];
        } else {
            $this->denominations[$text] = $result['quantity'];
        }
    }
}