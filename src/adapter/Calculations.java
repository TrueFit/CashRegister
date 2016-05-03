package adapter;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Random;

import money.Money;

public class Calculations {
	
	Money dollar;
	double change;
	double amountOfDollars;
	double amountOfQuarters;
	double amountOfDimes;
	double amountOfNickels;
	double amountOfCents;
	MoneyDenominations md = new MoneyDenominations();
	ArrayList<Integer> list ;
	
	// This function sets the number of each denominaton in the Money Object
	public ArrayList<Money> breakDownOwed(ArrayList<Money> data) {
		
		for (int i=0; i< data.size();i++){
			
			dollar = data.get(i);
			// Amount cahsier must give back to customer
			change = dollar.getPaid() - dollar.getOwed();
			change = (double) Math.round(change * 100) / 100;
			
			
			if(dollar.getOwed() >= 3 && (int) (Math.round((dollar.getOwed()%3) * 100) / 100) == 0){
				
				list = new ArrayList<Integer>();
		        list.add(1);
		        list.add(2);
		        list.add(3);
		        list.add(4);
		        list.add(5);
		        
		        Random rand = new Random();
		        list.remove(rand.nextInt(list.size()));
		        
		        
		       	for(int j=0; j < list.size(); j++){
		    		
		    		switch(list.get(j)) {
		    		
		    	case 1:  
		    		if(change >= 1){
						
		   			 amountOfDollars =  md.amountOfDollars(change);
		   			 
		   			 data.get(i).setNumberOfDollars((int) amountOfDollars);
		   			 change = change -amountOfDollars;	
		   			 change = (double) Math.round(change * 100) / 100;
		   			} else {
						
						data.get(i).setNumberOfDollars(0);
					}
	            break;
	            case 2: 
	            	if (change >= 0.25){
	    				
	    				amountOfQuarters = md.amountOfQuarters(change);
	    				data.get(i).setNumberOfQuarters((int) (amountOfQuarters/0.25));
	    				change = change - amountOfQuarters;
	    				change = (double) Math.round(change * 100) / 100;
	            	}else {
	    				
	    				data.get(i).setNumberOfQuarters(0);
	    			}
	    			
	            	
	            break;
	            case 3:
	            	
	            	if (change >= 0.1){
	    				
	    				amountOfDimes = md.amountOfDimes(change);
	    				data.get(i).setNumberOfDimes((int) (amountOfDimes/0.1));
	    				change = change - amountOfDimes;
	    				change = (double) Math.round(change * 100) / 100;
	    			} else {
	    				data.get(i).setNumberOfDimes(0);
	    			}
	            	
	            break;
	            case 4:

	                if (change >= 0.05){
					
					amountOfNickels = md.amountOfNickels(change);
					data.get(i).setNumberOfNickels((int) (amountOfNickels/0.05));
					change = change - amountOfNickels;
					change = (double) Math.round(change * 100) / 100;
				} else {
					data.get(i).setNumberOfNickels(0);
				}
	            break;
	            case 5:  
	            	
	            	 if (change >= 0.01){
	     				
	     				amountOfCents = md.amountOfcents(change);
	     				data.get(i).setNumberOfCents((int) (amountOfCents/0.01));
	     				change = change - amountOfNickels;
	     				change = (double) Math.round(change * 100) / 100;
	     			} else {
	     				
	     				data.get(i).setNumberOfCents(0);
	     			}
	            	 
	           	 
	           break;
	            default:
	            break;
		    	}
		    	} 
				
			} 
			
			
				
			 else{
				 
				 if(change >= 1){
						
		   			 amountOfDollars =  md.amountOfDollars(change);
		   			 
		   			 data.get(i).setNumberOfDollars((int) amountOfDollars);
		   			 change = change -amountOfDollars;	
		   			 change = (double) Math.round(change * 100) / 100;
		   			} else {
						
						data.get(i).setNumberOfDollars(0);
					}
				 
			if (change >= 0.25){
				
				amountOfQuarters = md.amountOfQuarters(change);
				data.get(i).setNumberOfQuarters((int) (amountOfQuarters/0.25));
				change = change - amountOfQuarters;
				change = (double) Math.round(change * 100) / 100;
			} else {
				
				data.get(i).setNumberOfQuarters(0);
			}
			
            if (change >= 0.1){
				
				amountOfDimes = md.amountOfDimes(change);
				data.get(i).setNumberOfDimes((int) (amountOfDimes/0.1));
				change = change - amountOfDimes;
				change = (double) Math.round(change * 100) / 100;
			} else {
				data.get(i).setNumberOfDimes(0);
			}
            
                if (change >= 0.05){
				
				amountOfNickels = md.amountOfNickels(change);
				data.get(i).setNumberOfNickels((int) (amountOfNickels/0.05));
				change = change - amountOfNickels;
				change = (double) Math.round(change * 100) / 100;
			} else {
				data.get(i).setNumberOfNickels(0);
			}
				
                
                if (change >= 0.01){
    				
    				amountOfCents = md.amountOfcents(change);
    				data.get(i).setNumberOfCents((int) (amountOfCents/0.01));
    				change = change - amountOfNickels;
    				change = (double) Math.round(change * 100) / 100;
    			} else {
    				
    				data.get(i).setNumberOfCents(0);
    			}
			
		}
		}
		
		return data;
	}

}
