<?php 
class randomFiveDollarDenomination extends randomDenomination {

    /**
     * Value of denomination: $0.25, $1.00, etc
     * @var float
     */
    protected $unitValue = 5.0;

    /**
     * The singular text to be used: dollar, quarter, penny, etc.
     * @var string
     */
    protected $singularText = 'five';

    /**
     * The plural text to be used: dollars, quarters, pennies, etc.
     * @var string
     */
    protected $pluralText = 'fives';

    /**
     * The maximum number of units (pennies, dimes, dollars) you can take in one swipe of the drawer
     * @var int
     */
    protected $maxUnits = 6;


}