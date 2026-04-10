use crate::types::Denomination;

pub fn format_denominations(result: &[(usize, u32)], denominations: &[Denomination]) -> String {
    result
        .iter()
        .filter(|(_, count)| *count > 0)
        .map(|(i, count)| {
            let denom = &denominations[*i];
            let name = if *count == 1 {
                denom.singular
            } else {
                denom.plural
            };
            format!("{} {}", count, name)
        })
        .collect::<Vec<_>>()
        .join(",")
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::types::Denomination;

    const TEST_DENOMS: &[Denomination] = &[
        Denomination { value: 100, singular: "dollar", plural: "dollars" },
        Denomination { value: 25, singular: "quarter", plural: "quarters" },
        Denomination { value: 10, singular: "dime", plural: "dimes" },
        Denomination { value: 5, singular: "nickel", plural: "nickels" },
        Denomination { value: 1, singular: "penny", plural: "pennies" },
    ];

    #[test]
    fn format_multiple_denominations() {
        let result = vec![(1, 3), (2, 1), (4, 3)];
        assert_eq!(format_denominations(&result, TEST_DENOMS), "3 quarters,1 dime,3 pennies");
    }

    #[test]
    fn format_single_denomination() {
        let result = vec![(0, 1)];
        assert_eq!(format_denominations(&result, TEST_DENOMS), "1 dollar");
    }

    #[test]
    fn format_plural_vs_singular() {
        let result = vec![(0, 2)];
        assert_eq!(format_denominations(&result, TEST_DENOMS), "2 dollars");
    }

    #[test]
    fn format_empty() {
        let result: Vec<(usize, u32)> = vec![];
        assert_eq!(format_denominations(&result, TEST_DENOMS), "");
    }

    #[test]
    fn format_skips_zero_count() {
        let result = vec![(0, 0), (1, 3)];
        assert_eq!(format_denominations(&result, TEST_DENOMS), "3 quarters");
    }
}
