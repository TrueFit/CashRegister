<?php

class DenominationFactory
{

    public static function build($type) {
        // assumes the use of an autoloader
        $drawer = $type . 'Denomination';
        if (class_exists($drawer)) {
            return new $drawer();
        }
        else {
            throw new Exception("Invalid drawer type given.");
        }
    }

}