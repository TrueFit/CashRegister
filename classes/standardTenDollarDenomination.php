<?php 
class standardTenDollarDenomination extends standardDenomination {

    /**
     * Value of denomination: $0.25, $1.00, etc
     * @var float
     */
    protected $unitValue = 10.0;

    /**
     * The singular text to be used: dollar, quarter, penny, etc.
     * @var string
     */
    protected $singularText = 'ten';

    /**
     * The plural text to be used: dollars, quarters, pennies, etc.
     * @var string
     */
    protected $pluralText = 'tens';

}