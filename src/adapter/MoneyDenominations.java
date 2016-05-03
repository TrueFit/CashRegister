package adapter;

public class MoneyDenominations {
	
	int numberOfQuarters;
	int numberOfDimes;
	int numberOfCents;
	int numberOfnickels;
	double amountOfDollars;
	double amountOfQuarters;
	double amountOfDimes;
	double amountOfNickels;
	double amountOfCents;
	
	public double amountOfDollars(double owed){
	
		
			
		amountOfDollars = (int) owed;
		
		return amountOfDollars;
			
	}
	
	public double amountOfQuarters (double owed){
		
		numberOfQuarters = (int) (owed/0.25);
		amountOfQuarters = numberOfQuarters * 0.25;
		
		return amountOfQuarters;
				
	}

	public double amountOfDimes(double owed){
		
		numberOfDimes = (int) (owed/0.1);
		amountOfDimes = numberOfDimes * 0.1;
		
		return amountOfDimes;
		
	}
	
	public double amountOfNickels(double owed){
		
		numberOfnickels = (int) (owed/0.05);
		amountOfDimes = numberOfnickels * 0.05;
		
		return amountOfDimes;
		
	}
   public double amountOfcents(double owed)
   {
	   numberOfCents = (int) (owed/0.01);
	   amountOfCents = numberOfCents * 0.01;
	   
	   return amountOfCents;
   }
}
