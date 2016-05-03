package util;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

public class FileOutput {
	
// This function write to a file 	
 public void writeToFile(String cashierTransactions){
	 
	 File Transaction = new File ("transactions.txt");
	 
	
	 
		 try {
			Transaction.createNewFile();
			FileWriter fileWriter = new FileWriter(Transaction.getAbsoluteFile(), true);
			fileWriter.write("\r\n");
			BufferedWriter bufferedWriter = new BufferedWriter(fileWriter);
			bufferedWriter.write(cashierTransactions);
			bufferedWriter.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	 
	 
 
		

	}
	

}
