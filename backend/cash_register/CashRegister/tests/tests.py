import unittest
from cashRegister.utils.CashRegister import CashRegister


class test_cashregister(unittest.TestCase):
    """
    Test CashRegister basic functionality
    """
    cashRegister = CashRegister()

    # test most efficient change
    # test multiple rows
    # test json export
    # test json import

    def test_0_random_change(self):
        """
        When ammount do is divisible by 3, change should be random
        """
        transactions = [[3.33, 5.00]]
        cashRegister = CashRegister(
            import_method="json",
            export_method="json",
            json_transactions=transactions,
        )
        cashRegister.createChange()
        change_due1 = cashRegister.exportChange()
        cashRegister.change_due_log = []
        cashRegister.createChange()
        cashRegister.change_due_log = []
        cashRegister.createChange()
        change_due2 = cashRegister.exportChange()
        self.assertNotEqual(change_due1, change_due2)

    def test_insufficient_fudns(self):
        """
        Test case amount tendered is less than ammount owed
        """
        transactions = [[20, 5.00]]
        cashRegister = CashRegister(
            import_method="json",
            export_method="json",
            json_transactions=transactions,
        )
        cashRegister.createChange()
        change_due = cashRegister.exportChange()
        self.assertEqual(change_due[0][0],
                         "Insufficient Funds - Please pay 15.0")


if __name__ == '__main__':
    # begin the unittest.main()
    unittest.main()