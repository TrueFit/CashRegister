<?php 
class randomDimeDenomination extends randomDenomination {

    /**
     * Value of denomination: $0.25, $1.00, etc
     * @var float
     */
    protected $unitValue = 0.10;

    /**
     * The singular text to be used: dollar, quarter, penny, etc.
     * @var string
     */
    protected $singularText = 'dime';

    /**
     * The plural text to be used: dollars, quarters, pennies, etc.
     * @var string
     */
    protected $pluralText = 'dimes';

    /**
     * The maximum number of units (pennies, dimes, dollars) you can take in one swipe of the drawer
     * @var int
     */
    protected $maxUnits = 7;


}