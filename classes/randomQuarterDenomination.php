<?php 
class randomQuarterDenomination extends randomDenomination {

    /**
     * Value of denomination: $0.25, $1.00, etc
     * @var float
     */
    protected $unitValue = 0.25;

    /**
     * The singular text to be used: dollar, quarter, penny, etc.
     * @var string
     */
    protected $singularText = 'quarter';

    /**
     * The plural text to be used: dollars, quarters, pennies, etc.
     * @var string
     */
    protected $pluralText = 'quarters';

    /**
     * The maximum number of units (pneeies, dimes, dollars) you can take in one swipe of the drawer
     * @var int
     */
    protected $maxUnits = 5;


}