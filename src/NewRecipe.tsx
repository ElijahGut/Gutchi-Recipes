import './App.css'
import ManualRecipe from './ManualRecipe'
import AutomaticRecipe from './AutomaticRecipe'
import React, { useState } from 'react'

const NewRecipe = () => {
    const [showManual, setShowManual] = useState(false)
    const [showAutomatic, setShowAutomatic] = useState(false)

    return (
        <div>
            <h1 style={{fontWeight: 200, paddingBottom: '30px' }}>How would you like to add your recipe?</h1>
            <button className='coolButton' style={{marginRight: '5vh'}} onClick={() => {
                setShowManual(false)
                setShowAutomatic(true)
            }}>Use URL</button>
            <button className='coolButton' onClick={() => {
                setShowManual(true)
                setShowAutomatic(false)
            }}>Manually</button>
            {showManual || showAutomatic ? null : <div>
                <button style={{marginTop: 30}} className='styledButton' onClick={() => {
                        window.location.reload()
                    }}>Back to browse</button>
                    <br/>
                </div>}
            {showManual ? <ManualRecipe/> : null}
            {showAutomatic ? <AutomaticRecipe/> : null}
        </div>
    )
}

export default NewRecipe;