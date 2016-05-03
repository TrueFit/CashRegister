package money;

import java.util.ArrayList;
import java.util.Collections;

public class Money {
	double owed;
	double paid;
	int numberOfQuarters;
	int numberOfNickels;
	int numberOfDimes;
	int numberOfCents;
	

	// Different Setters and Getters
	public int getNumberOfQuarters() {
		return numberOfQuarters;
	}


	public void setNumberOfQuarters(int numberOfQuarters) {
		this.numberOfQuarters = numberOfQuarters;
	}


	public int getNumberOfNickels() {
		return numberOfNickels;
	}


	public void setNumberOfNickels(int numberOfNickels) {
		this.numberOfNickels = numberOfNickels;
	}


	public int getNumberOfDimes() {
		return numberOfDimes;
	}


	public void setNumberOfDimes(int numberOfDimes) {
		this.numberOfDimes = numberOfDimes;
	}


	public int getNumberOfCents() {
		return numberOfCents;
	}


	public void setNumberOfCents(int numberOfCents) {
		this.numberOfCents = numberOfCents;
	}


	public int getNumberOfDollars() {
		return numberOfDollars;
	}


	public void setNumberOfDollars(int numberOfDollars) {
		this.numberOfDollars = numberOfDollars;
	}

	int numberOfDollars;
	
	

	public Money(double owed, double paid)
	{
		this.owed = owed;
		this.paid = paid;
	}
	

	public double getOwed()
	{
		return owed;
	}
	public double getPaid()
	{
		return paid;
	}
    

	// This function writes turn the object into a string in order to print
	public String toString(){
		
		StringBuilder sb = new StringBuilder();
	
		sb.append("\n");
		if(getNumberOfDollars() > 0){
			
		sb.append(getNumberOfDollars() +"  dollars, ");
		}
		
		if(getNumberOfQuarters() > 0){
			
			sb.append(getNumberOfQuarters() +"  quarters, ");
			}
        if(getNumberOfDimes() > 0){
			
			sb.append(getNumberOfDimes() +"  dimes, ");
			}
        if(getNumberOfNickels()> 0){
			
			sb.append(getNumberOfNickels() +"  nickels, ");
			}
        if(getNumberOfCents() > 0){
			
			sb.append(getNumberOfCents() +"  pennies ");
			}
        if((getPaid() - getOwed() == 0) || getOwed() > getPaid()){
        	sb.append("No Change required,");
        }
		//}
        
        return sb.toString();
	}
	

}
