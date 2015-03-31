<?php 
class standardQuarterDenomination extends standardDenomination {

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

}