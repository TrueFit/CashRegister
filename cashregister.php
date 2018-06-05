<!DOCTYPE html>
<html>
<head>
<meta content="text/html; charset=UTF-8" http-equiv="content-type"></meta>
<meta NAME="keywords" CONTENT="Cash Register"></meta>
<title>Cash Register</title>
</head>
<body>

<? 




/* This function is to pop up window displaying error msg */
function DisplayError( $errmsg )
{
	print '<script language="javascript" type="text/javascript">';
	print "<!-- \n";							
	print 'alert("'.$errmsg.'")';
	print "\n// -->\n";
	print '</script>';
}


function Bill_type()
{
    $aBills = array( array( "amount"=> 100, "type" => "Hundred", "count" => 0 ),
                     array( "amount"=> 50, "type" => "Fifty", "count" => 0 ),
                     array( "amount"=> 20, "type" => "Twenty", "count" => 0 ),
                     array( "amount"=> 10, "type" => "Ten", "count" => 0 ),
                     array( "amount"=> 5, "type" => "Five", "count" => 0 ),
                     array( "amount"=> 1, "type" => "One", "count" => 0 )); 

    return $aBills;
}


function Coin_type()
{
   $aCoins = array(array( "amount"=> 25, "type" => "Quarter", "count" => 0 ),
                     array( "amount"=> 10, "type" => "Dime", "count" => 0 ),
                     array( "amount"=> 5, "type" => "Nickel", "count" => 0 ),
		     array( "amount"=> 1, "type" => "Penny", "count" => 0 )); 
   return $aCoins;
}


/* parse line into amount owed & amount paid separated by ',' */
function get_amounts( $line, &$owed, &$paid ) 
{
      list($owed, $paid) = split('[,]', $line);
}


// This function dispenses bill/coin close to but less than or equal to the change amount
// adjust the balance after given it  
function dispense_change( &$chgPart, &$aMoney)
{
       for ( $i=0; $i < count($aMoney); ++$i )
       {
            if ( $chgPart >= $aMoney[$i]["amount"] )
            {
                   $aMoney[$i]["count"] += 1;
                   $chgPart -= $aMoney[$i]["amount"]; 
                   break;
            }                
       }
}




// This function radomly dispenses the bills / coins until break even
// mouney type has counter increased by 1 as it is given out
// Reduce the amount balance for change
function random_denomination( &$chgPart, &$aMoney)
{
   $idx = rand(0, count($aMoney)-1);  /* Random Index for Amount (both for bill and coin) */    
   $chgAmt = $aMoney[$idx]["amount"]; /* Get Random Amount for change */ 
        // increase count by 1 for Amount given out 
   if ( $chgAmt <= $chgPart )
   {
        $aMoney[$idx]["count"] += 1;  
        $chgPart -= $chgAmt; 
   }
   else
   {
       dispense_change( $chgPart, $aMoney);  
   }
}



// if $random = true, This function radomly dispense the bills / coins 
// if $random = false, it dispenses change in the order from big to small;
// mouney type has counter increased by 1 as it is given out
function make_change($chgPart, &$aMoney, $random )
{
    // Keep giving change until $chgPart = 0 
    while ( $chgPart > 0 )
    {
        if ( $random  )
        { 
           random_denomination( $chgPart, $aMoney);
        }
        else
        {
            dispense_change( $chgPart, $aMoney);
        }
    }
}




/* form output string for change */
function depict_change($aMoney)
{
     $chgStr = "";

     $first = true;
     for ($i=0; $i < count($aMoney); ++$i )
     {
         if ( $aMoney[$i]["count"] > 0 )
         {
             $type = rtrim(ltrim($aMoney[$i]["type"]));

              if ( $aMoney[$i]["count"] > 1 )  // change singular to plural if > 1
              {
                 if ( $type == "Fifty" )
                 {
                    $type = "Fifties";
                 } 
                 else if ( $type == "Twenty" )
                 {
                    $type = "Twenties";
                 } 
                 else if ( $type == "Penny" )
                 {
                    $type = "Pennies";
                 } 
                 else 
                 {
                    $type .= "s";
                 }               
              }


             if ( !$first )
             {
                $chgStr .= ", ";
             }

             $chgStr .= $aMoney[$i]["count"]." ".$type;
             $first = false;
         }
     }
    return $chgStr;
}



/**************************************************************************
*   Dispense change in dollar bills from 1-100 (if applied), then         *
*   Dispense chabge in coins  from quarter to 1 cent                      *                                                          *
***************************************************************************/ 
function change_in_bills($billPart, $random ) 
{
    $aBills = bill_type();
    
    make_change($billPart, $aBills, $random );
   // Form output string for numbers of bills given for change
    return depict_change($aBills);
}


