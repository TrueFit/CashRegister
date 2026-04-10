use crate::types::Denomination;

use super::ChangeStrategy;

pub struct MinimalChange;

impl ChangeStrategy for MinimalChange {
    fn name(&self) -> &'static str {
        "minimal"
    }

    fn make_change(&self, change_cents: i64, denominations: &[Denomination]) -> Vec<(usize, u32)> {
        let mut remaining = change_cents;
        let mut result = Vec::new();

        for (i, denom) in denominations.iter().enumerate() {
            if remaining <= 0 {
                break;
            }
            let count = remaining / denom.value;
            if count > 0 {
                result.push((i, count as u32));
                remaining -= count * denom.value;
            }
        }

        result
    }
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
    fn change_88_cents() {
        let strategy = MinimalChange;
        let result = strategy.make_change(88, TEST_DENOMS);
        assert_eq!(result, vec![(1, 3), (2, 1), (4, 3)]);
    }

    #[test]
    fn change_exact_dollar() {
        let strategy = MinimalChange;
        let result = strategy.make_change(100, TEST_DENOMS);
        assert_eq!(result, vec![(0, 1)]);
    }

    #[test]
    fn change_zero() {
        let strategy = MinimalChange;
        let result = strategy.make_change(0, TEST_DENOMS);
        assert!(result.is_empty());
    }

    #[test]
    fn change_one_cent() {
        let strategy = MinimalChange;
        let result = strategy.make_change(1, TEST_DENOMS);
        assert_eq!(result, vec![(4, 1)]);
    }

    #[test]
    fn change_167_cents() {
        let strategy = MinimalChange;
        let result = strategy.make_change(167, TEST_DENOMS);
        assert_eq!(result, vec![(0, 1), (1, 2), (2, 1), (3, 1), (4, 2)]);
    }
}
