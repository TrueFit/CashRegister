<?php 

class printChange {

    /**
     * Define the order to print the change.  This will print from high to low.
     *
     * @var array
     */
    public $printOrder = ['twenty', 'ten', 'five', 'dollar', 'quarter', 'dime', 'nickel', 'penny'];


    /**
     * Display the input parameters for ease of checking the work.
     * @param $cost
     * @param $tendered
     */
    public function printInput($cost, $tendered){
        echo "\n\nCost: " . $cost . ' Tendered: ' . $tendered . "\n";
    }


    /**
     * Print the results to the screen shown in order what change was given
     *
     * @param $results
     */
    public function printResults($results){

        $output = '';
        foreach ($this->printOrder as $key){

            if (array_key_exists($key, $results) && $results[$key] > 0) {
                $output .= $results[$key] . ' ' . self::pluralize($results[$key], $key) . ', ';
            }
        }

        // If there is no change due then change the message
        if (strlen($output) == 0 ) {$output = 'Exact Change provided.';}

        echo rtrim($output, ", \t\n\r\0\x0B");
    }

    /**
     * Pluralize the denomination text as appropriate
     * @param      $quantity
     * @param      $singular
     * @param null $plural
     * @return null|string
     */
    public static function pluralize($quantity, $singular, $plural=null) {
        if($quantity==1 || empty($singular)) return $singular;
        if($plural!==null) return $plural;

        $last_letter = strtolower($singular[strlen($singular)-1]);
        switch($last_letter) {
            case 'y':
                return substr($singular,0,-1).'ies';
            case 's':
                return $singular.'es';
            default:
                return $singular.'s';
        }
    }

}