/**************************************************************************
*   Dispense chabge in coins  from quarter to 1 cent                      *                                                          *
***************************************************************************/ 
function change_in_coins($coinPart, $random ) 
{
    $aCoins = coin_type();
     
    make_change($coinPart, $aCoins, $random );
   // Form output string for numbers of coins given for change
    return depict_change($aCoins);
}



/**************************************************************************
*   Give change in bills & coins seperately                               *
***************************************************************************/ 
function process_changing($chgAmt, $random ) 
{
    
    $billPart = intval($chgAmt);
    $bills = change_in_bills($billPart, $random);

    $coinPart = intval(100 * ($chgAmt - $billPart));
    $coins .= change_in_coins($coinPart, $random); 

    $chgStr = "";
    if ( $bills )
    {
       $chgStr .= " Dollar Bills: ".$bills; 
       if ( $coins )
       {
           $chgStr .= ", ";
       }
    }

    if ( $coins )
    {
           $chgStr .= "Coins: ".$coins;
    }
    return $chgStr;
}


/*************************************************************************/
/* This function reads an input file and gets owing amout, paid amount on */
/* each line. then make change from big to small bills and from quater to */
/* penny. if the amount is divisible to 3 then randomly gives change in   */
/* anything                                                               */
/**************************************************************************/
function cashier( $datfile )
{

    $inData = file_get_contents($datfile);
    $outHdl = fopen("/tmp/output.txt", "w" ); // Creating an output file on the server assuming subfolder tmp was created with attribute 777
    if ( !$outHdl ) 
    {
       DisplayError("Error: open output file failed !");
       exit;
    } 


    $lineNo = 0;

    // Process data line by line until EOF
    // Output on a file & also display on screen
    // Popup Alert Errors if any
    while ( $inData ) 
    {
    	$nPos = strpos($inData, PHP_EOL );
    	if ( $nPos )
    	{ 
       	     $line = substr($inData,0, $nPos);
    	}
    	else
    	{
       	     $line = $inData;
             $nPos = strlen($line);
    	}

        list($owed, $paid) = explode(',', $line); // Parsing line into amount owed and amount paid
        $owed = ltrim(rtrim($owed));  // trim leading and trailing spaces
        $paid = ltrim(rtrim($paid));
        if ( is_numeric($owed) && is_numeric($paid) )  // Validate amounts
        { 
                $outline = "\n".++$lineNo." - [Owned:".$owed.", Paid:".$paid."]";
                fputs( $outHdl,  $outline);

            	$chgAmt = $paid - $owed;
                if ( $chgAmt == 0 )
                {
                     $chgStr = "=> Break even, no change !";
                } 
                else if ( $chgAmt < 0 ) 
                {
                     $chgStr = "Error: Underpaid, more payment is needed"; 
                }
                else if ( (100 * $owed ) % 3 == 0)
            	{
               	     $chgStr = process_changing( $chgAmt, true );
                }
                else
                {
             	     $chgStr = process_changing( $chgAmt, false );
                }

                if ( !( (100*$chgAmt) % 100) ) // if the amount is only bills add .00 at the end for display
                     $chgAmt = intval($chgAmt).".00"; 
                
                $outline .= "=[Change Amount: ".$chgAmt."] => ".$chgStr;

                print $outline."<br>";

	        fputs( $outHdl, $outline );
        }
        else
        {
               DisplayError("Invalid Amount, either owing amount or pay amount is not numeric on line=".$lineNo );
        }          

        $inData = ltrim(rtrim(substr($inData, $nPos)));
    }
  
    fclose($outHdl);
}



?>
<form name="myForm" enctype="multipart/form-data" action="<?=$_SERVER['PHP_SELF']?>" method="post">
<table width="60%" align="center" valign="top" border="0" cellspacing="0" cellpadding="0" bgcolor="Fdedab">
<tr>
<td align="center" valign="top" border="0" >
 <table>
 <tr>
   <td colspan="2" align="center"><h1>CASH REGISTER</h1></td>
 </tr>
 <tr><td>Select Filename:</td><td><input  type="file" name="input" /></td></tr>
 <tr><td>Then press button: </td><td align="left"><input type="submit" name="submit" value="Process Payment" /></td></tr>
 </table>
</td>
</tr>
<tr>
<td align="left"><br><br>
<? 
   if(isset($_POST['submit'])) 
   {
  //      print 'Submit....Input File'. $_FILES["input"]["name"];
        if ( $_FILES["input"]["tmp_name"] )
        {
            /* Upload local input file */  
            cashier( $_FILES['input']['tmp_name']);
        }
   }
?>
</td></tr>
 <tr>
   <td colspan="2" align="center"><h3><br><br>Developer: Huan To</h3></td>
 </tr>  
</table>
</form>
</body>
</html>



