package cashier;


import java.util.ArrayList;

import adapter.Calculations;
import adapter.MoneyDenominations;
import money.Money;
import util.FileInput;
import util.FileOutput;

public class Cashier {

	public static void main(String[] args) throws Exception {
		
		String fileName ="cashier.txt";
		FileInput file = new FileInput();
		FileOutput fileOut = new FileOutput();
		Calculations cal = new Calculations();
		Money money;
		ArrayList<Money> data;
		
		data = file.buildMoneyObjects(fileName);
	
		data = cal.breakDownOwed(data);
		for (int i=0; i < data.size();i++){
		fileOut.writeToFile(data.get(i).toString());
		//System.out.print (data.get(i).toString());
		}

	}

}
