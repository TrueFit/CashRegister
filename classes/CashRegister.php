<?php

class CashRegister
{

    /**
     * @var float
     */
    protected $cost;

    /**
     * @var float
     */
    protected $tendered;

    /**
     * @var object
     */
    protected $changeDrawer;


    public function __construct($cost, $tendered)
    {
        $this->cost = $cost;
        $this->tendered = $tendered;

        if ( $this->stillOwesMoney() ) throw new Exception('You did not pay enough money.');

        $this->amount = $tendered - $cost;
    }


    public function makeChange()
    {
        // Determine type based on the business rules.
        $type = ($this->costDivisibleByThree($this->cost))? 'random': 'standard';

        // Create a change drawer
        $this->changeDrawer = DrawerFactory::build($type, $this->amount);

        // Calculate their change
        $this->changeDrawer->calculateChange();

        // Return their change
        return $this->returnChange();
    }

    /**
     * Return the change that was created
     *
     * @return mixed
     */
    public function returnChange()
    {
        return $this->changeDrawer->returnChange();
    }

    /**
     * Ensure enough money was tendered
     *
     * @return bool
     */
    private function stillOwesMoney()
    {
        return ($this->tendered < $this->cost);

    }

    /**
     * Test for divisible by three - it gets a special drawer
     *
     * @return bool
     */
    private function costDivisibleByThree($amount)
    {
        $divByThree = ! (bool) (($amount * 100) % 3);
        return $divByThree;
    }



}