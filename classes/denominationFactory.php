<?php

class denominationFactory
{


    /**
     * Return the results of the cash grab
     *
     * @param $d
     * @return mixed
     */
   protected function returnResults($d){
       // Return amount and text string
       $result[ 'quantity' ] = $d->getSelectedQuantity();
       $result[ 'text' ] = $d->getText();
       $result[ 'subTotal' ] = $d->getTotal();
       return $result;
   }


}