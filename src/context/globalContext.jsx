import React, { useContext, useState } from "react"
import axios from 'axios'


const BASE_URL = "https://fin-tech-sever.onrender.com/apiv1/";


const GlobalContext = React.createContext()

export const GlobalProvider = ({ children }) => {

    const [incomes, setIncomes] = useState([])
    const [expenses, setExpenses] = useState([])
    const [error, setError] = useState(null)

    //calculate incomes
    const addIncome = async (income) => {
        // Ensure amount is a number before sending to backend
        const payload = { ...income, amount: Number(income.amount) };
        if (!payload.amount || isNaN(payload.amount) || payload.amount <= 0) {
            setError('Enter correct amount');
            return;
        }

        try {
            await axios.post(`${BASE_URL}add-incomes`, payload);
            getIncomes();
        } catch (err) {
            setError(err.response?.data?.message || 'Error adding income');
        }
    }

    const getIncomes = async () => {
        const response = await axios.get(`${BASE_URL}get-incomes`)
        setIncomes(response.data)
        console.log(response.data)
    }

    const deleteIncome = async (id) => {
        const res = await axios.delete(`${BASE_URL}delete-incomes/${id}`)
        getIncomes()
    }

    const totalIncome = () => {
        let totalIncome = 0;
        incomes.forEach((income) => {
            totalIncome = totalIncome + income.amount
        })

        return totalIncome;
    }


    //calculate expenses
    const addExpense = async (expense) => {
        // Ensure amount is a number before sending to backend
        const payload = { ...expense, amount: Number(expense.amount) };
        if (!payload.amount || isNaN(payload.amount) || payload.amount <= 0) {
            setError('Enter correct amount');
            return;
        }

        try {
            await axios.post(`${BASE_URL}add-expence`, payload);
            getExpenses(); // refresh list immediately
        } catch (err) {
            setError(err.response?.data?.message || 'Error adding expense');
        }
    };

    const getExpenses = async () => {
        const response = await axios.get(`${BASE_URL}get-expence`)
        setExpenses(response.data)
        console.log(response.data)
    }

    const deleteExpense = async (id) => {
        const res = await axios.delete(`${BASE_URL}delete-expence/${id}`)
        getExpenses()
    }

    const totalExpenses = () => {
        let totalIncome = 0;
        expenses.forEach((expense) => {
            totalIncome += expense.amount;
        });


        return totalIncome;
    }


    const totalBalance = () => {
        return totalIncome() - totalExpenses()
    }

    const transactionHistory = () => {
        const history = [...incomes, ...expenses]
        history.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt)
        })

        return history.slice(0, 3)
    }


    return (
        <GlobalContext.Provider value={{
            addIncome,
            getIncomes,
            incomes,
            deleteIncome,
            expenses,
            totalIncome,
            addExpense,
            getExpenses,
            deleteExpense,
            totalExpenses,
            totalBalance,
            transactionHistory,
            error,
            setError
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () => useContext(GlobalContext);