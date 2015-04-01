<?php 
class DrawerFactory {

    /**
     * Get the correct change drawer based on business rules
     *
     * @param $amount
     * @return mixed
     * @throws \Exception
     */
    public static function build($type, $amount) {


        $drawer = $type . 'ChangeDrawer';
        if (class_exists($drawer)) {
            return new $drawer($amount);
        }
        else {
            throw new Exception("Invalid drawer type given.");
        }
    }


}