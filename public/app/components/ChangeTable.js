import React from 'react';

export default function ChangeTable(props)  {

        return (
            <table className="change-table">
                <thead>
                    <tr>
                        <th></th>
                        <th>Change</th>
                        <th>Dollars</th>
                        <th>Quarters</th>
                        <th>Dimes</th>
                        <th>Nickels</th>
                        <th>Pennies</th>
                        <th>Quirk ID</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        props.change.map((transaction, i) => {
                            return (
                                <tr key={i}>
                                    <td>{i+1}</td>
                                    <td>${transaction.change}</td>
                                    <td>{transaction.denominations.dollars}</td>
                                    <td>{transaction.denominations.quarters}</td>
                                    <td>{transaction.denominations.dimes}</td>
                                    <td>{transaction.denominations.nickles}</td>
                                    <td>{transaction.denominations.pennies}</td>
                                    <td>{transaction.quirkId || "N/A"}</td>
                                </tr>
                            )
                        })
                    }
                    
                </tbody>
        </table>
        )

}