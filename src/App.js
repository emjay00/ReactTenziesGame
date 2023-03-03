import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"
import "./style.css";

export default function App() {

    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [count,setCount]=React.useState(0)
    const [start,setStart]=React.useState(false)
    const[seconds,setSeconds]=React.useState(0)
    const[minutes,setMinutes]=React.useState(0)
    const[hours,setHours]=React.useState(0)
    
    if(seconds>59){
        setSeconds(0)
        setMinutes(minute=>minute+1)
    }
    if(minutes>59){
        setMinutes(0)
        setHours(hour=>hour+1)
    }
    if(hours>23){
        setSeconds(0)
        setMinutes(0)
        setHours(0)
    }

    React.useEffect(()=>{
        let timer=setInterval(()=>{
            if(!start){
                return
            }
            if(tenzies){
                return
            }
            setSeconds(second=>second + 1)
        },1000)

        return ()=> clearInterval(timer)   
    },[start,tenzies])
    
    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
        }
    }, [dice])
    
    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    function rollDice() {
        if(!tenzies) {
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
            setCount(prevCount=>prevCount+1)
        } else {
            setHours(0)
            setMinutes(0)
            setSeconds(0)
            setStart(false)
            setTenzies(false)
            setDice(allNewDice())
            setCount(0)
        }
    }
    
    function holdDice(id) {
        setStart(true)
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))
    
    return (
        <main>
            {tenzies && <Confetti />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. 
            Click each die to freeze it at its current value between rolls.</p>
            <p className="rollcount">Roll Count : {count}</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <button 
                className="roll-dice" 
                onClick={rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>
            {start && <p className="timer">Timer: {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</p>}
        </main>
    )
}