use rand::Rng;

use crate::types::Denomination;

use super::ChangeStrategy;

pub struct RandomChange;

impl ChangeStrategy for RandomChange {
    fn name(&self) -> &'static str {
        "random"
    }

    fn make_change(&self, change_cents: i64, denominations: &[Denomination]) -> Vec<(usize, u32)> {
        let mut remaining = change_cents;
        let mut counts = vec![0u32; denominations.len()];
        let mut rng = rand::thread_rng();

        while remaining > 0 {
            let eligible: Vec<usize> = denominations
                .iter()
                .enumerate()
                .filter(|(_, d)| d.value <= remaining)
                .map(|(i, _)| i)
                .collect();

            if eligible.is_empty() {
                break;
            }

            let pick = eligible[rng.gen_range(0..eligible.len())];
            counts[pick] += 1;
            remaining -= denominations[pick].value;
        }

        counts
            .into_iter()
            .enumerate()
            .filter(|(_, count)| *count > 0)
            .collect()
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

    fn total_from_result(result: &[(usize, u32)], denoms: &[Denomination]) -> i64 {
        result.iter().map(|(i, count)| denoms[*i].value * (*count as i64)).sum()
    }

    #[test]
    fn random_change_sums_correctly() {
        let strategy = RandomChange;
        for amount in [1, 5, 10, 25, 33, 88, 100, 167, 250, 999] {
            let result = strategy.make_change(amount, TEST_DENOMS);
            assert_eq!(
                total_from_result(&result, TEST_DENOMS),
                amount,
                "Failed for amount {}",
                amount
            );
        }
    }

    #[test]
    fn random_change_zero() {
        let strategy = RandomChange;
        let result = strategy.make_change(0, TEST_DENOMS);
        assert!(result.is_empty());
    }
}
