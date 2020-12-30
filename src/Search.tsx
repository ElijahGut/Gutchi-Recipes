import React, { ChangeEvent } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faFilter } from '@fortawesome/free-solid-svg-icons'
import './App.css'

interface Props {
    handlePress: any,
    handleChange: any,
    handleClick: any,
    setSelectedMealType: any
    selectedMealType: string,
}

const Search: React.FC<Props> = ({handlePress, handleClick, handleChange, selectedMealType, setSelectedMealType}) => {
    return (
        <div>
            <FontAwesomeIcon className='filterIcon' icon={faFilter}/>
                <select className='filterButton' onChange={(e:ChangeEvent<HTMLSelectElement>) => setSelectedMealType(e.currentTarget.value)} value={selectedMealType}>
                    <option value=''>None</option>
                    <option value='appetiser'>Appetiser</option>
                    <option value='main course'>Main course</option>
                    <option value='dessert'>Dessert</option>
            </select>  
            <input id='search' type='text' className='searchTerm' placeholder='Search for a recipe' onKeyUp={handlePress} onChange={handleChange}></input>
            <button type='button' className='searchButton' onClick={handleClick}>SSS</button><FontAwesomeIcon icon={faSearch}/>
        </div>
    )
}

export default Search;
