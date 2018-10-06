package main;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.net.URL;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Random;

public class CashRegisterController {
	
	private static final Map<String, Integer> denomMapBy100 = new LinkedHashMap<>();

    static {
    	denomMapBy100.put("10000", 0);
		denomMapBy100.put("5000", 0);
		denomMapBy100.put("2000", 0);
		denomMapBy100.put("1000", 0);
		denomMapBy100.put("500", 0);
		denomMapBy100.put("100", 0);
		denomMapBy100.put("25", 0);
		denomMapBy100.put("10", 0);
		denomMapBy100.put("5", 0);
		denomMapBy100.put("1", 0);
		
    }

	public static void main(String[] args) {
		
		// Reading file containing owed and cash amounts
		URL url = CashRegisterController.class.getResource("input.txt");
		File file = new File(url.getPath().substring(0, url.getPath().indexOf("bin")) + "src/main/input.txt");

		BufferedReader br;
		String outputSt = "";
		try {
			br = new BufferedReader(new FileReader(file));
			String st;
			
			while ((st = br.readLine()) != null) {
				String[] inputRow = st.split(",");
				Map<String, Integer> changeMap = getChange(Double.valueOf(inputRow[1]), Double.valueOf(inputRow[0]));
				for (Map.Entry<String, Integer> entry: changeMap.entrySet()) {
					if(entry.getValue() != 0) {
						String subChange = entry.getValue() + " "; 
						
						switch(entry.getKey()) {
						case "0.01":
							subChange = subChange + (entry.getValue() == 1? "penny": "pennies"); 
							break;
						case "0.05":
							subChange = subChange + (entry.getValue() == 1? "nickel": "nickels");
							break;
						case "0.1":
							subChange = subChange + (entry.getValue() == 1? "dime": "dimes");
							break;
						case "0.25":
							subChange = subChange + (entry.getValue() == 1? "quarter": "quarters");
							break;
						case "1.0":
							subChange = subChange + (entry.getValue() == 1? "dollar": "dollars");
							break;
						case "5.0":
							subChange = subChange + ("5_dollars");
							break;
						case "10.0":
							subChange = subChange + ("10_dollars");
							break;
						case "20.0":
							subChange = subChange + ("20_dollars");
							break;
						case "50.0":
							subChange = subChange + ("50_dollars");
							break;
						case "100.0":
							subChange = subChange + ("100_dollars");
							break;
						}
						
						outputSt = outputSt + subChange + ", ";
					}
				}
				outputSt = outputSt.substring(0, outputSt.length() - 2) + "\n";
			}
			
		} catch (FileNotFoundException e) {
			System.out.println("Input file does not exist");
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}

		// Writing to file containg the break down of change
		BufferedWriter writer = null;
		try {
			writer = new BufferedWriter(
					new FileWriter(url.getPath().substring(0, url.getPath().indexOf("bin")) + "src/main/output.txt"));
			writer.write(outputSt);

		} catch (IOException e) {
		} finally {
			try {
				if (writer != null)
					writer.close();
			} catch (IOException e) {
				System.out.println("Output file did not close properly.");
			}
		}
		
	}
	
	/**
	 * Returns change break down
	 * @param cash: cash given by customers at cash register
	 * @param owed: amount owed by customer
	 * @return change break down
	 * 		   - change break down is random when owed amount is divisible by 3
	 */
	public static Map<String, Integer> getChange(Double cash, Double owed) {
		
		Double rawInput =  roundTwo(cash - owed); 
		Integer input = (int)Math.round(rawInput * 100);
		
		Map<String, Integer> breakDown = new LinkedHashMap<String, Integer>(denomMapBy100);
		
		Random rand = new Random();
		
		// Owed amount divisible by 3
		if (roundTwo((int)Math.round(owed * 100) % 3.0) == 0D) {
			Double error = 1D;
			
			while (error > 0D) {
				for (Map.Entry<String, Integer> entry: breakDown.entrySet()) {
					
					Integer N = (int) (Math.floor(input / Double.valueOf(entry.getKey())));
					Integer randN = 0;
					if (N == 0) {
						randN = 0;
					} else if (N == 1) {
						randN = 1;
					} else {
						randN = (int) rand.nextInt(N);
					}
					
					breakDown.put(entry.getKey(), entry.getValue() + randN);
					input = input - (int) (Double.valueOf(entry.getKey()) * randN);
				}
				
				error = roundTwo((int)Math.round(rawInput * 100) - getSum(breakDown));
			}
		} else {
			for(Map.Entry<String, Integer> entry: breakDown.entrySet()) {
				Integer N = (int) (Math.floor(input / Double.valueOf(entry.getKey())));
				breakDown.put(entry.getKey(), N);
				input = input - (int) (Double.valueOf(entry.getKey()) * N);
			}
		}
		
		Map<String, Integer> newBreakDown = new LinkedHashMap<String, Integer>();
		for(Map.Entry<String, Integer> entry: breakDown.entrySet()) {
			newBreakDown.put(Double.toString((Integer.valueOf(entry.getKey())/ 100.0)), entry.getValue());
		}
		
		Double sum = getSum(newBreakDown);
		
		// Output
		//System.out.println("Total: " + sum + " error: " + roundTwo(input - sum)); // roundTwo
		System.out.println("Change break-down for: " + sum);
		newBreakDown.forEach((k, v) -> {
			System.out.println("Denom: " + k + " count: " + v);
		});
		System.out.println();
		
		return newBreakDown;
	}
	
	// Check sum
	public static Double getSum(Map<String, Integer> change) {
		Double sum = 0D;
		for(Map.Entry<String, Integer> entry: change.entrySet()) {
			Integer denomBy100 = (int) roundTwo(Double.valueOf(entry.getKey()) * 100.0);
			sum = sum + roundTwo(entry.getValue() * denomBy100);
		}
		
		return sum / 100;
	}
	
	public static double roundTwo(double amt) {
		return Math.round(amt * 100.0) / 100.0;
	}
}
