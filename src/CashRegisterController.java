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
		
		getChange(3.00, 2.12);
		getChange(2.00, 1.97);
		getChange(5.00, 3.33);
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
		
		// Divisible by 3
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
