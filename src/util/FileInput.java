package util;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.StringTokenizer;

import money.Money;


public class FileInput {
	
	Money dollar;
	ArrayList<Money> data;
	String line;
	String paidString;
	String owedString;
	StringTokenizer st;
	
	
	// THis function reads the file and store Money objects in an Arraylist.
	public ArrayList<Money> buildMoneyObjects(String filename) throws Exception
	{
		
		try {
			FileReader input = new FileReader(filename);
			BufferedReader in = new BufferedReader(input);
			data = new ArrayList<Money>();
			
			while(true)
			{
			 line = in.readLine();
			 if(line == null) break; 
			 String numbers[] = line.split(",");	
			dollar = new Money(Double.parseDouble(numbers[0]),Double.parseDouble(numbers[1]));
			data.add(dollar);			 			 
		    }
			
			
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (Exception e)
		{
			e.printStackTrace();
		}
		
		
		return data;
	}

}
