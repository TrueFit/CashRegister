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

    /**
     * Determine which change drawer you want to use based on business rules.
     * The two defined here are standard (minimal "pieces" of change) and
     * random (pull stuff from the drawer until you have the right amount)
     *
     */
    public function makeChange()
    {
        if ($this->costDivisibleByThree()){
            $this->changeDrawer = new randomChangeDrawer($this->amount);
        } else {
            $this->changeDrawer = new standardChangeDrawer($this->amount);
        }

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
     * A business rule that determines how change is calculated
     *
     * @return bool
     */
    private function costDivisibleByThree()
    {
        $divByThree = ! (bool) (($this->cost * 100) % 3);
        return $divByThree;
    }

}